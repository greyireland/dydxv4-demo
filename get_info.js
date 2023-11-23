import { IndexerClient, SocketClient, IndexerConfig } from "@dydxprotocol/v4-client-js";

const indexerConfig = new IndexerConfig(
    "https://indexer.dydx.trade/",
    "wss://indexer.dydx.trade/v4/ws",
);
const address = "dydx1gxn8297lxe3hdaqguj25qa546wamx8kqjtr4rn";
const subaccountNumber = 0;
const client = new IndexerClient(indexerConfig);

async function getHeight() {
    const response = await client.utility.getHeight();
    const height = response.height;
    const heightTime = response.time;
    console.log(response, height, heightTime);
}
async function getPerpetualMarkets() {
    const response = await client.markets.getPerpetualMarkets();
    console.log(response);
}
async function getPerpetualMarketOrderbook() {
    // ticker is the market ticket, such as "BTC-USD"
    const response = await client.markets.getPerpetualMarketOrderbook("BTC-USD");

    const asks = response.asks;
    const bids = response.bids;
    console.log(response);
}
async function getPerpetualMarketHistoricalFunding() {
    // ticker is the market ticket, such as "BTC-USD"
    const response = await client.markets.getPerpetualMarketHistoricalFunding("BTC-USD");
    const historicalFunding = response.historicalFunding;
    console.log(response);
}
async function getSubaccounts() {
    // address is the wallet address on dYdX chain
    const response = await client.account.getSubaccounts(address);
    const subaccounts = response.subaccounts;
    console.log(response);
}
async function getSubaccountAssetPositions() {
    // address is the wallet address on dYdX chain, subaccountNumber is the subaccount number
    const response = await client.account.getSubaccountAssetPositions(address, subaccountNumber);
    const positions = response.positions;
    console.log(response);
}
async function getSubaccountPerpetualPositions() {
    // address is the wallet address on dYdX chain, subaccountNumber is the subaccount number
    const response = await client.account.getSubaccountPerpetualPositions(address, subaccountNumber);
    const positions = response.positions;
    console.log(response);
}
async function getSubaccountOrders() {
    // address is the wallet address on dYdX chain, subaccountNumber is the subaccount number
    const response = await client.account.getSubaccountOrders(address, subaccountNumber);
    const orders = response;
    console.log(response);
}
async function subscribeToMarkets() {
    const mySocket = new SocketClient(
        indexerConfig,
        () => {
            console.log('socket opened');
        },
        () => {
            console.log('socket closed');
        },
        (message) => {
            if (typeof message.data === 'string') {
                const jsonString = message.data;
                console.log(jsonString);
                try {
                    const data = JSON.parse(jsonString);
                    if (data.type === "connected") {
                        // mySocket.subscribeToMarkets();
                        mySocket.subscribeToOrderbook('ETH-USD');
                        // mySocket.subscribeToTrades('ETH-USD');
                    }

                } catch (e) {
                    console.error('Error parsing JSON message:', e);
                }
            }
        },
    );
    mySocket.connect();
}
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
async function main() {
    await getHeight();
    await getSubaccounts();
    // await getSubaccountAssetPositions();
    // await getSubaccountPerpetualPositions();
    // await getSubaccountOrders();
    // await subscribeToMarkets();

}

main();