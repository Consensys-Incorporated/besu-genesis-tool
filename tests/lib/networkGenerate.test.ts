import { describe, it, expect } from "vitest";
import fs from "fs";
import * as networkGen from "../../src/lib/networkGenerate.ts";
import { Consensus } from "../../src/types/consensus.ts";
import { TEST_QUORUM_CONFIG } from "./testConstants.ts";

describe("Network Generation tests", () => {

  it("should create artifacts for QBFT", async () => {
    const f = await networkGen.generateNetworkConfig(TEST_QUORUM_CONFIG);
    expect(f).not.toBe(null);
    for (const file of ["genesis.json", "config.toml", "static-nodes.json", "permissioned-nodes.toml", "userData.json", "README.md"]) {
      expect(fs.existsSync(f + "/" + file)).toBe(true);
    }
    expect(fs.existsSync(f + "/besu")).toBe(false);
  });

  it("should write generated accounts to accounts/ and prefund them in the genesis", async () => {
    const f = await networkGen.generateNetworkConfig({ ...TEST_QUORUM_CONFIG, accounts: 2, outputPath: "./output/with-accounts" });
    const genesis = JSON.parse(fs.readFileSync(f + "/genesis.json", "utf-8"));
    for (const i of [0, 1]) {
      const address = fs.readFileSync(f + "/accounts/account" + i + "/address", "utf-8");
      expect(genesis.alloc[address].balance).toBe(TEST_QUORUM_CONFIG.accountBalance);
    }
    expect(fs.existsSync(f + "/accounts/account2")).toBe(false);
    expect(fs.readdirSync(f + "/validator0").sort()).toEqual(["address", "nodekey", "nodekey.pub"]);
  });

  it("should not create accounts or allocations by default", async () => {
    const f = await networkGen.generateNetworkConfig({ ...TEST_QUORUM_CONFIG, accounts: undefined, outputPath: "./output/no-accounts" });
    expect(fs.existsSync(f + "/accounts")).toBe(false);
    const genesis = JSON.parse(fs.readFileSync(f + "/genesis.json", "utf-8"));
    expect(genesis.alloc).toEqual({});
  });

  it("should create artifacts for IBFT2", async () => {
    const ibft2Config = TEST_QUORUM_CONFIG;
    ibft2Config.consensus = Consensus.ibft2;
    const f = await networkGen.generateNetworkConfig(ibft2Config);
    expect(f).not.toBe(null);
  });

  it("should create artifacts for clique", async () => {
    const cliqueConfig = TEST_QUORUM_CONFIG;
    cliqueConfig.consensus = Consensus.clique;
    const f = await networkGen.generateNetworkConfig(cliqueConfig);
    expect(f).not.toBe(null);
  });

});

