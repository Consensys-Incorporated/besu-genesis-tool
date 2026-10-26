
import njks from "nunjucks";
import { QuorumConfig } from "../types/quorumConfig.ts";
import { NodeKeys, EthAccount } from "../types/nodeKeys.ts";
import fs from "fs";
import path from "path";

njks.configure({ autoescape: false });

export function createTimestamp(): string {
  return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString()
    .substr(0, 19)
    .replace('T', '-').replace(/:/g, '-');
}

export function setupOutputFolder(fpath: string, quorumConfig: QuorumConfig): string {
  // create the base path if it doesnt exist
  if (!fs.existsSync(fpath)) fs.mkdirSync(fpath, { recursive: true });

  // template for the README.md
  const templateSrc = fs.readFileSync(path.resolve(import.meta.dirname, '../templates/README.md'), "utf-8");
  const result = njks.renderString(templateSrc, quorumConfig);
  fs.writeFileSync(fpath + '/README.md', result);

  // save the values from the user to file
  fs.writeFileSync(fpath + "/userData.json", JSON.stringify(quorumConfig, null, 2));
  return fpath;
}

export function writeNodeKeys(path: string, nodekeys: NodeKeys): void {
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
  // nodekeys
  fs.writeFileSync(path + "/nodekey", nodekeys.privateKey.toString('hex'));
  fs.writeFileSync(path + "/nodekey.pub", nodekeys.publicKey.toString('hex'));
  fs.writeFileSync(path + "/address", nodekeys.address.toString('hex'));
}

export function writeAccount(path: string, account: EthAccount): void {
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
  fs.writeFileSync(path + "/address", account.address);
  fs.writeFileSync(path + "/privateKey", account.privateKey);
  fs.writeFileSync(path + "/keystore", account.keystore);
}

export function createStaticNodes(path: string, nodes: string[]): void {
  const staticNodes: string[] = nodes.map(_ => "enode://" + _ + "@<HOST>:30303");
  fs.writeFileSync(path + "/static-nodes.json", JSON.stringify(staticNodes, null, 2));
}

export function createBesuPermissionsFile(path: string, nodes: string[]): void {
  const staticNodes: string[] = nodes.map(_ => "enode://" + _ + "@<HOST>:30303");
  fs.writeFileSync(path + "/permissioned-nodes.toml", "nodes-allowlist=");
  fs.appendFileSync(path + "/permissioned-nodes.toml", JSON.stringify(staticNodes, null, 2));
}
