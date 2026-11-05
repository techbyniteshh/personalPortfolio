import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactForm,
  escapeHtml,
  buildUpiPaymentUri,
  filterProjects,
} from './portfolio-logic.ts';
import type { Project } from '../types/portfolio.ts';

test('validateContactForm checks required fields correctly', () => {
  // Empty data should fail
  const emptyResult = validateContactForm({});
  assert.equal(emptyResult.isValid, false);
  assert.ok(emptyResult.errors.fullName);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.subject);
  assert.ok(emptyResult.errors.category);
  assert.ok(emptyResult.errors.message);
  assert.ok(emptyResult.errors.consent);

  // Valid submission
  const validResult = validateContactForm({
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    category: 'Freelance Project',
    subject: 'Web App Consultation',
    message: 'Hello Nitesh, we would love to collaborate on a new project.',
    consent: true,
  });
  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);

  // Honeypot detection
  const honeypotResult = validateContactForm({
    fullName: 'Spam Bot',
    email: 'bot@spam.com',
    category: 'Other',
    subject: 'Spam subject',
    message: 'This is an automated spam message payload.',
    consent: true,
    websiteHoneypot: 'https://evil-bot.com',
  });
  assert.equal(honeypotResult.isValid, false);
  assert.ok(honeypotResult.errors.bot);
});

test('escapeHtml prevents XSS injection strings', () => {
  const unsafe = '<script>alert("hacked")</script>&"\'';
  const safe = escapeHtml(unsafe);
  assert.equal(
    safe,
    '&lt;script&gt;alert(&quot;hacked&quot;)&lt;/script&gt;&amp;&quot;&#039;'
  );
});

test('buildUpiPaymentUri formats valid UPI deep links', () => {
  const uriWithoutAmount = buildUpiPaymentUri({
    upiId: 'nitesh@okaxis',
    payeeName: 'Nitesh Chaurasiya',
  });
  assert.ok(uriWithoutAmount.startsWith('upi://pay?'));
  assert.ok(uriWithoutAmount.includes('pa=nitesh%40okaxis'));
  assert.ok(uriWithoutAmount.includes('pn=Nitesh%20Chaurasiya'));
  assert.ok(uriWithoutAmount.includes('cu=INR'));
  assert.equal(uriWithoutAmount.includes('&am='), false);

  const uriWithAmount = buildUpiPaymentUri({
    upiId: 'nitesh@okaxis',
    payeeName: 'Nitesh Chaurasiya',
    amount: 101,
    note: 'Coffee Support',
  });
  assert.ok(uriWithAmount.includes('&am=101.00'));
  assert.ok(uriWithAmount.includes('tn=Coffee%20Support'));
});

test('filterProjects correctly filters by category and keyword search', () => {
  const sampleProjects: Project[] = [
    {
      id: 'p1',
      name: 'PYQVerse',
      tagline: 'Study resource portal',
      description: 'University exam paper sharing platform',
      technologies: ['React', 'Node.js', 'MongoDB'],
      category: 'Full-Stack',
      status: 'Live & Active',
      iconName: 'book',
    },
    {
      id: 'p2',
      name: 'ZeroTrace',
      tagline: 'Log auditor',
      description: 'Python security CLI for scrubbing logs',
      technologies: ['Python', 'CLI', 'Regex'],
      category: 'AI & Python',
      status: 'In Development',
      iconName: 'shield',
    },
    {
      id: 'p3',
      name: 'IoT Railway Sensor',
      tagline: 'Hardware detector',
      description: 'ESP32 sensor telemetry for railway tracks',
      technologies: ['ESP32', 'C++', 'MQTT'],
      category: 'IoT & Hardware',
      status: 'Prototype',
      iconName: 'cpu',
    },
  ];

  // Category filtering
  const fullStackOnly = filterProjects(sampleProjects, 'Full-Stack');
  assert.equal(fullStackOnly.length, 1);
  assert.equal(fullStackOnly[0].name, 'PYQVerse');

  // Search keyword filtering
  const pythonSearch = filterProjects(sampleProjects, 'All', 'Python');
  assert.equal(pythonSearch.length, 1);
  assert.equal(pythonSearch[0].name, 'ZeroTrace');

  const espSearch = filterProjects(sampleProjects, 'All', 'mqtt');
  assert.equal(espSearch.length, 1);
  assert.equal(espSearch[0].name, 'IoT Railway Sensor');
});
