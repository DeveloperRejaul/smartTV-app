export default () => {
  const IHeight = window.innerHeight;
  const IWidth = window.innerWidth;
  const OWidth = window.outerWidth;
  const OHeight = window.outerHeight;
  return { IHeight, IWidth, OHeight, OWidth };
};
