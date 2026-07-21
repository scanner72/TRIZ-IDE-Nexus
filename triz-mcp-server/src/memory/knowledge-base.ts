import principles from '../../data/knowledge/triz-principles.json' with { type: 'json' };
import type { TrizPrinciple } from '../models/knowledge.js';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export class KnowledgeBase {
  private readonly principleCatalog: TrizPrinciple[] = principles as TrizPrinciple[];
  private readonly byId = new Map<number, TrizPrinciple>();

  constructor() {
    for (const principle of this.principleCatalog) {
      this.byId.set(principle.id, principle);
    }
  }

  listPrinciples(): TrizPrinciple[] {
    return this.principleCatalog;
  }

  getById(id: number): TrizPrinciple | undefined {
    return this.byId.get(id);
  }

  findByIds(ids: number[]): TrizPrinciple[] {
    return ids
      .map((id) => this.byId.get(id))
      .filter((principle): principle is TrizPrinciple => Boolean(principle));
  }

  searchPrinciples(query: string): TrizPrinciple[] {
    const normalizedQuery = normalize(query);

    return this.principleCatalog.filter((principle) => {
      const haystack = [
        principle.name,
        principle.description,
        ...(principle.aliases ?? []),
        ...(principle.tags ?? []),
        ...(principle.guidance ?? [])
      ].map(normalize);

      return haystack.some((value) => value.includes(normalizedQuery));
    });
  }
}

export const knowledgeBase = new KnowledgeBase();
