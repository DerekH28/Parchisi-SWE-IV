import React, { useEffect, useRef } from "react";

const Dice = ({ value, isSelected, onClick, isRolling }) => {
  const diceRef = useRef(null);

  useEffect(() => {
    if (isRolling && diceRef.current) {
      diceRef.current.style.animation = "roll 1s ease-out";
    } else if (diceRef.current) {
      diceRef.current.style.animation = "";
    }
  }, [isRolling]);

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
            isSelected ? 'bg-green-300' : 'bg-white'
          }`}
          style={{ transform: getFaceTransform('front') }}
        >
          {getDiceFace(value)}
        </div>
        {/* Back face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? 'bg-green-300' : 'bg-white'
          }`}
          style={{ transform: getFaceTransform('back') }}
        >
          {getDiceFace(7 - value)}
        </div>
        {/* Right face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? 'bg-green-300' : 'bg-white'
          }`}
          style={{ transform: getFaceTransform('right') }}
        >
          {getDiceFace(3)}
        </div>
        {/* Left face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? 'bg-green-300' : 'bg-white'
          }`}
          style={{ transform: getFaceTransform('left') }}
        >
          {getDiceFace(4)}
        </div>
        {/* Top face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? 'bg-green-300' : 'bg-white'
          }`}
          style={{ transform: getFaceTransform('top') }}
        >
          {getDiceFace(2)}
        </div>
        {/* Bottom face */}
        <div
          className={`absolute w-full h-full rounded-lg shadow-lg border-2 border-gray-300 ${
            isSelected ? 'bg-green-300' : 'bg-white'
          }`}
          style={{ transform: getFaceTransform('bottom') }}
        >
          {getDiceFace(5)}
        </div>
      </div>
    </div>
  );
};

export default Dice;
