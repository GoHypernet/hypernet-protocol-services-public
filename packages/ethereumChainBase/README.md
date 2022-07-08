# Ethereum Chain Base IE Chain Service
This package is designed to be used as the shared base for all Ethereum-based Chain Services. We have individual services for each chain, but for the EVM, all of them do more or less the same things, and that code is contained here. I will use the term Chain Service to refer to a generic chain service, but it could be the RinkebyService, EthereumService, AvalancheService, etc.

The Chain Service is designed to be the arbiter between the Hypernet code and the actual Blockchain the Chain Service represents. Each Chain Service should use the Blockchain entirely as its persistence layer, but this is not practicable in reality, because of Escrow wallets. Since we do not want to transmit around the keys for the various escrow wallets, the Chain Service will need to maintain a basic database that holds the private keys for the Escrow Wallets (encrypted, of course).

The Chain Service allows for 2-way communication with the chain, and thus, should also be listening for events coming from the chain. Of particular note are Profile tokens that are minted outside of Hypernet.ID (which should be turned into internal ProfileTokenMinted events), and deposits into an Escrow Wallet.

Minting activity is paid for either from the common chain Hot Wallet, or from an Escrow Wallet. I recommend that the common wallet be treated as an Escrow Wallet and use the same mechanisms, with the exception of the source of the private key (which can come from the Config rather than the DB). All minting actions should take an optional parameter for EscrowWalletId, and that is the wallet that will be used. An Escrow wallet must be linked to a particular Identity, which is the only person that can initiate a Withdrawal from the wallet. The IdentityService will want to track linked Escrow Wallets (which is not PII).

## Abstractions
### Escrow Wallet
An Escrow Wallet is an EOA that we create and control on the chain. It's just a private key and an ethereum address at it's core. All minting operations carried out by the Chain Service are done using an Escrow Wallet; the default/shared wallet is just a specific instance but is otherwise unchanged. Escrow Wallets store as little state as possible off-chain; everything, including balances, should be pulled from the underlying blockchain.

## Commands
### MintProfileToken
### MintIdentityToken
### GetProfileToken
### GetIdentityToken

## Task Queues
Most operations on the blockchain can take a while to complete, and some need to be done in massive amounts. Enter task queues.

### BatchMintTokens
Each job in this queue represents some number of NFTs to mint, using the Batch Mint Module. The ChainService is welcome to time shift this minting, and may monitor gas prices. Each completed job will generate a BatchMintComplete event; task queues are not responded to.