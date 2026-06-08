import { IBoardDefinition } from "../interface";

export const Boards: IBoardDefinition[] = [
  {
    name: "Arduino Leonardo",
    ids: [
      [1, 58, 76, 24],
      [1, 1, 0, 0],
    ],
    firmwareFileName: null,
  },
  {
    name: "Arduino Mega",
    ids: [
      [9, 16, 0, 18],
      [1, 16, 0, 18],
    ],
    firmwareFileName: null,
  },
  {
    name: "Arduino Pro Micro",
    ids: [
      [1, 107, 33, 98],
      [1, 5, 13, 73],
    ],
    firmwareFileName: null,
  },
  {
    name: "Arduino Uno",
    ids: [
      [1, 67, 14, 63],
      [1, 11, 120, 50],
    ],
    firmwareFileName: null,
  },
  {
    name: "Teensy++ 2.0",
    ids: [
      [112, 11, 64, 30],
      [1, 11, 64, 30],
    ],
    firmwareFileName: "teensy2pp.dfu.bin",
  },
  {
    name: "Teensy 4.0",
    ids: [[6, 71, 114, 16]],
    firmwareFileName: "teensy4.dfu.bin",
  },
  {
    name: "Teensy 4.1",
    ids: [[84, 8, 82, 102]],
    firmwareFileName: "teensy41.dfu.bin",
  },
  {
    name: "DubFocus v1",
    ids: [[1, 92, 109, 93]],
    firmwareFileName: null,
  },
  {
    name: "DubFocus 12",
    ids: [[85, 74, 109, 41]],
    firmwareFileName: "dubfocus12.dfu.bin",
  },
  {
    name: "DubFocus 16",
    ids: [[61, 70, 72, 25]],
    firmwareFileName: "dubfocus16.dfu.bin",
  },
  {
    name: "STM32F4 Discovery",
    ids: [
      [87, 76, 64, 125],
      [43, 19, 68, 122],
    ],
    firmwareFileName: "discovery_f407g.dfu.bin",
  },
  {
    name: "Jamiel",
    ids: [
      [1, 12, 108, 80],
      [1, 78, 126, 38],
    ],
    firmwareFileName: null,
  },
  {
    name: "Cardamom",
    ids: [[99, 82, 54, 48]],
    firmwareFileName: "cardamom.dfu.bin",
  },
  {
    name: "OpenDeck M v2",
    ids: [[122, 56, 41, 19]],
    firmwareFileName: "opendeck2.dfu.bin",
  },
  {
    name: "OpenDeck M v1",
    ids: [
      [1, 112, 51, 106],
      [1, 91, 42, 85],
      [0, 1, 2, 0],
    ],
    firmwareFileName: null,
  },
  {
    name: "Rooibos",
    ids: [[120, 82, 29, 13]],
    firmwareFileName: "rooibos.dfu.bin",
  },
  {
    name: "Bergamot",
    ids: [[48, 106, 107, 21]],
    firmwareFileName: "bergamot.dfu.bin",
  },
  {
    name: "DubFocus 16C",
    ids: [[44, 111, 98, 103]],
    firmwareFileName: "dubfocus16c.dfu.bin",
  },
  {
    name: "OpenDeck S v1",
    ids: [[62, 78, 115, 114]],
    firmwareFileName: "opendeck_s.dfu.bin",
  },
  {
    name: "BlackPill F401CC",
    ids: [[114, 110, 70, 97]],
    firmwareFileName: "blackpill401cc.dfu.bin",
  },
  {
    name: "BlackPill F401CE",
    ids: [[122, 28, 101, 39]],
    firmwareFileName: "blackpill401ce.dfu.bin",
  },
  {
    name: "BlackPill F411",
    ids: [[18, 87, 110, 75]],
    firmwareFileName: "blackpill411.dfu.bin",
  },
  {
    name: "OpenDeck L v3A",
    ids: [[51, 64, 66, 79]],
    firmwareFileName: "opendeck3a.dfu.bin",
  },
  {
    name: "OpenDeck L v3B",
    ids: [[70, 68, 60, 41]],
    firmwareFileName: "opendeck3b.dfu.bin",
  },
  {
    name: "nRF52840DK",
    ids: [[79, 4, 3, 17]],
    firmwareFileName: "nrf52840dk.dfu.bin",
  },
  {
    name: "nRF5340DK",
    ids: [[96, 79, 62, 55]],
    firmwareFileName: "nrf5340dk.dfu.bin",
  },
  {
    name: "Raspberry Pi Pico",
    ids: [[59, 72, 34, 30]],
    firmwareFileName: "pico.dfu.bin",
  },
  {
    name: "Raspberry Pi Pico 2",
    ids: [[75, 39, 93, 90]],
    firmwareFileName: "pico2.dfu.bin",
  },
  {
    name: "W6100-EVB-Pico",
    ids: [[20, 82, 123, 88]],
    firmwareFileName: "w6100_evb_pico.dfu.bin",
  },
  {
    name: "W6100-EVB-Pico2",
    ids: [[58, 89, 106, 91]],
    firmwareFileName: "w6100_evb_pico2.dfu.bin",
  },
  {
    name: "W5500-EVB-Pico",
    ids: [[94, 101, 119, 52]],
    firmwareFileName: "w5500_evb_pico.dfu.bin",
  },
  {
    name: "W5500-EVB-Pico2",
    ids: [[97, 126, 46, 100]],
    firmwareFileName: "w5500_evb_pico2.dfu.bin",
  },
  {
    name: "Adafruit Metro RP2040",
    ids: [[18, 65, 76, 89]],
    firmwareFileName: "metro_rp2040.dfu.bin",
  },
  {
    name: "Adafruit Metro RP2040 + W5500 Ethernet Shield",
    ids: [[66, 86, 3, 48]],
    firmwareFileName: "metro_rp2040_w5500.dfu.bin",
  },
  {
    name: "Adafruit Metro RP2040 + W6100 Ethernet Shield",
    ids: [[125, 78, 107, 44]],
    firmwareFileName: "metro_rp2040_w6100.dfu.bin",
  },
  {
    name: "Adafruit Metro ESP32-S3",
    ids: [[126, 88, 106, 69]],
    firmwareFileName: "metro_esp32s3.dfu.bin",
  },
  {
    name: "Adafruit Metro ESP32-S3 + W5500 Ethernet Shield",
    ids: [[19, 66, 76, 115]],
    firmwareFileName: "metro_esp32s3_w5500.dfu.bin",
  },
  {
    name: "Adafruit Metro ESP32-S3 + W6100 Ethernet Shield",
    ids: [[41, 54, 17, 17]],
    firmwareFileName: "metro_esp32s3_w6100.dfu.bin",
  },
  {
    name: "LILYGO T-ETH Elite",
    ids: [[109, 50, 40, 60]],
    firmwareFileName: "lilygo_t_eth_elite.dfu.bin",
  },
  {
    name: "Waveshare ESP32-S3-ETH",
    ids: [[74, 114, 47, 99]],
    firmwareFileName: "ws_esp32_s3_eth.dfu.bin",
  },
  {
    name: "OpenDeck M v2.1",
    ids: [[78, 103, 95, 35]],
    firmwareFileName: "opendeck21.dfu.bin",
  },
  {
    name: "OpenDeck L v3.1",
    ids: [[9, 65, 127, 60]],
    firmwareFileName: "opendeck31.dfu.bin",
  },
  {
    name: "OpenDeck M v2.2",
    ids: [[61, 65, 31, 7]],
    firmwareFileName: "opendeck22.dfu.bin",
  },
  {
    name: "DubFocus 12SR",
    ids: [[67, 39, 10, 25]],
    firmwareFileName: "dubfocus12sr.dfu.bin",
  },
  {
    name: "Arduino Nano 33 BLE",
    ids: [[115, 63, 71, 119]],
    firmwareFileName: "nano33ble.dfu.bin",
  },
  {
    name: "Adafruit Grand Central M4",
    ids: [[69, 70, 75, 12]],
    firmwareFileName: "grand_central_m4.dfu.bin",
  },
  {
    name: "Adafruit ItsyBitsy nRF52840 Express",
    ids: [[59, 48, 3, 95]],
    firmwareFileName: "af_ib_nrf52840.dfu.bin",
  },
  {
    name: "DubFocus 16T",
    ids: [[48, 49, 96, 25]],
    firmwareFileName: "dubfocus16t.dfu.bin",
  },
  {
    name: "Waveshare Core405R",
    ids: [[95, 5, 82, 99]],
    firmwareFileName: "ws_core405r.dfu.bin",
  },
  {
    name: "ST Nucleo H753ZI",
    ids: [[112, 120, 105, 83]],
    firmwareFileName: "nucleo_h753zi.dfu.bin",
  },
  {
    name: "ST Nucleo H563ZI",
    ids: [[75, 102, 65, 27]],
    firmwareFileName: "nucleo_h563zi.dfu.bin",
  },
  {
    name: "ST Nucleo F767ZI",
    ids: [[97, 85, 67, 114]],
    firmwareFileName: "nucleo_f767zi.dfu.bin",
  },
  {
    name: "Olimex ESP32 PoE",
    ids: [[103, 22, 105, 107]],
    firmwareFileName: "olimex_esp32_poe.dfu.bin",
  },
  {
    name: "WESP32",
    ids: [[9, 41, 108, 121]],
    firmwareFileName: "wesp32.dfu.bin",
  },
  {
    name: "Thomas 1",
    ids: [[47, 98, 44, 37]],
    firmwareFileName: null,
  },
  {
    name: "Thomas 2",
    ids: [[4, 41, 11, 106]],
    firmwareFileName: null,
  },
];

export default Boards;
