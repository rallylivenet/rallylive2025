



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

export interface RallyFromApi {
  ID: string;
  title: string;
  thumbnail: string;
  rid: string;
  date: string;
}

export interface LastStageFromApi {
    sonEtap: string;
    name: string;
    zaman: string;
    km: string;
    tarih: string;
}

export interface StageWinnerInfo {
    dname: string;
    dsurname: string;
    cname: string;
    csurname: string;
}

export interface ItineraryItem {
  no: string;
  name: string;
  time: string;
  km: string;
  day: string;
  date: string;
  dbcode: string;
  klasik: string;
  mahalli: string;
  klasman: string;
  icon: string;
}

export interface OverallLeaderFromApi {
    rank: number;
    driver_name: string;
    driver_surname: string;
    codriver_name: string;
    codriver_surname: string;
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

export interface Post {
  id: number;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
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
    'author'?: {
        id: number;
        name: string;
    }[];
  }
}
    
