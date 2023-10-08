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
* [X] history (undo, redo)
* [X] HTML parser
* [ ] markdown parser
* [X] text parser
* [X] paste
* [X] select all
* [X] heading
* [X] blockquote
* [ ] list (numbered list, bulleted list, checklist)
* [X] align (left, center, right, justify)
* [X] indent (increase, decrease)
* [X] bold
* [X] italic
* [X] underline
* [X] strikethrough
* [X] subscript
* [X] superscript
* [X] code
* [X] font family
* [X] font size
* [X] font color
* [X] highlight
* [ ] format painter
* [X] remove format
* [ ] hr
* [ ] image
* [ ] link
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
    * plugin.ts
    * command.ts
    * nodes.ts
    * text.ts
    * range.ts
    * card.ts
    * history.ts
    * html-parser.ts
    * markdown-parser.ts
    * text-parser.ts
    * index.ts
  * operations
    * get-state.ts
    * insert-contents.ts
    * delete-contents.ts
    * set-blocks.ts
    * split-block.ts
    * get-marks.ts
    * add-mark.ts
    * remove-mark.ts
    * split-marks.ts
    * add-link.ts
    * remove-link.ts
    * insert-card.ts
    * update-card.ts
    * delete-card.ts
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
    * font-color.ts
    * highlight.ts
    * format-painter.ts
    * remove-format.ts
    * hr/
    * image/
    * link/
    * table/
    * code-block/
  * core.ts
  * index.css
  * index.ts
* tests/
  * utils/
    * camel-case.test.ts
    * to-hex.test.ts
  * models/
    * nodes.test.ts
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
  <i>italic</i>
  <u>underline</u>
  <s>strikeThrough</s>
  <span style="font-family: Arial;">fontName</>
  <span style="font-size: 14px;">fontSize</span>
  <span style="color: red;">fontColor</span>
  <span style="background-color: #eeeeee;">highlight</span>
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
  <li>numbered list</li>
</ol>
<ol>
  <li>numbered list</li>
</ol>
<ul>
  <li>bulleted list</li>
</ul>
<ul>
  <li>bulleted list</li>
</ul>
<ul type="checklist">
  <li value="true">checklist</li>
<ul>
<ul type="checklist">
  <li value="false">checklist</li>
</ul>
<blockquote>
  blockquote
</blockquote>
<anchor />selected contents<focus />
```
