# Besu Genesis Tool

A CLI that generates everything you need to stand up an [LFDT Besu](https://docs.besu-eth.org/) (formerly under the Hyperledger project) network: a genesis file, node keys, account keys, static nodes, a permissions file and a starter `config.toml`.

Supported consensus protocols: **QBFT** (default), **IBFT2** and **Clique**.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Usage](#usage)
3. [Output](#output)
4. [Using the output](#using-the-output)
5. [Development](#development)
6. [Publishing](#publishing)

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) v22.13 or later

## Usage

### Interactive

Run the tool with no arguments and answer the prompts. Press enter to accept a default.

```bash
npx @consensys/besu-genesis-tool
```

```
Which consensus algorithm will you use? Default: QBFT
        1. IBFT2
        2. QBFT
        3. Clique

Set your chainID value: (integer) Default: 1337
Set your blockperiodseconds value: (integer) Default: 5
Set your requestTimeoutSeconds value: (integer) Default: 10
Set your epoch length value: (integer) Default: 30000
Set your difficulty: (integer) Default: 1
Set your gas limit value: (string) Default: 0xFFFF
Set your coinbase address for rewards: (string) Default: 0x0000000000000000000000000000000000000000
Set your max code size value: (integer) Default: 64
Choose number of bootnode node keys to generate: (integer) Default: 2
Choose number of validator node keys to generate: (integer) Default: 4
Choose number of member node keys to generate: (integer) Default: 1
Set your account password: (empty for none)
Include quorum-dev-quickstart test accounts: [y/N]
Include JSON format of the prefunded account {'address': { 'balance': '100000'}}: (default {})
Set your output path for the artifacts: (default ./output)
```

QBFT also asks for the balance allocated to each node's account.

### Non-interactive

Pass any CLI option to skip the prompts. Options you leave out take their defaults.

```
npx @consensys/besu-genesis-tool --help

Options:
  --help                   Show help                                   [boolean]
  --version                Show version number                         [boolean]
  --consensus              Consensus algorithm to use
      [string] [required] [choices: "ibft2", "qbft", "clique"] [default: "qbft"]
  --chainID                ChainID for blockchain
                                             [number] [required] [default: 1337]
  --blockperiod            Number of seconds per block
                                                [number] [required] [default: 5]
  --requestTimeout         Minimum request timeout for each round
                                                          [number] [default: 10]
  --epochLength            Number of blocks after which votes reset
                                            [number] [required] [default: 30000]
  --difficulty             Difficulty of network[number] [required] [default: 1]
  --gasLimit               Block gas limit
                                         [string] [required] [default: "0xFFFF"]
  --coinbase               Address to pay mining rewards to
                [string] [default: "0x0000000000000000000000000000000000000000"]
  --maxCodeSize            Maximum contract size (kb)     [number] [default: 64]
  --validators             Number of validator node keys to generate
                                                [number] [required] [default: 4]
  --members                Number of member node keys to generate
                                                [number] [required] [default: 1]
  --bootnodes              Number of bootnode node keys to generate
                                                [number] [required] [default: 2]
  --accountPassword        Password for keys              [string] [default: ""]
  --outputPath             Output path relative to current directory
                                                  [string] [default: "./output"]
  --quickstartDevAccounts  Include quorum-dev-quickstart test accounts
                                           [boolean] [required] [default: false]
  --genesisNodeAllocation  Balance allocated to each nodes
                   [string] [required] [default: "1000000000000000000000000000"]
  --alloc                  JSON format of the prefunded accounts {'address': {
                           balance: '100000'}}
                                             [string] [required] [default: "{}"]
  --noOutputTimestamp      Remove generated timestamp from output folder name
                                                      [boolean] [default: false]
```

QBFT network with the defaults (4 validators, 2 bootnodes, 1 member):

```bash
npx @consensys/besu-genesis-tool --consensus qbft
```

Fully specified QBFT network:

```bash
npx @consensys/besu-genesis-tool --consensus qbft --chainID 400 --blockperiod 5 --requestTimeout 10 --epochLength 30000 \
  --difficulty 1 --gasLimit '0xFFFFFF' --coinbase '0x0000000000000000000000000000000000000000' \
  --validators 4 --members 0 --bootnodes 2
```

Clique network with a prefunded account:

```bash
npx @consensys/besu-genesis-tool --consensus clique --validators 3 \
  --alloc '{"0xfe3b557e8fb62b89f4916b721be55ceb828dbd73": {"balance": "1000000000000000000000"}}'
```

### Accounts

Each node (bootnode, validator and member) gets an Ethereum account, stored in the `account*` files in its directory. The account is prefunded in the genesis with `genesisNodeAllocation`. To change or remove allocations before the network starts, edit `genesis.json`.

Use `--alloc` to prefund other accounts.

`--quickstartDevAccounts` adds the well-known [quorum-dev-quickstart](https://github.com/consensys-incorporated/quorum-dev-quickstart) test accounts to the genesis. It defaults to `false`, on the assumption that the genesis is for production. _**Never use these accounts in production. Their private keys are public.**_

## Output

Artifacts go to `./output/<TIMESTAMP>` by default. Use `--outputPath` to change the base folder and `--noOutputTimestamp` to write into it directly.

```bash
output/<TIMESTAMP>
  ├── validator0
  │   └──  nodekey                      # the node private key
  │   └──  nodekey.pub                  # the node's public key, used in the enode
  │   └──  address                      # the node's address, used to vote the validator in/out
  │   └──  accountAddress               # the account's address
  │   └──  accountKeystore              # the account's v3 keystore
  │   └──  accountPassword              # the account's password (as supplied)
  │   └──  accountPrivateKey            # the account's private key
  ├── validatorN
  │   └──  ...
  ├── bootnodeN
  │   └──  ...
  ├── memberN
  │   └──  ...
  ├── genesis.json                      # the genesis file for every Besu node
  ├── config.toml                       # a starter Besu config file
  ├── static-nodes.json                 # static nodes to make peering faster
  ├── permissioned-nodes.toml           # local node permissions allowlist
  ├── userData.json                     # the answers you provided
  └── README.md                         # instructions for using these files
```

## Using the output

1. Replace `<HOST>` in `static-nodes.json` and `permissioned-nodes.toml` with each node's host. The ports are Besu defaults, so check your firewall rules if you use different ones.
2. Replace the `<REPLACE_ME>` and `<HOST>` placeholders in each node's copy of `config.toml`.
3. Give each node its `nodekey`, plus the shared `genesis.json` and `config.toml`, then start it:

```bash
besu --config-file=/config/config.toml
```

See the Besu docs on [configuration files](https://docs.besu-eth.org/public-networks/how-to/configuration-file) for more options.

## Development

```bash
npm install          # install dependencies and build
npm run build        # compile TypeScript to ./build
npm test             # run the test suite (vitest)
npm run lint         # lint with eslint
npm start            # run the CLI from ./build
```

## Publishing

The package is published to npm as `@consensys/besu-genesis-tool`, with public access. 

1. Start from an up-to-date `main` with no uncommitted changes, and check you're logged in to npm:

   ```bash
   git checkout main && git pull
   npm whoami          # run `npm login` if this fails
   ```

2. Bump the version. This updates `package.json` and `npm-shrinkwrap.json`, commits the change and creates a `vX.Y.Z` git tag:

   ```bash
   npm version patch   # or minor / major
   ```

3. Optionally, check what will be published:

   ```bash
   npm pack --dry-run
   ```

4. Build, lint, test and publish:

   ```bash
   npm run release
   ```

   This runs `clean`, `build`, `lint` and `test`, then `npm publish --tag=latest`. It stops at the first failure, so nothing is published unless every step passes.

5. Once the publish succeeds, push the version commit and tag:

   ```bash
   git push --follow-tags
   ```

If step 4 fails, undo the version bump with `git tag -d vX.Y.Z && git reset --hard HEAD~1`, fix the problem, and start again from step 2.

To publish a pre-release without making it the default install, use `npm version prerelease --preid=beta`. Then run the release steps by hand with `npm publish --tag next` in place of `npm run release`, because that script always publishes to `latest`.

## License

[Apache-2.0](LICENSE)
