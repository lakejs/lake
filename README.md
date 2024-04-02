> This project is not complete yet, please DO NOT integrate it into your production.

# Lake

Lake is a browser-based editor that enables writing rich text directly inside of web pages or online applications. It focuses on editing web-friendly content and it is designed to provide better efficiency, stability and extensibility.

### Getting Started

#### Downloading Lake from CDN

Compressed copies of Lake files are available, you can download them from jsDelivr or UNPKG.

* jsDelivr: https://www.jsdelivr.com/package/npm/lakelib?path=dist&tab=files
* UNPKG: https://unpkg.com/browse/lakelib@latest/dist/

`lake-all.css` and `lake-all.min.js` are built with CodeMirror and PhotoSwipe, so they are very convenient to use. But if you have already imported these libraries in your page, then it is not the best approach, you had better use `lake.css` and `lake.min.js`, which are without large third-party libraries. To find out more to see [Rollup configuration](https://github.com/lakejs/lake/blob/master/rollup.config.mjs).

#### Downloading Lake using npm

Lake is registered as a package on npm. You can install the latest version of Lake with the following npm command.

```bash
npm install lakelib
```

#### Quick start

First, include the following lines of code in the `<head>` of an HTML page.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lakelib@latest/dist/lake-all.css" />
<script src="https://cdn.jsdelivr.net/npm/lakelib@latest/dist/lake-all.min.js"></script>
```

Then, in the HTML page add the following HTML code that will serve as a placeholder for an editor instance.

```html
<div class="lake-editor">
  <div class="lake-toolbar-root"></div>
  <div class="lake-root"></div>
</div>
```

Finally, call the following JavaScript code to render the editor.

```js
const editor = new Lake.Editor({
  root: '.lake-root',
  value: '<p><br /><focus /></p>',
});
editor.render();
new Lake.Toolbar({
  editor,
  root: '.lake-toolbar-root',
}).render();
```

### Development

First, you need to clone the repository and install all necessary dependencies. Then, start a composite server that contains an HTTP service and real-time bundling.

``` bash
# clone the repository
git clone https://github.com/lakejs/lake.git
# change your directory
cd lake
# install all dependencies
pnpm install
# build dependencies
pnpm build
# start a local server
pnpm start
```

You can now view all demos by opening `http://localhost:8080/examples/` URL.

### Running tests

Lake uses a lot of browser APIs and therefore it requires a real browser environment to run the tests. You can open `http://localhost:8080/tests/` to run all test cases visibly, or execute `pnpm test` command in your console to run the tests in headless mode. Both modes require starting the local server before running tests.

### License

[MIT](https://github.com/lakejs/lake/blob/master/LICENSE)
