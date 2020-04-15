from uuid import uuid4
import jwt
import datetime
import random
import requests
import sqlite3
from flask import Flask, render_template, jsonify, request, abort
from flask_cors import CORS

import sys
sys.path.insert(1, 'intelligent_component/')
import my_probability_model

app = Flask(__name__)
CORS(app)

RS500 = 500
RS400 = 400
RS401 = 401
RS405 = 405
RS200 = 200
RS201 = 201
RS204 = 204

jwtSecret = "ideallyReadFromFile"

shalist = "0123456789abcdef"


def checksha(string):
    if len(string) != 40:
        return True
    else:
        for i in list(string):
            if i not in shalist:
                return True
    return False


# <----------------------------MaxID----------------------------------------------------->
"""function is called to get the max id of a table for now used only for scholarship and internship table and used by various apis. So reuse this code as much as possible"""


def getmaxid(table):
    con = sqlite3.connect("backend/scokit.db")
    cursorobj = con.cursor()
    l = list(cursorobj.execute("select * from " + table))
    if(len(l)!=0):
        iD=int(l[len(l)-1][0][2:])
    else:
        iD=0
    if table == "scholarship":
        return "s_" + str(iD+1)
    elif table == "internship":
        return "i_" + str(iD+1)


# <----------------------------Check User Exists------------------------------->
"""function is for checking if a userid exist in a table but the function can also be reused to all the tuple of a given user id for a given table in any api"""


def check_user_exists(table, userid, uid):
    con = sqlite3.connect("backend/scokit.db")
    cursorobj = con.cursor()
    if table == "scholarship" or table == "internship":
        l = list(
            cursorobj.execute("select * from " + table +
                              " where uid='" + userid + "'")
        )
        return l
    elif table == "applied_for":
        # print("select * from "+table+" where userid='"+userid+"'"+" and uid='"+uid+"'")
        l = list(
            cursorobj.execute(
                "select * from "
                + table
                + " where userid='"
                + userid
                + "'"
                + " and uid='"
                + uid
                + "'"
            )
        )
        return l
        print(l)
    l = list(
        cursorobj.execute("select * from " + table +
                          " where userid='" + userid + "'")
    )
    return l


def checkJwtWithUser(token, username):
    try:
        decoded = jwt.decode(str(token), jwtSecret, algorithms=['HS256'])
        if decoded["username"] == username:
            return True
        else:
            raise Exception("MisMatch", "username doesn't match token")
    except Exception as e:
        print(e)
        return False


# <----------------------SignUp------------------------>
"""signup api where the students and employees are added to the respective table by checking the usertype key of the body you send.
Method : PUT
url : http://localhost:5000/api/v1/signup
body:
{
	"username":"vishnu",
	"password":"12345678",
	"name":"Vishnu",
	"usertype":"student"
}

{"username":"hi",
 "password":"v",
 "name":"Vishnu",
 "usertype":"student",
 "cname":"V",
 "column_details":"['cname','name']",
 "new_details":"['vikrant','letspla']",
 "current_password":"v",
 "new_password":"viz"
}
Restrictions in values of the keys sent in body:
username--> anything
password--> length more than 8 characters
name--> anything
usertype--> student or employee
"""


@app.route("/api/v1/signup", methods=["PUT"])
def signup():
    req = request.get_json()
    if request.method != "PUT":
        return jsonify({"message": "Method not allowed"}), RS405
    if not (
        "username" in req and "password" in req and "name" in req and "usertype" in req
    ):
        return jsonify({"message": "Missing arguments"}), RS400
    username = req["username"]
    name = req["name"]
    usertype = req["usertype"]
    password = req["password"]
    if len(password) < 7:
        return jsonify({"message": "Password needs to be at least 7 characters long"}), RS400
    if usertype == "student":
        table = "student"
    elif usertype == "employee":    
        table = "emp_login"
    else:
        return jsonify({"message": "Success"}), RS201
    if username == "":
        return jsonify({"message": "Username empty"}), RS400
    if name == "":
        return jsonify({"message": "Name empty"}), RS400
    l = check_user_exists(table, username, "")
    print(l)
    if len(l) != 0:
        return jsonify({"message": "User already exists"}), RS400
    con = sqlite3.connect("backend/scokit.db")
    cursorobj = con.cursor()
    if table == "student":
        sstr = (
            "insert into "
            + table
            + " values("
            + "'"
            + username
            + "'"
            + ","
            + "'"
            + password
            + "'"
            + ","
            + "'"
            + name
            + "'"
            + ")"
        )
    elif table == "emp_login":
        sstr = (
            "insert into "
            + table
            + " values("
            + "'"
            + username
            + "'"
            + ","
            + "'"
            + password
            + "'"
            + ","
            + "'"
            + name
            + "'"
            + ")"
        )
    else:
        return jsonify({"message": "Usertype invalid"}), RS400
    print(sstr)
    cursorobj.execute(sstr)
    con.commit()
    token = jwt.encode(
            {"nonce": str(uuid4()), "username": username}, jwtSecret, algorithm="HS256").decode('utf-8')
    return jsonify({"token": token}), RS201


# <--------------Delete User----------------->
"""
delete is to delete any tuple of a table other than applied_for in the database"
Method : DELETE
url: /api/v1/delete?uid=vishnu&usertype=student

Restrictions:
uid--> can be anything until its there in the table
usertype--> student or employee or scholarship or internship

"""


@app.route("/api/v1/delete", methods=["DELETE"])
def deluid():
    if request.method != "DELETE":
        return jsonify({}), RS405
    name = request.args.get("uid")
    usertype = request.args.get("usertype")
    if usertype == "student":
        table = "student"
        table1 = "s_profile"
    elif usertype == "employee":
        table = "emp_login"
        table1 = "e_profile"
    elif usertype == "scholarship":
        table = "scholarship"
    elif usertype == "internship":
        table = "internship"
    else:
        return jsonify({}), RS400
    l = check_user_exists(table, name, "")
    print(l)
    if len(l) != 0:
        con = sqlite3.connect("backend/scokit.db")
        cursorobj = con.cursor()
        if table == "student" or table == "emp_login":
            cursorobj.execute("delete from " + table +
                              " where userid='" + name + "'")
            cursorobj.execute("delete from " + table1 +
                              " where userid='" + name + "'")
        elif table == "scholarship" or table == "internship":
            cursorobj.execute("delete from " + table +
                              " where uid='" + name + "'")
        else:
            return jsonify({}), RS400
        con.commit()
        return jsonify({}), RS200
    return jsonify({}), RS400


# <-------------------------------Login------------------------------->
"""
Login api for checking if the user has signed up and the password is right
Method: POST
url: /api/v1/login
body:
{
	"username":"vishnu",
	"password":"12345678",
	"usertype":"student"
}
tokene=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJub25jZSI6ImE1ODAyYzgwLTdiYTQtNGZiYy1iOWUzLTRkZDc0MjJiYTEwYSIsInVzZXJuYW1lIjoidmlzaG51In0.gYab9m4KzWdLZ0jA__EO7G9XWc8BsXC27DAY8jwHcnI
tokens=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJub25jZSI6IjI3NGZiZDU2LTEzYTMtNGRkMi1iYzM1LTI5Y2I3MWVjN2QwNiIsInVzZXJuYW1lIjoidmlzaG51In0.-XFHkXdNcHyUAM3Ibbp7Enky0dRotrD6IaNGCe8pVMc

Restrictions:
username--> anything until its there in the table
password--> length more than 8 characters
usertype--> student or employee
"""


@app.route("/api/v1/login", methods=["POST"])
def login():
    req = request.get_json()
    print(req)
    if request.method != "POST":
        return jsonify({"message": "Method not allowed"}), RS405
    if not ("username" in req and "password" in req and "usertype" in req):
        return jsonify({"message": "Missing parameters"}), RS400
    username = req["username"]
    usertype = req["usertype"]
    password = req["password"]
    if usertype == "student":
        table = "student"
    elif usertype == "employee":
        table = "emp_login"
    else:
        return jsonify({"message": "Invalid usertype"}), RS400
    if username == "":
        return jsonify({"message": "Invalid username"}), RS400
    l = check_user_exists(table, username, "")
    print(l)
    if len(l) != 0 and l[0][1] == password:
        token = jwt.encode(
            {"nonce": str(uuid4()), "username": username}, jwtSecret, algorithm="HS256").decode('utf-8')
        return jsonify({"token": token}), RS200
    else:
        return jsonify({"message": "Invalid credentials"}), RS400


# <--------------------------------EDIT-------------------------->
"""
Edit any tuple in any table (other than student and emp_login), which is decided by checking the usertype keyword
Method : POST
url : /api/v1/editdetails
bodies:
{
	"uid" : "vishnu",
	"usertype" : "student",
	"column_details":"['dob','phone','snetwork']",
	"new_details":"['16/02/1999','XXXXXXXXXXX','git-github.com;link-linkeldin.com']"
}
Restrictions:
uid--> anything until it exists in table
usertype--> student or employee or scholarship or internship
column_details--> must be string of list of strings and the values in the list must be column names used in the table
new_details--> must be string of list of strings and the values must be the new value that must be updated in each column
new_details and column_details must be in the same order
"""


@app.route("/api/v1/editdetails", methods=["POST"])
def editdetails():
    req = request.get_json()
    if request.method != "POST":
        return jsonify({}), RS405
    if not (
        "uid" in req
        and "usertype" in req
        and "column_details" in req
        and "new_details" in req
        and "token" in req
    ):
        print("HOOOOIIII")
        return jsonify({}), RS400
    if (not checkJwtWithUser(req["token"], req["uid"])):
        return jsonify({}), RS401
    username = req["uid"]
    usertype = req["usertype"]
    print("Welcome3")
    if usertype == "student":
        table = "s_profile"
    elif usertype == "employee":
        table = "e_profile"
    elif usertype == "scholarship":
        table = "scholarship"
    elif usertype == "internship":
        table = "internship"
    else:
        print("HI##")
        return jsonify({}), RS400
    if username == "":
        print("HOOOO")
        return jsonify({}), RS400
    l = check_user_exists(table, username, "")
    print("HI")
    print(l)
    if len(l) == 0:
        print("le")
        return jsonify({}), RS400
    else:
        cdetails = eval(req["column_details"])
        newdetails = eval(req["new_details"])
        sstr = "update " + table + " set "
        for i, j in zip(cdetails, newdetails):
            sstr = sstr + str(i) + "='" + str(j) + "',"
        if table == "s_profile" or table == "e_profile":
            sstr = sstr[: len(sstr) - 1] + " where userid='" + username + "'"
        elif table == "scholarship" or table == "internship":
            sstr = sstr[: len(sstr) - 1] + " where uid='" + username + "'"
        else:
            print("Hiiiiiiiii")
            return jsonify({}), RS400
        print(sstr)
        con = sqlite3.connect("backend/scokit.db")
        cursorobj = con.cursor()
        cursorobj.execute(sstr)
        con.commit()
        return jsonify({}), RS200


# <------------------------------Edit Password------------------------>
"""
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
"""


@app.route("/api/v1/editpassword", methods=["POST"])
def editpassword():
    req = request.get_json()
    if request.method != "POST":
        return jsonify({}), RS405
    if not (
        "username" in req
        and "usertype" in req
        and "current_password" in req
        and "new_password" in req
        and "token" in req
    ):
        return jsonify({}), RS400
    if (not checkJwtWithUser(req["token"], req["username"])):
        return jsonify({}), RS401
    username = req["username"]
    usertype = req["usertype"]
    cpassword = req["current_password"]
    npassword = req["new_password"]
    if len(npassword) < 7:
        return jsonify({}), RS400
    if usertype == "student":
        table = "student"
    elif usertype == "employee":
        table = "emp_login"
    else:
        return jsonify({}), RS400
    if username == "":
        return jsonify({}), RS400
    l = check_user_exists(table, username, "")
    print(l)
    if len(l) == 0:
        return jsonify({}), RS400
    else:
        if l[0][1] == str(cpassword):
            sstr = (
                "update "
                + table
                + " set password='"
                + str(npassword)
                + "'"
                + " where userid='"
                + username
                + "'"
            )
            print(sstr)
            con = sqlite3.connect("backend/scokit.db")
            cursorobj = con.cursor()
            cursorobj.execute(sstr)
            con.commit()
            return jsonify({}), RS200
        else:
            return jsonify({}), RS400


# <------------------------------Get Details-------------------->
"""
get details of a user id in any table except for applied_for. Reuse this api as much as possible in other apis
Method : GET
url : /api/v1/getdetails?uid=vishnu&usertype=student
Restrictions:
uid--> anything until its there in the table
usertype--> student or employee or scholarship or internship
Right now the whole tuple will be sent with column name as keys and tuple values as values
you can filter out in the frontend because I didnt know what to send until the frontend was ready

Please check the output once in the postman
"""


@app.route("/api/v1/getdetails", methods=["GET"])
def getdetails():
    req = request.get_json()
    if request.method != "GET":
        return jsonify({}), RS405
    username = request.args.get("uid")
    usertype = request.args.get("usertype")
    if usertype == "student":
        table = "student"
        table1 = "s_profile"
    elif usertype == "employee":
        table = "emp_login"
        table1 = "e_profile"
    elif usertype == "scholarship":
        table = "scholarship"
    elif usertype == "internship":
        table = "internship"
    else:
        return jsonify({}), RS400
    if username == "":
        return jsonify({}), RS400
    if usertype == "student" or usertype == "employee":
        l = check_user_exists(table, username, "")
        lprofile = check_user_exists(table1, username, "")
        print(l)
        print(lprofile)
        if len(l) != 0 and len(lprofile) != 0:
            if table == "student":
                return (
                    jsonify(
                        {
                            "uid": l[0][0],
                            "name": l[0][2],
                            "dob": lprofile[0][1],
                            "education": lprofile[0][2],
                            "branch": lprofile[0][3],
                            "college": lprofile[0][4],
                            "email": lprofile[0][5],
                            "snetwork": lprofile[0][6],
                            "skills": lprofile[0][7],
                            "pdescription": lprofile[0][8],
                            "phone": lprofile[0][9],
                        }
                    ),
                    RS200,
                )
            elif table == "emp_login":
                return (
                    jsonify(
                        {
                            "uid": l[0][0],
                            "name": l[0][2],
                            "dob": lprofile[0][1],
                            "cname": lprofile[0][2],
                            "email": lprofile[0][3],
                            "snetwork": lprofile[0][4],
                            "post": lprofile[0][5],
                            "cdescription": lprofile[0][6],
                            "phone": lprofile[0][7],
                        }
                    ),
                    RS200,
                )
            else:
                return jsonify({}).RS400
        else:
            return jsonify({}), RS400
    if usertype == "scholarship" or usertype == "internship":
        l = check_user_exists(table, username, "")
        print(l)
        if len(l) != 0:
            if table == "scholarship":
                l1 = check_user_exists("emp_login", l[0][3], "")
                l2 = check_user_exists("e_profile", l[0][3], "")
                return (
                    jsonify(
                        {
                            "uid": l[0][0],
                            "name": l[0][1],
                            "amount": l[0][2],
                            "provider_name": l1[0][2],
                            "provider_organisation": l2[0][2],
                            "category": l[0][4],
                            "branch": l[0][5],
                            "provider_id": l[0][3],
                        }
                    ),
                    RS200,
                )
            elif table == "internship":
                l1 = check_user_exists("emp_login", l[0][2], "")
                l2 = check_user_exists("e_profile", l[0][2], "")
                return (
                    jsonify(
                        {
                            "uid": l[0][0],
                            "itr_name": l[0][1],
                            "emp_name": l1[0][2],
                            "stipend": l[0][3],
                            "branch": l[0][4],
                            "city": l[0][5],
                            "description": l[0][6],
                            "gpa": l[0][7],
                            "cname": l2[0][7],
                            "emp_id": l[0][2],
                        }
                    ),
                    RS200,
                )
            else:
                return jsonify({}).RS400
        else:
            return jsonify({}), RS400


# <----------------------Add Details-------------------------->
"""
add details is to insert tuples into the student profile(s_profile) and employee profile(e_profile) table
Method : POST
url : /api/v1/addprofile
body:
{
	"username":"vishnu",
	"dob":"06/03/1999",
    "token":"token",
	"email":"xxxxxx.com",
	"phone":"XXXXXXXXXXX",
	"education":"[School-grade,precollege-grade]",        # actually you can send anything, I m just gonna store it as it as, I m not gonna use it, you will need to use it
	"college":"Current college",
	"branch":"branch you are studying",
	"snetwork":"git-github.com;link-linkeldin.com",           # different links separated by ; and, link and title separated by -			# not mandatory field 
	"skills":"python-5\njava-6\nmachhinelearning-9",                          # it should be in this format only											# not mandatory field 
	"pdescription":"ProjectTitle1\nprojectdescription\nProjectTitle2\nprojectdescription\nProjectTitle3\nprojectdescription",      # projects separated by ; and , title description separated by #				# not mandatory field 
	"usertype":"student" 
}

OR
{
	"username":"vishnu",
	"dob":"06/03/1999",
    "token":"token",
	"email":"xxxxxx.com",
	"phone":"XXXXXXXXXXX",
	"cname":"msrXD",
	"snetwork":"git-github.com;link-linkeldin.com",				# not mandatory field 
	"post":"some post in company",								# not mandatory field 
	"cdescription":"company description",                       # not mandatory field  
	"usertype":"employee"
}

Restrictions:
Please give it in the same format as given in the above example
"""


@app.route("/api/v1/addprofile", methods=["POST"])
def profile():
    print("HII")
    req = request.get_json()
    print(req)
    if request.method != "POST":
        return jsonify({}), RS405
    print("Noooooo")
    if not (
        "username" in req
        and "dob" in req
        and "email" in req
        and "phone" in req
        and "usertype" in req
        and "token" in req
    ):
        return jsonify({}), RS400
    if (not checkJwtWithUser(req["token"], req["username"])):
        return jsonify({}), RS401
    username = req["username"]
    usertype = req["usertype"]
    if usertype == "student":
        table = "s_profile"
    elif usertype == "employee":
        table = "e_profile"
        print("Vishnu")
    else:
        print("Hello")
        return jsonify({}), RS400
    if username == "":
        return jsonify({}), RS400
    l = check_user_exists(table, username, "")
    print(l)
    if len(l) != 0:
        return jsonify({}), RS400
    con = sqlite3.connect("backend/scokit.db")
    cursorobj = con.cursor()
    if table == "s_profile":
        if not ("education" in req and "college" in req and "branch" in req):
            return jsonify({}), RS400
        sstr = (
            "insert into "
            + table
            + " values("
            + "'"
            + username
            + "'"
            + ","
            + "'"
            + req["dob"]
            + "'"
            + ","
            + "'"
            + req["education"]
            + "'"
            + ","
            + "'"
            + req["branch"]
            + "'"
            + ","
            + "'"
            + req["college"]
            + "'"
            + ","
            + "'"
            + req["email"]
            + "'"
        )
        if "snetwork" in req:
            sstr = sstr + "," + "'" + req["snetwork"] + "'"
        else:
            sstr = sstr + "," + "'" + "'"
        if "skills" in req:
            sstr = sstr + "," + "'" + req["skills"] + "'"
        else:
            sstr = sstr + "," + "'" + "'"
        if "pdescription" in req:
            sstr = sstr + "," + "'" + req["pdescription"] + "'"
        else:
            sstr = sstr + "," + "'" + "'"
        sstr = sstr + "," + "'" + req["phone"] + "'" + ")"
    elif table == "e_profile":
        if not ("cname" in req):
            return jsonify({}), RS400
        sstr = (
            "insert into "
            + table
            + " values("
            + "'"
            + username
            + "'"
            + ","
            + "'"
            + req["dob"]
            + "'"
            + ","
            + "'"
            + req["cname"]
            + "'"
            + ","
            + "'"
            + req["email"]
            + "'"
        )
        if "snetwork" in req:
            sstr = sstr + "," + "'" + req["snetwork"] + "'"
        else:
            sstr = sstr + "," + "'" + "'"
        if "post" in req:
            sstr = sstr + "," + "'" + req["post"] + "'"
        else:
            sstr = sstr + "," + "'" + "'"
        if "cdescription" in req:
            sstr = sstr + "," + "'" + req["cdescription"] + "'"
        else:
            sstr = sstr + "," + "'" + "'"
        sstr = sstr + "," + "'" + req["phone"] + "'" + ")"
    else:
        return jsonify({}), RS400
    print(sstr)
    cursorobj.execute(sstr)
    con.commit()
    return jsonify({}), RS201


# <-------------------------------------AddDetails to Internship and Scholarship-------------------------->
"""
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
"""


@app.route("/api/v1/add_internship_scholarship", methods=["PUT"])
def add_internship_scholarship():
    req = request.get_json()
    if request.method != "PUT":
        return jsonify({"message": "Method not allowed"}), RS405
    if not ("usertype" in req):
        return jsonify({"message": "usertype not specified"}), RS400
    usertype = req["usertype"]
    username = getmaxid(usertype)
    if usertype == "scholarship":
        table = "scholarship"
        if not (
            "name" in req
            and "amount" in req
            and "provider" in req
            and "category" in req
            and "branch" in req
        ):
            return jsonify({"message": "Missing arguments"}), RS400
    elif usertype == "internship":
        table = "internship"
        if not (
            "itr_name" in req
            and "emp_name" in req
            and "stipend" in req
            and "branch" in req
            and "city" in req
            and "description" in req
            and "gpa" in req
        ):
            return jsonify({"message": "Missing arguments"}), RS400
    else:
        return jsonify({"message": "Invalid usertype"}), RS400
    if username == "":
        return jsonify({"message": "username empty"}), RS400
    emp_name=req["emp_name"]
    l = check_user_exists("emp_login", emp_name, "")
    print(l)
    if len(l) == 0:
        return jsonify({"message": "Unknown!"}), RS400
    con = sqlite3.connect("backend/scokit.db")
    cursorobj = con.cursor()
    if table == "scholarship":
        if req["name"] == "":
            return jsonify({}), RS400
        sstr = (
            "insert into "
            + table
            + " values("
            + "'"
            + username
            + "'"
            + ","
            + "'"
            + req["name"]
            + "'"
            + ","
            + "'"
            + req["amount"]
            + "'"
            + ","
            + "'"
            + req["provider"]
            + "'"
            + ","
            + "'"
            + req["category"]
            + "'"
            + ","
            + "'"
            + req["branch"]
            + "'"
            + ")"
        )
    elif table == "internship":
        if req["itr_name"] == "":
            return jsonify({"message", "No name given"}), RS400
        sstr = (
            "insert into "
            + table
            + " values("
            + "'"
            + username
            + "'"
            + ","
            + "'"
            + req["itr_name"]
            + "'"
            + ","
            + "'"
            + req["emp_name"]
            + "'"
            + ","
            + "'"
            + req["stipend"]
            + "'"
            + ","
            + "'"
            + req["branch"]
            + "'"
            + ","
            + "'"
            + req["city"]
            + "'"
            + ","
            + "'"
            + req["description"]
            + "'"
            + ","
            + "'"
            + req["gpa"]
            + "'"
            + ")"
        )
    else:
        return jsonify({"message", "Wrong table"}), RS400
    print(sstr)
    cursorobj.execute(sstr)
    con.commit()
    return jsonify({}), RS201


# <---------------------------------APPLY------------------------------------->
"""
inserting data into applied_for table. This maps the internship or scholarship id to the  student userid who have applied.
Method : PUT
url : /api/v1/apply
body:
{
	"username" : "vishnu or user id of the student",
	"uid" : "uid of the internship or scholarship",
	"usertype" : scholarship",
    "token":"token:
}
Restrictions:
username--> any userid of the students table
apl_dat--> any data you want to send but it should be in a string
uid--> id of the internship or scholarship
usetype--> scholarship or internship
"""


@app.route("/api/v1/apply", methods=["PUT"])
def apply():
    req = request.get_json()
    if request.method != "PUT":
        return jsonify({"message": "Method not allowed"}), RS405
    if not ("username" in req and "uid" in req):
        return jsonify({"message": "Missing params"}), RS400
    username = req["username"]
    if (not checkJwtWithUser(req["token"], req["username"])):
        return jsonify({"message": "Bad token"}), RS401
    uid = req["uid"]
    usertype = req["usertype"]
    table = "applied_for"
    apl_dat = ' '
    if usertype == "scholarship":
        type = "scholarship"
    elif usertype == "internship":
        type = "internship"
    else:
        return jsonify({"message": "Invalid type"}), RS400
    if username == "":
        return jsonify({"message": "Missing username"}), RS400
    if uid == "":
        return jsonify({"message": "Missing uid"}), RS400
    l = check_user_exists(table, username, uid)
    l1 = check_user_exists(type, uid, "")
    print(l)
    if len(l) != 0 or len(l1) == 0:
        print(len(l), len(l1))
        return jsonify({"message": "Already applied"}), RS200
    con = sqlite3.connect("backend/scokit.db")
    cursorobj = con.cursor()
    sstr = (
        "insert into "
        + table
        + " values("
        + "'"
        + username
        + "'"
        + ","
        + "'"
        + apl_dat
        + "'"
        + ","
        + "'"
        + uid
        + "'"
        + ")"
    )
    print(sstr)
    cursorobj.execute(sstr)
    con.commit()
    return jsonify({}), RS201


# <---------------------------------Get all students of internship or scholarship---------------------------->
'''
Api to get all students who have enrolled for scholarships/internships
Method: GET
url:/api/v1/students_internship_scholarship?uid=i_0

Restrictions:
uid--> must be present in the table applied_for
'''
@app.route("/api/v1/students_internship_scholarship", methods=["GET"])
def get_students():
    req = request.get_json()
    if request.method != "GET":
        return jsonify({}), RS405
    username = request.args.get("uid")
    if username == "":
        return jsonify({}), RS400
    table = "applied_for"
    con = sqlite3.connect("backend/scokit.db")
    cursorobj = con.cursor()
    print("select * from " + table + " where uid='" + username + "'")
    students_list = list(
        cursorobj.execute("select * from "
                          + table
                          + " where uid='"
                          + username +
                          "'"
                          )
    )
    students_dict = {}
    for _ in students_list:
        if(_[0] not in students_dict):
            students_dict[_[0]] = requests.get(
                        "http://localhost:5000/api/v1/getdetails?uid="+str(_[0])+"&usertype=student").json()
    print(students_dict)
    return jsonify(students_dict), RS200


# <---------------------------------Get all internships or scholarships of a student applied or an employee posted----------------------->
'''
Api to get all internships or scholarships of a student applied or an employee posted
Method: GET
url:/api/v1/internships_scholarships_posted_applied?uid=vishnu&usertype=employee

Restrictions:
uid--> must be present in the table applied_for
usertype--> student or employee
'''
@app.route("/api/v1/internships_scholarships_posted_applied", methods=["GET"])
def get_internships_scholarships():
    con = sqlite3.connect("backend/scokit.db")
    cursorobj = con.cursor()
    req = request.get_json()
    if request.method != "GET":
        return jsonify({}), RS405
    username = request.args.get("uid")
    usertype = request.args.get("usertype")
    if username == "":
        return jsonify({}), RS400
    if(usertype == "student"):
        table = "applied_for"
        print("select * from " + table + " where userid='" + username + "'")
        students_list = list(
            cursorobj.execute("select * from "
                              + table
                              + " where userid='"
                              + username +
                              "'"
                              )
        )
        students_dict = {}
        for _ in students_list:
            if(_[2][0] == 'i'):
                if(_[2] not in students_dict):
                    students_dict[_[2]] = requests.get(
                        "http://localhost:5000/api/v1/getdetails?uid="+str(_[2])+"&usertype=internship").json()
            elif(_[2][0] == 's'):
                if(_[2] not in students_dict):
                    students_dict[_[2]] = requests.get(
                        "http://localhost:5000/api/v1/getdetails?uid="+str(_[2])+"&usertype=scholarship").json()
            else:
                return jsonify({}), RS200
        # print(students_dict)
        return jsonify(students_dict), RS200
    if(usertype == "employee"):
        # print("select * from " + table + " where emp_name='" + username + "'")
        internscholarship_list = list(
            cursorobj.execute("select * from "
                              + "internship"
                              + " where emp_name='"
                              + username +
                              "'"
                              )
        )
        internscholarship_list.extend(list(
            cursorobj.execute("select * from "
                              + "scholarship"
                              + " where provider='"
                              + username +
                              "'"
                              )
        )
        )
        print(internscholarship_list, "HIIIIIIIIIIIIIIIIIIIIII")
        internscholarship_dict = {}
        for _ in internscholarship_list:
            if(_[0][0] == "s"):
                type = "scholarship"
            elif(_[0][0] == "i"):
                type = "internship"
            else:
                return jsonify({}), RS500
            if(_[0] not in internscholarship_dict):
                internscholarship_dict[_[0]] = requests.get(
                    "http://localhost:5000/api/v1/getdetails?uid="+str(_[0])+"&usertype="+type).json()
    return (internscholarship_dict), RS200


# Tell me what all data should be sent back
# <---------------------------------Delete the applications from applied_for table if the application is deleted by the student---------------->
"""
delete is to delete any tuple of TABLE applied_for in the database"
Method : DELETE
url: /api/v1/delete_applied?userid=vishnu&uid=s_0

Restrictions:
uid--> can be anything until its there in the table
usertype--> student or employee or scholarship or internship

"""
@app.route("/api/v1/delete_applied", methods=["DELETE"])
def delapplied():
    if request.method != "DELETE":
        return jsonify({}), RS405
    name = request.args.get("userid")
    uid = request.args.get("uid")
    table = "applied_for"
    l = check_user_exists(table, name, uid)
    print(l)
    if len(l) != 0:
        con = sqlite3.connect("backend/scokit.db")
        cursorobj = con.cursor()
        cursorobj.execute("delete from " + table +
                          " where userid='" + name + "' and uid='"+uid+"'")
        con.commit()
        return jsonify({}), RS200
    else:
        return jsonify({}), RS400


# <-----------------------------------Get list of all available internships or scholarships------------------------------->
'''
Api to call list of all available internships and scholarships
url:/api/v1/all_internship_scholarship
'''
@app.route("/api/v1/all_internship_scholarship", methods=["GET"])
def all_internships_scholarships():
    if request.method != "GET":
        return jsonify({}), RS405
    con = sqlite3.connect("backend/scokit.db")
    cursorobj = con.cursor()
    # print("select * from " + table + " where uid='" + username + "'")
    scholarship_list = list(
        cursorobj.execute("select * from scholarship")
    )
    internship_list = list(
        cursorobj.execute("select * from internship")
    )
    scholarship_list.extend(internship_list)
    internscholarship_dict = {}
    for _ in scholarship_list:
        if(_[0][0] == "s"):
            type = "scholarship"
        elif(_[0][0] == "i"):
            type = "internship"
        else:
            return jsonify({}), RS500
        if(_[0] not in internscholarship_dict):
            internscholarship_dict[_[0]] = requests.get(
                "http://localhost:5000/api/v1/getdetails?uid="+str(_[0])+"&usertype="+type).json()
    return (internscholarship_dict), RS200



#<-----------------------------------Get the probability acceptance rate for internships only------------------------------->
'''
Api to call list of all available internships and scholarships
url:/api/v1/internship_probability_acceptance?userid=vishnu&uid=i_0
'''
@app.route("/api/v1/internship_probability_acceptance", methods=["GET"])
def internship_probability_acceptance():
    req = request.get_json()
    if request.method != "GET":
        return jsonify({}), RS405
    userid = request.args.get("userid")
    uid = request.args.get("uid")
    if userid == "" or uid == "":
        return jsonify({}), RS400
    if uid[0]!="i":
        return jsonify({}),RS400
    l=check_user_exists("student",userid,'')
    l1=check_user_exists("internship",uid,'')
    if(
        len(l)==0 or len(l1)==0
        ):
        return jsonify({}),RS400

    internship_details=requests.get("http://localhost:5000/api/v1/getdetails?uid="+str(uid)+"&usertype=internship").json()
    student_details=requests.get("http://localhost:5000/api/v1/getdetails?uid="+str(userid)+"&usertype=student").json()
    if(
        str(internship_details["description"])==''
                                                    or str(student_details["pdescription"])==''
                                                    or str(student_details["skills"])==''):
        return jsonify({}),RS400

    # c_dataset = open("intelligent_component/c_requirements.txt", "r").read().lower()
    # p_dataset= open("intelligent_component/Projects.txt","r").read().lower()
    # skills_dataset=open("intelligent_component/skills.txt","r").readlines()
    # probability_acceptance=my_probability_model.get_probability(c_dataset,p_dataset,skills_dataset)
    #print(str(internship_details["description"]).strip(),str(student_details["pdescription"]).strip(),str(student_details["skills"]).strip())
    probability_acceptance=my_probability_model.get_probability(str(internship_details["description"]).strip(),str(student_details["pdescription"]).strip(),str(student_details["skills"]).strip())
    return jsonify({"probability_acceptance":str(probability_acceptance)}),RS200
    #print(str(internship_details["description"]),str(student_details["pdescription"]),str(student_details["skills"]))
    #return jsonify({"prob":str(checking.hello())}),RS200
    
    
if __name__ == "__main__":
    app.debug = True
    # app.bind(9000)
    # app.run(host="0.0.0.1",port=5000)
    app.run()
