#!/bin/bash
filename="alltimes"
mongoexport --collection=alltimes --db=dlab --type=csv --fields=dayid,starttime,totaltime,lasttime,pcname,eiin,schoolname,labnum,pcnum --out "$filename.csv"
zip "${filename}.zip" "${filename}.csv"

mv "$filename.zip" ../static
