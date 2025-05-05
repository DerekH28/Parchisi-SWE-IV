import React, { useState } from "react";
import Board from "../components/Board";
import Tutorial from "../components/Tutorial";
import { routes } from "../util/routes";
import backgroundImage from "../assets/parcheesi_background.jpg";
import ParcheesiHeader from "../components/ParcheesiHeader.jsx";

const initialPiecePositions = {
  red: [
    { coord: { row: 2, col: 3 } },
    { coord: { row: 3, col: 3 } },
    { coord: { row: 3, col: 2 } },
    { coord: { row: 2, col: 2} },
  ],
  blue: [
    { coord: { row: 2, col: 11 } },
    { coord: { row: 3, col: 11 } },
    { coord: { row: 3, col: 12 } },
    { coord: { row: 2, col: 12 } },
  ],
  yellow: [
    { coord: { row: 11, col: 2 } },
    { coord: { row: 11, col: 3 } },
    { coord: { row: 12, col: 2 } },
    { coord: { row: 12, col: 3 } },
  ],
  green: [
    { coord: { row: 11, col: 12 } },
    { coord: { row: 11, col: 11 } },
    { coord: { row: 12, col: 11 } },
    { coord: { row: 12, col: 12 } },
  ],
};

export default function TutorialPage() {
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
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="mt-6 mb-4">
        <ParcheesiHeader />
      </div>

      <div className="flex flex-1 items-center justify-center w-full px-8 py-12">
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

        <div className="ml-12">
          <Tutorial
            step={step}
            setStep={setStep}
            setHighlight={setHighlightedCells}
          />
        </div>
      </div>
    </div>
  );
}
