import requests
from bs4 import BeautifulSoup

def getIpAndPortList():
    url = "https://www.sslproxies.org/"
    response = requests.get(url)
    if response.status_code != 200:
        print("Connection could not be established")
        exit()

    html:str = response.text
    soup = BeautifulSoup(html, 'html.parser')
    tbody = soup.find('tbody')
    proxyList = []

    if tbody:
        rows = tbody.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            for cell in cells:
                proxyList.append(cell.text)
    ipList = []
    portList = []

    for i in range(0,len(proxyList), 8):
        ipList.append(proxyList[i])
        portList.append(proxyList[i+1])

    return ipList, portList


def checkIp():
    response = requests.get("https://api.ipify.org")
    if response.status_code != 200:
        print("Connection could not be established")
        exit()
    ip = response.text
    print(ip)
    return ip


def getProxy(url:str="https://api.ipify.org"):

    ipList = getIpAndPortList()[0]
    portList = getIpAndPortList()[1]

    for i in range(len(ipList)):
        proxy_ip:str = ipList[i]
        proxy_port:str = portList[i]
        proxy_url = f'http://{proxy_ip}:{proxy_port}'

        try:
            response = requests.get(url, proxies={'http': proxy_url, 'https': proxy_url},timeout=3)

            if response.status_code == 200:
                #print("Connection successful.\nWorking proxy information: ")
                #print(ipList[i])
                #print(portList[i])
                print("proxy connected!")
                if url == "https://api.ipify.org":
                    print(f"if ip adresses are same it's working {response.text}, {proxy_url}")
                
                return ipList[i], portList[i]
            break
        except Exception as e:
            print("Connection failed.\nIP: ", ipList[i], " Port: ", portList[i],"\n")



if __name__ == "__main__":
    getProxy()
# :)
