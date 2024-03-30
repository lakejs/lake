> This project is not complete yet, please DO NOT integrate it into your production.

# Lake

Lake is a browser-based editor that enables writing rich text directly inside of web pages or online applications. It focuses on editing web-friendly content and it is designed to provide better efficiency, stability and extensibility.

### Getting Started

First, you need to clone the repository and install all necessary dependencies. Then, start a combined server that includes both HTTP serving and real-time compilation. You can do this by running the following command in your terminal.

``` bash
# clone the repository
git clone https://github.com/lakejs/lake.git
# change your directory
cd lake
# install all dependencies
pnpm install
# start a local server
pnpm start
```

Now you can view all demos by opening `http://localhost:8080/examples/` URL.

### Running tests

Lake uses a lot of browser APIs and therefore it requires a real browser environment to run the tests. You can open `http://localhost:8080/tests/` to run all test cases visibly, or run `pnpm test` in your console to run the tests in headless mode. Both modes require starting the local server before running tests.

### License

[MIT](https://github.com/lakejs/lake/blob/master/LICENSE)
