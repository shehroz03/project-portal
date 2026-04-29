-- Run this in your Supabase SQL Editor

-- 1. Profiles Table (New)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    university TEXT,
    country TEXT,
    degree_level TEXT, -- 'undergraduate', 'graduate', 'phd', 'high-school'
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Orders Table (Updated with all required fields)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'assignment', 'fyp', 'thesis', 'idea'
    deadline DATE,
    instructions TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'in-progress', 'completed', 'cancelled'
    price DECIMAL(10, 2) DEFAULT 0,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    payment_ss_url TEXT, -- Screenshot of payment proof
    file_url TEXT, -- Original materials
    result_file_url TEXT, -- Final delivered work
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Order Updates Table (For daily tracking)
CREATE TABLE IF NOT EXISTS public.order_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Messages Table (Standardized)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL, -- The student involved
    sender_id UUID REFERENCES auth.users(id) NOT NULL, -- Who sent it
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE, -- Optional: Tie to specific order
    message TEXT NOT NULL,
    is_admin_reply BOOLEAN DEFAULT false,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 6. Policies (Cleanup existing policies first to prevent "already exists" errors)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can see updates for their orders" ON public.order_updates;
DROP POLICY IF EXISTS "Users can see and send messages" ON public.messages;

-- Create Policies
-- Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR ALL USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'email') = 'miansabmi7@gmail.com' );

-- Updates and Messages policies
CREATE POLICY "Users can see updates for their orders" ON public.order_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE public.orders.id = order_id AND public.orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create updates for their own orders" ON public.order_updates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE public.orders.id = order_id AND public.orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can see and send messages" ON public.messages
    FOR ALL USING (auth.uid() = user_id OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
-- 7. Storage Setup (Run these manually in SQL editor if bucket not found)
-- Insert bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('studentwork', 'studentwork', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'studentwork'
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can do everything" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'studentwork');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'studentwork' AND auth.role() = 'authenticated');
CREATE POLICY "Admins can do everything" ON storage.objects FOR ALL USING (bucket_id = 'studentwork' AND ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'email') = 'miansabmi7@gmail.com' ));

-- 8. Notifications Table (Persistent alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT, -- 'price', 'delivery', 'message'
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT WITH CHECK ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() ->> 'email') = 'miansabmi7@gmail.com' );
