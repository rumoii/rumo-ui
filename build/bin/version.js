var fs = require('fs');
var path = require('path');
var version = process.env.VERSION || require('../../package.json').version;
// 仅登记当前版本；显示名取 major.minor
var content = {};
content[version] = version.split('.').slice(0, 2).join('.');
fs.writeFileSync(path.resolve(__dirname, '../../examples/versions.json'), JSON.stringify(content));
