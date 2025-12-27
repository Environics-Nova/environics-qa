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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Question, Questionnaire, RelationType, DocumentType } from "@/types";

const formSchema = z.object({
  document1Id: z.string().min(1, "Document 1 is required"),
  property1: z.string().min(1, "Property 1 is required"),
  relation: z.enum(["Equals", "Not Equals", "Contains", ">", "<"] as const),
  secondPartType: z.enum(["document", "value"] as const),
  document2Id: z.string().optional(),
  property2: z.string().optional(),
  comparisonValue: z.string().optional(),
}).refine(
  (data) => {
    if (data.secondPartType === "document") {
      return data.document2Id && data.property2;
    } else {
      return data.comparisonValue;
    }
  },
  {
    message: "Either document 2 + property 2 OR comparison value is required",
    path: ["secondPartType"],
  }
);

interface EditQuestionDialogProps {
  question: Question | null;
  questionnaire: Questionnaire;
  documentTypes: DocumentType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (question: Question) => void;
}

export function EditQuestionDialog({
  question,
  questionnaire,
  documentTypes,
  open,
  onOpenChange,
  onSave,
}: EditQuestionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document1Id: "",
      property1: "",
      relation: "Equals",
      secondPartType: "value",
      document2Id: "",
      property2: "",
      comparisonValue: "",
    },
  });

  // Reset form when question changes
  useEffect(() => {
    if (open) {
      form.reset({
        document1Id: question?.document_1_id || question?.document_1?.id || "",
        property1: question?.property_1 || "",
        relation: question?.relation || "Equals",
        secondPartType: question?.document_2_id || question?.document_2 ? "document" : "value",
        document2Id: question?.document_2_id || question?.document_2?.id || "",
        property2: question?.property_2 || "",
        comparisonValue: question?.comparison_value || "",
      });
    }
  }, [question, open, form]);

  const secondPartType = form.watch("secondPartType");
  const document1Id = form.watch("document1Id");
  const document2Id = form.watch("document2Id");

  const selectedDocument1 = documentTypes.find(doc => doc.id === document1Id);
  const selectedDocument2 = documentTypes.find(doc => doc.id === document2Id);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const doc1 = documentTypes.find(d => d.id === values.document1Id);
    if (!doc1) {
      setIsLoading(false);
      return;
    }

    const updatedQuestion: Question = {
      id: question?.id || `q-${Date.now()}`,
      questionnaire_id: questionnaire.id,
      document_1_id: values.document1Id,
      property_1: values.property1,
      relation: values.relation as RelationType,
      document_2_id: values.secondPartType === "document" ? values.document2Id : undefined,
      property_2: values.secondPartType === "document" ? values.property2 : undefined,
      comparison_value: values.secondPartType === "value" ? values.comparisonValue : undefined,
      system_value: question?.system_value || "",
      document_1: doc1,
      document_2: values.secondPartType === "document" 
        ? documentTypes.find(d => d.id === values.document2Id) 
        : undefined,
    };

    onSave(updatedQuestion);
    onOpenChange(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{question ? "Edit Question" : "Add New Question"}</DialogTitle>
          <DialogDescription>
            Configure the question by selecting documents, properties, and comparison criteria.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="document1Id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document 1</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTypes.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.name}
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
                name="property1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property 1</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedDocument1?.properties.map((prop) => (
                          <SelectItem key={prop} value={prop}>
                            {prop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}  
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Equals">Equals</SelectItem>
                      <SelectItem value="Not Equals">Not Equals</SelectItem>
                      <SelectItem value="Contains">Contains</SelectItem>
                      <SelectItem value=">">Greater Than (&gt;)</SelectItem>
                      <SelectItem value="<">Less Than (&lt;)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondPartType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Second Part Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="document" id="document" />
                        <label htmlFor="document">Document & Property</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="value" id="value" />
                        <label htmlFor="value">Fixed Value</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {secondPartType === "document" ? (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="document2Id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document 2</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypes.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id}>
                              {doc.name}
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
                  name="property2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property 2</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedDocument2?.properties.map((prop) => (
                            <SelectItem key={prop} value={prop}>
                              {prop}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="comparisonValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comparison Value</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter comparison value" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : question ? "Save Changes" : "Add Question"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
