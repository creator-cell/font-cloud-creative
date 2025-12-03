"use client";
import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Navigation = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <header className="flex items-center justify-between bg-white border-b shadow-sm py-3 px-5 md:px-8">
      <div className="flex items-center justify-start gap-4">
        <Image src="/logo1.png" alt="Logo" width={50} height={50} />
        <div className="text-black font-semibold h-6 w-0.5 bg-black"></div>
        <p className="text-lg md:text-xl text-black font-normal">
          Front Cloud Creative
        </p>
      </div>

      <div className="md:flex items-center gap-2 hidden">
        <Button className="bg-white text-black border">
          <Sparkle className="w-4 h-5 mr-2" />
          Ask a question
        </Button>

        <Button
          className="bg-blue-600 text-white"
          onClick={() => setModalOpen(true)}
        >
          Request Access
        </Button>
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
    </header>
  );
};
