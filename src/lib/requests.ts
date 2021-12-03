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
        url: `http://my.jasminsoftware.com/api/${process.env.USER}/${process.env.SUBSCRIPTION}/${url}`,
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
        if (!error && res.statusCode === 200) {
          resolve(JSON.parse(res.body));
        } else {
          reject(error);
        }
      },
    );
  });

export default doRequest;
