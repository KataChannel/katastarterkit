(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,874061,e=>{"use strict";let t=(0,e.i(930702).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["default",()=>t])},138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},994315,e=>{"use strict";let t=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>t])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),i=e.i(529590),l=e.i(403055),r=e.i(984804);let s=r.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,n=r.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,d=r.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,o=r.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,u=r.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,c=r.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=r.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,p=r.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,h=r.gql`
  mutation CreateMany(
    $model: String!
    $data: [JSON!]!
    $skipDuplicates: Boolean
  ) {
    createMany(
      model: $model
      data: $data
      skipDuplicates: $skipDuplicates
    )
  }
`,y=r.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,g=r.gql`
  mutation UpdateMany(
    $model: String!
    $where: JSON
    $data: JSON!
  ) {
    updateMany(
      model: $model
      where: $where
      data: $data
    )
  }
`,x=r.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,f=r.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,b=r.gql`
  mutation Upsert(
    $model: String!
    $where: JSON!
    $create: JSON!
    $update: JSON!
    $select: JSON
    $include: JSON
  ) {
    upsert(
      model: $model
      where: $where
      create: $create
      update: $update
      select: $select
      include: $include
    )
  }
`,N=r.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,v=r.gql`
  mutation ClearCache {
    clearCache
  }
`;function w(e,a,i){let l=!!localStorage.getItem("accessToken"),r=i?.skip||i?.requireAuth!==!1&&!l,{data:n,loading:d,error:o,refetch:u}=(0,t.useQuery)(s,{variables:{modelName:e,input:a||{}},skip:r,fetchPolicy:i?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:o,refetch:u}}function $(e,a,i,l){let r=!!localStorage.getItem("accessToken"),s="string"==typeof a?a:a?.id;s||l?.skip;let d=l?.skip||!s||l?.requireAuth!==!1&&!r,{data:o,loading:u,error:c,refetch:m}=(0,t.useQuery)(n,{variables:{modelName:e,input:{id:s||"",select:i?.select,include:i?.include}},skip:d});return{data:o?.findById,loading:u,error:c,refetch:m}}function k(e,a,i){let[r,s]=(0,l.useState)(a?.page||1),[n,d]=(0,l.useState)(a?.limit||10),u=!!localStorage.getItem("accessToken"),c=i?.skip||i?.requireAuth!==!1&&!u,{data:m,loading:p,error:h,refetch:y}=(0,t.useQuery)(o,{variables:{modelName:e,input:{page:r,limit:n,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:c,fetchPolicy:"cache-and-network"}),g=m?.findManyPaginated,x=(0,l.useCallback)(e=>{s(e)},[]),f=(0,l.useCallback)(()=>{g?.meta.hasNextPage&&s(e=>e+1)},[g]),b=(0,l.useCallback)(()=>{g?.meta.hasPrevPage&&s(e=>e-1)},[g]),N=(0,l.useCallback)(e=>{d(e),s(1)},[]);return{data:g?.data,meta:g?.meta,loading:p,error:h,refetch:y,page:r,limit:n,goToPage:x,nextPage:f,prevPage:b,changeLimit:N}}function M(e,a,i){let{data:l,loading:r,error:s,refetch:n}=(0,t.useQuery)(u,{variables:{modelName:e,where:a},skip:i?.skip});return{count:l?.count,loading:r,error:s,refetch:n}}function j(e,t){let[i,{data:r,loading:s,error:n}]=(0,a.useMutation)(p,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a=await i({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[i,e]),{data:r?.createOne,loading:s,error:n}]}function C(e,t){let[i,{data:r,loading:s,error:n}]=(0,a.useMutation)(y,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let l=await i({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return l.data?.updateOne},[i,e]),{data:r?.updateOne,loading:s,error:n}]}function O(e,t){let[i,{data:r,loading:s,error:n}]=(0,a.useMutation)(x,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let l=await i({variables:{modelName:e,input:{id:a,select:t.select}}});return l.data?.deleteOne},[i,e]),{data:r?.deleteOne,loading:s,error:n}]}function q(e){let t=(0,i.useApolloClient)(),[r,d]=j(e),[o,c]=function(e,t){let[i,{data:r,loading:s,error:n}]=(0,a.useMutation)(h,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await i({variables:{model:e,...t}});return a.data?.createMany},[i,e]),{data:r?.createMany,loading:s,error:n}]}(e),[m,p]=C(e),[y,x]=function(e,t){let[i,{data:r,loading:s,error:n}]=(0,a.useMutation)(g,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await i({variables:{model:e,...t}});return a.data?.updateMany},[i,e]),{data:r?.updateMany,loading:s,error:n}]}(e),[N,v]=O(e),[w,$]=function(e,t){let[i,{data:r,loading:s,error:n}]=(0,a.useMutation)(f,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await i({variables:{model:e,where:t}});return a.data?.deleteMany},[i,e]),{data:r?.deleteMany,loading:s,error:n}]}(e),[k,M]=function(e,t){let[i,{data:r,loading:s,error:n}]=(0,a.useMutation)(b,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await i({variables:{model:e,...t}});return a.data?.upsert},[i,e]),{data:r?.upsert,loading:s,error:n}]}(e),q=(0,l.useCallback)(async a=>(await t.query({query:s,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:q,findUnique:(0,l.useCallback)(async(a,i)=>(await t.query({query:n,variables:{model:e,where:a,...i},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,l.useCallback)(async a=>(await t.query({query:u,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:r,createMany:o,updateOne:m,updateMany:y,deleteOne:N,deleteMany:w,upsert:k,states:{createOne:d,createMany:c,updateOne:p,updateMany:x,deleteOne:v,deleteMany:$,upsert:M},loading:d.loading||c.loading||p.loading||x.loading||v.loading||$.loading||M.loading}}e.s(["AGGREGATE",0,c,"CLEAR_CACHE",0,v,"COUNT",0,u,"CREATE_MANY",0,h,"CREATE_ONE",0,p,"DELETE_MANY",0,f,"DELETE_ONE",0,x,"FIND_FIRST",0,d,"FIND_MANY",0,s,"FIND_MANY_PAGINATED",0,o,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,N,"GROUP_BY",0,m,"UPDATE_MANY",0,g,"UPDATE_ONE",0,y,"UPSERT",0,b],272901),e.s(["useCRUD",()=>q,"useCount",()=>M,"useCreateOne",()=>j,"useDeleteOne",()=>O,"useFindMany",()=>w,"useFindManyPaginated",()=>k,"useFindUnique",()=>$,"useUpdateOne",()=>C],245421)},295426,e=>{"use strict";let t=(0,e.i(930702).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>t])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},960856,e=>{"use strict";let t=(0,e.i(930702).default)("pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);e.s(["default",()=>t])},64886,e=>{"use strict";var t=e.i(960856);e.s(["Edit2",()=>t.default])},955286,e=>{"use strict";let t=(0,e.i(930702).default)("grip-vertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);e.s(["default",()=>t])},261597,e=>{"use strict";var t=e.i(955286);e.s(["GripVertical",()=>t.default])},264207,e=>{"use strict";var t=e.i(44990),a=e.i(130775),i=e.i(579448),l=e.i(519647),r=e.i(403055),s=e.i(245421),n=e.i(606443),d=e.i(64886),o=e.i(138227),u=e.i(261597);function c({courseId:e,onNext:a,onBack:i}){let[l,c]=(0,r.useState)(!1),[m,p]=(0,r.useState)(null),[h,y]=(0,r.useState)({title:"",description:""}),{data:g,loading:x,refetch:f}=(0,s.useFindUnique)("course",e,{include:{modules:{orderBy:{order:"asc"}}}}),[b,{loading:N}]=(0,s.useCreateOne)("module"),[v,{loading:w}]=(0,s.useUpdateOne)("module"),[$]=(0,s.useDeleteOne)("module"),k=g?.modules||[],M=async t=>{t.preventDefault(),m?(await v({where:{id:m.id},data:{title:h.title,description:h.description}}),p(null)):(await b({data:{courseId:e,title:h.title,description:h.description}}),c(!1)),y({title:"",description:""}),f()},j=async e=>{confirm("Are you sure you want to delete this module?")&&(await $({where:{id:e}}),f())},C=k.length>0;return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Course Modules"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Organize your course content into modules"})]}),(0,t.jsx)("div",{className:"space-y-4",children:k.map((e,a)=>(0,t.jsx)("div",{className:"p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow",children:(0,t.jsxs)("div",{className:"flex items-start justify-between",children:[(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[(0,t.jsx)(u.GripVertical,{className:"w-5 h-5 text-gray-400 cursor-move"}),(0,t.jsxs)("h3",{className:"text-lg font-semibold text-gray-900",children:[a+1,". ",e.title]})]}),e.description&&(0,t.jsx)("p",{className:"text-gray-600 ml-8",children:e.description}),(0,t.jsxs)("p",{className:"text-sm text-gray-500 ml-8 mt-2",children:[e.lessons?.length||0," lessons"]})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{onClick:()=>{p(e),y({title:e.title,description:e.description||""}),c(!0)},className:"p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors",children:(0,t.jsx)(d.Edit2,{className:"w-4 h-4"})}),(0,t.jsx)("button",{onClick:()=>j(e.id),className:"p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors",children:(0,t.jsx)(o.Trash2,{className:"w-4 h-4"})})]})]})},e.id))}),l?(0,t.jsxs)("form",{onSubmit:M,className:"p-6 bg-gray-50 rounded-lg",children:[(0,t.jsx)("h3",{className:"text-lg font-semibold mb-4",children:m?"Edit Module":"Add New Module"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Module Title *"}),(0,t.jsx)("input",{type:"text",value:h.title,onChange:e=>y({...h,title:e.target.value}),placeholder:"e.g., Getting Started with React",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Description (Optional)"}),(0,t.jsx)("textarea",{value:h.description,onChange:e=>y({...h,description:e.target.value}),placeholder:"Brief description of this module...",rows:3,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{className:"flex gap-3",children:[(0,t.jsx)("button",{type:"submit",disabled:N||w,className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50",children:N||w?"Saving...":m?"Update Module":"Add Module"}),(0,t.jsx)("button",{type:"button",onClick:()=>{c(!1),p(null),y({title:"",description:""})},className:"px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",children:"Cancel"})]})]})]}):(0,t.jsxs)("button",{onClick:()=>c(!0),className:"w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2",children:[(0,t.jsx)(n.Plus,{className:"w-5 h-5"}),"Add Module"]}),(0,t.jsxs)("div",{className:"flex justify-between pt-6 border-t",children:[(0,t.jsx)("button",{onClick:i,className:"px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50",children:"Back"}),(0,t.jsx)("button",{onClick:a,disabled:!C,className:"px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",children:"Next: Add Lessons"})]}),!C&&(0,t.jsx)("p",{className:"text-sm text-amber-600 text-center",children:"Please add at least one module to continue"})]})}function m(){let e=(0,a.useParams)(),r=e?.id;return(0,t.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,t.jsx)("div",{className:"bg-white border-b sticky top-0 z-10",children:(0,t.jsx)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4",children:(0,t.jsx)("div",{className:"flex items-center justify-between",children:(0,t.jsxs)(i.default,{href:"/lms/instructor/dashboard",className:"flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors",children:[(0,t.jsx)(l.ArrowLeft,{className:"w-5 h-5"}),(0,t.jsx)("span",{className:"font-medium",children:"Quay lại Dashboard"})]})})})}),(0,t.jsx)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,t.jsx)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8",children:(0,t.jsx)(c,{courseId:r,onNext:()=>{},onBack:()=>{}})})})]})}e.s(["default",()=>m],264207)}]);