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

Lake depends on a lot of browser APIs and so needs a real browser environment for running the test cases. You can run all tests visibly by visiting `http://localhost:8080/tests/`, or execute the `pnpm test` command to run the tests in headless mode.

## License

Lake is released under the [MIT](https://github.com/lakejs/lake/blob/main/LICENSE) license. The licenses of its dependencies are:

| Dependency | License |
| -------------  | ------------- |
| [Phosphor Icons](https://phosphoricons.com/) | MIT |
| [Fluent Icons](https://fluenticons.co/) | MIT |
| [CodeMirror](https://codemirror.net/) | MIT |
| [debounce](https://github.com/sindresorhus/debounce) | MIT |
| [EventEmitter3](https://github.com/primus/eventemitter3) | MIT |
| [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal) | MIT |
| [Idiomorph](https://github.com/bigskysoftware/idiomorph) | BSD 2-Clause |
| [is-hotkey](https://github.com/ianstormtaylor/is-hotkey) | MIT |
| [KaTeX](https://katex.org/) | MIT |
| [rc-upload](https://github.com/react-component/upload) | MIT |
| [PhotoSwipe](https://photoswipe.com/) | MIT |
| [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n) | MIT |
