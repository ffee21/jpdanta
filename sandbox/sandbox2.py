import datetime
import requests

def gettimestamp(s):
    print("Timestamp(" + str(s) + "): " + str(datetime.datetime.now()))

now = datetime.datetime.now()
gettimestamp(1)
# takes around 1 sec
r = requests.get("https://poloniex.com/public?command=returnTicker")
gettimestamp(2)
ticker_now = r.json()
gettimestamp(3)
coins = list(ticker_now.keys())
btc_based_coins = list(filter(lambda x: x.startswith("BTC_"), list(ticker_now.keys())))

print(coins)
print(btc_based_coins)
gettimestamp(4)
for key in btc_based_coins:
    print(key)
    print(ticker_now[key])
gettimestamp(5)
