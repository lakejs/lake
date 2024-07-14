import { getInstanceMap } from '../src/storage/box-instances';
import { debug, query, getBox, appendBreak } from '../src/utils';
import { Nodes } from '../src/models/nodes';
import { Editor } from '../src/editor';
import { click, getContainerValue } from './utils';

function insertText(editor: Editor, data: string) {
  const inputEvent = new InputEvent('input', {
    data,
    inputType: 'insertText',
    isComposing: false,
  });
  const nativeRange = editor.selection.range.get();
  const textNode = document.createTextNode(data);
  nativeRange.insertNode(textNode);
  nativeRange.collapse(false);
  const prevNode = query(textNode).prev();
  if (prevNode.length > 0 && prevNode.name === 'br') {
    prevNode.remove();
  }
  editor.container.emit('input', inputEvent);
}

function insertCompositionText(editor: Editor, data: string) {
  editor.container.emit('compositionstart');
  const inputEvent = new InputEvent('input', {
    data,
    inputType: 'insertCompositionText',
    isComposing: true,
  });
  const compositionEvent = new CompositionEvent('compositionend', {
    data,
  });
  const nativeRange = editor.selection.range.get();
  nativeRange.insertNode(document.createTextNode(data));
  nativeRange.collapse(false);
  editor.container.emit('input', inputEvent);
  editor.container.emit('compositionend', compositionEvent);
}

function deleteContentBackward(editor: Editor) {
  const range = editor.selection.range;
  const event = new InputEvent('input', {
    inputType: 'deleteContentBackward',
    isComposing: false,
  });
  editor.container.emit('beforeinput', event);
  const nativeRange = range.get();
  nativeRange.setStart(nativeRange.startContainer, nativeRange.startOffset - 1);
  // debug('start node:', nativeRange.startContainer, ', offset:', nativeRange.startOffset);
  // debug('end node:', nativeRange.endContainer, ', offset:', nativeRange.endOffset);
  nativeRange.deleteContents();
  const block = range.getBlocks()[0];
  if (block && block.isEmpty) {
    const breakNode = appendBreak(block);
    range.setStartBefore(breakNode);
    range.collapseToStart();
  }
  editor.container.emit('input', event);
}

describe('editor', () => {

  let rootNode: Nodes;

  beforeEach(() => {
    Editor.box.add({
      type: 'inline',
      name: 'inlineBox',
      render: () => '<img />',
    });
    Editor.box.add({
      type: 'block',
      name: 'blockBox',
      render: () => '<hr />',
    });
    rootNode = query('<div class="lake-root" />');
    query(document.body).append(rootNode);
  });

  afterEach(() => {
    Editor.box.remove('inlineBox');
    Editor.box.remove('blockBox');
    rootNode.remove();
  });

  it('config: spellcheck is true', () => {
    const editor = new Editor({
      root: rootNode,
      spellcheck: true,
    });
    editor.render();
    expect(editor.container.attr('spellcheck')).to.equal('true');
    editor.unmount();
  });

  it('config: readonly is true', () => {
    const input = '<p>foo<focus /></p>';
    const output = '<p>foo<focus /></p>';
    const contentView = new Editor({
      root: rootNode,
      readonly: true,
      value: input,
    });
    contentView.render();
    const readonly = contentView.readonly;
    const value = contentView.getValue();
    debug(`output: ${value}`);
    contentView.unmount();
    expect(readonly).to.equal(true);
    expect(value).to.equal(output);
  });

  it('config: tabIndex is -1', () => {
    const editor = new Editor({
      root: rootNode,
      tabIndex: -1,
    });
    editor.render();
    expect(editor.container.attr('tabindex')).to.equal('-1');
    editor.unmount();
  });

  it('config: should display placeholder (1)', () => {
    const editor = new Editor({
      root: rootNode,
      placeholder: 'Add your Add your comment here...',
    });
    editor.render();
    expect(editor.container.hasClass('lake-placeholder')).to.equal(true);
    editor.unmount();
  });

  it('config: should display placeholder (2)', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p><br></p>',
      placeholder: 'Add your Add your comment here...',
    });
    editor.render();
    expect(editor.container.hasClass('lake-placeholder')).to.equal(true);
    editor.unmount();
  });

  it('config: should not display placeholder', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>foo</p>',
      placeholder: 'Add your Add your comment here...',
    });
    editor.render();
    expect(editor.container.hasClass('lake-placeholder')).to.equal(false);
    editor.unmount();
  });

  it('config: indentWithTab is false', () => {
    const editor = new Editor({
      root: rootNode,
      indentWithTab: false,
    });
    editor.render();
    expect(editor.config.indentWithTab).to.equal(false);
    editor.unmount();
  });

  it('config: should return Chinese', () => {
    const editor = new Editor({
      root: rootNode,
      lang: 'zh-CN',
    });
    editor.render();
    expect(editor.locale.toolbar.code()).to.equal('行内代码');
    editor.unmount();
  });

  it('config: minChangeSize is false', () => {
    const editor = new Editor({
      root: rootNode,
      minChangeSize: 10,
    });
    editor.render();
    expect(editor.config.minChangeSize).to.equal(10);
    editor.unmount();
  });

  it('config: should set historySize', () => {
    const editor = new Editor({
      root: rootNode,
      historySize: 200,
    });
    editor.render();
    expect(editor.history.limit).to.equal(200);
    editor.unmount();
  });

  it('config: default value is empty', () => {
    const input = '';
    const output = '';
    const editor = new Editor({
      root: rootNode,
      value: input,
    });
    editor.render();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('fixContent method: no content', () => {
    const input = '';
    const output = '<p><focus /><br /></p>';
    const editor = new Editor({
      root: rootNode,
      value: '<p>foo</p>',
    });
    let changeCount = 0;
    let currentValue = '';
    editor.event.on('change', (value: string) => {
      currentValue = value;
      changeCount++;
    });
    editor.render();
    editor.focus();
    editor.container.html(input);
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
    expect(getContainerValue(editor.history.list[editor.history.index - 1])).to.equal(output);
    expect(changeCount).to.equal(1);
    expect(currentValue).to.equal(output);
  });

  it('fixContent method: should fix line break', () => {
    const input = '<br />';
    const output = '<p><focus /><br /></p>';
    const editor = new Editor({
      root: rootNode,
    });
    let currentValue = '';
    editor.event.on('change', (value: string) => {
      currentValue = value;
    });
    editor.render();
    editor.focus();
    editor.container.html(input);
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
    expect(getContainerValue(editor.history.list[editor.history.index - 1])).to.equal(output);
    expect(currentValue).to.equal(output);
  });

  it('fixContent method: should fix line break and empty mark', () => {
    const input = '<br /><span></span>';
    const output = '<p><focus /><br /></p>';
    const editor = new Editor({
      root: rootNode,
    });
    let currentValue = '';
    editor.event.on('change', (value: string) => {
      currentValue = value;
    });
    editor.render();
    editor.focus();
    editor.container.html(input);
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
    expect(getContainerValue(editor.history.list[editor.history.index - 1])).to.equal(output);
    expect(currentValue).to.equal(output);
  });

  it('fixContent method: should fix line break and empty block', () => {
    const input = '<br /><p></p>';
    const output = '<p><focus /><br /></p>';
    const editor = new Editor({
      root: rootNode,
    });
    let currentValue = '';
    editor.event.on('change', (value: string) => {
      currentValue = value;
    });
    editor.render();
    editor.focus();
    editor.container.html(input);
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
    expect(getContainerValue(editor.history.list[editor.history.index - 1])).to.equal(output);
    expect(currentValue).to.equal(output);
  });

  it('fixContent method: should fix caret', () => {
    const input = '<p><br /><focus /></p>';
    const output = '<p><focus /><br /></p>';
    const editor = new Editor({
      root: rootNode,
      value: '<p>foo</p>',
    });
    editor.render();
    editor.focus();
    editor.setValue(input);
    editor.history.save();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('setPluginConfig method: plugin config is not set', () => {
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setPluginConfig('testPlugin', {
      key2: 'bb',
      key3: 'cc',
    });
    expect(editor.config.testPlugin.key1).to.equal(undefined);
    expect(editor.config.testPlugin.key2).to.equal('bb');
    expect(editor.config.testPlugin.key3).to.equal('cc');
    editor.unmount();
  });

  it('setPluginConfig method: plugin config is set', () => {
    const editor = new Editor({
      root: rootNode,
      testPlugin: {
        key1: 'aa',
        key2: 'bb',
      },
    });
    editor.render();
    editor.setPluginConfig('testPlugin', {
      key2: 'b',
      key3: 'c',
    });
    expect(editor.config.testPlugin.key1).to.equal('aa');
    expect(editor.config.testPlugin.key2).to.equal('bb');
    expect(editor.config.testPlugin.key3).to.equal('c');
    editor.unmount();
  });

  it('method: removeBoxGarbage', () => {
    const editor = new Editor({
      root: rootNode,
      value: '<lake-box type="block" name="hr" focus="end"></lake-box><lake-box type="block" name="hr"></lake-box>',
    });
    editor.render();
    editor.container.find('lake-box').eq(1).remove();
    expect(getInstanceMap(editor.container.id).size).to.equal(2);
    editor.removeBoxGarbage();
    expect(getInstanceMap(editor.container.id).size).to.equal(1);
    editor.unmount();
  });

  it('method: hasFocus / focus / blur', () => {
    const editor = new Editor({
      root: rootNode,
    });
    editor.container.on('focusin', ()=> {
      editor.root.addClass('lake-root-focused');
    });
    editor.container.on('focusout', ()=> {
      editor.root.removeClass('lake-root-focused');
    });
    editor.render();
    editor.focus();
    expect(editor.hasFocus).to.equal(true);
    expect(rootNode.hasClass('lake-root-focused')).to.equal(true);
    editor.blur();
    expect(editor.hasFocus).to.equal(false);
    expect(rootNode.hasClass('lake-root-focused')).to.equal(false);
    editor.unmount();
  });

  it('method: scrollToCaret', () => {
    rootNode.css('width', '200px');
    rootNode.css('min-width', '200px');
    rootNode.css('height', '100px');
    rootNode.css('overflow', 'auto');
    rootNode.css('white-space', 'nowrap');
    const editor = new Editor({
      root: rootNode,
      value: '<p>000000000000000000000000000000000000000</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p>',
    });
    editor.render();
    editor.container.css('padding', '0');
    const  nativeRootNode = rootNode.get(0) as Element;
    expect(nativeRootNode.scrollTop).to.equal(0);
    // no scroll
    editor.selection.range.selectNode(editor.container.find('p').eq(1));
    editor.scrollToCaret();
    expect(nativeRootNode.scrollTop).to.equal(0);
    // sroll to right
    editor.selection.range.selectNodeContents(editor.container.find('p').eq(0));
    editor.selection.range.collapseToEnd();
    editor.scrollToCaret();
    // expect(nativeRootNode.scrollLeft > 140).to.equal(true);
    // sroll to left
    editor.selection.range.selectNodeContents(editor.container.find('p').eq(0));
    editor.selection.range.collapseToStart();
    editor.scrollToCaret();
    // expect(nativeRootNode.scrollLeft).to.equal(0);
    // scroll to middle
    editor.selection.range.selectNode(editor.container.find('p').eq(4));
    editor.scrollToCaret();
    // expect(nativeRootNode.scrollTop > 60 && nativeRootNode.scrollTop < 70).to.equal(true);
    // sroll to bottom
    editor.selection.range.selectNode(editor.container.find('p').eq(9));
    editor.scrollToCaret();
    // expect(nativeRootNode.scrollTop > 210).to.equal(true);
    // scroll to middle
    editor.selection.range.selectNode(editor.container.find('p').eq(4));
    editor.scrollToCaret();
    // expect(nativeRootNode.scrollTop > 120 && nativeRootNode.scrollTop < 130).to.equal(true);
    // scroll to top
    editor.selection.range.selectNode(editor.container.find('p').eq(0));
    editor.selection.range.collapseToStart();
    editor.scrollToCaret();
    expect(nativeRootNode.scrollTop).to.equal(0);
    // should remove fake caret
    expect(editor.overlayContainer.find('.lake-fake-caret').length).to.equal(0);
    editor.unmount();
  });

  it('method: getValue', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong>\u200B# <focus />foo</strong></p>';
    const editor = new Editor({
      root: rootNode,
      value: input,
    });
    editor.render();
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
  });

  it('setValue method: should set content', () => {
    const input = '<p><strong>\u200B# <focus />foo</strong></p>';
    const output = '<p><strong>\u200B# <focus />foo</strong></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
    expect(editor.container.hasClass('lake-placeholder')).to.equal(false);
  });

  it('setValue method: should set empty content', () => {
    const input = '<p><br></p>';
    const output = '<p><br /></p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const value = editor.getValue();
    debug(`output: ${value}`);
    editor.unmount();
    expect(value).to.equal(output);
    expect(editor.container.hasClass('lake-placeholder')).to.equal(true);
  });

  it('box class: should not have any classes after rendering editor', () => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const boxNode = editor.container.find('lake-box');
    const box = getBox(boxNode);
    const boxContainer = box.getContainer();
    const isActivated = boxContainer.hasClass('lake-box-activated');
    const isFocused = boxContainer.hasClass('lake-box-focused');
    const isSelected = boxContainer.hasClass('lake-box-selected');
    const isHovered = boxContainer.hasClass('lake-box-hovered');
    editor.unmount();
    expect(isActivated).to.equal(false);
    expect(isFocused).to.equal(false);
    expect(isSelected).to.equal(false);
    expect(isHovered).to.equal(false);
  });

  it('box class: should have an activated class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = getBox(boxNode);
    const boxContainer = box.getContainer();
    boxContainer.emit('mouseenter');
    box.event.once('focus', () => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      const isHovered = boxContainer.hasClass('lake-box-hovered');
      editor.unmount();
      expect(isActivated).to.equal(true);
      expect(isFocused).to.equal(false);
      expect(isSelected).to.equal(false);
      expect(isHovered).to.equal(false);
      done();
    });
    range.selectNodeContents(boxContainer);
  });

  it('box class: should have a focused class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = getBox(boxNode);
    const boxContainer = box.getContainer();
    boxContainer.emit('mouseenter');
    box.event.once('focus', () => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      const isHovered = boxContainer.hasClass('lake-box-hovered');
      editor.unmount();
      expect(isActivated).to.equal(false);
      expect(isFocused).to.equal(true);
      expect(isSelected).to.equal(false);
      expect(isHovered).to.equal(false);
      done();
    });
    range.selectBox(boxNode);
  });

  it('box class: should have a selected class', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = getBox(boxNode);
    const boxContainer = box.getContainer();
    box.event.once('blur', () => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      const isHovered = boxContainer.hasClass('lake-box-hovered');
      editor.unmount();
      expect(isActivated).to.equal(false);
      expect(isFocused).to.equal(false);
      expect(isSelected).to.equal(true);
      expect(isHovered).to.equal(false);
      done();
    });
    range.selectNodeContents(editor.container);
  });

  it('box class: should not have any classes', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const range = editor.selection.range;
    const boxNode = editor.container.find('lake-box');
    const box = getBox(boxNode);
    const boxContainer = box.getContainer();
    box.event.once('blur', () => {
      const isActivated = boxContainer.hasClass('lake-box-activated');
      const isFocused = boxContainer.hasClass('lake-box-focused');
      const isSelected = boxContainer.hasClass('lake-box-selected');
      const isHovered = boxContainer.hasClass('lake-box-hovered');
      editor.unmount();
      expect(isActivated).to.equal(false);
      expect(isFocused).to.equal(false);
      expect(isSelected).to.equal(false);
      expect(isHovered).to.equal(false);
      done();
    });
    range.selectNodeContents(editor.container);
    range.collapseToStart();
  });

  it('box class: should have hovered class', () => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    const boxNode = editor.container.find('lake-box');
    const box = getBox(boxNode);
    const boxContainer = box.getContainer();
    boxContainer.emit('mouseenter');
    const isActivated = boxContainer.hasClass('lake-box-activated');
    const isFocused = boxContainer.hasClass('lake-box-focused');
    const isSelected = boxContainer.hasClass('lake-box-selected');
    const isHovered = boxContainer.hasClass('lake-box-hovered');
    editor.unmount();
    expect(isActivated).to.equal(false);
    expect(isFocused).to.equal(false);
    expect(isSelected).to.equal(false);
    expect(isHovered).to.equal(true);
  });

  it('input event: when inputting text at the start of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const output = '<p>fooa<focus /><lake-box type="inline" name="inlineBox"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.event.once('change', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.unmount();
      expect(value).to.equal(output);
      done();
    });
    insertText(editor, 'a');
  });

  it('input event: when inputting text at the end of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="end"></lake-box>bar</p>';
    const output = '<p>foo<lake-box type="inline" name="inlineBox"></lake-box>a<focus />bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.event.once('change', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.unmount();
      expect(value).to.equal(output);
      done();
    });
    insertText(editor, 'a');
  });

  it('input event: when inputting composition text at the start of inline box', done => {
    const input = '<p>foo<lake-box type="inline" name="inlineBox" focus="start"></lake-box>bar</p>';
    const output = '<p>foo你好<focus /><lake-box type="inline" name="inlineBox"></lake-box>bar</p>';
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    editor.setValue(input);
    editor.event.once('change', () => {
      const value = editor.getValue();
      debug(`output: ${value}`);
      editor.unmount();
      expect(value).to.equal(output);
      done();
    });
    insertCompositionText(editor, '你好');
  });

  it('input event: undo and redo', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>\u200Bfoo<focus /></p>',
    });
    editor.render();
    editor.event.once('change', () => {
      editor.history.undo();
      expect(editor.getValue()).to.equal('<p>\u200Bfoo<focus /></p>');
      editor.history.redo();
      expect(editor.getValue()).to.equal('<p>\u200Bfooa<focus /></p>');
      editor.history.undo();
      expect(editor.getValue()).to.equal('<p>\u200Bfoo<focus /></p>');
      editor.unmount();
      done();
    });
    insertText(editor, 'a');
  });

  it('statechange event', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    editor.event.once('statechange', state => {
      expect(state.appliedItems[0].name).to.equal('h1');
      editor.unmount();
      done();
    });
    editor.command.execute('heading', 'h1');
  });

  it('change event: when executing command', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    editor.event.once('change', (value: string) => {
      expect(value).to.equal('<h1><br /><focus /></h1>');
      editor.unmount();
      done();
    });
    editor.command.execute('heading', 'h1');
  });

  it('change event: when inputting data', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>foo<focus /></p>',
    });
    editor.render();
    editor.event.once('change', (value: string) => {
      expect(value).to.equal('<p>fooa<focus /></p>');
      editor.unmount();
      done();
    });
    insertText(editor, 'a');
  });

  it('change event: when inputting and deleting data', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p>foo<focus /></p>',
    });
    editor.render();
    let calledCount = 0;
    editor.event.on('change', (value: string) => {
      calledCount++;
      if (calledCount === 1) {
        expect(value).to.equal('<p>fooa<focus /></p>');
        deleteContentBackward(editor);
      }
      if (calledCount === 2) {
        expect(value).to.equal('<p>foo<focus /></p>');
        editor.unmount();
        done();
      }
    });
    insertText(editor, 'a');
  });

  it('change event: should show and hide placeholder', done => {
    const editor = new Editor({
      root: rootNode,
      value: '<p><br /><focus /></p>',
    });
    editor.render();
    expect(editor.container.hasClass('lake-placeholder')).to.equal(true);
    let calledCount = 0;
    editor.event.on('change', (value: string) => {
      calledCount++;
      if (calledCount === 1) {
        expect(value).to.equal('<p>a<focus /></p>');
        expect(editor.container.hasClass('lake-placeholder')).to.equal(false);
        deleteContentBackward(editor);
      }
      if (calledCount === 2) {
        expect(value).to.equal('<p><focus /><br /></p>');
        expect(editor.container.hasClass('lake-placeholder')).to.equal(true);
        editor.unmount();
        done();
      }
    });
    insertText(editor, 'a');
  });

  it('single editor: should trigger click event', () => {
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    let clickCount = 0;
    editor.event.on('click', () => {
      clickCount++;
    });
    click(rootNode);
    expect(clickCount).to.equal(1);
    click(query(editor.popupContainer));
    expect(clickCount).to.equal(1);
    editor.unmount();
  });

  it('multi-editor: should trigger click event', () => {
    const rootNode2 = query('<div class="lake-root" />');
    query(document.body).append(rootNode2);
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    let clickCount = 0;
    editor.event.on('click', () => {
      clickCount++;
    });
    const editor2 = new Editor({
      root: rootNode2,
    });
    editor2.render();
    let clickCount2 = 0;
    editor2.event.on('click', () => {
      clickCount2++;
    });
    click(rootNode2);
    expect(clickCount).to.equal(1);
    expect(clickCount2).to.equal(1);
    click(query(editor.popupContainer));
    expect(clickCount).to.equal(1);
    expect(clickCount2).to.equal(1);
    editor.unmount();
    editor2.unmount();
    rootNode2.remove();
  });

  it('unmount method: should remove all listeners', () => {
    const editor = new Editor({
      root: rootNode,
    });
    editor.render();
    let clickCount = 0;
    editor.event.on('click', () => {
      clickCount++;
    });
    click(rootNode);
    expect(clickCount).to.equal(1);
    editor.unmount();
    editor.event.emit('click');
    expect(clickCount).to.equal(1);
  });

  it('multi-editor: should not throw an error', () => {
    const rootNode2 = query('<div class="lake-root" />');
    query(document.body).append(rootNode2);
    const editor = new Editor({
      root: rootNode,
      value: '<strong>foo</strong>bar<focus />',
    });
    editor.render();
    const editor2 = new Editor({
      root: rootNode2,
      value: 'bar',
    });
    editor2.render();
    editor.unmount();
    editor2.unmount();
    rootNode2.remove();
  });

});
