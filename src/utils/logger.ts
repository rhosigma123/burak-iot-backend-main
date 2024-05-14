import logger from "pino";
import dayjs from "dayjs";
import { LOGLEVEL } from "../config";

const log = logger({
  transport: {
    target: "pino-pretty",
  },
  level: LOGLEVEL,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;