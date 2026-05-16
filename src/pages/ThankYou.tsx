import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, FileText, Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from "@/components/seo";
const ThankYou = () => {
  // Track conversion
  useEffect(() => {
    // Analytics: Track conversion event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        event_category: 'booking',
        event_label: 'consultation_booked'
      });
    }
  }, []);

  const nextSteps = [
    {
      icon: Calendar,
      title: "Check Your Email",
      description: "You'll receive a calendar invitation with meeting details and a link to join."
    },
    {
      icon: FileText,
      title: "Gather Your Documents",
      description: "Have recent statements from retirement accounts, insurance policies, and tax returns handy."
    },
    {
      icon: Phone,
      title: "Prepare Your Questions",
      description: "Write down any specific concerns or goals you'd like to discuss during our call."
    }
  ];

  return (
    <>
      <SEOHead
        title="Thank You - Consultation Booked"
        description="Your consultation has been scheduled. Learn what to expect next."
        noIndex={true}
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[hsl(var(--navy))] via-[hsl(215,40%,18%)] to-[hsl(215,45%,12%)] overflow-hidden">
        {/* Success Animation Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(228,181,72,0.3) 0%, transparent 50%)`
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 rounded-full bg-[#E4B548]/20 flex items-center justify-center mx-auto mb-8 animate-fade-in-up">
              <CheckCircle className="h-12 w-12 text-[#E4B548]" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              You're All Set!
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Your consultation has been scheduled.
            </p>
            <p className="text-lg text-white/60 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              We're excited to help you plan for a secure financial future. Here's what happens next.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Next Steps Checklist
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Here's how to prepare for your consultation to make the most of our time together.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {nextSteps.map((step, index) => (
              <Card 
                key={index}
                className="bg-white/80 backdrop-blur-sm border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#E4B548]/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-6 w-6 text-[#E4B548]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[hsl(var(--navy))] text-white text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground ml-9">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border-2 border-border hover:border-[#E4B548] hover:bg-[#E4B548]/10 transition-colors cursor-pointer" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Questions Before Your Consultation?
            </h3>
            <p className="text-muted-foreground mb-8">
              Our team is here to help. Reach out anytime.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="tel:+18883505396" 
                className="flex items-center gap-3 text-foreground hover:text-[#E4B548] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="font-medium">(888) 350-5396</span>
              </a>
              <a 
                href="mailto:info@tfainsuranceadvisors.com" 
                className="flex items-center gap-3 text-foreground hover:text-[#E4B548] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="font-medium">info@tfainsuranceadvisors.com</span>
              </a>
            </div>

            <div className="mt-12">
              <Link to="/">
                <Button variant="outline" className="rounded-full px-6">
                  Return to Homepage
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ThankYou;