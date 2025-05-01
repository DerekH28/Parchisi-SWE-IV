import React from "react";
import { boardLayout } from "../models/boardLayout";
import { safeSpaces } from "../models/safeSpaces";

/**
 * Defines CSS classes for each board cell type.
 */
const cellClasses = {
  "red-home": "bg-red-400",
  "blue-home": "bg-blue-400",
  "yellow-home": "bg-yellow-400",
  "green-home": "bg-green-400",
  center: "bg-gray-100",
  track: "bg-white border border-gray-300",
  "slot-blue": "bg-blue-400 border border-blue-500",
  "slot-yellow": "bg-yellow-400 border border-yellow-500",
  "slot-red": "bg-red-400 border border-red-500",
  "slot-green": "bg-green-400 border border-green-500",
  unused: "bg-gray-100",
  //muted home exit safe space colors
  "dark-red-gray": "bg-[#7f4f4f]",
  "dark-yellow-gray": "bg-[#7a6e3f]",
  "dark-green-gray": "bg-[#4e6e50]",
  "dark-blue-gray": "bg-[#4f5f6f]",
};

/**
 * Player color mapping for pieces.
 */
const playerColors = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
};

/**
 * check if cell is safe spot
 */
const isSafeSpace = (rowIndex, colIndex) => {
  return safeSpaces.some(
    (spot) => spot.row === rowIndex && spot.col === colIndex
  );
};

/**
 * Asssigns specific safe space colors depending on whether they are each players home exit
 */
const getSpaceClass = (rowIndex, colIndex) => {
  // Check if it's a safe space and return the appropriate class
  const safeSpace = safeSpaces.find(
    (space) => space.row === rowIndex && space.col === colIndex
  );
  if (safeSpace) {
    // Find the specific color class for the safe space
    if (rowIndex === 3 && colIndex === 6) {
      return "bg-dark-red-gray"; //Red exit safe space
    } else if (rowIndex === 8 && colIndex === 3) {
      return "bg-dark-yellow-gray"; //Yellow exit safe space
    } else if (rowIndex === 11 && colIndex === 8) {
      return "bg-dark-green-gray"; //Green exit safe space
    } else if (rowIndex === 6 && colIndex === 11) {
      return "bg-dark-blue-gray"; //Blue exit safe space
    } else {
      return "bg-gray-400"; // Default gray for all other safe spaces
    }
  }
  return "";
};

/**
 * Renders the game board with pieces placed on the grid.
 *
 * Only pieces belonging to the current player (via the `currentPlayer` prop)
 * will trigger hover events.
 */
const Board = ({
  piecePositions = {},
  routes,
  onPieceClick,
  handlePieceHover,
  handlePieceLeave,
  highlightedCells = [],
  hoveredPiece,
  currentPlayer,
  diceValues = [],
  selectedDice = [],
}) => {
  console.log("🔹 Rendering Board - piecePositions:", piecePositions);
  console.log("🔹 Rendering Board - highlightedCells:", highlightedCells);

  // Add validation check
  if (!piecePositions || typeof piecePositions !== "object") {
    console.log("⚠️ Invalid piecePositions:", piecePositions);
    piecePositions = {};
  }

  // Filter out keys that are arrays (i.e. the players' pieces)
  const pieceKeys = Object.keys(piecePositions).filter((key) =>
    Array.isArray(piecePositions[key])
  );

  const handleMouseEnter = (pieceId, piece, color) => {
    if (color === currentPlayer) {
      console.log(`✅ onMouseEnter fired for piece: ${pieceId}`);
      handlePieceHover(
        pieceId,
        piece,
        routes,
        color,
        piece.lastKnownIndex,
        diceValues,
        selectedDice
      );
    }
  };

  const handleMouseLeave = () => {
    if (currentPlayer) {
      handlePieceLeave();
    }
  };

  return (
    <div className="overflow-hidden rounded-xl">
      <div className="grid" style={{ gridTemplateColumns: "repeat(15, 40px)" }}>
        {boardLayout.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isHighlighted = highlightedCells.some(
              (pos) => pos.row === rowIndex && pos.col === colIndex
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-10 h-10 flex items-center justify-center
                  ${cellClasses[cell] || ""}
                  ${
                    isHighlighted
                      ? "bg-yellow-300 border-2 border-yellow-500"
                      : ""
                  }
                  ${getSpaceClass(rowIndex, colIndex)}
                `}
              >
                {pieceKeys.map((color) =>
                  piecePositions[color].map((piece, index) => {
                    if (!piece || !piece.coord) return null;

                    const pieceId = `${color}${index + 1}`;
                    const pieceColor = playerColors[color] || "bg-gray-700";
                    const isHovered = hoveredPiece === pieceId;

                    if (
                      rowIndex === piece.coord.row &&
                      colIndex === piece.coord.col
                    ) {
                      return (
                        <div
                          key={pieceId}
                          className={`w-6 h-6 ${pieceColor} rounded-full cursor-pointer border-2 border-black shadow-lg transition-transform ${
                            isHovered ? "scale-110 ring-2 ring-yellow-500" : ""
                          }`}
                          onClick={() => onPieceClick(pieceId)}
                          onMouseEnter={() =>
                            handleMouseEnter(pieceId, piece, color)
                          }
                          onMouseLeave={handleMouseLeave}
                        />
                      );
                    }
                    return null;
                  })
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
