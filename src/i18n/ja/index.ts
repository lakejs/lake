import type { Translation } from '../types';

export default {
  toolbar: {
    undo: '元に戻す (Ctrl+Z)',
    redo: 'やり直し (Ctrl+Y)',
    selectAll: 'すべて選択 (Ctrl+A)',
    paragraph: 'テキスト',
    blockQuote: 'ブロック引用',
    numberedList: '番号付きリスト',
    bulletedList: '箇条書きリスト',
    checklist: 'タスクリスト',
    alignLeft: '左揃え',
    alignCenter: '中心揃え',
    alignRight: '右揃え',
    alignJustify: '左右に並べ替え',
    increaseIndent: 'インデントを増やす',
    decreaseIndent: 'インデントを減らす',
    bold: '太字 (Ctrl+B)',
    italic: '斜体 (Ctrl+I)',
    underline: '下線 (Ctrl+U)',
    strikethrough: '取り消し線',
    superscript: '上付き文字',
    subscript: '下付き文字',
    code: 'インラインコード',
    removeFormat: '形式を削除',
    formatPainter: '形式ペインタ',
    link: 'リンク',
    hr: '区切り線',
    codeBlock: 'コードブロック',
    heading: 'タイトル',
    heading1: 'タイトル 1',
    heading2: 'タイトル 2',
    heading3: 'タイトル 3',
    heading4: 'タイトル 4',
    heading5: 'タイトル 5',
    heading6: 'タイトル 6',
    list: 'リスト',
    align: '文字揃え',
    indent: 'インデント',
    fontFamily: 'フォント',
    fontSize: '文字サイズ',
    moreStyle: 'その他のスタイル',
    fontColor: '文字色',
    highlight: '文字の背景',
    image: '画像',
    removeColor: 'デフォルト',
  },
  link: {
    newLink: '新しいリンク',
    url: 'リンク URL',
    title: 'リンク文字',
    copy: 'クリップボードにコピー',
    open: 'リンクを開く',
    save: '確認',
    unlink: 'リンクを削除',
  },
  image: {
    view: '大きな画像を見る',
    remove: '削除',
    previous: '前の画像',
    next: '次の画像',
    close: '閉じる (Esc)',
    loadingError: '画像を読み込めません',
    zoomOut: '縮小',
    zoomIn: '拡大',
  },
} satisfies Translation;