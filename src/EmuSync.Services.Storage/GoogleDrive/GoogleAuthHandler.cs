using EmuSync.Domain.Services.Interfaces;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Drive.v3;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text.Json;
using System.Web;

namespace EmuSync.Services.Storage.GoogleDrive;

public class GoogleAuthHandler(
    IOptions<GoogleDriveStorageProviderConfig> options,
    ILocalDataAccessor localDataAccessor
)
{
    private const string UserId = "local-user";
    private readonly GoogleDriveStorageProviderConfig _options = options.Value;
    private readonly ILocalDataAccessor _localDataAccessor = localDataAccessor;

    private const string TokenFolderName = "google-token";
    private const string TokenFileName = "google-token.json";

    private string _codeVerifier;

    public string GetAuthUrl()
    {
        string url = CreateCodeFlow()
            .CreateAuthorizationCodeRequest(_options.RedirectUri)
            .Build()
            .AbsoluteUri;

        string codeVerifier = PkceHelper.GenerateCodeVerifier();
        string codeChallenge = PkceHelper.CreateCodeChallenge(codeVerifier);
        _codeVerifier = codeVerifier;

        //append PKCE parameters manually
        var uriBuilder = new UriBuilder(url);

        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        query["code_challenge"] = codeChallenge;
        query["code_challenge_method"] = "S256";

        uriBuilder.Query = query.ToString();

        string finalUrl = uriBuilder.ToString();
        return finalUrl;
    }

    public async Task SaveCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        using var client = new HttpClient();

        var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["client_id"] = _options.ClientId,
            ["grant_type"] = "authorization_code",
            ["code"] = code,
            ["redirect_uri"] = _options.RedirectUri,
            ["code_verifier"] = _codeVerifier
        });

        var response = await client.PostAsync("https://oauth2.googleapis.com/token", content);

        string json = await response.Content.ReadAsStringAsync();

        response.EnsureSuccessStatusCode();

        TokenResponse token = JsonConvert.DeserializeObject<TokenResponse>(json)!;

        string localFilePath = GetTokenFilePath();
        await _localDataAccessor.WriteFileContentsAsync(localFilePath, token, cancellationToken);
    }

    public async Task<TokenResponse?> GetTokenAsync(CancellationToken cancellationToken = default)
    {
        string localFilePath = GetTokenFilePath();

        return await _localDataAccessor.ReadFileContentsAsync<TokenResponse?>(localFilePath, cancellationToken);
    }

    public void RemoveToken()
    {
        string localFilePath = GetTokenFilePath();
        _localDataAccessor.RemoveFile(localFilePath);
    }

    public async Task<UserCredential> CreateCredentialsAsync(CancellationToken cancellationToken)
    {
        var flow = CreateCodeFlow();
        var token = await GetTokenAsync(cancellationToken);

        return new UserCredential(flow, UserId, token);
    }

    private GoogleAuthorizationCodeFlow CreateCodeFlow()
    {
        return new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = _options.ClientId,
                ClientSecret = ""
            },
            Scopes = new[] { DriveService.Scope.DriveFile }
        });
    }

    private string GetTokenFilePath()
    {
        string path = Path.Combine(TokenFolderName, TokenFileName);
        return _localDataAccessor.GetLocalFilePath(path);
    }
}
