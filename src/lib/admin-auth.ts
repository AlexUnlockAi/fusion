// The admin portal collects a "username" for a familiar login screen, but
// Supabase Auth is email/password under the hood. ADMIN_LOGIN_USERNAME must
// match exactly before we even attempt a Supabase sign-in with the fixed
// internal email below — see scripts/seed-admin.mjs to provision it.
export const ADMIN_LOGIN_USERNAME = "mob1234!";
export const ADMIN_INTERNAL_EMAIL = "admin@adinkra-fusion-kitchen.internal";
