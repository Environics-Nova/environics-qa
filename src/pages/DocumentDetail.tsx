import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { StatusBadge } from "../components/StatusBadge";
import { sampleDocuments } from "../data/sampleData";
import { ArrowLeft, Save, Edit, FileText, Calendar } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const DocumentDetail = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const document = sampleDocuments.find(d => d.document_id === documentId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState(
    document?.properties_values || {}
  );

  if (!document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Document Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real application, this would save to the backend
    console.log("Saving document properties:", editedValues);
    setIsEditing(false);
    toast({
      title: "Properties Saved",
      description: "Document properties have been updated successfully.",
    });
  };

  const handleCancel = () => {
    setEditedValues(document.properties_values);
    setIsEditing(false);
  };

  const handlePropertyChange = (property: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [property]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/event/${document.event.event_id}`)} 
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Event
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{document.type.name}</h1>
                <p className="text-muted-foreground mt-1">{document.file_name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Properties
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Document Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">File Name</Label>
                <p className="text-muted-foreground">{document.file_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Document Type</Label>
                <p className="text-muted-foreground">{document.type.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">File Format</Label>
                <p className="text-muted-foreground">{document.file_format}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <StatusBadge status={document.status} />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Event</Label>
                <p className="text-muted-foreground">{document.event.event_types.join(", ")}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Project</Label>
                <p className="text-muted-foreground">{document.event.project.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Properties */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Parsed Document Properties</CardTitle>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">
              Property values extracted from the document. Click edit to modify any values.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {document.type.properties.map((property) => (
                <div key={property} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border border-border rounded-lg">
                  <div>
                    <Label className="font-medium">{property}</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Required property for {document.type.name}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    {isEditing ? (
                      <Input
                        value={editedValues[property] || ""}
                        onChange={(e) => handlePropertyChange(property, e.target.value)}
                        placeholder={`Enter ${property}`}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md">
                        {editedValues[property] || (
                          <span className="text-muted-foreground italic">No value extracted</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {document.type.properties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No properties defined for this document type.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentDetail;