module.exports = {
    style: {
        postcssOptions: {
            plugins: [

            ],
        },
    },
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // eslint-disable-next-line no-param-reassign
            webpackConfig.resolve.fallback = {
              fs: false,
              http: false,
              https: false,
              zlib: false,
              crypto: false,
              stream: false,
              os: false,
              path: false,
            };
            return webpackConfig;
        },
    },
}