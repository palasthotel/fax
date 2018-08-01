# FAX

With fax you can improve the way your newsroom works with your extensive network of freelance writers. fax enables your editors to set up a database, manage story pitches and automatically inform your freelancers about the status of their articles.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Setup locally using Docker

1. Copy the .env.example to .env
2. Load the dependencies `composer update`
3. Start the containers `docker-compose up`
4. Create basic folders and migrations `docker-compose exec web composer prepare`
5. Create the application key `docker-compose exec web php artisan key:generate`
6. Setup passport `docker-compose exec web php artisan passport:install`
7. Clear config cache `docker-compose exec web php artisan config:cache`
8. Create some example users and articles `docker-compose exec web php artisan db:seed`

## Setup on a Webserver

### Requirements

* PHP >= 7.0.0
* OpenSSL PHP Extension
* PDO PHP Extension
* Mbstring PHP Extension
* Tokenizer PHP Extension
* XML PHP Extension
* MySQL Database

### Installation

1. point the DOCUMENT_ROOT of your webserver to the public folder within FAX
2. load the dependencies `composer update`
3. copy the .env.example file to .env and change the database settings to the one of your database server
4. run `composer prepare && php artisan key:generate && php artisan passport:install && artisan config:cache`
5. to create some sample data, run `php artisan db:seed`

## First steps

This will run all the steps needed to get FAX up and running. Two example users and a few
example articles will be created as well. You can now login to your own FAX by opening the
your webbrowser on http://localhost and using one of the accounts below.

Freelancer: fritz@example.com:secret
Editor: eddi@example.com:secret

## Setup Frontend

### Requirements
- [Node.js Package Manager (npm)](https://www.npmjs.com/get-npm)
- A PHP Webserver

### Technologies
- npm
- React
- Webpack
- Babel
- Browserlist
- Autoprefixer
- Apollo
- SASS
- UIkit

### Taskrunner
To keep dependencies low, we use **npm scripts** for taskrunner purposes. Some of them run Webpack. There are two Webpack config files, one for development and the other one for production. Right now they only contain Babel for ES5 compatibility.

### Installation
- Run `$ npm install`.
- Inside the `docroot` directory create a `all.css` symlink targeting `all.dev.css` or `all.prod.css`, depending on your environment, e. g.: `$ ln -s all.dev.css all.css`
- Inside the `docroot` directory create a `bundle.js` symlink targeting `bundle.dev.js` or `bundle.prod.js`, depending on your environment, e. g.: `$ ln -s bundle.dev.js bundle.prod.js`

### Other npm scripts
There are some other npm scripts, which can make life easier. Some of those are:
- `$ npm run build`. Your build should be compiled into the `docroot` directory.
- `$ npm run build:css` runs the SASS compiler, followed by Autoprefixer and CleanCSS. Since our frontend is based on UIkit, this task won’t probably change a lot.
- `$ npm run build:js` runs Webpack in both dev and prod configurations.
- `$ npm run watch:js-dev` runs Webpack in watch mode in dev configuration.
- `$ npm run watch:js-prod` runs Webpack in watch mode in dev configuration.

There are some other tasks, which aren’t mentioned here. You can have a look at `package.json`.

### Guidelines

To provide your guidelines in fax simply replace the guidelines.pdf file in the public folder with your guidelines.