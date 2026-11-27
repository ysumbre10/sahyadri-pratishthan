// Measure at the fixed print size; screen scaling never changes page breaks.
function paginateLetterText(value, layout) {
  let remaining = value || '\u00a0';
  const graphemes = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('mr', { granularity: 'grapheme' }) : null;
  const fitPrefix = parts => {
    let low = 0, high = parts.length;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (layout.fits(parts.slice(0, mid).join(''))) low = mid;
      else high = mid - 1;
    }
    return parts.slice(0, low).join('');
  };
  while (remaining) {
    if (layout.fits(remaining)) { layout.commit(remaining); return; }
    const words = remaining.match(/\S+\s*|\s+/gu) || [remaining];
    let prefix = fitPrefix(words);
    if (!prefix) {
      // Move an intact word to a fresh page before splitting a very long token.
      if (!layout.isEmpty()) { layout.nextPage(); continue; }
      const first = words[0];
      const parts = graphemes ? Array.from(graphemes.segment(first), p => p.segment) : Array.from(first);
      prefix = fitPrefix(parts);
      if (!prefix) throw new Error('मजकूर मावत नाही. अक्षर आकार कमी करून पुन्हा प्रयत्न करा.');
    }
    layout.commit(prefix);
    remaining = remaining.slice(prefix.length);
    if (remaining) layout.nextPage();
  }
}
