// Experience timeline data

export interface Experience {
    id: string;
    title: string;
    company: string;
    period: string;
    description: string;
    technologies: string[];
    achievements: string[];
}

export const experiences: Experience[] = [
    {
        id: 'saudi-tech',
        title: 'Software Engineer (Full-Stack)',
        company: 'Saudi-Tech — Riyadh, Saudi Arabia',
        period: 'May 2025 – Present',
        description: 'PMMS — the national pavement and asset management platform for the Ministry of Municipalities and Housing, rolling out across the amanat of the Kingdom. Full-stack: React and TypeScript on ASP.NET Core and SQL Server.',
        technologies: ['React', 'TypeScript', 'ASP.NET Core', 'C#', 'SQL Server', 'ArcGIS Maps SDK', 'Hangfire', 'Playwright', 'Python'],
        achievements: [
            'Migrated the interactive map from MapLibre to the ArcGIS (Esri) Maps SDK: pavement condition layers (PCI, IRI, FWD, GPR) and 21 asset layers streamed from the API over Server-Sent Events',
            'Cut the asset-summary dashboard query from 36–48 s per call by emitting geographic joins only when a filter needs them, over ~4.6M records',
            'Built the work-order module across both tiers — creation wizard, contractor lifecycle, attachments with live upload progress — and fixed a request storm with caching and bulk endpoints',
            'Delivered a help-desk module end to end, with background email through Hangfire and Microsoft 365',
            'Built executive dashboards and automated the analysis team’s 13-sheet, 13-chart Excel report',
            'Centralised anti-forgery handling, fixed SSO/OIDC issues, enforced role- and amana-scoped permissions in the UI and the API',
            'Introduced runtime feature flags so one build serves the ministry, staging and training servers',
            'Built nightly black-box QA with Playwright and API probes, producing Word and Excel reports',
        ],
    },
    {
        id: 'irri-vision',
        title: 'Front-End Developer (Remote)',
        company: 'IRRI Vision',
        period: 'Sep 2024 – Dec 2024',
        description: 'Developed frontend modules for an Electronic Medical Record (EMR) system, focusing on scheduling, dashboards, and reusable component architecture.',
        technologies: ['React', 'TypeScript', 'REST APIs', 'Tailwind CSS'],
        achievements: [
            'Built scheduling interfaces, dashboards, and calendar-based features for an EMR system',
            'Integrated third-party libraries and REST APIs into the frontend',
            'Focused on reusable components, clean UI structure, and responsive design',
        ],
    },
    {
        id: 'route-academy',
        title: 'Front-End Developer (Internship)',
        company: 'Route Academy — Cairo, Egypt',
        period: 'Mar 2024 – Aug 2024',
        description: 'Intensive frontend development internship building real React applications from scratch, covering the full modern JavaScript development workflow.',
        technologies: ['React', 'JavaScript', 'HTML5', 'CSS3', 'REST APIs'],
        achievements: [
            'Built multiple React applications including a complete e-commerce platform',
            'Implemented authentication flows, CRUD operations, and API integrations',
            'Practiced component-based architecture, debugging, and modern JS development patterns',
        ],
    },
];

export interface Skill {
    name: string;
    level: number; // 0-100
    category: 'Frontend' | 'Backend' | 'Engineering' | 'Tools';
}

export const skills: Skill[] = [
    // Frontend
    { name: 'React.js', level: 88, category: 'Frontend' },
    { name: 'TypeScript', level: 82, category: 'Frontend' },
    { name: 'Next.js', level: 80, category: 'Frontend' },
    { name: 'Three.js / React Three Fiber', level: 80, category: 'Frontend' },
    { name: 'Tailwind CSS', level: 90, category: 'Frontend' },

    // Backend & Data
    { name: 'ASP.NET Core / C#', level: 65, category: 'Backend' },
    { name: 'Python', level: 85, category: 'Backend' },
    { name: 'REST APIs', level: 85, category: 'Backend' },
    { name: 'SQL Server / PostgreSQL', level: 65, category: 'Backend' },

    // Automation
    { name: 'Python Automation & EXE Tools', level: 88, category: 'Engineering' },
    { name: 'Data Processing', level: 85, category: 'Engineering' },
    { name: 'GIS & Map Visualization', level: 75, category: 'Engineering' },

    // Tools
    { name: 'AI agents (Claude Code)', level: 90, category: 'Tools' },
    { name: 'Flutter', level: 60, category: 'Frontend' },
    { name: 'Git & GitHub', level: 85, category: 'Tools' },
    { name: 'IIS Deployment', level: 75, category: 'Tools' },
    { name: 'VS Code / Visual Studio', level: 90, category: 'Tools' },
];
