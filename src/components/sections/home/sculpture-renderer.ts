// Shared lighting and depth-tested rendering; each route loads its own geometry.
const VERTEX = `
attribute vec3 position; attribute vec3 normal;
uniform vec3 rotation; uniform vec3 offset; uniform vec3 dimensions; uniform float scale; uniform float aspect;
uniform vec2 camera;
varying vec3 vNormal; varying vec3 vPosition;
mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
void main(){
mat3 r=rz(rotation.z)*ry(rotation.y)*rx(rotation.x);
mat3 view=rx(camera.y)*ry(camera.x);
vec3 p=view*((r*(position*dimensions)+offset)*scale);vPosition=p;vNormal=view*r*(normal/dimensions);
float z=6.8-p.z;gl_Position=vec4(p.x*2.8/aspect,p.y*2.8,(z-1.)*1.02-1.02,z);
}`
const FRAGMENT = `
precision mediump float;
uniform vec3 color;varying vec3 vNormal;varying vec3 vPosition;
void main(){
vec3 n=normalize(vNormal),light=normalize(vec3(-3.,5.,6.)),eye=normalize(vec3(0.,0.,6.8)-vPosition);
float diffuse=max(dot(n,light),0.);
float spec=pow(max(dot(n,normalize(light+eye)),0.),70.);
float rim=pow(1.-max(dot(n,eye),0.),3.);
float fill=max(dot(n,normalize(vec3(4.,-1.,2.))),0.);
vec3 pigment=color*(.42+.58*diffuse+.12*fill);
pigment+=vec3(1.,.93,.82)*spec*.7+rim*.09;
gl_FragColor=vec4(pigment,1.);
}`

export type Part = {
  rotation: number[]
  offset: number[]
  dimensions: number[]
  color: number
  mesh: number
}
export type Scene = {
  home?: boolean
  vertices: number[]
  normals: number[]
  indices: number[]
  meshes: { start: number; count: number }[]
  pose: (progress: number, x: number, y: number, arrival?: number) => Part[]
}

export function createSculpture(canvas: HTMLCanvasElement, scene: Scene) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  })
  if (!gl) return null
  const shaders: WebGLShader[] = [],
    buffers: WebGLBuffer[] = []
  let program: WebGLProgram | null = null
  const dispose = () => {
    buffers.forEach((buffer) => gl.deleteBuffer(buffer))
    shaders.forEach((shader) => gl.deleteShader(shader))
    if (program) gl.deleteProgram(program)
  }
  try {
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type)
      if (!shader) throw new Error('WebGL unavailable')
      shaders.push(shader)
      gl!.shaderSource(shader, source)
      gl!.compileShader(shader)
      // Program linking below validates both shaders without two extra GPU reads.
      return shader
    }
    program = gl.createProgram()
    if (!program) throw new Error('WebGL unavailable')
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error('WebGL unavailable')
    gl.useProgram(program)
    const { vertices, normals, indices } = scene
    for (const [name, values] of [
      ['position', vertices],
      ['normal', normals],
    ] as const) {
      const buffer = gl.createBuffer()
      if (!buffer) throw new Error('WebGL unavailable')
      buffers.push(buffer)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW)
      const location = gl.getAttribLocation(program, name)
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0)
    }
    const indexBuffer = gl.createBuffer()
    if (!indexBuffer) throw new Error('WebGL unavailable')
    buffers.push(indexBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    )
    gl.enable(gl.DEPTH_TEST)
    const uniforms = Object.fromEntries(
      [
        'rotation',
        'offset',
        'dimensions',
        'scale',
        'aspect',
        'color',
        'camera',
      ].map((name) => [name, gl.getUniformLocation(program!, name)]),
    )
    const css = getComputedStyle(document.documentElement)
    const colors = [
      'sculpture-coral',
      'sculpture-citron',
      'sculpture-plum',
      'surface',
      'ink',
    ].map((name) => {
      const hex = css.getPropertyValue(`--color-${name}`).trim()
      return [1, 3, 5].map(
        (index) => parseInt(hex.slice(index, index + 2), 16) / 255,
      )
    })
    let aspect = 1
    return {
      resize() {
        const rect = canvas.getBoundingClientRect()
        const dpr = Math.min(
          devicePixelRatio || 1,
          rect.width < 600 ? 1.25 : 1.5,
        )
        canvas.width = Math.max(1, Math.round(rect.width * dpr))
        canvas.height = Math.max(1, Math.round(rect.height * dpr))
        aspect = canvas.width / canvas.height
        gl.viewport(0, 0, canvas.width, canvas.height)
      },
      draw(progress: number, pointerX: number, pointerY: number, arrival = 1) {
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.uniform1f(uniforms.aspect, aspect)
        gl.uniform2f(
          uniforms.camera,
          scene.home ? 0 : -0.38 + progress * 0.58 + pointerX * 0.14,
          scene.home ? 0 : 0.24 + pointerY * 0.1,
        )
        gl.uniform1f(
          uniforms.scale,
          scene.home
            ? 1
            : Math.min(1.18, aspect * 1.25) * (0.88 + arrival * 0.12),
        )
        for (const part of scene.pose(progress, pointerX, pointerY, arrival)) {
          gl.uniform3fv(uniforms.rotation, part.rotation)
          gl.uniform3fv(uniforms.offset, part.offset)
          gl.uniform3fv(uniforms.dimensions, part.dimensions)
          gl.uniform3fv(uniforms.color, colors[part.color])
          const mesh = scene.meshes[part.mesh]
          gl.drawElements(
            gl.TRIANGLES,
            mesh.count,
            gl.UNSIGNED_SHORT,
            mesh.start * 2,
          )
        }
      },
      dispose,
    }
  } catch {
    dispose()
    return null
  }
}
