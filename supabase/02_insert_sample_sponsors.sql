-- Insertar sponsors de ejemplo para la página de sponsors
-- Estos datos coinciden con el diseño mostrado en la imagen

-- Limpiar datos existentes (opcional - comentar si quieres mantener los datos existentes)
-- DELETE FROM sponsors;

-- Sponsor Principal
INSERT INTO sponsors (name, description, logo_url, website_url, tier) VALUES
(
    'TechCorp',
    'Empresa líder en desarrollo de software y soluciones tecnológicas innovadoras para empresas de todos los tamaños.',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop&crop=center',
    'https://techcorp.com',
    'principal'
);

-- Co-Sponsors
INSERT INTO sponsors (name, description, logo_url, website_url, tier) VALUES
(
    'InnovateLab',
    'Laboratorio de innovación especializado en inteligencia artificial y machine learning para aplicaciones empresariales.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop&crop=center',
    'https://innovatelab.com',
    'co-sponsor'
),
(
    'DataFlow Systems',
    'Sistemas de flujo de datos en tiempo real para análisis de big data y business intelligence.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&crop=center',
    'https://dataflowsystems.com',
    'co-sponsor'
),
(
    'CloudNine',
    'Plataforma de computación en la nube escalable y segura para aplicaciones empresariales críticas.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop&crop=center',
    'https://cloudnine.com',
    'co-sponsor'
);

-- Comentarios:
-- 
-- Este archivo inserta sponsors de ejemplo que coinciden exactamente con el diseño
-- mostrado en la página de sponsors. Los datos incluyen:
--
-- 1. TechCorp como Sponsor Principal
-- 2. InnovateLab, DataFlow Systems y CloudNine como Co-Sponsors
--
-- Para ejecutar este archivo:
-- 1. Asegúrate de que la tabla sponsors esté creada
-- 2. Ejecuta este archivo en tu base de datos de Supabase
-- 3. Los sponsors aparecerán automáticamente en la página
--
-- Si quieres personalizar los sponsors:
-- - Modifica los nombres, descripciones y URLs
-- - Cambia las imágenes de logo_url por URLs de tus propios logos
-- - Ajusta los tiers según necesites
