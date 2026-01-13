import { eq, desc, or } from 'drizzle-orm';
import { db } from 'db';
import { comment, user } from 'db/schema';
import { auth } from '~/lib/auth.server';
import type { Route } from './+types/comments';

// trailing slash 제거
function normalizeSlug(slug: string): string {
  return slug.replace(/\/+$/, '');
}

// GET /api/comments?postSlug=xxx
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const postSlug = url.searchParams.get('postSlug');

  if (!postSlug) {
    return Response.json({ error: 'postSlug is required' }, { status: 400 });
  }

  const normalizedSlug = normalizeSlug(postSlug);

  // trailing slash 유무 관계없이 모두 조회 (기존 데이터 호환)
  const comments = await db
    .select({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
        githubUsername: user.githubUsername,
      },
    })
    .from(comment)
    .leftJoin(user, eq(comment.userId, user.id))
    .where(
      or(
        eq(comment.postSlug, normalizedSlug),
        eq(comment.postSlug, `${normalizedSlug}/`)
      )
    )
    .orderBy(desc(comment.createdAt));

  return Response.json({ comments });
}

// POST, PUT, DELETE /api/comments
export async function action({ request }: Route.ActionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const method = request.method;

  // POST - Create comment
  if (method === 'POST') {
    const body = await request.json();
    const { postSlug, content } = body;

    if (!postSlug || !content?.trim()) {
      return Response.json(
        { error: 'postSlug and content are required' },
        { status: 400 }
      );
    }

    const newComment = await db
      .insert(comment)
      .values({
        id: crypto.randomUUID(),
        postSlug: normalizeSlug(postSlug),
        userId: session.user.id,
        content: content.trim(),
      })
      .returning();

    return Response.json({ comment: newComment[0] }, { status: 201 });
  }

  // PUT - Update comment
  if (method === 'PUT') {
    const body = await request.json();
    const { id, content } = body;

    if (!id || !content?.trim()) {
      return Response.json(
        { error: 'id and content are required' },
        { status: 400 }
      );
    }

    // Check ownership
    const existing = await db
      .select()
      .from(comment)
      .where(eq(comment.id, id))
      .limit(1);

    if (!existing.length) {
      return Response.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (existing[0].userId !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await db
      .update(comment)
      .set({ content: content.trim() })
      .where(eq(comment.id, id))
      .returning();

    return Response.json({ comment: updated[0] });
  }

  // DELETE - Delete comment
  if (method === 'DELETE') {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    // Check ownership
    const existing = await db
      .select()
      .from(comment)
      .where(eq(comment.id, id))
      .limit(1);

    if (!existing.length) {
      return Response.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (existing[0].userId !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.delete(comment).where(eq(comment.id, id));

    return Response.json({ success: true });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
