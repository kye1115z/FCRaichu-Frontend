import { signUpHandler } from "./auth";
import { gamesHandler } from "./games";
import { recordsHandler } from "./posts";
import { rankingHandler } from "./ranking";

// 전체 mocking 함수 관리
export const handlers = [
  ...signUpHandler,
  ...gamesHandler,
  ...recordsHandler,
  ...rankingHandler,
];
