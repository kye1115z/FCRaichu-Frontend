import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";

import "swiper/swiper-bundle.css";

import "./ImageSlider.css";

interface ImageSliderProps {
  images: string[];
}

export const ImageSlider = ({ images }: ImageSliderProps) => {
  // 이미지가 없을 때 예외 처리
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-subtleGray text-textSub">
        이미지가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-subtleGray overflow-hidden ImageSlider-container">
      <Swiper
        modules={[Pagination, A11y, Autoplay]} // 사용할 모듈들
        spaceBetween={0} // 슬라이드 간 간격
        slidesPerView={1} // 한 번에 보여줄 슬라이드 개수는 1개
        loop={images.length > 1} // 무한 루프
        centeredSlides={true} // 슬라이드 가운데 정렬
        autoplay={{
          delay: 4000,
          disableOnInteraction: false, // 유저가 조작해도 자동재생 유지
        }}
        pagination={{
          clickable: true, // 점 클릭 가능
        }}
        a11y={{
          enabled: true,
          prevSlideMessage: "이전 슬라이드",
          nextSlideMessage: "다음 슬라이드",
        }}
        className="w-full h-full"
      >
        {images.map((imgUrl, index) => (
          <SwiperSlide
            key={index}
            className="flex items-center justify-center p-12"
          >
            <div className="w-full h-full flex items-center justify-center p-12">
              <img
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}${imgUrl}`}
                alt={`직관 기록 이미지 ${index + 1}`}
                className="max-w-full max-h-full object-contain shadow-sm select-none"
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
