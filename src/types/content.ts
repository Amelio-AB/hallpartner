export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface CTA {
  label: string;
  href: string;
  variant?: ButtonVariant;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface StrengthItem {
  title: string;
  description: string;
  icon?: string;
}

export interface JourneyStep {
  label: string;
  description: string;
}

export interface OpportunityCard {
  title: string;
  description: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  category: string;
  location: string;
  imageLabel: string;
  need: string;
  solution: string;
  result: string;
  relatedService: string;
}

export interface KnowledgeArticle {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  excerpt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RoadmapPhase {
  title: string;
  description: string;
}

export interface ResultItem {
  icon: string;
  title: string;
  text: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface HallTypeItem {
  title: string;
  description: string;
}

export interface IndustryItem {
  title: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}
