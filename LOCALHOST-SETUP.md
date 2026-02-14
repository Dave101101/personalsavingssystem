# First Groups Accounting - Localhost Setup Guide with MySQL

This guide will help you set up and run the First Groups Accounting application on your local machine with MySQL database.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MySQL Server** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
3. **PHP** (v7.4 or higher) - [Download](https://www.php.net/downloads)
4. **XAMPP** or **WAMP** (Recommended for easy PHP + MySQL setup) - [XAMPP Download](https://www.apachefriends.org/)

## Step 1: Install and Configure XAMPP/WAMP (Easiest Method)

### Option A: Using XAMPP (Recommended)

1. **Download and Install XAMPP**
   - Download from: https://www.apachefriends.org/
   - Install to: `C:\xampp` (Windows) or `/Applications/XAMPP` (Mac)

2. **Start XAMPP Services**
   - Open XAMPP Control Panel
   - Click "Start" for **Apache** (for PHP)
   - Click "Start" for **MySQL** (for database)

### Option B: Using Standalone MySQL

If you prefer standalone MySQL:

```bash
# Windows - Start MySQL Service
net start MySQL80

# Mac - Start MySQL
brew services start mysql

# Linux
sudo service mysql start
```

## Step 2: Set Up the MySQL Database

### Using phpMyAdmin (Easy Way)

1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click on "Import" tab
3. Click "Choose File" and select `php-backend/database.sql` from this project
4. Click "Go" to import the database
5. The database `first_groups_accounting` will be created automatically

### Using MySQL Command Line (Alternative)

```bash
# Login to MySQL
mysql -u root -p

# Create the database (if needed)
CREATE DATABASE first_groups_accounting;

# Exit MySQL
exit;

# Import the database schema
mysql -u root -p first_groups_accounting < php-backend/database.sql
```

## Step 3: Configure the PHP Backend

1. **Copy Backend Files to Web Server Directory**

   For XAMPP:
   ```bash
   # Windows
   Copy the entire project folder to: C:\xampp\htdocs\first-groups-accounting

   # Mac
   Copy to: /Applications/XAMPP/htdocs/first-groups-accounting
   ```

2. **Update Database Configuration**

   Open `php-backend/config.php` and update:

   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');              // Default MySQL username
   define('DB_PASS', '');                  // Default is empty for XAMPP
   define('DB_NAME', 'first_groups_accounting');
   ```

   **Note:** If you set a MySQL root password, update `DB_PASS` accordingly.

3. **Update CORS Configuration**

   In `php-backend/config.php`, ensure the CORS origin matches your frontend:

   ```php
   header('Access-Control-Allow-Origin: http://localhost:5173');
   ```

4. **Test Backend API**

   Open your browser and visit:
   ```
   http://localhost/first-groups-accounting/php-backend/api/user.php
   ```

   You should see a JSON response like:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "name": "Ibukun Diamond Great Tola",
       "email": "ibukun@firstgroups.com",
       ...
     }
   }
   ```

## Step 4: Set Up the React Frontend

1. **Install Dependencies**

   Open terminal in the project root directory:

   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Update API Configuration**

   Open `src/services/api.ts` and update the API base URL:

   ```typescript
   const API_BASE_URL = 'http://localhost/first-groups-accounting/php-backend/api';
   ```

   **Important:** Make sure this matches where you placed the PHP backend files.

3. **Start the Development Server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open the Application**

   Your browser should automatically open to:
   ```
   http://localhost:5173
   ```

## Step 5: Verify Everything Works

### Test Checklist:

1. ✅ **Dashboard loads** with user name "Ibukun Diamond Great Tola"
2. ✅ **Balance displays** correctly from database
3. ✅ **Add savings** - Try adding money to see if it updates in the database
4. ✅ **Update profile** - Go to Settings and update your name/email
5. ✅ **Check phpMyAdmin** - Verify data is being saved in the database tables

### Check Database Changes:

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select database: `first_groups_accounting`
3. View tables: `users`, `accounts`, `transactions`, etc.
4. You should see your changes reflected in the database

## Common Issues and Solutions

### Issue 1: "Database connection failed"

**Solution:**
- Make sure MySQL is running in XAMPP Control Panel
- Verify database credentials in `php-backend/config.php`
- Check if database `first_groups_accounting` exists in phpMyAdmin

### Issue 2: CORS Error in Browser Console

**Solution:**
- Update CORS origin in `php-backend/config.php`:
  ```php
  header('Access-Control-Allow-Origin: http://localhost:5173');
  ```
- Make sure the port matches your React dev server

### Issue 3: 404 Error for API Endpoints

**Solution:**
- Verify Apache is running in XAMPP
- Check that files are in correct location: `C:\xampp\htdocs\first-groups-accounting\php-backend\api\`
- Test URL in browser: `http://localhost/first-groups-accounting/php-backend/api/user.php`

### Issue 4: PHP Errors

**Solution:**
- Make sure PHP extensions are enabled in `php.ini`:
  - `extension=mysqli`
  - `extension=json`
- Restart Apache in XAMPP after changing `php.ini`

### Issue 5: Port 80 Already in Use

**Solution:**
- Change Apache port in XAMPP:
  1. Click "Config" button next to Apache
  2. Select "httpd.conf"
  3. Find `Listen 80` and change to `Listen 8080`
  4. Find `ServerName localhost:80` and change to `ServerName localhost:8080`
  5. Restart Apache
  6. Update API URL to: `http://localhost:8080/...`

## Development Workflow

### Making Changes to the Frontend:
- Edit files in `/src/app/components/`
- Changes will hot-reload automatically
- Check browser console for any errors

### Making Changes to the Backend:
- Edit files in `/php-backend/api/`
- No restart needed - PHP files are executed on each request
- Check Network tab in browser DevTools to see API responses

### Viewing Database:
- phpMyAdmin: `http://localhost/phpmyadmin`
- View tables and data in real-time
- Use SQL tab to run custom queries

## Default Credentials

**Database:**
- Host: `localhost`
- Username: `root`
- Password: `` (empty for XAMPP default)
- Database: `first_groups_accounting`

**Application User:**
- Name: Ibukun Diamond Great Tola
- Email: ibukun@firstgroups.com
- User ID: 1

## Next Steps

1. **Add More Data:**
   - Create savings plans
   - Join investment circles
   - Add transactions
   - All data will be saved to MySQL

2. **Customize:**
   - Update user profile in Settings
   - Modify color schemes in theme files
   - Add your own features

3. **Backup Database:**
   ```bash
   # Export database
   mysqldump -u root -p first_groups_accounting > backup.sql
   
   # Import backup
   mysql -u root -p first_groups_accounting < backup.sql
   ```

## Production Deployment

When ready to deploy to production:

1. **Update API URL** in `src/services/api.ts`
2. **Secure Database** - Create a separate MySQL user with limited permissions
3. **Add Authentication** - Implement JWT or session-based auth
4. **Enable HTTPS** - Use SSL certificates
5. **Build Frontend:**
   ```bash
   npm run build
   ```

## Support

For issues or questions:
- Check the browser console for errors
- Check Apache error logs in `C:\xampp\apache\logs\error.log`
- Check MySQL error logs in `C:\xampp\mysql\data\*.err`

---

**Congratulations!** Your First Groups Accounting application is now running locally with MySQL! 🎉
