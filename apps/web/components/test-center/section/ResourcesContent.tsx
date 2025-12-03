"use client";
import { useState, useRef } from "react";
import { Copy, Lock, ExternalLink, ArrowDown, Search } from "lucide-react";
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

const sectionsData = [
  {
    title: "Reports",
    items: [
      {
        label: "Futuresafe: Synthesia's 2024 Responsible Creation Report",
        access: false,
        link: "#",
      },
    ],
  },
  {
    title: "Certificates",
    items: [
      { label: "ISO/IEC 27001:2022 Certificate", access: true, link: "#" },
      {
        label: "ISO/IEC 27001:2022 Statement of Applicability",
        access: true,
        link: "#",
      },
      { label: "SOC 2 Type II report 2025", access: false, link: "#" },
      {
        label: "SOC2 Bridge Letter - September 2025",
        access: false,
        link: "#",
      },
      { label: "ISO/IEC 42001:2023 Certificate", access: true, link: "#" },
      {
        label: "ISO/IEC 42001:2023 Statement of Applicability",
        access: true,
        link: "#",
      },
      { label: "CyberEssentials Certificate", access: false, link: "#" },
    ],
  },
  {
    title: "Assessments",
    items: [
      { label: "Data Protection Impact Assessment", access: true, link: "#" },
      { label: "AI Impact Assessment", access: true },
      { label: "Pentest Executive Summary - 2025", access: true, link: "#" },
      {
        label: "Synthesia Penetration Test – Full report – March 2025",
        access: true,
        link: "#",
      },
    ],
  },
  {
    title: "Questionnaires",
    items: [
      {
        label: "CAIQ-v4.0.2 SIGM Security Questionnaire",
        access: true,
        link: "#",
      },
      { label: "ISO Lite Questionnaire", access: true, link: "#" },
      { label: "AI Governance FAQ", access: true, link: "#" },
    ],
  },
];

export function ResourcesContent() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    navigator.clipboard.writeText(txt);
    toast.success("Resource link copied", {
      duration: 1000,
    });
  };

  return (
    <div className="flex gap-6 w-full mt-6">
      <div className="w-52 flex-shrink-0 space-y-2">
        <h1 className="text-xl md:text-2xl font-semibold">Resources</h1>
        <div style={{ marginTop: "4rem" }}>
          {sectionsData.map((section, idx) => (
            <button
              key={section.title}
              onClick={() => scrollToSection(idx)}
              className="block py-1.5 text-base text-gray-700 hover:text-black transition"
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-end items-center mb-7 gap-3">
          <Button className="bg-white text-black border">
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

        {filteredSections.map((section, secIdx) => (
          <div
            key={section.title}
            ref={(el) => (sectionRefs.current[secIdx] = el)}
            className="mb-14"
          >
            <h2 className="text-lg font-semibold mb-4">{section.title}</h2>

            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="border rounded-lg p-5 bg-white shadow-sm flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-normal">{item.label}</p>
                    <Button
                      onClick={() => copyLink(item.link)}
                      className="flex items-center gap-1 bg-white text-gray-700 border text-xs py-0.5 px-3 hover:bg-white hover:text-gray-700"
                    >
                      <Copy className="w-3 h-3" /> Copy link
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    {item.access ? (
                      <Button
                        variant="outline"
                        className="flex items-center text-sm px-4 py-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" /> View
                      </Button>
                    ) : (
                      <Button
                        className="flex items-center gap-1 bg-white text-black border px-4 py-1 hover:bg-white hover:text-black"
                        onClick={() => setModalOpen(true)}
                      >
                        <Lock className="w-4 h-4" /> Request access
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
              {/* First Name */}
              <div>
                <Label className="text-sm font-semibold">First name</Label>
                <Input type="text" className="mt-1" />
              </div>

              {/* Last Name */}
              <div>
                <Label className="text-sm font-semibold">Last name</Label>
                <Input type="text" className="mt-1" />
              </div>

              {/* Email */}
              <div>
                <Label className="text-sm font-semibold">Email</Label>
                <Input type="email" className="mt-1" />
              </div>

              {/* Company Name */}
              <div>
                <Label className="text-sm font-semibold">Company name</Label>
                <Input type="text" className="mt-1" />
              </div>

              {/* Reason */}
              <div>
                <Label className="text-sm font-semibold">Reason</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existing_customer">
                      I'm an existing customer
                    </SelectItem>
                    <SelectItem value="prospective_customer">
                      I'm a prospective customer
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Access Level */}
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

            {/* Buttons */}
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
    </div>
  );
}
