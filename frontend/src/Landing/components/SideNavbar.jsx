import { useEffect, useState } from "react";

const sections = [
  { id: "home", label: "Home" },
  { id: "updates", label: "Announcements" },
  { id: "jobs", label: "Jobs" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
];

const StickySidebarButtons = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let current = "";
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const { top, height } = el.getBoundingClientRect();
          const sectionTop = window.scrollY + top;
          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + height
          ) {
            current = section.id;
          }
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
<aside className="fixed top-16 left-0 w-44 h-[calc(100vh-15rem)] bg-[#f5faff] border-r border-none z-40 flex flex-col justify-center items-center">

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-36 py-2 rounded-full text-sm font-medium shadow transition-all duration-200 ${
              activeSection === section.id
                ? "bg-[#0B52C0] text-white"
                : "bg-white text-[#0B52C0] border border-[#0B52C0] hover:bg-[#e0efff]"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default StickySidebarButtons;
