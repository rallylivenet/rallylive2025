export interface Rally {
  id: string;
  name: string;
  image: string;
  imageHint: string;
  lastStage: {
    name: string;
    distance: string;
    winner: string;
    leader: string;
  };
  keyMoment: string;
}

export interface RallyFromApi {
  id: number;
  name: string;
  logo: string;
}
