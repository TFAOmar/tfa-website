import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead, JsonLd } from "@/components/seo";
import { siteConfig } from "@/lib/seo/siteConfig";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";
import { partnerCategories } from "@/components/preferred-partners/partnerCategories";
import { partnerPhoto, usePreferredPartner } from "@/hooks/usePreferredPartners";

const PreferredPartnerProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: partner, isLoading } = usePreferredPartner(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-bold text-foreground">Partner not found</h1>
        <p className="text-muted-foreground">
          This profile may have been removed or is not published yet.
        </p>
        <Button asChild>
          <Link to="/preferred-partners">Back to Preferred Partners</Link>
        </Button>
      </div>
    );
  }

  const category = partnerCategories.find((c) => c.id === partner.category);
  const photo = partnerPhoto(partner);
  const location = [partner.city, partner.state].filter(Boolean).join(", ");
  const url = `${siteConfig.url}/preferred-partners/${partner.slug}`;
  const headline = [partner.title, partner.company].filter(Boolean).join(" • ");

  return (
    <>
      <SEOHead
        title={`${partner.name}${partner.title ? ` — ${partner.title}` : ""}`}
        description={
          partner.bio?.slice(0, 155) ||
          `${partner.name} is a preferred partner of The Financial Architects${location ? ` in ${location}` : ""}.`
        }
        canonical={url}
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: partner.name,
            jobTitle: partner.title || undefined,
            description: partner.bio || undefined,
            telephone: partner.phone || undefined,
            email: partner.email || undefined,
            url,
            image: photo || undefined,
            worksFor: partner.company ? { "@type": "Organization", name: partner.company } : undefined,
            address: location
              ? { "@type": "PostalAddress", addressLocality: partner.city, addressRegion: partner.state }
              : undefined,
          },
          generateBreadcrumbSchema([
            { name: "Home", url: siteConfig.url },
            { name: "Preferred Partners", url: `${siteConfig.url}/preferred-partners` },
            { name: partner.name, url },
          ]),
        ]}
      />

      <div className="min-h-screen">
        <section className="py-16 bg-gradient-to-b from-navy to-navy/95">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/preferred-partners"
              className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground text-sm mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Preferred Partners
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-8 items-start">
              <div className="rounded-xl overflow-hidden bg-secondary/30 aspect-[4/5] max-w-[280px]">
                {photo ? (
                  <img
                    src={photo}
                    alt={`${partner.name}, ${partner.title || "preferred partner"}`}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-muted-foreground">
                    {partner.name.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-4">
                    <category.icon className="h-3.5 w-3.5" />
                    {category.name}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
                  {partner.name}
                </h1>
                {headline && (
                  <p className="text-lg text-primary-foreground/90 mb-2">{headline}</p>
                )}
                {location && (
                  <p className="text-primary-foreground/70 inline-flex items-center gap-1.5 mb-6">
                    <MapPin className="h-4 w-4 text-accent" />
                    {location}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  {partner.phone && (
                    <Button asChild>
                      <a href={`tel:${partner.phone.replace(/[^\d+]/g, "")}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {partner.phone}
                      </a>
                    </Button>
                  )}
                  {partner.email && (
                    <Button
                      asChild
                      variant="outline"
                      className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground hover:text-navy"
                    >
                      <a href={`mailto:${partner.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </a>
                    </Button>
                  )}
                  {partner.website_url && (
                    <Button
                      asChild
                      variant="outline"
                      className="bg-transparent text-primary-foreground border-primary-foreground/40 hover:bg-primary-foreground hover:text-navy"
                    >
                      <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {partner.bio && (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-4">About {partner.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-10 whitespace-pre-line">
                  {partner.bio}
                </p>
              </>
            )}

            {partner.specialties.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-4">Areas of Focus</h2>
                <div className="flex flex-wrap gap-2 mb-10">
                  {partner.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-full border border-border/60 bg-secondary/30 text-sm text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}

            <div className="glass rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Want to join our partner network?
              </h2>
              <p className="text-muted-foreground mb-6">
                We work with lenders, realtors, tax professionals, CPAs, and brokers who share our
                standard of care.
              </p>
              <Button asChild size="lg">
                <Link to="/preferred-partners#partner-application">Become a Partner</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PreferredPartnerProfile;
