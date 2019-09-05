module.exports = {
  "parser": "babel-eslint",
  "plugins": ["react"],
  "env": {
    "browser": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": { "jsx": true },
    "sourceType": "module"
  },
  "extends": "airbnb",
  "rules": {
    // Windows style (CRLF) or UNIX style (LF only) are both OK.
    "linebreak-style": 0,

    // It's OK to use console. Console calls should be dropped in production build.
    "no-console": 0,

    // It's OK to use ++/-- in a for loop.
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],

    // IMHO, it is perfectly OK to use underscore prefix in a method name to indicate
    // (**not to enforce**) a private method. Here is an interesting discussion about this:
    // https://github.com/airbnb/javascript/issues/1024
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],

    // It's conventional to use short circuit like: `callback && callback();`
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],

    "object-curly-newline": ["error", {
      "ObjectExpression": { "minProperties": 5, "consistent": true },
      "ObjectPattern": { "minProperties": 5, "consistent": true },
      "ExportDeclaration": { "minProperties": 5, "consistent": true },
      "ImportDeclaration": "never",
    }],

    // Being consistent is more important than being concise. Readability counts.
    "object-shorthand": ["error", "consistent"],

    // No special preference for destructuring from arrays and objects.
    "prefer-destructuring": 0,

    "quote-props": ["error", "consistent-as-needed"],

    // Deprecated. See: https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
    "jsx-a11y/label-has-for": 0,

    // Destructuring assignment should be used as appropriate. No need to enforce its usage.
    "react/destructuring-assignment": 0,

    // This rule is far too strict:
    // - It does not even allow inline elements such as `<h1>Title</h1>`;
    // - It requires no leading space to the expression -- that will mess up the indentations.
    "react/jsx-one-expression-per-line": 0
  }
};
