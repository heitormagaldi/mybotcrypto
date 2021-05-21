const axios = require('axios');
const queryString = require('querystring');


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
    const date = new Date(data.serverTime);
       
   return date.getDate()+
   "/"+(date.getMonth()+1)+
   "/"+date.getFullYear()+
   " "+date.getHours()+
   ":"+date.getMinutes()+
   ":"+date.getSeconds();

}

async function depth(symbol = 'BTCBRL', limit = 5 ){
       
    return publicCall('/v3/depth',{symbol, limit})
}

module.exports = {time, depth}