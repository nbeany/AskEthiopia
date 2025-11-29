# AskEthiopia

A modern, full-stack question and answer platform designed for the Ethiopian community. Ask questions, share knowledge, and connect with others through an intuitive and responsive web application.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.8-blue.svg)

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- ❓ **Ask Questions** - Post questions with titles, descriptions, and tags
- 💬 **Answer Questions** - Provide helpful answers to community questions
- 🔍 **Search Functionality** - Find questions quickly with full-text search
- 🏷️ **Tag Filtering** - Filter questions by tags for better organization
- 📱 **Responsive Design** - Beautiful, modern UI that works on all devices
- 🔒 **Protected Routes** - Secure access to user-specific features
- 📊 **My Questions** - View and manage your own questions
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Sequelize** - ORM for database management
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TanStack Query** - Data fetching and caching
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **Zod** - Schema validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nbeany/AskEthiopia.git
cd QA
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=askethiopia
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
```

**Important:** Replace the placeholder values with your actual MySQL credentials and generate a strong JWT secret.

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

For production, update this to your backend API URL.

### 4. Database Setup

Make sure MySQL is running and create the database:

```sql
CREATE DATABASE askethiopia;
```

The application will automatically create the necessary tables when you start the backend server.

### 5. Run the Application

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` (or the port shown in the terminal)

## 📁 Project Structure

```
QA/
├── backend/                 # Backend API server
│   ├── config/             # Configuration files
│   │   └── db.js           # Database configuration
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   └── answerController.js
│   ├── middleware/         # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/             # Database models
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Answer.js
│   │   └── index.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── questions.js
│   │   └── answers.js
│   ├── server.js           # Entry point
│   └── package.json
│
└── frontend/               # Frontend React application
    ├── public/             # Static assets
    ├── src/
    │   ├── components/     # React components
    │   │   ├── ui/         # shadcn/ui components
    │   │   ├── AnswerCard.tsx
    │   │   ├── QuestionCard.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── SearchBar.tsx
    │   │   └── TagFilter.tsx
    │   ├── context/        # React context
    │   │   └── AuthContext.tsx
    │   ├── hooks/          # Custom hooks
    │   ├── pages/          # Page components
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── AskQuestion.tsx
    │   │   ├── QuestionDetail.tsx
    │   │   └── MyQuestions.tsx
    │   ├── services/       # API services
    │   │   └── api.ts
    │   ├── App.tsx         # Main app component
    │   └── main.tsx        # Entry point
    ├── vite.config.ts
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Questions
- `GET /questions` - Get all questions (supports `?tag=` and `?q=` query params)
- `GET /questions/:questionid` - Get a specific question
- `POST /questions` - Create a new question (requires authentication)
- `PUT /questions/:questionid` - Update a question (requires authentication)
- `DELETE /questions/:questionid` - Delete a question (requires authentication)

### Answers
- `GET /answers/:questionid` - Get all answers for a question
- `POST /answers` - Create a new answer (requires authentication)
- `PUT /answers/:answerid` - Update an answer (requires authentication)
- `DELETE /answers/:answerid` - Delete an answer (requires authentication)

## 🏗️ Build for Production

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory. You can preview it with:

```bash
npm run preview
```

## 🔒 Environment Variables

### Backend `.env`
- `PORT` - Server port (default: 5000)
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASS` - MySQL password
- `DB_NAME` - Database name
- `DB_DIALECT` - Database dialect (mysql)
- `JWT_SECRET` - Secret key for JWT tokens

### Frontend `.env`
- `VITE_API_URL` - Backend API URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Issues

If you encounter any issues or have suggestions, please open an issue on [GitHub](https://github.com/nbeany/AskEthiopia/issues).

## 👤 Author

- **GitHub**: [@nbeany](https://github.com/nbeany)
- **Repository**: [AskEthiopia](https://github.com/nbeany/AskEthiopia)

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Powered by [Vite](https://vitejs.dev/) and [React](https://react.dev/)
- Database management with [Sequelize](https://sequelize.org/)

---

Made with ❤️ for the Ethiopian community

