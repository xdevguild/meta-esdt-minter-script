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

export const convertEsdtToWei = (v: number, decimals = 18) => {
    const factor = Math.pow(10, decimals);
    return (new BigNumber(v)).multipliedBy(factor);
};