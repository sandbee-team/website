import { createSculpture, type Scene } from './sculpture-renderer'
export function create(canvas: HTMLCanvasElement) {
  return createSculpture(canvas, createHomeScene())
}
function createHomeScene(): Scene {
  const vertices: number[] = [],
    normals: number[] = [],
    indices: number[] = []
  const segments = 96,
    sides = 24
  for (let i = 0; i <= segments; i++) {
    const u = (i / segments) * Math.PI * 2
    for (let j = 0; j <= sides; j++) {
      const v = (j / sides) * Math.PI * 2,
        radius = 1.06 + 0.14 * Math.cos(3 * u) + 0.28 * Math.cos(v)
      vertices.push(
        radius * Math.cos(u),
        radius * Math.sin(u),
        0.28 * Math.sin(v),
      )
      const slope = (-0.42 * Math.sin(3 * u)) / radius
      const normal = [
        Math.cos(v) * (Math.cos(u) + slope * Math.sin(u)),
        Math.cos(v) * (Math.sin(u) - slope * Math.cos(u)),
        Math.sin(v),
      ]
      const length = Math.hypot(...normal)
      normals.push(...normal.map((value) => value / length))
      if (i < segments && j < sides) {
        const a = i * (sides + 1) + j,
          b = a + sides + 1
        indices.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
  }

  return {
    vertices,
    normals,
    indices,
    meshes: [{ start: 0, count: indices.length }],
    home: true,
    pose(progress, x, y, arrival = 1) {
      const open =
        Math.sin(Math.min(progress, 1) * Math.PI) + (1 - arrival) * 0.6
      const assembled = Math.max(0, (progress - 0.52) / 0.48)
      return [0, 1, 2].map((i) => {
        const angle = (i * Math.PI * 2) / 3
        const size = 0.97 - i * 0.14 - open * 0.08
        return {
          mesh: 0,
          color: i,
          dimensions: [size, size, size],
          rotation: [
            0.6 + i * 0.72 * (1 - assembled) + y * 0.12,
            -0.45 + progress * 2.6 + i * 0.85 * (1 - assembled) + x * 0.16,
            -0.45 + i * 0.7 * (1 - assembled) + (1 - arrival) * 1.2,
          ],
          offset: [
            Math.cos(angle) * open * 0.85,
            Math.sin(angle) * open * 0.85 + (i - 1) * assembled * 0.52,
            (i - 1) * assembled * 0.18,
          ],
        }
      })
    },
  }
}
