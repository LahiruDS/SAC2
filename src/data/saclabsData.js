export const SITE = {
  name: 'SAC Labs',
  tagline: 'Learn Chemistry the Smart Way',
  description:
    'SAC Labs is a chemistry learning platform for Sri Lankan students — HD video sessions, past papers and interactive quizzes, all in one place.',
  social: {
    facebook: 'https://www.facebook.com/yourpage',
    whatsapp: 'https://wa.me/94771234567',
    instagram: 'https://www.instagram.com/yourpage',
  },
  contact: {
    email: 'hello@saclabs.lk',
    phone: '+94 77 123 4567',
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

export const PAPERS = [
  {
    id: 'paper-al-2024',
    title: 'A/L Chemistry — 2024 Past Paper',
    subject: 'A/L Chemistry',
    type: 'Past Paper',
    size: '2.4 MB',
    pages: 18,
    color: '#7c3aed',
  },
  {
    id: 'paper-al-2023',
    title: 'A/L Chemistry — 2023 Past Paper',
    subject: 'A/L Chemistry',
    type: 'Past Paper',
    size: '2.1 MB',
    pages: 18,
    color: '#a855f7',
  },
  {
    id: 'paper-al-mcq',
    title: 'A/L Chemistry — MCQ Pack (500 Qs)',
    subject: 'A/L Chemistry',
    type: 'Question Bank',
    size: '1.8 MB',
    pages: 34,
    color: '#ec4899',
  },
  {
    id: 'paper-ol-2024',
    title: 'O/L Science — Chemistry Section 2024',
    subject: 'O/L Science',
    type: 'Past Paper',
    size: '1.5 MB',
    pages: 12,
    color: '#0d9488',
  },
  {
    id: 'notes-organic',
    title: 'Organic Chemistry — Summary Notes',
    subject: 'A/L Chemistry',
    type: 'Notes',
    size: '900 KB',
    pages: 14,
    color: '#f59e0b',
  },
  {
    id: 'notes-kinetics',
    title: 'Kinetics & Equilibrium — Quick Notes',
    subject: 'A/L Chemistry',
    type: 'Notes',
    size: '720 KB',
    pages: 9,
    color: '#d946ef',
  },
]

export const QUIZZES = [
  {
    id: 'quiz-atomic',
    title: 'Atomic Structure Quiz',
    description: '10 questions · 10 minutes',
    icon: 'atom',
    color: '#7c3aed',
    questions: [
      {
        q: 'What three particles make up an atom?',
        options: [
          'Protons, neutrons, electrons',
          'Protons, electrons, photons',
          'Neutrons, electrons, quarks',
          'Atoms, ions, isotopes',
        ],
        answer: 0,
      },
      {
        q: 'Which particle carries a positive charge?',
        options: ['Electron', 'Neutron', 'Proton', 'Photon'],
        answer: 2,
      },
      {
        q: 'The number of protons in an atom defines its…',
        options: ['Mass number', 'Element', 'Isotope', 'Charge'],
        answer: 1,
      },
      {
        q: 'Where are neutrons and protons located?',
        options: [
          'In the electron cloud',
          'In the nucleus',
          'In energy shells',
          'Scattered randomly',
        ],
        answer: 1,
      },
      {
        q: 'Which subatomic particle is about 1800 times less massive than a proton?',
        options: ['Neutron', 'Proton', 'Electron', 'Positron'],
        answer: 2,
      },
      {
        q: 'Atoms of the same element with different numbers of neutrons are called…',
        options: ['Ions', 'Molecules', 'Isotopes', 'Allotropes'],
        answer: 2,
      },
      {
        q: 'The atomic number of silver (Ag) is 47. How many protons does a silver atom have?',
        options: ['61', '47', '108', '79'],
        answer: 1,
      },
      {
        q: 'Electrons are found…',
        options: [
          'Inside the nucleus',
          'Around the nucleus in shells',
          'Only in molecules',
          'Inside protons',
        ],
        answer: 1,
      },
      {
        q: 'What holds protons together in the nucleus?',
        options: [
          'Electromagnetic force',
          'Gravity',
          'The strong nuclear force',
          'Friction',
        ],
        answer: 2,
      },
      {
        q: 'A neutral atom of element X has 8 protons and 10 neutrons. Its mass number is…',
        options: ['8', '10', '18', '2'],
        answer: 2,
      },
    ],
  },
  {
    id: 'quiz-ph',
    title: 'Acids, Bases & pH Quiz',
    description: '10 questions · 10 minutes',
    icon: 'flask',
    color: '#0d9488',
    questions: [
      {
        q: 'A pH of 7 means the solution is…',
        options: ['Acidic', 'Neutral', 'Basic', 'Undefined'],
        answer: 1,
      },
      {
        q: 'Which substance is a strong acid?',
        options: ['Vinegar', 'Lemon juice', 'Hydrochloric acid', 'Ammonia'],
        answer: 2,
      },
      {
        q: 'An acid is a substance that…',
        options: [
          'Donates protons (H+)',
          'Accepts protons (H+)',
          'Always has pH 14',
          'Turns red litmus blue',
        ],
        answer: 0,
      },
      {
        q: 'What is the sum of pH and pOH of any aqueous solution at 25 °C?',
        options: ['7', '10', '14', '0'],
        answer: 2,
      },
      {
        q: 'A solution with pH 3 is how many times more acidic than pH 5?',
        options: ['2×', '10×', '100×', '1000×'],
        answer: 2,
      },
      {
        q: 'Which of these turns red litmus paper blue?',
        options: ['Sulfuric acid', 'Sodium hydroxide', 'Water', 'Carbon dioxide'],
        answer: 1,
      },
      {
        q: 'The water dissociation constant Kw equals…',
        options: ['1 × 10⁻⁷', '1 × 10⁻¹⁴', '14', '100'],
        answer: 1,
      },
      {
        q: 'A base can be described as a…',
        options: [
          'Proton donor',
          'Proton acceptor',
          'Electron donor only',
          'Salt',
        ],
        answer: 1,
      },
      {
        q: 'Which of the following is an acid–base indicator?',
        options: ['Litmus paper', 'Filter paper', 'pH paper?', 'Wax paper'],
        answer: 0,
      },
      {
        q: 'The reaction between an acid and a base to form water and a salt is called…',
        options: [
          'Combustion',
          'Neutralisation',
          'Oxidation',
          'Precipitation',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 'quiz-organic',
    title: 'Organic Chemistry Basics Quiz',
    description: '10 questions · 10 minutes',
    icon: 'hexagon',
    color: '#f59e0b',
    questions: [
      {
        q: 'Which element forms the backbone of organic compounds?',
        options: ['Oxygen', 'Carbon', 'Nitrogen', 'Hydrogen'],
        answer: 1,
      },
      {
        q: 'A compound containing only carbon and hydrogen is called a…',
        options: ['Carbohydrate', 'Hydrocarbon', 'Carbonate', 'Protein'],
        answer: 1,
      },
      {
        q: 'Which functional group is present in alcohols?',
        options: ['-OH', '-COOH', '-NH2', '-CHO'],
        answer: 0,
      },
      {
        q: 'The formula C₂H₆ represents…',
        options: ['Ethene', 'Ethanol', 'Ethane', 'Ethyne'],
        answer: 2,
      },
      {
        q: 'Hydrocarbons with only single C–C bonds are called…',
        options: ['Alkenes', 'Alkynes', 'Alkanes', 'Arenes'],
        answer: 2,
      },
      {
        q: 'Which of these is an alkene?',
        options: ['C₂H₆', 'C₂H₄', 'CH₄', 'C₃H₈'],
        answer: 1,
      },
      {
        q: 'The functional group -COOH belongs to…',
        options: ['Alcohols', 'Carboxylic acids', 'Esters', 'Aldehydes'],
        answer: 1,
      },
      {
        q: 'Benzene is an example of…',
        options: ['An alkane', 'An alkene', 'An aromatic hydrocarbon', 'An alcohol'],
        answer: 2,
      },
      {
        q: 'The general formula for alkanes is…',
        options: ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'],
        answer: 0,
      },
      {
        q: 'Which process converts ethene to ethanol?',
        options: [
          'Cracking',
          'Hydration',
          'Combustion',
          'Polymerisation',
        ],
        answer: 1,
      },
    ],
  },
]

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
