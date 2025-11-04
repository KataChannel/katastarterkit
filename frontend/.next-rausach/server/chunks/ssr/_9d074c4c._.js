module.exports=[605751,a=>{"use strict";let b=(0,a.i(367990).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},411185,a=>{"use strict";var b=a.i(605751);a.s(["Clock",()=>b.default])},196915,a=>{"use strict";let b=(0,a.i(367990).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["default",()=>b])},785903,a=>{"use strict";var b=a.i(196915);a.s(["Eye",()=>b.default])},158464,a=>{"use strict";let b=(0,a.i(367990).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);a.s(["default",()=>b])},558767,a=>{"use strict";var b=a.i(158464);a.s(["Trash2",()=>b.default])},939816,a=>{"use strict";let b=(0,a.i(367990).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);a.s(["default",()=>b])},723593,a=>{"use strict";var b=a.i(939816);a.s(["Plus",()=>b.default])},629432,575389,a=>{"use strict";let b=(0,a.i(367990).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);a.s(["default",()=>b],575389),a.s(["Search",()=>b],629432)},478184,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,type:c,...e},f)=>(0,b.jsx)("input",{type:c,className:(0,d.cn)("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:f,...e}));e.displayName="Input",a.s(["Input",()=>e])},975780,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...c}));e.displayName="Card";let f=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex flex-col space-y-1.5 p-6",a),...c}));f.displayName="CardHeader";let g=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("h3",{ref:e,className:(0,d.cn)("text-2xl font-semibold leading-none tracking-tight",a),...c}));g.displayName="CardTitle";let h=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("p",{ref:e,className:(0,d.cn)("text-sm text-muted-foreground",a),...c}));h.displayName="CardDescription";let i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("p-6 pt-0",a),...c}));i.displayName="CardContent";let j=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex items-center p-6 pt-0",a),...c}));j.displayName="CardFooter",a.s(["Card",()=>e,"CardContent",()=>i,"CardDescription",()=>h,"CardFooter",()=>j,"CardHeader",()=>f,"CardTitle",()=>g])},293470,a=>{"use strict";var b=a.i(321248),c=a.i(13801),d=a.i(422171);let e=(0,c.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function f({className:a,variant:c,...f}){return(0,b.jsx)("span",{className:(0,d.cn)(e({variant:c}),a),...f})}a.s(["Badge",()=>f])},235746,769056,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(563718),e=a.i(651332),f=a.i(772213);let g=f.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,h=f.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,i=f.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,j=f.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,k=f.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,l=f.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=f.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,n=f.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,o=f.gql`
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
`,p=f.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,q=f.gql`
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
`,r=f.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,s=f.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,t=f.gql`
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
`,u=f.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,v=f.gql`
  mutation ClearCache {
    clearCache
  }
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},855918,a=>{"use strict";let b=(0,a.i(367990).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);a.s(["default",()=>b])},687649,a=>{"use strict";var b=a.i(855918);a.s(["Edit",()=>b.default])},52841,a=>{"use strict";let b=(0,a.i(367990).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);a.s(["default",()=>b])},520215,a=>{"use strict";var b=a.i(52841);a.s(["Star",()=>b.default])},730705,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(194296);let e=c.createContext({}),f=({children:a,open:c,onOpenChange:d})=>c?(0,b.jsx)(e.Provider,{value:{onOpenChange:d},children:a}):null,g=c.forwardRef(({className:a,children:d,asChild:e,...f},g)=>e&&c.isValidElement(d)?c.cloneElement(d,{ref:g,...f}):(0,b.jsx)("button",{ref:g,className:a,...f,children:d}));g.displayName="AlertDialogTrigger";let h=c.forwardRef(({className:a,...e},f)=>{let[g,h]=c.useState(!1);if(c.useEffect(()=>(h(!0),()=>h(!1)),[]),!g)return null;let i=(0,b.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 pointer-events-auto",onClick:a=>{a.target,a.currentTarget},children:(0,b.jsx)("div",{ref:f,className:`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg pointer-events-auto ${a||""}`,onClick:a=>a.stopPropagation(),...e})});return(0,d.createPortal)(i,document.body)});h.displayName="AlertDialogContent";let i=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`flex flex-col space-y-2 text-center sm:text-left ${a||""}`,...c}));i.displayName="AlertDialogHeader";let j=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${a||""}`,...c}));j.displayName="AlertDialogFooter";let k=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("h2",{ref:d,className:`text-lg font-semibold ${a||""}`,...c}));k.displayName="AlertDialogTitle";let l=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("p",{ref:d,className:`text-sm text-gray-500 ${a||""}`,...c}));l.displayName="AlertDialogDescription";let m=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("button",{ref:d,className:`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${a||""}`,...c}));m.displayName="AlertDialogAction";let n=c.forwardRef(({className:a,onClick:d,...f},g)=>{let{onOpenChange:h}=c.useContext(e);return(0,b.jsx)("button",{ref:g,onClick:a=>{d?.(a),a.defaultPrevented||h?.(!1)},className:`inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${a||""}`,...f})});n.displayName="AlertDialogCancel",a.s(["AlertDialog",()=>f,"AlertDialogAction",()=>m,"AlertDialogCancel",()=>n,"AlertDialogContent",()=>h,"AlertDialogDescription",()=>l,"AlertDialogFooter",()=>j,"AlertDialogHeader",()=>i,"AlertDialogTitle",()=>k,"AlertDialogTrigger",()=>g])},625455,a=>{"use strict";let b=(0,a.i(367990).default)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]);a.s(["default",()=>b])},434135,a=>{"use strict";var b=a.i(625455);a.s(["Sparkles",()=>b.default])},250801,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(53627),e=a.i(235746),f=a.i(975780),g=a.i(202979),h=a.i(478184),i=a.i(293470),j=a.i(723593),k=a.i(629432),l=a.i(687649),m=a.i(558767),n=a.i(785903),o=a.i(358054),p=a.i(411185),q=a.i(520215),r=a.i(327987),s=a.i(26720),t=a.i(434135),u=a.i(730705),v=a.i(234211);function w(){let a=(0,d.useRouter)(),{toast:w}=(0,v.useToast)(),[x,y]=(0,c.useState)(""),[z,A]=(0,c.useState)("all"),[B,C]=(0,c.useState)(!1),[D,E]=(0,c.useState)(null),{data:F,loading:G,error:H,refetch:I}=(0,e.useFindMany)("Course",{select:{id:!0,title:!0,slug:!0,description:!0,level:!0,price:!0,thumbnail:!0,status:!0,createdAt:!0,duration:!0},include:{_count:{select:{enrollments:!0,modules:!0,reviews:!0}},instructor:{select:{id:!0,firstName:!0,lastName:!0,username:!0}}},orderBy:{createdAt:"desc"}}),[J,{loading:K}]=(0,e.useDeleteOne)("Course"),[L]=(0,e.useUpdateOne)("Course"),M=(F||[]).filter(a=>{let b=a.title.toLowerCase().includes(x.toLowerCase())||(a.description||"").toLowerCase().includes(x.toLowerCase()),c="all"===z||"published"===z&&"PUBLISHED"===a.status||"draft"===z&&"DRAFT"===a.status;return b&&c}),N=()=>{a.push("/lms/admin/courses/create")},O=async()=>{if(D)try{await J({where:{id:D.id}}),w({title:"Thành công",description:`Đ\xe3 x\xf3a kh\xf3a học "${D.title}"`,type:"success"}),C(!1),E(null),I()}catch(a){w({title:"Lỗi",description:a.message||"Không thể xóa khóa học",type:"error"})}},P=async a=>{try{let b="PUBLISHED"===a.status?"DRAFT":"PUBLISHED";await L({where:{id:a.id},data:{status:b}}),w({title:"Thành công",description:`Đ\xe3 ${"PUBLISHED"===b?"xuất bản":"chuyển về nháp"} kh\xf3a học "${a.title}"`,type:"success"}),I()}catch(a){w({title:"Lỗi",description:a.message||"Không thể cập nhật trạng thái",type:"error"})}};return(0,b.jsxs)("div",{className:"p-8 space-y-6",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-3xl font-bold text-gray-900",children:"Quản lý khóa học"}),(0,b.jsxs)("p",{className:"text-gray-600 mt-1",children:["Tổng cộng ",F?.length||0," khóa học"]})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)(g.Button,{onClick:N,variant:"outline",className:"gap-2",children:[(0,b.jsx)(j.Plus,{className:"w-4 h-4"}),"Tạo thủ công"]}),(0,b.jsxs)(g.Button,{onClick:()=>{a.push("/lms/admin/courses/create-with-ai")},className:"gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",children:[(0,b.jsx)(t.Sparkles,{className:"w-4 h-4"}),"Tạo với AI"]})]})]}),(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4",children:[(0,b.jsxs)("div",{className:"flex-1 relative",children:[(0,b.jsx)(k.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"}),(0,b.jsx)(h.Input,{placeholder:"Tìm kiếm khóa học...",value:x,onChange:a=>y(a.target.value),className:"pl-10"})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)(g.Button,{variant:"all"===z?"default":"outline",onClick:()=>A("all"),children:"Tất cả"}),(0,b.jsx)(g.Button,{variant:"published"===z?"default":"outline",onClick:()=>A("published"),children:"Đã xuất bản"}),(0,b.jsx)(g.Button,{variant:"draft"===z?"default":"outline",onClick:()=>A("draft"),children:"Nháp"})]})]}),G?(0,b.jsxs)("div",{className:"text-center py-12",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),(0,b.jsx)("p",{className:"text-gray-500 mt-4",children:"Đang tải..."})]}):H?(0,b.jsx)(f.Card,{children:(0,b.jsxs)(f.CardContent,{className:"py-12 text-center",children:[(0,b.jsx)(r.AlertCircle,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),(0,b.jsxs)("p",{className:"text-red-600",children:["Lỗi: ",H.message]})]})}):0===M.length?(0,b.jsx)(f.Card,{children:(0,b.jsxs)(f.CardContent,{className:"py-12 text-center",children:[(0,b.jsx)(s.BookOpen,{className:"w-12 h-12 text-gray-400 mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-gray-500",children:"Không tìm thấy khóa học nào"}),(0,b.jsx)(g.Button,{onClick:N,className:"mt-4",children:"Tạo khóa học đầu tiên"})]})}):(0,b.jsx)("div",{className:"grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6",children:M.map(c=>{let d;return(0,b.jsxs)(f.Card,{className:"hover:shadow-lg transition-shadow",children:[(0,b.jsxs)(f.CardHeader,{children:[(0,b.jsxs)("div",{className:"flex items-start justify-between mb-2",children:[(0,b.jsx)(i.Badge,{variant:"PUBLISHED"===c.status?"default":"secondary",className:"cursor-pointer",onClick:()=>P(c),children:"PUBLISHED"===c.status?"Đã xuất bản":"Nháp"}),(0,b.jsx)(i.Badge,{variant:"outline",children:c.level||"Beginner"})]}),(0,b.jsx)(f.CardTitle,{className:"line-clamp-2",children:c.title}),(0,b.jsx)(f.CardDescription,{className:"mt-2 line-clamp-2",children:c.description||"Chưa có mô tả"})]}),(0,b.jsxs)(f.CardContent,{className:"space-y-4",children:[c.instructor&&(0,b.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-600",children:[(0,b.jsx)(o.Users,{className:"w-4 h-4"}),(0,b.jsxs)("span",{children:["Giảng viên: ",c.instructor.firstName&&c.instructor.lastName?`${c.instructor.firstName} ${c.instructor.lastName}`:c.instructor.username]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-4 text-sm text-gray-600",children:[(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsx)(o.Users,{className:"w-4 h-4"}),(0,b.jsx)("span",{children:c._count?.enrollments||0})]}),(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsx)(s.BookOpen,{className:"w-4 h-4"}),(0,b.jsxs)("span",{children:[c._count?.modules||0," modules"]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsx)(p.Clock,{className:"w-4 h-4"}),(0,b.jsxs)("span",{children:[c.duration||0,"p"]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsx)(q.Star,{className:"w-4 h-4 text-yellow-500"}),(0,b.jsx)("span",{children:c._count?.reviews||0})]})]}),(0,b.jsx)("div",{className:"text-lg font-bold text-blue-600",children:c.price?(d=c.price,new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(d)):"Miễn phí"}),(0,b.jsxs)("div",{className:"flex gap-2 pt-2",children:[(0,b.jsxs)(g.Button,{variant:"outline",size:"sm",className:"flex-1 gap-2",onClick:()=>{var b;return b=c.id,void a.push(`/lms/admin/courses/${b}`)},children:[(0,b.jsx)(n.Eye,{className:"w-4 h-4"}),"Xem"]}),(0,b.jsxs)(g.Button,{variant:"outline",size:"sm",className:"flex-1 gap-2",onClick:()=>{var b;return b=c.id,void a.push(`/lms/admin/courses/${b}/edit`)},children:[(0,b.jsx)(l.Edit,{className:"w-4 h-4"}),"Sửa"]}),(0,b.jsx)(g.Button,{variant:"outline",size:"sm",className:"gap-2 text-red-600 hover:text-red-700 hover:bg-red-50",onClick:()=>{E(c),C(!0)},children:(0,b.jsx)(m.Trash2,{className:"w-4 h-4"})})]})]})]},c.id)})}),(0,b.jsx)(u.AlertDialog,{open:B,onOpenChange:C,children:(0,b.jsxs)(u.AlertDialogContent,{children:[(0,b.jsxs)(u.AlertDialogHeader,{children:[(0,b.jsx)(u.AlertDialogTitle,{children:"Xác nhận xóa khóa học"}),(0,b.jsxs)(u.AlertDialogDescription,{children:["Bạn có chắc chắn muốn xóa khóa học ",(0,b.jsxs)("strong",{children:['"',D?.title,'"']}),"?",(0,b.jsx)("br",{}),(0,b.jsx)("br",{}),(0,b.jsx)("span",{className:"text-red-600 font-semibold",children:"Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan (bài học, quiz, enrollment, v.v.)"})]})]}),(0,b.jsxs)(u.AlertDialogFooter,{children:[(0,b.jsx)(u.AlertDialogCancel,{children:"Hủy"}),(0,b.jsx)(u.AlertDialogAction,{onClick:O,disabled:K,className:"bg-red-600 hover:bg-red-700",children:K?"Đang xóa...":"Xóa khóa học"})]})]})})]})}a.s(["default",()=>w])}];

//# sourceMappingURL=_9d074c4c._.js.map