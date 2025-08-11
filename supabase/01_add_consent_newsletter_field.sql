-- Agregar campo consent_newsletter a la tabla hackathon_registrations
-- Este campo almacenará el consentimiento del usuario para recibir novedades y anuncios

ALTER TABLE hackathon_registrations 
ADD COLUMN consent_newsletter BOOLEAN DEFAULT FALSE;

-- Agregar comentario al campo para documentar su propósito
COMMENT ON COLUMN hackathon_registrations.consent_newsletter IS 'Consentimiento del usuario para recibir novedades y anuncios de Terreta Hub';

-- Crear índice para optimizar consultas por consentimiento
CREATE INDEX idx_hackathon_registrations_consent_newsletter 
ON hackathon_registrations(consent_newsletter);

-- Actualizar registros existentes para establecer consentimiento por defecto
-- (opcional, solo si quieres que los registros existentes tengan un valor específico)
-- UPDATE hackathon_registrations SET consent_newsletter = FALSE WHERE consent_newsletter IS NULL; 