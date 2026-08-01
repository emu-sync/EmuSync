using EmuSync.Domain.Helpers;

namespace EmuSync.Domain.Tests.Helpers;

public class ZipHelperTests
{
    [Fact]
    public void CreateZipFromFolder_And_ExtractToDirectory_PreservesFileLastWriteTimes()
    {
        string tempFolder = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());

        Directory.CreateDirectory(tempFolder);

        try
        {
            var file1 = Path.Combine(tempFolder, "a.txt");
            File.WriteAllText(file1, "hello");
            var file1LastWriteTimeUtc = new DateTime(2024, 1, 2, 3, 4, 6, DateTimeKind.Utc);
            File.SetLastWriteTimeUtc(file1, file1LastWriteTimeUtc);

            var nested = Path.Combine(tempFolder, "sub");
            Directory.CreateDirectory(nested);
            var file2 = Path.Combine(nested, "b.txt");
            File.WriteAllText(file2, "world");
            var file2LastWriteTimeUtc = new DateTime(2024, 2, 3, 4, 5, 8, DateTimeKind.Utc);
            File.SetLastWriteTimeUtc(file2, file2LastWriteTimeUtc);

            var zipPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".zip");

            List<double> progress = new();
            ZipHelper.CreateZipFromFolder(tempFolder, zipPath, p => progress.Add(p));

            Assert.True(File.Exists(zipPath));
            Assert.True(progress.Count >= 1);

            // extract
            using var fs = File.OpenRead(zipPath);
            var outDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            List<double> extractProg = new();
            ZipHelper.ExtractToDirectory(fs, outDir, DateTime.UtcNow, p => extractProg.Add(p));

            Assert.True(Directory.Exists(outDir));
            Assert.True(File.Exists(Path.Combine(outDir, "a.txt")));
            Assert.True(File.Exists(Path.Combine(outDir, "sub", "b.txt")));
            Assert.Equal(file1LastWriteTimeUtc, File.GetLastWriteTimeUtc(Path.Combine(outDir, "a.txt")));
            Assert.Equal(file2LastWriteTimeUtc, File.GetLastWriteTimeUtc(Path.Combine(outDir, "sub", "b.txt")));
            Assert.True(extractProg.Count >= 1);
        }
        finally
        {
            try { Directory.Delete(tempFolder, true); } catch { }
        }
    }
}