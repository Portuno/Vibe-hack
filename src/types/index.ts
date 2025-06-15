
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
};
