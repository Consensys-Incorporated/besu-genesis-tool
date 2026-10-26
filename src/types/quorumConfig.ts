import { Consensus } from "./consensus.ts";
import { CryptoCurve } from "./cryptoCurve.ts";

export type QuorumConfig = {
  consensus: Consensus;
  chainID: number;
  blockperiod: number;
  requestTimeout: number;
  epochLength: number;
  difficulty: number;
  gasLimit: string;
  coinbase: string;
  maxCodeSize?: number;
  validators: number;
  members: number;
  bootnodes: number;
  curve: CryptoCurve;
  outputPath: string;
  quickstartDevAccounts: boolean;
  noOutputTimestamp: boolean;
  prefundedAccounts?: string;
  accounts?: number;
  accountBalance?: string;
};
