// Uses animejs@3.2.2 (MIT) — https://github.com/juliangarnier/anime
import { createAnimation, normalizeOptions } from './presets';

const scope = '__rumoAnimate';
export default {
  name: 'animate',
  inserted(el, binding) {
    if (el[scope]) el[scope].controller.destroy();
    const controller = createAnimation(el);
    const key = JSON.stringify(normalizeOptions(binding.value));
    el[scope] = { controller, key };
    el.classList.add('rumo-animate');
    controller.play(binding.value);
  },
  update(el, binding) {
    const state = el[scope];
    if (!state) return;
    const key = JSON.stringify(normalizeOptions(binding.value));
    if (key === state.key) return;
    state.key = key;
    state.controller.play(binding.value);
  },
  unbind(el) {
    const state = el[scope];
    if (!state) return;
    state.controller.destroy();
    el.classList.remove('rumo-animate');
    delete el[scope];
  }
};
