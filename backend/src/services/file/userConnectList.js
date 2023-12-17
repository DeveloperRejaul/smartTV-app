const userList = [];
module.exports.addUser =  (user) => userList.push(user);
module.exports.removeUser = (id) => {
  const index = userList.findIndex((user) => user.socketId === id);
  if (index !== -1) {
    userList.splice(index, 1);
    return 'User removed successfully from socket connection list ';
  }

  return 'User not found in socket connection list';
};
module.exports.getUser = () => userList;
