import type { ContactFormData, Project } from '../types/portfolio.ts';

/**
 * Validates the contact form payload authoritatively
 */
export function validateContactForm(data: Partial<ContactFormData>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Honeypot check (must be empty)
  if (data.websiteHoneypot && data.websiteHoneypot.trim().length > 0) {
    errors.bot = 'Automated submission detected.';
    return { isValid: false, errors };
  }

  // Full Name validation
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  } else if (data.fullName.trim().length > 80) {
    errors.fullName = 'Name cannot exceed 80 characters.';
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  } else if (data.email.trim().length > 120) {
    errors.email = 'Email address cannot exceed 120 characters.';
  }

  // Category validation
  const validCategories = [
    'Freelance Project',
    'Collaboration',
    'Internship / Opportunity',
    'Technical Question',
    'Other',
  ];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.category = 'Please select a valid subject category.';
  }

  // Subject validation
  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  } else if (data.subject.trim().length > 150) {
    errors.subject = 'Subject cannot exceed 150 characters.';
  }

  // Message validation
  if (!data.message || data.message.trim().length < 15) {
    errors.message = 'Please provide a message with at least 15 characters.';
  } else if (data.message.trim().length > 3000) {
    errors.message = 'Message cannot exceed 3000 characters.';
  }

  // Consent validation
  if (!data.consent) {
    errors.consent = 'Please give consent to process your message.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Escapes HTML characters to prevent XSS in email bodies
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates valid UPI deep link URI with parameters
 */
export function buildUpiPaymentUri({
  upiId,
  payeeName,
  amount,
  note = 'Fuel Creativity - Nitesh Chaurasiya',
}: {
  upiId: string;
  payeeName: string;
  amount?: number;
  note?: string;
}): string {
  const sanitizedUpi = upiId.trim();
  const sanitizedName = payeeName.trim();
  const sanitizedNote = note.trim();

  let uri = `upi://pay?pa=${encodeURIComponent(sanitizedUpi)}&pn=${encodeURIComponent(sanitizedName)}&cu=INR&tn=${encodeURIComponent(sanitizedNote)}`;

  if (amount && amount > 0) {
    uri += `&am=${amount.toFixed(2)}`;
  }

  return uri;
}

/**
 * Filters projects by category and search keyword
 */
export function filterProjects(
  projects: Project[],
  selectedCategory: string,
  searchQuery = ''
): Project[] {
  const query = searchQuery.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;

    if (!matchesCategory) return false;

    if (!query) return true;

    return (
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(query))
    );
  });
}
