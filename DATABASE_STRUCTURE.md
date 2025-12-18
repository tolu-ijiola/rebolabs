# ReboLabs Database Structure & API Documentation

## Overview
This document outlines the updated database schema and API endpoints for the ReboLabs application. The system has been restructured to support public project access and comprehensive survey analytics tracking.

## Database Schema

### 1. Users Table
```sql
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Projects Table (Publicly Accessible)
```sql
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id TEXT NOT NULL UNIQUE,           -- Unique app identifier
  name TEXT NOT NULL,                    -- Project name
  link TEXT NOT NULL,                    -- Project URL
  type TEXT,                             -- Project type
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  revenue DECIMAL(10,2) DEFAULT 0,       -- Total revenue
  demo BOOLEAN DEFAULT true,             -- Demo mode flag
  currency_name TEXT NOT NULL,           -- App currency name
  currency_value DECIMAL(10,2) DEFAULT 100, -- Currency conversion rate
  show_value BOOLEAN DEFAULT true,       -- Show value flag
  custom_logo TEXT,                      -- Custom logo URL
  primary_color TEXT,                    -- Primary color
  secret_key UUID DEFAULT gen_random_uuid(), -- Secret key for API
  server_key UUID DEFAULT gen_random_uuid(), -- Server key for API
  reward_callback TEXT,                  -- Reward callback URL
  reconciliation_callback TEXT,          -- Reconciliation callback URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Features:**
- **Public Access**: Anyone can view active projects
- **Unique App IDs**: Each project has a unique app identifier
- **Currency Support**: Supports multiple currencies with conversion rates
- **API Keys**: Automatic generation of secret and server keys

### 3. Analytics Table (Survey Tracking)
```sql
CREATE TABLE public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id TEXT NOT NULL,                 -- References project app_id
  user_id TEXT NOT NULL,                -- Survey user ID (text, not UUID)
  revenue_usd DECIMAL(10,2) NOT NULL,   -- Revenue in USD
  revenue_app_currency DECIMAL(10,2) NOT NULL, -- Revenue in app currency
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
  full_date DATE NOT NULL,              -- Full date for easy querying
  history_type TEXT NOT NULL CHECK (history_type IN ('reward', 'reconciliation')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Features:**
- **Survey Tracking**: Records each survey completion
- **Dual Currency**: Tracks revenue in both USD and app currency
- **Date Granularity**: Separate month, year, day fields for flexible reporting
- **History Types**: Distinguishes between rewards and reconciliations

### 4. Payments Table
```sql
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,        -- Payment amount
  currency TEXT NOT NULL DEFAULT 'USD', -- Payment currency
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT NOT NULL,         -- Payment method used
  transaction_id TEXT,                  -- External transaction ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

### Projects
- **Public Read**: `Anyone can view projects` - Allows public access to active projects
- **Owner Management**: Users can only create, update, and delete their own projects

### Analytics
- **Public Read**: `Anyone can view analytics` - Allows public access to survey data
- **Public Insert**: `Users can insert analytics` - Allows survey data insertion

### Payments
- **User Access**: Users can only view and manage their own payments

### Users
- **Profile Access**: Users can only view and update their own profiles

## API Endpoints

### 1. Projects API (`/api/projects`)

#### GET `/api/projects`
- **Public Access**: Yes
- **Query Parameters**:
  - `app_id`: Get specific project by app ID
  - `user_id`: Get user's projects (requires authentication)
  - No params: Get all public active projects

#### POST `/api/projects`
- **Authentication**: Required
- **Body**: Project creation data
- **Validation**: Checks for unique app_id

### 2. Analytics API (`/api/analytics`)

#### GET `/api/analytics`
- **Public Access**: Yes
- **Query Parameters**:
  - `app_id`: Get analytics for specific app
  - `user_id`: Get analytics for specific user

#### POST `/api/analytics`
- **Authentication**: Required
- **Body**: Survey completion data
- **Validation**: Comprehensive field validation

### 3. Payments API (`/api/payments`)

#### GET `/api/payments`
- **Authentication**: Required
- **Returns**: User's payment history with project details

#### POST `/api/payments`
- **Authentication**: Required
- **Body**: Payment creation data

## Usage Examples

### Creating a Survey Analytics Record
```javascript
// When a user completes a survey
const surveyData = {
  app_id: "my_app_123",
  user_id: "survey_user_456",
  revenue_usd: 5.00,
  revenue_app_currency: 500,
  month: 12,
  year: 2024,
  day: 15,
  full_date: "2024-12-15",
  history_type: "reward"
};

await fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(surveyData)
});
```

### Fetching Public Projects
```javascript
// Get all public projects
const response = await fetch('/api/projects');
const projects = await response.json();

// Get specific project by app ID
const response = await fetch('/api/projects?app_id=my_app_123');
const project = await response.json();
```

### Fetching Project Analytics
```javascript
// Get analytics for specific app
const response = await fetch('/api/analytics?app_id=my_app_123');
const analytics = await response.json();
```

## Database Indexes

Performance indexes have been created for:
- `projects.app_id` - Fast project lookup
- `projects.status` - Filter active projects
- `analytics.app_id` - Fast analytics queries
- `analytics.full_date` - Date-based queries
- `analytics.history_type` - Filter by type
- `payments.project_id` - Payment lookups
- `payments.user_id` - User payment history

## Security Features

1. **Row Level Security**: All tables have RLS enabled
2. **Public Access Control**: Projects and analytics are publicly readable
3. **Authentication Required**: Creating/updating requires valid user session
4. **Data Validation**: Comprehensive input validation on all endpoints
5. **Unique Constraints**: App IDs are unique across all projects

## Migration Notes

If you have existing data, you'll need to:
1. Update the database schema using the provided SQL
2. Migrate existing analytics data to the new format
3. Update any frontend code to use the new API structure
4. Test the public access functionality

## Next Steps

1. **Test Public Access**: Verify projects are accessible without authentication
2. **Survey Integration**: Implement survey completion tracking
3. **Analytics Dashboard**: Update dashboard to use new analytics structure
4. **Payment Processing**: Implement payment creation and management
5. **Performance Testing**: Verify database performance with new indexes
