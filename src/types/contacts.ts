// Tipos para el sistema de contactos

export type ContactReason = 
  | 'consulta_general'
  | 'soporte_tecnico'
  | 'propuesta_colaboracion'
  | 'reportar_problema'
  | 'sugerencia_mejora'
  | 'solicitar_evento'
  | 'partnership'
  | 'prensa_media'
  | 'otro';

export type ContactStatus = 'nuevo' | 'en_revision' | 'respondido' | 'cerrado';

export type ContactPriority = 'baja' | 'normal' | 'alta' | 'urgente';

// Tipo para crear un nuevo contacto (formulario)
export interface CreateContactData {
  full_name: string;
  email?: string;
  reason: ContactReason;
  message: string;
  attachment?: File;
}

// Tipo completo del contacto en la base de datos
export interface Contact {
  id: string;
  full_name: string;
  email?: string;
  reason: ContactReason;
  message: string;
  
  // Archivo adjunto
  attachment_url?: string;
  attachment_filename?: string;
  attachment_size?: number;
  attachment_mime_type?: string;
  
  // Metadatos
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  
  // Estado
  status: ContactStatus;
  priority: ContactPriority;
  
  // Seguimiento (solo para admins)
  assigned_to?: string;
  internal_notes?: string;
  response_sent_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Opciones para el select del motivo
export const CONTACT_REASON_OPTIONS: { value: ContactReason; label: string; description?: string }[] = [
  {
    value: 'consulta_general',
    label: 'Consulta general',
    description: 'Preguntas sobre Terreta Hub y la comunidad'
  },
  {
    value: 'soporte_tecnico',
    label: 'Soporte técnico',
    description: 'Problemas con la plataforma o cuenta'
  },
  {
    value: 'propuesta_colaboracion',
    label: 'Propuesta de colaboración',
    description: 'Ideas para trabajar juntos'
  },
  {
    value: 'reportar_problema',
    label: 'Reportar problema',
    description: 'Bugs, errores o contenido inapropiado'
  },
  {
    value: 'sugerencia_mejora',
    label: 'Sugerencia de mejora',
    description: 'Ideas para mejorar la plataforma'
  },
  {
    value: 'solicitar_evento',
    label: 'Solicitar evento',
    description: 'Proponer o solicitar un evento'
  },
  {
    value: 'partnership',
    label: 'Partnership',
    description: 'Alianzas estratégicas y patrocinios'
  },
  {
    value: 'prensa_media',
    label: 'Prensa y medios',
    description: 'Consultas de periodistas y medios'
  },
  {
    value: 'otro',
    label: 'Otro',
    description: 'Cualquier otro tema'
  }
];

// Tipos para estadísticas (admin)
export interface ContactStats {
  total_contacts: number;
  new_contacts: number;
  pending_contacts: number;
  completed_contacts: number;
  contacts_by_reason: Record<ContactReason, number>;
  contacts_last_7_days: number;
}

// Configuración de archivos permitidos
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const FILE_TYPE_EXTENSIONS = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/zip': '.zip'
}; 