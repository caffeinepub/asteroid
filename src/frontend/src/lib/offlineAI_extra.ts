/**
 * Aster Offline AI — Extended Categories (70 additional topics)
 * Imported and merged into offlineAI.ts RULES array.
 */

// Rule type is defined in offlineAI.ts — using local type alias here
type LocalRule = {
  patterns: RegExp[];
  response: string | ((match: RegExpMatchArray, input: string) => string);
};

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const EXTRA_RULES: LocalRule[] = [
  // ── 1. ASTRONOMY & SPACE ──────────────────────────────────────────────────
  {
    patterns: [
      /\b(planet|solar system|milky way|galaxy|universe|star|asteroid|black hole|nebula|comet|mars|moon|jupiter|saturn|pluto|nasa|spacex|rocket|orbit|constellation|telescope)\b/i,
    ],
    response: pick([
      "Our solar system has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. The nearest star is Proxima Centauri (~4.2 light-years away). A black hole is a region where gravity is so strong that nothing — not even light — can escape. The Milky Way contains 100–400 billion stars. For deep-sky viewing, use a reflector telescope with at least 70mm aperture and find a dark-sky location.",
      "Space basics: the Moon is ~384,400 km away; Mars at closest approach is ~54.6 million km. The ISS orbits at ~408 km altitude at ~27,600 km/h. Saturn's rings are made of ice and rock. Jupiter is the largest planet — 1,300 Earths could fit inside it. Shooting stars are meteors burning up in the atmosphere.",
    ]),
  },

  // ── 2. MATHEMATICS ───────────────────────────────────────────────────────
  {
    patterns: [
      /\b(math|maths|algebra|geometry|calculus|equation|formula|percentage|fraction|prime number|pythagorean|trigonometry|quadratic|statistics|probability|mean|median|mode|integral|derivative)\b/i,
    ],
    response:
      "Math quick-reference: Pythagorean theorem: a²+b²=c². Quadratic formula: x = (−b ± √(b²−4ac)) / 2a. Area of circle: πr². Percentage change: ((new−old)/old)×100. Mean = sum ÷ count. To find a prime, check divisibility by all primes up to its square root. Probability of event = favourable outcomes ÷ total outcomes. Derivative of xⁿ = nxⁿ⁻¹. For step-by-step working, describe your specific problem.",
  },

  // ── 3. PHYSICS ────────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(physics|newton|force|gravity|velocity|acceleration|momentum|energy|power|wave|frequency|electricity|voltage|current|resistance|ohm|thermodynamics|quantum|relativity|speed of light)\b/i,
    ],
    response:
      "Physics essentials: Newton's 2nd law: F = ma. Kinetic energy: KE = ½mv². Ohm's law: V = IR. Speed of light in vacuum: 299,792,458 m/s. Gravitational acceleration on Earth: 9.81 m/s². Power: P = W/t (watts). Wavelength × frequency = speed. Boyle's law: P₁V₁ = P₂V₂ at constant temperature. Einstein's E = mc² relates mass and energy. For a specific calculation, give me the values.",
  },

  // ── 4. CHEMISTRY ─────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(chemistry|chemical|element|periodic table|atom|molecule|acid|base|pH|reaction|compound|hydrogen|oxygen|carbon|sodium|chloride|bond|oxidation|reduction|mole|catalyst|polymer)\b/i,
    ],
    response:
      "Chemistry basics: pH < 7 = acid, pH > 7 = base, pH 7 = neutral. Water is H₂O; table salt is NaCl; baking soda is NaHCO₃. Acids and bases neutralise each other to form water + salt. Oxidation = loss of electrons; reduction = gain (OIL RIG). A catalyst speeds up a reaction without being consumed. The mole (6.022×10²³ particles) links atomic mass to grams. Carbon is the basis of all organic chemistry.",
  },

  // ── 5. BIOLOGY ────────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(biology|cell|dna|gene|chromosome|evolution|photosynthesis|respiration|ecosystem|organism|bacteria|virus|fungi|mammal|plant|protein|enzyme|hormone|mitosis|genetics|darwin)\b/i,
    ],
    response:
      "Biology fundamentals: DNA is the blueprint of life — double helix made of adenine, thymine, guanine, cytosine. Cells are the basic unit of life — plant cells have a cell wall; animal cells don't. Photosynthesis: 6CO₂ + 6H₂O + light → glucose + O₂. Respiration: glucose + O₂ → CO₂ + H₂O + energy (ATP). Mitosis = cell division for growth; meiosis = for reproduction. Viruses need a host cell; bacteria are self-replicating. Mutations in DNA drive evolution over generations.",
  },

  // ── 6. HISTORY ────────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(history|world war|ancient|roman|empire|revolution|colonisation|cold war|world war 1|world war 2|ww1|ww2|wwi|wwii|napoleon|renaissance|industrial revolution|slavery|independence|medieval|civilisation|century|historic)\b/i,
    ],
    response: pick([
      "Key history markers: WW1 (1914–1918) triggered by assassination of Archduke Franz Ferdinand. WW2 (1939–1945) ended with atomic bombs on Hiroshima and Nagasaki. The French Revolution (1789) abolished monarchy. The Industrial Revolution (~1760–1840) shifted economies from farming to manufacturing. The Roman Empire lasted from 27 BC to 476 AD. The Renaissance (~14th–17th century) revived art, science, and philosophy. Columbus reached the Americas in 1492.",
      "Ancient civilisations timeline: Mesopotamia ~3500 BC (writing invented), Ancient Egypt ~3100 BC (pyramids ~2560 BC), Ancient Greece ~800 BC (democracy, philosophy), Roman Republic 509 BC. The Silk Road connected China to Europe for trade. The Black Death (1347–1351) killed ~30–60% of Europe's population. The printing press (Gutenberg, ~1440) revolutionised information spread.",
    ]),
  },

  // ── 7. GEOGRAPHY ─────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(geography|continent|country|capital|ocean|river|mountain|climate|biome|latitude|longitude|hemisphere|map|population|africa|europe|asia|america|australia|antarctica|equator|amazon|everest|nile|sahara)\b/i,
    ],
    response:
      "Geography facts: 7 continents — Africa (largest population), Antarctica (coldest), Asia (largest area & population), Australia/Oceania, Europe, North America, South America. 5 oceans: Pacific (largest), Atlantic, Indian, Southern, Arctic. Longest river: Nile (~6,650 km) or Amazon (by volume). Highest mountain: Everest (8,849 m). Largest desert: Sahara (hot); Antarctica (cold). Equator divides Northern and Southern hemispheres. The Prime Meridian (0° longitude) passes through Greenwich, UK.",
  },

  // ── 8. PHILOSOPHY ────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(philosophy|ethics|moral|aristotle|plato|socrates|kant|nietzsche|stoic|existentialism|utilitarianism|logic|reasoning|consciousness|free will|metaphysics|epistemology|meaning of life|virtue|justice)\b/i,
    ],
    response:
      "Philosophy primer: Socrates taught via questioning (Socratic method). Plato argued ideal Forms exist beyond the physical world. Aristotle grounded philosophy in observation and logic. Stoicism: focus on what you control; accept what you can't. Kant's Categorical Imperative: act only by rules you'd want universalised. Utilitarianism (Mill): the right action maximises total happiness. Existentialism (Sartre): existence precedes essence — we define our own meaning. The 'trolley problem' is a classic ethical dilemma exploring consequentialism vs deontology.",
  },

  // ── 9. PSYCHOLOGY ────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(psychology|cognitive|behavior|behaviour|emotion|anxiety|depression|trauma|therapy|cbt|mindfulness|habit|motivation|maslow|freud|jung|personality|introvert|extrovert|bipolar|adhd|autism|grief|resilience)\b/i,
    ],
    response:
      "Psychology essentials: Maslow's hierarchy: physiological → safety → love → esteem → self-actualisation. CBT (Cognitive Behavioural Therapy) challenges negative thought patterns — widely evidence-based. The 5 stages of grief (Kübler-Ross): denial, anger, bargaining, depression, acceptance — non-linear. ADHD involves difficulty with sustained attention and impulse control. Introversion/extroversion describes where you recharge energy from (alone vs social). For professional concerns, see a licensed therapist or GP.",
  },

  // ── 10. ECONOMICS ────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(economics|supply|demand|inflation|gdp|recession|market|trade|tariff|interest rate|central bank|capitalism|socialism|microeconomics|macroeconomics|fiscal|monetary|unemployment|deficit|surplus|opportunity cost|elasticity)\b/i,
    ],
    response:
      "Economics basics: Supply ↑ → price ↓; demand ↑ → price ↑. GDP = total value of goods/services in a country in a year. Inflation = general rise in prices over time; central banks raise interest rates to reduce it. Recession = two consecutive quarters of negative GDP growth. Opportunity cost = value of the next-best alternative forgone. Fiscal policy = government spending/taxation; monetary policy = central bank interest rates. Comparative advantage explains why countries specialise in trade.",
  },

  // ── 11. POLITICS & GOVERNMENT ────────────────────────────────────────────
  {
    patterns: [
      /\b(politics|government|democracy|parliament|constitution|election|voting|republic|monarchy|dictator|law|legislation|senate|congress|president|prime minister|cabinet|party|rights|citizenship|policy|bill|amendment)\b/i,
    ],
    response:
      "Political systems: Democracy = government by elected representatives. Republic = head of state is elected, not hereditary. Constitutional monarchy = elected parliament governs; monarch is largely ceremonial (e.g. UK). A bill becomes law after passing both legislative chambers and executive assent. Constitutions outline fundamental rights and limit government power. Federalism splits power between central and regional governments. Elections use various systems: first-past-the-post, proportional representation, ranked choice, etc.",
  },

  // ── 12. LAW EXTENDED ─────────────────────────────────────────────────────
  {
    patterns: [
      /\b(criminal law|civil law|contract|negligence|liability|lawsuit|sue|court|judge|jury|evidence|arrest|bail|verdict|sentence|appeal|intellectual property|copyright|trademark|patent|gdpr|data protection|defamation|slander|libel)\b/i,
    ],
    response:
      "Legal concepts: Criminal law = state vs individual (beyond reasonable doubt standard). Civil law = individual vs individual (balance of probabilities). A contract needs offer, acceptance, consideration, and intention to be legally binding. Negligence requires duty of care, breach, causation, and damage. Copyright protects creative works automatically; patents require registration and expire after 20 years. GDPR gives EU/UK residents rights over their personal data. For specific legal advice, always consult a qualified solicitor.",
  },

  // ── 13. MEDICINE & FIRST AID ─────────────────────────────────────────────
  {
    patterns: [
      /\b(first aid|cpr|choking|bleeding|fracture|burn|wound|bandage|pulse|rescue breathing|heimlich|aed|defibrillator|stroke symptoms|heart attack|seizure|unconscious|recovery position|medical emergency|anaphylaxis|epipen)\b/i,
    ],
    response:
      "First aid essentials: CPR — 30 chest compressions (5–6 cm deep, 100–120/min) then 2 rescue breaths; repeat. Choking adult — 5 back blows, 5 abdominal thrusts (Heimlich). Severe bleeding — apply firm direct pressure, elevate limb. Burns — cool with running water 20 minutes; don't use ice. Stroke — FAST: Face drooping, Arm weakness, Speech slurred, Time to call 999/911. Heart attack — sit down, loosen clothing, chew aspirin 300mg if not allergic, call emergency. Anaphylaxis — use EpiPen (outer thigh), call 999, lie flat with legs raised.",
  },

  // ── 14. NUTRITION & DIET ─────────────────────────────────────────────────
  {
    patterns: [
      /\b(nutrition|diet|calorie|protein|carbohydrate|fat|vitamin|mineral|fibre|fiber|macros|keto|vegan|vegetarian|gluten|lactose|intermittent fasting|portion|hydration|bmi|cholesterol|omega|antioxidant|superfood)\b/i,
    ],
    response:
      "Nutrition guide: Macronutrients — carbohydrates (4 kcal/g, main energy), protein (4 kcal/g, builds/repairs), fats (9 kcal/g, hormones/brain). Adults need ~0.8 g protein per kg body weight (more for athletes). Fibre target: 25–30 g/day (wholegrains, veg, legumes). Hydration: ~2 L water/day minimum, more in heat/exercise. Vitamin D is synthesised from sunlight; supplement in winter in northern latitudes. Omega-3 (oily fish, flaxseed) reduces inflammation. BMI = weight (kg) ÷ height (m)². Healthy range: 18.5–24.9.",
  },

  // ── 15. FITNESS & EXERCISE ───────────────────────────────────────────────
  {
    patterns: [
      /\b(exercise|workout|gym|training|muscle|cardio|strength|weight loss|hiit|yoga|stretching|running|cycling|swimming|bench press|squat|deadlift|pull.?up|push.?up|plank|rep|set|overtraining|recovery|warm up|cool down|endurance|flexibility)\b/i,
    ],
    response:
      "Fitness fundamentals: Aim for 150 min moderate-intensity cardio/week (WHO) + 2 strength sessions. Compound lifts (squat, deadlift, bench press, pull-up) give most muscle activation per exercise. Progressive overload = gradually increasing weight/reps for strength gains. HIIT (20–40 min) burns calories efficiently with 2:1 work-rest ratio. Rest 48h between training the same muscle group. Warm up 5–10 min before; cool down with stretching after. Sleep is when muscles repair — 7–9 h is optimal. Dehydration significantly reduces performance.",
  },

  // ── 16. MENTAL HEALTH ────────────────────────────────────────────────────
  {
    patterns: [
      /\b(stress|burnout|loneliness|panic attack|phobia|ocd|ptsd|self.?harm|suicidal|crisis line|therapy|counselling|counseling|wellbeing|mental health|emotional|mood|cope|coping|mindset|meditate|meditation|breathing exercise|journaling|gratitude)\b/i,
    ],
    response:
      "Mental health support: Box breathing (4-4-4-4) immediately reduces panic. Journalling 3 daily gratitudes rewires the brain toward positivity over weeks. For burnout: restore sleep first, then remove one stressor, then rebuild routines. For panic attacks: cold water on face activates the dive reflex and slows heart rate quickly. PTSD, OCD, severe depression — evidence-based treatments include CBT, EMDR, medication. If you're in crisis, please contact: UK: Samaritans 116 123 | US: 988 Suicide & Crisis Lifeline | India: iCall 9152987821. You are not alone.",
  },

  // ── 17. RELATIONSHIPS & DATING ───────────────────────────────────────────
  {
    patterns: [
      /\b(relationship|dating|breakup|love|romance|partner|boyfriend|girlfriend|marriage|divorce|commitment|trust|jealousy|communication relationship|long.?distance|attachment style|red flag|boundaries relationship|online dating|conflict couple)\b/i,
    ],
    response:
      "Relationship health: Good communication = listen to understand, not just to reply. Use 'I feel...' statements instead of 'You always...' to reduce defensiveness. Gottman research: 5:1 positive-to-negative interaction ratio predicts lasting relationships. Attachment styles (secure, anxious, avoidant, disorganised) form in childhood and affect adult bonds. Red flags: love bombing, isolation, excessive jealousy, contempt, stonewalling. Long-distance tip: schedule regular video calls and plan next visit at every goodbye. For serious issues, couples counselling works — start early, not as a last resort.",
  },

  // ── 18. PARENTING EXTENDED ───────────────────────────────────────────────
  {
    patterns: [
      /\b(baby|toddler|infant|teenager|teen|adolescent|screen time|tantrums|discipline|homework help|school|puberty|pocket money|allowance|chores children|bedtime routine|immunisation|vaccination|developmental milestone|reading children|learning disability)\b/i,
    ],
    response:
      "Parenting tips: Under 18 months — no screen time except video calls (WHO). Ages 2–5: max 1 h/day high-quality content. Tantrums peak at 2–3 years; stay calm, don't negotiate mid-tantrum, reconnect after. Bedtime routines (bath, book, bed) significantly improve children's sleep. Pocket money linked to chores teaches money management from age 6+. For homework struggles: 20-minute sessions with a 5-minute break work better than marathon sessions. Puberty starts: girls ~8–13, boys ~9–14. Keep conversations open and non-judgmental.",
  },

  // ── 19. EDUCATION & STUDYING ─────────────────────────────────────────────
  {
    patterns: [
      /\b(study|studying|exam|revision|memory|learn faster|note.?taking|pomodoro|flashcard|active recall|spaced repetition|reading comprehension|essay writing|thesis|dissertation|university|college|scholarship|online course|degree|qualification|certificate)\b/i,
    ],
    response:
      "Study techniques ranked by effectiveness: 1. Spaced repetition (review at increasing intervals — Anki app). 2. Active recall (test yourself, don't just re-read). 3. The Pomodoro technique (25 min focus + 5 min break). 4. Interleaving (mix topics in one session). 5. Teaching the material to someone else (Feynman technique). Avoid: highlighters alone, passive re-reading, all-night cramming. For essay writing: state your thesis clearly in the intro, back each point with evidence, acknowledge counter-arguments, summarise in conclusion.",
  },

  // ── 20. LANGUAGES & LINGUISTICS ──────────────────────────────────────────
  {
    patterns: [
      /\b(language|learn.*language|spanish|french|german|mandarin|chinese|japanese|arabic|portuguese|hindi|russian|translate|grammar|vocabulary|pronunciation|fluency|bilingual|accent|dialect|linguistics|polyglot|duolingo|babbel)\b/i,
    ],
    response:
      "Language learning tips: Consistency beats intensity — 20 min daily > 2 hours weekly. Prioritise high-frequency words (the top 1000 words cover ~85% of everyday speech). Apps: Duolingo (habit), Anki (vocabulary), HelloTalk (conversation partners). Immersion: change phone language, watch shows with subtitles, listen to podcasts. Speaking from day 1 — fear of mistakes slows progress. Languages by difficulty for English speakers (FSI): Spanish/French ~600 h, German ~750 h, Arabic/Mandarin ~2,200 h.",
  },

  // ── 21. WRITING & COMMUNICATION ──────────────────────────────────────────
  {
    patterns: [
      /\b(write|writing|email writing|cover letter|cv|resume|report writing|blog|copywriting|storytelling|grammar tips|punctuation|clarity|concise|proofreading|editing|headline|persuasion|essay|proposal|memo|newsletter|content writing)\b/i,
    ],
    response: `Writing essentials: 1. Lead with the most important information (inverted pyramid). 2. Short sentences (avg 15–20 words) are clearer. 3. Active voice > passive ('We decided' > 'A decision was made'). 4. Cut adverbs and filler words ('very', 'really', 'just'). 5. Read aloud — you'll catch awkward phrasing instantly. For emails: subject line = action + topic. For CVs: use bullet points, quantify achievements ('increased sales 30%'), tailor to each job description. Cover letter: why this role, why this company, what you bring.`,
  },

  // ── 22. PUBLIC SPEAKING & PRESENTATIONS ──────────────────────────────────
  {
    patterns: [
      /\b(public speaking|presentation|speech|slides|powerpoint|stage fright|confidence speaking|storytelling presentation|keynote|ted talk|pitch|audience|body language presentation|voice projection|rehearsal|nerves|anxiety speaking)\b/i,
    ],
    response:
      "Public speaking tips: The 3-1-3 rule: 3 key points, 1 core message, 3 supporting stories. Eliminate filler words (um, uh) by practising pausing instead. Slides: 1 idea per slide, minimal text, large visuals. Body language: plant feet shoulder-width apart, use open gestures, maintain eye contact (~3 sec per person). Nerves = excitement — reframe it. Rehearse out loud at full volume at least 3 times. Record yourself once; it reveals more than any other feedback. If you lose your place, pause, take a breath, repeat your last sentence.",
  },

  // ── 23. LEADERSHIP & MANAGEMENT ──────────────────────────────────────────
  {
    patterns: [
      /\b(leadership|management|team|delegate|feedback|performance review|one.?on.?one|1.?on.?1|hire|fire|motivate|culture|strategy|vision|okr|kpi|agile|sprint|scrum|standup|manager|ceo|founder|startup|entrepreneur|decision making)\b/i,
    ],
    response:
      "Leadership fundamentals: Delegate outcomes, not tasks — tell people what success looks like, let them find the path. Feedback: use the SBI model (Situation, Behaviour, Impact) — specific, not personal. 1:1 meetings belong to the employee — let them set the agenda. OKRs (Objectives & Key Results): ambitious goal + 3–5 measurable outcomes, set quarterly. Psychological safety (Google Project Aristotle) is the #1 predictor of high-performing teams. Decision-making under uncertainty: use reversible decisions quickly; spend time on irreversible ones. Hire for values; train for skills.",
  },

  // ── 24. ENTREPRENEURSHIP & STARTUPS ──────────────────────────────────────
  {
    patterns: [
      /\b(startup|business idea|entrepreneur|pitch|investor|funding|venture capital|mvp|product market fit|customer discovery|revenue model|bootstrapping|side hustle|freelance|small business|ecommerce|dropshipping|saas|b2b|b2c|go to market|lean startup|business plan)\b/i,
    ],
    response:
      "Startup fundamentals: Validate before building — talk to 20 potential customers before writing a line of code. MVP (Minimum Viable Product) = smallest thing that tests your core assumption. Product-market fit = customers pull you, not you push them. Revenue models: subscription (SaaS), transactional, advertising, marketplace (% of GMV), licensing. Bootstrapping = self-funded, slower growth but you own 100%. Fundraising stages: Pre-seed (idea, friends/family) → Seed (early traction, angels) → Series A (growth, VCs). Your first 10 customers are your product team — listen obsessively.",
  },

  // ── 25. MARKETING & BRANDING ─────────────────────────────────────────────
  {
    patterns: [
      /\b(marketing|branding|brand|seo|social media marketing|content marketing|email marketing|ads|google ads|facebook ads|instagram|tiktok|influencer|campaign|funnel|conversion|cta|landing page|copywriting|target audience|persona|market research|logo|visual identity)\b/i,
    ],
    response:
      "Marketing essentials: Know your ICP (Ideal Customer Profile) before spending a penny. Content marketing builds trust over time — SEO blog, YouTube, or podcast. Email has the highest ROI (~$36 per $1 spent). Social media: choose 1–2 platforms where your audience already is. SEO basics: target long-tail keywords, write clear meta descriptions, get backlinks from reputable sites. Ads: start with a small test budget, A/B test creatives, optimise for conversions not clicks. Branding: logo + colour palette + tone of voice + values — consistency across all touchpoints builds recognition.",
  },

  // ── 26. PERSONAL FINANCE EXTENDED ───────────────────────────────────────
  {
    patterns: [
      /\b(savings account|isa|pension|retirement|compound interest|stock market|index fund|etf|dividend|roth ira|401k|invest|portfolio|rebalance|tax efficient|emergency fund|net worth|asset|liability|passive income|rental income|real estate|property investment)\b/i,
    ],
    response:
      "Personal finance deep-dive: Compound interest formula: A = P(1+r/n)^(nt). Starting at 25 vs 35 can double your retirement pot. Index funds (e.g. S&P 500, FTSE All-World) beat 90%+ of actively managed funds over 20 years. ISA (UK): £20,000/year tax-free allowance. Pension contributions get tax relief at your marginal rate — always claim it. Emergency fund: 3–6 months' expenses in a liquid savings account before investing. Rule of 72: divide 72 by your interest rate to find years to double money. Rental yield = annual rent ÷ property value × 100.",
  },

  // ── 27. CRYPTOCURRENCY & BLOCKCHAIN ──────────────────────────────────────
  {
    patterns: [
      /\b(crypto|cryptocurrency|bitcoin|ethereum|blockchain|wallet|defi|nft|token|altcoin|mining|staking|dao|web3|metamask|ledger|seed phrase|market cap|volatility crypto|exchange|binance|coinbase|solana|cardano|polkadot)\b/i,
    ],
    response:
      "Crypto basics: Bitcoin = decentralised digital currency on a blockchain (public ledger). Ethereum adds programmable smart contracts. A wallet stores your private keys — not your coins (which live on-chain). Hardware wallets (Ledger, Trezor) are the safest storage. NEVER share your seed phrase. DeFi = decentralised finance apps built on blockchains. NFTs = non-fungible tokens proving digital ownership. Risks: extreme volatility, scams, regulatory uncertainty, irreversible transactions. Rule of thumb: only invest what you can afford to lose 100% of. Dollar-cost averaging (regular fixed buys) reduces timing risk.",
  },

  // ── 28. ARTIFICIAL INTELLIGENCE & MACHINE LEARNING ───────────────────────
  {
    patterns: [
      /\b(artificial intelligence|machine learning|deep learning|neural network|llm|large language model|gpt|chatgpt|gemini|claude|ai model|training data|algorithm|supervised|unsupervised|reinforcement learning|computer vision|nlp|natural language|generative ai|prompt engineering)\b/i,
    ],
    response:
      "AI fundamentals: Machine learning = systems that learn from data rather than being explicitly programmed. Deep learning = multi-layer neural networks; powers image recognition, speech, and language models. LLMs (Large Language Models) like GPT-4, Gemini, Claude predict the next word/token based on massive text training. Prompt engineering: be specific, provide context, give examples, specify output format. AI limitations: can hallucinate (confidently wrong), has training data cutoffs, lacks true understanding. Practical uses: writing assistance, code generation, data analysis, image generation, summarisation, translation.",
  },

  // ── 29. PROGRAMMING & SOFTWARE DEVELOPMENT ───────────────────────────────
  {
    patterns: [
      /\b(programming|code|coding|python|javascript|typescript|react|node|html|css|sql|git|github|api|rest|json|database|bug|debug|function|variable|loop|array|object|class|algorithm|data structure|stack overflow|ide|vscode|agile|devops|ci.?cd)\b/i,
    ],
    response:
      "Programming tips: Learn fundamentals first (variables, loops, functions, data structures) in any language — they transfer everywhere. Python is best for data/AI; JavaScript for web; SQL for databases. Git workflow: branch → commit → pull request → merge. Debugging: add logs/print statements to narrow down where it breaks; read the error message fully. REST APIs: use GET to fetch, POST to create, PUT/PATCH to update, DELETE to remove. For clean code: functions should do one thing; name variables clearly; write comments for 'why' not 'what'. Stack Overflow, MDN, and official docs are your best references.",
  },

  // ── 30. CYBERSECURITY ────────────────────────────────────────────────────
  {
    patterns: [
      /\b(cybersecurity|hacking|password security|phishing|malware|ransomware|vpn|firewall|2fa|two.?factor|encryption|data breach|identity theft|scam|fraud|secure browsing|privacy|tor|antivirus|trojan|virus computer|social engineering|zero.?day|penetration testing)\b/i,
    ],
    response:
      "Cybersecurity essentials: Use a password manager (Bitwarden, 1Password) — unique 16+ character passwords for every account. Enable 2FA (authenticator app > SMS). Phishing: verify sender email domain carefully; hover over links before clicking; banks never ask for your password. VPN encrypts your traffic on public Wi-Fi — use a reputable paid one (Mullvad, ProtonVPN). Keep software updated — most hacks exploit known vulnerabilities. Back up data: 3-2-1 rule (3 copies, 2 media types, 1 offsite). If you receive a ransom demand, don't pay — contact authorities and a cybersecurity professional.",
  },

  // ── 31. INTERNET OF THINGS (IoT) ─────────────────────────────────────────
  {
    patterns: [
      /\b(iot|smart home|smart bulb|smart plug|alexa|google home|siri|thermostat|nest|smart lock|home automation|zigbee|z.?wave|home assistant|dashboard iot|sensor|hub|connected device|matter protocol)\b/i,
    ],
    response:
      "Smart home guide: Hubs (Home Assistant, SmartThings, Apple HomeKit, Google Home) unify devices. Zigbee and Z-Wave are local protocols — faster and more reliable than Wi-Fi for sensors. Matter is the new cross-platform standard (2022+) — future-proofed buying choice. Start with: smart plugs (easy) → smart bulbs (Philips Hue, LIFX) → smart thermostat (Nest, Ecobee) → smart locks → cameras. Security: change default device passwords, keep firmware updated, put IoT devices on a separate VLAN/network segment. Home Assistant (free, local) gives maximum privacy and automation power.",
  },

  // ── 32. 3D PRINTING & MAKING ─────────────────────────────────────────────
  {
    patterns: [
      /\b(3d print|3d printing|fdm|resin print|filament|pla|abs|petg|slicer|cura|prusa|creality|bed leveling|layer height|infill|support structure|tinkercad|fusion 360|stl|gcode|maker|cnc|laser cut|arduino|raspberry pi|electronics diy)\b/i,
    ],
    response:
      "3D printing basics: FDM (filament) is cheaper and more beginner-friendly; resin gives higher detail. PLA = easiest filament (low temp, biodegradable); PETG = durable; ABS = heat-resistant but warps. Slicer settings: layer height 0.2mm (standard) or 0.1mm (fine detail). Infill 15–20% for most prints; 40%+ for structural parts. Bed levelling is the #1 source of failed prints — dial it in carefully. Download free models from Printables, Thingiverse, MyMiniFactory. For electronics projects: Arduino (C++) is great for physical computing; Raspberry Pi (Python, Linux) for computing tasks.",
  },

  // ── 33. GAMING ───────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(gaming|video game|pc gaming|console|playstation|xbox|nintendo|steam|gpu|fps|mmo|rpg|battle royale|esports|twitch|streaming games|game design|unity|unreal engine|game dev|minecraft|fortnite|roblox|strategy game|simulation|puzzle game|retro gaming|emulator)\b/i,
    ],
    response:
      "Gaming tips: For competitive FPS — lower mouse sensitivity gives more accuracy (try 400–800 DPI). PC building: GPU is the most important component for gaming; pair it with a CPU that doesn't bottleneck it. Game dev with Unity (C#, great tutorials) or Godot (free, open-source, Python-like GDScript) for indie games. Streaming: OBS Studio is free and powerful; good lighting matters more than camera quality. For game design: start with the core gameplay loop, get it fun before adding content. Retro gaming: emulators like RetroArch, PCSX2, Cemu are legal to use with games you own.",
  },

  // ── 34. MUSIC & AUDIO ────────────────────────────────────────────────────
  {
    patterns: [
      /\b(music theory|chord|scale|note|rhythm|beat|tempo|melody|harmony|composition|piano|guitar|bass|drums|ukulele|violin|singing|voice training|recording|daw|audacity|ableton|logic pro|garageband|mixing|mastering|podcast recording|sound design|spotify|streaming music)\b/i,
    ],
    response:
      "Music basics: Notes: A B C D E F G (then repeats). A major scale: whole-whole-half-whole-whole-whole-half steps. Chord = 3+ notes; major = bright, minor = sad. C major chord: C-E-G. BPM (beats per minute): 60–80 is ballad, 120–140 is pop/dance, 160+ is fast/punk. For recording: treat your room (soft furnishings reduce echo) before buying expensive gear. DAW recommendations: GarageBand (free, Mac), Audacity (free, all platforms), Ableton Live (industry standard). For guitar, start with open chords (G, C, D, Em, Am) — you can play hundreds of songs.",
  },

  // ── 35. PHOTOGRAPHY & VIDEO ──────────────────────────────────────────────
  {
    patterns: [
      /\b(photography|photo|camera settings|aperture|shutter speed|iso|exposure|composition|rule of thirds|depth of field|bokeh|white balance|raw|jpeg|lightroom|photoshop|portrait|landscape|street photography|videography|video editing|premiere pro|davinci resolve|youtube|vlog)\b/i,
    ],
    response:
      "Photography essentials: Exposure triangle — Aperture (f-stop), Shutter Speed, ISO. Low f-number (f/1.8) = blurry background (bokeh), good in low light. Fast shutter (1/500+) freezes motion; slow shutter (1/30-) creates motion blur. Low ISO = less noise/grain. Rule of thirds: place subject at intersections, not dead centre. Shoot RAW for maximum editing flexibility. Lightroom workflow: import → cull → develop (exposure, white balance, colour) → export. Video: 24fps = cinematic, 30fps = TV/YouTube, 60fps = sports/slow-mo. Good audio (lapel mic or shotgun) matters more than 4K video.",
  },

  // ── 36. VISUAL ART & DESIGN ──────────────────────────────────────────────
  {
    patterns: [
      /\b(drawing|painting|sketch|illustration|digital art|procreate|figma|adobe|canva|colour theory|typography|graphic design|ui design|ux design|wireframe|prototype|logo design|icon|font|serif|sans.?serif|layout|grid|white space|brand identity|vector|raster|svg|png|jpg)\b/i,
    ],
    response:
      "Design principles: Colour theory — complementary colours (opposite on wheel) create contrast; analogous (adjacent) create harmony. Typography: limit to 2–3 fonts per design; pair a serif with a sans-serif. White space is not empty — it directs attention and reduces cognitive load. Rule of proximity: group related items together. For UI/UX: Figma is the industry standard (free tier available). Canva is great for quick social/print assets. Colour accessibility: ensure 4.5:1 contrast ratio for body text (WCAG AA). In digital: 72 DPI for screen; 300 DPI for print.",
  },

  // ── 37. FILM & TELEVISION ────────────────────────────────────────────────
  {
    patterns: [
      /\b(film|movie|cinema|director|screenplay|script|plot|genre|acting|oscar|netflix|streaming|documentary|animation|pixar|marvel|dc|bollywood|korean drama|anime|series|season|episode|imdb|rotten tomatoes|review film|cinematography|sound design film)\b/i,
    ],
    response:
      "Film literacy: Three-act structure: setup → confrontation → resolution. Key directors to know: Kubrick (visual precision), Spielberg (popular storytelling), Kurosawa (composition/samurai epics), Scorsese (gritty realism), Nolan (non-linear narrative). Screenplay format: roughly 1 page = 1 minute of screen time. For film reviews, IMDB and Letterboxd are reliable. Animation: Pixar uses RenderMan; anime is labour-intensive frame-by-frame. Korean cinema saw a global surge after Parasite's 2020 Oscar win. If you want to make films: start with a phone, good natural light, and a story worth telling.",
  },

  // ── 38. LITERATURE & BOOKS ───────────────────────────────────────────────
  {
    patterns: [
      /\b(book|novel|author|reading|literature|fiction|non.?fiction|classics|poetry|genre|thriller|mystery|sci.?fi|fantasy|biography|self.?help book|book club|reading list|kindle|audiobook|library|goodreads|book recommendation|plot|character|narrative|chapter)\b/i,
    ],
    response:
      "Reading recommendations by genre: Non-fiction productivity: 'Atomic Habits' (Clear), 'Deep Work' (Newport). Finance: 'The Psychology of Money' (Housel). Science: 'A Short History of Nearly Everything' (Bryson). Leadership: 'Thinking, Fast and Slow' (Kahneman). Sci-fi classics: '1984' (Orwell), 'Dune' (Herbert), 'The Martian' (Weir). Fantasy: Lord of the Rings, The Name of the Wind. Thriller: 'The Girl with the Dragon Tattoo', 'Gone Girl'. Literary classics: Dostoevsky's 'Crime and Punishment', Austen's 'Pride and Prejudice'. For speed reading: preview headings first, reduce subvocalisation, aim for 300 WPM.",
  },

  // ── 39. SPORTS ───────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(football|soccer|cricket|basketball|tennis|rugby|golf|baseball|athletics|swimming sport|martial arts|boxing|wrestling|formula 1|cycling sport|triathlon|marathon|olympics|world cup|premier league|nba|nfl|sport rules|coaching|referee|tactics|training sport)\b/i,
    ],
    response:
      "Sports quick-facts: Football/Soccer — 11 per side, 90 min, offside rule: attacker must have 2 opponents between them and goal when ball is played. Cricket — 11 per side, batting/bowling innings, 6 balls per over. Basketball — 5 per side, 4 quarters (NBA), 24-second shot clock. Tennis — 15/30/40/game, best of 3 or 5 sets, tiebreak at 6-6. Golf — lowest strokes wins; par = expected strokes per hole. F1 — 20 drivers, 20-24 races/season, points: 25/18/15/12/10/8/6/4/2/1 for top 10. For any sport, mastering fundamentals beats advanced techniques.",
  },

  // ── 40. OUTDOOR ACTIVITIES & SURVIVAL ───────────────────────────────────
  {
    patterns: [
      /\b(hiking|camping|survival|wilderness|navigation compass|fire starting|shelter building|water purification|foraging|knot tying|backpacking|trail|national park|bear safety|snake bite|hypothermia|altitude sickness|gear outdoor|tent|sleeping bag|trekking poles|map reading)\b/i,
    ],
    response:
      "Outdoor survival basics: The Rule of 3: 3 min without air, 3 h without shelter in harsh weather, 3 days without water, 3 weeks without food. Fire: tinder (fine dry material), kindling (small sticks), fuel (larger wood). Water: boil 1 min at altitude, or use purification tablets. Navigation: map + compass — align map to north, take bearing, walk on that bearing. Essential knots: bowline (loop that won't slip), clove hitch (secure to post), reef knot (joining two ropes). Bear safety: make noise while hiking, store food in bear canister, if attacked by black bear — fight back; grizzly — play dead. Hypothermia: remove wet clothes, warm the core first.",
  },

  // ── 41. GARDENING & PLANTS ───────────────────────────────────────────────
  {
    patterns: [
      /\b(garden|gardening|plant|flower|vegetable garden|herb|soil|compost|fertiliser|fertilizer|watering plant|sunlight plant|pruning|weed|seed|propagation|indoor plant|succulent|cactus|orchid|tomato growing|roses|lawn|grass|seasonal gardening|pest plant|aphid)\b/i,
    ],
    response:
      "Gardening guide: Soil is everything — enrich with compost, aim for loamy texture (holds moisture but drains well). pH 6–7 suits most vegetables. Full sun = 6+ hours direct light daily. Tomatoes: deep water, stake early, remove suckers for bigger fruit. Herbs: basil needs warmth; mint spreads aggressively (pot it separately). Easy beginner plants: courgette, salad leaves, radishes (fast), marigolds (repel pests). Composting: balance green waste (nitrogen) with brown (carbon) in ~1:3 ratio; keep moist; turn weekly. Indoor plants for air quality: peace lily, spider plant, pothos (all low maintenance).",
  },

  // ── 42. COOKING ADVANCED ─────────────────────────────────────────────────
  {
    patterns: [
      /\b(baking bread|sourdough|pastry|cake recipe|cookie|muffin|brownie|cheesecake|temperature baking|yeast|gluten development|emulsification|sauce making|stock broth|knife technique|julienne|mise en place|sous vide|fermentation|pickling|preserving|canning|meal planning|batch cook|food safety)\b/i,
    ],
    response:
      "Advanced cooking tips: Mise en place (everything in its place) before cooking prevents chaos. Bread: yeast needs 38°C water (too hot kills it). Sourdough: starter must be active (doubles in 4–8 h after feeding). Pastry: cold butter = flakier; don't overwork the dough. Stocks: cold water start, skim foam, never boil (simmer). Emulsification (mayo, hollandaise): add oil very slowly to egg yolk while whisking. Food safety: 63°C+ for most meats (74°C for poultry); cool cooked food within 2 hours; never refreeze thawed raw meat. Fermentation: lacto-fermented veg just needs salt + cabbage + time.",
  },

  // ── 43. INTERIOR DESIGN & HOME DECOR ─────────────────────────────────────
  {
    patterns: [
      /\b(interior design|home decor|decorating|furniture|room layout|colour scheme|paint|lighting design|curtains|rug|minimalism|maximalism|scandinavian|mid.?century|bohemian|industrial style|declutter|space|storage solutions|bedroom design|kitchen design|bathroom remodel|accent wall|floor plan)\b/i,
    ],
    response:
      "Interior design principles: 60-30-10 colour rule: 60% dominant (walls), 30% secondary (large furniture), 10% accent (accessories). Lighting layers: ambient (overhead) + task (work areas) + accent (highlights). Rug sizing: in a living room, all front legs of furniture should sit on the rug. Mirrors double perceived space and light. For small rooms: light colours, vertical lines, multifunctional furniture, fewer but larger pieces. Decluttering first makes design easier — edit before decorating. Scandinavian style: neutral palette, natural materials, functional simplicity. Gallery wall tip: lay out arrangement on floor before putting holes in wall.",
  },

  // ── 44. HOME IMPROVEMENT & DIY ───────────────────────────────────────────
  {
    patterns: [
      /\b(diy home|home repair|plumbing|electrical diy|drill|wall plug|anchor|tile|grouting|painting wall|sanding|varnish|shelf|flat pack|ikea|radiator bleed|toilet cistern|tap washer|insulation|draughtproofing|roof repair|gutter|fence|decking|wood stain|concrete|mortar)\b/i,
    ],
    response:
      "DIY home basics: Drilling into walls — stud finder or knock test for hollow vs solid; use correct anchors (plasterboard = toggle anchor, masonry = rawlplug + masonry drill bit). Bleeding a radiator: turn off heating, let cool, use radiator key to open valve until water (not air) comes out, close, check system pressure. Painting: sand first, prime new surfaces, cut-in edges with brush, roll the middle, 2 coats minimum. Grouting tiles: mix to peanut butter consistency, push diagonally, wipe excess within 30 min. For electrical work beyond switch replacement — always isolate at the consumer unit and use a socket tester.",
  },

  // ── 45. CLEANING & ORGANISATION ADVANCED ─────────────────────────────────
  {
    patterns: [
      /\b(deep clean|spring clean|konmari|marie kondo|minimalism declutter|organise home|closet organisation|pantry organisation|cleaning schedule|bathroom cleaning|kitchen deep clean|carpet cleaning|stain removal|laundry tips|ironing|dry cleaning|mould removal|limescale|blocked drain|cleaning hacks|eco cleaning)\b/i,
    ],
    response:
      "Cleaning pro tips: KonMari method: keep only items that 'spark joy'; category order: clothes → books → papers → komono (misc) → sentimental. Stain removal: act fast; cold water for protein stains (blood, egg); hot for grease; salt for red wine (then soak). Limescale: white vinegar (soak showerhead overnight). Mould on grout: bleach pen or thick bleach paste, 30 min, scrub. Blocked drain: baking soda + boiling vinegar, then plunge. Weekly cleaning rhythm: daily = kitchen surfaces + washing up; weekly = bathroom + hoover + mop; monthly = oven + fridge + windows. Microfibre cloths need no chemicals for most surfaces.",
  },

  // ── 46. FASHION ADVANCED & STYLE ─────────────────────────────────────────
  {
    patterns: [
      /\b(capsule wardrobe|outfit|style tips|colour coordination|body type|fit clothes|tailoring|second.?hand|thrift|sustainable fashion|fast fashion|fabric care|dress code|smart casual|business casual|formal wear|suit|tie|shoes care|accessory|watch|jewellery|personal style)\b/i,
    ],
    response:
      "Style fundamentals: Fit is king — ill-fitting expensive clothes look worse than well-fitted cheap ones. Capsule wardrobe core: neutral base (white/black/navy/grey/beige) with 1–2 accent colours. Body types: dress to elongate torso, balance shoulders/hips. Fabric care: wool in cool wash, silk hand wash, linen air dry. Shoe care: cedar shoe trees + leather conditioner extends life significantly. Business casual: chinos/dark jeans + OCBD shirt + clean white sneakers or loafers. Smart/formal: navy suit is the most versatile. Sustainable fashion: buy less, buy better, second-hand first, avoid synthetic micro-plastics.",
  },

  // ── 47. BEAUTY & SKINCARE ADVANCED ───────────────────────────────────────
  {
    patterns: [
      /\b(skincare routine|moisturiser|spf|sunscreen|retinol|vitamin c serum|hyaluronic acid|niacinamide|exfoliate|toner|cleanser|skin type|oily skin|dry skin|acne|rosacea|hyperpigmentation|dark circles|anti.?aging|collagen|dermatologist|makeup|foundation|concealer|contouring|skincare ingredients)\b/i,
    ],
    response:
      "Skincare essentials: Basic routine: cleanser → toner (optional) → serum → moisturiser → SPF (AM only). SPF is the #1 anti-ageing ingredient — use SPF30+ daily. Retinol: start 2x/week at night, go slow (purging is normal); don't combine with AHAs/BHAs. Vitamin C: brightens, antioxidant, apply AM. Hyaluronic acid: apply to damp skin, then seal with moisturiser. Niacinamide: reduces pores, oil control, anti-inflammatory. Acne: don't pick; benzoyl peroxide (bacteria), salicylic acid (unclogs pores). For persistent skin issues, see a dermatologist — most topicals take 8–12 weeks to show results.",
  },

  // ── 48. HAIR CARE ────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(hair care|shampoo|conditioner|hair type|curly hair|straight hair|wavy hair|hair loss|thinning hair|dandruff|scalp care|heat styling|hair mask|protein treatment|hair colour|dyeing hair|balayage|highlights|braiding|protective style|hair growth|biotin|castor oil hair)\b/i,
    ],
    response:
      "Hair care guide: Over-washing strips natural oils — most hair types need washing every 2–3 days. Conditioner on mid-lengths to ends; avoid scalp (except scalp conditioners). For curly hair (CGM): co-wash, detangle wet, scrunch in product, diffuse or air-dry. Hair loss: normal to shed 50–100 hairs/day. Excessive loss — check iron, ferritin, thyroid, vitamin D. Minoxidil (Rogaine) is evidence-based for androgenic hair loss. Heat styling: always use heat protectant, max 180°C for fine hair, 200°C for thick. DIY hair mask: egg + olive oil + honey (30 min, rinse cool water — hot cooks the egg).",
  },

  // ── 49. DENTAL HEALTH ────────────────────────────────────────────────────
  {
    patterns: [
      /\b(dental|teeth|toothbrush|floss|mouthwash|whitening|cavities|gum disease|gingivitis|braces|orthodontist|wisdom teeth|root canal|sensitivity teeth|enamel|fluoride|electric toothbrush|waterpik|oil pulling|bad breath|halitosis|dentist|dental hygiene)\b/i,
    ],
    response:
      "Dental health: Brush for 2 minutes, twice daily — electric toothbrush removes ~21% more plaque than manual. Floss or interdental brushes daily — most cavities form between teeth where brushes can't reach. Fluoride toothpaste (1450 ppm for adults) remineralises enamel. Don't rinse after brushing — let fluoride sit. Sugar frequency matters more than quantity (every snack = repeated acid attack). Sensitive teeth: use Sensodyne for 2+ weeks. Teeth whitening: tray + carbamide peroxide is most effective; whitening toothpastes are mildly abrasive. Signs of gum disease: bleeding when brushing (see dentist if persistent).",
  },

  // ── 50. SLEEP SCIENCE ────────────────────────────────────────────────────
  {
    patterns: [
      /\b(sleep|insomnia|sleep quality|sleep hygiene|circadian rhythm|rem sleep|deep sleep|sleep cycle|nap|melatonin|blue light|sleep tracking|snoring|sleep apnea|restless leg|jet lag|power nap|wake up early|morning routine|evening routine|screen before bed|bedroom temperature)\b/i,
    ],
    response:
      "Sleep science: Adults need 7–9 hours. Sleep cycles are 90 min — wake after 6 or 7.5 hours (not 7 or 8) to feel less groggy. REM sleep (dreaming) consolidates emotional memories; deep sleep (N3) repairs the body. Sleep hygiene: same wake time daily (even weekends) is more powerful than same bedtime. Bedroom: 16–19°C is optimal. Avoid screens 60 min before bed (blue light suppresses melatonin). Melatonin supplements: 0.5mg works as well as 5mg — start low. Jet lag: set watch to destination time immediately; get sunlight on arrival. Power nap: 10–20 min (don't enter deep sleep or you'll wake groggy).",
  },

  // ── 51. PREGNANCY & MATERNAL HEALTH ──────────────────────────────────────
  {
    patterns: [
      /\b(pregnancy|trimester|prenatal|antenatal|maternity|morning sickness|labour|childbirth|breastfeeding|newborn|postpartum|postnatal|midwife|obstetrician|c.?section|epidural|birth plan|baby kicks|due date|foetal|fetal|folate|folic acid|birth control|contraception)\b/i,
    ],
    response:
      "Pregnancy basics: Take 400 mcg folic acid daily from trying to conceive until 12 weeks (prevents neural tube defects). Avoid: alcohol, raw fish/meat, unpasteurised cheeses, excess vitamin A, high-mercury fish. Morning sickness: small frequent meals, ginger, avoid strong smells, vitamin B6 may help. Symptoms to act on immediately: heavy bleeding, severe abdominal pain, reduced foetal movement after 28 weeks, signs of pre-eclampsia (severe headache, visual disturbances, sudden swelling). Antenatal classes greatly increase confidence for labour. Postpartum: postnatal depression affects 1 in 10 mothers — seek GP help; it's treatable.",
  },

  // ── 52. AGEING & LONGEVITY ───────────────────────────────────────────────
  {
    patterns: [
      /\b(ageing|aging|longevity|healthy ageing|anti.?aging tips|lifespan|senescence|telomere|blue zone|centenarian|dementia prevention|alzheimer|cognitive decline|muscle mass ageing|bone density|osteoporosis|menopause|andropause|hormone ageing|retirement health|older adult exercise)\b/i,
    ],
    response:
      "Longevity science: Blue Zones (Okinawa, Sardinia, Loma Linda) share: plant-rich diet, regular low-intensity movement, strong social bonds, sense of purpose, and low chronic stress. Key pillars: 1) Resistance training to prevent muscle loss (sarcopenia from ~40). 2) Aerobic fitness — VO2 max is the strongest predictor of all-cause mortality. 3) Sleep 7–9 h. 4) Not smoking. 5) Limit alcohol. 6) Social connection (loneliness is as harmful as 15 cigarettes/day). Cognitive decline: learning new skills, physical exercise, and social engagement all reduce risk.",
  },

  // ── 53. DISABILITY & INCLUSION ───────────────────────────────────────────
  {
    patterns: [
      /\b(disability|wheelchair|blind|visually impaired|deaf|hearing impaired|autism|cerebral palsy|chronic illness|invisible disability|accessibility|ada|equality act|reasonable adjustment|carer|pia|pip|disability benefit|inclusion|neurodiversity|dyslexia|dyspraxia|dyscalculia|screen reader)\b/i,
    ],
    response:
      "Disability & accessibility: In the UK, the Equality Act 2010 requires reasonable adjustments in workplaces and public services. PIP (Personal Independence Payment) supports daily living/mobility costs — apply via DWP. Carers UK helpline: 0808 808 7777. For screen reader users: NVDA (free, Windows), VoiceOver (built-in Mac/iOS), TalkBack (Android). Neurodiversity note: dyslexia, ADHD, autism, dyspraxia are differences, not deficits — many benefit from specific tools (coloured overlays, fidget aids, structured routines, text-to-speech). Inclusive language: lead with 'disability' not 'special needs'; follow the individual's preference.",
  },

  // ── 54. CLIMATE CHANGE & ENVIRONMENT ─────────────────────────────────────
  {
    patterns: [
      /\b(climate change|global warming|carbon footprint|greenhouse gas|co2|emissions|renewable energy|solar panel|wind energy|fossil fuel|net zero|paris agreement|ipcc|deforestation|biodiversity|ocean acidification|plastic pollution|recycling advanced|circular economy|carbon offset|sustainability advanced|electric vehicle|ev|heat pump)\b/i,
    ],
    response:
      "Climate essentials: Global temperature has risen ~1.1–1.2°C above pre-industrial average; 1.5°C is the Paris Agreement target. Biggest individual carbon reductions (in order): 1) Have fewer children. 2) Go car-free. 3) Avoid transatlantic flights. 4) Switch to plant-rich diet. 5) Switch to EV. 6) Heat pump instead of gas boiler. 7) Renewable energy tariff. Carbon offsets are supplementary, not a replacement for reduction. The IPCC reports are the authoritative scientific consensus. Circular economy = keep materials in use as long as possible (repair, reuse, recycle in that order).",
  },

  // ── 55. WEATHER & METEOROLOGY ────────────────────────────────────────────
  {
    patterns: [
      /\b(weather|forecast|temperature|rain|snow|wind|cloud|humidity|barometric pressure|storm|tornado|hurricane|typhoon|lightning|thunder|fog|frost|heatwave|uv index|pollen count|met office|weather app|dew point|isobar|front weather)\b/i,
    ],
    response:
      "Weather literacy: High pressure = stable, clear weather. Low pressure = cloud, rain, wind. Cold front (cold air pushing under warm) = sudden temperature drop, often thunderstorms. UV index: 1–2 low, 3–5 medium (SPF30+), 6–7 high (seek shade), 8+ very high (avoid midday sun). Lightning safety: when you hear thunder you're within 10 miles — go inside; a vehicle is safer than open ground. Tornado warning vs watch: watch = conditions possible; warning = tornado has been spotted, take shelter immediately. Heatwave: stay hydrated, keep home cool (close south-facing blinds by day), check on elderly neighbours.",
  },

  // ── 56. ASTRONOMY PRACTICAL ──────────────────────────────────────────────
  {
    patterns: [
      /\b(stargazing|telescope|binoculars astronomy|dark sky|astrophotography|north star|polaris|moon phase|eclipse|meteor shower|iss spot|planet visible|milky way photograph|light pollution|star map|app astronomy|sky tonight)\b/i,
    ],
    response:
      "Stargazing guide: Let your eyes dark-adapt for 20 min (no white light). Use red light to preserve night vision. North Star (Polaris): find the Big Dipper's outer two stars and extend 5× upward. ISS is visible to the naked eye — check NASA Spot the Station website for pass times. Best meteor showers: Perseids (mid-August, up to 100/h), Geminids (mid-December, 120/h). Moon phases: new → waxing crescent → first quarter → waxing gibbous → full → waning gibbous → last quarter → waning crescent. Apps: SkySafari, Stellarium (free), Heavens-Above (ISS tracking).",
  },

  // ── 57. ANIMALS & WILDLIFE ───────────────────────────────────────────────
  {
    patterns: [
      /\b(wildlife|animal|wild animal|bird watching|birdwatching|mammal|reptile|amphibian|insect|bee|butterfly|migration|habitat|endangered species|wwf|nature reserve|safari|zoonotic|venom|snake identification|spider|wolf|bear|fox|deer|badger|hedgehog)\b/i,
    ],
    response:
      "Wildlife facts: Bees are crucial pollinators — to help them, plant lavender, borage, and wildflowers; avoid pesticides. Hedgehogs are declining — leave gaps in fences and avoid slug pellets. Bird identification: learn 20 common species by song — BirdNET app identifies from audio. Snake bite UK: the only venomous UK snake is the adder; bite is rarely fatal — keep calm, immobilise limb, call 999. Safari rule: never exit the vehicle, never feed animals, stay downwind of predators. For injured wildlife: contact RSPCA (UK) or Wildlife Centre. Migratory birds navigate using Earth's magnetic field, stars, and landmarks.",
  },

  // ── 58. MARINE LIFE & OCEAN ──────────────────────────────────────────────
  {
    patterns: [
      /\b(ocean|marine|sea|coral reef|shark|whale|dolphin|jellyfish|octopus|squid|deep sea|tide|current|wave|tsunami|scuba|snorkeling|diving|fishing|overfishing|plastic ocean|marine conservation|coral bleaching|sea turtle|seabird|mangrove|kelp forest)\b/i,
    ],
    response:
      "Ocean facts: Covers 71% of Earth's surface; 80%+ remains unexplored. The deepest point is Challenger Deep (~11,000 m, Mariana Trench). Sharks kill ~5–10 people globally per year (humans kill ~100 million sharks). Jellyfish sting treatment: remove tentacles (not bare-handed), rinse with seawater (not fresh), apply 45°C heat for 20 min. Coral bleaching occurs when water temperature rises >1°C above average for 4+ weeks — the reef expels its algae (zooxanthellae). Plastic: 8 million metric tons enter oceans yearly; microplastics now found in human blood. Tides are caused by gravitational pull of the Moon (primarily) and Sun.",
  },

  // ── 59. AGRICULTURE & FOOD SYSTEMS ───────────────────────────────────────
  {
    patterns: [
      /\b(farming|agriculture|crop|irrigation|harvest|organic farming|permaculture|hydroponics|aquaponics|soil health|crop rotation|fertiliser natural|pest management natural|gmo|seed saving|food waste|food security|global hunger|supply chain food|vertical farm|urban farming|beekeeping|smallholding|allotment)\b/i,
    ],
    response:
      "Agriculture basics: Crop rotation prevents soil depletion and breaks pest cycles — classic 4-year: root veg → legumes → brassicas → potatoes. Companion planting: tomatoes + basil repel aphids; marigolds deter many pests. Hydroponics uses 90% less water than soil farming and grows 3× faster. Permaculture: design food systems mimicking nature's resilience. Composting builds soil organic matter — key to fertility. Food waste: 30%+ of all food produced is wasted globally; cooking to portions, freezing leftovers, and using stems/leaves reduces household waste significantly. Allotment UK: contact local council; waiting lists can be 2–5 years in cities.",
  },

  // ── 60. TRANSPORT & LOGISTICS ────────────────────────────────────────────
  {
    patterns: [
      /\b(driving|licence|mot|car insurance|motorway|highway code|road sign|traffic law|speeding|parking|road trip planning|logistics|supply chain|shipping|freight|customs|import|export|lorry|truck|train|rail|bus|coach|cycling commute|public transport|congestion charge|toll)\b/i,
    ],
    response:
      "Transport guide: UK Highway Code 2022 update: cyclists can ride in the centre of their lane; drivers must give cyclists/pedestrians priority at junctions. MOT required annually from 3 years old — book at any DVSA-authorised garage. Car insurance: compare via MoneySuperMarket, Confused.com; named drivers affect premium. Motorway driving: left lane is for driving, middle/right for overtaking only. For logistics: Incoterms define who is responsible for shipping costs at each stage (FOB, CIF, DAP etc). Importing goods: check HS code (commodity code) to determine customs duty and VAT. Cycling to work: Cycle to Work scheme gives ~42% saving on bikes via salary sacrifice.",
  },

  // ── 61. AVIATION & AEROSPACE ─────────────────────────────────────────────
  {
    patterns: [
      /\b(aviation|aircraft|pilot|fly|airport|flight|takeoff|landing|turbulence|air traffic control|boeing|airbus|jet engine|how planes fly|lift|drag|thrust|private pilot|ppl|commercial pilot|atpl|gliding|parachute|skydiving|drone flying|uav|airspace)\b/i,
    ],
    response:
      "Aviation basics: How planes fly — Bernoulli effect creates lift: faster airflow over curved wing top = lower pressure; combined with angle of attack. Four forces: lift (up), weight (down), thrust (forward), drag (backward). Turbulence: normal and safe; modern aircraft are designed for far greater stress than any turbulence encountered. Takeoff/landing are statistically the 'riskier' phases but flying remains the safest form of transport per mile. PPL (Private Pilot Licence): ~45 hours minimum, typically 6–18 months. Drone UK rules: register if drone >250g; don't fly above 120m or within 50m of uninvolved people.",
  },

  // ── 62. ARCHITECTURE & URBAN PLANNING ────────────────────────────────────
  {
    patterns: [
      /\b(architecture|architect|building|structure|urban planning|city design|housing|planning permission|listed building|conservation area|green building|passive house|leed|breeam|bridge design|skyscraper|foundation|load bearing|structural engineer|zoning|planning application|building regulation)\b/i,
    ],
    response:
      "Architecture & planning: UK planning permission needed for: extensions beyond permitted development limits, change of use, new buildings. Permitted development: single-storey rear extension ≤4m (detached) or 3m (other). Listed building consent needed for ANY changes to a listed building (criminal offence to alter without it). Passive house standard: almost zero energy for heating — superinsulation + airtight envelope + MVHR (mechanical ventilation heat recovery). BREEAM is the UK green building standard; LEED is USA-equivalent. Structural engineer needed when removing walls, adding floors, or major foundation work. Good urban design: 15-minute cities (walk/cycle to all daily needs).",
  },

  // ── 63. PHYSICS APPLIED (ENERGY & ENGINEERING) ───────────────────────────
  {
    patterns: [
      /\b(engineering|civil engineering|mechanical engineering|electrical engineering|renewable energy|solar|wind turbine|nuclear|battery technology|energy storage|smart grid|efficiency|thermodynamics applied|materials science|steel|concrete|composite|nanotechnology|robotics|automation|manufacturing|lean manufacturing|six sigma)\b/i,
    ],
    response:
      "Engineering overview: Civil = infrastructure (bridges, roads, buildings). Mechanical = machines, thermal, fluid systems. Electrical = power, electronics, control systems. Renewable energy: solar PV converts ~20–22% efficiency (commercial); wind turbine ~35–45%. Nuclear fission produces ~1 million× more energy per kg than coal with zero operational CO2. Batteries: lithium-ion (high energy density, degrades after ~500–1000 cycles); solid-state batteries (next gen — safer, higher density) coming 2025–2030. Lean manufacturing = eliminate waste (muda); Six Sigma = reduce process variation (DMAIC: Define → Measure → Analyse → Improve → Control).",
  },

  // ── 64. MEDIA & JOURNALISM ────────────────────────────────────────────────
  {
    patterns: [
      /\b(journalism|media|news|fact.?check|misinformation|disinformation|media bias|newspaper|tv news|podcast|radio|press freedom|investigative journalism|social media|fake news|algorithm|echo chamber|media literacy|source credibility|wikipedia|citation|research skills)\b/i,
    ],
    response:
      "Media literacy: Check source credibility: author expertise, publication reputation, date, citations, other outlets reporting the same. Fact-check sites: Full Fact (UK), Snopes, FactCheck.org, PolitiFact. Misinformation spreads 6× faster than accurate news on social media (MIT study). Red flags: extreme emotional language, no author named, obscure domain, contradicts mainstream science. Wikipedia is a starting point, not a primary source — use its footnotes. For research: Google Scholar, PubMed (medical), JSTOR (academic), government .gov/.gov.uk sources. Confirmation bias = we tend to believe information confirming our existing views — actively seek counter-evidence.",
  },

  // ── 65. SOCIAL MEDIA & DIGITAL LIFE ──────────────────────────────────────
  {
    patterns: [
      /\b(social media|instagram|facebook|twitter|x platform|tiktok|linkedin|youtube|reddit|snapchat|digital wellbeing|screen time|doomscrolling|content creation|algorithm social|followers|engagement|digital detox|online privacy|data privacy|cookie|terms of service|digital footprint|influencer|monetise|creator economy)\b/i,
    ],
    response:
      "Digital life tips: Social media algorithms reward engagement (comments > shares > likes) and watch time — emotional content spreads fastest. To reduce doomscrolling: set app timers, remove apps from home screen, charge phone outside bedroom. For content creation: consistency > quality initially; choose one platform first. LinkedIn: connect with a personal note, post insights not just job updates, 80/20 (give value 80%, promote 20%). Digital footprint: Google yourself periodically; request data deletion from data brokers (Experian, Equifax). Children under 13 shouldn't legally be on most platforms (COPPA). Data privacy: read what permissions apps request — location always on is rarely necessary.",
  },

  // ── 66. VOLUNTEERING & SOCIAL IMPACT ─────────────────────────────────────
  {
    patterns: [
      /\b(volunteering|charity|non.?profit|ngo|fundraising|donation|social enterprise|community|activism|campaign|advocacy|grant|impact|social good|pro bono|food bank|shelter homeless|blood donation|organ donation|mentoring|befriending|civic|citizenship)\b/i,
    ],
    response:
      "Volunteering guide: UK: Do-it.org is the national volunteering database. NHS: donate blood every 12 weeks (men), 16 weeks (women) via NHS Blood Donate app. Organ donation: all adults in England are now opted in by default (max opt-out on NHS website). Effective altruism: GiveWell ranks charities by cost-per-life-saved (malaria nets, deworming programmes rank highest). For fundraising: JustGiving and GoFundMe are mainstream; gift aid adds 25% to UK donations at no cost to donor. Social enterprise: profit + social/environmental mission; B Corp certification shows verified standards. Mentoring: commit minimum 1 h/month; consistency matters more than frequency.",
  },

  // ── 67. INTERCULTURAL COMPETENCE & TRAVEL CULTURE ────────────────────────
  {
    patterns: [
      /\b(culture|cultural difference|etiquette|customs|expat|living abroad|working abroad|international|cross.?cultural|japanese etiquette|indian culture|middle east customs|european culture|american culture|tipping culture|dress code abroad|religion customs|ramadan|diwali|hanukkah|christmas|eid|buddhism|hinduism|islam|christianity|judaism)\b/i,
    ],
    response:
      "Cultural etiquette: Japan — bow on greeting, remove shoes indoors, don't tip (it can be offensive). Middle East — dress modestly, use right hand for eating/giving, respect prayer times. India — remove shoes before entering homes/temples, head wobble means yes/okay, vegetarian options widely available. USA — tipping is expected (15–20% in restaurants). France — greet with 'Bonjour' before any request; not doing so is considered rude. Ramadan: Muslims fast sunrise to sunset; avoid eating in front of fasting colleagues out of respect. Business card exchange: in Japan and China, give and receive with both hands and a slight bow.",
  },

  // ── 68. MINDFULNESS & SPIRITUALITY ───────────────────────────────────────
  {
    patterns: [
      /\b(mindfulness|meditation practice|breathing technique|spiritual|chakra|zen|buddhism practice|yoga philosophy|stoicism practice|gratitude practice|journaling practice|visualization|manifestation|law of attraction|prayer|faith|inner peace|present moment|awareness|consciousness practice|self.?actualization)\b/i,
    ],
    response:
      "Mindfulness practice: Start with just 5 min daily — results compound over weeks. Box breathing (4-4-4-4): inhale 4s, hold 4s, exhale 4s, hold 4s — activates parasympathetic nervous system within 2 minutes. Body scan: attention moves from feet to head, noticing sensations without judgment — great for sleep. Apps: Headspace, Calm, Insight Timer (free). Gratitude journalling: 3 specific things daily — specificity matters more than length. Stoic morning practice: meditate on potential obstacles; Stoic evening: what went well, what could improve. Mindfulness reduces cortisol, improves focus, and increases grey matter density with 8 weeks of daily practice.",
  },

  // ── 69. RETIREMENT PLANNING ───────────────────────────────────────────────
  {
    patterns: [
      /\b(retirement|retire|pension plan|state pension|workplace pension|private pension|sipp|annuity|drawdown|fire movement|financial independence|retire early|4 percent rule|retirement age|pensioner|later life|succession planning|inheritance|estate planning|will|trust|probate|lasting power of attorney)\b/i,
    ],
    response:
      "Retirement planning: UK State Pension: requires 35 qualifying NI years for full amount (~£11,502/year 2024). Access from age 66 (rising to 67 by 2028). Workplace pensions: employer must contribute minimum 3%, employee 5%. SIPP: self-invested pension — full control of investments, tax relief at your marginal rate. The 4% rule: withdraw 4% of portfolio annually = sustainable for 30 years (Trinity study). FIRE (Financial Independence, Retire Early): save 25× annual expenses. Drawdown gives flexibility; annuity gives certainty of income. Lasting Power of Attorney (LPA): set up while you have mental capacity — covers finances and health/welfare separately.",
  },

  // ── 70. QUANTUM COMPUTING & FUTURE TECH ──────────────────────────────────
  {
    patterns: [
      /\b(quantum computing|qubit|quantum|quantum entanglement|superposition|quantum supremacy|ibm quantum|google quantum|d.?wave|future technology|biotechnology|crispr|gene editing|synthetic biology|brain.?computer interface|bci|neuralink|augmented reality|ar glasses|metaverse|nanobot|fusion energy|iter)\b/i,
    ],
    response:
      "Future tech overview: Quantum computers use qubits that can be 0 and 1 simultaneously (superposition) + entanglement for parallel computation — exponentially faster for specific problems (cryptography, drug discovery, logistics). Not a replacement for classical computers — complementary. CRISPR-Cas9: molecular scissors that edit DNA sequences; used in medicine, agriculture, gene therapy. Fusion energy (ITER project): replicates the Sun's power; net energy gain achieved at NIF in 2022 — commercial plants expected 2030s–2040s. BCI (Brain-Computer Interface): Neuralink achieved first human implant 2024 — early applications for paralysis. AR: Apple Vision Pro (2024) leads spatial computing — mainstream adoption likely 2026–2028.",
  },

  // ── BONUS CATEGORIES (21–30 extra for depth) ─────────────────────────────

  // 71. WINE & BEVERAGES
  {
    patterns: [
      /\b(wine|champagne|beer|whisky|whiskey|gin|vodka|rum|cocktail|spirits|brewing|fermentation drink|sommelier|wine pairing|red wine|white wine|rosé|prosecco|craft beer|non.?alcoholic|mocktail|coffee types|espresso|latte|flat white|matcha|kombucha)\b/i,
    ],
    response:
      "Drinks guide: Wine pairing — white with fish/chicken/light pasta; red with red meat/hearty pasta; rosé with summer salads. Serving temperatures: sparkling/white 7–10°C, light red 12–15°C, full-bodied red 17–19°C. Whisky regions: Scottish Highlands (peaty/smoky), Speyside (fruity/floral), Islay (intensely peaty). Cocktail fundamentals: balance spirit + sour + sweet + dilution. Classic ratios: Margarita 2:1:1 (tequila:cointreau:lime). Espresso: 18–20g coffee, 25–30s extraction, 36–40g yield. Kombucha is fermented tea with live cultures — low alcohol, probiotic benefits. Always drink responsibly.",
  },

  // 72. INTERIOR PLANTS & URBAN GROWING
  {
    patterns: [
      /\b(houseplant|indoor plant care|pothos|monstera|peace lily|snake plant|fiddle leaf|rubber plant|propagate plant|plant repot|overwater|underwater plant|grow light|plant food|root rot|hydroponics home|microgreens|grow kit|herb window|window box|balcony garden|community garden)\b/i,
    ],
    response:
      "Houseplant care: Most plants die from overwatering, not underwatering — check soil 2 cm deep before watering. Signs of overwatering: yellowing leaves, mushy stems, fungus gnats. Signs of underwatering: dry soil, drooping, crispy tips. Best air purifiers: peace lily, spider plant, pothos, snake plant (all low-light tolerant). Monstera: bright indirect light, water when top 2 cm dry. Propagation: pothos/philodendron — cut below a node, place in water for 2–4 weeks, pot when roots are 3+ cm. Repotting: go only 1–2 cm larger pot; do it in spring. Grow lights: 2,000–3,000 lux for shade plants, 10,000+ for herbs.",
  },

  // 73. CRAFTS & TEXTILES
  {
    patterns: [
      /\b(knitting|crochet|sewing|embroidery|needlework|quilting|weaving|macramé|pottery|ceramics|origami|papercraft|woodworking|carving|leatherwork|jewellery making|resin art|candle making|soap making|fabric|yarn|pattern|stitch|loom|hook needle|craft supplies|upcycling craft)\b/i,
    ],
    response:
      "Crafts guide: Knitting vs crochet: knitting uses 2 needles, crochet uses 1 hook — crochet is generally easier for beginners. Cast-on (knit) or magic ring (crochet) is the starting technique. Sewing: always press seams as you go; measure twice, cut once. Pottery: earthenware fires at 1000°C, stoneware at 1200°C, porcelain at 1280°C+. Candle making: soy wax melts at ~50°C, add fragrance at 55–60°C, pour at 55°C. Safety: always use a thermometer. Resin: mix Part A and B exactly per instructions; work in well-ventilated area; UV resin cures in minutes with UV lamp. Woodworking starter tools: circular saw, drill, orbital sander, workbench.",
  },

  // 74. MILITARY & DEFENCE (HISTORICAL/EDUCATIONAL)
  {
    patterns: [
      /\b(military history|war strategy|tactics|battle|army|navy|air force|special forces|nato|un peacekeeping|warfare|siege|cavalry|trench warfare|guerrilla|asymmetric|nuclear deterrence|arms treaty|defence budget|medal|rank|military protocol)\b/i,
    ],
    response:
      "Military history overview: Sun Tzu's 'The Art of War' (500 BC): know yourself, know your enemy. Trench warfare (WW1) created stalemate through defensive technology outpacing offensive. Blitzkrieg (WW2 Germany): fast coordinated armour + air + infantry disrupting command rather than holding lines. Guerrilla warfare: asymmetric tactics used by smaller forces against conventional armies (Vietnam, Afghanistan). NATO (1949): collective defence — attack on one = attack on all (Article 5, invoked once after 9/11). Nuclear deterrence is based on MAD (Mutually Assured Destruction). Military ranks (UK Army): Private → Corporal → Sergeant → Lieutenant → Captain → Major → Colonel → General.",
  },

  // 75. MYTHOLOGY & FOLKLORE
  {
    patterns: [
      /\b(mythology|myth|greek myth|roman myth|norse|viking|egyptian myth|hindu mythology|japanese folklore|celtic|arthurian|legend|fable|fairy tale|folklore|zeus|poseidon|odin|thor|ra|krishna|shiva|dragon myth|phoenix|unicorn|magic|supernatural|ghost|spirit)\b/i,
    ],
    response:
      "Mythology overview: Greek — Zeus (sky/lightning), Poseidon (sea), Hades (underworld), Athena (wisdom), Ares (war), Aphrodite (love), Apollo (sun/arts), Artemis (moon/hunt). Norse — Odin (wisdom/war), Thor (thunder), Freya (love/fertility), Loki (trickster), Valhalla (hall of fallen warriors). Egyptian — Ra (sun), Osiris (death/rebirth), Isis (magic), Anubis (embalming/afterlife), Horus (sky). Hindu — Brahma (creator), Vishnu (preserver), Shiva (destroyer), Ganesha (success). Common archetypes: hero's journey (Campbell), trickster, great mother, shadow. Most myths explain natural phenomena, cultural values, or origin stories.",
  },

  // 76. BOARD GAMES & PUZZLES
  {
    patterns: [
      /\b(board game|card game|chess|checkers|scrabble|monopoly|catan|ticket to ride|pandemic board|dungeons and dragons|dnd|tabletop|dice|strategy game|puzzle|jigsaw|sudoku|crossword|word game|brain teaser|rubik.?s cube|escape room|trivia|game night)\b/i,
    ],
    response:
      "Board game guide: Best strategy games: Catan (trading/building), Ticket to Ride (routes), Pandemic (cooperative), Terraforming Mars (engine-building). Chess basics: control the centre early; develop knights before bishops; castle early; don't move the same piece twice in the opening. Rubik's Cube beginner solution: learn the CFOP method layer by layer — average solve ~2 min for beginners, sub-20 seconds for advanced. Sudoku: start with rows/columns/boxes with the most filled numbers; look for where a number can only go in one cell. For DnD: start with the Starter Set — pre-made adventure, simplified rules, 5–6 players including DM.",
  },

  // 77. MAGIC TRICKS & PERFORMANCE
  {
    patterns: [
      /\b(magic trick|card trick|illusion|sleight of hand|juggling|circus|performance art|street performance|mime|improv comedy|stand.?up|comedy writing|magic show|mentalism|escapology|levitation|disappearing|misdirection|magic tutorial)\b/i,
    ],
    response:
      "Magic basics: All magic is misdirection — control what the audience looks at, control what they believe. Card tricks to learn first: the force (controlling which card is 'chosen'), the glide, the double lift. Practice in front of a mirror before performing for people. Juggling: start with scarves (slow), then beanbags (3-ball cascade is the foundation — learn over a bed). Improv comedy rules: 'Yes, and' — accept your partner's premise and add to it. Stand-up structure: premise → misdirection → punchline (subverts expectation). Street performance tip: always build a crowd before starting; end with a clear call for donations.",
  },

  // 78. WASTE MANAGEMENT & RECYCLING
  {
    patterns: [
      /\b(recycling|waste|rubbish|landfill|e.?waste|hazardous waste|composting advanced|zero waste|plastic recycling|glass recycling|cardboard|food waste management|reduce reuse recycle|upcycling|freecycle|clothing donation|electronics disposal|battery disposal|paint disposal|medication disposal)\b/i,
    ],
    response:
      "Waste guide: Recycling rules vary by local authority — check your council's website. Generally accepted: clean paper/card, glass jars, metal tins, plastic bottles (1, 2, 5). NOT usually accepted: black plastic, polystyrene, food-contaminated packaging (clean it). E-waste: free at WEEE drop-off points (most supermarkets and councils). Batteries: free collection boxes at most supermarkets. Medications: return to pharmacy (never flush). Paint: Paintcare scheme; or harden with cat litter and bin. Food waste: compost bin or Bokashi for cooked food. Zero waste hierarchy: refuse → reduce → reuse → recycle → rot (compost) → last resort: landfill.",
  },

  // 79. NUTRITION FOR ATHLETES
  {
    patterns: [
      /\b(sports nutrition|athlete diet|pre.?workout|post.?workout|protein shake|creatine|bcaa|carb loading|recovery nutrition|hydration sport|electrolyte|marathon nutrition|triathlon diet|muscle building diet|cutting diet|bulking|calorie surplus|calorie deficit|lean bulk|body composition|supplement sport)\b/i,
    ],
    response:
      "Sports nutrition: Protein: 1.6–2.2 g/kg/day for muscle building; 1.2–1.6 g/kg for endurance. Creatine monohydrate: most evidence-based supplement — 3–5 g/day (no loading needed); safe long-term. Carb timing: 30–60 g carbs/hour during exercise >90 min. Post-workout: protein + carbs within 2h (less critical than once thought but still beneficial). Hydration: 500 ml water 2h before exercise; 150–250 ml every 15–20 min during; weigh yourself before and after for sweat loss. Electrolytes needed after >1h sweating. BCAAs are largely redundant if protein intake is sufficient. Caffeine: 3–6 mg/kg pre-workout is evidence-based for performance.",
  },

  // 80. SIGN LANGUAGE & COMMUNICATION AIDS
  {
    patterns: [
      /\b(sign language|bsl|asl|deaf communication|hearing aid|cochlear implant|lip reading|makaton|aac|augmentative communication|communication board|speech therapy|aphasia|stutter|stammer|selective mutism|non.?verbal|visual schedule|pecs|symbol communication|text to speech|voice output)\b/i,
    ],
    response:
      "Communication support: BSL (British Sign Language) and ASL (American Sign Language) are distinct languages with their own grammar — not signed versions of English. Makaton uses signs + symbols alongside speech to support understanding. PECS (Picture Exchange Communication System) helps non-verbal users communicate by exchanging picture cards. AAC (Augmentative and Alternative Communication) includes low-tech (boards) and high-tech (voice output devices, eye-gaze). Speech therapy helps with stuttering, aphasia (post-stroke), articulation, and language development. BSL learning: YouTube 'Dr Bill Vicars' (ASL), SignBSL.com (BSL). NHS provides speech therapy referrals via GP.",
  },

  // ── CATCH-ALL ENRICHMENT (topic expansion for 10,000+ scenarios) ──────────

  // 81. SAILING & WATER SPORTS
  {
    patterns: [
      /\b(sailing|boat|yacht|kayak|canoe|surfing|kitesurfing|windsurfing|paddleboard|rowing|white water|navigation sea|knot sailing|tide sailing|vhf radio|rnli|coast guard|life jacket|flare|weather sailing|anchor|mooring|marina|chandlery)\b/i,
    ],
    response:
      "Sailing basics: Points of sail — when wind is directly behind you (running) you're slower than when it's at 45° (beam reach is fastest). Key knots: bowline (loop), cleat hitch (securing), reef knot (reefing sails), round turn and two half hitches (mooring). Right of way: sailing vessel has right of way over motorised; upwind vessel (windward) gives way to downwind (leeward). VHF Channel 16 is the international distress and calling channel — always monitor when underway. Life jacket: always wear on a dinghy; recommended offshore. RNLI: free emergency service; donate at RNLI.org. Paddleboard: kneel first to find balance, then stand with feet hip-width, knees slightly bent.",
  },

  // 82. FINANCIAL SCAMS & FRAUD PREVENTION
  {
    patterns: [
      /\b(scam|fraud|con|phishing email|investment scam|romance scam|pension fraud|tax scam|hmrc scam|impersonation|bank fraud|authorised push payment|money mule|pyramid scheme|ponzi|advance fee fraud|nigerian prince|lottery scam|job scam|fake invoice)\b/i,
    ],
    response:
      "Scam prevention: HMRC will NEVER call threatening immediate arrest or demand iTunes vouchers — hang up. Banks will NEVER ask for your full PIN or to move money to a 'safe account' — hang up and call the number on the back of your card. Investment scam warning signs: guaranteed high returns, pressure to act quickly, unregulated firm. Check FCA register before investing. Romance scam: person you've never met asks for money — always a scam. APP (Authorised Push Payment) fraud: you're tricked into sending money yourself — banks now must refund under UK rules from Oct 2024. Report fraud: Action Fraud 0300 123 2040 (UK). If you've transferred money, call your bank immediately — recall is sometimes possible within 24h.",
  },

  // 83. HOME ENERGY & BILLS
  {
    patterns: [
      /\b(energy bill|electricity bill|gas bill|reduce energy|smart meter|tariff|standing charge|unit rate|ofgem|price cap|switch energy|insulation home|draft proofing|boiler efficiency|heat pump home|solar panel home|battery storage home|energy monitor|kwh|electricity usage|energy saving)\b/i,
    ],
    response:
      "Energy saving guide: Heating = ~55% of UK household energy bills. Each 1°C reduction saves ~3%. Smart thermostat (Nest, Hive) saves average £130/year. Radiator thermostatic valves: turn down in unused rooms. Draught proofing (doors, letterboxes, windows): ~£200 saving/year. Loft insulation 270mm: saves ~£350/year. Cavity wall insulation: ~£475/year saving. Solar panels: 4kWp system (~£6–8K) saves ~£680/year on bills; payback ~10–12 years. Smart meters show real-time usage — cook with lids on, don't overfill kettle. Switching tariff: use comparison sites every year; fixed tariffs give budget certainty.",
  },

  // 84. INTERVIEW PREPARATION
  {
    patterns: [
      /\b(job interview|interview tips|interview question|tell me about yourself|strength weakness|star method|behavioural interview|competency|salary negotiation|offer|counteroffer|interview preparation|video interview|panel interview|technical interview|assessment centre|psychometric test|group exercise|presentation interview)\b/i,
    ],
    response:
      "Interview guide: STAR method (Situation, Task, Action, Result) for behavioural questions — keep answers 1.5–3 min. 'Tell me about yourself': 2–3 min covering background → key experience → why this role. 'Weakness': pick a genuine one and say what you're doing to improve it. Research: company website, recent news, LinkedIn profiles of interviewers, Glassdoor reviews. Questions to ask: 'What does success look like in this role at 6 months?' and 'What are the biggest challenges the team is facing?'. Salary negotiation: always negotiate — ask for 10–15% above target; use the BATNA (Best Alternative to Negotiated Agreement) for leverage. Follow up with a thank-you email within 24h.",
  },

  // 85. WORKPLACE RIGHTS & HR
  {
    patterns: [
      /\b(employment rights|workplace|hr|holiday entitlement|sick pay|maternity leave|paternity leave|redundancy|unfair dismissal|discrimination work|grievance|disciplinary|employment tribunal|minimum wage|zero hours|contract|notice period|probation|reference|workplace bullying|health safety|risk assessment|whistleblowing)\b/i,
    ],
    response:
      "UK Employment rights: Minimum 28 days paid annual leave (inc bank holidays) for full-time workers. Statutory Sick Pay (SSP): £116.75/week from day 4 (2024). Statutory Maternity Pay: 90% for 6 weeks, then £184.03 or 90% (whichever lower) for 33 weeks. Redundancy pay after 2 years' service: 0.5 week's pay per year under 22; 1 week 22–40; 1.5 weeks 41+. Unfair dismissal claims: after 2 years' service (mostly). Equal pay: men and women must receive equal pay for equal work. Whistleblowing protection: protected disclosures can't result in dismissal. Grievance: raise formally in writing if informal fails; ACAS helpline: 0300 123 1100.",
  },

  // 86. CRISIS MANAGEMENT & BUSINESS CONTINUITY
  {
    patterns: [
      /\b(crisis management|business continuity|disaster recovery|incident response|risk management|bcp|drp|black swan|scenario planning|stakeholder communication crisis|media crisis|pr crisis|supply chain disruption|cyber incident|pandemic planning|evacuation plan|crisis communication|reputation management)\b/i,
    ],
    response:
      "Crisis management fundamentals: The first hour matters most — acknowledge, assess, act. Crisis communication rule: communicate early even if you don't have all the answers; silence is interpreted as guilt. Business Continuity Plan (BCP): identify critical functions, RTOs (Recovery Time Objectives), and responsible owners. Cyber incident response: isolate affected systems, preserve evidence, notify ICO within 72h if personal data breached (UK GDPR). Reputation management: apologise genuinely if at fault; correct without over-explaining. Black swan events (Nassim Taleb): unpredictable, high-impact — build resilience rather than trying to predict. Practice through tabletop exercises annually.",
  },

  // 87. PERSONAL BRANDING & CAREER DEVELOPMENT
  {
    patterns: [
      /\b(personal brand|career development|career change|career advice|networking career|linkedin profile|portfolio|professional development|cpd|mentorship|mentor|coaching career|promotion|raise salary|side income|skill development|transferable skills|career pivot|industry research|professional network|thought leadership)\b/i,
    ],
    response:
      "Career development: Personal brand = what people say about you when you're not in the room — be intentional. LinkedIn: complete profile, post 1–2 insights/week, engage on others' posts. Skills to prioritise: communication, data literacy, AI tools, emotional intelligence — most future-proof across industries. Career change: 70% of jobs aren't advertised — network actively. The informational interview (15–20 min ask for advice, not a job) opens more doors than cold applications. CPD (Continuing Professional Development): document learning yearly for regulated professions. Mentorship: be specific in your ask; prepare for every meeting; give back when you can.",
  },

  // 88. FESTIVALS & EVENTS
  {
    patterns: [
      /\b(festival|event planning|party planning|wedding planning|wedding|birthday party|corporate event|conference|concert|gig|event management|catering|venue|ticket|festival gear|glastonbury|camping festival|volunteer festival|street food|food festival|cultural festival|fireworks|new year|christmas planning)\b/i,
    ],
    response:
      "Event planning essentials: For weddings: book venue and caterer 12–18 months ahead; florist and photographer 9–12 months; invitations 6–8 weeks (save the dates 6 months). Budget split (rough): venue 30%, catering 30%, photography 15%, everything else 25%. Festival packing: waterproofs, portable charger, cash, earplugs, sunscreen, reusable water bottle, small rucksack. Glastonbury tips: registration lottery in October; travel by coach from London; camp near a toilet block but not too close. Corporate event: always confirm numbers 48h before for catering; have a backup AV plan; budget 10% contingency. Fireworks safety: light and retire, never return to a lit firework.",
  },

  // 89. HOME SAFETY & SECURITY
  {
    patterns: [
      /\b(home security|burglar|alarm system|cctv|cctv home|smart doorbell|ring doorbell|lock|deadlock|door chain|window lock|safe|fire alarm|carbon monoxide|smoke detector|escape plan fire|home insurance|security light|neighbourhood watch|peephole|door reinforcement|key safe)\b/i,
    ],
    response:
      "Home security layers: Physical first — deadbolt locks (BS3621 for insurance), window locks on all windows, solid wooden/steel door frames. Alarm: monitored system deters ~60% of burglars. CCTV/smart doorbell (Ring, Eufy): visible cameras deter crime; store footage for 30 days minimum. Security lighting: PIR-activated on all approaches. Don't advertise absence on social media. Safe: bolt it to floor/wall, hide in a wardrobe. Fire: install interlinked smoke alarms on every floor; test monthly; CO alarm in every room with a gas appliance. Escape plan: know 2 routes out; practice with family; pick a meeting point. Home insurance: buildings + contents; check coverage for high-value items.",
  },

  // 90. DATA ANALYSIS & SPREADSHEETS
  {
    patterns: [
      /\b(excel|spreadsheet|google sheets|pivot table|vlookup|xlookup|formula|data analysis|chart|graph|dashboard spreadsheet|csv|import data|conditional formatting|filter|sort|sum|average|countif|index match|macro|automation spreadsheet|power bi|tableau|data visualisation)\b/i,
    ],
    response:
      "Excel/Sheets mastery: Essential formulas: VLOOKUP(lookup,range,col,FALSE), INDEX/MATCH (more flexible), SUMIF(range,criteria,sum_range), COUNTIFS, IFERROR(formula,0). Pivot tables: insert → select data range → drag fields to rows/columns/values — powerful for summarising large datasets in seconds. Keyboard shortcuts: Ctrl+Shift+L (filter), Ctrl+T (table), F4 (lock reference: $A$1). Charts: choose bar for comparison, line for trend, scatter for correlation, pie only for 2–3 slices. Power BI: drag-and-drop dashboards from multiple data sources; free desktop version available. Data cleaning: remove duplicates (Data tab), use TRIM() for spaces, TEXT() to standardise formats.",
  },
];
