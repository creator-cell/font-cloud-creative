import Image from "next/image";

export const FooterSection = () => {
  return (
    <footer className="w-full py-10 flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center flex items-center justify-center gap-4">
        <p className="text-xs tracking-[3px] font-semibold text-[#3d2b63] mb-1 dark:text-[#f2f6fa] ">
          POWERED BY:
        </p>

        <Image src="/logo1.png" alt="Logo" width={50} height={50} />
      </div>
    </footer>
  );
};
  