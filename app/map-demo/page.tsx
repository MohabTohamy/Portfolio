'use client';

import { useState } from 'react';
import { Section, SectionTitle, Card } from '@/components/UI';
import { Layers, FilterX, Play, Pause } from 'lucide-react';
import { roadSegments, surveyPoints } from '@/data/mapData';
import { getFrictionColor, getCrackDensityColor } from '@/lib/utils';

export default function MapDemoPage() {
    const [selectedLayer, setSelectedLayer] = useState<string[]>([
        'roads',
        'friction',
    ]);
    const [frictionRange, setFrictionRange] = useState<[number, number]>([0, 1]);
    const [selectedPoint, setSelectedPoint] = useState<{
        id?: string;
        name?: string;
        type?: string;
        sectionCode?: string;
        friction?: number;
        crackDensity?: number;
        value?: number;
    } | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleLayer = (layer: string) => {
        setSelectedLayer((prev) =>
            prev.includes(layer)
                ? prev.filter((l) => l !== layer)
                : [...prev, layer]
        );
    };

    const filteredPoints = surveyPoints.filter((point) => {
        if (point.type === 'friction') {
            return point.value >= frictionRange[0] && point.value <= frictionRange[1];
        }
        return true;
    });

    return (
        <div className="min-h-screen py-16">
            <Section>
                <SectionTitle subtitle="Interactive infrastructure data visualization">
                    GIS Map Demo
                </SectionTitle>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Map Controls */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Layer Control */}
                        <Card>
                            <div className="flex items-center gap-2 mb-4">
                                <Layers className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-foreground">
                                    Layers
                                </h3>
                            </div>

                            <div className="space-y-2">
                                {[
                                    { id: 'roads', label: 'Road Segments' },
                                    { id: 'friction', label: 'Friction Points' },
                                    { id: 'cracks', label: 'Crack Points' },
                                    { id: 'deflection', label: 'FWD Points' },
                                ].map((layer) => (
                                    <label
                                        key={layer.id}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedLayer.includes(layer.id)}
                                            onChange={() => toggleLayer(layer.id)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <span className="text-foreground text-sm">
                                            {layer.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </Card>

                        {/* Friction Filter */}
                        <Card>
                            <div className="flex items-center gap-2 mb-4">
                                <FilterX className="w-5 h-5 text-accent" />
                                <h3 className="text-lg font-semibold text-foreground">
                                    Filter
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-foreground/70 mb-2 block">
                                        Friction Range
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={frictionRange[0]}
                                            onChange={(e) =>
                                                setFrictionRange([
                                                    Number(e.target.value),
                                                    frictionRange[1],
                                                ])
                                            }
                                            className="flex-1"
                                        />
                                        <span className="text-sm text-foreground w-12">
                                            {frictionRange[0].toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={frictionRange[1]}
                                            onChange={(e) =>
                                                setFrictionRange([
                                                    frictionRange[0],
                                                    Number(e.target.value),
                                                ])
                                            }
                                            className="flex-1"
                                        />
                                        <span className="text-sm text-foreground w-12">
                                            {frictionRange[1].toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Animation Control */}
                        <Card>
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Animation
                            </h3>
                            <button
                                onClick={() => setIsAnimating(!isAnimating)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                            >
                                {isAnimating ? (
                                    <>
                                        <Pause className="w-4 h-4" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4" />
                                        Simulate Survey
                                    </>
                                )}
                            </button>
                        </Card>

                        {/* Legend */}
                        <Card>
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Legend
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded" />
                                    <span className="text-foreground/70">Good (≥0.7)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded" />
                                    <span className="text-foreground/70">Fair (0.5-0.7)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded" />
                                    <span className="text-foreground/70">Poor (&lt;0.5)</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Map Display */}
                    <div className="lg:col-span-3">
                        <Card className="h-[70vh] relative overflow-hidden">
                            {/* Map Placeholder with SVG visualization */}
                            <div className="w-full h-full bg-linear-to-br from-background to-card/50 relative">
                                <svg className="w-full h-full">
                                    {/* Road Segments */}
                                    {selectedLayer.includes('roads') &&
                                        roadSegments.map((segment) => {
                                            const points = segment.coordinates
                                                .map(
                                                    ([lon, lat]) =>
                                                        `${(lon - 31.23) * 5000 + 100},${(30.055 - lat) * 5000 + 100
                                                        }`
                                                )
                                                .join(' ');

                                            return (
                                                <polyline
                                                    key={segment.id}
                                                    points={points}
                                                    fill="none"
                                                    stroke={getFrictionColor(segment.friction)}
                                                    strokeWidth="6"
                                                    className="hover:stroke-white transition-colors cursor-pointer"
                                                    onClick={() => setSelectedPoint(segment)}
                                                />
                                            );
                                        })}

                                    {/* Friction Points */}
                                    {selectedLayer.includes('friction') &&
                                        filteredPoints
                                            .filter((p) => p.type === 'friction')
                                            .map((point) => (
                                                <circle
                                                    key={point.id}
                                                    cx={(point.coordinates[0] - 31.23) * 5000 + 100}
                                                    cy={(30.055 - point.coordinates[1]) * 5000 + 100}
                                                    r="8"
                                                    fill={getFrictionColor(point.value)}
                                                    className="hover:r-12 transition-all cursor-pointer"
                                                    onClick={() => setSelectedPoint(point)}
                                                />
                                            ))}

                                    {/* Crack Points */}
                                    {selectedLayer.includes('cracks') &&
                                        surveyPoints
                                            .filter((p) => p.type === 'crack')
                                            .map((point) => (
                                                <rect
                                                    key={point.id}
                                                    x={(point.coordinates[0] - 31.23) * 5000 + 95}
                                                    y={(30.055 - point.coordinates[1]) * 5000 + 95}
                                                    width="10"
                                                    height="10"
                                                    fill={getCrackDensityColor(point.value)}
                                                    className="hover:opacity-75 transition-opacity cursor-pointer"
                                                    onClick={() => setSelectedPoint(point)}
                                                />
                                            ))}

                                    {/* Deflection Points */}
                                    {selectedLayer.includes('deflection') &&
                                        surveyPoints
                                            .filter((p) => p.type === 'deflection')
                                            .map((point) => (
                                                <polygon
                                                    key={point.id}
                                                    points={`${(point.coordinates[0] - 31.23) * 5000 + 100
                                                        },${(30.055 - point.coordinates[1]) * 5000 + 90} ${(point.coordinates[0] - 31.23) * 5000 + 90
                                                        },${(30.055 - point.coordinates[1]) * 5000 + 110} ${(point.coordinates[0] - 31.23) * 5000 + 110
                                                        },${(30.055 - point.coordinates[1]) * 5000 + 110}`}
                                                    fill="#2563EB"
                                                    className="hover:opacity-75 transition-opacity cursor-pointer"
                                                    onClick={() => setSelectedPoint(point)}
                                                />
                                            ))}
                                </svg>

                                {/* Info Panel */}
                                {selectedPoint && (
                                    <div className="absolute bottom-4 left-4 right-4 glass rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-lg font-semibold text-foreground">
                                                {selectedPoint.name || selectedPoint.type?.toUpperCase()}
                                            </h4>
                                            <button
                                                onClick={() => setSelectedPoint(null)}
                                                className="text-foreground/70 hover:text-foreground"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {selectedPoint.sectionCode && (
                                                <div>
                                                    <span className="text-foreground/70">Section:</span>{' '}
                                                    <span className="text-foreground">
                                                        {selectedPoint.sectionCode}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedPoint.friction !== undefined && (
                                                <div>
                                                    <span className="text-foreground/70">Friction:</span>{' '}
                                                    <span className="text-foreground">
                                                        {selectedPoint.friction.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedPoint.crackDensity !== undefined && (
                                                <div>
                                                    <span className="text-foreground/70">
                                                        Crack Density:
                                                    </span>{' '}
                                                    <span className="text-foreground">
                                                        {selectedPoint.crackDensity.toFixed(1)} m/m²
                                                    </span>
                                                </div>
                                            )}
                                            {selectedPoint.value !== undefined && (
                                                <div>
                                                    <span className="text-foreground/70">Value:</span>{' '}
                                                    <span className="text-foreground">
                                                        {selectedPoint.value.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Scale */}
                                <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-sm text-foreground">
                                    Scale: 1:10000
                                </div>

                                {/* Note */}
                                <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2 text-sm text-foreground/70">
                                    Note: This is a simplified visualization. Real implementation
                                    would use Mapbox/MapLibre GL JS.
                                </div>
                            </div>
                        </Card>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <Card hover={false}>
                                <p className="text-sm text-foreground/70 mb-1">Visible Points</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {filteredPoints.length}
                                </p>
                            </Card>
                            <Card hover={false}>
                                <p className="text-sm text-foreground/70 mb-1">Road Segments</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {roadSegments.length}
                                </p>
                            </Card>
                            <Card hover={false}>
                                <p className="text-sm text-foreground/70 mb-1">Active Layers</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {selectedLayer.length}
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
