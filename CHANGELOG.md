# v1.0.0

This is the launch version of EmuSync - thanks for downloading! 

This has been solo developed for my own use, so if you come across any bugs or have requests for features, please raise them in the issues section of the EmuSync GitHub page.

I plan to keep this maintained as long as there's interest. I work full-time though, so responses to bugs and feature requests might take a while.

Otherwise, I hope you enjoy using EmuSync. If you like it, please consider starring it on GitHub or sharing it with your friends.

Many thanks,

Rhys

# v1.0.1

## Changes
- AutoSync has been reworked so it's more configurable.
   - In the `This device` section, you can now change how often EmuSync will check for changes to games.
   - Use the `AutoSync frequency (in minutes)` input to change this.
- You can also see when the next AutoSync check will next occur.

## Fixes
- Fixed an issue where downloading a game save could incorrectly prompt an unnecessary re-upload.

## Upcoming features
- Support for OneDrive (hopefully).
- Suggestions for game saves already on your device, making it easier and less manual to set up games.



# v1.0.2

## Changes
- Game suggestions are now available for when you're configuring your game syncs!
    - EmuSync will scan your device for known game save locations and show them to you as suggestions.
    - Picking a game suggestion will automatically populate the sync location for the device you're on.
    - This isn't perfect, so some games may not appear in your suggestions, and emulated gave saves aren't supported for suggestions at the moment.
- Added the ability to manually trigger a rescan of your device to search for game saves.
- Added support for OneDrive as a storage provider.

## Upcoming features
- I'm thinking of adding a device specific sync log/history so you can review when saves were uploaded from/downloaded to the device

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

## Upcoming features
- I'm thinking of adding a device specific sync log/history so you can review when saves were uploaded from/downloaded to the device