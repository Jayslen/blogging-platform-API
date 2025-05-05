
# Blogging Platform API

This is a project from [Roadmap.sh](https://roadmap.sh/projects/blogging-platform-api). It's a RESTful API that supports full CRUD (Create, Read, Update, Delete) operations for managing blog posts. With this API, you can create new posts, retrieve existing ones, update content, and delete posts as needed.

The project includes multiple data storage models for managing posts, including Local (in-memory), MongoDB, and MySQL.## Project Structure

```
BLOGGING_API/
├── controlls/               # Contains controller logic
├── models/                  # Data models for different storage methods
├── routes/                  # API route definitions
├── schemas/                 # Validation schemas (with ZOD)
├── .env                     # Environment variables
├── api.http                 # HTTP client requests for testing endpoints
├── app.js                   # Main app entry point
├── server-with-local.js     # Server setup using local storage
├── server-with-mongo.js     # Server setup using MongoDB
```
The project includes a controller responsible for handling all user input. It performs data validation when necessary and delegates operations to the selected model. There are separate models for each storage method: one for the local file system, another for MongoDB and a soon to add MySql.
## Run Locally

Clone the project
```bash
git clone https://github.com/Jayslen/blogging-platform-API
```

Install dependencies

```bash
  npm install
```

#### Run local server
```bash
  npm run start:local
```
#### Run MongoDB server

To run the project with MongoDB, follow these steps:
- Add the following environment variables to your .env file to configure the project correctly.
`MONGO_URI`

- Then run 
    ```bash
    npm run start:mongo
    ```

#### Run MySql server

To run the project with MySQL, follow these steps:
- Create the database using the SQL script located in the models/mysql directory.
- Add the following environment variables to your .env file to configure the project correctly.
`MYSQL_HOST`
`MYSQL_PORT`
`MYSQL_USER`
`MYSQL_DATABASE`

- Then run 
    ```bash
    npm run start:mysql
    ```


## API Reference

#### Get all items

```http
  GET /posts
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `None` | `None` | No parameter is required | 

#### Get single post

```http
  GET /post/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Filter post by term

```http
  GET /post?term=${term}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `term`      | `string` | **Required**. filter posts by a search term on the title, content or category fields |

#### Delete a post

```http
  Delete /posts/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of post to delete it |

#### Get single post

```http
  GET /posts/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Create a post

```http
  POST /posts
```

| Body Request| Description                       |
| :-------- | :-------------------------------- |
| ```{title: "string", content: "string", category: "string", tags: ["array"]}```       | **Required**. to create post |

#### Update Post

```http
  UPDATE /posts/${id}
```

| Parameter | Type     | Description |Body Request|
| :-------- | :------- | :-------------------------------- | :----- |
| `id`      | `string` | **Required**. Id of post to update |```object```|
