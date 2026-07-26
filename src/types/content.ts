import type { ImageMetadata } from 'astro';

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
  href?: string;
  linkLabel?: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  category: string;
  image: ImageMetadata;
  imageAlt: string;
  description: string;
  href: string;
  linkLabel: string;
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

export interface WorkshopQuestion {
  id: string;
  question: string;
  preliminary: string;
  importance: string;
}

export interface WorkshopCategory {
  number: string;
  title: string;
  questions: WorkshopQuestion[];
}

export interface WorkshopAnalysisGroup {
  title: string;
  intro: string;
  observations: string[];
}
