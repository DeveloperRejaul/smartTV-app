import path from 'path';

export const getFile = () => (req, res) => {
  try {
    const { path:paramsPath } = req.params;
    if (!path) return res.status(404).send('please provide path in params');
    res.status(200).sendFile(path.join( path.resolve(), 'upload', paramsPath));
  } catch (error) {
    res.status(404).send('Something went wrong.');
  }
};