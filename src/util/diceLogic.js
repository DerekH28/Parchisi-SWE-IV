/**
 * Handles selecting and deselecting a die by its unique index.
 * @param {number} dieIndex - The index of the die.
 * @param {Array<number>} selectedDice - The current selected dice.
 * @param {Function} setSelectedDice - The setter for the selected dice state.
 * @returns {boolean} - Returns true if the selection was successful, false otherwise.
 */
export const handleDieSelect = (dieIndex, selectedDice, setSelectedDice) => {
  // Validate parameters
  if (typeof dieIndex !== "number" || dieIndex < 0) {
    console.warn("Invalid die index:", dieIndex);
    return false;
  }

  if (!Array.isArray(selectedDice)) {
    console.warn("Invalid selectedDice array:", selectedDice);
    return false;
  }

  if (typeof setSelectedDice !== "function") {
    console.warn("Invalid setSelectedDice function");
    return false;
  }

  // Toggle selection
  setSelectedDice((prev) =>
    prev.includes(dieIndex)
      ? prev.filter((id) => id !== dieIndex)
      : [...prev, dieIndex]
  );

  return true;
};

/**
 * Resets the dice selection.
 * @param {Function} setSelectedDice - The setter for the selected dice state.
 * @returns {boolean} - Returns true if the reset was successful, false otherwise.
 */
export const resetDiceSelection = (setSelectedDice) => {
  // Validate parameter
  if (typeof setSelectedDice !== "function") {
    console.warn("Invalid setSelectedDice function");
    return false;
  }

  // Reset selection
  setSelectedDice([]);
  return true;
};
