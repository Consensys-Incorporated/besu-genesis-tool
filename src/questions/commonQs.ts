import { QuestionTree } from "../types/questions.ts";

export const outputPathQuestion: QuestionTree = {
  name: "outputPath",
  prompt: "Set your output path for the artifacts: (default ./output)",
};

export const quickstartDevAccountsQuestion: QuestionTree = {
  name: "quickstartDevAccounts",
  prompt: "Include besu-dev-quickstart test accounts: [y/N]",
};

export const accountSourceQuestion: QuestionTree = {
  name: "accountSource",
  prompt:
    "Prefund accounts in the genesis? Besu does not need any to run, and you would normally hold account keys in a wallet such as MetaMask. Default: None",
};

export const accountsQuestion: QuestionTree = {
  name: "accounts",
  prompt: "Choose number of accounts to generate: (integer) Default: 1",
};

export const accountBalanceQuestion: QuestionTree = {
  name: "accountBalance",
  prompt:
    "Balance allocated to each generated account: (default 1000000000000000000000000000)",
};

export const prefundedAccountsQuestion: QuestionTree = {
  name: "prefundedAccounts",
  prompt:
    "Enter the accounts to prefund as JSON {'address': { 'balance': '100000'}}:",
};

export const curveQuestion: QuestionTree = {
  name: "curve",
  prompt: "Choose your encryption curve: Default: [1]",
};

export const bootnodesQuestion: QuestionTree = {
  name: "bootnodes",
  prompt:
    "Choose number of bootnode node keys to generate: (integer) Default: 2",
};

export const membersQuestion: QuestionTree = {
  name: "members",
  prompt: "Choose number of member node keys to generate: (integer) Default: 1",
};

export const validatorsQuestion: QuestionTree = {
  name: "validators",
  prompt:
    "Choose number of validator node keys to generate: (integer) Default: 4",
};

export const maxCodeSizeQuestion: QuestionTree = {
  name: "maxCodeSize",
  prompt: "Set your max code size value: (integer) Default: 64",
};

export const coinbaseQuestion: QuestionTree = {
  name: "coinbase",
  prompt:
    "Set your coinbase address for rewards: (string) Default: 0x0000000000000000000000000000000000000000",
};

export const gasLimitQuestion: QuestionTree = {
  name: "gasLimit",
  prompt: "Set your gas limit value: (string) Default: 0xFFFF",
};

export const difficultyQuestion: QuestionTree = {
  name: "difficulty",
  prompt: "Set your difficulty: (integer) Default: 1",
};

export const epochQuestion: QuestionTree = {
  name: "epochLength",
  prompt: "Set your epoch length value: (integer) Default: 30000",
};

export const requestTimeoutQuestion: QuestionTree = {
  name: "requestTimeout",
  prompt: "Set your requestTimeoutSeconds value: (integer) Default: 10",
};

export const blockPeriodQuestion: QuestionTree = {
  name: "blockperiod",
  prompt: "Set your blockperiodseconds value: (integer) Default: 5",
};

export const chainIDQuestion: QuestionTree = {
  name: "chainID",
  prompt: "Set your chainID value: (integer) Default: 1337",
};
