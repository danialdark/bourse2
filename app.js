const axios = require('axios');
const Redis = require('ioredis');
// const redis = new Redis({

//     host: 'localhost',
//     port: '6379',
//     password: '',
//     enableCompression: true,
// });

// var pipeline = redis.pipeline();


const headersOptions = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Access-Control-Request-Headers': 'clientid',
    'Access-Control-Request-Method': 'GET',
    'Connection': 'keep-alive',
    'Host': 'sm.exphoenixfuture.ir:8080',
    'Origin': 'https://sm.exphoenixfuture.ir',
    'Referer': 'https://sm.exphoenixfuture.ir/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
};

const symbolConfigs = [249, 229, 235, 237, 238, 240, 242, 245, 246, 248, 228, 250, 251, 257, 259, 260, 261, 262, 263];

const headersGet = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'Cookie': 'cookiesession1=678B28F55CE1E00A1EBBCB16AF79AD3A; ClientId=6a423320-3782-475c-a0b3-b4f45919a4cd; 6a423320-3782-475c-a0b3-b4f45919a4cd-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDAwMTMwNzYiLCJjdXN0b21lci1pZCI6IjIwMDAxMzA3NiIsInVzZXItaWQiOiI1NyIsIm5hdGlvbmFsLWlkIjoiMjI5ODY1Nzg2NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImN1c3RvbWVyIiwianRpIjoiOGNhNmE4NDctMDliMS00ZTk0LTlmMTgtNzYwZTczNTg3YjNjIiwiZXhwIjoxNjk5NzMxNTg1LCJpc3MiOiJTYWhyYUFUSSIsImF1ZCI6IlNhaHJhQVRJIn0.hKJ3-hHW8nIeAdM3kOCPffA6XLDvElPZoCzw5CronDc',
    'Host': 'sm.exphoenixfuture.ir:8080',
    'Origin': 'https://sm.exphoenixfuture.ir',
    'Referer': 'https://sm.exphoenixfuture.ir/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'clientId': '6a423320-3782-475c-a0b3-b4f45919a4cd',
    'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
};

async function sendOptionsRequest(symbolConfig) {
    const optionsUrl = `https://sm.exphoenixfuture.ir:8080/api/v5/Contract/contracts/${symbolConfig}?Market=1&WithContract=true&WithContractOrder=true&WithMarketView=true&loadUserContracts=true`;
    try {
        // Send OPTIONS request
        const optionsResponse = await axios.options(optionsUrl, { headers: headersOptions });
        // console.log('OPTIONS Response Status Code for', symbolConfig, ':', optionsResponse.status);

        // Check if the OPTIONS request was successful before proceeding with the GET request
        if (optionsResponse.status === 204 || optionsResponse.status === 200) {
            // Send GET request
            const getUrl = `https://sm.exphoenixfuture.ir:8080/api/v5/Contract/contracts/${symbolConfig}?Market=1&WithContract=true&WithContractOrder=true&WithMarketView=true&loadUserContracts=true`;
            const getResponse = await axios.get(getUrl, { headers: headersGet });
            // console.log(`GET Response Status Code for ${symbolConfig}:`, getResponse.status);
            // console.log("name: " + getResponse.data.contract.symbol)
            // console.log("lastTradeDateTime: " + getResponse.data.marketView.lastTradeDateTime)
            // console.log("tradesVolume: " + getResponse.data.marketView.tradesVolume)
            // console.log("lastTradedPrice: " + getResponse.data.marketView.lastTradedPrice)

            const dateString = getResponse.data.marketView.lastTradeDateTime;
            const dateObject = new Date(dateString);

            // Extracting time components
            const hours = dateObject.getHours();
            const minutes = dateObject.getMinutes();
            const seconds = dateObject.getSeconds();

            // Formatting the time string
            const formattedTime = `${hours}:${minutes}:${seconds}`;

            console.log(formattedTime);

            const sajjadUrl = `http://87.107.190.134/bk/inputS.php?data=${getResponse.data.contract.symbol.toUpperCase()}:|:${getResponse.data.marketView.lastTradedPrice.toLocaleString()}:|:${formattedTime}:|:${getResponse.data.marketView.tradesVolume.toLocaleString()}&token=tfu37Y5fluYi6do03Ddl12w`
            console.log(sajjadUrl);
            const sajjadResponse = await axios.get(sajjadUrl);


            console.log(`${getResponse.data.contract.symbol.toUpperCase()} updated`);
        } else {
            console.error('OPTIONS request failed for', symbolConfig);
        }
    } catch (error) {
        console.error(`Error for symbolConfig ${symbolConfig}:`, error.message);
    }
}

async function fetchDataForSymbolConfigs() {
    while (true) {
        for (const symbolConfig of symbolConfigs) {
            await sendOptionsRequest(symbolConfig);
            // Wait for 1 second before processing the next symbolConfig
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}

fetchDataForSymbolConfigs();

