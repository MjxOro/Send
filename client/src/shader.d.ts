import { Object3DNode } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      noiseMaterial: Object3DNode<NoiseMaterial, typeof NoiseMaterial>;
    }
  }
}
declare module '*.glb';
declare module '*.gltf';
