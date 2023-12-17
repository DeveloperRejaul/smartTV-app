export const fileMiddleware = ({ dispatch, getState }) => (next) => async (action) => {
  // console.log(action.type);
  switch (action.type) {
  case 'content/updateTimes':
    // console.log(`===========${action.type}==============`);

    break;

  default:
    break;
  }
  return next(action);
};
