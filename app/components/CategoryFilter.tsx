interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* 전체 버튼 */}
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-lg text-label transition-colors ${
          selected === null
            ? 'bg-primary text-[var(--bg-primary)]'
            : 'bg-tertiary text-secondary hover:text-primary'
        }`}
      >
        전체
      </button>

      {/* 카테고리 버튼들 */}
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`px-4 py-2 rounded-lg text-label transition-colors ${
            selected === category
              ? 'bg-primary text-[var(--bg-primary)]'
              : 'bg-tertiary text-secondary hover:text-primary'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
