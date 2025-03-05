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
  "track-top": "bg-white border border-gray-300",
  "track-bottom": "bg-white border border-gray-300",
  "track-left": "bg-white border border-gray-300",
  "track-right": "bg-white border border-gray-300",
  center: "bg-gray-100",
  unused: "bg-gray-100",
  "track-blue-slot": "bg-blue-400 border border-blue-500",
  "track-yellow-slot": "bg-yellow-400 border border-yellow-500",
  "track-red-slot": "bg-red-400 border border-red-500",
  "track-green-slot": "bg-green-400 border border-green-500",
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
 */
const Board = ({ piecePositions = {}, onPieceClick }) => {
  console.log("🔹 Board received piecePositions:", piecePositions);

  return (
    <div className="overflow-hidden rounded-xl">
      <div className="grid" style={{ gridTemplateColumns: "repeat(15, 40px)" }}>
        {boardLayout.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-10 h-10 flex items-center justify-center ${
                cellClasses[cell] || ""
              }`}
            >
              {Object.entries(piecePositions).map(([color, pieces]) => {
                if (!Array.isArray(pieces)) return null; // Ensure `pieces` is an array

                return pieces.map((piece, index) => {
                  if (!piece || !piece.coord) return null; // Guard against undefined values

                  const pieceId = `${color}${index + 1}`; // ✅ Define pieceId properly
                  const playerColor = playerColors[color] || "bg-gray-700"; // ✅ Map colors properly

                  if (
                    rowIndex === piece.coord.row &&
                    colIndex === piece.coord.col
                  ) {
                    return (
                      <div
                        key={pieceId}
                        className={`w-6 h-6 ${playerColor} rounded-full cursor-pointer border-2 border-black shadow-lg`}
                        onClick={() => onPieceClick(pieceId)}
                      />
                    );
                  }
                  return null;
                });
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
