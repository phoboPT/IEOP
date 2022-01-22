import {
  IClient,
  IClients,
  IItems,
  IItem,
  IItemPrice,
} from '../interfaces/interfaces';
import { doRequest } from './requests';

const getAllUsersJ = async (
  token: string,
  clientName?: string,
): Promise<IClients> => {
  const data: IClients = await doRequest('/salesCore/customerParties', token);

  if (!data) throw Error('Nao existem dados');
  const clients: IClients = data.map((item: IClient) => ({
    oneTimeCustomer: item.oneTimeCustomer,
    isExternallyManaged: item.isExternallyManaged,
    name: item.name,
    isPerson: item.isPerson,
    id: item.id,
    searchTerm: item.searchTerm,
    electronicMail: item.electronicMail,
  }));
  if (clientName) {
    const filter = clients.filter((client: IClient): IClient | undefined => {
      if (client.name === clientName) return client;
      return undefined;
    });
    return filter;
  }
  return clients;
};

const getAllItemsJ = async (token: string): Promise<IItems> => {
  const url = '/salesCore/salesItems';
  const data: IItems = await doRequest(url, token);
  if (!data) throw new Error('No data found');
  const items: any = data.map((item: IItem) => {
    const ammount: IItemPrice[] = [];
    if (item.priceListLines[0]) {
      item.priceListLines.forEach((line: IItemPrice) => {
        ammount.push({
          priceAmount: { amount: line.priceAmount.amount },
        });
      });
    } else {
      ammount.push({
        priceAmount: { amount: 0 },
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
      priceListLines: ammount,
    };
  }, []);
  return items;
};

export { getAllUsersJ, getAllItemsJ };
