import { NextRequest, NextResponse } from 'next/server';
import {
  getThreadsByLocation,
  createThread,
  ForumCategory,
  LocationType,
} from '@/lib/forums';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locationId = searchParams.get('location_id');
  const locationType = searchParams.get('location_type') as LocationType | null;
  const category = searchParams.get('category') as ForumCategory | null;

  if (!locationId || !locationType) {
    return NextResponse.json(
      { error: 'Missing location_id or location_type parameter' },
      { status: 400 }
    );
  }

  try {
    const threads = await getThreadsByLocation(
      locationId,
      locationType,
      category || undefined
    );
    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error fetching forum threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forum threads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, location_type, location_id, author_name } = body;

    if (!title || !content || !category || !location_type || !location_id || !author_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const thread = await createThread(
      title,
      content,
      category as ForumCategory,
      location_type as LocationType,
      location_id,
      author_name
    );

    if (!thread) {
      return NextResponse.json(
        { error: 'Failed to create thread' },
        { status: 500 }
      );
    }

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    );
  }
}
