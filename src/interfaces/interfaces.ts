interface IItem {
  itemKey: string;
  description: string;
  complementaryDescription: string;
  availableInSales: boolean;
  availableInPurchases: boolean;
  unitDescription: string;
  itemTaxSchemaDescription: string;
  incomeAccountDescription: string;
  assortmentDescription: string;
  baseUnitDescription: string;
  id: string;
  manageInventory: boolean;
  priceListLines?: IItemPrice[];
}

interface IClient {
  settlementDiscountPercent: number;
  oneTimeCustomer: true;
  isExternallyManaged: boolean;
  name: string;
  isPerson: false;
  id: string;
}

interface IPrice {
  amount: number;
}

interface IItemPrice {
  priceAmount: IPrice;
}

interface IClients extends Array<IClient> {}
interface IItems extends Array<IItem> {}

export { IItem, IItems, IClient, IClients };
