const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

module.exports = merge(common, {
    mode: "production",
    module: {
        rules: [
            /* babel loader */
            {
                test: /\.js$/,
                exclude: "/node_modules/",
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "css/", to: "css/" },
                { from: "img/**/*" },
                { from: "pages/**/*" },
                { from: "index.html" },
                { from: "push.js" },
                { from: "service-worker.js" },
            ]
        }),
        new WebpackPwaManifest({
            publicPath: "/",
            filename: "manifest.json",
            fingerprints: false,
            name: 'Football Crack',
            short_name: 'fCrack',
            description: 'Info around worldwide football.',
            background_color: '#3f72af',
            start_url: '/index.html',
            display: 'standalone',
            theme_color: '#112d4e',
            gcm_sender_id: '695506553780',
            icons: [
                {
                    src: path.resolve(__dirname, 'img', 'icons', 'icon-512x512.png'),
                    sizes: [96, 128, 192, 256, 384, 512]
                },
                {
                    src: path.resolve(__dirname, 'img', 'icons', 'maskable_icon.png'),
                    size: '512x512',
                    purpose: 'any maskable'
                }
            ]
        })
    ]
})