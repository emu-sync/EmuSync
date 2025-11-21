using EmuSync.Agent.Background;
using EmuSync.Agent.Dto.Common;
using EmuSync.Agent.Extensions;
using EmuSync.Agent.Middleware;
using EmuSync.Agent.Services;
using EmuSync.Domain.Enums;
using EmuSync.Domain.Extensions;
using EmuSync.Domain.Helpers;
using EmuSync.Services.Managers.Extensions;
using EmuSync.Services.Storage.Extensions;
using FluentValidation;
using Serilog;

namespace EmuSync.Agent;

public class Program
{
    private const string CorsDefaultPolicyName = "CORSOrigins";

    public static void Main(string[] args)
    {
        var exeDirectory = AppContext.BaseDirectory;
        Directory.SetCurrentDirectory(exeDirectory);

        var builder = WebApplication.CreateBuilder(args);
        builder.ConfigureSerilog("emusync-agent");

        try
        {
            builder.Configuration.AddEnvironmentVariables();

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.ListenLocalhost(5353, listenOptions =>
                {

                });
            });

            OsPlatform platform = PlatformHelper.GetOsPlatform();

            if (platform == OsPlatform.Windows)
            {
                builder.Host.UseWindowsService();
            }
            else if (platform == OsPlatform.Linux)
            {
                builder.Host.UseSystemd();
            }

            builder.Configuration.AddEnvironmentVariables();

            ConfigureServices(builder);

            var app = builder.Build();
            ConfigurePipeline(app);

            app.Run();
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error caught in app startup");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    private static void ConfigureServices(WebApplicationBuilder builder)
    {
        IServiceCollection services = builder.Services;
        IConfiguration config = builder.Configuration;
        IWebHostEnvironment environment = builder.Environment;

        #region CORS

        //set up cors - the allowed origins will come from our config
        var corsOrigins = config.GetSection(CorsDefaultPolicyName).Get<string[]>();

        Log.Information("CORS origins {@corsOrigins}", corsOrigins);

        services.AddCors(options =>
        {
            options.AddPolicy(CorsDefaultPolicyName, policy =>
            {
                if (corsOrigins != null && corsOrigins.Length > 0)
                {
                    policy.WithOrigins(corsOrigins);
                    policy.AllowCredentials();
                }
                else
                {
                    policy.AllowAnyOrigin();
                }

                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
            });
        });

        #endregion

        #region Auth


        #endregion

        #region Controllers / routing

        services.AddControllers(options =>
        {
            options.Filters.Add<HttpResponseExceptionFilter>();
        })
        .AddJsonOptions(options =>
        {
            //options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        });

        services.AddRouting(options =>
        {
            options.LowercaseUrls = true;
        });

        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.SuppressModelStateInvalidFilter = true; //stop the automatic response handling of ModelState
            options.SuppressMapClientErrors = true;
        });


        #endregion

        builder.Services.AddSingleton<ISyncTasks, SyncTasks>();
        builder.Services.AddSingleton<IApiCache, ApiCache>();
        builder.Services.AddSingleton<IGameSyncStatusCache, GameSyncStatusCache>();
        builder.Services.AddScoped<IGameSyncService, GameSyncService>();
        builder.Services.AddScoped<ISyncTaskProcessor, SyncTaskProcessor>();

        services.Configure<GameSyncWorkerConfig>(
            config.GetSection(GameSyncWorkerConfig.Section)
        );

        builder.Services.AddHostedService<GameSyncWorker>();

        builder.Services.AddHostedService<SyncTaskWorker>();


        services.AddValidatorsFromAssemblyContaining<ErrorResponseDto>();
        builder.Services.AddScoped<IValidationService, FluentValidationService>();

        builder.Services.AddLocalDataAccessor(config);
        builder.Services.AddAllManagers(config);

        builder.Services.AddAllExternalStorageProviders(config);
    }

    private static void ConfigurePipeline(WebApplication app)
    {
        IConfiguration config = app.Configuration;
        IWebHostEnvironment environment = app.Environment;
        IServiceProvider serviceProvider = app.Services;

        app.UseCors(CorsDefaultPolicyName);

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
    }
}