'use strict';

module.exports = {
  extends: [
    'eslint-config-antife'
  ],
  plugins: [
    'react'
  ],
  rules: {
    'max-len': ['error', {
       'code': 300
    }],
    semi: [ 'error', 'always' ],
    'no-unused-vars': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error'
  }
};
