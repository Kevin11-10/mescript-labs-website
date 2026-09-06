# Mescript Labs Website Description

## Technical Stack
- **Framework**: Next.js (App Router)
- **Routing**: Next.js App Router (file-based routing)
- **State Management**: Context API (best free option for Netlify deployment)
- **Deployment**: Netlify
- **Database**: Supabase (for transaction tracking and sponsor data)
- **Payment Processing**: Creem (handles all payment processing and asset hosting)
- **3D Rendering**: React Three Fiber / Three.js for 3D model embedding
- **Video Embedding**: YouTube embed support (including unlisted videos)
- **Image Hosting**: ImgBB integration for image embedding

## Design System
**Theme**: Dark mode, cyber/tech-focused, high contrast, sleek, and minimalist

**Color Palette**:
- Primary Background: Deep charcoal/matte black (#0B0C10 or #121212)
- Secondary Surface/Cards: Dark slate gray (#1F2833 or #1E1E1E)
- Accent Color 1 (Tech Neon): Neon cyan or electric emerald for primary buttons, highlights, and active states
- Accent Color 2: Warm amber/gold for special tags
- Text: Off-white (#E0E6ED) for primary text, muted gray (#C5C6C7) for secondary text

**Typography**: Clean sans-serif fonts (Inter, JetBrains Mono, or Roboto) for technical/developer feel

**Layout**: Fully responsive, fast-loading, grid-based layout with subtle hover animations and glassmorphism card effects optimized for all browser types (PC and mobile)

## Site Structure
The website will have 4 main pages:
1. Home
2. About (separate page)
3. Portfolio
4. Sponsorships (initially hidden/inaccessible until ready)
5. Marketplace (initially hidden/inaccessible until ready)

**Navigation Menu**: Main, About, Portfolio, Contact
**Hidden Pages**: Marketplace, Sponsorships (accessible only via direct URL or when enabled)

---

## Home Page

### Hero Section
- Text-based hero section (background video/image to be discussed later)
- Main headline and call-to-action

### Services Section
- Internal services: 3D Modeling, Game Development, App Development
- These services are tracked internally but not visible to the public

### About Section
- Brief studio description/mission statement
- Team information section managed via JSON file
- Team data includes: name, role, bio, social links, photo URL

### Contact Section
- Contact form for user inquiries
- Form fields: Name, Email, Subject (dropdown: Commission, Complaint, Fan Mail, Suggestion), Message
- Form submissions sent to mescriptlabs@gmail.com (will switch to domain email after purchasing domain)
- Email delivery only (no Supabase storage for contact submissions)
- Form validation: Standard email validation and required field checks
- Additional contact methods: YouTube channel (https://www.youtube.com/@MescriptLabs)

---

## Portfolio Page

### Purpose
Showcase studio works with media streamed from external URLs (YouTube, Imgur, Vimeo, etc.)

### Display Structure
- Grid template layout
- Works grouped by media type (images/videos) and project categories
- Categories include:
  - Props and Low Poly Assets
  - Scenes and Environments
  - Games and Apps
  - Product Renders
  - Archiviz Renders

### User Interaction
- Media requires click to play (to save user bandwidth)
- Category filtering available
- Only categories with assigned media are displayed (no empty categories)

### Work Details
- Clicking a portfolio item opens a modal with further details
- Image thumbnails with detailed information on click

### Data Management
- JSON file stored in repository for tracking and assigning media
- JSON structure includes:
  - Title of the work
  - Description
  - Category
  - URL
  - Thumbnail URL
  - Date (optional)
  - Client name (optional)

---

## Marketplace Page

### Purpose
Sell studio assets, apps, software, addons, scripts, etc.

### Payment Integration
- Creem handles all payment processing
- No sign-up required for users
- Creem manages payment methods and transactions

### Product Display
- Card-based grid layout
- Cards open to detailed product pages when selected
- Product categories: 3D Models, Scripts and Addons

### Asset Delivery
- Creem handles asset hosting and delivery
- Assets uploaded to Creem platform
- No manual GitHub repository management needed

### Product Management
- Products managed entirely via Creem dashboard
- Creem handles: product creation, pricing, inventory, payment processing, tax compliance, license keys
- No JSON file needed for products (Creem manages everything)
- Website displays products via Creem API or storefront integration

### Transaction Tracking
- Supabase database tracks all financial data
- Transactions updated immediately after completion
- Optional Discord bot integration for team transparency
- Transaction flow: Payment → Supabase DB → Discord Bot (optional)

**Note**: Marketplace page will be initially hidden/inaccessible until fully developed

---

## Sponsorships Page

### Purpose
Allow community supporters to donate and companies to partner/sponsor the studio

### Sponsorship Types
- Goal-based sponsorships (with progress bars)
- One-time donations

### Payment Processing
- Creem handles all payment processing (only payment method)

### Sponsorship Benefits
- Different sponsorship tiers with varying benefits
- **Individual Sponsorship Tiers** (for community supporters only):
  - **Bronze** ($5-10): Basic support tier
  - **Silver** ($25-50): Mid-tier with discounts
  - **Gold** ($100-250): High-tier with perks
  - **Platinum** ($500+): Premium tier with maximum benefits
  - **Diamond** ($1000+): Elite tier with exclusive benefits
- Benefits include:
  - Discounts on products
  - Early access to new releases
  - Recognition through testimonials
  - Cameos in products, games, or movies
  - Behind-the-scenes content access

### Goal-Based Sponsorships
- Fund specific studio aspects (domain name, new app development, company emails, etc.)
- Progress bars show funding status
- Examples: $20 USDT for domain name, $50 USDT for company emails

### One-Time Donations
- "Buy me a coffee" style donations
- General support for the team

### Data Management
- Supabase database tracks all transactions with unique IDs
- Goal-based donations update milestone progress bars
- All transactions registered in database

### Discord Bot (Future Implementation)
- Internal team server bot for work coordination and transparency
- Displays goal-based donations and transactions to team
- Not for public user interaction
- Implementation timeline: to be determined later

**Note**: Progress bar implementation being reconsidered based on Creem sponsorship capabilities

---

**Note**: Marketplace page will be initially hidden/inaccessible until fully developed

---

## Database Schema (Supabase)

### Tables to be created:
1. **transactions**
   - id (UUID, primary key)
   - transaction_id (string, unique)
   - amount (decimal)
   - currency (string)
   - type (string: 'goal_donation', 'one_time_donation', 'marketplace_purchase')
   - status (string)
   - timestamp (timestamp)
   - user_info (jsonb, optional)
   - metadata (jsonb)

2. **sponsorship_goals**
   - id (UUID, primary key)
   - title (string)
   - description (text)
   - target_amount (decimal)
   - current_amount (decimal)
   - currency (string)
   - status (string: 'active', 'completed', 'cancelled')
   - created_at (timestamp)
   - deadline (timestamp, optional)

3. **users** (for admin panel)
   - id (UUID, primary key)
   - email (string, unique)
   - password_hash (string)
   - role (string: 'owner', 'admin', 'editor')
   - created_at (timestamp)
   - last_login (timestamp)
   - is_active (boolean)

4. **contact_submissions**
   - REMOVED: Contact form submissions sent via email only, not stored in Supabase

---

## Development Notes

### Current Status
- Planning and refinement phase
- No code implementation yet
- Marketplace and Sponsorships pages to be developed later (hidden initially)

### Implementation Priorities
1. **Phase 1 - Core Infrastructure**:
   - Set up Next.js project with App Router
   - Configure file-based routing
   - Set up Supabase database and authentication
   - Create basic layout and navigation
   - Implement WordPress-style admin authentication system
   - Install and configure React Three Fiber for 3D rendering
   - Set up YouTube embed component
   - Configure ImgBB image integration

2. **Phase 2 - Main Pages**:
   - Build Home page with hero, services, about sections
   - Create separate About page
   - Build Portfolio page with JSON data structure
   - Implement contact form with email delivery
   - Add 3D model viewer component
   - Add YouTube video embed component
   - Add ImgBB image gallery component

3. **Phase 3 - Admin Panel**:
   - Build admin dashboard
   - Create JSON editing interfaces
   - Implement user management (Owner/Admin/Editor roles)
   - Add transaction monitoring
   - Add 3D model upload/management
   - Add YouTube video URL management
   - Add ImgBB image URL management

4. **Phase 4 - Hidden Pages**:
   - Build Sponsorships page (hidden initially)
   - Implement progress bars for goal-based sponsorships
   - Build Marketplace page (hidden initially)
   - Integrate Creem API for payments

5. **Phase 5 - Advanced Features**:
   - Implement AI integration with Auth Intelligence
   - Set up GitHub API integration for automation
   - Configure backup system to private GitHub repo
   - Add AI safety protocols

### Known Assets & Information
- **Logo**: Available
- **Portfolio Items**: A few images/videos available (URLs to be provided)
- **Team Information**: Placeholder content initially (real info to be added later)
- **YouTube Channel**: https://www.youtube.com/@MescriptLabs
- **Contact Email**: mescriptlabs@gmail.com
- **GitHub Repo**: To be created by developer
- **Netlify Subdomain**: Default Netlify subdomain

### Next Steps
- Set up React project structure
- Configure Supabase database tables
- Integrate Creem API
- Create JSON data structures for portfolio and team
- Build authentication system
- Draft privacy policy and terms of service

---

## Security & Performance

### Security Measures
- Rate limiting: Implement basic rate limiting for contact form and API calls (to prevent abuse)
- CSRF protection: Implement CSRF protection for form submissions (security best practice)
- Environment variables: Use Netlify environment variables for API keys and secrets
- Password hashing: bcrypt for secure password storage

### Performance Optimization
- Image optimization: Automatic image optimization (using free tools like sharp or Next.js Image)
- Caching: Netlify's built-in CDN and edge caching (free tier)
- Code splitting: Implement React code splitting for faster initial load
- Lazy loading: Lazy load images and components

### Error Handling & Monitoring
- Error logging: Console logging with optional error tracking service (free tier options)
- No paid monitoring services initially (budget constraints)

---

## Backup Strategy

### Supabase Data Backup
- Automated backups to private GitHub repository
- Use GitHub Personal Access Token (PAT) for authentication
- Backup schedule: Daily automated backups
- Backup content: Database dumps and JSON files
- Repository: Private GitHub repo with restricted access

---

## Legal Pages

### Required Pages
- **Privacy Policy**: To be drafted later (required for data collection)
- **Terms of Service**: To be drafted later (required for website usage)
- Both pages will be added to site navigation
- Content to be created based on actual site functionality

### Cookie Usage
- Minimal cookie usage (only for essential functionality like authentication)
- Cookie consent banner if cookies are used for analytics
- Privacy-focused approach (no unnecessary tracking)

---

## Deployment Workflow

### Development Process
- Manual coding ("vibe coding")
- Code review by experienced developer before deployment
- Push to GitHub repository
- Automatic deployment via Netlify (connected to GitHub repo)

### Environment Management
- Netlify environment variables for:
  - Supabase credentials
  - Creem API keys
  - Auth Intelligence API keys
  - Other sensitive configuration

### Testing Strategy
- Manual testing by friends and coworkers
- No automated testing initially (budget/time constraints)
- Focus on core functionality testing

---

## Accessibility

### Target Standards
- Basic accessibility optimization
- Screen reader compatibility (where feasible)
- Keyboard navigation support
- Alt text for images
- Proper heading hierarchy
- Color contrast compliance (WCAG 2.1 AA where possible)

---

## Content Strategy

### Initial Content
- Limited initial portfolio items (few images and videos)
- Basic team information
- Placeholder content for development

### Content Updates
- All content updates through admin panel
- JSON-based content management
- No direct file editing required after initial setup

---

## Analytics & SEO

### Analytics
- Free analytics solution compatible with Netlify (Plausible or Netlify Analytics)
- Track page views, user sessions, and basic engagement metrics
- No Google Analytics (privacy-focused approach)

### SEO
- Meta tags for each page (title, description, keywords)
- Open Graph tags for social media sharing
- Structured data markup for better search visibility
- Sitemap.xml generation
- Robots.txt configuration
- Performance optimization for best possible Lighthouse scores

### Browser Support
- Primary: Latest Chrome, Firefox, Safari, Edge
- Mobile: iOS Safari, Chrome Mobile
- No IE11 support

---

## Footer

### Content
- Social media links (YouTube channel)
- Credits to sponsors and partners
- Copyright information
- Studio branding

### Social Links
- YouTube channel (currently blank, will upload content when work commences)
- Additional platforms to be determined

---

## Admin Panel & User System

### User Authentication
- Admin panel accessible via `/admin` route
- WordPress-style authentication system:
  - Login page with email/password
  - Session management with secure cookies
  - Password reset functionality
  - Remember me option
- User roles:
  - **Owner** (untouchable god account - yours alone): Full access including user management
  - **Admin**: Full access except cannot create/edit other admins or owner
  - **Editor**: Limited access to content editing only
- Only Owner can create/edit Admin accounts
- Admins can create/edit Editor accounts
- Password hashing for security
- Unauthorized access redirects to login page

### Admin Capabilities
- Edit JSON files directly from admin panel
- Manage portfolio items via JSON
- Update team information via JSON
- Monitor sponsorship goals and transactions
- AI integration for content automation (future feature)
- Note: Contact form submissions not stored in Supabase (email only)

### AI Integration
- Integration with Auth Intelligence (via API keys) for AI-powered content management
- AI model acts as intermediary to communicate with external APIs:
  - **GitHub API**: Automate pull requests, repository management, and site updates
  - **Creem.io API**: Manage products, transactions, and payment processing
- AI-assisted content generation and organization
- Automated portfolio categorization and tagging
- API-based integration for secure access to AI services
- Potential features:
  - AI-powered content suggestions
  - Automated metadata generation
  - Smart categorization algorithms
  - Behavioral analytics for user engagement
  - Automated GitHub pull requests for content updates
  - Automated Creem product management

### AI Safety Measures (Anti-Rogue Protocols)
- **Approval Workflow**: All automated actions require human approval before execution
- **Scope Restrictions**: API keys limited to specific endpoints and actions only
- **Rate Limiting**: Strict rate limits on AI-initiated API calls
- **Audit Logging**: All AI actions logged with timestamps and user attribution
- **Emergency Stop**: Kill switch to immediately halt all AI operations
- **Sandbox Environment**: AI operations isolated from production until approved
- **Review Queue**: Automated changes placed in review queue before deployment
- **Permission Boundaries**: AI cannot access sensitive data or perform destructive actions
- **Time-Based Restrictions**: AI operations limited to specific time windows
- **Multi-Factor Approval**: Critical actions require multiple admin approvals

---

## Hero Section

### Headline (Suggestion)
"Crafting Digital Experiences at the Intersection of 3D, Gaming, and Innovation"

### Call-to-Action
- Primary: "Explore Our Work" (links to Portfolio)
- Secondary: "Get in Touch" (links to Contact)

**Note**: Hero headline and CTA to be finalized based on studio branding preferences

---

## Media Embedding Capabilities

### 3D Model Embedding
- **Technology**: React Three Fiber / Three.js
- **Supported Formats**: .glb, .gltf, .obj (with appropriate loaders)
- **Features**:
  - Interactive 3D model viewer
  - Orbit controls (rotate, zoom, pan)
  - Auto-rotate option
  - Lighting controls
  - Model optimization for web
- **Use Cases**:
  - Portfolio item previews
  - Hero section 3D elements
  - Product showcases
  - Interactive demos

### YouTube Video Embedding
- **Support**: All YouTube videos including unlisted
- **Features**:
  - Responsive video player
  - Custom player controls
  - Lazy loading for performance
  - Autoplay options
  - Playlist support
- **Use Cases**:
  - Portfolio video showcases
  - Game trailers
  - Tutorial content
  - Behind-the-scenes footage

### ImgBB Image Embedding
- **Integration**: Direct ImgBB URL support
- **Features**:
  - Responsive image gallery
  - Lightbox/modal for full-size viewing
  - Image optimization
  - Lazy loading
  - Alt text support
- **Use Cases**:
  - Portfolio image galleries
  - Product screenshots
  - Team photos
  - Project thumbnails

### Media Management
- All media URLs managed via JSON files
- Admin panel for adding/editing media URLs
- Support for multiple media types per portfolio item
- Thumbnail generation for videos/3D models
