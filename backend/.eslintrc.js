module.exports = {
    "env": {
        "node": true,
        "es6": true,
        "jest": true
  },
    "extends": [
        'eslint:recommended',
        'plugin:prettier/recommended'
    ],

"files": [
        '.eslintrc.{js,cjs}',
        '*.ts',
        '*.js', // <- this part
    ],
      "parserOptions": {
        "ecmaVersion": 6,
    },

    "rules": {
        "prettier/prettier": [
            "warn", {
                "endOfLine": "auto"
            }
        ],
        "semi" : "warn",
        "no-console": "off",
        "quotes": [
            "warn",
            "singe",
            "allowTemplateLiterals", "true"
        ],
        "no-unused-vars": "WARN",
  },
};
