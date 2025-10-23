/**
 * Sample Templates for Dynamic Blocks
 * 
 * Pre-configured templates with example data that are automatically set up
 * when users add a Dynamic Block to their page
 */

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  dataSource: {
    type: 'static' | 'graphql' | 'api';
    data?: any;
    staticData?: any;
    query?: string;
    variables?: any;
    endpoint?: string;
  };
  variables: Record<string, any>;
  preview?: string;
}

/**
 * Product Grid Template
 * Perfect for showcasing featured products
 */
export const productGridTemplate: SampleTemplate = {
  id: 'product-grid',
  name: 'Product Grid',
  description: 'Display products in a responsive grid with images, prices, and descriptions',
  template: `
<div class="product-grid-container p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
  <h2 class="text-3xl font-bold mb-2">{{title}}</h2>
  <p class="text-gray-600 mb-6">{{subtitle}}</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {{#each products}}
    <div class="product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <img src="{{this.image}}" alt="{{this.name}}" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h3 class="font-semibold text-lg mb-2">{{this.name}}</h3>
        <p class="text-gray-600 text-sm mb-3">{{this.description}}</p>
        <div class="flex justify-between items-center">
          <span class="text-xl font-bold text-blue-600">{{this.price}}</span>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
    {{/each}}
  </div>
</div>
  `,
  dataSource: {
    type: 'static',
    staticData: {
      title: 'Featured Products',
      subtitle: 'Discover our best-selling products with premium quality and affordable prices',
      products: [
        {
          id: 1,
          name: 'MacBook Pro M3',
          price: '$1,999',
          description: 'Powerful laptop for professionals with M3 chip and stunning display',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        },
        {
          id: 2,
          name: 'iPhone 15 Pro',
          price: '$1,099',
          description: 'Latest smartphone with advanced camera system and A17 Pro chip',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        },
        {
          id: 3,
          name: 'AirPods Pro',
          price: '$249',
          description: 'Premium wireless earbuds with noise cancellation and spatial audio',
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
        },
      ],
    },
  },
  variables: {},
};

/**
 * Task Dashboard Template
 * Great for project management and task organization
 */
export const taskDashboardTemplate: SampleTemplate = {
  id: 'task-dashboard',
  name: 'Task Dashboard',
  description: 'Organize tasks in a Kanban-style dashboard with status columns',
  template: `
<div class="task-dashboard-container p-8 bg-gray-50 rounded-lg">
  <h2 class="text-3xl font-bold mb-2">{{projectName}}</h2>
  <p class="text-gray-600 mb-6">Track your project progress across different stages</p>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Todo Column -->
    <div class="column bg-white rounded-lg shadow-md p-4">
      <h3 class="font-bold text-lg mb-4 text-red-600">📋 To Do ({{todoCount}})</h3>
      <div class="space-y-3">
        {{#each todoTasks}}
        <div class="task-card bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
          <h4 class="font-semibold">{{this.title}}</h4>
          <p class="text-sm text-gray-600">{{this.description}}</p>
          <div class="mt-2 flex justify-between items-center text-xs">
            <span class="text-red-600 font-semibold">{{this.priority}}</span>
            <span class="text-gray-500">{{this.dueDate}}</span>
          </div>
        </div>
        {{/each}}
      </div>
    </div>
    
    <!-- In Progress Column -->
    <div class="column bg-white rounded-lg shadow-md p-4">
      <h3 class="font-bold text-lg mb-4 text-yellow-600">⚙️ In Progress ({{inProgressCount}})</h3>
      <div class="space-y-3">
        {{#each inProgressTasks}}
        <div class="task-card bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">
          <h4 class="font-semibold">{{this.title}}</h4>
          <p class="text-sm text-gray-600">{{this.description}}</p>
          <div class="mt-2 flex justify-between items-center text-xs">
            <span class="text-yellow-600 font-semibold">{{this.priority}}</span>
            <span class="text-gray-500">Assigned to: {{this.assignee}}</span>
          </div>
        </div>
        {{/each}}
      </div>
    </div>
    
    <!-- Done Column -->
    <div class="column bg-white rounded-lg shadow-md p-4">
      <h3 class="font-bold text-lg mb-4 text-green-600">✅ Done ({{doneCount}})</h3>
      <div class="space-y-3">
        {{#each doneTasks}}
        <div class="task-card bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
          <h4 class="font-semibold line-through text-gray-600">{{this.title}}</h4>
          <p class="text-sm text-gray-500">{{this.description}}</p>
        </div>
        {{/each}}
      </div>
    </div>
  </div>
</div>
  `,
  dataSource: {
    type: 'static',
    staticData: {
      projectName: 'Website Redesign',
      todoCount: 2,
      inProgressCount: 2,
      doneCount: 2,
      todoTasks: [
        {
          id: 1,
          title: 'Design mockups',
          description: 'Create wireframes and prototypes for new features',
          priority: 'HIGH',
          dueDate: '2025-10-20',
        },
        {
          id: 2,
          title: 'Write specifications',
          description: 'Document technical requirements',
          priority: 'MEDIUM',
          dueDate: '2025-10-22',
        },
      ],
      inProgressTasks: [
        {
          id: 3,
          title: 'Frontend development',
          description: 'Implement React components and styling',
          priority: 'HIGH',
          assignee: 'John Doe',
        },
        {
          id: 4,
          title: 'API integration',
          description: 'Connect frontend to backend services',
          priority: 'HIGH',
          assignee: 'Jane Smith',
        },
      ],
      doneTasks: [
        {
          id: 5,
          title: 'Research phase',
          description: 'Completed market analysis and competitor review',
          priority: 'MEDIUM',
        },
        {
          id: 6,
          title: 'Project kickoff',
          description: 'Team meeting and project planning complete',
          priority: 'HIGH',
        },
      ],
    },
  },
  variables: {},
};

/**
 * Category Showcase Template
 * Display product or content categories with icons and links
 */
export const categoryShowcaseTemplate: SampleTemplate = {
  id: 'category-showcase',
  name: 'Category Showcase',
  description: 'Display categories with images and product counts in a hero-style layout',
  template: `
<div class="category-showcase-container py-12 px-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
  <h2 class="text-3xl font-bold mb-2 text-center">{{title}}</h2>
  <p class="text-gray-600 mb-8 text-center">Browse our collections</p>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {{#each categories}}
    <div class="category-card group cursor-pointer transform hover:scale-105 transition-transform duration-300">
      <div class="relative overflow-hidden rounded-lg shadow-lg h-64">
        <img src="{{this.image}}" alt="{{this.name}}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        <div class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end p-4">
          <h3 class="text-white font-bold text-2xl">{{this.name}}</h3>
          <p class="text-white text-sm">{{this.productCount}} products</p>
        </div>
      </div>
    </div>
    {{/each}}
  </div>
</div>
  `,
  dataSource: {
    type: 'static',
    staticData: {
      title: 'Shop by Category',
      categories: [
        {
          id: 1,
          name: 'Electronics',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
          productCount: 150,
        },
        {
          id: 2,
          name: 'Fashion',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
          productCount: 89,
        },
        {
          id: 3,
          name: 'Home & Garden',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          productCount: 67,
        },
      ],
    },
  },
  variables: {},
};

/**
 * Hero Section Template
 * Large banner section with title, subtitle and CTA button
 */
export const heroSectionTemplate: SampleTemplate = {
  id: 'hero-section',
  name: 'Hero Section',
  description: 'Large banner section with background image, headline and CTA button',
  template: `
<div class="hero-section relative overflow-hidden rounded-lg h-96 md:h-[500px]">
  <img src="{{backgroundImage}}" alt="Hero" class="absolute inset-0 w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black bg-opacity-40"></div>
  
  <div class="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
    <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl">{{title}}</h1>
    <p class="text-lg md:text-xl text-white mb-8 max-w-2xl">{{subtitle}}</p>
    <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
      {{ctaText}}
    </button>
  </div>
</div>
  `,
  dataSource: {
    type: 'static',
    staticData: {
      title: 'Turn Ideas Into Reality',
      subtitle: 'Build professional websites with cutting-edge technology. No coding required.',
      ctaText: 'Start Building Now',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop',
    },
  },
  variables: {},
};

/**
 * Testimonials Template
 * Display customer testimonials with avatars and ratings
 */
export const testimonialsTemplate: SampleTemplate = {
  id: 'testimonials',
  name: 'Testimonials',
  description: 'Showcase customer testimonials with avatars, names, and star ratings',
  template: `
<div class="testimonials-container py-12 px-6 bg-gray-50 rounded-lg">
  <h2 class="text-3xl font-bold mb-2 text-center">{{title}}</h2>
  <p class="text-gray-600 mb-8 text-center">Read what our happy customers have to say</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {{#each testimonials}}
    <div class="testimonial-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div class="flex items-center mb-4">
        <img src="{{this.avatar}}" alt="{{this.name}}" class="w-12 h-12 rounded-full object-cover mr-4" />
        <div>
          <h3 class="font-bold">{{this.name}}</h3>
          <p class="text-sm text-gray-600">{{this.position}}</p>
        </div>
      </div>
      
      <div class="flex mb-3 text-yellow-400">
        {{#range this.rating}}⭐{{/range}}
      </div>
      
      <p class="text-gray-700 italic">"{{this.content}}"</p>
    </div>
    {{/each}}
  </div>
</div>
  `,
  dataSource: {
    type: 'static',
    staticData: {
      title: 'What Our Customers Say',
      testimonials: [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          position: 'CEO, Tech Startup',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
          content: 'Excellent service! The team is very professional and supportive. Our website traffic increased by 300%.',
          rating: 5,
        },
        {
          id: 2,
          name: 'Trần Thị B',
          position: 'Marketing Manager, Fashion Brand',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
          content: 'Beautiful design, complete features, and fast loading speed. Definitely worth the investment!',
          rating: 5,
        },
        {
          id: 3,
          name: 'Lê Minh C',
          position: 'Founder, E-commerce Store',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
          content: 'Since using this platform, our online sales have doubled. Highly recommended to everyone!',
          rating: 5,
        },
      ],
    },
  },
  variables: {},
};

/**
 * Contact Form Template
 * Display contact information and form
 */
export const contactFormTemplate: SampleTemplate = {
  id: 'contact-form',
  name: 'Contact Form',
  description: 'Display contact information and a contact form',
  template: `
<div class="contact-container p-8 bg-white rounded-lg">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold mb-2">{{title}}</h2>
    <p class="text-gray-600 mb-8">{{description}}</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div class="space-y-4">
        <div class="flex items-start">
          <span class="text-blue-600 text-2xl mr-4">✉️</span>
          <div>
            <h3 class="font-bold">Email</h3>
            <p class="text-gray-600">{{email}}</p>
          </div>
        </div>
        <div class="flex items-start">
          <span class="text-blue-600 text-2xl mr-4">📞</span>
          <div>
            <h3 class="font-bold">Phone</h3>
            <p class="text-gray-600">{{phone}}</p>
          </div>
        </div>
        <div class="flex items-start">
          <span class="text-blue-600 text-2xl mr-4">📍</span>
          <div>
            <h3 class="font-bold">Address</h3>
            <p class="text-gray-600">{{address}}</p>
          </div>
        </div>
      </div>
      
      <form class="space-y-4">
        <input type="text" placeholder="Your Name" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        <input type="email" placeholder="Your Email" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        <textarea placeholder="Your Message" class="w-full px-4 py-2 border border-gray-300 rounded-lg h-24"></textarea>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Send Message
        </button>
      </form>
    </div>
  </div>
</div>
  `,
  dataSource: {
    type: 'static',
    staticData: {
      title: 'Get in Touch',
      description: 'We are always ready to help. Leave your information and we will respond within 24 hours.',
      email: 'hello@katacore.com',
      phone: '+84 (0) 123 456 789',
      address: 'Floor 10, ABC Building, 123 DEF Street, District 1, Ho Chi Minh City',
    },
  },
  variables: {},
};

/**
 * FAQ Section Template
 * Display frequently asked questions
 */
export const faqTemplate: SampleTemplate = {
  id: 'faq-section',
  name: 'FAQ Section',
  description: 'Collapsible FAQ section with common questions and answers',
  template: `
<div class="faq-container py-12 px-6 bg-gray-50 rounded-lg">
  <h2 class="text-3xl font-bold mb-2 text-center">{{title}}</h2>
  <p class="text-gray-600 mb-8 text-center">Find answers to common questions</p>
  
  <div class="max-w-2xl mx-auto space-y-4">
    {{#each faqs}}
    <div class="faq-item bg-white p-4 rounded-lg shadow-md">
      <button class="w-full flex justify-between items-center font-bold text-lg hover:text-blue-600 transition-colors">
        <span>{{this.question}}</span>
        <span class="text-blue-600">+</span>
      </button>
      <p class="hidden text-gray-600 mt-3 pt-3 border-t">{{this.answer}}</p>
    </div>
    {{/each}}
  </div>
  
  <p class="text-center text-gray-600 mt-8">Still have questions? Contact our support team!</p>
</div>
  `,
  dataSource: {
    type: 'static',
    staticData: {
      title: 'Frequently Asked Questions',
      faqs: [
        {
          id: 1,
          question: 'Do I need coding knowledge to design a website?',
          answer: 'Not at all! Our platform is designed with an intuitive drag-and-drop interface. You just drag components and customize them to your needs without writing any code.',
        },
        {
          id: 2,
          question: 'How many templates are available?',
          answer: 'We provide 100+ professional templates for different industries: e-commerce, business, portfolio, blog, landing pages, and more. New templates are added regularly.',
        },
        {
          id: 3,
          question: 'Are websites responsive on mobile devices?',
          answer: 'Yes! All templates and components are fully responsive and optimized for all devices - desktop, tablet, and mobile phones.',
        },
        {
          id: 4,
          question: 'Do you support SEO?',
          answer: 'Absolutely! We include complete SEO features: meta tags, sitemap generation, structured data, image optimization, and page speed optimization.',
        },
        {
          id: 5,
          question: 'Can I integrate custom code?',
          answer: 'Yes! While our platform is no-code friendly, you can also add custom HTML, CSS, and JavaScript for advanced customizations.',
        },
      ],
    },
  },
  variables: {},
};

/**
 * Get all available sample templates
 */
export const getAllSampleTemplates = (): SampleTemplate[] => {
  return [
    productGridTemplate,
    taskDashboardTemplate,
    categoryShowcaseTemplate,
    heroSectionTemplate,
    testimonialsTemplate,
    contactFormTemplate,
    faqTemplate,
  ];
};

/**
 * Get a random sample template
 */
export const getRandomSampleTemplate = (): SampleTemplate => {
  const templates = getAllSampleTemplates();
  return templates[Math.floor(Math.random() * templates.length)];
};

/**
 * Get sample template by ID
 */
export const getSampleTemplateById = (id: string): SampleTemplate | undefined => {
  const templates = getAllSampleTemplates();
  return templates.find(t => t.id === id);
};
