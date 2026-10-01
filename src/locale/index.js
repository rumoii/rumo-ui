import defaultLang from 'rumo-ui/src/locale/lang/zh-CN';
import enLang from 'rumo-ui/src/locale/lang/en';
import Vue from 'vue';
import deepmerge from 'deepmerge';
import Format from './format';

const format = Format(Vue);
let lang = defaultLang;
let merged = false;
let i18nHandler = function() {
  const vuei18n = Object.getPrototypeOf(this || Vue).$t;
  if (typeof vuei18n === 'function' && !!Vue.locale) {
    if (!merged) {
      merged = true;
      Vue.locale(
        Vue.config.lang,
        deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
      );
    }
    return vuei18n.apply(this, arguments);
  }
};

function getRawValue(obj, array) {
  if (!obj) return undefined;
  let current = obj;
  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[property];
  }
  return current;
}

export const t = function(path, options) {
  let value = i18nHandler.apply(this, arguments);
  if (value !== null && value !== undefined) return value;

  const array = path.split('.');

  // 1. 尝试从当前语言包获取
  let raw = getRawValue(lang, array);

  // 2. 多语言 fallback：若非中英语言包缺失该词条，回落到英文语言包 en.js
  if ((raw === undefined || raw === null || raw === '') && lang !== enLang) {
    raw = getRawValue(enLang, array);
  }

  // 3. 若英文包也未找到且当前不是默认中文包，尝试回退到中文包
  if ((raw === undefined || raw === null || raw === '') && lang !== defaultLang && enLang !== defaultLang) {
    raw = getRawValue(defaultLang, array);
  }

  if (raw !== undefined && raw !== null && raw !== '') {
    return format(raw, options);
  }

  return '';
};

export const use = function(l) {
  lang = l || lang;
};

export const i18n = function(fn) {
  i18nHandler = fn || i18nHandler;
};

export default { use, t, i18n };
