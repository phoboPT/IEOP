import request, { CoreOptions, RequiredUriUrl } from "request";
import { IItem, IItems } from "../interfaces/interfaces";
require("dotenv").config();

interface IRequest extends CoreOptions {
  data: object;
}
const doRequest = (url: string, method = "GET", data?: {}): any => {
  return new Promise((resolve, reject) => {
    request(
      {
        url:
          "http://my.jasminsoftware.com/api/" +
          process.env.USER +
          "/" +
          process.env.SUBSCRIPTION +
          url,
        method: method,
        headers: {
          Authorization: `bearer ${process.env.TOKEN}`,
          "Content-Type": "application/json",
        },
        form: {
          scope: "application",
        },
        body: data,
      },
      function (error, res) {
        if (!error && res.statusCode === 200) {
          resolve(JSON.parse(res.body));
        } else {
          reject(error);
        }
      }
    );
  });
};

export default doRequest;
