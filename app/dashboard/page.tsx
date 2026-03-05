'use client';

import { Section, SectionTitle, Card } from '@/components/UI';
import { TrendingUp, MapPin, Activity, Layers } from 'lucide-react';
import {
    dashboardStats,
    frictionDistribution,
    crackDensityData,
    coverageData,
} from '@/data/mapData';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
    return (
        <div className="min-h-screen py-16">
            <Section>
                <SectionTitle subtitle="Infrastructure data analytics and insights">
                    Analytics Dashboard
                </SectionTitle>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={<MapPin className="w-8 h-8" />}
                        title="Total Road Length"
                        value={`${dashboardStats.totalRoadLength.toLocaleString()} m`}
                        change="+12%"
                        color="primary"
                    />
                    <StatCard
                        icon={<Activity className="w-8 h-8" />}
                        title="Average Friction"
                        value={dashboardStats.averageFriction.toFixed(2)}
                        change="-3%"
                        color="accent"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-8 h-8" />}
                        title="Crack Density"
                        value={`${dashboardStats.averageCrackDensity.toFixed(1)} m/m²`}
                        change="+5%"
                        color="primary"
                    />
                    <StatCard
                        icon={<Layers className="w-8 h-8" />}
                        title="Sections Analyzed"
                        value={dashboardStats.sectionsAnalyzed.toString()}
                        change="+2"
                        color="accent"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Friction Distribution */}
                    <Card>
                        <h3 className="text-xl font-semibold text-foreground mb-6">
                            Friction Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={frictionDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="range" stroke="#E2E8F0" />
                                <YAxis stroke="#E2E8F0" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1E293B',
                                        border: '1px solid #2563EB',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar dataKey="count" fill="#2563EB" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Crack Density Histogram */}
                    <Card>
                        <h3 className="text-xl font-semibold text-foreground mb-6">
                            Crack Density Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={crackDensityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="density" stroke="#E2E8F0" />
                                <YAxis stroke="#E2E8F0" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1E293B',
                                        border: '1px solid #06B6D4',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Bar dataKey="count" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Coverage Over Time */}
                <Card className="mb-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                        Survey Coverage Over Time
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={coverageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#E2E8F0" />
                            <YAxis stroke="#E2E8F0" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1E293B',
                                    border: '1px solid #2563EB',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="length"
                                stroke="#2563EB"
                                strokeWidth={3}
                                dot={{ fill: '#2563EB', r: 6 }}
                                name="Road Length (m)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Data Summary */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <h4 className="text-sm font-medium text-foreground/70 mb-2">
                            Survey Technologies
                        </h4>
                        <ul className="space-y-2">
                            {['LCMS', 'CFT', 'FWD', 'GPR'].map((tech) => (
                                <li
                                    key={tech}
                                    className="flex items-center justify-between text-foreground"
                                >
                                    <span>{tech}</span>
                                    <span className="text-primary">✓</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card>
                        <h4 className="text-sm font-medium text-foreground/70 mb-2">
                            Data Quality
                        </h4>
                        <div className="space-y-3">
                            <QualityBar label="Completeness" value={95} />
                            <QualityBar label="Accuracy" value={92} />
                            <QualityBar label="Consistency" value={88} />
                        </div>
                    </Card>

                    <Card>
                        <h4 className="text-sm font-medium text-foreground/70 mb-2">
                            Recent Activity
                        </h4>
                        <div className="space-y-2 text-sm text-foreground/70">
                            <p>✓ CFT data processed</p>
                            <p>✓ LCMS analysis completed</p>
                            <p>✓ Reports generated</p>
                            <p>✓ Data exported</p>
                        </div>
                    </Card>
                </div>
            </Section>
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
    color: 'primary' | 'accent';
}

function StatCard({ icon, title, value, change, color }: StatCardProps) {
    const isPositive = change.startsWith('+');
    const colorClass = color === 'primary' ? 'text-primary' : 'text-accent';

    return (
        <Card hover={false}>
            <div className="flex items-start justify-between mb-4">
                <div className={colorClass}>{icon}</div>
                <span
                    className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'
                        }`}
                >
                    {change}
                </span>
            </div>
            <h3 className="text-sm text-foreground/70 mb-1">{title}</h3>
            <p className="text-3xl font-bold text-foreground">{value}</p>
        </Card>
    );
}

interface QualityBarProps {
    label: string;
    value: number;
}

function QualityBar({ label, value }: QualityBarProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">{label}</span>
                <span className="text-sm text-foreground/70">{value}%</span>
            </div>
            <div className="h-2 bg-card rounded-full overflow-hidden">
                <div
                    className="h-full bg-linear-to-r from-primary to-accent rounded-full"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
