-- Add demo_url to ideas and update the secure RPC to accept it

alter table public.ideas add column if not exists demo_url text;

create or replace function public.create_idea_with_password(
  p_password text,
  p_title text,
  p_categories text[],
  p_problem text,
  p_solution text,
  p_mvp_features text[],
  p_technologies text[],
  p_audience text,
  p_business_model text,
  p_image_url text,
  p_demo_url text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if p_password <> 'Robable' then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  insert into public.ideas (
    title,
    categories,
    problem,
    solution,
    mvp_features,
    technologies,
    audience,
    business_model,
    image_url,
    demo_url
  ) values (
    p_title,
    coalesce(p_categories, '{}'),
    p_problem,
    p_solution,
    coalesce(p_mvp_features, '{}'),
    coalesce(p_technologies, '{}'),
    nullif(p_audience, ''),
    nullif(p_business_model, ''),
    nullif(p_image_url, ''),
    nullif(p_demo_url, '')
  ) returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.create_idea_with_password(text, text, text[], text, text, text[], text[], text, text, text, text) from public;
grant execute on function public.create_idea_with_password(text, text, text[], text, text, text[], text[], text, text, text, text) to anon, authenticated;


