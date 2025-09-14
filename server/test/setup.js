// prod/server/test/setup.js

const dotenv = require('dotenv');
dotenv.config({ path: './.env.test' });
jest.setTimeout(20000);