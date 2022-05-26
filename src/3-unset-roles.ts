import * as fs from 'fs';
import { sendTransactions, timedOutBatchTransactionsStates } from "@elrondnetwork/dapp-core";
import {
	Account,
	Address,
	AddressValue,
	ChainID,
	ContractFunction,
	GasLimit,
	I8Value,
	ProxyProvider,
	SmartContract,
	StringValue,
	AbiRegistry,
	SmartContractAbi,
	Egld,
	Balance,
	BigUIntValue,
	BytesValue,
	ArgSerializer,
	TransactionPayload,
	Transaction,
	TypedValue,
} from "@elrondnetwork/erdjs/out";
import {
	GATEWAY_URL,
	PEM_PATH,
	EXPLORER_URL,
	ESDT_SC_ADDRESS,
	TOKEN_NAME,
	TOKEN_TICKER,
	TOKEN_ID,
} from "./config";

import {
	account,
	provider,
	signer,
} from './provider';
import BigNumber from 'bignumber.js';
import {
	sleep,
	convertBigNumberToDate,
} from './util';

async function main() {
	const args: TypedValue[] = [
		BytesValue.fromUTF8(TOKEN_ID),
		new AddressValue(account.address),
		BytesValue.fromUTF8('ESDTTransferRole'),
	];
	const { argumentsString } = new ArgSerializer().valuesToString(args);
	const data = new TransactionPayload(`unSetSpecialRole@${argumentsString}`);
	const gasLimit = GasLimit.forTransfer(data).add(new GasLimit(60000000));

	const tx = new Transaction({
		nonce: account.getNonceThenIncrement(),
		receiver: new Address(ESDT_SC_ADDRESS),
		data: data,
		gasLimit: gasLimit,
	});

	await signer.sign(tx);
	const txHash = await tx.send(provider);
	console.log(`${EXPLORER_URL}${txHash.toString()}`);
}

(async function() {
	await account.sync(provider);
	await main();
})();