using EmuSync.Domain.Entities;
using EmuSync.Domain.Helpers;
using EmuSync.Domain.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace EmuSync.Domain.Services;


public class LocalGameSaveBackupService(
    ILogger<LocalGameSaveBackupService> logger,
    ILocalDataAccessor localDataAccessor
) : ILocalGameSaveBackupService
{
    private readonly ILogger<LocalGameSaveBackupService> _logger = logger;
    private readonly ILocalDataAccessor _localDataAccessor = localDataAccessor;

    public async Task<List<LocalGameBackupManifestEntity>> GetBackupsAsync(string gameId, CancellationToken cancellationToken = default)
    {
        List<LocalGameBackupManifestEntity>? manifests = await GetBackupManifestAsync(gameId, cancellationToken);
        return manifests ?? [];
    }

    public async Task CreateBackupAsync(string gameId, string path, CancellationToken cancellationToken = default)
    {
        DateTime now = DateTime.UtcNow;
        string fileName = string.Format(DomainConstants.LocalDataGameBackupFileNameFormat, now.ToString("dd-MM-yyyy_HH-mm-ss"));
        string fullBackupLocation = GetGameBackupFileName(gameId, fileName);

        //create the zip backup content
        using var stream = ZipHelper.CreateZipFromFolder(path);
        var fileBytes = stream.ToArray();

        string dir = Path.GetDirectoryName(fullBackupLocation)!;
        if (!Directory.Exists(dir))
        {
            Directory.CreateDirectory(dir);
        }

        await File.WriteAllBytesAsync(fullBackupLocation, fileBytes, cancellationToken);
        await AddBackupToManifestAsync(gameId, fileName, now, cancellationToken);
    }

    public async Task RestoreBackupAsync(string gameId, string backupId, string outputDirectory, CancellationToken cancellationToken = default)
    {
        List<LocalGameBackupManifestEntity>? manifests = await GetBackupManifestAsync(gameId, cancellationToken);
        LocalGameBackupManifestEntity? manifest = manifests?.FirstOrDefault(x => x.Id == backupId);

        if (manifest == null)
        {
            _logger.LogError("No backup manifest found for game {gameId}, backup ID {backupId}", gameId, backupId);
            throw new InvalidOperationException($"No backup manifest found for game {gameId}, backup ID {backupId}");
        }

        string fullBackupLocation = GetGameBackupFileName(gameId, manifest.BackupFileName);

        if (!File.Exists(fullBackupLocation))
        {
            _logger.LogError("Backup file didn't exist at {fileLocation}", fullBackupLocation);
            throw new FileNotFoundException("Failed to find backup file", fullBackupLocation);
        }

        using var fileStream = new FileStream(fullBackupLocation, FileMode.Open, FileAccess.Read);
        using var memoryStream = new MemoryStream();

        fileStream.CopyTo(memoryStream);

        ZipHelper.ExtractToDirectory(memoryStream, outputDirectory, DateTime.UtcNow);
    }

    private async Task AddBackupToManifestAsync(string gameId, string fileName, DateTime createdOnUtc, CancellationToken cancellationToken = default)
    {
        List<LocalGameBackupManifestEntity>? manifests = await GetBackupManifestAsync(gameId, cancellationToken);
        manifests ??= [];

        LocalGameBackupManifestEntity manifest = new()
        {
            Id = IdHelper.Create(),
            BackupFileName = fileName,
            GameId = gameId,
            CreatedOnUtc = createdOnUtc
        };

        manifests.Add(manifest);

        string manifestFile = GetGameBackupManifestFileName(gameId);
        await _localDataAccessor.WriteFileContentsAsync(manifestFile, manifests, cancellationToken);
    }

    private async Task<List<LocalGameBackupManifestEntity>?> GetBackupManifestAsync(string gameId, CancellationToken cancellationToken = default)
    {
        string manifestFile = GetGameBackupManifestFileName(gameId);
        return await _localDataAccessor.ReadFileContentsOrDefaultAsync<List<LocalGameBackupManifestEntity>>(manifestFile, cancellationToken);
    }

    private string GetGameBackupManifestFileName(string gameId)
    {
        string fileName = Path.Combine(DomainConstants.LocalDataGameBackupFolder, gameId, DomainConstants.LocalDataGameBackupManifestFile);
        return _localDataAccessor.GetLocalFilePath(fileName);
    }

    private string GetGameBackupFileName(string gameId, string fileName)
    {
        string gameBackupFile = Path.Combine(DomainConstants.LocalDataGameBackupFolder, gameId, fileName);
        return _localDataAccessor.GetLocalFilePath(gameBackupFile);
    }
}