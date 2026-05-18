import { Room } from "./types";

let roomsList: Room[] = [];

export const getRooms = () => roomsList;

export const addRoom = (room: Room) => {
  roomsList.push(room);
};
