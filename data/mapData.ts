// Sample map data for infrastructure visualization

export interface RoadSegment {
    id: string;
    name: string;
    sectionCode: string;
    coordinates: [number, number][];
    friction: number;
    crackDensity: number;
    length: number;
}

export interface SurveyPoint {
    id: string;
    type: 'crack' | 'friction' | 'deflection';
    coordinates: [number, number];
    value: number;
    timestamp: string;
    sectionCode: string;
}

// Sample road segments (using approximate coordinates for demonstration)
export const roadSegments: RoadSegment[] = [
    {
        id: 'seg-001',
        name: 'Main Highway Section A',
        sectionCode: 'HWY-001-A',
        coordinates: [
            [31.2357, 30.0444],
            [31.2367, 30.0454],
            [31.2377, 30.0464],
            [31.2387, 30.0474],
        ],
        friction: 0.65,
        crackDensity: 2.3,
        length: 1200,
    },
    {
        id: 'seg-002',
        name: 'Main Highway Section B',
        sectionCode: 'HWY-001-B',
        coordinates: [
            [31.2387, 30.0474],
            [31.2397, 30.0484],
            [31.2407, 30.0494],
            [31.2417, 30.0504],
        ],
        friction: 0.58,
        crackDensity: 3.8,
        length: 1200,
    },
    {
        id: 'seg-003',
        name: 'Main Highway Section C',
        sectionCode: 'HWY-001-C',
        coordinates: [
            [31.2417, 30.0504],
            [31.2427, 30.0514],
            [31.2437, 30.0524],
            [31.2447, 30.0534],
        ],
        friction: 0.72,
        crackDensity: 1.5,
        length: 1200,
    },
    {
        id: 'seg-004',
        name: 'Service Road Section A',
        sectionCode: 'SRV-002-A',
        coordinates: [
            [31.2367, 30.0454],
            [31.2367, 30.0444],
            [31.2367, 30.0434],
            [31.2367, 30.0424],
        ],
        friction: 0.55,
        crackDensity: 4.2,
        length: 800,
    },
];

// Sample survey points
export const surveyPoints: SurveyPoint[] = [
    // Friction points
    { id: 'fric-001', type: 'friction', coordinates: [31.2357, 30.0444], value: 0.65, timestamp: '2024-03-01T10:00:00', sectionCode: 'HWY-001-A' },
    { id: 'fric-002', type: 'friction', coordinates: [31.2367, 30.0454], value: 0.63, timestamp: '2024-03-01T10:01:00', sectionCode: 'HWY-001-A' },
    { id: 'fric-003', type: 'friction', coordinates: [31.2377, 30.0464], value: 0.68, timestamp: '2024-03-01T10:02:00', sectionCode: 'HWY-001-A' },
    { id: 'fric-004', type: 'friction', coordinates: [31.2387, 30.0474], value: 0.58, timestamp: '2024-03-01T10:03:00', sectionCode: 'HWY-001-B' },
    { id: 'fric-005', type: 'friction', coordinates: [31.2397, 30.0484], value: 0.56, timestamp: '2024-03-01T10:04:00', sectionCode: 'HWY-001-B' },
    { id: 'fric-006', type: 'friction', coordinates: [31.2407, 30.0494], value: 0.60, timestamp: '2024-03-01T10:05:00', sectionCode: 'HWY-001-B' },
    { id: 'fric-007', type: 'friction', coordinates: [31.2417, 30.0504], value: 0.72, timestamp: '2024-03-01T10:06:00', sectionCode: 'HWY-001-C' },
    { id: 'fric-008', type: 'friction', coordinates: [31.2427, 30.0514], value: 0.70, timestamp: '2024-03-01T10:07:00', sectionCode: 'HWY-001-C' },

    // Crack points
    { id: 'crack-001', type: 'crack', coordinates: [31.2360, 30.0447], value: 2.5, timestamp: '2024-03-01T11:00:00', sectionCode: 'HWY-001-A' },
    { id: 'crack-002', type: 'crack', coordinates: [31.2370, 30.0457], value: 2.1, timestamp: '2024-03-01T11:01:00', sectionCode: 'HWY-001-A' },
    { id: 'crack-003', type: 'crack', coordinates: [31.2390, 30.0477], value: 4.2, timestamp: '2024-03-01T11:02:00', sectionCode: 'HWY-001-B' },
    { id: 'crack-004', type: 'crack', coordinates: [31.2400, 30.0487], value: 3.5, timestamp: '2024-03-01T11:03:00', sectionCode: 'HWY-001-B' },
    { id: 'crack-005', type: 'crack', coordinates: [31.2420, 30.0507], value: 1.8, timestamp: '2024-03-01T11:04:00', sectionCode: 'HWY-001-C' },

    // Deflection points (FWD)
    { id: 'defl-001', type: 'deflection', coordinates: [31.2362, 30.0449], value: 450, timestamp: '2024-03-01T12:00:00', sectionCode: 'HWY-001-A' },
    { id: 'defl-002', type: 'deflection', coordinates: [31.2392, 30.0479], value: 580, timestamp: '2024-03-01T12:01:00', sectionCode: 'HWY-001-B' },
    { id: 'defl-003', type: 'deflection', coordinates: [31.2422, 30.0509], value: 380, timestamp: '2024-03-01T12:02:00', sectionCode: 'HWY-001-C' },
];

// Dashboard statistics
export interface DashboardStats {
    totalRoadLength: number;
    averageFriction: number;
    averageCrackDensity: number;
    sectionsAnalyzed: number;
}

export const dashboardStats: DashboardStats = {
    totalRoadLength: 4400, // meters
    averageFriction: 0.63,
    averageCrackDensity: 2.95,
    sectionsAnalyzed: 4,
};

// Friction distribution data for charts
export const frictionDistribution = [
    { range: '0.0-0.2', count: 0 },
    { range: '0.2-0.4', count: 2 },
    { range: '0.4-0.6', count: 15 },
    { range: '0.6-0.8', count: 28 },
    { range: '0.8-1.0', count: 3 },
];

// Crack density histogram data
export const crackDensityData = [
    { density: '0-1', count: 5 },
    { density: '1-2', count: 8 },
    { density: '2-3', count: 12 },
    { density: '3-4', count: 7 },
    { density: '4+', count: 4 },
];

// Coverage data
export const coverageData = [
    { month: 'Jan', length: 3200 },
    { month: 'Feb', length: 4100 },
    { month: 'Mar', length: 4400 },
    { month: 'Apr', length: 5200 },
    { month: 'May', length: 6100 },
    { month: 'Jun', length: 7300 },
];
