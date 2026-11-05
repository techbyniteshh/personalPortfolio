# TechByNiteshh — Personal Portfolio & Engineering Showcase

[![Website](https://img.shields.io/badge/Website-niteshhlive.xyz-orange?style=flat&logo=google-chrome)](https://niteshhlive.xyz/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=flat&logo=three.js&logoColor=white)](https://threejs.org/)

> **Official portfolio of Nitesh Chaurasiya (TechByNiteshh)** — Student developer exploring Internet of Things (IoT), ESP32 embedded systems, Python automation, full-stack engineering, and cybersecurity.

---

## 🚀 Live Website
- **Production URL**: [https://niteshhlive.xyz/](https://niteshhlive.xyz/)
- **Target Branch**: `development` (Active engineering & feature work)

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: React 19, TypeScript, Vite 8, Tailwind CSS v4
- **3D Interactive Graphics**: Three.js procedural 8-part hardware core with real-time exploded view controls
- **Backend / API**: Node.js, Express, rate limiting, Brevo Transactional Email API with fallback preview mailer
- **Design System**: Soft Neumorphic aesthetic with responsive cinematic dark hero integration
- **SEO & Compliance**: Schema.org JSON-LD Structured Data, XML Sitemap, Open Graph, and Twitter Cards

---

## 📂 Project Structure

```
├── public/                 # Static assets (Favicons, robots.txt, sitemap.xml, OG images)
│   ├── assets/             # High-resolution hero background and previews
│   ├── favicon.svg         # SVG vector brand icon
│   ├── robots.txt          # Crawler indexing policies
│   └── sitemap.xml         # Canonical XML sitemap
├── src/
│   ├── components/         # Reusable UI widgets & 3D WebGL scenes
│   │   ├── ThreeHeroScene.tsx   # Interactive Three.js hardware core
│   │   ├── ResumeModal.tsx      # Printable student resume modal
│   │   ├── CertificateModal.tsx # Full-screen verified credential inspector
│   │   └── UpiQrCode.tsx        # Dynamic peer-to-peer UPI QR code
│   ├── sections/           # Modular page sections (Hero, About, Skills, Projects, etc.)
│   ├── config/             # Authoritative portfolio data & verified records
│   ├── utils/              # Tested logic (contact validator, UPI link builder, XSS escaping)
│   ├── types/              # Strict TypeScript definitions
│   ├── App.tsx             # Main application layout
│   └── index.css           # Custom neumorphic utilities & responsive hero media queries
├── server.ts               # Production-ready Express server with Vite middleware
├── package.json            # Package manifests & peer-dependency configurations
└── tsconfig.json           # Strict TypeScript configuration
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+ / v10+ / v11+

### 2. Clone & Branch Setup
```bash
git clone https://github.com/techbyniteshh/personalPortfolio.git
cd personalPortfolio
git checkout development
```

### 3. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` (or `http://localhost:5173` if running `npx vite`).

### 5. Run Automated Tests
```bash
npm run test
```

### 6. Build for Production
```bash
npm run build
npm run start
```

---

## 🔒 Security & Code Standards
- Zero hardcoded API keys or secrets in frontend bundles.
- Authoritative server-side contact form input sanitization and rate limiting.
- Automated tests covering RFC-compliant UPI payment URIs and XSS mitigation.

---

## 📄 Author
**Nitesh Chaurasiya**
- GitHub: [@niteshh0x0](https://github.com/niteshh0x0) / [@techbyniteshh](https://github.com/techbyniteshh)
- LinkedIn: [niteshh0x0](https://linkedin.com/in/niteshh0x0)
- X / Twitter: [@niteshh0x0](https://x.com/niteshh0x0)
- YouTube: [@niteshh0x0](https://youtube.com/@niteshh0x0)
- Email: [niteshh0x0@gmail.com](mailto:niteshh0x0@gmail.com)
