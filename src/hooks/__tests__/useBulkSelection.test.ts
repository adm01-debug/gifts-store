import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBulkSelection } from '../useBulkSelection';

describe('useBulkSelection', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
  ];

  it('inicializa sem seleção', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems));
    
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.isAllSelected).toBe(false);
  });

  it('seleciona item individual', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems));
    
    act(() => {
      result.current.toggleItem('1');
    });
    
    expect(result.current.selectedIds).toContain('1');
    expect(result.current.selectedCount).toBe(1);
    expect(result.current.isSelected('1')).toBe(true);
  });

  it('desseleciona item ao clicar novamente', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems));
    
    act(() => {
      result.current.toggleItem('1');
      result.current.toggleItem('1');
    });
    
    expect(result.current.selectedIds).not.toContain('1');
    expect(result.current.selectedCount).toBe(0);
  });

  it('seleciona todos os itens', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems));
    
    act(() => {
      result.current.toggleAll();
    });
    
    expect(result.current.selectedCount).toBe(3);
    expect(result.current.isAllSelected).toBe(true);
  });

  it('desseleciona todos quando já todos estão selecionados', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems));
    
    act(() => {
      result.current.toggleAll(); // Seleciona todos
      result.current.toggleAll(); // Desseleciona todos
    });
    
    expect(result.current.selectedCount).toBe(0);
    expect(result.current.isAllSelected).toBe(false);
  });

  it('limpa seleção', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems));
    
    act(() => {
      result.current.toggleItem('1');
      result.current.toggleItem('2');
      result.current.clearSelection();
    });
    
    expect(result.current.selectedCount).toBe(0);
  });

  it('detecta seleção parcial', () => {
    const { result } = renderHook(() => useBulkSelection(mockItems));
    
    act(() => {
      result.current.toggleItem('1');
    });
    
    expect(result.current.isSomeSelected).toBe(true);
    expect(result.current.isAllSelected).toBe(false);
  });
});
