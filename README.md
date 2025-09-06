# EcoFinds - Sustainable Second-Hand Marketplace

## Project Overview
EcoFinds is a web application designed to empower sustainable consumption by providing a trusted platform for buying and selling pre-owned goods. The project features user authentication, product listing management, browsing, filtering, cart, and purchase history functionalities. It is built with a React frontend and an Express/Node.js backend, using PostgreSQL for data storage and Cloudinary for image hosting.

## Features
- **User Authentication:** Register and login with email and password.
- **Profile Management:** Edit user profile and view dashboard.
- **Product Listings:** Create, view, edit, and delete product listings with title, description, category, price, and image.
- **Product Browsing:** Search and filter products by category and keyword.
- **Product Detail View:** View full details of a selected product.
- **Cart:** Add products to cart and view cart items.
- **Purchases:** View previous purchases.
- **Image Upload:** Upload product images via file or URL (stored in Cloudinary).

## Folder Structure
```
project-bolt-sb1-yfm9t4td/
├── project/
│   ├── src/
│   │   ├── pages/        # Main app pages (Home, AddProduct, etc.)
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # App and Auth context
│   │   ├── types/        # TypeScript types
│   ├── public/           # Static assets (logo, banner)
│   ├── ...               # Config files (package.json, etc.)
├── backend/
│   ├── src/
│   │   ├── routes/       # API routes (auth, product, cart, etc.)
│   │   ├── db.js         # PostgreSQL connection
│   │   ├── index.js      # Express server entry
│   │   ├── init_db.sql   # Database schema
│   ├── .env              # Environment variables
│   ├── ...               # Config files
```

## How to Run

### Backend
1. Navigate to the backend folder:
   ```
   cd backend
   npm install
   npm run dev
   ```
2. **PostgreSQL Setup:**
   - Make sure PostgreSQL is installed and running.
   - Update your `.env` file with your database credentials:
     ```
     PGDATABASE=your_db_name
     PGPORT=5432
     PGUSERNAME=your_db_user
     PGPASSWORD=your_db_password
     ```
   - Run the SQL in `src/init_db.sql` to create the required tables.
3. **Cloudinary Setup:**
   - Sign up at [Cloudinary](https://cloudinary.com/) and get your API credentials.
   - Add these to your `.env` file:
     ```
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```
   - The backend uses Cloudinary to upload and store product images. When a user uploads an image, it is sent to Cloudinary and the returned URL is saved in the database.

### Frontend
1. Navigate to the project folder:
   ```
   cd project
   npm install
   npm run dev
   ```
2. Access the app at [http://localhost:5173](http://localhost:5173)

## Solving the Problem Statement
- **Authentication:** Secure registration/login using JWT and bcrypt.
- **Product CRUD:** Users can create, edit, delete, and view their own listings. Images are uploaded to Cloudinary.
- **Browsing & Search:** Products are displayed in a grid, with search and category filter options.
- **Cart & Purchases:** Users can add products to cart and view previous purchases.
- **Responsive UI:** The frontend is designed to work on both desktop and mobile, following provided wireframes.

## Common Issues & Solutions
- **Image Upload:** Only use the file upload for local images, not the URL field. URLs must be public.
- **API Errors:** Ensure frontend API calls use the backend server URL (`http://localhost:5000`).
- **Type Errors:** Make sure category values match the allowed categories in your types.
- **CORS:** Backend must allow requests from frontend origin.

## Contact
For questions or issues, please contact the project maintainer.
