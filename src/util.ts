import {
    ArgSerializer,
    Balance,
    BigUIntValue,
    BytesValue,
    guardValueIsSet,
    TransactionPayload,
    TypedValue
} from "@elrondnetwork/erdjs";
import BigNumber from 'bignumber.js';

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class ESDTTransferPayloadBuilder {
    private amount: Balance | null = null;

    setAmount(amount: Balance): ESDTTransferPayloadBuilder {
        this.amount = amount;
        return this;
    }

    /**
     * Builds the {@link TransactionPayload}.
     */
    build(): TransactionPayload {
        guardValueIsSet("amount", this.amount);

        let args: TypedValue[] = [
            // The token identifier
            BytesValue.fromUTF8(this.amount!.token.identifier),
            // The transfered amount
            new BigUIntValue(this.amount!.valueOf()),
        ];
        let { argumentsString } = new ArgSerializer().valuesToString(args);
        let data = `ESDTTransfer@${argumentsString}`;

        return new TransactionPayload(data);
    }
}

export function convertBigNumberToDate(big: BigNumber) {
    return new Date(big.toNumber() * 1000);
}

export const convertWeiToEsdt = (v: any, decimals = 18, precision = 4) => {
    // conversion for BigNumber operation
    if (typeof(v) != typeof(BigNumber)) v = new BigNumber(v);

    const number = v.dividedBy(new BigNumber(Math.pow(10, decimals))).toNumber();
    const factor = Math.pow(10, precision);
    return Math.floor(number * factor) / factor;
};