export type Algorithm = {
  blockperiodseconds?: number;
  requesttimeoutseconds?: number;
  epochlength?: number;
};

export type GenesisConfig = {
  chainId: number;
  homesteadBlock: number;
  eip150Block: number;
  eip150Hash: string;
  eip155Block: number;
  eip158Block: number;
  byzantiumBlock: number;
  constantinopleBlock: number;
  petersburgBlock: number;
  istanbulBlock: number;
  muirglacierblock: number;
  berlinBlock: number;
  londonBlock: number;
  zeroBaseFee?: boolean;
  contractSizeLimit?: number;
  ibft2?: Algorithm;
  qbft?: Algorithm;
  clique?: Algorithm;
  ecCurve?: "secp256k1" | "secp256r1";
};

export type Alloc = {
  balance: string;
  comment?: string;
  privateKey?: string;
};

export type Genesis = {
  nonce: string;
  timestamp: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  // eslint-disable-next-line id-denylist
  number: string;
  difficulty: string;
  coinbase: string;
  mixHash: string;
  parentHash: string;
  alloc: {
    [id: string]: Alloc;
  };
  config: GenesisConfig;
};
