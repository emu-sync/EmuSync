# v1.0.0

This is the launch version of EmuSync - thanks for downloading! 

This has been solo developed for my own use, so if you come across any bugs or have requests for features, please raise them in the issues section of the EmuSync GitHub page.

I plan to keep this maintained as long as there's interest. I work full-time though, so responses to bugs and feature requests might take a while.

Otherwise, I hope you enjoy using EmuSync. If you like it, please consider starring it on GitHub or sharing it with your friends.

# v1.0.1

## Changes
- AutoSync has been reworked so it's more configurable.
   - In the `This device` section, you can now change how often EmuSync will check for changes to games.
   - Use the `AutoSync frequency (in minutes)` input to change this.
- You can also see when the next AutoSync check will next occur.

## Fixes
- Fixed an issue where downloading a game save could incorrectly prompt an unnecessary re-upload.


# v1.0.2

## Changes
- Game suggestions are now available for when you're configuring your game syncs!
    - EmuSync will scan your device for known game save locations and show them to you as suggestions.
    - Picking a game suggestion will automatically populate the sync location for the device you're on.
    - This isn't perfect, so some games may not appear in your suggestions, and emulated gave saves aren't supported for suggestions at the moment.
- Added the ability to manually trigger a rescan of your device to search for game saves.
- Added support for OneDrive as a storage provider.

# v1.0.3

This is the same release as 1.0.2, but with a fix for Windows not correctly identifying game saves. If you're on Linux, you can skip this update.

## Changes
- Game suggestions are now available for when you're configuring your game syncs!
    - EmuSync will scan your device for known game save locations and show them to you as suggestions.
    - Picking a game suggestion will automatically populate the sync location for the device you're on.
    - This isn't perfect, so some games may not appear in your suggestions, and emulated gave saves aren't supported for suggestions at the moment.
- Added the ability to manually trigger a rescan of your device to search for game saves.
- Added support for OneDrive as a storage provider.

## Fixes
- Fixed an issue with Windows not detecting games due to service being installed under a different user account.

# v1.0.4

## Changes
- Improved the local device game caching.
    - The reload button in the list should always clear cache now.
    - Whenever AutoSync changes something, the game cache is updated too.
- Added the game save file size to the game list.

# v1.0.5

## Fixes
- Fixed an issue where nested folder structure wasn't being retained on restore from Windows to Linux.

# v1.0.6

## Local game backups
- EmuSync automatically creates a local backup of your game save before downloading a newer version.
    - Backups are stored locally on each of your devices.
    - Control how many backups are kept in the **This device** section (default: 10).
- Easily restore from any previous backup if an incorrect save overwrites your progress.
    - Ideal for recovering from incorrect sync issues.

## Local sync history
- You can now keep track of when EmuSync uploads or downloads files for your configured games.
    - Useful for troubleshooting and understanding exactly when AutoSync occurs.

## Other
- Tweaked the layout of several sections to provide clearer visual structure (hopefully!).

# v1.0.7

- Added a progress indicator when syncing game files.
- Reworked how EmuSync uploads/downloads files .
    - This is mostly for people who are uploading larger folders and may have experienced issues where they'd fail.
- Various minor bugfixes related to the Dropbox storage provider.