#!/usr/bin/bash

mydir=$(dirname $0) && cd $mydir

filename="alltimes"

mongoexport --collection=alltimes --db=dlab-database1 --type=csv --fields=dayid,starttime,totaltime,lasttime,pcname,eiin,schoolname,labnum,pcnum --out "$filename.csv"
zip "${filename}.zip" "${filename}.csv"

mv "$filename.zip" ../static
rm "$filename.csv"
