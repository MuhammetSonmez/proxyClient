const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

async function getIpAndPortList() {
    const url = "https://www.sslproxies.org/";
    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new Error("Connection could not be established");
        }

        const $ = cheerio.load(response.data);
        const proxyList = [];

        $('tbody').find('tr').each((index, element) => {
            $(element).find('td').each((i, el) => {
                proxyList.push($(el).text());
            });
        });

        const ipList = [];
        const portList = [];

        for (let i = 0; i < proxyList.length; i += 8) {
            ipList.push(proxyList[i]);
            portList.push(proxyList[i + 1]);
        }

        return [ipList, portList];
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

async function checkIp() {
    try {
        const response = await axios.get("https://api.ipify.org");
        if (response.status !== 200) {
            throw new Error("Connection could not be established");
        }
        const ip = response.data;
        console.log(ip);
        return ip;
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

async function getProxy(url) {
    const [ipList, portList] = await getIpAndPortList();
    for (let i = 0; i < ipList.length; i++) {
        const proxy_ip = ipList[i];
        const proxy_port = portList[i];
        const proxy_url = `http://${proxy_ip}:${proxy_port}`;

        const agent = new https.Agent({
            rejectUnauthorized: false,
            secureProtocol: 'TLSv1_2_method',
        });

        try {
            const response = await axios.get(url, {
                proxy: {
                    host: proxy_ip,
                    port: proxy_port,
                    protocol: 'http:',
                },
                httpsAgent: agent,
                timeout: 3000
            });

            if (response.status === 200) {
                console.log("Connection successful.\nWorking proxy information: ");
                console.log(proxy_ip);
                console.log(proxy_port);
                console.log("if information ip is same this ip ->",response.data," proxy is working :)");
                
                break;
            }
        } catch (error) {
            console.log("Connection failed.\nIP:", proxy_ip, "Port:", proxy_port, "\nError:", error.message);
        }
    }
}


getProxy('https://api.ipify.org');



