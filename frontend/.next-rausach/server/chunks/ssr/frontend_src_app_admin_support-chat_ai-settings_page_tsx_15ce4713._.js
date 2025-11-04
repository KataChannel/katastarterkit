module.exports=[565510,a=>{"use strict";var b,c=a.i(321248),d=a.i(651332),e=a.i(168918),f=a.i(8912),g=a.i(772213);let h=g.gql`
  query GetAIProviders {
    getAIProviders {
      id
      provider
      name
      apiKey
      model
      temperature
      maxTokens
      systemPrompt
      isActive
      priority
      isDefault
      description
      tags
      totalRequests
      successCount
      failureCount
      avgResponseTime
      lastUsedAt
      lastError
      createdAt
      updatedAt
      createdBy
      creator {
        id
        username
        avatar
      }
    }
  }
`;g.gql`
  query GetAIProvider($id: String!) {
    getAIProvider(id: $id) {
      id
      provider
      name
      apiKey
      model
      temperature
      maxTokens
      systemPrompt
      isActive
      priority
      isDefault
      description
      tags
      totalRequests
      successCount
      failureCount
      avgResponseTime
      lastUsedAt
      lastError
      createdAt
      updatedAt
      createdBy
      creator {
        id
        username
        avatar
      }
    }
  }
`,g.gql`
  query GetActiveAIProvider($providerType: AIProviderType) {
    getActiveAIProvider(providerType: $providerType) {
      id
      provider
      name
      model
      isActive
      priority
      totalRequests
      successCount
      failureCount
      avgResponseTime
      lastUsedAt
    }
  }
`;let i=g.gql`
  query GetAIProviderStats {
    getAIProviderStats {
      totalProviders
      activeProviders
      totalRequests
      successRate
      avgResponseTime
    }
  }
`,j=g.gql`
  mutation CreateAIProvider($input: CreateAIProviderInput!) {
    createAIProvider(input: $input) {
      id
      provider
      name
      model
      isActive
      priority
      isDefault
      createdAt
    }
  }
`,k=g.gql`
  mutation UpdateAIProvider($id: String!, $input: UpdateAIProviderInput!) {
    updateAIProvider(id: $id, input: $input) {
      id
      provider
      name
      model
      temperature
      maxTokens
      systemPrompt
      isActive
      priority
      isDefault
      description
      tags
      updatedAt
    }
  }
`,l=g.gql`
  mutation DeleteAIProvider($id: String!) {
    deleteAIProvider(id: $id)
  }
`,m=g.gql`
  mutation TestAIProvider($input: TestAIProviderInput!) {
    testAIProvider(input: $input) {
      success
      response
      error
      responseTime
      tokensUsed
    }
  }
`,n=g.gql`
  mutation SetDefaultAIProvider($id: String!) {
    setDefaultAIProvider(id: $id) {
      id
      provider
      name
      isDefault
      updatedAt
    }
  }
`,o=g.gql`
  mutation ToggleAIProviderStatus($id: String!, $isActive: Boolean!) {
    toggleAIProviderStatus(id: $id, isActive: $isActive) {
      id
      provider
      name
      isActive
      updatedAt
    }
  }
`;var p=((b={}).CHATGPT="CHATGPT",b.GROK="GROK",b.GEMINI="GEMINI",b),q=a.i(421396);function r(){let[a,b]=(0,d.useState)(!1),[g,p]=(0,d.useState)(null),[r,t]=(0,d.useState)(null),{data:u,loading:v,refetch:w}=(0,e.useQuery)(h),{data:x}=(0,e.useQuery)(i),[y]=(0,f.useMutation)(j),[z]=(0,f.useMutation)(k),[A]=(0,f.useMutation)(l),[B]=(0,f.useMutation)(m),[C]=(0,f.useMutation)(o),[D]=(0,f.useMutation)(n),E=u?.getAIProviders||[],F=x?.getAIProviderStats||{totalProviders:0,activeProviders:0,totalRequests:0,successRate:0,avgResponseTime:0},G=async a=>{try{await y({variables:{input:a}}),await w(),b(!1)}catch(a){console.error("Failed to create provider:",a),alert("Failed to create provider")}},H=async(a,b)=>{try{await z({variables:{id:a,input:b}}),await w(),p(null)}catch(a){console.error("Failed to update provider:",a),alert("Failed to update provider")}},I=async a=>{if(confirm("Are you sure you want to delete this provider?"))try{await A({variables:{id:a}}),await w()}catch(a){console.error("Failed to delete provider:",a),alert("Failed to delete provider")}},J=async a=>{t(a);try{let{data:b}=await B({variables:{input:{providerId:a,testMessage:"Hello, this is a test message."}}}),c=b.testAIProvider;c.success?alert(`✅ Test Successful!

Response: ${c.response}

Time: ${c.responseTime}ms
Tokens: ${c.tokensUsed}`):alert(`❌ Test Failed!

Error: ${c.error}

Time: ${c.responseTime}ms`)}catch(a){alert(`❌ Test Failed!

${a.message}`)}finally{t(null)}},K=async(a,b)=>{try{await C({variables:{id:a,isActive:!b}}),await w()}catch(a){console.error("Failed to toggle status:",a),alert("Failed to toggle status")}},L=async a=>{try{await D({variables:{id:a}}),await w()}catch(a){console.error("Failed to set default:",a),alert("Failed to set default")}};return v?(0,c.jsx)("div",{className:"flex items-center justify-center h-screen",children:(0,c.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})}):(0,c.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,c.jsxs)("div",{className:"mb-8",children:[(0,c.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"AI Provider Settings"}),(0,c.jsx)("p",{className:"text-gray-600",children:"Quản lý các AI providers cho hệ thống chat support"})]}),(0,c.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-5 gap-4 mb-8",children:[(0,c.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,c.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Total Providers"}),(0,c.jsx)("div",{className:"text-2xl font-bold text-gray-900",children:F.totalProviders})]}),(0,c.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,c.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Active"}),(0,c.jsx)("div",{className:"text-2xl font-bold text-green-600",children:F.activeProviders})]}),(0,c.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,c.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Total Requests"}),(0,c.jsx)("div",{className:"text-2xl font-bold text-blue-600",children:F.totalRequests.toLocaleString()})]}),(0,c.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,c.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Success Rate"}),(0,c.jsxs)("div",{className:"text-2xl font-bold text-green-600",children:[F.successRate.toFixed(1),"%"]})]}),(0,c.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,c.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Avg Response"}),(0,c.jsxs)("div",{className:"text-2xl font-bold text-purple-600",children:[F.avgResponseTime.toFixed(0),"ms"]})]})]}),(0,c.jsx)("div",{className:"mb-6",children:(0,c.jsx)("button",{onClick:()=>b(!a),className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",children:a?"✕ Cancel":"+ Add AI Provider"})}),(a||g)&&(0,c.jsx)(s,{provider:g,onSubmit:g?a=>H(g.id,a):G,onCancel:()=>{b(!1),p(null)}}),(0,c.jsxs)("div",{className:"grid gap-4",children:[E.map(a=>(0,c.jsx)(q.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-white rounded-lg shadow p-6",children:(0,c.jsxs)("div",{className:"flex items-start justify-between",children:[(0,c.jsxs)("div",{className:"flex-1",children:[(0,c.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[(0,c.jsx)("h3",{className:"text-xl font-semibold text-gray-900",children:a.name}),(0,c.jsx)("span",{className:`px-2 py-1 text-xs rounded-full ${"CHATGPT"===a.provider?"bg-green-100 text-green-800":"GROK"===a.provider?"bg-purple-100 text-purple-800":"bg-blue-100 text-blue-800"}`,children:a.provider}),a.isDefault&&(0,c.jsx)("span",{className:"px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800",children:"DEFAULT"}),(0,c.jsx)("button",{onClick:()=>K(a.id,a.isActive),className:`px-3 py-1 text-xs rounded-full font-medium ${a.isActive?"bg-green-100 text-green-800":"bg-gray-100 text-gray-600"}`,children:a.isActive?"● Active":"○ Inactive"})]}),(0,c.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3",children:[(0,c.jsxs)("div",{children:[(0,c.jsx)("span",{className:"text-gray-600",children:"Model:"})," ",(0,c.jsx)("span",{className:"font-medium",children:a.model})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("span",{className:"text-gray-600",children:"Temperature:"})," ",(0,c.jsx)("span",{className:"font-medium",children:a.temperature})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("span",{className:"text-gray-600",children:"Max Tokens:"})," ",(0,c.jsx)("span",{className:"font-medium",children:a.maxTokens})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("span",{className:"text-gray-600",children:"Priority:"})," ",(0,c.jsx)("span",{className:"font-medium",children:a.priority})]})]}),(0,c.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600",children:[(0,c.jsxs)("div",{children:["Requests: ",(0,c.jsx)("span",{className:"font-medium text-gray-900",children:a.totalRequests})]}),(0,c.jsxs)("div",{children:["Success: ",(0,c.jsx)("span",{className:"font-medium text-green-600",children:a.successCount})]}),(0,c.jsxs)("div",{children:["Failed: ",(0,c.jsx)("span",{className:"font-medium text-red-600",children:a.failureCount})]}),(0,c.jsxs)("div",{children:["Avg Time: ",(0,c.jsxs)("span",{className:"font-medium text-purple-600",children:[a.avgResponseTime?.toFixed(0)||0,"ms"]})]})]}),a.lastError&&(0,c.jsxs)("div",{className:"mt-2 text-sm text-red-600",children:["Last Error: ",a.lastError]})]}),(0,c.jsxs)("div",{className:"flex gap-2 ml-4",children:[(0,c.jsx)("button",{onClick:()=>J(a.id),disabled:r===a.id,className:"px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50",children:r===a.id?"Testing...":"Test"}),!a.isDefault&&(0,c.jsx)("button",{onClick:()=>L(a.id),className:"px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200",children:"Set Default"}),(0,c.jsx)("button",{onClick:()=>p(a),className:"px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200",children:"Edit"}),(0,c.jsx)("button",{onClick:()=>I(a.id),className:"px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200",children:"Delete"})]})]})},a.id)),0===E.length&&(0,c.jsx)("div",{className:"text-center py-12 text-gray-500",children:'No AI providers configured. Click "Add AI Provider" to get started.'})]})]})}function s({provider:a,onSubmit:b,onCancel:e}){let[f,g]=(0,d.useState)({provider:a?.provider||p.CHATGPT,name:a?.name||"",apiKey:a?.apiKey||"",model:a?.model||"gpt-4",temperature:a?.temperature||.7,maxTokens:a?.maxTokens||2e3,systemPrompt:a?.systemPrompt||"",isActive:a?.isActive??!1,priority:a?.priority||0,isDefault:a?.isDefault??!1,description:a?.description||"",tags:a?.tags?.join(", ")||""});return(0,c.jsxs)(q.motion.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},className:"bg-white rounded-lg shadow p-6 mb-6",children:[(0,c.jsx)("h3",{className:"text-xl font-semibold mb-4",children:a?"Edit AI Provider":"Add New AI Provider"}),(0,c.jsxs)("form",{onSubmit:a=>{a.preventDefault(),b({...f,tags:f.tags?f.tags.split(",").map(a=>a.trim()):[]})},className:"space-y-4",children:[(0,c.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Provider Type"}),(0,c.jsxs)("select",{value:f.provider,onChange:a=>g({...f,provider:a.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",required:!0,children:[(0,c.jsx)("option",{value:p.CHATGPT,children:"ChatGPT"}),(0,c.jsx)("option",{value:p.GROK,children:"Grok"}),(0,c.jsx)("option",{value:p.GEMINI,children:"Gemini"})]})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Name"}),(0,c.jsx)("input",{type:"text",value:f.name,onChange:a=>g({...f,name:a.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"e.g., ChatGPT Production",required:!0})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"API Key"}),(0,c.jsx)("input",{type:"password",value:f.apiKey,onChange:a=>g({...f,apiKey:a.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"sk-...",required:!0})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Model"}),(0,c.jsx)("input",{type:"text",value:f.model,onChange:a=>g({...f,model:a.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"gpt-4, grok-2, gemini-pro",required:!0})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Temperature (0-2)"}),(0,c.jsx)("input",{type:"number",step:"0.1",min:"0",max:"2",value:f.temperature,onChange:a=>g({...f,temperature:parseFloat(a.target.value)}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",required:!0})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Max Tokens"}),(0,c.jsx)("input",{type:"number",min:"1",max:"8000",value:f.maxTokens,onChange:a=>g({...f,maxTokens:parseInt(a.target.value)}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",required:!0})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Priority"}),(0,c.jsx)("input",{type:"number",min:"0",value:f.priority,onChange:a=>g({...f,priority:parseInt(a.target.value)}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Tags (comma-separated)"}),(0,c.jsx)("input",{type:"text",value:f.tags,onChange:a=>g({...f,tags:a.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"production, backup"})]})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"System Prompt"}),(0,c.jsx)("textarea",{value:f.systemPrompt,onChange:a=>g({...f,systemPrompt:a.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",rows:3,placeholder:"You are a helpful customer support assistant..."})]}),(0,c.jsxs)("div",{children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Description"}),(0,c.jsx)("textarea",{value:f.description,onChange:a=>g({...f,description:a.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",rows:2,placeholder:"Optional description..."})]}),(0,c.jsxs)("div",{className:"flex gap-4",children:[(0,c.jsxs)("label",{className:"flex items-center gap-2",children:[(0,c.jsx)("input",{type:"checkbox",checked:f.isActive,onChange:a=>g({...f,isActive:a.target.checked}),className:"w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}),(0,c.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Active"})]}),(0,c.jsxs)("label",{className:"flex items-center gap-2",children:[(0,c.jsx)("input",{type:"checkbox",checked:f.isDefault,onChange:a=>g({...f,isDefault:a.target.checked}),className:"w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}),(0,c.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Set as Default"})]})]}),(0,c.jsxs)("div",{className:"flex gap-2 pt-4",children:[(0,c.jsx)("button",{type:"submit",className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",children:a?"Update Provider":"Create Provider"}),(0,c.jsx)("button",{type:"button",onClick:e,className:"px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors",children:"Cancel"})]})]})]})}a.s(["default",()=>r],565510)}];

//# sourceMappingURL=frontend_src_app_admin_support-chat_ai-settings_page_tsx_15ce4713._.js.map