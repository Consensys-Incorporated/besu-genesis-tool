import { QuorumConfig } from "../types/quorumConfig.ts";
import { NodeKeys, Address, EthAccount } from "../types/nodeKeys.ts";
import { CryptoCurve } from "../types/cryptoCurve.ts";
import * as genesis from "./genesisGenerate.ts";
import * as fileHandler from "./fileHandler.ts";
import * as nodekeys from "./nodeKeys.ts";
import * as besuConfig from "./besuConfig.ts";

function generateNodeConfig(
  numNodes: number,
  nodeType: string,
  curve: CryptoCurve,
  outputDir: string
): NodeKeys[] {
  const nNodes = numNodes;
  const nodes: NodeKeys[] = [];
  for (let i = 0; i < nNodes; i++) {
    const nodeData = nodekeys.generateNodeKeys(curve);
    nodes.push(nodeData);
  }
  nodes.map((v, i) => {
    fileHandler.writeNodeKeys(outputDir + "/" + nodeType + i.toString(), v);
  });
  return nodes;
}

// prefunded accounts, independent of the nodes - besu doesn't need these to run
async function generateAccounts(
  numAccounts: number,
  outputDir: string
): Promise<EthAccount[]> {
  const accounts: EthAccount[] = [];
  for (let i = 0; i < numAccounts; i++) {
    // keystores have no password; users can import the private key into a wallet to protect it
    const account = await nodekeys.generateEthAccount("");
    fileHandler.writeAccount(outputDir + "/accounts/account" + i.toString(), account);
    accounts.push(account);
  }
  return accounts;
}

export async function generateNetworkConfig(
  quorumConfig: QuorumConfig
): Promise<string> {
  // Create a new root folder each time - dont destroy anything that existed
  const OUTPUT_BASE_DIR = `${quorumConfig.outputPath}`;
  const ts: string = quorumConfig.noOutputTimestamp
    ? ""
    : fileHandler.createTimestamp();
  const outputDir: string = OUTPUT_BASE_DIR + "/" + ts;

  fileHandler.setupOutputFolder(outputDir, quorumConfig);

  console.log("Creating bootnodes...");
  const bootnodes = generateNodeConfig(
    quorumConfig.bootnodes,
    "bootnode",
    quorumConfig.curve,
    outputDir
  );

  console.log("Creating members...");
  const members = generateNodeConfig(
    quorumConfig.members,
    "member",
    quorumConfig.curve,
    outputDir
  );

  console.log("Creating validators...");
  const validators = generateNodeConfig(
    quorumConfig.validators,
    "validator",
    quorumConfig.curve,
    outputDir
  );
  const validatorAddressBuffers: Address[] = validators.map((v) => v.address);
  const extraData: string = nodekeys.generateExtraDataString(
    validatorAddressBuffers,
    quorumConfig.consensus
  );

  console.log("Creating accounts...");
  const accounts = await generateAccounts(quorumConfig.accounts ?? 0, outputDir);

  // static nodes generation
  const allNodes: NodeKeys[] = validators.concat(bootnodes, members);
  const allNodesEnodes: string[] = allNodes.map((_) =>
    _.publicKey.toString("hex")
  );

  fileHandler.createStaticNodes(outputDir, allNodesEnodes);
  genesis.createBesuGenesis(outputDir, quorumConfig, extraData, accounts);
  besuConfig.createBesuConfig(bootnodes, quorumConfig, outputDir);
  fileHandler.createBesuPermissionsFile(outputDir, allNodesEnodes);

  console.log("Artifacts in folder: " + outputDir);
  return outputDir;
}
