#!/bin/bash
#timestamp=$(date +"%Y%m%d_%H%M%S")
filename="intervalinfos"
mongoexport --collection=intervalinfos --db=dlab --type=csv --fields=dayid,starttime,totaltime,lasttime,pcname,eiin,schoolname,labnum,pcnum --out "$filename.csv"
zip "${filename}.zip" "${filename}.csv"
mv "$filename.zip" ../static
rm "$filename.csv"
