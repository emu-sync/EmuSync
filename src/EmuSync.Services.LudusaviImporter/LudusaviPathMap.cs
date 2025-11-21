namespace EmuSync.Services.LudusaviImporter;

public static class LudusaviPathMap
{
    public static Dictionary<string, string?> Build(
        string root,
        string game,
        string? storeGameId,
        string? storeUserId
    )
    {
        string home = GetHome();

        return new Dictionary<string, string?>()
        {
            ["root"] = root,
            ["game"] = game,
            ["base"] = Path.Combine(root, game),
            ["home"] = home,

            ["storeGameId"] = storeGameId,
            ["storeUserId"] = storeUserId,
            ["osUserName"] = Environment.UserName,

            // ---------- Windows ----------
            ["winAppData"] = IsWindows ? GetFolder(Environment.SpecialFolder.ApplicationData) : null,
            ["winLocalAppData"] = IsWindows ? GetFolder(Environment.SpecialFolder.LocalApplicationData) : null,
            ["winLocalAppDataLow"] = IsWindows ? Path.Combine(home, "AppData", "LocalLow") : null,
            ["winDocuments"] = IsWindows ? GetFolder(Environment.SpecialFolder.MyDocuments) : null,
            ["winPublic"] = IsWindows ? GetFolder(Environment.SpecialFolder.CommonDocuments) : null,
            ["winProgramData"] = IsWindows ? GetFolder(Environment.SpecialFolder.CommonApplicationData) : null,
            ["winDir"] = IsWindows ? Environment.GetEnvironmentVariable("WINDIR") : null,

            // ---------- Linux ----------
            ["xdgData"] = IsLinux ? GetEnvOrDefault("XDG_DATA_HOME", Path.Combine(home, ".local", "share")) : null,
            ["xdgConfig"] = IsLinux ? GetEnvOrDefault("XDG_CONFIG_HOME", Path.Combine(home, ".config")) : null,
        };
    }

    private static string GetEnvOrDefault(string name, string fallback) => Environment.GetEnvironmentVariable(name) ?? fallback;
    private static string GetFolder(Environment.SpecialFolder folder) => Environment.GetFolderPath(folder);
    private static bool IsWindows => OperatingSystem.IsWindows();
    private static bool IsLinux => OperatingSystem.IsLinux();

    private static string GetHome()
    {
        if (IsWindows) return Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);

        // Linux / Mac use $HOME
        return Environment.GetEnvironmentVariable("HOME")!;
    }
}
