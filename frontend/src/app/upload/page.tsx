"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, File, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const AGENT_STEPS = [
  "Reading Resume...",
  "Extracting Text...",
  "Calling Skill Extractor...",
  "Calculating ATS Score...",
  "Finding Missing Skills...",
  "Matching Recommended Jobs...",
  "Generating Final Report...",
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [report, setReport] = useState<any>(null);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    // Start interval to simulate Agent Steps dynamically while requesting
    let step = 0;
    const interval = setInterval(() => {
      step = step < AGENT_STEPS.length - 1 ? step + 1 : step;
      setCurrentStep(step);
    }, 1200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", "guest");

      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      clearInterval(interval);
      setCurrentStep(AGENT_STEPS.length - 1);
      
      if (response.data?.report) {
         setReport(response.data.report);
         localStorage.setItem("resumeReport", JSON.stringify(response.data.report));
      }
      
      setTimeout(() => {
         setIsUploading(false);
         setIsComplete(true);
      }, 500);

    } catch (error) {
      clearInterval(interval);
      console.error(error);
      setIsUploading(false);
      alert("Failed to analyze resume. Make sure backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10" />
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="text-sm text-neutral-400 hover:text-white mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Upload Resume</h1>
          <p className="text-neutral-400">Let our autonomous AI analyze and review your resume.</p>
        </div>

        {!isComplete ? (
          <div className="space-y-6">
            <div 
              {...getRootProps()} 
              className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isDragActive ? "border-purple-500 bg-purple-500/10" : "border-white/20 bg-white/[0.02] hover:bg-white/[0.04]"
              } ${file ? "border-green-500/50 bg-green-500/5" : ""}`}
            >
              <input {...getInputProps()} />
              
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <File size={32} />
                  </div>
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-neutral-400">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                    <UploadCloud size={32} />
                  </div>
                  <div>
                    <p className="font-medium text-white">Drag & drop your file here</p>
                    <p className="text-sm">Or click to browse (PDF, DOCX up to 5MB)</p>
                  </div>
                </div>
              )}
            </div>

            {file && !isUploading && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleUpload}
                className="w-full h-12 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Analyze Resume with AI
              </motion.button>
            )}

            {isUploading && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3 font-medium text-purple-400">
                  <Loader2 className="animate-spin" size={20} />
                  Agent Workflow in Progress
                </div>
                
                <div className="space-y-3">
                  {AGENT_STEPS.map((step, idx) => {
                    const isPast = idx < currentStep;
                    const isActive = idx === currentStep;
                    
                    return (
                      <div key={idx} className={`flex items-center gap-3 text-sm ${isActive ? "text-white" : isPast ? "text-neutral-500" : "text-neutral-700 opacity-50"}`}>
                        {isPast ? <CheckCircle2 className="text-green-500" size={16} /> : 
                         isActive ? <Loader2 className="animate-spin text-purple-400" size={16} /> : 
                         <div className="w-4 h-4 rounded-full border border-neutral-700" />}
                        {step}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center space-y-6"
          >
            <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Analysis Complete!</h2>
              <p className="text-neutral-400">Your resume has been successfully graded.</p>
            </div>
            
            <Link href="/dashboard" className="inline-block">
              <button className="h-12 px-8 bg-white text-black font-medium rounded-full flex items-center gap-2 hover:bg-neutral-200 transition-colors">
                View Report Dashboard <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
