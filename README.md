# FeroCrafts HRMS

A comprehensive Human Resource Management System for managing employees, attendance tracking, and payroll processing.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (Employee, Manager, Admin)
  - Secure httpOnly cookie storage

- **Employee Management**
  - Complete employee profiles with documents
  - Bank details and UPI information
  - Site assignments and wage management

- **Attendance Tracking**
  - Selfie-based check-in/check-out
  - GPS location tracking
  - Manager approval workflow
  - Attendance history and reports

- **Payroll Management**
  - Automated payout calculation
  - PDF payslip generation
  - Period-based salary processing
  - Deductions and gross/net pay tracking

- **Client Sites**
  - Multiple work location management
  - Employee-site assignments
  - Site-specific wage rates

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express 5**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **PDFKit** for PDF generation
- **Winston** for logging
- **Joi** for validation
- **Helmet**, **CORS**, **Rate Limiting** for security

### Frontend
- **React 19** + **Vite**
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API requests
- **React Toastify** for notifications

## 📋 Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- npm or yarn

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd FeroCraftsHRMS
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/ferocrafts_hrms

# JWT
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_here_change_in_production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Optional: Base URL for production
# BASE_URL=https://your-domain.com
```

### 3. Frontend Setup

```bash
cd client
npm install
```

### 4. Seed Database (Optional)

```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@ferocrafts.com` / `Admin@123`
- Manager user: `manager@ferocrafts.com` / `Manager@123`
- Employee users: `employee1@ferocrafts.com` / `Employee@123` (and employee2, employee3)
- Sample sites, attendance records, and payouts

## 🚀 Running the Application

### Development Mode

**Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Frontend:**
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

### Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📚 API Documentation

Once the server is running, access the Swagger API documentation at:

```
http://localhost:5000/api-docs
```

## 🧪 Testing

### Backend Tests

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Frontend Tests

```bash
cd client

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📁 Project Structure

```
FeroCraftsHRMS/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── app/           # Redux store configuration
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Redux slices and services
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── __tests__/     # Frontend tests
│   └── ...
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic services
│   │   ├── utils/         # Utility functions
│   │   ├── validators/    # Joi validation schemas
│   │   └── __tests__/     # Backend tests
│   ├── uploads/           # Uploaded files (selfies, documents)
│   ├── pdfs/              # Generated payout slips
│   ├── logs/              # Application logs
│   └── ...
└── README.md
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication with refresh token rotation
- HttpOnly cookies for token storage
- Input validation with Joi
- Rate limiting on API endpoints
- Helmet for security headers
- CORS configuration
- XSS protection
- NoSQL injection prevention (sanitization)
- File upload validation

## 👥 User Roles

### Employee
- Check-in/check-out with selfie and location
- View own attendance history
- View payout history
- Download payslips

### Manager
- All employee permissions
- View and manage all employees
- Approve/reject attendance
- View attendance reports
- Manage sites
- Generate payouts

### Admin
- All manager permissions
- Full system access
- User management
- System configuration

## 🔄 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token

### Employees
- `GET /api/v1/employees` - Get all employees
- `POST /api/v1/employees` - Create employee profile
- `GET /api/v1/employees/:id` - Get employee by ID
- `PUT /api/v1/employees/:id` - Update employee
- `DELETE /api/v1/employees/:id` - Delete employee

### Attendance
- `POST /api/v1/attendance/check-in` - Check in
- `POST /api/v1/attendance/check-out` - Check out
- `GET /api/v1/attendance/pending` - Get pending attendance (Manager)
- `PUT /api/v1/attendance/:id/approve` - Approve attendance
- `PUT /api/v1/attendance/:id/reject` - Reject attendance
- `GET /api/v1/attendance/history` - Get attendance history

### Sites
- `GET /api/v1/sites` - Get all sites
- `POST /api/v1/sites` - Create site
- `PUT /api/v1/sites/:id` - Update site
- `DELETE /api/v1/sites/:id` - Delete site
- `POST /api/v1/sites/:id/assign` - Assign employee to site

### Payouts
- `POST /api/v1/payouts/generate` - Generate payouts
- `GET /api/v1/payouts/history` - Get payout history
- `GET /api/v1/payouts/:id/slip` - Get payout slip PDF

### Health
- `GET /health` - Health check endpoint

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env` file
- Verify MongoDB version compatibility

### Port Already in Use
- Change `PORT` in `.env` file
- Kill process using the port: `lsof -ti:5000 | xargs kill -9`

### File Upload Issues
- Check `uploads/` directory permissions
- Verify file size limits in `upload.js` middleware

### CORS Errors
- Update `CLIENT_URL` in server `.env`
- Check CORS configuration in `server/src/index.js`

## 📝 Environment Variables

See `.env.example` files in both `client` and `server` directories for all available environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

FeroCrafts Team

## 🙏 Acknowledgments

- Express.js community
- React community
- MongoDB team
- All open-source contributors

## 📞 Support

For support, email support@ferocrafts.com or create an issue in the repository.

---

**Note:** This is a production-ready HRMS system with comprehensive security features. Always use strong passwords and keep your environment variables secure.

