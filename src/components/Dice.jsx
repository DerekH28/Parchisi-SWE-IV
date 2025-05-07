import React, { useEffect, useRef } from "react";

/**
 * A 3D dice component that displays a value and can be rolled
 * @param {Object} props - Component props
 * @param {number} props.value - The current value shown on the dice (1-6)
 * @param {boolean} props.isSelected - Whether the dice is currently selected
 * @param {Function} props.onClick - Callback function when dice is clicked
 * @param {boolean} props.isRolling - Whether the dice is currently rolling
 * @returns {JSX.Element} A 3D dice component
 */
const Dice = ({ value, isSelected, onClick, isRolling }) => {
  const diceRef = useRef(null);

  useEffect(() => {
    if (isRolling && diceRef.current) {
      diceRef.current.style.animation = "roll 1s ease-out";
    } else if (diceRef.current) {
      diceRef.current.style.animation = "";
    }
  }, [isRolling]);

  /**
   * Generates the dots pattern for a given dice value
   * @param {number} value - The dice value (1-6)
   * @returns {JSX.Element[]} Array of dot elements positioned according to the value
   */
  const getDiceFace = (value) => {
    const positions = {
      1: [[50, 50]],
      2: [
        [25, 25],
        [75, 75],
      ],
      3: [
        [25, 25],
        [50, 50],
        [75, 75],
      ],
      4: [
        [25, 25],
        [25, 75],
        [75, 25],
        [75, 75],
      ],
      5: [
        [25, 25],
        [25, 75],
        [50, 50],
        [75, 25],
        [75, 75],
      ],
      6: [
        [25, 25],
        [25, 50],
        [25, 75],
        [75, 25],
        [75, 50],
        [75, 75],
      ],
    };

    return positions[value].map((pos, index) => (
      <div
        key={index}
        className="absolute w-3 h-3 bg-black rounded-full"
        style={{
          left: `${pos[0]}%`,
          top: `${pos[1]}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    ));
  };

  /**
   * Gets the CSS transform for a given dice face
   * @param {string} face - The face to transform ('front', 'back', 'right', 'left', 'top', 'bottom')
   * @returns {string} CSS transform value for the face
   */
  const getFaceTransform = (face) => {
    const transforms = {
      front: "translateZ(2rem)",
      back: "rotateY(180deg) translateZ(2rem)",
      right: "rotateY(90deg) translateZ(2rem)",
      left: "rotateY(-90deg) translateZ(2rem)",
      top: "rotateX(90deg) translateZ(2rem)",
      bottom: "rotateX(-90deg) translateZ(2rem)",
    };
    return transforms[face];
  };

  return (
    <div
      ref={diceRef}
      onClick={onClick}
      className={`relative w-16 h-16 cursor-pointer  transition-transform duration-300 ${
        isSelected ? "scale-110 bg-green-300" : ""
      }`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div
        className="absolute w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: isRolling
            ? "rotateX(720deg) rotateY(720deg) rotateZ(720deg)"
            : "rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
          transition: isRolling
            ? "transform 1s ease-out"
            : "transform 0.3s ease-out",
        }}
      >
        {/* Front face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? "bg-green-300" : "bg-white"
          }`}
          style={{ transform: getFaceTransform("front") }}
        >
          {getDiceFace(value)}
        </div>
        {/* Back face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? "bg-green-300" : "bg-white"
          }`}
          style={{ transform: getFaceTransform("back") }}
        >
          {getDiceFace(7 - value)}
        </div>
        {/* Right face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? "bg-green-300" : "bg-white"
          }`}
          style={{ transform: getFaceTransform("right") }}
        >
          {getDiceFace(3)}
        </div>
        {/* Left face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? "bg-green-300" : "bg-white"
          }`}
          style={{ transform: getFaceTransform("left") }}
        >
          {getDiceFace(4)}
        </div>
        {/* Top face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? "bg-green-300" : "bg-white"
          }`}
          style={{ transform: getFaceTransform("top") }}
        >
          {getDiceFace(2)}
        </div>
        {/* Bottom face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? "bg-green-300" : "bg-white"
          }`}
          style={{ transform: getFaceTransform("bottom") }}
        >
          {getDiceFace(5)}
        </div>
      </div>
    </div>
  );
};

export default Dice;
