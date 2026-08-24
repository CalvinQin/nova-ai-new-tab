import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MAX_QUICK_LINKS } from '../data/catalog';
import type { QuickLink } from '../types';
import { QuickLinks } from './QuickLinks';

const links: QuickLink[] = Array.from({ length: MAX_QUICK_LINKS }, (_, index) => ({
  id: `link-${index}`,
  name: `Link ${index + 1}`,
  url: `https://example.com/${index}`,
  icon: 'website',
}));

describe('QuickLinks capacity', () => {
  it('only offers Add while another shortcut can be saved', () => {
    const props = {
      onReorder: vi.fn(),
      onOpen: vi.fn(),
      onEdit: vi.fn(),
      onAdd: vi.fn(),
    };
    const { rerender } = render(<QuickLinks links={links} {...props} />);

    expect(screen.queryByRole('button', { name: 'Add quick link' })).toBeNull();

    rerender(<QuickLinks links={links.slice(0, -1)} {...props} />);
    expect(screen.getByRole('button', { name: 'Add quick link' })).toBeTruthy();
  });

  it('moves exactly one adjacent slot from the drag handle with arrow keys', () => {
    const onReorder = vi.fn();
    render(<QuickLinks links={links.slice(0, 3)} onReorder={onReorder} onOpen={vi.fn()} onEdit={vi.fn()} onAdd={vi.fn()} />);

    fireEvent.keyDown(screen.getByRole('button', { name: 'Reorder Link 2' }), { key: 'ArrowLeft' });

    const reordered = onReorder.mock.calls[0][0] as QuickLink[];
    expect(reordered.map((link) => link.id)).toEqual(['link-1', 'link-0', 'link-2']);
  });
});
