# First Groups Accounting - Complete Setup

A luxury-grade personal savings platform with MySQL backend integration, featuring a beautiful blue and white design.

## 🚀 Quick Start (5 Minutes)

### 1. Install XAMPP
- Download: https://www.apachefriends.org/
- Install and start **Apache** and **MySQL** services

### 2. Set Up Database
```bash
# Open phpMyAdmin
http://localhost/phpmyadmin

# Import database
- Click "Import"
- Select: php-backend/database.sql
- Click "Go"
```

### 3. Configure Backend
Copy this project to XAMPP:
```
C:\xampp\htdocs\first-groups-accounting\
```

Edit `php-backend/config.php`:
```php
define('DB_USER', 'root');
define('DB_PASS', '');  // Leave empty for XAMPP default
```

### 4. Test Backend
Open in browser:
```
http://localhost/first-groups-accounting/backend-test.html
```

All tests should show ✅ green status.

### 5. Run React Frontend
```bash
npm install
npm run dev
```

Open: http://localhost:5173

## 📁 Project Structure

```
first-groups-accounting/
├── src/                          # React frontend
│   ├── app/
│   │   ├── components/          # UI components
│   │   │   ├── Dashboard.tsx    # Main dashboard (blue/white theme)
│   │   │   ├── Sidebar.tsx      # Navigation (Welcome Group 1)
│   │   │   ├── TopNav.tsx       # Top navigation bar
│   │   │   └── ...
│   │   └── context/
│   │       └── AppContext.tsx   # State management with API
│   ├── services/
│   │   └── api.ts               # Backend API integration
│   └── styles/
│       └── theme.css            # Blue and white color theme
│
├── php-backend/                  # PHP MySQL backend
│   ├── api/                     # REST API endpoints
│   │   ├── user.php            # User profile (UPDATE PROFILE WORKS!)
│   │   ├── accounts.php        # Account balances
│   │   ├── transactions.php    # Transactions
│   │   ├── savings.php         # Savings plans
│   │   ├── circles.php         # Investment circles
│   │   └── test.php            # Connection test
│   ├── config.php              # Database configuration
│   └── database.sql            # Database schema
│
├── backend-test.html            # Backend testing tool
├── LOCALHOST-SETUP.md          # Detailed setup guide
└── README.md                    # This file
```

## ✨ Key Features

### What's Implemented:

✅ **Blue and White Theme** - Complete color overhaul from dark luxury to blue/white
✅ **"Welcome Group 1"** - Changed from "Overview" in sidebar
✅ **Profile Update** - Full working profile editor in Settings page
✅ **MySQL Integration** - All data saved to database
✅ **Real-time Sync** - Frontend ↔️ Backend communication
✅ **Account Management** - Main balance and Stash accounts
✅ **Savings Plans** - Create and track savings goals
✅ **Investment Circles** - Join and create investment groups
✅ **Transaction History** - View all financial transactions
✅ **Settings Sync** - Notifications preferences saved to DB

### How to Use Profile Update:

1. Click **Settings** in sidebar
2. Click **Edit Profile** button
3. Update your **Name** and **Email**
4. Click **Save Changes**
5. ✅ Data is saved to MySQL database!
6. Verify in phpMyAdmin → `users` table

## 🎨 Design Features

- **Color Scheme**: Blue (#3B82F6) and White
- **Glass Effects**: Frosted blue-tinted glassmorphism
- **Animations**: Smooth transitions and hover effects
- **Typography**: Clean, modern sans-serif fonts
- **Icons**: Lucide React icon library
- **Responsive**: Works on all screen sizes

## 🔧 Configuration

### Update API URL
If your XAMPP installation is different, update `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost/your-folder/php-backend/api';
```

### Change Database Credentials
Edit `php-backend/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'first_groups_accounting');
```

## 🧪 Testing

### Test Backend Connection:
```
http://localhost/first-groups-accounting/backend-test.html
```

### Test API Endpoints:
```
http://localhost/first-groups-accounting/php-backend/api/user.php
http://localhost/first-groups-accounting/php-backend/api/accounts.php
```

### Check Database:
```
http://localhost/phpmyadmin
→ Database: first_groups_accounting
→ View tables: users, accounts, transactions, etc.
```

## 📊 Database Tables

- **users** - User profiles (name, email, etc.)
- **accounts** - Main and Stash balances
- **transactions** - All financial transactions
- **savings_plans** - Savings goals and progress
- **circles** - Investment circles
- **circle_members** - Circle membership
- **investments** - Investment portfolio
- **bills** - Bill payments
- **user_settings** - App preferences
- **notifications** - User notifications

## 🐛 Troubleshooting

### CORS Error?
Update `php-backend/config.php`:
```php
header('Access-Control-Allow-Origin: http://localhost:5173');
```

### Database Connection Failed?
- ✅ Check MySQL is running in XAMPP
- ✅ Verify credentials in config.php
- ✅ Ensure database exists in phpMyAdmin

### 404 Errors?
- ✅ Verify files are in htdocs folder
- ✅ Check Apache is running
- ✅ Test URL in browser directly

### Can't Update Profile?
- ✅ Check Network tab in browser DevTools
- ✅ Verify API URL in src/services/api.ts
- ✅ Check php-backend/api/user.php exists

## 🎯 What's Next?

1. **Add Authentication** - Implement login system
2. **Add More Features** - Bill payments, investments, etc.
3. **Deploy to Production** - Host on real server
4. **Mobile App** - Convert to React Native

## 📝 Default Data

**User:**
- Name: Ibukun Diamond Great Tola
- Email: ibukun@firstgroups.com
- ID: 1

**Accounts:**
- Main Balance: ₦0.00
- Stash Balance: ₦0.00

## 🔐 Security Note

⚠️ **This is a development setup!**

For production:
- Implement proper authentication (JWT/OAuth)
- Use environment variables for secrets
- Enable HTTPS/SSL
- Add input validation
- Implement rate limiting
- Use prepared statements (already done!)

## 📞 Support

Need help?
1. Check `/LOCALHOST-SETUP.md` for detailed guide
2. Use `backend-test.html` to diagnose issues
3. Check browser console for errors
4. Check Apache logs: `C:\xampp\apache\logs\error.log`

## 🎉 Success!

If you can see:
- ✅ Blue and white interface
- ✅ "Welcome Group 1" in sidebar
- ✅ Your name in the dashboard
- ✅ Working profile update

**Congratulations! Everything is working! 🚀**

---

**Built with:** React + TypeScript + Tailwind CSS + PHP + MySQL
**For:** Ibukun Diamond Great Tola
**Purpose:** Student financial discipline platform
