window.defaultValue = `
<h3>Selection</h3>
<lake-box type="block" name="hr"></lake-box>
<p>The <code>&lt;focus /&gt;</code> tag represents the current position of the caret.</p>
<p><anchor />The <code>&lt;anchor /&gt;</code> and <code>&lt;focus /&gt;</code> tags represent the range of text selected by the user.<focus /></p>
<p><br /></p>

<h3>Inline styles</h3>
<lake-box type="block" name="hr"></lake-box>
<p>The <code>&lt;strong&gt;</code> tag represents <strong>Bold</strong>, which renders text that have strong importance, seriousness, or urgency.</p>
<p>The <code>&lt;i&gt;</code> tag represents <i>Italic</i>, which renders text with italicized style.</p>
<p>The <code>&lt;u&gt;</code> tag represents <u>Underline</u>, which renders text with a simple solid underline.</p>
<p>The <code>&lt;s&gt;</code> tag represents <s>Strikethrough</s>, which renders text with a strikethrough, or a line through it.</p>
<p>The <code>&lt;span&gt;</code> tag with its <code>font-family</code> property represents <span style="font-family: 'Arial Black';">Font family</span>, which sets a font family name for the selected text.</p>
<p>The <code>&lt;span&gt;</code> tag with its <code>font-size</code> property represents <span style="font-size: 24px;">Font size</span>.</p>
<p>The <code>&lt;span&gt;</code> tag with its <code>color</code> property represents <span style="color: #F5222D;">Font color</span>, which sets the foreground color for the selected text.</p>
<p>The <code>&lt;span&gt;</code> tag with its <code>background-color</code> property represents <span style="background-color: #FADB14;">Highlight</span>.</p>
<p>The <code>&lt;sup&gt;</code> tag represents <sup>Superscript</sup>, which renders text with a raised baseline using smaller text.</p>
<p>The <code>&lt;sub&gt;</code> tag represents <sub>Subscript</sub>, which renders text with a lowered baseline using smaller text.</p>
<p>The <code>&lt;code&gt;</code> tag represents <code>Inline code</code>, which displays a short fragment of computer code.</p>
<p><br /></p>

<h3>Headings</h3>
<lake-box type="block" name="hr"></lake-box>
<p>The <code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> tags represent six levels of section headings. <code>&lt;h1&gt;</code> is the highest section level and <code>&lt;h6&gt;</code> is the lowest.</p>
<h1>Heading level 1</h1>
<h2>Heading level 2</h2>
<h3>Heading level 3</h3>
<h4>Heading level 4</h4>
<h5>Heading level 5</h5>
<h6>Heading level 6</h6>
<p><br /></p>

<h3>Line break</h3>
<lake-box type="block" name="hr"></lake-box>
<p>The <code>&lt;br /&gt;</code> tag represents a line break in text.</p>
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
<p>The <code>&lt;blockquote&gt;</code> tag represents a block quotation.</p>
<blockquote>Normal quote</blockquote>
<blockquote type="success">Success</blockquote>
<blockquote type="info">Info</blockquote>
<blockquote type="warning">Warning</blockquote>
<blockquote type="error">Error</blockquote>
<p><br /></p>

<h3>Block Properties</h3>
<lake-box type="block" name="hr"></lake-box>
<p style="text-indent: 2em;">The block tag with its <code>text-indent</code> property represents the length of empty space (indentation) that is put before lines of text in a block.</p>
<p style="margin-left: 40px;">The block tag with its <code>margin-left</code> property represents the indentation of a block.</p>
<p style="text-align:center;">The block tag with its <code>text-align</code> property represents the horizontal alignment of the inline-level content inside a block.</p>
<p><br /></p>

<h3>Numbered list</h3>
<lake-box type="block" name="hr"></lake-box>
<ol start="1"><li>Mix flour, baking powder, sugar, and salt.</li></ol>
<ol start="2"><li>In another bowl, mix eggs, milk, and oil.</li></ol>
<ol start="3"><li>Stir both mixtures together.</li></ol>
<ol start="4"><li>Fill muffin tray 3/4 full.</li></ol>
<ol start="5"><li>Bake for 20 minutes.</li></ol>
<p><br /></p>
<blockquote>The list tag (<code>&lt;ol&gt;</code> or <code>&lt;ul&gt;</code>) with its <code>indent</code> attribute represents the indentation of the list.</blockquote>
<p><br /></p>
<ol start="1"><li>first item</li></ol>
<ol start="2"><li>second item</li></ol>
<ol start="1" indent="1"><li>second item first subitem</li></ol>
<ol start="2" indent="1"><li>second item second subitem</li></ol>
<ol start="3" indent="1"><li>second item third subitem</li></ol>
<ol start="1"><li>third item</li></ol>
<p><br /></p>

<h3>Bulleted list</h3>
<lake-box type="block" name="hr"></lake-box>
<ul><li>first item</li></ul>
<ul><li>second item</li></ul>
<ul><li>third item</li></ul>
<p><br /></p>

<h3>Checklist</h3>
<lake-box type="block" name="hr"></lake-box>
<ul type="checklist"><li value="true">first item</li></ul>
<ul type="checklist"><li value="false">second item</li></ul>
<ul type="checklist"><li value="false">third item</li></ul>
<p><br /></p>

<h3>Link</h3>
<lake-box type="block" name="hr"></lake-box>
<p>The <code>&lt;a&gt;</code> tag with its href attribute represents a hyperlink.</p>
<ul><li><a href="https://developer.mozilla.org/en-US/docs/Web" target="_blank">Documentation for Web developers</a></li></ul>
<ul><li><a href="https://github.com/" target="_blank">Github</a></li></ul>
<ul><li><a href="https://www.google.com/" target="_blank">Google</a></li></ul>
<p><br /></p>

<h3>Image</h3>
<lake-box type="block" name="hr"></lake-box>
<p><lake-box type="inline" name="image" value="eyJ1cmwiOiIuLi9hc3NldHMvaW1hZ2VzL2hlYXZlbi1sYWtlLTI1Ni5wbmciLCJzdGF0dXMiOiJkb25lIn0="></lake-box></p>
<p>Heaven Lake is a volcanic crater lake atop Changbai Mountain. In Korea, it is known as Paektu Mountain or Baekdu Mountain. It lies on the border between China and North Korea, and is roughly evenly divided between the two countries. It is recognized as the highest volcanic lake in the world by the Shanghai Office of the Guinness World Records.</p>
<p><br /></p>

<h3>Code block</h3>
<lake-box type="block" name="hr"></lake-box>
<lake-box type="block" name="codeBlock" value="eyJjb2RlIjoiZnVuY3Rpb24gbXlGdW5jKHRoZU9iamVjdCkge1xuICB0aGVPYmplY3QubWFrZSA9IFwiVG95b3RhXCI7XG59XG5cbmNvbnN0IG15Y2FyID0ge1xuICBtYWtlOiBcIkhvbmRhXCIsXG4gIG1vZGVsOiBcIkFjY29yZFwiLFxuICB5ZWFyOiAxOTk4LFxufTtcblxuY29uc29sZS5sb2cobXljYXIubWFrZSk7IC8vIFwiSG9uZGFcIlxubXlGdW5jKG15Y2FyKTtcbmNvbnNvbGUubG9nKG15Y2FyLm1ha2UpOyAvLyBcIlRveW90YVwiIn0="></lake-box>
<p><br /></p>

<h3>Table</h3>
<lake-box type="block" name="hr"></lake-box>
<p>The editor uses <code>&lt;table&gt;</code> tag to represent table tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.</p>
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
