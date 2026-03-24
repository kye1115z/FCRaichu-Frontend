export interface Player {
  id: number;
  name: string;
  image: string;
  position: string;
  backNumber: number;
  userRank: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
}

export interface DonationRequest {
  playerId: number;
  amount: number;
}
