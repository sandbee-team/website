import {
  createSculpture,
  type Part,
  type Scene,
} from '../sections/home/sculpture-renderer'

export function create(canvas: HTMLCanvasElement, kind = 'products') {
  return createSculpture(canvas, createExperienceScene(kind))
}

// Two small shared meshes: a smooth torus and a rounded architectural block.
// Everything is generated locally; no textures, model downloads or runtime library.
function createExperienceScene(kind: string): Scene {
  const vertices: number[] = [],
    normals: number[] = [],
    indices: number[] = []
  const meshes: Scene['meshes'] = []
  function surface(
    rows: number,
    columns: number,
    point: (u: number, v: number) => number[][],
  ) {
    const base = vertices.length / 3
    for (let i = 0; i <= rows; i++)
      for (let j = 0; j <= columns; j++) {
        const [p, n] = point(i / rows, j / columns)
        vertices.push(...p)
        normals.push(...n)
        if (i < rows && j < columns) {
          const a = base + i * (columns + 1) + j,
            b = a + columns + 1
          indices.push(a, b, a + 1, b, b + 1, a + 1)
        }
      }
  }
  surface(64, 16, (u, v) => {
    const a = u * Math.PI * 2,
      b = v * Math.PI * 2
    return [
      [
        (1 + 0.18 * Math.cos(b)) * Math.cos(a),
        (1 + 0.18 * Math.cos(b)) * Math.sin(a),
        0.18 * Math.sin(b),
      ],
      [Math.cos(b) * Math.cos(a), Math.cos(b) * Math.sin(a), Math.sin(b)],
    ]
  })
  meshes.push({ start: 0, count: indices.length })
  const start = indices.length
  for (let axis = 0; axis < 3; axis++)
    for (const sign of [-1, 1]) {
      surface(8, 8, (u, v) => {
        const p = [0, 0, 0]
        p[axis] = sign
        p[(axis + 1) % 3] = u * 2 - 1
        p[(axis + 2) % 3] = v * 2 - 1
        const core = p.map((value) => Math.max(-0.86, Math.min(0.86, value)))
        const normal = p.map((value, i) => value - core[i])
        const length = Math.hypot(...normal)
        return [
          core.map((value, i) => value + (normal[i] / length) * 0.14),
          normal.map((value) => value / length),
        ]
      })
    }
  meshes.push({ start, count: indices.length - start })
  meshes.push({ start: 0, count: meshes[0].count / 2 })
  return {
    vertices,
    normals,
    indices,
    meshes,
    pose(progress) {
      const parts: Part[] = []
      const open = progress
      // Keep joints in model space; the shader rotates/scales the whole assembly.
      function add(
        mesh: number,
        color: number,
        offset: number[],
        dimensions: number[],
        rotation = [0, 0, 0],
      ) {
        parts.push({
          mesh,
          color,
          dimensions,
          offset,
          rotation,
        })
      }
      if (kind === 'products') {
        // An isolated environment, peeled into three floors and their supports.
        for (let i = 0; i < 3; i++) {
          const floor = (i - 1) * (0.52 + open * 0.55)
          add(1, i, [0, floor, 0], [1.15, 0.09, 0.8])
          for (const side of [-1, 1])
            add(1, 3, [side * 0.88, floor + 0.22, -0.56], [0.045, 0.2, 0.045])
          add(1, 3, [0.4 - i * 0.4, floor + 0.22, 0.15], [0.2, 0.13, 0.28])
        }
      } else if (kind === 'services') {
        // Three portals turn into a continuous channel, with a signal travelling through.
        for (let i = 0; i < 3; i++)
          add(
            0,
            i,
            [(i - 1) * (0.58 + open * 0.38), 0, (i - 1) * 0.3],
            [0.8, 0.8, 0.8],
            [0, 0.65 + open * 0.55, (i - 1) * 0.2 * (1 - open)],
          )
        add(
          1,
          3,
          [Math.sin(open * Math.PI * 2) * 0.9, 0, 0.1],
          [0.18, 0.18, 0.18],
          [0.6, open * 3, 0.5],
        )
      } else if (kind === 'technology') {
        // Exploded circuit: tiles reveal the core and return to a modular system.
        add(1, 4, [0, -0.65, 0], [1.02, 0.09, 1.02])
        for (let i = 0; i < 9; i++) {
          const col = (i % 3) - 1,
            row = Math.floor(i / 3) - 1
          add(
            1,
            i === 4 ? 0 : i % 2 ? 1 : 3,
            [
              col * (0.61 + open * 0.2),
              -0.26 + (i === 4 ? 0.32 + open * 0.7 : open * 0.2),
              row * (0.61 + open * 0.2),
            ],
            [0.24, i === 4 ? 0.3 : 0.11, 0.24],
            [0, i === 4 ? open * 0.8 : 0, 0],
          )
        }
        add(
          0,
          2,
          [0, 0.85 + open * 0.35, 0],
          [0.43, 0.43, 0.43],
          [Math.PI / 2, 0, 0],
        )
      } else if (kind === 'company' || kind === 'custom') {
        // A sculptural colonnade; the custom route reveals a missing cornerstone.
        for (let i = 0; i < 3; i++) {
          const a = (i - 1) * (0.7 + open * 0.35),
            h = i * 0.16
          add(2, i, [a, 0.45 + h, -i * 0.28], [0.48, 0.7, 0.65], [0, 0, 0])
          for (const side of [-1, 1])
            add(
              1,
              i,
              [a + side * 0.48, -0.3 + h / 2, -i * 0.28],
              [0.088, 0.75 + h / 2, 0.12],
            )
        }
        add(1, 3, [0, -1.12, 0], [1.25, 0.07, 0.75])
        if (kind === 'custom')
          add(
            1,
            0,
            [0.8, 0.7 + open * 0.65, 0.6],
            [0.23, 0.23, 0.23],
            [0.3, open, 0.4],
          )
      } else if (kind === 'contact') {
        // The brief emerges from a sculptural letterbox.
        add(1, 2, [0, -0.22, 0], [1, 0.65, 0.22])
        add(
          1,
          3,
          [0, 0.25 + open * 0.9, -0.3],
          [0.83, 0.58, 0.045],
          [0, 0, -0.08 * open],
        )
        add(1, 0, [0, -0.52, 0.26], [0.95, 0.32, 0.04])
        for (let i = 0; i < 3; i++)
          add(
            1,
            2,
            [-0.14, 0.46 + open * 0.9 - i * 0.17, -0.245],
            [0.48 - i * 0.09, 0.018, 0.012],
          )
        add(0, 1, [0.62, -0.31, 0.36], [0.19, 0.19, 0.3])
      } else {
        // Pages unfold into a fan; a journal floats its leaves above the cover.
        for (let i = 0; i < 5; i++) {
          const angle = (i - 2) * (0.1 + open * 0.3)
          add(
            1,
            i === 0 ? 2 : i === 4 ? 0 : 3,
            [
              Math.sin(angle) * 0.7,
              (i - 2) * (kind === 'journal' ? 0.1 + open * 0.14 : 0.055),
              Math.cos(angle) * 0.3,
            ],
            [0.8, 0.035, 1],
            [0, angle, kind === 'journal' ? angle * 0.4 : 0],
          )
        }
      }
      return parts
    },
  }
}
