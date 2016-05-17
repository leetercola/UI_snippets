onst UPDATE_PROPS = 'UPDATE_PROPS';
const initialState = {
  'prop1': 'string',
  'prop2': 5
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_PROPS:
      return {
        ...state,
        prop1: action.prop1,
        prop2: action.prop2
      };
    default:
      return state;
  }
}

export function updateProps(propsHash) {
  var action = {
    type: UPDATE_PROPS
  };

  for (const propKey in propsHash) {
    if (typeof initialState[propKey] !== 'undefined') {
      action[propKey] = propsHash[propKey];
    }
  }
  return action;
}
