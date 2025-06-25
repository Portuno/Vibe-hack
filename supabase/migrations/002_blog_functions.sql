-- Migración 002: Crear funciones RPC para blogs
-- Esta migración añade las funciones auxiliares para el sistema de blogs

-- Función RPC para incrementar las vistas de un blog de forma segura
CREATE OR REPLACE FUNCTION increment_blog_views(blog_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blogs 
    SET views_count = views_count + 1 
    WHERE id = blog_id AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para buscar blogs por contenido (búsqueda de texto completo)
CREATE OR REPLACE FUNCTION search_blogs(search_term TEXT)
RETURNS SETOF public.blogs AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.blogs
    WHERE status = 'published'
    AND (
        title ILIKE '%' || search_term || '%' OR
        excerpt ILIKE '%' || search_term || '%' OR
        content ILIKE '%' || search_term || '%' OR
        EXISTS (
            SELECT 1 FROM unnest(tags) AS tag 
            WHERE tag ILIKE '%' || search_term || '%'
        )
    )
    ORDER BY 
        CASE 
            WHEN title ILIKE '%' || search_term || '%' THEN 1
            WHEN excerpt ILIKE '%' || search_term || '%' THEN 2
            WHEN EXISTS (SELECT 1 FROM unnest(tags) AS tag WHERE tag ILIKE '%' || search_term || '%') THEN 3
            ELSE 4
        END,
        published_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener blogs relacionados por tags
CREATE OR REPLACE FUNCTION get_related_blogs(blog_id UUID, limit_count INTEGER DEFAULT 3)
RETURNS SETOF public.blogs AS $$
DECLARE
    blog_tags TEXT[];
BEGIN
    -- Obtener los tags del blog actual
    SELECT tags INTO blog_tags FROM public.blogs WHERE id = blog_id;
    
    -- Si no hay tags, devolver blogs recientes
    IF blog_tags IS NULL OR array_length(blog_tags, 1) IS NULL THEN
        RETURN QUERY
        SELECT * FROM public.blogs
        WHERE status = 'published' AND id != blog_id
        ORDER BY published_at DESC NULLS LAST
        LIMIT limit_count;
        RETURN;
    END IF;
    
    -- Buscar blogs con tags en común
    RETURN QUERY
    SELECT * FROM public.blogs
    WHERE status = 'published' 
    AND id != blog_id
    AND tags && blog_tags  -- Operador de intersección de arrays
    ORDER BY 
        -- Ordenar por número de tags en común (descendente)
        (SELECT COUNT(*) FROM unnest(tags) AS tag WHERE tag = ANY(blog_tags)) DESC,
        published_at DESC NULLS LAST
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de un autor
CREATE OR REPLACE FUNCTION get_author_blog_stats(author_user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_blogs', COUNT(*),
        'published_blogs', COUNT(*) FILTER (WHERE status = 'published'),
        'draft_blogs', COUNT(*) FILTER (WHERE status = 'draft'),
        'total_views', COALESCE(SUM(views_count), 0),
        'avg_read_time', COALESCE(AVG(read_time), 0)
    )
    INTO result
    FROM public.blogs
    WHERE author_id = author_user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener los tags más populares
CREATE OR REPLACE FUNCTION get_popular_tags(limit_count INTEGER DEFAULT 20)
RETURNS TABLE(tag TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        unnest_tags.tag,
        COUNT(*) as count
    FROM (
        SELECT unnest(tags) as tag
        FROM public.blogs
        WHERE status = 'published' AND tags IS NOT NULL
    ) unnest_tags
    GROUP BY unnest_tags.tag
    ORDER BY count DESC, unnest_tags.tag ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar published_at cuando se cambia a published
CREATE OR REPLACE FUNCTION set_published_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se está cambiando de cualquier estado a 'published'
    IF OLD.status != 'published' AND NEW.status = 'published' THEN
        NEW.published_at = NOW();
    -- Si se está cambiando de 'published' a otro estado
    ELSIF OLD.status = 'published' AND NEW.status != 'published' THEN
        NEW.published_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS set_published_date_trigger ON public.blogs;
CREATE TRIGGER set_published_date_trigger
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION set_published_date();

-- Grants para las funciones RPC (permitir que usuarios autenticados las ejecuten)
GRANT EXECUTE ON FUNCTION increment_blog_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION search_blogs(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION search_blogs(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_related_blogs(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_related_blogs(UUID, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_author_blog_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_tags(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_tags(INTEGER) TO anon; 