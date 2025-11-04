module.exports=[158464,a=>{"use strict";let b=(0,a.i(367990).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);a.s(["default",()=>b])},558767,a=>{"use strict";var b=a.i(158464);a.s(["Trash2",()=>b.default])},939816,a=>{"use strict";let b=(0,a.i(367990).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);a.s(["default",()=>b])},723593,a=>{"use strict";var b=a.i(939816);a.s(["Plus",()=>b.default])},235746,769056,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(563718),e=a.i(651332),f=a.i(772213);let g=f.gql`
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
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},975780,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...c}));e.displayName="Card";let f=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex flex-col space-y-1.5 p-6",a),...c}));f.displayName="CardHeader";let g=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("h3",{ref:e,className:(0,d.cn)("text-2xl font-semibold leading-none tracking-tight",a),...c}));g.displayName="CardTitle";let h=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("p",{ref:e,className:(0,d.cn)("text-sm text-muted-foreground",a),...c}));h.displayName="CardDescription";let i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("p-6 pt-0",a),...c}));i.displayName="CardContent";let j=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex items-center p-6 pt-0",a),...c}));j.displayName="CardFooter",a.s(["Card",()=>e,"CardContent",()=>i,"CardDescription",()=>h,"CardFooter",()=>j,"CardHeader",()=>f,"CardTitle",()=>g])},478184,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,type:c,...e},f)=>(0,b.jsx)("input",{type:c,className:(0,d.cn)("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:f,...e}));e.displayName="Input",a.s(["Input",()=>e])},441405,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(372123),e=c.forwardRef((a,c)=>(0,b.jsx)(d.Primitive.label,{...a,ref:c,onMouseDown:b=>{b.target.closest("button, input, select, textarea")||(a.onMouseDown?.(b),!b.defaultPrevented&&b.detail>1&&b.preventDefault())}}));e.displayName="Label";var f=a.i(422171);function g({className:a,...c}){return(0,b.jsx)(e,{"data-slot":"label",className:(0,f.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",a),...c})}a.s(["Label",()=>g],441405)},466577,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("textarea",{className:(0,d.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:e,...c}));e.displayName="Textarea",a.s(["Textarea",()=>e])},855918,a=>{"use strict";let b=(0,a.i(367990).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);a.s(["default",()=>b])},687649,a=>{"use strict";var b=a.i(855918);a.s(["Edit",()=>b.default])},629432,575389,a=>{"use strict";let b=(0,a.i(367990).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);a.s(["default",()=>b],575389),a.s(["Search",()=>b],629432)},755820,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(242526),e=a.i(363615),f=a.i(422171);let g=d.Root,h=d.Trigger,i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Overlay,{ref:e,className:(0,f.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...c}));i.displayName=d.Overlay.displayName;let j=c.forwardRef(({className:a,children:c,...g},h)=>(0,b.jsxs)(d.Portal,{children:[(0,b.jsx)(i,{}),(0,b.jsxs)(d.Content,{ref:h,className:(0,f.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...g,children:[c,(0,b.jsxs)(d.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,b.jsx)(e.X,{className:"h-4 w-4"}),(0,b.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));j.displayName=d.Content.displayName;let k=({className:a,...c})=>(0,b.jsx)("div",{className:(0,f.cn)("flex flex-col space-y-1.5 text-center sm:text-left",a),...c});k.displayName="DialogHeader";let l=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Title,{ref:e,className:(0,f.cn)("text-lg font-semibold leading-none tracking-tight",a),...c}));l.displayName=d.Title.displayName;let m=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Description,{ref:e,className:(0,f.cn)("text-sm text-muted-foreground",a),...c}));m.displayName=d.Description.displayName;let n=({className:a,...c})=>(0,b.jsx)("div",{className:(0,f.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",a),...c});n.displayName="DialogFooter",a.s(["Dialog",()=>g,"DialogContent",()=>j,"DialogDescription",()=>m,"DialogFooter",()=>n,"DialogHeader",()=>k,"DialogTitle",()=>l,"DialogTrigger",()=>h])},730705,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(194296);let e=c.createContext({}),f=({children:a,open:c,onOpenChange:d})=>c?(0,b.jsx)(e.Provider,{value:{onOpenChange:d},children:a}):null,g=c.forwardRef(({className:a,children:d,asChild:e,...f},g)=>e&&c.isValidElement(d)?c.cloneElement(d,{ref:g,...f}):(0,b.jsx)("button",{ref:g,className:a,...f,children:d}));g.displayName="AlertDialogTrigger";let h=c.forwardRef(({className:a,...e},f)=>{let[g,h]=c.useState(!1);if(c.useEffect(()=>(h(!0),()=>h(!1)),[]),!g)return null;let i=(0,b.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 pointer-events-auto",onClick:a=>{a.target,a.currentTarget},children:(0,b.jsx)("div",{ref:f,className:`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg pointer-events-auto ${a||""}`,onClick:a=>a.stopPropagation(),...e})});return(0,d.createPortal)(i,document.body)});h.displayName="AlertDialogContent";let i=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`flex flex-col space-y-2 text-center sm:text-left ${a||""}`,...c}));i.displayName="AlertDialogHeader";let j=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${a||""}`,...c}));j.displayName="AlertDialogFooter";let k=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("h2",{ref:d,className:`text-lg font-semibold ${a||""}`,...c}));k.displayName="AlertDialogTitle";let l=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("p",{ref:d,className:`text-sm text-gray-500 ${a||""}`,...c}));l.displayName="AlertDialogDescription";let m=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("button",{ref:d,className:`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${a||""}`,...c}));m.displayName="AlertDialogAction";let n=c.forwardRef(({className:a,onClick:d,...f},g)=>{let{onOpenChange:h}=c.useContext(e);return(0,b.jsx)("button",{ref:g,onClick:a=>{d?.(a),a.defaultPrevented||h?.(!1)},className:`inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${a||""}`,...f})});n.displayName="AlertDialogCancel",a.s(["AlertDialog",()=>f,"AlertDialogAction",()=>m,"AlertDialogCancel",()=>n,"AlertDialogContent",()=>h,"AlertDialogDescription",()=>l,"AlertDialogFooter",()=>j,"AlertDialogHeader",()=>i,"AlertDialogTitle",()=>k,"AlertDialogTrigger",()=>g])},842938,a=>{"use strict";let b=(0,a.i(367990).default)("folder-open",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);a.s(["default",()=>b])},538042,a=>{"use strict";var b=a.i(842938);a.s(["FolderOpen",()=>b.default])},799578,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(235746),e=a.i(975780),f=a.i(202979),g=a.i(478184),h=a.i(723593),i=a.i(629432),j=a.i(687649),k=a.i(558767),l=a.i(862122),m=a.i(327987),n=a.i(26720),o=a.i(538042),p=a.i(755820),q=a.i(730705),r=a.i(441405),s=a.i(466577),t=a.i(234211);function u(){let{toast:a}=(0,t.useToast)(),[u,v]=(0,c.useState)(""),[w,x]=(0,c.useState)(!1),[y,z]=(0,c.useState)(!1),[A,B]=(0,c.useState)(!1),[C,D]=(0,c.useState)(null),[E,F]=(0,c.useState)({id:"",name:"",slug:"",description:""}),{data:G,loading:H,error:I,refetch:J}=(0,d.useFindMany)("CourseCategory",{select:{id:!0,name:!0,slug:!0,description:!0},include:{_count:{select:{courses:!0}}},orderBy:{name:"asc"}}),[K,{loading:L}]=(0,d.useCreateOne)("CourseCategory"),[M,{loading:N}]=(0,d.useUpdateOne)("CourseCategory"),[O,{loading:P}]=(0,d.useDeleteOne)("CourseCategory"),Q=(G||[]).filter(a=>a.name.toLowerCase().includes(u.toLowerCase())||(a.description||"").toLowerCase().includes(u.toLowerCase())),R=()=>{B(!1),F({id:"",name:"",slug:"",description:""}),x(!0)},S=async b=>{if(b.preventDefault(),!E.name.trim())return void a({title:"Lỗi",description:"Vui lòng nhập tên danh mục",type:"error"});try{A?(await M({where:{id:E.id},data:{name:E.name,slug:E.slug,description:E.description||null}}),a({title:"Thành công",description:"Đã cập nhật danh mục",type:"success"})):(await K({data:{name:E.name,slug:E.slug,description:E.description||null}}),a({title:"Thành công",description:"Đã tạo danh mục mới",type:"success"})),x(!1),F({id:"",name:"",slug:"",description:""}),J()}catch(b){a({title:"Lỗi",description:b.message||"Không thể lưu danh mục",type:"error"})}},T=async()=>{if(C)try{await O({where:{id:C.id}}),a({title:"Thành công",description:`Đ\xe3 x\xf3a danh mục "${C.name}"`,type:"success"}),z(!1),D(null),J()}catch(b){a({title:"Lỗi",description:b.message||"Không thể xóa danh mục",type:"error"})}};return(0,b.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 space-y-6",children:[(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:"Quản lý danh mục"}),(0,b.jsxs)("p",{className:"text-sm sm:text-base text-gray-600 mt-1",children:["Tổng cộng ",G?.length||0," danh mục"]})]}),(0,b.jsxs)(f.Button,{onClick:R,className:"gap-2 w-full sm:w-auto",children:[(0,b.jsx)(h.Plus,{className:"w-4 h-4"}),"Tạo danh mục mới"]})]}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(i.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"}),(0,b.jsx)(g.Input,{placeholder:"Tìm kiếm danh mục...",value:u,onChange:a=>v(a.target.value),className:"pl-10"})]}),H?(0,b.jsxs)("div",{className:"text-center py-12",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),(0,b.jsx)("p",{className:"text-gray-500 mt-4",children:"Đang tải..."})]}):I?(0,b.jsx)(e.Card,{children:(0,b.jsxs)(e.CardContent,{className:"py-12 text-center",children:[(0,b.jsx)(m.AlertCircle,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),(0,b.jsxs)("p",{className:"text-red-600",children:["Lỗi: ",I.message]})]})}):0===Q.length?(0,b.jsx)(e.Card,{children:(0,b.jsxs)(e.CardContent,{className:"py-12 text-center",children:[(0,b.jsx)(o.FolderOpen,{className:"w-12 h-12 text-gray-400 mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-gray-500 mb-4",children:"Không tìm thấy danh mục nào"}),(0,b.jsx)(f.Button,{onClick:R,children:"Tạo danh mục đầu tiên"})]})}):(0,b.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",children:Q.map(a=>(0,b.jsxs)(e.Card,{className:"hover:shadow-lg transition-shadow",children:[(0,b.jsx)(e.CardHeader,{children:(0,b.jsx)("div",{className:"flex items-start justify-between",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"p-2 bg-blue-100 rounded-lg",children:(0,b.jsx)(l.Folder,{className:"w-5 h-5 text-blue-600"})}),(0,b.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,b.jsx)(e.CardTitle,{className:"text-base truncate",children:a.name}),(0,b.jsxs)("p",{className:"text-xs text-gray-500 truncate",children:["/",a.slug]})]})]})})}),(0,b.jsxs)(e.CardContent,{className:"space-y-4",children:[a.description&&(0,b.jsx)(e.CardDescription,{className:"line-clamp-2 text-sm",children:a.description}),(0,b.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-600",children:[(0,b.jsx)(n.BookOpen,{className:"w-4 h-4"}),(0,b.jsxs)("span",{children:[a._count?.courses||0," khóa học"]})]}),(0,b.jsxs)("div",{className:"flex gap-2 pt-2 border-t",children:[(0,b.jsxs)(f.Button,{variant:"outline",size:"sm",className:"flex-1 gap-2",onClick:()=>{B(!0),F({id:a.id,name:a.name,slug:a.slug,description:a.description||""}),x(!0)},children:[(0,b.jsx)(j.Edit,{className:"w-4 h-4"}),"Sửa"]}),(0,b.jsx)(f.Button,{variant:"outline",size:"sm",className:"gap-2 text-red-600 hover:text-red-700 hover:bg-red-50",onClick:()=>{D(a),z(!0)},disabled:(a._count?.courses||0)>0,children:(0,b.jsx)(k.Trash2,{className:"w-4 h-4"})})]})]})]},a.id))}),(0,b.jsx)(p.Dialog,{open:w,onOpenChange:x,children:(0,b.jsxs)(p.DialogContent,{className:"sm:max-w-[500px] max-h-[90vh] flex flex-col",children:[(0,b.jsxs)(p.DialogHeader,{children:[(0,b.jsx)(p.DialogTitle,{children:A?"Sửa danh mục":"Tạo danh mục mới"}),(0,b.jsx)(p.DialogDescription,{children:A?"Cập nhật thông tin danh mục":"Nhập thông tin danh mục mới"})]}),(0,b.jsx)("form",{onSubmit:S,className:"flex-1 overflow-y-auto",children:(0,b.jsxs)("div",{className:"space-y-4 py-4",children:[(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(r.Label,{htmlFor:"name",children:"Tên danh mục *"}),(0,b.jsx)(g.Input,{id:"name",placeholder:"Ví dụ: Lập trình Web",value:E.name,onChange:a=>{var b;return b=a.target.value,void F({...E,name:b,slug:b.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim()})},required:!0})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(r.Label,{htmlFor:"slug",children:"Slug"}),(0,b.jsx)(g.Input,{id:"slug",placeholder:"lap-trinh-web",value:E.slug,onChange:a=>F({...E,slug:a.target.value}),disabled:!0,className:"bg-gray-50"}),(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Tự động tạo từ tên danh mục"})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(r.Label,{htmlFor:"description",children:"Mô tả"}),(0,b.jsx)(s.Textarea,{id:"description",placeholder:"Mô tả chi tiết về danh mục...",value:E.description,onChange:a=>F({...E,description:a.target.value}),rows:4})]})]})}),(0,b.jsxs)(p.DialogFooter,{className:"border-t pt-4",children:[(0,b.jsx)(f.Button,{type:"button",variant:"outline",onClick:()=>x(!1),disabled:L||N,children:"Hủy"}),(0,b.jsx)(f.Button,{type:"submit",onClick:S,disabled:L||N,children:L||N?"Đang lưu...":A?"Cập nhật":"Tạo mới"})]})]})}),(0,b.jsx)(q.AlertDialog,{open:y,onOpenChange:z,children:(0,b.jsxs)(q.AlertDialogContent,{children:[(0,b.jsxs)(q.AlertDialogHeader,{children:[(0,b.jsx)(q.AlertDialogTitle,{children:"Xác nhận xóa danh mục"}),(0,b.jsxs)(q.AlertDialogDescription,{children:["Bạn có chắc chắn muốn xóa danh mục ",(0,b.jsxs)("strong",{children:['"',C?.name,'"']}),"?",(0,b.jsx)("br",{}),(0,b.jsx)("br",{}),(C?._count?.courses||0)>0?(0,b.jsxs)("span",{className:"text-red-600 font-semibold",children:["Danh mục này có ",C?._count?.courses," khóa học. Không thể xóa!"]}):(0,b.jsx)("span",{className:"text-gray-600",children:"Hành động này không thể hoàn tác."})]})]}),(0,b.jsxs)(q.AlertDialogFooter,{children:[(0,b.jsx)(q.AlertDialogCancel,{children:"Hủy"}),(0,b.jsx)(q.AlertDialogAction,{onClick:T,disabled:P||(C?._count?.courses||0)>0,className:"bg-red-600 hover:bg-red-700",children:P?"Đang xóa...":"Xóa danh mục"})]})]})})]})}a.s(["default",()=>u])}];

//# sourceMappingURL=_e62d2512._.js.map