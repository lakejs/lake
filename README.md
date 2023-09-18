# Lake

Lake is a WYSIWYG editor based on the browser that enables writing rich text directly inside of web pages or online applications. It focuses on editing web-friendly content and it is designed to provide better efficiency, stability and extensibility.

## Getting Started

First, you need to clone the repository and install all necessary dependencies. Then, start a combined server that includes both HTTP serving and real-time compilation. You can do this by running the following commands in your terminal.

``` bash
# clone the repository
git clone https://github.com/lakejs/lake-core.git
# change your directory
cd lake-core
# install all dependencies
pnpm install
# start a local server
pnpm start
```

### Open examples

```text
http://localhost:8080/examples/
```

### Run tests

```text
http://localhost:8080/tests/
```

### Analyze code

```bash
pnpm lint
```

### Build code

```bash
pnpm build
```

## License

[MIT](https://github.com/lakejs/lake-core/blob/master/LICENSE)
