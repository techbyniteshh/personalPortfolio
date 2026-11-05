export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  fullDetails?: string[];
  technologies: string[];
  category: 'Full-Stack' | 'AI & Python' | 'IoT & Hardware' | 'Developer Tools';
  status: 'Live & Active' | 'Completed' | 'Prototype' | 'In Development';
  liveUrl?: string;
  githubUrl?: string;
  highlightMetric?: string;
  iconName: string;
}

export interface SkillCategory {
  name: string;
  description: string;
  skills: {
    name: string;
    level: 'Core' | 'Proficient' | 'Exploring';
    icon?: string;
    tags?: string[];
  }[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  category: string;
  imageUrl: string;
  credentialUrl?: string;
  rotate?: number; // e.g. 90 degrees right
  description: string;
  skills: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  location: string;
  description: string;
  keyHighlights: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  badgeType: 'Hackathon' | 'Award' | 'Certification' | 'Community';
  imageUrl?: string;
  rotate?: number; // e.g. 90 degrees right
  link?: string;
}

export interface TechnicalArticle {
  id: string;
  title: string;
  readTime: string;
  category: string;
  excerpt: string;
  date: string;
  url?: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  preferredContact?: string;
  consent: boolean;
  websiteHoneypot?: string; // spam protection honeypot
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  confirmationSent?: boolean;
  ownerNotified?: boolean;
  error?: string;
  details?: Record<string, string>;
  debugInfo?: {
    mode: 'live_brevo' | 'smtp' | 'fallback_preview';
    timestamp: string;
    recipient: string;
  };
}
