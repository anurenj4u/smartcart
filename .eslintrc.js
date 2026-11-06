module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/features/*/*'],
            message: 'Import other features through their index file.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['src/shared/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/features/*', '@/app/*'],
                message: 'Shared code cannot depend on features or the app.',
              },
            ],
          },
        ],
      },
    },
  ],
};
