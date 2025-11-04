(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,874061,e=>{"use strict";let t=(0,e.i(930702).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["default",()=>t])},138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},994315,e=>{"use strict";let t=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>t])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},850384,62476,e=>{"use strict";let t=(0,e.i(930702).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["default",()=>t],62476),e.s(["Search",()=>t],850384)},696134,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let l=a.forwardRef(({className:e,type:a,...l},i)=>(0,t.jsx)("input",{type:a,className:(0,s.cn)("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...l}));l.displayName="Input",e.s(["Input",()=>l])},775680,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let l=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...a}));l.displayName="Card";let i=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",e),...a}));i.displayName="CardHeader";let r=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("h3",{ref:l,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",e),...a}));r.displayName="CardTitle";let n=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("p",{ref:l,className:(0,s.cn)("text-sm text-muted-foreground",e),...a}));n.displayName="CardDescription";let d=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("p-6 pt-0",e),...a}));d.displayName="CardContent";let c=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("flex items-center p-6 pt-0",e),...a}));c.displayName="CardFooter",e.s(["Card",()=>l,"CardContent",()=>d,"CardDescription",()=>n,"CardFooter",()=>c,"CardHeader",()=>i,"CardTitle",()=>r])},702470,e=>{"use strict";var t=e.i(44990),a=e.i(207298),s=e.i(541428);let l=(0,a.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function i({className:e,variant:a,...i}){return(0,t.jsx)("span",{className:(0,s.cn)(l({variant:a}),e),...i})}e.s(["Badge",()=>i])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),s=e.i(529590),l=e.i(403055),i=e.i(984804);let r=i.gql`
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
`,x=i.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,p=i.gql`
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
`,h=i.gql`
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
`,f=i.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,y=i.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,N=i.gql`
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
`,j=i.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,b=i.gql`
  mutation ClearCache {
    clearCache
  }
`;function v(e,a,s){let l=!!localStorage.getItem("accessToken"),i=s?.skip||s?.requireAuth!==!1&&!l,{data:n,loading:d,error:c,refetch:o}=(0,t.useQuery)(r,{variables:{modelName:e,input:a||{}},skip:i,fetchPolicy:s?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:c,refetch:o}}function C(e,a,s,l){let i=!!localStorage.getItem("accessToken"),r="string"==typeof a?a:a?.id;r||l?.skip;let d=l?.skip||!r||l?.requireAuth!==!1&&!i,{data:c,loading:o,error:u,refetch:m}=(0,t.useQuery)(n,{variables:{modelName:e,input:{id:r||"",select:s?.select,include:s?.include}},skip:d});return{data:c?.findById,loading:o,error:u,refetch:m}}function w(e,a,s){let[i,r]=(0,l.useState)(a?.page||1),[n,d]=(0,l.useState)(a?.limit||10),o=!!localStorage.getItem("accessToken"),u=s?.skip||s?.requireAuth!==!1&&!o,{data:m,loading:x,error:p,refetch:h}=(0,t.useQuery)(c,{variables:{modelName:e,input:{page:i,limit:n,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:u,fetchPolicy:"cache-and-network"}),g=m?.findManyPaginated,f=(0,l.useCallback)(e=>{r(e)},[]),y=(0,l.useCallback)(()=>{g?.meta.hasNextPage&&r(e=>e+1)},[g]),N=(0,l.useCallback)(()=>{g?.meta.hasPrevPage&&r(e=>e-1)},[g]),j=(0,l.useCallback)(e=>{d(e),r(1)},[]);return{data:g?.data,meta:g?.meta,loading:x,error:p,refetch:h,page:i,limit:n,goToPage:f,nextPage:y,prevPage:N,changeLimit:j}}function k(e,a,s){let{data:l,loading:i,error:r,refetch:n}=(0,t.useQuery)(o,{variables:{modelName:e,where:a},skip:s?.skip});return{count:l?.count,loading:i,error:r,refetch:n}}function $(e,t){let[s,{data:i,loading:r,error:n}]=(0,a.useMutation)(x,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a=await s({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[s,e]),{data:i?.createOne,loading:r,error:n}]}function A(e,t){let[s,{data:i,loading:r,error:n}]=(0,a.useMutation)(h,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let l=await s({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return l.data?.updateOne},[s,e]),{data:i?.updateOne,loading:r,error:n}]}function M(e,t){let[s,{data:i,loading:r,error:n}]=(0,a.useMutation)(f,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let l=await s({variables:{modelName:e,input:{id:a,select:t.select}}});return l.data?.deleteOne},[s,e]),{data:i?.deleteOne,loading:r,error:n}]}function D(e){let t=(0,s.useApolloClient)(),[i,d]=$(e),[c,u]=function(e,t){let[s,{data:i,loading:r,error:n}]=(0,a.useMutation)(p,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.createMany},[s,e]),{data:i?.createMany,loading:r,error:n}]}(e),[m,x]=A(e),[h,f]=function(e,t){let[s,{data:i,loading:r,error:n}]=(0,a.useMutation)(g,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.updateMany},[s,e]),{data:i?.updateMany,loading:r,error:n}]}(e),[j,b]=M(e),[v,C]=function(e,t){let[s,{data:i,loading:r,error:n}]=(0,a.useMutation)(y,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await s({variables:{model:e,where:t}});return a.data?.deleteMany},[s,e]),{data:i?.deleteMany,loading:r,error:n}]}(e),[w,k]=function(e,t){let[s,{data:i,loading:r,error:n}]=(0,a.useMutation)(N,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.upsert},[s,e]),{data:i?.upsert,loading:r,error:n}]}(e),D=(0,l.useCallback)(async a=>(await t.query({query:r,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:D,findUnique:(0,l.useCallback)(async(a,s)=>(await t.query({query:n,variables:{model:e,where:a,...s},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,l.useCallback)(async a=>(await t.query({query:o,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:i,createMany:c,updateOne:m,updateMany:h,deleteOne:j,deleteMany:v,upsert:w,states:{createOne:d,createMany:u,updateOne:x,updateMany:f,deleteOne:b,deleteMany:C,upsert:k},loading:d.loading||u.loading||x.loading||f.loading||b.loading||C.loading||k.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,b,"COUNT",0,o,"CREATE_MANY",0,p,"CREATE_ONE",0,x,"DELETE_MANY",0,y,"DELETE_ONE",0,f,"FIND_FIRST",0,d,"FIND_MANY",0,r,"FIND_MANY_PAGINATED",0,c,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,j,"GROUP_BY",0,m,"UPDATE_MANY",0,g,"UPDATE_ONE",0,h,"UPSERT",0,N],272901),e.s(["useCRUD",()=>D,"useCount",()=>k,"useCreateOne",()=>$,"useDeleteOne",()=>M,"useFindMany",()=>v,"useFindManyPaginated",()=>w,"useFindUnique",()=>C,"useUpdateOne",()=>A],245421)},381299,e=>{"use strict";let t=(0,e.i(930702).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);e.s(["default",()=>t])},965120,e=>{"use strict";var t=e.i(381299);e.s(["Edit",()=>t.default])},638381,e=>{"use strict";let t=(0,e.i(930702).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},621924,e=>{"use strict";let t=(0,e.i(930702).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["default",()=>t])},822390,e=>{"use strict";var t=e.i(621924);e.s(["CheckCircle",()=>t.default])},759727,258392,e=>{"use strict";let t=(0,e.i(930702).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);e.s(["default",()=>t],258392),e.s(["TrendingUp",()=>t],759727)},837149,558519,e=>{"use strict";let t=(0,e.i(930702).default)("target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);e.s(["default",()=>t],558519),e.s(["Target",()=>t],837149)},815954,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(940392);let l=a.createContext({}),i=({children:e,open:a,onOpenChange:s})=>a?(0,t.jsx)(l.Provider,{value:{onOpenChange:s},children:e}):null,r=a.forwardRef(({className:e,children:s,asChild:l,...i},r)=>l&&a.isValidElement(s)?a.cloneElement(s,{ref:r,...i}):(0,t.jsx)("button",{ref:r,className:e,...i,children:s}));r.displayName="AlertDialogTrigger";let n=a.forwardRef(({className:e,...l},i)=>{let[r,n]=a.useState(!1);if(a.useEffect(()=>(n(!0),()=>n(!1)),[]),!r)return null;let d=(0,t.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 pointer-events-auto",onClick:e=>{e.target,e.currentTarget},children:(0,t.jsx)("div",{ref:i,className:`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg pointer-events-auto ${e||""}`,onClick:e=>e.stopPropagation(),...l})});return(0,s.createPortal)(d,document.body)});n.displayName="AlertDialogContent";let d=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`flex flex-col space-y-2 text-center sm:text-left ${e||""}`,...a}));d.displayName="AlertDialogHeader";let c=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${e||""}`,...a}));c.displayName="AlertDialogFooter";let o=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("h2",{ref:s,className:`text-lg font-semibold ${e||""}`,...a}));o.displayName="AlertDialogTitle";let u=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("p",{ref:s,className:`text-sm text-gray-500 ${e||""}`,...a}));u.displayName="AlertDialogDescription";let m=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("button",{ref:s,className:`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...a}));m.displayName="AlertDialogAction";let x=a.forwardRef(({className:e,onClick:s,...i},r)=>{let{onOpenChange:n}=a.useContext(l);return(0,t.jsx)("button",{ref:r,onClick:e=>{s?.(e),e.defaultPrevented||n?.(!1)},className:`inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...i})});x.displayName="AlertDialogCancel",e.s(["AlertDialog",()=>i,"AlertDialogAction",()=>m,"AlertDialogCancel",()=>x,"AlertDialogContent",()=>n,"AlertDialogDescription",()=>u,"AlertDialogFooter",()=>c,"AlertDialogHeader",()=>d,"AlertDialogTitle",()=>o,"AlertDialogTrigger",()=>r])},940342,e=>{"use strict";let t=(0,e.i(930702).default)("file-question-mark",[["path",{d:"M12 17h.01",key:"p32p05"}],["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",key:"1mlx9k"}],["path",{d:"M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",key:"mhlwft"}]]);e.s(["default",()=>t])},335410,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(245421),l=e.i(775680),i=e.i(885205),r=e.i(696134),n=e.i(702470),d=e.i(850384),c=e.i(606443),o=e.i(965120),u=e.i(138227),m=e.i(940342),m=m,x=e.i(415588),p=e.i(759727),h=e.i(198513),g=e.i(822390),f=e.i(837149),y=e.i(771564),N=e.i(815954),j=e.i(4993);function b(){let{toast:e}=(0,j.useToast)(),[b,v]=(0,a.useState)(""),[C,w]=(0,a.useState)("all"),[k,$]=(0,a.useState)(!1),[A,M]=(0,a.useState)(null),{data:D,loading:q,error:T,refetch:S}=(0,s.useFindMany)("Quiz",{select:{id:!0,title:!0,description:!0,passingScore:!0,timeLimit:!0,maxAttempts:!0,isRequired:!0,createdAt:!0,updatedAt:!0},include:{lesson:{select:{id:!0,title:!0,courseModule:{select:{course:{select:{id:!0,title:!0}}}}}},_count:{select:{questions:!0,attempts:!0}}},orderBy:{createdAt:"desc"}}),[O]=(0,s.useDeleteOne)("Quiz"),E=(D||[]).filter(e=>{let t=e.title.toLowerCase().includes(b.toLowerCase())||(e.description||"").toLowerCase().includes(b.toLowerCase())||e.lesson.courseModule.course.title.toLowerCase().includes(b.toLowerCase()),a="all"===C||"required"===C&&e.isRequired||"optional"===C&&!e.isRequired;return t&&a}),R=async()=>{if(A)try{await O({where:{id:A}}),e({title:"Xóa thành công",description:"Quiz đã được xóa khỏi hệ thống",type:"success"}),S()}catch(t){e({title:"Lỗi",description:t.message||"Không thể xóa quiz",type:"error",variant:"destructive"})}finally{$(!1),M(null)}},U={total:D?.length||0,required:D?.filter(e=>e.isRequired).length||0,optional:D?.filter(e=>!e.isRequired).length||0,totalAttempts:D?.reduce((e,t)=>e+t._count.attempts,0)||0};return(0,t.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 space-y-6",children:[(0,t.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:"Quản lý bài kiểm tra"}),(0,t.jsxs)("p",{className:"text-sm sm:text-base text-gray-600 mt-1",children:["Tổng cộng ",U.total," bài kiểm tra"]})]}),(0,t.jsxs)(i.Button,{className:"gap-2",children:[(0,t.jsx)(c.Plus,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Tạo bài kiểm tra"}),(0,t.jsx)("span",{className:"sm:hidden",children:"Tạo mới"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-4",children:[(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardHeader,{className:"pb-3",children:[(0,t.jsx)(l.CardDescription,{children:"Tổng số"}),(0,t.jsx)(l.CardTitle,{className:"text-2xl",children:U.total})]})}),(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(l.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(h.AlertCircle,{className:"w-4 h-4 text-red-500"}),"Bắt buộc"]}),(0,t.jsx)(l.CardTitle,{className:"text-2xl text-red-600",children:U.required})]})}),(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(l.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(g.CheckCircle,{className:"w-4 h-4 text-blue-500"}),"Tùy chọn"]}),(0,t.jsx)(l.CardTitle,{className:"text-2xl text-blue-600",children:U.optional})]})}),(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(l.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(y.Users,{className:"w-4 h-4"}),"Lượt làm bài"]}),(0,t.jsx)(l.CardTitle,{className:"text-2xl text-green-600",children:U.totalAttempts})]})})]}),(0,t.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4",children:[(0,t.jsxs)("div",{className:"flex-1 relative",children:[(0,t.jsx)(d.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"}),(0,t.jsx)(r.Input,{placeholder:"Tìm kiếm bài kiểm tra...",value:b,onChange:e=>v(e.target.value),className:"pl-10"})]}),(0,t.jsxs)("div",{className:"flex gap-2 overflow-x-auto pb-2 sm:pb-0",children:[(0,t.jsx)(i.Button,{variant:"all"===C?"default":"outline",onClick:()=>w("all"),size:"sm",children:"Tất cả"}),(0,t.jsx)(i.Button,{variant:"required"===C?"default":"outline",onClick:()=>w("required"),size:"sm",children:"Bắt buộc"}),(0,t.jsx)(i.Button,{variant:"optional"===C?"default":"outline",onClick:()=>w("optional"),size:"sm",children:"Tùy chọn"})]})]}),q?(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),(0,t.jsx)("p",{className:"text-gray-500 mt-4",children:"Đang tải..."})]}):T?(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardContent,{className:"py-12 text-center",children:[(0,t.jsx)(h.AlertCircle,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),(0,t.jsxs)("p",{className:"text-red-600",children:["Lỗi: ",T.message]})]})}):0===E.length?(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardContent,{className:"py-12 text-center",children:[(0,t.jsx)(m.default,{className:"w-12 h-12 text-gray-400 mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-gray-500",children:"Không tìm thấy bài kiểm tra nào"})]})}):(0,t.jsx)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-4",children:E.map(e=>(0,t.jsxs)(l.Card,{className:"hover:shadow-lg transition-shadow",children:[(0,t.jsx)(l.CardHeader,{className:"pb-3",children:(0,t.jsxs)("div",{className:"flex items-start justify-between gap-3",children:[(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsxs)("div",{className:"flex items-start gap-2 mb-2",children:[(0,t.jsx)(m.default,{className:"w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"}),(0,t.jsx)(l.CardTitle,{className:"text-base line-clamp-2",children:e.title})]}),e.description&&(0,t.jsx)(l.CardDescription,{className:"line-clamp-2 text-xs",children:e.description})]}),e.isRequired&&(0,t.jsxs)(n.Badge,{variant:"destructive",className:"flex-shrink-0",children:[(0,t.jsx)(h.AlertCircle,{className:"w-3 h-3 mr-1"}),"Bắt buộc"]})]})}),(0,t.jsxs)(l.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"p-3 bg-gray-50 rounded-lg text-sm",children:[(0,t.jsx)("p",{className:"text-gray-500 mb-1",children:"Khóa học"}),(0,t.jsx)("p",{className:"font-medium text-gray-900 truncate",children:e.lesson.courseModule.course.title}),(0,t.jsxs)("p",{className:"text-gray-600 text-xs mt-1 truncate",children:["Bài học: ",e.lesson.title]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-3",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)(f.Target,{className:"w-4 h-4 text-green-600"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-gray-500 text-xs",children:"Điểm đạt"}),(0,t.jsxs)("p",{className:"font-semibold text-gray-900",children:[e.passingScore,"%"]})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)(x.Clock,{className:"w-4 h-4 text-orange-600"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-gray-500 text-xs",children:"Thời gian"}),(0,t.jsx)("p",{className:"font-semibold text-gray-900",children:e.timeLimit?`${e.timeLimit} ph\xfat`:"Không giới hạn"})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)(p.TrendingUp,{className:"w-4 h-4 text-blue-600"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-gray-500 text-xs",children:"Số lần làm"}),(0,t.jsx)("p",{className:"font-semibold text-gray-900",children:e.maxAttempts?`${e.maxAttempts} lần`:"Không giới hạn"})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm",children:[(0,t.jsx)(m.default,{className:"w-4 h-4 text-purple-600"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-gray-500 text-xs",children:"Câu hỏi"}),(0,t.jsx)("p",{className:"font-semibold text-gray-900",children:e._count.questions})]})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-4 pt-3 border-t text-xs text-gray-600",children:[(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(y.Users,{className:"w-3 h-3"}),(0,t.jsxs)("span",{children:[e._count.attempts," lượt làm"]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(x.Clock,{className:"w-3 h-3"}),(0,t.jsx)("span",{children:new Date(e.createdAt).toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"})})]})]}),(0,t.jsxs)("div",{className:"flex gap-2 pt-3 border-t",children:[(0,t.jsxs)(i.Button,{variant:"outline",size:"sm",className:"flex-1 gap-2",children:[(0,t.jsx)(o.Edit,{className:"w-4 h-4"}),"Chỉnh sửa"]}),(0,t.jsxs)(i.Button,{variant:"outline",size:"sm",className:"flex-1 gap-2 text-red-600 hover:text-red-700",onClick:()=>{M(e.id),$(!0)},children:[(0,t.jsx)(u.Trash2,{className:"w-4 h-4"}),"Xóa"]})]})]})]},e.id))}),(0,t.jsx)(N.AlertDialog,{open:k,onOpenChange:$,children:(0,t.jsxs)(N.AlertDialogContent,{children:[(0,t.jsxs)(N.AlertDialogHeader,{children:[(0,t.jsx)(N.AlertDialogTitle,{children:"Xác nhận xóa"}),(0,t.jsx)(N.AlertDialogDescription,{children:"Bạn có chắc chắn muốn xóa bài kiểm tra này? Hành động này không thể hoàn tác và sẽ xóa tất cả câu hỏi và kết quả làm bài liên quan."})]}),(0,t.jsxs)(N.AlertDialogFooter,{children:[(0,t.jsx)(N.AlertDialogCancel,{children:"Hủy"}),(0,t.jsx)(N.AlertDialogAction,{onClick:R,className:"bg-red-600 hover:bg-red-700",children:"Xóa"})]})]})})]})}e.s(["default",()=>b],335410)}]);