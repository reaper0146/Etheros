from influxdb import InfluxDBClient
import csv
import json
import sys
from datetime import datetime


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
unit = "HA_test"

#stampIni=sys.argv[1]
#stampEnd=sys.argv[2]
#stampEnd=sys.argv[2] 1609025490000
startStamp = sys.argv[1]/1000 #1609021890
endStamp = sys.argv[2]/1000#1609025490
start = str(datetime.fromtimestamp(startStamp)) + 'Z'
end = str(datetime.fromtimestamp(endStamp)) + 'Z'
stampIni = start.replace(" ", "T")
stampEnd = end.replace(" ", "T")
#print(type(stampIni))
print(stampIni)
print(stampEnd)
query = 'SELECT "value" FROM Z WHERE ("location" = \''+unit+'\')  and time >= \''+stampIni+'\' and time <= \''+stampEnd+'\'   '

result = client.query(query)


data= list(result.get_points())
print(data[0:10])
datajson=json.dumps(data)
jsonobj = json.loads(datajson)
#print(data)


jsontocsv(jsonobj,'Data1.csv')
