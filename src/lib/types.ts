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
  ID: string;
  title: string;
  thumbnail: string;
  rid: string;
}

export interface LastStageFromApi {
    etap_no: string;
    etap_adi: string;
    etap_uzunluk: string;
    etap_birincisi_isim: string;
    etap_birincisi_zaman: string;
    genel_klasman_birincisi_isim: string;
    genel_klasman_birincisi_zaman: string;
}
