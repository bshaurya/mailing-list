CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  user_agent TEXT,
  ip_address INET
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous reads" ON subscribers
  FOR SELECT USING (true);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_created_at ON subscribers(subscribed_at DESC);
CREATE INDEX idx_subscribers_active ON subscribers(is_active);

CREATE TABLE admin_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE admin_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON admin_keys
  FOR ALL USING (auth.role() = 'service_role');

INSERT INTO admin_keys (key_hash) 
VALUES (encode(digest('cant_find_my_real_admin_key_:D', 'sha256'), 'hex'));

CREATE OR REPLACE FUNCTION verify_admin_key(input_key TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_keys 
    WHERE key_hash = encode(digest(input_key, 'sha256'), 'hex') 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION verify_admin_key(TEXT) TO anon, authenticated;