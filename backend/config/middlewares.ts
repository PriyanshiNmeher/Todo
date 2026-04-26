// import type { Core } from '@strapi/strapi';

// const config: Core.Config.Middlewares = [
//   'strapi::logger',
//   'strapi::errors',
//   'strapi::security',
//   'strapi::cors',
//   'strapi::poweredBy',
//   'strapi::query',
//   'strapi::body',
//   'strapi::session',
//   'strapi::favicon',
//   'strapi::public',
// ];

// export default config;


module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'https://todo-backend-ku14.onrender.com',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
