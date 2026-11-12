import { createClient } from './supabase/server';
import { createAdminClient } from './supabase/admin';
import { Post, Category, Comment, Subscriber } from './types';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url && key &&
    !url.includes('your-project') &&
    !url.includes('demo.supabase')
  );
}

export async function getPosts(options?: {
  categorySlug?: string;
  authorName?: string;
  limit?: number;
  featuredOnly?: boolean;
  status?: 'published' | 'draft' | 'archived' | 'all';
}): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];

  const { categorySlug, authorName, limit, featuredOnly, status = 'published' } = options || {};

  try {
    const supabase = await createClient();
    let query = supabase
      .from('posts')
      .select('*, categories(id, name, slug)');

    if (status !== 'all') query = query.eq('status', status);
    if (featuredOnly) query = query.eq('is_featured', true);
    if (authorName) query = query.ilike('author_name', `%${decodeURIComponent(authorName)}%`);

    if (categorySlug) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();
      if (cat) query = query.eq('category_id', cat.id);
      else return [];
    }

    query = query.order('published_at', { ascending: false });
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
      console.error('getPosts error:', error.message);
      return [];
    }
    return (data as Post[]) ?? [];
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
    console.error('getPosts exception:', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(id, name, slug)')
      .eq('slug', decodeURIComponent(slug))
      .single();
    if (error) return null;
    return (data as Post) ?? null;
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
    return null;
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(id, name, slug)')
      .eq('id', id)
      .single();
    if (error) return null;
    return (data as Post) ?? null;
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
    return null;
  }
}

export async function savePost(postData: Partial<Post>): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createAdminClient();
    if (postData.id) {
      const { data, error } = await supabase
        .from('posts')
        .update({ ...postData, updated_at: new Date().toISOString() })
        .eq('id', postData.id)
        .select()
        .single();
      if (error) { console.error('savePost update error:', error.message); return null; }
      return data as Post;
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          ...postData,
          views_count: 0,
          likes_count: 0,
          published_at: postData.published_at || new Date().toISOString(),
        })
        .select()
        .single();
      if (error) { console.error('savePost insert error:', error.message); return null; }
      return data as Post;
    }
  } catch (err) {
    console.error('savePost exception:', err);
    return null;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) return [];
    return (data as Category[]) ?? [];
  } catch {
    return [];
  }
}

export async function getComments(postId: string): Promise<Comment[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(display_name, avatar_url)')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data as Comment[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllComments(): Promise<Comment[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(display_name, avatar_url)')
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data as Comment[]) ?? [];
  } catch {
    return [];
  }
}

export async function addComment(commentData: Partial<Comment>): Promise<Comment | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: commentData.post_id,
        user_id: commentData.user_id ?? null,
        name: commentData.name || 'Anonymous',
        email: commentData.email ?? null,
        is_anonymous: Boolean(commentData.is_anonymous),
        content: commentData.content,
        status: 'approved',
      })
      .select('*, profiles(display_name, avatar_url)')
      .single();
    if (error) { console.error('addComment error:', error.message); return null; }
    return data as Comment;
  } catch {
    return null;
  }
}

export async function toggleLike(postId: string): Promise<{ liked: boolean; count: number }> {
  if (!isSupabaseConfigured()) return { liked: false, count: 0 };

  try {
    const supabase = await createClient();
    const { data: post } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('id', postId)
      .single();

    const count = (post?.likes_count ?? 0) + 1;
    await supabase.from('posts').update({ likes_count: count }).eq('id', postId);
    return { liked: true, count };
  } catch {
    return { liked: false, count: 0 };
  }
}

export async function incrementViews(postId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  try {
    const supabase = await createClient();
    const { data: post } = await supabase
      .from('posts')
      .select('views_count')
      .eq('id', postId)
      .single();

    const views = (post?.views_count ?? 0) + 1;
    await supabase.from('posts').update({ views_count: views }).eq('id', postId);
    return views;
  } catch {
    return 0;
  }
}

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Invalid email address' };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Database not configured. Please set up Supabase.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('subscribers')
      .insert({ email, status: 'active' });

    if (error) {
      if (error.code === '23505') {
        return { success: true, message: 'You are already subscribed!' };
      }
      return { success: false, message: 'Subscription failed. Please try again.' };
    }
    return { success: true, message: 'Thank you for subscribing to Al Irshad!' };
  } catch {
    return { success: false, message: 'An error occurred. Please try again.' };
  }
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data as Subscriber[]) ?? [];
  } catch {
    return [];
  }
}
