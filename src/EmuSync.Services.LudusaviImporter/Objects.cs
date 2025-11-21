namespace EmuSync.Services.LudusaviImporter;

public record FileConstraint
{
    public Os? Os { get; set; }
    public string? Store { get; set; }
}

public record LaunchConstraint
{
    public Bit? Bit { get; set; }
    public Os? Os { get; set; }
    public Store? Store { get; set; }
}

public record RegistryConstraint
{
    public Store? Store { get; set; }
}

// ---------------- Files ----------------

public record FileEntry
{
    public Tag[]? Tags { get; set; }
    public FileConstraint[]? When { get; set; }
}

// ---------------- Launch ----------------

public record LaunchEntry
{
    public string? Arguments { get; set; }
    public string? WorkingDir { get; set; }
    public LaunchConstraint[]? When { get; set; }
}

// ---------------- Registry ----------------

public record RegistryEntry
{
    public Tag[]? Tags { get; set; }
    public RegistryConstraint[]? When { get; set; }
}

// ---------------- Simple Objects ----------------

public record SteamInfo
{
    public int? Id { get; set; }
}

public record GogInfo
{
    public int? Id { get; set; }
}

public record IdInfo
{
    public string? Flatpak { get; set; }
    public int[]? GogExtra { get; set; }
    public string? Lutris { get; set; }
    public int[]? SteamExtra { get; set; }
}

public record CloudInfo
{
    public bool? Epic { get; set; }
    public bool? Gog { get; set; }
    public bool? Origin { get; set; }
    public bool? Steam { get; set; }
    public bool? Uplay { get; set; }
}

public record NoteEntry
{
    public string? Message { get; set; }
}

// ---------------- Game Definition ----------------

public record GameDefinition
{
    public Dictionary<string, FileEntry>? Files { get; set; }
    public Dictionary<string, object>? InstallDir { get; set; }
    public Dictionary<string, LaunchEntry[]>? Launch { get; set; }
    public Dictionary<string, RegistryEntry>? Registry { get; set; }
    public SteamInfo? Steam { get; set; }
    public GogInfo? Gog { get; set; }
    public IdInfo? Id { get; set; }
    public string? Alias { get; set; }
    public CloudInfo? Cloud { get; set; }
    public NoteEntry[]? Notes { get; set; }
}

// ---------------- Root ----------------

public record GameDefinitions
{
    public Dictionary<string, GameDefinition>? Items { get; set; }
}
