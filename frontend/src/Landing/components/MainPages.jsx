import Navbar from "./Navbar";
import StickySidebarButtons from "./SideNavbar";
import HomePags from "../pages/HomePags";
import UpdatesPage from "../pages/UpdatesPage";
import JobBoard from "../pages/JobsPage";
import FAQsPage from "../pages/FaqsPage";
import ContactPage from "../pages/ContactPage";
import Footer from "./Footer";
import { useRef } from "react";

function MainPages() {
  const footerRef = useRef(null);
  return (
    <div className="app-wrapper flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="home-container flex flex-1 w-full">
        {/* Sidebar */}
        <StickySidebarButtons footerRef={footerRef} />

        {/* Main Page Sections */}
        <div className="main-content w-full px-4 md:px-8 py-4 space-y-15 overflow-y-auto">
          <div id="home" data-section="home" className="main-page">
            <HomePags />
          </div>
          <div id="updates" data-section="updates" className="main-page">
            <UpdatesPage />
          </div>
          <div id="jobs" data-section="jobs" className="main-page">
            <JobBoard />
          </div>
          <div id="faqs" data-section="faqs" className="main-page">
            <FAQsPage />
          </div>
          <div id="contact" data-section="contact" className="main-page">
            <ContactPage />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        id="footer"
        data-section="footer"
        className="bg-[#0a2540] text-white w-full "
        ref={footerRef}
      >
        <div className="">
          <Footer />
        </div>
      </footer>
    </div>
  );
}

export default MainPages;
