> This project is not complete yet, please DO NOT integrate it into your production.

# Lake

Lake is a rich text editor for the web. It has a good user experience and provides easy-to-use programming interface to allow further extension.

### Getting Started

#### Downloading Lake from CDN

Compressed copies of Lake files are available, you can download them from jsDelivr or UNPKG.

* jsDelivr: https://www.jsdelivr.com/package/npm/lakelib?path=dist&tab=files
* UNPKG: https://unpkg.com/browse/lakelib@latest/dist/

Note: `lake.min.js` is not built with CodeMirror, so if you need the code block feature, addtioanaly including `codemirror.min.js` to your page is needed. But if you do not need it, there is no need to include external CodeMirror file. To find out more, take a look at the [IIFE example](https://github.com/lakejs/lake/blob/master/examples/iife.html) and [Rollup configuration](https://github.com/lakejs/lake/blob/master/rollup.config.mjs).

#### Downloading Lake using npm

Lake is registered as a package on npm. You can install the latest version of Lake with the following npm command.

```bash
npm install lakelib
```

#### Quick start

First, add the following lines of code in the `<head>` of an HTML page.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lakelib@latest/dist/lake.css" />
<script src="https://cdn.jsdelivr.net/npm/lakelib@latest/dist/lake.min.js"></script>
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
const toolbar = new Lake.Toolbar({
  root: '.lake-toolbar-root',
});
const editor = new Lake.Editor({
  root: '.lake-root',
  toolbar,
});
editor.render();
```

### Development

To build Lake or change source code, you need to download the repository and start a development server that contains an HTTP service and real-time bundling.

``` bash
# clone the repository
git clone https://github.com/lakejs/lake.git
# change your directory
cd lake
# install all dependencies
pnpm install
# build CodeMirror
pnpm codemirror
# start a local server
pnpm start
```

You can now view all demos by visiting `http://localhost:8080/examples/`.

### Running tests

Lake uses a lot of browser APIs and therefore it requires a real browser environment to run the tests. You can open `http://localhost:8080/tests/` to run all test cases visibly, or execute `pnpm test` command in your console to run the tests in headless mode. Both modes require starting the local server before running tests.

### License

[MIT](https://github.com/lakejs/lake/blob/master/LICENSE)
