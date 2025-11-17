using EmuSync.Services.Storage.Dropbox;
using EmuSync.Services.Storage.GoogleDrive;
using EmuSync.Services.Storage.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EmuSync.Services.Storage.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers the services and config for all external storage providers
    /// </summary>
    /// <param name="services"></param>
    /// <param name="config"></param>
    public static void AddAllExternalStorageProviders(this IServiceCollection services, IConfiguration config)
    {
        services.AddSingleton<IStorageProviderFactory, StorageProviderFactory>();

        services.AddGoogleDriveStorageProvider(config);
        services.AddDropboxStorageProvider(config);
    }

    /// <summary>
    /// Registers the services and config for <see cref="GoogleDriveStorageProvider"/>
    /// </summary>
    /// <param name="services"></param>
    /// <param name="config"></param>
    public static void AddGoogleDriveStorageProvider(this IServiceCollection services, IConfiguration config)
    {
        services.AddSingleton<GoogleDriveStorageProviderCache>();

        services.Configure<GoogleDriveStorageProviderConfig>(
            config.GetSection(GoogleDriveStorageProviderConfig.Section)
        );

        services.AddScoped<GoogleDriveStorageProvider>();
        services.AddSingleton<GoogleAuthHandler>();
    }

    /// <summary>
    /// Registers the services and confir for <see cref="GoogleDriveStorageProvider"/>
    /// </summary>
    /// <param name="services"></param>
    /// <param name="config"></param>
    public static void AddDropboxStorageProvider(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<DropboxStorageProviderConfig>(
            config.GetSection(DropboxStorageProviderConfig.Section)
        );

        services.AddScoped<DropboxStorageProvider>();
        services.AddSingleton<DropboxAuthHandler>();
    }
}