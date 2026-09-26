
const {
  stripScript,
  stripTemplate,
  genInlineComponentText
} = require('./util');
const md = require('./config');

module.exports = function(source) {
  const content = md.render(source);

  const startTag = '<!--rumo-demo:';
  const startTagLen = startTag.length;
  const endTag = ':rumo-demo-->';
  const endTagLen = endTag.length;

  let componenetsString = '';
  let id = 0; // demo 的 id
  let output = []; // 输出的内容
  let start = 0; // 字符串开始位置

  let commentStart = content.indexOf(startTag);
  let commentEnd = content.indexOf(endTag, commentStart + startTagLen);

  while (commentStart !== -1 && commentEnd !== -1) {
    // 截取<!-- rumo-demo: 之前的内容
    let firstContent = content.slice(start, commentStart);
    if (start === 0) {
      // 去除<script>|<style></style>后的内容
      firstContent = stripTemplate(firstContent);
    }
    output.push(firstContent); // <!-- rumo-demo: 之前

    // <!-- rumo-demo: 和 :rumo-demo -->之间
    const commentContent = content.slice(commentStart + startTagLen, commentEnd);

    // 去除<!-- rumo-demo: 和 :rumo-demo -->中间的script/style
    const html = stripTemplate(commentContent);

    // <!-- rumo-demo: 和 :rumo-demo -->中间的script
    const script = stripScript(commentContent);

    let demoComponentContent = genInlineComponentText(html, script);
    const demoComponentName = `rumo-demo${id}`;
    output.push(`<template slot="source"><${demoComponentName} /></template>`);
    componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`;

    // 重新计算下一次的位置
    id++;
    start = commentEnd + endTagLen;
    commentStart = content.indexOf(startTag, start);
    commentEnd = content.indexOf(endTag, commentStart + startTagLen);
  }

  // demo中存在<script>\<style>
  // todo: 优化这段逻辑
  let pageScript = '';
  if (componenetsString) {
    pageScript = `<script>
      export default {
        name: 'component-doc',
        components: {
          ${componenetsString}
        }
      }
    </script>`;
  }

  output.push(content.slice(start));

  return `
    <template>
      <section class="content rumo-doc">
        ${output.join('')}
      </section>
    </template>
    ${pageScript}
  `;
};
