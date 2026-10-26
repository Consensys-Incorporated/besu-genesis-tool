
import { Address, NodeKeys, PrivateKey, PublicKey, EthAccount } from "../types/nodeKeys.ts";
import { Consensus } from "../types/consensus.ts";
import { CryptoCurve } from "../types/cryptoCurve.ts";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { p256 } from "@noble/curves/nist.js";
import { keccak_256 as keccak256 } from "@noble/hashes/sha3.js";
import { Wallet } from "@ethereumjs/wallet";
import { RLP, type Input } from "@ethereumjs/rlp";

const VANITY_DATA = "0x0000000000000000000000000000000000000000000000000000000000000000";
const CLIQUE_PROPOSER_SIGNATURE = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

export function generatePrivateKey(curve: CryptoCurve = CryptoCurve.k1): PrivateKey {
  const ec = curve === CryptoCurve.r1 ? p256 : secp256k1;
  return Buffer.from(ec.utils.randomSecretKey());
}

export function derivePublicKey(privKey: Buffer, curve: CryptoCurve = CryptoCurve.k1): PublicKey {
  const ec = curve === CryptoCurve.r1 ? p256 : secp256k1;
  // slice on the end to remove the compression prefix ie. uncompressed use 04 prefix & compressed use 02 or 03
  // we generate the address, which wont work with the compression prefix
  return Buffer.from(ec.getPublicKey(privKey, false).slice(1));
}

export function deriveAddress(pubKey: Uint8Array): Address {
  if (!Buffer.isBuffer(pubKey)) {
    console.error("ERROR - pubKey is not a buffer");
    process.exit();
  }
  const keyHash: Address = Buffer.from(keccak256(pubKey));
  return keyHash.slice(Math.max(keyHash.length - 20, 1));
}

export async function generateEthAccount(password: string): Promise<EthAccount> {
  const wallet: Wallet = Wallet.generate();
  const v3keystore = await wallet.toV3(password);
  const ethAccount: EthAccount = {
    privateKey: wallet.getPrivateKeyString(),
    publicKey: wallet.getPublicKeyString(),
    address: wallet.getAddressString(),
    keystore: JSON.stringify(v3keystore),
    password
  };
  return ethAccount;
}

export function generateNodeKeys(curve: CryptoCurve): NodeKeys {
  const privateKey: PrivateKey = generatePrivateKey(curve);
  const publicKey: PublicKey = derivePublicKey(privateKey, curve);
  const address: Address = deriveAddress(publicKey);
  const nodeKeys: NodeKeys = {
    privateKey,
    publicKey,
    address
  };
  return nodeKeys;
}

// extraData field calculation
export function generateExtraDataString(validatorAddressList: Address[], consensus: Consensus): string {

  let extraData: Input;
  switch (consensus) {
    case Consensus.clique: {
      // clique just appends https://docs.besu-eth.org/private-networks/how-to/configure/consensus/clique/
      // 65 bytes for the proposer signature. In the genesis block there is no initial proposer, so the proposer signature is all zeros.
      // [0x prefix, 32 bytes vanity, List<Validators> (20bytes each), proposer signature - 65 bytes of 0s (see comment above)]
      const signers: string[] = validatorAddressList.map(_ => _.toString('hex'));
      extraData = [VANITY_DATA, signers.join(''), CLIQUE_PROPOSER_SIGNATURE].join('');
      break;
    }
    // ibft2
    case Consensus.ibft2: {
      const roundBuffer: Buffer = Buffer.alloc(4);
      roundBuffer.writeUInt32LE(0, 0);
      const extraDataContent: Input = [new Uint8Array(32), validatorAddressList, null, roundBuffer, []];
      const extraDataCoded: Uint8Array = RLP.encode(extraDataContent);
      extraData = '0x' + Buffer.from(extraDataCoded).toString('hex');
      break;
    }
    // qbft
    default: {
      // ibft2, qbft as normal ie RLP([32 bytes Vanity, List<Validators>, No Vote, Round=Int(0), 0 Seals]).
      const extraDataContent: Input = [new Uint8Array(32), validatorAddressList, [], null, []];
      const extraDataCoded: Uint8Array = RLP.encode(extraDataContent);
      extraData = '0x' + Buffer.from(extraDataCoded).toString('hex');
      break;
    }
  }
  return extraData;

}
