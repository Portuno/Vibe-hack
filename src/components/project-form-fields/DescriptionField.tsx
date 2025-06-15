
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { ProjectFormValues } from "../ProjectForm";

interface Props {
  control: Control<ProjectFormValues>;
}

export default function DescriptionField({ control }: Props) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descripción Corta</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Contá en pocas palabras de qué se trata tu proyecto, qué hace y para quién es."
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Este es el 'elevator pitch' de tu proyecto. (Máx 500 caracteres)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
