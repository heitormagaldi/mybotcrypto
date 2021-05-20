require('dotenv').config({  
    path: process.env.NODE_ENV === "test" ? ".env.dev" : ".env"
  })

setInterval(() => {
  console.log(process.env.API_URL)  
}, process.env.CRAWLER_INTERVAL);