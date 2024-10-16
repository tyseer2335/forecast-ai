// src/setupTests.ts
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { ReadableStream } from "web-streams-polyfill";

global.TextEncoder = TextEncoder;
// @ts-expect-error
global.TextDecoder = TextDecoder;
// @ts-expect-error
global.ReadableStream = ReadableStream;