import { createRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CommandBar } from './CommandBar';

function renderCommandBar(overrides: Partial<React.ComponentProps<typeof CommandBar>> = {}) {
  const props: React.ComponentProps<typeof CommandBar> = {
    inputRef: createRef<HTMLInputElement>(),
    mode: 'ai',
    aiProvider: 'chatgpt',
    searchEngine: 'google',
    onModeChange: vi.fn(),
    onAiProviderChange: vi.fn(),
    onSearchEngineChange: vi.fn(),
    onAction: vi.fn(),
    ...overrides,
  };
  render(<CommandBar {...props} />);
  return props;
}

describe('CommandBar keyboard flow', () => {
  it('uses Tab to switch AI to Search without moving focus', () => {
    const props = renderCommandBar();
    const input = screen.getByRole('textbox', { name: 'Ask ChatGPT' });
    input.focus();
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(props.onModeChange).toHaveBeenCalledWith('search');
    expect(document.activeElement).toBe(input);
  });

  it('executes the highlighted suggestion with Enter', () => {
    const props = renderCommandBar();
    const input = screen.getByRole('textbox', { name: 'Ask ChatGPT' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(props.onAction).toHaveBeenCalledWith(expect.objectContaining({
      type: 'navigate',
      targetId: 'chatgpt',
    }));
  });

  it('puts the current Search destination first in Search mode', () => {
    const props = renderCommandBar({ mode: 'search' });
    const input = screen.getByRole('textbox', { name: 'Search with Google' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(props.onAction).toHaveBeenCalledWith(expect.objectContaining({
      type: 'navigate',
      targetId: 'google',
    }));
  });

  it('clears and blurs on Escape', () => {
    renderCommandBar();
    const input = screen.getByRole('textbox', { name: 'Ask ChatGPT' }) as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '/youtube' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input.value).toBe('');
    expect(document.activeElement).not.toBe(input);
  });

  it('shows a calculator result without turning it into another suggestion', async () => {
    renderCommandBar({ mode: 'search' });
    const input = screen.getByRole('textbox', { name: 'Search with Google' }) as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '125 * 8' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toBe('1000');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  });
});
