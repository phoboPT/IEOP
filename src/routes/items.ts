import express, { Request, Response } from 'express';
import { IItems } from '../interfaces/interfaces';
import { getAllUsers, getAllItems, getAllEmails } from '../lib/utils';

const router = express.Router();

router.get('/teste', async (req: Request, res: Response) => {
  try {
    res.send({ token: req.token });
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

router.get('/emails', async (req: Request, res: Response) => {
  try {
    const { token } = req;
    const emails = await getAllEmails(token);
    res.send(emails);
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

router.get('/items', async (req: Request, res: Response) => {
  try {
    const { token } = req;
    const items: IItems = await getAllItems(token);
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
    const clients = await getAllUsers(token, clientName);
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
