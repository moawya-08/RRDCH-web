/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as announcements from "../announcements.js";
import type * as appointments from "../appointments.js";
import type * as auth from "../auth.js";
import type * as complaints from "../complaints.js";
import type * as doctors from "../doctors.js";
import type * as http from "../http.js";
import type * as notifications from "../notifications.js";
import type * as payments from "../payments.js";
import type * as portalAuth from "../portalAuth.js";
import type * as reports from "../reports.js";
import type * as rooms from "../rooms.js";
import type * as schedules from "../schedules.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  announcements: typeof announcements;
  appointments: typeof appointments;
  auth: typeof auth;
  complaints: typeof complaints;
  doctors: typeof doctors;
  http: typeof http;
  notifications: typeof notifications;
  payments: typeof payments;
  portalAuth: typeof portalAuth;
  reports: typeof reports;
  rooms: typeof rooms;
  schedules: typeof schedules;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
