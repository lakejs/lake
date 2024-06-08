# Lake

[![CI](https://github.com/lakejs/lake/actions/workflows/ci.yml/badge.svg)](https://github.com/lakejs/lake/actions)
[![npm](https://img.shields.io/npm/v/lakelib)](https://npmjs.org/package/lakelib)
[![size](https://badgen.net/bundlephobia/minzip/lakelib?style=flat-square)](https://bundlephobia.com/package/lakelib)

---

Lake is a rich text editor for the web. It offers an excellent user experience and has an easy-to-use programming interface to allow further extension.

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

You can view all the demos by visiting `http://localhost:8080/examples/`.

## Running tests

Lake relies heavily on browser APIs and therefore requires a real browser environment to run the tests. You can run all test cases visibly by visiting `http://localhost:8080/tests/`. Alternatively, you can execute `pnpm test` command in your console to run the tests in headless mode.

## License

[MIT](https://github.com/lakejs/lake/blob/main/LICENSE)
