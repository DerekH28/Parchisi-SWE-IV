// pages/TutorialPage.jsx
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
    { coord: { row: 2, col: 2 } },
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
  const [diceValues, setDiceValues] = useState([]);

  // STEP 3: click Roll Dice → simulate [5,5], go to step 4
  const onRollClick = () => {
    setDiceValues([5, 5]);
    setStep(4);
  };

  // STEP 4: “Use 5” twice: first moves red[3], second moves red[2], then step 5
  const onUseFive = () => {
    if (step !== 4) return;
    setPiecePositions((pos) => {
      // if red[3] still at starting home, move that one; else move red[2]
      const moveIdx = pos.red[3].coord.row === 2 ? 3 : 2;
      const newRed = pos.red.map((p, i) =>
        i === moveIdx ? { coord: { row: 3, col: 6 } } : p
      );
      return { ...pos, red: newRed };
    });
    setDiceValues((prev) => {
      const next = prev.slice(1);
      if (next.length === 0) {
        setStep(5);
      }
      return next;
    });
  };

  // STEP 5: explain blockade → Continue into step 6 and simulate [6,4]
  const onContinue = () => {
    setDiceValues([6, 4]);
    setStep(6);
  };

  // STEP 6: “Use 6” to break blockade (moves red[3] again), then step 7
  const onUseSix = (die) => {
    if (step !== 6 || die !== 6) return;
    setPiecePositions((pos) => {
      const newRed = pos.red.map((p, i) =>
        i === 3 ? { coord: { row: 6, col: 2 } } : p
      );
      return { ...pos, red: newRed };
    });
    setStep(7);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ParcheesiHeader className="mt-6 mb-4" />

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
          />

          {/* Roll Dice on step 3 */}
          {step === 3 && (
            <button
              onClick={onRollClick}
              className="mt-6 px-6 py-3 bg-teal-300 text-black rounded-lg shadow hover:brightness-95"
            >
              Roll Dice
            </button>
          )}

          {/* Use 5 buttons on step 4 */}
          {step === 4 && (
            <div className="mt-4 flex flex-col items-center space-y-2">
              <p className="text-lg">
                🎲 You rolled: {diceValues.join(" and ")}
              </p>
              <div className="flex gap-4">
                {diceValues.map((die, idx) => (
                  <button
                    key={idx}
                    onClick={onUseFive}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Use {die}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Continue to breaking‐blockade roll on step 5 */}
          {step === 5 && (
            <button
              onClick={onContinue}
              className="mt-6 px-6 py-3 bg-teal-300 text-black rounded-lg shadow hover:brightness-95"
            >
              Roll Dice
            </button>
          )}

          {/* Use 6/4 buttons on step 6 */}
          {step === 6 && (
            <div className="mt-4 flex flex-col items-center space-y-2">
              <p className="text-lg">
                🎲 You rolled: {diceValues.join(" and ")}
              </p>
              <div className="flex gap-4">
                {diceValues.map((die, idx) => (
                  <button
                    key={idx}
                    onClick={() => onUseSix(die)}
                    className={`px-4 py-2 rounded ${
                      die === 6
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    Use {die}
                  </button>
                ))}
              </div>
            </div>
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
