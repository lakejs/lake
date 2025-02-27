# Lake

[![CI](https://github.com/lakejs/lake/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/lakejs/lake/actions)
[![npm](https://img.shields.io/npm/v/lakelib)](https://npmjs.org/package/lakelib)
[![downloads](https://img.shields.io/npm/dm/lakelib)](https://www.npmjs.com/package/lakelib)

---

Lake is a rich text editor built for modern applications that require content creation like blog posts, user comments, and email composition. It aims to provide as many features as possible through a simple structure while remaining free for commercial use.

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

Lake is released under the [MIT](https://github.com/lakejs/lake/blob/main/LICENSE) license. Below are the licenses of its dependencies:

| Dependency | License | Author |
| -------------  | ------------- | ------------- |
| [Phosphor Icons](https://phosphoricons.com/) | MIT | Tobias Fried |
| [Fluent Icons](https://fluenticons.co/) | MIT | Microsoft |
| [CodeMirror](https://codemirror.net/) | MIT | Marijn Haverbeke |
| [debounce](https://github.com/sindresorhus/debounce) | MIT | Sindre Sorhus |
| [EventEmitter3](https://github.com/primus/eventemitter3) | MIT | Arnout Kazemier |
| [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal) | MIT | Evgeny Poberezkin |
| [Idiomorph](https://github.com/bigskysoftware/idiomorph) | BSD 2-Clause | Big Sky Software |
| [is-hotkey](https://github.com/ianstormtaylor/is-hotkey) | MIT | Ian Storm Taylor |
| [KaTeX](https://katex.org/) | MIT | Khan Academy |
| [rc-upload](https://github.com/react-component/upload) | MIT | Ant Design Team |
| [PhotoSwipe](https://photoswipe.com/) | MIT | Dmitry Semenov |
| [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n) | MIT | Hofer Ivan |
