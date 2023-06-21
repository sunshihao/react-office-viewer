import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import autoprefixer from 'autoprefixer';
import url from '@rollup/plugin-url';
import { cssUrl } from '@sixian/css-url';
import resolve from "rollup-plugin-node-resolve";


const babelOptions = {
    presets: ["@babel/preset-env"],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.less'],
    exclude: "**/node_modules/**"
};

export default {
    input: './src/index.js',
    output: {
        file: './build/bundle.js',
        format: 'cjs',
    },
    plugins: [
        babel(babelOptions),
        resolve(),
        commonjs(),
        url(),
        postcss({
            modules: true,
            plugins: [autoprefixer(), cssUrl({
                imgOutput: 'build/images',
                cssOutput: 'build/style'
            })]
        })
    ],
    external: ['react']
}