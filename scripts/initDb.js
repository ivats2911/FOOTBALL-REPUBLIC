import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ltlrxouxdtetfxggkauc.supabase.co';
const supabaseAnonKey = 'sb_publishable_6gTadELQ8KLVAcfUaBZzJA_TQ27lV-J';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function initDB() {
  console.log('Initializing database tables...');
  
  // Create products table if it doesn't exist.
  // We use supabase.rpc here to execute a raw SQL function, 
  // but since we probably don't have a setup function, the easiest way
  // to initialize tables for a new user without giving them raw SQL instructions
  // is to attempt a simple insert to force PostgREST to recognize the schema if possible,
  // OR we just provide the SQL they need to run in their dashboard.

  console.log(`
  !! MANUAL STEP REQUIRED !!
  1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ltlrxouxdtetfxggkauc/sql/new
  2. Paste and RUN the following SQL code exactly:
  
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

  -- Set up Row Level Security (RLS) so anyone can view, but only admin can edit
  -- For now, we allow anon access to insert for the sake of the demo, 
  -- but in production we'd restrict it.
  
  ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Enable read access for all users" ON public.products
    FOR SELECT USING (true);
    
  CREATE POLICY "Enable insert access for all users (demo only)" ON public.products
    FOR INSERT WITH CHECK (true);
    
  -- Insert dummy data
  INSERT INTO public.products (name, brand, category, price, description, image_url)
  VALUES 
    ('Total Football Tee', 'ORIGINAL', 'T-Shirts', 35, 'Minimalist graphic celebrating the philosophy of Total Football.', 'https://picsum.photos/seed/cyber/400/500'),
    ('Pitch Culture Oversized', 'ORIGINAL', 'Streetwear', 45, 'Premium heavyweight cotton with "The Beautiful Game" typography.', 'https://picsum.photos/seed/mid/400/500'),
    ('Retro Stadium Graphic', 'ORIGINAL', 'Retro Tees', 38, 'Vintage-style illustration of a classic 80s stadium atmosphere.', 'https://picsum.photos/seed/retro/400/500')
  ON CONFLICT DO NOTHING;
  `);
}

initDB();
