# Meesterproef Scheepvaartmuseum

## Table of Contents

*   [General Overview](#general-overview)
*   [Getting Started](#getting-started)
*   [The env file](#the-env-file)
*   [Adding a component](#adding-a-component)

## General Overview

This project serves as a platform where people that have knowledge about the ship 'De Oranje' can share their stories in the form of text, audio recordings and video.

## Tech Stack

*   SCSS
*   ESlint
*   Stylelint
*   Nodemon
*   Browserify, including watching, & ES8 features
*   Component template generator

The tooling used for this project can be downloaded from:
[https://github.com/moniac/node-sass-es8-boilerplate](https://github.com/moniac/node-sass-es8-boilerplate)

## Getting Started

To get started on this project, first `git clone` the repository onto your local machine.

The project will be available at the port defined in your ```.env``` file.

### The env file

This project requires the ```.env``` file to be filled in. Here are the required variables, everything except for the dev settings are left out.

```js
NODE_ENV=development

PORT=8000
DEV_PORT=8000

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
MYSQL_PORT=

SESSION_SECRET=
SECURE=
```

Afterwards:

```js
yarn install
```

To start developing:

```js
yarn run start
```

To build the project:

```js
yarn run build
```

## Adding a component

