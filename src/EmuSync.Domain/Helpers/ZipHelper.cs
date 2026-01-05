using System.IO.Compression;

namespace EmuSync.Domain.Helpers;

public static class ZipHelper
{
    /// <summary>
    /// Creates a zip of all files and folders found at <paramref name="folderPath"/>
    /// and writes it to <paramref name="zipPath"/>
    /// </summary>
    public static void CreateZipFromFolder(
        string folderPath,
        string zipPath,
        Action<double>? onProgressChange = null
    )
    {
        var files = Directory.GetFiles(folderPath, "*", SearchOption.AllDirectories);
        int totalFiles = files.Length;
        int processedFiles = 0;

        Directory.CreateDirectory(Path.GetDirectoryName(zipPath)!);

        using var fileStream = new FileStream(
            zipPath,
            FileMode.Create,
            FileAccess.Write,
            FileShare.None
        );

        using var archive = new ZipArchive(fileStream, ZipArchiveMode.Create);

        foreach (var filePath in files)
        {
            var relativePath = Path.GetRelativePath(folderPath, filePath);
            var entry = archive.CreateEntry(relativePath, CompressionLevel.Optimal);

            using var entryStream = entry.Open();
            using var input = File.OpenRead(filePath);
            input.CopyTo(entryStream);

            processedFiles++;
            onProgressChange?.Invoke(
                totalFiles == 0 ? 100 : (processedFiles / (double)totalFiles) * 100
            );
        }
    }


    /// <summary>
    /// Extracts the in-memory zip to <paramref name="outputDirectory"/>
    /// </summary>
    /// <param name="zipStream"></param>
    /// <param name="outputDirectory"></param>
    /// <param name="forceLastWriteTime"></param>
    /// <param name="onProgressChange"></param>
    public static void ExtractToDirectory(
        Stream zipStream,
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