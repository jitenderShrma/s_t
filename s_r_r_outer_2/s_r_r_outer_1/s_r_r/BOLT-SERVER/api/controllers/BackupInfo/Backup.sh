cd dataBackup > /dev/null
DIR=`date +%m-%d-%Y-%H.%M` > /dev/null
mkdir $DIR > /dev/null
# echo $DIR
cd $DIR > /dev/null
mongodump --db SellaciousNewDB > /dev/null



