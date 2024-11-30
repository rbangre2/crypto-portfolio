export interface Asset {
  id?: string;
  name: string;
  dateBought: Date;
  pricePaid: number;
  quantity: number;
  cryptoId: number;
  currentValue?: number;
}
