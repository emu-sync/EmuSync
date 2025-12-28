<h1 align="center">
    <img src="./src/EmuSync.UI/assets/icon.png" height=250>
  <br>
  EmuSync
</h1>

## 📖 About

Game save files are stored in different places across OS platforms, which can make syncing a challenge.
EmuSync aims to simplify this by mapping locations from multiple devices to a single sync point, using your chosen cloud storage provider as the storage point.

Easily set up which games you want to keep backed up and let EmuSync handle the rest! It even works in Gaming mode on the SteamDeck - check out the Decky plugin [here](https://github.com/emu-sync/EmuSync-DeckyPlugin).

- If you're having trouble with EmuSync, or want to see in more detail how to use it, please see our [Wiki](https://github.com/emu-sync/EmuSync/wiki).
- Want to see what EmuSync looks like before you download it? Check out the [Preview](https://github.com/emu-sync/EmuSync/wiki/Preview-EmuSync) page in our wiki.

## 🖥️ What devices does EmuSync work on?

EmuSync has primarily been designed and developed for a Windows PC and Steam Deck, but it **_should_** work on any modern Windows or Linux device. 

> ℹ️ **Please note:** I'm currently unable to build and test on Mac.

I currently have no plans to develop an Android and/or iOS version of EmuSync - sorry for any gamers this applies to!

Confirmed working devices (but not limited to):
| Device | Status |
|-|-|
| Windows 10 PC - x64 | ✅ |
| Windows 11 PC - x64 | ✅ |
| Steam Deck | ✅ |


## 🎨 Features
- Use your own cloud storage provider.
    - Google Drive
    - Dropbox
    - OneDrive
- Define and manage your game save locations.
- Automatically detect game saves, making the configuration of your game syncs a breeze.
- Automatically and manually sync game saves.
- Local backup & restore mechanism.
- A Decky plugin for SteamDeck users so you can check on the status of your game syncs without having to hop into desktop mode.
    - [EmuSync-DeckyPlugin](https://github.com/emu-sync/EmuSync-DeckyPlugin)

## 🛠️ Installation

### 💻 Windows 

1. Download the [Windows Installer](https://github.com/emu-sync/EmuSync/releases/latest/download/EmuSync-Win-x64.exe).
1. Run the installer.
    - **PLEASE NOTE**: I am currently unable to code sign the installer, so SmartScreen may flag it as a risk. To continue with the installation, click `More info`, then `Run anyway`.
1. Choose an install location.
1. Click **Install** and wait for the installer to finish.

### 🐧 Linux (Steam Deck)

1. Switch to Desktop mode.
1. Download the [Linux Installer](https://github.com/emu-sync/EmuSync-LinuxInstaller/releases/latest/download/EmuSync-LinuxInstaller.desktop)
    - If you want, you can move this to somewhere more accessible like your desktop.
1. Double click on the installer to run it.
    - The installer needs to use sudo to install some services. This requires a temporary password of `EmuSync!` being set for the user.
    - This password is removed after the installation exits.
    - Click the `Yes` button to set the temporary password.
1. Choose the option `Install EmuSync` and click `OK`.
    - If you're updating EmuSync, choose the `Update EmuSync` option.
1. Wait for the download and installation to finish, then click `OK`.
1. EmuSync is installed at `%USER%/EmuSync`.
    - For the Steam Deck, this will be `home/deck/EmuSync`.
1. Launch EmuSync by double clicking `EmuSync.AppImage`, or use the newly created desktop shortcut.

Check out the EmuSync Decky plugin [here](https://github.com/emu-sync/EmuSync-DeckyPlugin)!

## 👋 Uninstallation

### 💻 Windows 

1. Go to where you installed EmuSync.
    - If you didn't change the location, this will likely be at `C:\Program Files\emusync`
1. Run the uninstaller.

Alternatively, you can uninstall EmuSync through Windows.

1. Search for `Add or remove programs`
1. Search for EmuSync.
1. Find EmuSync and uninstall it - this will open `Uninstall EmuSync.exe`.

### 🐧 Linux (Steam Deck)

1. Switch to Desktop mode.
1. Double click on the installer to run it. 
1. Choose either `Uninstall EmuSync, but keep config` or `Uninstall EmuSync and delete config` and click `OK`.
    - `Uninstall EmuSync, but keep config`: If you want to remove EmuSync but keep and data it has created on your device.
    - `Uninstall EmuSync and delete config`: If you want to completely remove EmuSync and any data it has created on your device.
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
1. Enter a name for the game OR search for a game in the suggestions.
1. If you want EmuSync to keep the game synced in the background, check the `Automatically sync this game?` checkbox.
1. Enter the sync locations for each device you have connected to EmuSync OR if you selected a suggested game, the current device will be populated for you. Always double check the path is correct!
1. Use the `Save changes` button.

## ❓ FAQs
Please see the [FAQs](https://github.com/emu-sync/EmuSync/wiki/FAQs) page in our wiki.

## ❤️ Support EmuSync
EmuSync is free and always will be. However, if you like EmuSync and want to support it, you can contribute via our [Patreon](https://www.patreon.com/cw/EmuSync) page.

Many thanks if you want to support EmuSync, but please only do so if you want to and can afford to.

## ⭐ Honourable mentions
- Big thanks to the [ludusavi-manifest](https://github.com/mtkennerly/ludusavi-manifest) for making game save detection posible.
