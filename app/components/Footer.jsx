
import React from "react";

const footerLinks = [
  { name: "About", href: "/about" },
  { name: "Help Center", href: "/help" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Ads info", href: "/ads-info" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Community Guidelines", href: "/guidelines" },
  { name: "Accessibility Help", href: "/accessibility" },
  { name: "Blog", href: "/blog" },
  { name: "Advertising", href: "/advertising" },
  { name: "Brand Resources", href: "/brands" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-4 mt-8 bg-custom-background">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-custom-secondary-text">
        {footerLinks.map((link, index) => (
          <React.Fragment key={link.name}>
            <a 
              href={link.href}
              className="hover:underline"
            >
              {link.name}
            </a>
          </React.Fragment>
        ))}
        <span>©{currentYear} App name</span>
      </div>
    </footer>
  );
};

export default Footer;
