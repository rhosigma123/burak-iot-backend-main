import { PORT } from './config';
import createApp from './app';
import log from './utils/logger';

const { app, server } = createApp();
const port = PORT || 3000;

server.listen(port, () => {
  log.info(`Server is running on http://localhost:${port}`);
});