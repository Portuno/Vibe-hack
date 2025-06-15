
export type Profile = {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  vertical: string;
  skills: string[] | null;
  interests: string[] | null;
  created_at?: string;
  // New fields from migration
  cover_photo_url: string | null;
  headline: string | null;
  location: string | null;
  social_links: Record<string, string> | null;
  what_i_am_looking_for: string | null;
  notification_preferences: Record<string, boolean> | null;
  is_public: boolean | null;
  display_name: string | null;
};
