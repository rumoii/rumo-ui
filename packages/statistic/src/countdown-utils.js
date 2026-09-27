// Derived from element-plus/packages/components/countdown/src/utils.ts (MIT) — https://github.com/element-plus/element-plus @92d3e8fb383c338eab1c0b3afd3ad33bf18032e1
const units = [['Y', 31536000000], ['M', 2592000000], ['D', 86400000], ['H', 3600000], ['m', 60000], ['s', 1000], ['S', 1]];
export function getTime(value) { return value && typeof value.valueOf === 'function' ? Number(value.valueOf()) : Number(value); }
export function formatTime(value, format) {
  let remaining = Math.max(0, value);
  const escaped = [];
  let result = format.replace(/\[[^\]]*\]/g, match => { escaped.push(match.slice(1, -1)); return '\u0000' + (escaped.length - 1) + '\u0000'; });
  units.forEach(unit => {
    const regex = new RegExp(unit[0] + '+', 'g');
    result = result.replace(regex, match => {
      const amount = Math.floor(remaining / unit[1]);
      remaining -= amount * unit[1];
      let text = String(amount);
      while (text.length < match.length) text = '0' + text;
      return text;
    });
  });
  return result.replace(/\u0000(\d+)\u0000/g, (_, index) => escaped[Number(index)]);
}
