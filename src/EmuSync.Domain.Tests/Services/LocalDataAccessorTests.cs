using EmuSync.Domain.Helpers;
using EmuSync.Domain.Services;

namespace EmuSync.Domain.Tests.Services;

public class LocalDataAccessorTests
{
    private static LocalDataAccessor CreateAccessor() => new();

    private static string CreateTempDirectory()
    {
        var tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(tempDir);
        return tempDir;
    }

    private class TestFile
    {
        public string Name { get; set; } = string.Empty;
        public int Value { get; set; }
    }

    [Fact]
    public async Task WriteFile_ReadFile_ReturnsExpectedContents()
    {
        var accessor = CreateAccessor();
        var tempDir = CreateTempDirectory();
        var file = Path.Combine(tempDir, "test.json");

        try
        {
            var obj = new TestFile { Name = "x", Value = 5 };
            await accessor.WriteFileContentsAsync(file, obj);

            Assert.True(File.Exists(file));

            var read = await accessor.ReadFileContentsAsync<TestFile>(file);
            Assert.Equal("x", read.Name);
            Assert.Equal(5, read.Value);
        }
        finally
        {
            try { Directory.Delete(tempDir, true); } catch { }
        }
    }

    [Fact]
    public async Task ReadFileOrDefault_WhenFileMissing_ReturnsNull()
    {
        var accessor = CreateAccessor();
        var file = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString(), "nofile.json");

        var result = await accessor.ReadFileContentsOrDefaultAsync<TestFile>(file);
        Assert.Null(result);
    }

    [Fact]
    public void RemoveFile_WhenFileDoesNotExist_DoesNotThrow()
    {
        var accessor = CreateAccessor();
        var file = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString(), "nofile.json");

        accessor.RemoveFile(file); // should not throw
    }

    [Fact]
    public void ScanDirectory_WhenNull_ReturnsDirectoryNotSet()
    {
        var accessor = CreateAccessor();
        var result = accessor.ScanDirectory(null);

        Assert.False(result.DirectoryIsSet);
    }

    [Fact]
    public void ScanDirectory_ExcludesIgnoredFiles()
    {
        var accessor = CreateAccessor();
        string tempFolder = CreateTempDirectory();

        try
        {
            string saveFile = Path.Combine(tempFolder, "save.dat");
            File.WriteAllText(saveFile, "save");
            File.SetLastWriteTimeUtc(saveFile, DateTime.UtcNow.AddHours(-2));

            var nested = Path.Combine(tempFolder, "sub");
            Directory.CreateDirectory(nested);

            //the ignored file is the newest - it must not drive the latest write time
            string ignoredFile = Path.Combine(nested, "cache.bin");
            File.WriteAllText(ignoredFile, "cache data");
            File.SetLastWriteTimeUtc(ignoredFile, DateTime.UtcNow.AddHours(2));

            var matcher = new IgnoredFileMatcher(["sub/cache.bin"]);
            var result = accessor.ScanDirectory(tempFolder, matcher);

            Assert.Equal(1, result.FileCount);
            Assert.Equal(new FileInfo(saveFile).Length, result.StorageBytes);
            Assert.Equal(File.GetLastWriteTimeUtc(saveFile), result.LatestFileWriteTimeUtc);
        }
        finally
        {
            try { Directory.Delete(tempFolder, true); } catch { }
        }
    }

    [Fact]
    public void ScanDirectory_TracksLatestDirectoryWriteTime_IndependentlyOfFiles()
    {
        var accessor = CreateAccessor();
        string tempFolder = CreateTempDirectory();

        try
        {
            //a file newer than every subdirectory previously masked directory times entirely
            string file = Path.Combine(tempFolder, "save.dat");
            File.WriteAllText(file, "save");
            File.SetLastWriteTimeUtc(file, DateTime.UtcNow.AddHours(5));

            var nested = Path.Combine(tempFolder, "sub");
            Directory.CreateDirectory(nested);
            DateTime dirTime = DateTime.UtcNow.AddHours(-1);
            Directory.SetLastWriteTimeUtc(nested, dirTime);

            var result = accessor.ScanDirectory(tempFolder);

            Assert.NotNull(result.LatestDirectoryWriteTimeUtc);
            Assert.True(result.LatestDirectoryWriteTimeUtc >= dirTime.AddSeconds(-1));
        }
        finally
        {
            try { Directory.Delete(tempFolder, true); } catch { }
        }
    }

    [Fact]
    public void ListRelativeFiles_ReturnsNormalizedRelativePaths()
    {
        var accessor = CreateAccessor();
        string tempFolder = CreateTempDirectory();

        try
        {
            File.WriteAllText(Path.Combine(tempFolder, "save.dat"), "save");

            var nested = Path.Combine(tempFolder, "sub");
            Directory.CreateDirectory(nested);
            File.WriteAllText(Path.Combine(nested, "cache.bin"), "cache");

            var results = accessor.ListRelativeFiles(tempFolder);

            Assert.Equal(2, results.Count);
            Assert.Contains(results, x => x.RelativePath == "save.dat");
            Assert.Contains(results, x => x.RelativePath == "sub/cache.bin");
            Assert.All(results, x => Assert.True(x.SizeBytes > 0));
        }
        finally
        {
            try { Directory.Delete(tempFolder, true); } catch { }
        }
    }

    [Fact]
    public void ListRelativeFiles_WhenPathMissing_ReturnsEmpty()
    {
        var accessor = CreateAccessor();

        Assert.Empty(accessor.ListRelativeFiles(null));
        Assert.Empty(accessor.ListRelativeFiles(Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString())));
    }
}