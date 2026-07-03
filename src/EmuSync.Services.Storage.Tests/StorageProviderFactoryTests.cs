using EmuSync.Domain;
using EmuSync.Domain.Entities;
using EmuSync.Domain.Enums;
using EmuSync.Domain.Services.Interfaces;
using EmuSync.Services.Storage.GoogleDrive;
using Microsoft.Extensions.DependencyInjection;
using Moq;

namespace EmuSync.Services.Storage.Tests;

public class StorageProviderFactoryTests
{
    private readonly Mock<ILocalDataAccessor> _local = new();
    private readonly Mock<IServiceProvider> _serviceProvider = new();
    private readonly Mock<IServiceScopeFactory> _scopeFactory = new();
    private readonly Mock<IServiceScope> _scope = new();
    private readonly Mock<IServiceProvider> _scopeProvider = new();

    private StorageProviderFactory CreateSut() =>
        new(_local.Object, _serviceProvider.Object);

    public StorageProviderFactoryTests()
    {
        _serviceProvider.Setup(x => x.GetService(typeof(IServiceScopeFactory))).Returns(_scopeFactory.Object);
        _scopeFactory.Setup(x => x.CreateScope()).Returns(_scope.Object);
        _scope.Setup(x => x.ServiceProvider).Returns(_scopeProvider.Object);
    }

    [Fact]
    public void Create_Throws_NotImplementedException_When_ProviderIsUnknown()
    {
        var sut = CreateSut();
        Assert.Throws<NotImplementedException>(() => sut.Create((StorageProvider)999));
    }

    [Fact]
    public async Task CreateAsync_Returns_Null_When_FileDoesNotExist()
    {
        string tempFile = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString(), "sync.json");
        _local.Setup(x => x.GetLocalFilePath(DomainConstants.LocalDataSyncSourceFile)).Returns(tempFile);

        var sut = CreateSut();
        var result = await sut.CreateAsync();

        Assert.Null(result);
    }}
