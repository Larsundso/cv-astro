export default () =>
 fetch("https://wakatime.com/api/v1/users/current/status_bar/today", {
  headers: { Authorization: import.meta.env.WAKA_KEY }
 }).then((r) => (r.ok ? (r.json() as Promise<LangStats>) : null));

 export interface DurationOption {
 name: string;
 total_seconds: number;
 digital: string; // H:MM:SS
 decimal: string;
 text: string;
 hours: number;
 minutes: number;
 seconds: number;
 percent: number;
}

export interface LangStats {
 cached_at: string; // Date String
 data: {
  grand_total: Omit<DurationOption, 'name' | 'seconds' | 'percent'>;
  range: {
   start: string; // Date String
   end: string; // Date String
   date: string; // Date YYYY-MM-DD
   text: string; // Date Ddd Mmm DDth YYYY
   timezone: "Europe/Berlin";
  };
  projects: Array<DurationOption>;
  languages: Array<DurationOption>;
  dependencies: Array<DurationOption>;
  machines: Array<DurationOption>;
  editors: Array<DurationOption>;
  operating_systems: Array<DurationOption>;
  categories: Array<DurationOption>;
 };
 has_team_features: boolean;
}
