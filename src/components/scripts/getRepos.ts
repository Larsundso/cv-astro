import { Octokit } from "@octokit/rest";
import repoJSON from "~/../public/repos.json" assert { type: "json" };

const octokit = new Octokit({ auth: import.meta.env.GH_KEY });
const self = await octokit.rest.users.getAuthenticated();

let res: null | Awaited<ReturnType<typeof octokit.repos.get>>["data"][] = null;

export default async () => {
 if (res) return res;
 return;

 const recent = await octokit.search.commits({
  q: `from:${self.data.login}`,
  sort: "committer-date",
  order: "desc"
 });

 const repoNames = [
  ...new Set(recent.data.items.map((r) => r.repository.full_name))
 ];
 console.log(repoNames);

 const orgSearch = await octokit.orgs.getrepo({
  q: `author:${self.data.login} ${repoJSON.orgs
   .filter((o) => o.ghOrgs.length)
   .map((o) => o.ghOrgs)
   .flat()
   .map((o) => `org:${o}`)
   .join(" OR ")}`
 });

 console.log(orgSearch);

 res = await Promise.all(
  repoNames.map((n) =>
   octokit.repos
    .get({ owner: n.split("/")[0], repo: n.split("/")[1] })
    .then((r) => r.data)
  )
 );

 return res;
};
