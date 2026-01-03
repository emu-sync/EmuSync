namespace EmuSync.Domain.Objects;

public class ProgressStream : Stream
{
    private readonly Stream _inner;
    private readonly Action<double>? _reportProgress;
    private readonly ulong _totalSize; // Explicit total size
    private long _totalRead;

    public ProgressStream(Stream inner, Action<double>? reportProgress, ulong totalSize = 0)
    {
        _inner = inner ?? throw new ArgumentNullException(nameof(inner));
        _reportProgress = reportProgress;

        _totalSize = totalSize > 0 ? totalSize : (inner.CanSeek ? (ulong)inner.Length : 0);
    }

    public override bool CanRead => _inner.CanRead;
    public override bool CanSeek => _inner.CanSeek;
    public override bool CanWrite => _inner.CanWrite;
    public override long Length => _inner.Length;
    public override long Position
    {
        get => _inner.Position;
        set => _inner.Position = value;
    }

    public override void Flush() => _inner.Flush();

    public override int Read(byte[] buffer, int offset, int count)
    {
        int read = _inner.Read(buffer, offset, count);
        Report(read);
        return read;
    }

    public override async Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
    {
        int read = await _inner.ReadAsync(buffer, offset, count, cancellationToken);
        Report(read);
        return read;
    }

    public override void Write(byte[] buffer, int offset, int count)
    {
        _inner.Write(buffer, offset, count);
        Report(count);
    }

    public override async Task WriteAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
    {
        await _inner.WriteAsync(buffer, offset, count, cancellationToken);
        Report(count);
    }

    private void Report(int count)
    {
        if (_reportProgress == null || count <= 0 || _totalSize <= 0) return;

        _totalRead += count;
        double percent = (_totalRead / (double)_totalSize) * 100;
        _reportProgress(percent);
    }

    public override long Seek(long offset, SeekOrigin origin) => _inner.Seek(offset, origin);
    public override void SetLength(long value) => _inner.SetLength(value);
}
