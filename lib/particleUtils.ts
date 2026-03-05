// Particle positions for inner and outer rings
export const pointsInner = Array.from({ length: 40 }, (_, i) => ({
  idx: `inner-${i}`,
  position: [
    Math.cos((i / 40) * Math.PI * 2) * 2.5,
    Math.sin((i / 40) * Math.PI * 2) * 2.5,
    0
  ] as [number, number, number],
  color: i % 2 === 0 ? '#06b6d4' : '#2563eb'
}));

export const pointsOuter = Array.from({ length: 60 }, (_, i) => ({
  idx: `outer-${i}`,
  position: [
    Math.cos((i / 60) * Math.PI * 2) * 5,
    Math.sin((i / 60) * Math.PI * 2) * 5,
    0
  ] as [number, number, number],
  color: i % 3 === 0 ? '#06b6d4' : i % 2 === 0 ? '#2563eb' : '#8b5cf6'
}));
