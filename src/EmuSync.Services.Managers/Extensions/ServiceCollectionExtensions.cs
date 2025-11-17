using EmuSync.Services.Managers.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EmuSync.Services.Managers.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds all managers
    /// </summary>
    /// <param name="services"></param>
    /// <param name="config"></param>
    public static void AddAllManagers(this IServiceCollection services, IConfiguration config)
    {
        services.AddScoped<ISyncSourceManager, SyncSourceManager>();
        services.AddScoped<IGameManager, GameManager>();
        services.AddScoped<IGameSyncManager, GameSyncManager>();
    }
}