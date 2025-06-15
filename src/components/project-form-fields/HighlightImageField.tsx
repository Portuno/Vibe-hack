
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ProjectFormValues } from "../ProjectForm";

interface Props {
  control: Control<ProjectFormValues>;
}

export default function HighlightImageField({ control }: Props) {
  return (
    <FormField
      control={control}
      name="highlight_img"
      render={({ field }) => (
        <FormItem>
          <FormLabel>URL de la Imagen Principal</FormLabel>
          <FormControl>
            <Input placeholder="https://unsplash.com/foto.jpg" {...field} />
          </FormControl>
          <FormDescription>
            Una imagen vale más que mil palabras. Pegá una URL a una imagen que represente tu proyecto.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
