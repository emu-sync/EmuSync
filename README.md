<h1 align="center">
    <img src="./src/EmuSync.UI/assets/icon.png" height=250>
  <br>
  EmuSync
</h1>

## 📖 About

Game save files are stored in different places across OS platforms, which can make syncing a challenge.
EmuSync aims to simplifies this by mapping locations from multiple devices to a single sync point.

It has primarily been designed and developed for a Windows PC and Steam Deck, but should work on any modern Windows or Linux device (I'm currently unable to build and test on Mac, sorry).

If you're having trouble with EmuSync, see the FAQs section below or within the EmuSync app in the `Home` section. Any bugs can be raised in the [GitHub issues](https://github.com/emu-sync/EmuSync/issues/new) page.

## 🎨 Features
- Use your own cloud storage provider.
    - Google Drive
    - Dropbox
- Define and manage your game save locations.
- Automatically and manually sync game saves.

## 🛠️ Installation

### 💻 Windows 

1. Download the [Windows Installer](https://github.com/emu-sync/EmuSync/releases/latest/download/EmuSync-Win-x64.exe).
1. Run the installer.
    - **PLEASE NOTE**: I am currently unable to code sign the installer, so SmartScreen may flag it as a risk. To continue with the installation, click `More info`, then `Run anyway`.
1. Choose an install location.
1. Click **Install** and wait for the installer to finish.

### 🐧 Linux (Steam Deck)

1. Switch to Desktop mode
1. Download the [Linux Installer](https://github.com/emu-sync/EmuSync-LinuxInstaller/releases/latest/download/EmuSync-LinuxInstaller.desktop)
    - If you want, you can move this to somewhere more accessible like your desktop
1. Double click on the installer to run it.
    - The installer needs to use sudo to install some services. This requires a temporary password of `EmuSync!` being set for the user.
    - This password is removed after the installation exits.
    - Click the `Yes` button to set the temporary password.
1. Choose the option `Install EmuSync` and click `OK`.
    - If you're updating EmuSync, choose the `Update EmuSync` option.
1. Wait for the download and installation to finish, then click `OK`.
1. EmuSync is installer to `%USER%/EmuSync`
    - For the Steam Deck, this will be `home/deck/EmuSync`.
1. Launch EmuSync by double clicking `EmuSync.AppImage`.

## 👋 Uninstallation

### 💻 Windows 

1. Go to where you installed EmuSync.
    - If you didn't change the location, this will likely be at `C:\Program Files\emusync`
1. Run the uninstaller.

### 🐧 Linux (Steam Deck)

1. Switch to Desktop mode
1. Double click on the installer to run it. 
1. Choose either `Unistall EmuSync, but keep config` or `Unistall EmuSync and delete config` and click `OK`.
    - `Unistall EmuSync, but keep config`: If you want remove EmuSync but keep and data it has created on your device
    - `Unistall EmuSync and delete config`: If you want to completely remove EmuSync and any data it has created on your device
1. Wait for the uninstallation to complete.

## 🚀 Getting started
With EmuSync installed, you first need to log in to your storage provider. This is where EmuSync will store your game saves, as well as using it as a pseudo database.

### 💾 Setting up a storage provider
1. Go to `This device`.
1. In the `Storage provider` section, select one of the available storage providers.
1. A window should pop up, prompting you to log in and grant EmuSync permission.
1. After you've successfully logged in, close the window.
1. You should now see your linked storage provider!

Now you've linked a storage provider, you can start defining your games and where their save locations are.

### 🎮 Setting up a game sync
1. Go to `Games`.
1. In the top left, use the `Add new game` button.
1. Enter a name for the game.
1. If you want EmuSync to keep the game synced in the background, check the `Automatically sync this game?` checkbox. I recommend **NOT** enabling this until you're comfortable with how EmuSync works.
1. Enter the sync locations for each device you have connected to EmuSync.
1. Use the `Save changes` button.

To edit an existing game, click on it in the games list. Here, you can also manually sync the save files on the device.

## ❓ FAQs
### EmuSync is slow
EmuSync uses your cloud storage provider as a pseudo document storage database - this is what keeps EmuSync free, because we don't pay any hosting costs!

Cloud storage providers are not designed to work in this way, so unfortunately EmuSync is at the mercy of the latency from your cloud storage provider.


### What does "The EmuSync agent is not running." mean?
The EmuSync agent is a separate process that needs to run on your device. It handles automatic syncing in the background, even when you don't have EmuSync open, but is also the back-end to this application. If it's not running, you'll need to start it.

You may need to close and reopen EmuSync after you restart the agent.

### 💻 To start it on Windows: 

1. Press Win + R.  
1. Type `services.msc` and press the `OK` button.  
1. In the service list, look for `EmuSyncAgent` and right click on it.  
1. Use the `Start` option and wait for the service to start.  

### 🐧 To start it on Linux:

1. I recommend running the installer script again, choosing update, which will remove the service and reinstall it.


### Which games/emulators work with EmuSync?
Any! In fact, EmuSync doesn't even know or care about which games or emulators you use, it just syncs the contents of a folder.

### How do I know where my game saves are stored?
Some emulators make it easy to find the save location of your games. In some cases, you can right click on your game within the emulator and look for an option `Open user save directory` or similar.  
If your emulator doesn't have this option, you should check the official documentation of the emulator for where it stores game saves.

If you're using EmuSync for non-Steam games, [SteamDB](https://steamdb.info/) is a great resource for finding the save location of your game.

Search for your game, go to the `Cloud saves` tab and look for the Path under the `Save File Locations` heading.  
It'll usually look something like this for Windows: `%USERPROFILE%/AppData/LocalLow/{FOLDERS SPECIFIC TO THE GAME}`

On the Steam Deck, the path will look something like this: `/home/deck/.local/share/Steam/steamapps/compatdata/{PROTON OR STEAM GAME ID}/pfx/drive_c/users/steamuser/AppData/LocalLow/{FOLDERS SPECIFIC TO THE GAME}`

Using [Protontricks](https://github.com/Matoking/protontricks) can make it easy to find these game IDs.


### I found a bug - where can I raise it?
Please raise any issues you find with EmuSync on our [GitHub issues](https://github.com/emu-sync/EmuSync/issues/new) page.

## ❤️ Support EmuSync
EmuSync is free and always will be. However, if you like EmuSync and want to support it, you can contribute via our [Patreon](https://www.patreon.com/cw/EmuSync) page.

Many thanks if you want to support EmuSync, but please only do so if you want to and can afford to.