# Hashtag You FE Assignment

### Installation

```sh
npm install
```

### Start Dev Server

```sh
npm run dev
```

### Assignment:

Using a mock database, pull product results and populate the page

#### Navigation

Open cart should open the Cart Modal

#### Products Container
  - Pull 6 products at a time from the database, and create a product component for each, with the following:
    - Product image
    - Product title
    - Product price
    - Add to Cart button
  - The product component must be styled following the structure provided in the wireframes
  - Add to cart button should add that product with a quantity of 1
  - Load more button should retrieve the next 6 products and add them to the container
  
#### Cart

Implement a custom cart solution that showcases the current state of the cart
  - Should reflect the currently added products and their quantities
  - Remove button should remove that particular product from the Cart

### Querying the mock database
  Product list can be retrieved from http://localhost:5000/products, in order to be able to provide pagination, the following params can be used: `_page` and `_limit`, for example `http://localhost:5000/products?_page=1&_limit=10`
