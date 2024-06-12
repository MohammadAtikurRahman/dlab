#!/bin/bash
timestamp=$(date +"%Y%m%d_%H%M%S")
filename="videoinfos_$timestamp"
mongoexport --collection=videoinfos --db=dlab --type=csv --fields=dayid,pcname,eiin,schoolname,labnum,pcnum,video_name,video_start,video_start_date_time,video_end,video_end_date_time,duration --out "$filename.csv"
zip "${filename}.zip" "${filename}.csv"
mv "$filename.zip" ../static
rm "$filename.csv"
