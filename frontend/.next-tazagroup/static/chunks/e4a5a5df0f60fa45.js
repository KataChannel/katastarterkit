(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,487547,e=>{"use strict";var t,s=e.i(44990),r=e.i(403055),a=e.i(429105),i=e.i(950988),l=e.i(984804);let o=l.gql`
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
`;l.gql`
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
`,l.gql`
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
`;let d=l.gql`
  query GetAIProviderStats {
    getAIProviderStats {
      totalProviders
      activeProviders
      totalRequests
      successRate
      avgResponseTime
    }
  }
`,n=l.gql`
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
`,c=l.gql`
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
`,u=l.gql`
  mutation DeleteAIProvider($id: String!) {
    deleteAIProvider(id: $id)
  }
`,m=l.gql`
  mutation TestAIProvider($input: TestAIProviderInput!) {
    testAIProvider(input: $input) {
      success
      response
      error
      responseTime
      tokensUsed
    }
  }
`,p=l.gql`
  mutation SetDefaultAIProvider($id: String!) {
    setDefaultAIProvider(id: $id) {
      id
      provider
      name
      isDefault
      updatedAt
    }
  }
`,x=l.gql`
  mutation ToggleAIProviderStatus($id: String!, $isActive: Boolean!) {
    toggleAIProviderStatus(id: $id, isActive: $isActive) {
      id
      provider
      name
      isActive
      updatedAt
    }
  }
`;var g=((t={}).CHATGPT="CHATGPT",t.GROK="GROK",t.GEMINI="GEMINI",t),v=e.i(292706);function h(){let[e,t]=(0,r.useState)(!1),[l,g]=(0,r.useState)(null),[h,y]=(0,r.useState)(null),{data:f,loading:j,refetch:N}=(0,a.useQuery)(o),{data:A}=(0,a.useQuery)(d),[P]=(0,i.useMutation)(n),[T]=(0,i.useMutation)(c),[w]=(0,i.useMutation)(u),[I]=(0,i.useMutation)(m),[C]=(0,i.useMutation)(x),[k]=(0,i.useMutation)(p),q=f?.getAIProviders||[],R=A?.getAIProviderStats||{totalProviders:0,activeProviders:0,totalRequests:0,successRate:0,avgResponseTime:0},$=async e=>{try{await P({variables:{input:e}}),await N(),t(!1)}catch(e){console.error("Failed to create provider:",e),alert("Failed to create provider")}},S=async(e,t)=>{try{await T({variables:{id:e,input:t}}),await N(),g(null)}catch(e){console.error("Failed to update provider:",e),alert("Failed to update provider")}},D=async e=>{if(confirm("Are you sure you want to delete this provider?"))try{await w({variables:{id:e}}),await N()}catch(e){console.error("Failed to delete provider:",e),alert("Failed to delete provider")}},G=async e=>{y(e);try{let{data:t}=await I({variables:{input:{providerId:e,testMessage:"Hello, this is a test message."}}}),s=t.testAIProvider;s.success?alert(`✅ Test Successful!

Response: ${s.response}

Time: ${s.responseTime}ms
Tokens: ${s.tokensUsed}`):alert(`❌ Test Failed!

Error: ${s.error}

Time: ${s.responseTime}ms`)}catch(e){alert(`❌ Test Failed!

${e.message}`)}finally{y(null)}},F=async(e,t)=>{try{await C({variables:{id:e,isActive:!t}}),await N()}catch(e){console.error("Failed to toggle status:",e),alert("Failed to toggle status")}},M=async e=>{try{await k({variables:{id:e}}),await N()}catch(e){console.error("Failed to set default:",e),alert("Failed to set default")}};return j?(0,s.jsx)("div",{className:"flex items-center justify-center h-screen",children:(0,s.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})}):(0,s.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,s.jsxs)("div",{className:"mb-8",children:[(0,s.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"AI Provider Settings"}),(0,s.jsx)("p",{className:"text-gray-600",children:"Quản lý các AI providers cho hệ thống chat support"})]}),(0,s.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-5 gap-4 mb-8",children:[(0,s.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,s.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Total Providers"}),(0,s.jsx)("div",{className:"text-2xl font-bold text-gray-900",children:R.totalProviders})]}),(0,s.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,s.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Active"}),(0,s.jsx)("div",{className:"text-2xl font-bold text-green-600",children:R.activeProviders})]}),(0,s.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,s.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Total Requests"}),(0,s.jsx)("div",{className:"text-2xl font-bold text-blue-600",children:R.totalRequests.toLocaleString()})]}),(0,s.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,s.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Success Rate"}),(0,s.jsxs)("div",{className:"text-2xl font-bold text-green-600",children:[R.successRate.toFixed(1),"%"]})]}),(0,s.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,s.jsx)("div",{className:"text-sm text-gray-600 mb-1",children:"Avg Response"}),(0,s.jsxs)("div",{className:"text-2xl font-bold text-purple-600",children:[R.avgResponseTime.toFixed(0),"ms"]})]})]}),(0,s.jsx)("div",{className:"mb-6",children:(0,s.jsx)("button",{onClick:()=>t(!e),className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",children:e?"✕ Cancel":"+ Add AI Provider"})}),(e||l)&&(0,s.jsx)(b,{provider:l,onSubmit:l?e=>S(l.id,e):$,onCancel:()=>{t(!1),g(null)}}),(0,s.jsxs)("div",{className:"grid gap-4",children:[q.map(e=>(0,s.jsx)(v.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"bg-white rounded-lg shadow p-6",children:(0,s.jsxs)("div",{className:"flex items-start justify-between",children:[(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[(0,s.jsx)("h3",{className:"text-xl font-semibold text-gray-900",children:e.name}),(0,s.jsx)("span",{className:`px-2 py-1 text-xs rounded-full ${"CHATGPT"===e.provider?"bg-green-100 text-green-800":"GROK"===e.provider?"bg-purple-100 text-purple-800":"bg-blue-100 text-blue-800"}`,children:e.provider}),e.isDefault&&(0,s.jsx)("span",{className:"px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800",children:"DEFAULT"}),(0,s.jsx)("button",{onClick:()=>F(e.id,e.isActive),className:`px-3 py-1 text-xs rounded-full font-medium ${e.isActive?"bg-green-100 text-green-800":"bg-gray-100 text-gray-600"}`,children:e.isActive?"● Active":"○ Inactive"})]}),(0,s.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"text-gray-600",children:"Model:"})," ",(0,s.jsx)("span",{className:"font-medium",children:e.model})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"text-gray-600",children:"Temperature:"})," ",(0,s.jsx)("span",{className:"font-medium",children:e.temperature})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"text-gray-600",children:"Max Tokens:"})," ",(0,s.jsx)("span",{className:"font-medium",children:e.maxTokens})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"text-gray-600",children:"Priority:"})," ",(0,s.jsx)("span",{className:"font-medium",children:e.priority})]})]}),(0,s.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600",children:[(0,s.jsxs)("div",{children:["Requests: ",(0,s.jsx)("span",{className:"font-medium text-gray-900",children:e.totalRequests})]}),(0,s.jsxs)("div",{children:["Success: ",(0,s.jsx)("span",{className:"font-medium text-green-600",children:e.successCount})]}),(0,s.jsxs)("div",{children:["Failed: ",(0,s.jsx)("span",{className:"font-medium text-red-600",children:e.failureCount})]}),(0,s.jsxs)("div",{children:["Avg Time: ",(0,s.jsxs)("span",{className:"font-medium text-purple-600",children:[e.avgResponseTime?.toFixed(0)||0,"ms"]})]})]}),e.lastError&&(0,s.jsxs)("div",{className:"mt-2 text-sm text-red-600",children:["Last Error: ",e.lastError]})]}),(0,s.jsxs)("div",{className:"flex gap-2 ml-4",children:[(0,s.jsx)("button",{onClick:()=>G(e.id),disabled:h===e.id,className:"px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50",children:h===e.id?"Testing...":"Test"}),!e.isDefault&&(0,s.jsx)("button",{onClick:()=>M(e.id),className:"px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200",children:"Set Default"}),(0,s.jsx)("button",{onClick:()=>g(e),className:"px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200",children:"Edit"}),(0,s.jsx)("button",{onClick:()=>D(e.id),className:"px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200",children:"Delete"})]})]})},e.id)),0===q.length&&(0,s.jsx)("div",{className:"text-center py-12 text-gray-500",children:'No AI providers configured. Click "Add AI Provider" to get started.'})]})]})}function b({provider:e,onSubmit:t,onCancel:a}){let[i,l]=(0,r.useState)({provider:e?.provider||g.CHATGPT,name:e?.name||"",apiKey:e?.apiKey||"",model:e?.model||"gpt-4",temperature:e?.temperature||.7,maxTokens:e?.maxTokens||2e3,systemPrompt:e?.systemPrompt||"",isActive:e?.isActive??!1,priority:e?.priority||0,isDefault:e?.isDefault??!1,description:e?.description||"",tags:e?.tags?.join(", ")||""});return(0,s.jsxs)(v.motion.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},className:"bg-white rounded-lg shadow p-6 mb-6",children:[(0,s.jsx)("h3",{className:"text-xl font-semibold mb-4",children:e?"Edit AI Provider":"Add New AI Provider"}),(0,s.jsxs)("form",{onSubmit:e=>{e.preventDefault(),t({...i,tags:i.tags?i.tags.split(",").map(e=>e.trim()):[]})},className:"space-y-4",children:[(0,s.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Provider Type"}),(0,s.jsxs)("select",{value:i.provider,onChange:e=>l({...i,provider:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",required:!0,children:[(0,s.jsx)("option",{value:g.CHATGPT,children:"ChatGPT"}),(0,s.jsx)("option",{value:g.GROK,children:"Grok"}),(0,s.jsx)("option",{value:g.GEMINI,children:"Gemini"})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Name"}),(0,s.jsx)("input",{type:"text",value:i.name,onChange:e=>l({...i,name:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"e.g., ChatGPT Production",required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"API Key"}),(0,s.jsx)("input",{type:"password",value:i.apiKey,onChange:e=>l({...i,apiKey:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"sk-...",required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Model"}),(0,s.jsx)("input",{type:"text",value:i.model,onChange:e=>l({...i,model:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"gpt-4, grok-2, gemini-pro",required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Temperature (0-2)"}),(0,s.jsx)("input",{type:"number",step:"0.1",min:"0",max:"2",value:i.temperature,onChange:e=>l({...i,temperature:parseFloat(e.target.value)}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Max Tokens"}),(0,s.jsx)("input",{type:"number",min:"1",max:"8000",value:i.maxTokens,onChange:e=>l({...i,maxTokens:parseInt(e.target.value)}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",required:!0})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Priority"}),(0,s.jsx)("input",{type:"number",min:"0",value:i.priority,onChange:e=>l({...i,priority:parseInt(e.target.value)}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Tags (comma-separated)"}),(0,s.jsx)("input",{type:"text",value:i.tags,onChange:e=>l({...i,tags:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"production, backup"})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"System Prompt"}),(0,s.jsx)("textarea",{value:i.systemPrompt,onChange:e=>l({...i,systemPrompt:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",rows:3,placeholder:"You are a helpful customer support assistant..."})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Description"}),(0,s.jsx)("textarea",{value:i.description,onChange:e=>l({...i,description:e.target.value}),className:"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",rows:2,placeholder:"Optional description..."})]}),(0,s.jsxs)("div",{className:"flex gap-4",children:[(0,s.jsxs)("label",{className:"flex items-center gap-2",children:[(0,s.jsx)("input",{type:"checkbox",checked:i.isActive,onChange:e=>l({...i,isActive:e.target.checked}),className:"w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}),(0,s.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Active"})]}),(0,s.jsxs)("label",{className:"flex items-center gap-2",children:[(0,s.jsx)("input",{type:"checkbox",checked:i.isDefault,onChange:e=>l({...i,isDefault:e.target.checked}),className:"w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}),(0,s.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Set as Default"})]})]}),(0,s.jsxs)("div",{className:"flex gap-2 pt-4",children:[(0,s.jsx)("button",{type:"submit",className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",children:e?"Update Provider":"Create Provider"}),(0,s.jsx)("button",{type:"button",onClick:a,className:"px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors",children:"Cancel"})]})]})]})}e.s(["default",()=>h],487547)}]);