import express, { Request, Response } from 'express';
import { IItems } from '../interfaces/interfaces';
import {
  getAllUsersJ,
  getAllItemsJ,
  getAllEmailsJ,
  createUserE,
  createItemE,
  addClientJ,
  getAllItemsE,
} from '../lib/utils';
declare global {
  namespace Express {
    interface Request {
      token: string;
      edToken: string;
    }
  }
}

const router = express.Router();

router.get('/teste', async (req: Request, res: Response) => {
  try {
    console.log('bizagi entrou');
    const { token } = req;
    console.log(token);
    const data = await addClientJ('jorge', token);
    res.send(data);
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

router.get('/emails', async (req: Request, res: Response) => {
  try {
    const { token } = req;
    const emails = await getAllEmailsJ(token);
    res.send(emails);
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

router.get('/items', async (req: Request, res: Response) => {
  try {
    const { token } = req;
    const items: IItems = await getAllItemsJ(token);
    res.send(items);
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

router.get('/clients', async (req: Request, res: Response) => {
  try {
    const { token } = req;
    let clientName;
    if (req.query && req.query.name) {
      clientName = (req.query as any).name;
    }
    const clients = await getAllUsersJ(token, clientName);
    // API para criar cliente foi movida para outro endpoint
    // if (!clients[0]) {
    //   console.log("hey");
    //   return res.status(200).send(await addClient(clientName));
    // }

    res.status(200).send(clients);
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

export { router as itemsRouter };
