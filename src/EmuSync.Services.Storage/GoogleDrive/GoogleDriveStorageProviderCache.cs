using System.Collections.Concurrent;

namespace EmuSync.Services.Storage.GoogleDrive;

public class GoogleDriveStorageProviderCache()
{
    private string? _dataFolderId;
    private readonly ConcurrentDictionary<string, string> _fileNameIds = new();

    public string? GetDataFolderId()
    {
        return _dataFolderId;
    }

    public void SetDataFolderId(string id)
    {
        _dataFolderId = id;
    }

    public void AddFileNameMapping(string name, string id)
    {
        _fileNameIds.AddOrUpdate(name, id, (_, _) => id);
    }

    public bool TryGetFileId(string name, out string? id)
    {
        return _fileNameIds.TryGetValue(name, out id);
    }

    public void RemoveFileNameMapping(string name)
    {
        _fileNameIds.TryRemove(name, out _);
    }

    public void ClearCache()
    {
        _dataFolderId = null;
        _fileNameIds.Clear();
    }
}