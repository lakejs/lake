import { expect } from 'chai';
import { query } from '../../src/utils';
import { Nodes, HTMLParser } from '../../src/models';

describe('models.HTMLParser class', () => {

  let container: Nodes;

  beforeEach(() => {

    container = query('<div contenteditable="true" />');
    query(document.body).append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('getNodeList method: should remove type', () => {
    container.html('<ul type="invalid"><li>foo</li></ul>');
    const htmlParser = new HTMLParser(container);
    htmlParser.getNodeList();
    expect(container.find('ul').hasAttr('type')).to.equal(false);
  });

  it('getNodeList method: should keep type', () => {
    container.html('<ul type="checklist"><li>foo</li></ul>');
    const htmlParser = new HTMLParser(container);
    htmlParser.getNodeList();
    expect(container.find('ul').attr('type')).to.equal('checklist');
  });

  it('getNodeList method: should remove value', () => {
    container.html('<ul type="checklist"><li value="invalid">foo</li></ul>');
    const htmlParser = new HTMLParser(container);
    htmlParser.getNodeList();
    expect(container.find('li').hasAttr('value')).to.equal(false);
  });

  it('getNodeList method: should keep value', () => {
    container.html('<ul type="checklist"><li value="true">foo</li></ul>');
    const htmlParser = new HTMLParser(container);
    htmlParser.getNodeList();
    expect(container.find('li').attr('value')).to.equal('true');
  });

  it('getNodeList method: should remove text-align', () => {
    container.html('<ul style="text-align: invalid;"><li>foo</li></ul>');
    const htmlParser = new HTMLParser(container);
    htmlParser.getNodeList();
    expect(container.find('ul').css('text-align')).to.equal('');
  });

  it('getNodeList method: should keep text-align', () => {
    container.html('<ul style="text-align: right;"><li>foo</li></ul>');
    const htmlParser = new HTMLParser(container);
    htmlParser.getNodeList();
    expect(container.find('ul').css('text-align')).to.equal('right');
  });

  it('getNodeList method: should remove margin-left', () => {
    container.html('<ul style="margin-left: invalid;"><li>foo</li></ul>');
    const htmlParser = new HTMLParser(container);
    htmlParser.getNodeList();
    expect(container.find('ul').css('margin-left')).to.equal('');
  });

  it('getNodeList method: should keep margin-left', () => {
    container.html('<ul style="margin-left: 10px;"><li>foo</li></ul>');
    const htmlParser = new HTMLParser(container);
    htmlParser.getNodeList();
    expect(container.find('ul').css('margin-left')).to.equal('10px');
  });

  it('getNodeList method: should remove <temp1> and <temp2>', () => {
    container.html('<h1>foo</h1><p>bar<temp2>two</temp2></p><temp1>one</temp1>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(3);
    expect(container.find('h1').length).to.equal(1);
    expect(container.find('p').length).to.equal(1);
    expect(container.find('temp1').length).to.equal(0);
    expect(container.find('temp2').length).to.equal(0);
  });

  it('getNodeList method: should remove id="..."', () => {
    container.html('<h1 id="one">foo</h1><p id="...">bar</p>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('h1').attr('id')).to.equal('one');
    expect(container.find('p').hasAttr('id')).to.equal(false);
  });

  it('getNodeList method: should remove class="..."', () => {
    container.html('<h1 class="one">foo</h1><p class="...">bar</p>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('h1').attr('class')).to.equal('one');
    expect(container.find('p').hasAttr('class')).to.equal(false);
  });

  it('getNodeList method: should keep href', () => {
    container.html('<a href="http://url/">foo</a>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(1);
    expect(container.find('a').attr('href')).to.equal('http://url/');
  });

  it('getNodeList method: should remove target="..."', () => {
    container.html('<a href="http://url1/" target="_blank">foo</a><a href="http://url2/" target="...">bar</a>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(2);
    expect(container.find('a').attr('target')).to.equal('_blank');
    expect(container.find('a').eq(1).hasAttr('target')).to.equal(false);
  });

  it('getNodeList method: should remove margin', () => {
    container.html('<span style="color: red; background-color: blue; margin: 1px;">foo</span>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(1);
    expect(container.find('span').css('color')).to.equal('red');
    expect(container.find('span').css('background-color')).to.equal('blue');
    expect(container.find('span').css('margin')).to.equal('');
  });

  it('getNodeList method: should trim text in a block element', () => {
    container.html('<h1>\r\n\theading1</h1>\n\t<h2>heading2\r\n\t</h2>\ntext1<h3>\r\n\theading3\r\n\t</h3>text2\n<p> foo <strong> bar </strong></p>');
    const htmlParser = new HTMLParser(container);
    const nodeList = htmlParser.getNodeList();
    expect(nodeList.length).to.equal(6);
    expect(container.find('h1').html()).to.equal('heading1');
    expect(container.find('h2').html()).to.equal('heading2');
    expect(container.find('h2').next().text()).to.equal('text1');
    expect(container.find('h3').html()).to.equal('heading3');
    expect(container.find('h3').next().text()).to.equal('text2');
    expect(container.find('p').first().text()).to.equal('foo ');
    expect(container.find('strong').html()).to.equal(' bar ');
  });

  it('getHTML method: should remove type', () => {
    const input = '<ul type="invalid"><li>foo</li></ul>';
    const output = '<ul><li>foo</li></ul>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep type', () => {
    const input = '<ul type="checklist"><li>foo</li></ul>';
    const output = input;
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove value', () => {
    const input = '<ul type="checklist"><li value="invalid">foo</li></ul>';
    const output = '<ul type="checklist"><li>foo</li></ul>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep value', () => {
    const input = '<ul type="checklist"><li value="true">foo</li></ul>';
    const output = input;
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove text-align', () => {
    const input = '<ul style="text-align: invalid;"><li>foo</li></ul>';
    const output = '<ul><li>foo</li></ul>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep text-align', () => {
    const input = '<ul style="text-align: right;"><li>foo</li></ul>';
    const output = input;
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove margin-left', () => {
    const input = '<ul style="margin-left: invalid;"><li>foo</li></ul>';
    const output = '<ul><li>foo</li></ul>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep margin-left', () => {
    const input = '<ul style="margin-left: -10px;"><li>foo</li></ul>';
    const output = input;
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove <temp1> and <temp2>', () => {
    const input = '<h1>foo</h1><p>bar<temp2>two</temp2></p><temp1>one</temp1>';
    const output = '<h1>foo</h1><p>bartwo</p>one';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove id="..."', () => {
    const input = '<h1 id="one">foo</h1><p id="...">bar</p>';
    const output = '<h1 id="one">foo</h1><p>bar</p>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove class="..."', () => {
    const input = '<h1 class="one">foo</h1><p class="...">bar</p>';
    const output = '<h1 class="one">foo</h1><p>bar</p>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should keep href', () => {
    const input = '<a href="http://url/">foo</a>';
    const output = input;
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove target="..."', () => {
    const input = '<a href="http://url1/" target="_blank">foo</a><a href="http://url2/" target="...">bar</a>';
    const output = '<a href="http://url1/" target="_blank">foo</a><a href="http://url2/">bar</a>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove margin', () => {
    const input = '<span style="color: red; background-color: blue; margin: 1px;">foo</span>';
    const output = '<span style="color: red; background-color: blue;">foo</span>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should remove <embed />', () => {
    const input = '<p>bar<br /><embed /></p>';
    const output = '<p>bar<br /></p>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: including reserved characters', () => {
    const input = '<p>foo&lt;&gt;&quot;&amp; &nbsp; &nbsp; –—©\'</p>';
    const output = input;
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

  it('getHTML method: should trim text in a block element', () => {
    const input = '<h1>\r\n\theading1</h1>\n\t<h2>heading2\r\n\t</h2>\ntext1<h3>\r\n\theading3\r\n\t</h3>text2\n<p> foo <strong> bar </strong></p>';
    const output = '<h1>heading1</h1><h2>heading2</h2>text1<h3>heading3</h3>text2<p>foo <strong> bar </strong></p>';
    container.html(input);
    const htmlParser = new HTMLParser(container);
    expect(htmlParser.getHTML()).to.equal(output);
  });

});
