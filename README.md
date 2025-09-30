# TopUp Station BD - Free Fire Diamond Top-Up Platform

A complete web application for selling Free Fire diamonds in Bangladesh with bKash/Nagad payment integration.

## Features

### User Features
- User registration and authentication
- Dashboard with order history
- Multiple diamond packages
- Wallet system for deposits
- bKash and Nagad payment integration
- Real-time order tracking
- Transaction history

### Admin Features
- Admin dashboard with statistics
- User management
- Order management (approve/reject)
- Deposit management
- Package management
- Revenue tracking

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- HTML5
- CSS3 (Custom styling with animations)
- Vanilla JavaScript
- Font Awesome icons
- Responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd TOPUP-STATION_BD
```

2. Install backend dependencies
```bash
npm install
```

3. Create `.env` file in the root directory
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topup-station
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start MongoDB (if using local installation)
```bash
mongod
```

5. Start the backend server
```bash
npm start
```

6. Open the frontend
- Simply open `frontend/index.html` in your browser
- Or use a local server like Live Server in VS Code

## Project Structure

```
TOPUP-STATION_BD/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── topupController.js # Top-up operations
│   │   ├── walletController.js# Wallet operations
│   │   └── adminController.js # Admin operations
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Package.js         # Package schema
│   │   ├── TopUp.js           # Order schema
│   │   └── Deposit.js         # Deposit schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── topup.js           # Top-up routes
│   │   ├── wallet.js          # Wallet routes
│   │   └── admin.js           # Admin routes
│   └── server.js              # Main server file
├── frontend/
│   ├── css/
│   │   ├── style.css          # Main styles
│   │   ├── dashboard.css      # Dashboard styles
│   │   └── admin.css          # Admin styles
│   ├── js/
│   │   ├── main.js            # Main JavaScript
│   │   ├── auth.js            # Authentication
│   │   ├── dashboard.js       # Dashboard logic
│   │   ├── topup.js           # Top-up logic
│   │   ├── wallet.js          # Wallet logic
│   │   └── admin.js           # Admin logic
│   ├── pages/
│   │   ├── login.html         # Login page
│   │   ├── register.html      # Registration page
│   │   ├── dashboard.html     # User dashboard
│   │   ├── topup.html         # Top-up page
│   │   ├── wallet.html        # Wallet page
│   │   ├── transactions.html  # Transaction history
│   │   └── admin.html         # Admin panel
│   └── index.html             # Homepage
├── uploads/                   # User uploads directory
├── .env                       # Environment variables
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
└── README.md                 # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Top-Up
- `GET /api/topup/packages` - Get all packages
- `POST /api/topup/purchase` - Purchase diamonds
- `GET /api/topup/history` - Get user's order history

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/deposit` - Create deposit request
- `GET /api/wallet/history` - Get deposit history

### Admin (Protected)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/deposits` - Get all deposits
- `PUT /api/admin/deposits/:id` - Update deposit status

## Default Admin Account

After setting up, you need to manually create an admin account in MongoDB:

```javascript
{
  username: "admin",
  email: "admin@topupstation.bd",
  password: "$2a$10$hashedpassword", // Use bcrypt to hash "admin123"
  role: "admin",
  wallet: { balance: 0 }
}
```

Or modify the registration to set role as "admin" for the first user.

## Usage

### For Users
1. Register an account
2. Add funds to wallet using bKash/Nagad
3. Wait for admin approval of deposit
4. Purchase diamond packages
5. Enter Free Fire UID
6. Receive diamonds instantly after admin approval

### For Admins
1. Login with admin credentials
2. Approve/reject deposit requests
3. Manage user orders
4. View statistics and reports
5. Manage users and packages

## Payment Integration

Currently supports manual payment verification for:
- bKash
- Nagad

Admin manually verifies transaction IDs and approves deposits.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Input validation
- XSS protection
- CORS configuration

## Future Enhancements

- [ ] Automated payment gateway integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Referral system
- [ ] Discount codes
- [ ] Multiple game support
- [ ] Mobile app version
- [ ] Payment webhooks
- [ ] Advanced analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@topupstation.bd or create an issue in the repository.

## Disclaimer

This is a demo project. Ensure you have proper licenses and comply with all legal requirements before using in production.

## Author

TopUp Station BD Team

---

**Note**: Make sure to update all placeholder values (API URLs, payment numbers, etc.) before deploying to production.