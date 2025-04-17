// next-i18next.config.js
module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'hi'], // Add more locales as needed
    },
    localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  };
  