import { NextFunction, Response } from 'express';
/* eslint-disable import/prefer-default-export */
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { itemsRouter } from './routes/items';
import errorHandler from './error-handler';
import request from 'request';
require('dotenv').config();
const router = express.Router();
const app = express();

const middleware = (req: any, res: Response, next: NextFunction): void => {
  req.token = token;
  req.edToken = edToken;
  next();
};

app.set('trust proxy', true);
app.use(json());
app.use(middleware);
router.use(itemsRouter);
let token: string = '';
let edToken: string[];

const getTokens = () => {
  request(
    {
      url: 'https://identity.primaverabss.com/connect/token',
      method: 'POST',
      auth: {
        user: process.env.SECRET,
        pass: process.env.PASS,
      },
      form: {
        grant_type: 'client_credentials',
        scope: 'application',
      },
    },
    function (err, response) {
      if (response) {
        let json = JSON.parse(response.body);
        token = json.access_token;
      } else {
        console.log('Could not obtain Jasmin access token.');
        throw new Error('Index, Could not obtain access token.');
      }
    },
  );

  request(
    {
      url: `https://edata-cust-s01.westeurope.cloudapp.azure.com/erpv19/api/Shell/LoginUser`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      rejectUnauthorized: false,
      body: {
        login: process.env.LOGIN,
        password: process.env.PASSWORD,
        idioma: process.env.LANGUAGE,
        server: process.env.SERVER,
        sistema: process.env.SYSTEM,
      },

      json: true,
    },
    function (err, res) {
      if (res) {
        edToken = res.headers['set-cookie'];
      } else {
        console.log('Could not obtain Eticadata access token.');
        throw new Error('Index, Could not obtain access token.');
      }
    },
  );
};

app.use('/api/', router);

app.all('*', async () => {
  throw new Error("Index, /BAD_URL, route don't exist");
});

app.use(errorHandler);

getTokens();

export { app };
