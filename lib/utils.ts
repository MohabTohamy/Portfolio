// Utility functions for the portfolio

export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export function formatNumber(num: number, decimals: number = 2): string {
    return num.toFixed(decimals);
}

export function calculateSegmentLength(coordinates: [number, number][]): number {
    // Simple distance calculation (not accurate for large distances)
    let length = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
        const [lon1, lat1] = coordinates[i];
        const [lon2, lat2] = coordinates[i + 1];
        const dx = lon2 - lon1;
        const dy = lat2 - lat1;
        length += Math.sqrt(dx * dx + dy * dy);
    }
    return length * 111000; // Rough conversion to meters
}

export function splitLength(totalLength: number, segmentLength: number): number[] {
    const segments: number[] = [];
    let remaining = totalLength;

    while (remaining > 0) {
        if (remaining >= segmentLength) {
            segments.push(segmentLength);
            remaining -= segmentLength;
        } else {
            segments.push(remaining);
            remaining = 0;
        }
    }

    return segments;
}

export function repeatRows(rows: string[], repeatCount: number): string[] {
    const result: string[] = [];
    rows.forEach(row => {
        for (let i = 0; i < repeatCount; i++) {
            result.push(row);
        }
    });
    return result;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function getFrictionColor(friction: number): string {
    if (friction >= 0.7) return '#10B981'; // green
    if (friction >= 0.5) return '#F59E0B'; // yellow
    return '#EF4444'; // red
}

export function getCrackDensityColor(density: number): string {
    if (density <= 2) return '#10B981'; // green
    if (density <= 4) return '#F59E0B'; // yellow
    return '#EF4444'; // red
}
