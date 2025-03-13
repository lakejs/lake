import type { Translation } from '../types';
import { modifierText } from '../../utils/modifier-text';

export default {
  toolbar: {
    undo: `元に戻す (${modifierText('mod+Z')})`,
    redo: `やり直し (${modifierText('mod+Y')})`,
    selectAll: `すべて選択 (${modifierText('mod+A')})`,
    paragraph: '本文',
    blockQuote: '引用',
    numberedList: '番号付きリスト',
    bulletedList: '箇条書きリスト',
    checklist: 'チェックリスト',
    alignLeft: '左揃え',
    alignCenter: '中央揃え',
    alignRight: '右揃え',
    alignJustify: '両端揃え',
    increaseIndent: 'インデントを増やす',
    decreaseIndent: 'インデントを減らす',
    bold: `太字 (${modifierText('mod+B')})`,
    italic: `斜体 (${modifierText('mod+I')})`,
    underline: `下線 (${modifierText('mod+U')})`,
    strikethrough: '取り消し線',
    superscript: '上付き文字',
    subscript: '下付き文字',
    code: 'インラインコード',
    removeFormat: '形式を削除',
    formatPainter: '形式ペインタ',
    link: 'リンク',
    hr: '区切り線',
    video: '動画',
    codeBlock: 'コードブロック',
    heading: '見出し',
    heading1: '見出し 1',
    heading2: '見出し 2',
    heading3: '見出し 3',
    heading4: '見出し 4',
    heading5: '見出し 5',
    heading6: '見出し 6',
    list: 'リスト',
    table: 'テーブル',
    align: '整列',
    indent: 'インデント',
    fontFamily: 'フォント',
    fontSize: 'フォントサイズ',
    moreStyle: 'その他のスタイル',
    fontColor: '文字色',
    highlight: 'ハイライト',
    image: '画像',
    file: 'ファイル',
    emoji: '絵文字',
    equation: '数式',
    twitter: 'X (Twitter)',
    removeColor: 'デフォルト',
  },
  slash: {
    heading1: '見出し 1',
    heading1Desc: 'レベル 1 の見出しを作成',
    heading2: '見出し 2',
    heading2Desc: 'レベル 2 の見出しを作成',
    heading3: '見出し 3',
    heading3Desc: 'レベル 3 の見出しを作成',
    heading4: '見出し 4',
    heading4Desc: 'レベル 4 の見出しを作成',
    heading5: '見出し 5',
    heading5Desc: 'レベル 5 の見出しを作成',
    heading6: '見出し 6',
    heading6Desc: 'レベル 6 の見出しを作成',
    paragraph: '本文',
    paragraphDesc: '段落を作成',
    blockQuote: '引用',
    blockQuoteDesc: '引用を作成',
    numberedList: '番号付きリスト',
    numberedListDesc: '番号付きリストを作成',
    bulletedList: '箇条書きリスト',
    bulletedListDesc: '箇条書きリストを作成',
    checklist: 'チェックリスト',
    checklistDesc: 'チェックリストを作成',
    table: 'テーブル',
    tableDesc: 'テーブルを挿入',
    infoAlert: '情報ブロック',
    infoAlertDesc: '情報ブロックを作成',
    tipAlert: 'ヒントブロック',
    tipAlertDesc: 'ヒントブロックを作成',
    warningAlert: '警告ブロック',
    warningAlertDesc: '警告ブロックを作成',
    dangerAlert: '危険ブロック',
    dangerAlertDesc: '危険ブロックを作成',
    hr: '区切り線',
    hrDesc: '水平線を挿入',
    codeBlock: 'コードブロック',
    codeBlockDesc: 'コードブロックを挿入',
    video: '動画',
    videoDesc: 'YouTube から動画を挿入',
    equation: '数式',
    equationDesc: 'TeX 数式を挿入',
    twitter: 'Tweet',
    twitterDesc: 'Insert a post from X (Twitter)',
    image: '画像',
    imageDesc: '画像をアップロード',
    file: 'ファイル',
    fileDesc: 'ファイルをアップロード',
  },
  link: {
    newLink: '新しいリンク',
    url: 'リンク URL',
    title: 'リンクテキスト',
    copy: 'クリップボードにコピー',
    open: 'リンクを開く',
    save: '保存',
    unlink: 'リンクを削除',
  },
  table: {
    fitTable: 'ページ幅に合わせる',
    cellBackground: 'セルの背景色',
    column: '列',
    insertColumnLeft: '左に列を挿入',
    insertColumnRight: '右に列を挿入',
    deleteColumn: '列を削除',
    row: '行',
    insertRowAbove: '上に行を挿入',
    insertRowBelow: '下に行を挿入',
    deleteRow: '行を削除',
    merge: 'セルを結合',
    mergeUp: '上方向にセルを結合',
    mergeRight: '右方向にセルを結合',
    mergeDown: '下方向にセルを結合',
    mergeLeft: '左方向にセルを結合',
    split: 'セルを分割',
    splitLeftRight: 'セルを左右に分割',
    splitTopBottom: 'セルを上下に分割',
    remove: 'テーブルを削除',
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
    align: '整列',
    alignLeft: '左揃え',
    alignCenter: '中央揃え',
    alignRight: '右揃え',
    resize: '画像サイズを調整',
    pageWidth: 'ページ幅',
    originalWidth: '画像の元のサイズ',
    imageWidth: '{0} 画像サイズ',
    open: '新しいタブで画像を開く',
    caption: 'キャプション',
    captionPlaceholder: 'キャプションを入力してください',
  },
  file: {
    download: 'ダウンロード',
    remove: '削除',
  },
  video: {
    embed: '動画を埋め込む',
    remove: '削除',
    description: '下の入力欄に YouTube リンクを貼り付けてください。',
    url: 'リンク',
    urlError: '有効なリンクを入力してください。',
  },
  codeBlock: {
    langType: 'コード言語を選択',
  },
  equation: {
    save: '保存',
    help: 'サポートされている機能',
    placeholder: 'TeX 数式を入力してください',
  },
  twitter: {
    embed: 'Tweet を埋め込む',
    remove: '削除',
    description: '下の入力欄に X リンクを貼り付けてください。',
    url: 'リンク',
    urlError: '有効なリンクを入力してください。',
  },
} satisfies Translation;
