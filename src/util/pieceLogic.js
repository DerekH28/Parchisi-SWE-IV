import { safeSpaces } from "../models/safeSpaces";

/**
 * Handles hover effect on a piece, using the sum of selected dice values.
 * @param {string|number} pieceId - The id of the piece.
 * @param {Object} piece - The piece object containing position and state.
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
  piece,
  routes,
  player,
  lastKnownIndex,
  diceValues = [],
  selectedDice = [],
  setHoveredPiece,
  setHighlightedCells
) => {
  // Validate required parameters
  if (
    !pieceId ||
    !piece ||
    !routes ||
    !player ||
    !setHoveredPiece ||
    !setHighlightedCells
  ) {
    console.warn("Missing required parameters for handlePieceHover");
    return;
  }

  setHoveredPiece(pieceId);

  if (selectedDice.length === 0) {
    setHighlightedCells([]);
    return;
  }

  if (!diceValues || diceValues.length === 0) {
    setHighlightedCells([]);
    return;
  }

  const path = routes[player]?.path;
  if (!path) {
    console.warn("No path found for player:", player);
    setHighlightedCells([]);
    return;
  }

  // Check if piece is in home
  const isInHome = piece.inHome;
  let currentIndex;

  if (isInHome) {
    // For pieces in home, we can only move to the starting tile if we have a 5
    const moveDistance = selectedDice.reduce(
      (sum, index) => sum + (diceValues[index] || 0),
      0
    );

    if (moveDistance === 5) {
      // Each color has a different starting position when coming out of home
      let startingPosition;
      switch (player) {
        case "red":
          startingPosition = { row: 3, col: 6 }; // Red's starting position
          break;
        case "blue":
          startingPosition = { row: 6, col: 11 }; // Blue's starting position
          break;
        case "yellow":
          startingPosition = { row: 11, col: 8 }; // Yellow's starting position
          break;
        case "green":
          startingPosition = { row: 8, col: 3 }; // Green's starting position
          break;
        default:
          console.warn("Invalid player color:", player);
          setHighlightedCells([]);
          return;
      }
      setHighlightedCells([startingPosition]);
    } else {
      setHighlightedCells([]);
    }
    return;
  }

  // Check if piece is on a safe space
  const isOnSafeSpace = safeSpaces.some(
    (space) => space.row === piece.coord.row && space.col === piece.coord.col
  );

  let foundInPath = false;
  // For pieces not in home, use the existing logic
  currentIndex =
    typeof lastKnownIndex === "number"
      ? lastKnownIndex
      : path.findIndex(
          (tile) => tile.row === piece.coord.row && tile.col === piece.coord.col
        );

  if (typeof currentIndex !== "number" || currentIndex === -1) {
    // If we can't find the index but we're on a safe space, find the next valid position
    if (isOnSafeSpace) {
      // Find the next valid position in the path after the safe space
      const safeSpace = safeSpaces.find(
        (space) =>
          space.row === piece.coord.row && space.col === piece.coord.col
      );

      // Find the closest path position after the safe space
      for (let i = 0; i < path.length; i++) {
        const nextTile = path[i];
        // Check if this tile is adjacent to our safe space
        if (
          (Math.abs(nextTile.row - safeSpace.row) === 1 &&
            nextTile.col === safeSpace.col) ||
          (Math.abs(nextTile.col - safeSpace.col) === 1 &&
            nextTile.row === safeSpace.row)
        ) {
          currentIndex = i;
          foundInPath = true;
          break;
        }
      }

      if (currentIndex === -1) {
        console.warn(
          "Could not find next position after safe space:",
          safeSpace
        );
        setHighlightedCells([]);
        return;
      }
    } else {
      console.warn("Invalid current index for piece:", pieceId);
      setHighlightedCells([]);
      return;
    }
  }

  const moveDistance = selectedDice.reduce(
    (sum, index) => sum + (diceValues[index] || 0),
    0
  );

  if (isNaN(moveDistance) || moveDistance <= 0) {
    console.warn("Invalid move distance calculated:", moveDistance);
    setHighlightedCells([]);
    return;
  }

  // For pieces on the path, calculate the new position
  // Only adjust the distance if we just found the piece in the path from a safe space
  let newIndex = Math.min(
    currentIndex +
      (isOnSafeSpace && foundInPath ? moveDistance - 1 : moveDistance),
    path.length - 1
  );
  let newTile = path[newIndex];

  // If we have a valid move, show the highlight
  if (newTile) {
    setHighlightedCells([newTile]);
  } else {
    setHighlightedCells([]);
  }
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
 * @returns {Object|null} - Returns an object with success and message properties if there's an error, null otherwise.
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
  // Validate required parameters
  if (!pieceId || !player || !currentTurn || !socket) {
    console.warn("Missing required parameters for handlePieceClick");
    return { success: false, message: "Missing required parameters" };
  }

  // Check if it's the player's turn
  if (player !== currentTurn) {
    return { success: false, message: "❌ Not your turn!" };
  }

  // Check if dice are selected
  if (!selectedDice || selectedDice.length === 0) {
    return { success: false, message: "❌ Please select dice values first!" };
  }

  // Check if dice values are available
  if (!diceValues || diceValues.length === 0) {
    return { success: false, message: "❌ No dice values available!" };
  }

  // Calculate move distance
  const moveDistance = selectedDice.reduce(
    (sum, index) => sum + (diceValues[index] || 0),
    0
  );

  // Validate move distance
  if (isNaN(moveDistance) || moveDistance <= 0) {
    return { success: false, message: "❌ Invalid move distance!" };
  }

  // Send move request to the server
  socket.emit(
    "piece-clicked",
    { pieceId, player, diceValue: moveDistance },
    (response) => {
      if (response.success) {
        // Update dice values by removing used ones
        setDiceValues((prev) =>
          prev.filter((_, i) => !selectedDice.includes(i))
        );
        setSelectedDice([]); // Clear selected dice after move
        setHighlightedCells([]); // Clear highlights after moving
      } else {
        console.warn("Move failed:", response.message);
      }
    }
  );

  return null; // Return null if everything is valid
};
