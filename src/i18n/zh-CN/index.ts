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
    video: '视频',
    codeBlock: '代码块',
    heading: '标题',
    heading1: '标题 1',
    heading2: '标题 2',
    heading3: '标题 3',
    heading4: '标题 4',
    heading5: '标题 5',
    heading6: '标题 6',
    list: '列表',
    table: '表格',
    align: '对齐方式',
    indent: '缩进',
    fontFamily: '字体',
    fontSize: '文字大小',
    moreStyle: '更多样式',
    fontColor: '文字颜色',
    highlight: '文字背景',
    image: '图片',
    file: '文件',
    emoji: '表情',
    equation: '数学公式',
    removeColor: '默认',
  },
  slash: {
    heading1: '标题 1',
    heading1Desc: '创建标题 1',
    heading2: '标题 2',
    heading2Desc: '创建标题 2',
    heading3: '标题 3',
    heading3Desc: '创建标题 3',
    heading4: '标题 4',
    heading4Desc: '创建标题 4',
    heading5: '标题 5',
    heading5Desc: '创建标题 5',
    heading6: '标题 6',
    heading6Desc: '创建标题 6',
    paragraph: '正文',
    paragraphDesc: '把当前段落改成正文',
    blockQuote: '引用',
    blockQuoteDesc: '创建引用',
    numberedList: '编号',
    numberedListDesc: '创建编号列表',
    bulletedList: '项目符号',
    bulletedListDesc: '创建项目符号列表',
    checklist: '任务列表',
    checklistDesc: '创建任务列表',
    table: '表格',
    tableDesc: '插入表格',
    hr: '分割线',
    hrDesc: '插入分割线',
    codeBlock: '代码块',
    codeBlockDesc: '插入代码块',
    video: '视频',
    videoDesc: '插入 YouTube 视频',
    equation: '数学公式',
    equationDesc: '支持 TeX 语法',
    image: '图片',
    imageDesc: '上传图片',
    file: '文件',
    fileDesc: '上传文件',
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
  table: {
    fitTable: '自适应宽度',
    column: '列',
    insertColumnLeft: '左侧插入列',
    insertColumnRight: '右侧插入列',
    deleteColumn: '删除列',
    row: '行',
    insertRowAbove: '上方插入行',
    insertRowBelow: '下方插入行',
    deleteRow: '删除行',
    merge: '合并单元格',
    mergeUp: '向上合并单元格',
    mergeRight: '向右合并单元格',
    mergeDown: '向下合并单元格',
    mergeLeft: '向左合并单元格',
    split: '拆分单元格',
    splitLeftRight: '左右拆分单元格',
    splitTopBottom: '上下拆分单元格',
    remove: '删除表格',
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
    align: '对齐方式',
    alignLeft: '左对齐',
    alignCenter: '居中',
    alignRight: '右对齐',
    resize: '调整图片大小',
    pageWidth: '图片适应页面大小',
    originalWidth: '图片原始大小',
    imageWidth: '{0} 图片大小',
    open: '在新标签页中打开图片',
    caption: '图片描述',
    captionPlaceholder: '请输入图片描述',
  },
  file: {
    download: '下载',
    remove: '删除',
  },
  video: {
    embed: '嵌入视频',
    remove: '删除',
    description: '在下面的输入框里，粘贴 YouTube 链接。',
    url: '链接',
    urlError: '请输入有效的链接。',
  },
  codeBlock: {
    langType: '选择代码语言',
  },
  equation: {
    save: '确定',
    help: '支持的功能',
    placeholder: '请输入 TeX 表达式',
  },
} satisfies Translation;
