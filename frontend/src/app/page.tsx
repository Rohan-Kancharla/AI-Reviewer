"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle, FileText, Zap } from "lucide-react";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <nav className="fixed w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Bot className="text-purple-500" />
            <span>AI Reviewer</span>
          </div>
          <div className="flex items-center gap-4">
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" />
            <Link href="/dashboard" className="text-sm hover:text-purple-400 transition-colors">Dashboard</Link>
            <UserButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300"
          >
            <Zap size={16} />
            <span>Powered by GPT-4 & LangChain</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
          >
            Improve your resume using <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              autonomous AI.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-400 max-w-2xl mx-auto"
          >
            Upload your resume and let our AI agent analyze, score, and rewrite it for maximum ATS compatibility. Real workflows, real results.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <Link href="/upload">
              <button className="h-12 px-8 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2">
                Try Now <ArrowRight size={18} />
              </button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <button className="h-12 px-8 rounded-full bg-white/5 border border-white/10 font-medium hover:bg-white/10 transition-colors text-white">
                GitHub
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "ATS Score", icon: FileText, desc: "Calculate your resume's match rate against top systems." },
            { title: "Job Matching", icon: CheckCircle, desc: "AI automatically recommends the best roles for your skills." },
            { title: "AI Rewrite", icon: Bot, desc: "Instantly re-write your professional summary." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
            >
              <feature.icon className="text-purple-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-neutral-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
