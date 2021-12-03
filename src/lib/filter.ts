import { IClients } from '../interfaces/interfaces';

const filterClient = (name: string, clients: IClients) =>
  clients.filter((client) => client.name === name);

export default filterClient;
