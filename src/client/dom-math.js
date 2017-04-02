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

const elementsAtHeight = (elements, height) => {
  return geometricFilter((el, rect) => rect.top === height, elements);
};

const elementsLeftOf = (elements, x) => {
  return geometricFilter((el, rect) => rect.left < x, elements);
};

export default {
  geometricFilter: geometricFilter,
  elementsAtHeight: elementsAtHeight,
  elementsLeftOf: elementsLeftOf
};
