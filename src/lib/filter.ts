import { IClients } from "../interfaces/interfaces";

export const filterClient = (name: string, clients: IClients) => {
  return clients.filter((client) => client.name === name);
};
