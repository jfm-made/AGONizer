module.exports = {
    presets: [
        '@babel/preset-react',
        ['@babel/preset-env', {
            targets: { node: 'current' },
            debug: process.env.NODE_ENV === 'BUILD',
            useBuiltIns: 'usage',
        }],
    ],

    plugins: [
        '@babel/plugin-transform-regenerator',
        '@babel/plugin-proposal-class-properties'
    ]
};