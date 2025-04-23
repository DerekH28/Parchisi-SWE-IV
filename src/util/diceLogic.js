/**
 * Handles selecting and deselecting a die by its unique index.
 * @param {number} dieIndex - The index of the die.
 * @param {Array<number>} selectedDice - The current selected dice.
 * @param {Function} setSelectedDice - The setter for the selected dice state.
 */
export const handleDieSelect = (dieIndex, selectedDice, setSelectedDice) => {
  setSelectedDice((prev) =>
    prev.includes(dieIndex)
      ? prev.filter((id) => id !== dieIndex)
      : [...prev, dieIndex]
  );
};

/**
 * Resets the dice selection.
 * @param {Function} setSelectedDice - The setter for the selected dice state.
 */
export const resetDiceSelection = (setSelectedDice) => {
  setSelectedDice([]);
};
