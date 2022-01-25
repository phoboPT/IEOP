import { NextFunction, Response, Request } from 'express';
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
app.set('trust proxy', true);
app.use(json());

let token: string = '';

const middleware = (req: any, res: Response, next: NextFunction): void => {
  req.token = token;
  next();
};
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
      }
    },
  );
};

router.use(itemsRouter);
app.use('/api/', router);
app.all('*', async (req: Request, res: Response) => {
  res.status(404).send("Index, /BAD_URL, route don't exist");
});
app.use(middleware);
app.use(errorHandler);

getTokens();

export { app };
