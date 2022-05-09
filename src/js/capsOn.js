const CapsLock = (event) => {
  if (event.getModifierState('CapsLock')) {
    document.querySelector('.caps_icon').classList.toggle('caps_on');
  } else {
    document.querySelector('.caps_icon').classList.toggle('caps_on');
  }
};

export default CapsLock;
