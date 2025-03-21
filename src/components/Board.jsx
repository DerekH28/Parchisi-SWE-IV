import React from "react";
import { boardLayout } from "../models/boardLayout";

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
 * Renders the game board with pieces placed on the grid.
 *
 * Only pieces belonging to the current player (via the `currentPlayer` prop)
 * will trigger hover events.
 */
const Board = ({
  piecePositions,
  routes,
  onPieceClick,
  handlePieceHover,
  handlePieceLeave,
  highlightedCells,
  hoveredPiece,
  currentPlayer, // new prop: e.g., "red", "blue", etc.
}) => {
  console.log("🔹 Rendering Board - highlightedCells:", highlightedCells);

  // Filter out keys that are arrays (i.e. the players' pieces)
  const pieceKeys = Object.keys(piecePositions).filter((key) =>
    Array.isArray(piecePositions[key])
  );

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
                className={`w-10 h-10 flex items-center justify-center ${
                  cellClasses[cell] || ""
                } ${isHighlighted ? "bg-yellow-300 border-2 border-yellow-500" : ""}`}
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
                          onMouseEnter={() => {
                            // Only allow hover if this piece belongs to currentPlayer
                            if (color === currentPlayer) {
                              console.log(
                                `✅ onMouseEnter fired for piece: ${pieceId}`
                              );
                              handlePieceHover(
                                pieceId,
                                piece.coord,
                                routes,
                                color,
                                piece.lastKnownIndex
                              );
                            }
                          }}
                          onMouseLeave={() => {
                            if (color === currentPlayer) {
                              handlePieceLeave();
                            }
                          }}
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
