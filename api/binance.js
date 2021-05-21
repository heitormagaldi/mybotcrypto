const axios = require('axios');
const queryString = require('querystring');
const fromUnixTime = require('date-fns/fromUnixTime');
const format = require('date-fns/format')

async function  publicCall(path, data, method = 'GET'){
    try{

        const qs = data ? `?${queryString.stringify(data)}` : '';
                
       const result = await axios({
             method,
             url: `${process.env.API_URL}${path}${qs}`   
        })

        return result.data;

    }catch(err){
        console.log(err);
    }
    
}

async function time(){
    const data = await publicCall('/v3/time');
   //não esta convertendo certo
   // return format(fromUnixTime(data.serverTime),"dd-MM-yyyy'T'HH:mm:ss");
   return data;

}



async function depth(symbol = 'BTCBRL', limit = 5 ){
    return publicCall('/v3/depth',{symbol, limit})
}

module.exports = {time, depth}