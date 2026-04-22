# OpenDeck Configurator

- [Usage](#usage)
- [Relationship To Firmware Releases](#relationship-to-firmware-releases)
- [Prerequisites](#prerequisites)
- [Starting the Development Environment](#starting-the-development-environment)
- [Running the UI from This Repository](#running-the-ui-from-this-repository)
- [Building](#building)
- [Packaging Offline Desktop Builds](#packaging-offline-desktop-builds)
- [Cleaning](#cleaning)
- [License](#license)

`opendeck-ui` is the web configurator for the OpenDeck MIDI
platform.

It provides the user-facing configuration interface for OpenDeck devices,
including:

- device identification
- configurable component settings
- preset and system settings
- firmware update checks
- WebUSB bootloader firmware updates
- backup and restore

The firmware, hardware targets, and main documentation live in the main
[OpenDeck repository](https://github.com/shanteacontrols/OpenDeck).

*Click the image below for a demo video of the [OpenDeck configurator](https://config.shanteacontrols.com)*

[![Watch the video](https://img.youtube.com/vi/7X2LC0JMfAU/maxresdefault.jpg)](https://youtu.be/7X2LC0JMfAU)

## Usage

The configurator is available in two forms:

- online at [config.shanteacontrols.com](https://config.shanteacontrols.com)
- as offline desktop packages attached to releases

Offline release packages are published per platform:

- `darwin-arm64`
- `darwin-x64`
- `linux-x64`
- `win32-x64`

## Relationship To Firmware Releases

The configurator identifies supported boards by their OpenDeck target UID.
For supported targets, it also knows the expected firmware release asset name
used for update checks and download links.

Current firmware-update assets are expected to use the flattened release names
produced by the main project release helper, for example:

- `pico.dfu.bin`
- `pico2.dfu.bin`
- `blackpill411.dfu.bin`

## Prerequisites

This project uses Yarn, Vite, Vue 3, and Electron. All the used tools are packaged in a Docker container.

The officially supported host environments are Ubuntu 22.04 and 24.04 with:

* `docker-ce`
* [Visual Studio Code](https://code.visualstudio.com/docs/setup/linux)
* the [Remote Development extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

Also ensure that your user account is in the `docker` group so that Docker commands can run without `sudo`.

## Starting the Development Environment

From the `opendeck-ui/` repository root, run:

```sh
code .
```

VSCode will offer to reopen the repository in the devcontainer. Choose `Reopen in Container`.

The devcontainer is the supported development environment and contains Node.js, Yarn, Electron Packager, Wine, and the extra tools used by this repository.

## Running the UI from This Repository

From the repository root inside the devcontainer, run:

```sh
make
```

This installs dependencies if needed and starts the local development server.

If you prefer the direct command, the equivalent is:

```sh
yarn
yarn dev
```

## Building

To build the web application bundle to be published on a web server:

```sh
make prod
```

This runs the Vite production build and writes the output to `dist/`.

## Packaging Offline Desktop Builds

To package the Electron-based offline configurator:

```sh
make pkg PLATFORM=linux
make pkg PLATFORM=win32
make pkg PLATFORM=darwin ARCH=x64
make pkg PLATFORM=darwin ARCH=arm64
```

The packaged zip archive is written to `build/`.

These macOS release archives are packaged on Linux and are not signed or
notarized. Apple Silicon support is therefore published as a separate
`darwin-arm64` zip, and end users may still need to explicitly allow the app
through macOS Gatekeeper.

## Cleaning

To remove generated build output:

```sh
make clean
```

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE).
