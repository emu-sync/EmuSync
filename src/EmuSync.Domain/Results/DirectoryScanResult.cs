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
    /// <summary>
    /// The latest write time to use for sync decisions. Directory write times are deliberately
    /// excluded - they bump whenever any file inside changes, including ignored ones, so they
    /// cannot be trusted to reflect a non-ignored content change.
    /// </summary>
    public DateTime? LatestWriteTimeUtc => LatestFileWriteTimeUtc;
}