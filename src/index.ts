import { PORT } from './config';
import createApp from './app';
import log from './utils/logger';

const app = createApp();
const port = PORT || 3000;

app.listen(port, () => {
  log.info(`Server is running on http://localhost:${port}`);
});