"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ChevronRight,
  CircleCheck,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { useState } from "react";

export const OverviewContent = ({
  switchToControls,
}: {
  switchToControls: () => void;
}) => {
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openIds, setOpenIds] = useState([0]);

  const initialFaqs = [
    {
      id: 1,
      question: "Do you support Single Sign-On (SSO)?",
      answer:
        "Yes, we support SAML 2.0 based SSO and authentication via Google for corporate customers above a certain deal value. Please reach out to our sales team to discuss specifics.",
    },
    {
      id: 2,
      question: "Where is your data stored?",
      answer:
        "Customer data is primarily stored within secure, certified cloud infrastructure in the European Union (EU) and is processed in compliance with GDPR. Specific storage locations can be confirmed in your Data Processing Agreement.",
    },
    {
      id: 3,
      question:
        "Will any of the data be shared with any third parties (e.g., sub-processors) at any point?",
      answer:
        "Data may be shared with approved sub-processors (like cloud hosting providers) only as necessary to provide the service, and under strict confidentiality and security agreements. A list of current sub-processors is available in our DPA.",
    },
    {
      id: 4,
      question:
        "What encryption methods and processes are used to protect data in-transit or at-rest?",
      answer:
        "Data is protected using industry-standard encryption. Data-in-transit uses TLS/SSL (Transport Layer Security). Data-at-rest is encrypted using AES-256 standards.",
    },
  ];

  const handleToggle = (id: any) => {
    setOpenIds((prevOpenIds) => {
      if (prevOpenIds.includes(id)) {
        return prevOpenIds.filter((openId) => openId !== id);
      } else {
        return [...prevOpenIds, id];
      }
    });
  };

  const complianceItems = [
    { img: "/compliancesoc1.png", label: "ISO/IEC 27001:2022" },
    { img: "/compliancesoc2.png", label: "ISO/IEC 42001:2023" },
    { img: "/compliancesoc3.webp", label: "SOC 2 Type II" },
    { img: "/compliancesoc4.svg", label: "GDPR" },
    { img: "/compliancesoc5.png", label: "UK Cyber Essentials" },
  ];

  const resourcesData = {
    Reports: ["Full-synthetic Synthesia’s 2024 Responsible Creation Report"],
    Certifications: [
      "ISO/IEC 27001:2022 Certificate",
      "ISO/IEC 27001:2022 Statement of Applicability",
      "SOC 2 Type II report 2023",
      "SOC 2 Bridge Letter – September 2025",
    ],
    Assessments: [
      "Data Protection Impact Assessment",
      "KI Impact Assessment",
      "Penetration Test – Full report – March 2025",
    ],
    Questionnaires: [
      "DMQ/CLQ 2 STAR Security Questionnaire",
      "BC Lite questionnaire",
      "KI Governance RFI",
    ],
    Diagrams: ["Data flow & Architecture Diagrams"],
    General: ["KI Business Reminder – Security Overview.pdf"],
    Policies: [
      "Privacy & Information Security Policy (IMP)",
      "Risk Management Policy",
      "Business Continuity Policy",
      "Asset Management Policy",
    ],
  };

  const controlsList = [
    {
      title: "Infrastructure security",
      items: [
        "Unique production access authentication",
        "Encryption keys securely managed",
        "Zero-trust infrastructure architecture",
      ],
      moreCount: 17,
    },
    {
      title: "Organizational security",
      items: [
        "Policies reviewed annually",
        "Restricted access maintained",
        "Vendor reviews and assessments",
      ],
      moreCount: 12,
    },
    {
      title: "Product security",
      items: [
        "App security validated",
        "Continuous monitoring enabled",
        "Zero-trust integrations",
      ],
      moreCount: 10,
    },
    {
      title: "Internal security procedures",
      items: [
        "Incident response procedures",
        "Continuity & disaster recovery",
        "Dependency reviews maintained",
      ],
      moreCount: 14,
    },
    {
      title: "Data and privacy",
      items: [
        "Data retention procedures established",
        "Customer data deleted upon leaving",
        "Data classification policy established",
      ],
      moreCount: 14,
    },
  ];

  const dataCollected = [
    "Video data of a person to create a custom avatar",
    "Voice audio data of a person to create a custom voice",
    "Incidental PII as part of video scripts",
    "Music and image assets uploaded as part of the video generation process",
    "Employee personally identifiable information (name, email address, IP address)",
  ];

  return (
    <div className="w-full">
      <div className="border rounded-lg px-6 py-5 leading-relaxed text-base text-gray-800 shadow-sm bg-white mb-10 dark:bg-[#192438] dark:text-[#f2f6fa] dark:border-[#324154]">
        <div className="max-w-5xl">
          <p className="mb-4 font-medium">
            As a company pioneering this new kind of media, we’re aware of the
            responsibility we have. It is clear to us that artificial
            intelligence and similarly powerful technologies cannot be built
            with ethics and security as an afterthought. They need to be front
            and centre and an integral part of the company. This is reflected in
            our SOC2 report, our company policies and in the technology we are
            building. It is also the reason why we are an active member of
            Content Authenticity Initiative which was started by Adobe in 2019.
          </p>

          <p className="mb-3 font-medium">
            <span>See </span>
            <a className="text-blue-600 hover:underline cursor-pointer underline">
              this page
            </a>{" "}
            for more details on our commitment to ethics and our 3Cs framework
            (Consent, Control, and Collaboration).
          </p>

          <p className="mb-3 font-medium">
            See also a narrative description of our{" "}
            <a className="text-blue-600 hover:underline cursor-pointer underline">
              Security Practices
            </a>
            .
          </p>

          <p className="mb-3 font-medium">
            To report any adverse impacts or concerns related to Synthesia AI
            systems, please{" "}
            <a className="text-blue-600 hover:underline cursor-pointer underline">
              use this form
            </a>
            .
          </p>

          <p className="mb-3 font-medium">
            For more details on processing of personal data, see our{" "}
            <a className="text-blue-600 hover:underline cursor-pointer underline">
              Data Processing Agreement
            </a>
            .
          </p>

          <p className="mb-3">
            We are <strong>SOC2 Type II compliant</strong> and fully certified
            within <strong>ISO/IEC 27001:2022</strong> and{" "}
            <strong>ISO/IEC 42001:2023</strong>.
          </p>

          <p className="font-semibold">
            Please also see our public{" "}
            <a className="text-blue-600 hover:underline cursor-pointer">
              AI Governance Practices
            </a>{" "}
            page for more information.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 w-full">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div>
            <h2 className="font-semibold text-gray-800 mb-5 dark:text-[#f2f6fa]">
              Compliance
            </h2>
            <div className="border rounded-lg p-5 bg-white shadow-sm dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b] dark:border-[#324154]">
              <div className="space-y-4">
                {complianceItems.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={c.img}
                      alt={c.label}
                      className="w-12 h-12 object-contain"
                    />
                    <p className="text-sm text-gray-800 dark:text-[#f2f6fa]">
                      {c.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-[#f2f6fa]">
                Resources
              </h2>
              <button className="text-xs text-blue-600 hover:underline font-medium">
                View all 27 resources
              </button>
            </div>

            <div className="border border-gray-300 dark:border-[#324154] rounded-lg p-5 bg-white text-sm text-gray-800 dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b]">
              {Object.entries(resourcesData).map(([section, items], i) => (
                <div key={i} className="mb-6">
                  <p className="font-semibold text-gray-800 mb-2">{section}</p>
                  <div className="space-y-1 ml-1">
                    {items.map((item, j) => (
                      <div
                        key={j}
                        onClick={() => setOpenReportModal(true)}
                        className="flex items-center justify-between text-blue-600 hover:underline cursor-pointer"
                      >
                        <span className="dark:text-[#f2f6fa]">{item}</span>
                        <span className="text-gray-600">
                          <Lock className=" w-4 h-4 dark:text-[#f2f6fa]" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {openReportModal && (
          <Dialog open={openReportModal} onOpenChange={setOpenReportModal}>
            <DialogContent className="max-w-[650px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">
                  Request access
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                {["First name", "Last name", "Email", "Company name"].map(
                  (label, i) => (
                    <div key={i}>
                      <Label className="text-sm font-semibold">{label}</Label>
                      <Input
                        type={label === "Email" ? "email" : "text"}
                        className="mt-1"
                      />
                    </div>
                  )
                )}

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

                <div>
                  <Label className="text-sm font-medium">Access level</Label>
                  <RadioGroup defaultValue="full" className="flex gap-6 mt-2">
                    {[
                      { value: "full", label: "Full access" },
                      {
                        value: "documents",
                        label: "Access to individual documents",
                      },
                    ].map((r) => (
                      <div
                        key={r.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <RadioGroupItem value={r.value} id={r.value} />
                        <label htmlFor={r.value}>{r.label}</label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <p className="text-blue-600 text-base cursor-pointer hover:underline">
                  Already have access? Reclaim access
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-10">
                <Button
                  onClick={() => setOpenReportModal(false)}
                  className="bg-white text-black border hover:bg-white hover:text-black"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#3b71ca] hover:bg-[#2f63b4] text-white"
                  onClick={() => setOpenReportModal(false)}
                >
                  Request access
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Controls */}
        <div className="col-span-12 lg:col-span-9">
          <div className="flex flex-wrap justify-between items-center mb-5">
            {/* LEFT SIDE ALWAYS TOGETHER */}
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-gray-900 text-xl dark:text-[#f2f6fa]">
                Controls
              </h2>
              <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs">
                <span className="h-2 w-2 bg-green-600 rounded-full dark:bg-[#002b21] dark:text-[#009966]"></span>
                Updated 25 minutes ago
              </span>
            </div>

            {/* BUTTON — BREAKS ONLY ON SMALL SCREENS */}
            <button
              onClick={switchToControls}
              className="text-blue-600 hover:underline text-sm font-medium mt-3 md:mt-0"
            >
              View all controls
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-4">
            {controlsList.map((control, i) => (
              <div
                key={i}
                className="border  p-5 rounded-lg bg-white shadow-sm cursor-pointer group dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b] dark:text-[#f2f6fa] dark:border-[#324154]"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-[#f2f6fa]">
                    {control.title}
                  </h3>
                  <span>
                    <ChevronRight className="w-4 h-4 dark:text-[#f2f6fa]" />
                  </span>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  {control.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 dark:text-[#f2f6fa]"
                    >
                      <span className="text-green-600 text-lg">
                        <CircleCheck className=" w-4 h-4" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                  View {control.moreCount} more {control.title} controls
                </button>
              </div>
            ))}
          </div>

          {/* Data collected */}
          <div className="mb-4">
            <h2 className="font-semibold text-gray-800 mb-4 dark:text-[#f2f6fa]">
              Data collected
            </h2>
            <div className="border  p-5 rounded-lg bg-white shadow-sm text-sm text-gray-700 space-y-2 dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b] dark:border-[#324154]">
              {dataCollected.map((d, i) => (
                <p
                  key={i}
                  className="flex items-center gap-2 text-base font-normal dark:text-[#f2f6fa]"
                >
                  <Check className="w-4 h-4 shrink-0 dark:text-[#f2f6fa]" /> {d}
                </p>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-extrabold text-2xl text-gray-800 dark:text-[#f2f6fa]">
                FAQ
              </h2>
              <button className="text-blue-600 hover:underline text-sm font-medium">
                View all 13 FAQs
              </button>
            </div>

            <div className="border rounded-lg shadow-sm dark:border-[#324154]">
              {initialFaqs.map((faq, i) => {
                const isOpen = openIds.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className={`bg-white text-sm text-gray-800 dark:bg-gradient-to-tl from-[#121f33] to-[#1c263b] ${i < initialFaqs.length - 1 ? "border-b dark:border-b-[#324154]" : ""}`}
                  >
                    <div
                      onClick={() => handleToggle(faq.id)}
                      className={`flex items-start justify-start px-5 py-4 cursor-pointer  transition-colors`}
                    >
                      <div className="flex items-start gap-2 w-full">
                        <div
                          className={`mt-0.5 transform transition-transform duration-300 ${isOpen ? "" : ""}`}
                        >
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-700 dark:text-[#f2f6fa]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-700 dark:text-[#f2f6fa]" />
                          )}
                        </div>
                        <span className="font-medium dark:text-[#f2f6fa]">
                          {faq.question}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0 border-t dark:border-[#324154]">
                        <div className="px-7 py-3 text-sm text-gray-700 leading-relaxed dark:text-[#f2f6fa]">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
