import type { Bookmark } from '~/types/post';
import { BookmarkItem } from './BookmarkItem';

interface BookmarkListProps {
  bookmarks: Bookmark[];
}

export function BookmarkList({ bookmarks }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-body text-tertiary">북마크가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-subtle">
      {bookmarks.map((bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
}
