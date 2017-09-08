## intall packages & load them
if (! ("mongolite" %in% rownames(installed.packages()))) { install.packages("mongolite") }
library(mongolite)

## MongoDB connection
con <- mongolite::mongo(collection = "tickers",
                        db = "jpdanta",
                        url = "mongodb://localhost",
                        verbose = TRUE,
                        options = ssl_options())

con$count()
df <- con$find(query = '{"a": 7, "b": 1}')
head(df)
plot(df$d, df$c)
df$d
