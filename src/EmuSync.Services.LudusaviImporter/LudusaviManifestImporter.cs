using EmuSync.Domain;
using EmuSync.Domain.Services.Interfaces;
using EmuSync.Services.LudusaviImporter.Interfaces;
using System.Net;
using System.Net.Http.Headers;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace EmuSync.Services.LudusaviImporter;

public class LudusaviManifestImporter(
    ILocalDataAccessor localDataAccessor
) : ILudusaviManifestImporter, IDisposable
{
    private readonly ILocalDataAccessor _localDataAccessor = localDataAccessor;

    private const string MANIFEST_URL = "https://raw.githubusercontent.com/mtkennerly/ludusavi-manifest/refs/heads/master/data/manifest.yaml";

    private readonly HttpClient _http = new();

    public async Task<GameDefinitions?> GetManifestAsync(CancellationToken cancellationToken = default)
    {
        var latestResponse = await DownloadLatestManifestAsync(cancellationToken);

        if (latestResponse.Updated && latestResponse.GameDefinitions != null)
        {
            return latestResponse.GameDefinitions;
        }

        string manifestFileName = GetManifestFileName();

        return await _localDataAccessor.ReadFileContentsOrDefaultAsync<GameDefinitions>(manifestFileName, cancellationToken);
    }

    private async Task<LatestManifestResponse> DownloadLatestManifestAsync(CancellationToken cancellationToken = default)
    {
        string lastEtag = await GetLatestEtagAsync(cancellationToken);

        var request = new HttpRequestMessage(HttpMethod.Get, MANIFEST_URL);

        if (!string.IsNullOrWhiteSpace(lastEtag))
        {
            request.Headers.IfNoneMatch.Add(new EntityTagHeaderValue(lastEtag));
        }

        var response = await _http.SendAsync(request, cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotModified)
        {
            return new(null, false, null);
        }

        response.EnsureSuccessStatusCode();

        string? latestEtag = response.Headers.ETag?.Tag;

        var yaml = await response.Content.ReadAsStringAsync(cancellationToken);

        var deserializer = new DeserializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .Build();

        var data = deserializer.Deserialize<Dictionary<string, GameDefinition>>(yaml);

        var definitions = new GameDefinitions()
        {
            Items = data.Where(x => (x.Value.Files?.Keys.Count ?? 0) > 0).ToDictionary()
        };

        var latestManifestResponse = new LatestManifestResponse(definitions, true, latestEtag);

        await SaveNewManifestDetailsAsync(latestManifestResponse, cancellationToken);

        return latestManifestResponse;
    }

    private async Task SaveNewManifestDetailsAsync(LatestManifestResponse latestManifestResponse, CancellationToken cancellationToken)
    {
        if (latestManifestResponse.GameDefinitions != null)
        {
            string manifestFileName = GetManifestFileName();
            await _localDataAccessor.WriteFileContentsAsync(manifestFileName, latestManifestResponse.GameDefinitions, cancellationToken);
        }

        string latestEtagFileName = GetLatestEtagFileName();
        LatestEtag etag = new(latestManifestResponse.LatestEtag);
        await _localDataAccessor.WriteFileContentsAsync(latestEtagFileName, etag, cancellationToken);
    }

    private async Task<string> GetLatestEtagAsync(CancellationToken cancellationToken)
    {
        string latestEtagFileName = GetLatestEtagFileName();
        var latestEtag = await _localDataAccessor.ReadFileContentsOrDefaultAsync<LatestEtag>(latestEtagFileName, cancellationToken);
        return latestEtag?.eTag ?? "";
    }

    private string GetLatestEtagFileName()
    {
        return _localDataAccessor.GetLocalFilePath(DomainConstants.LocalDataLudusaviLastEtagFile);
    }

    private string GetManifestFileName()
    {
        return _localDataAccessor.GetLocalFilePath(DomainConstants.LocalDataLudusaviManifestFile);
    }

    #region Dispose

    private bool _disposedValue;

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposedValue)
        {
            if (disposing)
            {
                // TODO: dispose managed state (managed objects)
                _http.Dispose();
            }

            // TODO: free unmanaged resources (unmanaged objects) and override finalizer
            // TODO: set large fields to null
            _disposedValue = true;
        }
    }

    // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
    // ~LudusaviManifestImporter()
    // {
    //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
    //     Dispose(disposing: false);
    // }

    public void Dispose()
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }

    #endregion Dispose
}

public record LatestManifestResponse(
    GameDefinitions? GameDefinitions,
    bool Updated,
    string? LatestEtag
);

public record LatestEtag(
    string? eTag
);