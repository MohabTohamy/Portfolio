// Project data for portfolio

export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    technologies: string[];
    category: 'Frontend' | 'GIS' | 'Automation' | 'Engineering' | 'Python';
    image: string;
    github?: string;
    demo?: string;
    featured: boolean;
}

export const projects: Project[] = [
    {
        id: 'saudi-pavement-system',
        title: 'Saudi Arabia Pavement Management System',
        description: 'Developed a complete front-end system for a pavement and asset management platform used in Saudi Arabia. The platform includes advanced dashboards, interactive data visualizations, and modern UI architecture built with React. Focused on performance, usability, and scalable component design while integrating 3D visual elements for better data presentation.',
        longDescription: 'Comprehensive frontend engineering system for pavement and asset management in Saudi Arabia. Features include real-time data visualization, 3D visual elements, interactive dashboards, and advanced analytics tools. Demonstrates expertise in creating complex engineering platforms with modern web technologies and scalable architecture.',
        technologies: ['React', 'Next.js', 'TypeScript'],
        category: 'Frontend',
        image: '/projects/saudi-system.jpg',
        demo: 'https://pavement-system.vercel.app',
        featured: true,
    },
    {
        id: 'python-automation-tools',
        title: 'Engineering Data Automation Suite',
        description: 'Designed and built automation tools using Python to process engineering data and infrastructure datasets. These tools automate complex analysis workflows, reduce manual processing time, and improve accuracy for large pavement and asset datasets. Utilized Python libraries such as Pandas and NumPy to build efficient data pipelines.',
        longDescription: 'Comprehensive suite of Python automation tools for engineering data processing. Automates complex workflows including data analysis, statistical processing, report generation, and data visualization. Reduced processing time from hours to minutes while improving accuracy and consistency across large infrastructure datasets.',
        technologies: ['Python', 'Pandas', 'NumPy'],
        category: 'Automation',
        image: '/projects/automation-suite.jpg',
        github: 'https://github.com/mohab/automation-tools',
        featured: true,
    },
    {
        id: '3d-web-designs',
        title: 'Interactive 3D Web Experiences',
        description: 'Designing and developing modern web interfaces that integrate interactive 3D elements and immersive visual experiences. Building creative front-end designs using React and Three.js to deliver engaging and visually dynamic user interfaces.',
        longDescription: 'Portfolio of interactive 3D web designs showcasing advanced frontend skills. Includes particle systems, animated geometries, interactive environments, and immersive user experiences using Three.js, React Three Fiber, and modern web technologies.',
        technologies: ['React', 'Three.js', 'React Three Fiber'],
        category: 'Frontend',
        image: '/projects/3d-designs.jpg',
        demo: '/three-lab',
        featured: true,
    },
    {
        id: 'pavement-dashboard',
        title: 'Pavement Data Visualization Dashboard',
        description: 'Real-time dashboard for analyzing pavement condition data',
        longDescription: 'Interactive dashboard displaying friction values, crack density, and structural data. Features real-time filtering, chart visualization, and data export capabilities.',
        technologies: ['React', 'Next.js', 'Recharts', 'TypeScript', 'PostgreSQL'],
        category: 'Frontend',
        image: '/projects/dashboard.jpg',
        demo: 'https://pavement-dashboard.vercel.app',
        featured: true,
    },
    {
        id: 'gis-viewer',
        title: 'Infrastructure GIS Viewer',
        description: 'Interactive map for visualizing infrastructure survey data',
        longDescription: 'Web-based GIS platform with layer management, spatial queries, and data visualization. Supports multiple data formats and real-time updates.',
        technologies: ['React', 'MapboxGL', 'Next.js', 'TypeScript'],
        category: 'GIS',
        image: '/projects/gis-viewer.jpg',
        demo: 'https://infra-gis.vercel.app',
        featured: false,
    },
    {
        id: 'lcms-processor',
        title: 'LCMS Data Processor',
        description: 'Automated pipeline for Laser Crack Measurement System data',
        longDescription: 'Processes raw LCMS data, extracts crack patterns, calculates density metrics, and generates detailed reports with visualization.',
        technologies: ['Python', 'OpenCV', 'Pandas', 'SciPy'],
        category: 'Engineering',
        image: '/projects/lcms.jpg',
        github: 'https://github.com/mohab/lcms-processor',
        featured: false,
    },
    {
        id: 'fwd-analyzer',
        title: 'FWD Data Analysis Tool',
        description: 'Analysis tool for Falling Weight Deflectometer structural evaluation',
        longDescription: 'Calculates pavement layer moduli, performs backcalculation, and generates structural capacity reports based on FWD deflection data.',
        technologies: ['Python', 'NumPy', 'SciPy', 'Matplotlib'],
        category: 'Engineering',
        image: '/projects/fwd.jpg',
        featured: false,
    },
    {
        id: 'survey-automation',
        title: 'Survey Report Generator',
        description: 'Automated report generation from multiple survey data sources',
        longDescription: 'Consolidates data from LCMS, CFT, FWD, and GPR systems into comprehensive engineering reports with charts, maps, and analysis.',
        technologies: ['Python', 'Pandas', 'ReportLab', 'Jinja2'],
        category: 'Automation',
        image: '/projects/reports.jpg',
        github: 'https://github.com/mohab/survey-automation',
        featured: false,
    },
];

export const categories = ['All', 'Frontend', 'GIS', 'Automation', 'Engineering', 'Python'];
