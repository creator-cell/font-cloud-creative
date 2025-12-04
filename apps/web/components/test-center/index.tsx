"use client";
import { useState } from "react";
import { Herosection } from "./section/hero-section";
import { Navigation } from "./section/navigation";
import { OverviewContent } from "./section/OverviewContent";
import { ResourcesContent } from "./section/ResourcesContent";
import SecurityTabs from "./section/tab";
import { ControlsContent } from "./section/ControlsContent";
import { FAQContent } from "./section/FAQContent";
import { FooterSection } from "./section/FooterSection";

const TestCenter = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <Navigation />  
      <Herosection />
      <div className="px-5 md:px-10 max-w-7xl container mx-auto bg-white">
        <SecurityTabs onChange={setActiveTab} activeIndex={activeTab} />

        <div className="mt-10 text-black leading-relaxed text-[17px]">
          {activeTab === 0 && <OverviewContent switchToControls={() => setActiveTab(2)} />}
          {activeTab === 1 && <ResourcesContent />}
          {activeTab === 2 && <ControlsContent />}
          {activeTab === 3 && <FAQContent />}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default TestCenter;
