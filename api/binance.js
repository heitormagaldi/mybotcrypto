const axios = require('axios');
const queryString = require('querystring');
const crypto = require('crypto');
require('dotenv').config({
    path: process.env.NODE_ENV === "test" ? ".env.dev" : ".env"
  });

const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;


async function privateCall(path, data = {}, method = 'GET') {
    const timestamp = Date.now();
    const signature = crypto.createHmac('sha256', apiSecret)
        .update(`${queryString.stringify({ ...data, timestamp })}`)
        .digest('hex'); // retorno

    const newData = { ...data, timestamp, signature } ;
    
    const qs = `?${queryString.stringify(newData)}`;

    try {
        const result = await axios({
            method,
            url: `${apiUrl}${path}${qs}`,  // concatenação com template literals 
            headers: { 'X-MBX-APIKEY': apiKey } //particularidade da binance
        });

        return result.data;


    } catch (oErr) {
        console.log(oErr);
    }
}


async function accountInfo(){
    return privateCall('/v3/account');
}



async function publicCall(path, data, method = 'GET') {
    try {

        const qs = data ? `?${queryString.stringify(data)}` : '';

        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${qs}`
        })

        return result.data;

    } catch (err) {
        console.log(err);
    }

}

async function time() {
    const data = await publicCall('/v3/time');
    const date = new Date(data.serverTime);

    return date.getDate() +
        "/" + (date.getMonth() + 1) +
        "/" + date.getFullYear() +
        " " + date.getHours() +
        ":" + date.getMinutes() +
        ":" + date.getSeconds();

}

async function exchangeInfo() {
    return publicCall('/v3/exchangeInfo')
}

///Quantidade de livros de troca = limit de 5 trará somente 5 ordens, 
async function depth(symbol = 'BTCBRL', limit = 5) {
    return publicCall('/v3/depth', { symbol, limit })
}

module.exports = { time, depth, exchangeInfo, accountInfo }