import datetime
import requests
import pymysql.cursors

def getconn():
    PASSPHRASE_FILE = './sandbox/.passphrase'
    PASSPHRASE = ''

    with open(PASSPHRASE_FILE) as f:
        PASSPHRASE = f.read()

    connection = pymysql.connect(host='localhost',user='user',password=PASSPHRASE,db='jpdanta')

    return connection

def getticker():
    PUBLIC_TICKER_URL = "https://poloniex.com/public?command=returnTicker"

    r = requests.get(PUBLIC_TICKER_URL)
    ticker = r.json()
    return ticker

def getvaluelist(ticker):
    btc_based_coins = list(filter(lambda x: x.startswith("BTC_"), list(ticker.keys())))
    MZR_LIST = ['last', 'lowestAsk', 'highestBid', 'percentChange', 'baseVolume', 'quoteVolume', 'high24hr', 'low24hr']
    return_list = []
    for coin in btc_based_coins:
        for mzr in MZR_LIST:
            return_list.append([coin, mzr, ticker[coin][mzr]])

    return return_list

def insertticker(conn, value_list, timestamp):
    with conn.cursor() as cursor:
        sql = "INSERT INTO `ticker` (`mzrtime`, `coin`, `mzr`, `value`) VALUES (%s, %s, %s, %s)"
        for item in value_list:
            cursor.execute(sql, (timestamp, item[0], item[1], item[2]))
    conn.commit()

def log(conn, message, level=0):
    with conn.cursor() as cursor:
        sql = "INSERT INTO `log` (`level`, `body`) VALUES (%s, %s)"
        cursor.execute(sql, (level, message))
    conn.commit()
    print(str(datetime.datetime.now()) + ": [" + str(level) + "] " + message)    

conn = getconn()
log(conn, "Fetching the ticker", 0)
timestamp = datetime.datetime.now()
ticker_now = getticker()
log(conn, "Inserting into DB", 0)
value_list = getvaluelist(ticker_now)
insertticker(conn, value_list, timestamp)
log(conn, "Finishing ticker insert", 0)

conn.close()