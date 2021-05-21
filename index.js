
const api = require("./api/binance")

require('dotenv').config({
  path: process.env.NODE_ENV === "test" ? ".env.dev" : ".env"
})

const  timerId = setInterval(async () => {
  
  //console.log(await api.time());
  console.log(await api.depth());

  const properID = CheckReload();

  if (properID > 0) {
    clearInterval(timerId);
  }


}, process.env.CRAWLER_INTERVAL);

//depois eu defino uma condição de saida
function CheckReload() {
  return 0
}