import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/StatusBadge";
import { sampleEvents, getEventDocuments, getRequiredDocuments } from "../data/sampleData";
import { ArrowLeft, Edit, Calendar, Clock, Upload, Eye, FileText } from "lucide-react";
import { Document, DocumentType } from "../types";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const event = sampleEvents.find(e => e.event_id === eventId);
  const documents = eventId ? getEventDocuments(eventId) : [];
  const requiredDocuments = event ? getRequiredDocuments(event.event_types) : [];

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getDocumentForType = (docType: DocumentType): Document | null => {
    return documents.find(doc => doc.type.document_type_id === docType.document_type_id) || null;
  };

  const handleDocumentAction = (document: Document | null, docType: DocumentType) => {
    if (!document) {
      // Handle upload
      console.log("Upload document for type:", docType.name);
      return;
    }

    if (document.status === "Parsed") {
      navigate(`/document/${document.document_id}`);
    }
  };

  const getActionButton = (document: Document | null, docType: DocumentType) => {
    if (!document) {
      return (
        <Button size="sm" onClick={() => handleDocumentAction(document, docType)} className="gap-2">
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      );
    }

    switch (document.status) {
      case "Processing":
        return (
          <Button size="sm" disabled variant="outline" className="gap-2">
            <Clock className="w-4 h-4 animate-spin" />
            Processing
          </Button>
        );
      case "Parsed":
        return (
          <Button size="sm" onClick={() => handleDocumentAction(document, docType)} variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            View
          </Button>
        );
      default:
        return (
          <Button size="sm" onClick={() => handleDocumentAction(document, docType)} className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(`/project/${event.project.project_id}`)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Project
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {event.event_types.join(" + ")} Event
                </h1>
                <p className="text-muted-foreground mt-1">{event.project.name}</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Event
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Event Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Event Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Start Date & Time</p>
                  <p className="text-muted-foreground">{new Date(event.start_datetime).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">End Date & Time</p>
                  <p className="text-muted-foreground">{new Date(event.end_datetime).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Event Types</p>
                <div className="flex flex-wrap gap-2">
                  {event.event_types.map((type, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-primary text-primary-foreground"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Required Documents</CardTitle>
            <p className="text-muted-foreground">
              Documents required based on event types: {event.event_types.join(", ")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requiredDocuments.map((docType) => {
                const document = getDocumentForType(docType);
                return (
                  <div 
                    key={docType.document_type_id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{docType.name}</h3>
                          {document && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {document.file_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {document && <StatusBadge status={document.status} />}
                        {getActionButton(document, docType)}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Required Properties:</p>
                      <div className="flex flex-wrap gap-2">
                        {docType.properties.map((prop, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
                          >
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {requiredDocuments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No documents required for this event type.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetail;