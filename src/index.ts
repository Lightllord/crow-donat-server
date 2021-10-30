import { useExpressServer } from 'routing-controllers';
import { AppController } from './app/app-index';
import { ApiController } from './api/api-index';
import express from 'express';
import { YooAuthController } from './api/yoo-auth';
import { YooApiController } from './api/yoo-api';

const port = 80;

const server = express();

useExpressServer(server, {
  controllers: [
    AppController,
    ApiController,
    YooAuthController,
    YooApiController
  ]
});

// define a route handler for the default home page
server.get('/', (req, res) => {
  res.send('Hello world!');
});

// start the Express server
server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

