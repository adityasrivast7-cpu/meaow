(() => {
  const defaults = {
    name: 'Navya',
    giftTitle: 'An Unforgettable Celebration Day! 🎉',
    giftDetails: 'A special celebration dinner at your favorite restaurant, a weekend adventure getaway, and unlimited treats & pampering all day long!',
    letter: `Dearest Navya,

Happy, happy birthday! 🎂✨

From the endless laughs and quiet conversations to all the spontaneous adventures, having you in my life has been one of my greatest joys.

You bring so much light, warmth, and laughter wherever you go. Your kindness inspires everyone around you, and your smile has the superpower to brighten even the gloomiest day.

May this new year of life bring you boundless joy, wild success, good health, and dreams that come true in ways even better than you imagined.

Thank you for being so uniquely, wonderfully YOU.

With all my love and warmest wishes,
Always Yours ❤️`
  };

  const config = { ...defaults };

  document.querySelectorAll('[data-config]').forEach((el) => {
    const key = el.dataset.config;
    const storedValue = localStorage.getItem(`birthday:${key}`);

    if (storedValue !== null) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = storedValue;
      } else {
        el.textContent = storedValue;
      }
      config[key] = storedValue;
      return;
    }

    if (config[key] && !el.textContent.trim()) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = config[key];
      } else {
        el.textContent = config[key];
      }
    }
  });

  window.birthdayConfig = config;
})();
