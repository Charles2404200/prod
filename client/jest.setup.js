import '@testing-library/jest-dom';
import 'whatwg-fetch';
if (!global.fetch) {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: async () => [] }));
}