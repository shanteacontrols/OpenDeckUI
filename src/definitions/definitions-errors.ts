export enum ErrorCode {
  STATUS = 2,
  HANDSHAKE = 3,
  WISH = 4,
  AMOUNT = 5,
  BLOCK = 6,
  SECTION = 7,
  PART = 8,
  INDEX = 9,
  NEW_VALUE = 10,
  MSG_LENGTH = 11,
  WRITE = 12,
  NOT_SUPPORTED = 13,
  READ = 14,
}

interface IErrorDefinition {
  code: number;
  key: string;
  description: string;
}

const unknownError: IErrorDefinition = {
  code: 14,
  key: "READ",
  description: "Missing error description (READ error).",
};

export const errorDefinitions: IErrorDefinition[] = [
  {
    code: 2,
    key: "STATUS",
    description:
      "This error happens when MESSAGE_STATUS isn't REQUEST (0) in request.",
  },
  {
    code: 3,
    key: "HANDSHAKE",
    description:
      "This error is returned when request is correct, but handshake request hasn't been sent to board (or SysEx connection has been closed).",
  },
  {
    code: 4,
    key: "WISH",
    description:
      "This error is returned when WISH is anything other than GET, SET or BACKUP.",
  },
  {
    code: 5,
    key: "AMOUNT",
    description:
      "This error is returned when AMOUNT is anything other than SINGLE or ALL.",
  },
  {
    code: 6,
    key: "BLOCK",
    description: "This error is returned when BLOCK byte is incorrect.",
  },
  {
    code: 7,
    key: "SECTION",
    description: "This error is returned when SECTION byte is incorrect.",
  },
  {
    code: 8,
    key: "PART",
    description: "This error is returned when message part is incorrect.",
  },
  {
    code: 9,
    key: "INDEX",
    description: "This error is returned when wanted parameter is incorrect.",
  },
  {
    code: 10,
    key: "NEW_VALUE",
    description: "This error is returned when NEW_VALUE is incorrect.",
  },
  {
    code: 11,
    key: "MSG_LENGTH",
    description: "This error is returned when request is too short.",
  },
  {
    code: 12,
    key: "WRITE",
    description:
      "This error is returned when writing new value to board has failed. This can happen if EEPROM on board is damaged (less likely) or if new value is incorrect (more likely).",
  },
  {
    code: 13,
    key: "NOT_SUPPORTED",
    description: "This error is returned when X is not supported by the board.",
  },
  {
    code: 14,
    key: "READ",
    description: "Missing error description (READ error).",
  },
];

export const getErrorDefinition = (value: number): IErrorDefinition => {
  const definition = errorDefinitions.find(
    (def: IErrorDefinition) => def.code === value
  );

  return definition || unknownError;
};
