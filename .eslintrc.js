module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'eslint:recommended',
    '@vue/typescript',
    'plugin:vue/essential',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ["error", "never",],
    "no-extra-semi": "error",
    "arrow-body-style": ["error", "as-needed"]
  },
  parserOptions: {
    "parser": "@typescript-eslint/parser",
    "sourceType": "module",
    "ecmaFeatures": {
      "modules": true
    }
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
