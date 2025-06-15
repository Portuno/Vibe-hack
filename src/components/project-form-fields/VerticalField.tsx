
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ProjectFormValues } from "../ProjectForm";

interface Props {
  control: Control<ProjectFormValues>;
}

export default function VerticalField({ control }: Props) {
  return (
    <FormField
      control={control}
      name="vertical"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Vertical / Sector</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccioná el sector principal de tu proyecto" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-crema">
              <SelectItem value="Tecnología">Tecnología</SelectItem>
              <SelectItem value="Arte">Arte</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
              <SelectItem value="Educación">Educación</SelectItem>
              <SelectItem value="Ciencia">Ciencia</SelectItem>
              <SelectItem value="Social">Social</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Ayuda a clasificar tu proyecto y a que otros lo encuentren.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
