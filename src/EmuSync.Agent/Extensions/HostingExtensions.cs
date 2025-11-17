using Destructurama;
using Serilog;
using Serilog.Expressions;
using Serilog.Settings.Configuration;

namespace EmuSync.Agent.Extensions;

public static class HostingExtensions
{
    /// <summary>
    /// Configure Serilog
    /// </summary>
    /// <param name="host"></param>
    public static void ConfigureSerilog(this IHostApplicationBuilder host, string applicationName, bool clearProviders = true)
    {
        if (clearProviders)
        {
            host.Logging.ClearProviders();
        }

        var options = new ConfigurationReaderOptions(
            typeof(ConsoleLoggerConfigurationExtensions).Assembly, //console sink
            typeof(Serilog.Sinks.File.FileSink).Assembly, //file sink
            typeof(SerilogExpression).Assembly //expression support
        );

        //configure logging - use appSettings to drive the config
        var config = new LoggerConfiguration()
            .ReadFrom.Configuration(host.Configuration)
            .Destructure.UsingAttributes()
            .Enrich.WithProperty("ApplicationName", applicationName);

        //always log to the console
        config.WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] [{ApplicationName}] {Scope} {Message:lj}{NewLine}{Exception}");

        Log.Logger = config.CreateLogger();

        host.Logging.AddSerilog();
    }
}