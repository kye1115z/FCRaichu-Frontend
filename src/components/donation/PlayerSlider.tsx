import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import type { Player } from "@/types/donation";
import SupportModal from "./SupportModal";

// Swiper 필수 스타일
import "swiper/css";
import "swiper/css/free-mode";

// 컨베이어 벨트처럼 흐르게 만드는 CSS
const swiperStyle = `
  .continuous-swiper .swiper-wrapper {
    transition-timing-function: linear !important;
  }
`;

// FC서울 주요 선수 데이터
const fcSeoulPlayers: Player[] = [
  {
    id: 1,
    name: "린가드",
    position: "MF",
    backNumber: 10,
    image: "https://picsum.photos/600/800?random=11",
  },
  {
    id: 2,
    name: "기성용",
    position: "MF",
    backNumber: 6,
    image: "https://picsum.photos/600/800?random=12",
  },
  {
    id: 3,
    name: "조영욱",
    position: "FW",
    backNumber: 32,
    image: "https://picsum.photos/600/800?random=13",
  },
  {
    id: 4,
    name: "임상협",
    position: "FW",
    backNumber: 7,
    image: "https://picsum.photos/600/800?random=14",
  },
  {
    id: 5,
    name: "강상우",
    position: "DF",
    backNumber: 15,
    image: "https://picsum.photos/600/800?random=15",
  },
  {
    id: 6,
    name: "최준",
    position: "DF",
    backNumber: 22,
    image: "https://picsum.photos/600/800?random=16",
  },
  {
    id: 7,
    name: "일류첸코",
    position: "FW",
    backNumber: 9,
    image: "https://picsum.photos/600/800?random=17",
  },
];

export default function PlayerSlider() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <div className="w-full py-10">
      <style>{swiperStyle}</style>
      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView={1.5}
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5 },
          1280: { slidesPerView: 4.5 },
        }}
        spaceBetween={30}
        loop={true}
        freeMode={true}
        speed={8000} // 8초 동안 한 바퀴 흐름
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        className="continuous-swiper"
      >
        {fcSeoulPlayers.map((player) => (
          <SwiperSlide key={player.id}>
            <div
              onClick={() => setSelectedPlayer(player)}
              className="relative aspect-[3/4] cursor-pointer overflow-hidden group border border-gray-800"
            >
              {/* 이미지 */}
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* 오버레이 텍스트 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                <span className="text-orange-500 font-black text-2xl mb-1 italic">
                  NO.{player.backNumber}
                </span>
                <p className="text-white text-3xl font-black uppercase">
                  {player.name}
                </p>
                <div className="h-1 w-0 group-hover:w-full bg-orange-500 transition-all duration-500 mt-2"></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {selectedPlayer && (
        <SupportModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
