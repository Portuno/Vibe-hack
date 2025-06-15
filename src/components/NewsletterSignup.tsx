
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!email || !/^[\w.+\-]+@[\w\-]+\.[\w\-.]+$/.test(email)) {
      setStatus("error");
      setMessage("Por favor, ingresa un email válido.");
      return;
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      setStatus("error");
      if (error.message?.includes("duplicate key")) {
        setMessage("Este correo ya está suscrito.");
      } else {
        setMessage("Ha ocurrido un error, inténtalo de nuevo.");
      }
    } else {
      setStatus("success");
      setMessage("¡Gracias! Te has suscrito a la newsletter.");
      setEmail("");
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center mt-8 mb-2 px-2">
      <div className="w-full max-w-lg bg-white border border-arena rounded-2xl shadow-card py-8 px-6 flex flex-col items-center">
        <h3 className="font-display text-xl sm:text-2xl text-terra-cotta mb-1 font-bold text-center">
          ¿Quieres estar al día?
        </h3>
        <p className="text-mediterraneo text-center text-sm mb-4">
          Suscríbete a la newsletter de Terreta Hub y no te pierdas novedades, eventos y recursos para la comunidad.
        </p>
        <form className="flex flex-col w-full gap-3 sm:flex-row items-center" onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            className="bg-arena w-full sm:w-auto"
            required
            autoComplete="email"
            disabled={status === "loading" || status === "success"}
          />
          <Button
            type="submit"
            className="bg-terra-cotta hover:bg-terra-cotta/90 text-white"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? "Enviando..." : "Suscribirse"}
          </Button>
        </form>
        {message && (
          <div
            className={
              "mt-2 text-sm " +
              (status === "success"
                ? "text-emerald-600 font-semibold"
                : status === "error"
                ? "text-red-600 font-semibold"
                : "text-mediterraneo")
            }
          >
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
