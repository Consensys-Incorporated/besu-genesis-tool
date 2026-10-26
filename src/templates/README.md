# Besu Genesis Tool

### Using the keys and genesis files on instances

Once generated, the output should resemble the file structure below.

```bash
  ├── validator0                    
  │   └──  nodekey                      # the node private key
  │   └──  nodekey.pub                  # the node's public key which is used in the enode
  │   └──  address                      # the node's address which is used to vote the validator in/out
  │   └──  accountAddress               # the account's address
  │   └──  accountKeystore              # the account's v3 keystore
  │   └──  accountPassword              # the account's password (you would have supplied this)
  │   └──  accountPrivateKey            # the account's private key
  │               └── ...
  ├── validatorN                       
  │   └──  nodekey                      # the node private key
  │   └──  nodekey.pub                  # the node's public key which is used in the enode
  │   └──  ...
  |
  ├── bootnodeN                       
  │   └──  nodekey                      # the node private key
  │   └──  nodekey.pub                  # the node's public key which is used in the enode
  │   └──  ...
  |
  ├── memberN                      
  │   └──  nodekey                      # the node private key
  │   └──  nodekey.pub                  # the node's public key which is used in the enode
  │   └──  ...
  |
  ├── static-nodes.json                # a list of static nodes to make peering faster
  ├── genesis.json                     # this genesis file for any HLF Besu nodes
  ├── permissioned-nodes.toml          # local permissions for any HLF Besu node
  ├── config.toml                      # a starter config file for HLF Besu nodes
  └── userData.json                     # this answers provided in a single map
  └── README.md                         # this file     
  
```

Please remember to do the following:

1. Update the **<HOST>**  in both the permissions file and the static nodes files. Please note the selected ports are default and you may need to check firewall rules if using alternate ports
2. As above, update the permissioned-nodes.toml file
3. update **<HOST>** in every Besu nodes' config.toml 



### To start a HLF Besu node: 

```bash
/opt/besu/bin/besu --config-file=/config/config.toml 
```

Please refer to the [docs](https://docs.besu-eth.org/public-networks/how-to/configuration-file) for details on more cli args
