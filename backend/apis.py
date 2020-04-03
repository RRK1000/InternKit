from flask import Flask, render_template,\
jsonify,request,abort

app=Flask(__name__)

import sqlite3
import requests
import random
import datetime

RS400=400

RS405=405
RS200=200
RS201=201
RS204=204

shalist=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
def checksha(string):
	if(len(string)!=40):
		return True
	else:
		for i in list(string):
			if i not in shalist:
				return True
	return False

#<----------------------------MaxID----------------------------------------------------->
'''function is called to get the max id of a table for now used only for scholarship and internship table and used by various apis. So reuse this code as much as possible'''
def getmaxid(table):
	con=sqlite3.connect("scokit.db")
	cursorobj=con.cursor()
	l=list(cursorobj.execute("select * from "+table))
	if(table=="scholarship"):
		return "s_"+str(len(l))
	elif(table=="internship"):
		return "i_"+str(len(l))

#<----------------------------Check User Exists------------------------------->
'''function is for checking if a userid exist in a table but the function can also be reused to all the tuple of a given user id for a given table in any api'''
def check_user_exists(table,userid):
	con=sqlite3.connect("scokit.db")
	cursorobj=con.cursor()
	if(table=="scholarship" or table=="internship"):
		l=list(cursorobj.execute("select * from "+table+" where uid='"+userid+"'"))
		return l	
	l=list(cursorobj.execute("select * from "+table+" where userid='"+userid+"'"))
	return l

#<----------------------SignUp------------------------>
'''signup api where the students and employees are added to the respective table by checking the usertype key of the body you send.
Method : PUT
url : http://localhost:5000//api/v1/signup
body:
{
	"username":"vishnu",
	"password":"12345678",
	"name":"Vishnu",
	"usertype":"student"
}
Restrictions in values of the keys sent in body:
username--> anything
password--> length more than 8 characters
name--> anything
usertype--> student or employee
'''
@app.route("/api/v1/signup",methods=["PUT"])
def signup():
	req=request.get_json()
	if(request.method!="PUT"):
		return jsonify({}),RS405
	if(not("username" in req and "password" in req and "name" in req and "usertype" in req)):
		return jsonify({}),RS400
	username=req["username"]
	name=req["name"]
	usertype=req["usertype"]
	password=req["password"]
	if(len(password)>7):
		return jsonify({}),RS400
	if(usertype=="student"):
		table="student"
	elif(usertype=="employee"):
		table="emp_login"
	else:
		return jsonify({}),RS201 
	if username=="":
		return jsonify({}),RS400
	if name=="":
		return jsonify({}),RS400
	l=check_user_exists(table,username)
	print(l)
	if(len(l)!=0):
		return jsonify({}),RS400
	con=sqlite3.connect("scokit.db")
	cursorobj=con.cursor()
	if(table=="student"):
		sstr="insert into "+ table +" values("+"'"+username+"'"+","+"'"+password+"'"+","+"'"+name+"'"+")"
	elif(table=='emp_login'):
		sstr="insert into "+ table +" values("+"'"+username+"'"+","+"'"+password+"'"+","+"'"+name+"'"+")"
	else:
		return jsonify({}),RS400
	print(sstr)
	cursorobj.execute(sstr)
	con.commit()
	return jsonify({}),RS201
#<--------------Delete User----------------->
'''
delete is to delete any tuple of a table other than applied_for in the database"
Method : DELETE
url: /api/v1/delete?uid=vishnu&usertype=student

Restrictions:
uid--> can be anything until its there in the table
usertype--> student or employee or scholarship or internship

'''
@app.route("/api/v1/delete",methods=["DELETE"])
def deluid():
	if(request.method!="DELETE"):
		return jsonify({}),RS405
	name=request.args.get("uid")
	usertype=request.args.get("usertype")
	if(usertype=="student"):
		table="student"
	elif(usertype=="employee"):
		table="emp_login"
	elif(usertype=="scholarship"):
		table="scholarship"
	elif(usertype=="internship"):
		table="internship"
	else:
		return jsonify({}),RS400 
	l=check_user_exists(table,name)

	if(len(l)!=0):
		con=sqlite3.connect("scokit.db")
		cursorobj=con.cursor()
		if(table=="s_profile" or table=="e_profile"):
			cursorobj.execute("delete from "+ table+" where userid='"+name+"'")
		elif(table=="scholarship" or table=="internship"):
			cursorobj.execute("delete from "+ table+" where uid='"+name+"'")
		else:
			return jsonify({}),RS400
		con.commit()
		return jsonify({}),RS201
	return jsonify({}),RS400
# <-------------------------------Login------------------------------->
'''
Login api for checking if the user has signed up and the password is right
Method: POST
url: /api/v1/login
body:
{
	"username":"vishnu",
	"password":"12345678",
	"usertype":"student"
}
Restrictions:
username--> anything until its there in the table
password--> length more than 8 characters
usertype--> student or employee
'''
@app.route("/api/v1/login",methods=["POST"])
def login():
	req=request.get_json()
	if(request.method!="POST"):
		return jsonify({}),RS405
	if(not("username" in req and "password" in req and "usertype" in req)):
		return jsonify({}),RS400
	username=req["username"]
	usertype=req["usertype"]
	password=req["password"]
	if(usertype=="student"):
		table="student"
	elif(usertype=="employee"):
		table="emp_login"
	else:
		return jsonify({}),RS400 
	if username=="":
		return jsonify({}),RS400
	l=check_user_exists(table,username)
	print(l)
	if(len(l)!=0 and l[0][1]==password):
		return jsonify({}),RS200
	else:
		return jsonify({}),RS400

#<--------------------------------EDIT-------------------------->
'''
Edit any tuple in any table (other than student and emp_login), which is decided by checking the usertype keyword
Method : POST
url : /api/v1/editdetails
bodies:
{
	"uid" : "vishnu",
	"usertype" : "student",
	"column_details":"["dob","phone","snetwork"]",
	"new_details":"["16/02/1999","XXXXXXXXXXX","git-github.com;link-linkeldin.com"]"
}
Restrictions:
uid--> anything until it exists in table
usertype--> student or employee or scholarship or internship
column_details--> must be string of list of strings and the values in the list must be column names used in the table
new_details--> must be string of list of strings and the values must be the new value that must be updated in each column
new_details and column_details must be in the same order
'''
@app.route("/api/v1/editdetails",methods=["POST"])
def editdetails():
	req=request.get_json()
	if(request.method!="POST"):
		return jsonify({}),RS405
	if(not("uid" in req and "usertype" in req and "column_details" in req and "new_details" in req)):
		return jsonify({}),RS400
	username=req["uid"]
	usertype=req["usertype"]
	if(usertype=="student"):
		table="s_profile"
	elif(usertype=="employee"):
		table="e_profile"
	elif(usertype=="scholarship"):
		table="scholarship"
	elif(usertype=="internship"):
		table="internship"
	else:
		return jsonify({}),RS400 
	if username=="":
		return jsonify({}),RS400
	l=check_user_exists(table,username)
	print(l)
	if(len(l)==0):
		return jsonify({}),RS400
	else:
		cdetails=eval(req["column_details"])
		newdetails=eval(req["new_details"])
		sstr="update "+table+" set "
		for i,j in zip(cdetails,newdetails):
			sstr=sstr+str(i)+"='"+str(j)+"',"
		if(table=="s_profile" or table=="e_profile"):
			sstr=sstr[:len(sstr)-1]+" where userid='"+username+"'"
		elif(table=="scholarship" or table=="internship"):
			sstr=sstr[:len(sstr)-1]+" where uid='"+username+"'"
		else:
			return jsonify({}),RS400
		print(sstr)
		con=sqlite3.connect("scokit.db")
		cursorobj=con.cursor()
		cursorobj.execute(sstr)
		con.commit()
		return jsonify({}),RS200


#<------------------------------Edit Password------------------------>
'''
edit password
Method : POST
url : /api/v1/editpassword
body:
{
	"username" : "vishnu",
	"usertype" : "student",
	"current_password" : "12345678",
	"new_password" : "12346789"
}
Restrictions:
username--> anything until its there in the table
usertype--> student or employee
current_password--> must be the same password
new_password--> cannot be the same password
'''
@app.route("/api/v1/editpassword",methods=["POST"])
def editpassword():
	req=request.get_json()
	if(request.method!="POST"):
		return jsonify({}),RS405
	if(not("username" in req and "usertype" in req and "current_password" in req and "new_password" in req)):
		return jsonify({}),RS400
	username=req["username"]
	usertype=req["usertype"]
	cpassword=req["current_password"]
	npassword=req["new_password"]
	if(len(npassword)>7):
		return jsonify({}),RS400
	if(usertype=="student"):
		table="student"
	elif(usertype=="employee"):
		table="emp_login"
	else:
		return jsonify({}),RS400 
	if username=="":
		return jsonify({}),RS400
	l=check_user_exists(table,username)
	print(l)
	if(len(l)==0):
		return jsonify({}),RS400
	else:
		if(l[0][1]==str(cpassword)):
			sstr="update "+table+" set password='"+str(npassword)+"'"+" where userid='"+username+"'"
			print(sstr)
			con=sqlite3.connect("scokit.db")
			cursorobj=con.cursor()
			cursorobj.execute(sstr)
			con.commit()
			return jsonify({}),RS200
		else:
			return jsonify({}),RS400


#<------------------------------Get Details-------------------->
'''
get details of a user id in any table except for applied_for. Reuse this api as much as possible in other apis
Method : GET
url : /api/v1/getdetails?uid=vishnu&usertype=student
Restrictions:
uid--> anything until its there in the table
usertype--> student or employee or scholarship or internship
Right now the whole tuple will be sent with column name as keys and tuple values as values
you can filter out in the frontend because I didnt know what to send until the frontend was ready

Please check the output once in the postman
'''
@app.route("/api/v1/getdetails",methods=["GET"])
def getdetails():
	req=request.get_json()
	if(request.method!="GET"):
		return jsonify({}),RS405
	username=request.args.get("uid")
	usertype=request.args.get("usertype")
	if(usertype=="student"):
		table="student"
		table1="s_profile"
	elif(usertype=="employee"):
		table="emp_login"
		table1="e_profile"
	elif(usertype=="scholarship"):
		table="scholarship"
	elif(usertype=="internship"):
		table="internship"
	else:
		return jsonify({}),RS400 
	if username=="":
		return jsonify({}),RS400
	if(usertype=="student" or usertype=="employee"):	
		l=check_user_exists(table,username)
		lprofile=check_user_exists(table1,username)
		print(l)
		print(lprofile)
		if(len(l)!=0 and len(lprofile)!=0):
			if(table=='student'):
				return jsonify({"uid":l[0][0],"name":l[0][2],"dob":lprofile[0][1],"education":lprofile[0][2],"branch":lprofile[0][3],"college":lprofile[0][4],"email":lprofile[0][5],"snetwork":lprofile[0][6],"skills":lprofile[0][7],"pdescription":lprofile[0][8],"phone":lprofile[0][9]}),RS200
			elif(table=='emp_login'):
				return jsonify({"uid":l[0][0],"name":l[0][2],"dob":lprofile[0][1],"cname":lprofile[0][2],"email":lprofile[0][3],"snetwork":lprofile[0][4],"post":lprofile[0][5],"cdescription":lprofile[0][6],"phone":lprofile[0][7]}),RS200
			else:
				return jsonify({}).RS400
		else:
			return jsonify({}),RS400
	if(usertype=="scholarship" or usertype=="internship"):	
		l=check_user_exists(table,username)
		print(l)
		if(len(l)!=0):
			if(table=='scholarship'):
				l1=check_user_exists("emp_login",l[0][3])
				l2=check_user_exists("e_profile",l[0][3])
				return jsonify({"uid":l[0][0],"name":l[0][1],"amount":l[0][2],"provider_name":l1[0][2],"provider_organisation":l2[0][2],"category":l[0][4],"branch":l[0][5],"provider_id":l[0][3]}),RS200
			elif(table=='internship'):
				l1=check_user_exists("emp_login",l[0][2])
				l2=check_user_exists("e_profile",l[0][2])
				return jsonify({"uid":l[0][0],"itr_name":l[0][1],"emp_name":l1[0][2],"stipend":l[0][3],"branch":l[0][4],"city":l[0][5],"description":l[0][6],"gpa":l[0][7],"cname":l2profile[0][7],"emp_id":l[0][2]}),RS200
			else:
				return jsonify({}).RS400
		else:
			return jsonify({}),RS400

#<----------------------Add Details-------------------------->
'''
add details is to insert tuples into the student profile(s_profile) and employee profile(e_profile) table
Method : POST
url : /api/v1/addprofile
body:
{
	"username":"vishnu",
	"dob":"06/03/1999",
	"email":"xxxxxx.com",
	"phone":"XXXXXXXXXXX",
	"education":"["School-grade","precollege-grade"]",        # actually you can send anything, I m just gonna store it as it as, I m not gonna use it, you will need to use it
	"college":"Current college",
	"branch":"branch you are studying",
	"snetwork":"git-github.com;link-linkeldin.com",           # different links separated by ; and, link and title separated by -			# not mandatory field 
	"skills":"python-5;java-6;ml-9",                          # it should be in this format only											# not mandatory field 
	"pdescription":"ProjectTitle1#projectdescription;ProjectTitle2#projectdescription;ProjectTitle3#projectdescription",      # projects separated by ; and , title description separated by #				# not mandatory field 
	"usertype":"student" 
}

OR
{
	"username":"vishnu",
	"dob":"06/03/1999",
	"email":"xxxxxx.com",
	"phone":"XXXXXXXXXXX",
	"cname":"msrXD",
	"snetwork":"git-github.com;link-linkeldin.com",				# not mandatory field 
	"post":"some post in company",								# not mandatory field 
	"cdescription":"company description"                        # not mandatory field  
	"usertype":"employee"
}

Restrictions:
Please give it in the same format as given in the above example
'''
@app.route("/api/v1/addprofile",methods=["POST"])
def profile():
	req=request.get_json()
	if(request.method!="POST"):
		return jsonify({}),RS405
	if(not("username" in req and "dob" in req and "email" in req and "phone" in req and "usertype" in req)):
		return jsonify({}),RS400
	username=req["username"]
	name=req["name"]
	usertype=req["usertype"]
	if(usertype=="student"):
		table="s_profile"
	elif(usertype=="employee"):
		table="e_profile"
	else:
		return jsonify({}),RS400 
	if username=="":
		return jsonify({}),RS400
	if name=="":
		return jsonify({}),RS400
	l=check_user_exists(table,username)
	print(l)
	if(len(l)!=0):
		return jsonify({}),RS400
	con=sqlite3.connect("scokit.db")
	cursorobj=con.cursor()
	if(table=="s_profile"):
		if(not("education" in req and "college" in req and "branch" in req)):
			return jsonify({}),RS400
		sstr="insert into "+ table +" values("+"'"+username+"'"+","+"'"+req["dob"]+"'"+","+"'"+req["education"]+"'"+","+"'"+req["branch"]+"'"+","+"'"+req["college"]+"'"+","+"'"+req["email"]+"'"
		if("snetwork" in req):
			sstr=sstr+","+"'"+req["snetwork"]+"'"
		else:
			sstr=sstr+","+"'"+"'"
		if("skills" in req):
			sstr=sstr+","+"'"+req["skills"]+"'"
		else:
			sstr=sstr+","+"'"+"'"
		if("pdescription" in req):
			sstr=sstr+","+"'"+req["pdescription"]+"'"
		else:
			sstr=sstr+","+"'"+"'"
		sstr=sstr+","+"'"+req["phone"]+"'"+")"
	elif(table=="e_profile"):
		if(not("cname" in req)):
			return jsonify({}),RS400
		sstr="insert into "+ table +" values("+"'"+username+"'"+","+"'"+req["dob"]+"'"+","+"'"+req["cname"]+"'"+","+"'"+req["email"]+"'"
		if("snetwork" in req):
			sstr=sstr+","+"'"+req["snetwork"]+"'"
		else:
			sstr=sstr+","+"'"+"'"
		if("post" in req):
			sstr=sstr+","+"'"+req["post"]+"'"
		else:
			sstr=sstr+","+"'"+"'"
		if("cdescription" in req):
			sstr=sstr+","+"'"+req["cdescription"]+"'"
		else:
			sstr=sstr+","+"'"+"'"
		sstr=sstr+","+"'"+req["phone"]+"'"+")"
	else:
		return jsonify({}),RS400
	print(sstr)
	cursorobj.execute(sstr)
	con.commit()
	return jsonify({}),RS201
#<-------------------------------------AddDetails to Internship and Scholarship-------------------------->
'''
inserting tuples into internship and scholarship tables
Method : PUT
url : /api/v1/add_internship_scholarship
body:
{
	"usertype" : "scholarship",
	"amount" : "90000",
	"provider" : "provider id in the emp_login table",
	"category" : "Caste",
	"branch: : "branch of the student",
	"name" : " scholarship name"
}

OR

{
	"usertype" : "internship",
	"itr_name": "Name",
	"emp_name" : "emp id in the emp_login table",
	"stipend" : "90000",
	"branch" : "Branch required",
	"city" : "City",
	"description" : "Internship description",
	"gpa" : "9.0"

}
Restrictions:
There is a uid for each tuple in the table which will be autogenerated which you dont have to worry ony when inserting. The uid starts with s_number for scholarship and i_number for internship
Please use the body as shown in the two examples. All are mandatory fields
emp_name and provider is the id of the employee in emp_login table
'''
@app.route("/api/v1/add_internship_scholarship",methods=["PUT"])
def add_internship_scholarship():
	req=request.get_json()
	if(request.method!="PUT"):
		return jsonify({}),RS405
	if(not("usertype" in req)):
		return jsonify({}),RS400
	usertype=req["usertype"]
	username=getmaxid(usertype)
	if(usertype=="scholarship"):
		table="scholarship"
		if(not("name" in req and "amount" in req and "provider" in req and "category" in req and "branch" in req)):
			return jsonify({}),RS400
	elif(usertype=="internship"):
		table="internship"
		if(not("itr_name" in req and "emp_name" in req and "stipend" in req and "branch" in req and "city" in req and "description" in req and "gpa" in req)):
			return jsonify({}),RS400
	else:
		return jsonify({}),RS400 
	if username=="":
		return jsonify({}),RS400
	if name=="":
		return jsonify({}),RS400
	l=check_user_exists(table,username)
	print(l)
	if(len(l)!=0):
		return jsonify({}),RS400
	con=sqlite3.connect("scokit.db")
	cursorobj=con.cursor()
	if(table=="scholarship"):
		sstr="insert into "+ table +" values("+"'"+username+"'"+","+"'"+req["name"]+"'"+","+"'"+req["amount"]+"'"+","+"'"+req["provider"]+"'"+","+"'"+req["category"]+"'"+","+"'"+req["branch"]+"'"+")"
	elif(table=='internship'):
		sstr="insert into "+ table +" values("+"'"+username+"'"+","+"'"+req["itr_name"]+"'"+","+"'"+req["emp_name"]+"'"+","+"'"+req["stipend"]+"'"+","+"'"+req["branch"]+"'"+","+"'"+req["city"]+"'"+","+"'"+req["description"]+"'"+","+"'"+req["gpa"]+"'"+")"
	else:
		return jsonify({}),RS400
	print(sstr)
	cursorobj.execute(sstr)
	con.commit()
	return jsonify({}),RS201
#<---------------------------------APPLY------------------------------------->
'''
inserting data into applied_for table. This maps the internship or scholarship id to the  student userid who have applied.
Method : PUT
url : /api/v1/apply
body:
{
	"username" : "vishnu or user id of the student",
	"apl_dat" : "send Data however you want but in a string",
	"uid" : "uid of the internship or scholarship",
	"usertype" : scholarship"
}
Restrictions:
username--> any userid of the students table
apl_dat--> any data you want to send but it should be in a string
uid--> id of the internship or scholarship
usetype--> scholarship or internship
'''
@app.route("/api/v1/apply",methods=["PUT"])
def apply():
	req=request.get_json()
	if(request.method!="PUT"):
		return jsonify({}),RS405
	if(not("username" in req and "apl_dat" in req and "uid" in req)):
		return jsonify({}),RS400
	username=req["username"]
	uid=req["uid"]
	usertype=req["usertype"]
	table="applied_for"
	apl_dat=req["apl_data"]
	if(usertype=="scholarship"):
		type="scholarship"
	elif(usertype=="internship"):
		type="internship"
	else:
		return jsonify({}),RS400 
	if username=="":
		return jsonify({}),RS400
	if uid=="":
		return jsonify({}),RS400
	l=check_user_exists(table,username)
	l1=check_user_exists(type,uid)
	print(l)
	if(len(l)!=0 or len(l1)==0):
		return jsonify({}),RS400
	con=sqlite3.connect("scokit.db")
	cursorobj=con.cursor()
	sstr="insert into "+ table +" values("+"'"+username+"'"+","+"'"+apl_dat+"'"+","+"'"+uid+"'"+")"
	print(sstr)
	cursorobj.execute(sstr)
	con.commit()
	return jsonify({}),RS201

#API's to be done
#<---------------------------------Get all students of internship or scholarship---------------------------->
#Tell me what all data should be sent back
#<---------------------------------Get all internships or scholarships of a student applied or an employee posted----------------------->	
#Tell me what all data should be sent back
#<---------------------------------Delete the apllications from applied_for table if the application is deleted by the student---------------->
if __name__ == '__main__':	
	app.debug=True
	#app.bind(9000)
	#app.run(host="0.0.0.1",port=5000)
	app.run()
