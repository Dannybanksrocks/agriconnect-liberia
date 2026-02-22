export interface AIResponse {
  answer: string
  tips?: string[]
  relatedTopics?: string[]
  confidence: 'high' | 'medium' | 'low'
  source: string
}

interface KnowledgeRule {
  patterns: RegExp[]
  respond: (context: AdvisorContext) => AIResponse
}

export interface AdvisorContext {
  county: string
  season: 'Dry Season' | 'Rainy Season'
  month: number
}

export function getCurrentContext(county = 'Montserrado'): AdvisorContext {
  const month = new Date().getMonth() + 1
  return {
    county,
    season: month >= 5 && month <= 10 ? 'Rainy Season' : 'Dry Season',
    month,
  }
}

const COUNTY_SOILS: Record<string, string> = {
  Montserrado: 'clayey loam — good for rice and vegetables',
  Bong: 'deep red laterite — excellent for cassava, upland rice',
  Nimba: 'fertile alluvial — ideal for cocoa, coffee, vegetables',
  Lofa: 'humus-rich forest soil — perfect for cocoa and rubber',
  Margibi: 'sandy loam — best for cassava, sweet potato, groundnuts',
  Grand_Bassa: 'alluvial river soil — excellent for wetland rice',
  Maryland: 'coastal sandy — good for coconut, pepper, cassava',
  Sinoe: 'mixed red clay — suitable for palm oil, rubber',
  RiverCess: 'forest loam — good for cocoa and subsistence crops',
  GrandKru: 'rocky coastal — cassava, pepper, coconut',
  GrandGedeh: 'deep tropical soil — cocoa, rubber, palm oil',
  GrandCapeMount: 'coastal clay — wetland rice, fish farming',
  Gbarpolu: 'rich forest soil — upland rice, cassava, vegetables',
  RiverGee: 'alluvial — wetland rice, vegetables',
  Rivercess: 'forest loam — cassava, cocoa',
}

function getSoil(county: string): string {
  const key = county.replace(/\s+/g, '_')
  return COUNTY_SOILS[key] ?? 'tropical laterite soil — suitable for most Liberian crops'
}

const CROP_CALENDAR: Record<string, { plant: string; harvest: string; tip: string }> = {
  rice: { plant: 'March–May (upland) / May–June (lowland)', harvest: 'August–October', tip: 'Use NERICA varieties for 30% higher yield' },
  cassava: { plant: 'April–June', harvest: '8–18 months after planting', tip: 'Plant on mounds to prevent waterlogging' },
  maize: { plant: 'March–April (1st) / July–August (2nd)', harvest: '90–120 days after planting', tip: 'Apply NPK fertilizer at 3 weeks and 6 weeks' },
  pepper: { plant: 'February–April (nursery)', harvest: 'July–September', tip: 'Stake plants at 30cm height for better yield' },
  groundnut: { plant: 'April–June', harvest: 'August–October', tip: 'Inoculate seeds with rhizobium for nitrogen fixation' },
  plantain: { plant: 'Any time with irrigation', harvest: '9–12 months', tip: 'Desuck to keep only 3 generations per stool' },
  cocoa: { plant: 'May–June (rainy season)', harvest: 'October–March', tip: 'Prune canopy to 4m for easier harvesting' },
  palm: { plant: 'Year-round with nursery', harvest: '3–4 years first yield', tip: 'Apply potassium-rich fertilizer for bunch formation' },
  sweet_potato: { plant: 'March–April', harvest: '3–5 months', tip: 'Harvest before heavy rains to prevent rot' },
  rubber: { plant: 'April–June', harvest: '5–7 years (tapping)', tip: 'Use Tapping panel D/3 system for longest life' },
}

function findCrop(text: string): string | null {
  const map: Record<string, string> = {
    rice: 'rice', cassava: 'cassava', maize: 'maize', corn: 'maize',
    pepper: 'pepper', groundnut: 'groundnut', peanut: 'groundnut',
    plantain: 'plantain', banana: 'plantain', cocoa: 'cocoa',
    chocolate: 'cocoa', palm: 'palm', 'sweet potato': 'sweet_potato',
    rubber: 'rubber',
  }
  const lower = text.toLowerCase()
  for (const [keyword, crop] of Object.entries(map)) {
    if (lower.includes(keyword)) return crop
  }
  return null
}

const rules: KnowledgeRule[] = [
  {
    patterns: [/when.*(plant|grow|sow)/i, /best time.*plant/i, /planting.*season/i, /what.*plant.*(now|today)/i],
    respond: (ctx) => {
      const crop = null
      if (ctx.season === 'Rainy Season') {
        return {
          answer: `In ${ctx.county} County during the **Rainy Season** (${ctx.month >= 5 && ctx.month <= 7 ? 'early' : 'mid-late'} season), the best crops to plant right now are:\n\n• **Upland Rice** — Plant May–June for October harvest\n• **Cassava** — Plant April–June, harvests in 8–12 months\n• **Maize (2nd season)** — Plant July–August if early rains\n• **Groundnuts** — Plant April–June on well-drained soil\n• **Pepper** — Start in nursery for main season crop\n\nYour ${getSoil(ctx.county)} is well-suited for rice and cassava this season.`,
          tips: [
            'Clear land 2–3 weeks before planting to allow residues to decompose',
            'Apply lime if soil pH is below 5.5 (test with local extension office)',
            'Plant on ridges or mounds to manage excess rainfall',
          ],
          relatedTopics: ['Rice planting guide', 'Soil preparation', 'Fertilizer application'],
          confidence: 'high',
          source: 'Liberia Ministry of Agriculture Seasonal Calendar 2026',
        }
      } else {
        return {
          answer: `In ${ctx.county} County during the **Dry Season**, focus on:\n\n• **Vegetables** (tomatoes, okra, pepper) — with irrigation\n• **Sweet Potato** — plant March–April as rains begin\n• **Land preparation** for upcoming rainy season crops\n• **Cassava harvesting** if planted 8+ months ago\n• **Groundnut harvesting** from previous season\n\nDry season is the best time to prepare compost and improve your soil for the next planting season.`,
          tips: [
            'Collect dry matter now to build compost heaps',
            'Repair farm tools and storage facilities',
            'Irrigate vegetable plots twice daily in morning and evening',
          ],
          relatedTopics: ['Dry season farming', 'Irrigation methods', 'Soil improvement'],
          confidence: 'high',
          source: 'LISGIS Agricultural Extension Service',
        }
      }
    },
  },
  {
    patterns: [/fertilizer|manure|compost|nutrient|npk/i],
    respond: (ctx) => ({
      answer: `**Fertilizer Guide for ${ctx.county} County:**\n\nFor typical ${getSoil(ctx.county)}:\n\n**Organic Options (recommended)**\n• Compost from kitchen/farm waste — apply 5 tonnes/acre before planting\n• Poultry manure — 2 tonnes/acre, high in nitrogen\n• Crop residue mulch — improves moisture retention\n\n**Chemical Fertilizers (NPK)**\n• Rice: NPK 15-15-15 at planting, then Urea at tillering\n• Cassava: NPK 8-8-8 one month after planting\n• Maize: NPK 20-10-10 at planting, top-dress with Urea at 6 weeks\n• Vegetables: Apply balanced NPK every 3 weeks\n\n**Cost-effective approach:** Mix 50% compost + 50% NPK to reduce chemical costs by half while maintaining yields.`,
      tips: [
        'Never apply fertilizer on dry soil — water first or apply just before rain',
        'Keep fertilizer in dry storage, away from direct sunlight',
        'Contact the Ministry of Agriculture extension office for subsidized fertilizer programs',
      ],
      relatedTopics: ['Composting methods', 'Soil testing', 'Government input programs'],
      confidence: 'high',
      source: 'CARI Liberia Soil Management Guidelines',
    }),
  },
  {
    patterns: [/pest|insect|disease|blight|rot|fungus|worm|caterpillar|aphid/i],
    respond: (ctx) => ({
      answer: `**Common Pest & Disease Management in ${ctx.county}:**\n\n**Rice Diseases**\n• *Rice blast* — Apply mancozeb or Tricyclazole; avoid over-fertilizing nitrogen\n• *Brown spot* — Improve drainage; apply potassium fertilizer\n• *Rice yellow mottle virus* — Remove infected plants; control leafhopper vectors\n\n**Cassava**\n• *Cassava mosaic disease* — Use certified disease-free stems; rogue infected plants\n• *Cassava mealybug* — Introduce natural enemy *Anagyrus lopezi* (contact CARI)\n\n**Maize**\n• *Fall armyworm* (major threat 2025-26) — Apply Bt spray or cyantraniliprole early\n• *Maize streak virus* — Use resistant varieties; control leafhoppers\n\n**General Rule:** Scout fields every 5–7 days during growing season. Early detection prevents 80% of crop losses.`,
      tips: [
        'Early morning scouting (6–9am) catches most pest activity',
        'Intercrop with legumes to reduce pest pressure naturally',
        'Contact LISGIS extension officer for free pest diagnosis',
      ],
      relatedTopics: ['Integrated pest management', 'Pesticide safety', 'Crop rotation'],
      confidence: 'high',
      source: 'CARI Liberia Plant Health Unit',
    }),
  },
  {
    patterns: [/price|market|sell|buyer|trader|profit|revenue|income|money/i],
    respond: (ctx) => ({
      answer: `**Current Market Outlook — ${ctx.county} County (${ctx.season}):**\n\n| Crop | Price (LRD/kg) | Trend | Best Market |\n|------|---------------|-------|-------------|\n| Rice | 170–200 | ↑ Rising | Monrovia, Ganta |\n| Cassava | 35–50 | Stable | Local markets |\n| Maize | 80–110 | ↑ Rising | Kakata, Buchanan |\n| Pepper | 500–800 | ↑ High | Monrovia export |\n| Groundnuts | 150–190 | Stable | Urban markets |\n| Palm Oil | 300–380 | Stable | All regions |\n\n**Top Opportunities Right Now:**\n• Pepper prices are 40% above average — excellent time to sell\n• Maize shortfall from reduced planting — prices expected to rise 15–20%\n• Rice demand high ahead of rainy season planting — hold stock if possible`,
      tips: [
        'Register with AgriConnect marketplace to get direct buyer access (no middlemen)',
        'Form a farmer group to negotiate better prices (10+ farmers)',
        'Store crops properly — price improves by 20–30% after peak harvest flood',
      ],
      relatedTopics: ['Marketplace listings', 'Post-harvest storage', 'Farmer cooperatives'],
      confidence: 'medium',
      source: 'AgriConnect Liberia Price Monitor — February 2026',
    }),
  },
  {
    patterns: [/weather|rain|flood|drought|climate|temperature|forecast/i],
    respond: (ctx) => ({
      answer: `**Weather & Climate Advisory — ${ctx.county} County:**\n\n**Current Season:** ${ctx.season}\n\n${ctx.season === 'Rainy Season'
        ? `**Rainfall Forecast (2026 Rainy Season):**\n• Total rainfall predicted: 1,800–2,200mm (normal range)\n• Peak rainfall months: July–August\n• Risk of flooding: Moderate in low-lying areas\n• Drought risk: Low this season\n\n**Farming Implications:**\n• Good planting window is open — start now\n• Prepare drainage channels before July peak rains\n• Avoid planting in valley bottoms without proper drainage`
        : `**Dry Season Advisory (Dec–April):**\n• Harmattan winds from Sahara — low humidity, dusty conditions\n• Night temperatures can drop to 18–22°C in highland counties\n• Risk of bush fires: HIGH — clear fire breaks around farms\n• Irrigation needed for any cropping activity\n\n**Farming Implications:**\n• Ideal for land clearing and preparation\n• Set up irrigation for vegetables and nurseries\n• Harvest and store crops before temperatures rise in March`}\n\nMonitor the Weather page on AgriConnect for 7-day county-specific forecasts.`,
      tips: [
        'Download weather updates weekly from AgriConnect Weather page',
        'Join local farmer radio program for county weather alerts',
        'Build storm drains before peak rains to protect crops',
      ],
      relatedTopics: ['7-day weather forecast', 'Flood protection', 'Drought-resistant crops'],
      confidence: 'high',
      source: 'Liberia Meteorological Service + AgriConnect Weather Engine',
    }),
  },
  {
    patterns: [/soil|land|ph|acidic|drainage|preparation|till|plow/i],
    respond: (ctx) => ({
      answer: `**Soil Management — ${ctx.county} County:**\n\nYour county has ${getSoil(ctx.county)}.\n\n**Soil pH in Liberia:**\nMost Liberian soils are acidic (pH 4.5–6.0). This limits nutrient uptake.\n\n**How to Improve Your Soil:**\n\n1. **Lime application** — Apply agricultural lime at 1–2 tonnes/acre to raise pH. Best done 4–6 weeks before planting.\n2. **Compost/organic matter** — Reduces acidity, improves water retention\n3. **Cover crops** — Grow mucuna or cowpea between seasons to fix nitrogen and prevent erosion\n4. **Minimum tillage** — Reduces soil erosion on slopes common in Liberia\n5. **Raised beds** — For vegetable gardens in waterlogged areas\n\n**Free Soil Testing:**\nContact CARI (Central Agricultural Research Institute) in Suakoko, Bong County for free soil analysis. Results in 2–3 weeks.`,
      tips: [
        'Test soil pH before applying fertilizer for best results',
        'Rotate crops each season to prevent soil depletion',
        'Never leave soil bare — mulch or plant cover crops',
      ],
      relatedTopics: ['Composting', 'Cover crops', 'CARI soil testing'],
      confidence: 'high',
      source: 'CARI Liberia Soil Science Division',
    }),
  },
  {
    patterns: [/water|irrigation|dry|drought|creek|river|pump/i],
    respond: (ctx) => ({
      answer: `**Water & Irrigation Guide for ${ctx.county} County:**\n\n**Dry Season Irrigation Options:**\n\n1. **Manual watering** — Watering cans/buckets for small plots (<0.5 acres)\n2. **Drip irrigation kits** — Available from Ministry of Agriculture input program\n   Cost: ~L$2,500–4,000/kit, saves 60% water vs overhead spray\n3. **Gravity-fed systems** — If your farm is below a water source\n4. **Borehole/hand pump** — For community-scale irrigation\n\n**Water Conservation:**\n• Mulch around crops reduces water need by 40%\n• Plant windbreaks to reduce evaporation\n• Water in early morning (5–7am) or evening (5–7pm) to reduce losses\n• Make raised beds to direct water to roots, not pathways\n\n**Rainy Season Water Management:**\n• Build contour ridges on slopes to slow water runoff\n• Construct drainage channels before July peak rains\n• Avoid planting in flood-prone areas without raised beds`,
      tips: [
        'Collect rainwater in tanks during rainy season for dry season use',
        'Drip irrigation kits can be subsidized — contact county agriculture office',
        'Mulching with rice straw or dry leaves is free and very effective',
      ],
      relatedTopics: ['Dry season farming', 'Drip irrigation', 'Water harvesting'],
      confidence: 'high',
      source: 'Liberia Ministry of Agriculture Extension Handbook',
    }),
  },
  {
    patterns: [/storage|warehouse|store|post.?harvest|dry|bag|sack/i],
    respond: (ctx) => ({
      answer: `**Post-Harvest Storage in Liberia:**\n\nPoor storage causes 30–40% of crop losses in Liberia. Here's how to prevent it:\n\n**Rice Storage:**\n• Dry to 14% moisture before bagging\n• Use hermetic bags (PICS bags) — seal out oxygen, kills weevils\n• Store on pallets, never directly on floor\n• Fumigate with phostoxin tablets every 2–3 months\n• Ideal: cool, dry room with good ventilation\n\n**Cassava:** Cannot be stored raw more than 3–5 days.\n• Process into gari, fufu flour, or cassava chips for 6–12 month storage\n• Dry chips to 12% moisture on raised drying tables\n\n**Maize:**\n• Shell and dry to 13% moisture\n• PICS bags or metal silos best\n• Maize stored properly sells for 30–50% more in lean season (Feb–April)\n\n**Where to Get PICS Bags in Liberia:**\nMinistry of Agriculture offices in Monrovia, Ganta, Buchanan, Zwedru.`,
      tips: [
        'Selling immediately after harvest gives lowest prices — store if possible',
        'Farmer groups can share warehouse costs and get better deals',
        'Label bags with crop name, date, and county for traceability',
      ],
      relatedTopics: ['PICS bag suppliers', 'Cassava processing', 'Farmer warehouses'],
      confidence: 'high',
      source: 'FAO Liberia Post-Harvest Management Program',
    }),
  },
  {
    patterns: [/loan|credit|finance|money|bank|capital|invest/i],
    respond: (_ctx) => ({
      answer: `**Agricultural Finance Options in Liberia:**\n\n**Government Programs:**\n• **LBDI Agricultural Loan** — Up to L$50,000 for smallholders at 8% interest\n• **Ministry of Agriculture Input Support** — Free seeds, fertilizer for registered farmers\n• **USAID LICA program** — Grants for women and youth farmers\n\n**Mobile Money Credit:**\n• Orange Money Farmer Credit — L$500–5,000 via *144*1#\n• Lonestar MTN AgriLoan — Apply via *199#\n\n**Farmer Group Finance:**\n• VSLAs (Village Savings & Loan Associations) — Most flexible\n• Community banks in Bong, Nimba, Lofa counties\n\n**Tips for Loan Applications:**\n1. Have your National ID and farm title/documentation ready\n2. Farmer group membership improves approval chances\n3. Start with small amounts (L$2,000–5,000) to build credit history\n4. Always borrow for a specific crop season with clear repayment plan`,
      tips: [
        'Register your farm with the Ministry of Agriculture to access government programs',
        'Join a farmer cooperative to access group loans with lower interest',
        'Keep simple farm income/expense records to demonstrate creditworthiness',
      ],
      relatedTopics: ['Farmer registration', 'VSLA formation', 'Market prices'],
      confidence: 'medium',
      source: 'LBDI Agricultural Finance Division + Ministry of Agriculture 2026',
    }),
  },
]

const CROP_SPECIFIC_RULE: KnowledgeRule = {
  patterns: [/how.*(grow|plant|cultivate|farm)|.*farming.*tips|guide.*for/i],
  respond: (ctx) => {
    return {
      answer: `I can give you specific advice on these crops grown in ${ctx.county}:\n\n• **Rice** — Ask "How do I grow rice?" or "Rice planting tips"\n• **Cassava** — Ask "Cassava farming guide"\n• **Maize** — Ask "When to plant maize in ${ctx.season}"\n• **Pepper** — Ask "Pepper farming tips"\n• **Groundnuts** — Ask "Groundnut cultivation guide"\n• **Cocoa** — Ask "Cocoa farming Liberia"\n• **Palm Oil** — Ask "Palm oil cultivation"\n• **Rubber** — Ask "Rubber tapping guide"\n\nOr ask me anything about planting, pests, soil, weather, prices, or storage!`,
      relatedTopics: ['Crop calendar', 'Market prices', 'Soil management'],
      confidence: 'high',
      source: 'AgriConnect AI Advisor',
    }
  },
}

function buildCropAnswer(crop: string, ctx: AdvisorContext): AIResponse {
  const cal = CROP_CALENDAR[crop]
  if (!cal) {
    return {
      answer: `I don't have specific data for that crop yet. Please ask about rice, cassava, maize, pepper, groundnuts, plantain, cocoa, palm oil, rubber, or sweet potato.`,
      confidence: 'low',
      source: 'AgriConnect AI Advisor',
    }
  }
  const cropDisplay = crop.replace('_', ' ')
  return {
    answer: `**${cropDisplay.charAt(0).toUpperCase() + cropDisplay.slice(1)} Farming Guide — ${ctx.county} County:**\n\n**Planting Window:** ${cal.plant}\n**Harvest Time:** ${cal.harvest}\n**Soil:** ${getSoil(ctx.county)}\n\n**Key Success Tip:** ${cal.tip}\n\n**${ctx.season} Relevance:**\n${ctx.season === 'Rainy Season'
      ? `✅ This is ${['rice', 'cassava', 'maize', 'groundnut', 'pepper'].includes(crop) ? 'an ideal' : 'a possible'} planting season for ${cropDisplay}.`
      : `⚠️ Dry season — ${['rubber', 'palm', 'cocoa'].includes(crop) ? 'maintenance and processing focus' : 'irrigation required for planting now. Best to prepare for rainy season.'}`
    }`,
    tips: [
      `Get certified ${cropDisplay} seeds from Ministry of Agriculture input shops`,
      `Contact CARI extension officer in ${ctx.county} for free technical guidance`,
      'Keep records of input costs and yields to plan next season better',
    ],
    relatedTopics: [`${cropDisplay} pest management`, 'Fertilizer guide', 'Market prices'],
    confidence: 'high',
    source: `CARI Liberia ${cropDisplay.charAt(0).toUpperCase() + cropDisplay.slice(1)} Production Manual`,
  }
}

const DEFAULT_RESPONSE: AIResponse = {
  answer: `I'm your AI Crop Advisor for Liberia. I can help you with:\n\n• 🌱 **Planting guidance** — When and what to plant by season and county\n• 🐛 **Pest & disease management** — Identify and treat crop problems\n• 💰 **Market prices** — Current prices and selling strategies\n• 🌧️ **Weather advice** — Seasonal farming guidance\n• 🌿 **Soil management** — Fertilizer and land preparation\n• 💧 **Irrigation** — Dry season farming techniques\n• 📦 **Storage** — Post-harvest loss prevention\n• 💳 **Finance** — Loans and government programs\n\nTry asking: *"When should I plant rice in Bong County?"* or *"How do I treat fall armyworm on maize?"*`,
  confidence: 'high',
  source: 'AgriConnect AI Advisor v1.0',
}

export function processQuestion(question: string, context: AdvisorContext): AIResponse {
  const q = question.trim()
  if (!q) return DEFAULT_RESPONSE

  const detectedCrop = findCrop(q)

  for (const rule of rules) {
    if (rule.patterns.some((p) => p.test(q))) {
      if (detectedCrop && rules.indexOf(rule) === 0) {
        return buildCropAnswer(detectedCrop, context)
      }
      return rule.respond(context)
    }
  }

  if (detectedCrop) {
    return buildCropAnswer(detectedCrop, context)
  }

  if (CROP_SPECIFIC_RULE.patterns.some((p) => p.test(q))) {
    return CROP_SPECIFIC_RULE.respond(context)
  }

  return {
    ...DEFAULT_RESPONSE,
    answer: `I understand you're asking about: *"${q}"*\n\nI don't have a specific answer for that exact question, but here's what I can help you with:\n\n${DEFAULT_RESPONSE.answer}\n\nFor specific local advice, contact your county's Ministry of Agriculture extension office.`,
    confidence: 'low',
  }
}

export const SUGGESTED_QUESTIONS = [
  'What should I plant now in Bong County?',
  'How do I treat fall armyworm on maize?',
  'What is the current price of rice in Monrovia?',
  'How do I store cassava for 6 months?',
  'Best fertilizer for rice farming in Liberia?',
  'When does the rainy season start in Nimba County?',
  'How to get an agricultural loan in Liberia?',
  'What crops grow well in sandy soil?',
  'How to prevent flooding on my farm?',
  'Cocoa farming guide for Lofa County',
]
