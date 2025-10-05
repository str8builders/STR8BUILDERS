/*
  # Comprehensive STR8 BUILD App Database Schema

  ## Overview
  Complete database schema for construction management app with all advanced features

  ## New Tables
  
  ### Core Tables
  1. `users`
    - User profiles and authentication
    - Business info (company, rates, contact details)
    
  2. `projects`
    - Construction projects with client info
    - Status tracking, budgets, timelines
    
  3. `clients`
    - Client contact information
    - Payment history and ratings
    
  ### Time & Expense Tracking
  4. `time_entries`
    - Time tracking logs with GPS coordinates
    - Voice notes and descriptions
    
  5. `expenses`
    - Expense tracking with receipt photos
    - Project allocation and categories
    
  6. `invoices`
    - Invoice management
    - Payment tracking and status
    
  ### Documentation & Media
  7. `project_photos`
    - Photo documentation with metadata
    - Before/after tracking
    - AI-generated tags
    
  8. `voice_notes`
    - Voice recordings with transcriptions
    - Linked to projects/clients
    
  ### Social & Reputation
  9. `testimonials`
    - Client reviews and ratings
    - Approval status
    
  10. `portfolio_items`
    - Showcased work for marketing
    - Social media ready content
    
  ### Subcontractor Management
  11. `subcontractors`
    - Subcontractor contact and ratings
    - Availability tracking
    
  12. `subcontractor_bookings`
    - Booking and scheduling
    - Rate agreements
    
  ### Compliance & Safety
  13. `compliance_items`
    - NZ building code compliance
    - Council consents
    - Inspections
    
  14. `safety_incidents`
    - WorkSafe NZ incident reports
    - Safety checklists
    
  ### Scheduling & Planning
  15. `schedule_events`
    - Calendar events
    - Travel time calculations
    - Site locations
    
  16. `material_prices`
    - Material price tracking
    - Supplier information
    - Price alerts
    
  ### Gamification & Insights
  17. `achievements`
    - User achievement tracking
    - Milestones and streaks
    
  18. `insights`
    - Daily tips and insights
    - Performance metrics
    
  19. `notifications`
    - Smart notification queue
    - Read status tracking

  ## Security
  - RLS enabled on all tables
  - Policies restrict data to authenticated user only
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid UNIQUE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  company_name text,
  hourly_rate numeric DEFAULT 85,
  location text,
  abn text,
  address text,
  bank_account text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_id);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  company text,
  payment_terms int DEFAULT 30,
  rating numeric DEFAULT 0,
  total_paid numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own clients"
  ON clients FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  budget numeric DEFAULT 0,
  total_spent numeric DEFAULT 0,
  total_hours numeric DEFAULT 0,
  start_date date,
  end_date date,
  location text,
  gps_lat numeric,
  gps_lng numeric,
  weather_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Time entries table
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_minutes int,
  description text,
  voice_note_url text,
  gps_lat numeric,
  gps_lng numeric,
  auto_paused boolean DEFAULT false,
  hourly_rate numeric,
  total_earned numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own time entries"
  ON time_entries FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own time entries"
  ON time_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own time entries"
  ON time_entries FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own time entries"
  ON time_entries FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  category text,
  vendor text,
  description text,
  receipt_photo_url text,
  expense_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  invoice_number text UNIQUE NOT NULL,
  amount numeric NOT NULL,
  status text DEFAULT 'draft',
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  paid_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Project photos table
CREATE TABLE IF NOT EXISTS project_photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text,
  photo_type text DEFAULT 'progress',
  tags text[],
  taken_at timestamptz DEFAULT now(),
  gps_lat numeric,
  gps_lng numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own photos"
  ON project_photos FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own photos"
  ON project_photos FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own photos"
  ON project_photos FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own photos"
  ON project_photos FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Voice notes table
CREATE TABLE IF NOT EXISTS voice_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  audio_url text NOT NULL,
  transcription text,
  duration_seconds int,
  note_type text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own voice notes"
  ON voice_notes FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own voice notes"
  ON voice_notes FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own voice notes"
  ON voice_notes FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own voice notes"
  ON voice_notes FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  rating numeric NOT NULL,
  review_text text,
  client_name text,
  approved boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  cover_photo_url text,
  photo_urls text[],
  featured boolean DEFAULT false,
  share_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own portfolio items"
  ON portfolio_items FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own portfolio items"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own portfolio items"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own portfolio items"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Subcontractors table
CREATE TABLE IF NOT EXISTS subcontractors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  trade text,
  hourly_rate numeric,
  rating numeric DEFAULT 0,
  notes text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subcontractors"
  ON subcontractors FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own subcontractors"
  ON subcontractors FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own subcontractors"
  ON subcontractors FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own subcontractors"
  ON subcontractors FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Subcontractor bookings table
CREATE TABLE IF NOT EXISTS subcontractor_bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subcontractor_id uuid REFERENCES subcontractors(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  status text DEFAULT 'pending',
  agreed_rate numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subcontractor_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
  ON subcontractor_bookings FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own bookings"
  ON subcontractor_bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own bookings"
  ON subcontractor_bookings FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own bookings"
  ON subcontractor_bookings FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Compliance items table
CREATE TABLE IF NOT EXISTS compliance_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  due_date date,
  completed_date date,
  document_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own compliance items"
  ON compliance_items FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own compliance items"
  ON compliance_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own compliance items"
  ON compliance_items FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own compliance items"
  ON compliance_items FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Safety incidents table
CREATE TABLE IF NOT EXISTS safety_incidents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  incident_date timestamptz DEFAULT now(),
  severity text,
  description text NOT NULL,
  action_taken text,
  reported_to_worksafe boolean DEFAULT false,
  photo_urls text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE safety_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own safety incidents"
  ON safety_incidents FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own safety incidents"
  ON safety_incidents FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own safety incidents"
  ON safety_incidents FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own safety incidents"
  ON safety_incidents FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Schedule events table
CREATE TABLE IF NOT EXISTS schedule_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  location text,
  gps_lat numeric,
  gps_lng numeric,
  travel_time_minutes int,
  event_type text DEFAULT 'work',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own schedule events"
  ON schedule_events FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own schedule events"
  ON schedule_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own schedule events"
  ON schedule_events FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own schedule events"
  ON schedule_events FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Material prices table
CREATE TABLE IF NOT EXISTS material_prices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  material_name text NOT NULL,
  supplier text,
  price numeric NOT NULL,
  unit text,
  alert_price numeric,
  last_checked timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE material_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own material prices"
  ON material_prices FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own material prices"
  ON material_prices FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own material prices"
  ON material_prices FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own material prices"
  ON material_prices FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  title text NOT NULL,
  description text,
  icon text,
  unlocked_at timestamptz DEFAULT now(),
  value numeric
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Insights table
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  insight_type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  viewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own insights"
  ON insights FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own insights"
  ON insights FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own insights"
  ON insights FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  notification_type text,
  action_url text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_project_id ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_project_photos_project_id ON project_photos(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_schedule_events_user_id_start ON schedule_events(user_id, start_time);
