import urid from "urid";
export const mapUsersToRoom = (waitingUsers) => {
  while (waitingUsers.length >= 2) {
    let user1 = waitingUsers.pop();

    let user2 = waitingUsers.pop();

    let id1 = urid(20);

    let id2 = urid(20);

    let roomId = id1 + "-" + id2;

    user1.socket.join(roomId);

    user2.socket.join(roomId);

    let users = [
      {
        username: user1.username,
        roomId: roomId,
        color: "b",
        userId: id1,
      },
      {
        username: user2.username,
        roomId: roomId,
        color: "w",
        userId: id2,
      },
    ];

    user1.socket.to(roomId).emit("recieve_room_users", users);

    user2.socket.to(roomId).emit("recieve_room_users", users);
  }

  return waitingUsers;
};
