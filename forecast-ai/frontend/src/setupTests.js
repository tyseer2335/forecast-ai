// src/setupTests.ts
import "@testing-library/jest-dom";
import { TextEncoder, ReadeableStream } from 'util';
import { TextDecoder } from 'util';


global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadeableStream;