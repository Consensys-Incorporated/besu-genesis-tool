import { rootQuestion } from "./questions/index.ts";
import { QuestionRenderer } from "./questionRenderer.ts";
import { generateNetworkConfig } from "./lib/networkGenerate.ts";
import { QuorumConfig } from "./types/quorumConfig.ts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
// import { CryptoCurve } from "./types/cryptoCurve.ts";

export async function main(): Promise<void> {
  if (process.platform === "win32") {
    console.error(
      chalk.red(
        "Unfortunately this tool is not compatible with Windows at the moment.\n" +
          "We recommend running it under Windows Subsystem For Linux 2 with Docker Desktop.\n" +
          "Please visit the following pages for installation instructions.\n\n" +
          "https://docs.microsoft.com/en-us/windows/wsl/install-win10\n" +
          "https://docs.docker.com/docker-for-windows/wsl/"
      )
    );
    process.exit(1);
  }

  let answers: object;
  if (process.argv.slice(2).length > 0) {
    const args = await yargs(hideBin(process.argv))
      .options({
        consensus: {
          type: "string",
          demandOption: true,
          default: "qbft",
          choices: ["ibft2", "qbft", "clique"],
          describe: "Consensus algorithm to use",
        },
        chainID: {
          type: "number",
          demandOption: true,
          default: 1337,
          describe: "ChainID for blockchain",
        },
        blockperiod: {
          type: "number",
          demandOption: true,
          default: 5,
          describe: "Number of seconds per block",
        },
        requestTimeout: {
          type: "number",
          demandOption: false,
          default: 10,
          describe: "Minimum request timeout for each round",
        },
        epochLength: {
          type: "number",
          demandOption: true,
          default: 30000,
          describe: "Number of blocks after which votes reset",
        },
        difficulty: {
          type: "number",
          demandOption: true,
          default: 1,
          describe: "Difficulty of network",
        },
        gasLimit: {
          type: "string",
          demandOption: true,
          default: "0xFFFF",
          describe: "Block gas limit",
        },
        coinbase: {
          type: "string",
          demandOption: false,
          default: "0x0000000000000000000000000000000000000000",
          describe: "Address to pay mining rewards to",
        },
        maxCodeSize: {
          type: "number",
          demandOption: false,
          default: 64,
          describe: "Maximum contract size (kb)",
        },
        validators: {
          type: "number",
          demandOption: true,
          default: 4,
          describe: "Number of validator node keys to generate",
        },
        members: {
          type: "number",
          demandOption: true,
          default: 1,
          describe: "Number of member node keys to generate",
        },
        bootnodes: {
          type: "number",
          demandOption: true,
          default: 2,
          describe: "Number of bootnode node keys to generate",
        },
        // curve: { type: 'string', demandOption: false, default: CryptoCurve.k1, choices: [CryptoCurve.k1, CryptoCurve.r1], describe: 'Type of curve for keys' },
        accountPassword: {
          type: "string",
          demandOption: false,
          default: "",
          describe: "Password for keys",
        },
        outputPath: {
          type: "string",
          demandOption: false,
          default: "./output",
          describe: "Output path relative to current directory",
        },
        quickstartDevAccounts: {
          type: "boolean",
          demandOption: true,
          default: false,
          describe: "Include quorum-dev-quickstart test accounts",
        },
        genesisNodeAllocation: {
          type: "string",
          demandOption: true,
          default: "1000000000000000000000000000",
          describe: "Balance allocated to each nodes",
        },
        alloc: {
          type: "string",
          demandOption: true,
          default: "{}",
          describe: "JSON format of the prefunded accounts {'address': { balance: '100000'}}",
        },
        noOutputTimestamp: {
          type: "boolean",
          demandOption: false,
          default: false,
          describe: "Remove generated timestamp from output folder name",
        },
      })
      .coerce(["consensus"], (opt: string) => {
        return opt.toLowerCase();
      }).argv;

    answers = {
      consensus: args.consensus,
      chainID: args.chainID,
      blockperiod: args.blockperiod,
      requestTimeout: args.requestTimeout,
      epochLength: args.epochLength,
      difficulty: args.difficulty,
      gasLimit: args.gasLimit,
      coinbase: args.coinbase,
      maxCodeSize: args.maxCodeSize,
      validators: args.validators,
      members: args.members,
      bootnodes: args.bootnodes,
      curve: args.curve,
      accountPassword: args.accountPassword,
      outputPath: args.outputPath,
      quickstartDevAccounts: args.quickstartDevAccounts,
      noOutputTimestamp: args.noOutputTimestamp,
      prefundedAccounts: args.alloc,
      genesisNodeAllocation: args.genesisNodeAllocation,
    };
  } else {
    const qr = new QuestionRenderer(rootQuestion);
    answers = await qr.render(); // begin rendering the questions

    // console.log(answers); // log answer output for debugging
  }

  await generateNetworkConfig(answers as QuorumConfig); // build artifacts
  setTimeout(() => {
    process.exit(0);
  }, 500);
}

export { generateNetworkConfig } from "./lib/networkGenerate.ts";
export * from "./types/index.ts";
