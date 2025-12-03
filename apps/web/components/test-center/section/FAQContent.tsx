"use client";

import { useState } from "react";
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

  const handleCopy = (question: string) => {
    navigator.clipboard.writeText(question);
    toast.success("Link copied!", { duration: 1000 });
  };

  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="flex justify-end gap-3">
          <Button
            className="bg-white text-black hover:bg-white hover:text-black border"
            onClick={() => setOpenItems([])}
          >
            Collapse all
          </Button>
          <Button
            className="bg-white text-black hover:bg-white hover:text-black border"
            onClick={() => setOpenItems(faqData.map((_, i) => `${i}`))}
          >
            Expand all
          </Button>
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

      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={(val) => setOpenItems(val)}
        className="space-y-4"
      >
        {faqData.map((question, idx) => {
          const isOpen = openItems.includes(`${idx}`);
          return (
            <AccordionItem
              key={idx}
              value={`${idx}`}
              className="bg-white rounded-lg shadow-sm border border-gray-300 cursor-pointer"
            >
              <AccordionTrigger className="flex justify-between items-center w-full p-0">
                <div className="flex justify-between items-center px-6 w-full">
                  <div className="flex items-center gap-2 justify-center">
                    <ChevronDown
                      className={`h-4 w-4 text-gray-700 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                    <AccordionTrigger className="text-left py-5 text-base font-medium flex-1">
                      {question}
                    </AccordionTrigger>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-4 bg-white text-black border hover:bg-white hover:text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(question);
                    }}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy link
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
        })}
      </Accordion>
    </div>
  );
};
