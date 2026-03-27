import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Image, Wand2, Database } from 'lucide-react';

const tools = [
  {
    title: 'AI Text Generator',
    description: 'Generate blogs, captions, and high-quality content using advanced AI models.',
    icon: Sparkles,
    gradient: 'from-indigo-500 to-purple-500',
    path: '/ai/text-generator',
  },
  {
    title: 'AI Image Generator',
    description: 'Create stunning AI-generated images from text prompts instantly.',
    icon: Image,
    gradient: 'from-pink-500 to-rose-500',
    path: '/ai/image-generator',
  },
  {
    title: 'Image Gallery',
    description: 'Browse, search and manage images stored in Cloudinary with advanced filters.',
    icon: Image,
    gradient: 'from-orange-400 to-yellow-500',
    path: '/gallery',
  },
  {
    title: 'Image Editor',
    description: 'Transform images with crop, resize, blur, rotate and more using Cloudinary.',
    icon: Wand2,
    gradient: 'from-yellow-500 to-orange-600',
    path: '/editor',
  },
  {
    title: 'Cloud Storage',
    description: 'Securely store and manage files with scalable AWS S3 cloud storage.',
    icon: Database,
    gradient: 'from-gray-700 to-gray-900',
    path: '/storage',
  },
  {
    title: 'Resume Reviewer',
    description: 'Analyze and improve your resume with AI-powered suggestions.',
    icon: FileText,
    gradient: 'from-teal-500 to-cyan-500',
    path: '/ai/resume-review',
  },
];

const ToolsSection = () => {
  const navigate = useNavigate();

  return (
    <section className='w-full'>
      <div className='container mx-auto sm:px-4'>
        {/* Heading */}
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
            Powerful <span className='text-indigo-600'>Tools Suite</span>
          </h2>
          <p className='text-gray-500 mt-3'>
            Everything you need to manage, edit and enhance your images with modern tools and AI
            powered features.
          </p>
        </div>

        {/* Tools Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-3 sm:gap-6 gap-3'>
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => navigate(tool.path)}
                className='group cursor-pointer rounded-2xl sm:p-6 p-3 bg-white/70 backdrop-blur shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
                {/* Icon */}
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl text-white mb-4 bg-gradient-to-br ${tool.gradient}`}>
                  <Icon className='w-6 h-6' />
                </div>

                {/* Content */}
                <h3 className='text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition'>
                  {tool.title}
                </h3>
                <p className='text-sm text-gray-500 mt-2'>{tool.description}</p>

                {/* Hover Indicator */}
                <div className='mt-4 text-sm text-indigo-600 opacity-0 group-hover:opacity-100 transition'>
                  Explore →
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
