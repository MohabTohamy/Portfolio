'use client';

import { useState } from 'react';
import { Section, SectionTitle, Card, Button } from '@/components/UI';
import { Calculator, FileSpreadsheet, MapPin, Copy, Check } from 'lucide-react';
import { splitLength, repeatRows } from '@/lib/utils';

export default function ToolsPage() {
    return (
        <div className="min-h-screen py-16">
            <Section>
                <SectionTitle subtitle="Interactive engineering utilities">
                    Engineering Tools
                </SectionTitle>

                <div className="space-y-8">
                    {/* Excel Row Splitter Tool */}
                    <LengthSplitterTool />

                    {/* Row Repeater Tool */}
                    <RowRepeaterTool />

                    {/* Coordinate Calculator */}
                    <CoordinateCalculatorTool />
                </div>
            </Section>
        </div>
    );
}

// Length Splitter Tool
function LengthSplitterTool() {
    const [totalLength, setTotalLength] = useState<number>(100);
    const [segmentLength, setSegmentLength] = useState<number>(20);
    const [result, setResult] = useState<number[]>([]);
    const [copied, setCopied] = useState(false);

    const handleCalculate = () => {
        const segments = splitLength(totalLength, segmentLength);
        setResult(segments);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold text-foreground">
                    Excel Row Splitter
                </h3>
            </div>

            <p className="text-foreground/70 mb-6">
                Split a total length into equal segments. Useful for pavement survey data
                processing.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Total Length (m)
                    </label>
                    <input
                        type="number"
                        value={totalLength}
                        onChange={(e) => setTotalLength(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary"
                        placeholder="Enter total length"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Segment Length (m)
                    </label>
                    <input
                        type="number"
                        value={segmentLength}
                        onChange={(e) => setSegmentLength(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary"
                        placeholder="Enter segment length"
                    />
                </div>
            </div>

            <Button onClick={handleCalculate} variant="primary">
                Calculate Segments
            </Button>

            {result.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">
                            Result ({result.length} segments):
                        </h4>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                    <div className="bg-background border border-primary/20 rounded-lg p-4 max-h-64 overflow-y-auto">
                        {result.map((segment, index) => (
                            <div
                                key={index}
                                className="py-1 text-foreground font-mono text-sm"
                            >
                                {segment}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

// Row Repeater Tool
function RowRepeaterTool() {
    const [inputData, setInputData] = useState<string>('Row 1\nRow 2\nRow 3');
    const [repeatCount, setRepeatCount] = useState<number>(2);
    const [result, setResult] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const handleProcess = () => {
        const rows = inputData.split('\n').filter((row) => row.trim());
        const repeated = repeatRows(rows, repeatCount);
        setResult(repeated);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <div className="flex items-center gap-3 mb-6">
                <FileSpreadsheet className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-semibold text-foreground">
                    Row Repeater
                </h3>
            </div>

            <p className="text-foreground/70 mb-6">
                Repeat each row in your data a specified number of times.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Input Data (one per line)
                    </label>
                    <textarea
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        className="w-full h-32 px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary font-mono text-sm"
                        placeholder="Enter rows..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Repeat Count
                    </label>
                    <input
                        type="number"
                        value={repeatCount}
                        onChange={(e) => setRepeatCount(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary"
                        placeholder="Enter repeat count"
                        min="1"
                    />
                </div>
            </div>

            <Button onClick={handleProcess} variant="primary">
                Generate Repeated Rows
            </Button>

            {result.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">
                            Result ({result.length} rows):
                        </h4>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                    <div className="bg-background border border-primary/20 rounded-lg p-4 max-h-64 overflow-y-auto">
                        {result.map((row, index) => (
                            <div
                                key={index}
                                className="py-1 text-foreground font-mono text-sm"
                            >
                                {row}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

// Coordinate Calculator Tool
function CoordinateCalculatorTool() {
    const [lat1, setLat1] = useState<number>(30.0444);
    const [lon1, setLon1] = useState<number>(31.2357);
    const [lat2, setLat2] = useState<number>(30.0544);
    const [lon2, setLon2] = useState<number>(31.2457);
    const [distance, setDistance] = useState<number | null>(null);

    const calculateDistance = () => {
        // Haversine formula for distance calculation
        const R = 6371000; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c;
        setDistance(d);
    };

    return (
        <Card>
            <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-semibold text-foreground">
                    Coordinate Distance Calculator
                </h3>
            </div>

            <p className="text-foreground/70 mb-6">
                Calculate the distance between two GPS coordinates using the Haversine
                formula.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Point 1</h4>
                    <div>
                        <label className="block text-sm text-foreground/70 mb-2">
                            Latitude
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={lat1}
                            onChange={(e) => setLat1(Number(e.target.value))}
                            className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-foreground/70 mb-2">
                            Longitude
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={lon1}
                            onChange={(e) => setLon1(Number(e.target.value))}
                            className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Point 2</h4>
                    <div>
                        <label className="block text-sm text-foreground/70 mb-2">
                            Latitude
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={lat2}
                            onChange={(e) => setLat2(Number(e.target.value))}
                            className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-foreground/70 mb-2">
                            Longitude
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={lon2}
                            onChange={(e) => setLon2(Number(e.target.value))}
                            className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            <Button onClick={calculateDistance} variant="primary">
                Calculate Distance
            </Button>

            {distance !== null && (
                <div className="mt-6 p-4 bg-linear-to-r from-primary/10 to-accent/10 rounded-lg">
                    <p className="text-foreground">
                        <span className="font-semibold">Distance:</span>{' '}
                        <span className="text-2xl font-bold text-primary">
                            {distance.toFixed(2)} m
                        </span>
                        {' '}({(distance / 1000).toFixed(3)} km)
                    </p>
                </div>
            )}
        </Card>
    );
}
