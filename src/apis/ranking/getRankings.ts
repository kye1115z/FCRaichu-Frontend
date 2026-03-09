import axios from "axios";

export const getRankingList = async () => {
  const res = await axios.get(`/api/ranking`);
  return res.data;
};
