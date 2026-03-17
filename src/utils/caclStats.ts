export const calcStats = (win: number, draw: number, lose: number) => {
  const total = win + draw + lose;
  const calculate = (val: number) =>
    total > 0 ? Number(((val / total) * 100).toFixed(1)) : 0;

  return {
    total,
    winRate: calculate(win),
    drawRate: calculate(draw),
    loseRate: calculate(lose),
  };
};
