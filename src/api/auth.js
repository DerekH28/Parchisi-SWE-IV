import { supabase } from "./supabase";

/**
 * Signs up a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ data: any; error: any }>}
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

/**
 * Signs in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ data: any; error: any }>}
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

/**
 * Signs in with Google.
 * @returns {Promise<{ data: any; error: any }>}
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  return { data, error };
};

/**
 * Signs out the current user.
 * @returns {Promise<{ error: any }>}
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Gets the current authenticated user.
 * @returns {Promise<{ user: any }>}
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error("Error fetching user:", error);
  return data?.user || null;
};

/**
 * Listens for auth state changes (login/logout/session updates).
 * @param {function} callback - Function to execute on auth state change.
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
};
