import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  FileCheck,
  ClipboardList,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Leaf,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: ClipboardList,
      title: "Project Management",
      description:
        "Track environmental assessment projects from start to finish with comprehensive lifecycle management.",
    },
    {
      icon: FileCheck,
      title: "Document Processing",
      description:
        "Upload and parse documents automatically, extracting key properties for validation.",
    },
    {
      icon: CheckCircle2,
      title: "Automated QA/QC",
      description:
        "Run customizable questionnaires to validate data consistency across documents.",
    },
    {
      icon: BarChart3,
      title: "Reporting & Analytics",
      description:
        "Generate detailed validation reports with pass/fail results and actionable insights.",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Save Time",
      description: "Automate repetitive QA/QC tasks and reduce manual review time by up to 80%.",
    },
    {
      icon: Shield,
      title: "Reduce Errors",
      description: "Catch data inconsistencies early with systematic validation checks.",
    },
    {
      icon: Leaf,
      title: "Stay Compliant",
      description: "Ensure environmental assessments meet regulatory standards consistently.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Environics</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/sign-in")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/sign-up")}>
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Environmental QA/QC Management
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            Streamline Your Environmental Site Assessment{" "}
            <span className="text-primary">Quality Control</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Automate document validation, track field events, and ensure data consistency
            across your environmental assessment projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/sign-up")} className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/sign-in")} className="text-lg px-8">
              Sign In to Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for QA/QC
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform for managing environmental site assessment quality assurance
              and quality control processes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose Environics?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Built specifically for environmental consultants and assessment teams who need
                reliable, efficient QA/QC workflows.
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">PVV Event - 12 documents validated</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">GWMS Event - All checks passed</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">Drilling Event - Report generated</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg border-2 border-primary">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">98% validation success rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Streamline Your QA/QC Process?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join environmental teams who trust Environics for their quality assurance needs.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/sign-up")}
            className="text-lg px-8"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Environics</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Environics. Environmental QA/QC Management System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
