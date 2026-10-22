// Jobs for the about page, newest first. One line each — the detail lives on the work page.

export interface Experience {
    id: string;
    title: string;
    company: string;
    period: string;
    line: string;
}

export const experiences: Experience[] = [
    {
        id: 'saudi-tech',
        title: 'Software Engineer, full-stack',
        company: 'Saudi-Tech, Riyadh',
        period: 'May 2025 – now',
        line: 'A national pavement and asset platform for the Ministry of Municipalities and Housing. Maps, work orders, help desk, dashboards, security and nightly QA.',
    },
    {
        id: 'irri-vision',
        title: 'Front-end Developer, remote',
        company: 'IRRI Vision',
        period: 'Sep – Dec 2024',
        line: 'Scheduling screens and dashboards for an electronic medical records system.',
    },
    {
        id: 'route-academy',
        title: 'Front-end Developer, intern',
        company: 'Route Academy, Cairo',
        period: 'Mar – Aug 2024',
        line: 'React applications from scratch, including a full e-commerce site.',
    },
];

// What I use, grouped by what it is for. No percentages.
export const stack: { use: string; tools: string[] }[] = [
    { use: 'Web apps', tools: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind', 'React Query'] },
    { use: 'APIs and data', tools: ['ASP.NET Core', 'C#', 'EF Core', 'PostgreSQL', 'SQL Server', 'Hangfire'] },
    { use: 'Maps', tools: ['ArcGIS Maps SDK', 'MapLibre', 'GeoJSON'] },
    { use: 'Mobile', tools: ['Flutter'] },
    { use: '3D', tools: ['Three.js', 'React Three Fiber', 'GLSL'] },
    { use: 'Shipping', tools: ['GitHub Actions', 'Vercel', 'Railway', 'Cloudflare', 'Docker', 'IIS'] },
    { use: 'Testing', tools: ['Playwright', 'xUnit', 'Testcontainers'] },
    { use: 'Automation', tools: ['Python', 'Claude Code', 'agent teams'] },
];
