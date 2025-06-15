"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"

const eventFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción es muy corta.").max(2000, "La descripción es muy larga."),
  start_date: z.date({
    required_error: "La fecha de inicio es requerida.",
  }),
  event_type: z.enum(["Presencial", "Online", "Hibrido"], { required_error: "La modalidad es requerida."}),
  location: z.string().optional(),
  city: z.string().optional(),
  url: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  category: z.string({ required_error: "La categoría es requerida." }),
  cost_type: z.enum(["Gratuito", "Pago"]),
  price: z.coerce.number().optional(),
  purchase_url: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  highlight_img: z.any().optional(),
  consent: z.boolean().default(false).refine(val => val === true, "Debes aceptar para poder crear el evento."),
})
.refine(data => {
    if (data.event_type === "Presencial" || data.event_type === "Hibrido") {
        return !!data.location && !!data.city;
    }
    return true;
}, { message: "La dirección y ciudad son requeridas para eventos presenciales o híbridos.", path: ["location"]})
.refine(data => {
    if (data.cost_type === "Pago") {
        return data.price !== undefined && data.price > 0 && !!data.purchase_url;
    }
    return true;
}, { message: "El precio y el link de compra son requeridos para eventos de pago.", path: ["price"]});


type EventFormValues = z.infer<typeof eventFormSchema>

export function EventForm() {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
        name: "",
        description: "",
        event_type: "Presencial",
        cost_type: "Gratuito",
        consent: false,
    },
    mode: "onChange",
  })
  
  const watchEventType = form.watch("event_type");
  const watchCostType = form.watch("cost_type");

  async function onSubmit(data: EventFormValues) {
    if (!session) {
        toast({ title: "Error", description: "Debes iniciar sesión para crear un evento.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    
    let highlightImgUrl = null;
    if (data.highlight_img && data.highlight_img.length > 0) {
      const file = data.highlight_img[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images') // Using project-images, ideally should be 'event-images'
        .upload(fileName, file);

      if (uploadError) {
        toast({ title: "Error al subir la imagen", description: uploadError.message, variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      
      const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(uploadData.path);
      highlightImgUrl = urlData.publicUrl;
    }

    const { consent, ...restOfData } = data;

    const eventData = {
        ...restOfData,
        creator_id: session.user.id,
        start_date: data.start_date.toISOString(),
        highlight_img: highlightImgUrl,
        status: 'publicado',
    };
    
    const { error } = await supabase.from("events").insert(eventData as any);

    if (error) {
        toast({ title: "Error al crear el evento", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "¡Evento creado!", description: "Tu evento ha sido publicado exitosamente." });
        navigate("/eventos");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-arena">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>📛 Nombre del Evento</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Taller de React para Principiantes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>📝 Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detallá de qué se trata el evento, a quién va dirigido..."
                    className="resize-y min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>📅 Fecha de inicio</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Elegí una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-crema" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>🎯 Categoría / Vertical</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Seleccioná una categoría" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-crema">
                        <SelectItem value="Tecnología">Tecnología</SelectItem>
                        <SelectItem value="Arte">Arte</SelectItem>
                        <SelectItem value="Finanzas">Finanzas</SelectItem>
                        <SelectItem value="Derecho">Derecho</SelectItem>
                        <SelectItem value="Salud">Salud</SelectItem>
                        <SelectItem value="Comunidad">Comunidad</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="event_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>📍 Modalidad</FormLabel>
                <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                    >
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Presencial" /></FormControl><FormLabel className="font-normal">Presencial</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Online" /></FormControl><FormLabel className="font-normal">Online</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Hibrido" /></FormControl><FormLabel className="font-normal">Híbrido</FormLabel></FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(watchEventType === "Presencial" || watchEventType === "Hibrido") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>🗺️ Ubicación</FormLabel><FormControl><Input placeholder="Ej: Av. Blasco Ibáñez 138" {...field} /></FormControl><FormMessage /></FormItem>)}/><FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input placeholder="Ej: Valencia" {...field} /></FormControl><FormMessage /></FormItem>)}/></div>
          )}

          <FormField control={form.control} name="url" render={({ field }) => (<FormItem><FormLabel>🌐 Link al evento (si es online o requiere inscripción)</FormLabel><FormControl><Input placeholder="https://zoom.us/..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
          
          <FormField control={form.control} name="cost_type" render={({ field }) => (<FormItem><FormLabel>💸 Costo</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Gratuito" /></FormControl><FormLabel className="font-normal">Gratuito</FormLabel></FormItem><FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Pago" /></FormControl><FormLabel className="font-normal">Pago</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)}/>
          
          {watchCostType === "Pago" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Precio (€)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="25.00" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>)}/><FormField control={form.control} name="purchase_url" render={({ field }) => (<FormItem><FormLabel>Link de compra</FormLabel><FormControl><Input placeholder="https://eventbrite.com/..." {...field} /></FormControl><FormMessage /></FormItem>)}/></div>
          )}

          <FormField control={form.control} name="highlight_img" render={({ field: { onChange, ...rest }}) => (<FormItem><FormLabel>🖼️ Imagen destacada</FormLabel><FormControl><Input type="file" accept=".jpg, .jpeg, .png, .webp" onChange={(e) => onChange(e.target.files)} {...rest} /></FormControl><FormDescription>Flyer o visual del evento. Recomendado: 1200x630px. Máx 5MB.</FormDescription><FormMessage /></FormItem>)}/>
          
          <FormField control={form.control} name="consent" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl><div className="space-y-1 leading-none"><FormLabel>Acepto que Terreta Hub use esta información para gestionar y mostrar mi evento públicamente.</FormLabel></div><FormMessage /></FormItem>)}/>
          
          <Button type="submit" className="w-full bg-terra-cotta hover:bg-terra-cotta/90 text-white shadow-card hover:shadow-lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Publicando evento..." : "Publicar Evento"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
