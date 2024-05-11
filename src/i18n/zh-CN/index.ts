import type { Translation } from '../types';
import { modifierText } from '../../utils/modifier-text';

export default {
  toolbar: {
    undo: `撤消 (${modifierText('mod+Z')})`,
    redo: `重做 (${modifierText('mod+Y')})`,
    selectAll: `全选 (${modifierText('mod+A')})`,
    paragraph: '正文',
    blockQuote: '引用',
    numberedList: '编号',
    bulletedList: '项目符号',
    checklist: '任务列表',
    alignLeft: '左对齐',
    alignCenter: '居中',
    alignRight: '右对齐',
    alignJustify: '两端对齐',
    increaseIndent: '增加缩进',
    decreaseIndent: '减少缩进',
    bold: `粗体 (${modifierText('mod+B')})`,
    italic: `斜体 (${modifierText('mod+I')})`,
    underline: `下划线 (${modifierText('mod+U')})`,
    strikethrough: '删除线',
    superscript: '上标',
    subscript: '下标',
    code: '行内代码',
    removeFormat: '清除格式',
    formatPainter: '格式刷',
    link: '链接',
    hr: '分割线',
    codeBlock: '代码块',
    heading: '标题',
    heading1: '标题 1',
    heading2: '标题 2',
    heading3: '标题 3',
    heading4: '标题 4',
    heading5: '标题 5',
    heading6: '标题 6',
    list: '列表',
    align: '对齐方式',
    indent: '缩进',
    fontFamily: '字体',
    fontSize: '文字大小',
    moreStyle: '更多样式',
    fontColor: '文字颜色',
    highlight: '文字背景',
    image: '图片',
    file: '文件',
    removeColor: '默认',
  },
  link: {
    newLink: '新链接',
    url: '链接 URL',
    title: '链接文本',
    copy: '复制到剪贴板',
    open: '打开链接',
    save: '确定',
    unlink: '取消链接',
  },
  image: {
    view: '查看大图',
    remove: '删除',
    previous: '上一张',
    next: '下一张',
    close: '关闭 (Esc)',
    loadingError: '图片加载失败',
    zoomOut: '缩小',
    zoomIn: '放大',
  },
  codeBlock: {
    langType: '选择代码语言',
  },
} satisfies Translation;
