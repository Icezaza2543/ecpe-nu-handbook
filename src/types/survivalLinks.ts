export type SurvivalLinkPlatform = 'facebook' | 'website' | 'pdf' | 'post';

export interface SurvivalLink {
  id: string;
  name: string;
  description: string;
  url: string;
  platform: SurvivalLinkPlatform;
}

export interface SurvivalLinkCategory {
  id: string;
  title: string;
  linkIds: string[];
}

export interface SurvivalLinksBundle {
  intro: {
    title: string;
    subtitle: string;
    lastUpdated: string;
  };
  disclaimer: string[];
  pinnedLinkIds: string[];
  categories: SurvivalLinkCategory[];
  askSeniorsChecklist: string[];
  notes: string[];
}
