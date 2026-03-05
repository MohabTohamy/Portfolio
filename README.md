# Mohab Tohamy's Engineering Portfolio

A high-end interactive engineering portfolio website showcasing work in infrastructure engineering, GIS, automation, and modern web development. **Focused on opportunities with Austrian companies.**

## 🇦🇹 Austria Focus

This portfolio is specifically tailored for Austrian engineering and technology companies. It highlights:
- Software engineering expertise relevant to Austrian infrastructure projects
- Experience with GIS and mapping technologies
- Data automation and analysis capabilities
- Full-stack web development skills
- Passion for Austrian innovation culture and engineering excellence

## 🚀 Features

### Core Pages

- **Home** - Hero section with animated background and feature highlights
- **Projects** - Interactive project gallery with category filtering
- **Engineering Tools** - Live interactive tools for engineering calculations
- **Map Demo** - GIS visualization with layer control and data filtering
- **Dashboard** - Analytics dashboard with charts and statistics
- **3D Lab** - Three.js visualizations including pavement structure
- **About** - Experience timeline and technical skills
- **Contact** - Contact form and social links

### Interactive Features

#### Engineering Tools
- **Excel Row Splitter** - Split lengths into equal segments
- **Row Repeater** - Repeat data rows specified times
- **Coordinate Calculator** - Calculate distance between GPS coordinates

#### Map Demo
- Interactive SVG-based map visualization
- Layer toggle controls (roads, friction points, cracks, deflections)
- Friction range filtering
- Click to view detailed information
- Survey simulation animation control

#### Dashboard
- Real-time statistics cards
- Friction distribution chart
- Crack density histogram
- Survey coverage timeline
- Data quality indicators

#### 3D Lab
- Interactive rotating cube with orbit controls
- 3D pavement structure visualization
- Layer-by-layer analysis

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **3D Graphics:** Three.js with React Three Fiber
- **Charts:** Recharts
- **Icons:** Lucide React

## 📦 Installation

```bash
cd engineering-portfolio
npm install
```

## 🎨 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
engineering-portfolio/
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── projects/
│   │   └── page.tsx            # Projects page with filtering
│   ├── tools/
│   │   └── page.tsx            # Interactive engineering tools
│   ├── map-demo/
│   │   └── page.tsx            # GIS map visualization
│   ├── dashboard/
│   │   └── page.tsx            # Analytics dashboard
│   ├── three-lab/
│   │   └── page.tsx            # 3D visualizations
│   └── contact/
│       └── page.tsx            # Contact form
├── components/
│   ├── Navigation.tsx          # Main navigation bar
│   └── UI.tsx                  # Reusable UI components
├── data/
│   ├── projects.ts             # Project data
│   ├── experience.ts           # Experience and skills data
│   └── mapData.ts              # GIS and survey data
├── lib/
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## 🎯 Key Technologies Demonstrated

### Infrastructure Engineering
- LCMS (Laser Crack Measurement System)
- CFT (Continuous Friction Tester)
- FWD/HWD (Falling/Heavy Weight Deflectometer)
- GPR (Ground Penetrating Radar)

### Software Development
- React and Next.js
- TypeScript
- Python automation
- GIS and spatial analysis
- Data visualization
- 3D graphics

## 🎨 Design System

### Colors
- **Primary:** `#2563EB` (Blue)
- **Accent:** `#06B6D4` (Cyan)
- **Background:** `#0F172A` (Dark Navy)
- **Card:** `#1E293B` (Slate)
- **Text:** `#E2E8F0` (Light Gray)

### Features
- Glassmorphism effects
- Smooth animations
- Responsive design
- Custom scrollbar
- Gradient accents

## 📝 Customization

### Update Personal Information

Edit contact details in `app/contact/page.tsx`:

```typescript
// Update email, GitHub, LinkedIn URLs
```

### Add Projects

Add new projects in `data/projects.ts`:

```typescript
export const projects: Project[] = [
  {
    id: 'your-project',
    title: 'Your Project Title',
    description: 'Short description',
    longDescription: 'Detailed description',
    technologies: ['Tech1', 'Tech2'],
    category: 'Frontend', // or GIS, Automation, Engineering, Python
    image: '/path/to/image.jpg',
    github: 'https://github.com/...',
    demo: 'https://demo-url.com',
    featured: true,
  },
  // ... more projects
];
```

### Update Experience

Modify `data/experience.ts` to update your work history and skills.

### Customize Map Data

Edit `data/mapData.ts` to add your own GIS data, coordinates, and survey points.

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1023px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔮 Future Enhancements

- [ ] Real map integration with Mapbox GL JS
- [ ] Backend API for form submissions
- [ ] Dark/Light mode toggle
- [ ] Blog section for technical articles
- [ ] Advanced 3D engineering simulations
- [ ] Real-time data integration
- [ ] AI assistant chatbot

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Mohab Tohamy**
- Software Engineer
- Seeking opportunities in Austria 🇦🇹
- Email: mohab@example.com
- GitHub: [@mohab](https://github.com/mohab)
- LinkedIn: [mohab](https://linkedin.com/in/mohab)

---

Built with ❤️ by Mohab Tohamy using Next.js, TypeScript, and modern web technologies.
