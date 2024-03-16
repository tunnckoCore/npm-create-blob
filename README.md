# create-blob

> Creating Ethereum blob transactions from file, as easy as running `npm create blob <filepath>`.

1. You need any recent Node.js version, with Npm
2. You need to provide 2 env variables - `BLOB_CREATOR_PRIVATE_KEY` or `BLOB_CREATOR_MNEMONIC`, and `ETH_RPC_NODE_ENDPOINT`
3. Then just `npm create blob <path_to_file>`

You can create `.env` file in the directory from where you are running the command, or pass them before the command.

Example `.env` file

```
# This is a sample file. You should replace the values with your own.
# You can get RPC node endpoint url by signing up on GetBlock and creating ETHEREUM RPC NODE.
#
# The account of the BLOB_CREATOR_PRIVATE_KEY should have some ETH to pay for gas,
# blobs are pretty cheap $5-10 bucks are enough even if your file is 243kb!
#
# Alternatively you can pass your seedphrase/mnemonic
# in BLOB_CREATOR_MNEMONIC and the private key will be derived from it.

BLOB_CREATOR_PRIVATE_KEY="your private key here"
BLOB_CREATOR_MNEMONIC="or your seed phrase"
ETH_RPC_NODE_ENDPOINT="rpc node url"
NETWORK_CHAIN_ID="1"
```

or by providing them before the `npm create` command like so

```
BLOB_CREATOR_PRIVATE_KEY="0x my private key" ETH_RPC_NODE_ENDPOINT="url here" npm create blob ./some-path-somewhere.txt
```

That's it, #LetsGetBlobbed!
