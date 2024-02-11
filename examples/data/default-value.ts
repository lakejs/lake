export const defaultValue = `
<h1>heading 1</h1>
<lake-box type="block" name="hr"></lake-box>
<p>foo<lake-box type="inline" name="image" value="eyJ1cmwiOiIuL2RhdGEvY293LmpwZyJ9"></lake-box>bar</p>
<h2>heading 2</h2>
<h3>heading 3</h3>
<h4>heading 4</h4>
<h5>heading 5</h5>
<h6>heading 6</h6>
<blockquote>normal</blockquote>
<blockquote type="success">success</blockquote>
<blockquote type="info">info</blockquote>
<blockquote type="warning">warning</blockquote>
<blockquote type="error">error</blockquote>
<p>
  <strong>bold</strong>
  <i>italic</i>
  <u>underline</u>
  <s>strikeThrough</s>
  <span style="font-family: Arial;">fontName</span>
  <span style="font-size: 14px;">fontSize</span>
  <span style="color: red;">fontColor</span>
  <span style="background-color: #eeeeee;">highlight</span>
  <sub>subscript</sub>
  <sup>superscript</sup>
  <code>code</code>
  <a href="url" target="_blank">link</a>
</p>
<p style="text-indent: 2em;">text indent</p>
<p style="margin-left: 40px;">indent</p>
<p style="text-align:center;">align</p>
<ol start="1"><li>numbered list</li></ol>
<ol start="2"><li>numbered list</li></ol>
<ol start="1" indent="1"><li>numbered list</li></ol>
<ol start="2" indent="1"><li>numbered list</li></ol>
<ol start="1" indent="2"><li>numbered list</li></ol>
<ol start="2" indent="2"><li>numbered list</li></ol>
<ol start="1"><li>numbered list</li></ol>
<ol start="2"><li>numbered list</li></ol>
<ul><li>bulleted list</li></ul>
<ul><li>bulleted list</li></ul>
<ul type="checklist"><li value="true">checklist</li></ul>
<ul type="checklist"><li value="false">checklist</li></ul>
<p><anchor />selected contents<focus /></p>
`;
