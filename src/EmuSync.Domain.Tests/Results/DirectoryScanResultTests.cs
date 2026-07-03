using EmuSync.Domain.Results;

namespace EmuSync.Domain.Tests.Results;

public class DirectoryScanResultTests
{
    [Fact]
    public void LatestWriteTimeUtc_Returns_Null_When_Both_Null()
    {
        var r = new DirectoryScanResult();
        Assert.Null(r.LatestWriteTimeUtc);
    }

    [Fact]
    public void LatestWriteTimeUtc_Returns_Latest_File_When_File_Newer()
    {
        var r = new DirectoryScanResult
        {
            LatestFileWriteTimeUtc = DateTime.UtcNow.AddHours(1),
            LatestDirectoryWriteTimeUtc = DateTime.UtcNow
        };

        Assert.Equal(r.LatestFileWriteTimeUtc, r.LatestWriteTimeUtc);
    }

    [Fact]
    public void LatestWriteTimeUtc_IgnoresDirectoryTime_EvenWhenNewer()
    {
        //directory mtimes can bump from ignored-file churn (e.g. atomic saves) and must not
        //drive the sync decision - only non-ignored file mtimes are trustworthy here
        var r = new DirectoryScanResult
        {
            LatestFileWriteTimeUtc = DateTime.UtcNow,
            LatestDirectoryWriteTimeUtc = DateTime.UtcNow.AddHours(2)
        };

        Assert.Equal(r.LatestFileWriteTimeUtc, r.LatestWriteTimeUtc);
    }

    [Fact]
    public void LatestWriteTimeUtc_ReturnsNull_WhenOnlyDirectoryTimeSet()
    {
        var r = new DirectoryScanResult
        {
            LatestFileWriteTimeUtc = null,
            LatestDirectoryWriteTimeUtc = DateTime.UtcNow
        };

        Assert.Null(r.LatestWriteTimeUtc);
    }
}
