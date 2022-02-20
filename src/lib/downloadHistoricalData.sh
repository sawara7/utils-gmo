STARTDATE="2021/02/18"
ENDDATE="2021/02/19"

CURRENTDATE=$STARTDATE

while [ 1 ] ; 
do
    if [ $CURRENTDATE = $ENDDATE ] ; then
        break
    fi

    year=`date -j -f "%Y/%m/%d" $CURRENTDATE "+%Y"`
    month=`date -j -f "%Y/%m/%d" $CURRENTDATE "+%m"`
    day=`date -j -f "%Y/%m/%d" $CURRENTDATE "+%d"`
    path='https://api.coin.z.com/data/trades/BTC_JPY/'$year'/'$month'/'$year$month$day'_BTC_JPY.csv.gz'
    dir='Desktop/dev/tradebot/src/exchange/gmo/historical_data/'
    wget -P ~/$dir $path
    
    CURRENTDATE=`date -v+1d -j -f "%Y/%m/%d" $CURRENTDATE "+%Y/%m/%d"`

done

gzip -d ~/$dir/*.gz