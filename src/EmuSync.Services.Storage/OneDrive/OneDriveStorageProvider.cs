using EmuSync.Domain.Objects;
using EmuSync.Services.Storage.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace EmuSync.Services.Storage.OneDrive;

//raw dog the API with HttpClient - the graph SDK is SO bad

public class OneDriveStorageProvider(
    IOptions<OneDriveStorageProviderConfig> options,
    MicrosoftAuthHandler authHandler
) : IStorageProvider, IDisposable
{
    private readonly OneDriveStorageProviderConfig _options = options.Value;
    private readonly MicrosoftAuthHandler _authHandler = authHandler;

    private HttpClient _httpClient;

    public async Task<TData?> GetJsonFileAsync<TData>(string fileName, CancellationToken cancellationToken = default)
    {
        var client = await GetClientAsync(cancellationToken);

        string path = $"{fileName}:/content";

        using var request = await BuildRequestMessageAsync(
            path,
            HttpMethod.Get,
            cancellationToken: cancellationToken
        );

        using var response = await client.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode) return default;

        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return JsonSerializer.Deserialize<TData>(content);
    }

    public async Task<MemoryStream?> GetZipFileAsync(string fileName, Action<double>? onProgress = null, CancellationToken cancellationToken = default)
    {
        var client = await GetClientAsync(cancellationToken);

        string path = $"{fileName}:/content";

        using var request = await BuildRequestMessageAsync(
            path,
            HttpMethod.Get,
            cancellationToken: cancellationToken
        );

        using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var memoryStream = new MemoryStream();

        var buffer = new byte[81920];
        long totalRead = 0;
        long? totalLength = response.Content.Headers.ContentLength;

        int read;
        while ((read = await stream.ReadAsync(buffer, cancellationToken)) > 0)
        {
            await memoryStream.WriteAsync(buffer.AsMemory(0, read), cancellationToken);
            totalRead += read;

            if (totalLength.HasValue && onProgress != null)
            {
                double percent = (totalRead / (double)totalLength.Value) * 100;
                onProgress(percent);
            }
        }

        memoryStream.Position = 0;
        return memoryStream;
    }

    public async Task DeleteFileAsync(string fileName, CancellationToken cancellationToken = default)
    {
        var client = await GetClientAsync(cancellationToken);

        string path = $"{fileName}";

        using var request = await BuildRequestMessageAsync(
            path,
            HttpMethod.Delete,
            cancellationToken: cancellationToken
        );

        using var response = await client.SendAsync(request, cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return;
        }

        response.EnsureSuccessStatusCode();
    }

    public async Task UpsertJsonDataAsync(
        string fileName,
        object data,
        Action<double>? onProgress = null,
        CancellationToken cancellationToken = default
    )
    {
        var client = await GetClientAsync(cancellationToken);

        string path = $"{fileName}:/content";

        string json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = false });
        byte[] bytes = Encoding.UTF8.GetBytes(json);

        using var stream = new MemoryStream(bytes);
        using var progressStream = new ProgressStream(stream, onProgress);

        using var request = await BuildRequestMessageAsync(
            path,
            HttpMethod.Put,
            progressStream,
            "application/json",
            cancellationToken
        );

        using var response = await client.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
    }

    public async Task UpsertZipDataAsync(
        string fileName,
        MemoryStream stream,
        Action<double>? onProgress = null,
        CancellationToken cancellationToken = default
    )
    {
        var client = await GetClientAsync(cancellationToken);

        string path = $"/{fileName}:/content";

        using var progressStream = new ProgressStream(stream, onProgress);

        using var request = await BuildRequestMessageAsync(
            path,
            HttpMethod.Put,
            progressStream,
            "application/zip",
            cancellationToken
        );

        using var response = await client.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
    }

    public void RemoveRelatedFiles()
    {
        _authHandler.RemoveToken();
    }


    /// <summary>
    /// Connects to the graph client service
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<HttpClient> GetClientAsync(CancellationToken cancellationToken = default)
    {
        var token = await _authHandler.GetTokenAsync(cancellationToken);

        if (token == null)
        {
            throw new InvalidOperationException("No microsoft token is present on the device");
        }

        _httpClient ??= new()
        {
            Timeout = Timeout.InfiniteTimeSpan
        };

        return _httpClient;

    }

    private async Task<HttpRequestMessage> BuildRequestMessageAsync(
        string path,
        HttpMethod method,
        Stream? content = null,
        string? contentType = null,
        CancellationToken cancellationToken = default
    )
    {
        var credential = new RefreshingTokenCredential(_authHandler);
        string token = await credential.GetTokenAsync(cancellationToken);

        string url = $"https://graph.microsoft.com/v1.0/me/drive/special/approot:/{path}";
        var request = new HttpRequestMessage(method, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        if (content != null)
        {
            request.Content = new StreamContent(content);

            if (!string.IsNullOrEmpty(contentType))
            {
                request.Content.Headers.ContentType = new MediaTypeHeaderValue(contentType);
            }
        }

        return request;
    }

    #region Dispose

    private bool _disposedValue;

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposedValue)
        {
            if (disposing)
            {
                _httpClient?.Dispose();
            }

            // TODO: free unmanaged resources (unmanaged objects) and override finalizer
            // TODO: set large fields to null
            _disposedValue = true;
        }
    }

    // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
    // ~GoogleDriveStorageProvider()
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

    #endregion
}