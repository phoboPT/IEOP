import { validateRequest } from "./../validation-errors";
import express, { Request, Response } from "express";

import doRequest from "../lib/requests";
import { IItem, IItems, IClient, IClients } from "../interfaces/interfaces";
import { body } from "express-validator";
const router = express.Router();

router.get("/items", async (req: Request, res: Response) => {
  try {
    const url = "/salescore/salesitems";

    const data: IItems = await doRequest(url);
    if (!data) throw new Error("No data found");
    const items: IItem[] = data.map((item: any) => {
      let ammount: any = [];
      if (item.priceListLines[0]) {
        item.priceListLines.forEach((line: any) => {
          console.log(line.priceAmount);
          ammount.push({
            priceAmount: { ammount: line.priceAmount.amount },
          });
        });
      } else {
        ammount.push({
          priceAmount: { ammount: 0 },
        });
      }

      return {
        itemKey: item.itemKey,
        description: item.description,
        complementaryDescription: item.complementaryDescription,
        availableInSales: item.availableInSales,
        availableInPurchases: item.availableInPurchases,
        manageInventory: item.manageInventory,
        unitDescription: item.unitDescription,
        itemTaxSchemaDescription: item.itemTaxSchemaDescription,
        incomeAccountDescription: item.incomeAccountDescription,
        assortmentDescription: item.assortmentDescription,
        baseUnitDescription: item.baseUnitDescription,
        id: item.id,
        priceListLine: ammount,
      };
    });
    res.send(items);
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});

router.get("/allItems", async (req: Request, res: Response) => {
  try {
    const url = "/businessCore/items";

    const data: IItems = await doRequest(url);
    if (!data) throw new Error("No data found");
    // const items: IItem[] = data.map((item: any) => {
    //   return {
    //     itemKey: item.itemKey,
    //     description: item.description,
    //     complementaryDescription: item.complementaryDescription,
    //     availableInSales: item.availableInSales,
    //     availableInPurchases: item.availableInPurchases,
    //     unitDescription: item.unitDescription,
    //     itemTaxSchemaDescription: item.itemTaxSchemaDescription,
    //     incomeAccountDescription: item.incomeAccountDescription,
    //     assortmentDescription: item.assortmentDescription,
    //     baseUnitDescription: item.baseUnitDescription,
    //     id: item.id,
    //   };
    // });
    res.send(data);
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});
router.post(
  "/client",
  [body("nome").notEmpty().withMessage("Provide a name")],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { nome = "rtes" } = req.body;

      const newCliente = await doRequest(
        "/salesCore/customerParties/extension",
        "POST",
        {
          customerGroup: "1",
          paymentMethod: "BANK_TRANSFER",
          paymentTerm: "30",
          partyTaxSchema: "PT",
          locked: false,
          accountingSchema: "",
          oneTimeCustomer: false,
          endCustomer: false,
          partyKey: "",
          name: nome,
          isExternallyManaged: false,
          currency: "EUR",
          country: "PT",
          isPerson: true,
        }
      );
      if (!newCliente) throw new Error("Não foi possivel criar o cliente");
      res.send(newCliente);
    } catch (error) {
      console.log(`Error ${error}`);

      throw new Error(`erro ${error}`);
    }
  }
);
router.get("/clients/:name", async (req: Request, res: Response) => {
  try {
    console.log("hwy");
    const url = "/salesCore/customerParties";
    const data: IClients = await doRequest(url);

    if (!data) throw Error("Nao existem dados");
    const clients: IClient[] = data.map((item: any) => {
      return {
        settlementDiscountPercent: item.settlementDiscountPercent,
        oneTimeCustomer: item.oneTimeCustomer,
        isExternallyManaged: item.isExternallyManaged,
        name: item.name,
        isPerson: item.isPerson,
        id: item.id,
      };
    });
    console.log(clients);
    const filter = clients.filter((client) => {
      if (client.name === req.params.name) return client;
    });
    console.log(filter);
    res.send(filter);
  } catch (error) {
    console.log(`Error ${error}`);
    throw new Error(`${error}`);
  }
});
export { router as itemsRouter };
