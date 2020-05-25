import os
import unittest
import json

from apis import app


TEST_DB = 'scokit.db'


class BasicTests(unittest.TestCase):

    ############################
    #### setup and teardown ####
    ############################

    # executed prior to each test
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
            os.path.join(app.config['BASEDIR'], TEST_DB)
        self.app = app.test_client()

    # executed after each test
    def tearDown(self):
        pass


###############
#### tests ####
###############

    # Delete User
    # def test_delete_user(self):
    #     with app.test_client() as client:
    #         response = client.delete(
    #             '/api/v1/delete?uid=rrk&usertype=student'
    #         )
    #         self.assertEqual(
    #             response.status_code, 200
    #         )

    # Sign Up
    # def test_sign_up(self):
    #     with app.test_client() as client:
    #         # send data as POST form to endpoint
    #         requestData = {
    #             "username": "rrk1000",
    #             "password": "123123123",
    #             "name": "Rishi",
    #             "usertype": "student"
    #         }
    #         response = client.put(
    #             '/api/v1/signup',
    #             data=json.dumps(requestData),
    #             headers={"Content-Type": "application/json"}
    #         )
    #         self.assertEqual(
    #             response.status_code, 201
    #         )

    # Login


    # def test_login(self):
    #     with app.test_client() as client:
    #         requestData = {
    #             "username": "rrk",
    #             "password": "123123123",
    #             "usertype": "student"
    #         }
    #     response = self.app.post(
    #         '/api/v1/login',
    #         data=json.dumps(requestData),
    #         headers={"Content-Type": "application/json"}
    #     )

    #     self.assertEqual(
    #         response.status_code, 200
    #     )

    # Get user details
    def test_get_details(self):
        with app.test_client() as client:
            response = client.get(
                '/api/v1/getdetails?uid=rrk&usertype=student',
            )
            self.assertEqual(
                response.status_code, 200
            )

    # Change Password
    def test_change_password(self):
        with app.test_client() as client:
            loginCredentials = {
                "username": "rrk",
                "password": "123123123",
                "usertype": "student"
            }
            res = self.app.post(
                '/api/v1/login',
                data=json.dumps(loginCredentials),
                headers={"Content-Type": "application/json"}
            )
            data = json.loads(res.data)
            token = data["token"]
            requestData = {
                "username": "rrk",
                "usertype": "student",
                "current_password": "123123123",
                "new_password": "123123123",
                "token": token
            }
            response = client.post(
                '/api/v1/editpassword',
                data=json.dumps(requestData),
                headers={"Content-Type": "application/json"}
            )
            self.assertEqual(
                response.status_code, 200
            )

    # Edit Personal Details(Student)
    def test_edit_personal_details(self):
        with app.test_client() as client:
            loginCredentials = {
                "username": "rrk",
                "password": "123123123",
                "usertype": "student"
            }
            res = self.app.post(
                '/api/v1/login',
                data=json.dumps(loginCredentials),
                headers={"Content-Type": "application/json"}
            )
            data = json.loads(res.data)
            token = data["token"]
            requestData = {
                "uid": "rrk",
                "usertype": "student",
                "column_details": "['dob', 'email', 'phone', 'snetwork']",
                "new_details": "['16/02/1999','rrk@rrk.com', '943943423','rrk1000;rrk1000']",
                "token": token
            }
            response = client.post(
                '/api/v1/editdetails',
                data=json.dumps(requestData),
                headers={"Content-Type": "application/json"}
            )
            self.assertEqual(
                response.status_code, 200
            )

    # Edit skill on profile page
    def test_edit_project(self):
        with app.test_client() as client:
            loginCredentials = {
                "username": "rrk",
                "password": "123123123",
                "usertype": "student"
            }
            res = self.app.post(
                '/api/v1/login',
                data=json.dumps(loginCredentials),
                headers={"Content-Type": "application/json"}
            )
            data = json.loads(res.data)
            token = data["token"]

            requestData = {
                "uid": "rrk",
                "usertype": "student",
                "column_details": "['pdescription']",
                "new_details": "['Project2\\nProject2Description']",
                "token": token
            }
            response = client.post(
                '/api/v1/editdetails',
                data=json.dumps(requestData),
                headers={"Content-Type": "application/json"}
            )
            self.assertEqual(
                response.status_code, 200
            )

    # Edit skill on profile page
    def test_edit_skill(self):
        with app.test_client() as client:
            loginCredentials = {
                "username": "rrk",
                "password": "123123123",
                "usertype": "student"
            }
            res = self.app.post(
                '/api/v1/login',
                data=json.dumps(loginCredentials),
                headers={"Content-Type": "application/json"}
            )
            data = json.loads(res.data)
            token = data["token"]

            requestData = {
                "uid": "rrk",
                "usertype": "student",
                "column_details": "['skills']",
                "new_details": "['Python3-9\\nJavaScript-8']",
                "token": token
            }
            response = client.post(
                '/api/v1/editdetails',
                data=json.dumps(requestData),
                headers={"Content-Type": "application/json"}
            )
            self.assertEqual(
                response.status_code, 200
            )

    # Change Company Description
    def test_change_company_description(self):
        with app.test_client() as client:
            loginCredentials = {
                "username": "emp1",
                "password": "123123123",
                "usertype": "employee"
            }
            res = self.app.post(
                '/api/v1/login',
                data=json.dumps(loginCredentials),
                headers={"Content-Type": "application/json"}
            )
            data = json.loads(res.data)
            token = data["token"]

            requestData = {
                "uid": "emp1",
                "usertype": "employee",
                "column_details": "['cdescription']",
                "new_details": "['New Description']",
                "token": token
            }
            response = client.post(
                '/api/v1/editdetails',
                data=json.dumps(requestData),
                headers={"Content-Type": "application/json"}
            )
            self.assertEqual(
                response.status_code, 200
            )

    # Add Internship
    def test_add_internship(self):
        with app.test_client() as client:
            loginCredentials = {
                "username": "emp1",
                "password": "123123123",
                "usertype": "employee"
            }
            res = self.app.post(
                '/api/v1/login',
                data=json.dumps(loginCredentials),
                headers={"Content-Type": "application/json"}
            )
            data = json.loads(res.data)
            token = data["token"]

            requestData = {
                "usertype": "internship",
                "itr_name": "Software Development Intern",
                "emp_name": "emp1",
                "stipend": "90000",
                "branch": "CSE",
                "city": "Bangalore",
                "description": "Description",
                "gpa": "9.0"

            }
            response = client.put(
                '/api/v1/add_internship_scholarship',
                data=json.dumps(requestData),
                headers={"Content-Type": "application/json"}
            )
            self.assertEqual(
                response.status_code, 201
            )

    # Apply for internship
    def test_apply_internship(self):
        with app.test_client() as client:
            loginCredentials = {
                "username": "rrk",
                "password": "123123123",
                "usertype": "student"
            }
            res = self.app.post(
                '/api/v1/login',
                data=json.dumps(loginCredentials),
                headers={"Content-Type": "application/json"}
            )
            data = json.loads(res.data)
            token = data["token"]

            requestData = {
                "username": "rrk",
                "uid": "i_1",
                "usertype": "internship",
                "token": token
            }
            response = client.put(
                '/api/v1/apply',
                data=json.dumps(requestData),
                headers={"Content-Type": "application/json"}
            )
            self.assertEqual(
                response.status_code, 200
            )

    # Get all user internship applications
    def test_get_all_applications(self):
        with app.test_client() as client:
            response = client.get(
                '/api/v1/students_internship_scholarship?uid=i_1',
            )
            self.assertEqual(
                response.status_code, 200
            )
    
    # Get all internship applications posted by a student
    def test_get_all_student_applications(self):
        with app.test_client() as client:
            response = client.get(
                '/api/v1/internships_scholarships_posted_applied?uid=rrk&usertype=student',
            )
            self.assertEqual(
                response.status_code, 200
            )
    
    # Get all internship applications posted by an employer
    def test_get_all_company_applications(self):
        with app.test_client() as client:
            response = client.get(
                '/api/v1/internships_scholarships_posted_applied?uid=emp1&usertype=employee',
            )
            self.assertEqual(
                response.status_code, 200
            )


if __name__ == "__main__":
    unittest.main()
