<<<<<<< HEAD
=======
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


>>>>>>> b014853071efb80bbb0f4eb8689195a5c5d48db2
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
<<<<<<< HEAD
        'https://todo-two-peach.vercel.app',
=======
        'https://todo-backend-ku14.onrender.com',
>>>>>>> b014853071efb80bbb0f4eb8689195a5c5d48db2
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
