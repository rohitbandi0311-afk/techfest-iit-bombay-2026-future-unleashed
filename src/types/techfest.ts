export interface TechDomain {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  accentColor: string; // hex or tailwind name
  iconName: string;
  modelType: 'ai' | 'robotics' | 'space' | 'innovation' | 'coding';
  highlights: string[];
  competitionsCount: number;
  featuredCompetition: string;
  prizePool: string;
}

export type EventCategory = 'all' | 'flagship' | 'competitions' | 'workshops' | 'lectures' | 'technoholix';

export interface TechfestEvent {
  id: string;
  title: string;
  category: EventCategory;
  domainId: string;
  tagline: string;
  description: string;
  prize: string;
  teamSize: string;
  venue: string;
  date: string;
  time: string;
  status: 'Open' | 'Fast Filling' | 'Invitation Only';
  featured: boolean;
  rules: string[];
  eligibility: string;
  coordinator: {
    name: string;
    contact: string;
  };
}

export interface KeynoteSpeaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  topic: string;
  date: string;
  time: string;
  venue: string;
  badge: string;
}

export interface PassRegistrationData {
  fullName: string;
  email: string;
  institution: string;
  city: string;
  domainInterest: string;
  attendeeType: 'Student' | 'Professional' | 'International Participant' | 'Faculty';
}

export interface GeneratedCyberPass extends PassRegistrationData {
  passId: string;
  issuedAt: string;
  qrCodeSeed: string;
  accessTier: string;
  zoneCode: string;
}

export type LabCoreMode = 'core' | 'quantum' | 'satellite' | 'robotics' | 'mainframe';
export type LabLightingTheme = 'neon-cyan' | 'solar-orange' | 'plasma-purple' | 'matrix-green';
export type LabRenderMode = 'pbr' | 'hologram' | 'wireframe' | 'exploded';
