import type { Translation } from '../types';
import { modifierText } from '../../utils/modifier-text';

export default {
  toolbar: {
    undo: `작업취소 (${modifierText('mod+Z')})`,
    redo: `작업재개 (${modifierText('mod+Y')})`,
    selectAll: `전체 선택 (${modifierText('mod+A')})`,
    paragraph: '텍스트',
    blockQuote: '인용문',
    numberedList: '순서 목록',
    bulletedList: '비순서 목록',
    checklist: '체크리스트',
    alignLeft: '왼쪽 정렬',
    alignCenter: '가운데 정렬',
    alignRight: '오른쪽 정렬',
    alignJustify: '좌우로 정렬',
    increaseIndent: '들여쓰기 증가',
    decreaseIndent: '들여쓰기 줄이기',
    bold: `굵게 (${modifierText('mod+B')})`,
    italic: `기울임꼴 (${modifierText('mod+I')})`,
    underline: `밑줄 (${modifierText('mod+U')})`,
    strikethrough: '취소선',
    superscript: '위첨자',
    subscript: '아래 첨자',
    code: '인라인 코드',
    removeFormat: '형식 지우기',
    formatPainter: '형식 페인터',
    link: '링크',
    hr: '구분선',
    codeBlock: '코드 블록',
    heading: '제목',
    heading1: '제목 1',
    heading2: '제목 2',
    heading3: '제목 3',
    heading4: '제목 4',
    heading5: '제목 5',
    heading6: '제목 6',
    list: '목록',
    align: '정렬',
    indent: '들여쓰기',
    fontFamily: '글꼴',
    fontSize: '글자 크기',
    moreStyle: '더 많은 스타일',
    fontColor: '글자 색상',
    highlight: '글자 배경',
    image: '이미지',
    file: '파일',
    removeColor: '기본색',
  },
  link: {
    newLink: '새 링크',
    url: '링크 URL',
    title: '링크 텍스트',
    copy: '클립보드에 복사',
    open: '링크 열기',
    save: '확인',
    unlink: '링크 제거',
  },
  image: {
    view: '큰 이미지 보기',
    remove: '삭제',
    previous: '이전 이미지',
    next: '다음 이미지',
    close: '닫기 (Esc)',
    loadingError: '이미지를 로드할 수 없습니다',
    zoomOut: '축소',
    zoomIn: '확대',
  },
  codeBlock: {
    langType: '코드언어 선택',
  },
} satisfies Translation;
