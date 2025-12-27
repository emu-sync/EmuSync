using EmuSync.Domain.Entities;
using EmuSync.Domain.Enums;
using EmuSync.Domain.Helpers;
using EmuSync.Domain.Services.Interfaces;
using System.Text.Json;

namespace EmuSync.Domain.Services;

public class LocalSyncLog(ILocalDataAccessor localDataAccessor) : ILocalSyncLog
{
    private readonly ILocalDataAccessor _localDataAccessor = localDataAccessor;
    private readonly long _maxBytes = 5000000; //5 MB

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented = false
    };

    public async Task<List<LocalSyncLogEntity>> GetAllLogsAsync(CancellationToken cancellationToken = default)
    {
        string logPath = GetLogFilePath();
        if (!File.Exists(logPath)) return [];

        var lines = await File.ReadAllLinesAsync(logPath, cancellationToken);

        return lines
            .Select(line => JsonSerializer.Deserialize<LocalSyncLogEntity>(line)!)
            .Reverse() //newest first
            .ToList();
    }

    public async Task<List<LocalSyncLogEntity>> GetAllLogsForGameAsync(string gameId, CancellationToken cancellationToken = default)
    {
        string logPath = GetLogFilePath();
        if (!File.Exists(logPath)) return [];

        var lines = await File.ReadAllLinesAsync(logPath, cancellationToken);

        return lines
            .Select(line => JsonSerializer.Deserialize<LocalSyncLogEntity>(line)!)
            .Where(log => log.GameId == gameId)
            .Reverse() //newest first
            .ToList();
    }


    public Task WriteLogAsync(string gameId, SyncType syncType, bool isAutoSync, CancellationToken cancellationToken = default)
    {
        LocalSyncLogEntity log = new()
        {
            Id = IdHelper.Create(),
            GameId = gameId,
            SyncType = syncType,
            IsAutoSync = isAutoSync,
            SyncTimeUtc = DateTime.UtcNow
        };

        return WriteLogAsync(log, cancellationToken);
    }

    public async Task WriteLogAsync(LocalSyncLogEntity localSyncLog, CancellationToken cancellationToken = default)
    {
        string logPath = GetLogFilePath();
        var json = JsonSerializer.Serialize(localSyncLog, _jsonOptions);

        await File.AppendAllTextAsync(
            logPath,
            json + Environment.NewLine,
            cancellationToken
        );

        TrimOneLineIfNeeded();
    }

    private void TrimOneLineIfNeeded()
    {
        string logPath = GetLogFilePath();
        var info = new FileInfo(logPath);

        if (info.Length <= _maxBytes)
        {
            return;
        }

        //remove the oldest line
        var lines = File.ReadLines(logPath).Skip(1);
        File.WriteAllLines(logPath, lines);
    }

    private string GetLogFilePath()
    {
        return _localDataAccessor.GetLocalFilePath(DomainConstants.LocalDataSyncLogfile);
    }
}