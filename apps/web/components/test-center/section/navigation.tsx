import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import Image from "next/image";

export const Navigation = () => {
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

        <Button className="bg-blue-600 text-white">Request Access</Button>
      </div>
    </header>
  );
};
