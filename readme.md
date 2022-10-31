## Code and Mongodb setup using Docker compose

* Install docker from https://docs.docker.com/get-docker/ according to the OS of your system.
* Open Terminal in Mac system and execute command docker -v to check if docker is installed or not.
   Example: `docker -v`
* Open the Docker GUI to interact with docker.
* Extract the solution from the Github link shared in the email and save in any of the directory.
* Execute below commands
   1. Open the terminal(MacOS) and traverse to the directory where you have downloaded project using terminal commands.
   2. Run the command `docker-compose up`
   3. Wait until all the required images are downloaded and installed successfully. If there is connection timeout, then rerun the same command.

* Use POSTMAN or curl messages or any api calling tool to interact with this service. Express server listening on port http://localhost:4000


## Code setup if Docker-compose fails

* If you face any problems setting up docker/running docker-compose then use the node-app directly.
* Execute below commands
   1. Run the command `docker run -d -p 27017:27017 --name mongodb-image mongo:4.0.4`
   2. This will download Mongodb image and it will start on port 27017
   3. Open the terminal(MacOS) and traverse to the directory where you have downloaded project using terminal commands.
   4. Run the command `npm i`
   5. The above command will download all necessary node modules. Express server listening on port http://localhost:3000

* Use POSTMAN or curl messages or any api calling tool to interact with this service. Express server listening on port http://localhost:3000

## Information on exposed public APIs with Example (Use the port number as per above instructions)

   1. POST /product -> This api must be run initially to setup products collection. No payload is required when using this api.
         This will automatically clear the products collection everytime calling the api.

      URL: POST http://localhost:3000/product with default headers Content-type and Accept as 'application/json'.
      Request body: { }
      Response: Http code 201 and with code: 1 and message 'Success'.

   2. GET /all-products -> Get all the products will be sent in response with empty payload and no query param.
       
      URL: POST http://localhost:3000/all-products with default headers Content-type and Accept as 'application/json'.
      QueryParam: ''
      Response: Http code 200 and with below response format.
      {
         code: 1,
         message: 'Success'
         data: [
                  {
                     "_id": "635e8b64b5c14085aade066f",
                     "productId": 1,
                     "title": "Apple",
                     "description": "An apple is an edible fruit produced by an apple tree (Malus domestica)",
                     "picture": "http://localhost:3000/image?image=YXBwbGUuanBlZw==",
                     "price": 10
                  }
         ]
      }

      Here the image name is encoded. It can be opened using the link.

   3. GET /all-products?title=P -> Get all the products will contains the text from title query param.

   4. GET /all-products?description="edible frui" -> Get all the products will contains the text from description query param.

   5. GET /all-products?title=p&description="fruit" -> Get all the products will contains the text from title and description query param.
      That means products which contains letter 'p' and description 'fruit'.
   
   6. GET /all-products?sortBy=Price&sortByOrder=asc -> Get all the products sorted by Price and the sort by order.
      Default sort order is ascending if you skip sortByOrder query param. Api accepts Case insensitive values.
    
   7. GET /all-products?sortBy=Price&sortByOrder=desc&title=papaya&description=edible -> Get all the products according to the search query params.
    
   8. GET /image?image=imageId -> This api returns the image of the product on sending correct image link.

   9. POST /order -> This api will create an Order in the db. There is a validation on totalPrice. It must be equal to all the products price * quantity.
         All properties inside the payload must be of type integer otherwise 400 http code is sent.

      URL: POST http://localhost:3000/order with default headers Content-type and Accept as 'application/json'.
      Request body:
         {
            "code": 1,
            "message": "Success",
            "data": {
               "id": "635f878a3c0d0d9079b22680"
            }
         }
      Response: Http code 201 and with an id inside a data property.
   
   10. GET /order -> This will show all the orders created.

   11. GET /order/:id -> This will show the specific order.

   11. DELETE /order -> This will delete all the orders.

   12. Response format of all responses contains 
         a. code with 1 is success and 0 is Failure.
         b. message containes the string response result OR array of objects with message in it. Array because there might be multiple validations failure.
         c. data contains either array of all products/orders object OR object of just id

## Set up
-----------

The project uses Node v16 as it's runtime and developed using Typescript. Dependencies should be installed via `npm i` to install the packages.

The application relies on:
 * MongoDB
 * Mongodb and Mongoose as object modelling
 * Docker and Docker compose


## How to start service locally
Open terminal and go to the path of this service and then run below command 

```
npm start
```

## How to run all tests locally
Open terminal and go to the path of this service and then run below command 

```
npm run test
```

## How to do linting
Open terminal and go to the path of this service and then run below command 

```
npm run lint
```
