"use client";

import { motion } from "framer-motion";
import { Download, FileText, Target, TrendingUp, CheckCircle, AlertTriangle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [report, setReport] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("resumeReport");
    if (saved) {
      try {
        setReport(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleDownload = async () => {
    if (!report) return;
    try {
      const response = await fetch("http://localhost:8000/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report)
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Resume_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert("Failed to download PDF");
    }
  };

  const handleReset = () => {
    localStorage.removeItem("resumeReport");
    router.push("/upload");
  };

  const atsScore = report?.ats_score || 0;
  const skillsCount = report?.skills?.length || 0;
  const missingCount = report?.missing_skills?.length || 0;
  const recommendedRole = report?.recommended_role || "Unknown";
  const actionsCount = 18; // could be extracted in a deeper AI analysis

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30">
      <nav className="fixed w-full z-50 border-b border-white/10 bg-neutral-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <span className="text-purple-500">AI</span> Planner
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/upload" className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              New Scan
            </Link>
            <UserButton />
          </div>
        </div>
      </nav>

      <div className="pt-24 px-6 max-w-7xl mx-auto pb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resume Report</h1>
            <p className="text-neutral-400">Scan Complete</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg font-medium transition-colors text-sm">
              <RefreshCcw size={16} /> Reset
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors text-sm">
              <Download size={16} /> Download PDF
            </button>
          </div>        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* ATS Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 md:col-span-1 p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center"
          >
            <h3 className="text-lg font-medium mb-4 text-neutral-300">ATS Match Score</h3>
            <div className="relative h-32 w-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" className="stroke-neutral-800" strokeWidth="8" fill="none" />
                <circle cx="64" cy="64" r="60" className="stroke-green-500" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset={`${377 - (377 * atsScore) / 100}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
                {atsScore}
              </div>
            </div>
            <p className="mt-4 text-sm text-green-400 font-medium">Good ATS Compatibility</p>
          </motion.div>

          {/* Quick Stats */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
            <StatsCard title="Extracted Skills" value={skillsCount.toString()} icon={TrendingUp} />
            <StatsCard title="Missing Keywords" value={missingCount.toString()} icon={AlertTriangle} color="text-orange-400" />
            <StatsCard title="Recommended Role" value={recommendedRole} icon={Target} color="text-purple-400" />
            <StatsCard title="Action Verbs Used" value={actionsCount.toString()} icon={CheckCircle} color="text-blue-400" />
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" /> AI Improved Summary
            </h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-neutral-300 text-sm leading-relaxed">
              {report?.improved_summary || "Upload a resume to generate an AI improved summary."}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-orange-400" /> Key Suggestions
            </h3>
            <ul className="space-y-3">
              {(report?.suggestions || []).map((suggestion: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-neutral-300">
                  <span className="h-5 w-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color = "text-white" }: { title: string, value: string, icon: any, color?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-center"
    >
      <div className="flex items-center gap-3 mb-2 text-neutral-400">
        <Icon size={18} /> <span className="text-sm font-medium">{title}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </motion.div>
  );
}
