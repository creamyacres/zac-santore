import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

// 4-step monochrome dither palette matching zac-santore.com aesthetic
// #080808 → #2a2a2a → #787878 → #d8d8d8
const DitherShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: [1, 1] },
  },

  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    varying vec2 vUv;

    float bayer4x4(int x, int y) {
      int m[16];
      m[0]  =  0; m[1]  =  8; m[2]  =  2; m[3]  = 10;
      m[4]  = 12; m[5]  =  4; m[6]  = 14; m[7]  =  6;
      m[8]  =  3; m[9]  = 11; m[10] =  1; m[11] =  9;
      m[12] = 15; m[13] =  7; m[14] = 13; m[15] =  5;
      return float(m[y * 4 + x]) / 16.0;
    }

    // 4-step monochrome palette
    vec3 monoColor(int idx) {
      if (idx == 0) return vec3(0.031, 0.031, 0.031); // #080808 — near black
      if (idx == 1) return vec3(0.165, 0.165, 0.165); // #2a2a2a — dark gray
      if (idx == 2) return vec3(0.471, 0.471, 0.471); // #787878 — mid gray
      return vec3(0.847, 0.847, 0.847);                // #d8d8d8 — light gray
    }

    float luma(vec3 c) {
      return dot(c, vec3(0.299, 0.587, 0.114));
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float lum = luma(color.rgb);

      int px = int(mod(vUv.x * resolution.x, 4.0));
      int py = int(mod(vUv.y * resolution.y, 4.0));
      float threshold = bayer4x4(px, py);

      float stepped = lum + (threshold - 0.5) * 0.35;
      stepped = clamp(stepped, 0.0, 0.9999);

      int idx = int(stepped * 4.0);

      gl_FragColor = vec4(monoColor(idx), color.a);
    }
  `,
}

export function createDitherPass(width, height) {
  const pass = new ShaderPass(DitherShader)
  pass.uniforms.resolution.value = [width, height]
  return pass
}
