namespace EmuSync.Domain.Results;

public record DirectoryScanResult
{
    public bool DirectoryExists { get; set; }
    public bool DirectoryIsSet { get; set; }
    public int FileCount { get; set; }
    public int DirectoryCount { get; set; }
    public long StorageBytes { get; set; }
    public DateTime? LatestFileWriteTimeUtc { get; set; }
    public DateTime? LatestDirectoryWriteTimeUtc { get; set; }
    public DateTime? LatestWriteTimeUtc
    {
        get
        {
            if (!LatestFileWriteTimeUtc.HasValue && !LatestDirectoryWriteTimeUtc.HasValue) return null;

            DateTime latestFile = LatestFileWriteTimeUtc ?? DateTime.MinValue;
            DateTime latestDirectory = LatestDirectoryWriteTimeUtc ?? DateTime.MinValue;

            if (latestFile > latestDirectory)
            {
                return LatestFileWriteTimeUtc;
            }
            else
            {
                return latestDirectory;
            }
        }
    }
}