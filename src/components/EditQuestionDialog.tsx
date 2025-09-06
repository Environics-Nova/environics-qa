import { useState } from "react";
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
import { Question, Questionnaire, RelationType } from "@/types";
import { getRequiredDocuments } from "@/data/sampleData";

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (question: Question) => void;
}

export function EditQuestionDialog({
  question,
  questionnaire,
  open,
  onOpenChange,
  onSave,
}: EditQuestionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  // Filter documents based on questionnaire event type
  const availableDocuments = questionnaire?.event_type 
    ? getRequiredDocuments([questionnaire.event_type])
    : getRequiredDocuments(["Drilling", "GWMS", "SV_Sampling", "Survey"]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document1Id: question?.document_1.document_type_id || "",
      property1: question?.property_1 || "",
      relation: question?.relation || "Equals",
      secondPartType: question?.document_2 ? "document" : "value",
      document2Id: question?.document_2?.document_type_id || "",
      property2: question?.property_2 || "",
      comparisonValue: question?.comparison_value || "",
    },
  });

  const secondPartType = form.watch("secondPartType");

  const selectedDocument1 = availableDocuments.find(
    doc => doc.document_type_id === form.watch("document1Id")
  );

  const selectedDocument2 = availableDocuments.find(
    doc => doc.document_type_id === form.watch("document2Id")
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const doc1 = availableDocuments.find(d => d.document_type_id === values.document1Id);
    if (!doc1) return;

    let doc2 = undefined;
    if (values.secondPartType === "document" && values.document2Id) {
      doc2 = availableDocuments.find(d => d.document_type_id === values.document2Id);
      if (!doc2) return;
    }

    const updatedQuestion: Question = {
      question_id: question?.question_id || `q-${Date.now()}`,
      document_1: doc1,
      property_1: values.property1,
      relation: values.relation as RelationType,
      ...(values.secondPartType === "document" 
        ? { document_2: doc2, property_2: values.property2 }
        : { comparison_value: values.comparisonValue }
      ),
      system_value: question?.system_value || "",
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDocuments.map((doc) => (
                          <SelectItem key={doc.document_type_id} value={doc.document_type_id}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      defaultValue={field.value}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableDocuments.map((doc) => (
                            <SelectItem key={doc.document_type_id} value={doc.document_type_id}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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