import express, { Request, Response } from 'express';
import { IItems } from '../interfaces/interfaces';
import { doRequest } from '../lib/requests';
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
    console.log(items);
    res.send(items);
  } catch (error) {
    console.log(`Error ${error}`);
    res.status(404).send(error);
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

    res.status(200).send(clients);
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

router.post('/invoiceJ', async (req: any, res: Response) => {
  try {
    const { token } = req;
    const { client, cart } = req.body;

    const purchase = {
      documentType: 'FR',
      serie: '2022',
      seriesNumber: 1,
      company: 'Default',
      paymentTerm: '00',
      currency: 'EUR',
      documentDate: Date.now(),
      postingDate: Date.now(),
      buyerCustomerParty: client,
      financialAccount: 'CGDDO',
      exchangeRate: 1,
      discount: 0,
      loadingCountry: 'PT',
      unloadingCountry: 'PT',
      isExternal: false,
      isManual: false,
      isSimpleInvoice: false,
      isWsCommunicable: false,
      deliveryTerm: 'V-VIATURA',
      documentLines: cart.map((element) => {
        return {
          salesItem: element.item,
          quantity: element.quantity,
          unitPrice: {
            amount: element.ammount,
          },
          deliveryDate: Date.now(),
        };
      }, []),

      // buyerCustomerParty: client,
      // documentType: 'FA',
      // serie: '2022',
      // seriesNumber: 1,
      // company: 'Default',
      // paymentTerm: '01',
      // paymentMethod: 'NUM',
      // currency: 'EUR',
      // discount: 0,
      // loadingCountry: 'PT',
      // unloadingCountry: 'PT',
      // documentDate: Date.now(),
      // postingDate: Date.now(),
      // documentLines: cart.map((element) => {
      //   return {
      //     salesItem: element.item,
      //     quantity: element.quantity,
      //     unitPrice: {
      //       amount: element.ammount,
      //     },
      //     deliveryDate: Date.now(),
      //   };
      // }, []),
    };

    const response = await doRequest(
      '/billing/invoices',
      token,
      purchase,
      'POST',
    );
    res.status(200).send(response);
  } catch (error) {
    console.log(`Error Invoice: ${error}`);
    res.status(501).send(`${error}`);
  }
});

export { router as itemsRouter };
