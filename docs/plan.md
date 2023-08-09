# lake.js@0.1.0 Plan

## To-do List

* [X] To register domains (lakejs.com, lakejs.org)
* [X] To create Github organization and repository (github.com/lakejs/lakejs)
* [ ] To publish npm package
* [X] To initialize project (TypeScript, ESLint, Rollup, Yarn, etc.)
* [X] To add utils library
* [ ] To add ElementList class
* [ ] To add TextNode class
* [ ] To add Range class
* [ ] To add core commmands
* [ ] To add Editor class
* [ ] To add examples (Styles, Toolbar, Icons, etc.)
* [ ] To write documentation

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
