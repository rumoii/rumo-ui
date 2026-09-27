// Uses animejs@3.2.2 (MIT) — https://github.com/juliangarnier/anime
import anime from 'animejs';

const presets = {
  'fade-in': { opacity: [0, 1] },
  'fade-in-up': { opacity: [0, 1], translateY: [24, 0] },
  'fade-in-down': { opacity: [0, 1], translateY: [-24, 0] },
  'slide-in-left': { opacity: [0, 1], translateX: [-32, 0] },
  'slide-in-right': { opacity: [0, 1], translateX: [32, 0] },
  'zoom-in': { opacity: [0, 1], scale: [0.85, 1] },
  pulse: { scale: [1, 1.08, 1] },
  shake: { translateX: [0, -10, 10, -10, 10, 0] },
  flash: { opacity: [1, 0, 1] },
  'fade-out': { opacity: [1, 0] },
  'fade-out-up': { opacity: [1, 0], translateY: [0, -24] },
  'fade-out-down': { opacity: [1, 0], translateY: [0, 24] },
  'fade-out-left': { opacity: [1, 0], translateX: [0, -32] },
  'fade-out-right': { opacity: [1, 0], translateX: [0, 32] }
};

export function normalizeOptions(value) {
  const options = typeof value === 'string' ? { effect: value } : (value || {});
  return {
    effect: presets[options.effect] ? options.effect : 'fade-in',
    duration: options.duration === undefined ? 600 : Math.max(0, Number(options.duration) || 0),
    delay: Math.max(0, Number(options.delay) || 0),
    loop: options.loop === true || (typeof options.loop === 'number' && options.loop > 0 && Math.floor(options.loop) === options.loop) ? options.loop : false
  };
}

export function createAnimation(el) {
  const initial = { opacity: el.style.opacity, transform: el.style.transform };
  const media = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let instance = null;
  let version = 0;

  const restore = () => {
    el.style.opacity = initial.opacity;
    el.style.transform = initial.transform;
  };
  const stop = () => {
    version++;
    if (instance) instance.pause();
    instance = null;
  };
  const onMotionChange = () => {
    if (media.matches) {
      stop();
      restore();
    }
  };
  if (media) {
    if (media.addEventListener) media.addEventListener('change', onMotionChange);
    else if (media.addListener) media.addListener(onMotionChange);
  }

  return {
    play(value) {
      stop();
      restore();
      if (media && media.matches) return;
      const options = normalizeOptions(value);
      const current = version;
      instance = anime(Object.assign({
        targets: el,
        easing: 'easeOutCubic',
        duration: options.duration,
        delay: options.delay,
        loop: options.loop,
        complete: () => {
          if (current !== version) return;
          restore();
          if (options.effect.indexOf('fade-out') === 0) el.style.opacity = '0';
          instance = null;
        }
      }, presets[options.effect]));
    },
    destroy() {
      stop();
      if (media) {
        if (media.removeEventListener) media.removeEventListener('change', onMotionChange);
        else if (media.removeListener) media.removeListener(onMotionChange);
      }
      restore();
    }
  };
}
