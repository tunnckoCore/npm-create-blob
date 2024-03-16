import "dotenv/config";
import {
	blobsToCommitments,
	createPublicClient,
	createWalletClient,
	fallback,
	http,
	toBlobs,
	sha256,
	extractChain,
} from "viem";
import { generatePrivateKey, mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import * as chains from "viem/chains";
import { loadKZG } from "kzg-wasm";

export const kzg = await loadKZG();

export const chain = extractChain({
	chains: Object.values(chains),
	id: process.env.NETWORK_CHAIN_ID ? Number(process.env.NETWORK_CHAIN_ID) : 1,
});

export function contentToBlobs(content /* string | Uint8Array */) {
	const contentBuffer = typeof content === "string" ? new TextEncoder().encode(content) : content;
	const contentBlobs = toBlobs({ data: contentBuffer, to: "hex" });
	const contentCommitments = blobsToCommitments({ blobs: contentBlobs, kzg });
	const toBlobHash = (commitment) => {
		const sha_of_comm = sha256(commitment).slice(2); // first 2 are `0x`
		return "0x01" + sha_of_comm.slice(2);
	};

	return {
		content,
		buffer: contentBuffer,
		blobs: contentBlobs,
		commitments: contentCommitments,
		hashes: contentCommitments.map(toBlobHash),
		toBlobHash,
	};
}

export const account = process.env.BLOB_CREATOR_MNEMONIC
	? mnemonicToAccount(process.env.BLOB_CREATOR_MNEMONIC)
	: privateKeyToAccount(process.env.BLOB_CREATOR_PRIVATE_KEY);

export const transport = fallback([http(process.env.ETH_RPC_NODE_ENDPOINT)]);
export const client = createPublicClient({ chain, transport });
export const wallet = createWalletClient({ account, chain, transport });
