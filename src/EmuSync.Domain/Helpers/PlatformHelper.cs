using EmuSync.Domain.Enums;

namespace EmuSync.Domain.Helpers;

public static class PlatformHelper
{
    /// <summary>
    /// Determines the <see cref="OsPlatform"/> of this device
    /// </summary>
    /// <returns></returns>
    public static OsPlatform GetOsPlatform()
    {

        if (OperatingSystem.IsWindows())
        {
            return OsPlatform.Windows;
        }
        else if (OperatingSystem.IsLinux())
        {
            return OsPlatform.Linux;
        }
        else if (OperatingSystem.IsMacOS())
        {
            return OsPlatform.Mac;
        }

        return OsPlatform.Unknown;
    }
}
