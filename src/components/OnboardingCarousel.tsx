import { useRef, useState, UIEvent } from "react";
import Slide1 from "./onboarding/Slide1";
import Slide2 from "./onboarding/Slide2";
import Slide3 from "./onboarding/Slide3";
import Slide4 from "./onboarding/Slide4";
import Slide5 from "./onboarding/Slide5";

const OnboardingCarousel = () => {
  const slides = [<Slide1 key="s1" />, <Slide2 key="s2" />, <Slide3 key="s3" />, <Slide4 key="s4" />, <Slide5 key="s5" />];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  return (
    <div className="h-screen w-full flex flex-col justify-between bg-[#EAF3FF]">
      {/* Área deslizável */}
      <div
        ref={wrapRef}
        onScroll={onScroll}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full h-full shrink-0 snap-start flex items-stretch">
            <div className="w-full">{slide}</div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="pb-6 flex items-center justify-center gap-2">
        {[0, 1, 2, 3, 4].map((dotIndex) => (
          <span
            key={dotIndex}
            aria-label={`Slide ${dotIndex + 1}`}
            className={`h-3 w-3 rounded-full transition-colors ${
              currentIndex === dotIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
export default OnboardingCarousel;