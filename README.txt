
To run this application you need :
    1 : Setup the cluster database
    2 : Copy the cluster URI and past it in app.js line:23 (change my URI by yours) and also in product-sedeer.js line:09.
    3 : First run cd to the seed folder and run .\product-seeder, then run .\app.js  
    4 : If you want to create a user, simply go to sign-up or navigate to localhost:3000/user/signup , create a user (be sure to fill all the fields).
    5 : You need to be logged in, in order to add a product to the shopping cart.
    6 : If you want to change a user to an admin you will need to access to the database, then change the value of isAdmin from 0 to 1 MANUALLY (I had issues trying to implement this on the application).
    7 : To add a new product , navigate to the dashboard , then add new product, and fill all field ( all fields are required ), and be sure to add a web picture URL in the iamge field
    8 : To review a product , you will have to : either buy a product, buy selecting a product then go to shopping card then order or 
    go to admin dashboard then manage products , then write a review .
    9 : All orders are stored in a database , you can see products history in /user/profile after login.
    10 : The sessions expiry every hour.
    