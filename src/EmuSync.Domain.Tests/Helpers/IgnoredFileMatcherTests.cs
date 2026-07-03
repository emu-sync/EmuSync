using EmuSync.Domain.Helpers;

namespace EmuSync.Domain.Tests.Helpers;

public class IgnoredFileMatcherTests
{
    [Fact]
    public void Empty_Matcher_Has_No_Entries_And_Matches_Nothing()
    {
        Assert.False(IgnoredFileMatcher.Empty.HasEntries);
        Assert.False(IgnoredFileMatcher.Empty.IsIgnored("a.txt"));

        var fromNull = new IgnoredFileMatcher(null);
        Assert.False(fromNull.HasEntries);

        var fromBlanks = new IgnoredFileMatcher(["", "   "]);
        Assert.False(fromBlanks.HasEntries);
    }

    [Fact]
    public void Matches_Exact_Relative_Path()
    {
        var matcher = new IgnoredFileMatcher(["config.ini", "sub/cache.bin"]);

        Assert.True(matcher.HasEntries);
        Assert.True(matcher.IsIgnored("config.ini"));
        Assert.True(matcher.IsIgnored("sub/cache.bin"));
        Assert.False(matcher.IsIgnored("save.dat"));
        Assert.False(matcher.IsIgnored("other/config.ini"));
    }

    [Fact]
    public void Matches_Regardless_Of_Separator()
    {
        var matcher = new IgnoredFileMatcher(["sub\\cache.bin"]);

        Assert.True(matcher.IsIgnored("sub/cache.bin"));
        Assert.True(matcher.IsIgnored("sub\\cache.bin"));
    }

    [Fact]
    public void Matches_Case_Insensitively()
    {
        var matcher = new IgnoredFileMatcher(["Config.INI"]);

        Assert.True(matcher.IsIgnored("config.ini"));
        Assert.True(matcher.IsIgnored("CONFIG.INI"));
    }

    [Fact]
    public void Ignores_Leading_Slashes_And_Whitespace()
    {
        var matcher = new IgnoredFileMatcher([" /config.ini "]);

        Assert.True(matcher.IsIgnored("config.ini"));
    }

    [Fact]
    public void Matches_Full_Path_Against_Root()
    {
        var matcher = new IgnoredFileMatcher(["sub/cache.bin"]);

        string root = Path.Combine(Path.GetTempPath(), "game-saves");
        string fullPath = Path.Combine(root, "sub", "cache.bin");

        Assert.True(matcher.IsIgnored(root, fullPath));
        Assert.False(matcher.IsIgnored(root, Path.Combine(root, "save.dat")));
    }

    [Theory]
    [InlineData("a\\b.txt", "a/b.txt")]
    [InlineData("/a.txt", "a.txt")]
    [InlineData("  a.txt  ", "a.txt")]
    public void Normalize_Cleans_Paths(string input, string expected)
    {
        Assert.Equal(expected, IgnoredFileMatcher.Normalize(input));
    }
}
