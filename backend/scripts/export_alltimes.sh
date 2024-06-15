#!/bin/bash
filename="alltimes"
mongoexport --collection=alltimes --db=dlab-database1 --type=csv --fields=dayid,starttime,totaltime,lasttime,pcname,eiin,schoolname,labnum,pcnum --out "$filename.csv"
zip "${filename}.zip" "${filename}.csv"

mv "$HOME/$filename.zip" $DLAB_EXPORT_DIRECTORY
rm "$HOME/$filename.csv"
