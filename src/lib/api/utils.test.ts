import type { PaginateQuery } from './utils';
import {
  getNextPageParam,
  getPreviousPageParam,
  getUrlParameters,
  normalizePages,
} from './utils';

/* eslint-disable max-lines-per-function */
describe('aPI utils', () => {
  describe('getUrlParameters', () => {
    it('returns null for null input', () => {
      expect(getUrlParameters(null)).toBeNull();
    });

    it('extracts query parameters from URL', () => {
      const url = 'https://api.example.com/posts?offset=10&limit=20';
      expect(getUrlParameters(url)).toEqual({
        offset: '10',
        limit: '20',
      });
    });

    it('handles URLs with multiple query parameters', () => {
      const url = 'https://api.example.com/posts?offset=10&limit=20&sort=desc&filter=active';
      expect(getUrlParameters(url)).toEqual({
        offset: '10',
        limit: '20',
        sort: 'desc',
        filter: 'active',
      });
    });

    it('handles URLs with fragment identifiers', () => {
      const url = 'https://api.example.com/posts?offset=10&limit=20#section';
      expect(getUrlParameters(url)).toEqual({
        offset: '10',
        limit: '20',
      });
    });

    it('returns empty object for URL without query parameters', () => {
      const url = 'https://api.example.com/posts';
      expect(getUrlParameters(url)).toEqual({});
    });
  });

  describe('normalizePages', () => {
    it('flattens paginated results into a single array', () => {
      const pages: PaginateQuery<{ id: number; title: string }>[] = [
        {
          results: [
            { id: 1, title: 'Post 1' },
            { id: 2, title: 'Post 2' },
          ],
          count: 5,
          next: 'https://api.example.com/posts?offset=2',
          previous: null,
        },
        {
          results: [
            { id: 3, title: 'Post 3' },
            { id: 4, title: 'Post 4' },
          ],
          count: 5,
          next: 'https://api.example.com/posts?offset=4',
          previous: 'https://api.example.com/posts?offset=0',
        },
      ];

      expect(normalizePages(pages)).toEqual([
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
        { id: 3, title: 'Post 3' },
        { id: 4, title: 'Post 4' },
      ]);
    });

    it('returns empty array for undefined pages', () => {
      expect(normalizePages(undefined)).toEqual([]);
    });

    it('handles empty pages array', () => {
      expect(normalizePages([])).toEqual([]);
    });

    it('handles pages with empty results', () => {
      const pages: PaginateQuery<{ id: number }>[] = [
        { results: [], count: 0, next: null, previous: null },
      ];

      expect(normalizePages(pages)).toEqual([]);
    });
  });

  describe('getNextPageParam', () => {
    it('extracts offset from next URL', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 100,
        next: 'https://api.example.com/posts?offset=20&limit=10',
        previous: null,
      };

      expect(getNextPageParam(page, [], [], [])).toBe('20');
    });

    it('returns null when next is null', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 10,
        next: null,
        previous: null,
      };

      expect(getNextPageParam(page, [], [], [])).toBeNull();
    });

    it('returns null when next URL has no offset parameter', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 100,
        next: 'https://api.example.com/posts?limit=10',
        previous: null,
      };

      expect(getNextPageParam(page, [], [], [])).toBeNull();
    });
  });

  describe('getPreviousPageParam', () => {
    it('extracts offset from previous URL', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 100,
        next: null,
        previous: 'https://api.example.com/posts?offset=10&limit=10',
      };

      expect(getPreviousPageParam(page, [], [], [])).toBe('10');
    });

    it('returns null when previous is null', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 10,
        next: null,
        previous: null,
      };

      expect(getPreviousPageParam(page, [], [], [])).toBeNull();
    });

    it('returns null when previous URL has no offset parameter', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 100,
        next: null,
        previous: 'https://api.example.com/posts?limit=10',
      };

      expect(getPreviousPageParam(page, [], [], [])).toBeNull();
    });
  });
});
