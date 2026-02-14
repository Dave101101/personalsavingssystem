# First Groups Accounting - PHP Backend API

Complete PHP/MySQL backend for the First Groups Accounting fintech platform.

## 🚀 Quick Start

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- phpMyAdmin (optional, for database management)

### Installation Steps

#### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Import the database schema
mysql -u root -p < database.sql
```

Or use phpMyAdmin:
- Open phpMyAdmin
- Click "Import"
- Select `database.sql`
- Click "Go"

#### 2. Configure Database Connection

Edit `config.php` and update these lines with your database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_database_username');
define('DB_PASS', 'your_database_password');
define('DB_NAME', 'first_groups_accounting');
```

#### 3. Configure CORS

In `config.php`, update the CORS origin to match your React frontend URL:

```php
header('Access-Control-Allow-Origin: http://localhost:5173'); // Your frontend URL
```

For production, use your actual domain:
```php
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

#### 4. Deploy to Server

Upload all files to your web server (e.g., `/var/www/html/api/` or `/public_html/api/`):

```
/var/www/html/api/
├── config.php
├── database.sql
└── api/
    ├── accounts.php
    ├── transactions.php
    ├── savings.php
    ├── circles.php
    ├── investments.php
    ├── bills.php
    ├── settings.php
    └── user.php
```

#### 5. Set Permissions

```bash
chmod 755 api/
chmod 644 api/*.php
chmod 644 config.php
```

## 📡 API Endpoints

Base URL: `http://your-domain.com/api/`

### Accounts
- `GET /api/accounts.php` - Get all accounts
- `PUT /api/accounts.php` - Update account balance

### Transactions
- `GET /api/transactions.php` - Get all transactions
- `GET /api/transactions.php?category=Savings` - Filter by category
- `POST /api/transactions.php` - Create transaction
- `DELETE /api/transactions.php?id=123` - Delete transaction

### Savings Plans
- `GET /api/savings.php` - Get all savings plans
- `GET /api/savings.php?status=active` - Filter by status
- `POST /api/savings.php` - Create savings plan
- `PUT /api/savings.php` - Update plan or deposit/withdraw
- `DELETE /api/savings.php?id=123` - Delete plan

### Investment Circles
- `GET /api/circles.php` - Get all circles
- `GET /api/circles.php?id=123` - Get circle details
- `GET /api/circles.php?filter=my-circles` - Get user's circles
- `POST /api/circles.php` - Create circle
- `PUT /api/circles.php` - Update circle, join, or contribute
- `DELETE /api/circles.php?id=123` - Leave/delete circle

### Investments
- `GET /api/investments.php` - Get all investments
- `POST /api/investments.php` - Create investment
- `PUT /api/investments.php` - Update investment
- `DELETE /api/investments.php?id=123` - Liquidate investment

### Bills
- `GET /api/bills.php` - Get all bills
- `GET /api/bills.php?status=pending` - Filter by status
- `POST /api/bills.php` - Create bill
- `PUT /api/bills.php` - Pay bill or update details
- `DELETE /api/bills.php?id=123` - Delete bill

### User Profile
- `GET /api/user.php` - Get user profile
- `PUT /api/user.php` - Update profile

### Settings
- `GET /api/settings.php` - Get user settings
- `PUT /api/settings.php` - Update settings
- `DELETE /api/settings.php` - Reset settings

## 📝 Usage Examples

### JavaScript Fetch Examples

```javascript
// Get all accounts
fetch('http://your-domain.com/api/accounts.php', {
  method: 'GET',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log(data));

// Add money to main account
fetch('http://your-domain.com/api/accounts.php', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    account_type: 'main',
    amount: 5000,
    operation: 'add',
    category: 'Income',
    description: 'Salary deposit'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Create savings plan
fetch('http://your-domain.com/api/savings.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    plan_name: 'Emergency Fund',
    target_amount: 100000,
    frequency: 'monthly',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    description: 'Build emergency savings',
    icon: 'shield',
    color: '#3b82f6',
    auto_save: true
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Deposit to savings plan
fetch('http://your-domain.com/api/savings.php', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    plan_id: 1,
    transaction_type: 'deposit',
    amount: 10000,
    notes: 'Monthly savings'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Join a circle
fetch('http://your-domain.com/api/circles.php', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    circle_id: 5,
    action: 'join'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Pay a bill
fetch('http://your-domain.com/api/bills.php', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    bill_id: 3,
    action: 'pay'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🔐 Authentication (To Implement)

Currently, the backend uses a simple `getCurrentUserId()` function that returns user ID `1`. 

**For production, you should implement:**

1. **JWT Authentication**
```php
// Add JWT library
composer require firebase/php-jwt

// In config.php
function getCurrentUserId() {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    
    // Verify JWT and extract user ID
    // Return actual user ID from token
}
```

2. **Session-based Authentication**
```php
session_start();
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}
```

## 🛡️ Security Best Practices

1. **Environment Variables**: Move sensitive config to `.env` file
2. **Prepared Statements**: Already implemented to prevent SQL injection
3. **Input Validation**: Validate all user inputs
4. **HTTPS**: Use SSL/TLS in production
5. **Rate Limiting**: Implement API rate limiting
6. **Error Logging**: Log errors to file instead of displaying them

## 🔧 Connecting from React Frontend

Update your React app's API base URL:

```typescript
// src/services/api.ts
const API_BASE_URL = 'http://your-domain.com/api';

export async function fetchAccounts() {
  const response = await fetch(`${API_BASE_URL}/accounts.php`, {
    credentials: 'include'
  });
  return response.json();
}

export async function updateBalance(accountType: string, amount: number, operation: string) {
  const response = await fetch(`${API_BASE_URL}/accounts.php`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      account_type: accountType,
      amount,
      operation,
      category: 'General'
    })
  });
  return response.json();
}
```

## 📊 Database Schema

The database includes these tables:
- `users` - User profiles
- `accounts` - Main and Stash accounts
- `transactions` - All financial transactions
- `savings_plans` - Savings goals
- `savings_transactions` - Savings deposits/withdrawals
- `circles` - Investment circles
- `circle_members` - Circle membership
- `investments` - Investment portfolio
- `bills` - Bill payments
- `user_settings` - User preferences
- `notifications` - User notifications

## 🐛 Troubleshooting

### CORS Errors
Make sure the CORS origin in `config.php` matches your frontend URL exactly.

### Database Connection Failed
- Check your database credentials in `config.php`
- Verify MySQL is running: `sudo service mysql status`
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### 404 Errors
- Verify files are in the correct directory
- Check Apache/Nginx configuration
- Enable mod_rewrite for Apache

### Permission Denied
```bash
sudo chown -R www-data:www-data /var/www/html/api
sudo chmod -R 755 /var/www/html/api
```

## 📞 Support

For issues or questions about the backend API, contact your development team.

---

**Default User:**
- Name: Ibukun Diamond Great Tola
- Email: ibukun@firstgroups.com
- Starting Balance: ₦0.00

**Note:** This is a development backend. Implement proper authentication, validation, and security measures before deploying to production!
