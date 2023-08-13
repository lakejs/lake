# lake-core@0.1.0 Plan

## To-do List

* [X] To register domains (lakejs.com, lakejs.org)
* [X] To create Github organization and repository (github.com/lakejs/lake-core)
* [X] To publish npm package (lake-core)
* [X] To initialize project (TypeScript, ESLint, Rollup, pnpm, etc.)
* [X] To add utils
* [ ] To add models
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
  * types/
    * native.ts
  * utils/
    * camel-case.ts
    * for-each.ts
    * get-document.ts
    * get-css.ts
    * index.ts
  * models/
    * nodes.ts
    * text.ts
    * range.ts
    * component.ts
    * history.ts
    * html-parser.ts
    * markdown-parser.ts
    * text-parser.ts
    * index.ts
  * commands
    * insert-contents.ts
    * delete-contents.ts
    * insert-block.ts
    * update-block.ts
    * delete-block.ts
    * split-block.ts
    * add-mark.ts
    * clear-mark.ts
    * toggle-mark.ts
    * split-mark.ts
    * add-link.ts
    * clear-link.ts
    * insert-component.ts
    * update-component.ts
    * delete-component.ts
    * index.ts
  * modules
    * edit-area.ts
    * paste.ts
    * undo.ts
    * redo.ts
    * select-all.ts
    * heading.ts
    * blockquote.ts
    * list.ts (numbered list, bulleted list, checklist)
    * align.ts (left, center, right, justify)
    * indent.ts (increase, decrease)
    * bold.ts
    * italic.ts
    * underline.ts
    * strikethrough.ts
    * subscript.ts
    * superscript.ts
    * code.ts
    * font-family.ts
    * font-size.ts
    * text-color.ts
    * highlight.ts
    * format-painter.ts
    * remove-format.ts
  * extensions/
    * horizontal-line/
    * image/
    * link/
    * table/
    * code-block/
  * index.ts
* tests/
  * utils/
    * camel-case.test.ts
    * get-document.test.ts
  * models/
    * element-list.test.ts
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
