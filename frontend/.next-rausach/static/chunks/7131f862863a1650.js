(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,874061,e=>{"use strict";let t=(0,e.i(930702).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["default",()=>t])},138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},994315,e=>{"use strict";let t=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>t])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),s=e.i(529590),r=e.i(403055),i=e.i(984804);let l=i.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,n=i.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,d=i.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,c=i.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,o=i.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,u=i.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=i.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,h=i.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,x=i.gql`
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
`,p=i.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,g=i.gql`
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
`,y=i.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,b=i.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,f=i.gql`
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
`,N=i.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,j=i.gql`
  mutation ClearCache {
    clearCache
  }
`;function v(e,a,s){let r=!!localStorage.getItem("accessToken"),i=s?.skip||s?.requireAuth!==!1&&!r,{data:n,loading:d,error:c,refetch:o}=(0,t.useQuery)(l,{variables:{modelName:e,input:a||{}},skip:i,fetchPolicy:s?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:c,refetch:o}}function w(e,a,s,r){let i=!!localStorage.getItem("accessToken"),l="string"==typeof a?a:a?.id;l||r?.skip;let d=r?.skip||!l||r?.requireAuth!==!1&&!i,{data:c,loading:o,error:u,refetch:m}=(0,t.useQuery)(n,{variables:{modelName:e,input:{id:l||"",select:s?.select,include:s?.include}},skip:d});return{data:c?.findById,loading:o,error:u,refetch:m}}function C(e,a,s){let[i,l]=(0,r.useState)(a?.page||1),[n,d]=(0,r.useState)(a?.limit||10),o=!!localStorage.getItem("accessToken"),u=s?.skip||s?.requireAuth!==!1&&!o,{data:m,loading:h,error:x,refetch:p}=(0,t.useQuery)(c,{variables:{modelName:e,input:{page:i,limit:n,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:u,fetchPolicy:"cache-and-network"}),g=m?.findManyPaginated,y=(0,r.useCallback)(e=>{l(e)},[]),b=(0,r.useCallback)(()=>{g?.meta.hasNextPage&&l(e=>e+1)},[g]),f=(0,r.useCallback)(()=>{g?.meta.hasPrevPage&&l(e=>e-1)},[g]),N=(0,r.useCallback)(e=>{d(e),l(1)},[]);return{data:g?.data,meta:g?.meta,loading:h,error:x,refetch:p,page:i,limit:n,goToPage:y,nextPage:b,prevPage:f,changeLimit:N}}function k(e,a,s){let{data:r,loading:i,error:l,refetch:n}=(0,t.useQuery)(o,{variables:{modelName:e,where:a},skip:s?.skip});return{count:r?.count,loading:i,error:l,refetch:n}}function q(e,t){let[s,{data:i,loading:l,error:n}]=(0,a.useMutation)(h,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a=await s({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[s,e]),{data:i?.createOne,loading:l,error:n}]}function $(e,t){let[s,{data:i,loading:l,error:n}]=(0,a.useMutation)(p,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let r=await s({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return r.data?.updateOne},[s,e]),{data:i?.updateOne,loading:l,error:n}]}function M(e,t){let[s,{data:i,loading:l,error:n}]=(0,a.useMutation)(y,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let r=await s({variables:{modelName:e,input:{id:a,select:t.select}}});return r.data?.deleteOne},[s,e]),{data:i?.deleteOne,loading:l,error:n}]}function S(e){let t=(0,s.useApolloClient)(),[i,d]=q(e),[c,u]=function(e,t){let[s,{data:i,loading:l,error:n}]=(0,a.useMutation)(x,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.createMany},[s,e]),{data:i?.createMany,loading:l,error:n}]}(e),[m,h]=$(e),[p,y]=function(e,t){let[s,{data:i,loading:l,error:n}]=(0,a.useMutation)(g,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.updateMany},[s,e]),{data:i?.updateMany,loading:l,error:n}]}(e),[N,j]=M(e),[v,w]=function(e,t){let[s,{data:i,loading:l,error:n}]=(0,a.useMutation)(b,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,where:t}});return a.data?.deleteMany},[s,e]),{data:i?.deleteMany,loading:l,error:n}]}(e),[C,k]=function(e,t){let[s,{data:i,loading:l,error:n}]=(0,a.useMutation)(f,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.upsert},[s,e]),{data:i?.upsert,loading:l,error:n}]}(e),S=(0,r.useCallback)(async a=>(await t.query({query:l,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:S,findUnique:(0,r.useCallback)(async(a,s)=>(await t.query({query:n,variables:{model:e,where:a,...s},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,r.useCallback)(async a=>(await t.query({query:o,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:i,createMany:c,updateOne:m,updateMany:p,deleteOne:N,deleteMany:v,upsert:C,states:{createOne:d,createMany:u,updateOne:h,updateMany:y,deleteOne:j,deleteMany:w,upsert:k},loading:d.loading||u.loading||h.loading||y.loading||j.loading||w.loading||k.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,j,"COUNT",0,o,"CREATE_MANY",0,x,"CREATE_ONE",0,h,"DELETE_MANY",0,b,"DELETE_ONE",0,y,"FIND_FIRST",0,d,"FIND_MANY",0,l,"FIND_MANY_PAGINATED",0,c,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,N,"GROUP_BY",0,m,"UPDATE_MANY",0,g,"UPDATE_ONE",0,p,"UPSERT",0,f],272901),e.s(["useCRUD",()=>S,"useCount",()=>k,"useCreateOne",()=>q,"useDeleteOne",()=>M,"useFindMany",()=>v,"useFindManyPaginated",()=>C,"useFindUnique",()=>w,"useUpdateOne",()=>$],245421)},295426,e=>{"use strict";let t=(0,e.i(930702).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>t])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},621924,e=>{"use strict";let t=(0,e.i(930702).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["default",()=>t])},822390,e=>{"use strict";var t=e.i(621924);e.s(["CheckCircle",()=>t.default])},838049,e=>{"use strict";let t=(0,e.i(930702).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["default",()=>t])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},505722,e=>{"use strict";let t=(0,e.i(930702).default)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["default",()=>t])},317044,e=>{"use strict";var t=e.i(505722);e.s(["HelpCircle",()=>t.default])},883829,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(130775),r=e.i(579448),i=e.i(519647),l=e.i(606443),n=e.i(138227),d=e.i(317044),c=e.i(822390),o=e.i(257117),u=e.i(245421);function m(){let e=(0,s.useParams)(),m=e?.id,[h,x]=(0,a.useState)(""),[p,g]=(0,a.useState)(!1),[y,b]=(0,a.useState)(!1),[f,N]=(0,a.useState)(null),[j,v]=(0,a.useState)(null),[w,C]=(0,a.useState)({title:"",description:"",passingScore:70,timeLimit:30}),[k,q]=(0,a.useState)({type:"MULTIPLE_CHOICE",question:"",points:10,explanation:"",answers:[{text:"",isCorrect:!0,order:0},{text:"",isCorrect:!1,order:1}]}),{data:$,refetch:M}=(0,u.useFindUnique)("course",m,{include:{modules:{include:{lessons:{where:{type:"QUIZ"},include:{quizzes:{include:{questions:{include:{answers:{orderBy:{order:"asc"}}},orderBy:{order:"asc"}}}}},orderBy:{order:"asc"}}},orderBy:{order:"asc"}}}}),[S]=(0,u.useCreateOne)("quiz"),[O]=(0,u.useUpdateOne)("quiz"),[T]=(0,u.useDeleteOne)("quiz"),[E]=(0,u.useCreateOne)("question"),[I]=(0,u.useDeleteOne)("question"),U=($?.modules||[]).flatMap(e=>(e.lessons||[]).map(t=>({...t,moduleName:e.title}))),A=()=>{C({title:"",description:"",passingScore:70,timeLimit:30}),x(""),N(null)},z=()=>{q({type:"MULTIPLE_CHOICE",question:"",points:10,explanation:"",answers:[{text:"",isCorrect:!0,order:0},{text:"",isCorrect:!1,order:1}]})},Q=async e=>{e.preventDefault(),await S({data:{lessonId:h,...w}}),g(!1),A(),M()},P=async e=>{confirm("Bạn có chắc muốn xóa quiz này? Tất cả câu hỏi sẽ bị xóa!")&&(await T({where:{id:e}}),M())},D=async e=>{e.preventDefault(),j&&(await E({data:{quizId:j.id,type:k.type,question:k.question,points:k.points,explanation:k.explanation,order:j.questions?.length||0,answers:{create:k.answers.map((e,t)=>({text:e.text,isCorrect:e.isCorrect,order:t}))}}}),b(!1),z(),M())},L=async e=>{confirm("Bạn có chắc muốn xóa câu hỏi này?")&&(await I({where:{id:e}}),M())},_=(e,t,a)=>{let s=[...k.answers];s[e]={...s[e],[t]:a},"isCorrect"===t&&!0===a&&"MULTIPLE_CHOICE"!==k.type&&s.forEach((t,a)=>{a!==e&&(t.isCorrect=!1)}),q({...k,answers:s})};return(0,t.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,t.jsx)("div",{className:"bg-white border-b sticky top-0 z-10",children:(0,t.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)(r.default,{href:"/lms/instructor/dashboard",className:"flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors",children:[(0,t.jsx)(i.ArrowLeft,{className:"w-5 h-5"}),(0,t.jsx)("span",{className:"font-medium",children:"Quay lại Dashboard"})]}),(0,t.jsxs)("div",{className:"flex gap-3",children:[(0,t.jsx)(r.default,{href:`/lms/instructor/courses/${m}/manage`,className:"text-purple-600 hover:text-purple-700 font-medium",children:"Quản lý Module"}),(0,t.jsx)(r.default,{href:`/lms/instructor/courses/${m}/lessons`,className:"text-green-600 hover:text-green-700 font-medium",children:"Quản lý Bài học"})]})]})})}),(0,t.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,t.jsxs)("div",{className:"mb-6",children:[(0,t.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"Quản Lý Quiz"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Tạo và quản lý câu hỏi cho các bài kiểm tra"})]}),0===U.length?(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center",children:[(0,t.jsx)(d.HelpCircle,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Chưa có Lesson loại Quiz"}),(0,t.jsx)("p",{className:"text-gray-600 mb-6",children:"Bạn cần tạo lesson type QUIZ trước khi thêm câu hỏi"}),(0,t.jsx)(r.default,{href:`/lms/instructor/courses/${m}/lessons`,className:"inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:"Tạo Lesson Quiz"})]}):(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[(0,t.jsx)("div",{className:"lg:col-span-1 space-y-4",children:(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900 mb-4",children:"Danh Sách Quiz"}),U.map(e=>(0,t.jsxs)("div",{className:"mb-4",children:[(0,t.jsx)("div",{className:"text-sm text-gray-500 mb-1",children:e.moduleName}),(0,t.jsxs)("div",{className:"bg-gray-50 rounded-lg p-4 border border-gray-200",children:[(0,t.jsx)("h3",{className:"font-semibold text-gray-900 mb-2",children:e.title}),e.quizzes&&e.quizzes.length>0?e.quizzes.map(e=>(0,t.jsx)("div",{className:"border-t border-gray-200 pt-3 mt-3",children:(0,t.jsxs)("div",{className:"flex items-start justify-between",children:[(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("h4",{className:"font-medium text-gray-900",children:e.title}),(0,t.jsxs)("p",{className:"text-xs text-gray-500 mt-1",children:[e.questions?.length||0," câu hỏi • Điểm đạt: ",e.passingScore,"%"]})]}),(0,t.jsxs)("div",{className:"flex gap-1",children:[(0,t.jsx)("button",{onClick:()=>{v(e),b(!1)},className:"p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors",title:"Xem chi tiết",children:(0,t.jsx)(d.HelpCircle,{className:"w-4 h-4"})}),(0,t.jsx)("button",{onClick:()=>P(e.id),className:"p-2 text-red-600 hover:bg-red-50 rounded transition-colors",title:"Xóa",children:(0,t.jsx)(n.Trash2,{className:"w-4 h-4"})})]})]})},e.id)):(0,t.jsx)("button",{onClick:()=>{x(e.id),g(!0)},className:"w-full mt-2 p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors",children:"+ Tạo Quiz"})]})]},e.id))]})}),(0,t.jsx)("div",{className:"lg:col-span-2",children:j?(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between mb-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-gray-900",children:j.title}),j.description&&(0,t.jsx)("p",{className:"text-gray-600 mt-1",children:j.description}),(0,t.jsxs)("div",{className:"flex items-center gap-4 mt-3 text-sm text-gray-500",children:[(0,t.jsxs)("span",{children:["Điểm đạt: ",j.passingScore,"%"]}),j.timeLimit&&(0,t.jsxs)("span",{children:["Thời gian: ",j.timeLimit," phút"]})]})]}),(0,t.jsxs)("button",{onClick:()=>b(!0),className:"flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors",children:[(0,t.jsx)(l.Plus,{className:"w-5 h-5"}),"Thêm Câu Hỏi"]})]}),(0,t.jsx)("div",{className:"space-y-4",children:j.questions&&j.questions.length>0?j.questions.map((e,a)=>(0,t.jsxs)("div",{className:"border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between mb-3",children:[(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-2",children:[(0,t.jsxs)("span",{className:"text-sm font-semibold text-gray-500",children:["Câu ",a+1]}),(0,t.jsx)("span",{className:"px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded",children:e.type}),(0,t.jsxs)("span",{className:"text-sm text-gray-500",children:[e.points," điểm"]})]}),(0,t.jsx)("h4",{className:"font-medium text-gray-900",children:e.question})]}),(0,t.jsx)("button",{onClick:()=>L(e.id),className:"p-2 text-red-600 hover:bg-red-50 rounded transition-colors",children:(0,t.jsx)(n.Trash2,{className:"w-4 h-4"})})]}),(0,t.jsx)("div",{className:"space-y-2 pl-4",children:e.answers?.map(e=>(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[e.isCorrect?(0,t.jsx)(c.CheckCircle,{className:"w-5 h-5 text-green-600"}):(0,t.jsx)(o.XCircle,{className:"w-5 h-5 text-red-400"}),(0,t.jsx)("span",{className:e.isCorrect?"text-green-900 font-medium":"text-gray-600",children:e.text})]},e.id))}),e.explanation&&(0,t.jsxs)("div",{className:"mt-3 pl-4 text-sm text-gray-600 bg-gray-50 p-2 rounded",children:[(0,t.jsx)("strong",{children:"Giải thích:"})," ",e.explanation]})]},e.id)):(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)(d.HelpCircle,{className:"w-12 h-12 text-gray-300 mx-auto mb-3"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Chưa có câu hỏi nào"}),(0,t.jsx)("button",{onClick:()=>b(!0),className:"mt-4 text-blue-600 hover:text-blue-700 font-medium",children:"Thêm câu hỏi đầu tiên"})]})})]}):(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center",children:[(0,t.jsx)(d.HelpCircle,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Chọn Quiz"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Chọn một quiz từ danh sách bên trái để quản lý câu hỏi"})]})})]}),p&&(0,t.jsx)("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",children:(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-xl max-w-lg w-full",children:[(0,t.jsx)("div",{className:"p-6 border-b border-gray-200",children:(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:"Tạo Quiz Mới"})}),(0,t.jsxs)("form",{onSubmit:Q,className:"p-6 space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Tiêu đề Quiz *"}),(0,t.jsx)("input",{type:"text",value:w.title,onChange:e=>C({...w,title:e.target.value}),placeholder:"VD: Quiz: Kiểm tra Module 1",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Mô tả"}),(0,t.jsx)("textarea",{value:w.description,onChange:e=>C({...w,description:e.target.value}),placeholder:"Mô tả về quiz...",rows:2,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Điểm đạt (%)"}),(0,t.jsx)("input",{type:"number",value:w.passingScore,onChange:e=>C({...w,passingScore:parseInt(e.target.value)}),min:"0",max:"100",className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Thời gian (phút)"}),(0,t.jsx)("input",{type:"number",value:w.timeLimit,onChange:e=>C({...w,timeLimit:parseInt(e.target.value)}),min:"1",className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]})]}),(0,t.jsxs)("div",{className:"flex gap-3 pt-4 border-t",children:[(0,t.jsx)("button",{type:"submit",className:"flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium",children:"Tạo Quiz"}),(0,t.jsx)("button",{type:"button",onClick:()=>{g(!1),A()},className:"px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",children:"Hủy"})]})]})]})}),y&&(0,t.jsx)("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto",children:(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-xl max-w-2xl w-full my-8",children:[(0,t.jsx)("div",{className:"p-6 border-b border-gray-200",children:(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:"Thêm Câu Hỏi Mới"})}),(0,t.jsxs)("form",{onSubmit:D,className:"p-6 space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Loại câu hỏi *"}),(0,t.jsxs)("select",{value:k.type,onChange:e=>q({...k,type:e.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",children:[(0,t.jsx)("option",{value:"MULTIPLE_CHOICE",children:"Multiple Choice (Nhiều đáp án)"}),(0,t.jsx)("option",{value:"TRUE_FALSE",children:"True/False"}),(0,t.jsx)("option",{value:"SHORT_ANSWER",children:"Short Answer"})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Câu hỏi *"}),(0,t.jsx)("textarea",{value:k.question,onChange:e=>q({...k,question:e.target.value}),placeholder:"VD: React là gì?",required:!0,rows:3,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Điểm số"}),(0,t.jsx)("input",{type:"number",value:k.points,onChange:e=>q({...k,points:parseInt(e.target.value)}),min:"1",className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Đáp án *"}),(0,t.jsx)("div",{className:"space-y-2",children:k.answers.map((e,a)=>(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("input",{type:"checkbox",checked:e.isCorrect,onChange:e=>_(a,"isCorrect",e.target.checked),className:"w-5 h-5 text-blue-600"}),(0,t.jsx)("input",{type:"text",value:e.text,onChange:e=>_(a,"text",e.target.value),placeholder:`Đ\xe1p \xe1n ${a+1}`,required:!0,className:"flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"}),k.answers.length>2&&(0,t.jsx)("button",{type:"button",onClick:()=>{q({...k,answers:k.answers.filter((e,t)=>t!==a)})},className:"p-2 text-red-600 hover:bg-red-50 rounded",children:(0,t.jsx)(n.Trash2,{className:"w-4 h-4"})})]},a))}),(0,t.jsx)("button",{type:"button",onClick:()=>{q({...k,answers:[...k.answers,{text:"",isCorrect:!1,order:k.answers.length}]})},className:"mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium",children:"+ Thêm đáp án"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Giải thích (tùy chọn)"}),(0,t.jsx)("textarea",{value:k.explanation,onChange:e=>q({...k,explanation:e.target.value}),placeholder:"Giải thích đáp án đúng...",rows:2,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,t.jsxs)("div",{className:"flex gap-3 pt-4 border-t",children:[(0,t.jsx)("button",{type:"submit",className:"flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium",children:"Thêm Câu Hỏi"}),(0,t.jsx)("button",{type:"button",onClick:()=>{b(!1),z()},className:"px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",children:"Hủy"})]})]})]})})]})]})}e.s(["default",()=>m])}]);