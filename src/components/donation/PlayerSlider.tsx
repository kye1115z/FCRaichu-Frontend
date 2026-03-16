import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Player } from "@/types/donation";
import SupportModal from "./SupportModal";

// Swiper 필수 스타일
import "swiper/swiper-bundle.css";
import { getAllActivePlayers } from "@/apis/player/player";

// 컨베이어 벨트처럼 흐르게 만드는 CSS
const swiperStyle = `
  .continuous-swiper .swiper-wrapper {
    transition-timing-function: linear !important;
  }
`;

export default function PlayerSlider() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await getAllActivePlayers();
        if (res.status === 200) {
          setPlayers(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchPlayer();
  }, []);

  return (
    <div className="w-full py-10">
      <style>{swiperStyle}</style>
      {players.length > 0 ? (
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1.5}
          breakpoints={{
            640: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.5 },
          }}
          spaceBetween={30}
          loop={true}
          freeMode={true}
          speed={6000} // 8초 동안 한 바퀴 흐름
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          loopAdditionalSlides={5}
          allowTouchMove={true}
          observer={true}
          className="continuous-swiper"
        >
          {players.map((player) => (
            <SwiperSlide key={player.id}>
              <div
                onClick={() => setSelectedPlayer(player)}
                className="relative aspect-3/4 cursor-pointer overflow-hidden group 
               shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] 
               transition-all duration-500"
              >
                {/* 이미지 */}
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${player.image}`}
                  alt={player.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* 오버레이 텍스트 */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <span className="text-primary font-black text-2xl mb-1 italic">
                    NO.{player.backNumber}
                  </span>
                  <p className="text-white text-3xl font-black uppercase">
                    {player.name}
                  </p>
                  <div className="h-1 w-0 group-hover:w-full bg-primary transition-all duration-500 mt-2"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-100 w-full" />
      )}

      {selectedPlayer && (
        <SupportModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
