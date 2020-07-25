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
  UKNOWN_ERROR = 704,
  UI_QUEUE_REQ_ID_CONFLICT = 711,
  UI_QUEUE_REQ_DATA_MISSING = 712,
  UI_QUEUE_REQ_ALREADY_ACTIVE = 713,
  UI_QUEUE_REQ_NONE_ACTIVE = 714,
}

interface IErrorDefinition {
  code: ErrorCode;
  description: string;
}

const unknownError: IErrorDefinition = {
  code: ErrorCode.UKNOWN_ERROR,
  description: "Missing error description (READ error).",
};

export const errorDefinitions: Record<ErrorCode, IErrorDefinition> = {
  [ErrorCode.UKNOWN_ERROR]: unknownError,
  [ErrorCode.STATUS]: {
    code: ErrorCode.STATUS,
    description:
      "This error happens when MESSAGE_STATUS isn't REQUEST (0) in request.",
  },
  [ErrorCode.HANDSHAKE]: {
    code: ErrorCode.HANDSHAKE,
    description:
      "This error is returned when request is correct, but handshake request hasn't been sent to board (or SysEx connection has been closed).",
  },
  [ErrorCode.WISH]: {
    code: ErrorCode.WISH,
    description:
      "This error is returned when WISH is anything other than GET, SET or BACKUP.",
  },
  [ErrorCode.AMOUNT]: {
    code: ErrorCode.AMOUNT,
    description:
      "This error is returned when AMOUNT is anything other than SINGLE or ALL.",
  },
  [ErrorCode.BLOCK]: {
    code: ErrorCode.BLOCK,
    description: "This error is returned when BLOCK byte is incorrect.",
  },
  [ErrorCode.SECTION]: {
    code: ErrorCode.SECTION,
    description: "This error is returned when SECTION byte is incorrect.",
  },
  [ErrorCode.PART]: {
    code: ErrorCode.PART,
    description: "This error is returned when message part is incorrect.",
  },
  [ErrorCode.INDEX]: {
    code: ErrorCode.INDEX,
    description: "This error is returned when wanted parameter is incorrect.",
  },
  [ErrorCode.NEW_VALUE]: {
    code: ErrorCode.NEW_VALUE,
    description: "This error is returned when NEW_VALUE is incorrect.",
  },
  [ErrorCode.MSG_LENGTH]: {
    code: ErrorCode.MSG_LENGTH,
    description: "This error is returned when request is too short.",
  },
  [ErrorCode.WRITE]: {
    code: ErrorCode.WRITE,
    description:
      "This error is returned when writing new value to board has failed. This can happen if EEPROM on board is damaged (less likely) or if new value is incorrect (more likely).",
  },
  [ErrorCode.NOT_SUPPORTED]: {
    code: ErrorCode.NOT_SUPPORTED,
    description: "This error is returned when X is not supported by the board.",
  },
  [ErrorCode.READ]: {
    code: ErrorCode.READ,
    description: "Missing error description (READ error).",
  },
  [ErrorCode.UI_QUEUE_REQ_ID_CONFLICT]: {
    code: ErrorCode.UI_QUEUE_REQ_ID_CONFLICT,
    description:
      "A Qeue Request tried to acquire next increment ID but it was already used by another request.",
  },
  [ErrorCode.UI_QUEUE_REQ_DATA_MISSING]: {
    code: ErrorCode.UI_QUEUE_REQ_DATA_MISSING,
    description: "A Qeue Request failed to provide data.",
  },
  [ErrorCode.UI_QUEUE_REQ_ALREADY_ACTIVE]: {
    code: ErrorCode.UI_QUEUE_REQ_ALREADY_ACTIVE,
    description: "A Qeue Request was found already active upon starting.",
  },
  [ErrorCode.UI_QUEUE_REQ_NONE_ACTIVE]: {
    code: ErrorCode.UI_QUEUE_REQ_NONE_ACTIVE,
    description:
      "No Qeue Request was found already active upon receiving a MIDI response.",
  },
};

export const getErrorDefinition = (code: ErrorCode): IErrorDefinition =>
  errorDefinitions[code] || unknownError;
