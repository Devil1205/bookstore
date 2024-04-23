# bookstore setup
1. Fork the repository or download and extract the zip file of source to any directory.
2. Open the folder in VS code and create a file named .env inside server. Add these lines to the .env file and replace all the values with own:

   ```
   URI = mongodb://localhost:27017/bookstore (or your own mongodb url)
   JWT_SECRET = helloworld@123
   JWT_EXPIRY = 4d
   COOKIE_EXPIRY = 4
   MAIL_ID = mystore.org.0109@gmail.com
   MAIL_PASSWORD = pfam nrmy yfqt yjxq
   ```
3. Open terminal in VS code and run these commands:

   ```
   cd server
   ```
   ```
   npm install   
   ```
   ```
   npm run dev   
   ```
4. Test the api endpoints given below using thunderclient or postman. (I prefer thunderclient)
## User Api Endpoints
1. Register user
     - http://localhost:5000/api/v1/register
     - type: POST
     - JSON input: {
  "name": "Pulkit Sachdeva",
   "email": "sachdeva.pulkit1205p@gmail.com",
   "password": "helloworld"
}
2. Login user
     - http://localhost:5000/api/v1/login
     - type: POST
     - JSON input: {
  "email": "sachdeva.pulkit2599@gmail.com",
  "password": "helloworld"
}
3. Get profile
     - http://localhost:5000/api/v1/profile
     - type: GET
     - JSON input: none
4. Update Profile
     - http://localhost:5000/api/v1/profile
     - type: PUT
     - JSON input: {
  "name": "Pulkit Sachdeva",
  "email": "sachdeva.pulkit2599@gmail.com"
}
5. Update Password
     - http://localhost:5000/api/v1/password
     - type: PUT
     - JSON input: {
  "oldPassword": "helloworld",
  "password": "helloworlds"
}
6. Logout user
     - http://localhost:5000/api/v1/logout
     - type: GET
     - JSON input: none
7. Forgot Password
     - http://localhost:5000/api/v1/password/forgot
     - type: POST
     - JSON input: {
  "email": "sachdeva.pulkit2599@gmail.com"
}
8. Reset Password
     - http://localhost:5000/api/v1/password/reset/b64a9b732b8e5a7bf32b663bd230ea79db29ff35 (link received on mail id)
     - type: POST
     - JSON input: {
  "password":"helloworld",
  "confirmPassword": "helloworld"
}
## Book Api Endpoints
1. Add book
     - http://localhost:5000/api/v1/book
     - type: POST
     - JSON input: {
  "isbn": 11111111111112,
  "title": "How to become rich",
  "author": "Abhishek",
  "publisher": "Anand Enterprises",
  "price": 499,
  "year": 2001
}
2. Search books
     - http://localhost:5000/api/v1/books?author=Pulkit&price[gte]=100&price[lte]=500 (add more filters as query params using same pattern)
     - type: GET
     - JSON input: none
3. Update book
     - http://localhost:5000/api/v1/book/662814e6eaab16bf32b2eb0a (replace with book id)
     - type: PUT
     - JSON input: {
  "isbn": 12341122112212,
  "title": "First Book updated",
  "author": "Pulkit",
  "publisher": "A1 Publishers",
  "price": 199,
  "year": 2002
}
4. Delete book
     - http://localhost:5000/api/v1/book/662814e6eaab16bf32b2eb0a (replace with book id)
     - type: DELETE
     - JSON input: none
  
**I have also uploaded thunderclient folder to the repository, import it in thunderclient using VS code and make testing faster. The JSON input data provided is sample data for reference, kindly replace it with relevant id and credentials.**   
