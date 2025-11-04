(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,638381,e=>{"use strict";let t=(0,e.i(930702).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},591353,e=>{"use strict";let t=(0,e.i(930702).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["default",()=>t])},404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},874061,e=>{"use strict";let t=(0,e.i(930702).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["default",()=>t])},138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},994315,e=>{"use strict";let t=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>t])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},850384,62476,e=>{"use strict";let t=(0,e.i(930702).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["default",()=>t],62476),e.s(["Search",()=>t],850384)},696134,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let r=a.forwardRef(({className:e,type:a,...r},l)=>(0,t.jsx)("input",{type:a,className:(0,s.cn)("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:l,...r}));r.displayName="Input",e.s(["Input",()=>r])},775680,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let r=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...a}));r.displayName="Card";let l=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",e),...a}));l.displayName="CardHeader";let i=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("h3",{ref:r,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",e),...a}));i.displayName="CardTitle";let n=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("p",{ref:r,className:(0,s.cn)("text-sm text-muted-foreground",e),...a}));n.displayName="CardDescription";let d=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("p-6 pt-0",e),...a}));d.displayName="CardContent";let o=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("flex items-center p-6 pt-0",e),...a}));o.displayName="CardFooter",e.s(["Card",()=>r,"CardContent",()=>d,"CardDescription",()=>n,"CardFooter",()=>o,"CardHeader",()=>l,"CardTitle",()=>i])},702470,e=>{"use strict";var t=e.i(44990),a=e.i(207298),s=e.i(541428);let r=(0,a.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function l({className:e,variant:a,...l}){return(0,t.jsx)("span",{className:(0,s.cn)(r({variant:a}),e),...l})}e.s(["Badge",()=>l])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),s=e.i(529590),r=e.i(403055),l=e.i(984804);let i=l.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,n=l.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,d=l.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,o=l.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,c=l.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,u=l.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=l.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,h=l.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,p=l.gql`
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
`,f=l.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,g=l.gql`
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
`,x=l.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,y=l.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,N=l.gql`
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
`,v=l.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,b=l.gql`
  mutation ClearCache {
    clearCache
  }
`;function j(e,a,s){let r=!!localStorage.getItem("accessToken"),l=s?.skip||s?.requireAuth!==!1&&!r,{data:n,loading:d,error:o,refetch:c}=(0,t.useQuery)(i,{variables:{modelName:e,input:a||{}},skip:l,fetchPolicy:s?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:o,refetch:c}}function w(e,a,s,r){let l=!!localStorage.getItem("accessToken"),i="string"==typeof a?a:a?.id;i||r?.skip;let d=r?.skip||!i||r?.requireAuth!==!1&&!l,{data:o,loading:c,error:u,refetch:m}=(0,t.useQuery)(n,{variables:{modelName:e,input:{id:i||"",select:s?.select,include:s?.include}},skip:d});return{data:o?.findById,loading:c,error:u,refetch:m}}function C(e,a,s){let[l,i]=(0,r.useState)(a?.page||1),[n,d]=(0,r.useState)(a?.limit||10),c=!!localStorage.getItem("accessToken"),u=s?.skip||s?.requireAuth!==!1&&!c,{data:m,loading:h,error:p,refetch:f}=(0,t.useQuery)(o,{variables:{modelName:e,input:{page:l,limit:n,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:u,fetchPolicy:"cache-and-network"}),g=m?.findManyPaginated,x=(0,r.useCallback)(e=>{i(e)},[]),y=(0,r.useCallback)(()=>{g?.meta.hasNextPage&&i(e=>e+1)},[g]),N=(0,r.useCallback)(()=>{g?.meta.hasPrevPage&&i(e=>e-1)},[g]),v=(0,r.useCallback)(e=>{d(e),i(1)},[]);return{data:g?.data,meta:g?.meta,loading:h,error:p,refetch:f,page:l,limit:n,goToPage:x,nextPage:y,prevPage:N,changeLimit:v}}function k(e,a,s){let{data:r,loading:l,error:i,refetch:n}=(0,t.useQuery)(c,{variables:{modelName:e,where:a},skip:s?.skip});return{count:r?.count,loading:l,error:i,refetch:n}}function $(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(h,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a=await s({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[s,e]),{data:l?.createOne,loading:i,error:n}]}function A(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(f,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let r=await s({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return r.data?.updateOne},[s,e]),{data:l?.updateOne,loading:i,error:n}]}function D(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(x,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let r=await s({variables:{modelName:e,input:{id:a,select:t.select}}});return r.data?.deleteOne},[s,e]),{data:l?.deleteOne,loading:i,error:n}]}function M(e){let t=(0,s.useApolloClient)(),[l,d]=$(e),[o,u]=function(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(p,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.createMany},[s,e]),{data:l?.createMany,loading:i,error:n}]}(e),[m,h]=A(e),[f,x]=function(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(g,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.updateMany},[s,e]),{data:l?.updateMany,loading:i,error:n}]}(e),[v,b]=D(e),[j,w]=function(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(y,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,where:t}});return a.data?.deleteMany},[s,e]),{data:l?.deleteMany,loading:i,error:n}]}(e),[C,k]=function(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(N,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.upsert},[s,e]),{data:l?.upsert,loading:i,error:n}]}(e),M=(0,r.useCallback)(async a=>(await t.query({query:i,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:M,findUnique:(0,r.useCallback)(async(a,s)=>(await t.query({query:n,variables:{model:e,where:a,...s},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,r.useCallback)(async a=>(await t.query({query:c,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:l,createMany:o,updateOne:m,updateMany:f,deleteOne:v,deleteMany:j,upsert:C,states:{createOne:d,createMany:u,updateOne:h,updateMany:x,deleteOne:b,deleteMany:w,upsert:k},loading:d.loading||u.loading||h.loading||x.loading||b.loading||w.loading||k.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,b,"COUNT",0,c,"CREATE_MANY",0,p,"CREATE_ONE",0,h,"DELETE_MANY",0,y,"DELETE_ONE",0,x,"FIND_FIRST",0,d,"FIND_MANY",0,i,"FIND_MANY_PAGINATED",0,o,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,v,"GROUP_BY",0,m,"UPDATE_MANY",0,g,"UPDATE_ONE",0,f,"UPSERT",0,N],272901),e.s(["useCRUD",()=>M,"useCount",()=>k,"useCreateOne",()=>$,"useDeleteOne",()=>D,"useFindMany",()=>j,"useFindManyPaginated",()=>C,"useFindUnique",()=>w,"useUpdateOne",()=>A],245421)},381299,e=>{"use strict";let t=(0,e.i(930702).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);e.s(["default",()=>t])},965120,e=>{"use strict";var t=e.i(381299);e.s(["Edit",()=>t.default])},674181,e=>{"use strict";let t=(0,e.i(930702).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);e.s(["default",()=>t])},553579,e=>{"use strict";var t=e.i(674181);e.s(["Star",()=>t.default])},815954,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(940392);let r=a.createContext({}),l=({children:e,open:a,onOpenChange:s})=>a?(0,t.jsx)(r.Provider,{value:{onOpenChange:s},children:e}):null,i=a.forwardRef(({className:e,children:s,asChild:r,...l},i)=>r&&a.isValidElement(s)?a.cloneElement(s,{ref:i,...l}):(0,t.jsx)("button",{ref:i,className:e,...l,children:s}));i.displayName="AlertDialogTrigger";let n=a.forwardRef(({className:e,...r},l)=>{let[i,n]=a.useState(!1);if(a.useEffect(()=>(n(!0),()=>n(!1)),[]),!i)return null;let d=(0,t.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 pointer-events-auto",onClick:e=>{e.target,e.currentTarget},children:(0,t.jsx)("div",{ref:l,className:`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg pointer-events-auto ${e||""}`,onClick:e=>e.stopPropagation(),...r})});return(0,s.createPortal)(d,document.body)});n.displayName="AlertDialogContent";let d=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`flex flex-col space-y-2 text-center sm:text-left ${e||""}`,...a}));d.displayName="AlertDialogHeader";let o=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${e||""}`,...a}));o.displayName="AlertDialogFooter";let c=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("h2",{ref:s,className:`text-lg font-semibold ${e||""}`,...a}));c.displayName="AlertDialogTitle";let u=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("p",{ref:s,className:`text-sm text-gray-500 ${e||""}`,...a}));u.displayName="AlertDialogDescription";let m=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("button",{ref:s,className:`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...a}));m.displayName="AlertDialogAction";let h=a.forwardRef(({className:e,onClick:s,...l},i)=>{let{onOpenChange:n}=a.useContext(r);return(0,t.jsx)("button",{ref:i,onClick:e=>{s?.(e),e.defaultPrevented||n?.(!1)},className:`inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...l})});h.displayName="AlertDialogCancel",e.s(["AlertDialog",()=>l,"AlertDialogAction",()=>m,"AlertDialogCancel",()=>h,"AlertDialogContent",()=>n,"AlertDialogDescription",()=>u,"AlertDialogFooter",()=>o,"AlertDialogHeader",()=>d,"AlertDialogTitle",()=>c,"AlertDialogTrigger",()=>i])},271739,e=>{"use strict";let t=(0,e.i(930702).default)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]);e.s(["default",()=>t])},450071,e=>{"use strict";var t=e.i(271739);e.s(["Sparkles",()=>t.default])},701490,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(130775),r=e.i(245421),l=e.i(775680),i=e.i(885205),n=e.i(696134),d=e.i(702470),o=e.i(606443),c=e.i(850384),u=e.i(965120),m=e.i(138227),h=e.i(404210),p=e.i(771564),f=e.i(415588),g=e.i(553579),x=e.i(198513),y=e.i(608631),N=e.i(450071),v=e.i(815954),b=e.i(4993);function j(){let e=(0,s.useRouter)(),{toast:j}=(0,b.useToast)(),[w,C]=(0,a.useState)(""),[k,$]=(0,a.useState)("all"),[A,D]=(0,a.useState)(!1),[M,S]=(0,a.useState)(null),{data:q,loading:O,error:T,refetch:E}=(0,r.useFindMany)("Course",{select:{id:!0,title:!0,slug:!0,description:!0,level:!0,price:!0,thumbnail:!0,status:!0,createdAt:!0,duration:!0},include:{_count:{select:{enrollments:!0,modules:!0,reviews:!0}},instructor:{select:{id:!0,firstName:!0,lastName:!0,username:!0}}},orderBy:{createdAt:"desc"}}),[B,{loading:P}]=(0,r.useDeleteOne)("Course"),[U]=(0,r.useUpdateOne)("Course"),I=(q||[]).filter(e=>{let t=e.title.toLowerCase().includes(w.toLowerCase())||(e.description||"").toLowerCase().includes(w.toLowerCase()),a="all"===k||"published"===k&&"PUBLISHED"===e.status||"draft"===k&&"DRAFT"===e.status;return t&&a}),R=()=>{e.push("/lms/admin/courses/create")},F=async()=>{if(M)try{await B({where:{id:M.id}}),j({title:"Thành công",description:`Đ\xe3 x\xf3a kh\xf3a học "${M.title}"`,type:"success"}),D(!1),S(null),E()}catch(e){j({title:"Lỗi",description:e.message||"Không thể xóa khóa học",type:"error"})}},L=async e=>{try{let t="PUBLISHED"===e.status?"DRAFT":"PUBLISHED";await U({where:{id:e.id},data:{status:t}}),j({title:"Thành công",description:`Đ\xe3 ${"PUBLISHED"===t?"xuất bản":"chuyển về nháp"} kh\xf3a học "${e.title}"`,type:"success"}),E()}catch(e){j({title:"Lỗi",description:e.message||"Không thể cập nhật trạng thái",type:"error"})}};return(0,t.jsxs)("div",{className:"p-8 space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Quản lý khóa học"}),(0,t.jsxs)("p",{className:"text-gray-600 mt-1",children:["Tổng cộng ",q?.length||0," khóa học"]})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(i.Button,{onClick:R,variant:"outline",className:"gap-2",children:[(0,t.jsx)(o.Plus,{className:"w-4 h-4"}),"Tạo thủ công"]}),(0,t.jsxs)(i.Button,{onClick:()=>{e.push("/lms/admin/courses/create-with-ai")},className:"gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",children:[(0,t.jsx)(N.Sparkles,{className:"w-4 h-4"}),"Tạo với AI"]})]})]}),(0,t.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4",children:[(0,t.jsxs)("div",{className:"flex-1 relative",children:[(0,t.jsx)(c.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"}),(0,t.jsx)(n.Input,{placeholder:"Tìm kiếm khóa học...",value:w,onChange:e=>C(e.target.value),className:"pl-10"})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(i.Button,{variant:"all"===k?"default":"outline",onClick:()=>$("all"),children:"Tất cả"}),(0,t.jsx)(i.Button,{variant:"published"===k?"default":"outline",onClick:()=>$("published"),children:"Đã xuất bản"}),(0,t.jsx)(i.Button,{variant:"draft"===k?"default":"outline",onClick:()=>$("draft"),children:"Nháp"})]})]}),O?(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),(0,t.jsx)("p",{className:"text-gray-500 mt-4",children:"Đang tải..."})]}):T?(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardContent,{className:"py-12 text-center",children:[(0,t.jsx)(x.AlertCircle,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),(0,t.jsxs)("p",{className:"text-red-600",children:["Lỗi: ",T.message]})]})}):0===I.length?(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardContent,{className:"py-12 text-center",children:[(0,t.jsx)(y.BookOpen,{className:"w-12 h-12 text-gray-400 mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-gray-500",children:"Không tìm thấy khóa học nào"}),(0,t.jsx)(i.Button,{onClick:R,className:"mt-4",children:"Tạo khóa học đầu tiên"})]})}):(0,t.jsx)("div",{className:"grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6",children:I.map(a=>{let s;return(0,t.jsxs)(l.Card,{className:"hover:shadow-lg transition-shadow",children:[(0,t.jsxs)(l.CardHeader,{children:[(0,t.jsxs)("div",{className:"flex items-start justify-between mb-2",children:[(0,t.jsx)(d.Badge,{variant:"PUBLISHED"===a.status?"default":"secondary",className:"cursor-pointer",onClick:()=>L(a),children:"PUBLISHED"===a.status?"Đã xuất bản":"Nháp"}),(0,t.jsx)(d.Badge,{variant:"outline",children:a.level||"Beginner"})]}),(0,t.jsx)(l.CardTitle,{className:"line-clamp-2",children:a.title}),(0,t.jsx)(l.CardDescription,{className:"mt-2 line-clamp-2",children:a.description||"Chưa có mô tả"})]}),(0,t.jsxs)(l.CardContent,{className:"space-y-4",children:[a.instructor&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-600",children:[(0,t.jsx)(p.Users,{className:"w-4 h-4"}),(0,t.jsxs)("span",{children:["Giảng viên: ",a.instructor.firstName&&a.instructor.lastName?`${a.instructor.firstName} ${a.instructor.lastName}`:a.instructor.username]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-4 text-sm text-gray-600",children:[(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(p.Users,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:a._count?.enrollments||0})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(y.BookOpen,{className:"w-4 h-4"}),(0,t.jsxs)("span",{children:[a._count?.modules||0," modules"]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(f.Clock,{className:"w-4 h-4"}),(0,t.jsxs)("span",{children:[a.duration||0,"p"]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-1",children:[(0,t.jsx)(g.Star,{className:"w-4 h-4 text-yellow-500"}),(0,t.jsx)("span",{children:a._count?.reviews||0})]})]}),(0,t.jsx)("div",{className:"text-lg font-bold text-blue-600",children:a.price?(s=a.price,new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(s)):"Miễn phí"}),(0,t.jsxs)("div",{className:"flex gap-2 pt-2",children:[(0,t.jsxs)(i.Button,{variant:"outline",size:"sm",className:"flex-1 gap-2",onClick:()=>{var t;return t=a.id,void e.push(`/lms/admin/courses/${t}`)},children:[(0,t.jsx)(h.Eye,{className:"w-4 h-4"}),"Xem"]}),(0,t.jsxs)(i.Button,{variant:"outline",size:"sm",className:"flex-1 gap-2",onClick:()=>{var t;return t=a.id,void e.push(`/lms/admin/courses/${t}/edit`)},children:[(0,t.jsx)(u.Edit,{className:"w-4 h-4"}),"Sửa"]}),(0,t.jsx)(i.Button,{variant:"outline",size:"sm",className:"gap-2 text-red-600 hover:text-red-700 hover:bg-red-50",onClick:()=>{S(a),D(!0)},children:(0,t.jsx)(m.Trash2,{className:"w-4 h-4"})})]})]})]},a.id)})}),(0,t.jsx)(v.AlertDialog,{open:A,onOpenChange:D,children:(0,t.jsxs)(v.AlertDialogContent,{children:[(0,t.jsxs)(v.AlertDialogHeader,{children:[(0,t.jsx)(v.AlertDialogTitle,{children:"Xác nhận xóa khóa học"}),(0,t.jsxs)(v.AlertDialogDescription,{children:["Bạn có chắc chắn muốn xóa khóa học ",(0,t.jsxs)("strong",{children:['"',M?.title,'"']}),"?",(0,t.jsx)("br",{}),(0,t.jsx)("br",{}),(0,t.jsx)("span",{className:"text-red-600 font-semibold",children:"Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan (bài học, quiz, enrollment, v.v.)"})]})]}),(0,t.jsxs)(v.AlertDialogFooter,{children:[(0,t.jsx)(v.AlertDialogCancel,{children:"Hủy"}),(0,t.jsx)(v.AlertDialogAction,{onClick:F,disabled:P,className:"bg-red-600 hover:bg-red-700",children:P?"Đang xóa...":"Xóa khóa học"})]})]})})]})}e.s(["default",()=>j])}]);