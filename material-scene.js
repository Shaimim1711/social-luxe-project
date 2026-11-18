/* Social Luxe — native WebGL chrome study. No external assets or dependencies. */
(() => {
  'use strict';

  const canvas = document.getElementById('material-scene');
  if (!canvas || canvas.dataset.sceneInitialized) return;
  canvas.dataset.sceneInitialized = 'true';

  const host = canvas.parentElement;
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    depth: true,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });
  if (!gl || !host) return;

  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 uModel;
    uniform mat4 uViewProjection;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vec4 world = uModel * vec4(aPosition, 1.0);
      vPosition = world.xyz;
      vNormal = mat3(uModel) * aNormal;
      gl_Position = uViewProjection * world;
    }
  `;

  const fragmentSource = `
    precision mediump float;
    uniform vec3 uCamera;
    varying vec3 vPosition;
    varying vec3 vNormal;

    float softbox(vec3 ray, vec3 facing, vec3 horizontal, vec2 size) {
      vec3 up = normalize(cross(facing, horizontal));
      float front = dot(ray, facing);
      vec2 p = vec2(dot(ray, horizontal), dot(ray, up)) / max(front, 0.001);
      vec2 edge = abs(p) - size;
      float rect = 1.0 - smoothstep(-0.10, 0.13, max(edge.x, edge.y));
      return rect * smoothstep(0.02, 0.16, front);
    }

    vec3 studio(vec3 ray) {
      // A quiet, high-contrast photographic studio reflected in the metal.
      float horizon = smoothstep(-0.85, 0.65, ray.y);
      vec3 color = mix(vec3(0.075, 0.070, 0.069), vec3(0.39, 0.38, 0.37), horizon);
      float upper = softbox(ray, normalize(vec3(-0.6, 0.8, 0.7)),
        normalize(vec3(0.8, 0.6, 0.0)), vec2(0.75, 0.52));
      float strip = softbox(ray, normalize(vec3(0.92, 0.12, 0.65)),
        normalize(vec3(0.13, -0.99, 0.0)), vec2(1.5, 0.11));
      float rim = softbox(ray, normalize(vec3(-0.85, -0.18, -0.5)),
        normalize(vec3(0.21, -0.98, 0.0)), vec2(1.4, 0.17));
      color += vec3(1.85, 1.78, 1.70) * upper;
      color += vec3(2.15, 2.20, 2.30) * strip;
      color += vec3(0.75, 0.78, 0.82) * rim;
      // A small raspberry reflector: an accent, not a pink material.
      float pink = softbox(ray, normalize(vec3(0.2, -0.9, 0.4)),
        normalize(vec3(0.98, 0.22, 0.0)), vec2(0.65, 0.22));
      color += vec3(0.58, 0.032, 0.13) * pink;
      return color;
    }

    vec3 filmic(vec3 x) {
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 view = normalize(uCamera - vPosition);
      vec3 reflected = reflect(-view, normal);
      float facing = max(dot(normal, view), 0.0);
      float fresnel = 0.78 + 0.22 * pow(1.0 - facing, 5.0);
      float depth = mix(0.72, 1.0, smoothstep(0.55, 1.5, length(vPosition.xy)));
      vec3 chrome = studio(reflected) * fresnel * depth;
      vec3 key = normalize(vec3(-2.5, 4.0, 3.5));
      vec3 halfVector = normalize(key + view);
      float glint = pow(max(dot(normal, halfVector), 0.0), 100.0);
      chrome += vec3(0.68) * glint;
      chrome += vec3(0.022, 0.021, 0.020) * max(dot(normal, key), 0.0);
      gl_FragColor = vec4(pow(filmic(chrome * 1.12), vec3(1.0 / 2.2)), 1.0);
    }
  `;

  const normalize = v => {
    const length = Math.hypot(v[0], v[1], v[2]) || 1;
    return v.map(value => value / length);
  };
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const curve = t => {
    const radius = 0.95 + 0.32 * Math.cos(3 * t);
    return [radius * Math.cos(2 * t), radius * Math.sin(2 * t), 0.32 * Math.sin(3 * t)];
  };

  function makeSculpture() {
    const positions = [];
    const normals = [];
    const indices = [];
    const segments = 200;
    const sides = 24;
    for (let i = 0; i <= segments; i += 1) {
      const t = (i / segments) * Math.PI * 2;
      const center = curve(t);
      const before = curve(t - 0.0001);
      const after = curve(t + 0.0001);
      const tangent = normalize(after.map((value, axis) => value - before[axis]));
      const radial = normalize(cross(tangent, [0, 0, 1]));
      const binormal = normalize(cross(tangent, radial));
      // An oval section gives the loop a broad, folded-metal character.
      const wide = 0.215 + 0.018 * Math.cos(3 * t);
      const narrow = 0.145;
      for (let j = 0; j <= sides; j += 1) {
        const angle = (j / sides) * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const normal = normalize(radial.map((value, axis) =>
          value * cos / wide + binormal[axis] * sin / narrow));
        for (let axis = 0; axis < 3; axis += 1) {
          positions.push(center[axis] + radial[axis] * cos * wide + binormal[axis] * sin * narrow);
          normals.push(normal[axis]);
        }
        if (i < segments && j < sides) {
          const a = i * (sides + 1) + j;
          const b = a + sides + 1;
          indices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    }
    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  }

  const geometry = makeSculpture();
  let program;
  let indexBuffer;
  let positionBuffer;
  let normalBuffer;
  let modelLocation;
  let viewProjectionLocation;
  let cameraLocation;
  let contextLost = false;
  let ready = false;

  function shader(type, source) {
    const compiled = gl.createShader(type);
    if (!compiled) throw new Error('Shader unavailable');
    gl.shaderSource(compiled, source);
    gl.compileShader(compiled);
    if (!gl.getShaderParameter(compiled, gl.COMPILE_STATUS)) {
      gl.deleteShader(compiled);
      throw new Error('Material shader unavailable');
    }
    return compiled;
  }

  function bindAttribute(name, data) {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('Geometry unavailable');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
    return buffer;
  }

  function initialise() {
    let vertex;
    let fragment;
    try {
      vertex = shader(gl.VERTEX_SHADER, vertexSource);
      fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      if (!program) throw new Error('WebGL unavailable');
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Material unavailable');
      gl.useProgram(program);
      positionBuffer = bindAttribute('aPosition', geometry.positions);
      normalBuffer = bindAttribute('aNormal', geometry.normals);
      indexBuffer = gl.createBuffer();
      if (!indexBuffer) throw new Error('Geometry unavailable');
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
      modelLocation = gl.getUniformLocation(program, 'uModel');
      viewProjectionLocation = gl.getUniformLocation(program, 'uViewProjection');
      cameraLocation = gl.getUniformLocation(program, 'uCamera');
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.clearColor(0, 0, 0, 0);
      ready = true;
      resize();
      host.classList.add('webgl-ready');
      syncAnimation();
    } catch (_) {
      ready = false;
      host.classList.remove('webgl-ready');
      if (program) gl.deleteProgram(program);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (normalBuffer) gl.deleteBuffer(normalBuffer);
      if (indexBuffer) gl.deleteBuffer(indexBuffer);
    } finally {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
    }
  }

  function multiply(a, b) {
    const out = new Float32Array(16);
    for (let column = 0; column < 4; column += 1) {
      for (let row = 0; row < 4; row += 1) {
        for (let k = 0; k < 4; k += 1) out[column * 4 + row] += a[k * 4 + row] * b[column * 4 + k];
      }
    }
    return out;
  }

  function rotation(x, y, z) {
    const cx = Math.cos(x), sx = Math.sin(x);
    const cy = Math.cos(y), sy = Math.sin(y);
    const cz = Math.cos(z), sz = Math.sin(z);
    const rx = [1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1];
    const ry = [cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1];
    const rz = [cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    return multiply(rz, multiply(ry, rx));
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  let paused = document.getElementById('motion-toggle')?.getAttribute('aria-pressed') === 'true';
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;
  let projection = new Float32Array(16);
  let cameraDistance = 4.7;

  function canAnimate() {
    return ready && !contextLost && visible && !document.hidden && !paused && !reduceMotion.matches;
  }

  function draw() {
    if (!ready || contextLost || !canvas.width || !canvas.height) return;
    const model = rotation(-0.37 + Math.sin(elapsed * 0.16) * 0.1 + currentY,
      -0.28 + elapsed * 0.105 + currentX, 0.16 + Math.sin(elapsed * 0.09) * 0.07);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(modelLocation, false, model);
    gl.uniformMatrix4fv(viewProjectionLocation, false, projection);
    gl.uniform3f(cameraLocation, 0, 0, cameraDistance);
    gl.drawElements(gl.TRIANGLES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  function tick(time) {
    frame = 0;
    if (!canAnimate()) { lastTime = 0; return; }
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;
    elapsed += delta;
    const ease = 1 - Math.exp(-delta * 5);
    currentX += (pointerX - currentX) * ease;
    currentY += (pointerY - currentY) * ease;
    draw();
    frame = window.requestAnimationFrame(tick);
  }

  function syncAnimation() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (canAnimate()) frame = window.requestAnimationFrame(tick);
    else if (visible && !document.hidden) draw();
  }

  function resize() {
    if (!ready || contextLost) return;
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(bounds.width * ratio));
    const height = Math.max(1, Math.round(bounds.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    const aspect = bounds.width / bounds.height;
    // Keep the whole sculpture inside both portrait and landscape containers.
    const f = 1 / Math.tan(Math.PI / 8);
    const distance = aspect < 0.85 ? 4.7 * (0.85 / aspect) : 4.7;
    cameraDistance = distance;
    const near = 0.1, far = 50;
    const perspective = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0,
    ]);
    const view = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -distance, 1]);
    projection = multiply(perspective, view);
    draw();
  }

  (host.closest('.hero-stage') || host).addEventListener('pointermove', event => {
    if (!canAnimate() || !finePointer.matches) return;
    const bounds = host.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.32;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.20;
  }, { passive: true });
  (host.closest('.hero-stage') || host).addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; }, { passive: true });
  window.addEventListener('sl-motion-change', event => {
    if (typeof event.detail?.paused !== 'boolean') return;
    paused = event.detail.paused;
    syncAnimation();
  });
  document.addEventListener('visibilitychange', syncAnimation);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', syncAnimation);
  else reduceMotion.addListener(syncAnimation);

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncAnimation();
    }, { threshold: 0 }).observe(canvas);
  }

  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    contextLost = true;
    host.classList.remove('webgl-ready');
    syncAnimation();
  });
  canvas.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    initialise();
  });
  window.addEventListener('pagehide', () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  });
  window.addEventListener('pageshow', syncAnimation);

  initialise();
})();
