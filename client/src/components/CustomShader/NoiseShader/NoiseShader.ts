import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import vertexShader from './vertex';
import fragmentShader from './fragment';

const NoiseMaterial = shaderMaterial(
  {
    uTime: 0
  },
  vertexShader,
  fragmentShader
);

extend({ NoiseMaterial });
