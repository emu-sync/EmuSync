using EmuSync.Agent.Dto.System;
using EmuSync.Services.LudusaviImporter;
using System.Reflection;

namespace EmuSync.Agent.Controllers;

[ApiController]
[Route("[controller]")]
public class SystemController(
    ILogger<SystemController> logger,
    IValidationService validator
) : CustomControllerBase(logger, validator)
{
    [HttpGet("Info")]
    public IActionResult GetSystemInfo(CancellationToken cancellationToken = default)
    {
        LogRequest(nameof(GetSystemInfo));

        var assembly = Assembly.GetExecutingAssembly();

        var versionAttribute = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>();

        string fullVersion = versionAttribute?.InformationalVersion ?? "Unknown";

        string? version = fullVersion.Split("+").FirstOrDefault();
        //string? hash = fullVersion.Split("+").LastOrDefault();

        SystemInfoDto systemInfo = new()
        {
            Version = version ?? "Unknown"
        };

        return Ok(systemInfo);
    }

    [HttpGet("HealthCheck")]
    [HttpPost("HealthCheck")]
    public async Task<IActionResult> HealthCheck(CancellationToken cancellationToken = default)
    {
        return Ok();
    }
}
