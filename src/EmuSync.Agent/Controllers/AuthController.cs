using EmuSync.Agent.Dto.Auth;
using EmuSync.Domain.Enums;
using EmuSync.Services.Managers.Interfaces;
using EmuSync.Services.Storage.Dropbox;
using EmuSync.Services.Storage.GoogleDrive;

namespace EmuSync.Agent.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController(
    DropboxAuthHandler dropboxAuthHandler,
    GoogleAuthHandler googleAuthHandler,
    ISyncSourceManager syncSourceManager
) : ControllerBase
{
    private readonly DropboxAuthHandler _dropboxAuthHandler = dropboxAuthHandler;
    private readonly GoogleAuthHandler _googleAuthHandler = googleAuthHandler;
    private readonly ISyncSourceManager _syncSourceManager = syncSourceManager;

    [HttpGet("Dropbox/AuthUrl")]
    public IActionResult GetDropboxAuthUrl()
    {
        string state = Guid.NewGuid().ToString("N");
        string url = _dropboxAuthHandler.GetAuthUrl(state);

        DropboxAuthUrlResponseDto response = new()
        {
            Url = url,
            State = state
        };

        return Ok(response);
    }

    [HttpGet("Dropbox/AuthFinish")]
    public async Task<IActionResult> DropboxAuthFinish([FromQuery] string code, [FromQuery] string state, CancellationToken cancellationToken)
    {
        await _dropboxAuthHandler.SaveCodeAsync(code, state, cancellationToken);

        StorageProvider storageProvider = StorageProvider.Dropbox;
        await _syncSourceManager.SetLocalStorageProviderAsync(storageProvider, cancellationToken);

        return SuccessfulAuth();
    }

    [HttpGet("Google/AuthUrl")]
    public IActionResult GetGoogleAuthUrl()
    {
        string url = _googleAuthHandler.GetAuthUrl();

        GoogleAuthUrlResponseDto response = new()
        {
            Url = url,
        };

        return Ok(response);
    }

    [HttpGet("Google/AuthFinish")]
    public async Task<IActionResult> GoogleAuthFinish([FromQuery] string code, CancellationToken cancellationToken)
    {
        await _googleAuthHandler.SaveCodeAsync(code, cancellationToken);

        StorageProvider storageProvider = StorageProvider.GoogleDrive;
        await _syncSourceManager.SetLocalStorageProviderAsync(storageProvider, cancellationToken);

        return SuccessfulAuth();
    }

    private IActionResult SuccessfulAuth()
    {
        return Ok("Auth successful - please close this window");
    }
}
