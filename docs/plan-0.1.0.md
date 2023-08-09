# lake-core@0.1.0 Plan

## To-do List

* [X] To register domains (lakejs.com, lakejs.org)
* [X] To create Github organization and repository (github.com/lakejs/lake-core)
* [X] To publish npm package (lake-core)
* [X] To initialize project (TypeScript, ESLint, Rollup, pnpm, etc.)
* [X] To add utils
* [ ] To add classes
* [ ] To add commands
* [ ] To add modules
* [ ] To add extensions
* [ ] To add examples (Styles, Toolbar, Icons, etc.)
* [ ] To write documentation
* [ ] To create website

## File Tree

* assets/ : third-party static library
* dist/ : build output for IIFE and bundle
* docs/
* examples/
* lib/ : build output for npm
* src/
  * utils/
    * camel-case.ts
    * for-each.ts
    * search-string.ts
    * rgb-to-hex.ts
    * get-document.ts
    * get-window.ts
    * get-computed-css.ts
    * index.ts
  * classes/
    * element-list.ts
    * text-node.ts
    * node-range.ts
    * card.ts
    * history.ts
    * html-parser.ts
    * markdown-parser.ts
    * text-parser.ts
    * index.ts
  * commands
    * insert-content.ts
    * remove-content.ts
    * insert-block.ts
    * update-block.ts
    * delete-block.ts
    * split-block.ts
    * add-mark.ts
    * clear-mark.ts
    * toggle-mark.ts
    * split-mark.ts
    * insert-card.ts
    * update-card.ts
    * delete-card.ts
    * index.ts
  * modules
    * edit-area.ts
    * undo.ts
    * redo.ts
    * paste.ts
    * heading.ts
    * bold.ts
    * italic.ts
    * underline.ts
    * strike-through.ts
    * font-size.ts
    * fore-color.ts
    * hilite-color.ts
    * brush.ts
    * remove-format.ts
    * subscript.ts
    * superscript.ts
    * list.ts (ordered, unordered, task)
    * align.ts (left, center, right, full)
    * indent.ts (indent, outdent)
    * quote.ts
    * select-all.ts
  * extensions/
    * hr/
    * image/
    * link/
    * table/
    * code-block/
  * index.ts
* tests/
  * utils/
    * camel-case.test.ts
    * get-document.ts
  * classes/
    * element-list.ts
  * index.ts
  * index.html
* package.json
* tsconfig.json
* README.md
* LICENSE

## Content Format

```html
<h1>heading 1</h1>
<h2>heading 2</h2>
<h3>heading 3</h3>
<h4>heading 4</h4>
<h5>heading 5</h5>
<h6>heading 6</h6>
<p>
  <strong>bold</strong>
  <em>italic</em>
  <span style="text-decoration: underline;">underline</span>
  <span style="text-decoration: line-through;">strikeThrough</span>
  <span style="font-family: Arial;">fontName</>
  <span style="font-size: 14px;">fontSize</span>
  <span style="color: red;">foreColor</span>
  <span style="background-color: #eeeeee;">hiliteColor</span>
  <sub>subscript</sub>
  <sup>superscript</sup>
  <code>code</code>
  <a href="url" target="_blank">link</a>
</p>
<p style="text-indent: 2em;">
  indent
</p>
<p style="text-align:center;">
  align
</p>
<ol>
  <li>ordered list</li>
</ol>
<ul>
  <li>unordered list</li>
</ul>
<ul type="task-list">
  <li value="true">task list</li>
  <li value="false">task list</li>
</ul>
<blockquote>
  block quote
</blockquote>
```

## Editor Commands

The following commands are from [document.execCommand() method](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand).

* heading
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
* createLink
* unlink
* indent
* outdent
* insertOrderedList
* insertUnorderedList
* insertParagraph
* insertText
* insertHTML
* justifyLeft
* justifyCenter
* justifyRight
* justifyFull
* horizontalRule
* insertImage
* undo
* redo
* selectAll
* paste
* delete
* forwardDelete
