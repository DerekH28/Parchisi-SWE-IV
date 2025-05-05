import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2) Full list of steps including your movement, blockade, break-blockade
const tutorialSteps = [
  {
    title: "Tutorial",
    content:
      "Hello and welcome to Parcheesi: Chase, Race, Capture! This brief tutorial covers the key game mechanics. Feel free to EXIT at any time or click NEXT to continue.",
    highlights: [],
  },
  {
    title: "Objective",
    content:
      "The objective in Parcheesi is to get all of your pieces into your corresponding color's home base, which is highlighted to the side. You must land exactly on the finish space to get in.",
    highlights: [
      {row: 6, col: 6},
      { row: 6, col: 7 },
      { row: 6, col: 8 },
      { row: 7, col: 7 },
      { row: 7, col: 6 },
      { row: 7, col: 8 },
      { row: 8, col: 6 },
      { row: 8, col: 7 },
      { row: 8, col: 8 },
    ],
  },
  {
    title: "Safe Spaces",
    content:
      "Highlighted below are safe spaces. If you land on a safe space your piece cannot be taken by an opponent. You cannot move onto a safe space if it's occupied.",
    highlights: [
      { row: 0, col: 7 },
      { row: 3, col: 8 },
      { row: 3, col: 6 },
      {row: 7, col: 14},
      { row: 7, col: 0 },
      {row: 8, col: 3},
      {row: 6,  col: 3},
      {row: 11, col: 8},
      {row: 11, col: 6},
      { row: 14, col: 7 },
      { row: 6, col: 11 },
      { row: 8, col: 11 },

    ],
  },
  {
    title: "Your Turn",
    content:
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      "Now let's play a turn! When you're ready, click **Roll Dice** (button below the board).",
=======
      "Now let's play a turn! When you’re ready, click Roll Dice (button below the board).",
>>>>>>> Stashed changes
=======
      "Now let's play a turn! When you’re ready, click Roll Dice (button below the board).",
>>>>>>> Stashed changes
    highlights: [],
  },
  {
    title: "Movement",
    content:
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      "Below is the board when it's your turn. Highlighted in pink is the one space you can move to.\n\nBecause you rolled a 5 and a 5, click that highlighted space to move your piece out of home.",
=======
      "Below is the board when it’s your turn. Highlighted in yellow is the one space you can move to.\n\nBecause you rolled a 5 and a 5, click that highlighted space to move your piece out of home.",
>>>>>>> Stashed changes
=======
      "Below is the board when it’s your turn. Highlighted in yellow is the one space you can move to.\n\nBecause you rolled a 5 and a 5, click that highlighted space to move your piece out of home.",
>>>>>>> Stashed changes
    highlights: [{ row: 3, col: 6 }],
  },
  {
    title: "Blockade",
    content:
      "After moving out of home you have two pieces in one space! That creates a blockade—no piece can pass it. Click the highlighted space to form your blockade.",
    highlights: [{ row: 3, col: 6 }],
  },
  {
    title: "Breaking Blockade",
    content:
      "You rolled a 6! A 6 forces you to break up your blockade and move one piece in the blockade 6 spaces. Click the highlighted space to break it.",
    highlights: [{ row: 6, col: 2 }],
  },
];

export default function Tutorial({ step, setStep, setHighlight, onExit }) {
  const navigate = useNavigate();
  const maxStep = tutorialSteps.length;

  useEffect(() => {
    if (step >= 0 && step < maxStep) {
      setHighlight(tutorialSteps[step].highlights);
    }
  }, [step, setHighlight]);

  if (step < 0 || step > maxStep) return null;

  // Final "Tutorial Complete" screen
  if (step === maxStep) {
    return (
      <div className="w-80 bg-[#D8F8F3] p-6 shadow-lg h-auto">
        <h2 className="text-2xl font-bold mb-4">Tutorial Complete!</h2>
        <button
          onClick={onExit ? onExit : () => navigate("/Menu")}
          className="px-4 py-2 bg-[#A3DEE7] text-black rounded-full hover:brightness-95 transition"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const { title, content } = tutorialSteps[step];
  const isRollStep = step === 3;

  return (
    <div className="w-80 bg-white p-6 shadow-lg h-auto max-h-full overflow-auto">
      <h2 className="text-xl font-bold mb-2 border-b pb-1">{title}</h2>
      <div className="whitespace-pre-wrap mb-6">{content}</div>

      <div className="flex justify-between">
        <button
          onClick={onExit ? onExit : () => navigate("/Menu")}
          className="px-4 py-1 bg-[#CFEDE8] rounded-full hover:brightness-95 transition"
        >
          EXIT
        </button>

        {/* No "NEXT" on the Roll Dice step */}
        {!isRollStep && (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="px-4 py-1 bg-[#A3DEE7] text-black rounded-full hover:brightness-95 transition"
          >
            NEXT
          </button>
        )}
      </div>
    </div>
  );
}
