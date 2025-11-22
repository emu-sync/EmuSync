using EmuSync.Domain;
using EmuSync.Domain.Helpers;
using EmuSync.Domain.Services.Interfaces;
using EmuSync.Services.LudusaviImporter.Interfaces;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace EmuSync.Services.LudusaviImporter;

public class LudusaviManifestScanner(
    ILogger<LudusaviManifestScanner> logger,
    ILocalDataAccessor localDataAccessor
) : ILudusaviManifestScanner
{
    ILogger<LudusaviManifestScanner> _logger = logger;
    private readonly ILocalDataAccessor _localDataAccessor = localDataAccessor;
    private int _completedCount = 0;
    private int _totalCount = 0;
    private static bool _isWindows = PlatformHelper.GetOsPlatform() == Domain.Enums.OsPlatform.Windows;

    private static readonly List<string> _invalidPaths = [
        "C:",
        "C:\\",
        "C:/",
        "/home/deck/.local/share/Steam/userdata",
        "/home/deck/.local/share/Steam/steamapps/compatdata",
    ];

    public double GetCompletionProgress()
    {
        var result = _totalCount == 0 ? 0.0 : (double)_completedCount / _totalCount;

        result = result * 100;

        if (result > 100) return 100;

        return Math.Round(result, 2);
    }

    public async Task<LatestManifestScanResult> ScanForSaveFilesAsync(GameDefinitions gameDefinitions, CancellationToken cancellationToken = default)
    {
        using var logScope = _logger.BeginScope(nameof(LudusaviManifestScanner));

        LatestManifestScanResult result = new();

        if (gameDefinitions.Items == null) return result;

        _completedCount = 0;
        _totalCount = gameDefinitions.Items.Count;

        var bag = new ConcurrentBag<FoundGame>();
        int maxConcurrency = DetermineMaxConcurrency();
        var semaphore = new SemaphoreSlim(maxConcurrency);
        var tasks = new List<Task>();

        _logger.LogInformation("Scanning {gameCount} games with a concurrency of {maxConcurrency}", gameDefinitions.Items.Count, maxConcurrency);

        //go through every game see if we found it on the user system. Might take a while, but we can save the results
        //so a scan doesn't need to be done every time
        foreach (var kvp in gameDefinitions.Items)
        {
            if (cancellationToken.IsCancellationRequested) break;

            await semaphore.WaitAsync(cancellationToken);

            tasks.Add(Task.Run(async () =>
            {
                try
                {
                    bool found = ScanLocalSystemAsync(kvp.Key, kvp.Value, out List<string>? suggestedFolderPaths);

                    if (found)
                    {
                        FoundGame foundGame = new()
                        {
                            Name = kvp.Key,
                            SuggestedFolderPaths = suggestedFolderPaths!
                        };

                        bag.Add(foundGame);
                    }
                }
                finally
                {
                    Interlocked.Increment(ref _completedCount);
                    semaphore.Release();
                }

            }, cancellationToken));
        }

        await Task.WhenAll(tasks);

        result.FoundGames.AddRange(
            bag.OrderBy(x => x.Name)
        );

        string fileName = _localDataAccessor.GetLocalFilePath(DomainConstants.LocalDataLudusaviCachedScanFile);
        await _localDataAccessor.WriteFileContentsAsync(fileName, result, cancellationToken);

        _logger.LogInformation("Fininshed scanning for games. Found {count}", result.FoundGames.Count);

        _completedCount = 0;

        return result;
    }

    private bool ScanLocalSystemAsync(string gameName, GameDefinition game, out List<string>? suggestedPaths)
    {
        try
        {
            List<string> fileLocations = GetFileLocations(game, out var pathMap);
            List<string> fileLocationsThatExist = SearchForFoundDirectories(fileLocations);

            List<string> allInvalidFinalPaths = new(_invalidPaths);
            allInvalidFinalPaths.AddRange(pathMap.Values.Where(x => !string.IsNullOrEmpty(x)).Select(x => x)!);

            fileLocationsThatExist = fileLocationsThatExist.Distinct().ToList();

            if (fileLocationsThatExist.Count > 0)
            {
                string? bestPath = GetMostCommonFolder(fileLocationsThatExist, pathMap);

                //if we have a best path, just use that on its own
                if (!string.IsNullOrEmpty(bestPath))
                {
                    //bit of hack to prevent The Incredible Machine 3 - lol
                    if (allInvalidFinalPaths.Contains(bestPath))
                    {
                        suggestedPaths = null;
                        return false;
                    }

                    suggestedPaths = [bestPath];
                }
                else
                {
                    //otherwise give them all paths to choose from
                    suggestedPaths = fileLocationsThatExist;
                }

                _logger.LogInformation("Found game {gameName}. All paths were {@allPaths} Suggested paths are {@suggestedPaths}", gameName, fileLocationsThatExist, suggestedPaths);
                return true;
            }

            suggestedPaths = null;
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error caught scanning for game {gameName}", gameName);
            suggestedPaths = null;
            return false;
        }
    }

    private List<string> SearchForFoundDirectories(List<string> fileLocations)
    {
        List<string> fileLocationsThatExist = [];

        foreach (string fileLocation in fileLocations)
        {
            //handle wildcard directory segment - useful for linux and anything with a game ID or user Id
            if (fileLocation.Contains(LudusaviPathMap.WildcardDirectory))
            {
                foreach (string expanded in ExpandWildcardDirectories(fileLocation))
                {
                    AddLocationIfExists(fileLocationsThatExist, expanded);
                }

                continue;
            }

            AddLocationIfExists(fileLocationsThatExist, fileLocation);
        }

        return fileLocationsThatExist;
    }

    private bool AddLocationIfExists(List<string> fileLocationsThatExist, string fileLocation)
    {
        //account for some of the file paths not conforming and expecting a *.sav file or similar - we just want a directory
        FileInfo file = new FileInfo(fileLocation);

        string fileName = Path.GetFileName(fileLocation); // gets only the last part
        bool hasWildCardFileName = fileName.Contains("*.");

        if (hasWildCardFileName && Path.Exists(file.DirectoryName))
        {
            string path = Path.GetDirectoryName(fileLocation)!;
            fileLocationsThatExist.Add(CleanPathName(path));
            return true;
        }

        //lastly, just check the directory provided
        if (Directory.Exists(fileLocation))
        {
            fileLocationsThatExist.Add(fileLocation);
            return true;
        }

        return false;
    }

    private IEnumerable<string> ExpandWildcardDirectories(string patternPath)
    {
        var parts = patternPath.Split([Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar], StringSplitOptions.RemoveEmptyEntries);
        return ExpandRecursiveWildcardDirectories(parts, 0, "/");
    }

    private IEnumerable<string> ExpandRecursiveWildcardDirectories(string[] parts, int index, string current)
    {
        if (index == parts.Length)
        {
            bool exists = AddLocationIfExists([], current);

            if (exists)
            {
                yield return current;
            }

            yield break;
        }

        var part = parts[index];

        if (part == LudusaviPathMap.WildcardDirectory)
        {
            if (Directory.Exists(current))
            {
                foreach (var dir in Directory.GetDirectories(current))
                {
                    foreach (var expanded in ExpandRecursiveWildcardDirectories(parts, index + 1, dir))
                    {
                        yield return expanded;
                    }
                }
            }
        }
        else
        {
            var next = Path.Combine(current, part);

            foreach (var expanded in ExpandRecursiveWildcardDirectories(parts, index + 1, next))
            {
                yield return expanded;
            }
        }
    }

    private static readonly Regex PathVariable = new(@"<([a-zA-Z0-9]+)>", RegexOptions.Compiled);

    private string? GetMostCommonFolder(List<string> paths, Dictionary<string, string?> pathMap)
    {
        // Get all non-null, absolute paths from the map
        var mapPaths = pathMap.Values
            .Where(v => !string.IsNullOrEmpty(v))
            .ToList();

        if (paths == null || paths.Count == 0) return null;

        var splitPaths = paths
            .Select(p => Path.GetFullPath(p).TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar)
            .Split(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar))
            .ToList();

        var first = splitPaths.First();
        int commonLength = first.Length;

        for (int i = 0; i < first.Length; i++)
        {
            string segment = first[i];

            if (splitPaths.Any(sp => sp.Length <= i || !string.Equals(sp[i], segment, StringComparison.OrdinalIgnoreCase)))
            {
                commonLength = i;
                break;
            }
        }

        if (commonLength == 0) return null;

        string finalPath = string.Join(Path.DirectorySeparatorChar.ToString(), first.Take(commonLength));

        return CleanPathName(finalPath);
    }

    private List<string> GetFileLocations(GameDefinition game, out Dictionary<string, string?> pathMap)
    {
        string linuxFormat = string.Format(
            "{0}/.local/share/Steam/steamapps/compatdata/{1}/pfx/drive_c",
            Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
            LudusaviPathMap.WildcardDirectory
        );

        var map = LudusaviPathMap.Build(
            _isWindows,
            game,
            linuxFormat
        );

        pathMap = map;


        List<string> fileLocations = game.Files?
            .Where(x => x.Value.Tags?.Contains(Tag.save) ?? false)
            .Where(x =>
            {
                var path = x.Key.Replace("\\", "/");

                // Ignore: <base>/END OF PATH
                // Ignore: <base>/users/END OF PATH
                return !Regex.IsMatch(path, @"^<base>/[^/]+$") &&
                       !Regex.IsMatch(path, @"^<base>/users/[^/]+$");
            })
            .Select(x => x.Key)
            .ToList() ?? [];

        fileLocations.AddRange(
            LudusaviPathMap.GetOtherKnownLocations()
        );

        return fileLocations
            .Select(x => ReplacePathVariables(x, map))
            .ToList();
    }

    private string ReplacePathVariables(string input, Dictionary<string, string?> map)
    {
        input = input.Replace("<home>/AppData/LocalLow", map["winLocalAppDataLow"]); //explicitly replace local low - the variable isn't in the manifest

        return PathVariable.Replace(input, match =>
        {
            string key = match.Groups[1].Value;

            if (map.TryGetValue(key, out var value) && value != null)
            {
                return CleanPathName(value);
            }

            return CleanPathName(match.Value);
        });
    }

    private string CleanPathName(string path)
    {
        if (_isWindows)
        {
            return path.Replace(Path.AltDirectorySeparatorChar, Path.DirectorySeparatorChar);
        }

        return path.Replace(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
    }

    private int DetermineMaxConcurrency()
    {
        //base on logical processors (CPU cores)
        int cores = Environment.ProcessorCount;

        int concurrency = Math.Clamp(cores * 3, 1, 10); // min 1, max 10 - don't want to overload

        return concurrency;
    }
}

public record LatestManifestScanResult
{
    public List<FoundGame> FoundGames { get; set; } = [];
}

public record FoundGame
{
    public string Name { get; set; }
    public List<string> SuggestedFolderPaths { get; set; }
}