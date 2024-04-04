import sinon from 'sinon';
import { click, removeBoxValueFromHTML } from '../utils';
import { query, debug } from '../../src/utils';
import { Nodes } from '../../src/models/nodes';
import { Box } from '../../src/models/box';
import { Toolbar } from '../../src/ui/toolbar';
import { Editor } from '../../src';

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
  'image',
  'link',
  'codeBlock',
  'blockQuote',
  'paragraph',
  'hr',
  '|',
  'selectAll',
];

describe('ui / toolbar', () => {

  let editorNode: Nodes;
  let editor: Editor;
  let toolbar: Toolbar;

  beforeEach(() => {
    editorNode = query('<div class="lake-editor"><div class="lake-toolbar-root"></div><div class="lake-root"></div></div>');
    query(document.body).append(editorNode);
    editor = new Editor({
      root: editorNode.find('.lake-root'),
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    const toolbarNode = editorNode.find('.lake-toolbar-root');
    toolbar = new Toolbar({
      editor,
      root: toolbarNode,
      items: toolbarItems,
    });
    toolbar.render();
  });

  afterEach(() => {
    editorNode.remove();
  });

  it('undo: clicks button', () => {
    editor.command.execute('heading', 'h2');
    expect(editor.getValue()).to.equal('<h2><br /><focus /></h2>');
    const buttonNode = toolbar.root.find('button[name="undo"]');
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(true);
    buttonNode.emit('mouseleave');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    click(buttonNode);
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><br /><focus /></p>');
    editor.unmount();
  });

  it('redo: clicks button', () => {
    editor.command.execute('heading', 'h2');
    expect(editor.getValue()).to.equal('<h2><br /><focus /></h2>');
    click(toolbar.root.find('button[name="undo"]'));
    click(toolbar.root.find('button[name="redo"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<h2><br /><focus /></h2>');
    editor.unmount();
  });

  it('heading: selects an item and updates state', done => {
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="heading"] .lake-dropdown-title'));
      const visibility = toolbar.root.find('div[name="heading"] li[value="h3"] .lake-dropdown-menu-check').computedCSS('visibility');
      const titleText = toolbar.root.find('div[name="heading"] .lake-dropdown-text').text();
      editor.unmount();
      expect(visibility).to.equal('visible');
      expect(titleText).to.equal('Heading 3');
      done();
    });
    const titleNode = toolbar.root.find('div[name="heading"] .lake-dropdown-title');
    titleNode.emit('mouseenter');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(true);
    titleNode.emit('mouseleave');
    expect(titleNode.hasClass('lake-dropdown-title-hovered')).to.equal(false);
    click(titleNode);
    click(toolbar.root.find('div[name="heading"] li[value="h3"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<h3><br /><focus /></h3>');
  });

  it('paragraph: clicks button', () => {
    editor.setValue('<h3><br /><focus /></h3>');
    click(toolbar.root.find('button[name="paragraph"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><br /><focus /></p>');
    editor.unmount();
  });

  it('blockQuote: clicks button', () => {
    editor.setValue('<p><br /><focus /></p>');
    click(toolbar.root.find('button[name="blockQuote"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<blockquote><br /><focus /></blockquote>');
    editor.unmount();
  });

  it('fontFamily: selects an item and updates state', done => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="fontFamily"] .lake-dropdown-down-icon'));
      const visibility = toolbar.root.find('div[name="fontFamily"] li[value="Tahoma"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="fontFamily"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="fontFamily"] li[value="Tahoma"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="font-family: Tahoma;">foo</span><focus /></p>');
  });

  it('fontSize: selects an item and updates state', done => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="fontSize"] .lake-dropdown-down-icon'));
      const visibility = toolbar.root.find('div[name="fontSize"] li[value="32px"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="fontSize"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="fontSize"] li[value="32px"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="font-size: 32px;">foo</span><focus /></p>');
  });

  it('formatPainter: clicks button', () => {
    editor.setValue('<p><strong>foo<focus /></strong></p><p>bar</p>');
    click(toolbar.root.find('button[name="formatPainter"]'));
    editor.selection.range.selectNodeContents(editor.container.find('p').eq(1));
    click(editor.container);
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><strong>foo</strong></p><p><anchor /><strong>bar</strong><focus /></p>');
    editor.unmount();
  });

  it('removeFormat: clicks button', () => {
    editor.setValue('<p><anchor /><strong>bar</strong><focus /></p>');
    click(toolbar.root.find('button[name="removeFormat"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor />bar<focus /></p>');
    editor.unmount();
  });

  it('bold: clicks button and updates state', done => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    toolbar.event.on('updatestate', () => {
      const isSelected = toolbar.root.find('button[name="bold"].lake-button-selected').length > 0;
      editor.unmount();
      expect(isSelected).to.equal(true);
      done();
    });
    click(toolbar.root.find('button[name="bold"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><strong>bar</strong><focus /></p>');
  });

  it('italic: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.root.find('button[name="italic"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><i>bar</i><focus /></p>');
    editor.unmount();
  });

  it('underline: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.root.find('button[name="underline"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><u>bar</u><focus /></p>');
    editor.unmount();
  });

  it('strikethrough: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.root.find('button[name="strikethrough"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><s>bar</s><focus /></p>');
    editor.unmount();
  });

  it('superscript: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.root.find('button[name="superscript"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><sup>bar</sup><focus /></p>');
    editor.unmount();
  });

  it('subscript: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.root.find('button[name="subscript"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><sub>bar</sub><focus /></p>');
    editor.unmount();
  });

  it('code: clicks button', () => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    click(toolbar.root.find('button[name="code"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><code>bar</code><focus /></p>');
    editor.unmount();
  });

  it('moreStyle: selects an item and updates state', done => {
    editor.setValue('<p><anchor />bar<focus /></p>');
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="moreStyle"] .lake-dropdown-title'));
      const visibility = toolbar.root.find('div[name="moreStyle"] li[value="underline"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="moreStyle"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="moreStyle"] li[value="underline"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><u>bar</u><focus /></p>');
  });

  it('fontColor: clicks button', () => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    click(toolbar.root.find('div[name="fontColor"] .lake-dropdown-icon'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="color: #f5222d;">foo</span><focus /></p>');
    editor.unmount();
  });

  it('fontColor: selects a color and updates state', done => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="fontColor"] .lake-dropdown-down-icon'));
      const visibility = toolbar.root.find('div[name="fontColor"] li[value="#fa541c"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.equal('visible');
      done();
    });
    const iconNode = toolbar.root.find('div[name="fontColor"] .lake-dropdown-icon');
    const downIconNode = toolbar.root.find('div[name="fontColor"] .lake-dropdown-down-icon');
    iconNode.emit('mouseenter');
    expect(iconNode.hasClass('lake-dropdown-icon-hovered')).to.equal(true);
    iconNode.emit('mouseleave');
    expect(iconNode.hasClass('lake-dropdown-icon-hovered')).to.equal(false);
    downIconNode.emit('mouseenter');
    expect(downIconNode.hasClass('lake-dropdown-down-icon-hovered')).to.equal(true);
    downIconNode.emit('mouseleave');
    expect(downIconNode.hasClass('lake-dropdown-down-icon-hovered')).to.equal(false);
    click(toolbar.root.find('div[name="fontColor"] .lake-dropdown-down-icon'));
    click(toolbar.root.find('div[name="fontColor"] li[value="#fa541c"]'));
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
    click(toolbar.root.find('div[name="highlight"] .lake-dropdown-icon'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="background-color: #fadb14;">foo</span><focus /></p>');
    editor.unmount();
  });

  it('highlight: selects a color and updates state', done => {
    editor.setValue('<p><anchor />foo<focus /></p>');
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="highlight"] .lake-dropdown-down-icon'));
      const visibility = toolbar.root.find('div[name="highlight"] li[value="#a0d911"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="highlight"] .lake-dropdown-down-icon'));
    click(toolbar.root.find('div[name="highlight"] li[value="#a0d911"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor /><span style="background-color: #a0d911;">foo</span><focus /></p>');
    editor.setValue('<p><anchor />foo<focus /></p>');
    click(toolbar.root.find('div[name="highlight"] .lake-dropdown-icon'));
    const value2 = editor.getValue();
    debug(`output: ${value2}`);
    expect(value2).to.equal('<p><anchor /><span style="background-color: #a0d911;">foo</span><focus /></p>');
  });

  it('list: selects numbered list and updates state', done => {
    editor.setValue('<p>foo<focus /></p>');
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="list"] .lake-dropdown-title'));
      const visibility = toolbar.root.find('div[name="list"] li[value="numbered"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="list"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="list"] li[value="numbered"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ol start="1"><li>foo<focus /></li></ol>');
  });

  it('list: selects bulleted list and updates state', done => {
    editor.setValue('<p>foo<focus /></p>');
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="list"] .lake-dropdown-title'));
      const visibility = toolbar.root.find('div[name="list"] li[value="bulleted"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="list"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="list"] li[value="bulleted"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ul><li>foo<focus /></li></ul>');
  });

  it('list: selects checklist and updates state', done => {
    editor.setValue('<p>foo<focus /></p>');
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="list"] .lake-dropdown-title'));
      const visibility = toolbar.root.find('div[name="list"] li[value="checklist"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="list"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="list"] li[value="checklist"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ul type="checklist"><li value="false">foo<focus /></li></ul>');
  });

  it('numberedList: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="numberedList"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ol start="1"><li>foo<focus /></li></ol>');
    editor.unmount();
  });

  it('bulletedList: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="bulletedList"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ul><li>foo<focus /></li></ul>');
    editor.unmount();
  });

  it('checklist: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="checklist"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<ul type="checklist"><li value="false">foo<focus /></li></ul>');
    editor.unmount();
  });

  it('align: selects an item and updates state', done => {
    editor.setValue('<p>foo<focus /></p>');
    toolbar.event.on('updatestate', () => {
      click(toolbar.root.find('div[name="align"] .lake-dropdown-title'));
      const visibility = toolbar.root.find('div[name="align"] li[value="center"] .lake-dropdown-menu-check').computedCSS('visibility');
      editor.unmount();
      expect(visibility).to.equal('visible');
      done();
    });
    click(toolbar.root.find('div[name="align"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="align"] li[value="center"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: center;">foo<focus /></p>');
  });

  it('alignLeft: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="alignLeft"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: left;">foo<focus /></p>');
    editor.unmount();
  });

  it('alignCenter: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="alignCenter"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: center;">foo<focus /></p>');
    editor.unmount();
  });

  it('alignRight: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="alignRight"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: right;">foo<focus /></p>');
    editor.unmount();
  });

  it('alignJustify: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="alignJustify"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="text-align: justify;">foo<focus /></p>');
    editor.unmount();
  });

  it('indent: selects an item', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('div[name="indent"] .lake-dropdown-title'));
    click(toolbar.root.find('div[name="indent"] li[value="increase"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="margin-left: 40px;">foo<focus /></p>');
    editor.unmount();
  });

  it('increaseIndent: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="increaseIndent"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="margin-left: 40px;">foo<focus /></p>');
    editor.unmount();
  });

  it('decreaseIndent: clicks button', () => {
    editor.setValue('<p style="margin-left: 80px;">foo<focus /></p>');
    click(toolbar.root.find('button[name="decreaseIndent"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p style="margin-left: 40px;">foo<focus /></p>');
    editor.unmount();
  });

  it('link: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="link"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p>foo<a>New link</a><focus /></p>');
    editor.unmount();
  });

  it('codeBlock: clicks button', () => {
    editor.setValue('<p><br /><focus /></p>');
    click(toolbar.root.find('button[name="codeBlock"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<lake-box type="block" name="codeBlock" focus="right"></lake-box>');
    editor.unmount();
  });

  it('hr: clicks button', () => {
    editor.setValue('<p><br /><focus /></p>');
    click(toolbar.root.find('button[name="hr"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<lake-box type="block" name="hr" focus="right"></lake-box>');
    editor.unmount();
  });

  it('selectAll: clicks button', () => {
    editor.setValue('<p>foo<focus /></p>');
    click(toolbar.root.find('button[name="selectAll"]'));
    const value = editor.getValue();
    debug(`output: ${value}`);
    expect(value).to.equal('<p><anchor />foo<focus /></p>');
    editor.unmount();
  });

  it('image: upload file', () => {
    const xhr = sinon.useFakeXMLHttpRequest();
    const requests: sinon.SinonFakeXMLHttpRequest[] = [];
    xhr.onCreate = req => requests.push(req);
    const files = [
      new File(['foo'], 'heaven-lake-512.png', {
        type: 'image/png',
      }),
      new File(['foo'], 'lac-gentau-256.jpg', {
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
    const buttonNode = toolbar.root.find('button[name="image"]');
    buttonNode.emit('mouseenter');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(true);
    buttonNode.emit('mouseleave');
    expect(buttonNode.hasClass('lake-button-hovered')).to.equal(false);
    toolbar.root.find('.lake-upload input[type="file"]').emit('change', event as Event);
    requests[0].respond(200, {}, JSON.stringify({
      url: '../assets/images/heaven-lake-512.png',
    }));
    requests[1].respond(200, {}, JSON.stringify({
      url: '../assets/images/lac-gentau-256.jpg',
    }));
    const value = removeBoxValueFromHTML(editor.getValue());
    debug(`output: ${value}`);
    expect(value).to.equal('<p>foo<lake-box type="inline" name="image"></lake-box><lake-box type="inline" name="image" focus="right"></lake-box></p>');
    const box1 = new Box(editor.container.find('lake-box').eq(0));
    const box2 = new Box(editor.container.find('lake-box').eq(1));
    expect(box1.value.status).to.equal('done');
    expect(box1.value.url).to.equal('../assets/images/heaven-lake-512.png');
    expect(box2.value.status).to.equal('done');
    expect(box2.value.url).to.equal('../assets/images/lac-gentau-256.jpg');
    xhr.restore();
    editor.unmount();
  });

});
