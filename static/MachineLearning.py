#!/usr/bin/env python3
# coding: utf-8

import sys
#import datetime
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


client = InfluxDBClient("3.136.84.223", "8086", "test", "sensorweb", "testdb")

query = 'show series'
result = client.query(query)

points = list(result.get_points())
#value =  np.append(value,np.array(list(map(operator.itemgetter('value'), points))))
#print(points)
#print(len(points[1]))


#utc_time = starttime.replace(tzinfo = timezone.utc)
timestamp = starttime.timestamp()*1000
start_str = str(int((timestamp)*1000000))

#utc_time = endtime.replace(tzinfo = timezone.utc)
timestamp = endtime.timestamp()*1000
end_str=str(int((timestamp)*1000000))

tempstart=starttime
tempend=starttime + timedelta(minutes=5)
unit='Unit4'
while tempend<endtime:
    timestamp = tempend.timestamp()*1000
    str_end=str(int((timestamp)*1000000))
    timestamp = tempstart.timestamp()*1000
    str_start=str(int((timestamp)*1000000))
    query = 'SELECT "value" FROM Z WHERE ("location" = \''+unit+'\')  and time >= \''+str_start+'\' and time <= \''+str_end+'\'   '
    
    result = client.query(query)
    points = list(result.get_points())
    
    values =  map(operator.itemgetter('value'), points)
    times  =  map(operator.itemgetter('time'),  points)
    
    value = list(values)
    time1 = list(times)
    print(time1)
    tempstart=tempend
    tempend=tempstart+timedelta(minutes=5)

#print(starttime)
#difftime=starttime + timedelta(minutes=5)
#print(difftime)

#print(start_str)
#print(end_str)