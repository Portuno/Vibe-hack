
import Navbar from "@/components/Navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  CreateContactData, 
  CONTACT_REASON_OPTIONS, 
  ALLOWED_FILE_TYPES, 
  MAX_FILE_SIZE 
} from "@/types/contacts";
import { useState } from "react";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "El nombre es requerido." }),
  email: z.string().email({ message: "El correo electrónico no es válido." }).optional().or(z.literal("")),
  reason: z.string({ required_error: "Debes seleccionar un motivo." }).min(1, { message: "Debes seleccionar un motivo."}),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }),
  attachment: z.any().optional().refine((file: FileList | undefined) => {
    if (!file || file.length === 0) return true;
    const actualFile = file[0];
    return actualFile.size <= MAX_FILE_SIZE;
  }, {
    message: "El archivo no puede superar los 5MB.",
  }).refine((file: FileList | undefined) => {
    if (!file || file.length === 0) return true;
    const actualFile = file[0];
    return ALLOWED_FILE_TYPES.includes(actualFile.type);
  }, {
    message: "Formato de archivo no permitido. Usa PDF, PNG, JPG, DOCX o ZIP.",
  }),
  consent: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar para poder enviar tu consulta.",
  }),
});

export default function Contacto() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      reason: undefined,
      message: "",
      consent: false,
    },
  });

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('contact-attachments')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      return data.path;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      let attachmentPath = null;
      let attachmentInfo = null;

      // Subir archivo si existe
      if (values.attachment && values.attachment.length > 0) {
        const file = values.attachment[0];
        attachmentPath = await uploadFile(file);
        
        if (attachmentPath) {
          attachmentInfo = {
            attachment_url: attachmentPath,
            attachment_filename: file.name,
            attachment_size: file.size,
            attachment_mime_type: file.type,
          };
        }
      }

      // Crear el contacto en la base de datos
      const contactData = {
        full_name: values.fullName,
        email: values.email || null,
        reason: values.reason as any,
        message: values.message,
        ...attachmentInfo,
        // Metadatos opcionales
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      };

      const { error } = await supabase
        .from('contacts' as any)
        .insert([contactData]);

      if (error) {
        throw error;
      }

      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por contactarnos. Te responderemos a la brevedad.",
        className: "bg-green-100 border-green-400 text-green-800",
      });
      
      form.reset();
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6 max-w-3xl px-2">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-display text-terra-cotta mb-2">Contacto</h1>
          <p className="text-base md:text-lg text-gris-piedra">Contáctanos para dudas, propuestas o feedback.</p>
        </div>
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg border border-arena">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
              {/* Grupo: Nombre y Email */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="¿Cómo te llamás?" {...field} />
                      </FormControl>
                      <FormDescription>
                        Podés usar un seudónimo si preferís mantener el anonimato.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Correo electrónico <span className="text-gris-piedra text-sm">(opcional)</span></FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="tu@correo.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Dejanos un mail si querés que te respondamos. No será compartido.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Motivo y Adjunto en horizontal en web */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Motivo del mensaje</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          {/* Forzar fondo blanco ocultando transparencia y alto z-index y drop-shadow para evitar superposiciones */}
                          <SelectTrigger className="bg-white !bg-opacity-100 z-30 shadow border-arena">
                            <SelectValue placeholder="Seleccioná una opción..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white !bg-opacity-100 z-50 shadow-lg border-arena">
                          {CONTACT_REASON_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">{option.label}</div>
                                {option.description && (
                                  <div className="text-xs text-gris-piedra">{option.description}</div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attachment"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Adjunto (opcional)</FormLabel>
                      <FormControl>
                        <Input type="file" {...form.register('attachment')} />
                      </FormControl>
                      <FormDescription>
                        Formatos aceptados: PDF, PNG, JPG, DOCX, ZIP (máx. 5MB).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Mensaje textarea */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contanos qué tenés en mente. Cuanto más claro, mejor podemos ayudarte."
                        className="min-h-[120px] bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Consentimiento */}
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 md:p-4 bg-arena/40">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Acepto que Terreta Hub use esta información para gestionar mi consulta.
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit */}
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-terra-cotta hover:bg-terra-cotta/90 disabled:bg-gris-piedra text-white shadow-card hover:shadow-lg min-h-[44px] text-base rounded-xl"
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
// Formulario de contacto completamente funcional con integración a Supabase
