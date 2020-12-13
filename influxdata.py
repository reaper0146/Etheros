#!/usr/bin/python3

from influxdb import InfluxDBClient
import csv
import json
import sys

def jsontocsv(input_json, output_path):
  flag=0;
  #print('1')
  keylist = []
  for key in input_json[0]:
    #print('2')
    keylist.append(key)
    f = csv.writer(open(output_path, "w"))
    f.writerow(keylist)

  for record in input_json:
    #print(flag)
    currentrecord = []
    for key in keylist:
      flag+=1
      currentrecord.append(record[key])
      if(flag%2==0):
        #print(currentrecord)
        f.writerow(currentrecord)


client = InfluxDBClient("sensorweb.us", "8086", "test", "sensorweb", "shake", ssl=True)
unit = "b8:27:eb:16:1b:d7"

stampIni=sys.argv[1]+'Z'
stampEnd=sys.argv[2]+'Z'
#stampEnd=sys.argv[2]
#stampIni = "2020-08-14T17:22:15.000Z";
#stampEnd = "2020-08-14T17:25:15.000Z";
print(type(stampIni))
print(stampEnd)
query = 'SELECT "value" FROM Z WHERE ("location" = \''+unit+'\')  and time >= \''+stampIni+'\' and time <= \''+stampEnd+'\'   '

result = client.query(query)


data= list(result.get_points())
datajson=json.dumps(data)
jsonobj = json.loads(datajson)
#print(data)


jsontocsv(jsonobj,'Data.csv')
