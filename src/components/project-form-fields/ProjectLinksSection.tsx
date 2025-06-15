
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ProjectFormValues } from "../ProjectForm";

interface Props {
  control: Control<ProjectFormValues>;
}

export default function ProjectLinksSection({ control }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-negro-suave">Links del Proyecto</h3>
      <FormField
        control={control}
        name="website_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sitio Web / Landing Page</FormLabel>
            <FormControl>
              <Input placeholder="https://tuproyecto.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="demo_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Demo / Prototipo</FormLabel>
            <FormControl>
              <Input placeholder="https://figma.com/proto/..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="repo_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Repositorio (GitHub, etc.)</FormLabel>
            <FormControl>
              <Input placeholder="https://github.com/usuario/proyecto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
