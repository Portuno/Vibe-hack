
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

const formSchema = z.object({
  fullName: z.string().min(1, { message: "El nombre es requerido." }),
  email: z.string().email({ message: "El correo electrónico no es válido." }),
  reason: z.string({ required_error: "Debes seleccionar un motivo." }).min(1, { message: "Debes seleccionar un motivo."}),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }),
  attachment: z.any().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar para poder enviar tu consulta.",
  }),
});

const reasons = [
  "Consulta general",
  "Sugerencia o feedback",
  "Problema técnico / bug",
  "Incidencia con un usuario",
  "Denuncia de contenido",
  "Propuesta de colaboración",
  "Prensa / medios",
  "Otro motivo",
];

export default function Contacto() {
  const { toast } = useToast();
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Formulario de contacto enviado:", values);
    toast({
      title: "¡Mensaje enviado!",
      description: "Gracias por contactarnos. Te responderemos a la brevedad.",
      className: "bg-green-100 border-green-400 text-green-800",
    });
    form.reset();
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-10 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-terra-cotta mb-2">Contacto</h1>
          <p className="text-lg text-gris-piedra">Contáctanos para dudas, propuestas o feedback.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-arena">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
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
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo del mensaje</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccioná una opción..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reasons.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
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
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contanos qué tenés en mente. Cuanto más claro, mejor podemos ayudarte."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <FormItem>
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
               <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
              <Button type="submit" className="w-full bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg">
                Enviar mensaje
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

