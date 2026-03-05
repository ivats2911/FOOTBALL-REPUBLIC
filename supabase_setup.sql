-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/ltlrxouxdtetfxggkauc/sql/new

CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'ORIGINAL',
  category TEXT NOT NULL CHECK (category IN ('T-Shirts', 'Hoodies', 'Streetwear', 'Retro Tees', 'Accessories')),
  price NUMERIC NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the products (Public)
CREATE POLICY "Enable read access for all users" ON public.products
  FOR SELECT USING (true);
  
-- Allow anyone to upload new products (for easy store management without auth right now)
CREATE POLICY "Enable insert access for all users" ON public.products
  FOR INSERT WITH CHECK (true);
