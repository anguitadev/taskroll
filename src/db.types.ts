export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Comentarios: {
        Row: {
          comentario: string
          created_at: string
          id: string
          tarea: string
          usuario: string
        }
        Insert: {
          comentario: string
          created_at?: string
          id?: string
          tarea: string
          usuario: string
        }
        Update: {
          comentario?: string
          created_at?: string
          id?: string
          tarea?: string
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comentarios_tarea_fkey"
            columns: ["tarea"]
            isOneToOne: false
            referencedRelation: "Tareas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comentarios_usuario_fkey"
            columns: ["usuario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Documentos: {
        Row: {
          created_at: string
          destinatario: string | null
          entorno: string | null
          id: string
          nombre: string
          propietario: string
          url: string
        }
        Insert: {
          created_at?: string
          destinatario?: string | null
          entorno?: string | null
          id?: string
          nombre: string
          propietario: string
          url: string
        }
        Update: {
          created_at?: string
          destinatario?: string | null
          entorno?: string | null
          id?: string
          nombre?: string
          propietario?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Docuementacion_Entornos_entorno_fkey"
            columns: ["entorno"]
            isOneToOne: false
            referencedRelation: "Entornos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Documentos_destinatario_fkey"
            columns: ["destinatario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Documentos_propietario_fkey"
            columns: ["propietario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Entornos: {
        Row: {
          color: string
          descripcion: string | null
          entorno: string | null
          equipo: string | null
          id: string
          nombre: string
          propietario: string
          slug: string
        }
        Insert: {
          color?: string
          descripcion?: string | null
          entorno?: string | null
          equipo?: string | null
          id?: string
          nombre: string
          propietario: string
          slug: string
        }
        Update: {
          color?: string
          descripcion?: string | null
          entorno?: string | null
          equipo?: string | null
          id?: string
          nombre?: string
          propietario?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "Entornos_entorno_fkey"
            columns: ["entorno"]
            isOneToOne: false
            referencedRelation: "Entornos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Entornos_equipo_fkey"
            columns: ["equipo"]
            isOneToOne: false
            referencedRelation: "Equipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Entornos_propietario_fkey"
            columns: ["propietario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Equipos: {
        Row: {
          color: string
          created_at: string
          id: string
          nombre: string
          slug: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          nombre: string
          slug: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          nombre?: string
          slug?: string
        }
        Relationships: []
      }
      Incidencias: {
        Row: {
          comentario: string
          creado: string
          id: string
          usuario: string
        }
        Insert: {
          comentario: string
          creado?: string
          id?: string
          usuario: string
        }
        Update: {
          comentario?: string
          creado?: string
          id?: string
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "Incidencias_usuario_fkey"
            columns: ["usuario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Marcajes: {
        Row: {
          entrada: string
          entrada_2: string | null
          id: string
          salida: string | null
          salida_2: string | null
          usuario: string | null
        }
        Insert: {
          entrada: string
          entrada_2?: string | null
          id?: string
          salida?: string | null
          salida_2?: string | null
          usuario?: string | null
        }
        Update: {
          entrada?: string
          entrada_2?: string | null
          id?: string
          salida?: string | null
          salida_2?: string | null
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Marcajes_usuario_fkey"
            columns: ["usuario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Notificaciones: {
        Row: {
          created_at: string
          id: string
          notificacion: string
          tarea: string
          usuario_destinatario: string
          usuario_origen: string
        }
        Insert: {
          created_at?: string
          id?: string
          notificacion: string
          tarea: string
          usuario_destinatario: string
          usuario_origen: string
        }
        Update: {
          created_at?: string
          id?: string
          notificacion?: string
          tarea?: string
          usuario_destinatario?: string
          usuario_origen?: string
        }
        Relationships: [
          {
            foreignKeyName: "Notificaciones_tarea_fkey"
            columns: ["tarea"]
            isOneToOne: false
            referencedRelation: "Tareas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Notificaciones_usuario_destinatario_fkey"
            columns: ["usuario_destinatario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Notificaciones_usuario_origen_fkey"
            columns: ["usuario_origen"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Pizarras: {
        Row: {
          contenido: string | null
          entorno: string
          id: number
        }
        Insert: {
          contenido?: string | null
          entorno: string
          id?: number
        }
        Update: {
          contenido?: string | null
          entorno?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Pizarras_entorno_fkey"
            columns: ["entorno"]
            isOneToOne: true
            referencedRelation: "Entornos"
            referencedColumns: ["id"]
          },
        ]
      }
      Tareas: {
        Row: {
          descripcion: string | null
          entorno: string
          estado: string
          fecha_fin: string
          fecha_inicio: string
          id: string
          prioridad: string
          propietario: string
          slug: string
          titulo: string
        }
        Insert: {
          descripcion?: string | null
          entorno: string
          estado?: string
          fecha_fin: string
          fecha_inicio?: string
          id?: string
          prioridad?: string
          propietario: string
          slug: string
          titulo: string
        }
        Update: {
          descripcion?: string | null
          entorno?: string
          estado?: string
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          prioridad?: string
          propietario?: string
          slug?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "Tareas_entorno_fkey"
            columns: ["entorno"]
            isOneToOne: false
            referencedRelation: "Entornos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tareas_propietario_fkey"
            columns: ["propietario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Usuarios: {
        Row: {
          color: string
          email: string
          id: string
          nombre_completo: string
          nombre_usuario: string
          puesto: string | null
        }
        Insert: {
          color?: string
          email: string
          id: string
          nombre_completo: string
          nombre_usuario: string
          puesto?: string | null
        }
        Update: {
          color?: string
          email?: string
          id?: string
          nombre_completo?: string
          nombre_usuario?: string
          puesto?: string | null
        }
        Relationships: []
      }
      Usuarios_Entornos: {
        Row: {
          admin: boolean
          entorno: string
          id: string
          usuario: string
        }
        Insert: {
          admin?: boolean
          entorno: string
          id?: string
          usuario: string
        }
        Update: {
          admin?: boolean
          entorno?: string
          id?: string
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "Usuarios_Entornos_entorno_fkey"
            columns: ["entorno"]
            isOneToOne: false
            referencedRelation: "Entornos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Usuarios_Entornos_usuario_fkey"
            columns: ["usuario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Usuarios_Equipos: {
        Row: {
          admin: boolean
          created_at: string
          equipo: string
          id: string
          usuario: string
        }
        Insert: {
          admin?: boolean
          created_at?: string
          equipo: string
          id?: string
          usuario: string
        }
        Update: {
          admin?: boolean
          created_at?: string
          equipo?: string
          id?: string
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "Usuarios_Equipos_equipo_fkey"
            columns: ["equipo"]
            isOneToOne: false
            referencedRelation: "Equipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Usuarios_Equipos_usuario_fkey"
            columns: ["usuario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Usuarios_Tareas: {
        Row: {
          id: string
          tarea: string
          usuario: string
        }
        Insert: {
          id?: string
          tarea: string
          usuario: string
        }
        Update: {
          id?: string
          tarea?: string
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "Usuarios_Tareas_tarea_fkey"
            columns: ["tarea"]
            isOneToOne: false
            referencedRelation: "Tareas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Usuarios_Tareas_usuario_fkey"
            columns: ["usuario"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
