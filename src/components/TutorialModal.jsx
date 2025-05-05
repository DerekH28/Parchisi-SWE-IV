import React, { useState } from "react";
import Board from "./Board";
import Tutorial from "./Tutorial";
import { routes } from "../util/routes";
import backgroundImage from "../assets/parcheesi_background.jpg";
import ParcheesiHeader from "./ParcheesiHeader.jsx";

const initialPiecePositions = {
  red: [
    { coord: { row: 1, col: 1 } },
    { coord: { row: 1, col: 4 } },
    { coord: { row: 3, col: 2 } },
    { coord: { row: 4, col: 1 } },
  ],
  blue: [
    { coord: { row: 1, col: 13 } },
    { coord: { row: 1, col: 11 } },
    { coord: { row: 3, col: 12 } },
    { coord: { row: 4, col: 13 } },
  ],
  yellow: [
    { coord: { row: 10, col: 1 } },
    { coord: { row: 11, col: 4 } },
    { coord: { row: 12, col: 2 } },
    { coord: { row: 13, col: 1 } },
  ],
  green: [
    { coord: { row: 10, col: 13 } },
    { coord: { row: 11, col: 12 } },
    { coord: { row: 12, col: 11 } },
    { coord: { row: 13, col: 13 } },
  ],
};

export default function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [piecePositions, setPiecePositions] = useState(initialPiecePositions);

  const onRollClick = () => setStep((s) => s + 1);

  const handleBoardClick = (r, c) => {
    if (step === 4 && r === 3 && c === 6) {
      setPiecePositions((pos) => {
        const red = pos.red.map((p, i) =>
          i === 3 ? { coord: { row: 7, col: 6 } } : p
        );
        return { ...pos, red };
      });
      setStep(5);
    } else if (step === 5 && r === 8 && c === 8) {
      setPiecePositions((pos) => {
        const green = pos.green.map((p, i) =>
          i === 1 ? { coord: { row: 8, col: 8 } } : p
        );
        return { ...pos, green };
      });
      setStep(6);
    } else if (step === 6 && r === 5 && c === 5) {
      setPiecePositions((pos) => {
        const green = pos.green.map((p, i) =>
          i === 1 ? { coord: { row: 5, col: 5 } } : p
        );
        return { ...pos, green };
      });
      setStep(7);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div className="relative bg-[#d8f8f3] text-gray-900 rounded-2xl shadow-2xl p-8 max-w-5xl w-full flex flex-col md:flex-row items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-3 py-1 bg-red-200 text-red-700 rounded-full z-10 hover:bg-red-300"
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <Board
            piecePositions={piecePositions}
            routes={routes}
            onPieceClick={() => {}}
            handlePieceHover={() => {}}
            handlePieceLeave={() => {}}
            highlightedCells={highlightedCells}
            hoveredPiece={null}
            currentPlayer={null}
            onCellClick={handleBoardClick}
          />
          {step === 3 && (
            <button
              onClick={onRollClick}
              className="mt-6 px-6 py-3 bg-[#A3DEE7] text-black rounded-lg shadow-lg hover:brightness-95 transition"
            >
              Roll Dice
            </button>
          )}
        </div>
        <div className="ml-0 md:ml-12 mt-8 md:mt-0">
          <Tutorial
            step={step}
            setStep={setStep}
            setHighlight={setHighlightedCells}
            onExit={onClose}
          />
        </div>
      </div>
    </div>
  );
} 