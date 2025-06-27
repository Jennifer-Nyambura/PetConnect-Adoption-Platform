-- Create the pets table with all characteristics
CREATE TABLE IF NOT EXISTS pets (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    age VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(50),
    weight VARCHAR(30),
    description TEXT NOT NULL,
    personality TEXT,
    medical_info TEXT,
    adoption_fee DECIMAL(10,2),
    image_url TEXT,
    adopted BOOLEAN DEFAULT FALSE,
    available_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pets_type ON pets(type);
CREATE INDEX IF NOT EXISTS idx_pets_adopted ON pets(adopted);
CREATE INDEX IF NOT EXISTS idx_pets_available_date ON pets(available_date);

-- Enable Row Level Security
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations
CREATE POLICY "Allow all operations on pets" ON pets
    FOR ALL USING (true);
