-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  price TEXT NOT NULL,
  last_contact INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('active', 'warming', 'cold')),
  current_stage INTEGER NOT NULL DEFAULT 0,
  next_action TEXT NOT NULL DEFAULT '',
  agent TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  entered_stage INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('seller', 'buyer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Permissive policy — all operations allowed (auth added later)
CREATE POLICY "Allow all operations for now"
  ON public.clients
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============ SEED DATA — The Unicorn Realtors / Laura Rao ============

-- SELLERS
INSERT INTO public.clients (id, name, address, price, last_contact, status, current_stage, next_action, agent, source, entered_stage, type) VALUES
  ('s1', 'Angie Winters',       '233 Grand Vista, Dayton',              '$185K',    58, 'active',  4, 'Pricing strategy CMA · recoup reno costs',              'Laura', 'Sphere',                  28, 'seller'),
  ('s2', 'Max Diaz',            '225 Stingley Rd, Greenville',          '$85K',     63, 'active',  3, 'Listing prep + photography · confirm timeline',         'Laura', 'Sphere',                  30, 'seller'),
  ('s3', 'Isaias Sanchez',      '822 Sunlight, Dayton',                 '$95K',     62, 'active',  3, 'Get second HVAC quote · confirm plumbing permit',       'Laura', 'Referral',                40, 'seller'),
  ('s4', 'Wayne & Yuko Mcghie', '292 Parrott Ct, Fairborn',             '$245K',    76, 'warming', 2, 'Feedback on Shagbark showing · buy-sell trigger',       'Laura', 'Sphere',                  30, 'seller'),
  ('s5', 'Allison Moody',       'Dad''s house, Washington Township',    '$200K',    71, 'active',  0, 'Visit Washington Township house · contractor quote',    'Laura', 'Sphere',                  71, 'seller'),
  ('s6', 'Dawn Johnson',        '5704 Spring Gate Ct, Huber Heights',   '$170K',    48, 'warming', 0, 'Text Abby → classic car storage or sale',               'Laura', 'Tax pop-up',              48, 'seller'),
  ('s7', 'Laura Curliss',       'Probate attorney · estate referrals',  'Est. $250K+', 76, 'warming', 0, 'Follow up — stay useful · estate transition partner', 'Laura', 'Panama lien referral',    76, 'seller')
ON CONFLICT (id) DO NOTHING;

-- BUYERS
INSERT INTO public.clients (id, name, address, price, last_contact, status, current_stage, next_action, agent, source, entered_stage, type) VALUES
  ('b1',  'Liz Robertson',        'Yellow Springs · 345 E Enon Rd',        '$265K',  47,  'active',  5, 'Waiting on seller response · 345 E Enon Rd',            'Laura', 'Friend',                  47, 'buyer'),
  ('b2',  'Sarah & Zlatomir',     'Yellow Springs forever home',           '~$450K', 47,  'active',  1, 'Meeting April 11 · prep discovery questions for both',  'Laura', 'YS referral',             14, 'buyer'),
  ('b3',  'Luciana Lieff',        'Budget $275K · Beavercreek/township',   '$275K',  63,  'active',  3, 'Feedback on Graham/Crestmont/Glenview · MLS auto-search','Laura', 'YS village referral',     20, 'buyer'),
  ('b4',  'Rubén Darío Intriago', 'Budget $225K · Huber/Dayton',           '$225K',  68,  'active',  3, 'Tour houses this week · find his house',                'Laura', 'Referral · Carla',        30, 'buyer'),
  ('b5',  'Wayne & Yuko Mcghie',  'Budget ~$350K · buy-sell',              '~$350K', 76,  'warming', 3, 'Set up Homes.com AI search · Shagbark feedback',        'Laura', 'Sphere',                  20, 'buyer'),
  ('b6',  'Jacqueline Voss',      'Budget ~$1M · horse farm SE OH',        '~$1M',   85,  'warming', 1, 'Call Emily (horse specialist) · MLS alert horse farms', 'Laura', 'Zillow / followed from CB',55, 'buyer'),
  ('b7',  'Brian',                'Budget ~$400K · Centerville→YS',        '~$400K', 85,  'warming', 0, 'Strategy call · YS vs Centerville 3 paths',             'Laura', 'Referral · Nate',         85, 'buyer'),
  ('b8',  'Adrian & Maggie Shergill', 'Budget $265K · character home',     '$265K',  99,  'warming', 0, 'Find quirky character home with garden · Birchall energy','Laura', 'Sphere',                 99, 'buyer'),
  ('b9',  'Danielle Lyons',       'Budget $250K · Beavercreek/Xenia',      '$250K',  113, 'cold',    0, 'Clarify financing after uncle backed out',               'Laura', 'Homefull referral',       113,'buyer'),
  ('b10', 'Yolraime Rianos',      'Budget $225K · Dayton · ES',            '$225K',  99,  'cold',    0, 'Follow up with Jessica on pre-approval · 6mo',          'Laura', 'Referral · Rubén',        99, 'buyer')
ON CONFLICT (id) DO NOTHING;
