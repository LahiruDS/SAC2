export const SITE = {
  name: 'SAC Labs',
  tagline: 'Learn Chemistry the Smart Way',
  description:
    'SAC Labs is a chemistry learning platform for Sri Lankan students — HD video sessions, past papers and interactive quizzes, all in one place.',
  social: {
    facebook: 'https://www.facebook.com/yourpage',
    whatsapp: 'https://wa.me/94704197762',
    instagram: 'https://www.instagram.com/yourpage',
  },
  contact: {
    email: 'hello@saclabs.lk',
    phone: '+94 704 197 762',
  },
}

export const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 1500,
    period: 'month',
    popular: false,
    features: [
      'All video sessions',
      'All past papers & notes',
      'All interactive quizzes',
      'WhatsApp doubt support',
      'Cancel anytime',
    ],
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 4000,
    period: '3 months',
    popular: true,
    features: [
      'Everything in Monthly',
      'Save LKR 500',
      'Priority doubt support',
      'Monthly revision tests',
      'Exam strategy sessions',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 12000,
    period: 'year',
    popular: false,
    features: [
      'Everything in Quarterly',
      'Best value (save LKR 6,000)',
      '1-on-1 progress review',
      'Exclusive printed notes',
      'Lifetime access to past papers',
    ],
  },
]

export const COURSES = [
  {
    id: 'al-chemistry',
    title: 'G.C.E. A/L Chemistry',
    level: 'A/L',
    medium: 'Sinhala',
    tagline: 'Full syllabus · Physical · Organic · Inorganic',
    price: 1500,
    students: 1240,
    rating: 4.9,
    gradient: 'linear-gradient(135deg, #6d28d9, #a855f7, #ec4899)',
    icon: 'flask',
    description:
      'Master the A/L Chemistry syllabus with clear, step-by-step video lessons. Includes theory, past paper walk-throughs and quick revision notes.',
    modules: [
      {
        id: 'mod-physical',
        title: 'Physical Chemistry',
        sessions: [
          {
            id: 'al-atomic',
            title: 'Atomic Structure & The Nucleus',
            ytId: 'FSyAehMdpyI',
            duration: '11:10',
            free: true,
            description:
              'Free preview — protons, neutrons, electrons and why the nucleus defines every element.',
          },
          {
            id: 'al-periodic',
            title: 'The Periodic Table — Deep Dive',
            ytId: '0RRVV4Diomg',
            duration: '11:22',
            free: false,
            description:
              'Groups, periods and trends explained with Mendeleev’s story.',
          },
          {
            id: 'al-ph',
            title: 'pH & pOH Calculations',
            ytId: 'LS67vS10O5Y',
            duration: '11:23',
            free: false,
            description:
              'Kw, logarithms made easy, and how to calculate pH for strong and weak acids.',
          },
          {
            id: 'al-kinetics',
            title: 'Chemical Kinetics & Rates',
            ytId: '0RRVV4Diomg',
            duration: '11:22',
            free: false,
            description:
              'Rates of reaction, factors affecting rate and collision theory.',
          },
        ],
      },
      {
        id: 'mod-organic',
        title: 'Organic Chemistry',
        sessions: [
          {
            id: 'al-organic-1',
            title: 'Introduction to Organic Chemistry',
            ytId: 'FSyAehMdpyI',
            duration: '11:10',
            free: false,
            description:
              'Hydrocarbons, functional groups and nomenclature basics.',
          },
          {
            id: 'al-reactions',
            title: 'Acid–Base Reactions in Solution',
            ytId: 'ANi709MYnWg',
            duration: '11:17',
            free: false,
            description:
              'Proton transfer, conjugate acids/bases and acid–base stoichiometry.',
          },
        ],
      },
      {
        id: 'mod-inorganic',
        title: 'Inorganic Chemistry',
        sessions: [
          {
            id: 'al-inorg-1',
            title: 's-Block & p-Block Elements',
            ytId: '0RRVV4Diomg',
            duration: '11:22',
            free: false,
            description:
              'Alkali metals, alkaline earth metals and the p-block group trends.',
          },
          {
            id: 'al-transition',
            title: 'Transition Metals & Complex Ions',
            ytId: 'ANi709MYnWg',
            duration: '11:17',
            free: false,
            description:
              'Colour, oxidation states and coordination chemistry made simple.',
          },
        ],
      },
    ],
  },
  {
    id: 'ol-science',
    title: 'G.C.E. O/L Science — Chemistry',
    level: 'O/L',
    medium: 'Sinhala',
    tagline: 'Core chemistry for O/L Science',
    price: 1000,
    students: 860,
    rating: 4.8,
    gradient: 'linear-gradient(135deg, #0d9488, #2dd4bf, #f59e0b)',
    icon: 'beaker',
    description:
      'A friendly introduction to chemistry for O/L students — atoms, molecules, reactions and lab skills, with practice questions after every lesson.',
    modules: [
      {
        id: 'mod-ol-basics',
        title: 'Basics of Chemistry',
        sessions: [
          {
            id: 'ol-atoms',
            title: 'Atoms, Elements & Compounds',
            ytId: 'FSyAehMdpyI',
            duration: '11:10',
            free: true,
            description:
              'Free preview — what everything is made of, in plain language.',
          },
          {
            id: 'ol-matter',
            title: 'States of Matter & Changes',
            ytId: 'LS67vS10O5Y',
            duration: '11:23',
            free: false,
            description: 'Solids, liquids, gases and the changes between them.',
          },
          {
            id: 'ol-mixtures',
            title: 'Mixtures & Separation Techniques',
            ytId: '0RRVV4Diomg',
            duration: '11:22',
            free: false,
            description:
              'Filtration, distillation and chromatography with real examples.',
          },
        ],
      },
      {
        id: 'mod-ol-reactions',
        title: 'Chemical Reactions',
        sessions: [
          {
            id: 'ol-acids',
            title: 'Acids, Bases & Salts',
            ytId: 'ANi709MYnWg',
            duration: '11:17',
            free: false,
            description:
              'pH, indicators, neutralisation and how salts are made.',
          },
        ],
      },
    ],
  },
  {
    id: 'intro-chem',
    title: 'Intro to Chemistry (Beginner)',
    level: 'All',
    medium: 'Sinhala + English',
    tagline: 'For students who want to fall in love with chemistry',
    price: 750,
    students: 510,
    rating: 4.7,
    gradient: 'linear-gradient(135deg, #f59e0b, #fb7185, #d946ef)',
    icon: 'atom',
    description:
      'A gentle, fun introduction to chemistry — perfect for grade 8–11 students and anyone curious about how the world works at the atomic level.',
    modules: [
      {
        id: 'mod-intro',
        title: 'Getting Started',
        sessions: [
          {
            id: 'intro-what',
            title: 'What is Chemistry?',
            ytId: 'FSyAehMdpyI',
            duration: '11:10',
            free: true,
            description:
              'Free preview — chemistry is the amazing and beautiful science of stuff.',
          },
          {
            id: 'intro-tables',
            title: 'Reading the Periodic Table',
            ytId: '0RRVV4Diomg',
            duration: '11:22',
            free: false,
            description:
              'Understand the periodic table like a pro, no memorising needed.',
          },
        ],
      },
    ],
  },
]

export const PAPERS = []

export const QUIZZES = []

export const TESTIMONIALS = [
  {
    name: 'Sanduni Perera',
    role: 'A/L Student · Colombo',
    initials: 'SP',
    color: '#7c3aed',
    stars: 5,
    text: 'Chemistry was my worst subject until I found SAC Labs. The video lessons are short, clear and actually fun. I improved from a C to an A in just one term!',
  },
  {
    name: 'Kavindu Silva',
    role: 'A/L Student · Kandy',
    initials: 'KS',
    color: '#0d9488',
    stars: 5,
    text: 'The past paper walk-throughs are a lifesaver. Being able to pay monthly and access everything is super convenient for a student budget.',
  },
  {
    name: 'Nethmi Fernando',
    role: 'O/L Student · Galle',
    initials: 'NF',
    color: '#ec4899',
    stars: 5,
    text: 'I love the quizzes! I can test myself right after each video and see my score instantly. My school results have never been better.',
  },
]
