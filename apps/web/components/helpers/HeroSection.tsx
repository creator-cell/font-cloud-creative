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
    <section className="relative w-full text-gray-900 ">
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

      {/* Announcement Bar */}
      <div className="relative z-10 w-full flex justify-center pt-8 sm:pt-6 pb-6 sm:pb-8">
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
            New:GPT-4 Turbo & Claude 3.5 Sonnet Now Available
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
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="lg:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 mt-12 md:mt-0">
            Create Content with <br />
            <span className="text-[#1D8FFF] inline-block">Multi-AI Power</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-600 mb-8 sm:mb-10">
            One subscription gives you access to OpenAI, Anthropic, Google, and
            Ollama. Generate ads, blogs, and social media content that converts.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
            <button className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 text-white font-semibold rounded-lg shadow-md transition-colors bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Zap className="h-5 w-5 mr-2" /> Start Free Trial
            </button>

            <button className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-white text-gray-800 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Play className="h-5 w-5 mr-2" /> Watch Demo
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-start lg:justify-start gap-x-8 gap-y-4 text-gray-600 mb-12">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">15,000 free tokens monthly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Cancel anytime</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between gap-12 border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <p className="text-3xl font-bold text-gray-900">10K+</p>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 ml-7">
                  Active Users
                </p>
              </div>

              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  <p className="text-3xl font-bold text-gray-900">4.9</p>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 ml-7">Rating</p>
              </div>

              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="h-5 w-5 text-blue-500 transform rotate-45" />
                  <p className="text-3xl font-bold text-gray-900">99.9%</p>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 ml-7">Uptime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Cards */}
        <div className="space-y-6">
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6 justify-start lg:justify-start">
              <Brain className="h-5 w-5 mr-2 text-[#0EA5E9]" /> Powered by
              Leading AI Providers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#00BC7D] p-2">
                  <Bot size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">OpenAI</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#FF6900] p-2">
                  <Brain size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">Anthropic</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#2B7FFF] p-2">
                  <Search size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">Google</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#AD46FF] p-2">
                  <Zap size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">Ollama</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6 justify-start lg:justify-start">
              <Star className="h-5 w-5 mr-2 text-blue-500" /> Create Any Content
              Type
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
                  <span className="font-medium text-gray-700">Ad Copy</span>
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
                    Social Posts
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
                  <span className="font-medium text-gray-700">Blog Posts</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
