import type {
  Project,
  SkillCategory,
  CertificateItem,
  EducationItem,
  AchievementItem,
  TechnicalArticle,
} from '../types/portfolio.ts';

export const PORTFOLIO_CONFIG = {
  profile: {
    name: 'Nitesh Chaurasiya',
    logoSubtitle: 'tech_by_niteshh',
    role: 'Student Developer & IoT Explorer',
    headline: 'Building Ideas Into Real-World Digital Experiences.',
    subheadline:
      "I'm Nitesh Chaurasiya, a student developer exploring full-stack development, Python, AI, and IoT. I enjoy learning by building projects and turning ideas into useful products.",
    location: 'India',
    availabilityStatus: 'Available for Internships & Projects',
    isAvailable: true,
    email: 'niteshh0x0@gmail.com',
    github: 'https://github.com/niteshh0x0',
    linkedin: 'https://linkedin.com/in/niteshh0x0',
    twitter: 'https://x.com/niteshh0x0',
    youtube: 'https://youtube.com/@niteshh0x0',
    resumeUrl: '#contact',
    resumeConfigured: true,
    avatarPlaceholderText: 'NC',
    statement:
      'Pursuing B.VOC in Internet of Things. Passionate about building scalable web applications, embedded hardware systems, and experimenting with artificial intelligence to solve practical community problems.',
  },

  donation: {
    enabled: true,
    heading: 'Fuel My Creativity ☕',
    subheading:
      'Enjoying my projects or the things I share? You can buy me a virtual coffee and help fuel the next crazy idea!',
    description:
      'Your support helps me spend more time learning, experimenting, building cool projects, and sharing what I discover. No pressure at all — checking out my work and sharing it already means a lot. ❤️',
    upiId: 'niteshh0x0@upi',
    payeeName: 'Nitesh Chaurasiya',
    presetAmounts: [51, 101, 251],
    defaultAmount: 101,
    isUpiVerified: true,
    disclaimer:
      'Contributions are 100% voluntary. UPI deep links open your installed UPI app (GPay, PhonePe, Paytm, etc.). Automatic instant verification is subject to bank clearing.',
  },

  contact: {
    heading: "Have an Idea? Let's Talk.",
    subheading:
      "Got a project in mind, want to collaborate, or just want to say hello? Send me a message. I'd love to hear from you!",
    categories: [
      'Freelance Project',
      'Collaboration',
      'Internship / Opportunity',
      'Technical Question',
      'Other',
    ],
    ownerEmail: 'niteshh0x0@gmail.com',
  },
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'IoT & Embedded Systems',
    description: 'Hardware prototyping, sensor telemetry, microcontrollers, and physical computing.',
    skills: [
      { name: 'ESP32 & Arduino', level: 'Core', tags: ['C++', 'MicroPython', 'Pinout'] },
      { name: 'Sensors & Actuators', level: 'Core', tags: ['Ultrasonic', 'PIR', 'DHT11/22', 'GPS'] },
      { name: 'MQTT Protocol', level: 'Core', tags: ['Pub/Sub', 'Broker', 'IoT Telemetry'] },
      { name: 'Raspberry Pi', level: 'Proficient', tags: ['Linux GPIO', 'Automation'] },
      { name: 'Hardware Prototyping', level: 'Core', tags: ['Circuit Design', 'Breadboarding'] },
    ],
  },
  {
    name: 'Frontend Development',
    description: 'Modern, reactive user interfaces and interactive 3D visualizations.',
    skills: [
      { name: 'React', level: 'Core', tags: ['SPA', 'Hooks', 'Context'] },
      { name: 'TypeScript', level: 'Core', tags: ['Strict Types', 'Generics'] },
      { name: 'Tailwind CSS', level: 'Core', tags: ['Design Systems', 'Responsive'] },
      { name: 'Next.js', level: 'Proficient', tags: ['App Router', 'SSR'] },
      { name: 'Three.js / WebGL', level: 'Proficient', tags: ['3D Scenes', 'PBR Shaders'] },
      { name: 'HTML5 & CSS3', level: 'Core', tags: ['Semantic', 'Accessibility'] },
    ],
  },
  {
    name: 'Backend & APIs',
    description: 'Server architectures, microservices, and secure API endpoints.',
    skills: [
      { name: 'Python', level: 'Core', tags: ['Automation', 'FastAPI', 'Scripting'] },
      { name: 'Node.js', level: 'Core', tags: ['Express', 'Event Loop', 'CLI'] },
      { name: 'Express.js', level: 'Core', tags: ['RESTful APIs', 'Middleware'] },
      { name: 'FastAPI', level: 'Proficient', tags: ['Pydantic', 'Async'] },
      { name: 'REST APIs', level: 'Core', tags: ['Auth', 'Rate Limiting', 'CORS'] },
      { name: 'WebSockets', level: 'Exploring', tags: ['Real-time', 'Events'] },
    ],
  },
  {
    name: 'AI & Data Science',
    description: 'Applied machine learning, language models, and automated data pipelines.',
    skills: [
      { name: 'Python for AI', level: 'Proficient', tags: ['NumPy', 'Pandas'] },
      { name: 'Gemini API & LLMs', level: 'Proficient', tags: ['Prompt Engineering', 'SDK'] },
      { name: 'scikit-learn', level: 'Exploring', tags: ['Classification', 'Regression'] },
      { name: 'OpenCV Basics', level: 'Exploring', tags: ['Computer Vision'] },
    ],
  },
  {
    name: 'Databases & Storage',
    description: 'Relational, document, and key-value persistent storage systems.',
    skills: [
      { name: 'PostgreSQL', level: 'Proficient', tags: ['SQL', 'Indexes', 'Relations'] },
      { name: 'MongoDB', level: 'Proficient', tags: ['Mongoose', 'Aggregations'] },
      { name: 'SQLite', level: 'Core', tags: ['Embedded', 'Testing'] },
      { name: 'Redis', level: 'Exploring', tags: ['Caching', 'PubSub'] },
    ],
  },
  {
    name: 'Dev Tools & Security',
    description: 'Tooling, ethical hacking basics, and production deployment environments.',
    skills: [
      { name: 'Git & GitHub', level: 'Core', tags: ['Version Control', 'Actions'] },
      { name: 'Linux / Bash', level: 'Core', tags: ['Shell Scripting', 'Server Admin'] },
      { name: 'Ethical Hacking Basics', level: 'Proficient', tags: ['Network Scan', 'Security'] },
      { name: 'Postman', level: 'Proficient', tags: ['API Testing', 'Specs'] },
      { name: 'Vite & Tooling', level: 'Core', tags: ['Bundling', 'Optimizations'] },
    ],
  },
];

export const SKILL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-google-ai',
    title: 'Introduction to Generative AI',
    issuer: 'Google AI Studio',
    year: '2025',
    category: 'AI & Machine Learning',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D4D1FAQHAcI8D8qJurA/feedshare-document-images_1920/B4DZy.OWFQGwAo-/1/1772717959554?e=1793232000&v=beta&t=WoCqZLxJJ1KCT2r1CAJRtBpnRpWRFMCvCgQdai84s_4',
    description:
      'Official certification covering fundamentals of Large Language Models (LLMs), prompt engineering, attention mechanisms, and building generative AI applications with Google AI Studio.',
    skills: ['Generative AI', 'Google AI Studio', 'Prompt Engineering', 'LLM Architectures'],
  },
  {
    id: 'cert-python-udemy',
    title: 'Python Automation Mastery',
    issuer: 'Udemy',
    year: '2025',
    category: 'Python & Automation',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D5622AQHXXqBZeI1HeA/feedshare-image-high-res/B56ZzDjW1PHAAU-/0/1772807351883?e=1793836800&v=beta&t=86SL5BlxKiqBW8O7GP6HB0jAk-ap14T5kNIIiV3i3Zg',
    description:
      'Comprehensive mastery of Python scripting for web scraping, file automation, task scheduling, regex pattern matching, and automated API integrations.',
    skills: ['Python 3', 'Task Automation', 'Web Scraping', 'Regex & Scripting'],
  },
  {
    id: 'cert-cydenium-hacking',
    title: 'Ethical Hacking Master Class',
    issuer: 'Cydenium',
    year: '2025',
    category: 'Cybersecurity',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D5622AQH9Zb5f3LSprQ/feedshare-shrink_1280/B56Z6soqcOGgAM-/0/1781012801891?e=1793836800&v=beta&t=K5w4XZ9tX1h9jJGI1aabyaLCgYntUbU4ntNe1DEijKw',
    description:
      'Practical cybersecurity training in network reconnaissance, vulnerability identification, web security safeguards, and defensive countermeasures.',
    skills: ['Ethical Hacking', 'Network Security', 'Vulnerability Assessment', 'InfoSec'],
  },
  {
    id: 'cert-hp-ai',
    title: "AI for Beginners",
    issuer: 'HP (HP LIFE)',
    year: '2025',
    category: 'AI & Data Science',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D561FAQGg04DEcGgqGQ/feedshare-document-images_800/B56ZygTz1aKQAk-/1/1772216074640?e=1793232000&v=beta&t=L_RIx7AKZM7jjKeiHQb83YxgG62De_kvd7AlIC5IRLM',
    description:
      'Foundational certification exploring the mechanics of artificial intelligence, real-world data patterns, neural networking concepts, and ethical AI development.',
    skills: ['AI Foundations', 'Machine Learning', 'Data Ethics', 'HP LIFE'],
  },
  {
    id: 'cert-tcs-ion',
    title: 'TCS iON Skill Development & Career Edge',
    issuer: 'TCS iON',
    year: '2024',
    category: 'Professional Skills',
    imageUrl: 'https://i.ibb.co/Df21rCYw/tcsion-skill-development.png',
    description:
      'Industry-recognized professional credential focusing on workplace readiness, business communication, digital agility, problem solving, and presentation skills.',
    skills: ['Workplace Communication', 'Professional Etiquette', 'Problem Solving', 'Digital Agility'],
  },
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    id: 'bvoc-iot',
    institution: 'University Technical Institute',
    degree: 'Bachelor of Vocation (B.VOC)',
    field: 'Internet of Things (IoT)',
    period: '2025 — Present',
    location: 'India',
    description:
      'Currently pursuing Bachelor of Vocation in Internet of Things (IoT). The program bridges theoretical engineering with practical industry-grade skills across microcontrollers, wireless telemetry, sensor interfacing, and cloud-connected IoT dashboards.',
    keyHighlights: [
      'Microcontroller architecture & sensor interfacing with ESP32, Arduino, and embedded chips.',
      'Industrial IoT protocols & messaging architectures (MQTT, WebSockets, HTTP, BLE).',
      'End-to-end full-stack dashboard development for real-time sensor analytics and automated hardware triggers.',
      'Active hardware lab prototyping, circuit troubleshooting, and practical IoT deployments.',
    ],
  },
  {
    id: 'higher-secondary-cbse',
    institution: 'Central Board of Secondary Education (CBSE)',
    degree: 'Higher Secondary Education (10+2)',
    field: 'Senior Secondary Education',
    period: '2021 — 2025',
    location: 'India',
    description:
      'Completed Higher Secondary education accredited by the Central Board of Secondary Education (CBSE), developing strong fundamentals in analytical reasoning, mathematics, physics, and computer science.',
    keyHighlights: [
      'Built a strong analytical base in Mathematics, Physical Sciences, and Computer Applications.',
      'Developed early passion for Python scripting, algorithms, and microelectronics during school projects.',
      'Active participant in regional science exhibitions and technology club initiatives.',
    ],
  },
];

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'sih-second-round',
    title: 'Smart India Hackathon (SIH) — Second Round Qualifier',
    issuer: 'Ministry of Education & AICTE, Government of India',
    year: '2025',
    badgeType: 'Hackathon',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D561FAQG7yKhKMC1gpw/feedshare-document-images_800/B56aDkTiwHJIAk-/1/1790536724297?e=1793232000&v=beta&t=9iSlAkA9g8edIqMPoNSK1qhNLE7May_wSRM8KYxn9xw',
    description:
      'Earned Certificate of Participation after advancing to the Second Round of the nationwide Smart India Hackathon (SIH), solving national-scale digital challenges through rapid prototyping and agile system design.',
  },
  {
    id: 'stampers-national-hackathon',
    title: 'Stampers National Hackathon — Participant',
    issuer: 'Stampers National Hackathon',
    year: '2025',
    badgeType: 'Hackathon',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D561FAQG-osKtvQDnHw/feedshare-document-images_800/B56aBxzNk6JUAo-/1/1788615646272?e=1793232000&v=beta&t=FG6jI0XwursUpF55OwVkZzH-d4a-5_atmt61wPlkK5U',
    rotate: 90, // Displayed in true landscape orientation (rotated 90deg right)
    description:
      'Awarded Certificate of Participation in Stampers National Hackathon for collaborative engineering, system architecture, and building innovative full-stack solutions under time-constrained hackathon conditions.',
  },
  {
    id: 'vesdiam-hackathon',
    title: 'Vesdiam Technologies Hackathon — Participant',
    issuer: 'Vesdiam Technologies',
    year: '2025',
    badgeType: 'Hackathon',
    imageUrl:
      'https://media.licdn.com/dms/image/v2/D5622AQEtOaMdkfXzpQ/feedshare-shrink_800/B56Z978YqJHUAg-/0/1784490855614?e=1793836800&v=beta&t=AaUAo85QAeap-WQvo8rxri90LxkW3-rVf7qLPo6BLSs',
    description:
      'Received Certificate of Participation in the Vesdiam Technologies Hackathon, engineering real-world solutions and presenting functional prototypes to technical industry mentors.',
  },
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'pyqverse',
    name: 'PYQVerse',
    tagline: 'Centralized University Academic & Past Exam Paper Ecosystem',
    description:
      'A community-driven digital archive designed for engineering and college students to organize, search, and download previous years question papers, syllabus guides, and verified solution keys with instant search and intelligent filtering.',
    fullDetails: [
      'Engineered an indexed database architecture allowing instant search across 500+ past semester papers by university, semester, subject code, and academic year.',
      'Implemented peer-to-peer paper submission workflow with metadata verification and secure file storage.',
      'Designed a responsive, low-bandwidth UI optimized for fast mobile rendering during high-traffic exam weeks.',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    category: 'Full-Stack',
    status: 'Live & Active',
    liveUrl: 'https://pyqverse.vercel.app',
    githubUrl: 'https://github.com/niteshh0x0/pyqverse',
    highlightMetric: 'Serving 2,000+ student searches monthly',
    iconName: 'book-open',
  },
  {
    id: 'sakhibiz',
    name: 'SakhiBiz',
    tagline: 'Micro-Commerce & Digital Empowerment Platform for Artisans',
    description:
      'A lightweight web marketplace and inventory manager created for rural and semi-urban women entrepreneurs to display hand-crafted goods, track micro-orders, and accept direct peer-to-peer UPI payments.',
    fullDetails: [
      'Built simplified bilingual onboarding designed for first-time internet business owners with voice-friendly prompts.',
      'Integrated native UPI payment deep-linking and QR generation allowing direct payment without intermediate gateway commissions.',
      'Awarded top honors in regional university innovation hackathon for social impact tech.',
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'UPI Deep-link'],
    category: 'Full-Stack',
    status: 'Completed',
    liveUrl: 'https://sakhibiz.vercel.app',
    githubUrl: 'https://github.com/niteshh0x0/sakhibiz',
    highlightMetric: 'Hackathon Award Winner',
    iconName: 'shopping-bag',
  },
  {
    id: 'zerotrace',
    name: 'ZeroTrace',
    tagline: 'High-Performance Developer PII & Secret Scrubbing Utility',
    description:
      'A zero-dependency Python command-line utility and regex engine that proactively intercepts, audits, and redacts sensitive credentials, JWT tokens, AWS/GCP keys, and Personally Identifiable Information (PII) from logs and git commit diffs.',
    fullDetails: [
      'Compiles optimized deterministic finite automata (DFA) patterns to sanitize gigabyte-scale application logs in seconds.',
      'Includes Git pre-commit hook mode to prevent accidental secret leakage before pushes to public repositories.',
      'Exports sanitized structured audit summaries with masked SHA-256 validation fingerprints.',
    ],
    technologies: ['Python 3', 'CLI Architecture', 'Regex Engine', 'Cryptography', 'Argparse'],
    category: 'AI & Python',
    status: 'In Development',
    githubUrl: 'https://github.com/niteshh0x0/zerotrace',
    highlightMetric: '30+ credential patterns recognized',
    iconName: 'shield-check',
  },
  {
    id: 'iot-railway-detection',
    name: 'IoT Railway Track Fault & Obstacle Detection',
    tagline: 'Real-time Autonomous Micro-Fissure & Track Safety Telemetry',
    description:
      'An embedded IoT robotics prototype utilizing ultrasonic distance sensors, vibration sensors, and GPS telemetry on an autonomous track rover to detect railway line fractures and send emergency alerts over MQTT.',
    fullDetails: [
      'Employed ESP32 micro-controller with ultrasonic range finders to continuously measure track gauge uniformity and obstacle clearance.',
      'Transmits real-time latitude, longitude, and anomaly severity alerts over MQTT protocol to cloud telemetry dashboard.',
      'Built fail-safe emergency buzzer and automatic braking servo logic when obstacle distance drops below 1.5 meters.',
    ],
    technologies: ['ESP32', 'MicroPython', 'C++', 'MQTT Protocol', 'GPS Telemetry', 'Sensors'],
    category: 'IoT & Hardware',
    status: 'Prototype',
    githubUrl: 'https://github.com/niteshh0x0/iot-railway-detection',
    highlightMetric: 'Hardware Prototype Tested & Verified',
    iconName: 'cpu',
  },
  {
    id: 'arduino-project',
    name: 'Arduino Project',
    tagline: 'Physical Computing & Embedded Hardware Architecture',
    description:
      'An embedded physical computing project based on the ATmega328P microcontroller, featuring sensor telemetry, digital/analog signal interfacing, PWM actuator modulation, and regulated 5V power circuitry.',
    fullDetails: [
      'Architected embedded hardware firmware and circuit layout using the ATmega328P 16MHz AVR microcontroller.',
      'Implemented analog-to-digital telemetry acquisition, serial UART communication, and pulse-width modulation for peripheral control.',
      'Configured stable 5V and 3.3V DC power distribution with onboard linear voltage regulation and passive decoupling filters.',
    ],
    technologies: ['C++', 'Arduino IDE', 'ATmega328P', 'Embedded Systems', 'Circuit Design', 'UART / I2C'],
    category: 'IoT & Hardware',
    status: 'Completed',
    githubUrl: 'https://github.com/techbyniteshh',
    highlightMetric: 'Embedded Hardware Architecture',
    iconName: 'cpu',
  },
];

export const ARTICLES_DATA: TechnicalArticle[] = [
  {
    id: 'art-1',
    title: 'Building Resilient IoT Sensor Telemetry with ESP32 & MQTT',
    readTime: '6 min read',
    category: 'IoT & Hardware',
    date: 'February 2026',
    excerpt:
      'A practical guide to handling flaky network drops, implementing local buffer queuing, and reconnecting MQTT clients on low-power ESP32 microcontrollers.',
  },
  {
    id: 'art-2',
    title: 'How I Scaled PYQVerse to Handle Peak University Exam Week Traffic',
    readTime: '8 min read',
    category: 'Full-Stack',
    date: 'January 2026',
    excerpt:
      'Lessons learned indexing search queries in MongoDB, caching popular PDF payloads, and trimming client-side bundle sizes for 2,000+ simultaneous students.',
  },
  {
    id: 'art-3',
    title: 'Zero-Knowledge PII Sanitization: Masking Credentials with Python Regex',
    readTime: '5 min read',
    category: 'Python & Security',
    date: 'November 2025',
    excerpt:
      'Designing deterministic multi-pattern regex parsers to strip AWS tokens, private keys, and user emails before committing logs to centralized clouds.',
  },
];
