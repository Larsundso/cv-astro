import type {
 BestDay,
 Category,
 Dependency,
 Editor,
 Language,
 Machine,
 OperatingSystem,
 Project
} from "./getInsights.js";

let res: TotalInsights | null = null;

export default async () => {
 if (res) return res;

 res = await fetch(
  `https://wakatime.com/api/v1/users/dd3b35d0-d275-4870-a3d1-a0158fd38981/stats/all_time?timeout=15`,
  {
   headers: { Authorization: `Basic ${btoa(`${import.meta.env.WAKA_KEY}:`)}` }
  }
 ).then((r) =>
  r.ok ? (r.json().then((r) => r.data) as Promise<TotalInsights>) : null
 );
 if (!res) throw new Error("Failed to fetch WakaTime stats");

 return res;
};

export interface TotalInsights {
 id: string;
 user_id: string;
 range: "all_time";
 start: string;
 end: string;
 timeout: number;
 writes_only: boolean;
 timezone: "Europe/Berlin";
 holidays: number;
 status: "ok";
 created_at: string;
 modified_at: string;
 machines: Machine[];
 languages: Language[];
 days_minus_holidays: number;
 projects: Project[];
 dependencies: Dependency[];
 is_already_updating: boolean;
 best_day: BestDay;
 human_readable_total: string;
 human_readable_daily_average_including_other_language: string;
 categories: Category[];
 total_seconds: number;
 days_including_holidays: number;
 editors: Editor[];
 is_up_to_date_pending_future: boolean;
 percent_calculated: number;
 daily_average_including_other_language: number;
 daily_average: number;
 total_seconds_including_other_language: number;
 human_readable_daily_average: string;
 is_stuck: boolean;
 operating_systems: OperatingSystem[];
 human_readable_total_including_other_language: string;
 is_up_to_date: boolean;
 is_cached: boolean;
 username: string;
 is_including_today: boolean;
 human_readable_range: string;
 is_coding_activity_visible: boolean;
 is_language_usage_visible: boolean;
 is_editor_usage_visible: boolean;
 is_category_usage_visible: boolean;
 is_os_usage_visible: boolean;
}
