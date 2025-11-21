using EmuSync.Domain;
using EmuSync.Domain.Helpers;
using EmuSync.Domain.Services.Interfaces;
using EmuSync.Services.LudusaviImporter.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.IO;
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

    private static readonly List<string> _invalidPaths = [
        "C:",
        "C:\\",
        "C:/"
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

        var pathMap = LudusaviPathMap.Build(
            "UNKNOWN",
            game.InstallDir?.FirstOrDefault().Key ?? gameName,
            null,
            null
        );

        List<string> fileLocations = game.Files?
            .Where(x => x.Value.Tags?.Contains(Tag.save) ?? false)
            .Select(x => ReplacePathVariables(x.Key, pathMap)).ToList() ?? [];

        List<string> fileLocationsThatExist = [];

        foreach (string fileLocation in fileLocations)
        {
            FileInfo file = new FileInfo(fileLocation);
            string fileName = Path.GetFileName(fileLocation); // gets only the last part
            bool hasWildCardName = fileName.Contains("*.");

            if (hasWildCardName && Path.Exists(file.DirectoryName))
            {
                string path = Path.GetDirectoryName(fileLocation)!;
                fileLocationsThatExist.Add(CleanPathName(path));
                continue;
            }

            if (Directory.Exists(fileLocation))
            {
                fileLocationsThatExist.Add(fileLocation);
            }
        }

        fileLocationsThatExist = fileLocationsThatExist.Distinct().ToList();

        if (fileLocationsThatExist.Count > 0)
        {

            string? bestPath = GetMostCommonFolder(fileLocationsThatExist, pathMap);

            //if we have a best path, just use that on its own
            if (!string.IsNullOrEmpty(bestPath))
            {
                //bit of hack to prevent The Incredible Machine 3 - lol
                if (_invalidPaths.Contains(bestPath))
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

        if (mapPaths.Contains(finalPath)) return null;

        return CleanPathName(finalPath);
    }

    private string ReplacePathVariables(string input, Dictionary<string, string?> map)
    {
        string splitInput = input.Split("/<storeUserId>").First();
        splitInput = splitInput.Split("/<storeGameId>").First();

        return PathVariable.Replace(splitInput, match =>
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
        bool isWindows = PlatformHelper.GetOsPlatform() == Domain.Enums.OsPlatform.Windows;

        if (isWindows)
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