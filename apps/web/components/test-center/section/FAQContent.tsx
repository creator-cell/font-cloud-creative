"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, Copy, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const faqData = [
  "Do you support Single Sign-On (SSO)?",
  "Where is your data stored?",
  "Will any of the data be shared with any third parties (e.g., sub-processors) at any point?",
  "What encryption methods and processes are used to protect data in-transit or at-rest?",
  "What types of data do you collect/process?",
  "Do you perform application security testing?",
  "How do you secure access to data?",
  "Do you have a Risk Assessment & Treatment process?",
  "What is the Security organisational structure within Synthesia?",
  "Are you GDPR compliant?",
  "What security controls do you have implemented?",
  "How do you notify customers in case of a security incident or breach?",
  "Do you have a Bug Bounty program?",
];

export const FAQContent = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCopy = (question: string) => {
    navigator.clipboard.writeText(question);
    toast.success("Link copied!", { duration: 1000 });
  };

  const filteredFaqs = faqData.filter((q) =>
    q.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setOpenItems([]);
  }, [search]);

  return (
    <div className="w-full mt-10">
      <div className="md:flex items-center justify-between mb-6 hidden">
        <h2 className="text-2xl font-semibold dark:text-[#f2f6fa]">FAQ</h2>

        <div className="flex justify-end gap-3">
          <Button
            className="bg-white text-black hover:bg-white hover:text-black border dark:bg-[#162033] dark:border-[#324154] dark:text-[#f2f6fa]"
            onClick={() => setOpenItems([])}
          >
            Collapse all
          </Button>

          <Button
            className="bg-white text-black hover:bg-white hover:text-black border dark:bg-[#162033] dark:border-[#324154] dark:text-[#f2f6fa]"
            onClick={() => setOpenItems(filteredFaqs.map((_, i) => `${i}`))}
          >
            Expand all
          </Button>

          {/* SEARCH */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              className="pl-8"
              placeholder="Search resources"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="font-medium text-2xl md:hidden mb-8">FAQ</div>
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={(val) => setOpenItems(val)}
        className="space-y-4"
      >
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((question, idx) => {
            const isOpen = openItems.includes(`${idx}`);
            return (
              <AccordionItem
                key={idx}
                value={`${idx}`}
                className="bg-white rounded-lg shadow-sm border border-gray-300 cursor-pointer dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b] dark:text-[#f2f6fa] dark:border-[#324154]"
              >
                <AccordionTrigger className="flex justify-between items-center w-full p-0">
                  <div className="flex justify-between items-center md:px-6 px-3 w-full">
                    <div className="flex items-center gap-2 justify-center">
                      <ChevronDown
                        className={`h-5 w-5 flex-shrink-0 text-gray-700 transition-transform duration-300 origin-center dark:text-[#f2f6fa] ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />

                      <AccordionTrigger className="text-left py-4 md:py-5 md:text-base text-sm font-medium flex-1">
                        {question}
                      </AccordionTrigger>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-4 text-black border hover:bg-white hover:text-black py-1 px-3 dark:bg-[#162033] dark:border-[#324154] dark:text-[#f2f6fa]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(question);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {isMobile ? "Copy" : "Copy link"}
                    </Button>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <p className="text-gray-700 py-3 border-t border-gray-300 w-full px-6 mt-2">
                    Answer for: {question}
                  </p>
                </AccordionContent>
              </AccordionItem>
            );
          })
        ) : (
          <p className="rounded-lg mt-10 text-center border p-5 text-base font-medium">
            No matching questions found
          </p>
        )}
      </Accordion>
    </div>
  );
};
