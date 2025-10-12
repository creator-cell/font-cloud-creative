import {
  ArrowRight,
  Star,
  CheckCircle,
  Users,
  Zap,
  Play,
  ArrowUpRight,
  Brain,
  Bot,
  Search,
} from "lucide-react";

const HeroSection = () => {
  return (
    <motion.section
      className="relative w-full text-gray-900"
      id="product"
      {...fadeIn(0.05)}
    >
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="absolute bottom-0 right-1/2 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"
          style={{ animationDelay: "-2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"
          style={{ animationDelay: "-4s" }}
        ></div>
      </div>

      <motion.div
        className="relative z-10 w-full flex justify-center pt-8 sm:pt-6 pb-6 sm:pb-8"
        {...fadeIn()}
      >
        <div className="inline-flex justify-center items-center gap-2 sm:gap-4 border border-blue-200 bg-[#F3FAFE] rounded-lg px-3 py-2 sm:px-4 text-xs text-blue-700 font-medium shadow-md whitespace-nowrap">
          <svg
            className="h-3 w-3 text-[#0EA5E9] flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.049 2.115a.524.524 0 01.902 0l1.64 3.32a.524.524 0 00.395.286l3.665.532a.524.524 0 01.29.896l-2.653 2.586a.524.524 0 00-.15.462l.628 3.654a.524.524 0 01-.76.554l-3.275-1.722a.524.524 0 00-.486 0l-3.275 1.722a.524.524 0 01-.76-.554l.628-3.654a.524.524 0 00-.15-.462L3.896 7.231a.524.524 0 01.29-.896l3.665-.532a.524.524 0 00.395-.286l1.64-3.32z"
            />
          </svg>
          <p className="text-[12px] sm:text-sm text-black whitespace-nowrap">
            {copy.heroEyebrow}
          </p>
          <svg
            className="h-3 w-3 text-black flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="lg:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 mt-12 md:mt-0">
            {copy.heroTitlePrimary} <br />
            <span className="text-[#1D8FFF] inline-block">
              {copy.heroTitleHighlight}
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-600 mb-8 sm:mb-10">
            {copy.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
            <Link
              href={"/api/auth/signin?callbackUrl=%2Fdashboard"}
              target="_main"
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 text-white font-semibold rounded-lg shadow-md transition-colors bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Zap className="h-5 w-5 mr-2" /> {copy.heroPrimaryCta}
            </Link>

            <button className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-white text-gray-800 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Play className="h-5 w-5 mr-2" /> {copy.heroSecondaryCta}
            </button>
          </div>

          <div className="flex flex-wrap justify-start lg:justify-start gap-x-8 gap-y-4 text-gray-600 mb-12">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{copy.heroToken}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{copy.heroCard}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{copy.heroCancel}</span>
            </div>
          </div>

          <div className="flex justify-between gap-12 border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center w-full">
              {heroStats.map((stat, index) => (
                <motion.div
                  className="flex flex-col items-start"
                  {...fadeIn(index * 0.15, 30)}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 ml-7">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Cards */}
        <motion.div className="space-y-6" {...fadeIn(0.2)}>
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6 justify-start lg:justify-start">
              <Brain className="h-5 w-5 mr-2 text-[#0EA5E9]" />{" "}
              {copy.providerHeading}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#00BC7D] p-2">
                  <Bot size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">
                  {copy.providerOpenAI}
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#FF6900] p-2">
                  <Brain size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">
                  {copy.providerAnthropic}
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#2B7FFF] p-2">
                  <Search size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">
                  {copy.providerGoogle}
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#AD46FF] p-2">
                  <Zap size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">
                  {copy.providerOllama}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6 justify-start lg:justify-start">
              <Star className="h-5 w-5 mr-2 text-blue-500" />{" "}
              {copy.providerCreate}
            </h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-square-code"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="m10 14-2-2 2-2" />
                      <path d="m14 10 2 2-2 2" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">
                    {copy.providerAd}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-50 p-2 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-square"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">
                    {copy.providerSocial}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-50 p-2 text-purple-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-book-open"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">
                    {copy.providerBlog}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
