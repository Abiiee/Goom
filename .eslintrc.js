module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        'no-empty': 'off',
        'prefer-const': 'warn',
        'no-unused-vars': 'warn',
        quotes: ['warn', 'single'],
        'no-empty-function': 'warn',
        'eol-last': ['warn', 'never'],
        'comma-dangle': ['warn', 'never'],
        'quote-props': ['warn', 'as-needed'],
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'off',
        semi: ['warn', 'always', { omitLastInOneLineBlock: true }]
    },
    ignorePatterns: [
        'node_module',
        'dist'
    ]
};