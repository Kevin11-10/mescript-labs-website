# Mescript Labs Website

A modern, dark-themed website for Mescript Labs - a creative studio specializing in 3D modeling, game development, and app development.

## Tech Stack

- **Framework**: React with Vite
- **Routing**: React Router
- **State Management**: Context API
- **Deployment**: Netlify
- **Database**: Supabase
- **Payment Processing**: Creem.io

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/       # Reusable components
│   └── Layout.jsx   # Main layout with navigation and footer
├── contexts/        # Context providers
│   └── AppContext.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Portfolio.jsx
│   ├── Contact.jsx
│   ├── Admin.jsx
│   ├── AdminLogin.jsx
│   ├── Marketplace.jsx
│   ├── Sponsorships.jsx
│   ├── PrivacyPolicy.jsx
│   └── TermsOfService.jsx
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles

public/
└── data/            # JSON data files
    ├── portfolio.json
    └── team.json
```

## Features

- **Responsive Design**: Fully responsive layout optimized for all devices
- **Dark Mode Theme**: Cyber/tech-focused dark theme with high contrast
- **Portfolio Showcase**: Grid-based portfolio with category filtering
- **Admin Panel**: WordPress-style admin authentication system
- **Contact Form**: Email-based contact form
- **Hidden Pages**: Marketplace and Sponsorships pages (accessible via direct URL)

## Admin Access

- **Login URL**: `/admin/login`
- **Demo Credentials**: admin@mescriptlabs.com / admin123
- **Roles**: Owner, Admin, Editor

## Deployment

The site is configured for Netlify deployment. Connect your GitHub repository to Netlify for automatic deployments.

### Environment Variables

Configure the following environment variables in Netlify:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_CREEM_API_KEY`: Your Creem.io API key

## Data Management

Portfolio and team data are managed through JSON files in the `public/data/` directory. These can be edited directly or through the admin panel (when implemented).

## License

Copyright © 2024 Mescript Labs. All rights reserved.
