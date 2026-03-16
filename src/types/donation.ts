export interface Player {
  id: number;
  name: string;
  image: string;
  position: string;
  backNumber: number;
}

export interface DonationRequest {
  playerId: number;
  amount: number;
}
