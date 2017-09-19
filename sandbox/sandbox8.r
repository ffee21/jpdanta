## intall packages & load them
if (! ("mongolite" %in% rownames(installed.packages()))) { install.packages("mongolite") }
library(mongolite)

## MongoDB connection
con <- mongolite::mongo(collection = "tickers",
                        db = "jpdanta",
                        url = "mongodb://192.168.0.15",
                        verbose = TRUE,
                        options = ssl_options())

df <- con$find(query = '{"a": 121, "b": 1}')
plot(df$d, df$c, type="l")
head(df)
