AGRIHUB LIBERIA
Digital Agricultural Intelligence Platform
Detailed Product Requirements Document
Prepared by: Tech 231 Liberia Limited
Commissioned by: Ministry of Commerce & Industry, Republic of Liberia
Version 1.0  |  February 2025  |  CONFIDENTIAL
 
1. Executive Summary
AgriHub Liberia is a full-stack digital agricultural intelligence platform built for Tech 231 Liberia Limited, commissioned under a grant from the Ministry of Commerce & Industry, Republic of Liberia. The platform empowers rural farmers — particularly women — with real-time market prices, county-specific weather forecasts, expert agronomy guidance, and a marketplace connecting farmers to buyers.

This document defines the complete product requirements for the AgriHub Liberia web portal and Progressive Web App (PWA), covering all modules, user roles, data requirements, authentication flows, and design specifications. The platform is modeled on the Nigerian AgriConnect platform (agriconnectng.com) with full adaptation to the Liberian agricultural context.

Platform Mission
•	Giving every Liberian farmer the data advantage
•	For too long, large agribusinesses had exclusive access to price data, weather forecasts, and agronomy expertise.
•	AgriHub puts the same tools in every farmer's hands — for free.
•	Accessible via web, PWA, and USSD (*347#) for feature phones

Metric	Target
Farmers on platform	2,400+ active users
Counties covered	All 15 Liberia counties
Crops tracked	35+ Liberian crops
Platform uptime	99.9% SLA
Data range (Phase 1)	December 2023 — July 2024
USSD shortcode	*347# (MTN, Orange, Lonestar)
Deployment	Vercel (web) + PWA (mobile)
 
2. User Roles & Access Control
AgriHub Liberia supports four distinct user roles, each with scoped access to platform features.

2.1 Role Definitions
Role	Description	Access Level	Default Route
Super Admin	Tech 231 / Ministry staff managing the entire platform	Full platform access	/admin/dashboard
Extension Officer	Agricultural extension workers providing advisory support	Content + farmer management	/admin/farmers
Farmer	Registered smallholder farmers across all 15 counties	Personal dashboard + market/weather/tips	/dashboard
Buyer	Buyers and agribusinesses seeking to purchase produce	Marketplace + farmer listings	/marketplace

2.2 Pre-Seeded Accounts (Phase 1)
The following accounts must be hardcoded as seed data and fully functional on launch:

Account	Email	Password	Role	County
Super Admin	admin@agrihub.lr	Admin@2024	Super Admin	Montserrado
Farmer 1	fatu.kamara@agrihub.lr	Farmer@2024	Farmer	Bong County
Farmer 2	musu.kollie@agrihub.lr	Farmer@2024	Farmer	Nimba County
Extension Officer	james.flomo@agrihub.lr	Officer@2024	Extension Officer	Lofa County
Supplier	greenfields@agrihub.lr	Supplier@2024	Supplier	Montserrado
 
3. Authentication System
All authentication flows must be fully end-to-end functional using localStorage-based mock sessions (no real backend required for Phase 1). Users must be able to sign up, log in, and access their role-specific dashboard successfully.
3.1 Registration — 5-Step Onboarding Wizard
Modeled after the AgriConnect Nigeria onboarding modal. The registration wizard uses a dark-themed modal with a left sidebar showing step progress.

Step 1: Personal Info
•	First name + Last name
•	Phone number (with +231 Liberia country prefix selector)
•	County selector — all 15 Liberia counties
•	"Are you familiar with using mobile apps?" — Yes / Somewhat / No
•	WhatsApp number (optional — for buyer communications)

Step 2: Farm Details
•	Farm name (text input)
•	Farm size — dropdown: Under 1 acre / 1-3 acres / 3-10 acres / 10-50 acres / 50+ acres
•	What do you grow? — free text with suggestions (e.g. Tomatoes, Rice, Cassava, Yam, Plantain...)
•	How long in agriculture? — Beginner (<1yr) / Intermediate (1-5yrs) / Experienced (5+yrs)
•	What are your goals with AgriHub? — free text area

Step 3: Account Type
•	Farmer — I grow and sell produce
•	Buyer — I purchase agricultural produce
•	Extension Officer — I provide advisory services to farmers

Step 4: Payment Setup (Liberia Mobile Money)
Equivalent to the Payment Setup step on AgriConnect Nigeria, adapted for Liberia's mobile money ecosystem. This step allows farmers to receive payments from buyers directly through their mobile money wallet.

•	Section header: "How would you like to receive payments from buyers?"
•	Info callout (green box): "AgriHub uses mobile money — no bank account needed. Buyers pay directly to your wallet when your produce is sold through the marketplace."

Mobile Money Provider (radio group — select one):
◦	MTN MoMo — Most widely used across Liberia
◦	Orange Money — Strong in Monrovia and coastal counties
◦	Lonestar MoneyGO — Available on Lonestar Cell network
◦	I don't have mobile money — Show setup guide link

•	Mobile Money Number — pre-filled from phone number on Step 1 (editable)
•	Account Name — name registered on the mobile money account
•	Verify number toggle: "This is the number buyers will use to pay me"
•	Currency preference: LRD (Liberian Dollars) / USD — toggle
◦	Note shown: "Most market transactions in Liberia are in LRD. USD available for export crops (rubber, cocoa)."

•	Minimum payout threshold: "Notify me when my balance reaches L$___" — optional
•	Payment terms info box:
◦	Buyers pay via mobile money before or on delivery
◦	AgriHub does NOT hold funds — payments go directly to your wallet
◦	Transaction confirmation sent via SMS to your registered number

•	Skip option: "Set up payment later" — farmer can complete from Settings > Payment
•	Validation: if mobile money selected, number must be 8-10 digits, provider must match

Step 5: Preferences
•	Language preference: English / Kpelle / Bassa / Mende / Vai
•	Enable SMS price alerts toggle (sent to Step 1 phone number)
•	Enable weather alerts toggle
•	Enable marketplace inquiry notifications toggle
•	USSD info callout: "You can access AgriHub offline via *347# on any Liberian phone"

Step 6: Complete
•	Animated success screen with confetti (Framer Motion)
•	Summary card: name, county, account type, primary crops, mobile money provider
•	"Go to your Dashboard" button — redirects to /dashboard (farmer) or /marketplace (buyer)
•	Account stored in localStorage immediately — user is auto-logged in
•	Welcome SMS simulation: sonner toast — "Welcome to AgriHub! Dial *347# anytime for market prices."

3.2 Login Page (/auth/login)
•	Split layout: Left panel (dark green brand + logo + testimonial quote) | Right panel (white form)
•	Email/Phone input with auto-detection of format
•	Password field with show/hide toggle
•	Remember me checkbox (extends localStorage session to 30 days)
•	Error: sonner toast — "Invalid email or password"
•	Redirect logic: farmer → /dashboard | admin/officer → /admin/dashboard | buyer → /marketplace

3.3 Navigation Guards
•	Unauthenticated user visiting protected route → redirect to /auth/login?returnUrl=[path]
•	Farmer visiting /admin → redirect to /dashboard
•	Admin visiting /dashboard → redirect to /admin/dashboard
•	Buyer visiting /dashboard → redirect to /marketplace
•	Session expiry: check localStorage token expiry on every route change
 
4. Navigation & Routing
All navigation links must be fully functional. No 404 errors, no external redirects for internal pages. The Nigerian AgriConnect site had broken Company tab links (404) and Product tabs redirecting externally — AgriHub must fix all of these.

4.1 Public Navbar (unauthenticated)
Nav Item	Dropdown Items	Routes	Status
Logo / Home	—	/	Working
Product	Market Prices, Weather, Agronomy Tips, USSD Guide	/market, /weather, /tips, /resources/ussd	All internal routes
Company	About Us, Our Mission, Contact, Team	/about, /about#mission, /contact, /about#team	No 404s
Resources	Admin Portal, Farmer Guide, USSD Access, API Docs	/admin (auth-gated), /resources/guide, /resources/ussd, /resources/api	All working
Sign In	—	/auth/login	Working
Get Started	—	/auth/register	Working

4.2 Farmer App Sidebar (authenticated farmer)
•	Dashboard — /dashboard
•	Market Prices — /market
•	Weather — /weather
•	Agronomy Tips — /tips
•	My Farm — /my-farm
•	Marketplace — /marketplace
•	Alerts — /alerts
•	Settings — /settings

4.3 Admin Sidebar (authenticated admin/officer)
•	Dashboard — /admin/dashboard
•	Market Prices — /admin/prices
•	Weather Data — /admin/weather
•	Content (Tips) — /admin/content
•	Farmers — /admin/users
•	Counties — /admin/counties
•	Analytics — /admin/analytics
•	Marketplace Listings — /admin/listings
 
5. Page-by-Page Requirements
5.1 Landing Page (/)
The landing page is the primary showcase for the Ministry of Commerce grant review. It must be premium, trustworthy, and professional.

Hero Section
•	Dark green gradient background (#0f2d1a → #1a4a2e)
•	Ministry of Commerce badge: "Supported by Ministry of Commerce & Industry, Republic of Liberia"
•	Headline: "Giving every Liberian farmer the data advantage"
•	Subtext: "For too long, large agribusinesses had exclusive access to price data, weather forecasts, and agronomy expertise. AgriHub puts the same tools in every farmer's hands — for free."
•	CTA: "Get Started Free" (green filled) + "View Market Prices" (white outline)
•	Floating testimonial card (white, shadow) overlapping stats section:
◦	Quote: "I earned L$8,000 more on my rice harvest after using AgriHub."
◦	FK — Fatu K. — Bong County

Stats Bar (Dark Green Card)
•	40% — Avg. income increase
•	3x — Better price discovery
•	15 — Counties covered
•	2,400+ — Active farmers

Features Section
•	Market Prices — "Know the price before you sell across all 15 counties"
•	Weather Forecasts — "County-specific 7-day forecasts with planting alerts"
•	Agronomy Tips — "Expert guidance in your language — available offline with audio"
•	Marketplace — "Connect directly with buyers. No middlemen. Better prices."

How It Works (3 Steps)
•	1. Create your farm profile — Select county, crops, and farm size
•	2. Access your dashboard — Personalized prices, weather, and tips
•	3. Connect and earn — Sell directly to buyers, track income

Testimonials Carousel
•	Fatu Kamara — Bong County — Rice farmer — "I earned L$8,000 more on my rice harvest"
•	Musu Kollie — Nimba County — Pepper farmer — "Weather alert saved my pepper crop from heavy rain"
•	Kou Siaffa — Lofa County — Cassava farmer — "Reduced post-harvest losses from 40% to under 10%"

USSD Callout Section
•	Dark green background section
•	Large *347# display in monospace font
•	"Works on MTN, Orange, and Lonestar networks across Liberia — no internet needed"

Footer
•	AgriHub logo + tagline (white variant)
•	Navigation links: Market, Weather, Tips, About, Contact
•	"Built by Tech 231 Liberia Limited" + logo
•	"Supported by Ministry of Commerce & Industry, Republic of Liberia" + ministry seal
•	© 2025 Tech 231 Liberia Limited. All rights reserved.
5.2 Farmer Dashboard (/dashboard)
•	Greeting header: "Good morning, [First Name] 🌱" (time-based)
•	County badge showing farmer's registered county
•	My Farm Summary Card — farm name, size, crops, edit button
•	Price Watch — shows ONLY the crops farmer selected during signup
•	Market widget — current LRD price, 7-day change, sparkline trend
•	Weather card — county-specific current conditions + 7-day strip
•	Recent Activity feed — last 5 actions with timestamps
•	My Listings — placeholder: "Post your harvest for buyers"
•	Quick Access tiles — Market / Weather / Tips / Marketplace

5.3 Admin Dashboard (/admin/dashboard)
•	KPI row: Total Farmers / Active Today / USSD Sessions / Counties Active
•	Farmer signups chart — Dec 2023 to July 2024 (Recharts LineChart)
•	County breakdown bar chart — users per county
•	Most searched crops — horizontal bar chart
•	Farmer management table — all users with Activate/Deactivate toggle
•	Price management — edit prices inline, view last updated timestamp
•	Recent admin activity log

5.4 Market Prices (/market)
•	Filter bar: Crop search / County selector / Date range (Dec 2023 - Jul 2024) / Category tabs
•	Price table: Crop | Market | Price (LRD) | USD Equiv | 7d Change | Trend sparkline | Updated
•	Sortable columns, 20 rows per page, pagination
•	Row click → price detail drawer (shadcn Sheet)
•	Price trend chart — Recharts LineChart, 30-day rolling, multi-county comparison
•	Top Gainers / Top Losers widget (3 each)
•	Liberia county SVG map — color-coded by price level for selected crop
•	Export CSV button

5.5 Weather (/weather)
•	County selector — persistent across session
•	Current conditions hero card: temp, feels-like, humidity, wind, UV index, rain chance
•	7-day forecast strip — scrollable on mobile
•	Hourly forecast chart — Recharts AreaChart (24 hours)
•	Agricultural alerts panel: planting windows, harvest conditions, risk warnings
•	30-day historical rainfall bar chart

5.6 Agronomy Tips (/tips)
•	Category grid: Rice | Cassava | Vegetables | Soil Health | Pest Control | Post-Harvest
•	Featured tip hero card with background image and gradient overlay
•	Tips grid: 3-col desktop / 1-col mobile
•	Each card: image, category badge, title, summary, read time, audio badge, save button
•	Individual tip page (/tips/[slug]):
◦	Hero image, category, read time, publish date
◦	Audio player UI (EN / Kpelle / Bassa language selector)
◦	Step-by-step numbered sections
◦	Related tips (3 cards)
◦	Save and Share buttons

5.7 Marketplace (/marketplace)
The Marketplace is a first-class module — not secondary. It is the primary economic engine of AgriHub, connecting Liberian farmers directly to buyers, eliminating middlemen and improving farm-gate prices. All communication and payment flows are adapted for Liberia's infrastructure: WhatsApp + MTN MoMo / Orange Money / Lonestar MoneyGO.

5.7.1 Marketplace Landing (Buyer View)
•	Header: "Fresh Produce from Liberian Farmers — Direct. No Middlemen. Better Prices."
•	Filter bar: Crop type / County / Price range / Availability date / Quantity
•	Listing cards in grid (3-col desktop, 1-col mobile):
◦	Crop name + emoji + category badge
◦	County and market location (e.g. "Gbarnga Market, Bong County")
◦	Quantity available (e.g. "120 kg available")
◦	Price: L$ per kg / bunch / piece (with USD equivalent in smaller text)
◦	Harvest date / Available from date
◦	Farmer badge: initials avatar + "Verified Farmer" green badge
◦	"Contact Farmer" button — opens WhatsApp/mobile money flow
•	Sort by: Newest / Price: Low to High / Quantity / County
•	Featured listings section at top (admin-promoted listings)

5.7.2 Listing Detail Page (/marketplace/[id])
•	Full listing detail: crop, quantity, price, location, availability, farmer bio
•	Price comparison widget: "Market average for this crop in [county]: L$XXX/kg"
•	Farmer profile (partial — privacy protected):
◦	First name + last initial only (e.g. "Fatu K.")
◦	County + farming experience level
◦	Member since date + listings count + "Verified Farmer" badge
•	Contact options section:
◦	Primary: WhatsApp button (opens wa.me/+231XXXXXXXX with pre-filled message)
◦	Secondary: "Call via Lonestar/MTN/Orange" — shows masked number on click
◦	USSD note: "Can't use WhatsApp? Dial *347*LISTING_CODE# to get farmer's number via SMS"
•	Payment info box: "This farmer accepts MTN MoMo / Orange Money"
•	Report listing button (flag inappropriate content)

5.7.3 WhatsApp Communication Flow (Liberia Context)
WhatsApp is the primary buyer-seller communication channel in Liberia, used across all income levels and counties. The platform must deeply integrate WhatsApp as the default contact method.

•	Farmer provides WhatsApp number during onboarding Step 1 (separate from main phone)
•	"Contact Farmer" button generates pre-filled WhatsApp message:
◦	"Hi [Farmer Name], I found your [Crop] listing on AgriHub Liberia. I'm interested in buying [X] kg at L$[price]/kg. Are you available?"
◦	Opens wa.me/+231[number]?text=[encoded message] in new tab
•	If farmer has no WhatsApp: show phone number with network indicator (MTN/Orange/Lonestar)
•	WhatsApp status indicator on listing cards: green dot = has WhatsApp / gray dot = call only
•	Buyer can also send inquiry via platform (stored in localStorage, notifies via sonner):
◦	"Your inquiry has been sent. The farmer will contact you on WhatsApp within 24 hours."

5.7.4 Payment Flow (Mobile Money — Liberia)
AgriHub does not process payments directly. It facilitates mobile money payments between farmers and buyers using Liberia's existing mobile money infrastructure.

Step	Action	Method
1	Buyer finds listing and contacts farmer via WhatsApp	WhatsApp
2	Farmer and buyer agree on quantity, price, and delivery terms via WhatsApp	WhatsApp chat
3	Buyer sends payment to farmer's mobile money number	MTN MoMo / Orange Money / Lonestar MoneyGO
4	Farmer receives SMS confirmation of payment	Mobile network SMS
5	Farmer marks listing as "Sold" or reduces available quantity on AgriHub	AgriHub platform
6	Both parties can leave a review (Phase 2)	AgriHub platform

•	Payment info displayed on each listing:
◦	Accepted: MTN MoMo / Orange Money / Lonestar MoneyGO (icons)
◦	Currency: LRD primary, USD accepted for export crops (rubber, cocoa)
◦	"How to pay" expandable guide with step-by-step mobile money instructions
•	Platform shows mobile money number only after buyer clicks "Contact Farmer" (privacy protection)

5.7.5 Farmer — Post a Listing (/my-farm → Post to Marketplace)
•	"Post Harvest for Sale" button on My Farm page and Dashboard
•	Listing form fields:
◦	Crop — pre-populated from their farm profile crops (editable)
◦	Quantity available (number + unit: kg / bunch / bags / pieces)
◦	Price per unit in LRD (market price auto-suggested from current data)
◦	USD price (auto-calculated at current exchange rate, editable)
◦	Location: county auto-filled from profile + market name input
◦	Available from date — date picker
◦	Available until date — optional
◦	Description / notes — free text
◦	Mobile money: confirm which provider to receive payment (from profile, editable)
◦	WhatsApp contact: confirm WhatsApp number for buyer contact
•	Listing preview before submission
•	Live on marketplace within seconds (localStorage update)
•	Farmer can edit / mark as sold / delete listing from My Farm page

5.7.6 Admin Marketplace Management (/admin/listings)
•	All listings table: Farmer / Crop / County / Quantity / Price / Status / Posted / Actions
•	Status badges: Active / Sold / Expired / Flagged / Removed
•	Feature listing toggle — promoted listings appear at top of marketplace
•	Remove / flag listing for inappropriate content
•	Marketplace analytics: total listings / sold / active / top crops / top counties

5.8 My Farm (/my-farm)
•	Farm profile card: name, county, size, primary crops — editable
•	Crop tracker table: Crop / Area / Planted / Expected Harvest / Status / Market Price / Est. Value
•	Status badges: Growing / Ready Soon / Harvested / Failed
•	Add Crop modal — full Zod-validated form
•	Income Estimator chart — 6-month projection (Recharts BarChart)
•	Weather impact panel — county-specific alerts for farmer's active crops
•	Post to Marketplace button — creates listing from active crop

5.9 Alerts (/alerts)
•	Alert tabs: All / Weather / Price / Agronomy / System
•	Alert items: severity border (red/amber/blue) / icon / title / description / time / read state
•	Mark read / Dismiss actions
•	Alert preferences: toggles per category, delivery method (Push / SMS)
•	PWA install banner (dismissible)

5.10 About (/about)
•	Mission statement section (matching dark green card style from Nigeria site)
•	Platform stats: 40% income increase / 3x price discovery / 15 counties / 2,400+ farmers
•	About Tech 231 Liberia Limited — company overview
•	Ministry of Commerce partnership section
•	Team section placeholder

5.11 Contact (/contact)
•	Contact form: Name / Email / Phone / Subject / Message
•	Form submission stores to localStorage + shows success sonner toast
•	Address: Monrovia, Liberia
•	Email: info@agrihub.lr
•	USSD support: *347# on any phone

5.12 Resources Pages
•	/resources/guide — Farmer's Guide to AgriHub (step-by-step article)
•	/resources/ussd — USSD Guide: How to access *347# features
•	/resources/api — API documentation placeholder (for developer partners)
 
5A. AI-Powered Crop Advisor (Liberia Context)
Matching AgriConnect Nigeria's AI-powered crop insights feature, adapted for Liberia's agricultural zones, seasonal calendar, and crop economics. Phase 1 uses rule-based logic with mock data — no real ML model required. Phase 2 integrates a real AI/ML API.

5A.1 AI Advisor Dashboard Widget
Prominent card on farmer dashboard titled "Your AI Farm Advisor" with a green brain/leaf icon:
•	Personalized greeting: "Based on your farm in Bong County, here are today's recommendations:"
•	3 AI insight cards shown daily, rotating based on season and price data:
◦	Planting Recommendation — best crop to plant now based on county, season, and current prices
◦	Price Opportunity — crop showing price surge in farmer's county in the last 7 days
◦	Risk Alert — weather or pest risk relevant to farmer's active crops
•	"View Full AI Report" link → /ai-advisor

5A.2 AI Advisor Full Page (/ai-advisor)
Planting Intelligence
•	Current season detection: Dry Season (Nov-Apr) / Rainy Season (May-Oct)
•	County-specific planting calendar — which crops to plant NOW vs wait
•	Rule logic (Phase 1 mock):
◦	Dry season + Montserrado/coastal counties → recommend: Garden Egg, Pepper, Okra with irrigation
◦	Dry season + interior counties (Nimba, Lofa, Bong) → recommend: Yam, Cassava (drought tolerant)
◦	Start of rainy season (May) → recommend: Rice (upland), Groundnut, Maize across all counties
◦	Peak rainy season (Jul-Sep) → recommend: Swamp rice, Cassava, Cocoyam
•	Confidence score shown: High / Medium / Low with explanation
•	"Why this recommendation?" expandable explanation in plain language

Price Intelligence
•	"Best crops to sell THIS WEEK" — top 5 crops by 7-day price increase in farmer's county
•	"Best market to sell in" — compare prices across 3 nearest counties for farmer's crops
•	Price forecast: simple 30-day projection using trend extrapolation from Dec 2023-Jul 2024 data
•	"If you sell [X] kg of Rice today vs waiting 2 weeks, estimated difference: +L$X,XXX"
•	Export crop opportunity alert: Rubber and Cocoa — show USD price vs LRD equivalent

Crop Health Insights
•	Seasonal pest and disease calendar for Liberia:
◦	Jan-Mar (harmattan): watch for cassava mosaic virus, aphids on vegetables
◦	Apr-May (pre-rain): treat soil before planting, fall armyworm risk for maize
◦	Jun-Aug (heavy rain): fungal diseases, root rot in poorly drained fields
◦	Sep-Oct (harvest prep): storage pest prevention, aflatoxin risk in groundnuts
•	Alert shown if farmer's active crops match current seasonal risk
•	Link to relevant agronomy tip article for each alert

Income Optimizer
•	"What if" simulator — farmer inputs: crop, quantity, county, target date
•	Output: estimated income in LRD and USD at projected price
•	Compare: sell fresh vs process (e.g. cassava → gari, palm fruit → palm oil)
•	Intercropping suggestion: "Planting groundnuts between your cassava rows could add L$X,XXX per season"

5A.3 AI Advisor in Admin Portal (/admin/ai-insights)
•	Platform-wide AI summary: top recommended crops by county this season
•	Price trend heatmap: which crops are rising / falling fastest across Liberia
•	Extension officers can push AI recommendations to all farmers in a county
•	"Broadcast advisory" button: sends alert to all farmers in selected county
 
5B. Inventory Management (Liberia Context)
Matching AgriConnect Nigeria's inventory management module. Tracks produce stock from harvest through sale. Designed for Liberian smallholder farmers with limited literacy — visual, simple, and in LRD currency throughout.

5B.1 Farmer Inventory Page (/inventory)
Accessible from sidebar and My Farm page. Tracks all produce the farmer currently has in stock.

Inventory Dashboard
•	Total stock value card: "Your current inventory is worth approx. L$XX,XXX"
•	Low stock alerts: "Your pepper stock is running low — only 12 kg remaining"
•	Expiry warnings: "Your tomatoes were harvested 8 days ago — sell or process soon"
•	Quick actions: Add Harvest / Record Sale / Record Loss / Transfer to Marketplace

Stock Table
Column	Description	Example
Crop	Crop name + category badge	Hot Pepper (Vegetable)
Quantity	Current stock amount + unit	45 kg
Harvested	Date harvested	Feb 12, 2024
Storage	Where stored (Home / Market / Cooperative)	Gbarnga Market Store
Est. Value	Quantity x current market price in LRD	L$8,325
Status	Fresh / Aging / Critical / Sold	Fresh (6 days)
Actions	Edit / Sell / Record Loss / Post to Market	Buttons

Add Harvest Record
•	Crop selector (from farmer's registered crops — pre-filled)
•	Quantity + unit (kg / bunches / bags / pieces / liters)
•	Harvest date picker
•	Storage location: Home Storage / Local Market / Cooperative Store / Field
•	Quality grade: Grade A (premium) / Grade B (standard) / Grade C (processing only)
•	Notes (optional): pests observed, processing done, special handling notes
•	Auto-calculates estimated value using current market price for that crop in farmer's county

Record a Sale
•	Select crop from inventory
•	Quantity sold + price received per unit in LRD
•	Buyer type: Individual / Trader / Cooperative / Export
•	Payment received via: Cash / MTN MoMo / Orange Money / Lonestar MoneyGO
•	Auto-updates stock level and records transaction in income history
•	Option: "This was a marketplace sale" — links to marketplace listing

Record a Loss
•	Select crop + quantity lost
•	Loss reason: Spoilage / Pest Damage / Flood / Theft / Other
•	Date of loss
•	Loss recorded in analytics — helps Ministry track post-harvest losses across Liberia

5B.2 Inventory Analytics (Farmer)
•	Monthly income chart — sales recorded this month vs last month (LRD)
•	Crop performance: which crops generated most income in last 6 months
•	Loss tracker: total losses by reason (spoilage vs pest vs other)
•	"Your biggest post-harvest loss is spoilage — see tips to reduce it" → links to tip article

5B.3 Admin Inventory Overview (/admin/inventory)
•	Aggregate inventory across all farmers on platform
•	County-level supply map: which counties have surplus of which crops
•	Supply vs demand matching: alert when buyer demand exceeds available farmer inventory
•	Post-harvest loss report: export CSV for Ministry of Commerce reporting
•	"At-risk inventory" list: produce nearing spoilage that needs urgent buyer matching
 
5C. Supplier / Agro-Dealer Module (Liberia Context)
Matching AgriConnect Nigeria's supplier role. In Liberia, agro-dealers supply farming inputs — seeds, fertilizers, pesticides, tools, and equipment — to smallholder farmers. Many are based in county capitals (Gbarnga, Voinjama, Sanniquellie) and serve surrounding rural areas. AgriHub connects farmers directly to verified agro-dealers, reducing travel costs and ensuring input availability.

5C.1 Supplier Registration (Extended Onboarding)
Supplier selects "Supplier / Agro-Dealer" in Step 3 of registration. Additional fields appear:
•	Business name (e.g. "Green Fields Agro-Supplies, Gbarnga")
•	Business registration number (optional — for verified badge)
•	County + town/market location
•	Types of inputs supplied (multi-select):
◦	Seeds — Rice, Cassava stems, Vegetable seeds, Groundnut seeds
◦	Fertilizers — NPK, Urea, Compost, Lime
◦	Pesticides & Herbicides — insecticides, fungicides, weedkillers
◦	Tools & Equipment — hoes, cutlasses, sprayers, wheelbarrows
◦	Post-Harvest Supplies — storage bags, drying tarps, weighing scales
•	Delivery capability: In-store pickup only / Delivery within county / Nationwide delivery
•	Mobile money: MTN MoMo / Orange Money / Lonestar MoneyGO for receiving payments
•	WhatsApp number for order inquiries

5C.2 Supplier Dashboard (/supplier/dashboard)
•	Header: "Good morning, [Business Name] — AgriHub Supplier Portal"
•	KPI row: Active Listings / Inquiries This Week / Orders Fulfilled / Rating
•	Active input listings table with stock levels
•	Pending inquiries from farmers (via WhatsApp or platform)
•	Low stock alerts: "Your NPK fertilizer stock is below 10 bags"
•	"Add New Product" button — opens product listing form

5C.3 Input Catalog (/inputs)
Public page accessible by all farmers — browse farming inputs available from verified suppliers near them.
•	Filter: Input type / County / Price range / Supplier rating / In stock only
•	Input listing card:
◦	Product name + category (seed/fertilizer/tool/etc.)
◦	Supplier name + county + "Verified Supplier" badge (if registered)
◦	Price in LRD + unit (per kg / per bag / per piece)
◦	Stock status: In Stock / Low Stock / Out of Stock
◦	"Contact Supplier" button → WhatsApp pre-filled message
◦	Delivery info: Pickup only / Delivers to [county]

Pre-Seeded Supplier Catalog (Seed Data)
Product	Supplier	County	Price (LRD)	Unit
Improved Rice Seed (NERICA)	Green Fields Agro	Bong	L$480	per kg
Cassava Stems (TME-419)	Green Fields Agro	Bong	L$120	per bundle
NPK Fertilizer (15-15-15)	Liberia Agro Supplies	Montserrado	L$2,200	per 50kg bag
Urea Fertilizer (46%N)	Liberia Agro Supplies	Montserrado	L$1,850	per 50kg bag
Hand Sprayer (16L)	AgriTools Nimba	Nimba	L$3,500	each
Storage Bags (PP Woven)	AgriTools Nimba	Nimba	L$95	each
Hot Pepper Seeds (local)	Lofa Seed Bank	Lofa	L$220	per 100g
Vegetable Seed Pack (mixed)	Lofa Seed Bank	Lofa	L$380	per pack
Cutlass (heavy duty)	Monrovia Hardware	Montserrado	L$850	each
Weighing Scale (50kg)	Monrovia Hardware	Montserrado	L$4,200	each

5C.4 Input Purchase Flow
•	Same WhatsApp + mobile money flow as marketplace (no direct checkout in Phase 1)
•	Farmer clicks "Contact Supplier" → WhatsApp pre-filled:
◦	"Hi [Supplier Name], I found your [Product] on AgriHub. I'd like to order [qty] at L$[price]. Are you available?"
•	Payment via MTN MoMo / Orange Money / Lonestar MoneyGO direct to supplier
•	Supplier marks order as fulfilled — updates stock count

5C.5 Admin Supplier Management (/admin/suppliers)
•	All suppliers table: Business name / County / Input types / Status / Joined / Actions
•	Verify supplier: "Verified Supplier" badge awarded after admin review
•	Suspend / Remove supplier for policy violations
•	Input availability report: aggregate supply by county for Ministry reporting
 
5D. Produce Quality Verification (Liberia Context)
Matching AgriConnect Nigeria's imagery-based quality assessment feature. AgriHub uses photo-based quality grading to build buyer trust and help Liberian farmers command better prices for verified high-quality produce. Phase 1 is admin-reviewed. Phase 2 can integrate AI image recognition.

5D.1 Quality Badge System
Badge	Color	Meaning	How Earned
Verified Quality — Grade A	Green shield	Premium produce, inspection passed	Admin reviews farmer-submitted photo + details
Verified Quality — Grade B	Blue shield	Standard quality, meets market requirements	Admin review — minor imperfections allowed
Processing Grade	Gray shield	Suitable for processing only (gari, palm oil, etc.)	Admin review — not for direct fresh sale
Unverified	No badge	Listing has no quality review	Default for all new listings

5D.2 Farmer — Submit for Quality Verification
Button on marketplace listing: "Request Quality Verification" — visible to farmers on their own listings.
•	Upload photo of produce (mobile camera — accept jpg/png/webp, max 5MB)
•	Photo guidance shown: "Take a clear photo showing the produce spread out. Good lighting. No packaging covering the produce."
•	Quantity submitted for inspection: [number] kg / bunches / bags
•	Describe quality: free text — "No visible pests, harvested yesterday, Grade A"
•	Storage conditions: Freshly harvested / Home storage / Market store / Cold storage
•	Submission status badge: "Pending Review" (yellow) shown on listing
•	Farmer receives sonner notification when review is complete

5D.3 Admin — Quality Review Dashboard (/admin/quality)
•	Queue of pending verification requests
•	Review card: farmer name, county, crop, quantity, photo (full-size view), farmer's description
•	Admin action buttons:
◦	Approve Grade A — awards green verified badge on listing
◦	Approve Grade B — awards blue verified badge
◦	Approve Processing Grade — awards gray badge with note
◦	Reject — sends farmer feedback message explaining reason
•	Review notes field — feedback sent to farmer on approval or rejection
•	SLA target: review within 48 hours of submission
•	Quality review history log per farmer

5D.4 Quality Badges on Marketplace
•	Badge displayed prominently on listing card and detail page
•	Buyer filter: "Verified Quality only" toggle on marketplace filter bar
•	"Why trust this badge?" expandable info: "AgriHub's team reviewed a photo of this produce and confirmed its quality grade."
•	Verified listings ranked higher in default sort order
•	Price premium suggestion: "Grade A verified produce typically sells L$15-30/kg above market average"

5D.5 Quality Analytics (/admin/analytics → Quality tab)
•	Total verifications completed this month
•	Grade distribution: % Grade A / Grade B / Processing / Rejected
•	County quality map: which counties produce highest Grade A ratio
•	Crop quality breakdown: which crops have highest verification success rate
•	Impact metric: "Farmers with verified listings earn on average 18% more per kg"
 
6. Data Requirements
6.1 Data Date Range
ALL market price data must fall within December 1, 2023 — July 31, 2024. This is Phase 1 historical data. Real-time data integration is Phase 2.

6.2 Liberia Counties (All 15)
County	Capital	Region	Climate Type
Bomi	Tubmanburg	Coastal	Tropical wet
Bong	Gbarnga	Central	Semi-tropical
Gbarpolu	Bopolu	Interior	Tropical inland
Grand Bassa	Buchanan	Coastal	Tropical wet
Grand Cape Mount	Robertsport	Coastal	Tropical wet
Grand Gedeh	Zwedru	Interior	Tropical inland
Grand Kru	Barclayville	Coastal	Tropical wet
Lofa	Voinjama	Interior	Tropical highland
Margibi	Kakata	Central	Semi-tropical
Maryland	Harper	Coastal	Tropical wet
Montserrado	Bensonville	Coastal	Tropical wet
Nimba	Sanniquellie	Interior	Tropical highland
River Cess	Cestos City	Coastal	Tropical wet
River Gee	Fish Town	Coastal	Tropical wet
Sinoe	Greenville	Coastal	Tropical wet

6.3 Crop Catalog (35+ Crops)
Category	Crops	Price Range (LRD/kg)	Unit
Grains	Rice, Corn/Maize, Sorghum, Millet	L$95 - L$380	kg
Vegetables	Okra, Hot Pepper, Tomato, Eggplant, Cabbage, Onion, Garden Egg, Bitter Ball	L$45 - L$250	kg
Fruits	Plantain, Banana, Pineapple, Mango, Papaya, Watermelon, Coconut, Avocado	L$25 - L$220	bunch/piece
Legumes	Groundnut, Cowpea, Soybeans, Pigeon Pea	L$120 - L$240	kg
Cash Crops	Rubber, Cocoa, Coffee, Palm Oil, Palm Kernel, Sugar Cane	L$20 - L$420	kg/liter
Root Crops	Cassava, Sweet Potato, Yam, Cocoyam, Irish Potato	L$40 - L$185	kg

6.4 Price Data Generation Rules
•	Montserrado prices: 15-20% higher than rural county average
•	Interior counties (Nimba, Lofa, Gbarpolu): 15-25% lower than Montserrado
•	Coastal counties: within 10% of Montserrado
•	7-day trend arrays: natural fluctuation ±5% per day
•	30-day historical arrays: gradual seasonal progression
•	Rice price trajectory: L$260/kg (Dec 2023) → L$320/kg (Jul 2024)
•	Cocoa price trajectory: L$290/kg (Dec 2023) → L$380/kg (Jul 2024)
•	Cassava price trajectory: L$38/kg (Dec 2023) → L$52/kg (Jul 2024)

6.5 Weather Data
•	Coastal counties: 27-32°C, humidity 80-90%, current season: dry (February)
•	Interior counties: 24-30°C, humidity 65-80%, harmattan winds
•	7-day forecast per county with: temp high/low, condition, rain chance, wind speed
•	24-hour hourly forecast for charts
•	30-day historical rainfall (mm per day)
•	Agricultural alerts: planting windows, harvest conditions, risk warnings

6.6 Agronomy Content (20 Articles)
#	Title	Category	Audio
1	How to Maximize Cassava Yield During Liberia's Rainy Season	Cassava	Yes
2	Wet Rice Cultivation: A Complete Guide for Liberian Farmers	Rice	Yes
3	Intercropping Cassava with Groundnuts: Doubling Your Income Per Acre	Cassava	Yes
4	Managing Fall Armyworm in Maize Crops	Pest Control	Yes
5	Compost Making with Local Materials: Turn Waste into Fertilizer	Soil Health	Yes
6	Upland Rice vs. Swamp Rice: Which is Right for Your Farm?	Rice	No
7	Post-Harvest Storage to Reduce Cassava Losses by 60%	Post-Harvest	No
8	Identifying and Controlling Cassava Mosaic Virus	Pest Control	No
9	Raised Bed Gardening for Vegetables in the Dry Season	Vegetables	No
10	Palm Oil Processing: Improving Yield and Quality	Cash Crops	No
11	Soil Testing at Home: Simple Methods Every Farmer Should Know	Soil Health	No
12	Integrated Pest Management for Smallholder Farmers	Pest Control	No
13	Water Harvesting Techniques for Dry Season Farming	Soil Health	No
14	Cover Cropping to Restore Soil Fertility	Soil Health	No
15	Vegetable Seed Saving: Reduce Input Costs Yearly	Vegetables	No
16	Cocoa Fermentation and Drying: Getting Premium Prices	Cash Crops	No
17	Rubber Tapping Best Practices for Maximum Yield	Cash Crops	No
18	Fish Farming Integration with Crop Farming (Aquaculture)	Other	No
19	Solar Dryers for Post-Harvest Preservation	Post-Harvest	No
20	Women Farmer Cooperative Pricing Strategies	Other	No
 
7. Technical Requirements
7.1 Tech Stack
Layer	Technology	Version	Notes
Framework	Next.js (App Router)	15.x	TypeScript strict mode
Styling	Tailwind CSS + shadcn/ui	v4	Custom brand tokens
PWA	next-pwa	Latest	Offline support + service worker
Charts	Recharts	Latest	All wrapped in ResponsiveContainer
Animations	Framer Motion	Latest	Page transitions + modals
State	Zustand	Latest	Global store
Forms	React Hook Form + Zod	Latest	Full validation
Notifications	Sonner	Latest	Replaces deprecated toast
Icons	Lucide React	Latest	No emoji icons in UI
Package Manager	pnpm	Latest	Monorepo-friendly
Deployment	Vercel	—	vercel.json configured

7.2 Authentication (Phase 1 — Mock)
•	localStorage-based session storage: { user, role, token, expiresAt }
•	useAuth() hook checking localStorage on every mount
•	Session TTL: 24 hours default / 30 days with "Remember me"
•	Password: stored as plain string in mock (Phase 2: bcrypt hash)
•	New signups stored in localStorage under key: agrihub_users
•	Login checks: localStorage users array first, then hardcoded seed accounts
•	Auto-login after successful registration

7.3 PWA Configuration
•	manifest.json: name, short_name, theme_color (#16A34A), background_color (#F9FAFB)
•	Service worker caches: market data (1hr TTL), weather (30min TTL), tips (7 days TTL)
•	Offline fallback page: /offline — shows cached data with last sync time
•	PWA install banner component — detects beforeinstallprompt event
•	App icons: 72, 96, 128, 144, 152, 192, 384, 512px PNG

7.4 Design System
Token	Value	Usage
Primary Green	#16A34A	Buttons, active states, links
Dark Green	#14532D	Hero sections, headings
Light Green	#DCFCE7	Badges, hover backgrounds
Background	#F9FAFB	Page backgrounds
Surface	#FFFFFF	Cards, modals, inputs
Text Primary	#111827	Body text, headings
Text Secondary	#6B7280	Captions, subtitles
Border	#E5E7EB	Card borders, dividers
Dark Sidebar	#111827	Admin + farmer sidebar
Danger	#EF4444	Errors, destructive actions
Warning	#F59E0B	Alert indicators

7.5 Responsive Breakpoints
•	375px — Mobile primary (PWA target)
•	640px — Large mobile
•	768px — Tablet
•	1024px — Laptop
•	1280px — Desktop
•	1440px — Large desktop

7.6 Performance Requirements
•	next/image for all images — no raw <img> tags
•	dynamic(() => import(...)) for chart components
•	Skeleton screens for all async data (no spinners)
•	Debounce all search inputs (300ms)
•	useMemo for expensive data transformations
•	Target Lighthouse score: Performance >85, Accessibility >90
 
8. Issues from Nigerian Platform — Must Fix in AgriHub
The following issues were identified on the Nigerian AgriConnect platform (agriconnectng.com). AgriHub Liberia must resolve all of these:

Issue	Location on NG Site	AgriHub Fix Required
Product Tab links redirect to external site	Top navbar > Product	All Product links must route internally to /market, /weather, /tips, /resources/ussd
Company Tab returns 404 errors	Top navbar > Company	Build /about and /contact pages fully. No broken links.
Resources — only Admin Portal works	Top navbar > Resources	Build /resources/guide and /resources/ussd as full content pages
Admin portal accessible without login	agriconnectng.com/dashboard	All /admin routes must require admin role auth, redirect to login if unauthenticated
No working end-to-end signup flow	Registration	Full 5-step signup must result in working account that can log in and view personalized dashboard
No pre-built farmer accounts to demo	Platform demo	Seed 2 farmer accounts + 1 admin that work immediately without signup
Data not localized to platform region	All price/crop data	All data must be Liberian: LRD currency, Liberia counties, Liberian crops

9. Implementation Order
Build in this exact order — complete each item fully before proceeding:

Phase	Items	Priority
1 — Foundation	Package setup, Tailwind config, TypeScript types, mock data layer (all 6 files), Zustand store, utility functions	Critical
2 — Components	Logo, PoweredBy, AppShell, AdminShell, MobileBottomNav, StatCard, DataTable, EmptyState, LoadingSkeleton, CountySelector, CropBadge, QualityBadge	Critical
3 — Auth	Login page, Registration 6-step wizard (incl. Payment Setup), Navigation guards, localStorage session management — all 5 roles	Critical
4 — Landing Page	Full landing page with hero, stats, features, how it works, testimonials, USSD callout, footer — WOW FACTOR for Ministry demo	Critical
5 — Farmer App	Dashboard (with AI widget), Market Prices, Weather, Agronomy Tips, My Farm, Inventory, AI Advisor, Marketplace, Alerts, Settings	High
6 — Supplier Portal	Supplier dashboard, Input catalog (/inputs), Add/Edit listings, Order inquiries	High
7 — Admin Portal	Admin dashboard, Price mgmt, Content mgmt, User mgmt, Supplier mgmt, Quality review queue, County mgmt, Analytics, AI Insights	High
8 — Public Pages	About, Contact, Resources (Guide + USSD + API)	Medium
9 — PWA	manifest.json, service worker, offline page, install banner, app icons	Medium
10 — Final Pass	Dark mode, Framer Motion animations, accessibility audit, responsive testing, Lighthouse audit	Low

10. Seed Data Summary
•	5 pre-built user accounts (1 admin, 1 extension officer, 2 farmers, 1 supplier)
•	35 crops with 8-month price history (Dec 2023 - Jul 2024)
•	All 15 Liberia counties with capitals and climate data
•	20 agronomy articles (5 with audio placeholders)
•	15 alert notifications (weather, price, agronomy, system)
•	Weather forecasts for all 15 counties
•	5 marketplace listings with quality badges (posted by seeded farmer accounts)
•	10 supplier input catalog listings (seeds, fertilizers, tools) across 4 mock suppliers
•	3 pre-seeded inventory records per farmer (harvested crops with stock levels)
•	5 AI advisor recommendations (rule-based, one per crop category)
•	3 quality verification examples (1 Grade A, 1 Grade B, 1 pending review)
•	Admin activity log (10 recent entries)

11. Delivery Milestones
Milestone	Deliverable	Target
M1	Project setup + mock data layer (incl. inventory, supplier, AI, quality data) + auth system (all 5 roles) working end-to-end	Week 1
M2	Landing page (WOW factor) + auth pages fully functional + 6-step registration with payment setup	Week 1-2
M3	Farmer dashboard (with AI widget) + Market + Weather + Tips + Inventory + AI Advisor pages	Week 2-3
M4	Marketplace (with quality badges) + Supplier portal + Input catalog (/inputs)	Week 3
M5	Admin portal (all 9 sub-pages incl. quality review queue, supplier mgmt, AI insights)	Week 3-4
M6	PWA config + offline page + all public pages (About, Contact, Resources)	Week 4
M7	Final polish: animations, dark mode, accessibility, Vercel deployment, Ministry demo prep	Week 4-5

Document Sign-Off
Role	Name	Organization	Date
Prepared by	Tech 231 Development Team	Tech 231 Liberia Limited	February 2025
Reviewed by		Tech 231 Liberia Limited	
Approved by		Ministry of Commerce & Industry	


AgriHub Liberia — Giving every Liberian farmer the data advantage.
Tech 231 Liberia Limited | Innovation + Simplicity
