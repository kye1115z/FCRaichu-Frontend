import FCSeoul_Logo from "@/assets/fcseoul_logo.png";
import { FC_TEAMS } from "@/data/fc_teams";
import styles from "./LogoAnimation.module.css";

export default function LogoAnimation() {
  // 무한 루프를 하기 위해서 배열을 복제함.
  const infiniteTeams = [...FC_TEAMS, ...FC_TEAMS, ...FC_TEAMS, ...FC_TEAMS];
  return (
    <div className="relative flex justify-center items-center mx-auto mb-40 w-full">
      <div
        className="flex items-center justify-center
      absolute w-96 h-96 z-5 
      bg-secondary blur-xl"
      ></div>
      <div className="absolute flex items-center justify-center z-100 pointer-events-none">
        <img src={FCSeoul_Logo} alt="FC서울" className="h-72 z-200" />
      </div>

      {/* 뒤에 로고 무한히 흐르도록 하자 */}
      {/* DONE: 팀원들 의견 묻고 gray로 하고 호버 할 때 색상 변하게 할지, 아니면 처음부터 색상 있게 할지 */}
      <div className={styles.logos}>
        {infiniteTeams.map((team, index) => (
          <img
            key={`team-${team.id}-${index}`}
            src={team.image}
            alt={team.location}
            className="h-40 opacity-50
            hover:opacity-100 hover:grayscale-0 
            transition-all duration-400"
          />
        ))}
      </div>

      <div
        className="absolute left-0 top-0 h-full w-37.5 z-20 pointer-events-none
                   bg-linear-to-r from-secondary to-transparent"
      ></div>
      <div
        className="absolute right-0 top-0 h-full w-37.5 z-20 pointer-events-none
                   bg-linear-to-l from-secondary to-transparent"
      ></div>
    </div>
  );
}
