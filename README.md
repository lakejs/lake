# Lake

[![CI](https://github.com/lakejs/lake/actions/workflows/ci.yml/badge.svg)](https://github.com/lakejs/lake/actions)
[![npm](https://img.shields.io/npm/v/lakelib)](https://npmjs.org/package/lakelib)
[![size](https://badgen.net/bundlephobia/minzip/lakelib?style=flat-square)](https://bundlephobia.com/package/lakelib)

---

Lake is a rich text editor for the web. It aims to be a user-friendly editor, and provides an easy-to-use programming interface to allow further extension.

[Examples](https://lakejs.org/examples/) · [Getting started](https://lakejs.org/guide/) · [Reference](https://lakejs.org/reference/)

## Development

To build Lake or modify its source code, you need to download the repository and start a development server that includes an HTTP service and real-time bundling.

``` bash
# Clone the repository
git clone https://github.com/lakejs/lake.git
# Install dependencies
pnpm install
# Start a local server
pnpm dev
```

You can now view all the demos by visiting `http://localhost:8080/examples/`.

## Running tests

Lake depends on a lot of browser APIs and ao needs a real browser environment for running the test cases. You can run all tests visibly by visiting `http://localhost:8080/tests/`, or execute `pnpm test` command to run the tests in headless mode.

## License

[MIT](https://github.com/lakejs/lake/blob/main/LICENSE)
