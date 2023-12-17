export default (name, data) => {
  const queryParams = new URLSearchParams();
  queryParams.set(name, JSON.stringify(data));
  return { data: queryParams.toString() };
};
