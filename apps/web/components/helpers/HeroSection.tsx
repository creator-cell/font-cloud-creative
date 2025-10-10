import {
  ArrowRight,
  Star,
  CheckCircle,
  CreditCard,
  XCircle,
  Users,
  Zap,
  Globe,
  Gauge,
  Play,
  User,
  ArrowUpRight,
  Brain,
  Bot,
  Search,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen text-gray-900 overflow-hidden">
      {/* Background radial gradient */}
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

      <div className="relative z-10 w-full flex justify-center mb-16">
        <div className="inline-flex items-center gap-2 sm:gap-4 border border-blue-200 bg-[#F3FAFE] rounded-lg px-4 py-2 text-sm text-blue-700 font-medium">
          <Star className="h-3 w-3 text-[#0EA5E9]" />
          <p className="whitespace-nowrap text-xs">
            New: GPT-4 Turbo & Claude 3.5 Sonnet Now Available
          </p>
          <ArrowRight className="h-3 w-3 text-blue-500" />
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-7xl font-bold leading-tight mb-6">
            Create Content <br />
            with{" "}
            <span className="text-blue-600 inline-block">Multi-AI Power</span>
          </h1>
          <p className="text-2xl text-gray-600  lg:mx-0 mb-10 ">
            One subscription gives you access to OpenAI, Anthropic, Google, and
            Ollama. Generate ads, blogs, and social media content that converts.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
            <button className="flex items-center justify-center px-6 py-4 text-white font-semibold rounded-lg shadow-md transition-colors bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Zap className="h-5 w-5 mr-2" /> Start Free Trial
            </button>

            <button className="flex items-center justify-center px-8 py-3 bg-white text-gray-800 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Play className="h-5 w-5 mr-2" /> Watch Demo
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-gray-600 mb-12">
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
              {/* Active Users */}
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />{" "}
                  {/* Icon for Users */}
                  <p className="text-3xl font-bold text-gray-900">10K+</p>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 ml-7">
                  Active Users
                </p>{" "}
                {/* Align text underneath icon */}
              </div>

              {/* Rating */}
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-blue-500" />{" "}
                  {/* Icon for Rating */}
                  <p className="text-3xl font-bold text-gray-900">4.9</p>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 ml-7">Rating</p>{" "}
                {/* Align text underneath icon */}
              </div>

              {/* Uptime */}
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="h-5 w-5 text-blue-500 transform rotate-45" />{" "}
                  {/* Icon for Uptime */}
                  <p className="text-3xl font-bold text-gray-900">99.9%</p>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 ml-7">Uptime</p>{" "}
                {/* Align text underneath icon */}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Cards */}
        <div className="space-y-10">
          {/* AI Providers */}
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6 justify-center lg:justify-start">
              <Brain className="h-5 w-5 mr-2 text-[#0EA5E9]" /> Powered by
              Leading AI Providers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* OpenAI */}
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#00BC7D] p-2">
                  <Bot size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">OpenAI</span>
              </div>
              {/* Anthropic */}
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#FF6900] p-2">
                  {/* Anthropic logo placeholder */}
                  <Brain size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">Anthropic</span>
              </div>
              {/* Google */}
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#2B7FFF] p-2">
                  {/* Google logo placeholder */}
                  <Search size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">Google</span>
              </div>
              {/* Ollama */}
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-[#AD46FF] p-2">
                  {/* Ollama logo placeholder */}
                  <Zap size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700">Ollama</span>
              </div>
            </div>
          </div>

          {/* Content Types */}
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-6 justify-center lg:justify-start">
              <Star className="h-5 w-5 mr-2 text-blue-500" /> Create Any Content
              Type
            </h3>
            <div className="grid gap-4">
              {/* Ad Copy */}
              <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-600">
                    {/* Icon for Ad Copy */}
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
              {/* Social Posts */}
              <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-50 p-2 text-green-600">
                    {/* Icon for Social Posts */}
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
              {/* Blog Posts */}
              <div className="flex items-center justify-between p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-50 p-2 text-purple-600">
                    {/* Icon for Blog Posts */}
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
