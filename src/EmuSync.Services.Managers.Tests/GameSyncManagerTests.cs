using Moq;
using Microsoft.Extensions.Logging;
using EmuSync.Domain.Entities;
using EmuSync.Domain.Enums;
using EmuSync.Domain.Helpers;
using EmuSync.Domain.Results;
using EmuSync.Domain.Services.Interfaces;
using EmuSync.Services.Managers;
using EmuSync.Services.Managers.Interfaces;
using EmuSync.Services.Managers.Results;
using EmuSync.Services.Storage.Interfaces;
using Xunit;

namespace EmuSync.Services.Managers.Tests;

public class GameSyncManagerTests
{
    private readonly Mock<ILogger<GameSyncManager>> _logger = new();
    private readonly Mock<ILocalDataAccessor> _local = new();
    private readonly Mock<IStorageProviderFactory> _factory = new();
    private readonly Mock<IGameManager> _gameManager = new();
    private readonly Mock<ILocalSyncLog> _localSyncLog = new();
    private readonly Mock<ILocalGameSaveBackupService> _backupService = new();
    private readonly Mock<ISyncProgressTracker> _progressTracker = new();

    private GameSyncManager CreateSut() => new(
        _logger.Object,
        _local.Object,
        _factory.Object,
        _gameManager.Object,
        _localSyncLog.Object,
        _backupService.Object,
        _progressTracker.Object
    );

    [Fact]
    public void GetSyncType_NoLastSync_AndDirExists_Returns_RequiresUpload()
    {
        var game = new GameEntity { Id = "g1" };
        var scan = new DirectoryScanResult { DirectoryExists = true, DirectoryIsSet = true };

        _local.Setup(x =>
            x.ScanDirectory(
                It.IsAny<string?>(),
                It.IsAny<IgnoredFileMatcher?>()
            )
        ).Returns(scan);

        var sut = CreateSut();
        var result = sut.GetSyncType("s1", game);

        Assert.Equal(GameSyncStatus.RequiresUpload, result.SyncStatus);
    }

    [Fact]
    public void GetSyncType_NoDirectorySet_Returns_UnsetDirectory()
    {
        var game = new GameEntity { Id = "g1", LastSyncTimeUtc = DateTime.UtcNow };
        var scan = new DirectoryScanResult { DirectoryIsSet = false };

        _local.Setup(x =>
            x.ScanDirectory(
                It.IsAny<string?>(),
                It.IsAny<IgnoredFileMatcher?>()
            )
        ).Returns(scan);

        var sut = CreateSut();
        var result = sut.GetSyncType("s1", game);

        Assert.Equal(GameSyncStatus.UnsetDirectory, result.SyncStatus);
    }

    [Fact]
    public void GetSyncType_LocalMissing_Returns_RequiresDownload()
    {
        var game = new GameEntity { Id = "g1", LastSyncTimeUtc = DateTime.UtcNow };
        var scan = new DirectoryScanResult
        {
            DirectoryIsSet = true,
            DirectoryExists = false,
            LatestDirectoryWriteTimeUtc = null
        };

        _local.Setup(x =>
            x.ScanDirectory(
                It.IsAny<string?>(),
                It.IsAny<IgnoredFileMatcher?>()
            )
        ).Returns(scan);

        var sut = CreateSut();
        var result = sut.GetSyncType("s1", game);

        Assert.Equal(GameSyncStatus.RequiresDownload, result.SyncStatus);
    }

    [Fact]
    public void GetSyncType_LocalFileNewerThanCloud_Returns_RequiresUpload()
    {
        var game = new GameEntity
        {
            Id = "g1",
            LastSyncTimeUtc = DateTime.UtcNow.AddHours(-2),
            LatestWriteTimeUtc = DateTime.UtcNow.AddHours(-2)
        };

        var scan = new DirectoryScanResult
        {
            DirectoryIsSet = true,
            DirectoryExists = true,
            LatestFileWriteTimeUtc = DateTime.UtcNow
        };

        _local.Setup(x =>
            x.ScanDirectory(
                It.IsAny<string?>(),
                It.IsAny<IgnoredFileMatcher?>()
            )
        ).Returns(scan);

        var sut = CreateSut();
        var result = sut.GetSyncType("s1", game);

        Assert.Equal(GameSyncStatus.RequiresUpload, result.SyncStatus);
    }

    [Fact]
    public void GetSyncType_OnlyDirectoryTimeNewer_DoesNotTriggerUpload()
    {
        //regression test: editing an ignored file (e.g. an atomic save rewrite) bumps the parent
        //directory's mtime even though no non-ignored file changed - this must not force an upload
        var baseline = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        var game = new GameEntity
        {
            Id = "g1",
            LastSyncTimeUtc = baseline,
            LatestWriteTimeUtc = baseline,
            NonIgnoredFileCount = 5
        };

        var scan = new DirectoryScanResult
        {
            DirectoryIsSet = true,
            DirectoryExists = true,
            LatestFileWriteTimeUtc = baseline,
            LatestDirectoryWriteTimeUtc = baseline.AddHours(3),
            FileCount = 5
        };

        _local.Setup(x =>
            x.ScanDirectory(
                It.IsAny<string?>(),
                It.IsAny<IgnoredFileMatcher?>()
            )
        ).Returns(scan);

        var sut = CreateSut();
        var result = sut.GetSyncType("s1", game);

        Assert.Equal(GameSyncStatus.InSync, result.SyncStatus);
    }

    [Fact]
    public void GetSyncType_NonIgnoredFileCountDecreased_Returns_RequiresUpload()
    {
        //a non-ignored file being deleted doesn't bump any remaining file's mtime, so the file
        //count is the only signal available to detect it
        var baseline = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        var game = new GameEntity
        {
            Id = "g1",
            LastSyncTimeUtc = baseline,
            LatestWriteTimeUtc = baseline,
            NonIgnoredFileCount = 5
        };

        var scan = new DirectoryScanResult
        {
            DirectoryIsSet = true,
            DirectoryExists = true,
            LatestFileWriteTimeUtc = baseline,
            FileCount = 4
        };

        _local.Setup(x =>
            x.ScanDirectory(
                It.IsAny<string?>(),
                It.IsAny<IgnoredFileMatcher?>()
            )
        ).Returns(scan);

        var sut = CreateSut();
        var result = sut.GetSyncType("s1", game);

        Assert.Equal(GameSyncStatus.RequiresUpload, result.SyncStatus);
    }

    [Fact]
    public void GetSyncType_NonIgnoredFileCountUnset_DoesNotForceUpload()
    {
        //games synced before this field existed have no stored count yet - must not mass-trigger
        //uploads the first time they're scanned post-upgrade
        var baseline = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        var game = new GameEntity
        {
            Id = "g1",
            LastSyncTimeUtc = baseline,
            LatestWriteTimeUtc = baseline,
            NonIgnoredFileCount = null
        };

        var scan = new DirectoryScanResult
        {
            DirectoryIsSet = true,
            DirectoryExists = true,
            LatestFileWriteTimeUtc = baseline,
            FileCount = 3
        };

        _local.Setup(x =>
            x.ScanDirectory(
                It.IsAny<string?>(),
                It.IsAny<IgnoredFileMatcher?>()
            )
        ).Returns(scan);

        var sut = CreateSut();
        var result = sut.GetSyncType("s1", game);

        Assert.Equal(GameSyncStatus.InSync, result.SyncStatus);
    }

    [Fact]
    public void GetSyncType_Passes_IgnoredFilePaths_To_Scan()
    {
        var game = new GameEntity { Id = "g1", IgnoredFilePaths = ["config.ini"] };
        var scan = new DirectoryScanResult { DirectoryExists = true, DirectoryIsSet = true };

        _local.Setup(x =>
            x.ScanDirectory(
                It.IsAny<string?>(),
                It.IsAny<IgnoredFileMatcher?>()
            )
        ).Returns(scan);

        var sut = CreateSut();
        sut.GetSyncType("s1", game);

        _local.Verify(x =>
            x.ScanDirectory(
                It.IsAny<string?>(),
                It.Is<IgnoredFileMatcher?>(m => m != null && m.IsIgnored("config.ini"))
            ),
            Times.Once
        );
    }

    [Fact]
    public async Task ForceDownloadGameAsync_Throws_When_NoPath()
    {
        var game = new GameEntity { Id = "g1" };
        var sut = CreateSut();

        await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await sut.ForceDownloadGameAsync("s1", game, true)
        );
    }

    [Fact]
    public async Task ForceUploadGameAsync_Throws_When_NoPath()
    {
        var game = new GameEntity { Id = "g1" };
        var sut = CreateSut();

        await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await sut.ForceUploadGameAsync("s1", game, true)
        );
    }

    [Fact]
    public async Task ForceUploadGameAsync_StoresNonIgnoredFileCount_FromScanResult()
    {
        string tempFolder = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(tempFolder);
        string tempZipPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString(), "temp.zip");

        try
        {
            var game = new GameEntity
            {
                Id = "g1",
                SyncSourceIdLocations = new Dictionary<string, string> { { "s1", tempFolder } }
            };

            var scan = new DirectoryScanResult
            {
                DirectoryExists = true,
                DirectoryIsSet = true,
                FileCount = 4,
                StorageBytes = 100,
                LatestFileWriteTimeUtc = DateTime.UtcNow
            };

            _local.Setup(x => x.ScanDirectory(It.IsAny<string?>(), It.IsAny<IgnoredFileMatcher?>())).Returns(scan);
            _local.Setup(x => x.GetLocalFilePath(It.IsAny<string>())).Returns(tempZipPath);

            var storage = new Mock<IStorageProvider>();
            storage
                .Setup(x => x.UpsertZipDataAsync(It.IsAny<string>(), It.IsAny<Stream>(), It.IsAny<Action<double>?>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
            _factory.Setup(x => x.CreateAsync(It.IsAny<CancellationToken>())).ReturnsAsync(storage.Object);

            GameEntity? capturedEntity = null;
            _gameManager
                .Setup(x => x.UpdateMetaDataAsync(It.IsAny<GameEntity>(), It.IsAny<Action<double>?>(), It.IsAny<CancellationToken>()))
                .Callback<GameEntity, Action<double>?, CancellationToken>((entity, _, _) => capturedEntity = entity)
                .ReturnsAsync(true);

            var sut = CreateSut();
            await sut.ForceUploadGameAsync("s1", game, true);

            Assert.NotNull(capturedEntity);
            Assert.Equal(4, capturedEntity!.NonIgnoredFileCount);
        }
        finally
        {
            try { Directory.Delete(tempFolder, true); } catch { }
            try { File.Delete(tempZipPath); } catch { }
        }
    }
}