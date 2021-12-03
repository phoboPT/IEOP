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

declare global {
  namespace Express {
    interface Request {
      token: string;
    }
  }
}
const middleware = (req: any, res: Response, next: NextFunction): void => {
  req.token = token;
  next();
};

app.set('trust proxy', true);
app.use(json());
app.use(middleware);
router.use(itemsRouter);
let token =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjAxODJCOUI4QUI2NzY5M0EwNTFDQTIxMDY1NjI4OUJBNzNCMkM2ODhSUzI1NiIsIng1dCI6IkFZSzV1S3RuYVRvRkhLSVFaV0tKdW5PeXhvZyIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5LnByaW1hdmVyYWJzcy5jb20iLCJuYmYiOjE2MzgxOTMxMjMsImlhdCI6MTYzODE5MzEyMywiZXhwIjoxNjM4MjA3NTIzLCJhdWQiOlsiamFzbWluIiwibGl0aGl1bS1wdXNobm90aWZpY2F0aW9ucyIsImxpdGhpdW0tY2FyYm9uIiwiaHR0cHM6Ly9pZGVudGl0eS5wcmltYXZlcmFic3MuY29tL3Jlc291cmNlcyJdLCJzY29wZSI6WyJhcHBsaWNhdGlvbiIsInByaW1hdmVyYWNsYWltcyIsIm9wZW5pZCIsInByb2ZpbGUiLCJlbWFpbCIsInN1YnNjcmlwdGlvbiIsImxpdGhpdW0tcHVzaG5vdGlmaWNhdGlvbnMtaHViIiwibGl0aGl1bS1jYXJib24taW5zaWdodHMiXSwiYW1yIjpbImV4dGVybmFsIl0sImNsaWVudF9pZCI6Imphc21pbi1jbGllbnQtYXBwIiwic3ViIjoiYmRmYjk3M2ItOGMxYy00ZTJkLTkyYmYtMGQzOWRjYjI2MjdhIiwiYXV0aF90aW1lIjoxNjM4MTE3NzExLCJpZHAiOiJNaWNyb3NvZnQiLCJuYW1lIjoiam9hb3JhbW9zQGlwdmMucHQiLCJlbWFpbCI6ImpvYW9yYW1vc0BpcHZjLnB0IiwiZGlzcGxheV9uYW1lIjoiSm_Do28gUmFtb3MiLCJjdWx0dXJlIjoicHQtcHQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zcy5saXRoaXVtLnByaW1hdmVyYWJzcy5jb20vYXBpL3YxLjAvdXNlcnBpY3R1cmUvYmRmYjk3M2ItOGMxYy00ZTJkLTkyYmYtMGQzOWRjYjI2MjdhL3B1YmxpYyIsInNlY3VyaXR5X3N0YW1wIjoiQjdUQjdDSUlYVlFUS0FBTk5YSjdET1I1STVVTlpYSFAiLCJzaWQiOiJCMEVDRDg2MjFENjJDOEI5RENEODcwQjZBMURGQTUwMSJ9.YziHIOsQxglzg2na8LcSfXYeZ1QCQneI7i8luauub6KKjPsT_unDjqFDalfdkx3sAtb4SC3b3VsVTidS19Yk-vPMevU7iTuYTfTXcsT1iuA0OlAlgoEZHjGVTOkYNuCe1i-sC2U6TO_meGOqR22KRf1p6dVACz6ZxklHFhd4VQbwqj9IIA97-jhz_nE7h0izvB4LKGIovx1oTiYC2X5z1WhbDq_3XGW3Y6gz0TWvRqlY4yn_gEYtb5mNdOfruKDJVeET7wTwqXBU0RdhOvaELwFlinSD7W3lOa2pXvahX66Eh0m14E1TZxcOJ6OrfiAFBKN48XguXiHA7apg40slHg';
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
      console.log('Could not obtain access token.');
    }
  },
);

app.use('/api/', router);

app.all('*', async () => {
  throw new Error("Index, /BAD_URL, route don't exist");
});

app.use(errorHandler);

export { app };
