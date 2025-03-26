let res: BaseInsights | null = null;

export default async () => {
 if (res) return res;

 res = await fetch(
  `https://wakatime.com/api/v1/users/current/insights/stats/last_year`,
  {
   headers: { Authorization: `Basic ${btoa(`${import.meta.env.WAKA_KEY}:`)}` },
  }
 ).then((r) => (r.ok ? (r.json() as Promise<BaseInsights>) : null));
 if (!res) throw new Error("Failed to fetch WakaTime stats");

 return res;
};

export interface Language {
 name: string;
 total_seconds: number;
 percent: number;
 digital: string;
 decimal: string;
 text: string;
 hours: number;
 minutes: number;
}

export interface Project {
 total_seconds: number;
 name: string;
 percent: number;
 digital: string;
 decimal: string;
 text: string;
 hours: number;
 minutes: number;
}

export interface OperatingSystem {
 total_seconds: number;
 name: string;
 percent: number;
 digital: string;
 decimal: string;
 text: string;
 hours: number;
 minutes: number;
}

export interface BestDay {
 date: string; // YYYY-MM-DD
 total_seconds: number;
 text: string;
}

export interface CurrentUser {
 total: {
  seconds: number;
  text: string;
 };
 daily_average: {
  seconds: number;
  text: string;
 };
}

export interface AllUsers {
 total: {
  average: number;
  text: string;
  max: number;
  median: number;
 };
 daily_average: {
  average: number;
  text: string;
  max: number;
  median: number;
 };
}

export interface Machine {
 total_seconds: 1684195.320762;
 name: string;
 machine_name_id: "5fb56f64-8aa0-4fa5-b800-5eb2cce2078c";
 percent: 39.09;
 digital: "467:49";
 decimal: "467.82";
 text: "467 hrs 49 mins";
 hours: 467;
 minutes: 49;
}

export interface Category {
 name: "Coding" | "Building" | "Debugging";
 total_seconds: number;
 percent: number;
 digital: string;
 decimal: string;
 text: string;
 hours: number;
 minutes: number;
}

export interface Dependency {
 total_seconds: number;
 name: string;
 percent: number;
 digital: string;
 decimal: string;
 text: string;
 hours: number;
 minutes: number;
}

export interface Editor {
 total_seconds: number;
 name: string;
 percent: number;
 digital: string;
 decimal: string;
 text: string;
 hours: number;
 minutes: number;
}

export interface BaseInsights {
 data: {
  languages: Array<Language>;
  projects: Array<Project>;
  operating_systems: Array<OperatingSystem>;
  best_day: BestDay;
  all_users: AllUsers;
  machines: Array<Machine>;
  categories: Array<Category>;
  dependencies: Array<Dependency>;
  editors: Array<Editor>;

  daily_average: number;
  total_seconds_including_other_language: number;
  total_seconds: number;
  holidays: number;
  id: string;
  status: "ok";
  is_up_to_date: boolean;
  is_up_to_date_pending_future: boolean;
  is_stuck: boolean;
  is_already_updating: boolean;
  range: "last_year";
  percent_calculated: number;
  timeout: number;
  timezone: "Europe/Berlin";
  writes_only: boolean;
  start: string; // Date String
  end: string; // Date String
  user_id: string;
  is_including_today: boolean;
  human_readable_range: "last year";
  created_at: string; // Date String
  modified_at: string; // Date String
  days_including_holidays: number;
  human_readable_total: string;
  human_readable_daily_average: string;
  days_minus_holidays: number;
  human_readable_total_including_other_language: string;
  daily_average_including_other_language: number;
  human_readable_daily_average_including_other_language: string;
  is_cached: boolean;
  username: string;
 };
}
