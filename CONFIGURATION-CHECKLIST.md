# Configuration Checklist

## ✅ Complete Setup Verification

### Step 1: XAMPP Installation
- [ ] XAMPP installed (Windows: `C:\xampp`, Mac: `/Applications/XAMPP`)
- [ ] Apache service started (green in XAMPP Control Panel)
- [ ] MySQL service started (green in XAMPP Control Panel)
- [ ] phpMyAdmin accessible at `http://localhost/phpmyadmin`

### Step 2: Project Location
- [ ] Project copied to: `C:\xampp\htdocs\first-groups-accounting\`
- [ ] Folder structure intact with:
  - [ ] `php-backend/` folder exists
  - [ ] `php-backend/api/` folder exists
  - [ ] `src/` folder exists

### Step 3: Database Setup
- [ ] Opened phpMyAdmin: `http://localhost/phpmyadmin`
- [ ] Imported `php-backend/database.sql` successfully
- [ ] Database `first_groups_accounting` visible in left panel
- [ ] Tables created (users, accounts, transactions, etc.)
- [ ] Default user inserted (Ibukun Diamond Great Tola)

### Step 4: Backend Configuration
Edit `php-backend/config.php`:
```php
✅ Check these values:
define('DB_HOST', 'localhost');           // Should be 'localhost'
define('DB_USER', 'root');                // Default XAMPP username
define('DB_PASS', '');                    // Empty for default XAMPP
define('DB_NAME', 'first_groups_accounting');

✅ CORS Configuration:
header('Access-Control-Allow-Origin: http://localhost:5173');
```

- [ ] Database credentials updated
- [ ] CORS origin set to `http://localhost:5173`

### Step 5: Backend Testing

Test these URLs in your browser:

**Test 1: Basic Connection**
- [ ] Open: `http://localhost/first-groups-accounting/backend-test.html`
- [ ] All 4 tests show green ✅ status

**Test 2: API Endpoints**
- [ ] `http://localhost/first-groups-accounting/php-backend/api/test.php`
  - Expected: JSON with success=true
- [ ] `http://localhost/first-groups-accounting/php-backend/api/user.php`
  - Expected: User profile data
- [ ] `http://localhost/first-groups-accounting/php-backend/api/accounts.php`
  - Expected: Account balances

### Step 6: Frontend Configuration

Edit `src/services/api.ts`:
```typescript
✅ Verify API URL matches your setup:
const API_BASE_URL = 'http://localhost/first-groups-accounting/php-backend/api';
```

- [ ] API URL updated to match your folder structure
- [ ] No trailing slash in URL

### Step 7: Frontend Installation
```bash
✅ Run these commands in project root:
npm install     # or pnpm install
npm run dev     # or pnpm dev
```

- [ ] Dependencies installed (no errors)
- [ ] Dev server started
- [ ] Opens at `http://localhost:5173`

### Step 8: Application Testing

**Visual Verification:**
- [ ] Page loads with blue and white theme (not black)
- [ ] Sidebar shows "Welcome Group 1" (not "Overview")
- [ ] User name displays: "Ibukun Diamond Great Tola"
- [ ] Dashboard shows balance cards
- [ ] No CORS errors in browser console (F12)

**Functionality Tests:**
1. **Balance Display**
   - [ ] Main balance shows: ₦0.00
   - [ ] Stash balance shows: ₦0.00

2. **Add Savings**
   - [ ] Enter amount (e.g., 5000)
   - [ ] Click "Secure" button
   - [ ] Success toast appears
   - [ ] Balance updates
   - [ ] Check phpMyAdmin → accounts table → balance updated ✅

3. **Profile Update**
   - [ ] Click "Settings" in sidebar
   - [ ] Click "Edit Profile" button
   - [ ] Change name/email
   - [ ] Click "Save Changes"
   - [ ] Success message appears
   - [ ] Check phpMyAdmin → users table → data updated ✅

4. **Stash Operations**
   - [ ] Click "Vault Stash" in sidebar
   - [ ] Top up ₦1000
   - [ ] Success message appears
   - [ ] Balance updates
   - [ ] Transaction appears in list

### Step 9: Database Verification

Open phpMyAdmin and verify:

**Users Table:**
- [ ] Navigate to: `first_groups_accounting` → `users`
- [ ] Default user exists with:
  - Name: Ibukun Diamond Great Tola
  - Email: ibukun@firstgroups.com

**Accounts Table:**
- [ ] Navigate to: `first_groups_accounting` → `accounts`
- [ ] Two accounts exist for user_id=1:
  - account_type: 'main'
  - account_type: 'stash'

**After Testing:**
- [ ] Balances changed in `accounts` table
- [ ] Transactions recorded in `transactions` table
- [ ] Profile changes reflected in `users` table

## 🎯 Success Criteria

All these should be ✅ TRUE:

1. **Backend:**
   - ✅ MySQL running
   - ✅ Database imported
   - ✅ API endpoints respond with JSON
   - ✅ No PHP errors

2. **Frontend:**
   - ✅ Blue and white theme visible
   - ✅ "Welcome Group 1" in sidebar
   - ✅ User data loads from database
   - ✅ No console errors

3. **Integration:**
   - ✅ Can add money → saves to DB
   - ✅ Can update profile → saves to DB
   - ✅ Changes visible in phpMyAdmin
   - ✅ Page refresh keeps data

## 🐛 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:**
```
1. Check XAMPP Control Panel → MySQL is green
2. Verify config.php credentials:
   DB_USER: 'root'
   DB_PASS: '' (empty)
3. Test in phpMyAdmin
```

### Issue: "CORS error" in console
**Solution:**
```
1. Edit php-backend/config.php
2. Update line:
   header('Access-Control-Allow-Origin: http://localhost:5173');
3. Make sure port matches your React dev server
```

### Issue: "404 Not Found" for API
**Solution:**
```
1. Verify project location:
   C:\xampp\htdocs\first-groups-accounting\
2. Test URL directly in browser:
   http://localhost/first-groups-accounting/php-backend/api/test.php
3. Check Apache is running in XAMPP
```

### Issue: Changes don't save to database
**Solution:**
```
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try the action again
4. Check if API call shows error
5. Look at Response tab for error message
6. Verify database exists in phpMyAdmin
```

### Issue: Port 80 already in use
**Solution:**
```
1. Close Skype, IIS, or other apps using port 80
2. OR change Apache port:
   - XAMPP → Config → httpd.conf
   - Change "Listen 80" to "Listen 8080"
   - Update all URLs to use :8080
```

## 📊 Performance Checklist

After setup, verify performance:
- [ ] Dashboard loads in < 2 seconds
- [ ] API calls respond in < 500ms
- [ ] No memory leaks (check Task Manager)
- [ ] No console warnings
- [ ] Smooth animations (60fps)

## 🎓 Next Steps

Once everything is ✅:

1. **Explore Features:**
   - [ ] Create a savings plan
   - [ ] Join an investment circle
   - [ ] Add transactions
   - [ ] Update settings

2. **Customize:**
   - [ ] Change user profile picture
   - [ ] Add more savings plans
   - [ ] Create custom circles

3. **Learn:**
   - [ ] Examine database structure in phpMyAdmin
   - [ ] Check how API calls work in Network tab
   - [ ] Explore React components in `src/app/components/`

## 📞 Need Help?

If something doesn't work:

1. **Check this list again** - Most issues are configuration
2. **Open backend-test.html** - Quick diagnosis
3. **Check browser console** - Look for error messages
4. **Check Apache logs**:
   - Windows: `C:\xampp\apache\logs\error.log`
   - Mac: `/Applications/XAMPP/logs/error_log`

## ✅ Final Verification

Everything working when you can:
- ✅ See blue and white interface
- ✅ "Welcome Group 1" in sidebar
- ✅ Add money and see it in database
- ✅ Update profile and see changes
- ✅ No errors in console
- ✅ All backend tests pass

**If all ✅ are checked: CONGRATULATIONS! 🎉**

Your First Groups Accounting app is running perfectly with MySQL!
