f=open("listwords.txt","r")
l=[]
for i in f.readlines():
    l.append(i.strip())
print(l)