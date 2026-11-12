export type UserRole = 'admin' | 'editor' | 'author' | 'reader';

export interface Profile {
  id: string;
  email?: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
  count?: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Tiptap HTML string or markdown
  featured_image: string;
  author_id?: string;
  author_name: string;
  author?: Profile;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  category?: Category;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  views_count: number;
  likes_count: number;
  read_time: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id?: string;
  name: string;
  email?: string;
  is_anonymous: boolean;
  content: string;
  status: 'approved' | 'pending' | 'flagged' | 'spam';
  parent_id?: string;
  profiles?: {
    display_name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  created_at: string;
}
