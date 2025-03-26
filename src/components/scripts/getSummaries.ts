let res: BaseInsights | null = null;

export default async () => {
 if (res) return res;

 res = await fetch(
  `https://wakatime.com/api/v1/users/current/summaries?range=last_7_days`,
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
 seconds: number;
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
 seconds: number;
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
 seconds: number;
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
 seconds: number;
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
 seconds: number;
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
 seconds: number;
}

export interface BaseInsights {
 data: Array<{
  all_users: AllUsers;
  best_day: BestDay;

  grand_total: {
   hours: number;
   minutes: number;
   total_seconds: number;
   digital: string;
   decimal: string;
   text: string;
  };
  range: {
   start: string; // Datestring
   end: string; // Datestring
   date: string; // Dates
   text: string;
   timezone: string;
  };

  operating_systems: Array<OperatingSystem>;
  projects: Array<Project>;
  languages: Array<Language>;
  machines: Array<Machine>;
  dependencies: Array<Dependency>;
  editors: Array<Editor>;
  categories: Array<Category>;
 }>;
 start: string; // Datestring
 end: string; // Datestring
 cumulative_total: {
  seconds: number;
  text: string;
  digital: string;
  decimal: string;
 };
 daily_average: {
  holidays: number;
  days_minus_holidays: number;
  days_including_holidays: number;
  seconds: number;
  seconds_including_other_language: number;
  text: string;
  text_including_other_language: string;
 };
}
