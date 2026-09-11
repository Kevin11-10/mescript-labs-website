# Mescript Labs Website - Design Plan

## Current State
- React + Vite project with basic structure
- Pages: Home, About, Portfolio, Contact
- Admin panel for JSON data editing
- Framer Motion animations
- Tailwind CSS styling
- Minimal dark theme (black/white)

## Design Direction
**Inspiration:** crimsofall.com - clean, minimal dark design with focus on content

**Target Audience:** Game development clients, 3D modeling commissions, app development projects

**Vibe:** Professional, modern, tech-focused, creative

## Design System

### Colors
**Current:** Pure black (#0a0a0a), white (#ffffff), gray (#a0a0a0)

**Suggested Enhancement:**
- Primary: #0a0a0a (background)
- Secondary: #1a1a1a (cards, sections)
- Accent: Consider adding a subtle accent color (cyan, purple, or gold)
- Text: #ffffff (headings), #a0a0a0 (body), #666666 (muted)

### Typography
- Headings: System fonts (San Francisco, Inter, Roboto)
- Body: System fonts
- Hierarchy: Clear distinction between h1, h2, h3

### Spacing
- Section padding: py-24 (6rem) or py-32 (8rem)
- Container: max-w-1200px with px-4
- Gap: gap-8 for grids, gap-4 for buttons

## Visual Assets Needed

### High Priority
1. **Hero Section Visual**
   - Options: Hero image, video background, 3D render, or gradient
   - Should represent 3D/gaming/tech
   - Full width or centered

2. **Portfolio Images**
   - Thumbnails for portfolio items
   - High-quality screenshots/renders
   - Consistent aspect ratio (16:9 recommended)

3. **Team Photos**
   - Professional headshots
   - Circular or square format
   - Consistent lighting/background

### Medium Priority
4. **Service Icons**
   - SVG icons for 3D modeling, game dev, app dev
   - Consistent style (outline or filled)
   - 64x64px or larger

5. **Background Patterns**
   - Subtle patterns for section backgrounds
   - Grid, dots, or geometric shapes
   - Low opacity to not distract

6. **Social Media Icons**
   - YouTube, Twitter, LinkedIn, etc.
   - Consistent with brand

## Page-by-Page Plan

### Home Page
**Hero Section:**
- Add visual element (image/video/gradient)
- Make text more impactful
- Consider adding a tagline or subtitle

**Services Section:**
- Add icons for each service
- Better card design with hover effects
- Consider adding "Learn More" links

**About Preview:**
- Add visual element (illustration or image)
- Make it more engaging

**Contact CTA:**
- Add visual element
- Make it stand out more

### Portfolio Page
**Grid Design:**
- Better card design with shadows/borders
- Image hover effects (zoom, overlay with info)
- Category filter with better styling
- Consider masonry layout for variety

**Item Display:**
- Add modal for details
- Show larger images/videos
- Add project details (date, client, tech stack)

### About Page
**Mission Section:**
- Add visual element (illustration or image)
- Make it more engaging

**Services Section:**
- Add icons
- Better visual hierarchy

**Values Section:**
- Add icons or checkmarks
- Better visual presentation

**Team Section:**
- Professional photos
- Social media links
- Better card design

### Contact Page
**Form Design:**
- Better input styling
- Add focus states
- Consider adding a visual element nearby

**Contact Info:**
- Add social media links with icons
- Consider adding email/phone if available

## Technical Notes

### Performance
- Optimize images (WebP format, lazy loading)
- Consider using image CDN
- Minimize bundle size

### Accessibility
- Ensure color contrast ratios
- Add alt text for images
- Keyboard navigation

### Responsive
- Test on mobile, tablet, desktop
- Ensure touch targets are large enough
- Optimize for different screen sizes

## Implementation Priority

### Phase 1 - Foundation
1. Define design system (colors, typography, spacing)
2. Gather/prepare visual assets
3. Update global CSS with design tokens

### Phase 2 - Core Pages
4. Redesign hero section
5. Enhance portfolio grid
6. Add visual elements to About page

### Phase 3 - Polish
7. Improve navigation
8. Add background patterns
9. Enhance Contact form
10. Add loading states

### Phase 4 - Optimization
11. Optimize images
12. Test responsiveness
13. Performance optimization
14. Accessibility audit

## File Structure
```
src/
├── assets/          # Images, icons, illustrations
├── components/
│   ├── Layout.jsx
│   └── [reusable components]
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Portfolio.jsx
│   └── Contact.jsx
├── contexts/
│   └── AppContext.jsx
├── index.css        # Global styles, design tokens
└── main.jsx
```

## Setup Instructions for Developer

1. Clone repo: `git clone https://github.com/Kevin11-10/mescript-labs-website.git`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Build for production: `npm run build`
5. Deploy to Netlify (already configured)

## Admin Panel
- Access at `/admin`
- Password protected
- Edit portfolio items and team data
- Changes saved to JSON files in `public/data/`

## Notes
- Keep the admin panel functional
- Preserve the JSON data structure
- Maintain the React Router setup
- Keep Framer Motion for animations
