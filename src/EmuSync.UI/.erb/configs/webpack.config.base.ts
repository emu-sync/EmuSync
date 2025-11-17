/**
 * Base webpack config used across other specific configs
 */

import dotenv from 'dotenv';
import webpack from 'webpack';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';

dotenv.config(); // <-- load .env here

const configuration: webpack.Configuration = {
    externals: [...Object.keys(externals || {})],

    stats: 'errors-only',

    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        // Remove this line to enable type checking in webpack builds
                        transpileOnly: true,
                        compilerOptions: {
                            module: 'nodenext',
                            moduleResolution: 'nodenext',
                        },
                    },
                },
            },
        ],
    },

    output: {
        path: webpackPaths.srcPath,
        // https://github.com/webpack/webpack/issues/1114
        library: { type: 'commonjs2' },
    },

    /**
     * Determine the array of extensions that should be used to resolve modules.
     */
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        modules: [webpackPaths.srcPath, 'node_modules'],
        // There is no need to add aliases here, the paths in tsconfig get mirrored
        plugins: [new TsconfigPathsPlugins()],
    },

    plugins: [new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        RELEASE_VERSION: process.env.RELEASE_VERSION || "Unknown"
    })],
};

export default configuration;
