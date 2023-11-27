import {
    Network,
    ValidatorClient,
    IndexerConfig,
    ValidatorConfig,
    BECH32_PREFIX
} from '@dydxprotocol/v4-client-js';
import { SubaccountClient } from '@dydxprotocol/v4-client-js';
import {
    OrderExecution, OrderSide, OrderTimeInForce, OrderType,
} from '@dydxprotocol/v4-client-js';
import { CompositeClient } from "@dydxprotocol/v4-client-js";
import clients from '@dydxprotocol/v4-client-js';
import { config } from 'dotenv';
config();
const { LocalWallet } = clients;
const indexerConfig = new IndexerConfig(
    "https://indexer.dydx.trade/",
    "wss://indexer.dydx.trade/v4/ws",
);

const denomConfig = {
    USDC_DENOM: 'ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5',
    USDC_DECIMALS: 6,
    USDC_GAS_DENOM: 'uusdc',
    CHAINTOKEN_DENOM: "adydx", //string
    CHAINTOKEN_DECIMALS: 18 //integer
};

const validatorConfig = new ValidatorConfig(
    "https://dydx-mainnet-full-rpc.public.blastapi.io",
    "dydx-mainnet-1",
    denomConfig
);

const custom_network = new Network(
    'dydx-mainnet-1',
    indexerConfig,
    validatorConfig
);

const client = await ValidatorClient.connect(
    custom_network.validatorConfig
);


const mnemonic = process.env.mnemonic;
const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
async function getAddress() {
    console.log(wallet.address);
}
async function getAccountBalances() {
    // Get all balances for an account.
    const balances = await client.get.getAccountBalances(wallet.address)
    console.log(balances);
    // Get balance of one denom for an account.
    // const balance = await client.get.getAccountBalance(DYDX_ADDRESS, TOKEN_DENOM)
}
async function withdraw() {
    const subaccount = new SubaccountClient(wallet, 0);
    const assetId = "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5"; // asset id of the token you want to withdraw
    const amount = 1;
    const tx = await client.post.withdraw(
        subaccount,
        assetId,
        amount
    );
    console.log(tx.hash.toString());
}
async function placeOrderBuy() {

    const compositeClient = await CompositeClient.connect(custom_network);

    const subaccount = new SubaccountClient(wallet, 0);
    const clientId = 1901901901; // set to a number, can be used by the client to identify the order
    const market = "BTC-USD"; // perpertual market id
    const type = OrderType.MARKET; // order type
    const side = OrderSide.BUY; // side of the order
    const timeInForce = OrderTimeInForce.GTT; // UX TimeInForce
    const execution = OrderExecution.DEFAULT;
    const price = 37406; // price of 30,000;
    const size = 0.001; // subticks are calculated by the price of the order
    const postOnly = false; // If true, order is post only
    const reduceOnly = false; // if true, the order will only reduce the position size
    const triggerPrice = null; // required for conditional orders

    const tx = await compositeClient.placeOrder(
        subaccount,
        market,
        type,
        side,
        price,
        size,
        clientId,
        timeInForce,
        60,
        execution,
        postOnly,
        reduceOnly,
        triggerPrice
    );
    console.log(tx.hash);
}
async function placeOrderSell() {

    const compositeClient = await CompositeClient.connect(custom_network);

    const subaccount = new SubaccountClient(wallet, 0);
    const clientId = 1901901903; // set to a number, can be used by the client to identify the order
    const market = "BTC-USD"; // perpertual market id
    const type = OrderType.MARKET; // order type
    const side = OrderSide.SELL; // side of the order
    const timeInForce = OrderTimeInForce.FOK; // UX TimeInForce
    const execution = OrderExecution.IOC;
    const price = 37000; // price of 30,000;
    const size = 0.001; // subticks are calculated by the price of the order
    const postOnly = false; // If true, order is post only
    const reduceOnly = false; // if true, the order will only reduce the position size
    const triggerPrice = null; // required for conditional orders

    const tx = await compositeClient.placeOrder(
        subaccount,
        market,
        type,
        side,
        price,
        size,
        clientId,
        timeInForce,
        60,
        execution,
        postOnly,
        reduceOnly,
        triggerPrice
    );
    console.log(tx.hash);
}
async function main() {
    await getAddress();
    // await getAccountBalances();
    // await withdraw();
    await placeOrderSell();
}
main();