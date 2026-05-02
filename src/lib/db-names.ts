export const USERS_COLLECTION = "users";
export const POSTS_COLLECTION = "posts";
export const FAVORITES_COLLECTION = "favorites";

export function getDatabaseName() {
  return process.env.MONGODB_DB ?? "all_time_news";
}
