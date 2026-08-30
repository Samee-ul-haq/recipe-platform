# Recipe Platform

A full-stack recipe-sharing application where users can register, log in, upload their own recipes with images, browse recipes from the community, and manage their profile. The project combines a Node.js + Express backend with a React + Vite frontend and a MySQL database.

This repository is designed to be easy to understand and run locally, and it is structured for a clean separation between the API layer and the frontend client.

## Overview

The platform allows:

- Users to create an account and sign in
- Upload recipe titles, descriptions, ingredients, and images
- Browse recipe cards in a feed
- Search recipes by keyword
- Filter recipes by chef/user
- View their own profile and uploaded recipes
- Upload/update a profile avatar

This is a practical example of a modern web app with authentication, file uploads, and database-backed content.

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- CSS for UI styling

### Backend
- Node.js
- Express.js
- MySQL2
- JWT authentication
- bcryptjs for password hashing
- Multer for image uploads
- CORS
- dotenv for environment configuration

### Database
- MySQL

## Project Structure

```bash
recipe-platform-fullstack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── recipecontroller.js
│   │   │   └── usercontroller.js
│   │   ├── middleware/
│   │   │   ├── authmiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   ├── routes/
│   │   │   ├── recipeRouter.js
│   │   │   └── userRouter.js
│   │   └── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── public/
├── README.md
└── package-lock.json
```

## Core Features

### User authentication
- Register a new account
- Log in with email and password
- JWT-based protected routes
- Secure password storage via bcrypt hashing

### Recipe management
- Create recipes with title, description, and ingredients
- Upload recipe images
- Store recipe metadata in MySQL
- Returns recipe data through the REST API

### Community feed
- View all public recipes in a feed
- Search by title or description
- Filter by user/chef ID
- Sort using newest/oldest logic

### Profile management
- View recipes created by the logged-in user
- Upload a profile avatar
- Log out

## How it Works

### Frontend flow
The React app uses Vite and React Router to manage pages such as:

- Home/Feed
- Login
- Register
- Create Recipe
- Profile

The frontend sends API requests to the backend using Axios and stores authentication tokens in local storage.

### Backend flow
The backend exposes REST endpoints and validates requests with middleware. It handles:

- user registration/login
- JWT verification
- file uploads for avatars and recipe images
- DB queries for recipes, ingredients, and users

### Database flow
The app uses MySQL to store:

- `users`
- `recipes`
- `ingredients`
- `recipe_ingredients`

Each recipe is linked to the user who uploaded it, and each recipe can include multiple ingredients.

## Prerequisites

Before running this project locally, make sure you have:

- Node.js (v18 or newer recommended)
- npm or yarn
- MySQL installed and running
- A MySQL database created for the app
- Git installed

## Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/recipe-platform-fullstack.git
cd recipe-platform-fullstack
```

### 2. Backend environment variables

Inside the `backend` folder, create a `.env` file if it does not already exist.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=recipe_db
DB_PORT=3306
JWT_SECRET=your_super_secret_key
```

Important:
- This project reads `DB_PASS` in the database config file
- Make sure the values match your MySQL setup
- Use a strong value for `JWT_SECRET`

### 3. Database setup

Create a MySQL database named `recipe_db` (or match the name you set in `.env`):

```sql
CREATE DATABASE recipe_db;
```

The app expects tables similar to:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) NULL
);

CREATE TABLE recipes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE ingredients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE recipe_ingredients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipe_id INT NOT NULL,
  ingredients_id INT NOT NULL,
  quantity VARCHAR(255) DEFAULT '1 Unit',
  FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  FOREIGN KEY (ingredients_id) REFERENCES ingredients(id)
);
```

## Running the Project Locally

### Backend

```bash
cd backend
npm install
node server.js
```

By default, the Express server runs on:

```bash
http://localhost:3000
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will usually run on:

```bash
http://localhost:5173
```

## API Endpoints

The backend API is mounted under `/api`.

### Authentication

#### Register user
```http
POST /api/auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login user
```http
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Returns a JWT token that must be sent in the `Authorization` header.

#### Upload user avatar
```http
POST /api/auth/avatar
```

Requires authentication.

### Recipes

#### Get all recipes
```http
GET /api/recipes
```

Supports query params:
- `search` - search by title or description
- `chef` - filter by user id
- `sort` - `oldest` or default newest

Example:
```http
GET /api/recipes?search=pasta&chef=2
```

#### Get recipe by ID
```http
GET /api/recipes/:id
```

#### Create recipe
```http
POST /api/recipes
```

Requires authentication and multipart form data.

Example form fields:
- `title`
- `description`
- `ingredients`
- `image`

## Frontend Usage

### Register
1. Open the frontend in the browser.
2. Go to the Register page.
3. Enter an email and password.
4. Create your account.

### Login
1. Go to the Login page.
2. Enter your credentials.
3. The app stores the JWT in local storage.

### Upload a recipe
1. Log in to the app.
2. Open the Upload Recipe page.
3. Add recipe title, description, ingredients, and an image.
4. Submit the form.

### View feed
- The home page loads all recipes.
- Use search to find matching results.
- Filter by chef ID if needed.

### View profile
- The Profile page displays the logged-in user details.
- It shows the current user's uploaded recipes.
- You can also upload a profile picture.

## Important Notes

### Frontend API configuration
The frontend currently includes a default API base URL in `frontend/src/api.js` that points to a deployed backend:

```js
baseURL: 'https://recipe-aoi.onrender.com/api'
```

For local development, change it to:

```js
baseURL: 'http://localhost:3000/api'
```

This is important if you want the frontend to talk to your local backend instead of the deployed service.

### Image handling
Recipe and profile images are stored in upload folders and served via the backend from the `uploads` route.

## Deployment Considerations

If you want to deploy this app for production:

- Use environment variables in the hosting platform
- Set a strong `JWT_SECRET`
- Run MySQL in a managed service or container
- Configure CORS for your production frontend domain
- Upload image storage should ideally use a persistent cloud storage solution

## Troubleshooting

### MySQL connection failed
Check:
- MySQL is running
- Database name is correct
- Username/password in `.env` match your DB setup
- Port is correct

### JWT errors
Check:
- `JWT_SECRET` is set in backend `.env`
- The token is being sent in the `Authorization` header as `Bearer <token>`

### Frontend cannot connect to backend
Verify:
- The backend is running on port `3000`
- The frontend `baseURL` points to the correct backend URL
- CORS is enabled on the backend

### Image upload issues
Check:
- The file is an image type
- The upload directory exists
- The backend has permission to write to it

## Future Improvements

Potential enhancements for this project include:

- Recipe editing and deletion
- Recipe categories and tags
- User profile pages
- Likes/favorites system
- Comments and ratings
- Pagination
- Better validation and error handling
- Dark mode UI
- Deployment-ready Docker setup

## License

This project is currently unlicensed unless you add a license file of your choice.

If you want, you can add one such as:
- MIT
- Apache 2.0
- GPL

## Contributing

Contributions are welcome. If you want to improve the project:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a pull request

## Summary

This project is a simple but complete recipe-sharing application that demonstrates:

- full-stack development
- REST API design
- authentication
- file uploads
- MySQL integration
- React frontend state and routing

It is a great starting point for building a real community-driven recipe app or a portfolio project for GitHub.
