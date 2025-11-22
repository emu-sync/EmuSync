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
        string user = GetUserName(isWindows);
        string home = GetHome(isWindows, user, linuxPrefix);

        return new Dictionary<string, string?>()
        {
            ["root"] = isWindows ? "C:\\Program Files (x86)\\Steam" : string.Format("{0}/.steam/steam", Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)), //probably wrong
            ["game"] = game.InstallDir?.FirstOrDefault().Key ?? game.Alias, //probably wrong, but don't think we need it
            ["base"] = WildcardDirectory,
            ["home"] = GetHome(isWindows, user, linuxPrefix),

            ["storeGameId"] = WildcardDirectory,
            ["storeUserId"] = WildcardDirectory,
            ["steamGameId"] = game.Steam?.Id.ToString() ?? "N/A",
            ["osUserName"] = user,

            // ---------- Windows ----------
            ["winAppData"] = isWindows ? Path.Combine(home, "AppData", "Roaming") : $"{linuxPrefix}/users/steamuser/AppData/Roaming",
            ["winLocalAppData"] = isWindows ? Path.Combine(home, "AppData", "Local") : $"{linuxPrefix}/users/steamuser/AppData/Local",
            ["winLocalAppDataLow"] = isWindows ? Path.Combine(home, "AppData", "LocalLow") : $"{linuxPrefix}/users/steamuser/AppData/LocalLow", //this doesn't seem to be in the manifest
            ["winDocuments"] = isWindows ? Path.Combine(home, "Documents") : $"{linuxPrefix}/users/steamuser/My Documents",
            ["winPublic"] = isWindows ? GetFolder(Environment.SpecialFolder.CommonDocuments) : $"{linuxPrefix}/users/Public",
            ["winProgramData"] = isWindows ? GetFolder(Environment.SpecialFolder.CommonApplicationData) : $"{linuxPrefix}/ProgramData",
            ["winDir"] = isWindows ? Environment.GetEnvironmentVariable("WINDIR") : $"{linuxPrefix}/windows",

            // ---------- Linux ----------
            ["xdgData"] = !isWindows ? GetEnvOrDefault("XDG_DATA_HOME", Path.Combine(home, ".local", "share")) : null,
            ["xdgConfig"] = !isWindows ? GetEnvOrDefault("XDG_CONFIG_HOME", Path.Combine(home, ".config")) : null,
        };
    }


    private static string GetUserName(bool isWindows)
    {
        if(isWindows)
        {
            return WindowsUserHelper.GetActiveUserProfile();
        }

        return "steamuser";
    }

    private static string GetHome(bool isWindows, string username, string? linuxPrefix)
    {
        return isWindows ? $"C:\\Users\\{username}" : $"{linuxPrefix}/users/{username}";
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
}
