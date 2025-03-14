// boardLayout.js
export const boardLayout = (() => {
  const size = 15;
  // Create a 15x15 grid filled with "unused"
  const board = Array.from({ length: size }, () => Array(size).fill("unused"));

  // Fill red-home: rows 0-5, cols 0-5
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      board[r][c] = "red-home";
    }
  }

  // Fill blue-home: rows 0-5, cols 9-14
  for (let r = 0; r < 6; r++) {
    for (let c = 9; c < size; c++) {
      board[r][c] = "blue-home";
    }
  }

  // Fill yellow-home: rows 9-14, cols 0-5
  for (let r = 9; r < size; r++) {
    for (let c = 0; c < 6; c++) {
      board[r][c] = "yellow-home";
    }
  }

  // Fill green-home: rows 9-14, cols 9-14
  for (let r = 9; r < size; r++) {
    for (let c = 9; c < size; c++) {
      board[r][c] = "green-home";
    }
  }

  // Fill center: rows 6-8, cols 6-8
  for (let r = 6; r <= 8; r++) {
    for (let c = 6; c <= 8; c++) {
      board[r][c] = "center";
    }
  }

  // Fill top track: rows 0-5, cols 6-8.
  // Mark "slot-blue" when c is 7 and not in the very first row.
  for (let r = 0; r < 6; r++) {
    for (let c = 6; c <= 8; c++) {
      board[r][c] = c === 7 && r !== 0 ? "slot-red" : "track";
    }
  }

  // Fill bottom track: rows 9-14, cols 6-8.
  // Mark "slot-yellow" when c is 7 and not in the last row.
  for (let r = 9; r < size; r++) {
    for (let c = 6; c <= 8; c++) {
      board[r][c] = c === 7 && r !== size - 1 ? "slot-green" : "track";
    }
  }

  // Fill left track: rows 6-8, cols 0-5.
  // Mark "slot-red" when r is 7 and not in the first column.
  for (let r = 6; r <= 8; r++) {
    for (let c = 0; c < 6; c++) {
      board[r][c] = r === 7 && c !== 0 ? "slot-yellow" : "track";
    }
  }

  // Fill right track: rows 6-8, cols 9-14.
  // Mark "slot-green" when r is 7 and not in the last column.
  for (let r = 6; r <= 8; r++) {
    for (let c = 9; c < size; c++) {
      board[r][c] = r === 7 && c !== size - 1 ? "slot-blue" : "track";
    }
  }

  return board;
})();
