import {
  IClient,
  IClients,
  IItems,
  IItem,
  IItemPrice,
} from '../interfaces/interfaces';
import { doRequest, edRequest } from './requests';

const addClientJ = async (
  clientName: string,
  token: string,
): Promise<IClient> => {
  const cliente = {
    // customerGroup: '1',
    // paymentMethod: 'BANK_TRANSFER',
    // paymentTerm: '30',
    // partyTaxSchema: 'PT',
    // locked: false,
    // accountingSchema: '',
    // oneTimeCustomer: false,
    // endCustomer: false,
    // partyKey: '',
    name: clientName,
    isExternallyManaged: false,
    currency: 'EUR',
    country: 'PT',
    isPerson: true,
  };

  const newCliente = await doRequest(
    '/salesCore/customerParties',
    token,
    cliente,
    'POST',
  );

  if (!newCliente) throw new Error('Não foi possivel criar o cliente');
  return newCliente;
};
const createUserE = async (token: string, userData?: any): Promise<string> => {
  const cliente = {
    Code: '56',
    Name: userData.name,
    FinalConsumer: true,
    Inactive: false,
    FiscalNumber: userData.fiscalNumber || '99999999999',
    AddressLine1: userData.addressLine1,
    AddressLine2: userData.addressLine2,
    City: userData.city,
    PostalCode: userData.postalCode,
    Phone: userData.phone,
    Email: userData.email,
    Region: 'BRG',
    SalesRepresent: 0,
    PriceLine: userData.priceLine,
    DiscountPercent: userData.discountPercent || 0.0,
  };

  const newCliente = await edRequest(
    '/TablesEndpoint/Customer',
    token,
    cliente,
    'POST',
  );
  if (!newCliente) throw new Error('Não foi possivel criar o cliente');
  return newCliente;
};
const createItemE = async (token: string, itemData?: any): Promise<string> => {
  const item = {
    Code: '4',
    InternalCode: 4,
    Category: '1',
    Name: itemData.name,
    Region: 'BRG',
    Description: itemData.description,
    LanguageDescriptions: null,
    Inactive: false,
    Composition: 2,
    SalesVATCode: 1,
    PurchaseVATCode: 1,
    ReferencePrice: 0.0,
    PriceLines: [
      {
        LineNumber: 1,
        Price: itemData.price,
        Date: Date.now(),
        Margin: 0.0,
        IncludedTax: 0,
        Currency: 'EUR',
        Discount1: 0.0,
        Discount2: 0.0,
        Discount3: 0.0,
      },
    ],
    NotMoveStock: false,
    GenerateSerialNumber: false,
    GenerateBatchs: false,
    StockUnity: 'Un',
    SalesUnity: 'Un',
    PurchaseUnity: 'Un',
    Families: null,
  };

  const newItem = await edRequest(
    '/TablesEndpoint/Customer',
    token,
    item,
    'POST',
  );
  if (!newItem) throw new Error('Não foi possivel criar o cliente');
  return newItem;
};

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
      priceListLine: ammount,
    };
  }, []);
  return items;
};

const getAllItemsE = async (token: string): Promise<any> => {
  const url = '/TablesEndpoint/ListItems';
  const data: any = await edRequest(url, token);
  if (!data) throw new Error('No data found');

  const items: any = data.Entity.map((item) => {
    let ammount = 0;

    if (item.PriceLines) ammount = item.PriceLines[0].Price;
    return {
      itemKey: item.InternalCode,
      description: item.Description,
      complementaryDescription: item.ComplementaryDescription,
      availableInSales: !item.Inactive,
      availableInPurchases: !item.Inactive,
      // manageInventory: item.manageInventory,
      unitDescription: item.StockUnity,

      // id: item.id,
      priceListLine: ammount,
    };
  }, []);
  return items;
};

const getAllEmailsJ = async (token: string): Promise<string[]> => {
  const users = await getAllUsersJ(token);
  const emails: string[] = users
    .map((user: IClient) => user.electronicMail)
    .filter((email: string) => email);
  return emails;
};

export {
  addClientJ,
  getAllUsersJ,
  getAllItemsJ,
  getAllEmailsJ,
  createUserE,
  createItemE,
  getAllItemsE,
};
