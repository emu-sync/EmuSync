namespace EmuSync.Domain.Helpers;

/// <summary>
/// Matches file paths (relative to a game's save folder) against a user-defined ignore list.
/// Paths are compared with forward slashes and case-insensitively on all platforms,
/// since the list is shared across machines/OSes via cloud metadata.
/// </summary>
public sealed class IgnoredFileMatcher
{
    public static readonly IgnoredFileMatcher Empty = new(null);

    private readonly HashSet<string> _paths;

    public IgnoredFileMatcher(IEnumerable<string>? relativePaths)
    {
        _paths = new HashSet<string>(
            (relativePaths ?? [])
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(Normalize),
            StringComparer.OrdinalIgnoreCase
        );
    }

    public bool HasEntries => _paths.Count > 0;

    public bool IsIgnored(string relativePath)
    {
        if (_paths.Count == 0) return false;

        return _paths.Contains(Normalize(relativePath));
    }

    public bool IsIgnored(string rootPath, string fullPath)
    {
        if (_paths.Count == 0) return false;

        return IsIgnored(Path.GetRelativePath(rootPath, fullPath));
    }

    public static string Normalize(string path)
    {
        return path.Replace('\\', '/').Trim().TrimStart('/');
    }
}
