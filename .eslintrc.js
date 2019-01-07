module.exports = {
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  globals: {
    expect: true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  extends: "eslint:recommended",
  rules: {
    "no-console": 0,
    "no-mixed-spaces-and-tabs": 0,
    "no-useless-escape": 0,
    "no-cond-assign": 0
  }
};
