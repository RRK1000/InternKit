### Backend

Flask App that runs in port 5000 housing a sqlite database named **scokit.db**
scokit.db has 5 tables used for storing various data of the users.

### Database Structure

**scokit.db**

create table student (userid varchar(200) PRIMARY KEY, password varchar(200), name varchar(200));

create table scholarship(uid varchar(200) PRIMARY KEY,name varchar(200),amount varchar(200),provider varchar(200),category varchar(200),branch varchar(200));

create table applied_for(userid varchar(200), apl_dat varchar(2000), uid varchar(200));

create table internship(uid varchar(200) PRIMARY KEY,itr_name varchar(200), emp_name varchar(200), stipend varchar(200), branch varchar(200),city varchar(200), description varchar(2000),gpa varchar(200));

create table emp_login(userid varchar(200) PRIMARY KEY, password varchar(200), name varchar(200));

create table s_profile(userid varchar(200) PRIMARY KEY, dob varchar(200), education varchar(200), branch varchar(200),college varchar(200),email varchar(200),snetwork varchar(400),skills varchar(1000),pdescription varchar(4000),phone varchar(200));

create table e_profile(userid varchar(200) PRIMARY KEY, dob varchar(200),cname varchar(200), email varchar(200),snetwork varchar(400),post varchar(1000),cdescription varchar(4000),phone varchar(200));


#provider is an id in scholarship of emp_login and e_profile
#emp_name is an id in internship of emp_login and e_profile

### Apis
There are various python written apis which invoke the **scokit.db** using sqlite3 library of python
The apis also call the **my_probability_model (siamese network and wordcloud)** in the ***intelligent_component*** folder.
Hence the apis must be ran in the parent directory ***i.e. in InternKit directory*** 


### Run

Note: You must be in the InternKit Directory
- Install `requirements.txt`
- `py -3 backend/apis.py`
	in Windows\
	`python3 backend/apis.py` in Ubuntu