import request from 'request';

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
        // form: {
        //   scope: 'application',
        // },
        json: true,
        body: data,
      },
      (error, res) => {
        // console.log(res.body);
        if (!error) {
          resolve(res.body);
        } else {
          console.log('error', error);
          reject(error);
        }
      },
    );
  });

export { doRequest };
