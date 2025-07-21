import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  author: string;
  status: "draft" | "published" | "hidden";
  category: string;
  views: number;
  featured_image?: string | null;
  slug?: string | null;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
};

export type Banner = {
  id: string;
  page: string;
  position: "top" | "bottom" | "sidebar";
  title?: string;
  content?: string;
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
