CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  price TEXT,
  last_contact INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  current_stage INTEGER DEFAULT 0,
  next_action TEXT,
  agent TEXT,
  source TEXT,
  entered_stage INTEGER DEFAULT 0,
  type TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO clients (id,name,address,price,last_contact,status,current_stage,next_action,agent,source,entered_stage,type) VALUES
('s1','Angie Winters','233 Grand Vista, Dayton','$185K',58,'active',4,'Pricing strategy CMA · recoup reno costs','Laura','Sphere',28,'seller'),
('s2','Max Diaz','225 Stingley Rd, Greenville','$85K',63,'active',3,'Listing prep + photography · confirm April timeline','Laura','Sphere',30,'seller'),
('s3','Isaias Sanchez','822 Sunlight, Dayton','$95K',62,'active',3,'Get second HVAC quote · confirm plumbing permit','Laura','Referral',40,'seller'),
('s4','Wayne & Yuko Mcghie','292 Parrott Ct, Fairborn','$245K',76,'warming',2,'Feedback on Shagbark showing · buy-sell trigger','Laura','Sphere',30,'seller'),
('s5','Allison Moody','Dad''s house, Washington Township','$200K',71,'active',0,'Visit Washington Township house · contractor quote','Laura','Sphere',71,'seller'),
('s6','Dawn Johnson','5704 Spring Gate Ct, Huber Heights','$170K',48,'warming',0,'Text Abby → classic car storage or sale','Laura','Tax pop-up',48,'seller'),
('s7','Laura Curliss','Probate attorney · estate referrals','Est. $250K+',76,'warming',0,'Follow up — stay useful · estate transition partner','Laura','Panama lien referral',76,'seller'),
('b1','Liz Robertson','Yellow Springs · 345 E Enon Rd','$265K',47,'active',5,'Waiting on seller response · 345 E Enon Rd','Laura','Friend',47,'buyer'),
('b2','Sarah & Zlatomir','Yellow Springs forever home','~$450K',47,'active',1,'Meeting April 11 · prep discovery questions for both','Laura','YS referral',14,'buyer'),
('b3','Luciana Lieff','Budget $275K · Beavercreek/township','$275K',63,'active',3,'Feedback on Graham/Crestmont/Glenview · MLS auto-search','Laura','YS village referral',20,'buyer'),
('b4','Rubén Darío Intriago','Budget $225K · Huber/Dayton','$225K',68,'active',3,'Tour houses this week · find his house','Laura','Referral · Carla',30,'buyer'),
('b5','Wayne & Yuko Mcghie','Budget ~$350K · buy-sell','~$350K',76,'warming',3,'Set up Homes.com AI search · Shagbark feedback','Laura','Sphere',20,'buyer'),
('b6','Jacqueline Voss','Budget ~$1M · horse farm SE OH','~$1M',85,'warming',1,'Call Emily (horse specialist) · MLS alert horse farms','Laura','Zillow / followed from CB',55,'buyer'),
('b7','Brian','Budget ~$400K · Centerville→YS','~$400K',85,'warming',0,'Strategy call · YS vs Centerville 3 paths','Laura','Referral · Nate',85,'buyer'),
('b8','Adrian & Maggie Shergill','Budget $265K · character home','$265K',99,'warming',0,'Find quirky character home with garden · Birchall energy','Laura','Sphere',99,'buyer'),
('b9','Danielle Lyons','Budget $250K · Beavercreek/Xenia','$250K',113,'cold',0,'Clarify financing after uncle backed out','Laura','Homefull referral',113,'buyer'),
('b10','Yolraime Rianos','Budget $225K · Dayton · ES','$225K',99,'cold',0,'Follow up with Jessica on pre-approval · 6mo','Laura','Referral · Rubén',99,'buyer')
ON CONFLICT (id) DO NOTHING;
