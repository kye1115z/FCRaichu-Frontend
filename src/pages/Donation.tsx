import PlayerSlider from "@/components/donation/PlayerSlider";

export default function DonationPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* 상단 섹션 */}
      <div className="pt-24 pb-12 px-10">
        <h2 className="text-primary text-xl font-black italic tracking-widest mb-2">
          PLAYER SUPPORT
        </h2>
        <h1 className="text-white text-5xl font-black uppercase leading-tight">
          당신의 선수를 <br /> 후원하세요{" "}
          <span className="text-primary">.</span>
        </h1>
      </div>

      <PlayerSlider />
    </div>
  );
}
