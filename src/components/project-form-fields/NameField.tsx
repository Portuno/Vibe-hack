
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ProjectFormValues } from "../ProjectForm";

interface Props {
  control: Control<ProjectFormValues>;
}

export default function NameField({ control }: Props) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre del Proyecto</FormLabel>
          <FormControl>
            <Input placeholder="Ej: Terreta Hub" {...field} />
          </FormControl>
          <FormDescription>
            El nombre que identificará tu proyecto en la comunidad.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
