using System.IO.Compression;

namespace EmuSync.Domain.Helpers;

public static class ZipHelper
{
    /// <summary>
    /// Creates an in memory zip of all files and folders found at <paramref name="folderPath"/>
    /// </summary>
    /// <param name="folderPath"></param>
    /// <returns></returns>
    public static MemoryStream CreateZipFromFolder(
        string folderPath,
        Action<double>? onProgressChange = null
    )
    {
        var memoryStream = new MemoryStream();

        var files = Directory.GetFiles(folderPath, "*", SearchOption.AllDirectories);
        int totalFiles = files.Length;
        int processedFiles = 0;

        using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, leaveOpen: true))
        {
            foreach (var filePath in files)
            {
                var relativePath = Path.GetRelativePath(folderPath, filePath);
                var entry = archive.CreateEntry(relativePath, CompressionLevel.Optimal);

                using var entryStream = entry.Open();

                using var fileStream = File.Open(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
                fileStream.CopyTo(entryStream);


                processedFiles++;

                onProgressChange?.Invoke(
                    totalFiles == 0 ? 100 : (processedFiles / (double)totalFiles) * 100
                );
            }
        }

        memoryStream.Position = 0; //reset for reading
        return memoryStream;
    }

    /// <summary>
    /// Extracts the in-memory zip to <paramref name="outputDirectory"/>
    /// </summary>
    /// <param name="zipStream"></param>
    /// <param name="outputDirectory"></param>
    /// <param name="forceLastWriteTime"></param>
    public static void ExtractToDirectory(
        MemoryStream zipStream,
        string outputDirectory,
        DateTime? forceLastWriteTime = null,
        Action<double>? onProgressChange = null
    )
    {
        string? cleanOutputDirectory = GetOsSafePath(outputDirectory);
        if (string.IsNullOrEmpty(cleanOutputDirectory)) return;

        zipStream.Position = 0; //ensure start
        using var archive = new ZipArchive(zipStream, ZipArchiveMode.Read, leaveOpen: false);

        if (Directory.Exists(cleanOutputDirectory))
        {
            Directory.Delete(cleanOutputDirectory, recursive: true);
        }

        Directory.CreateDirectory(cleanOutputDirectory);

        var entries = archive.Entries.Where(e => !string.IsNullOrEmpty(e.Name)).ToList();
        int totalEntries = entries.Count;
        int processedEntries = 0;

        foreach (var entry in entries)
        {
            var filePath = GetOsSafePath(
                Path.Combine(cleanOutputDirectory, entry.FullName)
            )!;

            //create directories if needed
            var directory = GetOsSafePath(
                Path.GetDirectoryName(filePath)
            );

            if (!string.IsNullOrEmpty(directory))
            {
                Directory.CreateDirectory(directory);

                if (forceLastWriteTime.HasValue)
                {
                    Directory.SetLastWriteTimeUtc(directory, forceLastWriteTime.Value);
                }
            }

            if (string.IsNullOrEmpty(entry.Name))
            {
                continue;
            }

            entry.ExtractToFile(filePath, overwrite: true);

            if (forceLastWriteTime.HasValue)
            {
                File.SetLastWriteTimeUtc(filePath, forceLastWriteTime.Value);
            }

            processedEntries++;
            onProgressChange?.Invoke((processedEntries / (double)totalEntries) * 100);
        }

        //stop false positives and ensure we keep the last write time on the local directory the same
        if (forceLastWriteTime.HasValue)
        {
            foreach (var dir in Directory.GetDirectories(cleanOutputDirectory, "*", SearchOption.AllDirectories))
            {
                Directory.SetLastWriteTimeUtc(dir, forceLastWriteTime.Value);
            }

            // finally, set the output directory itself
            Directory.SetLastWriteTimeUtc(cleanOutputDirectory, forceLastWriteTime.Value);
        }
    }

    private static string? GetOsSafePath(string? path)
    {
        if (string.IsNullOrEmpty(path)) return path;

        bool isWindows = PlatformHelper.GetOsPlatform() == Enums.OsPlatform.Windows;

        if (isWindows)
        {
            return path.Replace("/", "\\");
        }

        return path.Replace("\\", "/");
    }
}