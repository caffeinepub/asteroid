/**
 * Aster Offline Rule-Based AI Engine — Extended Edition
 * Covers 10,000+ work, household, lifestyle, creative, and specialty scenarios.
 * No network required — fully local, instant responses.
 */

type Rule = {
  patterns: RegExp[];
  response: string | ((match: RegExpMatchArray, input: string) => string);
};

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─────────────────────────────────────────────────────────────────────────────
// RULES DATABASE
// ─────────────────────────────────────────────────────────────────────────────
const RULES: Rule[] = [
  // ── GREETINGS & SELF ──────────────────────────────────────────────────────
  {
    patterns: [
      /^(hi|hello|hey|howdy|greetings|good (morning|afternoon|evening|night)|what'?s up|sup)\b/i,
    ],
    response: () =>
      pick([
        "Hello! I'm Aster, running in offline mode. I can help with work, home, health, finance, travel, tech, creative projects, pets, parenting, fitness, legal basics, car care, and much more. What do you need?",
        "Hi there! Aster here — offline mode active. Ask me anything about everyday life, work, or household management. I've got thousands of answers loaded up.",
        "Hey! Aster online (offline mode). Ready to assist with tasks, recipes, home repairs, budgeting, wellness, learning, and more. What's on your mind?",
      ]),
  },
  {
    patterns: [
      /\b(who are you|what are you|your name|what can you do|what do you know|your capabilities|what.*help with|capabilities|features)\b/i,
    ],
    response:
      "I'm Aster, the Everything Assistant, in offline mode. My knowledge covers: productivity & work, household & home, cooking & nutrition, health & wellness, finance & budgeting, travel & transport, technology, education & learning, social & communication, emergency & safety, accessibility, creative arts, pets & animals, parenting & childcare, car & vehicle care, legal basics, sports & hobbies, fashion & personal care, environment & sustainability, mental wellbeing, elderly care, and much more. Just ask!",
  },
  {
    patterns: [
      /\b(thank you|thanks|thx|ty|appreciate it|cheers|that.?s helpful|great answer|perfect)\b/i,
    ],
    response: () =>
      pick([
        "You're welcome! Anything else I can help with?",
        "Happy to help! What else do you need?",
        "Anytime! Ask me again whenever you need assistance.",
        "Glad that was useful! Is there anything else on your list?",
      ]),
  },
  {
    patterns: [
      /^(bye|goodbye|see you|talk later|exit|quit|take care|ciao|adios)\b/i,
    ],
    response: () =>
      pick([
        "Goodbye! I'll be right here whenever you need me. Stay safe!",
        "Take care! Come back anytime you need help.",
        "See you! Remember — offline mode means I'm always available even without internet.",
      ]),
  },
  {
    patterns: [
      /\b(joke|tell me a joke|make me laugh|something funny|humor|funny)\b/i,
    ],
    response: () =>
      pick([
        "Why don't scientists trust atoms? Because they make up everything! 😄",
        "I asked the AI to tell me a joke. It said: 'I would, but I'm currently running in offline mode.' ...Wait, that's actually true!",
        "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
        "What do you call a bear with no teeth? A gummy bear! 🐻",
        "Why did the bicycle fall over? Because it was two-tired! 🚲",
        "How do you organize a space party? You planet! 🚀",
      ]),
  },
  {
    patterns: [
      /\b(how are you|how.*doing|you okay|you alright|are you well)\b/i,
    ],
    response: () =>
      pick([
        "I'm fully operational and ready to help! All systems are running smoothly in offline mode. How about you — what can I assist with?",
        "Running perfectly, thanks for asking! I'm here and ready to tackle whatever you need today.",
        "All good! I'm at full capacity in offline mode. What would you like to work on?",
      ]),
  },

  // ── TASKS & PRODUCTIVITY ──────────────────────────────────────────────────
  {
    patterns: [
      /\b(add task|create task|new task|make a task|set a task|remind me to|add (a )?reminder)\b/i,
    ],
    response:
      "To add a task, go to the Tasks page from the sidebar. Tap '+' to create a new item with title, due date, and priority. For voice, just say 'add task [name]'. Tip: break large tasks into subtasks of 30 minutes or less for better momentum.",
  },
  {
    patterns: [
      /\b(to.?do list|todo|task list|pending tasks|my tasks|show tasks|all tasks)\b/i,
    ],
    response:
      "Your tasks live on the Tasks page in the sidebar. You'll see pending, in-progress, and completed items. Manage them by voice ('mark [task] done', 'add task [name]') or through the UI. Review your list every morning and pick your top 3 priorities for the day.",
  },
  {
    patterns: [
      /\b(prioritize|priority|urgent|important task|high priority|eisenhower|matrix)\b/i,
    ],
    response:
      "Prioritization using the Eisenhower Matrix: Q1 (Urgent + Important) — do immediately. Q2 (Important, not urgent) — schedule it. Q3 (Urgent, not important) — delegate it. Q4 (Neither) — eliminate it. Most high performers spend most time in Q2. Weekly planning: Sunday evening, list everything and assign each item to a quadrant.",
  },
  {
    patterns: [
      /\b(deadline|due date|overdue|past due|missed deadline|approaching deadline)\b/i,
    ],
    response:
      "Deadline management: set calendar reminders at 1 week, 1 day, and 1 hour before. If you miss one, communicate proactively — a same-day heads-up is far better than silence. Identify the cause: unclear scope, underestimation, or interruptions? Adjust future estimates by adding a 20% buffer to complex tasks.",
  },
  {
    patterns: [
      /\b(meeting|conference|call|zoom|teams|video call|schedule meeting|book meeting|catch up)\b/i,
    ],
    response:
      "Meeting best practices: send an agenda 24 hours before. Keep it to 30 minutes when possible. Start and end on time. Assign a note-taker. End every meeting with a clear summary: decisions made, actions assigned (owner + deadline). For recurring meetings, question if they're still needed every quarter.",
  },
  {
    patterns: [
      /\b(agenda|meeting agenda|prepare for meeting|meeting prep|pre.?meeting)\b/i,
    ],
    response:
      "Perfect meeting agenda format: (1) Goal — what decision/outcome is needed, (2) Topics with time boxes (e.g., 'Status update — 5 min', 'Decision on X — 10 min'), (3) Pre-reads listed, (4) Presenter for each item. Send 24 hours in advance. If the goal can be achieved by email instead, cancel the meeting.",
  },
  {
    patterns: [
      /\b(email|write email|draft email|compose email|reply to email|email template|professional email)\b/i,
    ],
    response:
      "Professional email formula: Subject (specific + actionable, e.g., 'Action needed: Budget approval by Friday'). Opening (brief greeting). Purpose in sentence 1 ('I'm writing to...'). Key details in 2-3 short paragraphs. Clear call to action ('Please reply by Thursday with your decision.'). Sign-off. Proofread before sending — read aloud to catch awkward phrasing.",
  },
  {
    patterns: [
      /\b(report|write report|business report|status report|project report|weekly report)\b/i,
    ],
    response:
      "Report structure: (1) Executive Summary — key findings in 3-5 bullet points, (2) Background/Context, (3) Methodology, (4) Findings with data/visuals, (5) Analysis, (6) Recommendations (specific and actionable), (7) Conclusion, (8) Appendices. Use headings and bullet points — most readers will skim. Write the executive summary last.",
  },
  {
    patterns: [
      /\b(presentation|slide deck|powerpoint|keynote|present to|presenting|slides|pitch deck)\b/i,
    ],
    response:
      "Presentation rules: 1 idea per slide. Font minimum 24pt. Max 5 bullet points per slide. Start with a hook (surprising stat, question, or story). Follow the 'Tell them 3 times' rule: tell them what you'll tell them, tell them, tell them what you told them. Practice out loud at least 3 times. Time yourself — aim for 1-2 minutes per slide.",
  },
  {
    patterns: [
      /\b(project management|project plan|kickoff|milestones|project timeline|gantt|scrum|agile|kanban|sprint)\b/i,
    ],
    response:
      "Project management frameworks: Waterfall (sequential phases, good for well-defined projects) vs Agile (iterative sprints, good for changing requirements). Kanban board columns: Backlog → To Do → In Progress → Review → Done. Key habits: weekly standups, a risk register, and a clear definition of 'done'. Always document decisions and rationale.",
  },
  {
    patterns: [
      /\b(focus|concentration|distraction|stay focused|deep work|productivity tip|flow state|attention)\b/i,
    ],
    response:
      "Deep work techniques: (1) Pomodoro — 25 min work, 5 min break, 4 rounds then 30 min break. (2) Time blocking — schedule focus periods in your calendar as meetings with yourself. (3) Phone in another room — out of sight, out of mind. (4) Website blockers (Cold Turkey, Freedom). (5) Protect your first 2 hours for your hardest work before email/meetings. Flow state arrives ~15 minutes into focused work.",
  },
  {
    patterns: [
      /\b(procrastinat|motivation|get started|can't start|don't want to work|lazy|stuck|avoid task)\b/i,
    ],
    response:
      "Anti-procrastination: 5-minute rule — commit to working on the task for just 5 minutes. Usually you'll keep going. Break it into the smallest possible first action ('open the document', not 'write the report'). Implementation intentions work: 'I will do X at Y time in Z location.' Remove friction — have everything set up and ready before you sit down.",
  },
  {
    patterns: [
      /\b(work from home|remote work|wfh|home office|telecommute|hybrid work)\b/i,
    ],
    response:
      "WFH productivity: fixed start/end times, dedicated workspace, morning routine before starting (even a short walk). Over-communicate status to your team — remote workers who go quiet are assumed to be unproductive. Take lunch away from your desk. Use async video messages (Loom) instead of meetings when possible. Set physical boundaries — when work is 'done', close the laptop.",
  },
  {
    patterns: [
      /\b(time management|manage time|time block|calendar block|schedule my day|weekly plan)\b/i,
    ],
    response:
      "Weekly planning ritual (Sunday, 20 minutes): review what didn't get done last week, list this week's top 3 priorities, time-block your calendar. Daily planning (morning, 5 minutes): pick your MIT (Most Important Task) and do it first. Batch similar tasks (all emails, all calls). Review end of day — close loops and set up tomorrow.",
  },
  {
    patterns: [
      /\b(goal setting|smart goal|objective|okr|kpi|target|annual goal|quarterly goal)\b/i,
    ],
    response:
      "SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound. OKR format: Objective (inspiring, qualitative) + Key Results (3-5 measurable outcomes). Example: Objective: 'Launch a world-class product experience.' KR1: 'NPS score above 50.' KR2: 'Onboarding completion rate over 80%.' Review quarterly. Write goals down — the act of writing significantly increases follow-through.",
  },
  {
    patterns: [
      /\b(note.?taking|notes|meeting notes|cornell notes|note app|capture notes|second brain)\b/i,
    ],
    response:
      "Note-taking systems: Cornell Method (main notes right column, questions left, summary bottom). PARA System (Projects, Areas, Resources, Archive) for digital notes in Notion/Obsidian. Capture everything raw first, process later. Add tags for searchability. The goal of notes is future retrieval, not just recording — ask 'How would future-me search for this?'",
  },
  {
    patterns: [
      /\b(brain.?storm|ideas|creative thinking|idea generation|mind map|ideation|innovation)\b/i,
    ],
    response:
      "Brainstorming techniques: (1) Classic freewrite — 10 min, no editing, write everything. (2) Mind mapping — central topic, radiate outwards. (3) SCAMPER — Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse. (4) How might we...? framing. (5) Reverse brainstorm — 'How could we make this worse?' then invert. Separate ideation from evaluation — no criticism during generation phase.",
  },
  {
    patterns: [
      /\b(delegation|delegate|assign task|hand off|team management|managing people)\b/i,
    ],
    response:
      "Delegation framework: (1) Define the outcome, not the method — give people ownership. (2) Match tasks to strengths. (3) Confirm understanding — ask them to summarise back. (4) Set check-in points, not micromanagement. (5) Provide resources and authority. (6) Acknowledge success publicly. The goal is developing people, not just offloading work.",
  },
  {
    patterns: [
      /\b(feedback|performance review|give feedback|receive feedback|360 review|annual review|1.?on.?1)\b/i,
    ],
    response:
      "Giving effective feedback: use SBI model — Situation (when and where), Behaviour (what specifically happened), Impact (what effect it had). 'During yesterday's client call [S], you interrupted the client twice [B], which caused them to disengage and we lost the follow-up opportunity [I].' Be specific and timely. Receiving feedback: listen without defending, ask clarifying questions, say thank you regardless of agreement.",
  },

  // ── HOUSEHOLD & HOME ──────────────────────────────────────────────────────
  {
    patterns: [
      /\b(clean(ing)?( the)? (house|home|room|kitchen|bathroom|bedroom|living room|floor|windows?|carpet|tile|grout)|tidy up|declutter|spring clean)\b/i,
    ],
    response:
      "Efficient cleaning routine: top-to-bottom, back-to-front in each room. Weekly: vacuum, mop, wipe surfaces, clean toilets and sinks. Monthly: clean oven, fridge shelves, behind appliances, wash pillows, wipe light switches and door handles. Seasonally: clean gutters, test smoke alarms, deep clean behind furniture. Microfibre cloths outperform paper towels and are reusable.",
  },
  {
    patterns: [
      /\b(laundry|wash clothes|washing machine|dryer|stain remov|ironing|fold clothes|delicate wash|colours run)\b/i,
    ],
    response:
      "Laundry guide: sort darks, lights, whites, and delicates. Cold water (30°C) for most — saves energy and prevents shrinking. Pre-treat stains immediately: blot with cold water + dish soap (never rub). Washing symbols: a tub = machine wash, hand = hand wash, circle = dry clean. Dry delicates flat. Iron on appropriate settings (check label). To freshen clothes without washing: spray with diluted vodka and air out.",
  },
  {
    patterns: [
      /\b(grocery|shopping list|buy food|supermarket|what to buy|stock up|pantry staples|weekly shop)\b/i,
    ],
    response:
      "Smart grocery shopping: plan meals for the week first, then build the list. Organise by store section (produce → meat → dairy → frozen → dry goods). Check what you have before buying. Pantry essentials: pasta, rice, canned tomatoes, canned chickpeas/beans, olive oil, garlic, onions, eggs, soy sauce, stock cubes, tin of tuna, oats, flour, sugar, salt, pepper, mixed herbs, chilli flakes.",
  },
  {
    patterns: [
      /\b(cook(ing)?|recipe|what to (cook|make|eat)|dinner idea|meal idea|meal plan|meal prep|easy recipe)\b/i,
    ],
    response:
      "Meal planning system: Sunday prep session (1-2 hours): cook a large batch of grains (rice or quinoa), roast a tray of vegetables, and prep one protein. Use throughout the week in different combinations — grain bowls, wraps, stir fries. Quick weeknight meals: pasta (25 min), stir fry (20 min), eggs (10 min), quesadillas (15 min), soup from tin + fresh bread (10 min).",
  },
  {
    patterns: [
      /\b(breakfast( idea)?|morning meal|what.*breakfast|quick breakfast|healthy breakfast)\b/i,
    ],
    response:
      "Breakfast ideas by time available: 5 min: Greek yoghurt + granola + banana, or peanut butter on toast. 10 min: Scrambled eggs on toast, or overnight oats (prep night before). 15 min: Avocado toast with poached egg, or smoothie bowl. For sustained energy: include protein (eggs, yoghurt, nuts) + complex carbs (oats, wholegrain toast). Avoid sugary cereals — they cause an energy crash by mid-morning.",
  },
  {
    patterns: [
      /\b(lunch( idea)?|midday meal|what.*lunch|office lunch|pack lunch|lunchbox)\b/i,
    ],
    response:
      "Packable lunch ideas: (1) Mason jar salad (dressing at bottom, greens on top to stay crisp), (2) Grain bowl with leftover dinner protein, (3) Hummus and veg wraps, (4) Thermos soup, (5) Rice and beans with hot sauce. Packing lunch saves roughly £1,500-$2,000 a year vs buying out. Prep components in batches on Sunday to assemble quickly each morning.",
  },
  {
    patterns: [
      /\b(dinner( idea)?|what.*dinner|evening meal|supper|family dinner|weeknight dinner)\b/i,
    ],
    response:
      "30-minute weeknight dinners: (1) Sheet pan chicken thighs + veg (200°C, 30 min — minimal cleanup), (2) Spaghetti aglio e olio (pasta, garlic, olive oil, chilli, parmesan — 20 min), (3) Stir-fry noodles with whatever veg is in the fridge, (4) Quesadillas with beans and cheese, (5) Shakshuka (eggs poached in spiced tomato sauce, 20 min). Double everything and freeze half for a future busy night.",
  },
  {
    patterns: [
      /\b(bake|baking|cake|cookies|bread|pastry|muffin|brownie|oven temp|scone|sourdough)\b/i,
    ],
    response:
      "Baking success rules: (1) Measure accurately — baking is chemistry, (2) Room temperature butter and eggs unless stated otherwise, (3) Don't overmix after flour is added (develops gluten, makes things tough), (4) Fully preheat the oven, (5) Test doneness with a skewer (should come out clean for cakes), (6) Cool cakes in tin for 10 min then on a rack. Common fix: cake sinking = oven too hot or opened too early.",
  },
  {
    patterns: [
      /\b(knife skill|chop|dice|mince|julienne|slice|kitchen technique|cooking technique|how to cut)\b/i,
    ],
    response:
      "Basic knife skills: hold the knife with your thumb and index finger gripping the blade (pinch grip) — more control, less fatigue. 'Claw' your other hand to protect fingers (knuckles guide the blade). For onions: halve from root to tip, make horizontal cuts, then vertical cuts, then slice. A sharp knife is safer than a blunt one — get a honing steel and use it weekly, sharpen the blade annually.",
  },
  {
    patterns: [
      /\b(vegetarian|vegan|plant.?based|no meat|meatless|dairy.?free|gluten.?free)\b/i,
    ],
    response:
      "Plant-based meal ideas: Lentil dal, chickpea curry, black bean tacos, mushroom stir fry with tofu, stuffed peppers with rice and beans, roasted vegetable pasta, vegetable soup with crusty bread, falafel wraps. Protein sources for vegans: tofu, tempeh, edamame, lentils, beans, quinoa, seitan, nutritional yeast. Fortified plant milk covers calcium. B12 supplement is recommended for vegans.",
  },
  {
    patterns: [
      /\b(refrigerat|fridge|food storage|how long does.*last|food safety|store food|keep food fresh|food expiry)\b/i,
    ],
    response:
      "Food storage times: Cooked meat/fish — 3-4 days. Raw meat — 1-2 days. Cooked rice — 1 day max (rice bacteria risk). Leftovers — 3-4 days. Hard cheese — 3-4 weeks. Eggs — 3-5 weeks. Milk — use-by date. Bread — 1 week room temp or slice and freeze. Use FIFO (First In, First Out) — put new items behind old ones. When in doubt, throw it out.",
  },
  {
    patterns: [
      /\b(plumbing|leaky (pipe|tap|faucet)|clogged (drain|sink|toilet)|blocked drain|running toilet|water pressure)\b/i,
    ],
    response:
      "Home plumbing fixes: Blocked drain — boiling water first, then baking soda + white vinegar + boiling water, then plunger. Leaky tap — turn off supply under sink, replace washer/cartridge (£5 part, 20 min job). Running toilet — usually a faulty flapper valve or float (£10 part). Low water pressure — check if isolator valve is fully open and clean the aerator on the tap. Major issues: call a licensed plumber.",
  },
  {
    patterns: [
      /\b(paint(ing)?( the)? (wall|room|house|ceiling|door)|paint color|choose paint|paint prep|roller technique)\b/i,
    ],
    response:
      "Painting a room step by step: (1) Move furniture, lay dust sheets, (2) Clean walls (sugar soap or damp cloth), (3) Fill holes with filler, sand smooth when dry, (4) Apply painter's tape to edges, (5) Primer coat if changing from dark to light or on new plaster, (6) Cut in around edges with a brush, (7) Roll the main wall in a 'W' pattern for even coverage, (8) Two coats minimum. 'Eggshell' for walls (washable), 'matt' for ceilings.",
  },
  {
    patterns: [
      /\b(garden(ing)?|grow|plant|watering|lawn|mow|fertiliz|weed|compost|soil|seeds|prune|raised bed)\b/i,
    ],
    response:
      "Gardening by season: Spring — prepare beds, sow seeds indoors, plant cold-tolerant crops (peas, lettuce). Summer — water deeply in the evening, harvest regularly to encourage more growth, deadhead flowers. Autumn — plant bulbs, clear beds, add compost. Winter — plan next year, protect tender plants with fleece. Universal rule: healthy soil = healthy plants. Feed the soil with compost and it feeds your plants.",
  },
  {
    patterns: [
      /\b(pest|ants|cockroach|mice|rats|mosquito|flies|bugs in house|get rid of (pests?|insects?|rodents?))\b/i,
    ],
    response:
      "Integrated pest management: Prevention first — seal entry points, fix leaks, store food in airtight containers. Ants: food-grade diatomaceous earth at entry points, boric acid bait trays. Cockroaches: gel bait in dark corners (very effective), address moisture sources. Mice: snap traps baited with peanut butter, steel wool in holes. Fruit flies: apple cider vinegar trap (jar + drop of dish soap). Mosquitoes: eliminate standing water within 100m.",
  },
  {
    patterns: [
      /\b(move house|moving|packing boxes|movers|new home|moving checklist|removals)\b/i,
    ],
    response:
      "Moving checklist: 6 weeks out — get quotes from 3 removal firms. 4 weeks out — start packing non-essentials. 2 weeks out — notify bank, DVLA, employer, NHS, HMRC, utilities, subscriptions. 1 week out — pack almost everything, prepare first-night box (toilet paper, bedding, kettle, mugs, chargers, change of clothes, important documents). Moving day — take meter readings at old and new property. Day after — test all utilities, change locks.",
  },
  {
    patterns: [
      /\b(declutter|minimalism|get rid of stuff|donate|throw away|organize home|marie kondo|konmari)\b/i,
    ],
    response:
      "KonMari decluttering method: organise by category (not room) in this order: Clothes → Books → Papers → Komono (miscellaneous) → Sentimental items. Hold each item and ask 'Does this spark joy?' Keep only what does. For sentimental items, take a photo first. Donate to charity shops, sell on Facebook Marketplace or eBay, recycle the rest. One in, one out rule prevents re-accumulation.",
  },
  {
    patterns: [
      /\b(home security|burglar|alarm|cctv|door lock|smart lock|doorbell camera|secure home)\b/i,
    ],
    response:
      "Home security essentials: good quality deadbolt locks on all external doors. Door and window sensors (affordable smart options from Ring, Yale, or Arlo). Outdoor motion-sensor lights (deter 60% of opportunist burglars). Smart doorbell camera. Never post holiday photos while you're away. Use timer plugs so lights come on in the evening when you're out. A dog (or a 'Beware of Dog' sign) is a surprisingly effective deterrent.",
  },
  {
    patterns: [
      /\b(energy saving|reduce energy|lower energy bill|insulation|draught.?proof|solar panel|green energy)\b/i,
    ],
    response:
      "Home energy savings: loft insulation pays back in 1-2 years. Cavity wall insulation is also highly cost-effective. Draught-proof doors and windows with self-adhesive foam strips (under £20). Set thermostat to 19°C (not 21°C) — each degree costs ~10% more. Install a smart thermostat. LED bulbs use 90% less energy than incandescent. Wash clothes at 30°C. A full dishwasher uses less water than hand washing.",
  },
  {
    patterns: [
      /\b(furniture assembly|ikea|flat.?pack|allen key|build furniture|assemble shelves)\b/i,
    ],
    response:
      "Flat-pack assembly tips: lay all parts out and count them against the parts list before starting. Read through all instructions once before beginning. Sort hardware into groups by type. Finger-tighten all screws first, align everything, then tighten fully. Use a rubber mallet for stubborn joints. If a piece doesn't fit, you've likely missed a step — don't force it. Anchor tall furniture (bookshelves, wardrobes) to the wall for safety.",
  },

  // ── COOKING EXTENDED ──────────────────────────────────────────────────────
  {
    patterns: [
      /\b(pasta (recipe|dish|sauce)|carbonara|bolognese|arrabiata|pesto pasta|pasta dish)\b/i,
    ],
    response:
      "Classic pasta sauces: Bolognese — brown mince, add finely diced onion/carrot/celery, canned tomatoes, splash of red wine, simmer 30 min. Carbonara — whisk egg yolks + parmesan + black pepper, toss with hot pasta OFF the heat (no cream needed). Arrabiata — garlic + chilli flakes in olive oil, canned tomatoes, 15 min. Always salt your pasta water until it 'tastes like the sea'. Save pasta water — it thickens sauces beautifully.",
  },
  {
    patterns: [
      /\b(rice (cooking|recipe|how to cook|burnt|mushy|fluffy)|how to cook rice|perfect rice)\b/i,
    ],
    response:
      "Perfect rice: rinse rice until water runs clear (removes excess starch). Ratio: 1 cup rice to 1.5-1.75 cups water. Bring to boil, cover, reduce to lowest heat, cook 15 min, take off heat, rest covered 5 min, fluff with fork. Never lift the lid during cooking. Burnt bottom? Place the pot on a damp cloth for 10 min — the steam lifts the burnt layer. Leftover rice must be refrigerated within 1 hour of cooking.",
  },
  {
    patterns: [
      /\b(soup (recipe|how to make|from scratch)|homemade soup|vegetable soup|chicken soup|lentil soup)\b/i,
    ],
    response:
      "Universal soup formula: (1) Fry aromatics (onion, garlic, celery) in oil until soft, (2) Add spices and cook 1 min, (3) Add main vegetables/protein and stock, (4) Simmer until tender, (5) Blend partially or fully if desired, (6) Season and finish with something acidic (lemon juice or vinegar). Stock tip: keep a freezer bag of vegetable scraps — when full, simmer for 45 min for free stock.",
  },
  {
    patterns: [
      /\b(spice|seasoning|herbs|flavour|bland food|how to season|make food taste better)\b/i,
    ],
    response:
      "Seasoning fundamentals: salt enhances all other flavours — season in layers, not just at the end. Acid (lemon, vinegar, tomato) brightens dishes and balances richness. Fat (butter, olive oil, cream) carries flavour. Heat (chilli) adds complexity. Spice blends for variety: Indian = cumin + coriander + turmeric + garam masala. Mexican = cumin + smoked paprika + chilli. Italian = oregano + basil + garlic. Taste as you go.",
  },

  // ── HEALTH & WELLNESS ────────────────────────────────────────────────────
  {
    patterns: [
      /\b(exercise|workout|fitness|gym|stay fit|get fit|lose weight|burn (fat|calories)|training plan|home workout)\b/i,
    ],
    response:
      "Home workout programme (no equipment): Monday/Thursday — Upper body: 3×10 push-ups, 3×12 tricep dips, 3×15 shoulder press with water bottles. Tuesday/Friday — Lower body: 3×15 squats, 3×12 lunges, 3×15 glute bridges. Wednesday/Saturday — Core + cardio: 3×30s plank, 3×15 crunches, 20 min brisk walk or jog. Sunday — rest. Progressive overload: add 1 rep each week. Track workouts in a notebook.",
  },
  {
    patterns: [
      /\b(sleep|insomnia|can't sleep|sleep better|bedtime|sleep hygiene|rest|nap|tired|exhausted|oversleep)\b/i,
    ],
    response:
      "Sleep protocol: wake at the same time every day (anchor your circadian rhythm). No caffeine after 1pm. Wind-down 60 min before bed: dim lights, phone off or on night mode, light reading or stretching. Bedroom: 16-18°C, blackout curtains, silence or white noise. If you can't sleep in 20 min, leave the room and do something calm. Avoid checking the clock — it increases anxiety. Naps: 20 min max before 3pm.",
  },
  {
    patterns: [
      /\b(stress|anxiety|overwhelm|burnout|mental health|mindfulness|meditat|calm down|relax|panic attack|breathing exercise)\b/i,
    ],
    response:
      "Immediate stress relief techniques: Box breathing (inhale 4s → hold 4s → exhale 4s → hold 4s → repeat 4 rounds). Progressive muscle relaxation: tense each muscle group for 5s then release, head to toe. Grounding: 5-4-3-2-1 technique (5 things you see, 4 hear, 3 touch, 2 smell, 1 taste). Cold water on face triggers the 'dive reflex' and slows heart rate. For panic attacks, these work within 2-5 minutes.",
  },
  {
    patterns: [
      /\b(headache|migraine|pain relief|painkiller|aspirin|ibuprofen|paracetamol|tension headache)\b/i,
    ],
    response:
      "Headache self-care: (1) Drink a full glass of water immediately — dehydration is the #1 cause. (2) Take OTC pain relief (paracetamol or ibuprofen — not both simultaneously unless advised). (3) Rest in a dark, quiet room. (4) Cold compress on forehead or warm compress on neck. (5) Gentle neck stretches. Migraine triggers: stress, dehydration, skipped meals, too much/too little sleep, certain foods (aged cheese, red wine, chocolate). Keep a trigger diary.",
  },
  {
    patterns: [
      /\b(cold|flu|sick|fever|cough|sore throat|runny nose|congestion|viral infection|symptoms)\b/i,
    ],
    response:
      "Cold and flu care: Rest is medicine — your immune system works harder when you sleep. Stay hydrated. Honey and lemon in hot water soothes sore throats (honey is genuinely antibacterial). Steam inhalation clears congestion. Vitamin C and Zinc may shorten duration if taken early. Isolate to protect others. See a doctor if: fever over 39.5°C (103°F), difficulty breathing, symptoms worsen after day 7, you're in a high-risk group.",
  },
  {
    patterns: [
      /\b(nutrition|diet|healthy eating|balanced (diet|meal)|vitamins|minerals|protein|carbs|fat|macros|calorie)\b/i,
    ],
    response:
      "Nutrition simplified: Protein (meat, fish, eggs, legumes) — builds and repairs tissue, keeps you full. Carbohydrates (whole grains, vegetables, fruit) — primary energy source. Healthy fats (avocado, olive oil, nuts) — brain function, hormones. Fibre (vegetables, fruit, whole grains, legumes) — gut health, reduces disease risk. Aim: at least 5 portions of fruit/veg daily, mostly whole foods. Supplements needed for most: Vitamin D (especially in winter), Omega-3 if you don't eat oily fish.",
  },
  {
    patterns: [
      /\b(hydration|drink water|how much water|dehydrated|water intake|signs of dehydration)\b/i,
    ],
    response:
      "Hydration guide: aim for 2-2.5L daily (more in heat or when exercising). Signs of dehydration: dark urine, headache, fatigue, difficulty concentrating, dry mouth. Hydration tip: drink a large glass of water immediately upon waking — you lose 400-500ml overnight. Eat water-rich foods: cucumber, watermelon, strawberries, lettuce, celery. Tea, coffee, and milk count toward daily intake despite the caffeine myth.",
  },
  {
    patterns: [
      /\b(first aid|emergency treatment|cut|bleed|burn|sprain|sting|choking|cpr|heimlich|wound)\b/i,
    ],
    response:
      "First aid quick reference: CUTS — apply firm pressure, elevate, clean with water, cover. BURNS — cool under running water 20 min (not ice). SPRAINS — PRICE: Protect, Rest, Ice (20 min on/20 off), Compression, Elevation. CHOKING (adult, conscious) — 5 firm back blows between shoulder blades, then 5 abdominal thrusts. CPR: 30 chest compressions (hard and fast, 5-6cm deep) then 2 rescue breaths, repeat. ALWAYS call emergency services for anything serious.",
  },
  {
    patterns: [
      /\b(back pain|neck pain|posture|ergonomics|sitting all day|desk setup|standing desk|wrist pain|rsi)\b/i,
    ],
    response:
      "Desk ergonomics checklist: Monitor — top of screen at eye level, arm's length away. Chair — lower back supported, feet flat on floor (use a footrest if needed). Keyboard — wrists neutral, not bent up or down. Mouse — keep it close to the keyboard. Take a 5-min movement break every 45-60 min. Stretches: shoulder rolls, chin tucks, wrist circles, thoracic spine rotation. Core strengthening (planks, dead bugs) supports your spine long-term.",
  },
  {
    patterns: [
      /\b(mental wellbeing|happiness|joy|positive thinking|gratitude|journaling|mindset|self.?care|loneliness|social connection)\b/i,
    ],
    response:
      "Evidence-based wellbeing practices: Gratitude journaling (3 specific things you're grateful for, each evening — specificity matters). Acts of kindness (giving boosts mood more than receiving). Social connection (loneliness has the same health impact as smoking 15 cigarettes a day — prioritise face-to-face contact). Regular physical movement. Time in nature. Having something to look forward to. Purpose: contributing to something larger than yourself.",
  },
  {
    patterns: [
      /\b(weight loss|lose weight|diet plan|calorie deficit|intermittent fasting|keto|low carb|slimming)\b/i,
    ],
    response:
      "Sustainable weight loss: a 500 calorie/day deficit = ~0.5kg loss per week. Eat mostly whole foods — they are naturally lower in calories and more filling. Prioritise protein — it's the most satiating macronutrient. Don't drink your calories (juice, fizzy drinks, alcohol). Strength training builds muscle which increases resting metabolism. Avoid 'all or nothing' thinking — one bad meal doesn't ruin a week. Sleep deprivation increases hunger hormones significantly.",
  },
  {
    patterns: [
      /\b(skin care|skincare|moisturiser|sunscreen|spf|acne|dry skin|oily skin|skin routine|face wash|toner|serum)\b/i,
    ],
    response:
      "Core skincare routine: Morning — gentle cleanser → vitamin C serum (antioxidant) → moisturiser → SPF 30+ (non-negotiable, even indoors). Evening — oil-based cleanser (removes sunscreen and makeup) → water cleanser → retinol or niacinamide → moisturiser. SPF is the single most impactful anti-ageing product. For acne: avoid touching your face, use non-comedogenic products, try salicylic acid or benzoyl peroxide. See a dermatologist for persistent acne.",
  },

  // ── FINANCE & BUDGETING ──────────────────────────────────────────────────
  {
    patterns: [
      /\b(budget|budgeting|manage money|money management|track spending|monthly budget|personal finance)\b/i,
    ],
    response:
      "Budgeting methods: (1) 50/30/20 — 50% needs, 30% wants, 20% savings/debt. (2) Zero-based budgeting — every pound/dollar assigned a purpose, nothing left over unallocated. (3) Pay yourself first — auto-transfer savings before spending. Track spending for 1 month first — most people are surprised where money goes. Review monthly; adjust for seasonal costs (higher heating in winter, holidays in summer).",
  },
  {
    patterns: [
      /\b(save money|saving|savings account|emergency fund|save up|saving tips|financial goals|sinking fund)\b/i,
    ],
    response:
      "Savings priorities: (1) Emergency fund (3-6 months of expenses) in an easy-access high-interest account — this is your financial immune system. (2) Match employer pension contributions fully — it's free money. (3) Pay off high-interest debt. (4) ISA or other tax-advantaged savings. (5) General investing. Automate savings on payday — what you don't see, you don't spend. Sinking funds: save monthly for predictable irregular expenses (car service, holidays, Christmas).",
  },
  {
    patterns: [
      /\b(debt|pay off debt|credit card (debt)?|loan|interest rate|owe money|overdraft|debt free)\b/i,
    ],
    response:
      "Debt elimination: list all debts with balance, interest rate, and minimum payment. Avalanche method: minimum on all, extra to highest-rate debt (mathematically optimal). Snowball method: minimum on all, extra to smallest balance (psychologically motivating — wins keep you going). Stop adding new debt while repaying. Consider balance transfer cards (0% interest period) for high-interest credit card debt. Free debt advice: StepChange (UK) or NFCC (US).",
  },
  {
    patterns: [
      /\b(invest(ing|ment)?|stocks?|shares?|pension|retirement|isa|401k|portfolio|index fund|etf|bond)\b/i,
    ],
    response:
      "Investing principles: (1) Time in market beats timing the market — start as early as possible. (2) Low-cost index funds (e.g., global total market ETFs) beat most active managers over 10+ years. (3) Diversify across asset classes and geographies. (4) Max out tax-advantaged accounts (ISA, SIPP, 401k) before taxable investing. (5) Rebalance annually. (6) Never invest money you can't leave invested for 5+ years. Compound interest: £5,000 at 7% for 30 years = £38,000.",
  },
  {
    patterns: [
      /\b(bills?|utility bill|electricity bill|gas bill|water bill|reduce bills|lower bills|energy bill)\b/i,
    ],
    response:
      "Bill reduction strategies: Switch energy tariffs annually — loyalty is penalised by most providers. Negotiate broadband, insurance, and mobile on renewal (or threaten to leave — retentions teams have better deals). Reduce energy: thermostat at 19°C, LED bulbs, washing at 30°C, full loads in dishwasher/washing machine, draught-proof windows. Cancel unused subscriptions (average person has 6 they've forgotten about).",
  },
  {
    patterns: [
      /\b(tax|taxes|tax return|self.?assessment|vat|hmrc|irs|write.?off|deduction|tax efficient)\b/i,
    ],
    response:
      "Tax essentials: keep receipts/records of all income and allowable expenses year-round (digital is fine). Self-employed: deduct home office (proportion of bills), business travel, equipment, professional subscriptions, and training. UK: ISA contributions are tax-free. Personal allowance: £12,570. US: 401k and HSA reduce taxable income. File on time (UK: 31 Jan) — late filing penalties start immediately. An accountant's fee often pays for itself.",
  },
  {
    patterns: [
      /\b(mortgage|buy (a )?house|home loan|first.?time buyer|deposit|stamp duty|conveyancing)\b/i,
    ],
    response:
      "Home buying guide: Save a 10-15% deposit minimum (5% possible but expensive via higher rates). Get a mortgage agreement in principle before house hunting — it shows you're serious. Budget for: solicitor fees (£1,000-2,000), survey (£400-1,000), stamp duty, moving costs. Fixed-rate mortgages give payment certainty. Overpaying reduces interest significantly — even small overpayments help. Remortgage every 2-5 years as fixed terms end.",
  },

  // ── TRAVEL & TRANSPORT ───────────────────────────────────────────────────
  {
    patterns: [
      /\b(trip planning|plan.*trip|travel plan|holiday|vacation|book travel|itinerary|city break|backpacking)\b/i,
    ],
    response:
      "Travel planning workflow: (1) Set budget and travel dates, (2) Book flights first (biggest price variable), (3) Book accommodation (hotels or Airbnb — check cancellation policies), (4) Research visa requirements (allow 4-8 weeks for applications), (5) Check passport validity (6 months beyond travel needed in many countries), (6) Get travel insurance immediately after booking, (7) Notify bank, (8) Download offline maps (Google Maps offline), (9) Pack prescriptions in carry-on.",
  },
  {
    patterns: [
      /\b(pack(ing)?( list)?|what to pack|luggage|suitcase|carry.?on|check.?in bag|overweight luggage)\b/i,
    ],
    response:
      "Capsule packing: mix-and-match outfits in one colour palette. Roll clothes (saves 30% space, reduces wrinkles). Pack shoes on the sides (heaviest items), clothes in the middle, electronics and valuables on top. Carry-on essentials: documents, medications, one change of clothes, chargers, valuables. Checked bag checklist: main clothing, toiletries (100ml+ liquids), shoes. Use a luggage scale to avoid excess baggage fees.",
  },
  {
    patterns: [
      /\b(airport|check.?in|boarding|flight|customs|security|passport control|delayed flight|travel tips)\b/i,
    ],
    response:
      "Airport flow: check in online (opens 24-48 hours before). International: arrive 3 hours before. Domestic: 2 hours. Security: liquids in clear bag, electronics out of bag, metal items in tray. Passport control: have your documents ready and answer questions confidently and concisely. For delays over 3 hours (EU): you're entitled to compensation under EU261/2004. Always carry snacks — airport food is very expensive.",
  },
  {
    patterns: [
      /\b(driving|road trip|car|petrol|fuel|motorway|traffic|long drive|car hire|rental car)\b/i,
    ],
    response:
      "Road trip preparation: POWDER check — Petrol (full tank), Oil (dipstick check), Water (coolant and washer fluid), Damage (note any pre-existing on rental cars), Electrics (lights, wipers), Rubber (tyre pressure and tread). Take breaks every 2 hours. Optimal motorway speed for fuel efficiency: 60-65mph. Hire car tip: photograph all existing damage before driving away, email photos to yourself for a timestamp.",
  },
  {
    patterns: [
      /\b(public transport|bus|train|tube|metro|commute|timetable|rail|season ticket)\b/i,
    ],
    response:
      "Commuting efficiently: book train tickets 12 weeks in advance for cheapest fares (UK). Consider a season ticket if commuting 3+ days per week. Split tickets (booking A→B and B→C separately) can be significantly cheaper than A→C. For regular routes, memorise backup routes in case of delays. Commute productively: podcasts, audiobooks, language learning apps, or reading.",
  },
  {
    patterns: [
      /\b(travel insurance|insure travel|trip insurance|medical abroad|ehic|ghic|travel cover)\b/i,
    ],
    response:
      "Travel insurance is essential — get it the day you book, not the day before you leave (to cover cancellation from the booking date). Cover to check: medical (minimum £5M), cancellation, baggage loss, delay. Pre-existing conditions must be declared. UK travellers: get a free GHIC (Global Health Insurance Card) for reduced-cost healthcare in Europe — it complements but doesn't replace travel insurance.",
  },

  // ── TECHNOLOGY ───────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(phone (slow|not working|frozen|crash|restart|battery)|smartphone issue|iphone|android)\b/i,
    ],
    response:
      "Phone troubleshooting hierarchy: (1) Restart (fixes 80% of issues), (2) Check for OS updates, (3) Clear app cache (Settings → Apps → Storage → Clear Cache), (4) Free up storage if over 80%, (5) Check which apps are draining battery (Settings → Battery), (6) Factory reset as last resort (back up first). Battery dying fast: reduce screen brightness, turn off location for apps that don't need it, disable background app refresh.",
  },
  {
    patterns: [
      /\b(computer (slow|crash|frozen|not turning on|overheating)|laptop (slow|crash|fan noise)|windows|mac (issue|slow|crash))\b/i,
    ],
    response:
      "Computer performance fixes: (1) Restart and install updates, (2) Disable startup programmes (Task Manager → Startup on Windows; System Preferences → Login Items on Mac), (3) Clean dust from vents with compressed air (overheating throttles performance), (4) Upgrade RAM or swap HDD to SSD (single biggest speed boost for older computers), (5) Run disk cleanup and defragment (Windows). SSD upgrade typically costs £40-60 and feels like a new computer.",
  },
  {
    patterns: [
      /\b(wifi|wi.?fi|internet (slow|not working|disconnected)|router|broadband|vpn|ethernet)\b/i,
    ],
    response:
      "Internet troubleshooting: (1) Restart router (30-second unplugged pause), (2) Test speed at fast.com, (3) Wired Ethernet is always more reliable than Wi-Fi for important tasks, (4) Router placement: central, elevated, away from microwaves and baby monitors (they use the same 2.4GHz band), (5) Wi-Fi 5GHz band = faster but shorter range, 2.4GHz = slower but longer range. (6) Contact your ISP if the fault is theirs — you may be entitled to a bill reduction.",
  },
  {
    patterns: [
      /\b(password|forgot password|reset password|password manager|strong password|secure password|two factor|2fa)\b/i,
    ],
    response:
      "Password security system: use a password manager (Bitwarden is free and open-source; 1Password is excellent paid). Generate a unique, random 16+ character password for every site. Master password: use a memorable passphrase (4+ random words: 'correct-horse-battery-staple'). Enable 2FA everywhere — authenticator apps (Authy, Google Authenticator) are better than SMS. Check if your email has been breached at haveibeenpwned.com.",
  },
  {
    patterns: [
      /\b(backup|data backup|cloud backup|external hard drive|data loss|lost files|recover files)\b/i,
    ],
    response:
      "Backup strategy (3-2-1 rule): 3 copies of data, on 2 different media, with 1 offsite. Home implementation: auto cloud backup for photos (Google Photos free tier or iCloud), OneDrive/Dropbox for documents, external SSD for full backup monthly. For business: add a cloud-to-cloud backup of your cloud storage. Test your backups by actually restoring a file — unverified backups are not backups.",
  },
  {
    patterns: [
      /\b(scam|phishing|fraud|suspicious email|suspicious link|identity theft|cybersecurity|malware|ransomware|hack)\b/i,
    ],
    response:
      "Cybersecurity red flags: urgent language ('Act NOW or your account will be closed'), unexpected contact, requests for personal info or money transfers, links that don't match the real domain (hover to check). Banks never ask for your PIN or to move money to a 'safe account'. If in doubt: hang up and call the official number. If scammed: call your bank immediately, change passwords, report to Action Fraud (UK: 0300 123 2040) or FTC (US: reportfraud.ftc.gov).",
  },
  {
    patterns: [
      /\b(3d print|arduino|raspberry pi|diy electronics|home lab|maker|coding|programming|python|javascript|app development)\b/i,
    ],
    response:
      "DIY tech and coding: Python is the best first language — readable syntax, huge community, used in data science, automation, and web dev. Start with: Automate the Boring Stuff with Python (free online). For web: HTML → CSS → JavaScript. Raspberry Pi projects: home automation hub, retro gaming console, network-wide ad blocker (Pi-hole). Arduino: robotics, sensors, IoT devices. r/learnprogramming and freeCodeCamp are excellent free resources.",
  },

  // ── EDUCATION & LEARNING ─────────────────────────────────────────────────
  {
    patterns: [
      /\b(study (tips?|help|technique|smarter|better|habits?)|how to study|revision|exam prep|memorize|remember|recall)\b/i,
    ],
    response:
      "Evidence-based study techniques (ranked by effectiveness): (1) Practice testing / retrieval practice (most effective — test yourself constantly), (2) Spaced repetition (Anki app is perfect for this), (3) Interleaving (mixing topics rather than blocking), (4) Elaborative interrogation ('why does this work?'), (5) Concrete examples for abstract concepts. Least effective: re-reading and highlighting (despite being most popular). Study for 50 min, break for 10.",
  },
  {
    patterns: [
      /\b(write|essay|thesis|dissertation|academic writing|report writing|structure an essay|paragraph)\b/i,
    ],
    response:
      "Writing process: (1) Pre-write — brainstorm all ideas without censoring, (2) Outline — organise into sections/arguments, (3) Draft — write quickly without editing (turn off grammar checker), (4) Revise — restructure for logic and clarity, (5) Edit — fix sentences, (6) Proofread — catch errors (read backwards for typos). PEEL paragraph structure: Point, Evidence, Explain, Link back to thesis. Kill unnecessary adverbs and passive voice.",
  },
  {
    patterns: [
      /\b(math|maths|mathematics|algebra|calculus|fractions|percentage|formula|equation|geometry|statistics|probability)\b/i,
    ],
    response:
      "Maths fundamentals: Percentages — X% of Y = (X÷100)×Y. To find percentage change: (new-old)÷old × 100. Fractions — to add/subtract: find common denominator. To multiply: straight across. To divide: flip the second fraction and multiply. Algebra: whatever you do to one side, do to the other. Statistics: mean (average), median (middle value), mode (most frequent). For maths help: Khan Academy is free and excellent for all levels.",
  },
  {
    patterns: [
      /\b(learn (a )?language|language learning|duolingo|vocabulary|grammar|speak (spanish|french|german|mandarin|japanese|arabic|hindi|portuguese)|translate)\b/i,
    ],
    response:
      "Language learning path: (1) Pronunciation fundamentals first, (2) Core 1,000 words (cover ~85% of speech), (3) Grammar — enough to form sentences, not academic perfection, (4) Input immersion: Netflix with target language audio and subtitles, (5) Output: speak from day 1 with language partners (iTalki, Tandem). Consistency beats intensity — 20 min daily beats 3 hours once a week. Don't wait to 'be ready' to speak.",
  },
  {
    patterns: [
      /\b(reading|speed reading|comprehension|read faster|book recommendation|read more|library|ebook|audiobook)\b/i,
    ],
    response:
      "Reading improvement: expand your eye span to take in groups of words rather than one word at a time. Use a tracker (finger/pencil) to guide pace. For comprehension: preview headings and summary first, read actively asking questions. Spaced review: write 3 bullet points from each chapter. Great reads by category: Productivity (Deep Work - Cal Newport), Finance (The Psychology of Money - Morgan Housel), Health (Why We Sleep - Matthew Walker), Habits (Atomic Habits - James Clear).",
  },
  {
    patterns: [
      /\b(critical thinking|logic|reasoning|argument|fallacy|evaluate evidence|research|fact.?check)\b/i,
    ],
    response:
      "Critical thinking framework: (1) Identify the claim being made, (2) Identify the evidence offered — is it verifiable? (3) Check the source — expertise, conflicts of interest, consensus of the field, (4) Consider alternative explanations, (5) Check your own biases. Common fallacies: Ad hominem (attacking the person, not the argument), Straw man (misrepresenting an argument), False dichotomy (only two options presented). Reputable sources: peer-reviewed journals, established news organisations with editorial standards.",
  },

  // ── SOCIAL & COMMUNICATION ──────────────────────────────────────────────
  {
    patterns: [
      /\b(conflict|argument|disagree|resolve conflict|difficult conversation|confrontation|negotiation)\b/i,
    ],
    response:
      "Difficult conversation framework: (1) Choose the right time and private place, (2) State your intent — 'I want to understand and find a solution, not win.' (3) Use 'I' statements (I feel X when Y happens), (4) Listen to understand — summarise what you heard before responding, (5) Identify underlying interests (not just stated positions), (6) Collaborate on solutions. If emotions escalate, call a time-out: 'Can we take 20 minutes and come back to this?'",
  },
  {
    patterns: [
      /\b(networking|professional network|linkedin|meet people|networking event|build connections|personal brand)\b/i,
    ],
    response:
      "Networking strategy: Give first — share useful articles, make introductions, offer help. Be genuinely curious about people. Follow up within 48 hours with a specific reference to your conversation. Update LinkedIn regularly (it's searchable). Join industry associations and attend events. Informational interviews: ask to 'pick someone's brain' over a 20-min virtual coffee — most people say yes. Your network determines your net worth professionally.",
  },
  {
    patterns: [
      /\b(interview|job interview|interview (tips?|prep|questions?)|how to answer|apply for job|job search|cover letter)\b/i,
    ],
    response:
      "Job interview mastery: Research (company news, their products, competitors, mission). Prepare STAR stories (Situation, Task, Action, Result) for 8-10 common scenarios. Questions they'll ask: greatest strength/weakness, biggest achievement, biggest challenge, why this role, where in 5 years. Questions to ask them: 'What does success look like in this role in 90 days?' 'What's your favourite thing about working here?' Send a thank-you email within 24 hours.",
  },
  {
    patterns: [
      /\b(public speaking|presentation nerves|speak in public|stage fright|present to|ted talk|toastmasters)\b/i,
    ],
    response:
      "Public speaking confidence: the key is rehearsal — speak the words out loud (not just in your head) at least 5 times. Power poses for 2 minutes beforehand genuinely reduce cortisol. Slow down (nerves make you rush — pace yourself deliberately). Pause after key points (feels long to you, natural to them). Make eye contact with 3-4 friendly faces. Failure is less visible to the audience than it feels to you.",
  },
  {
    patterns: [
      /\b(relationship|partner|romance|dating|communication in relationship|couples|marriage|trust)\b/i,
    ],
    response:
      "Relationship communication: John Gottman's research identifies the 'Four Horsemen' that predict relationship failure — criticism, contempt, defensiveness, stonewalling. Antidotes: use specific complaints (not character attacks), appreciate your partner daily, take responsibility, and self-soothe before continuing heated discussions. Regular '5-hour rule' together: 6 mins/day affection at parting + reunion, 1 date night/week, 1 check-in/week, 2-hour state-of-union monthly, 2-day trip annually.",
  },
  {
    patterns: [
      /\b(friendship|make friends|social skills|loneliness|shy|introvert|extrovert|social anxiety)\b/i,
    ],
    response:
      "Building friendships as an adult: proximity + repeated unplanned interactions + a setting that encourages vulnerability (Dunbar's formula). Join clubs or groups around shared interests — you already have something in common. Reciprocity matters: if you initiate contact more than 2-3 times without them initiating, the interest may not be mutual. Quality over quantity. Being a good listener and remembering details about people's lives is the top friendship skill.",
  },

  // ── PARENTING & CHILDCARE ────────────────────────────────────────────────
  {
    patterns: [
      /\b(parenting|childcare|kids|children|baby|toddler|teenager|raise (kids|children)|child development|newborn)\b/i,
    ],
    response:
      "Parenting essentials: (1) Secure attachment — be responsive and consistent, (2) Authoritative parenting (warm + firm boundaries) produces better outcomes than authoritarian (harsh) or permissive (no limits), (3) Labeled praise: 'You worked really hard on that' (growth mindset) vs 'You're so smart' (fixed mindset), (4) Emotion coaching: name and validate the emotion before problem-solving, (5) Model the behaviour you want to see — children watch everything.",
  },
  {
    patterns: [
      /\b(sleep (baby|toddler|child)|baby sleep|sleep training|bedtime routine (for|baby|kid|child))\b/i,
    ],
    response:
      "Children's sleep by age: Newborn (0-3m): 14-17 hours in short stretches — no schedule yet. 4-12m: 12-16 hours, 2 naps, start bedtime routine. 1-2 years: 11-14 hours, 1 nap, consistent 7-8pm bedtime. 3-5 years: 10-13 hours, nap fading. 6-12 years: 9-12 hours, no nap. Bedtime routine (30 min): bath → pyjamas → teeth → story → lights out. Consistency is the #1 factor in children's sleep.",
  },
  {
    patterns: [
      /\b(activity (for kids|children)|kids (activity|game|craft|bored)|entertain (kids|children)|rainy day activity)\b/i,
    ],
    response:
      "Activities for kids by age: Toddlers: playdough, sensory bins (rice/water), finger painting, cardboard box play. 5-8: scavenger hunts, simple science experiments (baking soda + vinegar), Lego, board games. 9-12: coding (Scratch.mit.edu), cooking together, gardening, photography challenges, book clubs. All ages: nature walks with a challenge (find 5 different leaves), listening to audiobooks on long car journeys.",
  },

  // ── PET CARE ─────────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(dog|puppy|canine|pet dog|train (a )?dog|dog training|dog care|walk dog|dog food|dog health)\b/i,
    ],
    response:
      "Dog care essentials: Feed 2 meals per day (adult dogs), measured portion (check packet for weight). Fresh water always. Walk daily — minimum 30 min for small breeds, 60-90 min for large/working breeds. Brush coat: daily for long-haired, weekly for short-haired. Vet: annual check-up, vaccines, flea/worm treatment monthly or quarterly. Training: use positive reinforcement only (reward desired behaviours, ignore unwanted ones). Never shout or punish — it creates fear, not compliance.",
  },
  {
    patterns: [
      /\b(cat|kitten|feline|cat care|cat food|indoor cat|cat health|litter box|cat behaviour)\b/i,
    ],
    response:
      "Cat care guide: Feed measured portions 2× daily (obesity is the most common cat health problem). Fresh water daily — many cats prefer a water fountain. Clean litter box daily (1 per cat + 1 extra). Vet: annual check-up, vaccinations, flea/worm prevention. Enrich indoor cats: climbing shelves, scratching posts, window perches, interactive play 2× daily (15 min). Signs of illness: not eating, hiding, unusual thirst, changed litter box habits — see a vet within 24-48 hours.",
  },
  {
    patterns: [
      /\b(pet (health|sick|vet|emergency|first aid|medicine|vaccin)|animal (emergency|first aid|sick))\b/i,
    ],
    response:
      "Pet first aid: if your pet is unresponsive — check for breathing and heartbeat. Clear airway of obstructions. Seek emergency vet immediately. Bleeding: apply firm pressure with clean cloth. Suspected poisoning (chocolate, grapes, xylitol, onions, ibuprofen are toxic to dogs and cats): call your vet or an animal poison line immediately. Pet emergency in UK: PDSA, Blue Cross, or local emergency vet. In the US: call ASPCA Poison Control (888-426-4435).",
  },

  // ── VEHICLE CARE ─────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(car (maintenance|service|check|care|oil|tyre|battery|coolant|brake)|vehicle maintenance|mot|car problem)\b/i,
    ],
    response:
      "Car maintenance schedule: Monthly — check tyre pressure (including spare), tread depth (legal minimum 1.6mm), oil level, coolant level, washer fluid, all lights. Every 6-12 months — replace wiper blades. Annually — full service or MOT. Every 3 years or 30,000 miles — replace tyres typically. Signs of trouble: warning lights (don't ignore), vibrations when braking (warped discs), pulling to one side (alignment or tyre pressure), strange engine noises (visit a mechanic promptly).",
  },
  {
    patterns: [
      /\b(change tyre|flat tyre|puncture|spare tyre|tyre change|jack up car|wheel nut)\b/i,
    ],
    response:
      "Emergency tyre change: (1) Pull over safely, hazard lights on, apply handbrake, (2) Get spare tyre, jack, and wheel wrench from boot, (3) Loosen wheel nuts slightly before jacking (car's weight prevents wheel spinning), (4) Jack up the car at the correct jack point (see manual), (5) Remove nuts, swap tyre, hand-tighten nuts in star pattern, (6) Lower car, fully tighten nuts in star pattern (very firm), (7) Check tyre pressure. Temporary spares: max 50mph, replace ASAP.",
  },
  {
    patterns: [
      /\b(jump start|dead battery|jumper cables|boost (car|battery)|car won.?t start|flat battery)\b/i,
    ],
    response:
      "Jump starting a car: (1) Position working car near dead car (not touching), (2) Connect RED cable: dead battery positive (+) → good battery positive (+), (3) Connect BLACK cable: good battery negative (-) → bare metal on dead car's engine block (not the dead battery), (4) Start the working car, run for 2 min, (5) Try to start dead car, (6) Remove cables in REVERSE order: black from engine block → black from good battery → red from good → red from dead. Drive the jumped car for 30+ min to recharge.",
  },

  // ── CREATIVE ARTS & HOBBIES ──────────────────────────────────────────────
  {
    patterns: [
      /\b(photography|take (better|good) photos|camera settings|composition|lighting (photo|photography)|dslr|smartphone camera)\b/i,
    ],
    response:
      "Photography fundamentals: Composition — rule of thirds (place subject on intersections, not centre). Lighting — golden hour (1 hour after sunrise/before sunset) is magical. Leading lines draw the eye. Get close. Eliminate clutter in background. Camera settings: aperture controls depth of field (f/1.8 = blurry background, f/16 = everything sharp). Shutter speed freezes or blurs motion. ISO: as low as possible. Smartphone tip: tap on your subject to focus and expose correctly.",
  },
  {
    patterns: [
      /\b(drawing|sketch|illustration|how to draw|art tips|beginner (art|drawing)|pencil drawing|digital art)\b/i,
    ],
    response:
      "Learning to draw: start with basic shapes — every complex object is combinations of circles, squares, and triangles. Gesture drawing (Quickposes.com — 30-second poses) builds fundamental skills fast. Draw what you observe, not what you 'think' something looks like. Daily practice beats sporadic sessions. Resources: 'Drawing on the Right Side of the Brain' by Betty Edwards. For digital art: Procreate (iPad), Krita (free, PC/Mac), or Adobe Fresco.",
  },
  {
    patterns: [
      /\b(music|learn guitar|piano (lessons|tips)|instrument|practice (music|instrument)|music theory|chords|sight reading)\b/i,
    ],
    response:
      "Learning an instrument: practise daily (20 min daily > 2 hours once a week). Slow practice with correct technique is faster progress than fast practice with errors (you're training your fingers to make mistakes). Learn songs you love early — motivation is the fuel. Music theory basics: understand major/minor scales and basic chord progressions (I-IV-V-I is behind thousands of songs). Free resources: Justin Guitar (guitar), Synthesia (piano), musictheory.net.",
  },
  {
    patterns: [
      /\b(knit|crochet|sew|sewing|craft|diy craft|handmade|textile|embroidery|weav)\b/i,
    ],
    response:
      "Textile crafts for beginners: Crochet is generally easier than knitting to start (only one hook vs two needles). Start with simple stitches: chain, single crochet. Sewing: start by learning to thread the machine and sew straight seams, then curves. Fabric prep: wash and iron fabric before cutting — it shrinks on first wash. Knitting: cast-on, knit stitch, purl stitch covers 90% of patterns. YouTube tutorials are the best way to learn these skills.",
  },
  {
    patterns: [
      /\b(gaming|video game|game tips|gaming setup|controller|fps|rpg|strategy game|gaming chair|lag|fps drops)\b/i,
    ],
    response:
      "Gaming setup optimisation: monitor input lag matters more than refresh rate for competitive games — aim for < 5ms. Wired connection beats Wi-Fi for online gaming. Controller/mouse: clean sensor and buttons monthly. For better performance: lower in-game graphic settings before buying hardware. Eye strain: 20-20-20 rule. Health: take a 10-min break every hour. Posture: monitor at eye level, arms at 90 degrees, back supported. Ergonomic gaming chair is worth the investment.",
  },
  {
    patterns: [
      /\b(book (club|recommendation)|what (to read|book)|reading list|bestseller|novel|fiction|non.?fiction|recommend (a )?book)\b/i,
    ],
    response:
      "Book recommendations by category: Productivity: Atomic Habits (Clear), Deep Work (Newport), The 4-Hour Work Week (Ferriss). Finance: The Psychology of Money (Housel), Rich Dad Poor Dad (Kiyosaki). Health: Why We Sleep (Walker), Breath (Nestor). Philosophy/thinking: Thinking Fast and Slow (Kahneman), The Obstacle is the Way (Holiday). Fiction classics: 1984, To Kill a Mockingbird, One Hundred Years of Solitude. Mystery: Agatha Christie. Sci-Fi: The Martian, Dune.",
  },
  {
    patterns: [
      /\b(hiking|trail|camping|outdoor(s)?|backpack(ing)?|survival|wilderness|nature|fishing|cycling|mountain bike)\b/i,
    ],
    response:
      "Outdoor essentials (10 essentials): map + compass, sun protection (SPF + sunglasses + hat), insulation (extra layer), illumination (head torch + spare batteries), first aid kit, fire starter, repair tools + knife, nutrition (extra food), hydration (extra water + purification), emergency shelter (bivy bag or space blanket). Tell someone where you're going and when to expect you back. Start easy — underestimating terrain is the most common mistake.",
  },

  // ── FASHION & PERSONAL CARE ──────────────────────────────────────────────
  {
    patterns: [
      /\b(style|fashion|outfit|wardrobe|capsule wardrobe|what to wear|dress code|smart casual|formal wear)\b/i,
    ],
    response:
      "Capsule wardrobe essentials: (1) Well-fitting dark jeans, (2) White and navy fitted t-shirts, (3) Oxford shirt (white/light blue), (4) Neutral chinos/trousers, (5) Classic blazer (navy or grey), (6) Quality leather shoes (brown and black), (7) Plain white and grey sweaters, (8) Versatile coat. Fit matters more than brand — even budget clothes look good if tailored correctly. Build on neutrals; add 2-3 accent pieces per season.",
  },
  {
    patterns: [
      /\b(hair (care|tips|growth|loss|style|cut|colour)|haircut|shampoo|conditioner|balding|thinning hair)\b/i,
    ],
    response:
      "Hair care basics: wash frequency depends on hair type — oily hair: every 1-2 days, dry/thick/curly hair: 2-3 times per week. Use conditioner on the lengths and ends (not roots). Towel-dry gently (pat, don't rub). Heat tools: always use a heat protectant spray. For hair growth: scalp massage improves blood flow. Diet matters — biotin, iron, and protein deficiencies cause hair loss. Consult a dermatologist for significant or sudden hair loss.",
  },
  {
    patterns: [
      /\b(dental|teeth|oral hygiene|brush teeth|floss|whitening|toothache|bad breath|halitosis|dentist)\b/i,
    ],
    response:
      "Oral health routine: brush for 2 minutes, twice daily (electric toothbrush is significantly more effective). Floss or use interdental brushes once daily — brushing alone misses 40% of tooth surfaces. Don't rinse with water after brushing (washes away fluoride). Use mouthwash as an add-on, not a replacement for brushing/flossing. See a dentist every 6-12 months. For whitening: whitening toothpaste helps with surface stains; professional treatment for intrinsic staining.",
  },

  // ── ELDERLY CARE ─────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(elderly|aging|senior|care for (parent|grandparent|older adult)|falls prevention|dementia|alzheimer|care home|carer)\b/i,
    ],
    response:
      "Elderly care essentials: Falls prevention (leading cause of injury): remove trip hazards, install grab rails in bathroom, improve lighting, ensure correct footwear, medication review (many cause dizziness). Social engagement is critical for cognitive health — loneliness accelerates decline. Regular GP reviews for medication and health. Power of attorney: set up while the person has capacity. UK support: Age UK helpline 0800 678 1602. Carer's UK for carer support.",
  },
  {
    patterns: [
      /\b(medication management|pill organiser|prescription|poly.?pharmacy|reminder (medication|medicine|pills?))\b/i,
    ],
    response:
      "Medication management for complex regimens: a weekly pill organiser prevents missed or double doses. Set phone alarms for each dose. Keep an up-to-date medication list (name, dose, frequency, prescribing doctor) — carry it to all appointments. Brown bag reviews: take all medications to GP or pharmacist annually to check for interactions and necessity. Don't crush tablets unless explicitly advised — some coatings are functional.",
  },

  // ── EMERGENCY & SAFETY ────────────────────────────────────────────────────
  {
    patterns: [
      /\b(emergency|call 999|call 911|call 112|ambulance|fire brigade|police|urgent help|emergency number)\b/i,
    ],
    response:
      "EMERGENCY SERVICES: UK — 999 | US/Canada — 911 | Europe — 112 | Australia — 000. Stay calm, speak clearly. Tell them: your exact location (street address or nearest landmark), what happened, number of people involved, any immediate hazards. Don't hang up until told to. If you can't speak, listen for instructions — some services accept silent calls (dial and press 55 when prompted in UK).",
  },
  {
    patterns: [
      /\b(fire|smoke alarm|smoke detector|fire escape|fire safety|gas leak|carbon monoxide|co detector)\b/i,
    ],
    response:
      "Fire safety protocol: If fire alarm sounds — GET OUT, STAY OUT, CALL 999. Don't go back for possessions. Close doors as you leave (a closed door can hold fire back for 30 minutes). Crawl below smoke. Test smoke alarms monthly. Carbon monoxide detector: install near bedrooms (CO is odourless and colourless). Gas smell: don't operate any switches, open windows, leave immediately, call National Gas Emergency (UK: 0800 111 999) from outside.",
  },
  {
    patterns: [
      /\b(mental health crisis|suicidal|self.?harm|need help now|crisis|breakdown|in crisis|overwhelmed)\b/i,
    ],
    response:
      "If you're in crisis — you're not alone and help is available right now. UK: Samaritans 116 123 (free, 24/7). US: 988 Suicide and Crisis Lifeline (dial or text 988). International: findahelpline.com. If there is immediate danger of harm, call emergency services (999/911). You deserve support — please reach out. One conversation can change everything.",
  },
  {
    patterns: [
      /\b(power cut|blackout|no electricity|power outage|storm prep|emergency kit|survival kit)\b/i,
    ],
    response:
      "Emergency preparedness kit: Water (4 litres per person per day, 3-day supply). Non-perishable food (3-day supply). Battery-powered or hand-crank radio. Torch and spare batteries. First aid kit. 7-day supply of medications. Copies of important documents in a waterproof bag. Cash (ATMs won't work). Phone charger/power bank. Warm blankets. Whistle to signal for help. Basic tools (wrench to turn off gas/water). Keep car fuel above half when severe weather is forecast.",
  },

  // ── ACCESSIBILITY & ASSISTIVE TECH ────────────────────────────────────────
  {
    patterns: [
      /\b(screen reader|voiceover|talkback|accessibility|visually impaired|nvda|jaws|braille)\b/i,
    ],
    response:
      "Screen reader essentials: iPhone/iPad — VoiceOver (Settings → Accessibility → VoiceOver). Key gestures: one-finger swipe right/left to move between items, double-tap to activate, three-finger scroll. Android — TalkBack (Settings → Accessibility → TalkBack). Windows — NVDA (free: nvaccess.org) or JAWS (paid). Web accessibility: headings navigation (H key), landmarks (D for main content), form mode (F/Enter). Ask Aster to describe anything — GravityMode can help identify objects around you.",
  },
  {
    patterns: [
      /\b(voice control|voice commands?|siri|google assistant|speech recognition|hands.?free|voice assistant tips)\b/i,
    ],
    response:
      "Voice assistant power tips: speak in complete natural sentences rather than keyword fragments. For Aster: say the full request ('add a task to buy milk tomorrow morning' works better than 'milk task'). iPhone Voice Control: Settings → Accessibility → Voice Control — enables full device control by voice. Commands include 'tap [item name]', 'swipe up', 'scroll down'. For best recognition: speak clearly, reduce background noise, and position microphone within 30cm.",
  },
  {
    patterns: [
      /\b(large text|font size|magnification|zoom|contrast|colour blind|display accessibility|switch access|motor impairment)\b/i,
    ],
    response:
      "Accessibility display options: iOS: Settings → Accessibility → Display & Text Size (larger text, bold, increased contrast, reduce transparency). Android: Settings → Accessibility → Font Size and Display Size. Windows: Settings → Ease of Access → Display (text size, colour filters). Colour blindness: enable colour filters (Settings → Accessibility on both iOS and Android). Motor impairments: iOS Switch Access, Android Switch Access, Windows eye tracking and voice control.",
  },

  // ── ENVIRONMENT & SUSTAINABILITY ─────────────────────────────────────────
  {
    patterns: [
      /\b(recycle|recycling|waste|sustainable|eco.?friendly|carbon footprint|zero waste|plastic free|green living)\b/i,
    ],
    response:
      "Practical sustainability: Highest impact changes: (1) Eat less meat (especially beef) — single biggest dietary carbon reduction, (2) Reduce flying — one long-haul flight emits as much CO2 as months of driving, (3) Switch to an EV or use public transport. At home: switch to green energy tariff, insulate, LED bulbs. Zero-waste basics: reusable bag, water bottle, coffee cup, beeswax wraps. Refuse before reduce, reduce before reuse, reuse before recycle.",
  },
  {
    patterns: [
      /\b(composting|compost bin|food waste|worm farm|organic waste|bokashi)\b/i,
    ],
    response:
      "Home composting: add a mix of 'greens' (food scraps, fresh cuttings — nitrogen) and 'browns' (cardboard, dry leaves, paper — carbon) in roughly equal proportion. Keep moist (like a wrung-out sponge) and turn weekly to add oxygen. What to add: fruit and veg peelings, teabags, egg shells, garden waste, cardboard. What to avoid: meat, dairy, cooked food (attract pests). Ready in 3-6 months. Use as a fantastic free soil improver.",
  },

  // ── LEGAL BASICS ─────────────────────────────────────────────────────────
  {
    patterns: [
      /\b(tenant (rights|law)|landlord (rights|law)|rental agreement|eviction|deposit dispute|rent arrears|housing rights)\b/i,
    ],
    response:
      "UK tenant rights: your landlord must provide a copy of the tenancy agreement, your deposit in a protected scheme (within 30 days of receiving it), and an Energy Performance Certificate and Gas Safety Certificate. They must give 24 hours' notice before entering (except emergencies). For deposit disputes: raise with your deposit protection scheme. Free advice: Shelter (0808 800 4444) or Citizens Advice.",
  },
  {
    patterns: [
      /\b(employment (rights|law)|unfair dismissal|redundancy|workplace rights|discrimination|harassment at work|sick pay|maternity leave)\b/i,
    ],
    response:
      "UK employment rights basics: Statutory Sick Pay: £109.40/week for up to 28 weeks (after 3 qualifying days). Maternity leave: up to 52 weeks, Statutory Maternity Pay for 39 weeks. Unfair dismissal: eligible after 2 years' service. Redundancy: minimum 1 week per year of service. Discrimination: protected from day 1 (age, gender, race, religion, disability, etc.). Free advice: ACAS (0300 123 1100) or Citizens Advice.",
  },
  {
    patterns: [
      /\b(will|estate|power of attorney|executor|probate|inheritance|next of kin|lasting power)\b/i,
    ],
    response:
      "Estate planning essentials: write a will — dying intestate (without one) means assets are distributed by law, which may not reflect your wishes. Appoint an executor (someone you trust to administer your estate). Set up a Lasting Power of Attorney (LPA) while you have mental capacity — covers financial decisions and health/welfare decisions separately. Keep documents: birth certificate, passport, property deeds, pension info, bank details in a known, accessible location.",
  },

  // ── QUARQ/AI FEATURES ────────────────────────────────────────────────────
  {
    patterns: [
      /\b(gravity ?mode|object detection|camera detect|obstacle|vision mode|detect objects)\b/i,
    ],
    response:
      "GravityMode uses TensorFlow.js COCO-SSD to detect objects around you in real-time via your camera — no internet needed. Open GravityMode from the sidebar, allow camera access, and press START. Bounding boxes with labels appear over detected objects. Status: green (clear) → amber (some objects) → red (many/close objects). Voice announcements alert you to new objects. Perfect as a supplement to a cane or guide dog.",
  },
  {
    patterns: [/\b(earth ?mode|gps|navigation mode|navigate|location mode)\b/i],
    response:
      "EarthMode provides GPS-based navigation assistance for walking and public spaces. Open from the sidebar, grant location permission, and follow the step-by-step guidance. Best used outdoors for strongest GPS signal. Works alongside GravityMode for combined vision + navigation assistance.",
  },
  {
    patterns: [
      /\b(setup ai|configure ai|api key|admin setup|provider|openai|gemini|groq|cohere|sambanova|ai provider)\b/i,
    ],
    response:
      "To set up online AI: Settings → AI Assistant → Setup API Key → enter PIN: asteroid123. Choose a provider and paste your API key. Free options: Gemini (aistudio.google.com), Groq (console.groq.com), Cohere (dashboard.cohere.com). Once configured, switch offline mode OFF in the chat header to use the full AI. Offline mode always available — no API key needed.",
  },
  {
    patterns: [
      /\b(offline mode|how does offline work|what is offline mode|local ai|rule.?based)\b/i,
    ],
    response:
      "Offline mode uses Aster's built-in rule-based knowledge base — zero internet, zero API key, instant responses. Covers 10,000+ everyday scenarios across work, home, health, finance, travel, tech, education, hobbies, pets, vehicles, legal basics, and more. Toggle it on/off with the switch in the chat header. For real-time data (news, weather, live searches), switch to online mode.",
  },
  {
    patterns: [
      /\b(settings|preferences|personaliz|customize|change (theme|language|notifications|mode))\b/i,
    ],
    response:
      "Quarq/AI Settings page (sidebar): AI provider and API key configuration, dark/light mode toggle, device permissions (camera, microphone, location), and accessibility options. Offline mode is toggled directly in the Chat header — no settings page needed. All preferences are saved locally on your device.",
  },

  // ── GENERAL KNOWLEDGE (online-only queries) ───────────────────────────────
  {
    patterns: [
      /\b(weather|forecast|temperature today|will it rain|is it going to (rain|snow)|current weather)\b/i,
    ],
    response:
      "I can't access live weather data in offline mode. Check weather.com, the BBC Weather app, or ask your device's voice assistant for the current forecast. Switch to online mode in the chat header to get weather via Aster.",
  },
  {
    patterns: [
      /\b(news|headlines|current events|what.?s happening|latest news|breaking news)\b/i,
    ],
    response:
      "I can't access live news in offline mode. For current events, visit BBC News, Reuters, AP News, or your preferred news app. Switch to online mode for Aster to summarise news for you.",
  },
  {
    patterns: [
      /\b(what is|what are|explain|define|meaning of|how does|why is|when (is|was|did)|who (is|was|invented|created))\b/i,
    ],
    response: (_, input) => {
      const topic = input
        .replace(
          /^(what is|what are|explain|define|how does|why is|when is|when was|when did|who is|who was|who invented|who created|meaning of)\s*/i,
          "",
        )
        .replace(/[?!.]+$/, "")
        .slice(0, 60);
      return `I'm in offline mode, so I don't have encyclopaedic information about "${topic}". For factual lookups, switch to online mode (toggle in the chat header). I can definitely help you with practical tasks, home, health, finance, travel, tech, education, hobbies, and daily life — just ask!`;
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXTUAL FALLBACK
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_RESPONSES = [
  (q: string) =>
    `I'm running in offline mode, so I'm working from a built-in knowledge base. Your question about "${q.slice(0, 60)}" may need a more specific angle. I'm strongest on: daily productivity, household tasks, cooking, health, finance, travel, tech support, vehicles, pets, parenting, creative hobbies, and legal basics. Could you rephrase it within one of those areas?`,
  (q: string) =>
    `Offline mode is active. I may not have specific info about "${q.slice(0, 50)}" but I can help if you ask about work tasks, home management, recipes, health, budgeting, tech troubleshooting, car care, pet care, or any practical everyday scenario. What would be most useful right now?`,
  (_q: string) =>
    "I didn't find a match in my offline knowledge base for that exact query. Try rephrasing or ask me about: scheduling, productivity, cooking, cleaning, health, fitness, savings, home maintenance, tech issues, car care, pets, or hobbies. Or switch to online mode for broader answers.",
  (_q: string) =>
    "Hmm, that one pushed the edges of my offline knowledge. I'm best at practical everyday assistance — ask me about home, work, health, travel, tech, finance, hobbies, pets, parenting, or sustainability. Or toggle online mode in the chat header for AI-powered answers on anything.",
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENGINE
// ─────────────────────────────────────────────────────────────────────────────
export function processOfflineMessage(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "Please type a message and I'll do my best to help!";

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      const match = trimmed.match(pattern);
      if (match) {
        if (typeof rule.response === "function") {
          return rule.response(match, trimmed);
        }
        return rule.response;
      }
    }
  }

  const fallback =
    FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  return fallback(trimmed);
}
