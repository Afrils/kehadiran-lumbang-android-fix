
-- Create the required tables if they don't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  nip TEXT,
  position TEXT,
  department TEXT,
  join_date TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  date DATE NOT NULL,
  check_in TEXT,
  check_out TEXT,
  status TEXT CHECK (status IN ('hadir', 'terlambat', 'absen')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Row Level Security (RLS) policies for the tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS policies for attendance
CREATE POLICY "Users can view their own attendance"
  ON public.attendance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attendance"
  ON public.attendance FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically add new users to profiles table
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert dummy users (passwords can be set via Supabase Authentication UI)
-- Note: You'll need to create these users in Supabase Auth first

-- After creating users in Auth UI, update their profiles with additional data
UPDATE public.profiles
SET 
  nip = '198505242010011002',
  position = 'Staff Administrasi',
  department = 'Tata Usaha',
  join_date = '01/06/2010',
  phone = '081234567890'
WHERE email = 'user1@example.com';

UPDATE public.profiles
SET 
  nip = '199308112015032001',
  position = 'Kepala Seksi',
  department = 'Pelayanan',
  join_date = '15/03/2015',
  phone = '082345678901'
WHERE email = 'user2@example.com';

-- Insert dummy attendance data
-- For user1@example.com (assuming you've created this user in Auth)
INSERT INTO public.attendance (user_id, date, check_in, check_out, status)
SELECT 
  id,
  '2023-05-01'::DATE,
  '07:45',
  '16:05',
  'hadir'
FROM public.profiles
WHERE email = 'user1@example.com';

INSERT INTO public.attendance (user_id, date, check_in, check_out, status)
SELECT 
  id,
  '2023-05-02'::DATE,
  '08:10',
  '16:15',
  'terlambat'
FROM public.profiles
WHERE email = 'user1@example.com';

INSERT INTO public.attendance (user_id, date, check_in, check_out, status)
SELECT 
  id,
  '2023-05-03'::DATE,
  '07:30',
  '16:00',
  'hadir'
FROM public.profiles
WHERE email = 'user1@example.com';

INSERT INTO public.attendance (user_id, date, check_in, check_out, status)
SELECT 
  id,
  '2023-05-04'::DATE,
  '07:55',
  '16:00',
  'hadir'
FROM public.profiles
WHERE email = 'user1@example.com';

-- For user2@example.com (assuming you've created this user in Auth)
INSERT INTO public.attendance (user_id, date, check_in, check_out, status)
SELECT 
  id,
  '2023-05-01'::DATE,
  '07:30',
  '16:00',
  'hadir'
FROM public.profiles
WHERE email = 'user2@example.com';

INSERT INTO public.attendance (user_id, date, check_in, check_out, status)
SELECT 
  id,
  '2023-05-02'::DATE,
  '07:45',
  '16:05',
  'hadir'
FROM public.profiles
WHERE email = 'user2@example.com';

INSERT INTO public.attendance (user_id, date, check_in, check_out, status)
SELECT 
  id,
  '2023-05-03'::DATE,
  '08:20',
  '16:30',
  'terlambat'
FROM public.profiles
WHERE email = 'user2@example.com';
