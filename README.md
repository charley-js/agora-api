# Agora

**Agora** ; _Derived from the ancient greek marketplace in athens, meaning an "assembly of the people" or "to gather"_

Find the hosted version [here](https://agora-pudw.onrender.com/api)

## Contents

- [Summary](#summary)
- [Features](#features)
- [Languages And Frameworks](#languages-and-frameworks)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Cloning The Repo](#1-clone-the-repo)
  - [Installing Dependencies](#2-install-dependencies)
  - [Setup PostgreSQL](#3-install-postgresql-and-setup-a-user)
  - [Set Environment Variables](#4-environment-variables)
  - [Setup Databases](#5-setup-databases)
  - [Seed Databases](#6-seed-the-databases)
  - [Run The Server](#7-start-the-server)
  - [API Access](#8-access-the-api)

## Summary

This is my first ever back-end project , completed during my time on the Northcoders Bootcamp. The project is an API for a news/social platform (a Reddit clone) designed to serve data to a front-end application. Various HTTP methods are supported, allowing multiple functionalities.

such as retrieving all articles, topics, comments and users. Articles can be retieved by ID and all comments can be recieved for a specific article. New comments can be posted or existing comments deleted for a specific article and an articles vote count can be updated.

I built this project using the concepts of Test-Driven Development with Integration Testing and I adpoted an MVC design for the project structure.

I have hosted the Database on [Supabase](https://supabase.com/) and the API on [Render](https://render.com/).

## Features

- Retrieve all articles, topics, comments and users
- Retrieve a specific article by ID
- Retrieve all comments for a specific article
- Post comments to a specific article, or delete existing ones
- Update a specific articles vote count
- Etc.

## Languages and Frameworks

- JavaScript
- PostgreSQL
- express.js
- node.js
- jest & jest-sorted
- supertest
- pg & pg-format
- dotenv

## Getting Started

A link to the hosted version can be found above, however if you would like to run the project locally please follow the following steps;

### Prerequisites

- Node.js: v21.x or higher
- PostgreSQL: v14.x or higher

### 1. Clone the repo

```
git clone https://github.com/charley-js/be-project
cd be-project
```

### 2. Install dependencies

```
npm install
```

> Please check the package.json to ensure all dependencies have been installed

### 3. Install PostgreSQL and setup a user

- You can download PostgreSQL from [here](https://www.postgresql.org/download/)

```
psql
CREATE USER your_username WITH PASSWORD 'your_password'
```

### 4. Environment Variables

- The .env files for this project have been .gitignored for the purposes of concealing the database names and protecting against SQL injection

- If cloning this project locally, the following files must be added inside the db directory.

1 .env.development

```
PGDATABASE = development-db-name
```

2 .env.test

```
PGDATABASE = test-db-name
```

- These files can then be referenced in the connection.js file, allowing the connection of node.js to the relevant db.

### 5. Setup Databases

- Run the following in the bash terminal of the project in VScode

```
npm run setup-dbs
```

### 6. Seed the Databases

```
npm run seed
```

### 7. Start the server

```
npm start
```

### 8. Access the API

- The server will start at http://localhost:9090
- You can send request to the API endpoints using software such as [postman](https://www.postman.com/) or [insomnia](https://insomnia.rest/)
- To recieve a list of all possible endpoints, send the following GET request
- http://localhost:9090/api

> To run and view the tests pass, and seed the test database with test data, run the following `npm test app`
