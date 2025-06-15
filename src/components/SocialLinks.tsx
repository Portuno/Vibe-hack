
import { Github, Globe, Linkedin, Twitter } from "lucide-react";
import React from "react";

const SocialIcon = ({ name, url }: { name: string, url: string }) => {
  const icons: { [key: string]: React.ReactNode } = {
    github: <Github className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    website: <Globe className="h-5 w-5" />,
    personal: <Globe className="h-5 w-5" />,
  };

  const iconKey = Object.keys(icons).find(key => name.toLowerCase().includes(key));

  if (!iconKey) return null;
  const icon = icons[iconKey];

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700" aria-label={name}>
      {icon}
    </a>
  );
};

export const SocialLinks = ({ links }: { links: Record<string, string> | null | undefined }) => {
  if (!links || Object.keys(links).length === 0) return null;

  return (
    <div className="flex gap-4">
      {Object.entries(links).map(([name, url]) => (
        url && <SocialIcon key={name} name={name} url={url} />
      ))}
    </div>
  );
};
