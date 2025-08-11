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
      blogs: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          read_time: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          read_time?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      chipi_conversations: {
        Row: {
          created_at: string | null
          id: string
          mabot_chat_id: string | null
          session_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mabot_chat_id?: string | null
          session_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mabot_chat_id?: string | null
          session_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chipi_messages: {
        Row: {
          content_metadata: Json | null
          content_text: string | null
          content_type: string
          conversation_id: string | null
          created_at: string | null
          id: string
          mabot_message_id: string | null
          role: string
        }
        Insert: {
          content_metadata?: Json | null
          content_text?: string | null
          content_type: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          mabot_message_id?: string | null
          role: string
        }
        Update: {
          content_metadata?: Json | null
          content_text?: string | null
          content_type?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          mabot_message_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chipi_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chipi_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          attachment_url: string | null
          consent: boolean
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          reason: string
        }
        Insert: {
          attachment_url?: string | null
          consent: boolean
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          reason: string
        }
        Update: {
          attachment_url?: string | null
          consent?: boolean
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          reason?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          assigned_to: string | null
          attachment_filename: string | null
          attachment_mime_type: string | null
          attachment_size: number | null
          attachment_url: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          internal_notes: string | null
          ip_address: unknown | null
          message: string
          priority: string | null
          reason: Database["public"]["Enums"]["contact_reason"]
          referrer: string | null
          response_sent_at: string | null
          status: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachment_filename?: string | null
          attachment_mime_type?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          internal_notes?: string | null
          ip_address?: unknown | null
          message: string
          priority?: string | null
          reason: Database["public"]["Enums"]["contact_reason"]
          referrer?: string | null
          response_sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachment_filename?: string | null
          attachment_mime_type?: string | null
          attachment_size?: number | null
          attachment_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          internal_notes?: string | null
          ip_address?: unknown | null
          message?: string
          priority?: string | null
          reason?: Database["public"]["Enums"]["contact_reason"]
          referrer?: string | null
          response_sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
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
          vertical: string | null
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
          vertical?: string | null
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
          vertical?: string | null
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
      calculate_read_time: {
        Args: { content: string }
        Returns: number
      }
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      get_author_blog_stats: {
        Args: { author_user_id: string }
        Returns: Json
      }
      get_contact_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_popular_tags: {
        Args: { limit_count?: number }
        Returns: {
          tag: string
          count: number
        }[]
      }
      get_related_blogs: {
        Args: { blog_id: string; limit_count?: number }
        Returns: {
          author_id: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          read_time: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }[]
      }
      increment_blog_views: {
        Args: { blog_id: string }
        Returns: undefined
      }
      search_blogs: {
        Args: { search_term: string }
        Returns: {
          author_id: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          read_time: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }[]
      }
    }
    Enums: {
      contact_reason:
        | "consulta_general"
        | "soporte_tecnico"
        | "propuesta_colaboracion"
        | "reportar_problema"
        | "sugerencia_mejora"
        | "solicitar_evento"
        | "partnership"
        | "prensa_media"
        | "otro"
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
    Enums: {
      contact_reason: [
        "consulta_general",
        "soporte_tecnico",
        "propuesta_colaboracion",
        "reportar_problema",
        "sugerencia_mejora",
        "solicitar_evento",
        "partnership",
        "prensa_media",
        "otro",
      ],
    },
  },
} as const
