// #region NEXT.JS TYPES HACK
// TODO remove writeAppTypeDeclarations redeclare when this bug will be fixed: https://github.com/vercel/next.js/pull/30060

const fs = require('fs');
const os = interopRequireDefault(require('os'));
const nextTypesDeclarations = require('next/dist/lib/typescript/writeAppTypeDeclarations.js');

const originalWriteAppTypeDeclarations = nextTypesDeclarations.writeAppTypeDeclarations;

nextTypesDeclarations.writeAppTypeDeclarations = async (...args) => {
  await originalWriteAppTypeDeclarations(...args);
  const nextEnvFileContent = fs.readFileSync('next-env.d.ts', 'utf-8');

  const newFileContent = nextEnvFileContent.replace(
    '/// <reference types="next/image-types/global" />' + os.default.EOL,
    '',
  );

  fs.writeFileSync('next-env.d.ts', newFileContent, 'utf-8');
};
// #endregion

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const getPlugins = webpack => [
  new webpack.IgnorePlugin({
    resourceRegExp: /^scrypt$/,
  }),
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/,
  }),
];

const rules = [
  /* {
    test: /\.(ttf|eot|otf|woff(2)?)(\?[a-z0-9]+)?$/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]',
        publicPath: '/_next/static',
        outputPath: 'static',
      },
    },
  }, */
  {
    test: /\.(pdf)/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'docs/[name].[ext]',
        publicPath: '/_next/static',
        outputPath: 'static',
      },
    },
  },
  /* {
    use: {
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]',
        publicPath: '/_next/static',
        outputPath: 'static',
      },
    },
  }, */
  {
    test: /\.(html)/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        publicPath: '/_next/static',
        outputPath: 'static',
      },
    },
  },
];

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
];

module.exports = withBundleAnalyzer({
  webpack: (config, { webpack }) => {
    config.plugins.push(...getPlugins(webpack));
    config.module.rules.push(...rules);
    config.resolve.symlinks = false;

    return config;
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  pageExtensions: ['page.ts', 'page.tsx'],
  webpack5: true,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
});

function interopRequireDefault(obj) {
  return obj && obj.__esModule
    ? obj
    : {
        default: obj,
      };
}
