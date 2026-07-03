using EmuSync.Agent.Dto.Game;
using EmuSync.Agent.Mapping;
using EmuSync.Domain.Entities;
using EmuSync.Services.LudusaviImporter;
using EmuSync.Services.Managers.Objects;

namespace EmuSync.Agent.Tests.Mapping;

public class GameMappingsTests
{
    [Fact]
    public void GameEntity_MapsTo_GameDto()
    {
        var entity = new GameEntity
        {
            Id = "id",
            Name = "name",
            AutoSync = true,
            SyncSourceIdLocations = new Dictionary<string, string> { { "s", "p" } },
            LastSyncedFrom = "src",
            LastSyncTimeUtc = DateTime.UtcNow,
            StorageBytes = 123,
            MaximumLocalGameBackups = 5,
            IgnoredFilePaths = ["config.ini"]
        };

        GameDto dto = entity.ToDto();

        Assert.Equal(entity.Id, dto.Id);
        Assert.Equal(entity.Name, dto.Name);
        Assert.Equal(entity.AutoSync, dto.AutoSync);
        Assert.Equal(entity.SyncSourceIdLocations, dto.SyncSourceIdLocations);
        Assert.Equal(entity.LastSyncedFrom, dto.LastSyncedFrom);
        Assert.Equal(entity.LastSyncTimeUtc, dto.LastSyncTimeUtc);
        Assert.Equal(entity.StorageBytes, dto.StorageBytes);
        Assert.Equal(entity.MaximumLocalGameBackups, dto.MaximumLocalGameBackups);
        Assert.Equal(entity.IgnoredFilePaths, dto.IgnoredFilePaths);
    }

    [Fact]
    public void FoundGame_MapsTo_GameSuggestionDto()
    {
        var found = new FoundGame
        {
            Name = "G",
            SuggestedFolderPaths = new List<string> { "p1", "p2" }
        };

        GameSuggestionDto dto = found.ToDto();

        Assert.Equal(found.Name, dto.Name);
        Assert.Equal(found.SuggestedFolderPaths, dto.SuggestedFolderPaths);
    }

    [Fact]
    public void LocalGameBackupManifestEntity_MapsTo_GameBackupManifestDto()
    {
        var manifest = new LocalGameBackupManifestEntity
        {
            Id = "id",
            GameId = "g",
            BackupFileName = "file.zip",
            CreatedOnUtc = DateTime.UtcNow
        };

        GameBackupManifestDto dto = manifest.ToDto();

        Assert.Equal(manifest.Id, dto.Id);
        Assert.Equal(manifest.BackupFileName, dto.BackupFileName);
        Assert.Equal(manifest.CreatedOnUtc, dto.CreatedOnUtc);
    }

    [Fact]
    public void GameEntity_MapsTo_GameSummaryDto()
    {
        var entity = new GameEntity
        {
            Id = "id",
            Name = "name",
            AutoSync = false,
            MaximumLocalGameBackups = 3,
            SyncSourceIdLocations = new Dictionary<string, string> { { "s", "p" } },
            LastSyncedFrom = "src",
            LastSyncTimeUtc = DateTime.UtcNow,
            StorageBytes = 50
        };

        GameSummaryDto dto = entity.ToSummaryDto();

        Assert.Equal(entity.Id, dto.Id);
        Assert.Equal(entity.Name, dto.Name);
        Assert.Equal(entity.AutoSync, dto.AutoSync);
        Assert.Equal(entity.MaximumLocalGameBackups, dto.MaximumLocalGameBackups);
        Assert.Equal(entity.SyncSourceIdLocations, dto.SyncSourceIdLocations);
        Assert.Equal(entity.LastSyncedFrom, dto.LastSyncedFrom);
        Assert.Equal(entity.LastSyncTimeUtc, dto.LastSyncTimeUtc);
        Assert.Equal(entity.StorageBytes, dto.StorageBytes);
    }

    [Fact]
    public void CreateGameDto_CreateDto_MapsTo_GameEntity()
    {
        var create = new CreateGameDto
        {
            Name = "n",
            AutoSync = true,
            MaximumLocalGameBackups = 2,
            SyncSourceIdLocations = new Dictionary<string, string> { { "s", "p" } }
        };

        GameEntity entity = create.ToEntity();

        Assert.Null(entity.Id);
        Assert.Equal(create.Name, entity.Name);
        Assert.Equal(create.AutoSync, entity.AutoSync);
        Assert.Equal(create.MaximumLocalGameBackups, entity.MaximumLocalGameBackups);
        Assert.Equal(create.SyncSourceIdLocations, entity.SyncSourceIdLocations);
    }

    [Fact]
    public void UpdateGameDto_MapsTo_GameEntity()
    {
        var update = new UpdateGameDto
        {
            Id = "id",
            Name = "n",
            AutoSync = false,
            IgnoredFilePaths = ["config.ini", "sub/cache.bin"]
        };

        GameEntity entity = update.ToEntity();

        Assert.Equal("id", entity.Id);
        Assert.Equal(update.Name, entity.Name);
        Assert.Equal(update.AutoSync, entity.AutoSync);
        Assert.Equal(update.IgnoredFilePaths, entity.IgnoredFilePaths);
    }

    [Fact]
    public void QuickAddGameDto_MapsTo_GameBulkUpsert()
    {
        var dto = new QuickAddGameDto
        {
            ExistingGameId = "e",
            Path = "C:/g",
            GameName = "G",
            AutoSync = true,
            MaximumLocalGameBackups = 4
        };

        GameBulkUpsert upsert = dto.ToUpsert();

        Assert.Equal(dto.ExistingGameId, upsert.ExistingGameId);
        Assert.Equal(dto.Path, upsert.Path);
        Assert.Equal(dto.GameName, upsert.GameName);
        Assert.Equal(dto.AutoSync, upsert.AutoSync);
        Assert.Equal(dto.MaximumLocalGameBackups, upsert.MaximumLocalGameBackups);
    }
}
