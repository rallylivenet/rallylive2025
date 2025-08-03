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
}

export interface RallyFromApi {
  ID: string;
  title: string;
  thumbnail: string;
  rid: string;
}

export interface LastStageFromApi {
    sonEtap: string;
    name: string;
    zaman: string;
    km: string;
    tarih: string;
}

export interface StageWinnerInfo {
    etap_birincisi_isim: string | null;
    genel_klasman_birincisi_isim: string | null;
    dname: string;
    dsurname: string;
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
