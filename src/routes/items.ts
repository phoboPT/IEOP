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

router.post('/orcamento', async (req: Request, res: Response) => {
  try {
    const { token } = req;
    console.log(`Pedido de orçamento`);
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
    console.log('Preço total: ' + totalValue);
    res.status(200).send({ precoTotal: totalValue });
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

router.post('/sendEmail', async (req: Request, res: Response) => {
  const { email, data } = req.body;
  console.log(`Enviar Email: ${email}`);
  await transport.sendMail({
    from: 'pczone@pczone.com',
    to: email,
    subject: 'Recolha Equipamento',
    html: makeANiceEmail(`Poderá recolher o equipamento no dia ${data}      \n\n

        
      `),
  });
  console.log('Email enviado');
  res.status(200).send('ok');
});

router.post('/invoiceJ', async (req: any, res: Response) => {
  try {
    const { token } = req;
    const { imputs, cliente } = req.body;

    console.log(`Pedido de orçamento: ${imputs}
    
      Email: ${cliente}
    `);
    const finalCart = [];
    const products = await getAllItemsJ(token);
    products.forEach(async (product) => {
      imputs.forEach(async (prod) => {
        if (
          product.itemKey.toLowerCase().includes(prod.produtos.toLowerCase())
        ) {
          const item = {
            item: product.itemKey,
            quantity: prod.quantidade,
            ammount: product.priceListLines[0].priceAmount.amount,
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

    console.log('ID da fatura: ' + id);
    await transport.sendMail({
      from: 'pczone@pczone.com',
      to: cliente,
      subject: 'Fatura',
      html: makeANiceEmail(`Fatura da reparação em anexo    \n\n
  
          
         `),
      attachments: [
        {
          filename: 'file.pdf',
          path: 'Z:/FR.2022.8.pdf',
          contentType: 'application/pdf',
        },
      ],
    });
    console.log('Fatura enviada');
    res.status(200).send('ok');
  } catch (error) {
    console.log(`Error Invoice: ${error}`);
    res.status(501).send(`${error}`);
  }
});

export { router as itemsRouter };
