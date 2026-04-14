-- SQL to create the products table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 5.0,
  image TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for searching and filtering
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_rating ON products(rating DESC);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read products (public catalog)
CREATE POLICY "Anyone can read products" ON products
  FOR SELECT USING (true);

-- Policy: Only Admins can insert/update/delete products
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Optional: Insert initial starter products just to not have an empty store 
INSERT INTO products (name, category, description, price, rating, image, tags) VALUES
('Brigadeiro Trufado Gourmet', 'Doces', 'Tradicional doce brasileiro feito com o mais puro cacau e leite condensado premium. Um clássico irresistível para adoçar o seu dia a dia.', 8.5, 5.0, 'https://images.unsplash.com/photo-1765946024017-3995b2aa99eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBicmlnYWRlaXJvJTIwdHJ1ZmZsZXxlbnwxfHx8fDE3NzQ0NjkwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080', '["Mais Vendido"]'),
('Fatia Torta de Morango', 'Tortas', 'Base crocante de biscoito, creme leve de baunilha e cobertura de morangos frescos. Uma explosão de sabores frescos e doces que encanta todos os paladares.', 18.9, 4.8, 'https://images.unsplash.com/photo-1769655103034-6a8abfa7523b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhd2JlcnJ5JTIwc2hvcnRjYWtlJTIwc2xpY2V8ZW58MXx8fHwxNzc0NDI0OTkyfDA&ixlib=rb-4.1.0&q=80&w=1080', '["Novo"]');
