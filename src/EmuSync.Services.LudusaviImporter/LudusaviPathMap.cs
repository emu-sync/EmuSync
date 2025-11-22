namespace EmuSync.Services.LudusaviImporter;

public static class LudusaviPathMap
{
    public const string WildcardDirectory = "*{WILD_CARD}*";

    public static Dictionary<string, string?> Build(
        bool isWindows,
        GameDefinition game,
        string? linuxPrefix
    )
    {
        string home = GetHome(isWindows);

        return new Dictionary<string, string?>()
        {
            ["root"] = isWindows ? "C:\\Program Files (x86)\\Steam" : string.Format("{0}/.steam/steam", Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)), //probably wrong
            ["game"] = game.InstallDir?.FirstOrDefault().Key ?? game.Alias, //probably wrong, but don't think we need it
            ["base"] = WildcardDirectory,
            ["home"] = isWindows ? home : $"{linuxPrefix}/users/steamuser",

            ["storeGameId"] = WildcardDirectory,
            ["storeUserId"] = WildcardDirectory,
            ["steamGameId"] = game.Steam?.Id.ToString() ?? "N/A",
            ["osUserName"] = isWindows ? Environment.UserName : "steamuser",

            // ---------- Windows ----------
            ["winAppData"] = isWindows ? GetFolder(Environment.SpecialFolder.ApplicationData) : $"{linuxPrefix}/users/steamuser/AppData/Roaming",
            ["winLocalAppData"] = isWindows ? GetFolder(Environment.SpecialFolder.LocalApplicationData) : $"{linuxPrefix}/users/steamuser/AppData/Local",
            ["winLocalAppDataLow"] = isWindows ? Path.Combine(home, "AppData", "LocalLow") : $"{linuxPrefix}/users/steamuser/AppData/LocalLow", //this doesn't seem to be in the manifest
            ["winDocuments"] = isWindows ? GetFolder(Environment.SpecialFolder.MyDocuments) : $"{linuxPrefix}/users/steamuser/My Documents",
            ["winPublic"] = isWindows ? GetFolder(Environment.SpecialFolder.CommonDocuments) : $"{linuxPrefix}/users/Public",
            ["winProgramData"] = isWindows ? GetFolder(Environment.SpecialFolder.CommonApplicationData) : $"{linuxPrefix}/ProgramData",
            ["winDir"] = isWindows ? Environment.GetEnvironmentVariable("WINDIR") : $"{linuxPrefix}/windows",

            // ---------- Linux ----------
            ["xdgData"] = !isWindows ? GetEnvOrDefault("XDG_DATA_HOME", Path.Combine(home, ".local", "share")) : null,
            ["xdgConfig"] = !isWindows ? GetEnvOrDefault("XDG_CONFIG_HOME", Path.Combine(home, ".config")) : null,
        };
    }


    public static List<string> GetOtherKnownLocations()
    {
        return [
            //Path.Combine("<winPublic>", "Steam", "CODEX", "<steamGameId>"),
            //Path.Combine("<winAppData>", "Steam", "CODEX", "<steamGameId>"),
            Path.Combine("<winProgramData>", "Steam", WildcardDirectory, "<steamGameId>"),
            Path.Combine("<winLocalAppData>", "SKIDROW", "<steamGameId>"),
            Path.Combine("<winDocuments>", "SKIDROW", "<steamGameId>"),
            Path.Combine("<winAppData>", "SmartSteamEmu", "<steamGameId>"),
            Path.Combine("<winAppData>", "Goldberg SteamEmu Saves", "<steamGameId>"),
            Path.Combine("<winAppData>", "EMPRESS", "<steamGameId>"),
            Path.Combine("<winAppData>", "CreamAPI", "<steamGameId>")
        ];
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
