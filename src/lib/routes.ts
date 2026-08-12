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
  },
} as const;
