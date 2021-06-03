
const api = require("./api/binance")
require('dotenv').config({
  path: process.env.NODE_ENV === "test" ? ".env.dev" : ".env"
})


const symbol = process.env.SYMBOL;

const timerId = setInterval(async () => {

  let priceSell = 0, priceBuy = 0;


  const result = await api.depth(symbol);

  const lnFlagBuy = 20000000;
  const lnFlagSell = 20000000;
  // console.log(await api.time());
  console.log(result.bids);

  if (result.bids && result.bids.length) {
    priceBuy = parseFloat(result.bids[0][0]).toFixed(2);
    console.log(`Higher Buy: ${result.bids[0][0]}`);
  }
  if (result.asks && result.asks.length) {
    priceSell = parseFloat(result.asks[0][0]).toFixed(2);
    console.log(`Lower Sell: ${result.asks[0][0]}`);
  }


  if (priceSell < lnFlagSell) {
    console.log("It's time to buy!");
    
    const account = await api.accountInfo();

    const coins = account.balances.filter(b=> symbol.indexOf(b.asset) !== -1 );
    
    console.log(`Real time digital Wallet: (${symbol})`);
    
    console.log(coins);

  } else if (priceBuy > lnFlagBuy) {
    console.log("It's time to sell!");
  } else {
    console.log('No action, wait for a market reaction!');
  }

  const properID = CheckReload();

  if (properID > 0) {
    clearInterval(timerId);
  }

  //console.log(await api.exchangeInfo());

}, process.env.CRAWLER_INTERVAL);

//depois eu defino uma condição de saida
function CheckReload() {
  return 0
}