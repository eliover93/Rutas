export type SubscriptionStatus = 'trialing' | 'active' | 'expired' | 'canceled';
export type Plan = 'starter' | 'pro' | 'team';
export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected';
export type ThemeKey = 'mediterraneo' | 'asiatico' | 'tropical' | 'nordico' | 'safari';

export interface Agency {
  id: string;
  name: string;
  logo_url: string | null;
  brand_color: string;
  custom_domain: string | null;
  subscription_status: SubscriptionStatus;
  plan: Plan;
  stripe_customer_id: string | null;
  trial_ends_at: string;
  is_founder_deal: boolean;
  created_at: string;
}

export interface Proposal {
  id: string;
  agency_id: string;
  client_name: string;
  title: string;
  destination: string;
  theme_key: ThemeKey | null;
  cover_image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  price: number | null;
  status: ProposalStatus;
  public_slug: string;
  created_at: string;
  updated_at: string;
  // Bloque hotel
  hotel_name: string | null;
  hotel_stars: number | null;
  hotel_image_url: string | null;
  hotel_image_credit: string | null;
  hotel_image_credit_url: string | null;
  // Desglose de precio
  price_includes: string[] | null;
  price_excludes: string[] | null;
  views: number;
  cover_image_credit: string | null;
  cover_image_credit_url: string | null;
  client_message: string | null;
}

export type DayCategory = 'naturaleza' | 'gastronomia' | 'cultura' | 'aventura' | 'playa' | 'descanso';

export interface ItineraryDay {
  id: string;
  proposal_id: string;
  day_number: number;
  title: string | null;
  description: string | null;
  accommodation: string | null;
  image_url: string | null;
  image_credit: string | null;
  image_credit_url: string | null;
  category: DayCategory | null;
  order_index: number;
}

// Placeholder mínimo — sustituir por:
// npx supabase gen types typescript --project-id <id> > src/types/database.types.ts
export interface Database {
  public: {
    Tables: {
      agencies: { Row: Agency; Insert: Partial<Agency>; Update: Partial<Agency> };
      proposals: { Row: Proposal; Insert: Partial<Proposal>; Update: Partial<Proposal> };
      itinerary_days: { Row: ItineraryDay; Insert: Partial<ItineraryDay>; Update: Partial<ItineraryDay> };
    };
  };
}
