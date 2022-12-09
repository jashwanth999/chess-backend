import { pieceValidMethodMap } from "./validMoveService.js";

import { isValidMoveForCheckMate } from "./validMoveService.js";

import { callingOpponentForCheckMate } from "./checkMateService.js";

import {
  kingAbleToMoveAfterCheckMate,
  checkMateStopFromOTherPiece,
} from "./finalCheckMateService.js";
export const dropValidMove = (
  pos,
  grabpos,
  posOp,
  grabposOp,
  users,
  user,
  pieces,
  piecesOpponent,
  kingPos,
  kingPosOp,
  socket,
  myTurn,
  killedPieces,
  opponentKilledPieces,
  roomid
) => {
  try {
    if (
      !pieceValidMethodMap(
        grabPosition[0],
        grabPosition[1],
        y,
        x,
        users[0]?.username === user.username
          ? pieces[grabpos]?.pieceName
          : piecesOpponent[grabpos]?.pieceName,
        users[0]?.username === user.username ? pieces : piecesOpponent
      )
    ) {
      socket.emit("send_valid_move", {
        validMove: false,
        pieces: pieces,
        piecesOpponent: piecesOpponent,
      });
    } else if (users[0].username === user.username && pieces[grabpos]) {
      let piecesData = pieces[grabpos];

      let piecesDataOp = piecesOpponent[grabposOp];

      let piecesPosData = pieces[pos];

      let piecesPosDataOp = piecesOpponent[posOp];

      if (
        pieces[pos] &&
        (pieces[pos].color === pieces[grabpos].color ||
          pieces[pos].pieceName === "k")
      ) {
        // message to user  not a valid move

        socket.emit("send_valid_move", {
          validMove: false,
          pieces: pieces,
          piecesOpponent: piecesOpponent,
        });

        return;
      }

      let kingFlag = false;

      if (pieces[grabpos].pieceName === "k") {
        kingFlag = true;
        //   dispatch(changeKingPosition(pos));
        // message to user change king position

        socket.emit("change_king_position", { kingPos: pos });
      }
      let killedPiecesData;

      if (pieces[pos]) {
        killedPiecesData = pieces[pos];
      }

      pieces[grabpos] = "";
      pieces[pos] = piecesData;

      piecesOpponent[posOp] = piecesDataOp;
      piecesOpponent[grabposOp] = "";

      if (
        isValidMoveForCheckMate(
          kingFlag ? Number(pos.split(":")[0]) : Number(kingPos.split(":")[0]),
          kingFlag ? Number(pos.split(":")[1]) : Number(kingPos.split(":")[1]),
          pieces
        )
      ) {
        pieces[grabpos] = piecesData;

        pieces[pos] = piecesPosData;

        piecesOpponent[grabposOp] = piecesDataOp;

        piecesOpponent[posOp] = piecesPosDataOp;

        if (kingFlag) {
          // message to user change the king position to prev

          socket.emit("change_king_position", { kingPos: grabpos });
        }

        socket.emit("send_valid_move", {
          validMove: false,
          pieces: pieces,
          piecesOpponent: piecesOpponent,
        });

        // message to user not a valid move

        return;
      }

      //after success ,  checking our move for checkmate

      if (
        callingOpponentForCheckMate(
          7 - Number(kingPosOp.split(":")[0]),
          7 - Number(kingPosOp.split(":")[1]),
          y,
          x,
          pieces[pos].pieceName,
          pieces
        ) &&
        pieces[pos].pieceName !== "k"
      ) {
        console.log("check called by opponent");

        let checkMateCount = isValidMoveForCheckMate(
          7 - Number(kingPos.split(":")[0]),
          7 - Number(kingPos.split(":")[1]),
          pieces
        );

        console.log("checkMateCount", checkMateCount);

        if (checkMateCount > 1) {
          if (
            !kingAbleToMoveAfterCheckMate(
              7 - Number(kingPosOp.split(":")[0]),
              7 - Number(kingPosOp.split(":")[1]),
              pieces
            )
          ) {
            //   setCheckMatePopUpData({
            //     roomId: roomid,
            //     winnerName: users[0].username,
            //     color: "b",
            //   });
            //   checkMateMessageToSocket(roomid, users[0].username, "b");
            // message to opponent final check mate
            // message to user final check mate

            socket.emit("check_mate", {
              roomId: roomid,
              winnerName: users[0].username,
              color: "b",
            });

            socket.to(roomid).emit("check_mate", {
              roomId: roomid,
              winnerName: users[0].username,
              color: "b",
            });
          }
        } else if (
          !checkMateStopFromOTherPiece(
            pieces,
            7 - Number(kingPosOp.split(":")[0]),
            7 - Number(kingPosOp.split(":")[1]),
            y,
            x
          ) &&
          !kingAbleToMoveAfterCheckMate(
            7 - Number(kingPosOp.split(":")[0]),
            7 - Number(kingPosOp.split(":")[1]),
            pieces
          )
        ) {
          // setCheckMatePopUpData({
          //   roomId: roomid,
          //   winnerName: users[0].username,
          //   color: "b",
          // });
          // message to opponent final check mate
          // message to user final check mate

          socket.emit("check_mate", {
            roomId: roomid,
            winnerName: users[0].username,
            color: "b",
          });

          socket.to(roomid).emit("check_mate", {
            roomId: roomid,
            winnerName: users[0].username,
            color: "b",
          });
        }
      }

      let turn = true;

      if (grabpos === pos) {
        // message to user that user turn not done

        turn = true;
      } else {
        // message to user that user turn  done

        turn = false;
      }

      if (killedPiecesData) {
        // send killed pieces data to user
        killedPieces = [...killedPieces, killedPiecesData];
      }

      if (y === 0 && pieces[pos] && pieces[pos].pieceName === "p") {
        //   setPawnReachedOtherSideData({
        //     open: true,
        //     pieces,
        //     piecesOpponent,
        //     pos: pos,
        //     posOp: posOp,
        //     roomid,
        //     myTurn,
        //     killedPieces,
        //     opponentKilledPieces,
        //     time,
        //     opponent: false,
        //   });
        // message to user pawn reached other side
      }

      // message to user highlight the prev move and current move

      // message to opponent highlight the prev move and current move

      socket.emit("recieve_room_data", {
        roomid,
        pieces,
        piecesOpponent,
        myTurn,
        killedPieces,
        opponentKilledPieces,
        time,
        prevMovePos: {
          grabpos: grabpos,
          pos: pos,
        },
      });

      socket.to(roomid).emit("recieve_room_data", {
        roomid,
        pieces,
        piecesOpponent,
        myTurn,
        killedPieces,
        opponentKilledPieces,
        time,
        prevMovePos: {
          grabpos: grabposOp,
          pos: posOp,
        },
      });
    } else if (users[1].username === user.username && piecesOpponent[grabpos]) {
      let piecesData = piecesOpponent[grabpos];

      let piecesDataOp = pieces[grabposOp];

      let piecesPosData = piecesOpponent[pos];

      let piecesPosDataOp = pieces[posOp];

      if (
        piecesOpponent[pos] &&
        (piecesOpponent[pos].color === piecesOpponent[grabpos].color ||
          piecesOpponent[pos].pieceName === "k")
      ) {
        // message to opponent not a valid move

        socket.emit("send_valid_move", {
          validMove: false,
          pieces: pieces,
          piecesOpponent: piecesOpponent,
        });
      }

      let kingFlag = false;

      if (piecesOpponent[grabpos].pieceName === "k") {
        kingFlag = true;
        //   dispatch(changeOpponentKingPosition(pos));

        // message to opponent change the king position

        socket.emit("change_king_position", { kingPos: pos });
      }

      let killedPiecesOpponentData;

      if (piecesOpponent[pos]) {
        killedPiecesOpponentData = piecesOpponent[pos];
      }

      piecesOpponent[grabpos] = "";
      piecesOpponent[pos] = piecesData;

      pieces[posOp] = piecesDataOp;
      pieces[grabposOp] = "";

      if (
        isValidMoveForCheckMate(
          kingFlag
            ? Number(pos.split(":")[0])
            : Number(kingPosOp.split(":")[0]),
          kingFlag
            ? Number(pos.split(":")[1])
            : Number(kingPosOp.split(":")[1]),
          piecesOpponent
        )
      ) {
        piecesOpponent[grabpos] = piecesData;

        piecesOpponent[pos] = piecesPosData;

        pieces[grabposOp] = piecesDataOp;

        pieces[posOp] = piecesPosDataOp;

        if (kingFlag) {
          // message to opponent change the king pos to prev pos
          //   dispatch(changeOpponentKingPosition(grabpos));

          socket.emit("change_king_position", { kingPos: grabpos });
        }

        return;
      }

      //after success checking our move for checkmate to opponent

      if (
        callingOpponentForCheckMate(
          7 - Number(kingPosOp.split(":")[0]),
          7 - Number(kingPosOp.split(":")[1]),
          y,
          x,
          piecesOpponent[pos].pieceName,
          piecesOpponent
        ) &&
        piecesOpponent[pos].pieceName !== "k"
      ) {
        console.log("check called by opponent");

        let checkMateCount = isValidMoveForCheckMate(
          7 - Number(kingPos.split(":")[0]),
          Number(kingPos.split(":")[1]),
          piecesOpponent
        );

        console.log("checkMateCount", checkMateCount);

        if (checkMateCount > 1) {
          if (
            !kingAbleToMoveAfterCheckMate(
              7 - Number(kingPosOp.split(":")[0]),
              7 - Number(kingPosOp.split(":")[1]),
              piecesOpponent
            )
          ) {
            // setCheckMatePopUpData({
            //   roomId: roomid,
            //   winnerName: users[1].username,
            //   color: "w",
            // });
            // message to opponent check mate by "white"
            // message to user check mate by "black"
            // checkMateMessageToSocket(roomid, users[1].username, "w");

            socket.emit("check_mate", {
              roomId: roomid,
              winnerName: users[1].username,
              color: "w",
            });

            socket.to(roomid).emit("check_mate", {
              roomId: roomid,
              winnerName: users[1].username,
              color: "w",
            });
          }
        } else if (
          !checkMateStopFromOTherPiece(
            piecesOpponent,
            7 - Number(kingPosOp.split(":")[0]),
            7 - Number(kingPosOp.split(":")[1]),
            y,
            x
          ) &&
          !kingAbleToMoveAfterCheckMate(
            7 - Number(kingPosOp.split(":")[0]),
            7 - Number(kingPosOp.split(":")[1]),
            piecesOpponent
          )
        ) {
          //   setCheckMatePopUpData({
          //     roomId: roomid,
          //     winnerName: users[1].username,
          //     color: "w",
          //   });
          //   checkMateMessageToSocket(roomid, users[1].username, "w");
          // message to opponent check mate by "white"
          // message to user check mate by "black"

          socket.emit("check_mate", {
            roomId: roomid,
            winnerName: users[1].username,
            color: "w",
          });

          socket.to(roomid).emit("check_mate", {
            roomId: roomid,
            winnerName: users[1].username,
            color: "w",
          });
        }
      }

      if (grabpos === pos) {
        // setMyTurn(true);
      } else {
        // setMyTurn(false);
      }
      if (killedPiecesOpponentData) {
        // message to opponent killed pieces data
        // setOpponentKilledPieces([
        //   ...opponentKilledPieces,
        //   killedPiecesOpponentData,
        // ]);

        opponentKilledPieces = [
          ...opponentKilledPieces,
          killedPiecesOpponentData,
        ];
      }

      if (
        y === 0 &&
        piecesOpponent[pos] &&
        piecesOpponent[pos].pieceName === "p"
      ) {
        // setPawnReachedOtherSideData({
        //   open: true,
        //   pieces: pieces,
        //   piecesOpponent: piecesOpponent,
        //   pos: posOp,
        //   posOp: pos,
        //   roomid,
        //   myTurn,
        //   killedPieces,
        //   opponentKilledPieces,
        //   time,
        //   opponent: true,
        // });
        // message to opponent pawn reached other side

        socket.emit("pawn_reached_other_side", {
          open: true,
          pieces: pieces,
          piecesOpponent: piecesOpponent,
          pos: posOp,
          posOp: pos,
          roomid,
          myTurn,
          killedPieces,
          opponentKilledPieces,
          time,
          opponent: true,
        });
      }

      // message to opponent highlight the prev and current pos

      socket.emit("recieve_room_data", {
        roomid,
        pieces,
        piecesOpponent,
        myTurn,
        killedPieces,
        opponentKilledPieces,
        time,
        prevMovePos: {
          grabpos: grabpos,
          pos: pos,
        },
      });

      socket.to(roomid).emit("recieve_room_data", {
        roomid,
        pieces,
        piecesOpponent,
        myTurn,
        killedPieces,
        opponentKilledPieces,
        time,
        prevMovePos: {
          grabpos: grabposOp,
          pos: posOp,
        },
      });
    }
  } catch (e) {
    console.log("Error while drop piece : ", e.message);
  }
};
