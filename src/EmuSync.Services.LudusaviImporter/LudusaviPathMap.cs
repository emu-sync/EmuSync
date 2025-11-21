namespace EmuSync.Services.LudusaviImporter;

public static class LudusaviPathMap
{
    public static Dictionary<string, string?> Build(
        bool isWindows,
        string game,
        string? linuxPrefix
    )
    {
        string home = GetHome(isWindows);

        return new Dictionary<string, string?>()
        {
            ["root"] = isWindows ? "C:\\Program Files (x86)\\Steam" : "UNKNOWN", //probably wrong
            ["game"] = game, //probably wrong, but don't think we need it
            ["base"] = game, //wrong, but don't think we need it
            ["home"] = isWindows ? home : $"{linuxPrefix}/users/steamuser",

            ["storeGameId"] = null,
            ["storeUserId"] = null,
            ["osUserName"] = isWindows ? Environment.UserName : "steamuser",

            // ---------- Windows ----------
            ["winAppData"] = isWindows ? GetFolder(Environment.SpecialFolder.ApplicationData) : $"{linuxPrefix}/users/steamuser/AppData/Roaming",
            ["winLocalAppData"] = isWindows ? GetFolder(Environment.SpecialFolder.LocalApplicationData) : $"{linuxPrefix}/users/steamuser/AppData/Local",
            ["winLocalAppDataLow"] = isWindows ? Path.Combine(home, "AppData", "LocalLow") : $"{linuxPrefix}/users/steamuser/AppData/LocalLow",
            ["winDocuments"] = isWindows ? GetFolder(Environment.SpecialFolder.MyDocuments) : $"{linuxPrefix}/users/steamuser/My Documents",
            ["winPublic"] = isWindows ? GetFolder(Environment.SpecialFolder.CommonDocuments) : $"{linuxPrefix}/users/Public",
            ["winProgramData"] = isWindows ? GetFolder(Environment.SpecialFolder.CommonApplicationData) : $"{linuxPrefix}/ProgramData",
            ["winDir"] = isWindows ? Environment.GetEnvironmentVariable("WINDIR") : $"{linuxPrefix}/windows",

            // ---------- Linux ----------
            ["xdgData"] = !isWindows ? GetEnvOrDefault("XDG_DATA_HOME", Path.Combine(home, ".local", "share")) : null,
            ["xdgConfig"] = !isWindows ? GetEnvOrDefault("XDG_CONFIG_HOME", Path.Combine(home, ".config")) : null,
        };
    }

    private static string GetEnvOrDefault(string name, string fallback) => Environment.GetEnvironmentVariable(name) ?? fallback;
    private static string GetFolder(Environment.SpecialFolder folder) => Environment.GetFolderPath(folder);
    private static string GetHome(bool isWindows)
    {
        if (isWindows) return Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);

        // Linux / Mac use $HOME
        return Environment.GetEnvironmentVariable("HOME") ?? "";
    }
}
