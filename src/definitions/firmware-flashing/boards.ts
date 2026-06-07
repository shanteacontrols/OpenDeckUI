export enum FlashAction {
  None = "none",
  Download = "download",
  DfuSe = "dfuse",
  Esp32 = "esp32",
  Teensy = "teensy",
  Bossa = "bossa",
}

export interface IFlashBoard {
  name: string;
  target: string;
  action: FlashAction;
  artifactFileName?: string;
  description: string;
  descriptionLinkText?: string;
  descriptionLinkUrl?: string;
  descriptionAfterLink?: string;
}

const wikiImageBaseUrl =
  "https://github.com/shanteacontrols/OpenDeck/wiki/img/boards";

export const releaseDownloadBaseUrl =
  "https://github.com/shanteacontrols/OpenDeck/releases/latest/download";

export const boardImageUrl = (target: string): string =>
  `${wikiImageBaseUrl}/${target}.webp`;

export const artifactDownloadUrl = (fileName: string): string =>
  `${releaseDownloadBaseUrl}/${fileName}`;

const raspberryPiUf2Description =
  "Put the board into the Raspberry Pi bootloader. A disk drive named RPI-RP2 will appear. Download the UF2 file and copy it to that drive.";

const nrf52840HexDescription =
  "Put the board into bootloader mode. A disk drive will appear. Download the HEX file and copy it to that drive.";

const nrfConnectDesktopDescription =
  "Download the firmware file, then use ";

const nrfConnectDesktopUrl =
  "https://www.nordicsemi.com/Products/Development-tools/nRF-Connect-for-Desktop";

const grandCentralUf2Description =
  "Double-tap reset if needed to enter bootloader mode. Download the UF2 file and copy it to the Grand Central bootloader drive.";

const esp32WebSerialDescription =
  "Put the board into the ESP32 serial bootloader, then flash the OpenDeck firmware directly from this browser.";

const teensyWebHidDescription =
  "Press the program button to enter the Teensy bootloader, then flash the OpenDeck firmware directly from this browser.";

const arduinoBossaDescription =
  "Double-tap reset to enter the Arduino bootloader, then flash the OpenDeck firmware directly from this browser.";

export const FlashBoards: IFlashBoard[] = [
  {
    name: "Arduino Nano 33 BLE",
    target: "arduino_nano_33_ble",
    action: FlashAction.Bossa,
    artifactFileName: "arduino_nano_33_ble.bin",
    description: arduinoBossaDescription,
  },
  {
    name: "STM32F411 Black Pill",
    target: "blackpill411",
    action: FlashAction.DfuSe,
    artifactFileName: "blackpill411.bin",
    description:
      "Put the board into the STM32 ROM DFU bootloader, then flash the OpenDeck firmware directly from this browser.",
  },
  {
    name: "STM32F4 Discovery",
    target: "discovery_f407g",
    action: FlashAction.DfuSe,
    artifactFileName: "discovery_f407g.bin",
    description:
      "Bridge BOOT0 to VDD and PB2 to GND, connect both USB cables, then reset the board to enter the STM32 ROM DFU bootloader. Once flashing is complete, remove the jumpers and reboot the board.",
  },
  {
    name: "Adafruit Grand Central M4",
    target: "grand_central_m4",
    action: FlashAction.Download,
    artifactFileName: "grand_central_m4.uf2",
    description: grandCentralUf2Description,
  },
  {
    name: "Adafruit Metro RP2040",
    target: "metro_rp2040",
    action: FlashAction.Download,
    artifactFileName: "metro_rp2040.uf2",
    description: raspberryPiUf2Description,
  },
  {
    name: "Adafruit Metro RP2040 + W5500 Ethernet Shield",
    target: "metro_rp2040_w5500",
    action: FlashAction.Download,
    artifactFileName: "metro_rp2040_w5500.uf2",
    description: raspberryPiUf2Description,
  },
  {
    name: "Adafruit Metro RP2040 + W6100 Ethernet Shield",
    target: "metro_rp2040_w6100",
    action: FlashAction.Download,
    artifactFileName: "metro_rp2040_w6100.uf2",
    description: raspberryPiUf2Description,
  },
  {
    name: "Raspberry Pi Pico",
    target: "pico",
    action: FlashAction.Download,
    artifactFileName: "pico.uf2",
    description: raspberryPiUf2Description,
  },
  {
    name: "Raspberry Pi Pico 2",
    target: "pico2",
    action: FlashAction.Download,
    artifactFileName: "pico2.uf2",
    description: raspberryPiUf2Description,
  },
  {
    name: "W5500-EVB-Pico",
    target: "w5500_evb_pico",
    action: FlashAction.Download,
    artifactFileName: "w5500_evb_pico.uf2",
    description: raspberryPiUf2Description,
  },
  {
    name: "W5500-EVB-Pico2",
    target: "w5500_evb_pico2",
    action: FlashAction.Download,
    artifactFileName: "w5500_evb_pico2.uf2",
    description: raspberryPiUf2Description,
  },
  {
    name: "W6100-EVB-Pico",
    target: "w6100_evb_pico",
    action: FlashAction.Download,
    artifactFileName: "w6100_evb_pico.uf2",
    description: raspberryPiUf2Description,
  },
  {
    name: "W6100-EVB-Pico2",
    target: "w6100_evb_pico2",
    action: FlashAction.Download,
    artifactFileName: "w6100_evb_pico2.uf2",
    description: raspberryPiUf2Description,
  },
  {
    name: "nRF52840 DK",
    target: "nrf52840dk",
    action: FlashAction.Download,
    artifactFileName: "nrf52840dk.hex",
    description: nrf52840HexDescription,
  },
  {
    name: "nRF5340 DK",
    target: "nrf5340dk",
    action: FlashAction.Download,
    artifactFileName: "nrf5340dk.hex",
    description: nrfConnectDesktopDescription,
    descriptionLinkText: "nRF Connect for Desktop",
    descriptionLinkUrl: nrfConnectDesktopUrl,
    descriptionAfterLink: " to flash it to the board.",
  },
  {
    name: "ST Nucleo F767ZI",
    target: "nucleo_f767zi",
    action: FlashAction.DfuSe,
    artifactFileName: "nucleo_f767zi.bin",
    description:
      "Bridge CN11 pin 5 to CN11 pin 7, power the board from the ST-LINK USB connector, connect the user USB connector, then reset the board to enter the STM32 ROM DFU bootloader. Once flashing is complete, remove the jumper and reboot the board.",
  },
  {
    name: "ST Nucleo H563ZI",
    target: "nucleo_h563zi",
    action: FlashAction.DfuSe,
    artifactFileName: "nucleo_h563zi.bin",
    description:
      "Bridge CN11 pin 5 to CN11 pin 7, power the board from the ST-LINK USB connector, connect the user USB connector, then reset the board to enter the STM32 ROM DFU bootloader. Once flashing is complete, remove the jumper and reboot the board.",
  },
  {
    name: "ST Nucleo H753ZI",
    target: "nucleo_h753zi",
    action: FlashAction.DfuSe,
    artifactFileName: "nucleo_h753zi.bin",
    description:
      "Bridge CN11 pin 5 to CN11 pin 7, power the board from the ST-LINK USB connector, connect the user USB connector, then reset the board to enter the STM32 ROM DFU bootloader. Once flashing is complete, remove the jumper and reboot the board.",
  },
  {
    name: "Teensy 4.0",
    target: "teensy4",
    action: FlashAction.Teensy,
    artifactFileName: "teensy4.hex",
    description: teensyWebHidDescription,
  },
  {
    name: "Teensy 4.1",
    target: "teensy41",
    action: FlashAction.Teensy,
    artifactFileName: "teensy41.hex",
    description: teensyWebHidDescription,
  },
  {
    name: "Waveshare Core405R",
    target: "ws_core405r",
    action: FlashAction.DfuSe,
    artifactFileName: "ws_core405r.bin",
    description:
      "Put the boot config switch in System position, then reset the board to enter the STM32 ROM DFU bootloader. Once flashing is complete, restore the switch and reboot the board.",
  },
  {
    name: "Adafruit Metro ESP32-S3",
    target: "metro_esp32s3",
    action: FlashAction.Esp32,
    artifactFileName: "metro_esp32s3.bin",
    description: esp32WebSerialDescription,
  },
  {
    name: "Adafruit Metro ESP32-S3 + W5500 Ethernet Shield",
    target: "metro_esp32s3_w5500",
    action: FlashAction.Esp32,
    artifactFileName: "metro_esp32s3_w5500.bin",
    description: esp32WebSerialDescription,
  },
  {
    name: "Adafruit Metro ESP32-S3 + W6100 Ethernet Shield",
    target: "metro_esp32s3_w6100",
    action: FlashAction.Esp32,
    artifactFileName: "metro_esp32s3_w6100.bin",
    description: esp32WebSerialDescription,
  },
  {
    name: "LILYGO T-ETH Elite",
    target: "lilygo_t_eth_elite",
    action: FlashAction.Esp32,
    artifactFileName: "lilygo_t_eth_elite.bin",
    description: esp32WebSerialDescription,
  },
  {
    name: "Olimex ESP32 PoE",
    target: "olimex_esp32_poe",
    action: FlashAction.Esp32,
    artifactFileName: "olimex_esp32_poe.bin",
    description: esp32WebSerialDescription,
  },
  {
    name: "WESP32",
    target: "wesp32",
    action: FlashAction.Esp32,
    artifactFileName: "wesp32.bin",
    description: esp32WebSerialDescription,
  },
  {
    name: "Waveshare ESP32-S3-ETH",
    target: "ws_esp32_s3_eth",
    action: FlashAction.Esp32,
    artifactFileName: "ws_esp32_s3_eth.bin",
    description: esp32WebSerialDescription,
  },
];
