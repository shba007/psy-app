export default {
  somalization: {
    type: 'average',
    count: 0,
    items: [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58],
    weight: 1,
  }, psychoticism: {
    type: 'average',
    count: 0,
    items: [7, 16, 35, 62, 77, 84, 85, 87, 88, 90],
    weight: 1,
  }, hostility: {
    type: 'average',
    count: 0,
    items: [11, 24, 63, 67, 74, 81],
    weight: 1,
  }, depression: {
    type: 'average',
    count: 0,
    items: [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79],
    weight: 1,
  }, anxiety: {
    type: 'average',
    count: 0,
    items: [2, 17, 23, 33, 39, 57, 72, 78, 80, 86],
    weight: 1,
  }, oc: {
    type: 'average',
    count: 0,
    items: [3, 9, 10, 28, 38, 45, 46, 51, 55, 65],
    weight: 1,
  }, interpersonal: {
    type: 'average',
    count: 0,
    items: [6, 21, 34, 36, 37, 41, 61, 69, 73],
    weight: 1,
  }, phobia: {
    type: 'average',
    count: 0,
    items: [13, 25, 47, 50, 70, 75, 82],
    weight: 1,
  }, "paranoid-ideation": {
    type: 'average',
    count: 0,
    items: [8, 18, 43, 68, 76, 83],
    weight: 1,
  }, raw: {
    type: 'sum',
    count: 0,
    items: Array.from({ length: 90 }, (_, index) => index + 1),
    weight: 1,
  }, pst: {
    type: 'count',
    start: 1,
    count: 90,
    label: 0,
    inverse: true
  },
};

/* class CompositeScale {
  result: { name: string, score: number }[];
  raw: number;
  pst: number;

  constructor(result: { name: string, score: number }[]) {
    this.result = []
    this.raw = result.find(({ name }) => name === 'raw')?.score ?? 0
    this.pst = result.find(({ name }) => name === 'pst')?.score ?? 0
  }

  score() {
    this.result.push({ name: 'psdi', score: this.raw / this.pst })
    this.result.push({ name: 'gsi', score: this.raw / 90 })

    return this.result
  }
} */

function CompositeFunction(_result: { name: string, score: number }[]) {
  const result: { name: string, score: number }[] = []
  const raw = _result.find(({ name }) => name === 'raw')?.score ?? 0
  const pst = _result.find(({ name }) => name === 'pst')?.score ?? 0

  result.push({ name: 'psdi', score: Math.round((raw / pst) * 100) / 100 })
  result.push({ name: 'gsi', score: Math.round((raw / 90) * 100) / 100 })

  return result
}

export { CompositeFunction }