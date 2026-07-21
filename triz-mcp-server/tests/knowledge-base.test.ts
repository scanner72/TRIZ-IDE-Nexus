import test from 'node:test';
import assert from 'node:assert/strict';
import { knowledgeBase } from '../src/memory/knowledge-base.js';

test('knowledge base contains all 40 principles', () => {
  const principles = knowledgeBase.listPrinciples();

  assert.equal(principles.length, 40);
  assert.deepEqual(
    principles.map((principle) => principle.id),
    Array.from({ length: 40 }, (_, index) => index + 1)
  );
});

test('knowledge base finds principles by ids', () => {
  const principles = knowledgeBase.findByIds([1, 2, 15]);
  assert.deepEqual(principles.map((principle) => principle.id), [1, 2, 15]);
});

test('knowledge base supports search', () => {
  const results = knowledgeBase.searchPrinciples('segmentation');
  assert.equal(results[0]?.id, 1);
});
