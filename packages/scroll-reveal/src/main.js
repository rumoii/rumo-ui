// Derived from AOS(精简重写) (MIT) — https://github.com/michalsnik/aos @329fb34f777034345f4d3f4def4dc3bcc300cc2e
const effects = ['fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in'];
const scope = '__rumoScrollReveal';

function normalize(value) {
  const source = typeof value === 'string' ? { effect: value } : (value || {});
  return {
    effect: effects.indexOf(source.effect) > -1 ? source.effect : 'fade-up',
    once: source.once === true,
    delay: Math.max(0, Number(source.delay) || 0),
    offset: Math.max(0, Number(source.offset === undefined ? 120 : source.offset) || 0)
  };
}

function createState(el, options) {
  const media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const originalDelay = el.style.transitionDelay;
  let observer = null;
  let generation = 0;
  let revealed = false;
  let destroyed = false;
  let current = options;

  const disconnect = () => {
    generation++;
    if (observer) observer.disconnect();
    observer = null;
  };
  const show = () => { el.classList.add('is-visible'); revealed = true; };
  const observe = () => {
    disconnect();
    if (media && media.matches) { show(); return; }
    if (current.once && revealed) { show(); return; }
    if (typeof IntersectionObserver === 'undefined') { show(); return; }
    const token = generation;
    observer = new IntersectionObserver(entries => {
      if (destroyed || token !== generation) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          show();
          if (current.once) disconnect();
        } else if (!current.once) {
          el.classList.remove('is-visible');
        }
      });
    }, { rootMargin: '0px 0px -' + current.offset + 'px 0px', threshold: 0 });
    observer.observe(el);
  };
  const onMotionChange = () => observe();
  if (media) {
    if (media.addEventListener) media.addEventListener('change', onMotionChange);
    else if (media.addListener) media.addListener(onMotionChange);
  }

  const apply = next => {
    disconnect();
    el.classList.remove('rumo-scroll-reveal--' + current.effect);
    current = next;
    revealed = false;
    el.classList.add('rumo-scroll-reveal', 'rumo-scroll-reveal--' + current.effect);
    el.classList.remove('is-visible');
    el.style.transitionDelay = current.delay + 'ms';
    observe();
  };
  apply(options);

  return {
    update(next) { apply(next); },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      disconnect();
      if (media) {
        if (media.removeEventListener) media.removeEventListener('change', onMotionChange);
        else if (media.removeListener) media.removeListener(onMotionChange);
      }
      el.classList.remove('rumo-scroll-reveal', 'rumo-scroll-reveal--' + current.effect, 'is-visible');
      el.style.transitionDelay = originalDelay;
    }
  };
}

const ScrollReveal = {
  name: 'scroll-reveal',
  inserted(el, binding) {
    if (el[scope]) el[scope].state.destroy();
    const options = normalize(binding.value);
    el[scope] = { state: createState(el, options), key: JSON.stringify(options) };
  },
  update(el, binding) {
    const holder = el[scope];
    if (!holder) return;
    const options = normalize(binding.value);
    const key = JSON.stringify(options);
    if (key === holder.key) return;
    holder.key = key;
    holder.state.update(options);
  },
  unbind(el) {
    if (!el[scope]) return;
    el[scope].state.destroy();
    delete el[scope];
  }
};

ScrollReveal.install = function(Vue) { Vue.directive(ScrollReveal.name, ScrollReveal); };
export default ScrollReveal;
