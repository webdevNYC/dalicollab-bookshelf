'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, Download, Palette } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-orange-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-800">MyMiniShelf</h1>
          </div>
          <Link href="/builder">
            <Button className="bg-dali-blue hover:bg-blue-600 text-white">
              Start Building
            </Button>
          </Link>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-blue-500 to-orange-400 bg-clip-text text-transparent">
            Build Your Dream
            <br />
            Mini Bookshelf
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create beautiful custom miniature bookshelves with real book titles, 
            personalized spines, and custom covers. Perfect for your desk, shelf, or as a unique gift!
          </p>
          <Link href="/builder">
            <Button size="lg" className="bg-dali-pink hover:bg-pink-600 text-white text-lg px-8 py-4">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Creating Now
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Real Book Titles</h3>
            <p className="text-gray-600">
              Search from millions of real books using our integrated book database. 
              Get authentic titles, authors, and cover designs automatically.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Custom Covers</h3>
            <p className="text-gray-600">
              Use original covers, upload your own designs, or generate stunning 
              AI-powered covers that match your vision perfectly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Print or Order</h3>
            <p className="text-gray-600">
              Download your creation as a PDF for DIY printing, or submit it to 
              DaliCollab for professional production and delivery.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-pink-500 to-blue-500 rounded-3xl p-12 text-white max-w-4xl mx-auto"
        >
          <h3 className="text-4xl font-bold mb-6">Ready to Build Your Shelf?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of book lovers who have created their perfect miniature library
          </p>
          <Link href="/builder">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Your Creation
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>© 2024 MyMiniShelf. Need help? Contact support@dalicollab.com</p>
      </footer>
    </div>
  );
}