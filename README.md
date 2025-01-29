# Lake

[![CI](https://github.com/lakejs/lake/actions/workflows/ci.yml/badge.svg)](https://github.com/lakejs/lake/actions)
[![npm](https://img.shields.io/npm/v/lakelib)](https://npmjs.org/package/lakelib)
[![size](https://badgen.net/bundlephobia/minzip/lakelib?style=flat-square)](https://bundlephobia.com/package/lakelib)

---

Lake is a browser-based rich text editor built for modern applications that require content creation like blog posts, user comments, and email composition. It aims to provide as many features as possible with a simple structure while being free for commercial use.

[Examples](https://lakejs.org/examples/) · [Getting started](https://lakejs.org/guide/) · [Reference](https://lakejs.org/reference/)

## Development

Want to customize Lake? Follow these steps to set up a local development environment:

``` bash
# Clone the repository
git clone https://github.com/lakejs/lake.git

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Once the server is running, you can open `http://localhost:8080/examples/` to try the demos.

## Testing

Since Lake relies on various browser APIs, tests need to run in a real browser environment. You have two options:

* Open `http://localhost:8080/tests/` to run tests in a visible browser window.

* Run tests in headless mode with the `pnpm test` command.

## License

Lake is released under the [MIT](https://github.com/lakejs/lake/blob/main/LICENSE) license. Below is a list of licenses for its dependencies:

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
