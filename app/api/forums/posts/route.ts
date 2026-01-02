import { NextRequest, NextResponse } from 'next/server';
import { getPostsByThread, createPost } from '@/lib/forums';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const threadId = searchParams.get('thread_id');

  if (!threadId) {
    return NextResponse.json(
      { error: 'Missing thread_id parameter' },
      { status: 400 }
    );
  }

  try {
    const posts = await getPostsByThread(threadId);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { thread_id, content, author_name } = body;

    if (!thread_id || !content || !author_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const post = await createPost(thread_id, content, author_name);

    if (!post) {
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
