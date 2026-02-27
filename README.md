This is a simple library management web application built with:

Node.js

Express

MongoDB

JWT authentication

Basic HTML + Bootstrap frontend

The system allows users to register, log in, browse books,add books and borrow them.


Authentication :

User registration

User login

Password hashing using bcrypt

JWT authentication

Protected routes




Books : 

View all books

Filter by category and page range

Add new books

Borrow books

Return books


Cart : 

Add books to cart

Remove books from cart

Borrow all books in cart

Cart is user-specific






.env : MONGO_USER=shai
MONGO_PASS=shai123
MONGO_SERVER=ecomm.jldpjqs.mongodb.net
MONGO_DB=ecommerce

MYSQL_USER=shai
MYSQL_PASS=1234
MYSQL_SERVER=localhost
MYSQL_DB=ecommdb

JWT_SECRET=someLongRandomSecret12345


how to open the server 
http://localhost:5050/login.html
