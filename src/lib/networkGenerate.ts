import { QuorumConfig } from "../types/quorumConfig.ts";
import { NodeKeys, Address } from "../types/nodeKeys.ts";
import { CryptoCurve } from "../types/cryptoCurve.ts";
import * as genesis from "./genesisGenerate.ts";
import * as fileHandler from "./fileHandler.ts";
import * as nodekeys from "./nodeKeys.ts";
import * as besuConfig from "./besuConfig.ts";

async function generateNodeConfig(
  numNodes: number,
  nodeType: string,
  accountPassword: string,
  curve: CryptoCurve,
  outputDir: string
): Promise<NodeKeys[]> {
  const nNodes = numNodes;
  const nodes: NodeKeys[] = [];
  for (let i = 0; i < nNodes; i++) {
    const nodeData = await nodekeys.generateNodeKeys(accountPassword, curve);
    nodes.push(nodeData);
  }
  nodes.map((v, i) => {
    fileHandler.writeNodeKeys(outputDir + "/" + nodeType + i.toString(), v);
  });
  return nodes;
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
  const bootnodes = await generateNodeConfig(
    quorumConfig.bootnodes,
    "bootnode",
    quorumConfig.accountPassword,
    quorumConfig.curve,
    outputDir
  );

  console.log("Creating members...");
  const members = await generateNodeConfig(
    quorumConfig.members,
    "member",
    quorumConfig.accountPassword,
    quorumConfig.curve,
    outputDir
  );

  console.log("Creating validators...");
  const validators = await generateNodeConfig(
    quorumConfig.validators,
    "validator",
    quorumConfig.accountPassword,
    quorumConfig.curve,
    outputDir
  );
  const validatorAddressBuffers: Address[] = validators.map((v) => v.address);
  const extraData: string = nodekeys.generateExtraDataString(
    validatorAddressBuffers,
    quorumConfig.consensus
  );

  // concatenate NodeKeys array to pass into the Genesis functions
  const NodeKeyConcat: NodeKeys[] = bootnodes.concat(members, validators);

  // static nodes generation
  const allNodes: NodeKeys[] = validators.concat(bootnodes, members);
  const allNodesEnodes: string[] = allNodes.map((_) =>
    _.publicKey.toString("hex")
  );

  fileHandler.createStaticNodes(outputDir, allNodesEnodes);
  genesis.createBesuGenesis(outputDir, quorumConfig, extraData, NodeKeyConcat);
  besuConfig.createBesuConfig(bootnodes, quorumConfig, outputDir);
  fileHandler.createBesuPermissionsFile(outputDir, allNodesEnodes);

  console.log("Artifacts in folder: " + outputDir);
  return outputDir;
}
