import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Shield,
  Coins,
  ArrowRight,
  Check,
  Star,
  TrendingUp,
  Globe,
  Zap,
  Award,
  BarChart3,
} from "lucide-react";
import { useAppKit } from "@reown/appkit/react";

const features = [
  {
    icon: Building2,
    title: "Property Tokenization",
    description:
      "Convert real estate into digital tokens for fractional ownership and seamless trading on blockchain.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Secure & Verified",
    description:
      "All properties undergo rigorous verification with blockchain-secured ownership records.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Coins,
    title: "DeFi Lending",
    description:
      "Use property tokens as collateral to access instant liquidity through decentralized lending.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Cross-Chain Bridge",
    description:
      "Transfer assets seamlessly between Ethereum, Polygon, and other supported networks.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description:
      "Track performance with real-time analytics and comprehensive portfolio insights.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Globe,
    title: "Global Access",
    description:
      "Invest in real estate worldwide with 24/7 trading and instant settlement.",
    gradient: "from-teal-500 to-blue-500",
  },
];

const stats = [
  { label: "Total Value Locked", value: "$24.8M", change: "+18.2%" },
  { label: "Properties Tokenized", value: "1,247", change: "+156 this month" },
  { label: "Active Investors", value: "12,341", change: "+2,341 this week" },
  { label: "Loans Processed", value: "$8.9M", change: "+89 active" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Real Estate Investor",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "SecuritiFi revolutionized how I invest in real estate. The tokenization process is seamless and the returns are impressive.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Property Developer",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "The platform made it easy to raise capital for my developments. The blockchain verification gives investors confidence.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "DeFi Enthusiast",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content:
      "Finally, a way to combine real estate with DeFi. The lending features are game-changing for liquidity access.",
    rating: 5,
  },
];

const Landing: React.FC = () => {
  const { open } = useAppKit();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await open();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                SecuritiFi
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Real Estate DeFi
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#stats"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Stats
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Reviews
              </a>
            </div>
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center space-x-2"
            >
              <span>{isConnecting ? "Connecting..." : "Launch App"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-gray-200 dark:border-gray-700">
                <Zap className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Powered by Blockchain Technology
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-gray-900 dark:text-white">Tokenize</span>
                <br />
                <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                  Real Estate
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Unlock</span>
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {" "}
                  Liquidity
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Transform real estate investment with cutting-edge blockchain
                technology. Tokenize properties, access DeFi lending, and trade
                fractional ownership across multiple chains with
                institutional-grade security.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <span>
                    {isConnecting ? "Connecting..." : "Start Investing"}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>SEC Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Audited Smart Contracts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>24/7 Trading</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/10 dark:bg-gray-800/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl"></div>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {stats.slice(0, 4).map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50"
                      >
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {stat.label}
                        </div>
                        <div className="text-xs text-green-500 font-medium">
                          {stat.change}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Portfolio Performance</h3>
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-bold mb-2">+24.8%</div>
                    <div className="text-sm opacity-90">
                      Average Annual Return
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-accent-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-y border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Thousands of Investors
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join the future of real estate investment
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-green-500 font-medium">
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Industry Leading Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need for
              <span className="block bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Real Estate DeFi
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools and features designed to revolutionize how you
              invest, trade, and manage real estate assets in the decentralized
              economy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-800"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real stories from real investors who transformed their portfolios
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Revolutionize
              <span className="block">Your Real Estate Portfolio?</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who are already tokenizing their real
              estate assets and accessing unprecedented liquidity in the DeFi
              ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>
                  {isConnecting ? "Connecting..." : "Start Your Journey"}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white/30 text-white hover:border-white/50 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">SecuritiFi</span>
                  <p className="text-xs text-gray-400">Real Estate DeFi</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Democratizing real estate investment through blockchain
                technology. Building the future of property ownership and
                liquidity.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Audited by CertiK</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">SEC Compliant</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Properties
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Lending
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bridge
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 SecuritiFi. All rights reserved. Built with ❤️ for the
              future of real estate.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
