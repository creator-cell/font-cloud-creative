"use client";
import { useState, useRef } from "react";
import { Copy, Lock, ArrowDown, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import JSZip from "jszip";
import { saveAs } from "file-saver";

const sectionsData = [
  {
    title: "Reports",
    items: [
      {
        label: "Futuresafe: Synthesia's 2024 Responsible Creation Report",
        access: false,
        link: "#",
        pdfUrl:
          "https://magnificent-jade-jx76uicfle-k217dfl8u4.edgeone.dev/dummy-pdf_2.pdf",
      },
    ],
  },
  {
    title: "Certificates",
    items: [
      {
        label: "ISO/IEC 27001:2022 Certificate",
        access: true,
        link: "#",
        pdfUrl:
          "https://magnificent-jade-jx76uicfle-k217dfl8u4.edgeone.dev/dummy-pdf_2.pdf",
      },
      {
        label: "ISO/IEC 27001:2022 Statement of Applicability",
        access: true,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "SOC 2 Type II report 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "SOC2 Bridge Letter - September 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "ISO/IEC 42001:2023 Certificate",
        access: true,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "ISO/IEC 42001:2023 Statement of Applicability",
        access: true,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      { label: "CyberEssentials Certificate", access: false, link: "#" },
    ],
  },
  {
    title: "Assessments",
    items: [
      {
        label: "Data Protection Impact Assessment",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "AI Impact Assessment",
        access: false,
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Pentest Executive Summary - 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Synthesia Penetration Test – Full report – March 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    title: "Questionnaires",
    items: [
      {
        label: "Data Protection Impact Assessment",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "AI Impact Assessment",
        access: false,
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Pentest Executive Summary - 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Synthesia Penetration Test – Full report – March 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    title: "Diagrams",
    items: [
      {
        label: "Data Protection Impact Assessment",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "AI Impact Assessment",
        access: false,
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Pentest Executive Summary - 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Synthesia Penetration Test – Full report – March 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        label: "Data Protection Impact Assessment",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "AI Impact Assessment",
        access: false,
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Pentest Executive Summary - 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Synthesia Penetration Test – Full report – March 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    title: "Policies",
    items: [
      {
        label: "Data Protection Impact Assessment",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "AI Impact Assessment",
        access: false,
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Pentest Executive Summary - 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        label: "Synthesia Penetration Test – Full report – March 2025",
        access: false,
        link: "#",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
];

export function ResourcesContent() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const filteredSections = sectionsData.map((sec) => ({
    ...sec,
    items: sec.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const scrollToSection = (i: number) =>
    sectionRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  const copyLink = (txt: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(txt);
      toast.success("Resource link copied", { duration: 1000 });
    } else {
      toast.error("Clipboard not available");
    }
  };

  const handleBulkDownload = async () => {
    const zip = new JSZip();
    const allItems = sectionsData.flatMap((sec) => sec.items);
    const pdfItems = allItems.filter((item) => item.access && item.pdfUrl);

    if (pdfItems.length === 0) {
      toast.error("No accessible PDFs to download");
      return;
    }

    try {
      await Promise.all(
        pdfItems.map(async (item) => {
          const res = await fetch(item.pdfUrl);
          const blob = await res.blob();
          const fileName = item.pdfUrl.split("/").pop() || "file.pdf";
          zip.file(fileName, blob);
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "resources.zip");
    } catch (err) {
      console.error("Bulk download failed", err);
      toast.error("Failed to download some files");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full mt-6">
      <div className="w-52 flex-shrink-0 space-y-2 hidden md:block">
        <h1 className="text-xl md:text-2xl font-semibold">Resources</h1>
        <div style={{ marginTop: "4rem" }}>
          {sectionsData.map((section, idx) => (
            <button
              key={section.title}
              onClick={() => scrollToSection(idx)}
              className="block py-1.5 text-base text-gray-700 hover:text-black transition text-left"
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="md:flex flex-col md:flex-row justify-end items-center mb-7 gap-3 w-full hidden ">
          <Button
            className="w-full md:w-auto bg-white text-black border hover:bg-white hover:text-black"
            onClick={handleBulkDownload}
          >
            <ArrowDown className="w-4 h-5 mr-2" />
            Bulk download
          </Button>

          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              className="pl-10"
              placeholder="Search resources"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="font-medium text-xl md:hidden mb-8">Resources</div>

        {filteredSections.map((section, secIdx) => (
          <div
            key={section.title}
            ref={(el) => (sectionRefs.current[secIdx] = el)}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">{section.title}</h2>

            <div className="border rounded-lg overflow-hidden bg-white">
              {section.items.length === 0 ? (
                <div className="px-5 py-6 text-sm text-gray-500">
                  No resources found.
                </div>
              ) : (
                section.items.map((item, index) => (
                  <div
                    key={item.label + index}
                    className="flex flex-col md:grid md:grid-cols-[1fr_max-content] gap-4 md:gap-0 items-start md:items-center px-5 py-4 border-b last:border-none border-gray-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                      <p className="font-medium text-base text-black break-words">
                        {item.label}
                      </p>
                      <div className="mt-2 sm:mt-0">
                        <Button
                          onClick={() => copyLink(item.link || "")}
                          className="flex items-center gap-1 bg-white text-gray-700 border text-xs py-1.5 px-3 hover:bg-white"
                        >
                          <Copy className="w-3 h-3" /> Copy link
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-start md:justify-end w-full md:w-auto">
                      {item.access ? (
                        <Button
                          className="flex items-center text-sm bg-white text-black hover:bg-white border px-4 py-1"
                          onClick={() => setPdfUrl(item.pdfUrl || "")}
                        >
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                      ) : (
                        <Button
                          className="flex items-center gap-1 bg-white text-black border px-4 py-1 hover:bg-white"
                          onClick={() => setModalOpen(true)}
                        >
                          <Lock className="w-4 h-4" /> Request access
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-[650px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Request access
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div>
                <Label className="text-sm font-semibold">First name</Label>
                <Input type="text" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-semibold">Last name</Label>
                <Input type="text" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-semibold">Email</Label>
                <Input type="email" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-semibold">Company name</Label>
                <Input type="text" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-semibold">Reason</Label>
                <div className="w-full">
                  <Select>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)] cursor-pointer">
                      <SelectItem
                        value="existing_customer"
                        className="cursor-pointer"
                      >
                        I'm an existing customer
                      </SelectItem>
                      <SelectItem
                        value="prospective_customer"
                        className="cursor-pointer"
                      >
                        I'm a prospective customer
                      </SelectItem>
                      <SelectItem value="other" className="cursor-pointer">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Access level</Label>
                <RadioGroup defaultValue="full" className="flex gap-6 mt-2 ">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="full" id="full" />
                    <label htmlFor="full">Full access</label>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="documents" id="documents" />
                    <label htmlFor="documents">
                      Access to individual documents
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <p className="text-blue-600 text-base cursor-pointer hover:underline">
                Already have access? Reclaim access
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-10">
              <Button
                onClick={() => setModalOpen(false)}
                className="bg-white text-black border hover:bg-white hover:text-black"
              >
                Cancel
              </Button>

              <Button
                className="bg-[#3b71ca] hover:bg-[#2f63b4] text-white"
                onClick={() => setModalOpen(false)}
              >
                Request access
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {pdfUrl && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col">
          <div className="flex justify-between items-center p-4 bg-white shadow-md">
            <button
              onClick={() => setPdfUrl(null)}
              className="text-black text-lg font-bold px-3 py-1"
            >
              ✕
            </button>
            <span className="font-medium text-gray-800 truncate">
              {pdfUrl.split("/").pop()}
            </span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="flex items-center gap-1 text-black border px-3 py-1 rounded hover:bg-gray-100"
            >
              <ArrowDown className="w-4 h-4" /> Download
            </a>
          </div>

          <iframe
            src={pdfUrl}
            className="flex-1 w-full h-full"
            frameBorder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
}
