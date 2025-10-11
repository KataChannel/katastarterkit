/**
 * Tests for BlockRenderer component - Recursive rendering
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import BlockRenderer from '@/components/page-builder/blocks/BlockRenderer';
import { PageBlock, BlockType } from '@/types/page-builder';

// Mock child components
jest.mock('@/components/page-builder/blocks/ContainerBlock', () => ({
  __esModule: true,
  default: ({ block, children }: any) => (
    <div data-testid={`container-${block.id}`}>
      <div>Container Block</div>
      {children}
    </div>
  ),
}));

jest.mock('@/components/page-builder/blocks/SectionBlock', () => ({
  __esModule: true,
  default: ({ block, children }: any) => (
    <div data-testid={`section-${block.id}`}>
      <div>Section Block</div>
      {children}
    </div>
  ),
}));

jest.mock('@/components/page-builder/blocks/GridBlock', () => ({
  __esModule: true,
  default: ({ block, children }: any) => (
    <div data-testid={`grid-${block.id}`}>
      <div>Grid Block</div>
      {children}
    </div>
  ),
}));

jest.mock('@/components/page-builder/blocks/TextBlock', () => ({
  __esModule: true,
  default: ({ block }: any) => (
    <div data-testid={`text-${block.id}`}>Text: {block.content?.content || ''}</div>
  ),
}));

describe('BlockRenderer', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnAddChild = jest.fn();
  const mockOnUpdateChild = jest.fn();
  const mockOnDeleteChild = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render a simple block', () => {
      const block: PageBlock = {
        id: 'block-1',
        type: 'TEXT' as BlockType,
        content: { content: 'Hello World' },
        style: {},
        order: 0,
        isVisible: true,
        pageId: 'page-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      render(
        <BlockRenderer
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByTestId('text-block-1')).toBeInTheDocument();
      expect(screen.getByText('Text: Hello World')).toBeInTheDocument();
    });

    it('should not render hidden blocks', () => {
      const block: PageBlock = {
        id: 'block-1',
        type: 'TEXT' as BlockType,
        content: { content: 'Hidden' },
        style: {},
        order: 0,
        isVisible: false,
        pageId: 'page-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { container } = render(
        <BlockRenderer
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Nested Rendering', () => {
    it('should render nested blocks (1 level)', () => {
      const block: PageBlock = {
        id: 'section-1',
        type: 'SECTION' as BlockType,
        content: {},
        style: {},
        order: 0,
        isVisible: true,
        pageId: 'page-1',
        depth: 0,
        children: [
          {
            id: 'text-1',
            type: 'TEXT' as BlockType,
            content: { content: 'Child text' },
            style: {},
            order: 0,
            isVisible: true,
            pageId: 'page-1',
            parentId: 'section-1',
            depth: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      render(
        <BlockRenderer
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          onAddChild={mockOnAddChild}
          onUpdateChild={mockOnUpdateChild}
          onDeleteChild={mockOnDeleteChild}
        />
      );

      expect(screen.getByTestId('section-section-1')).toBeInTheDocument();
      expect(screen.getByTestId('text-text-1')).toBeInTheDocument();
      expect(screen.getByText('Text: Child text')).toBeInTheDocument();
    });

    it('should render deeply nested blocks (3 levels)', () => {
      const block: PageBlock = {
        id: 'section-1',
        type: 'SECTION' as BlockType,
        content: {},
        style: {},
        order: 0,
        isVisible: true,
        pageId: 'page-1',
        depth: 0,
        children: [
          {
            id: 'grid-1',
            type: 'GRID' as BlockType,
            content: { columns: 3 },
            style: {},
            order: 0,
            isVisible: true,
            pageId: 'page-1',
            parentId: 'section-1',
            depth: 1,
            children: [
              {
                id: 'text-1',
                type: 'TEXT' as BlockType,
                content: { content: 'Nested text 1' },
                style: {},
                order: 0,
                isVisible: true,
                pageId: 'page-1',
                parentId: 'grid-1',
                depth: 2,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'text-2',
                type: 'TEXT' as BlockType,
                content: { content: 'Nested text 2' },
                style: {},
                order: 1,
                isVisible: true,
                pageId: 'page-1',
                parentId: 'grid-1',
                depth: 2,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      render(
        <BlockRenderer
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          onAddChild={mockOnAddChild}
          onUpdateChild={mockOnUpdateChild}
          onDeleteChild={mockOnDeleteChild}
        />
      );

      // Check all levels rendered
      expect(screen.getByTestId('section-section-1')).toBeInTheDocument();
      expect(screen.getByTestId('grid-grid-1')).toBeInTheDocument();
      expect(screen.getByTestId('text-text-1')).toBeInTheDocument();
      expect(screen.getByTestId('text-text-2')).toBeInTheDocument();
      
      // Check content
      expect(screen.getByText('Text: Nested text 1')).toBeInTheDocument();
      expect(screen.getByText('Text: Nested text 2')).toBeInTheDocument();
    });

    it('should maintain block order in children', () => {
      const block: PageBlock = {
        id: 'container-1',
        type: 'CONTAINER' as BlockType,
        content: {},
        style: {},
        order: 0,
        isVisible: true,
        pageId: 'page-1',
        depth: 0,
        children: [
          {
            id: 'text-3',
            type: 'TEXT' as BlockType,
            content: { content: 'Third' },
            style: {},
            order: 2,
            isVisible: true,
            pageId: 'page-1',
            parentId: 'container-1',
            depth: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'text-1',
            type: 'TEXT' as BlockType,
            content: { content: 'First' },
            style: {},
            order: 0,
            isVisible: true,
            pageId: 'page-1',
            parentId: 'container-1',
            depth: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'text-2',
            type: 'TEXT' as BlockType,
            content: { content: 'Second' },
            style: {},
            order: 1,
            isVisible: true,
            pageId: 'page-1',
            parentId: 'container-1',
            depth: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { container } = render(
        <BlockRenderer
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          onAddChild={mockOnAddChild}
          onUpdateChild={mockOnUpdateChild}
          onDeleteChild={mockOnDeleteChild}
        />
      );

      // Children should be sorted by order
      const textElements = container.querySelectorAll('[data-testid^="text-"]');
      expect(textElements).toHaveLength(3);
      expect(textElements[0].textContent).toContain('First');
      expect(textElements[1].textContent).toContain('Second');
      expect(textElements[2].textContent).toContain('Third');
    });
  });

  describe('Depth Tracking', () => {
    it('should pass depth to children', () => {
      const block: PageBlock = {
        id: 'section-1',
        type: 'SECTION' as BlockType,
        content: {},
        style: {},
        order: 0,
        isVisible: true,
        pageId: 'page-1',
        depth: 0,
        children: [
          {
            id: 'grid-1',
            type: 'GRID' as BlockType,
            content: {},
            style: {},
            order: 0,
            isVisible: true,
            pageId: 'page-1',
            parentId: 'section-1',
            depth: 1,
            children: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      render(
        <BlockRenderer
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
          depth={0}
        />
      );

      // Both components should render
      expect(screen.getByTestId('section-section-1')).toBeInTheDocument();
      expect(screen.getByTestId('grid-grid-1')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should render container without children', () => {
      const block: PageBlock = {
        id: 'container-1',
        type: 'CONTAINER' as BlockType,
        content: {},
        style: {},
        order: 0,
        isVisible: true,
        pageId: 'page-1',
        depth: 0,
        children: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      render(
        <BlockRenderer
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByTestId('container-container-1')).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      const block: PageBlock = {
        id: 'section-1',
        type: 'SECTION' as BlockType,
        content: {},
        style: {},
        order: 0,
        isVisible: true,
        pageId: 'page-1',
        depth: 0,
        // children: undefined (not set)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      render(
        <BlockRenderer
          block={block}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByTestId('section-section-1')).toBeInTheDocument();
    });
  });
});
