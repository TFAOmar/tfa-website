import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Wallet, Clock, BarChart3, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TFACompoundGrowthCalculator from "@/components/tools/TFACompoundGrowthCalculator";
import { SEOHead, JsonLd } from "@/components/seo";
import { generateWebPageSchema, generateWebApplicationSchema, generateBreadcrumbSchema } from "@/lib/seo/schemas";
import { siteConfig } from "@/lib/seo/siteConfig";

const CompoundGrowthCalculator = () => {
  return (
    <>
      <SEOHead
        title="Compound Growth Calculator"
        description="Calculate how your investments grow over time with compound interest. See the power of consistent saving and compounding on your long-term wealth."
        canonical={`${siteConfig.url}/tools/compound-growth-calculator`}
        keywords="compound growth calculator, compound interest calculator, investment growth estimator, savings calculator, compound interest"
      />
      <JsonLd data={[
        generateWebPageSchema(
          "Compound Growth Calculator | The Financial Architects",
          "Calculate how your investments grow over time with compound interest. See the power of consistent saving and compounding on your long-term wealth.",
          `${siteConfig.url}/tools/compound-growth-calculator`
        ),
        generateWebApplicationSchema(
          "Compound Growth Calculator",
          "Calculate how your investments grow over time with compound interest. See the power of consistent saving and compounding on your long-term wealth.",
          `${siteConfig.url}/tools/compound-growth-calculator`
        ),
        generateBreadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Compound Growth Calculator", url: `${siteConfig.url}/tools/compound-growth-calculator` }
        ])
      ]} />
      <div className="min-h-screen bg-gradient-to-b from-navy via-navy to-primary">
        {/* Hero Section */}
        <section className="relative pt-8 pb-2 md:pt-12 md:pb-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-5 min-h-11"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Tools</span>
            </Link>

            <div className="max-w-3xl animate-fade-in">
              <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
                Financial Planning Tool
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Compound Growth Calculator
              </h1>
              <p className="text-base md:text-lg text-white/85 leading-relaxed">
                Change the numbers below and watch how steady saving can grow over time.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-6 md:py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <TFACompoundGrowthCalculator />
          </div>
        </section>

        {/* Educational Content */}
        <section className="py-16 md:py-24 bg-navy/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-in">
                <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">
                  Understanding Your Options
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  The Power of Compound Growth
                </h2>
                <p className="text-white/70">
                  Compound growth is often called "the eighth wonder of the world" for good reason.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-calc-surface border border-calc-line rounded-2xl p-6 animate-fade-in">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    What is Compounding?
                  </h3>
                  <p className="text-sm text-calc-muted">
                    Compounding occurs when your investment earnings are reinvested to generate their 
                    own earnings. Over time, this creates exponential growth rather than linear growth.
                  </p>
                </div>

                <div className="bg-calc-surface border border-calc-line rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Why Start Early?
                  </h3>
                  <p className="text-sm text-calc-muted">
                    The earlier you start, the more time your money has to compound. Even small, 
                    consistent contributions can grow significantly over decades.
                  </p>
                </div>

                <div className="bg-calc-surface border border-calc-line rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <Wallet className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    The Power of Consistency
                  </h3>
                  <p className="text-sm text-calc-muted">
                    Regular monthly contributions, combined with compound growth, can turn modest 
                    savings into substantial wealth over time.
                  </p>
                </div>

                <div className="bg-calc-surface border border-calc-line rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Important Considerations
                  </h3>
                  <p className="text-sm text-calc-muted">
                    This calculator doesn't account for taxes, fees, or inflation. Real-world returns 
                    will vary. Talk to an advisor for personalized guidance.
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 animate-fade-in">
                <div className="flex gap-4">
                  <AlertCircle className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-2">Important Disclosures</h4>
                    <p className="text-sm text-calc-muted leading-relaxed">
                      This calculator provides estimates for educational purposes only. Actual investment 
                      returns will vary based on market conditions, fees, and other factors. Past performance 
                      does not guarantee future results. Consult with a licensed financial professional 
                      before making any investment decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Start Building Your Future?
              </h2>
              <p className="text-white/70 mb-8">
                Our advisors can help you create a personalized investment strategy that takes 
                advantage of compound growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/book-consultation">
                  <Button className="btn-primary-cta px-8 py-6 text-lg">
                    Book a Consultation
                  </Button>
                </Link>
                <Link to="/services/investment-management">
                  <Button variant="outline" className="bg-white/5 border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                    Learn About Investing
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

export default CompoundGrowthCalculator;