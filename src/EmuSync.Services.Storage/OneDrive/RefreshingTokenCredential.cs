namespace EmuSync.Services.Storage.OneDrive;

public class RefreshingTokenCredential(MicrosoftAuthHandler authHandler)
{
    private readonly MicrosoftAuthHandler _authHandler = authHandler;

    public async Task<string> GetTokenAsync(CancellationToken cancellationToken)
    {
        var token = await _authHandler.GetTokenAsync(cancellationToken);
        if (token == null) throw new InvalidOperationException("No token found");

        if (token.IsExpired())
        {
            token = await _authHandler.RefreshTokenAsync(token, cancellationToken);
        }

        return token.AccessToken;
    }
}