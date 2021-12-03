import {
  IClient,
  IClients,
  IItems,
  IItem,
  IItemPrice,
} from '../interfaces/interfaces';
import doRequest from './requests';

const addClient = async (
  clientName: string,
  token: string,
): Promise<IClient> => {
  const newCliente = await doRequest(
    '/salesCore/customerParties',
    token,
    {
      customerGroup: '1',
      paymentMethod: 'BANK_TRANSFER',
      paymentTerm: '30',
      partyTaxSchema: 'PT',
      locked: false,
      accountingSchema: '',
      oneTimeCustomer: false,
      endCustomer: false,
      partyKey: '',
      name: clientName,
      isExternallyManaged: false,
      currency: 'EUR',
      country: 'PT',
      isPerson: true,
    },
    'POST',
  );

  if (!newCliente) throw new Error('Não foi possivel criar o cliente');
  return newCliente;
};

const getAllUsers = async (
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

const getAllItems = async (token: string): Promise<IItems> => {
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
      priceListLine: ammount,
    };
  }, []);
  return items;
};

const getAllEmails = async (token: string): Promise<string[]> => {
  const users = await getAllUsers(token);
  const emails: string[] = users
    .map((user: IClient) => user.electronicMail)
    .filter((email: string) => email);
  return emails;
};

export { addClient, getAllUsers, getAllItems, getAllEmails };
