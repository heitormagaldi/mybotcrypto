
const { parse } = require("dotenv");
const api = require("./api/binance")
require('dotenv').config({
  path: process.env.NODE_ENV === "test" ? ".env.dev" : ".env"
})

const profitability = process.env.PROFITABILITY
const symbol = process.env.SYMBOL;
const coin = process.env.COIN;

const timerId = setInterval(async () => {

  let priceSell = 0, priceBuy = 0;


  const result = await api.depth(symbol);

  const lnFlagBuy = 20000000;
  const lnFlagSell = 20000000;


  // console.log(await api.time());
  console.log(result.bids);
  console.log(result.asks);

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

    const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);

    console.log(`Real time digital Wallet: (${symbol})`);

    console.log(coins);

    const wallet = parseFloat(coins.find(c => c.asset === coin).free);
    
    console.log("testge--------------------------------------------");
    console.log(wallet);
    console.log(priceSell);
    //equals to priceSell>0
    if (priceSell && priceSell <= wallet) {
      console.log('Check values in wallet..');
      //vai comprar 1 bitcoin a preço de mercado.  
      
      const qty = parseFloat((wallet/priceSell) - 0.00001).toFixed(5); 

      console.log(`Quantity of coin to buy ${qty}`);
      const buyOrder = await api.newOrder(symbol, 1);
      console.log(`Order ID ${buyOrder.orderId}`);
      console.log(`Status ${buyOrder.status}`);


      if (buyOrder.status === 'FILLED') {
        console.log('Position future sell');
        const price = parseFloat(priceSell * profitability).toFixed(5);
        const sellOrder = await api.newOrder(symbol, 1, price, 'SELL', 'LIMIT');
        console.log(`Buy for ${priceBuy} Salle for ${price}  profitability ${profitability}`)
        console.log(`Order ID ${sellOrder.orderId}`);
        console.log(`Status ${sellOrder.status}`);
      }

    }


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