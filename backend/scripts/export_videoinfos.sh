#!/usr/bin/bash

mydir=$(dirname $0) && cd $mydir
filename="videoinfos"

mongoexport --collection=videoinfos --db=dlab-database1 --type=csv --fields=dayid,pcname,eiin,schoolname,labnum,pcnum,video_name,video_start,video_start_date_time,video_end,video_end_date_time,duration --out "$filename.csv"
zip "${filename}.zip" "${filename}.csv"

mv "$filename.zip" ../static
rm "$filename.csv"
