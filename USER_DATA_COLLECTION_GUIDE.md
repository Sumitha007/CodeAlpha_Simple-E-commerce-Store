# User Data Collection - Complete Implementation Guide

## Overview
Your e-commerce platform now collects 10 comprehensive data fields from users for better lead analysis and ML-based lead quality prediction.

## 10 Data Fields Collected

### 1. **Lead Origin** (Where did they find us?)
- Options: Google, Facebook, LinkedIn, Instagram, Twitter, Email, Referral, Direct, Other
- Stored in: `User.leadOrigin`
- Sample value: "Google"

### 2. **Lead Source** (Traffic type)
- Options: organic, paid, referral, direct, social, email, other
- Stored in: `User.leadSource`
- Sample value: "organic"

### 3. **Total Time Spent on Website**
- Measured in: seconds
- Stored in: `User.totalTimeSpent`
- Auto-tracked via activity tracker
- Sample value: 14400 (4 hours)

### 4. **Last Activity**
- Timestamp of last page interaction
- Stored in: `User.lastActivity`
- Auto-updated when user interacts with site
- Sample value: "2025-03-27T10:30:00Z"

### 5. **How did you hear about us?** (Marketing source)
- Options: Search Engine, Social Media, Friend/Colleague, Advertisement, Content Marketing, Other
- Stored in: `User.hearAboutUs`
- Collected via: UserProfileForm
- Sample value: "Search Engine"

### 6. **What matters most to you?** (Course preferences/interests)
- Multi-select: Career Growth, Skill Development, Certification, Salary Increase, Job Security, Cost Effective, Industry Relevant
- Stored in: `User.coursePreferences` (array)
- Collected via: UserProfileForm
- Sample value: ["Career Growth", "Skill Development"]

### 7. **Lead Profile** (User type)
- Options: Student, Working Professional, Career Changer, Entrepreneur, Other
- Stored in: `User.leadProfile`
- Collected via: UserProfileForm
- Sample value: "Working Professional"

### 8. **Lead Quality** (ML-predicted or manual override)
- Values: hot 🔥, warm ⚡, cold ❄️
- Stored in: `User.leadQuality`
- Calculated by: ML prediction algorithm based on engagement metrics
- Sample value: "hot"

### 9. **Tags** (Custom categorization)
- Array of strings for admin-assigned or auto-generated tags
- Stored in: `User.tags`
- Sample value: ["high-value", "loyal", "buyer"]

### 10. **Last Notable Activity** (Specific action taken)
- Activity type + timestamp
- Stored in: `User.lastNotableActivity` { activity, timestamp }
- Sample value: { activity: "Purchase", timestamp: "2025-03-27T10:30:00Z" }

## Collection Points

### A. During User Registration
Currently collects:
- Name, Email, Password
- Lead Source (via activity tracker detection)
- Lead Origin (via activity tracker detection)

### B. Via User Profile Form (/profile)
New dedicated form for collecting:
- Lead Origin
- Lead Source
- How did you hear about us?
- Lead Profile (User type)
- Course Preferences

**Access Path:** `/profile` (protected route)
**Component:** `UserProfileForm.tsx`

### C. Automatic Tracking (Activity Tracker)
- Total Time Spent: Updated every 30 seconds
- Last Activity: Updated on page interactions
- Last Notable Activity: Can be updated via API when significant actions occur

### D. On Admin Dashboard
- Lead Quality: Calculated via ML prediction algorithm
- Tags: Can be manually assigned by admin

## Backend APIs

### 1. Update User Profile
```
PUT /api/user/profile/:userEmail
Body: {
  leadOrigin: string,
  leadSource: string,
  hearAboutUs: string,
  coursePreferences: string[],
  leadProfile: string
}
```

### 2. Get User Profile
```
GET /api/user/profile/:userEmail
Response: Complete user object with all 10 fields
```

### 3. Update Notable Activity
```
POST /api/user/profile/:userEmail/notable-activity
Body: { activity: string }
```

## Admin Dashboard Display

The admin dashboard now shows all collected data in a comprehensive table with columns:
1. User (Name + Email)
2. Lead Origin
3. Lead Source
4. Heard About Us
5. Profile Type
6. Interests (Course Preferences)
7. Time Spent
8. Orders
9. Lead Quality (with ML prediction confidence)
10. Last Activity

## ML Lead Quality Prediction

The system automatically predicts lead quality based on:
- **Time Spent**: 40 points
- **Orders**: 40 points  
- **Total Spending**: 20 points
- **Recency**: 10 points (bonus for recent activity)
- **Total**: 110 points

**Scoring:**
- Hot 🔥: ≥ 80 points
- Warm ⚡: ≥ 50 points
- Cold ❄️: < 50 points

## Test Data

5 seeded test users with varied profiles:
- **John Doe** (john@example.com): 7200s, 3 orders, Warm lead
- **Jane Smith** (jane@example.com): 14400s, 8 orders, Hot lead 🔥
- **Bob Johnson** (bob@example.com): 3600s, 1 order, Cold lead
- **Alice Williams** (alice@example.com): 21600s, 15 orders, Hot lead 🔥 (VIP)
- **Charlie Brown** (charlie@example.com): 1800s, 0 orders, Cold lead (Inactive)

## How to Use

### 1. User Fills Out Profile
- User logs in
- Navigate to `/profile`
- Fill out the UserProfileForm with:
  - How they found the platform
  - Their profile type
  - Their interests/priorities
- Click "Save Profile"

### 2. Admin Reviews Analytics
- Admin logs in (archana@gmail.com)
- Go to `/admin/dashboard`
- View all 10 data fields in the user table
- Click "Analyze" button to see ML prediction details
- Dark theme displays all data clearly

### 3. Admin Takes Action
- Admin can manually override lead quality using "Update Lead Quality" endpoint
- Admin can add/modify tags
- Admin can track notable activities

## Frontend Components

1. **UserProfileForm** (`src/components/UserProfileForm.tsx`)
   - Collects 5 user-facing fields
   - Saves to backend via PUT /api/user/profile/:userEmail

2. **UserProfilePage** (`src/pages/UserProfile.tsx`)
   - Wrapper page with Navbar/Footer
   - Shows success message after save

3. **AdminDashboard** (`src/pages/AdminDashboard.tsx`)
   - Updated table to show all 10 fields
   - Dark theme with charts
   - ML prediction display

## Backend Models

**User Schema** updated with:
```javascript
leadOrigin: String (enum)
leadSource: String (enum)
hearAboutUs: String (enum)
coursePreferences: [String] (array)
leadProfile: String (enum)
totalTimeSpent: Number
lastActivity: Date
lastNotableActivity: { activity, timestamp }
leadQuality: String (enum: hot, warm, cold)
tags: [String]
totalOrders: Number
totalSpent: Number
```

## Next Steps

1. **Test the system:**
   - Create user accounts
   - Visit `/profile` to fill out the 10 fields
   - Check admin dashboard to see all data displayed
   - View ML predictions and lead quality scoring

2. **Verify data flow:**
   - Time spent tracking should update in real-time
   - Profile updates should reflect immediately in admin dashboard
   - ML predictions should update based on user engagement

3. **Customize as needed:**
   - Add more options to enums (Lead Origins, Preferences, etc.)
   - Adjust ML scoring weights
   - Add more notable activity types

## Database Structure

All data persisted in MongoDB:
- Collection: `users`
- Fields: 15+ (including 10 core lead fields)
- Indexes: `email` (unique), auto timestamps
