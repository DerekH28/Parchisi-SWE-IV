import blue from "../assets/blueBall.png";
import green from "../assets/greenBall.png";
import red from "../assets/redBall.png";
import yellow from "../assets/yellowBall.png";

export default function ParcheesiHeader() {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-center z-50 py-4 bg-transparent">
      <div className="flex items-center gap-2">
        <img src={red} alt="Red" className="w-4 h-4" />
        <img src={yellow} alt="Yellow" className="w-4 h-4" />
        <h1 className="text-3xl font-bold text-white">Parcheesi</h1>
        <img src={green} alt="Green" className="w-4 h-4" />
        <img src={blue} alt="Blue" className="w-4 h-4" />
      </div>
    </header>
  );
}
