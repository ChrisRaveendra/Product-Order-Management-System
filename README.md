# Product-Order-Management-System

This project allows users to create and manage products and orders. It provides a user interface for creating, editing, and viewing product and order information.

## Features

### Products

- **Create Product**: Users can create new products by providing the following information:

  - Name: The name of the product.
  - Price: The price of the product.
  - Quantity: The available quantity of the product.

- **Edit Product**: Users can edit existing products and update the following fields:

  - Name: Modify the name of the product.
  - Price: Update the price of the product.
  - Quantity: Change the available quantity of the product.

- **View Products**: Users can view a list of all products, including their details such as name, price, and quantity.

![Product Add_Edit](https://github.com/ChrisRaveendra/Product-Order-Management-System/assets/14883146/028aefbb-a4df-414d-a046-839135e10d47)

### Orders

- **Create Order**: Users can create new orders by specifying the following details:

  - Products: Select one or more products to include in the order.
  - Quantity: Specify the quantity of each product in the order.

- **Edit Order**: Users can edit existing orders and make changes to the following aspects:

  - Products: Add or remove products from the order.
  - Quantity: Update the quantity of products in the order.

- **View Orders**: Users can view a list of all orders placed, including the following information:
  - Order ID: A unique identifier for each order.
  - Status: The current status of the order (e.g., pending, processing, shipped).
  - Tracking: The tracking information associated with the order.
  - Products: The list of products included in the order, along with their quantities.

![Order Add_Edit](https://github.com/ChrisRaveendra/Product-Order-Management-System/assets/14883146/4602c0c3-b5ea-4539-861a-39fc41de3c51)

## Setup and Installation

1. Clone the repository.

```shell
git clone https://github.com/ChrisRaveendra/Product-Order-Management-System
```

Install the dependencies.

```shell
yarn install
```

Set up the required environment variables. Refer to the Environment Variables section for details.

Start the Node.js server.

```shell
node server.js
```

Start the development server for the React application.

```shell
yarn dev
```

Access the application in your browser.

```shell
http://localhost:5173/
```

Environment Variables
The following environment variables are required for the application to function correctly:

DB_HOST: The host address for the MySQL database.
DB_USER: The username for accessing the MySQL database.
DB_PASSWORD: The password for the MySQL database.
DB_NAME: The name of the MySQL database.
Ensure that these variables are set with the appropriate values before running the application.

License
This project is licensed under the MIT License.
