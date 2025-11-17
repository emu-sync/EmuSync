namespace EmuSync.Domain.Helpers;

public static class IdHelper
{
    /// <summary>
    /// Create a new guid ID
    /// </summary>
    /// <returns></returns>
    public static string Create()
    {
        return Guid.NewGuid().ToString("N");
    }
}
