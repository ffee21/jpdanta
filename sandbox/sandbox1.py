import datetime
import pymysql.cursors

PASSPHRASE_FILE = './sandbox/.passphrase'
PASSPHRASE = ''

with open(PASSPHRASE_FILE) as f:
    PASSPHRASE = f.read()

connection = pymysql.connect(host='localhost',
                             user='user',
                             password=PASSPHRASE,
                             db='jpdanta')

try:
    with connection.cursor() as cursor:
        sql = "INSERT INTO `ticker` (`mzrtime`, `coin`, `mzr`, `value`) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (datetime.datetime.now(), 'BTC', 'up', 1))
    connection.commit()

    with connection.cursor() as cursor:
        sql = "SELECT * FROM `ticker` WHERE `coin`=%s AND `mzr`=%s"
        cursor.execute(sql, ('BTC', 'up', ))
        result = cursor.fetchall()
        print(result)
finally:
    connection.close()