// boardLayout.js
export const boardLayout = (() => {
  const board = [];
  for (let r = 0; r < 15; r++) {
    const row = [];
    for (let c = 0; c < 15; c++) {
      if (r < 6 && c < 6) {
        row.push("red-home");
      } else if (r < 6 && c > 8) {
        row.push("blue-home");
      } else if (r > 8 && c < 6) {
        row.push("yellow-home");
      } else if (r > 8 && c > 8) {
        row.push("green-home");
      } else if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
        row.push("center");
      } else if (r < 6 && c >= 6 && c <= 8) {
        // For the top track, if we're on row 5, mark the entire row as a slot.
        if (c === 7 && r != 0) {
          row.push("track-blue-slot");
        } else {
          row.push("track-top");
        }
      } else if (r > 8 && c >= 6 && c <= 8) {
        // For the bottom track, if we're on row 9, mark the entire row as a slot.
        if (c === 7 && r != 14) {
          row.push("track-yellow-slot");
        } else {
          row.push("track-bottom");
        }
      } else if (c < 6 && r >= 6 && r <= 8) {
        // For the left track, if we're on row 7, mark the entire row as a slot.
        if (r === 7 && c != 0) {
          row.push("track-red-slot");
        } else {
          row.push("track-left");
        }
      } else if (c > 8 && r >= 6 && r <= 8) {
        // For the right track, if we're on row 7, mark the entire row as a slot.
        if (r === 7 && c != 14) {
          row.push("track-green-slot");
        } else {
          row.push("track-right");
        }
      } else {
        row.push("unused");
      }
    }
    board.push(row);
  }
  return board;
})();
