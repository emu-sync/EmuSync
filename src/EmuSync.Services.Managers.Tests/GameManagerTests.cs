using EmuSync.Domain.Entities;
using EmuSync.Domain.Services.Interfaces;
using EmuSync.Services.Managers.Objects;
using EmuSync.Services.Storage.Interfaces;
using EmuSync.Services.Storage.Objects;
using Microsoft.Extensions.Logging;
using Moq;

namespace EmuSync.Services.Managers.Tests;

public class GameManagerTests
{
    private Mock<ILogger<GameManager>> _logger = new();
    private Mock<ILocalDataAccessor> _local = new();
    private Mock<IStorageProviderFactory> _factory = new();
    private Mock<IStorageProvider> _storage = new();

    private GameManager CreateSut()
    {
        _factory.Setup(f => f.CreateAsync(It.IsAny<CancellationToken>())).ReturnsAsync(_storage.Object);
        return new GameManager(_logger.Object, _local.Object, _factory.Object);
    }

    [Fact]
    public async Task GetAsync_ReturnsGame_WhenGameExists()
    {
        var gameMeta = new GameMetaData { Id = "g1", Name = "Game1" };
        var file = new GameListFile { Games = new List<GameMetaData> { gameMeta } };
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(file);

        var sut = CreateSut();

        var result = await sut.GetAsync("g1");

        Assert.NotNull(result);
        Assert.Equal("g1", result!.Id);
        Assert.Equal("Game1", result.Name);
    }

    [Fact]
    public async Task GetAsync_ReturnsNull_WhenGameDoesNotExist()
    {
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new GameListFile { Games = new List<GameMetaData>() });

        var sut = CreateSut();

        var result = await sut.GetAsync("g1");

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_AddsGame_WhenCalled()
    {
        var entity = new GameEntity { Name = "NewGame" };
        var sut = CreateSut();

        await sut.CreateAsync(entity);

        _storage.Verify(s => s.UpsertJsonDataAsync(It.IsAny<string>(), It.IsAny<object>(), null, It.IsAny<CancellationToken>()), Times.Once);
        Assert.NotNull(entity.Id);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsUpdatedGame_WhenGameExists()
    {
        var original = new GameEntity { Id = "g1", Name = "OldName" };
        var file = new GameListFile { Games = new List<GameMetaData> { GameMetaData.FromGame(original) } };
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(file);

        var sut = CreateSut();

        var updated = await sut.UpdateAsync(new GameEntity { Id = "g1", Name = "NewName" });

        Assert.NotNull(updated);
        Assert.Equal("NewName", updated!.Name);
        _storage.Verify(s => s.UpsertJsonDataAsync(It.IsAny<string>(), It.IsAny<object>(), null, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenGameDoesNotExist()
    {
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new GameListFile { Games = new List<GameMetaData>() });

        var sut = CreateSut();

        var updated = await sut.UpdateAsync(new GameEntity { Id = "g1", Name = "NewName" });

        Assert.Null(updated);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsTrue_WhenGameExists()
    {
        var entity = new GameEntity { Id = "g1", Name = "Game1" };
        var file = new GameListFile { Games = new List<GameMetaData> { GameMetaData.FromGame(entity) } };
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(file);

        var sut = CreateSut();

        var result = await sut.DeleteAsync("g1");

        Assert.True(result);
        _storage.Verify(s => s.DeleteFileAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Once);
        _storage.Verify(s => s.UpsertJsonDataAsync(It.IsAny<string>(), It.IsAny<object>(), null, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenGameDoesNotExist()
    {
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new GameListFile { Games = new List<GameMetaData>() });

        var sut = CreateSut();

        var result = await sut.DeleteAsync("g1");

        Assert.False(result);
    }

    [Fact]
    public async Task UpdateMetaDataAsync_ReturnsTrue_WhenGameExists()
    {
        var entity = new GameEntity { Id = "g1", Name = "Game1", LastSyncedFrom = "source" };
        var file = new GameListFile { Games = new List<GameMetaData> { GameMetaData.FromGame(entity) } };
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(file);

        var sut = CreateSut();

        var updated = await sut.UpdateMetaDataAsync(new GameEntity { Id = "g1", LastSyncedFrom = "newsource" });

        Assert.True(updated);
        _storage.Verify(s => s.UpsertJsonDataAsync(It.IsAny<string>(), It.IsAny<object>(), null, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateMetaDataAsync_CopiesNonIgnoredFileCount()
    {
        var entity = new GameEntity { Id = "g1", Name = "Game1", NonIgnoredFileCount = 1 };
        var file = new GameListFile { Games = new List<GameMetaData> { GameMetaData.FromGame(entity) } };
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(file);

        GameListFile? capturedFile = null;
        _storage
            .Setup(s => s.UpsertJsonDataAsync(It.IsAny<string>(), It.IsAny<object>(), null, It.IsAny<CancellationToken>()))
            .Callback<string, object, Action<double>?, CancellationToken>((_, data, _, _) => capturedFile = (GameListFile)data)
            .Returns(Task.CompletedTask);

        var sut = CreateSut();

        var updated = await sut.UpdateMetaDataAsync(new GameEntity { Id = "g1", NonIgnoredFileCount = 9 });

        Assert.True(updated);
        Assert.NotNull(capturedFile);
        Assert.Equal(9, capturedFile!.Games.Single(x => x.Id == "g1").NonIgnoredFileCount);
    }

    [Fact]
    public async Task UpdateMetaDataAsync_ReturnsFalse_WhenGameDoesNotExist()
    {
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new GameListFile { Games = new List<GameMetaData>() });

        var sut = CreateSut();

        var updated = await sut.UpdateMetaDataAsync(new GameEntity { Id = "g1", LastSyncedFrom = "source" });

        Assert.False(updated);
    }

    [Fact]
    public async Task BulkUpsertAsync_AddsAndUpdatesGames_WhenCalled()
    {
        var existing = new GameEntity { Id = "g1", Name = "OldGame" };
        var file = new GameListFile { Games = new List<GameMetaData> { GameMetaData.FromGame(existing) } };
        _storage.Setup(s => s.GetJsonFileAsync<GameListFile>(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(file);

        var sut = CreateSut();

        var upserts = new List<GameBulkUpsert>
        {
            new() { ExistingGameId = "g1", Path = "C:/updated" },
            new() { ExistingGameId = null, GameName = "NewGame", Path = "C:/new" }
        };

        var changed = await sut.BulkUpsertAsync(upserts, new SyncSourceEntity { Id = "local" });

        Assert.Equal(2, changed.Count);
        Assert.Contains(changed, g => g.Id == "g1");
        Assert.Contains(changed, g => g.Name == "NewGame");
        _storage.Verify(s => s.UpsertJsonDataAsync(It.IsAny<string>(), It.IsAny<object>(), null, It.IsAny<CancellationToken>()), Times.Once);
    }
}