/**
 * Handles hover effect on a piece, using the sum of selected dice values.
 * @param {string|number} pieceId - The id of the piece.
 * @param {Object} piecePos - The current position of the piece.
 * @param {Object} routes - The routes object for each player.
 * @param {string|number} player - The current player.
 * @param {number} lastKnownIndex - Last known index on the path.
 * @param {Array<number>} diceValues - The array of dice values.
 * @param {Array<number>} selectedDice - The currently selected dice indices.
 * @param {Function} setHoveredPiece - Setter for the hovered piece state.
 * @param {Function} setHighlightedCells - Setter for the highlighted cells state.
 */
export const handlePieceHover = (
  pieceId,
  piecePos,
  routes,
  player,
  lastKnownIndex,
  diceValues,
  selectedDice,
  setHoveredPiece,
  setHighlightedCells
) => {
  setHoveredPiece(pieceId);

  if (selectedDice.length === 0) {
    setHighlightedCells([]);
    return;
  }

  if (!diceValues || diceValues.length === 0) return;

  const path = routes[player]?.path;
  if (!path) return;

  let currentIndex =
    typeof lastKnownIndex === "number"
      ? lastKnownIndex
      : path.findIndex(
          (tile) => tile.row === piecePos.row && tile.col === piecePos.col
        );

  if (typeof currentIndex !== "number" || currentIndex === -1) return;

  const moveDistance = selectedDice.reduce(
    (sum, index) => sum + (diceValues[index] || 0),
    0
  );

  if (isNaN(moveDistance) || moveDistance <= 0) return;

  let newIndex = Math.min(currentIndex + moveDistance, path.length - 1);
  let newTile = path[newIndex];

  if (newTile) setHighlightedCells([newTile]);
  else setHighlightedCells([]);
};

/**
 * Clears the hovered piece and highlighted cells.
 * @param {Function} setHoveredPiece - Setter for the hovered piece state.
 * @param {Function} setHighlightedCells - Setter for the highlighted cells state.
 */
export const handlePieceLeave = (setHoveredPiece, setHighlightedCells) => {
  setHoveredPiece(null);
  setHighlightedCells([]);
};

/**
 * Handles when a piece is clicked, sending the move request.
 * @param {string|number} pieceId - The id of the piece.
 * @param {string|number} player - The player that owns the piece.
 * @param {string|number} currentTurn - The player whose turn it is.
 * @param {Function} setDiceValues - Setter for the dice values.
 * @param {Array<number>} diceValues - The current dice values.
 * @param {Array<number>} selectedDice - The currently selected dice indices.
 * @param {Object} socket - The socket instance to emit events.
 * @param {Function} setSelectedDice - Setter for the selected dice state.
 * @param {Function} setHighlightedCells - Setter for the highlighted cells state.
 */
export const handlePieceClick = (
  pieceId,
  player,
  currentTurn,
  setDiceValues,
  diceValues,
  selectedDice,
  socket,
  setSelectedDice,
  setHighlightedCells
) => {
  if (!player || selectedDice.length === 0 || player !== currentTurn) return;
  if (!diceValues || diceValues.length === 0) return;

  const moveDistance = selectedDice.reduce(
    (sum, index) => sum + (diceValues[index] || 0),
    0
  );

  if (isNaN(moveDistance) || moveDistance <= 0) return;

  // Send move request to the server
  socket.emit(
    "piece-clicked",
    { pieceId, player, diceValue: moveDistance },
    (response) => {
      if (response.success) {
        setDiceValues((prev) =>
          prev.filter((_, i) => !selectedDice.includes(i))
        );
        setSelectedDice([]); // Clear selected dice after move
        setHighlightedCells([]); // Clear highlights after moving
      }
    }
  );
};
