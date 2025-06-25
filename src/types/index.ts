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

export type BlogStatus = 'draft' | 'published' | 'archived';

export type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  author_id: string;
  status: BlogStatus;
  tags: string[] | null;
  read_time: number | null;
  views_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Campos derivados (no están en la DB pero los calculamos)
  author?: Profile;
};

export type BlogFormData = {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: BlogStatus;
  tags: string[];
};

export type BlogFilters = {
  status?: BlogStatus;
  author_id?: string;
  tags?: string[];
  search?: string;
};
