import buttonData from './buttonData.js';
import createDomElement from './create-elements.js';

export default class Keyboard {
  constructor() {
    this.lang = 'en';
    this.caps = 'off';
    this.shift = false;
  }

  generateKeyboard() {
    const keyboardContainer = createDomElement('div', '', 'keyboard__container');
    const keyboard = createDomElement('div', '', 'keyboard');
    this.languageCheck();
    // из датасет элементы создать
    for (let i = 0; i < buttonData.length; i += 1) {
      const keyline = createDomElement('div', '', 'key__line');
      // клавиша тип
      buttonData[i].forEach((e) => {
        const Label = (e.key.ru && e.key.en) ? e.key[this.lang] : e.key;
        const key = createDomElement('div', Label, 'key');
        if (e.class)key.classList.add(e.class);
        key.dataset.code = e.code;
        if (e.key.ru && e.key.en) {
          key.dataset.ru = e.key.ru;
          key.dataset.en = e.key.en;
        }
        if (e.shift) {
          key.dataset.ruShift = e.shift.ru;
          key.dataset.enShift = e.shift.en;
        }
        if (e.noType) {
          key.dataset.noType = true;
        }
        keyline.append(key);
      });
      keyboard.append(keyline);
    }
    keyboardContainer.append(keyboard);
    return keyboardContainer;
  }

  // shift alt
  updateKeyboard(event) {
    const { lang } = this;
    if (event.shiftKey || this.shift) {
      document.querySelectorAll('.key').forEach((e) => {
        if (e.dataset[`${lang}Shift`]) {
          if (this.caps === 'on') {
            e.innerHTML = e.dataset[`${lang}Shift`].toLowerCase();
          } else e.innerHTML = e.dataset[`${lang}Shift`];
        } else if (e.dataset[lang]) e.innerHTML = e.dataset[lang];
      });
    } else {
      document.querySelectorAll('.key').forEach((e) => {
        if (e.dataset[lang]) {
          if (this.caps === 'on' && !(event.shiftKey || this.shift)) {
            e.innerHTML = e.dataset[lang].toUpperCase();
          } else e.innerHTML = e.dataset[lang];
        }
      });
    }
  }

  removeShift(event) {
    if (this.shift) {
      this.shift = !this.shift;
      document.querySelector('.key_leftshift').classList.remove('active');
      document.querySelector('.key_rightshift').classList.remove('active');
      this.updateKeyboard(event);
    }
  }

  // Local Storage get
  languageCheck() {
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang');
    } else {
      localStorage.setItem('lang', this.lang);
    }
  }

  // LS сохранить переключение языков
  ChangeLang(event) {
    if (this.lang === 'en') {
      this.lang = 'ru';
    } else {
      this.lang = 'en';
    }
    localStorage.setItem('lang', this.lang);
    this.updateKeyboard(event);
  }

  // Caps Lock индикатор
  capsLock() {
    if (this.caps === 'on') {
      document.querySelector('.caps_icon').classList.add('caps_on');
    } else {
      document.querySelector('.caps_icon').classList.remove('caps_on');
    }
  }

  // Переключение CapsLock
  changeCapsLock(event) {
    if (this.caps === 'on') {
      this.caps = 'off';
    } else {
      this.caps = 'on';
    }
    this.capsLock();
    this.updateKeyboard(event);
  }
}
