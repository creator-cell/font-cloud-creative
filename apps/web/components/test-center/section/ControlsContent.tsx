"use client";

import { Input } from "@/components/ui/input";
import { CircleCheck, Search } from "lucide-react";
import { useRef, useState } from "react";

const controlsData = {
  "Infrastructure security": [
    {
      control: "Unique production database authentication enforced",
      description:
        "The company requires authentication to production datastores to use authorized secure authentication mechanisms, such as unique SSH key.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
    {
      control: "Encryption key access restricted",
      description:
        "The company restricts privileged access to encryption keys to authorized users with a business need.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
    {
      control: "Unique account authentication enforced",
      description:
        "The company requires authentication to systems and applications to use unique username and password or authorized SSH keys.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
    {
      control: "Production application access restricted",
      description: "System access restricted to authorized access only.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
    {
      control: "Access control procedures established",
      description:
        "Policies and procedures define how access is granted and revoked in production systems.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
  ],

  "Organizational security": [
    {
      control: "Employee security training completed",
      description:
        "All employees must complete mandatory security awareness training annually.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
    {
      control: "Security roles defined",
      description:
        "Clear roles and responsibilities for security within the organization.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
  ],

  "Product security": [
    {
      control: "Code review process enforced",
      description:
        "All code changes must go through peer review before deployment.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
    {
      control: "Vulnerability scanning performed",
      description:
        "Regular vulnerability scans of applications and infrastructure.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
  ],

  "Internal security procedures": [
    {
      control: "Incident response plan established",
      description:
        "Formal incident response plan exists and is tested regularly.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
    {
      control: "Internal audit performed",
      description:
        "Periodic internal audits are conducted to verify policy compliance.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
  ],

  "Data and privacy": [
    {
      control: "Data encryption in transit",
      description: "All sensitive data is encrypted while being transmitted.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
    {
      control: "Data retention policy enforced",
      description: "Data is stored and retained according to defined policies.",
      status: (
        <CircleCheck
          className="w-6 h-6 fill-[#16a34a] dark:fill-transparent"
          stroke="white"
          strokeWidth={2}
        />
      ),
    },
  ],
};

export const ControlsContent = () => {
  const categories = Object.keys(controlsData);
  const sectionRefs = useRef({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleScroll = (category) => {
    sectionRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const filteredControlsData = {};
  categories.forEach((category) => {
    filteredControlsData[category] = controlsData[category].filter(
      (item) =>
        item.control.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const visibleCategories = categories.filter(
    (category) => filteredControlsData[category].length > 0
  );

  return (
    <div className="flex">
      <div className="flex-col w-60 hidden md:flex">
        <h2 className="text-2xl font-semibold mb-4 dark:text-[#f2f6fa]">
          Controls
        </h2>

        <ul className="flex-1 mt-10">
          {visibleCategories.length > 0 ? (
            visibleCategories.map((category) => (
              <li
                key={category}
                onClick={() => handleScroll(category)}
                className="cursor-pointer py-2 text-base text-gray-700 dark:text-[#f2f6f9] dark:hover:text-gray-500 "
              >
                {category}
              </li>
            ))
          ) : (
            <li className="py-2 px-3 text-gray-400 dark:text-[#f2f6f9]">
              No controls found
            </li>
          )}
        </ul>
      </div>

      <div className="flex-1">
        <div className="w-full   justify-end mb-6 hidden md:flex">
          <div className="w-96">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                <Search className="w-4 h-4" />
              </span>

              <Input
                type="text"
                placeholder="Search controls"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-8 py-1.5 rounded-md border text-gray-600 border-gray-300 text-sm focus:outline-none "
              />
            </div>
          </div>
        </div>
        <div className="font-medium text-2xl md:hidden mb-8 dark:text-[#f2f6fa]">
          Controls
        </div>

        <div className="space-y-12">
          {visibleCategories.map((category) => (
            <div
              key={category}
              ref={(el) => (sectionRefs.current[category] = el)}
            >
              <h3 className="text-xl font-semibold mb-6 pl-1 dark:text-[#f2f6fa]">
                {category}
              </h3>

              <div className="border border-gray-200 rounded-md dark:border-[#324154] ">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-[#324154] ">
                      <th className="py-2 px-4 text-xs font-medium text-gray-600 text-left dark:text-[#f2f6fa]">
                        CONTROL
                      </th>
                      <th className="py-2 px-4 text-xs font-medium text-gray-600 text-center w-20 dark:text-[#f2f6fa]">
                        STATUS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredControlsData[category].map((item, index) => (
                      <tr key={index}>
                        <td className="py-4 px-4 border-b">
                          <div className="text-sm font-semibold text-gray-900 dark:text-[#f2f6fa]">
                            {item.control}
                          </div>
                          <div className="text-gray-600 text-sm mt-1 leading-relaxed dark:text-[#f2f6fa]">
                            {item.description}
                          </div>
                        </td>

                        <td className="py-4 px-4 border-b w-20">
                          <div className="flex items-center justify-center h-full">
                            {item.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {visibleCategories.length === 0 && (
            <p className="text-gray-500 text-center mt-20 text-lg">
              No matching controls found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
