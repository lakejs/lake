import { expect } from 'chai';
import { query, safeTemplate } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { HTMLParser } from '../../src/parsers/html-parser';

describe('parsers / html-parser', () => {

  let container: Nodes;

  beforeEach(() => {
    container = query('<div contenteditable="true" />');
    query(document.body).append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('getHTML method: should remove type', () => {
    const input = '<ul type="invalid"><li>foo</li></ul>';
    const output = '<ul><li>foo</li></ul>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep type', () => {
    const input = '<ul type="checklist"><li>foo</li></ul>';
    const output = input;
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove value', () => {
    const input = '<ul type="checklist"><li value="invalid">foo</li></ul>';
    const output = '<ul type="checklist"><li>foo</li></ul>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep value', () => {
    const input = '<ul type="checklist"><li value="true">foo</li></ul>';
    const output = input;
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove text-align', () => {
    const input = '<ul style="text-align: invalid;"><li>foo</li></ul>';
    const output = '<ul><li>foo</li></ul>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep text-align', () => {
    const input = '<ul style="text-align: right;"><li>foo</li></ul>';
    const output = input;
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove margin-left', () => {
    const input = '<ul style="margin-left: invalid;"><li>foo</li></ul>';
    const output = '<ul><li>foo</li></ul>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep margin-left', () => {
    const input = '<ul style="margin-left: -10px;"><li>foo</li></ul>';
    const output = input;
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove <temp1> and <temp2>', () => {
    const input = '<h1>foo</h1><p>bar<temp2>two</temp2></p><temp1>one</temp1>';
    const output = '<h1>foo</h1><p>bartwo</p>one';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove id="..."', () => {
    const input = '<h1 id="one">foo</h1><p id="...">bar</p>';
    const output = '<h1 id="one">foo</h1><p>bar</p>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove class="..."', () => {
    const input = '<h1 class="one">foo</h1><p class="...">bar</p>';
    const output = '<h1 class="one">foo</h1><p>bar</p>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep href', () => {
    const input = '<a href="http://url/">foo</a>';
    const output = input;
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove target="..."', () => {
    const input = '<a href="http://url1/" target="_blank">foo</a><a href="http://url2/" target="...">bar</a>';
    const output = '<a href="http://url1/" target="_blank">foo</a><a href="http://url2/">bar</a>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove margin', () => {
    const input = '<span style="color: red; background-color: blue; margin: 1px;">foo</span>';
    const output = '<span style="color: red; background-color: blue;">foo</span>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove <embed />', () => {
    const input = '<p>bar<br /><embed /></p>';
    const output = '<p>bar<br /></p>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep table attributes', () => {
    const input = safeTemplate`
      <table border="1" style="border-collapse: collapse; width: 100%; border-width: 1px; border-color: red; border-style: solid; background-color: #eee;">
        <thead>
          <tr style="height: 20px;">
          <th style="border-color: blue; height: 25px;">a</th>
          <th style="border-color: green; background-color: #ddd; border-style: dotted; border-width: 2px; width: 100px; height: 25px;">b</th>
          <th style="border-color: green; height: 25px;">c</th>
        </tr>
      </thead>
        <tbody>
          <tr style="height: 30px;">
            <td style="border-color: blue; height: 46px;">a1</td>
            <td style="border-color: blue; height: 46px; width: 188px;">b1</td>
            <td style="border-color: blue; height: 46px;">c1</td>
          </tr>
          <tr style="height: 40px;">
          <td style="border-color: blue; height: 46px;">a2</td>
          <td style="border-color: blue; height: 46px; width: 188px;">b2</td>
          <td style="border-color: blue; height: 46px;">c2</td>
          </tr>
        </tbody>
      </table>
    `;
    const output = input;
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: including reserved characters', () => {
    const input = '<p>foo&lt;&gt;&quot;&amp; &nbsp; &nbsp; –—©\'</p>';
    const output = input;
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should not trim text around inline element', () => {
    const input = '<p>foo <strong> bold </strong> <a href="#">link</a> bar</p>';
    const output = '<p>foo <strong> bold </strong> <a href="#">link</a> bar</p>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should not trim text around inline box', () => {
    const input = '<p>&nbsp;foo  <lake-box type="inline" name="image"></lake-box>  bar&nbsp;</p><p>&nbsp;123&nbsp;</p>';
    const output = '<p>&nbsp;foo  <lake-box type="inline" name="image"></lake-box>  bar&nbsp;</p><p>&nbsp;123&nbsp;</p>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should trim text around block element', () => {
    const input = '<h1>\r\n\theading1</h1>\n\t<h2>heading2\r\n\t</h2>\ntext1<h3>\r\n\theading3\r\n\t</h3>text2\n<p>&nbsp;foo <strong> bar </strong></p>';
    const output = '<h1>heading1</h1><h2>heading2</h2>text1<h3>heading3</h3>text2<p>&nbsp;foo <strong> bar </strong></p>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should trim text around block box', () => {
    const input = '<h2>heading2</h2>\n\t<lake-box type="block" name="hr"></lake-box>\n\t<h2>heading2</h2>';
    const output = '<h2>heading2</h2><lake-box type="block" name="hr"></lake-box><h2>heading2</h2>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove comment', () => {
    const input = '<!-- StartFragment --><p>foo</p><!-- EndFragment -->';
    const output = '<p>foo</p>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should convert b into strong', () => {
    const input = '<b>foo</b>';
    const output = '<strong>foo</strong>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should convert em into i', () => {
    const input = '<i>foo</i>';
    const output = '<i>foo</i>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getNodeList method: should remove comment', () => {
    container.html('<!-- StartFragment --><p>foo</p><!-- EndFragment -->');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(1);
    expect(nodeList[0].name).to.equal('p');
    expect(nodeList[0].html()).to.equal('foo');
  });

  it('getHTML method: should remove all the nodes in the box element', () => {
    const input = '<lake-box type="block" name="image"><h1>\nheading1</h1><b>foo</b></lake-box>';
    const output = '<lake-box type="block" name="image"></lake-box>';
    const htmlParser = new HTMLParser(input);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getFragment method: should remove type', () => {
    container.html('<ul type="invalid"><li>foo</li></ul>');
    const htmlParser = new HTMLParser(container);
    const fragment = htmlParser.getFragment();
    expect(fragment.childNodes.length).to.equal(1);
    const ul = new Nodes(fragment.firstChild);
    expect(ul.name).to.equal('ul');
    expect(ul.hasAttr('type')).to.equal(false);
  });

  it('getFragment method: empty content', () => {
    const htmlParser = new HTMLParser('');
    const fragment = htmlParser.getFragment();
    expect(fragment.childNodes.length).to.equal(0);
  });

});
