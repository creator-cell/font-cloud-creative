"use client";
import { useRef, useState, useEffect } from "react";
import { Copy, ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sectionsData = [
  {
    title: "Reports",
    items: [
      {
        label: "Future of Synthesia’s 2024 Responsible Creation Report",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
    ],
  },
  {
    title: "Certificates",
    items: [
      {
        label: "SOC/IEC 27001:2022 Certificate",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "SOC/IEC 27001:2022 Statement of Applicability",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "SOC 2 Type II report | 2025",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "SOC 2 Bridge Letter - September 2025",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "SOC/IEC 42001:2023 Certificate",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "SOC/IEC 42001:2023 Statement of Applicability",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "CyberEssentials Certificate",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
    ],
  },
  {
    title: "Assessments",
    items: [
      {
        label: "Data Protection Impact Assessment",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "AI Impact Assessment",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "Pentest executive summary - 2025",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "Synthesia Penetration Test - Full report - March 2025",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
    ],
  },
  {
    title: "Questionnaires",
    items: [
      {
        label: "CAIQ-v4.0.2 SIGM Security Questionnaire",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "ISO Lite questionnaire",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
      {
        label: "AI Governance FAQ",
        link: "#",
        pdfUrl: "https://example.com/file1.pdf",
      },
    ],
  },
];

export const ResourcesContent = () => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRefs = useRef<any[]>([]);

  const filteredSections = sectionsData.map((sec) => ({
    ...sec,
    items: sec.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const copyLink = (label: string) => {
    navigator.clipboard.writeText(label);
  };

  return (
    <div className="flex gap-12 w-full mt-5">
      <div className="w-52 flex-shrink-0 pr-4  overflow-y-auto">
        {sectionsData.map((section, idx) => (
          <button
            key={section.title}
            onClick={() => scrollToSection(idx)}
            className="block py-2 text-left text-gray-700 hover:text-black transition"
          >
            {section.title}
          </button>
        ))}
      </div>

      <div className="flex-1">
        <div className="flex justify-end items-center mb-7">
          <Input
            className="max-w-sm"
            placeholder="Search resources"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredSections.map((section, secIndex) => (
          <div
            key={section.title}
            ref={(el) => (sectionRefs.current[secIndex] = el)}
            className="mb-16"
          >
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm"
                >
                  <div className="flex flex-col">
                    <p className="font-medium">{item.label}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyLink(item.link)}
                    >
                      <Copy className="w-4 h-4 mr-1" /> Copy link
                    </Button>

                    {/* <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" /> View
                    </Button> */}
                    <div className="flex gap-3">
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        View PDF
                      </a>

                      {/* <a
                        href={item.pdfUrl}
                        download
                        className="border px-3 py-2 rounded-md text-sm"
                      >
                        Download
                      </a> */}
                    </div>

                    <Button
                      size="sm"
                      className="bg-blue-600 text-white"
                      onClick={() => setModalOpen(true)}
                    >
                      Request access
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Request Access</h3>
            <p className="text-gray-600 mb-6">
              To request access, please contact security@synthesia.io
            </p>
            <Button onClick={() => setModalOpen(false)} className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
