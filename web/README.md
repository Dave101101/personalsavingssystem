# First Groups Accounting - Web Version

Luxury-grade personal savings platform built with HTML, CSS, JavaScript, and PHP.

## 🚀 Quick Start

### Requirements
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- Modern web browser

### Installation

1. **Upload Files**
   - Upload all files from the `/web` folder to your web server root (e.g., `/var/www/html/` or `/public_html/`)
   - Upload the `/php-backend` folder to your server

2. **Database Setup**
   ```bash
   # Import the database schema
   mysql -u root -p < ../php-backend/database.sql
   ```

3. **Configure Database**
   Edit `/web/config/session.php` and update:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'your_database_username');
   define('DB_PASS', 'your_database_password');
   define('DB_NAME', 'first_groups_accounting');
   ```

4. **Configure API Base URL**
   Edit `/web/assets/js/api.js` line 2:
   ```javascript
   const API_BASE_URL = '/php-backend/api';
   ```
   Update this to match your backend API location.

5. **Set Permissions**
   ```bash
   chmod 755 web/
   chmod 644 web/*.php
   chmod 644 web/config/*.php
   chmod 644 web/assets/css/*.css
   chmod 644 web/assets/js/*.js
   ```

6. **Access Your App**
   Open your browser and navigate to:
   ```
   http://your-domain.com/index.php
   ```

## 📂 File Structure

```
/web/
├── index.php              # Landing page
├── dashboard.php          # Main dashboard
├── plans.php             # Savings plans
├── investments.php       # Investment portfolio
├── circles.php           # Investment circles
├── bills.php             # Bill management
├── settings.php          # User settings
├── config/
│   └── session.php       # Database config & session
├── includes/
│   ├── header.php        # HTML head
│   ├── sidebar.php       # Navigation sidebar
│   ├── topnav.php        # Top navigation bar
│   └── footer.php        # Footer & scripts
└── assets/
    ├── css/
    │   └── style.css     # Main stylesheet
    └── js/
        ├── api.js        # API functions
        └── main.js       # Core JavaScript
```

## 🎨 Features

### ✅ Implemented
- **Dashboard** - Balance overview, recent transactions, quick actions
- **Savings Plans** - Create, deposit, withdraw from savings goals
- **Investment Portfolio** - Track investments and returns
- **Investment Circles** - Join/create collaborative savings groups
- **Bill Management** - Add, track, and pay bills
- **Settings** - Profile editing, preferences, toggles
- **Real-time Balance Updates** - Automatic refresh across pages
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🎯 Key Capabilities
- Create multiple savings plans with progress tracking
- Deposit/withdraw between main and stash accounts
- Join public circles or create private investment groups
- Contribute to circles and track collective progress
- Add recurring and one-time bills
- Pay bills directly from main balance
- Track investment returns and liquidate when needed
- Toggle settings with instant API sync

## 🔧 Configuration

### API Endpoints
All API calls go through `/assets/js/api.js`. The base URL is configured at the top of this file.

### Session Management
User sessions are managed in `/config/session.php`. Currently set to use user ID 1 (Ibukun Diamond Great Tola) by default.

For production, implement proper authentication:
```php
// In login.php (create this file)
$_SESSION['user_id'] = $authenticatedUserId;
```

### Database Connection
The app uses the same MySQL database as the PHP backend. Ensure both are configured with the same credentials.

## 📱 Pages

### 1. **index.php** - Landing Page
Beautiful gradient landing page with features showcase

### 2. **dashboard.php** - Main Dashboard
- Balance cards (Main & Stash)
- Add money / Send money modals
- Top up / Withdraw from Stash
- Recent transactions list
- Quick stats cards

### 3. **plans.php** - Savings Plans
- View all savings plans
- Create new plans with target amounts
- Deposit to plans from main balance
- Progress tracking with visual indicators
- Filter by status (active, completed, paused)

### 4. **investments.php** - Investment Portfolio
- Portfolio summary (total invested, current value, returns)
- Add new investments
- Track investment performance
- Liquidate investments
- Automatic return percentage calculations

### 5. **circles.php** - Investment Circles
- Browse public circles
- Filter: All, My Circles, Public
- Create new circles (public or private)
- Join existing circles
- Contribute to circles
- Track collective goals

### 6. **bills.php** - Bill Management
- Add one-time or recurring bills
- Filter: All, Pending, Paid
- Pay bills directly
- Track due dates
- Automatic recurring bill creation

### 7. **settings.php** - User Settings
- Edit profile (name, email, phone)
- Toggle notifications
- Toggle push notifications
- Toggle biometric auth
- Toggle auto-save
- Settings sync with database

## 🎨 Design System

### Colors
- Primary: `#6366F1` (Indigo)
- Success: `#10B981` (Green)
- Danger: `#EF4444` (Red)
- Warning: `#F59E0B` (Amber)
- Background: `#F8F9FB` (Light Gray)
- Card: `#FFFFFF` (White)

### Typography
- Font: System font stack (San Francisco, Segoe UI, Roboto)
- Headings: 700 weight, tight tracking
- Body: 500 weight, relaxed line height

### Components
- Cards with subtle shadows and rounded corners
- Gradient balance cards with glassmorphism
- Smooth animations and transitions
- Toast notifications for user feedback
- Modal dialogs for forms
- Progress bars for goals
- Badge system for statuses

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Implement Authentication**
   - Create login/register pages
   - Use password hashing (`password_hash()`)
   - Implement JWT or session-based auth

2. **Validate All Inputs**
   - Server-side validation in PHP
   - Sanitize user inputs
   - Use prepared statements (already implemented)

3. **HTTPS Required**
   - Use SSL/TLS certificates
   - Force HTTPS redirects

4. **CORS Configuration**
   - Update CORS headers in backend API
   - Restrict to your domain only

5. **Environment Variables**
   - Move sensitive config to `.env` file
   - Don't commit credentials to version control

## 🐛 Troubleshooting

### Balance Not Updating
- Check browser console for API errors
- Verify backend API is accessible
- Check database connection in `config/session.php`

### Modals Not Opening
- Ensure JavaScript files are loaded
- Check browser console for errors
- Verify Lucide icons CDN is accessible

### Styles Not Applied
- Clear browser cache
- Check `style.css` path in headers
- Verify file permissions

### Database Errors
- Check MySQL is running
- Verify database credentials
- Ensure database and tables exist
- Check PHP error logs

## 📊 Default User

- **Name:** Ibukun Diamond Great Tola
- **Email:** ibukun@firstgroups.com
- **Starting Balance:** ₦0.00 (Main & Stash)

## 🔄 API Integration

All pages use the centralized API functions in `/assets/js/api.js`:

```javascript
// Example: Add money to main account
const response = await api.updateBalance('main', 5000, 'add', 'Income', 'Salary');

// Example: Create savings plan
const response = await api.createSavingsPlan({
    plan_name: 'Emergency Fund',
    target_amount: 100000,
    frequency: 'monthly',
    start_date: '2024-01-01',
    end_date: '2024-12-31'
});

// Example: Pay a bill
const response = await api.payBill(billId);
```

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify database connection
3. Review PHP error logs
4. Check backend API responses

---

**Built for Ibukun Diamond Great Tola**  
First Groups Accounting © 2026

**Note:** This is a complete web application ready for deployment. Remember to implement proper authentication and security measures before going live!
