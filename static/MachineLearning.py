#!/usr/bin/env python3
# coding: utf-8

import sys
from datetime import datetime
from datetime import timedelta
from influxdb import InfluxDBClient
from influxdb.exceptions import InfluxDBClientError
import numpy
import time
import random
import operator
import sys
import numpy as np
from numpy import array

#start_time = time.time()

starttime = datetime(2020,7, 17,8,5,15)
endtime = datetime(2020, 7, 17,20,15,15)


rIP = sys.argv[1]
rUser = sys.argv[2]
rPass = sys.argv[3]
rDB = sys.argv[4]
rPORT = 8086


lIP = sys.argv[5]
lUser = sys.argv[6]
lPass = sys.argv[7]
lDB = sys.argv[8]
lPORT = 8086

client = InfluxDBClient(rIP, rPORT, rUser, rPass, rDB)

query = 'show series'
result = client.query(query)

points = list(result.get_points())
#value =  np.append(value,np.array(list(map(operator.itemgetter('value'), points))))
#print(points)
#print(len(points[1]))


##utc_time = starttime.replace(tzinfo = timezone.utc)
#timestamp = starttime.timestamp()*1000
#start_str = str(int((timestamp)*1000000))

#utc_time = endtime.replace(tzinfo = timezone.utc)
#timestamp = endtime.timestamp()*1000
#end_str=str(int((timestamp)*1000000))

#tempstart=starttime
#tempend=starttime + timedelta(minutes=5)

for i in range(len(points)):
	#utc_time = starttime.replace(tzinfo = timezone.utc)
	tempstart=starttime
	tempend=starttime + timedelta(minutes=5)

	print("Getting data")
	while tempend<endtime:
		timestamp = tempstart.timestamp()*1000
		start_str = str(int((timestamp)*1000000))

		#utc_time = endtime.replace(tzinfo = timezone.utc)
		timestamp = tempend.timestamp()*1000
		end_str=str(int((timestamp)*1000000))
		tempstart=tempend + timedelta(microseconds=100)
		tempend=tempstart+timedelta(minutes=5)
		read = points[i]['key']
		sname = read.split(',')[0]
		tagname = read.split(',')[1].split('=')[0]
		tagvalue = read.split(',')[1].split('=')[1]
		#print("Getting data")
		#print(sname,tagname,tagvalue)
		query = 'SELECT "value" FROM '+ sname +' WHERE "'+ tagname +'" = \''+ tagvalue +'\' and time > '+start_str+' and time < '+end_str
		#print(query)
		result = client.query(query)

		pointstemp = list(result.get_points())

		values =  map(operator.itemgetter('value'), pointstemp)
		times  =  map(operator.itemgetter('time'),  pointstemp)
		#print(values)
		#data.value =  map(operator.itemgetter('value'), points)
		#data.time  =  map(operator.itemgetter('time'),  points)
		#
		value = list(values)
		time1 = list(times)
		#print(len(value))
		#print(len(time1))
		#print(value)
		if len(time1)>0:
			myTime = datetime.strptime(time1[0], "%Y-%m-%dT%H:%M:%S.%fZ")
			timestamp1 = datetime.timestamp(myTime)
			timestamp= float(timestamp1)*1000
			data = []
			j=0
			while j< len(value):
			    myTime = datetime.strptime(time1[j], "%Y-%m-%dT%H:%M:%S.%fZ")
			    timestamp = datetime.timestamp(myTime)
			    temp= float(timestamp)*1000
			    datatime=int(temp)
			    data.append("{series},location={location} value={z} {timestamp}"
				    .format(series=sname,
					    id=i,
					    location=tagvalue,
					    z=value[j],
					    timestamp=datatime))
			    j+=1
			print("Received series", sname)
			print("Uploading series to Database")
			try:
				client1 = InfluxDBClient(host=lIP, port=8086)
				client1.write_points(data, database=lDB, time_precision='ms', batch_size=10000, protocol='line')

			except InfluxDBClientError as error:
				continue

			print("\nSeries Uploaded")
		else:
			print("No data within time range\n")
print("Data copying complete")
#end=time.time()
#print("%s seconds" % (time.time() - start_time))
