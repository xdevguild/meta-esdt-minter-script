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
	TOKEN_ID,
	TOKEN_MAX_NONCE,
	TOKEN_AMOUNT,
	DELAY_TIME,
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
	convertWeiToEsdt,
} from './util';

async function mint(nonce) {
	const args: TypedValue[] = [
		BytesValue.fromUTF8(TOKEN_ID),
		new U64Value(convertWeiToEsdt(TOKEN_AMOUNT, TOKEN_DECIMALS)),
		BytesValue.fromUTF8(`${TOKEN_NAME} #${nonce}`),
		new U64Value(300), // royalties 3%
		BytesValue.fromUTF8('HASH'),
		BytesValue.fromUTF8('tags:lkmex,locked'),
		BytesValue.fromUTF8('https://aero.mypinata.cloud/ipfs/QmapHXGPQ2mt3UhRaGUJbAjm3oe8iB4JDSKJsjrDwerQaR/1637875733.png'),
	];
	const { argumentsString } = new ArgSerializer().valuesToString(args);
	const data = new TransactionPayload(`ESDTNFTCreate@${argumentsString}`);
	const gasLimit = GasLimit.forTransfer(data).add(new GasLimit(6000000));

	const tx = new Transaction({
		nonce: account.getNonceThenIncrement(),
		receiver: account.address,
		data: data,
		gasLimit: gasLimit,
	});

	await signer.sign(tx);
	const txHash = await tx.send(provider);
	console.log(`${EXPLORER_URL}${txHash.toString()}`);
}


(async function() {
	await account.sync(provider);
	for (let i = 1; i <= TOKEN_MAX_NONCE; i++) {
		await mint(i);
		await sleep(DELAY_TIME);
	}
})();