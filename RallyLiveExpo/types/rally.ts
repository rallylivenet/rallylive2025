export interface Rally {
  id: string;
  name: string;
  image: string;
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
  car_brand: string;
  car_version: string;
  stage_time: string;
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
  car_brand: string;
  car_version: string;
  total_time: string;
  penalty_time: string;
  diff_to_leader: string;
  diff_to_previous: string;
}

export interface RallyEvent {
  id?: number;
  RalliAdi: string;
  Tarih: string;
  Link: string;
  sonEtap?: string | null;
}

export interface Post {
  id: number;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: {
      id: number;
      source_url: string;
      alt_text: string;
    }[];
  }
}