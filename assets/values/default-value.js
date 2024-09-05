window.defaultValue = `
<h3>Heading</h3>
<lake-box type="block" name="hr"></lake-box>
<p>At the beginning of a paragraph, input <code>#</code>, <code>##</code>, or <code>###</code> followed by a space to create a heading 1, heading 2, or heading 3.</p>
<h1>Heading level 1</h1>
<h2>Heading level 2</h2>
<h3>Heading level 3</h3>
<h4>Heading level 4</h4>
<h5>Heading level 5</h5>
<h6>Heading level 6</h6>
<p><br /></p>

<h3>Line break</h3>
<lake-box type="block" name="hr"></lake-box>
<p>Press <code>Shift+Enter</code> key to insert a line break in text.</p>
<p><br /></p>
<p>
  O’er all the hilltops<br />
  Is quiet now,<br />
  In all the treetops<br />
  Hearest thou<br />
  Hardly a breath;<br />
  The birds are asleep in the trees:<br />
  Wait, soon like these<br />
  Thou too shalt rest.
</p>
<p><br /></p>

<h3>Block quotation</h3>
<lake-box type="block" name="hr"></lake-box>
<p>At the beginning of a paragraph, input <code>&gt;</code> followed by a space to create a block quotation.</p>
<blockquote>This is a block quotation.</blockquote>
<p><br /></p>

<h3>Numbered list</h3>
<lake-box type="block" name="hr"></lake-box>
<p>At the beginning of a paragraph, input <code>1.</code> followed by a space to create a numbered list.</p>
<ol start="1"><li>first item</li></ol>
<ol start="2"><li>second item</li></ol>
<ol start="1" indent="1"><li>second item first subitem</li></ol>
<ol start="2" indent="1"><li>second item second subitem</li></ol>
<ol start="3" indent="1"><li>second item third subitem</li></ol>
<ol start="1"><li>third item</li></ol>
<p><br /></p>

<h3>Bulleted list</h3>
<lake-box type="block" name="hr"></lake-box>
<p>At the beginning of a paragraph, input <code>*</code>, <code>-</code>, or <code>+</code> followed by a space to create a bulleted list.</p>
<ul><li>first item</li></ul>
<ul><li>second item</li></ul>
<ul indent="1"><li>second item first subitem</li></ul>
<ul indent="1"><li>second item second subitem</li></ul>
<ul indent="1"><li>second item third subitem</li></ul>
<ul><li>third item</li></ul>
<p><br /></p>

<h3>Checklist</h3>
<lake-box type="block" name="hr"></lake-box>
<p>At the beginning of a paragraph, input <code>[]</code> or <code>[x]</code> followed by a space to create a checklist.</p>
<ul type="checklist"><li value="true">first item</li></ul>
<ul type="checklist"><li value="false">second item</li></ul>
<ul type="checklist" indent="1"><li value="false">second item first subitem</li></ul>
<ul type="checklist" indent="1"><li value="false">second item second subitem</li></ul>
<ul type="checklist" indent="1"><li value="false">second item third subitem</li></ul>
<ul type="checklist"><li value="false">third item</li></ul>
<p><br /></p>

<h3>Text indentation</h3>
<lake-box type="block" name="hr"></lake-box>
<p>This is the first paragraph of text.</p>
<p style="text-indent: 2em;">This is the second paragraph.</p>
<p>This is the third paragraph.</p>
<p><br /></p>

<h3>Text alignment</h3>
<lake-box type="block" name="hr"></lake-box>
<p>This is the first paragraph of text.</p>
<p style="text-align: center;">This is the second paragraph.</p>
<p>This is the third paragraph.</p>
<p><br /></p>

<h3>Text styles</h3>
<lake-box type="block" name="hr"></lake-box>
<p>
  <strong>Bold</strong>,
  <i>Italic</i>,
  <u>Underline</u>,
  <s>Strikethrough</s>,
  <span style="font-family: 'Arial Black';">Font family</span>,
  <span style="font-size: 24px;">Font size</span>,
  <span style="color: #F5222D;">Font color</span>,
  <span style="background-color: #FADB14;">Highlight</span>,
  <sup>Superscript</sup>,
  <sup>Subscript</sup>,
  <code>Inline code</code>
</p>
<p><br /></p>

<h3>Alert block</h3>
<lake-box type="block" name="hr"></lake-box>
<p>At the beginning of a paragraph, input <code>:::info</code>, <code>:::warning</code>, or <code>:::danger</code> followed by an enter to create an alert block.</p>
<blockquote type="info">This is an info box.</blockquote>
<blockquote type="tip">This is a tip.</blockquote>
<blockquote type="warning">This is a warning.</blockquote>
<blockquote type="danger">This is a dangerous warning.</blockquote>
<p><br /></p>

<h3>Link</h3>
<lake-box type="block" name="hr"></lake-box>
<ul><li><a href="https://developer.mozilla.org/en-US/docs/Web">Documentation for Web developers</a></li></ul>
<ul><li><a href="https://github.com/">Github</a></li></ul>
<ul><li><a href="https://www.google.com/">Google</a></li></ul>
<p><br /></p>

<h3>Image</h3>
<lake-box type="block" name="hr"></lake-box>
<p><lake-box type="inline" name="image" value="eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTUxMi5wbmciLCJzdGF0dXMiOiJkb25lIiwibmFtZSI6ImhlYXZlbi1sYWtlLTUxMi5wbmciLCJzaXplIjo2MDAwOCwidHlwZSI6ImltYWdlL2pwZWciLCJsYXN0TW9kaWZpZWQiOjE3MTAyMjk1MTcxOTgsIndpZHRoIjo1MTIsImhlaWdodCI6MzcwfQ=="></lake-box></p>
<p>Heaven Lake is a volcanic crater lake atop Changbai Mountain. In Korea, it is known as Paektu Mountain or Baekdu Mountain. It lies on the border between China and North Korea, and is roughly evenly divided between the two countries. It is recognized as the highest volcanic lake in the world by the Shanghai Office of the Guinness World Records.</p>
<p><br /></p>

<h3>Video</h3>
<lake-box type="block" name="hr"></lake-box>
<p><lake-box type="inline" name="video" value="eyJ1cmwiOiJodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PTVzTUJoRHY0c2lrIn0="></lake-box></p>
<p>Think Different</p>
<p>Here's to the crazy ones. The misfits. The rebels. The troublemakers. The round pegs in the square holes. The ones who see things differently. They're not fond of rules. And they have no respect for the status quo.</p>
<p>You can quote them, disagree with them, glorify or vilify them. About the only thing you can't do is ignore them. Because they change things. They push the human race forward. And while some may see them as the crazy ones, we see genius.</p>
<p>Because the people who are crazy enough to think they can change the world, are the ones who do.</p>
<p>- Apple Inc.</p>
<p><br /></p>

<h3>File</h3>
<lake-box type="block" name="hr"></lake-box>
<p><lake-box type="inline" name="file" value="eyJ1cmwiOiIuLi9hc3NldHMvZmlsZXMvaGVhdmVuLWxha2Utd2lraXBlZGlhLnBkZiIsInN0YXR1cyI6ImRvbmUiLCJuYW1lIjoiSGVhdmVuIExha2UgLSBXaWtpcGVkaWEucGRmIiwic2l6ZSI6NzQ3Mzg1LCJ0eXBlIjoiYXBwbGljYXRpb24vcGRmIiwibGFzdE1vZGlmaWVkIjoxNzE1OTM1MjE1MzA5fQ=="></lake-box></p>
<p><br /></p>

<h3>Emoji using image</h3>
<lake-box type="block" name="hr"></lake-box>
<ul>
  <li>Face blowing a kiss: <lake-box type="inline" name="emoji" value="eyJ1cmwiOiIuLi9hc3NldHMvZW1vamlzL2ZhY2VfYmxvd2luZ19hX2tpc3NfY29sb3Iuc3ZnIiwidGl0bGUiOiJGYWNlIGJsb3dpbmcgYSBraXNzIn0="></lake-box></li>
  <li>Face exhaling: <lake-box type="inline" name="emoji" value="eyJ1cmwiOiIuLi9hc3NldHMvZW1vamlzL2ZhY2VfZXhoYWxpbmdfY29sb3Iuc3ZnIiwidGl0bGUiOiJGYWNlIGV4aGFsaW5nIn0="></lake-box></li>
</ul>
<p><br /></p>

<h3>Emoji using special character</h3>
<lake-box type="block" name="hr"></lake-box>
<ul>
  <li>Grinning face with big eyes: 😃</li>
  <li>Beaming face with smiling eyes: 😁</li>
</ul>
<p><br /></p>

<h3>Code block</h3>
<lake-box type="block" name="hr"></lake-box>
<p>At the beginning of a paragraph, input <code>\`\`\`</code> or <code>\`\`\`js</code> followed by a enter to create a code block.</p>
<lake-box type="block" name="codeBlock" value="eyJjb2RlIjoiZnVuY3Rpb24gbXlGdW5jKHRoZU9iamVjdCkge1xuICB0aGVPYmplY3QubWFrZSA9IFwiVG95b3RhXCI7XG59XG5cbmNvbnN0IG15Y2FyID0ge1xuICBtYWtlOiBcIkhvbmRhXCIsXG4gIG1vZGVsOiBcIkFjY29yZFwiLFxuICB5ZWFyOiAxOTk4LFxufTtcblxuY29uc29sZS5sb2cobXljYXIubWFrZSk7IC8vIFwiSG9uZGFcIlxubXlGdW5jKG15Y2FyKTtcbmNvbnNvbGUubG9nKG15Y2FyLm1ha2UpOyAvLyBcIlRveW90YVwiIiwibGFuZyI6ImphdmFzY3JpcHQifQ=="></lake-box>
<blockquote type="tip">This feature is based on <a href="https://codemirror.net/">CodeMirror</a>.</blockquote>
<p><br /></p>

<h3>Mathematical formula</h3>
<lake-box type="block" name="hr"></lake-box>
<ul>
  <li>Difference of squares: <lake-box type="inline" name="equation" value="eyJjb2RlIjoiYV4yLWJeMj0oYStiKShhLWIpIn0="></lake-box></li>
  <li>Difference of cubes: <lake-box type="inline" name="equation" value="eyJjb2RlIjoiYV4zLWJeMz0oYS1iKShhXjIrYWIrYl4yKSJ9"></lake-box></li>
</ul>
<p><br /></p>

<h3>Table</h3>
<lake-box type="block" name="hr"></lake-box>
<p>Lake does not support advanced table editing now, but we plan to add this feature in the next major version.</p>
<table>
  <tr>
    <td style="width: 100px; border: 1px solid rgb(160 160 160); text-align: center;"><strong>Tag name</strong></td>
    <td style="border: 1px solid rgb(160 160 160); text-align: center;"><strong>Description</strong></td>
  </tr>
  <tr>
    <th style="border: 1px solid rgb(160 160 160);"><code>&lt;tr&gt;</code></th>
    <td style="border: 1px solid rgb(160 160 160);">The tag represents a row of cells in a table.</td>
  </tr>
  <tr>
    <th style="border: 1px solid rgb(160 160 160);"><code>&lt;td&gt;</code></th>
    <td style="border: 1px solid rgb(160 160 160);">The tag represents a cell of a table that contains data.</td>
  </tr>
</table>
<p><br /></p>
`;
