
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ProjectFormValues } from "../ProjectForm";

interface Props {
  control: Control<ProjectFormValues>;
}

export default function ProblemField({ control }: Props) {
  return (
    <FormField
      control={control}
      name="problem"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Problema que Resuelve</FormLabel>
          <FormControl>
            <Input placeholder="Ej: Falta de conexión entre profesionales creativos en Valencia." {...field} />
          </FormControl>
          <FormDescription>
            ¿Qué necesidad o problema específico aborda tu iniciativa? (Máx 280 caracteres)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
