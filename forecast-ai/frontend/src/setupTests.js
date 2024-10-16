// src/setupTests.js
import '@testing-library/jest-dom/extend-expect';
import 'isomorphic-fetch';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill ReadableStream for node environment
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = require('web-streams-polyfill').ReadableStream;
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
