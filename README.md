## A simple application based on Nest.js framework
<p>Simple small api without authentication/authorization. Just to show piece of my possibilities</p>

## About what this app:
<p>There is user, which may has many portfolios and images in these portfolios</p>

## How to install:
* Setup `.env` file
* Run `docker-compose build`
* Run `docker-compose up` or `docker-compose up -d`
* Enjoy :)

## Api methods:

* Auth
    * POST `/auth/sign-up` - register user
    * POST `/auth/log-in` - login user
    * POST `/auth/log-out` - logout user
* Users
    * DELETE `/users/delete-user/:id` - delete user
    * GET `image-feed/:userId` - get user's image feed
* Portfolios
    * POST `/portfolios/create-portfolio` - create user portfolios
    * DELETE `/portfolios/delete-portfolio/:id` - delete user's portfolios
*Images
    * POST `/images/upload-image` - upload image to portfolio
    * DELETE `/images/delete-image/:id` - delete image from portfolio