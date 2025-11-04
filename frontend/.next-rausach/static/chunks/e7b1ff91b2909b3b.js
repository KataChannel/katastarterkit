(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,56419,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(706547),r=e.i(138227),i=e.i(791174),l=e.i(373612),n=e.i(844596),o=e.i(240243),c=e.i(426453),c=c,d=e.i(885205),p=e.i(775680),u=e.i(137651);function h(e,t){switch(t.type){case"SET_EDITING":return{...e,isEditing:t.payload};case"SET_FULLSCREEN_EDITOR":return{...e,isFullscreenEditor:t.payload};case"SET_EDIT_CONFIG":return{...e,editConfig:t.payload};case"SET_SELECTED_TEMPLATE":return{...e,selectedTemplate:t.payload};case"SET_TEMPLATE_EDIT":return{...e,templateEdit:t.payload};case"SET_DATA_LOADING":return{...e,loading:t.payload};case"SET_DATA":return{...e,data:t.payload,error:null};case"SET_ERROR":return{...e,error:t.payload};case"SET_STATIC_DATA_TEXT":return{...e,staticDataText:t.payload};case"SET_STATIC_DATA_ERROR":return{...e,staticDataError:t.payload.error,hasValidationError:t.payload.hasError};case"RESET_STATIC_DATA_VALIDATION":return{...e,staticDataError:null,hasValidationError:!1};case"SET_REPEATER_DATA_TEXT":return{...e,repeaterDataText:t.payload};case"SET_REPEATER_DATA_ERROR":return{...e,repeaterDataError:t.payload.error,repeaterValidationError:t.payload.hasError,repeaterItemsData:t.payload.items};case"RESET_REPEATER_DATA_VALIDATION":return{...e,repeaterDataError:null,repeaterValidationError:!1};case"SET_LIMIT_TEXT":return{...e,limitText:t.payload};case"SET_LIMIT_ERROR":return{...e,limitError:t.payload.error,limitValidationError:t.payload.hasError};case"RESET_LIMIT_VALIDATION":return{...e,limitError:null,limitValidationError:!1};case"SET_API_TEST_LOADING":return{...e,apiTestLoading:t.payload};case"SET_API_TEST_RESULT":return{...e,apiTestResult:t.payload,apiTestError:null};case"SET_API_TEST_ERROR":return{...e,apiTestError:t.payload};case"RESET_API_TEST":return{...e,apiTestResult:null,apiTestLoading:!1,apiTestError:null};default:return e}}async function m(e){let t={"Content-Type":"application/json"};e.token&&(t.Authorization=`Bearer ${e.token}`);let a=e.method||"POST",s="POST"===a?JSON.stringify(e.variables||{}):void 0,r=await fetch(e.endpoint||"",{method:a,headers:t,body:s});if(!r.ok)throw Error(`HTTP ${r.status}: ${r.statusText}`);return await r.json()}async function x(e){let t={"Content-Type":"application/json"};e.token&&(t.Authorization=`Bearer ${e.token}`);let a=await fetch(e.endpoint||"/graphql",{method:"POST",headers:t,body:JSON.stringify({query:e.query,variables:e.variables})});if(!a.ok)throw Error(`HTTP ${a.status}: ${a.statusText}`);let s=await a.json();if(s.errors)throw Error(s.errors[0]?.message||"GraphQL Error");return s.data}async function g(e){try{if("graphql"===e.type)return await x(e);if("api"===e.type)return await m(e)}catch(e){throw e}}function b(e,t=!1){let a=e.trim();if(!a||a===(t?"[]":"{}"))return{isValid:!0,data:t?[]:{},error:null};try{let e=JSON.parse(a);if(t&&!Array.isArray(e))return{isValid:!1,data:null,error:"Dữ liệu phải là một array"};return{isValid:!0,data:e,error:null}}catch(e){return{isValid:!1,data:null,error:"JSON format không hợp lệ - Kiểm tra lại cú pháp"}}}let f={id:"product-grid",name:"Product Grid",description:"Display products in a responsive grid with images, prices, and descriptions",template:`
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
  `,dataSource:{type:"static",staticData:{title:"Featured Products",subtitle:"Discover our best-selling products with premium quality and affordable prices",products:[{id:1,name:"MacBook Pro M3",price:"$1,999",description:"Powerful laptop for professionals with M3 chip and stunning display",image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"},{id:2,name:"iPhone 15 Pro",price:"$1,099",description:"Latest smartphone with advanced camera system and A17 Pro chip",image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop"},{id:3,name:"AirPods Pro",price:"$249",description:"Premium wireless earbuds with noise cancellation and spatial audio",image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop"}]}},variables:{}},v={id:"task-dashboard",name:"Task Dashboard",description:"Organize tasks in a Kanban-style dashboard with status columns",template:`
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
  `,dataSource:{type:"static",staticData:{projectName:"Website Redesign",todoCount:2,inProgressCount:2,doneCount:2,todoTasks:[{id:1,title:"Design mockups",description:"Create wireframes and prototypes for new features",priority:"HIGH",dueDate:"2025-10-20"},{id:2,title:"Write specifications",description:"Document technical requirements",priority:"MEDIUM",dueDate:"2025-10-22"}],inProgressTasks:[{id:3,title:"Frontend development",description:"Implement React components and styling",priority:"HIGH",assignee:"John Doe"},{id:4,title:"API integration",description:"Connect frontend to backend services",priority:"HIGH",assignee:"Jane Smith"}],doneTasks:[{id:5,title:"Research phase",description:"Completed market analysis and competitor review",priority:"MEDIUM"},{id:6,title:"Project kickoff",description:"Team meeting and project planning complete",priority:"HIGH"}]}},variables:{}},y={id:"category-showcase",name:"Category Showcase",description:"Display categories with images and product counts in a hero-style layout",template:`
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
  `,dataSource:{type:"static",staticData:{title:"Shop by Category",categories:[{id:1,name:"Electronics",image:"https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",productCount:150},{id:2,name:"Fashion",image:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",productCount:89},{id:3,name:"Home & Garden",image:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",productCount:67}]}},variables:{}},w={id:"hero-section",name:"Hero Section",description:"Large banner section with background image, headline and CTA button",template:`
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
  `,dataSource:{type:"static",staticData:{title:"Turn Ideas Into Reality",subtitle:"Build professional websites with cutting-edge technology. No coding required.",ctaText:"Start Building Now",backgroundImage:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop"}},variables:{}},T={id:"testimonials",name:"Testimonials",description:"Showcase customer testimonials with avatars, names, and star ratings",template:`
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
  `,dataSource:{type:"static",staticData:{title:"What Our Customers Say",testimonials:[{id:1,name:"Nguyễn Văn A",position:"CEO, Tech Startup",avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",content:"Excellent service! The team is very professional and supportive. Our website traffic increased by 300%.",rating:5},{id:2,name:"Trần Thị B",position:"Marketing Manager, Fashion Brand",avatar:"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",content:"Beautiful design, complete features, and fast loading speed. Definitely worth the investment!",rating:5},{id:3,name:"Lê Minh C",position:"Founder, E-commerce Store",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",content:"Since using this platform, our online sales have doubled. Highly recommended to everyone!",rating:5}]}},variables:{}},N={id:"contact-form",name:"Contact Form",description:"Display contact information and a contact form",template:`
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
  `,dataSource:{type:"static",staticData:{title:"Get in Touch",description:"We are always ready to help. Leave your information and we will respond within 24 hours.",email:"hello@rausachcore.com",phone:"+84 (0) 123 456 789",address:"Floor 10, ABC Building, 123 DEF Street, District 1, Ho Chi Minh City"}},variables:{}},E={id:"faq-section",name:"FAQ Section",description:"Collapsible FAQ section with common questions and answers",template:`
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
  `,dataSource:{type:"static",staticData:{title:"Frequently Asked Questions",faqs:[{id:1,question:"Do I need coding knowledge to design a website?",answer:"Not at all! Our platform is designed with an intuitive drag-and-drop interface. You just drag components and customize them to your needs without writing any code."},{id:2,question:"How many templates are available?",answer:"We provide 100+ professional templates for different industries: e-commerce, business, portfolio, blog, landing pages, and more. New templates are added regularly."},{id:3,question:"Are websites responsive on mobile devices?",answer:"Yes! All templates and components are fully responsive and optimized for all devices - desktop, tablet, and mobile phones."},{id:4,question:"Do you support SEO?",answer:"Absolutely! We include complete SEO features: meta tags, sitemap generation, structured data, image optimization, and page speed optimization."},{id:5,question:"Can I integrate custom code?",answer:"Yes! While our platform is no-code friendly, you can also add custom HTML, CSS, and JavaScript for advanced customizations."}]}},variables:{}},S={id:"product-carousel",name:"Product Carousel",description:"Auto-scrolling carousel showcasing featured products from your database",template:`
<div class="product-carousel-container py-12 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50 rounded-lg overflow-hidden">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {{title}}
      </h2>
      <p class="text-gray-600 text-lg">{{subtitle}}</p>
    </div>

    <!-- Carousel Container -->
    <div class="relative group">
      <!-- Navigation Buttons -->
      <button class="carousel-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button class="carousel-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      <!-- Carousel Track -->
      <div class="overflow-hidden">
        <div class="carousel-track flex gap-6 transition-transform duration-500 ease-out">
          {{#each products}}
          <div class="carousel-item flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
            <div class="product-card bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group/card h-full flex flex-col">
              <!-- Product Image -->
              <div class="relative overflow-hidden aspect-square bg-gray-100">
                {{#if this.thumbnail}}
                  <img src="{{this.thumbnail}}" alt="{{this.name}}" class="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
                {{else}}
                  <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                {{/if}}
                
                <!-- Badges -->
                <div class="absolute top-3 left-3 flex flex-col gap-2">
                  {{#if this.isFeatured}}
                    <span class="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">⭐ Featured</span>
                  {{/if}}
                  {{#if this.isOnSale}}
                    <span class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">🔥 Sale</span>
                  {{/if}}
                  {{#if this.isNewArrival}}
                    <span class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">✨ New</span>
                  {{/if}}
                </div>

                <!-- Discount Badge -->
                {{#if this.discountPercentage}}
                  <div class="absolute top-3 right-3">
                    <span class="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-2 rounded-lg shadow-lg">
                      -{{this.discountPercentage}}%
                    </span>
                  </div>
                {{/if}}
              </div>

              <!-- Product Info -->
              <div class="p-4 flex-grow flex flex-col">
                <!-- Category -->
                {{#if this.category}}
                  <p class="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">
                    {{this.category.name}}
                  </p>
                {{/if}}

                <!-- Product Name -->
                <h3 class="font-bold text-lg mb-2 line-clamp-2 group-hover/card:text-blue-600 transition-colors">
                  {{this.name}}
                </h3>

                <!-- Description -->
                {{#if this.shortDesc}}
                  <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{this.shortDesc}}</p>
                {{/if}}

                <!-- SKU & Stock -->
                <div class="flex items-center gap-3 mb-3 text-xs text-gray-500">
                  {{#if this.sku}}
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                      </svg>
                      {{this.sku}}
                    </span>
                  {{/if}}
                  <span class="flex items-center gap-1 {{#if this.stock}}{{#if (gt this.stock 0)}}text-green-600{{else}}text-red-600{{/if}}{{/if}}">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    {{#if this.stock}}
                      {{#if (gt this.stock 0)}}
                        C\xf2n {{this.stock}} {{this.unit}}
                      {{else}}
                        Hết h\xe0ng
                      {{/if}}
                    {{else}}
                      Li\xean hệ
                    {{/if}}
                  </span>
                </div>

                <!-- Pricing -->
                <div class="mt-auto">
                  <div class="flex items-baseline gap-2 mb-3">
                    <span class="text-2xl font-bold text-blue-600">
                      {{this.price}}đ
                    </span>
                    {{#if this.originalPrice}}
                      {{#if (gt this.originalPrice this.price)}}
                        <span class="text-sm text-gray-400 line-through">
                          {{this.originalPrice}}đ
                        </span>
                      {{/if}}
                    {{/if}}
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2">
                    <button class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span class="flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        Th\xeam giỏ
                      </span>
                    </button>
                    <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-3 rounded-lg transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {{/each}}
        </div>
      </div>

      <!-- Carousel Indicators -->
      <div class="flex justify-center gap-2 mt-6">
        {{#each products}}
          <button class="carousel-indicator w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" data-index="{{@index}}"></button>
        {{/each}}
      </div>
    </div>

    <!-- View All Button -->
    <div class="text-center mt-8">
      <button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
        Xem tất cả sản phẩm →
      </button>
    </div>
  </div>
</div>

<!-- Carousel Auto-scroll Script -->
<script>
(function() {
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const items = document.querySelectorAll('.carousel-item');
  
  if (!track || items.length === 0) return;
  
  let currentIndex = 0;
  const itemsPerView = window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  const maxIndex = Math.max(0, items.length - itemsPerView);
  let autoScrollInterval;
  
  function updateCarousel() {
    const itemWidth = items[0].offsetWidth;
    const gap = 24; // 1.5rem = 24px
    const offset = -(currentIndex * (itemWidth + gap));
    track.style.transform = \`translateX(\${offset}px)\`;
    
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('bg-blue-600', i === currentIndex);
      indicator.classList.toggle('bg-gray-300', i !== currentIndex);
    });
  }
  
  function nextSlide() {
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
  }
  
  function prevSlide() {
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateCarousel();
  }
  
  // Auto-scroll every 5 seconds
  function startAutoScroll() {
    autoScrollInterval = setInterval(nextSlide, 5000);
  }
  
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }
  
  // Event Listeners
  prevBtn?.addEventListener('click', () => {
    prevSlide();
    stopAutoScroll();
    startAutoScroll();
  });
  
  nextBtn?.addEventListener('click', () => {
    nextSlide();
    stopAutoScroll();
    startAutoScroll();
  });
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
      stopAutoScroll();
      startAutoScroll();
    });
  });
  
  // Pause on hover
  track.parentElement.addEventListener('mouseenter', stopAutoScroll);
  track.parentElement.addEventListener('mouseleave', startAutoScroll);
  
  // Initialize
  updateCarousel();
  startAutoScroll();
  
  // Handle resize
  window.addEventListener('resize', updateCarousel);
})();
</script>
  `,dataSource:{type:"static",staticData:{title:"Sản Phẩm Nổi Bật",subtitle:"Khám phá những sản phẩm được yêu thích nhất",products:[{id:"1",name:"Serum Vitamin C Dưỡng Trắng Da",slug:"serum-vitamin-c-duong-trang-da",shortDesc:"Làm sáng da, mờ thâm nám, tăng cường collagen tự nhiên",description:"Serum Vitamin C cao cấp giúp dưỡng trắng da hiệu quả",sku:"SER-VIT-C-001",price:299e3,originalPrice:45e4,unit:"Chai",stock:150,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",isFeatured:!0,isNewArrival:!1,isBestSeller:!0,isOnSale:!0,category:{id:"cat-1",name:"Chăm Sóc Da",slug:"cham-soc-da"}},{id:"2",name:"Bộ Dụng Cụ Nối Mi Chuyên Nghiệp",slug:"bo-dung-cu-noi-mi-chuyen-nghiep",shortDesc:"Bộ full dụng cụ nối mi cao cấp cho thợ chuyên nghiệp",description:"Bộ dụng cụ nối mi chuyên nghiệp đầy đủ nhất",sku:"NOI-MI-SET-001",price:125e4,originalPrice:18e5,unit:"Bộ",stock:45,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400&h=400&fit=crop",isFeatured:!0,isNewArrival:!0,isBestSeller:!1,isOnSale:!0,category:{id:"cat-2",name:"Nối Mi",slug:"noi-mi"}},{id:"3",name:"Kem Dưỡng Ẩm Hyaluronic Acid",slug:"kem-duong-am-hyaluronic-acid",shortDesc:"Cấp ẩm sâu, làm mềm mịn da, chống lão hóa hiệu quả",description:"Kem dưỡng ẩm chuyên sâu với Hyaluronic Acid",sku:"CREAM-HYA-001",price:38e4,originalPrice:52e4,unit:"Hộp",stock:200,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",isFeatured:!0,isNewArrival:!1,isBestSeller:!0,isOnSale:!1,category:{id:"cat-1",name:"Chăm Sóc Da",slug:"cham-soc-da"}},{id:"4",name:"Keo Nối Mi Hàn Quốc Premium",slug:"keo-noi-mi-han-quoc-premium",shortDesc:"Keo nối mi siêu dính, giữ lâu, không gây kích ứng",description:"Keo nối mi nhập khẩu Hàn Quốc chất lượng cao",sku:"GLUE-KR-PREM-001",price:45e4,originalPrice:null,unit:"Chai",stock:89,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop",isFeatured:!0,isNewArrival:!0,isBestSeller:!1,isOnSale:!1,category:{id:"cat-2",name:"Nối Mi",slug:"noi-mi"}},{id:"5",name:"Mực Phun Xăm Môi Organic",slug:"muc-phun-xam-moi-organic",shortDesc:"Mực phun xăm môi an toàn, màu chuẩn, lên màu đẹp tự nhiên",description:"Mực phun xăm môi organic cao cấp",sku:"INK-LIP-ORG-001",price:89e4,originalPrice:12e5,unit:"Lọ",stock:67,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",isFeatured:!0,isNewArrival:!1,isBestSeller:!0,isOnSale:!0,category:{id:"cat-3",name:"Phun Xăm",slug:"phun-xam"}},{id:"6",name:"Sữa Rửa Mặt Tạo Bọt Nhẹ Nhàng",slug:"sua-rua-mat-tao-bot-nhe-nhang",shortDesc:"Làm sạch sâu, không làm khô da, phù hợp mọi loại da",description:"Sữa rửa mặt tạo bọt nhẹ nhàng cho mọi loại da",sku:"CLEAN-FOAM-001",price:18e4,originalPrice:25e4,unit:"Chai",stock:320,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop",isFeatured:!0,isNewArrival:!1,isBestSeller:!1,isOnSale:!0,category:{id:"cat-1",name:"Chăm Sóc Da",slug:"cham-soc-da"}},{id:"7",name:"Mi Giả 3D Cao Cấp",slug:"mi-gia-3d-cao-cap",shortDesc:"Mi giả 3D siêu mềm, tự nhiên như mi thật",description:"Mi giả 3D chất lượng cao nhập khẩu",sku:"LASH-3D-001",price:12e4,originalPrice:18e4,unit:"Cặp",stock:250,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1583001809350-0b9c723cad97?w=400&h=400&fit=crop",isFeatured:!1,isNewArrival:!0,isBestSeller:!1,isOnSale:!0,category:{id:"cat-2",name:"Nối Mi",slug:"noi-mi"}},{id:"8",name:"Máy Phun Xăm Chuyên Nghiệp",slug:"may-phun-xam-chuyen-nghiep",shortDesc:"Máy phun xăm hiện đại, êm ái, chính xác cao",description:"Máy phun xăm chuyên nghiệp cho thợ chuyên nghiệp",sku:"MACHINE-PMU-001",price:55e5,originalPrice:72e5,unit:"Máy",stock:12,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop",isFeatured:!0,isNewArrival:!0,isBestSeller:!1,isOnSale:!0,category:{id:"cat-3",name:"Phun Xăm",slug:"phun-xam"}},{id:"9",name:"Toner Cân Bằng Da pH5.5",slug:"toner-can-bang-da-ph55",shortDesc:"Cân bằng độ pH, se khít lỗ chân lông, làm mịn da",description:"Toner cân bằng da với độ pH lý tưởng",sku:"TONER-PH55-001",price:22e4,originalPrice:null,unit:"Chai",stock:180,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",isFeatured:!1,isNewArrival:!1,isBestSeller:!0,isOnSale:!1,category:{id:"cat-1",name:"Chăm Sóc Da",slug:"cham-soc-da"}},{id:"10",name:"Kim Phun Xăm Nano 1 Đầu",slug:"kim-phun-xam-nano-1-dau",shortDesc:"Kim phun nano siêu mỏng, không đau, lên màu chuẩn",description:"Kim phun xăm nano 1 đầu chuyên dụng",sku:"NEEDLE-NANO-001",price:35e3,originalPrice:5e4,unit:"Cái",stock:500,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1519494140681-8b17d830a3ec?w=400&h=400&fit=crop",isFeatured:!1,isNewArrival:!1,isBestSeller:!0,isOnSale:!0,category:{id:"cat-3",name:"Phun Xăm",slug:"phun-xam"}},{id:"11",name:"Chổi Đánh Mi Mascara Dùng 1 Lần",slug:"choi-danh-mi-mascara-dung-1-lan",shortDesc:"Chổi đánh mi dùng 1 lần, vệ sinh, an toàn cho khách",description:"Chổi đánh mi mascara dùng 1 lần (50 cái/hộp)",sku:"BRUSH-MASC-DISP-001",price:45e3,originalPrice:null,unit:"Hộp",stock:400,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&h=400&fit=crop",isFeatured:!1,isNewArrival:!1,isBestSeller:!1,isOnSale:!1,category:{id:"cat-2",name:"Nối Mi",slug:"noi-mi"}},{id:"12",name:"Kem Chống Nắng SPF50+ PA+++",slug:"kem-chong-nang-spf50-pa",shortDesc:"Bảo vệ da khỏi tia UV, không gây nhờn rít",description:"Kem chống nắng phổ rộng SPF50+ PA+++",sku:"SUN-SPF50-001",price:35e4,originalPrice:48e4,unit:"Tuýp",stock:156,status:"ACTIVE",thumbnail:"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",isFeatured:!0,isNewArrival:!1,isBestSeller:!0,isOnSale:!0,category:{id:"cat-1",name:"Chăm Sóc Da",slug:"cham-soc-da"}}]}},variables:{}};var j=e.i(696134),C=e.i(165429),k=e.i(600547),A=e.i(183194),D=e.i(276664),I=e.i(473109);let _=({sampleTemplates:e,selectedTemplate:a,onSelectTemplate:s,onSelectBlank:r})=>(0,t.jsx)("div",{className:"w-1/2 border-r border-gray-200 overflow-y-auto flex flex-col",children:(0,t.jsx)("div",{className:"px-6 py-6 space-y-4 flex-1 overflow-y-auto",children:(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-lg font-bold mb-2",children:"Choose Template"}),(0,t.jsx)("p",{className:"text-sm text-gray-600 mb-6",children:"Select from professional templates or start with blank"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("button",{onClick:r,className:`w-full p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${null===a?"border-blue-500 bg-blue-50":"border-gray-200 bg-white hover:border-gray-300"}`,children:[(0,t.jsx)("div",{className:"font-semibold text-base mb-1",children:"Blank Template"}),(0,t.jsx)("p",{className:"text-xs text-gray-600",children:"Start with empty HTML"}),null===a&&(0,t.jsxs)("div",{className:"mt-2 flex items-center text-blue-600 text-xs font-semibold",children:[(0,t.jsx)(n.Check,{className:"w-3 h-3 mr-1"})," Selected"]})]}),e.map(e=>(0,t.jsxs)("button",{onClick:()=>s(e),className:`w-full p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${a?.id===e.id?"border-blue-500 bg-blue-50":"border-gray-200 bg-white hover:border-gray-300"}`,children:[(0,t.jsx)("div",{className:"font-semibold text-base mb-1",children:e.name}),(0,t.jsx)("p",{className:"text-xs text-gray-600 line-clamp-2",children:e.description}),a?.id===e.id&&(0,t.jsxs)("div",{className:"mt-2 flex items-center text-blue-600 text-xs font-semibold",children:[(0,t.jsx)(n.Check,{className:"w-3 h-3 mr-1"})," Selected"]})]},e.id))]})]})})}),L=({templateEdit:e,onTemplateChange:s,selectedTemplate:r,onFullscreenToggle:i})=>{let[l,n]=a.default.useState(0),o=a.default.useRef(null);a.default.useEffect(()=>{n(e.split("\n").length)},[e]);let c=t=>{if(!o.current)return;let a=o.current.selectionStart,r=o.current.selectionEnd;s(e.substring(0,a)+t+e.substring(r)),setTimeout(()=>{if(o.current){let e=a+t.length;o.current.selectionStart=o.current.selectionEnd=e,o.current.focus()}},0)};return(0,t.jsx)("div",{className:"flex-1 border-b border-gray-200 overflow-hidden flex flex-col bg-gray-50",children:(0,t.jsxs)("div",{className:"px-6 py-4 space-y-3 flex flex-col h-full",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("h3",{className:"text-base font-bold",children:"Template HTML"}),(0,t.jsx)("div",{className:"flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 rounded border",children:(0,t.jsxs)("span",{className:"font-mono",children:[l," lines"]})})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(d.Button,{onClick:()=>{try{let t=0,a=e.split("\n").map(e=>{let a=e.trim();if(!a)return"";a.startsWith("</")&&(t=Math.max(0,t-1));let s="  ".repeat(t)+a;return a.startsWith("<")&&!a.startsWith("</")&&!a.endsWith("/>")&&t++,s});s(a.join("\n"))}catch(e){console.error("Format error:",e)}},variant:"outline",size:"sm",className:"h-7 text-xs",title:"Format HTML",children:"Format"}),(0,t.jsx)(d.Button,{onClick:()=>i(!0),variant:"outline",size:"sm",className:"h-7 w-7 p-0",title:"Fullscreen edit",children:(0,t.jsx)(I.Maximize2,{className:"w-4 h-4"})})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs",children:[(0,t.jsx)("span",{className:"text-gray-500",children:"Template:"}),(0,t.jsx)("span",{className:"font-semibold text-blue-600",children:r?r.name:"Blank"})]}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-1.5",children:[(0,t.jsx)(d.Button,{onClick:()=>c("{{variable}}"),variant:"ghost",size:"sm",className:"h-6 px-2 text-xs font-mono bg-white hover:bg-blue-50",children:"{{var}}"}),(0,t.jsx)(d.Button,{onClick:()=>c("{{#each items}}\n  \n{{/each}}"),variant:"ghost",size:"sm",className:"h-6 px-2 text-xs font-mono bg-white hover:bg-blue-50",children:"{{#each}}"}),(0,t.jsx)(d.Button,{onClick:()=>c("{{#if condition}}\n  \n{{/if}}"),variant:"ghost",size:"sm",className:"h-6 px-2 text-xs font-mono bg-white hover:bg-blue-50",children:"{{#if}}"}),(0,t.jsx)(d.Button,{onClick:()=>c('<div class="container">\n  \n</div>'),variant:"ghost",size:"sm",className:"h-6 px-2 text-xs font-mono bg-white hover:bg-blue-50",children:"<div>"}),(0,t.jsx)(d.Button,{onClick:()=>c('<h2 class="title"></h2>'),variant:"ghost",size:"sm",className:"h-6 px-2 text-xs font-mono bg-white hover:bg-blue-50",children:"<h2>"}),(0,t.jsx)(d.Button,{onClick:()=>c('<button class="btn"></button>'),variant:"ghost",size:"sm",className:"h-6 px-2 text-xs font-mono bg-white hover:bg-blue-50",children:"<button>"})]}),(0,t.jsx)("div",{className:"flex-1 flex flex-col overflow-hidden border border-gray-300 rounded-lg bg-white shadow-sm",children:(0,t.jsx)(k.Textarea,{ref:o,placeholder:`<!-- Example HTML Template with Handlebars syntax -->
<div class="p-6 bg-white rounded-lg shadow">
  <h2 class="text-2xl font-bold">{{title}}</h2>
  <p class="text-gray-600">{{description}}</p>
  
  {{#each items}}
    <div class="mt-4 p-4 border rounded">
      <h3>{{this.name}}</h3>
      <p>{{this.description}}</p>
      {{#if this.price}}
        <span class="font-bold">{{this.price}}</span>
      {{/if}}
    </div>
  {{/each}}
</div>`,value:e,onChange:e=>s(e.target.value),onKeyDown:t=>{if("Tab"===t.key){t.preventDefault();let a=t.currentTarget.selectionStart,r=t.currentTarget.selectionEnd;s(e.substring(0,a)+"  "+e.substring(r)),setTimeout(()=>{o.current&&(o.current.selectionStart=o.current.selectionEnd=a+2)},0)}},className:"font-mono text-xs resize-none flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0",style:{lineHeight:"1.5",tabSize:2}})}),(0,t.jsxs)("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-3",children:[(0,t.jsx)("p",{className:"text-xs font-semibold text-blue-900 mb-1.5",children:"Syntax Guide:"}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-x-4 gap-y-1 text-xs",children:[(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsx)("code",{className:"bg-white px-1.5 py-0.5 rounded text-xs font-mono border",children:"{{name}}"}),(0,t.jsx)("span",{className:"text-gray-600",children:"Variable"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsx)("code",{className:"bg-white px-1.5 py-0.5 rounded text-xs font-mono border",children:"{{#each}}"}),(0,t.jsx)("span",{className:"text-gray-600",children:"Loop array"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsx)("code",{className:"bg-white px-1.5 py-0.5 rounded text-xs font-mono border",children:"{{#if}}"}),(0,t.jsx)("span",{className:"text-gray-600",children:"Condition"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,t.jsx)("code",{className:"bg-white px-1.5 py-0.5 rounded text-xs font-mono border",children:"{{this.prop}}"}),(0,t.jsx)("span",{className:"text-gray-600",children:"Loop item property"})]})]})]})]})})},P=({editConfig:e,onConfigChange:a,staticDataText:s,onStaticDataChange:r,onStaticDataBlur:i,staticDataError:l,hasStaticValidationError:n,repeaterEnabled:o,onRepeaterEnabledChange:c,repeaterDataText:p,onRepeaterDataChange:u,onRepeaterDataBlur:h,repeaterDataError:m,hasRepeaterValidationError:x,repeaterItemsCount:g,limitText:b,onLimitChange:f,onLimitBlur:v,limitError:y,hasLimitValidationError:w,onTestApi:T,apiTestLoading:N,apiTestResult:E,apiTestError:S})=>(0,t.jsx)("div",{className:"flex-1 overflow-y-auto",children:(0,t.jsxs)("div",{className:"px-6 py-6 space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(C.Label,{className:"text-xs font-semibold",children:"Template Name"}),(0,t.jsx)(j.Input,{type:"text",placeholder:"my-dynamic-block",value:e.templateName||"",onChange:t=>a({...e,templateName:t.target.value}),className:"bg-white mt-1 text-sm h-9"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(C.Label,{className:"text-xs font-semibold",children:"Data Source Type"}),(0,t.jsxs)(A.Select,{value:e.dataSource?.type||"static",onValueChange:t=>a({...e,dataSource:{...e.dataSource,type:t,method:e.dataSource?.method||"GET",token:e.dataSource?.token||""}}),children:[(0,t.jsx)(A.SelectTrigger,{className:"bg-white mt-1 text-sm h-9",children:(0,t.jsx)(A.SelectValue,{})}),(0,t.jsxs)(A.SelectContent,{children:[(0,t.jsx)(A.SelectItem,{value:"static",children:"Static Data"}),(0,t.jsx)(A.SelectItem,{value:"api",children:"REST API"}),(0,t.jsx)(A.SelectItem,{value:"graphql",children:"GraphQL"})]})]})]}),(e.dataSource?.type==="api"||e.dataSource?.type==="graphql")&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(C.Label,{className:"text-xs font-semibold",children:"Endpoint"}),(0,t.jsx)(j.Input,{type:"text",placeholder:"/api/data or /graphql",value:e.dataSource?.endpoint||"",onChange:t=>a({...e,dataSource:{type:e.dataSource?.type||"api",...e.dataSource,endpoint:t.target.value}}),className:"bg-white mt-1 text-sm h-9"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(C.Label,{className:"text-xs font-semibold",children:"Authorization Token"}),(0,t.jsx)(j.Input,{type:"password",placeholder:"Bearer token or API key",value:e.dataSource?.token||"",onChange:t=>a({...e,dataSource:{type:e.dataSource?.type||"api",...e.dataSource,token:t.target.value}}),className:"bg-white mt-1 text-sm h-9"})]}),(0,t.jsxs)("div",{className:"flex gap-2 items-center pt-2",children:[(0,t.jsx)(d.Button,{onClick:T,disabled:N||!e.dataSource?.endpoint,size:"sm",className:"bg-blue-600 hover:bg-blue-700 h-8 text-xs",children:N?"Testing...":"Test"}),E&&(0,t.jsx)("span",{className:"text-xs text-green-600 font-semibold",children:"✓ Success"}),S&&(0,t.jsx)("span",{className:"text-xs text-red-600 font-semibold",children:"✗ Error"})]})]}),e.dataSource?.type==="static"&&(0,t.jsxs)("div",{children:[(0,t.jsx)(C.Label,{className:"text-xs font-semibold",children:"Static Data (JSON)"}),(0,t.jsx)(k.Textarea,{placeholder:'{"title": "My Data", "items": [{"id": 1, "name": "Item 1"}]}',value:s,onChange:e=>r(e.target.value),onBlur:i,rows:6,className:`font-mono text-xs mt-1 resize-none ${n?"border-red-500 focus:border-red-500 focus:ring-red-200":"border-gray-300"}`}),n&&(0,t.jsxs)("p",{className:"text-xs text-red-600 mt-2 flex items-start",children:[(0,t.jsx)("span",{className:"mr-1 mt-0.5",children:"❌"}),(0,t.jsx)("span",{children:l})]})]}),(0,t.jsxs)("div",{className:"pt-2 border-t border-gray-200",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between gap-2",children:[(0,t.jsx)(C.Label,{className:"text-xs font-semibold",children:"Enable Repeater"}),(0,t.jsx)(D.Switch,{checked:o,onCheckedChange:c})]}),o&&(0,t.jsxs)("div",{className:"space-y-3 mt-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)(C.Label,{className:"text-xs font-semibold",children:"Repeater Data (JSON Array)"}),(0,t.jsx)(k.Textarea,{placeholder:'[{"id": 1, "name": "Item 1"}]',value:p,onChange:e=>u(e.target.value),onBlur:h,rows:4,className:`font-mono text-xs mt-1 resize-none ${x?"border-red-500 focus:border-red-500 focus:ring-red-200":"border-gray-300"}`}),x&&(0,t.jsxs)("p",{className:"text-xs text-red-600 mt-2 flex items-start",children:[(0,t.jsx)("span",{className:"mr-1 mt-0.5",children:"❌"}),(0,t.jsx)("span",{children:m})]}),!x&&g>0&&(0,t.jsxs)("p",{className:"text-xs text-green-600 mt-2 flex items-center",children:[(0,t.jsx)("span",{className:"mr-1",children:"✓"}),"JSON valid - ",g," items"]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)(C.Label,{className:"text-xs font-semibold",children:"Limit (optional)"}),(0,t.jsx)(j.Input,{type:"text",placeholder:"Max items to display",value:b,onChange:e=>f(e.target.value),onBlur:v,className:`text-xs h-8 mt-1 ${w?"border-red-500 focus:border-red-500 focus:ring-red-200":"border-gray-300"}`}),w&&(0,t.jsxs)("p",{className:"text-xs text-red-600 mt-2 flex items-start",children:[(0,t.jsx)("span",{className:"mr-1 mt-0.5",children:"❌"}),(0,t.jsx)("span",{children:y})]})]})]})]})]})}),R=({block:e,isEditable:j=!0,onUpdate:C,onDelete:k})=>{var A,D,I,R,B,M,O,V,z;let F=e.config,H=[f,v,y,w,T,N,E,S],q=a.default.useRef(null),G=e=>{if(!q.current)return void X(J.templateEdit+"\n"+e);let t=q.current,a=t.selectionStart,s=t.selectionEnd;X(J.templateEdit.substring(0,a)+e+J.templateEdit.substring(s)),setTimeout(()=>{if(q.current){let t=a+e.length;q.current.selectionStart=q.current.selectionEnd=t,q.current.focus()}},0)},{state:J,setEditing:W,setFullscreenEditor:K,setEditConfig:$,setSelectedTemplate:U,setTemplateEdit:X,setLoading:Q,setData:Y,setError:Z,setStaticDataText:ee,setStaticDataError:et,setRepeaterDataText:ea,setRepeaterDataError:es,setLimitText:er,setLimitError:ei,setApiTestLoading:el,setApiTestResult:en,setApiTestError:eo}=function(e,t){let[s,r]=(0,a.useReducer)(h,{config:e,template:t},({config:e,template:t})=>({isEditing:!1,isFullscreenEditor:!1,editConfig:e||{},selectedTemplate:null,templateEdit:t||"",data:null,loading:!1,error:null,staticDataText:"",staticDataError:null,hasValidationError:!1,repeaterDataText:"",repeaterDataError:null,repeaterValidationError:!1,repeaterItemsData:[],limitText:"",limitError:null,limitValidationError:!1,apiTestResult:null,apiTestLoading:!1,apiTestError:null})),i=(0,a.useCallback)(e=>{r({type:"SET_EDITING",payload:e})},[]),l=(0,a.useCallback)(e=>{r({type:"SET_FULLSCREEN_EDITOR",payload:e})},[]),n=(0,a.useCallback)(e=>{r({type:"SET_EDIT_CONFIG",payload:e})},[]),o=(0,a.useCallback)(e=>{r({type:"SET_SELECTED_TEMPLATE",payload:e})},[]),c=(0,a.useCallback)(e=>{r({type:"SET_TEMPLATE_EDIT",payload:e})},[]),d=(0,a.useCallback)(e=>{r({type:"SET_DATA_LOADING",payload:e})},[]),p=(0,a.useCallback)(e=>{r({type:"SET_DATA",payload:e})},[]),u=(0,a.useCallback)(e=>{r({type:"SET_ERROR",payload:e})},[]),m=(0,a.useCallback)(e=>{r({type:"SET_STATIC_DATA_TEXT",payload:e})},[]),x=(0,a.useCallback)((e,t)=>{r({type:"SET_STATIC_DATA_ERROR",payload:{error:e,hasError:t}})},[]),g=(0,a.useCallback)(()=>{r({type:"RESET_STATIC_DATA_VALIDATION"})},[]),b=(0,a.useCallback)(e=>{r({type:"SET_REPEATER_DATA_TEXT",payload:e})},[]),f=(0,a.useCallback)((e,t,a=[])=>{r({type:"SET_REPEATER_DATA_ERROR",payload:{error:e,hasError:t,items:a}})},[]),v=(0,a.useCallback)(()=>{r({type:"RESET_REPEATER_DATA_VALIDATION"})},[]),y=(0,a.useCallback)(e=>{r({type:"SET_LIMIT_TEXT",payload:e})},[]),w=(0,a.useCallback)((e,t)=>{r({type:"SET_LIMIT_ERROR",payload:{error:e,hasError:t}})},[]),T=(0,a.useCallback)(()=>{r({type:"RESET_LIMIT_VALIDATION"})},[]),N=(0,a.useCallback)(e=>{r({type:"SET_API_TEST_LOADING",payload:e})},[]),E=(0,a.useCallback)(e=>{r({type:"SET_API_TEST_RESULT",payload:e})},[]);return{state:s,setEditing:i,setFullscreenEditor:l,setEditConfig:n,setSelectedTemplate:o,setTemplateEdit:c,setLoading:d,setData:p,setError:u,setStaticDataText:m,setStaticDataError:x,resetStaticDataValidation:g,setRepeaterDataText:b,setRepeaterDataError:f,resetRepeaterDataValidation:v,setLimitText:y,setLimitError:w,resetLimitValidation:T,setApiTestLoading:N,setApiTestResult:E,setApiTestError:(0,a.useCallback)(e=>{r({type:"SET_API_TEST_ERROR",payload:e})},[]),resetApiTest:(0,a.useCallback)(()=>{r({type:"RESET_API_TEST"})},[])}}(F,e.content?.template||"");!function({config:e,onDataLoaded:t,onLoading:s,onError:r}){(0,a.useEffect)(()=>{e?.dataSource&&(async()=>{s(!0),r(null);try{let a=e.dataSource;if(!a)return;if("static"===a.type)console.log("Static data loaded:",a.staticData),t(a.staticData);else if("api"===a.type){let e=await m(a);t(e)}else if("graphql"===a.type){let e=await x(a);t(e)}}catch(e){r(e instanceof Error?e.message:"Failed to fetch data")}finally{s(!1)}})()},[e,t,s,r])}({config:J.editConfig,onDataLoaded:Y,onLoading:Q,onError:Z});let{handleSelectTemplate:ec,handleSelectBlankTemplate:ed}=function({onConfigChange:e,onTemplateChange:t,onSelectedTemplateChange:s,onDataChange:r,onErrorsReset:i}){return{handleSelectTemplate:(0,a.useCallback)(a=>{if(!a||!a.id)return void console.warn("Invalid template structure");s(a),t(a.template);let l={templateId:a.id,templateName:a.name,dataSource:{type:a.dataSource?.type||"static",staticData:a.dataSource?.staticData?JSON.parse(JSON.stringify(a.dataSource.staticData)):void 0,endpoint:a.dataSource?.endpoint,query:a.dataSource?.query,variables:a.dataSource?.variables?JSON.parse(JSON.stringify(a.dataSource.variables)):void 0},variables:a.variables?JSON.parse(JSON.stringify(a.variables)):{}};e(l),l.dataSource?.type==="static"&&l.dataSource?.staticData&&r(l.dataSource.staticData),i()},[e,t,s,r,i]),handleSelectBlankTemplate:(0,a.useCallback)(a=>{let r={...a,templateId:void 0,templateName:"Custom Template",dataSource:{type:"static",staticData:{}},variables:{}};s(null),t(""),e(r),i()},[e,t,s,i])}}({onConfigChange:$,onTemplateChange:X,onSelectedTemplateChange:U,onDataChange:Y,onErrorsReset:()=>{et(null,!1),es(null,!1,[]),ei(null,!1)}}),{validateAndSaveStaticData:ep,validateAndSaveRepeaterData:eu,validateAndSaveLimit:eh}=function({editConfig:e,onConfigChange:t,onDataChange:s,onStaticDataError:r,onRepeaterDataError:i,onLimitError:l}){let n=(0,a.useCallback)(a=>{let i=b(a,!1);i.isValid?(t({...e,dataSource:{...e.dataSource,type:"static",staticData:i.data}}),s(i.data),r(null,!1)):r(i.error||"Invalid JSON",!0)},[e,t,s,r]);return{validateAndSaveStaticData:n,validateAndSaveRepeaterData:(0,a.useCallback)(a=>{let s=b(a,!0);if(!s.isValid)return void i(s.error||"Invalid JSON",!0,[]);let r=s.data;t({...e,repeater:{...e.repeater,data:r,enabled:e.repeater?.enabled??!0}}),i(null,!1,r)},[e,t,i]),validateAndSaveLimit:(0,a.useCallback)(a=>{let s=function(e){let t=e.trim();if(!t)return{isValid:!0,value:void 0,error:null};let a=parseInt(t);return isNaN(a)?{isValid:!1,value:null,error:"Limit phải là một số"}:a<=0?{isValid:!1,value:null,error:"Limit phải lớn hơn 0"}:{isValid:!0,value:a,error:null}}(a);s.isValid?(t({...e,repeater:{...e.repeater,enabled:!0,limit:s.value||void 0}}),l(null,!1)):l(s.error||"Invalid limit",!0)},[e,t,l])}}({editConfig:J.editConfig,onConfigChange:$,onDataChange:Y,onStaticDataError:et,onRepeaterDataError:es,onLimitError:ei});(0,a.useEffect)(()=>{if(J.editConfig.dataSource?.type==="static"){let e=J.editConfig.dataSource?.staticData;ee(e?"string"==typeof e?e:JSON.stringify(e,null,2):"{}")}},[J.editConfig.dataSource?.type,J.editConfig.templateId,ee]),(0,a.useEffect)(()=>{if(J.editConfig.repeater?.enabled){let e=J.editConfig.repeater?.data;ea(e?"string"==typeof e?e:JSON.stringify(e,null,2):"[]"),J.editConfig.repeater?.limit?er(String(J.editConfig.repeater.limit)):er("")}},[J.editConfig.repeater?.enabled,J.editConfig.templateId,ea,er]);let em=async()=>{el(!0),eo(null),en(null);try{let e=await g(J.editConfig.dataSource);en(e)}catch(e){eo(e instanceof Error?e.message:"Failed to test connection")}finally{el(!1)}},ex=()=>{if(e.content?.componentType==="template"&&e.content?.template){let a=J.data;if(!a&&e.content?.templateId){let t=H.find(t=>t.id===e.content?.templateId);t?.dataSource?.staticData&&(a=t.dataSource.staticData)}if(!a)return(0,t.jsx)("div",{className:"p-4 bg-gray-50 border border-gray-200 rounded text-gray-500 text-sm",children:"No data available. Configure data source and save to preview."});let s=function(e,t){if(!e||!t)return"";let a=e;return a=(a=(a=a.replace(/{{#repeat\s+(\w+)}}([\s\S]*?){{\/repeat}}/g,(e,a,s)=>Array(t[a]||0).fill(s).join(""))).replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g,(e,a,s)=>t[a]?s:"")).replace(/{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g,(e,a,s)=>{let r=t[a];return Array.isArray(r)?r.map(e=>{let t=s;return Object.entries(e).forEach(([e,a])=>{let s=RegExp(`{{\\s*this\\.${e}\\s*}}`,"g");t=t.replace(s,String(a))}),t=t.replace(/{{#repeat\s+(\w+)}}([\s\S]*?){{\/repeat}}/g,(t,a,s)=>Array(e[a]||0).fill(s).join(""))}).join(""):""}),Object.entries(t).forEach(([e,t])=>{if(Array.isArray(t)||"object"==typeof t&&null!==t)return;let s=RegExp(`{{\\s*${e}\\s*}}`,"g");a=a.replace(s,String(t))}),a}(e.content.template,a);return(0,t.jsx)("div",{className:"template-content",dangerouslySetInnerHTML:{__html:s}})}if(J.loading)return(0,t.jsxs)("div",{className:"flex items-center justify-center p-8",children:[(0,t.jsx)(i.RefreshCw,{className:"w-6 h-6 animate-spin text-blue-500"}),(0,t.jsx)("span",{className:"ml-2",children:"Loading..."})]});if(J.error)return(0,t.jsxs)("div",{className:"p-4 bg-red-50 border border-red-200 rounded text-red-600",children:[(0,t.jsx)("strong",{children:"Error:"})," ",J.error]});if(F?.repeater?.enabled&&J.data){let e=(Array.isArray(J.data)?J.data:[]).filter(e=>{var t;return!(t=F.conditions)||0===t.length||t.every((a,s)=>{let r=function(e,t,a,s){let r=e[t];switch(a){case"equals":return r===s;case"notEquals":return r!==s;case"contains":return String(r).includes(String(s));case"greaterThan":return Number(r)>Number(s);case"lessThan":return Number(r)<Number(s);case"exists":return null!=r;default:return!0}}(e,a.field,a.operator,a.value);return s>0&&t[s-1]?.logic,r})}),a=F.repeater?.limit?e.slice(0,F.repeater.limit):e;return(0,t.jsx)("div",{className:"grid gap-4",children:a.map((e,a)=>(0,t.jsx)(p.Card,{className:"p-4",children:(0,t.jsx)("pre",{className:"text-sm overflow-auto max-h-96",children:JSON.stringify(e,null,2)})},a))})}return J.data?(0,t.jsx)(p.Card,{className:"p-4",children:(0,t.jsx)("pre",{className:"text-sm overflow-auto max-h-96",children:JSON.stringify(J.data,null,2)})}):(0,t.jsx)("div",{className:"p-4 bg-gray-50 border border-gray-200 rounded text-gray-500 text-sm",children:"No data available. Configure data source and save to preview."})};return j?(0,t.jsxs)("div",{className:"relative border-2 border-dashed border-purple-300 rounded-lg p-4 group",children:[(0,t.jsxs)("div",{className:"absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10",children:[(0,t.jsx)(d.Button,{size:"sm",variant:"outline",onClick:()=>W(!J.isEditing),className:"bg-white shadow-sm",children:(0,t.jsx)(s.Settings,{className:"w-4 h-4"})}),(0,t.jsx)(d.Button,{size:"sm",variant:"destructive",onClick:k,className:"shadow-sm",children:(0,t.jsx)(r.Trash2,{className:"w-4 h-4"})})]}),(0,t.jsx)(u.Dialog,{open:J.isEditing,onOpenChange:W,children:(0,t.jsxs)(u.DialogContent,{className:"max-w-7xl h-[95vh] p-0 flex flex-col",children:[(0,t.jsxs)(u.DialogHeader,{className:"px-8 pt-8 pb-6 border-b bg-gradient-to-r from-slate-50 to-slate-100",children:[(0,t.jsxs)(u.DialogTitle,{className:"flex items-center text-2xl font-bold",children:[(0,t.jsx)(o.Grid3x3,{className:"w-6 h-6 mr-3 text-blue-600"}),"Dynamic Block Configuration"]}),(0,t.jsx)(u.DialogDescription,{className:"mt-2 text-base",children:"Choose a template, configure data source, and customize your block"})]}),(0,t.jsxs)("div",{className:"flex-1 flex overflow-hidden",children:[(0,t.jsx)(_,{sampleTemplates:H,selectedTemplate:J.selectedTemplate,onSelectTemplate:ec,onSelectBlank:()=>ed(J.editConfig),currentConfig:J.editConfig}),!J.isFullscreenEditor&&(0,t.jsxs)("div",{className:"w-1/2 flex flex-col",children:[(0,t.jsx)(L,{templateEdit:J.templateEdit,onTemplateChange:X,selectedTemplate:J.selectedTemplate,isFullscreenEditor:J.isFullscreenEditor,onFullscreenToggle:K}),(0,t.jsx)(P,{editConfig:J.editConfig,onConfigChange:$,staticDataText:J.staticDataText,onStaticDataChange:ee,onStaticDataBlur:()=>ep(J.staticDataText),staticDataError:J.staticDataError,hasStaticValidationError:J.hasValidationError,repeaterEnabled:J.editConfig.repeater?.enabled||!1,onRepeaterEnabledChange:e=>{$({...J.editConfig,repeater:e?{...J.editConfig.repeater,enabled:e,data:J.editConfig.repeater?.data||[]}:{enabled:!1}})},repeaterDataText:J.repeaterDataText,onRepeaterDataChange:ea,onRepeaterDataBlur:()=>eu(J.repeaterDataText),repeaterDataError:J.repeaterDataError,hasRepeaterValidationError:J.repeaterValidationError,repeaterItemsCount:J.repeaterItemsData.length,limitText:J.limitText,onLimitChange:er,onLimitBlur:()=>eh(J.limitText),limitError:J.limitError,hasLimitValidationError:J.limitValidationError,onTestApi:em,apiTestLoading:J.apiTestLoading,apiTestResult:J.apiTestResult,apiTestError:J.apiTestError})]}),J.isFullscreenEditor&&(0,t.jsx)("div",{className:"fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-2xl w-full h-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden",children:[(0,t.jsxs)("div",{className:"border-b px-8 py-5 flex items-center justify-between bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50",children:[(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsx)(l.Code,{className:"w-6 h-6 text-blue-600"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:"Template HTML Editor"}),(0,t.jsx)("p",{className:"text-sm text-gray-600 mt-0.5",children:J.selectedTemplate?`Editing: ${J.selectedTemplate.name}`:"Blank Template"})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsxs)(d.Button,{onClick:()=>{try{let e=J.templateEdit,t=0,a=e.split("\n").map(e=>{let a=e.trim();if(!a)return"";a.startsWith("</")&&(t=Math.max(0,t-1));let s="  ".repeat(t)+a;return a.startsWith("<")&&!a.startsWith("</")&&!a.endsWith("/>")&&t++,s});X(a.join("\n"))}catch(e){console.error("Format error:",e)}},variant:"outline",size:"sm",className:"h-9 gap-2",children:[(0,t.jsx)(s.Settings,{className:"w-4 h-4"}),"Format"]}),(0,t.jsx)(d.Button,{onClick:()=>K(!1),variant:"outline",size:"sm",className:"h-9 w-9 p-0",title:"Exit fullscreen",children:(0,t.jsx)(c.default,{className:"w-4 h-4"})})]})]}),(0,t.jsxs)("div",{className:"border-b px-8 py-3 bg-gray-50 flex items-center gap-2",children:[(0,t.jsx)("span",{className:"text-xs font-semibold text-gray-700 mr-2",children:"Quick Insert:"}),(0,t.jsx)(d.Button,{onClick:()=>G("{{variable}}"),variant:"ghost",size:"sm",className:"h-7 px-3 text-xs font-mono hover:bg-blue-100",children:"{{var}}"}),(0,t.jsx)(d.Button,{onClick:()=>G("{{#each items}}\n  \n{{/each}}"),variant:"ghost",size:"sm",className:"h-7 px-3 text-xs font-mono hover:bg-blue-100",children:"{{#each}}"}),(0,t.jsx)(d.Button,{onClick:()=>G("{{#if condition}}\n  \n{{/if}}"),variant:"ghost",size:"sm",className:"h-7 px-3 text-xs font-mono hover:bg-blue-100",children:"{{#if}}"}),(0,t.jsx)("div",{className:"h-4 w-px bg-gray-300 mx-1"}),(0,t.jsx)(d.Button,{onClick:()=>G('<div class="container">\n  \n</div>'),variant:"ghost",size:"sm",className:"h-7 px-3 text-xs font-mono hover:bg-green-100",children:"<div>"}),(0,t.jsx)(d.Button,{onClick:()=>G('<h2 class="title"></h2>'),variant:"ghost",size:"sm",className:"h-7 px-3 text-xs font-mono hover:bg-green-100",children:"<h2>"}),(0,t.jsx)(d.Button,{onClick:()=>G('<p class="text"></p>'),variant:"ghost",size:"sm",className:"h-7 px-3 text-xs font-mono hover:bg-green-100",children:"<p>"}),(0,t.jsx)(d.Button,{onClick:()=>G('<button class="btn"></button>'),variant:"ghost",size:"sm",className:"h-7 px-3 text-xs font-mono hover:bg-green-100",children:"<button>"}),(0,t.jsx)("div",{className:"flex-1"}),(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs text-gray-600",children:[(0,t.jsxs)("span",{className:"font-mono bg-white px-2 py-1 rounded border",children:[J.templateEdit.split("\n").length," lines"]}),(0,t.jsxs)("span",{className:"font-mono bg-white px-2 py-1 rounded border",children:[J.templateEdit.length," chars"]})]})]}),(0,t.jsxs)("div",{className:"flex-1 overflow-hidden flex",children:[(0,t.jsx)("div",{className:"flex-1 flex flex-col overflow-hidden",children:(0,t.jsx)("div",{className:"flex-1 overflow-auto p-6",children:(0,t.jsx)("textarea",{ref:q,placeholder:`<!-- Example HTML Template with Handlebars syntax -->
<div class="container mx-auto p-6">
  <h1 class="text-3xl font-bold">{{title}}</h1>
  <p class="text-gray-600 mt-2">{{description}}</p>
  
  {{#each items}}
    <div class="card mt-4 p-4 border rounded-lg shadow">
      <h3 class="text-xl font-semibold">{{this.name}}</h3>
      <p class="text-gray-700">{{this.description}}</p>
      {{#if this.price}}
        <span class="text-lg font-bold text-blue-600">\${{this.price}}</span>
      {{/if}}
    </div>
  {{/each}}
</div>`,value:J.templateEdit,onChange:e=>X(e.target.value),onKeyDown:e=>{if("Tab"===e.key){e.preventDefault();let t=e.currentTarget.selectionStart,a=e.currentTarget.selectionEnd;X(J.templateEdit.substring(0,t)+"  "+J.templateEdit.substring(a)),setTimeout(()=>{q.current&&(q.current.selectionStart=q.current.selectionEnd=t+2)},0)}},className:"w-full h-full font-mono text-sm resize-none p-4 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none bg-white",style:{lineHeight:"1.6",tabSize:2}})})}),(0,t.jsx)("div",{className:"w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto",children:(0,t.jsxs)("div",{className:"p-6 space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-sm font-bold text-gray-900 mb-3",children:"Handlebars Syntax"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"bg-white p-3 rounded-lg border",children:[(0,t.jsx)("code",{className:"text-xs font-mono text-blue-600",children:"{{variable}}"}),(0,t.jsx)("p",{className:"text-xs text-gray-600 mt-1",children:"Display variable value"})]}),(0,t.jsxs)("div",{className:"bg-white p-3 rounded-lg border",children:[(0,t.jsxs)("code",{className:"text-xs font-mono text-blue-600",children:["{{#each items}}",(0,t.jsx)("br",{}),"  {{this.name}}",(0,t.jsx)("br",{}),"{{/each}}"]}),(0,t.jsx)("p",{className:"text-xs text-gray-600 mt-1",children:"Loop through array"})]}),(0,t.jsxs)("div",{className:"bg-white p-3 rounded-lg border",children:[(0,t.jsxs)("code",{className:"text-xs font-mono text-blue-600",children:["{{#if condition}}",(0,t.jsx)("br",{}),"  ...",(0,t.jsx)("br",{}),"{{/if}}"]}),(0,t.jsx)("p",{className:"text-xs text-gray-600 mt-1",children:"Conditional rendering"})]}),(0,t.jsxs)("div",{className:"bg-white p-3 rounded-lg border",children:[(0,t.jsx)("code",{className:"text-xs font-mono text-blue-600",children:"{{this.property}}"}),(0,t.jsx)("p",{className:"text-xs text-gray-600 mt-1",children:"Access property in loop"})]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-sm font-bold text-gray-900 mb-3",children:"TailwindCSS Classes"}),(0,t.jsxs)("div",{className:"space-y-2 text-xs",children:[(0,t.jsxs)("div",{className:"bg-white p-2 rounded border",children:[(0,t.jsx)("code",{className:"font-mono text-purple-600",children:"container mx-auto"}),(0,t.jsx)("p",{className:"text-gray-600 mt-0.5",children:"Center container"})]}),(0,t.jsxs)("div",{className:"bg-white p-2 rounded border",children:[(0,t.jsx)("code",{className:"font-mono text-purple-600",children:"p-4 m-2"}),(0,t.jsx)("p",{className:"text-gray-600 mt-0.5",children:"Padding & margin"})]}),(0,t.jsxs)("div",{className:"bg-white p-2 rounded border",children:[(0,t.jsx)("code",{className:"font-mono text-purple-600",children:"text-xl font-bold"}),(0,t.jsx)("p",{className:"text-gray-600 mt-0.5",children:"Text styles"})]}),(0,t.jsxs)("div",{className:"bg-white p-2 rounded border",children:[(0,t.jsx)("code",{className:"font-mono text-purple-600",children:"bg-blue-500 text-white"}),(0,t.jsx)("p",{className:"text-gray-600 mt-0.5",children:"Colors"})]}),(0,t.jsxs)("div",{className:"bg-white p-2 rounded border",children:[(0,t.jsx)("code",{className:"font-mono text-purple-600",children:"rounded-lg shadow"}),(0,t.jsx)("p",{className:"text-gray-600 mt-0.5",children:"Border & shadow"})]})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-sm font-bold text-gray-900 mb-3",children:"Tips"}),(0,t.jsxs)("ul",{className:"text-xs text-gray-700 space-y-2",children:[(0,t.jsxs)("li",{className:"flex gap-2",children:[(0,t.jsx)("span",{className:"text-green-600",children:"✓"}),(0,t.jsx)("span",{children:"Press Tab for indentation"})]}),(0,t.jsxs)("li",{className:"flex gap-2",children:[(0,t.jsx)("span",{className:"text-green-600",children:"✓"}),(0,t.jsx)("span",{children:"Use Format button to auto-indent"})]}),(0,t.jsxs)("li",{className:"flex gap-2",children:[(0,t.jsx)("span",{className:"text-green-600",children:"✓"}),(0,t.jsx)("span",{children:"Quick insert adds snippets"})]}),(0,t.jsxs)("li",{className:"flex gap-2",children:[(0,t.jsx)("span",{className:"text-green-600",children:"✓"}),(0,t.jsx)("span",{children:"Combine HTML + Tailwind CSS"})]})]})]})]})})]}),(0,t.jsxs)("div",{className:"border-t px-8 py-4 flex gap-3 justify-end bg-white",children:[(0,t.jsx)(d.Button,{onClick:()=>K(!1),variant:"outline",size:"sm",className:"h-9 px-4",children:"Close Editor"}),(0,t.jsxs)(d.Button,{onClick:()=>K(!1),size:"sm",className:"h-9 px-6 bg-blue-600 hover:bg-blue-700",children:[(0,t.jsx)(n.Check,{className:"w-4 h-4 mr-2"}),"Apply Changes"]})]})]})})]}),(0,t.jsxs)("div",{className:"border-t px-6 py-4 flex gap-2 justify-end bg-white",children:[(0,t.jsx)(d.Button,{onClick:()=>W(!1),variant:"outline",size:"sm",children:"Cancel"}),(0,t.jsx)(d.Button,{onClick:()=>{var t,a,s;t=J.hasValidationError,a=J.repeaterValidationError,s=J.limitValidationError,t||a||s||(C({...e.content,componentType:"template",template:J.templateEdit,config:J.editConfig},e.style),W(!1))},className:"min-w-32",size:"sm",disabled:(A=J.hasValidationError,D=J.repeaterValidationError,I=J.limitValidationError,A||D||I),title:(R=J.hasValidationError,B=J.repeaterValidationError,M=J.limitValidationError,R||B||M)?"Please fix errors before saving":"",children:"Save Changes"}),(O=J.hasValidationError,V=J.repeaterValidationError,z=J.limitValidationError,(O||V||z)&&(0,t.jsx)("span",{className:"text-xs text-red-600 flex items-center",children:"⚠️ Fix errors to save"}))]})]})}),(0,t.jsxs)("div",{className:"mt-8",children:[(0,t.jsxs)("div",{className:"text-xs text-gray-500 mb-2 flex items-center",children:[(0,t.jsx)(l.Code,{className:"w-3 h-3 mr-1"}),"Dynamic Block",F?.templateName&&` - ${F.templateName}`]}),ex()]})]}):(0,t.jsx)("div",{className:"dynamic-block-content",children:ex()})};e.s(["DynamicBlock",0,R,"default",0,R],56419)}]);