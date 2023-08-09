# lake.js@0.1.0 Plan

## To-do List

* [Y] To register domains (lakejs.com, lakejs.org)
* [Y] To create Github organization and repository (github.com/lakejs/lakejs)
* [X] To publish npm package
* [Y] To initialize project (TypeScript, ESLint, Rollup, Yarn, etc.)
* [Y] To add utils library
* [X] To add ElementList class
* [X] To add TextNode class
* [X] To add Range class
* [X] To add core commmands
* [X] To add Editor class
* [X] To add examples (Styles, Toolbar, Icons, etc.)
* [X] To write documentation

## File Tree

* assets/
* dist/
* docs/
* examples/
* lib/
* src/
  * utils/
    * camel-case.ts
    * for-each.ts
    * search-string.ts
    * rgb-to-hex.ts
  * dom/
    * get-document.ts
    * get-window.ts
    * get-computed-css.ts
    * element-list.ts
    * text-node.ts
    * range.ts
  * changes
    * add-block.ts
    * remove-block.ts
    * add-mark.ts
    * remove-mark.ts
    * split-block.ts
    * split-mark.ts
* tests/
  * utils/
    * camel-case.test.ts
  * dom/
    * get-document.ts
  * index.ts
  * index.html
* package.json
* tsconfig.json
* README.md
* LICENSE

## Editor Commands

* formatBlock
* bold
* italic
* underline
* strikeThrough
* fontName
* fontSize
* foreColor
* hiliteColor
* subscript
* superscript
* removeFormat
* link
* unlink
* indent
* outdent
* orderedList
* unorderedList
* checkboxList
* justifyLeft
* justifyCenter
* justifyRight
* justifyFull
* horizontalRule
* image
* undo
* redo
* selectAll

* to build website
