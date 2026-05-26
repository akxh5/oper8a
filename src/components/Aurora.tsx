import { useEffect, useRef } from "react";
import * as THREE from "three";

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  #define NUM_OCTAVES 3
  float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 ip = floor(p); vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    float res = mix(mix(rand(ip),rand(ip+vec2(1,0)),u.x),mix(rand(ip+vec2(0,1)),rand(ip+vec2(1,1)),u.x),u.y);
    return res*res;
  }
  float fbm(vec2 x) {
    float v=0.0; float a=0.3; vec2 shift=vec2(100);
    mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
    for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}
    return v;
  }
  void main() {
    vec2 shake=vec2(sin(iTime*1.2)*0.005,cos(iTime*2.1)*0.005);
    vec2 p=((gl_FragCoord.xy+shake*iResolution.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6,-4,4,6);
    vec2 v; vec4 o=vec4(0);
    float f=2.0+fbm(p+vec2(iTime*5.0,0.0))*0.5;
    for(float i=0.0;i<25.0;i++){ // Reduced from 35 to 25 for performance
      v=p+cos(i*i+(iTime+p.x*0.08)*0.025+i*vec2(13,11))*3.5+vec2(sin(iTime*3.0+i)*0.003,cos(iTime*3.5-i)*0.003);
      float tailNoise=fbm(v+vec2(iTime*0.5,i))*0.3*(1.0-(i/25.0));
      vec4 col=vec4(0.1+0.3*sin(i*0.2+iTime*0.4),0.3+0.5*cos(i*0.3+iTime*0.5),0.7+0.3*sin(i*0.4+iTime*0.3),1.0);
      vec4 contrib=col*exp(sin(i*i+iTime*0.8))/length(max(v,vec2(v.x*f*0.015,v.y*1.5)));
      float thin=smoothstep(0.0,1.0,i/25.0)*0.6;
      o+=contrib*(1.0+tailNoise*0.8)*thin;
    }
    o=tanh(pow(o/80.0,vec4(1.6)));
    gl_FragColor=o*1.8;
  }
`;

const VERTEX_SHADER = /* glsl */ `
  void main() { gl_Position = vec4(position, 1.0); }
`;

export default function Aurora() {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const isInViewRef = useRef<boolean>(true);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Lower pixel ratio cap for the heavy shader
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const tick = () => {
      if (isInViewRef.current) {
        uniforms.iTime.value += 0.016;
        renderer.render(scene, camera);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    // Intersection Observer to stop rendering when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ opacity: 0.65, zIndex: 0, touchAction: 'none' }}
    />
  );
}
