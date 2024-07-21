export interface IKrakenOrderBookPayload {
  symbol: string;
  bids: IKrakenOrder[];
  asks: IKrakenOrder[];
  checksum: number;
}

export interface IKrakenOrder {
  price: number;
  qty: number;
}

export interface IKrakenOrderBookUpdate {
  bids?: IKrakenOrder[];
  asks?: IKrakenOrder[];
}

export interface IKrakenOrderBookSnapshot {
  bids: IKrakenOrder[];
  asks: IKrakenOrder[];
}

export interface IHuobiOrderBookUpdate {
  ch: string; // Channel
  ts: number;
  tick: {
    bids: [number, number][]; // The current all bids in format [price, size]
    asks: [number, number][]; // The current all asks in format [price, size]
    version: number;
    ts: number;
  };
}

export interface IBinanceOrderBookUpdate {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  U: number; // First update ID in event
  u: number; // Final update ID in event
  b: [string, string][]; // Bids to be updated
  a: [string, string][]; // Asks to be updated
}
