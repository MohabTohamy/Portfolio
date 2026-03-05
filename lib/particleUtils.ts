// Generate particles in a 3D sphere cluster
const generateSphereParticles = (count: number, radius: number, layerStart: number) => {
    const particles = [];
    const colors = ['#06b6d4', '#2563eb', '#8b5cf6']; // cyan, blue, purple
    
    for (let i = 0; i < count; i++) {
        // Use Fibonacci sphere algorithm for even distribution
        const phi = Math.acos(1 - 2 * (i + 0.5) / count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        // Add slight randomness to radius for organic feel
        const r = radius * (0.8 + Math.random() * 0.4);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        particles.push({
            idx: `sphere-${layerStart + i}`,
            position: [x, y, z] as [number, number, number],
            color: colors[i % colors.length]
        });
    }
    
    return particles;
};

// Create multiple layers for volumetric effect
export const pointsInner = generateSphereParticles(150, 2.5, 0);
export const pointsOuter = generateSphereParticles(200, 4.5, 150);
