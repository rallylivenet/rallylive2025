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
    number: string;
  };
  date: string;
}

export interface StageResult {
  rank: number;
  door_no: number;
  driver_name: string;
  driver_surname: string;
  driver_flag: string;
  codriver_name: string;
  codriver_surname: string;
  codriver_flag: string;
  car_brand: string;
  car_version: string;
  team_name: string;
  racing_class: string;
  stage_time: string;
  stage_time_ms: number;
  diff_to_leader: string;
  diff_to_previous: string;
}

export interface OverallResult {
  rank: number;
  door_no: string;
  driver_name: string;
  driver_surname: string;
  driver_flag: string;
  codriver_name: string;
  codriver_surname: string;
  codriver_flag: string;
  car_brand: string;
  car_version: string;
  team_name: string;
  racing_class: string;
  total_time: string;
  tSure: string;
  penalty_time: string;
  diff_to_leader: string;
  diff_to_previous: string;
}

export interface RallyEvent {
  id?: number;
  RalliAdi: string;
  Tarih: string;
  Link: string;
  ridFlag?: string | null;
  sonEtap?: string | null;
  leftStage?: number | null;
}