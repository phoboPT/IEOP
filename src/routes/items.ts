import express, { Request, Response } from 'express';
import { IItems } from '../interfaces/interfaces';
import { doRequest } from '../lib/requests';
import { getAllItemsJ } from '../lib/utils';
import fs from 'fs';
import { transport, makeANiceEmail } from '../lib/mail';
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
  await transport.sendMail({
    from: 'picus@gmail.com',
    to: 'example@gmail.com',
    subject: 'Recolha Equipamento - Reparação concluida',
    html: makeANiceEmail(`Poderá recolher o equipamento a partir de 24/01/2022      \n\n

        
      `),
  });
  // await transport.sendMail({
  //   from: 'teste@gmail.com',
  //   to: 'example@foo.com',
  //   subject: 'Fatura',
  //   text: 'Factura da reparação em anexo',
  //   attachments: [
  //     {
  //       filename: 'file.pdf',
  //       path: 'C:/Users/Phobo/Desktop/IEOP/FR.2022.2.pdf',
  //       contentType: 'application/pdf',
  //     },
  //   ],
  // });
  res.send('ok');
});

router.post('/orcamento', async (req: Request, res: Response) => {
  try {
    const { token } = req;

    let totalValue = 0;
    const products = await getAllItemsJ(token);
    products.forEach(async (product) => {
      req.body.forEach(async (prod) => {
        if (
          product.itemKey.toLowerCase().includes(prod.produtos.toLowerCase())
        ) {
          totalValue +=
            product.priceListLines[0].priceAmount.amount * prod.quantidade;
        }
      });
    });

    res.send({ precoTotal: totalValue });
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

router.post('/sendEmail', async (req: Request, res: Response) => {
  const { email, data } = req.body;

  await transport.sendMail({
    from: 'picus@gmail.com',
    to: email,
    subject: 'Recolha Equipamento',
    html: makeANiceEmail(`Poderá recolher o equipamento no dia ${data}      \n\n

        
      `),
  });

  res.status(200).send('ok');
});

router.post('/invoiceJ', async (req: any, res: Response) => {
  try {
    const { token } = req;
    const { cliente, imputs, email } = req.body;
    const finalCart = [];
    const products = await getAllItemsJ(token);
    products.forEach(async (product) => {
      imputs.forEach(async (prod) => {
        if (
          product.itemKey.toLowerCase().includes(prod.produtos.toLowerCase())
        ) {
          const item = {
            item: product.itemKey,
            quantity: 20,
            ammount: 10,
          };
          finalCart.push(item);
        }
      });
    });

    const purchase = {
      documentType: 'FR',
      serie: '2022',
      seriesNumber: 1,
      company: 'Default',
      paymentTerm: '00',
      currency: 'EUR',
      documentDate: Date.now(),
      postingDate: Date.now(),
      buyerCustomerParty: 'INDIF',
      financialAccount: '01',
      exchangeRate: 1,
      discount: 0,
      loadingCountry: 'PT',
      unloadingCountry: 'PT',
      isExternal: false,
      isManual: false,
      isSimpleInvoice: false,
      isWsCommunicable: false,
      deliveryTerm: 'V-VIATURA',
      documentLines: finalCart.map((element) => {
        return {
          salesItem: element.item,
          quantity: element.quantity,
          unitPrice: {
            amount: element.ammount,
          },
          deliveryDate: Date.now(),
        };
      }, []),
    };

    const id = await doRequest('/billing/invoices', token, purchase, 'POST');

    const invoice = await doRequest(
      `billing/invoices/${id}/print?template=Billing_MaterialsInvoiceReport`,
      token,
    );

    await transport.sendMail({
      from: 'picus@gmail.com',
      to: email,
      subject: 'Recolha Equipamento',
      attachements: invoice,
      html: makeANiceEmail(`factura     \n\n
  
          
        `),
    });
    res.status(200).send('ok');
  } catch (error) {
    console.log(`Error Invoice: ${error}`);
    res.status(501).send(`${error}`);
  }
});

export { router as itemsRouter };
