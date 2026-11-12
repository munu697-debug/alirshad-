import { createClient } from './supabase/server';
import { createAdminClient } from './supabase/admin';
import { Post, Category, Comment, Subscriber, Issue } from './types';

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
  issueId?: string;
  issueSlug?: string;
  coverStoryOnly?: boolean;
  limit?: number;
  featuredOnly?: boolean;
  status?: 'published' | 'draft' | 'archived' | 'all';
}): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];

  const { categorySlug, authorName, issueId, issueSlug, coverStoryOnly, limit, featuredOnly, status = 'published' } = options || {};

  try {
    const supabase = await createClient();
    let query = supabase
      .from('posts')
      .select('*, categories(id, name, slug)');

    if (status !== 'all') query = query.eq('status', status);
    if (featuredOnly) query = query.eq('is_featured', true);
    if (coverStoryOnly) query = query.eq('is_cover_story', true);
    if (authorName) query = query.ilike('author_name', `%${decodeURIComponent(authorName)}%`);

    if (issueId) {
      query = query.eq('issue_id', issueId);
    } else if (issueSlug) {
      const { data: issue } = await supabase
        .from('issues')
        .select('id')
        .eq('slug', decodeURIComponent(issueSlug))
        .single();
      if (issue) query = query.eq('issue_id', issue.id);
      else return [];
    }

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
      console.warn('getPosts fallback:', error.message);
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
    const { categories, issues, author, category, category_name, category_slug, issue_title, ...cleanData } = postData as any;

    if (cleanData.id) {
      const { data, error } = await supabase
        .from('posts')
        .update({ ...cleanData, updated_at: new Date().toISOString() })
        .eq('id', cleanData.id)
        .select()
        .single();
      if (error) { console.error('savePost update error:', error.message); return null; }
      return data as Post;
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          ...cleanData,
          views_count: 0,
          likes_count: 0,
          published_at: cleanData.published_at || new Date().toISOString(),
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

export async function getIssues(options?: { publishedOnly?: boolean }): Promise<Issue[]> {
  if (!isSupabaseConfigured()) return [];

  const { publishedOnly = false } = options || {};

  try {
    const supabase = await createClient();
    let query = supabase.from('issues').select('*');

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    query = query
      .order('is_latest', { ascending: false })
      .order('display_order', { ascending: true })
      .order('published_date', { ascending: false });

    const { data, error } = await query;
    if (error) {
      return [];
    }

    return (data || []).map((item: any) => ({
      ...item,
      articles_count: item.articles_count ?? 0,
    })) as Issue[];
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
    return [];
  }
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('slug', decodeURIComponent(slug))
      .single();

    if (error || !data) return null;

    return data as Issue;
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
    return null;
  }
}

export async function getIssueById(id: string): Promise<Issue | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as Issue;
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
    return null;
  }
}

export async function saveIssue(issueData: Partial<Issue>): Promise<Issue | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createAdminClient();

    // If marked as latest, unmark other issues
    if (issueData.is_latest) {
      await supabase
        .from('issues')
        .update({ is_latest: false })
        .neq('id', issueData.id || '00000000-0000-0000-0000-000000000000');
    }

    if (issueData.id) {
      const { data, error } = await supabase
        .from('issues')
        .update({
          title: issueData.title,
          slug: issueData.slug,
          cover_image: issueData.cover_image,
          edition_label: issueData.edition_label,
          description: issueData.description,
          published_date: issueData.published_date,
          is_published: issueData.is_published ?? true,
          is_latest: issueData.is_latest ?? false,
          display_order: issueData.display_order ?? 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', issueData.id)
        .select()
        .single();

      if (error) {
        console.error('saveIssue update error:', error.message);
        return null;
      }
      return data as Issue;
    } else {
      const { data, error } = await supabase
        .from('issues')
        .insert({
          title: issueData.title,
          slug: issueData.slug,
          cover_image: issueData.cover_image,
          edition_label: issueData.edition_label || 'PACKET EDITION',
          description: issueData.description || null,
          published_date: issueData.published_date || new Date().toISOString().split('T')[0],
          is_published: issueData.is_published ?? true,
          is_latest: issueData.is_latest ?? false,
          display_order: issueData.display_order ?? 0,
        })
        .select()
        .single();

      if (error) {
        console.error('saveIssue insert error:', error.message);
        return null;
      }
      return data as Issue;
    }
  } catch (err) {
    console.error('saveIssue exception:', err);
    return null;
  }
}

export async function deleteIssue(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('issues').delete().eq('id', id);
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
    // Never trust a client-supplied user_id; derive it from the verified session.
    const { data: { user: sessionUser } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: commentData.post_id,
        user_id: sessionUser?.id ?? null,
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
