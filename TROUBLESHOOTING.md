# Troubleshooting Guide

## Quick Diagnostics

### 1. Backend Test Tool
**First, always run this:**
```
http://localhost/first-groups-accounting/backend-test.html
```
This will show you exactly what's working and what's not.

---

## Common Error Messages & Solutions

### Error: "Access to fetch at '...' has been blocked by CORS policy"

**What it means:** Frontend can't talk to backend due to security policy.

**Solution:**
1. Open `php-backend/config.php`
2. Find this line:
   ```php
   header('Access-Control-Allow-Origin: http://localhost:5173');
   ```
3. Make sure the port (5173) matches your React dev server
4. Save and refresh your browser

**Check if React is on different port:**
```bash
# Look at terminal where you ran "npm run dev"
# It should say: Local: http://localhost:5173
```

---

### Error: "Database connection failed"

**What it means:** Can't connect to MySQL database.

**Solutions:**

**Option 1: Check MySQL is running**
- Open XAMPP Control Panel
- MySQL should show green "Running"
- If not, click "Start" next to MySQL

**Option 2: Check credentials**
```php
// In php-backend/config.php
define('DB_HOST', 'localhost');    // ✅ Should be 'localhost'
define('DB_USER', 'root');         // ✅ Default XAMPP username
define('DB_PASS', '');             // ✅ Empty for default XAMPP
define('DB_NAME', 'first_groups_accounting'); // ✅ Exact database name
```

**Option 3: Verify database exists**
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Look in left sidebar for `first_groups_accounting`
3. If missing, import `php-backend/database.sql`

**Option 4: Test MySQL connection**
```sql
-- In phpMyAdmin, click SQL tab and run:
SHOW DATABASES;
-- Should show 'first_groups_accounting'
```

---

### Error: "404 Not Found" when accessing API

**What it means:** Apache can't find your PHP files.

**Solutions:**

**Option 1: Check project location**
```
✅ Should be: C:\xampp\htdocs\first-groups-accounting\
❌ NOT: C:\Users\YourName\Documents\first-groups-accounting\
```

**Option 2: Verify folder structure**
```
C:\xampp\htdocs\first-groups-accounting\
  ├── php-backend\
  │   ├── api\
  │   │   ├── user.php      ← Must exist
  │   │   ├── accounts.php  ← Must exist
  │   │   └── test.php      ← Must exist
  │   └── config.php        ← Must exist
  └── ...
```

**Option 3: Test Apache**
```
http://localhost/
```
Should show XAMPP dashboard. If not:
- Open XAMPP Control Panel
- Start Apache
- Check for port conflicts

**Option 4: Check URL format**
```
✅ Correct: http://localhost/first-groups-accounting/php-backend/api/user.php
❌ Wrong:   http://localhost/user.php
❌ Wrong:   http://localhost:5173/api/user.php
```

---

### Error: "Cannot read property 'data' of undefined"

**What it means:** API returned unexpected data format.

**Solutions:**

**Option 1: Check API response**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click the failed request
4. Look at Response tab
5. Should see JSON with `success` field

**Option 2: Verify API endpoint**
```javascript
// In browser console:
fetch('http://localhost/first-groups-accounting/php-backend/api/user.php')
  .then(r => r.json())
  .then(d => console.log(d));
```
Should log: `{success: true, data: {...}}`

---

### Error: "Port 80 is already in use"

**What it means:** Another program is using Apache's port.

**Solutions:**

**Option 1: Stop conflicting programs**
- Close Skype (uses port 80)
- Stop IIS (Windows Internet Information Services)
- Close other web servers

**Option 2: Change Apache port**
1. XAMPP Control Panel → Config (next to Apache) → httpd.conf
2. Find: `Listen 80`
3. Change to: `Listen 8080`
4. Find: `ServerName localhost:80`
5. Change to: `ServerName localhost:8080`
6. Save and restart Apache
7. Update all URLs to: `http://localhost:8080/...`

---

### Error: "MySQL shutdown unexpectedly"

**What it means:** MySQL crashed or didn't start properly.

**Solutions:**

**Option 1: Check for existing MySQL**
```bash
# Windows - Check running MySQL
tasklist | findstr mysql

# If found, kill it:
taskkill /F /IM mysqld.exe
```

**Option 2: Repair MySQL**
1. XAMPP Control Panel
2. Click "Config" next to MySQL
3. Select "my.ini"
4. Find: `#innodb_force_recovery = 1`
5. Remove `#` to uncomment
6. Save and restart MySQL
7. After successful start, comment it again

**Option 3: Check port 3306**
```bash
# Windows
netstat -ano | findstr :3306

# If port is used by another program:
# Find the PID and kill it in Task Manager
```

---

### Error: "Failed to fetch" in console

**What it means:** Network request failed entirely.

**Solutions:**

**Check 1: Backend URL**
```typescript
// In src/services/api.ts
const API_BASE_URL = 'http://localhost/first-groups-accounting/php-backend/api';
//                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                    This must match your actual folder location!
```

**Check 2: Apache is running**
- XAMPP Control Panel → Apache should be green

**Check 3: Test in browser**
```
http://localhost/first-groups-accounting/php-backend/api/test.php
```
Should show JSON, not error page.

**Check 4: Check .htaccess**
Make sure no `.htaccess` file is blocking access.

---

### Error: "Undefined index" or "Undefined variable" in PHP

**What it means:** PHP code trying to access missing data.

**Solutions:**

**Check request data:**
```php
// Add to top of API file for debugging:
error_log(print_r($_POST, true));
error_log(print_r(file_get_contents('php://input'), true));
```

**Check Apache error log:**
```
Windows: C:\xampp\apache\logs\error.log
Mac: /Applications/XAMPP/logs/error_log
```

---

### Error: White screen / Blank page

**What it means:** JavaScript error preventing render.

**Solutions:**

**Step 1: Open browser console (F12)**
- Look for red error messages
- Fix the first error shown

**Step 2: Check React app is running**
```bash
# Terminal should show:
➜  Local:   http://localhost:5173/
```

**Step 3: Check imports**
```typescript
// Make sure all imports exist:
import { useApp } from '../context/AppContext'; // ✅ Path correct?
```

**Step 4: Clear cache**
- Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or manually clear browser cache

---

### Error: "Cannot find module '@/services/api'"

**What it means:** Import path not resolved.

**Solution:**

Check `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

### Error: Balance doesn't update in database

**What it means:** API call succeeds but database not updating.

**Solutions:**

**Check 1: Verify SQL query**
```sql
-- In phpMyAdmin, manually update:
UPDATE accounts 
SET balance = balance + 1000 
WHERE user_id = 1 AND account_type = 'main';

-- If this fails, check table structure
```

**Check 2: Check PHP error log**
```
C:\xampp\apache\logs\error.log
```
Look for SQL errors.

**Check 3: Test API directly**
```javascript
// In browser console:
fetch('http://localhost/first-groups-accounting/php-backend/api/accounts.php', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    account_type: 'main',
    amount: 1000,
    operation: 'add',
    category: 'Test',
    description: 'Test deposit'
  })
})
.then(r => r.json())
.then(d => console.log(d));
```

**Check 4: Verify user_id**
```php
// In php-backend/config.php
function getCurrentUserId() {
    return 1; // ✅ Should return 1
}
```

---

### Error: Profile update doesn't work

**What it means:** User update API failing.

**Solutions:**

**Test API:**
```javascript
fetch('http://localhost/first-groups-accounting/php-backend/api/user.php', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Name',
    email: 'test@example.com'
  })
})
.then(r => r.json())
.then(d => console.log(d));
```

**Check response:**
- Should be: `{success: true, message: 'Profile updated successfully'}`
- If error, check error message

**Verify in database:**
```sql
-- In phpMyAdmin:
SELECT * FROM users WHERE id = 1;
-- Check if name/email changed
```

---

## Advanced Troubleshooting

### Enable PHP Error Display

Edit `php-backend/config.php`, add at top:
```php
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
```

### Check MySQL Connection Directly

Create `test-db.php` in `php-backend/`:
```php
<?php
$conn = new mysqli('localhost', 'root', '', 'first_groups_accounting');
if ($conn->connect_error) {
    die("Failed: " . $conn->connect_error);
}
echo "Connected successfully!";
$conn->close();
?>
```
Visit: `http://localhost/first-groups-accounting/php-backend/test-db.php`

### Debug API Calls

In browser DevTools:
1. Network tab
2. Click failed request
3. Check:
   - **Headers** → Request URL correct?
   - **Payload** → Data sent correctly?
   - **Response** → What error message?
   - **Status** → HTTP code (200=success, 404=not found, 500=server error)

### Check React State

Add to component:
```typescript
console.log('State:', { totalBalance, user, stashBalance });
```

---

## Still Not Working?

### Checklist:
1. ✅ XAMPP Apache and MySQL both green and running
2. ✅ Database imported and visible in phpMyAdmin
3. ✅ backend-test.html shows all tests passing
4. ✅ No CORS errors in console
5. ✅ API URLs return JSON in browser
6. ✅ React dev server running on 5173

### Get Help:
1. Run backend-test.html - screenshot results
2. Check browser console - copy error messages
3. Check Apache error log - copy relevant lines
4. Provide: Operating system, XAMPP version, Node version

---

## Success Indicators

Everything working when:
- ✅ No red errors in browser console
- ✅ backend-test.html all green
- ✅ Can add money → updates in phpMyAdmin
- ✅ Can update profile → changes in database
- ✅ Page refresh keeps data from database
- ✅ Blue and white theme displays
- ✅ "Welcome Group 1" visible in sidebar

**If all above are true: Congratulations! Everything works! 🎉**
