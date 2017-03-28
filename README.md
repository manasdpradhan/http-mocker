# Test Http Mock server

A barebones Node.js server using [Express 4](http://expressjs.com/).

You can use this server for registering callbacks on any third party service by running it in Heroku with  single click.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:manasdpradhan/http-mocker.git # or clone your own fork
$ cd http-mocker
$ npm install
$ npm start
```

Your app should now be running on [localhost:8080](http://localhost:8080/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
