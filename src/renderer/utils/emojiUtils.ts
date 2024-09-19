const UFE0Fg = /\uFE0F/g;

// avoid using a string literal like '\u200D' here because minifiers expand it inline
const U200D = String.fromCharCode(0x200d);

function toCodePoint(unicodeSurrogates: string, sep?: string) {
  const r = [];
  let c = 0;
  let p = 0;
  let i = 0;

  while (i < unicodeSurrogates.length) {
    // eslint-disable-next-line no-plusplus
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      // eslint-disable-next-line no-bitwise
      r.push((0x10000 + ((p - 0xd800) << 10) + (c - 0xdc00)).toString(16));
      p = 0;
    } else if (c >= 0xd800 && c <= 0xdbff) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join(sep ?? '-');
}

// eslint-disable-next-line import/prefer-default-export
export function grabTheRightIcon(emoji: string) {
  return toCodePoint(
    emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, '') : emoji,
  );
}
