import { Mail, Phone } from "lucide-react";
import { CONTENT } from "../content";

export default function Footer() {
  const { name } = CONTENT.brand;
  const { descriptor, serviceAreas } = CONTENT.footer;
  const year = new Date().getFullYear();

  // Mock contact info (in a real app this might also come from content.ts or env)
  const contactInfo = {
    phone: "(801) 555-0123",
    email: "secure@axis.care",
    contactLink: "#"
  };

  return (
    <footer className="bg-surface-dark border-t border-surface-border pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <h4 className="text-xl font-bold text-white mb-4 tracking-tight">{name}</h4>
            <p className="text-text-muted max-w-sm mb-6">
              {descriptor}
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Serving: {serviceAreas}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">REGION</h4>
            <ul className="space-y-2 text-sm text-text-muted font-mono">
              <li>Bountiful, UT</li>
              <li>Davis County</li>
              <li>Salt Lake Metro North</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">CONTACT</h4>
            <ul className="space-y-2 text-sm text-text-muted font-mono">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                {contactInfo.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                {contactInfo.email}
              </li>
            </ul>
            <a className="inline-block mt-4 text-xs font-bold text-primary border-b border-primary pb-0.5 hover:text-white hover:border-white transition-all" href={contactInfo.contactLink}>
              INITIATE CONTACT &rarr;
            </a>
          </div>
        </div>

        <div className="border-t border-surface-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted/40 font-mono">
          <p>&copy; {year} {name}. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">PRIVACY PROTOCOL</a>
            <a href="#" className="hover:text-white transition-colors">TERMS OF ENGAGEMENT</a>
            <a href="/command-center" className="ml-4 rounded bg-white/5 px-2 py-1 text-[10px] font-bold text-text-muted transition-colors hover:bg-primary hover:text-black" title="Admin Command Center">CMD</a>
          </div>
        </div>
      </div>
    </footer >
  );
}