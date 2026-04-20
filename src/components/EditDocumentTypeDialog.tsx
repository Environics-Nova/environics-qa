import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DocumentType, PropertyDef } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

interface EditDocumentTypeDialogProps {
  documentType: DocumentType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, properties: PropertyDef[]) => Promise<void>;
}

export function EditDocumentTypeDialog({ documentType, open, onOpenChange, onSave }: EditDocumentTypeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyDef[]>([]);
  const [newPropName, setNewPropName] = useState("");
  const [newPropType, setNewPropType] = useState("string");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (documentType && open) {
      form.reset({ name: documentType.name });
      setProperties(documentType.properties || []);
    }
  }, [documentType, open, form]);

  const onSubmit = async () => {
    if (properties.length === 0) {
      form.setError("root", { type: "custom", message: "At least one property field is required" });
      return;
    }

    if (!documentType?.id) return;

    setIsLoading(true);
    try {
      await onSave(documentType.id, properties);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProperty = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newPropName.trim()) return;
    if (properties.some(p => p.name === newPropName.trim())) return; // Avoid duplicates
    setProperties([...properties, { name: newPropName.trim(), type: newPropType }]);
    setNewPropName("");
    setNewPropType("string");
  };

  const handleRemoveProperty = (propName: string) => {
    setProperties(properties.filter((p) => p.name !== propName));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isLoading) { onOpenChange(v); if (!v) { setNewPropName(""); setNewPropType("string"); } } }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Edit Document Type Fields</DialogTitle>
          <DialogDescription>
            Manage fields for {documentType?.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={true} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">Names are fixed and cannot be changed.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Predefined Fields (Properties)</FormLabel>
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Input
                    value={newPropName}
                    onChange={(e) => setNewPropName(e.target.value)}
                    placeholder="e.g. Sample ID"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddProperty(e as unknown as React.MouseEvent);
                      }
                    }}
                  />
                </div>
                <div className="w-[120px] space-y-1">
                  <Select value={newPropType} onValueChange={setNewPropType} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" onClick={handleAddProperty} disabled={isLoading || !newPropName.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {properties.map((prop) => (
                  <div key={prop.name} className="flex items-center justify-between bg-secondary/50 border border-border px-3 py-2 rounded-md text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{prop.name}</span>
                      <span className="text-muted-foreground text-xs uppercase tracking-wider">{prop.type}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveProperty(prop.name)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => { onOpenChange(false); setNewPropName(""); setNewPropType("string") }} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
