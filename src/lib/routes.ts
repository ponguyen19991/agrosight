// Single source of truth for internal route paths. Components should
// reference these instead of hardcoding path strings (in <Link href>,
// router.push/prefetch, or pathname comparisons for active-nav state) —
// so a route can be renamed or moved in one place instead of a repo-wide
// string search.
export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: {
    root: "/dashboard",
    about: "/dashboard/about",
    settings: "/dashboard/settings",
    analytics: "/dashboard/analytics",
    knowledgeBase: "/dashboard/knowledge",
    reports: "/dashboard/reports",
    team: "/dashboard/team",
    fields: "/dashboard/fields",
  },
} as const;

export function reportDetailRoute(id: string) {
  return `${ROUTES.dashboard.reports}/${id}`;
}

export function fieldDetailRoute(id: string) {
  return `${ROUTES.dashboard.fields}/${id}`;
}
