const geometricFilter = (fn, elements) => {
  let arr = [];
  for (let i = 0; i < elements.length; i++) {
    let rect = elements[i].getBoundingClientRect();
    if (fn(elements[i], rect)) {
      arr.push(elements[i]);
    }
  }
  return arr;
};

const elementsAtSameHeight = (elements, el) => {
  const r = el.getBoundingClientRect();
  return geometricFilter((el, rect) => rect.top === r.top, elements);
};

const elementsLeftOf = (elements, el) => {
  const r = el.getBoundingClientRect();
  return geometricFilter((el, rect) => rect.left < r.left, elements);
};

export default {
  geometricFilter: geometricFilter,
  elementsAtSameHeight: elementsAtSameHeight,
  elementsLeftOf: elementsLeftOf
};
