import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Profile } from "@/types";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error, status } = await supabase
        .from("professional_profiles")
        .select(`*`)
        .eq("user_id", userId)
        .single();

      if (error && status !== 406) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);
  
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Nuevo: onboardingRequired si el perfil no está completo
  const onboardingRequired = !!(session && (!profile || !profile.display_name || !profile.headline || !profile.skills || !profile.bio));

  return { session, profile, loading, signOut, onboardingRequired };
};
