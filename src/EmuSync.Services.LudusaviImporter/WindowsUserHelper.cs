using EmuSync.Domain.Helpers;
using System.Management;

namespace EmuSync.Services.LudusaviImporter;

public static class WindowsUserHelper
{
    public static string GetActiveUserProfile()
    {
        bool isWindows = PlatformHelper.GetOsPlatform() == Domain.Enums.OsPlatform.Windows;

        if (!isWindows) return "";

        // Query the Win32_ComputerSystem for currently logged-in user
        using var searcher = new ManagementObjectSearcher("SELECT UserName FROM Win32_ComputerSystem")
            ;
        var user = searcher.Get()
                           .Cast<ManagementObject>()
                           .Select(mo => mo["UserName"]?.ToString())
                           .FirstOrDefault();

        if (string.IsNullOrEmpty(user))
            throw new InvalidOperationException("No interactive user found.");

        // Extract just the username
        var username = user.Split('\\').Last();

        return username;
    }
}