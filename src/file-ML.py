import numpy as np
from scipy.signal import butter, filtfilt
from influxdb import InfluxDBClient
import operator
import pandas as pd
import sys
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def butter_lowpass_filter(data, cutoff, fs, order):
    normal_cutoff = cutoff / nyq
    # Get the filter coefficients 
    b, a = butter(order, normal_cutoff, btype='low', analog=False)
    y = filtfilt(b, a, data)
    return y

#client = InfluxDBClient("sensorweb.us", "8086", "test", "sensorweb", "shake", ssl=True)
#unit = "b8:27:eb:16:1b:d7"


#stampIni = "2020-08-14T17:22:15.000Z";
#stampEnd = "2020-08-14T17:25:15.000Z";

#query = 'SELECT "value" FROM Z WHERE ("location" = \''+unit+'\')  and time >= \''+stampIni+'\' and time <= \''+stampEnd+'\'   '

#result = client.query(query)
#points = list(result.get_points())

#values =  map(operator.itemgetter('value'), points)
#times  =  map(operator.itemgetter('time'),  points)

#datat = list(values)
datat = pd.read_csv('./src/Datatemp.csv')
# Filter requirements.
T = 5.0         # Sample Period
t = 5.0
fs = 30.0       # sample rate, Hz
cutoff = 2      # desired cutoff frequency of the filter, Hz ,      slightly higher than actual 1.2 Hz
nyq = 0.5 * fs  # Nyquist Frequency
order = 2       # sin wave can be approx represented as quadratic
n = int(T * fs) # total number of samples

data = datat['value'] #[0:1000]
#print(data)

# Filter the data, and plot both the original and filtered signals.
y = butter_lowpass_filter(data, cutoff, fs, order)
#figure(1)
plt.plot(data, color='blue')
#plt.xlim([0,5000])
#figure(2)
plt.plot(y, color='red')
plt.savefig(sys.stdout.buffer)
