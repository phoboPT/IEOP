interface IPrice {
  amount: number;
}

interface IItemPrice {
  priceAmount: IPrice;
}
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
  priceListLines: IItemPrice[];
}

interface IClient {
  oneTimeCustomer: true;
  isExternallyManaged: boolean;
  name: string;
  isPerson: false;
  id: string;
  searchTerm: string;
  electronicMail: string;
}

type IClients = Array<IClient>;
type IItems = Array<IItem>;

export { IItem, IItems, IClient, IClients, IItemPrice };
