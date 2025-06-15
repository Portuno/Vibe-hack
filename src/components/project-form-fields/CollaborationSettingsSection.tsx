
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { ProjectFormValues } from "../ProjectForm";

interface Props {
  control: Control<ProjectFormValues>;
}

export default function CollaborationSettingsSection({ control }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-negro-suave">Ajustes de Colaboración</h3>
      <FormField
        control={control}
        name="open_to_feedback"
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
                Abierto a recibir feedback
              </FormLabel>
              <FormDescription>
                Marcá esta opción si te gustaría que otros miembros te den su opinión.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="wants_to_monetize"
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
                Buscando monetizar
              </FormLabel>
              <FormDescription>
                ¿Estás explorando formas de generar ingresos con este proyecto?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
