import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])
#def __name__="__main__":

file1 = open("text.txt","r")
data=file1.readlines()
file1.close()
data1=str(data)
#data2=""
#print(data1)
#print(data1[0])
for str1 in data:
	if str1=='\n':
		break
	#if str1.isalnum():
		#data2.append(str1)
		#print(str1)
	data2=str1
#print(type(data1))
print(data2)
#print(type(data2))
install(data2)
print("Hi")

