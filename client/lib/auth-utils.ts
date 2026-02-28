import { UserRole } from "@/interface/user.interface";

export interface RouteConfig {
  exact: string[];
  patterns: RegExp[];
}

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/forgot-password/verify",
  "/reset-password",
];
export const commonProtectedRoutes: RouteConfig = {
  exact: ["/profile", "/settings"],
  patterns: [],
};
export const guideProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/guide/],
};
export const touristProtectedRoutes: RouteConfig = {
  exact: ["/my-bookings"],
  patterns: [/^\/dashboard/],
};
export const adminProtectedRoutes: RouteConfig = {
  exact: [],
  patterns: [/^\/admin/],
};

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => pathname === route);
};

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig,
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }

  return routes.patterns.some((r) => r.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
): "TOURIST" | "GUIDE" | "ADMIN" | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  if (isRouteMatches(pathname, guideProtectedRoutes)) {
    return "GUIDE";
  }
  if (isRouteMatches(pathname, touristProtectedRoutes)) {
    return "TOURIST";
  }
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === UserRole.ADMIN) {
    return "/admin/dashboard";
  }
  if (role === UserRole.MODARATOR) {
    return "/modarator/dashboard";
  }
  if (role === UserRole.USER) {
    return "/dashboard";
  }
  return "/";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }
  if (routeOwner === role) {
    return true;
  }
  return false;
};
