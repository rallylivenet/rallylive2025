import {z} from 'zod';

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
    etaplar?: { no: string, name: string }[];
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

export interface RallyCategory {
  category: string;
  occurrence: number;
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

export interface LiveRallyMenuItem {
    id: string;
    name: string;
    link: string;
}

export const RallyUpdateInputSchema = z.object({
  rallyName: z.string().describe('The name of the rally.'),
  stageName: z.string().optional().describe('The name of the stage, if applicable.'),
  updateType: z.enum(['stage_winner', 'overall_leader_change', 'breaking_news', 'rally_start', 'rally_finish']),
  stageWinner: z.object({
    driverName: z.string(),
    time: z.string(),
  }).optional().describe('Details about the stage winner.'),
  overallLeader: z.object({
    driverName: z.string(),
    leadBy: z.string(),
  }).optional().describe('Details about the new overall leader.'),
  breakingNews: z.string().optional().describe('A breaking news message.'),
});
export type RallyUpdateInput = z.infer<typeof RallyUpdateInputSchema>;

export const RallyUpdateOutputSchema = z.object({
    notification: z.string().describe('The generated push notification message (max 150 characters).'),
});
export type RallyUpdateOutput = z.infer<typeof RallyUpdateOutputSchema>;

export const AdminPushFormSchema = RallyUpdateInputSchema.extend({
    stageWinnerDriver: z.string().optional(),
    stageWinnerTime: z.string().optional(),
    overallLeaderDriver: z.string().optional(),
    overallLeaderLead: z.string().optional(),
});
export type AdminPushFormValues = z.infer<typeof AdminPushFormSchema>;

export const AnswerRallyQuestionInputSchema = z.object({
    rid: z.string(),
    stage_no: z.string(),
    question: z.string(),
    rallyName: z.string(),
    stageName: z.string(),
    stageResults: z.array(z.any()).optional(),
    overallResults: z.array(z.any()).optional(),
    itinerary: z.array(z.any()).optional(),
});
export type AnswerRallyQuestionInput = z.infer<typeof AnswerRallyQuestionInputSchema>;

export const AnswerRallyQuestionOutputSchema = z.object({
    answer: z.string().describe('The answer to the user\'s question about the rally.'),
});
export type AnswerRallyQuestionOutput = z.infer<typeof AnswerRallyQuestionOutputSchema>;

export const AskAiAboutRallyFormSchema = z.object({
    rid: z.string(),
    stage_no: z.string(),
    question: z.string(),
    rallyName: z.string(),
    stageName: z.string(),
});
export type AskAiAboutRallyFormValues = z.infer<typeof AskAiAboutRallyFormSchema>;
