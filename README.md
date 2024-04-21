# Lake

Lake is a rich text editor for the web. It has a good user experience and provides easy-to-use programming interface to allow further extension.

## Downloading Lake from CDN

Compressed copies of Lake files are available, you can download them from jsDelivr or UNPKG.

* jsDelivr: https://www.jsdelivr.com/package/npm/lakelib
* UNPKG: https://unpkg.com/browse/lakelib/

## Downloading Lake using npm

Lake is registered as a package on npm. You can install the latest version of Lake with the following npm command.

```bash
npm install lakelib
```

## Quick start with CDN

Add the following lines of code in the `<head>` of an HTML page.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lakelib@latest/dist/lake.min.css" />
<script src="https://cdn.jsdelivr.net/npm/lakelib@latest/dist/lake.min.js"></script>
```

In the HTML page add the following HTML code that will serve as a placeholder for an editor instance.

```html
<div class="lake-editor">
  <div class="lake-toolbar-root"></div>
  <div class="lake-root"></div>
</div>
```

Call the following JavaScript code to render the editor.

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

## Quick start with npm

In the HTML page add the following HTML code that will serve as a placeholder for an editor instance.

```html
<div class="lake-editor">
  <div class="lake-toolbar-root"></div>
  <div class="lake-root"></div>
</div>
```

Call the following JavaScript code to render the editor.

```js
import 'lakelib/lib/lake.css';
import { Editor, Toolbar } from 'lakelib';

const toolbar = new Toolbar({
  root: '.lake-toolbar-root',
});
const editor = new Editor({
  root: '.lake-root',
  toolbar,
});
editor.render();
```

## Development

To build Lake or change source code, you need to download the repository and start a development server that contains an HTTP service and real-time bundling.

``` bash
# Clone the repository
git clone https://github.com/lakejs/lake.git
# Install dependencies
pnpm install
# Start a local server
pnpm dev
```

You can now view all demos by visiting `http://localhost:8080/examples/`.

## Running tests

Lake uses a lot of browser APIs and therefore it requires a real browser environment to run the tests. You can open `http://localhost:8080/tests/` to run all test cases visibly, or execute `pnpm test` command in your console to run the tests in headless mode.

## License

[MIT](https://github.com/lakejs/lake/blob/main/LICENSE)
