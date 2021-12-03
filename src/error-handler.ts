import { Request, Response } from 'express';

const errorHandler = (err: Error, req: Request, res: Response) => {
  res.status(400).send({
    errors: [{ message: 'Something went very wrong', error: err }],
  });
};

export default errorHandler;
