using EmuSync.Services.Storage.Interfaces;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.Extensions.Options;
using System.Text;
using System.Text.Json;

namespace EmuSync.Services.Storage.GoogleDrive;

public class GoogleDriveStorageProvider(
    IOptions<GoogleDriveStorageProviderConfig> options,
    GoogleAuthHandler authHandler,
    GoogleDriveStorageProviderCache cache
) : IStorageProvider, IDisposable
{
    private readonly GoogleDriveStorageProviderConfig _options = options.Value;
    private readonly GoogleAuthHandler _authHandler = authHandler;
    private readonly GoogleDriveStorageProviderCache _cache = cache;

    private DriveService _driveService;

    public async Task<TData?> GetJsonFileAsync<TData>(string fileName, CancellationToken cancellationToken = default)
    {
        string folderId = await GetOrCreateFolderAsync(StorageConstants.DataFolderName, cancellationToken: cancellationToken);
        string? fileId = await GetFileIdByNameAsync(folderId, fileName, cancellationToken: cancellationToken);

        if (string.IsNullOrEmpty(fileId)) return default;

        try
        {
            return await GetJsonFileContentsAsync<TData>(fileId, cancellationToken);
        }
        catch (Exception)
        {
            _cache.RemoveFileNameMapping(fileName);
            throw;
        }

    }

    public async Task<MemoryStream?> GetZipFileAsync(string fileName, CancellationToken cancellationToken = default)
    {
        string folderId = await GetOrCreateFolderAsync(StorageConstants.DataFolderName, cancellationToken: cancellationToken);
        string? fileId = await GetFileIdByNameAsync(folderId, fileName, cancellationToken: cancellationToken);

        if (string.IsNullOrEmpty(fileId)) return default;

        return await GetZipFileContentsAsync(fileId, cancellationToken);
    }

    public async Task DeleteFileAsync(string fileName, CancellationToken cancellationToken = default)
    {
        string folderId = await GetOrCreateFolderAsync(StorageConstants.DataFolderName, cancellationToken: cancellationToken);
        string? fileId = await GetFileIdByNameAsync(folderId, fileName, cancellationToken: cancellationToken);

        if (string.IsNullOrEmpty(fileId)) return;

        var service = await GetDriveService(cancellationToken);
        await service.Files.Delete(fileId).ExecuteAsync(cancellationToken);

        _cache.RemoveFileNameMapping(fileName);
    }

    public async Task UpsertJsonDataAsync(string fileName, object data, CancellationToken cancellationToken = default)
    {
        string folderId = await GetOrCreateFolderAsync(StorageConstants.DataFolderName, cancellationToken: cancellationToken);

        string? fileId = await GetFileIdByNameAsync(folderId, fileName, cancellationToken: cancellationToken);

        if (string.IsNullOrEmpty(fileId))
        {
            await CreateJsonFileAsync(folderId, fileName, data, cancellationToken);
            return;
        }

        await UpdateJsonFileAsync(fileId, data, cancellationToken);
    }

    public async Task UpsertZipDataAsync(string fileName, MemoryStream stream, CancellationToken cancellationToken = default)
    {
        string folderId = await GetOrCreateFolderAsync(StorageConstants.DataFolderName, cancellationToken: cancellationToken);

        string? fileId = await GetFileIdByNameAsync(folderId, fileName, cancellationToken: cancellationToken);

        if (string.IsNullOrEmpty(fileId))
        {
            await CreateZipFileAsync(folderId, fileName, stream, cancellationToken);
            return;
        }

        await UpdateZipFileAsync(fileId, stream, cancellationToken);
    }

    public void RemoveRelatedFiles()
    {
        _cache.ClearCache();
        _authHandler.RemoveToken();
    }

    /// <summary>
    /// Gets or create a folder
    /// </summary>
    /// <param name="folderName"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<string> GetOrCreateFolderAsync(string folderName, CancellationToken cancellationToken = default)
    {
        string? dataFolderId = _cache.GetDataFolderId();

        if (!string.IsNullOrEmpty(dataFolderId)) return dataFolderId;

        var service = await GetDriveService(cancellationToken);

        //GET THE FOLDER
        FilesResource.ListRequest folderRequest = service.Files.List();
        folderRequest.Q = $"mimeType='application/vnd.google-apps.folder' and name='{folderName}'";
        folderRequest.Fields = "files(id, name)";

        var folderList = await folderRequest.ExecuteAsync(cancellationToken);

        var folder = folderList.Files?.FirstOrDefault();

        if (folder != null)
        {
            dataFolderId = folder.Id;

            _cache.SetDataFolderId(folder.Id);

            return dataFolderId;
        }

        //CREATE THE FOLDER IF IT DOESNT EXIT

        var folderMetadata = new Google.Apis.Drive.v3.Data.File()
        {
            Name = folderName,
            MimeType = "application/vnd.google-apps.folder"
        };

        var newFolderRequest = service.Files.Create(folderMetadata);
        newFolderRequest.Fields = "id, name";

        folder = await newFolderRequest.ExecuteAsync(cancellationToken);

        dataFolderId = folder.Id;

        _cache.SetDataFolderId(folder.Id);

        return dataFolderId;
    }

    /// <summary>
    /// Gets a file from a folder
    /// </summary>
    /// <param name="folderId"></param>
    /// <param name="fileName"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<string?> GetFileIdByNameAsync(string folderId, string fileName, CancellationToken cancellationToken = default)
    {
        bool fileExists = _cache.TryGetFileId(fileName, out string? fileId);

        if (!string.IsNullOrEmpty(fileId)) return fileId;

        var service = await GetDriveService(cancellationToken);

        var request = service.Files.List();
        request.Q = $"'{folderId}' in parents and name='{fileName}' and trashed=false";
        request.Fields = "files(id)";
        request.PageSize = 1; // we just want one

        var result = await request.ExecuteAsync();
        fileId = result.Files?.FirstOrDefault()?.Id;

        if (!string.IsNullOrEmpty(fileId))
        {
            _cache.AddFileNameMapping(fileName, fileId);
        }

        return fileId;
    }

    /// <summary>
    /// Creates a file
    /// </summary>
    /// <param name="folderId"></param>
    /// <param name="fileName"></param>
    /// <param name="data"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<Google.Apis.Drive.v3.Data.File> CreateJsonFileAsync(
        string folderId,
        string fileName,
        object data,
        CancellationToken cancellationToken = default
    )
    {
        var service = await GetDriveService(cancellationToken);

        string json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = false });
        byte[] bytes = Encoding.UTF8.GetBytes(json);

        var fileMetadata = new Google.Apis.Drive.v3.Data.File()
        {
            Name = fileName,
            Parents = new List<string> { folderId }
        };

        using var stream = new MemoryStream(bytes);

        var createRequest = service.Files.Create(fileMetadata, stream, "application/json");
        createRequest.Fields = "id, name";

        await createRequest.UploadAsync(cancellationToken);

        _cache.AddFileNameMapping(fileName, createRequest.ResponseBody.Id);

        return createRequest.ResponseBody;
    }

    /// <summary>
    /// Creates a file
    /// </summary>
    /// <param name="fileId"></param>
    /// <param name="data"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<Google.Apis.Drive.v3.Data.File> UpdateJsonFileAsync(
        string fileId,
        object data,
        CancellationToken cancellationToken = default
    )
    {
        var service = await GetDriveService(cancellationToken);

        string json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = false });
        byte[] bytes = Encoding.UTF8.GetBytes(json);

        using var stream = new MemoryStream(bytes);

        var updateRequest = service.Files.Update(new Google.Apis.Drive.v3.Data.File(), fileId, stream, "application/json");
        updateRequest.Fields = "id, name";
        await updateRequest.UploadAsync();
        return updateRequest.ResponseBody;
    }


    /// <summary>
    /// Creates a file
    /// </summary>
    /// <param name="folderId"></param>
    /// <param name="fileName"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<Google.Apis.Drive.v3.Data.File> CreateZipFileAsync(
        string folderId,
        string fileName,
        MemoryStream stream,
        CancellationToken cancellationToken = default
    )
    {
        var service = await GetDriveService(cancellationToken);

        var fileMetadata = new Google.Apis.Drive.v3.Data.File()
        {
            Name = fileName,
            Parents = new List<string> { folderId }
        };

        var createRequest = service.Files.Create(fileMetadata, stream, "application/zip");
        createRequest.Fields = "id, name";

        await createRequest.UploadAsync(cancellationToken);

        _cache.AddFileNameMapping(fileName, createRequest.ResponseBody.Id);

        return createRequest.ResponseBody;
    }

    /// <summary>
    /// Creates a file
    /// </summary>
    /// <param name="fileId"></param>
    /// <param name="stream"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<Google.Apis.Drive.v3.Data.File> UpdateZipFileAsync(
        string fileId,
        MemoryStream stream,
        CancellationToken cancellationToken = default
    )
    {
        var service = await GetDriveService(cancellationToken);

        var updateRequest = service.Files.Update(new Google.Apis.Drive.v3.Data.File(), fileId, stream, "application/zip");
        updateRequest.Fields = "id, name";
        await updateRequest.UploadAsync();
        return updateRequest.ResponseBody;
    }

    /// <summary>
    /// Gets a JSON file contents
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="fileId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<T> GetJsonFileContentsAsync<T>(string fileId, CancellationToken cancellationToken = default)
    {
        var service = await GetDriveService(cancellationToken);

        var request = service.Files.Get(fileId);

        using var memoryStream = new MemoryStream();
        await request.DownloadAsync(memoryStream, cancellationToken);

        memoryStream.Position = 0;
        using var reader = new StreamReader(memoryStream, Encoding.UTF8);
        string json = await reader.ReadToEndAsync(cancellationToken);

        return JsonSerializer.Deserialize<T>(json)!;
    }

    /// <summary>
    /// Gets a zip file contents
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="fileId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<MemoryStream> GetZipFileContentsAsync(string fileId, CancellationToken cancellationToken = default)
    {
        var service = await GetDriveService(cancellationToken);

        var request = service.Files.Get(fileId);

        var memoryStream = new MemoryStream();
        await request.DownloadAsync(memoryStream, cancellationToken);

        return memoryStream;
    }

    /// <summary>
    /// Connects to the drive service
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task<DriveService> GetDriveService(CancellationToken cancellationToken = default)
    {
        if (_driveService != null) return _driveService;

        UserCredential credential = await _authHandler.CreateCredentialsAsync(cancellationToken);

        var service = new DriveService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = StorageConstants.ApplicationName,
            HttpClientTimeout = Timeout.InfiniteTimeSpan
        });

        _driveService = service;
        return service;
    }

    #region Dispose

    private bool _disposedValue;

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposedValue)
        {
            if (disposing)
            {
                _driveService?.Dispose();
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
