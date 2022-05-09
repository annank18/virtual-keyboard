import Keyboard from './js/keyboard.js';
import createDomElement from './js/create-elements.js';

const body = document.querySelector('body');
const textarea = createDomElement('textarea', '', 'textarea');
const keyboard = new Keyboard();

window.onload = () => {
  // Header
  const header = createDomElement('div', '', 'header');
  header.append(createDomElement('h1', 'RSS Виртуальная клавиатура', 'header__text'));
  body.append(header);

  // Textarea
  body.append(textarea);

  // Keyboard
  body.append(keyboard.generateKeyboard());
  const subtitle = createDomElement('div', '', 'subtitle');
  subtitle.append(createDomElement('p', 'Клавиатура создана в операционной системе Windows \n Для переключения языка комбинация: левыe shift + alt', 'subtitle__text'));
  body.append(subtitle);

  const keyPress = (event, button, code) => {
    let text = '';
    let cursor = textarea.selectionStart;
    event.preventDefault();
    textarea.focus();
    if (code === 'CapsLock') keyboard.changeCapsLock(event);
    if ((code === 'AltLeft' && (event.shiftKey || keyboard.shift))
      || (code === 'AltRight' && (event.shiftKey || keyboard.shift))
      || (code === 'ShiftLeft' && event.altKey)
      || (code === 'ShiftRight' && event.altKey)) {
      keyboard.ChangeLang(event);
      keyboard.removeShift(event);
    }
    if (code === 'ShiftLeft' || code === 'ShiftRight') keyboard.updateKeyboard(event);
    if (code === 'ArrowLeft' && cursor > 0) textarea.setSelectionRange(cursor - 1, cursor - 1);
    if (code === 'ArrowRight') {
      cursor = textarea.selectionEnd;
      textarea.setSelectionRange(cursor + 1, cursor + 1);
    }

    if (code === 'ArrowUp') {
      const BeforeCursor = textarea.value.substring(0, cursor).split('\n');
      if (BeforeCursor.length === 1
        || BeforeCursor[BeforeCursor.length - 1].length >= 115) {
        cursor -= 115;
      } else if (BeforeCursor[BeforeCursor.length - 1].length
        <= BeforeCursor[BeforeCursor.length - 2].length % 115) {
        cursor -= (BeforeCursor[BeforeCursor.length - 2].length % 115) + 1;
      } else {
        cursor -= BeforeCursor[BeforeCursor.length - 1].length + 1;
      }
      if (cursor < 0) cursor = 0;
      textarea.setSelectionRange(cursor, cursor);
    }

    if (code === 'ArrowDown') {
      cursor = textarea.selectionEnd;
      const BeforeCursor = textarea.value.substring(0, cursor).split('\n');
      const AfterCursor = textarea.value.substring(textarea.selectionEnd).split('\n');
      if (AfterCursor.length === 1 || AfterCursor[0].length >= 115) {
        cursor += 115;
      } else if ((BeforeCursor[BeforeCursor.length - 1].length % 115)
      > AfterCursor[1].length) {
        cursor += AfterCursor[0].length + AfterCursor[1].length + 1;
      } else if ((((BeforeCursor[BeforeCursor.length - 1].length)
        + AfterCursor[0].length) > 115)) {
        cursor += AfterCursor[0].length;
      } else {
        cursor += (BeforeCursor[BeforeCursor.length - 1].length % 115)
          + AfterCursor[0].length + 1;
      }
      textarea.setSelectionRange(cursor, cursor);
    }
    if (code === 'Tab') text = '    ';
    if (code === 'Enter') text = '\n';
    if (code === 'Backspace') text = '-1';
    if (code === 'Delete') text = '+1';
    if (!button.dataset.noType) {
      text = button.textContent;
      keyboard.removeShift(event);
    }

    if (text) {
      let BeforeCursor = textarea.value.substring(0, cursor);
      let AfterCursor = textarea.value.substring(textarea.selectionEnd);
      if (text === '-1') {
        text = '';
        if (cursor === textarea.selectionEnd) {
          BeforeCursor = BeforeCursor.slice(0, -1);
          if (cursor > 0) {
            cursor -= 2;
          } else cursor -= 1;
        } else cursor -= 1;
      }
      if (text === '+1') {
        text = '';
        if (cursor === textarea.selectionEnd) {
          AfterCursor = AfterCursor.slice(1);
        }
        cursor -= 1;
      }
      textarea.value = BeforeCursor + text + AfterCursor;
      textarea.setSelectionRange(cursor + 1, cursor + 1);
      if (text === '    ') textarea.setSelectionRange(cursor + 4, cursor + 4);
    }
  };

  // Клавиатура физическая
  document.addEventListener('keydown', (event) => {
    const button = document.querySelector(`[data-code=${event.code}]`);
    if (button) {
      button.classList.add('active');
      keyPress(event, button, event.code);
    }
  });

  document.addEventListener('keyup', (event) => {
    const button = document.querySelector(`[data-code=${event.code}]`);
    if (button) {
      button.classList.remove('active');
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        keyboard.removeShift(event);
        keyboard.updateKeyboard(event);
      }
    }
  });

  document.querySelector('.keyboard').addEventListener('click', (event) => {
    if (event.target.closest('.key')) {
      const button2 = event.target.closest('.key');
      if (button2.dataset.code === 'ShiftLeft' || button2.dataset.code === 'ShiftRight') {
        keyboard.shift = !keyboard.shift;
        button2.classList.toggle('active');
      }
      keyPress(event, button2, button2.dataset.code);
    }
  });
};

/* let header = document.createElement('header')
document.documentElement.append(header);
header.className = 'header'

let container = document.createElement('div')
document.body.append(container)
container.className = 'container'

let keyboard = document.createElement('div')
keyboard.className = 'keyboard'
container.append(keyboard) */
