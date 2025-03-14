window.defaultValue = `
<h3>Slash commands</h3>
<lake-box type="block" name="hr"></lake-box>
<p>Start a line with <code>/</code> to display a popup menu containing commonly used commands. You can search for commands by typing <code>/keyword</code>.</p>
<p><br /></p>

<h3>Headings</h3>
<lake-box type="block" name="hr"></lake-box>
<p>Start a line with <code>#</code>, <code>##</code>, or <code>###</code> followed by a space to create a heading 1, heading 2, or heading 3.</p>
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
<p>Start a line with <code>&gt;</code> followed by a space to create a block quotation.</p>
<blockquote>This is a block quotation.</blockquote>
<p><br /></p>

<h3>Numbered list</h3>
<lake-box type="block" name="hr"></lake-box>
<p>Start a line with <code>1.</code> followed by a space to create a numbered list.</p>
<ol start="1"><li>first item</li></ol>
<ol start="2"><li>second item</li></ol>
<ol start="1" indent="1"><li>second item first subitem</li></ol>
<ol start="2" indent="1"><li>second item second subitem</li></ol>
<ol start="3" indent="1"><li>second item third subitem</li></ol>
<ol start="1"><li>third item</li></ol>
<p><br /></p>

<h3>Bulleted list</h3>
<lake-box type="block" name="hr"></lake-box>
<p>Start a line with <code>*</code>, <code>-</code>, or <code>+</code> followed by a space to create a bulleted list.</p>
<ul><li>first item</li></ul>
<ul><li>second item</li></ul>
<ul indent="1"><li>second item first subitem</li></ul>
<ul indent="1"><li>second item second subitem</li></ul>
<ul indent="1"><li>second item third subitem</li></ul>
<ul><li>third item</li></ul>
<p><br /></p>

<h3>Checklist</h3>
<lake-box type="block" name="hr"></lake-box>
<p>Start a line with <code>[]</code> or <code>[x]</code> followed by a space to create a checklist.</p>
<ul type="checklist"><li value="true">first item</li></ul>
<ul type="checklist"><li value="false">second item</li></ul>
<ul type="checklist" indent="1"><li value="false">second item first subitem</li></ul>
<ul type="checklist" indent="1"><li value="false">second item second subitem</li></ul>
<ul type="checklist" indent="1"><li value="false">second item third subitem</li></ul>
<ul type="checklist"><li value="false">third item</li></ul>
<p><br /></p>

<h3>Table</h3>
<lake-box type="block" name="hr"></lake-box>
<table>
  <tr>
    <td style="background-color: #0000000a;"><p style="text-align: center;"><strong>Tag name</strong></p></td>
    <td style="background-color: #0000000a;"><p style="text-align: center;"><strong>Description</strong></p></td>
  </tr>
  <tr>
    <td><code>&lt;table&gt;</code></td>
    <td>The tag represents tabular data.</td>
  </tr>
  <tr>
    <td><code>&lt;tr&gt;</code></td>
    <td>The tag represents a row of cells in a table.</td>
  </tr>
  <tr>
    <td><code>&lt;td&gt;</code></td>
    <td>The tag represents a cell of a table that contains data.</td>
  </tr>
</table>
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

<h3>Alerts</h3>
<lake-box type="block" name="hr"></lake-box>
<p>Start a line with <code>:::info</code>, <code>:::tip</code>, <code>:::warning</code>, or <code>:::danger</code> followed by an enter to create an alert.</p>
<blockquote type="info">Useful information that users should know, even when skimming content.</blockquote>
<blockquote type="tip">Helpful advice for doing things better or more easily.</blockquote>
<blockquote type="warning">Urgent info that needs immediate user attention to avoid problems.</blockquote>
<blockquote type="danger">Advises about risks or negative outcomes of certain actions.</blockquote>
<p><br /></p>

<h3>Link</h3>
<lake-box type="block" name="hr"></lake-box>
<ul><li><a href="https://developer.mozilla.org/en-US/docs/Web">Documentation for Web developers</a></li></ul>
<ul><li><a href="https://github.com/">Github</a></li></ul>
<ul><li><a href="https://www.google.com/">Google</a></li></ul>
<p><br /></p>

<h3>Image</h3>
<lake-box type="block" name="hr"></lake-box>
<p><lake-box type="inline" name="image" value="eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTUxMi5wbmciLCJzdGF0dXMiOiJkb25lIiwibmFtZSI6ImhlYXZlbi1sYWtlLTUxMi5wbmciLCJzaXplIjo2MDAwOCwidHlwZSI6ImltYWdlL2pwZWciLCJsYXN0TW9kaWZpZWQiOjE3MTAyMjk1MTcxOTgsIndpZHRoIjo1MTIsImhlaWdodCI6MzcwLCJvcmlnaW5hbFdpZHRoIjo1MTIsIm9yaWdpbmFsSGVpZ2h0IjozNzAsImNhcHRpb24iOiJPdmVyaGVhZCBwYW5vcmFtYSBvZiBIZWF2ZW4gTGFrZS4ifQ=="></lake-box></p>
<p><br /></p>

<h3>File</h3>
<lake-box type="block" name="hr"></lake-box>
<p><lake-box type="inline" name="file" value="eyJ1cmwiOiIuLi9hc3NldHMvZmlsZXMvdGhpbmstZGlmZmVyZW50LXdpa2lwZWRpYS5wZGYiLCJzdGF0dXMiOiJkb25lIiwibmFtZSI6IlRoaW5rIGRpZmZlcmVudCAtIFdpa2lwZWRpYS5wZGYiLCJzaXplIjo1MTA1NTgsInR5cGUiOiJhcHBsaWNhdGlvbi9wZGYiLCJsYXN0TW9kaWZpZWQiOjE3NDAwOTc3MTg1OTh9"></lake-box></p>
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
<p>Start a line with <code>\`\`\`</code> or <code>\`\`\`js</code> followed by an enter to create a code block.</p>
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

<h3>Mention</h3>
<lake-box type="block" name="hr"></lake-box>
<p>Type <code>@</code> to display a popup menu containing specified users. You can search for users by typing <code>@keyword</code>.</p>
<p><br /></p>

<h3>YouTube</h3>
<lake-box type="block" name="hr"></lake-box>
<p><lake-box type="inline" name="video" value="eyJ1cmwiOiJodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PTVzTUJoRHY0c2lrIn0="></lake-box></p>
<p><br /></p>

<h3>X (Tweet)</h3>
<lake-box type="block" name="hr"></lake-box>
<p><lake-box type="inline" name="twitter" value="eyJ1cmwiOiJodHRwczovL3guY29tL1N1cHBvcnQvc3RhdHVzLzExNDEwMzk4NDE5OTMzNTUyNjQifQ=="></lake-box></p>
<p><br /></p>

`;
