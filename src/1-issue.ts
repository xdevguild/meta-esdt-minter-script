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
	U64Value,
} from "@elrondnetwork/erdjs/out";
import {
	GATEWAY_URL,
	PEM_PATH,
	EXPLORER_URL,
	ESDT_SC_ADDRESS,
	TOKEN_NAME,
	TOKEN_TICKER,
	TOKEN_DECIMALS,
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
		BytesValue.fromUTF8(TOKEN_NAME),
		BytesValue.fromUTF8(TOKEN_TICKER),
		new U64Value(TOKEN_DECIMALS),
		BytesValue.fromUTF8('canFreeze'), BytesValue.fromUTF8('true'),
		BytesValue.fromUTF8('canWipe'), BytesValue.fromUTF8('true'),
		BytesValue.fromUTF8('canPause'), BytesValue.fromUTF8('true'),
		BytesValue.fromUTF8('canTransferNFTCreateRole'), BytesValue.fromUTF8('true'),
		BytesValue.fromUTF8('canChangeOwner'), BytesValue.fromUTF8('true'),
		BytesValue.fromUTF8('canUpgrade'), BytesValue.fromUTF8('true'),
		BytesValue.fromUTF8('canAddSpecialRoles'), BytesValue.fromUTF8('true'),
	];
	const { argumentsString } = new ArgSerializer().valuesToString(args);
	const data = new TransactionPayload(`registerMetaESDT@${argumentsString}`);
	const gasLimit = GasLimit.forTransfer(data).add(new GasLimit(60000000));

	const tx = new Transaction({
		nonce: account.getNonceThenIncrement(),
		receiver: new Address(ESDT_SC_ADDRESS),
		data: data,
		value: Egld.raw(50000000000000000),
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