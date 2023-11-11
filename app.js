const axios = require('axios');


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

const OffDays = [
    "2023-12-17"
    , "2024-01-25"
    , "2024-02-08"
    , "2024-02-11"
    , "2024-02-25"
    , "2024-03-19"]

const beforOffDays = [
    , "2023-12-16"
    , "2024-01-24"
    , "2024-02-07"
    , "2024-02-10"
    , "2024-02-24"
    , "2024-03-18"]



const symbolConfigs = [249, 229, 235, 237, 238, 240, 242, 245, 246, 248, 228, 250, 251, 257, 259, 260, 261, 262, 263];
var symbolVolum = {
    "249": -500
    , "229": -500
    , "235": -500
    , "237": -500
    , "238": -500
    , "240": -500
    , "242": -500
    , "245": -500
    , "246": -500
    , "248": -500
    , "228": -500
    , "250": -500
    , "251": -500
    , "257": -500
    , "259": -500
    , "260": -500
    , "261": -500
    , "262": -500
    , "263": -500
}


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
            if (getResponse.data.marketView.tradesVolume != 0 && getResponse.data.marketView.tradesVolume != symbolVolum[symbolConfig]) {

                symbolVolum[symbolConfig] = getResponse.data.marketView.tradesVolume;


                const dateString = getResponse.data.marketView.lastTradeDateTime;
                const dateObject = new Date(dateString);

                // Extracting time components
                const hours = dateObject.getUTCHours();
                const minutes = dateObject.getUTCMinutes();

                // Adding 3 hours and 30 minutes to the dateObject
                dateObject.setUTCHours(hours + 3);
                dateObject.setUTCMinutes(minutes + 30);

                // Extracting the updated time components
                const updatedHours = dateObject.getUTCHours();
                const updatedMinutes = dateObject.getUTCMinutes();
                const updatedSeconds = dateObject.getUTCSeconds();

                // Formatting the updated time string
                const formattedTime = `${updatedHours}:${updatedMinutes}:${updatedSeconds}`;

                const sajjadUrl = `http://87.107.190.134/bk/inputS.php?data=${getResponse.data.contract.symbol.toUpperCase()}:|:${getResponse.data.marketView.lastTradedPrice.toLocaleString()}:|:${formattedTime}:|:${getResponse.data.marketView.tradesVolume.toLocaleString()}&token=tfu37Y5fluYi6do03Ddl12w`
                // console.log(sajjadUrl);
                const sajjadResponse = await axios.get(sajjadUrl);


                console.log(`${getResponse.data.contract.symbol.toUpperCase()}:|:${getResponse.data.marketView.lastTradedPrice.toLocaleString()}:|:${formattedTime}:|:${getResponse.data.marketView.tradesVolume.toLocaleString()}`);
            }
        } else {
            console.error('OPTIONS request failed for', symbolConfig);
        }
    } catch (error) {
        console.error(`Error for symbolConfig ${symbolConfig}:`, error.message);
    }
}

async function fetchDataForSymbolConfigs() {
    while (true) {
        var shouldSendData = false;
        var date = new Date();

        // Extracting time components
        var hours = date.getUTCHours();
        var minutes = date.getUTCMinutes();

        // Adding 3 hours and 30 minutes to the date
        date.setUTCHours(hours + 3);
        date.setUTCMinutes(minutes + 30);

        // Extracting the updated time components
        var updatedHours = date.getUTCHours();
        var updatedMinutes = date.getUTCMinutes();
        var dayOfWeek = date.getUTCDay();
        var dayOfMonth = date.getUTCDate();
        var Month = date.getUTCMonth();
        var year = date.getUTCFullYear();

        var myMadeDate = `${year}-${Month}-${dayOfMonth}`; // Adding 1 to Month because months are zero-based in JavaScript

        if (!OffDays.includes(myMadeDate) && dayOfWeek !== 5) {
            if (!beforOffDays.includes(myMadeDate) && dayOfWeek !== 4) {
                // Check if time is less than 5 PM and more than 10:30 AM
                if (updatedHours < 17 && (updatedHours > 10 || (updatedHours === 10 && updatedMinutes >= 28))) {
                    shouldSendData = true;
                }
            } else {
                if (updatedHours < 15 && (updatedHours > 10 || (updatedHours === 10 && updatedMinutes >= 28))) {
                    shouldSendData = true;
                }
            }
        }



        if (shouldSendData) {

            for (const symbolConfig of symbolConfigs) {
                await sendOptionsRequest(symbolConfig);
                // Wait for 1 second before processing the next symbolConfig
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

}

fetchDataForSymbolConfigs();

