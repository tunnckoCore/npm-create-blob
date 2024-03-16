#!/usr/bin/env node

import "dotenv/config";
import path from "node:path";
import fs from "node:fs/promises";
import { parseGwei } from "viem";
import { client, contentToBlobs, wallet, kzg, account } from "./utils.mjs";

const [filepath] = process.argv.slice(2);

if (!filepath) {
	console.error("Usage: node index.mjs <filepath>");
	process.exit(1);
}

if (!process.env.ETH_RPC_NODE_ENDPOINT) {
	console.error(
		"ETH_RPC_NODE_ENDPOINT is not set! This is required, because not all nodes support Blob Transactions at the moment."
	);
	process.exit(1);
}

try {
	const file = await fs.readFile(path.join(process.cwd(), filepath));

	const fileArray = new Uint8Array(file);
	const { blobs, hashes } = contentToBlobs(fileArray);

	console.log("File Size:", file.length);
	console.log("Blobs Hashes:", hashes);

	const { maxFeePerGas, maxPriorityFeePerGas } = await client.estimateFeesPerGas();
	const hash = await wallet.sendTransaction({
		blobs,
		kzg,
		maxFeePerGas,
		maxPriorityFeePerGas,
		maxFeePerBlobGas: parseGwei("3"),
		to: account.address,
		type: "eip4844",
		value: 0n,
		data: "0x646174613a3b72756c653d65736970362c6973626c6f62",
	});

	console.log("Great! Blob transaction created!");
	console.log("Check the Blobs tab on EtherScan https://etherscan.io/tx/%s", hash);
} catch (er) {
	const errors = er.message.split("\n");
	console.log("SOME ERR!", errors[0], errors[1], "\n" + errors.slice(6).join("\n"));
}
