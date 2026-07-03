using EmuSync.Domain.Helpers;

namespace EmuSync.Domain.Tests.Helpers;

public class ZipHelperTests
{
    [Fact]
    public void CreateZipFromFolder_And_ExtractToDirectory_Works()
    {
        string tempFolder = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());

        Directory.CreateDirectory(tempFolder);

        try
        {
            var file1 = Path.Combine(tempFolder, "a.txt");
            File.WriteAllText(file1, "hello");

            var nested = Path.Combine(tempFolder, "sub");
            Directory.CreateDirectory(nested);
            var file2 = Path.Combine(nested, "b.txt");
            File.WriteAllText(file2, "world");

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
            Assert.True(extractProg.Count >= 1);
        }
        finally
        {
            try { Directory.Delete(tempFolder, true); } catch { }
        }
    }

    [Fact]
    public void CreateZipFromFolder_Excludes_Ignored_Files()
    {
        string tempFolder = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(tempFolder);

        try
        {
            File.WriteAllText(Path.Combine(tempFolder, "save.dat"), "save");
            File.WriteAllText(Path.Combine(tempFolder, "config.ini"), "local");

            var nested = Path.Combine(tempFolder, "sub");
            Directory.CreateDirectory(nested);
            File.WriteAllText(Path.Combine(nested, "cache.bin"), "cache");

            var zipPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".zip");

            var matcher = new IgnoredFileMatcher(["CONFIG.ini", "sub\\cache.bin"]);
            ZipHelper.CreateZipFromFolder(tempFolder, zipPath, null, matcher);

            var outDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
            using var fs = File.OpenRead(zipPath);
            ZipHelper.ExtractToDirectory(fs, outDir);

            Assert.True(File.Exists(Path.Combine(outDir, "save.dat")));
            Assert.False(File.Exists(Path.Combine(outDir, "config.ini")));
            Assert.False(File.Exists(Path.Combine(outDir, "sub", "cache.bin")));
        }
        finally
        {
            try { Directory.Delete(tempFolder, true); } catch { }
        }
    }

    [Fact]
    public void ExtractToDirectory_Preserves_Ignored_Local_Files_And_Skips_Ignored_Entries()
    {
        string sourceFolder = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        string outDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());

        Directory.CreateDirectory(sourceFolder);
        Directory.CreateDirectory(outDir);

        try
        {
            //the zip contains a save and a config entry (e.g. uploaded before the ignore was added)
            File.WriteAllText(Path.Combine(sourceFolder, "save.dat"), "cloud save");
            File.WriteAllText(Path.Combine(sourceFolder, "config.ini"), "cloud config");

            var zipPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".zip");
            ZipHelper.CreateZipFromFolder(sourceFolder, zipPath);

            //local folder has an ignored file, a stale file and a dir holding an ignored file
            File.WriteAllText(Path.Combine(outDir, "config.ini"), "local config");
            File.WriteAllText(Path.Combine(outDir, "stale.dat"), "stale");

            var ignoredSub = Path.Combine(outDir, "machine");
            Directory.CreateDirectory(ignoredSub);
            File.WriteAllText(Path.Combine(ignoredSub, "id.txt"), "machine id");

            var emptySub = Path.Combine(outDir, "old");
            Directory.CreateDirectory(emptySub);
            File.WriteAllText(Path.Combine(emptySub, "gone.dat"), "gone");

            var matcher = new IgnoredFileMatcher(["config.ini", "machine/id.txt"]);

            using var fs = File.OpenRead(zipPath);
            ZipHelper.ExtractToDirectory(fs, outDir, null, null, matcher);

            //ignored local files survive untouched
            Assert.Equal("local config", File.ReadAllText(Path.Combine(outDir, "config.ini")));
            Assert.Equal("machine id", File.ReadAllText(Path.Combine(ignoredSub, "id.txt")));

            //non-ignored files replaced/removed
            Assert.Equal("cloud save", File.ReadAllText(Path.Combine(outDir, "save.dat")));
            Assert.False(File.Exists(Path.Combine(outDir, "stale.dat")));
            Assert.False(Directory.Exists(emptySub));
        }
        finally
        {
            try { Directory.Delete(sourceFolder, true); } catch { }
            try { Directory.Delete(outDir, true); } catch { }
        }
    }
}