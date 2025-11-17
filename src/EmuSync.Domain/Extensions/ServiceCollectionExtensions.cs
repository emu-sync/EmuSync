using EmuSync.Domain.Services;
using EmuSync.Domain.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EmuSync.Domain.Extensions;

public static class ServiceCollectionExtensions
{

    /// <summary>
    /// Add the <see cref="LocalDataAccessor"/>
    /// </summary>
    /// <param name="services"></param>
    /// <param name="config"></param>
    public static void AddLocalDataAccessor(this IServiceCollection services, IConfiguration config)
    {
        services.AddSingleton<ILocalDataAccessor, LocalDataAccessor>();
    }
}