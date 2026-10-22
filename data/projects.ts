// The work page, in the order it is read. Each entry is a short case study: what it is,
// then the few problems worth explaining. Ministry work is described in words only —
// no screenshots, no data, no links.

export interface CaseStudyPoint {
    title: string;
    body: string;
}

export interface Project {
    id: string;
    title: string;
    kind: 'Live product' | 'Day job' | 'Tools' | 'Craft';
    /** One line for the home page. */
    tagline: string;
    /** One or two sentences at the top of the case study. */
    summary: string;
    role: string;
    points: CaseStudyPoint[];
    stack: string[];
    link?: { href: string; label: string };
}

export const projects: Project[] = [
    {
        id: 'clinix',
        title: 'Clinix',
        kind: 'Live product',
        tagline: 'Clinic system for private doctors in Egypt. Web and tablet app.',
        summary:
            'A clinic system for private doctors in Egypt. Clinics pay for it and run every consultation on it: the queue, the medical record, the prescription, the bill.',
        role: 'Mine end to end: product, design, web, API, database, tablet app, deployment and support.',
        points: [
            {
                title: 'One tap for the doctor',
                body: 'The doctor works from a tablet. One tap on the next patient opens the whole consultation: history, notes, diagnosis from 71,000 ICD-10 codes, and a prescription from a 25,000-medicine Egyptian formulary. Search understands the different ways people spell Arabic names.',
            },
            {
                title: 'Every clinic sees only its own patients',
                body: 'Many clinics share one database. Every clinical table carries the clinic’s key, and the data layer applies the filter, not each screen. Roles keep a receptionist out of clinical notes, and an audit log records every change and every patient file opened.',
            },
            {
                title: 'Patients book themselves',
                body: 'Each clinic gets a public booking page built from the doctor’s working hours. Patients prove their phone number with a one-time WhatsApp code, and a background job reminds them the day before.',
            },
            {
                title: 'Paper that looks like the clinic’s own',
                body: 'Prescriptions, receipts, medical reports and consent forms print on each clinic’s letterhead. A QR code on the prescription lets a pharmacist check it is real.',
            },
        ],
        stack: ['React 19', 'TypeScript', '.NET 10', 'PostgreSQL', 'Flutter', 'WhatsApp Cloud API', 'Cloudflare R2'],
        link: { href: 'https://www.zclinix.com', label: 'zclinix.com' },
    },
    {
        id: 'eterna',
        title: 'Eterna',
        kind: 'Live product',
        tagline: 'Beauty store for Egypt, in Arabic and English.',
        summary:
            'An online beauty store for the Egyptian market, in Arabic and English. Customers order from it every day; the owner runs the whole shop from its admin panel.',
        role: 'Mine end to end: storefront, admin panel, API, checkout, email, search and hosting.',
        points: [
            {
                title: 'Stock stays right when two people buy the last item',
                body: 'Stock is reserved when an order is placed, and the database rejects the second of two orders that race for the same item. Orders can only move through allowed steps, so an order cannot be shipped before it is confirmed.',
            },
            {
                title: 'Two languages, one store',
                body: 'Every page works in English and in right-to-left Arabic. Order confirmations and shipping emails go out in the customer’s language, from the brand’s own domain.',
            },
            {
                title: 'Audited before anyone else looked',
                body: 'I ran a ten-layer security review of the live stack and fixed what it found: rate limits that counted the proxy instead of the visitor, a login that leaked which emails exist through its timing, an open image proxy and unsigned uploads.',
            },
            {
                title: 'Found by Google and by AI search',
                body: 'Structured product data, a language tag on every page, a sitemap that updates itself, and instant notices to search engines when the catalogue changes. The store is indexed in Google and Bing.',
            },
        ],
        stack: ['Next.js 16', 'TypeScript', 'Tailwind', 'ASP.NET Core 9', 'PostgreSQL', 'Cloudinary', 'Resend'],
        link: { href: 'https://www.eternaeg.com', label: 'eternaeg.com' },
    },
    {
        id: 'saudi-tech',
        title: 'A national platform at Saudi-Tech',
        kind: 'Day job',
        tagline: 'Pavement and asset platform for a Saudi ministry.',
        summary:
            'Since May 2025 I have worked on the pavement and asset management platform of the Saudi Ministry of Municipalities and Housing, used by municipalities across the Kingdom. The work is confidential, so it is described here in words only.',
        role: 'Full-stack engineer: React and TypeScript on ASP.NET Core and SQL Server.',
        points: [
            {
                title: 'The map',
                body: 'Moved the map from MapLibre to the ArcGIS Maps SDK, with road-condition layers and 21 asset layers streamed from the API as they load.',
            },
            {
                title: 'A slow dashboard made fast',
                body: 'The asset summary took 36 to 48 seconds per call over about 4.6 million records. It now joins geography only when a filter needs it.',
            },
            {
                title: 'Whole modules, front to back',
                body: 'Work orders, with a creation wizard, contractor steps and attachment uploads. A help desk with background email through Microsoft 365. Executive dashboards.',
            },
            {
                title: 'Security and release',
                body: 'One place for anti-forgery checks, fixes to single sign-on, and permissions by role and by municipality in both the screens and the API. Feature flags let one build serve the ministry, staging and training servers.',
            },
            {
                title: 'Testing that runs every night',
                body: 'Black-box tests with Playwright and API probes check permissions, data isolation, dashboards, map layers and reports, and produce Word and Excel reports for the team each morning.',
            },
        ],
        stack: ['React', 'TypeScript', 'ASP.NET Core', 'SQL Server', 'ArcGIS Maps SDK', 'Hangfire', 'Playwright'],
    },
    {
        id: 'engineering-tools',
        title: 'Tools for engineers',
        kind: 'Tools',
        tagline: 'Programs that took manual work off survey and engineering teams.',
        summary:
            'Before and alongside the web work, I built many tools for survey and engineering teams. Most shipped as a single program engineers could run without installing anything.',
        role: 'Built on request from the teams that used them, then kept up as their needs changed.',
        points: [
            {
                title: 'Checking survey data',
                body: 'Read the raw output of road-survey machines, flagged records that could not be physically right, counted defects by type and severity, and merged large batches into clean files.',
            },
            {
                title: 'Auditing survey files',
                body: 'Scanned folders of survey files, worked out each file’s date and whether it was usable, and wrote an Excel report of what was where, so nobody started work on a broken file.',
            },
            {
                title: 'Reports that build themselves',
                body: 'The analysis team assembled a 13-sheet, 13-chart Excel report by hand every cycle. Now it is generated, along with Word reports from the same data.',
            },
            {
                title: 'Desktop software on autopilot',
                body: 'Drove data-entry software with an AI detection step, so field attributes were filled in by the program instead of typed in by hand.',
            },
        ],
        stack: ['Python', 'pandas', 'openpyxl', 'python-docx', 'PyInstaller'],
    },
    {
        id: '3d',
        title: '3D on the web',
        kind: 'Craft',
        tagline: 'Particles, shaders and physics in the browser.',
        summary:
            'Particle systems, custom shaders and physics, running in the browser. This is what I build when nobody is asking for anything.',
        role: 'Personal work.',
        points: [],
        stack: ['Three.js', 'React Three Fiber', 'GLSL', 'post-processing'],
        link: { href: '/three-lab', label: 'Open the 3D Lab' },
    },
];
