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
    etap_no: string;
    etap_adi: string | null;
    etap_uzunluk: string;
    etap_birincisi_isim: string;
    etap_birincisi_zaman: string;
    genel_klasman_birincisi_isim: string;
    genel_klasman_birincisi_zaman: string;
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
