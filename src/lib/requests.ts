import request from 'request';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const doRequest = (
  url: string,
  token: string,
  data?: Record<string, unknown>,
  method = 'GET',
): any =>
  new Promise((resolve, reject): any => {
    request(
      {
        url: `https://my.jasminsoftware.com/api/${process.env.USER}/${process.env.SUBSCRIPTION}/${url}`,
        method,
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        form: {
          scope: 'application',
        },
        body: data,
      },
      (error, res) => {
        console.log(res.body);
        if (!error && res.statusCode === 200) {
          resolve(JSON.parse(res.body));
        } else {
          reject(error);
        }
      },
    );
  });

const edRequest = (
  url: string,
  token: string,
  data?: Record<string, unknown>,
  method = 'GET',
): any =>
  new Promise((resolve, reject): any => {
    request(
      {
        url: `https://edata-cust-s01.westeurope.cloudapp.azure.com/erpv19/api/${url}`,
        method,
        headers: {
          'Content-Type': 'application/json',
          Cookie: token,
        },
        body: data,
        json: true,
      },
      (error, res) => {
        console.log(error);
        if (!error) {
          resolve(res.body);
        } else {
          reject(error);
        }
      },
    );
  });

export { doRequest, edRequest };
