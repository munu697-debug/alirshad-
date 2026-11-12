"use client";

import { useState } from "react";
import { Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-fade-in">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 inline-block">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-3">
          Contact & Editorial Submissions
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-lg mx-auto">
          We welcome pitches, articles, essays, and reader feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <Mail className="w-5 h-5 text-accent mb-2" />
            <h4 className="font-bold text-sm text-primary mb-1">Direct Editorial Email</h4>
            <a
              href="mailto:info@alirshad.in"
              className="text-xs text-secondary hover:text-accent break-all"
            >
              info@alirshad.in
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <MessageCircle className="w-5 h-5 text-green-600 mb-2" />
            <h4 className="font-bold text-sm text-primary mb-1">WhatsApp Community</h4>
            <a
              href="https://chat.whatsapp.com/Gj9KdYNHJaj7BHGxlU4DFI"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-green-600 hover:underline inline-block mt-1 font-medium"
            >
              Join WhatsApp Readers Group &rarr;
            </a>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-primary mb-1">Thank you for writing to us!</h3>
              <p className="text-xs text-secondary mb-4">
                Our editorial team has received your submission and will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-gray-100 text-xs font-semibold rounded-xl hover:bg-gray-200"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Subject / Article Pitch</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
                  placeholder="e.g. Article Submission: Reflection on Malabar Literature"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Message or Synopsis</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface border border-gray-200 rounded-xl focus:outline-none focus:border-accent resize-y font-malayalam"
                  placeholder="Provide your message or article synopsis..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
