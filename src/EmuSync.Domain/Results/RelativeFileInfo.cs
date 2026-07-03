namespace EmuSync.Domain.Results;

public record RelativeFileInfo
{
    public string RelativePath { get; set; }
    public long SizeBytes { get; set; }
    public DateTime LastWriteTimeUtc { get; set; }
}
