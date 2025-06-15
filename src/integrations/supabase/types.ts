export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          description: string | null
          id: string
          target_id: string | null
          target_table: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          target_id?: string | null
          target_table: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          target_id?: string | null
          target_table?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          duration: number | null
          id: string
          level: string | null
          name: string
          status: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          duration?: number | null
          id?: string
          level?: string | null
          name: string
          status?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          duration?: number | null
          id?: string
          level?: string | null
          name?: string
          status?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string | null
          city: string | null
          cost_type: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          end_date: string | null
          event_type: string | null
          highlight_img: string | null
          id: string
          location: string | null
          name: string
          price: number | null
          purchase_url: string | null
          start_date: string | null
          status: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          cost_type?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          highlight_img?: string | null
          id?: string
          location?: string | null
          name: string
          price?: number | null
          purchase_url?: string | null
          start_date?: string | null
          status?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          cost_type?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          highlight_img?: string | null
          id?: string
          location?: string | null
          name?: string
          price?: number | null
          purchase_url?: string | null
          start_date?: string | null
          status?: string | null
          url?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      professional_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_photo_url: string | null
          created_at: string | null
          display_name: string | null
          headline: string | null
          id: string
          interests: string[] | null
          is_public: boolean | null
          location: string | null
          name: string
          notification_preferences: Json | null
          skills: string[] | null
          social_links: Json | null
          user_id: string
          vertical: string
          what_i_am_looking_for: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          display_name?: string | null
          headline?: string | null
          id?: string
          interests?: string[] | null
          is_public?: boolean | null
          location?: string | null
          name: string
          notification_preferences?: Json | null
          skills?: string[] | null
          social_links?: Json | null
          user_id: string
          vertical: string
          what_i_am_looking_for?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          display_name?: string | null
          headline?: string | null
          id?: string
          interests?: string[] | null
          is_public?: boolean | null
          location?: string | null
          name?: string
          notification_preferences?: Json | null
          skills?: string[] | null
          social_links?: Json | null
          user_id?: string
          vertical?: string
          what_i_am_looking_for?: string | null
        }
        Relationships: []
      }
      project_favorites: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_favorites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          created_at: string | null
          creator_id: string
          demo_url: string | null
          description: string | null
          docs_url: string | null
          highlight_img: string | null
          id: string
          name: string
          open_to_feedback: boolean | null
          problem: string | null
          repo_url: string | null
          status: string | null
          updated_at: string | null
          vertical: string
          wants_to_monetize: boolean | null
          wants_updates: boolean | null
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          creator_id: string
          demo_url?: string | null
          description?: string | null
          docs_url?: string | null
          highlight_img?: string | null
          id?: string
          name: string
          open_to_feedback?: boolean | null
          problem?: string | null
          repo_url?: string | null
          status?: string | null
          updated_at?: string | null
          vertical: string
          wants_to_monetize?: boolean | null
          wants_updates?: boolean | null
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          creator_id?: string
          demo_url?: string | null
          description?: string | null
          docs_url?: string | null
          highlight_img?: string | null
          id?: string
          name?: string
          open_to_feedback?: boolean | null
          problem?: string | null
          repo_url?: string | null
          status?: string | null
          updated_at?: string | null
          vertical?: string
          wants_to_monetize?: boolean | null
          wants_updates?: boolean | null
          website_url?: string | null
        }
        Relationships: []
      }
      resource_likes: {
        Row: {
          created_at: string | null
          id: string
          resource_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          resource_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          resource_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_likes_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          description_short: string | null
          id: string
          name: string
          resource_type: string | null
          status: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          description_short?: string | null
          id?: string
          name: string
          resource_type?: string | null
          status?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          description_short?: string | null
          id?: string
          name?: string
          resource_type?: string | null
          status?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
