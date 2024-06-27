import React from "react";
import { SiGithub } from "react-icons/si";

const Footer: React.FC = () => {
  return (
    <div className="bg-cyan-900">
      <div className="container py-3 flex justify-between">
        <span>
          Made with by
          <a
            className="text-cyan-400"
            target="_blank"
            href="https://github.com/tandukarunique"
          >
            {" "}
            Unique.
          </a>
        </span>
        <a
          target="_blank"
          className="flex items-center"
          href="https://github.com/tandukarunique"
        >
          <SiGithub className="me-2" /> Repo
        </a>
      </div>
    </div>
  );
};

export default Footer;
