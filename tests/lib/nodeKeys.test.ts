import { describe, it, expect } from "vitest";
import { createECDH } from "crypto";
import { TEST_NODE } from "./testConstants.ts"
import { EthAccount, NodeKeys } from "../../src/types/nodeKeys.ts";
import * as nodekeys from "../../src/lib/nodeKeys.ts";
import { CryptoCurve } from "../../src/types/cryptoCurve.ts";

describe("NodeKeys generation", () => {

  it("should create a new private key", () => {
    const priv : Buffer = nodekeys.generatePrivateKey();
    expect(priv).not.toBe(null);
  });

  it("should create a pubkey from a known private key", () => {
    const priv : Buffer = Buffer.from(TEST_NODE.privateKey, 'hex');
    const pubKey : Buffer = nodekeys.derivePublicKey(priv);
    expect(pubKey.toString('hex')).toBe(TEST_NODE.publicKey);
  });

  it("should create an address from a known private key", () => {
    const priv : Buffer = Buffer.from(TEST_NODE.privateKey, 'hex');
    const pubKey : Buffer = nodekeys.derivePublicKey(priv);
    const address : Buffer = nodekeys.deriveAddress(pubKey);
    expect(address.toString('hex')).toBe(TEST_NODE.address);
  });

  it("should generate an account key", async () => {
    const account : EthAccount = await nodekeys.generateEthAccount(TEST_NODE.password);
    expect(account).not.toBe(null);
  });

  it("should generate an object with nodekeys and account keys", async () => {
    const nodeKeys : NodeKeys = await nodekeys.generateNodeKeys(TEST_NODE.password, TEST_NODE.curve);
    expect(nodeKeys).not.toBe(null);
  });

  it("should derive an r1 pubkey matching node's built-in P-256", () => {
    const priv : Buffer = nodekeys.generatePrivateKey(CryptoCurve.r1);
    const ecdh = createECDH("prime256v1");
    ecdh.setPrivateKey(priv);
    expect(nodekeys.derivePublicKey(priv, CryptoCurve.r1).toString("hex")).toBe(ecdh.getPublicKey("hex").slice(2));
  });

  it("should generate nodekeys on the r1 curve", async () => {
    const nodeKeys : NodeKeys = await nodekeys.generateNodeKeys(TEST_NODE.password, CryptoCurve.r1);
    expect(nodeKeys.publicKey.length).toBe(64);
  });

});
