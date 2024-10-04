import typescript from '@rollup/plugin-typescript';

export default {
  external: [
    'ajv',
    'ajv-formats-draft2019/formats'
  ],
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    typescript({
      exclude: [
        'src/*.test.ts',
      ],
    }),
  ]
};
