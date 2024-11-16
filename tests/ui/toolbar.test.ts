import sinon from 'sinon';
import { click, removeBoxValueFromHTML, base64ToArrayBuffer } from '../utils';
import { debug } from '../../src/utils/debug';
import { query } from '../../src/utils/query';
import { getBox } from '../../src/utils/get-box';
import { Nodes } from '../../src/models/nodes';
import { Toolbar } from '../../src/ui/toolbar';
import { Editor } from '../../src';

const imgBuffer = base64ToArrayBuffer('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/orejrsAAAAASUVORK5CYII=');

const toolbarItems = [
  'undo',
  'redo',
  '|',
  'heading',
  'fontFamily',
  'fontSize',
  '|',
  'formatPainter',
  'removeFormat',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'superscript',
  'subscript',
  'code',
  'moreStyle',
  '|',
  'fontColor',
  'highlight',
  '|',
  'list',
  'numberedList',
  'bulletedList',
  'checklist',
  '|',
  'align',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignJustify',
  '|',
  'indent',
  'increaseIndent',
  'decreaseIndent',
  '|',
  'link',
  'image',
  'video',
  'file',
  'codeBlock',
  'blockQuote',
  'paragraph',
  'hr',
  '|',
  'selectAll',
];

describe('ui / toolbar', () => {

  let rootNode: Nodes;
  let editor: Editor;
  let toolbar: Toolbar;
  let xhr: sinon.SinonFakeXMLHttpRequestStatic;
  let requests: sinon.SinonFakeXMLHttpRequest[];

  before(() => {
    rootNode = query('<div class="lake-editor"><div class="lake-toolbar-root"></div><div class="lake-root"></div></div>');
    query(document.body).append(rootNode);
    const toolbarNode = rootNode.find('.lake-toolbar-root');
    toolbar = new Toolbar({
      root: toolbarNode,
      items: toolbarItems,
    });
    editor = new Editor({
      root: rootNode.find('.lake-root'),
      toolbar,
      value: '<p><focus /><br /></p>',
    });
    editor.render();
  });

  after(() => {
    editor.unmount();
    rootNode.remove();
  });

  it('undo: clicks button', () => {
    editor.command.execute('heading', 'h2');
    expect(editor.getValue()).to.equal('<h2><focus /><br /></h2>');
    const buttonNode = toolbar.container.find('button[name="undo"]');
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(true);
    buttonNode.emit('mouseleave');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    click(buttonNode);
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><focus /><br /></p>');
  });

  it('redo: clicks button', () => {
    editor.command.execute('heading', 'h2');
    expect(editor.getValue()).to.equal('<h2><focus /><br /></h2>');
    click(toolbar.container.find('button[name="undo"]'));
    click(toolbar.container.find('button[name="redo"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<h2><focus /><br /></h2>');
  });

  it('heading: selects an item and updates state', done => {
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="heading"] .lake-dropdown-title'));
      const visibility = toolbar.container.find('div[name="heading"] li[value="h3"] .lake-dropdown-menu-check').computedCSS('visibility');
      const titleText = toolbar.container.find('div[name="heading"] .lake-dropdown-text').text();
      expect(visibility).to.equal('visible');
      expect(titleText).to.equal('Heading 3');
      done();
    });
    const titleNode = toolbar.container.find('div[name="heading"] .lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(true);
    titleNode.emit('mouseleave');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    click(toolbar.container.find('div[name="heading"] li[value="h3"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<h3><focus /><br /></h3>');
  });

  it('paragraph: clicks button', () => {
    editor.setValue('<h3><focus /><br /></h3>');
    click(toolbar.container.find('button[name="paragraph"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><focus /><br /></p>');
  });

  it('blockQuote: clicks button', () => {
    editor.setValue('<p><focus /><br /></p>');
    click(toolbar.container.find('button[name="blockQuote"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<blockquote><focus /><br /></blockquote>');
  });

  it('fontFamily: selects an item and updates state', done => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="fontFamily"] .lake-dropdown-down-icon'));
      const visibility = toolbar.container.find('div[name="fontFamily"] li[value="Tahoma"] .lake-dropdown-menu-check').computedCSS('visibility');
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.container.find('div[name="fontFamily"] .lake-dropdown-title'));
    click(toolbar.container.find('div[name="fontFamily"] li[value="Tahoma"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="font-family: Tahoma;">foo</span><focus /></p>');
  });

  it('fontSize: selects an item and updates state', done => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="fontSize"] .lake-dropdown-down-icon'));
      const visibility = toolbar.container.find('div[name="fontSize"] li[value="32px"] .lake-dropdown-menu-check').computedCSS('visibility');
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.container.find('div[name="fontSize"] .lake-dropdown-title'));
    click(toolbar.container.find('div[name="fontSize"] li[value="32px"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="font-size: 32px;">foo</span><focus /></p>');
  });

  it('formatPainter: clicks button', () => {
    editor.setValue('<p><strong>foo<focus /></strong></p><p>bar</p>');
    click(toolbar.container.find('button[name="formatPainter"]'));
    editor.selection.range.selectNodeContents(editor.container.find('p').eq(1));
    click(editor.container);
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><strong>foo</strong></p><p><anchor /><strong>bar</strong><focus /></p>');
  });

  it('removeFormat: clicks button', () => {
    editor.setValue('<p><anchor /><strong>bar</strong><focus /></p>');
    click(toolbar.container.find('button[name="removeFormat"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor />bar<focus /></p>');
  });

  it('bold: clicks button and updates state', done => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    editor.event.once('statechange', () => {
      const isSelected = toolbar.container.find('button[name="bold"].lake-button-selected').length > 0;
      expect(isSelected).to.equal(true);
      done();
    });
    click(toolbar.container.find('button[name="bold"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><strong>bar</strong><focus /></p>');
  });

  it('bold: should execute bold at the correct position after selecting outside the container', done => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    editor.event.once('statechange', () => {
      const isSelected = toolbar.container.find('button[name="bold"].lake-button-selected').length > 0;
      expect(isSelected).to.equal(true);
      done();
    });
    const nativeRange = document.createRange();
    nativeRange.setStart(document.body, 0);
    const nativeSelection = window.getSelection();
    nativeSelection?.removeAllRanges();
    nativeSelection?.addRange(nativeRange);
    click(toolbar.container.find('button[name="bold"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><strong>bar</strong><focus /></p>');
  });

  it('italic: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.container.find('button[name="italic"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><i>bar</i><focus /></p>');
  });

  it('underline: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.container.find('button[name="underline"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><u>bar</u><focus /></p>');
  });

  it('strikethrough: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.container.find('button[name="strikethrough"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><s>bar</s><focus /></p>');
  });

  it('superscript: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.container.find('button[name="superscript"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><sup>bar</sup><focus /></p>');
  });

  it('subscript: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.container.find('button[name="subscript"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><sub>bar</sub><focus /></p>');
  });

  it('code: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.container.find('button[name="code"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><code>bar</code><focus /></p>');
  });

  it('moreStyle: selects an item and updates state', done => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="moreStyle"] .lake-dropdown-title'));
      const visibility = toolbar.container.find('div[name="moreStyle"] li[value="underline"] .lake-dropdown-menu-check').computedCSS('visibility');
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.container.find('div[name="moreStyle"] .lake-dropdown-title'));
    click(toolbar.container.find('div[name="moreStyle"] li[value="underline"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><u>bar</u><focus /></p>');
  });

  it('fontColor: clicks button', () => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    click(toolbar.container.find('div[name="fontColor"] .lake-dropdown-icon'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="color: #f5222d;">foo</span><focus /></p>');
  });

  it('fontColor: selects a color and updates state', done => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="fontColor"] .lake-dropdown-down-icon'));
      const visibility = toolbar.container.find('div[name="fontColor"] li[value="#fa541c"] .lake-dropdown-menu-check').computedCSS('visibility');
      expect(visibility).to.equal('visible');
      done();
    });
    const iconNode = toolbar.container.find('div[name="fontColor"] .lake-dropdown-icon');
    const downIconNode = toolbar.container.find('div[name="fontColor"] .lake-dropdown-down-icon');
    iconNode.emit('mouseenter');
    expect(iconNode.hasClass('lake-dropdown-icon-hovered')).to.equal(true);
    iconNode.emit('mouseleave');
    expect(iconNode.hasClass('lake-dropdown-icon-hovered')).to.equal(false);
    downIconNode.emit('mouseenter');
    expect(downIconNode.hasClass('lake-dropdown-down-icon-hovered')).to.equal(true);
    downIconNode.emit('mouseleave');
    expect(downIconNode.hasClass('lake-dropdown-down-icon-hovered')).to.equal(false);
    click(toolbar.container.find('div[name="fontColor"] .lake-dropdown-down-icon'));
    click(toolbar.container.find('div[name="fontColor"] li[value="#fa541c"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="color: #fa541c;">foo</span><focus /></p>');
    editor.setValue('<p><anchor />foo<focus /></p>');
    click(iconNode);
    const value2 = editor.getValue();
    debug(`output: ${value2}`);
    expect(value2).to.equal('<p><anchor /><span style="color: #fa541c;">foo</span><focus /></p>');
  });

  it('highlight: clicks button', () => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    click(toolbar.container.find('div[name="highlight"] .lake-dropdown-icon'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="background-color: #fadb14;">foo</span><focus /></p>');
  });

  it('highlight: selects a color and updates state', done => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="highlight"] .lake-dropdown-down-icon'));
      const visibility = toolbar.container.find('div[name="highlight"] li[value="#a0d911"] .lake-dropdown-menu-check').computedCSS('visibility');
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.container.find('div[name="highlight"] .lake-dropdown-down-icon'));
    click(toolbar.container.find('div[name="highlight"] li[value="#a0d911"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="background-color: #a0d911;">foo</span><focus /></p>');
    editor.setValue('<p><anchor />foo<focus /></p>');
    click(toolbar.container.find('div[name="highlight"] .lake-dropdown-icon'));
    const value2 = editor.getValue();
    debug(`output: ${value2}`);
    expect(value2).to.equal('<p><anchor /><span style="background-color: #a0d911;">foo</span><focus /></p>');
  });

  it('list: selects numbered list and updates state', done => {
    editor.setValue('<p>foo<focus /></p>');
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="list"] .lake-dropdown-title'));
      const visibility = toolbar.container.find('div[name="list"] li[value="numbered"] .lake-dropdown-menu-check').computedCSS('visibility');
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.container.find('div[name="list"] .lake-dropdown-title'));
    click(toolbar.container.find('div[name="list"] li[value="numbered"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ol start="1"><li>foo<focus /></li></ol>');
  });

  it('list: selects bulleted list and updates state', done => {
    editor.setValue('<p>foo<focus /></p>');
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="list"] .lake-dropdown-title'));
      const visibility = toolbar.container.find('div[name="list"] li[value="bulleted"] .lake-dropdown-menu-check').computedCSS('visibility');
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.container.find('div[name="list"] .lake-dropdown-title'));
    click(toolbar.container.find('div[name="list"] li[value="bulleted"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ul><li>foo<focus /></li></ul>');
  });

  it('list: selects checklist and updates state', done => {
    editor.setValue('<p>foo<focus /></p>');
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="list"] .lake-dropdown-title'));
      const visibility = toolbar.container.find('div[name="list"] li[value="checklist"] .lake-dropdown-menu-check').computedCSS('visibility');
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.container.find('div[name="list"] .lake-dropdown-title'));
    click(toolbar.container.find('div[name="list"] li[value="checklist"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ul type="checklist"><li value="false">foo<focus /></li></ul>');
  });

  it('numberedList: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="numberedList"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ol start="1"><li>foo<focus /></li></ol>');
  });

  it('bulletedList: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="bulletedList"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ul><li>foo<focus /></li></ul>');
  });

  it('checklist: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="checklist"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ul type="checklist"><li value="false">foo<focus /></li></ul>');
  });

  it('align: selects an item and updates state', done => {
    editor.setValue('<p>foo<focus /></p>');
    editor.event.once('statechange', () => {
      click(toolbar.container.find('div[name="align"] .lake-dropdown-title'));
      const visibility = toolbar.container.find('div[name="align"] li[value="center"] .lake-dropdown-menu-check').computedCSS('visibility');
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.container.find('div[name="align"] .lake-dropdown-title'));
    click(toolbar.container.find('div[name="align"] li[value="center"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: center;">foo<focus /></p>');
  });

  it('alignLeft: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="alignLeft"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: left;">foo<focus /></p>');
  });

  it('alignCenter: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="alignCenter"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: center;">foo<focus /></p>');
  });

  it('alignRight: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="alignRight"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: right;">foo<focus /></p>');
  });

  it('alignJustify: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="alignJustify"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: justify;">foo<focus /></p>');
  });

  it('indent: selects an item', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('div[name="indent"] .lake-dropdown-title'));
    click(toolbar.container.find('div[name="indent"] li[value="increase"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="margin-left: 40px;">foo<focus /></p>');
  });

  it('increaseIndent: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="increaseIndent"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="margin-left: 40px;">foo<focus /></p>');
  });

  it('decreaseIndent: clicks button', () => {
    editor.setValue('<p style="margin-left: 80px;">foo<focus /></p>');
    click(toolbar.container.find('button[name="decreaseIndent"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="margin-left: 40px;">foo<focus /></p>');
  });

  it('link: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="link"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p>foo<a>New link</a><focus /></p>');
  });

  it('hr: clicks button', () => {
    editor.setValue('<p><focus /><br /></p>');
    click(toolbar.container.find('button[name="hr"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<lake-box type="block" name="hr" focus="end"></lake-box>');
  });

  it('hr: should insert a box after selecting ouside the editor', () => {
    editor.setValue('<p>foo<focus />bar</p>');
    const nativeRange = document.createRange();
    nativeRange.setStart(document.body, 0);
    const nativeSelection = window.getSelection();
    nativeSelection?.removeAllRanges();
    nativeSelection?.addRange(nativeRange);
    click(toolbar.container.find('button[name="hr"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p>foo</p><lake-box type="block" name="hr" focus="end"></lake-box><p>bar</p>');
  });

  it('video: clicks button', () => {
    editor.setValue('<p><focus /><br /></p>');
    click(toolbar.container.find('button[name="video"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><lake-box type="inline" name="video" focus="end"></lake-box></p>');
  });

  it('codeBlock: clicks button', () => {
    editor.setValue('<p><focus /><br /></p>');
    click(toolbar.container.find('button[name="codeBlock"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<lake-box type="block" name="codeBlock" focus="end"></lake-box>');
  });

  it('selectAll: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.container.find('button[name="selectAll"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor />foo<focus /></p>');
  });

  it('image: upload images', () => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = req => requests.push(req);
    const files = [
      new File([imgBuffer], 'heaven-lake-512.png', {
        type: 'image/png',
      }),
      new File([imgBuffer], 'lac-gentau-256.jpg', {
        type: 'image/png',
      }),
    ];
    const event = {
      ...new Event('change'),
      target: {
        ...new EventTarget(),
        files,
      },
    };
    editor.setValue('<p>foo<focus /></p>');
    const buttonNode = toolbar.container.find('button[name="image"]');
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(true);
    buttonNode.emit('mouseleave');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    buttonNode.parent().find('input[type="file"]').emit('change', event as Event);
    requests[0].respond(200, {}, JSON.stringify({
      url: '../assets/images/heaven-lake-512.png',
    }));
    requests[1].respond(200, {}, JSON.stringify({
      url: '../assets/images/lac-gentau-256.jpg',
    }));
    const value = removeBoxValueFromHTML(editor.getValue());
    debug(`output: ${value}`);
    expect(value).to.equal('<p>foo<lake-box type="inline" name="image"></lake-box><lake-box type="inline" name="image" focus="end"></lake-box></p>');
    const box1 = getBox(editor.container.find('lake-box').eq(0));
    const box2 = getBox(editor.container.find('lake-box').eq(1));
    expect(box1.value.status).to.equal('done');
    expect(box1.value.url).to.equal('../assets/images/heaven-lake-512.png');
    expect(box2.value.status).to.equal('done');
    expect(box2.value.url).to.equal('../assets/images/lac-gentau-256.jpg');
    xhr.restore();
  });

  it('file: upload files', () => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = req => requests.push(req);
    const files = [
      new File([imgBuffer], 'heaven-lake-64.png', {
        type: 'image/png',
      }),
      new File(['foo'], 'heaven-lake-wikipedia.pdf', {
        type: 'application/pdf',
      }),
    ];
    const event = {
      ...new Event('change'),
      target: {
        ...new EventTarget(),
        files,
      },
    };
    editor.setValue('<p>foo<focus /></p>');
    const buttonNode = toolbar.container.find('button[name="file"]');
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(true);
    buttonNode.emit('mouseleave');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    buttonNode.parent().find('input[type="file"]').emit('change', event as Event);
    requests[0].respond(200, {}, JSON.stringify({
      url: '../assets/images/heaven-lake-64.png',
    }));
    requests[1].respond(200, {}, JSON.stringify({
      url: '../assets/files/heaven-lake-wikipedia.pdf',
    }));
    const value = removeBoxValueFromHTML(editor.getValue());
    debug(`output: ${value}`);
    expect(value).to.equal('<p>foo<lake-box type="inline" name="file"></lake-box><lake-box type="inline" name="file" focus="end"></lake-box></p>');
    const box1 = getBox(editor.container.find('lake-box').eq(0));
    const box2 = getBox(editor.container.find('lake-box').eq(1));
    expect(box1.value.status).to.equal('done');
    expect(box1.value.url).to.equal('../assets/images/heaven-lake-64.png');
    expect(box2.value.status).to.equal('done');
    expect(box2.value.url).to.equal('../assets/files/heaven-lake-wikipedia.pdf');
    xhr.restore();
  });

});
