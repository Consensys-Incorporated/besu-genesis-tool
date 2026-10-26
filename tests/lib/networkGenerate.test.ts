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

