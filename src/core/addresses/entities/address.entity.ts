export interface Address {
  id: number;
  cep: string;
  ruaAvenida: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  createdAt: Date;
  updatedAt: Date;
}
