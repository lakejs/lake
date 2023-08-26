# lake-core@0.1.0 Plan

## To-do List

* [X] registering domains (lakejs.com, lakejs.org)
* [X] creating Github organization and repository (github.com/lakejs/lake-core)
* [X] publishing npm package (lake-core)
* [X] initializing project (TypeScript, ESLint, Rollup, pnpm, etc.)
* [X] utils
* [X] models
* [X] operations
* [X] plugins
* [ ] history (undo, redo)
* [ ] HTML parser
* [ ] markdown parser
* [ ] text parser
* [ ] paste
* [ ] select all
* [X] heading
* [X] blockquote
* [ ] list (numbered list, bulleted list, checklist)
* [ ] align (left, center, right, justify)
* [ ] indent (increase, decrease)
* [ ] bold
* [ ] italic
* [ ] underline
* [ ] strikethrough
* [ ] subscript
* [ ] superscript
* [ ] code
* [ ] font family
* [ ] font size
* [ ] text color
* [ ] highlight
* [ ] examples (Styles, Toolbar, Icons, etc.)
* [ ] documentation
* [ ] website

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
    * plugins.ts
    * commands.ts
    * nodes.ts
    * text.ts
    * range.ts
    * component.ts
    * history.ts
    * html-parser.ts
    * markdown-parser.ts
    * text-parser.ts
    * index.ts
  * operations
    * insert-contents.ts
    * delete-contents.ts
    * set-blocks.ts
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
  * plugins
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
    * horizontal-line/
    * image/
    * link/
    * table/
    * code-block/
  * main.ts
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
<anchor />selected contents<focus />
```
