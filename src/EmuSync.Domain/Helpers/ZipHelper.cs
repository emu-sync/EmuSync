using System.IO.Compression;

namespace EmuSync.Domain.Helpers;

public static class ZipHelper
{
    /// <summary>
    /// Creates an in memory zip of all files and folders found at <paramref name="folderPath"/>
    /// </summary>
    /// <param name="folderPath"></param>
    /// <returns></returns>
    public static MemoryStream CreateZipFromFolder(string folderPath)

    {
        var memoryStream = new MemoryStream();

        using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, leaveOpen: true))
        {
            foreach (var filePath in Directory.GetFiles(folderPath, "*", SearchOption.AllDirectories))
            {
                var relativePath = Path.GetRelativePath(folderPath, filePath);
                var entry = archive.CreateEntry(relativePath, CompressionLevel.Optimal);

                using var entryStream = entry.Open();

                using var fileStream = File.Open(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
                fileStream.CopyTo(entryStream);
            }
        }

        memoryStream.Position = 0; // reset for reading
        return memoryStream;
    }

    /// <summary>
    /// Extracts the in-memory zip to <paramref name="outputDirectory"/>
    /// </summary>
    /// <param name="zipStream"></param>
    /// <param name="outputDirectory"></param>
    /// <param name="forceLastWriteTime"></param>
    public static void ExtractToDirectory(MemoryStream zipStream, string outputDirectory, DateTime? forceLastWriteTime = null)
    {
        zipStream.Position = 0; //ensure start
        using var archive = new ZipArchive(zipStream, ZipArchiveMode.Read, leaveOpen: false);

        if (!Directory.Exists(outputDirectory))
        {
            Directory.CreateDirectory(outputDirectory);
        }

        foreach (var entry in archive.Entries)
        {
            var filePath = Path.Combine(outputDirectory, entry.FullName);

            //create directories if needed
            var directory = Path.GetDirectoryName(filePath);

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
        }

        //stop false positives and ensure we keep the last write time on the local directory the same
        if (forceLastWriteTime.HasValue)
        {
            Directory.SetLastWriteTimeUtc(outputDirectory, forceLastWriteTime.Value);
        }
    }
}