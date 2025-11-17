 using Dropbox.Api;
using EmuSync.Domain.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Web;

namespace EmuSync.Services.Storage.Dropbox;

public class DropboxAuthHandler(
    IOptions<DropboxStorageProviderConfig> options,
    ILocalDataAccessor localDataAccessor
)
{
    private readonly DropboxStorageProviderConfig _options = options.Value;
    private readonly ILocalDataAccessor _localDataAccessor = localDataAccessor;

    private const string TokenFolderName = "dropbox-token";
    private const string TokenFileName = "dropbox-token.json";

    private string _codeVerifier;

    public string GetAuthUrl(string state)
    {
        string url =  DropboxOAuth2Helper.GetAuthorizeUri(
            OAuthResponseType.Code,
            _options.AppKey,
            new Uri(_options.RedirectUri),
            state: state,
            tokenAccessType: TokenAccessType.Offline,
            scopeList: new[] {
                "files.content.read",
                "files.content.write",
                "files.metadata.read",
                "files.metadata.write"
            }
        ).ToString();

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

    public async Task SaveCodeAsync(string code, string state, CancellationToken cancellationToken = default)
    {
        OAuth2Response tokenResult = await DropboxOAuth2Helper.ProcessCodeFlowAsync(
            code,
            _options.AppKey,
            codeVerifier: _codeVerifier,
            redirectUri: _options.RedirectUri
        );

        await SaveTokenAsync(tokenResult, cancellationToken);
    }

    public async Task SaveTokenAsync(OAuth2Response tokenResult, CancellationToken cancellationToken = default)
    {

        string localFilePath = GetTokenFilePath();

        DropboxToken token = new()
        {
            AccessToken = tokenResult.AccessToken,
            RefreshToken = tokenResult.RefreshToken,
            TokenType = tokenResult.TokenType,
            Uid = tokenResult.Uid,
            State = tokenResult.State,
            ExpiresAt = tokenResult.ExpiresAt,
            ScopeList = tokenResult.ScopeList != null ? tokenResult.ScopeList.ToList() : new List<string>()
        };

        await _localDataAccessor.WriteFileContentsAsync(localFilePath, token, cancellationToken);
    }

    public async Task<DropboxToken?> GetTokenAsync(CancellationToken cancellationToken = default)
    {
        string localFilePath = GetTokenFilePath();

        return await _localDataAccessor.ReadFileContentsAsync<DropboxToken?>(localFilePath, cancellationToken);
    }

    public void RemoveToken()
    {
        string localFilePath = GetTokenFilePath();
        _localDataAccessor.RemoveFile(localFilePath);
    }

    private string GetTokenFilePath()
    {
        string path = Path.Combine(TokenFolderName, TokenFileName);
        return _localDataAccessor.GetLocalFilePath(path);
    }
}
