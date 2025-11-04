(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,874061,e=>{"use strict";let a=(0,e.i(930702).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["default",()=>a])},138227,e=>{"use strict";var a=e.i(874061);e.s(["Trash2",()=>a.default])},994315,e=>{"use strict";let a=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>a])},606443,e=>{"use strict";var a=e.i(994315);e.s(["Plus",()=>a.default])},245421,272901,e=>{"use strict";e.i(308140);var a=e.i(429105),t=e.i(950988),s=e.i(529590),l=e.i(403055),i=e.i(984804);let r=i.gql`
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
`,o=i.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,c=i.gql`
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
`,p=i.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,g=i.gql`
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
`,f=i.gql`
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
`,x=i.gql`
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
`,b=i.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,v=i.gql`
  mutation ClearCache {
    clearCache
  }
`;function j(e,t,s){let l=!!localStorage.getItem("accessToken"),i=s?.skip||s?.requireAuth!==!1&&!l,{data:n,loading:d,error:o,refetch:c}=(0,a.useQuery)(r,{variables:{modelName:e,input:t||{}},skip:i,fetchPolicy:s?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:o,refetch:c}}function w(e,t,s,l){let i=!!localStorage.getItem("accessToken"),r="string"==typeof t?t:t?.id;r||l?.skip;let d=l?.skip||!r||l?.requireAuth!==!1&&!i,{data:o,loading:c,error:u,refetch:m}=(0,a.useQuery)(n,{variables:{modelName:e,input:{id:r||"",select:s?.select,include:s?.include}},skip:d});return{data:o?.findById,loading:c,error:u,refetch:m}}function C(e,t,s){let[i,r]=(0,l.useState)(t?.page||1),[n,d]=(0,l.useState)(t?.limit||10),c=!!localStorage.getItem("accessToken"),u=s?.skip||s?.requireAuth!==!1&&!c,{data:m,loading:p,error:g,refetch:h}=(0,a.useQuery)(o,{variables:{modelName:e,input:{page:i,limit:n,where:t?.where,orderBy:t?.orderBy,select:t?.select,include:t?.include}},skip:u,fetchPolicy:"cache-and-network"}),f=m?.findManyPaginated,x=(0,l.useCallback)(e=>{r(e)},[]),y=(0,l.useCallback)(()=>{f?.meta.hasNextPage&&r(e=>e+1)},[f]),N=(0,l.useCallback)(()=>{f?.meta.hasPrevPage&&r(e=>e-1)},[f]),b=(0,l.useCallback)(e=>{d(e),r(1)},[]);return{data:f?.data,meta:f?.meta,loading:p,error:g,refetch:h,page:i,limit:n,goToPage:x,nextPage:y,prevPage:N,changeLimit:b}}function D(e,t,s){let{data:l,loading:i,error:r,refetch:n}=(0,a.useQuery)(c,{variables:{modelName:e,where:t},skip:s?.skip});return{count:l?.count,loading:i,error:r,refetch:n}}function $(e,a){let[s,{data:i,loading:r,error:n}]=(0,t.useMutation)(p,{refetchQueries:a?.refetchQueries});return[(0,l.useCallback)(async a=>{let t=await s({variables:{modelName:e,input:{data:a.data,select:a.select,include:a.include}}});return t.data?.createOne},[s,e]),{data:i?.createOne,loading:r,error:n}]}function k(e,a){let[s,{data:i,loading:r,error:n}]=(0,t.useMutation)(h,{refetchQueries:a?.refetchQueries});return[(0,l.useCallback)(async a=>{let t="string"==typeof a.where?a.where:a.where?.id;if(!t)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let l=await s({variables:{modelName:e,input:{id:t,data:a.data,select:a.select,include:a.include}}});return l.data?.updateOne},[s,e]),{data:i?.updateOne,loading:r,error:n}]}function A(e,a){let[s,{data:i,loading:r,error:n}]=(0,t.useMutation)(x,{refetchQueries:a?.refetchQueries});return[(0,l.useCallback)(async a=>{let t="string"==typeof a.where?a.where:a.where?.id;if(!t)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let l=await s({variables:{modelName:e,input:{id:t,select:a.select}}});return l.data?.deleteOne},[s,e]),{data:i?.deleteOne,loading:r,error:n}]}function M(e){let a=(0,s.useApolloClient)(),[i,d]=$(e),[o,u]=function(e,a){let[s,{data:i,loading:r,error:n}]=(0,t.useMutation)(g,{refetchQueries:void 0});return[(0,l.useCallback)(async a=>{let t=await s({variables:{model:e,...a}});return t.data?.createMany},[s,e]),{data:i?.createMany,loading:r,error:n}]}(e),[m,p]=k(e),[h,x]=function(e,a){let[s,{data:i,loading:r,error:n}]=(0,t.useMutation)(f,{refetchQueries:void 0});return[(0,l.useCallback)(async a=>{let t=await s({variables:{model:e,...a}});return t.data?.updateMany},[s,e]),{data:i?.updateMany,loading:r,error:n}]}(e),[b,v]=A(e),[j,w]=function(e,a){let[s,{data:i,loading:r,error:n}]=(0,t.useMutation)(y,{refetchQueries:void 0});return[(0,l.useCallback)(async a=>{let t=await s({variables:{model:e,where:a}});return t.data?.deleteMany},[s,e]),{data:i?.deleteMany,loading:r,error:n}]}(e),[C,D]=function(e,a){let[s,{data:i,loading:r,error:n}]=(0,t.useMutation)(N,{refetchQueries:void 0});return[(0,l.useCallback)(async a=>{let t=await s({variables:{model:e,...a}});return t.data?.upsert},[s,e]),{data:i?.upsert,loading:r,error:n}]}(e),M=(0,l.useCallback)(async t=>(await a.query({query:r,variables:{model:e,...t},fetchPolicy:"network-only"})).data.findMany,[a,e]);return{findMany:M,findUnique:(0,l.useCallback)(async(t,s)=>(await a.query({query:n,variables:{model:e,where:t,...s},fetchPolicy:"network-only"})).data.findUnique,[a,e]),count:(0,l.useCallback)(async t=>(await a.query({query:c,variables:{model:e,where:t},fetchPolicy:"network-only"})).data.count,[a,e]),createOne:i,createMany:o,updateOne:m,updateMany:h,deleteOne:b,deleteMany:j,upsert:C,states:{createOne:d,createMany:u,updateOne:p,updateMany:x,deleteOne:v,deleteMany:w,upsert:D},loading:d.loading||u.loading||p.loading||x.loading||v.loading||w.loading||D.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,v,"COUNT",0,c,"CREATE_MANY",0,g,"CREATE_ONE",0,p,"DELETE_MANY",0,y,"DELETE_ONE",0,x,"FIND_FIRST",0,d,"FIND_MANY",0,r,"FIND_MANY_PAGINATED",0,o,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,b,"GROUP_BY",0,m,"UPDATE_MANY",0,f,"UPDATE_ONE",0,h,"UPSERT",0,N],272901),e.s(["useCRUD",()=>M,"useCount",()=>D,"useCreateOne",()=>$,"useDeleteOne",()=>A,"useFindMany",()=>j,"useFindManyPaginated",()=>C,"useFindUnique",()=>w,"useUpdateOne",()=>k],245421)},775680,e=>{"use strict";var a=e.i(44990),t=e.i(403055),s=e.i(541428);let l=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)("div",{ref:l,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...t}));l.displayName="Card";let i=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)("div",{ref:l,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",e),...t}));i.displayName="CardHeader";let r=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)("h3",{ref:l,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",e),...t}));r.displayName="CardTitle";let n=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)("p",{ref:l,className:(0,s.cn)("text-sm text-muted-foreground",e),...t}));n.displayName="CardDescription";let d=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)("div",{ref:l,className:(0,s.cn)("p-6 pt-0",e),...t}));d.displayName="CardContent";let o=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)("div",{ref:l,className:(0,s.cn)("flex items-center p-6 pt-0",e),...t}));o.displayName="CardFooter",e.s(["Card",()=>l,"CardContent",()=>d,"CardDescription",()=>n,"CardFooter",()=>o,"CardHeader",()=>i,"CardTitle",()=>r])},696134,e=>{"use strict";var a=e.i(44990),t=e.i(403055),s=e.i(541428);let l=t.forwardRef(({className:e,type:t,...l},i)=>(0,a.jsx)("input",{type:t,className:(0,s.cn)("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...l}));l.displayName="Input",e.s(["Input",()=>l])},165429,e=>{"use strict";var a=e.i(44990),t=e.i(403055),s=e.i(873273),l=t.forwardRef((e,t)=>(0,a.jsx)(s.Primitive.label,{...e,ref:t,onMouseDown:a=>{a.target.closest("button, input, select, textarea")||(e.onMouseDown?.(a),!a.defaultPrevented&&a.detail>1&&a.preventDefault())}}));l.displayName="Label";var i=e.i(541428);function r({className:e,...t}){return(0,a.jsx)(l,{"data-slot":"label",className:(0,i.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...t})}e.s(["Label",()=>r],165429)},600547,e=>{"use strict";var a=e.i(44990),t=e.i(403055),s=e.i(541428);let l=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)("textarea",{className:(0,s.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:l,...t}));l.displayName="Textarea",e.s(["Textarea",()=>l])},381299,e=>{"use strict";let a=(0,e.i(930702).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);e.s(["default",()=>a])},965120,e=>{"use strict";var a=e.i(381299);e.s(["Edit",()=>a.default])},850384,62476,e=>{"use strict";let a=(0,e.i(930702).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["default",()=>a],62476),e.s(["Search",()=>a],850384)},137651,e=>{"use strict";var a=e.i(44990),t=e.i(403055),s=e.i(580523),l=e.i(888540),i=e.i(541428);let r=s.Root,n=s.Trigger,d=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)(s.Overlay,{ref:l,className:(0,i.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...t}));d.displayName=s.Overlay.displayName;let o=t.forwardRef(({className:e,children:t,...r},n)=>(0,a.jsxs)(s.Portal,{children:[(0,a.jsx)(d,{}),(0,a.jsxs)(s.Content,{ref:n,className:(0,i.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...r,children:[t,(0,a.jsxs)(s.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,a.jsx)(l.X,{className:"h-4 w-4"}),(0,a.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));o.displayName=s.Content.displayName;let c=({className:e,...t})=>(0,a.jsx)("div",{className:(0,i.cn)("flex flex-col space-y-1.5 text-center sm:text-left",e),...t});c.displayName="DialogHeader";let u=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)(s.Title,{ref:l,className:(0,i.cn)("text-lg font-semibold leading-none tracking-tight",e),...t}));u.displayName=s.Title.displayName;let m=t.forwardRef(({className:e,...t},l)=>(0,a.jsx)(s.Description,{ref:l,className:(0,i.cn)("text-sm text-muted-foreground",e),...t}));m.displayName=s.Description.displayName;let p=({className:e,...t})=>(0,a.jsx)("div",{className:(0,i.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...t});p.displayName="DialogFooter",e.s(["Dialog",()=>r,"DialogContent",()=>o,"DialogDescription",()=>m,"DialogFooter",()=>p,"DialogHeader",()=>c,"DialogTitle",()=>u,"DialogTrigger",()=>n])},815954,e=>{"use strict";var a=e.i(44990),t=e.i(403055),s=e.i(940392);let l=t.createContext({}),i=({children:e,open:t,onOpenChange:s})=>t?(0,a.jsx)(l.Provider,{value:{onOpenChange:s},children:e}):null,r=t.forwardRef(({className:e,children:s,asChild:l,...i},r)=>l&&t.isValidElement(s)?t.cloneElement(s,{ref:r,...i}):(0,a.jsx)("button",{ref:r,className:e,...i,children:s}));r.displayName="AlertDialogTrigger";let n=t.forwardRef(({className:e,...l},i)=>{let[r,n]=t.useState(!1);if(t.useEffect(()=>(n(!0),()=>n(!1)),[]),!r)return null;let d=(0,a.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 pointer-events-auto",onClick:e=>{e.target,e.currentTarget},children:(0,a.jsx)("div",{ref:i,className:`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg pointer-events-auto ${e||""}`,onClick:e=>e.stopPropagation(),...l})});return(0,s.createPortal)(d,document.body)});n.displayName="AlertDialogContent";let d=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("div",{ref:s,className:`flex flex-col space-y-2 text-center sm:text-left ${e||""}`,...t}));d.displayName="AlertDialogHeader";let o=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("div",{ref:s,className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${e||""}`,...t}));o.displayName="AlertDialogFooter";let c=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("h2",{ref:s,className:`text-lg font-semibold ${e||""}`,...t}));c.displayName="AlertDialogTitle";let u=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("p",{ref:s,className:`text-sm text-gray-500 ${e||""}`,...t}));u.displayName="AlertDialogDescription";let m=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("button",{ref:s,className:`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...t}));m.displayName="AlertDialogAction";let p=t.forwardRef(({className:e,onClick:s,...i},r)=>{let{onOpenChange:n}=t.useContext(l);return(0,a.jsx)("button",{ref:r,onClick:e=>{s?.(e),e.defaultPrevented||n?.(!1)},className:`inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...i})});p.displayName="AlertDialogCancel",e.s(["AlertDialog",()=>i,"AlertDialogAction",()=>m,"AlertDialogCancel",()=>p,"AlertDialogContent",()=>n,"AlertDialogDescription",()=>u,"AlertDialogFooter",()=>o,"AlertDialogHeader",()=>d,"AlertDialogTitle",()=>c,"AlertDialogTrigger",()=>r])},938190,e=>{"use strict";let a=(0,e.i(930702).default)("folder-open",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);e.s(["default",()=>a])},315185,e=>{"use strict";var a=e.i(938190);e.s(["FolderOpen",()=>a.default])},759216,e=>{"use strict";var a=e.i(44990),t=e.i(403055),s=e.i(245421),l=e.i(775680),i=e.i(885205),r=e.i(696134),n=e.i(606443),d=e.i(850384),o=e.i(965120),c=e.i(138227),u=e.i(736503),m=e.i(198513),p=e.i(608631),g=e.i(315185),h=e.i(137651),f=e.i(815954),x=e.i(165429),y=e.i(600547),N=e.i(4993);function b(){let{toast:e}=(0,N.useToast)(),[b,v]=(0,t.useState)(""),[j,w]=(0,t.useState)(!1),[C,D]=(0,t.useState)(!1),[$,k]=(0,t.useState)(!1),[A,M]=(0,t.useState)(null),[T,O]=(0,t.useState)({id:"",name:"",slug:"",description:""}),{data:S,loading:q,error:E,refetch:F}=(0,s.useFindMany)("CourseCategory",{select:{id:!0,name:!0,slug:!0,description:!0},include:{_count:{select:{courses:!0}}},orderBy:{name:"asc"}}),[P,{loading:R}]=(0,s.useCreateOne)("CourseCategory"),[I,{loading:U}]=(0,s.useUpdateOne)("CourseCategory"),[B,{loading:L}]=(0,s.useDeleteOne)("CourseCategory"),_=(S||[]).filter(e=>e.name.toLowerCase().includes(b.toLowerCase())||(e.description||"").toLowerCase().includes(b.toLowerCase())),H=()=>{k(!1),O({id:"",name:"",slug:"",description:""}),w(!0)},Q=async a=>{if(a.preventDefault(),!T.name.trim())return void e({title:"Lỗi",description:"Vui lòng nhập tên danh mục",type:"error"});try{$?(await I({where:{id:T.id},data:{name:T.name,slug:T.slug,description:T.description||null}}),e({title:"Thành công",description:"Đã cập nhật danh mục",type:"success"})):(await P({data:{name:T.name,slug:T.slug,description:T.description||null}}),e({title:"Thành công",description:"Đã tạo danh mục mới",type:"success"})),w(!1),O({id:"",name:"",slug:"",description:""}),F()}catch(a){e({title:"Lỗi",description:a.message||"Không thể lưu danh mục",type:"error"})}},J=async()=>{if(A)try{await B({where:{id:A.id}}),e({title:"Thành công",description:`Đ\xe3 x\xf3a danh mục "${A.name}"`,type:"success"}),D(!1),M(null),F()}catch(a){e({title:"Lỗi",description:a.message||"Không thể xóa danh mục",type:"error"})}};return(0,a.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 space-y-6",children:[(0,a.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:"Quản lý danh mục"}),(0,a.jsxs)("p",{className:"text-sm sm:text-base text-gray-600 mt-1",children:["Tổng cộng ",S?.length||0," danh mục"]})]}),(0,a.jsxs)(i.Button,{onClick:H,className:"gap-2 w-full sm:w-auto",children:[(0,a.jsx)(n.Plus,{className:"w-4 h-4"}),"Tạo danh mục mới"]})]}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(d.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"}),(0,a.jsx)(r.Input,{placeholder:"Tìm kiếm danh mục...",value:b,onChange:e=>v(e.target.value),className:"pl-10"})]}),q?(0,a.jsxs)("div",{className:"text-center py-12",children:[(0,a.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),(0,a.jsx)("p",{className:"text-gray-500 mt-4",children:"Đang tải..."})]}):E?(0,a.jsx)(l.Card,{children:(0,a.jsxs)(l.CardContent,{className:"py-12 text-center",children:[(0,a.jsx)(m.AlertCircle,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),(0,a.jsxs)("p",{className:"text-red-600",children:["Lỗi: ",E.message]})]})}):0===_.length?(0,a.jsx)(l.Card,{children:(0,a.jsxs)(l.CardContent,{className:"py-12 text-center",children:[(0,a.jsx)(g.FolderOpen,{className:"w-12 h-12 text-gray-400 mx-auto mb-4"}),(0,a.jsx)("p",{className:"text-gray-500 mb-4",children:"Không tìm thấy danh mục nào"}),(0,a.jsx)(i.Button,{onClick:H,children:"Tạo danh mục đầu tiên"})]})}):(0,a.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",children:_.map(e=>(0,a.jsxs)(l.Card,{className:"hover:shadow-lg transition-shadow",children:[(0,a.jsx)(l.CardHeader,{children:(0,a.jsx)("div",{className:"flex items-start justify-between",children:(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsx)("div",{className:"p-2 bg-blue-100 rounded-lg",children:(0,a.jsx)(u.Folder,{className:"w-5 h-5 text-blue-600"})}),(0,a.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,a.jsx)(l.CardTitle,{className:"text-base truncate",children:e.name}),(0,a.jsxs)("p",{className:"text-xs text-gray-500 truncate",children:["/",e.slug]})]})]})})}),(0,a.jsxs)(l.CardContent,{className:"space-y-4",children:[e.description&&(0,a.jsx)(l.CardDescription,{className:"line-clamp-2 text-sm",children:e.description}),(0,a.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-600",children:[(0,a.jsx)(p.BookOpen,{className:"w-4 h-4"}),(0,a.jsxs)("span",{children:[e._count?.courses||0," khóa học"]})]}),(0,a.jsxs)("div",{className:"flex gap-2 pt-2 border-t",children:[(0,a.jsxs)(i.Button,{variant:"outline",size:"sm",className:"flex-1 gap-2",onClick:()=>{k(!0),O({id:e.id,name:e.name,slug:e.slug,description:e.description||""}),w(!0)},children:[(0,a.jsx)(o.Edit,{className:"w-4 h-4"}),"Sửa"]}),(0,a.jsx)(i.Button,{variant:"outline",size:"sm",className:"gap-2 text-red-600 hover:text-red-700 hover:bg-red-50",onClick:()=>{M(e),D(!0)},disabled:(e._count?.courses||0)>0,children:(0,a.jsx)(c.Trash2,{className:"w-4 h-4"})})]})]})]},e.id))}),(0,a.jsx)(h.Dialog,{open:j,onOpenChange:w,children:(0,a.jsxs)(h.DialogContent,{className:"sm:max-w-[500px] max-h-[90vh] flex flex-col",children:[(0,a.jsxs)(h.DialogHeader,{children:[(0,a.jsx)(h.DialogTitle,{children:$?"Sửa danh mục":"Tạo danh mục mới"}),(0,a.jsx)(h.DialogDescription,{children:$?"Cập nhật thông tin danh mục":"Nhập thông tin danh mục mới"})]}),(0,a.jsx)("form",{onSubmit:Q,className:"flex-1 overflow-y-auto",children:(0,a.jsxs)("div",{className:"space-y-4 py-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(x.Label,{htmlFor:"name",children:"Tên danh mục *"}),(0,a.jsx)(r.Input,{id:"name",placeholder:"Ví dụ: Lập trình Web",value:T.name,onChange:e=>{var a;return a=e.target.value,void O({...T,name:a,slug:a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim()})},required:!0})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(x.Label,{htmlFor:"slug",children:"Slug"}),(0,a.jsx)(r.Input,{id:"slug",placeholder:"lap-trinh-web",value:T.slug,onChange:e=>O({...T,slug:e.target.value}),disabled:!0,className:"bg-gray-50"}),(0,a.jsx)("p",{className:"text-xs text-gray-500",children:"Tự động tạo từ tên danh mục"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(x.Label,{htmlFor:"description",children:"Mô tả"}),(0,a.jsx)(y.Textarea,{id:"description",placeholder:"Mô tả chi tiết về danh mục...",value:T.description,onChange:e=>O({...T,description:e.target.value}),rows:4})]})]})}),(0,a.jsxs)(h.DialogFooter,{className:"border-t pt-4",children:[(0,a.jsx)(i.Button,{type:"button",variant:"outline",onClick:()=>w(!1),disabled:R||U,children:"Hủy"}),(0,a.jsx)(i.Button,{type:"submit",onClick:Q,disabled:R||U,children:R||U?"Đang lưu...":$?"Cập nhật":"Tạo mới"})]})]})}),(0,a.jsx)(f.AlertDialog,{open:C,onOpenChange:D,children:(0,a.jsxs)(f.AlertDialogContent,{children:[(0,a.jsxs)(f.AlertDialogHeader,{children:[(0,a.jsx)(f.AlertDialogTitle,{children:"Xác nhận xóa danh mục"}),(0,a.jsxs)(f.AlertDialogDescription,{children:["Bạn có chắc chắn muốn xóa danh mục ",(0,a.jsxs)("strong",{children:['"',A?.name,'"']}),"?",(0,a.jsx)("br",{}),(0,a.jsx)("br",{}),(A?._count?.courses||0)>0?(0,a.jsxs)("span",{className:"text-red-600 font-semibold",children:["Danh mục này có ",A?._count?.courses," khóa học. Không thể xóa!"]}):(0,a.jsx)("span",{className:"text-gray-600",children:"Hành động này không thể hoàn tác."})]})]}),(0,a.jsxs)(f.AlertDialogFooter,{children:[(0,a.jsx)(f.AlertDialogCancel,{children:"Hủy"}),(0,a.jsx)(f.AlertDialogAction,{onClick:J,disabled:L||(A?._count?.courses||0)>0,className:"bg-red-600 hover:bg-red-700",children:L?"Đang xóa...":"Xóa danh mục"})]})]})})]})}e.s(["default",()=>b])}]);