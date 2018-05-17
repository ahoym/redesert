import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const config = {
  format: env,
  indent: false,
  input: './compiled/index.js',
  plugins: [
    uglify({
      compress: {
        unsafe: true,
        unsafe_comps: true,
        unsafe_proto: true,
      },
    }),
  ],
};

export default config;
