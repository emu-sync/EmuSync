using EmuSync.Domain.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Web;


namespace EmuSync.Services.Storage.OneDrive;

public class MicrosoftAuthHandler(
    IOptions<OneDriveStorageProviderConfig> options,
    ILocalDataAccessor localDataAccessor
)
{
    private readonly OneDriveStorageProviderConfig _options = options.Value;
    private readonly ILocalDataAccessor _localDataAccessor = localDataAccessor;

    private const string TokenFolderName = "microsoft-token";
    private const string TokenFileName = "microsoft-token.json";

    public string GetAuthUrl()
    {
        string authEndpoint = $"https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

        var query = HttpUtility.ParseQueryString(string.Empty);
        query["client_id"] = _options.ClientId;
        query["response_type"] = "code";
        query["redirect_uri"] = _options.RedirectUri;
        query["response_mode"] = "query";
        query["scope"] = "Files.ReadWrite.AppFolder offline_access";
        query["state"] = "123123";

        var uriBuilder = new UriBuilder(authEndpoint)
        {
            Query = query.ToString()
        };

        return uriBuilder.ToString();
    }

    public async Task SaveCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        using var client = new HttpClient();

        var body = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string,string>("client_id", _options.ClientId),
            new KeyValuePair<string,string>("scope", "Files.ReadWrite.AppFolder offline_access"),
            new KeyValuePair<string,string>("code", code),
            new KeyValuePair<string,string>("redirect_uri", _options.RedirectUri),
            new KeyValuePair<string,string>("grant_type", "authorization_code"),
            //new KeyValuePair<string,string>("client_secret", _options.ClientSecret)
        });

        var response = await client.PostAsync($"https://login.microsoftonline.com/common/oauth2/v2.0/token", body, cancellationToken);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var tokenResult = JsonSerializer.Deserialize<OneDriveToken>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;

        tokenResult.ObtainedAt = DateTimeOffset.UtcNow;

        await SaveTokenAsync(tokenResult, cancellationToken);
    }

    public async Task SaveTokenAsync(OneDriveToken tokenResult, CancellationToken cancellationToken = default)
    {
        string localFilePath = GetTokenFilePath();
        await _localDataAccessor.WriteFileContentsAsync(localFilePath, tokenResult, cancellationToken);
    }

    public async Task<OneDriveToken?> GetTokenAsync(CancellationToken cancellationToken = default)
    {
        string localFilePath = GetTokenFilePath();
        return await _localDataAccessor.ReadFileContentsAsync<OneDriveToken?>(localFilePath, cancellationToken);
    }

    public void RemoveToken()
    {
        string localFilePath = GetTokenFilePath();
        _localDataAccessor.RemoveFile(localFilePath);
    }

    public async Task<OneDriveToken> RefreshTokenAsync(OneDriveToken token, CancellationToken cancellationToken = default)
    {
        using var client = new HttpClient();

        var body = new FormUrlEncodedContent(new[]
        {
        new KeyValuePair<string,string>("client_id", _options.ClientId),
        new KeyValuePair<string,string>("scope", "Files.ReadWrite.AppFolder offline_access"),
        new KeyValuePair<string,string>("refresh_token", token.RefreshToken),
        new KeyValuePair<string,string>("grant_type", "refresh_token"),
    });

        var response = await client.PostAsync("https://login.microsoftonline.com/common/oauth2/v2.0/token", body, cancellationToken);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(cancellationToken);
        var newToken = JsonSerializer.Deserialize<OneDriveToken>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;

        newToken.ObtainedAt = DateTimeOffset.UtcNow;

        await SaveTokenAsync(newToken, cancellationToken);

        return newToken;
    }

    private string GetTokenFilePath()
    {
        return _localDataAccessor.GetLocalFilePath(Path.Combine(TokenFolderName, TokenFileName));
    }
}