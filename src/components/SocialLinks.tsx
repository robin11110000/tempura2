import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
export const SocialLinks = () => {
  const socialLinks = [{
    icon: Facebook,
    href: "#",
    label: "Facebook"
  }, {
    icon: Instagram,
    href: "#",
    label: "Instagram"
  }, {
    icon: Twitter,
    href: "#",
    label: "Twitter"
  }, {
    icon: Youtube,
    href: "#",
    label: "YouTube"
  }];
  return <div className="flex items-center justify-center gap-6 py-8">
      {socialLinks.map(social => <a key={social.label} href={social.href} aria-label={social.label} className="text-muted-foreground hover:text-primary transition-colors">
          
        </a>)}
    </div>;
};