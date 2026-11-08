/* Shapes of the content in site.ts. Sections the page doesn't render yet
   (journey, skills, education…) are kept loose so they can stay as notes. */

export interface Profile {
  name: string;
  short: string;
  initials: string;
  program: string;
  school: string;
  gradYear: string;
  email: string;
  phone: string;
  github: string;
  githubHandle: string;
  linkedin: string;
  location: string;
  roles: string[];
}

export interface Shot {
  src: string;
  cap?: string;
  pixel?: boolean;
  /* a tall page screenshot that scrolls inside the laptop */
  scroll?: boolean;
  /* unused hint kept from the screenshot pass */
  ch?: number;
}

export interface Video {
  src: string;
  poster?: string;
  title?: string;
  cap?: string;
}

export interface Project {
  id: string;
  name: string;
  sub?: string;
  kicker: string;
  year: string;
  course?: string;
  rank?: string;
  icon?: string;
  team?: string;
  role?: string;
  tagline?: string;
  blurb?: string;
  problem?: string;
  solution?: string;
  process?: string;
  outcome?: string;
  note?: string;
  contribution?: string[];
  features?: string[];
  tech: string[];
  skills?: string[];
  featured?: boolean;
  /* kept in the data, never shown */
  hide?: boolean;
  hero?: string;
  heroFit?: "contain" | "cover";
  heroPixel?: boolean;
  /* card picture: phones even when there are laptop screens */
  face?: "phone";
  /* [front, back] phone screens on the card */
  cover?: [number, number];
  phone?: Shot[];
  phoneTitle?: string;
  laptop?: Shot[];
  laptopTitle?: string;
  gallery?: Shot[];
  video?: Video;
  videos?: Video[];
  live?: string;
  liveLabel?: string;
  figma?: string;
  repo?: string;
  githubSoon?: boolean;
  apk?: boolean;
  playable?: string;
}

export interface Playable {
  id: string;
  title: string;
  sub: string;
  origin: string;
  desc: string;
  art?: string[];
  glyph?: string;
  tag?: string;
}

export interface Cert {
  id: string;
  name: string;
  issuer: string;
  via?: string;
  date: string;
  year: number;
  type: string;
  cat: string;
  featured?: boolean;
  file: string;
  verify?: string;
  note?: string;
}

export interface Trait { t: string; p: string }

export interface Recognition {
  t: string;
  p: string;
  icon: "list" | "cap" | "star";
  img?: string;
  cap?: string;
  more?: { src: string; cap: string }[];
}

export interface Recommendation {
  quote: string;
  name: string;
  role?: string;
  relation?: string;
  photo?: string;
}

export interface Milestone { when: string; t: string; p: string }

export interface Photo {
  src: string;
  title: string;
  sub: string;
  cap: string;
  hero?: boolean;
  wide?: boolean;
  tall?: boolean;
}

export interface Leadership {
  role: string;
  org: string;
  where: string;
  term: string;
  body: string;
  photos: Photo[];
  events: { d: string; m: string; t: string; p: string; win: string }[];
  also: string[];
}

export interface TechIcon { name: string; slug?: string; mark?: string; color?: string }

export interface SkillRole { n: string; k: string; ico: string; p: string; tags: string[] }

export interface Badges {
  title: string;
  count: number;
  note: string;
  profile: string;
  items: { name: string; kind: string; track: string; date: string }[];
}

export interface Site {
  profile: Profile;
  journey: unknown[];
  traits: Trait[];
  recommendations: Recommendation[];
  recognition: Recognition[];
  milestones: Milestone[];
  projects: Project[];
  designGallery: unknown[];
  playable: Playable[];
  skills: unknown[];
  certTypes: Record<string, { label: string; color: string }>;
  certs: Cert[];
  badges: Badges;
  leadership: Leadership;
  education: unknown[];
  honors: string[];
  techIcons: TechIcon[];
  skillRoles: SkillRole[];
  softSkills: Trait[];
  proofs: Photo[];
}
