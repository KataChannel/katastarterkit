module.exports=[975780,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...c}));e.displayName="Card";let f=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex flex-col space-y-1.5 p-6",a),...c}));f.displayName="CardHeader";let g=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("h3",{ref:e,className:(0,d.cn)("text-2xl font-semibold leading-none tracking-tight",a),...c}));g.displayName="CardTitle";let h=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("p",{ref:e,className:(0,d.cn)("text-sm text-muted-foreground",a),...c}));h.displayName="CardDescription";let i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("p-6 pt-0",a),...c}));i.displayName="CardContent";let j=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex items-center p-6 pt-0",a),...c}));j.displayName="CardFooter",a.s(["Card",()=>e,"CardContent",()=>i,"CardDescription",()=>h,"CardFooter",()=>j,"CardHeader",()=>f,"CardTitle",()=>g])},293470,a=>{"use strict";var b=a.i(321248),c=a.i(13801),d=a.i(422171);let e=(0,c.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function f({className:a,variant:c,...f}){return(0,b.jsx)("span",{className:(0,d.cn)(e({variant:c}),a),...f})}a.s(["Badge",()=>f])},235746,769056,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(563718),e=a.i(651332),f=a.i(772213);let g=f.gql`
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
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},733554,925556,a=>{"use strict";let b=(0,a.i(367990).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);a.s(["default",()=>b],925556),a.s(["Loader2",()=>b],733554)},13755,a=>{"use strict";let b=(0,a.i(367990).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);a.s(["default",()=>b])},516482,a=>{"use strict";var b=a.i(13755);a.s(["ArrowLeft",()=>b.default])},652878,a=>{"use strict";var b=a.i(310495);a.s(["Copy",()=>b.default])},625609,a=>{"use strict";function b(a,[b,c]){return Math.min(c,Math.max(b,a))}a.s(["clamp",()=>b])},370477,a=>{"use strict";var b=a.i(651332);function c(a){let c=b.useRef({value:a,previous:a});return b.useMemo(()=>(c.current.value!==a&&(c.current.previous=c.current.value,c.current.value=a),c.current.previous),[a])}a.s(["usePrevious",()=>c])},376946,a=>{"use strict";var b=a.i(651332),c=a.i(372123),d=a.i(321248),e=Object.freeze({position:"absolute",border:0,width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",wordWrap:"normal"}),f=b.forwardRef((a,b)=>(0,d.jsx)(c.Primitive.span,{...a,ref:b,style:{...e,...a.style}}));f.displayName="VisuallyHidden",a.s(["Root",()=>f,"VISUALLY_HIDDEN_STYLES",()=>e,"VisuallyHidden",()=>f])},441405,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(372123),e=c.forwardRef((a,c)=>(0,b.jsx)(d.Primitive.label,{...a,ref:c,onMouseDown:b=>{b.target.closest("button, input, select, textarea")||(a.onMouseDown?.(b),!b.defaultPrevented&&b.detail>1&&b.preventDefault())}}));e.displayName="Label";var f=a.i(422171);function g({className:a,...c}){return(0,b.jsx)(e,{"data-slot":"label",className:(0,f.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",a),...c})}a.s(["Label",()=>g],441405)},466577,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("textarea",{className:(0,d.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:e,...c}));e.displayName="Textarea",a.s(["Textarea",()=>e])},951369,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(572521),e=a.i(694475),f=a.i(270694),g=a.i(660886),h=a.i(372123),i=a.i(770186),j=a.i(549074),k=a.i(742053),l="Tabs",[m,n]=(0,e.createContextScope)(l,[f.createRovingFocusGroupScope]),o=(0,f.createRovingFocusGroupScope)(),[p,q]=m(l),r=c.forwardRef((a,c)=>{let{__scopeTabs:d,value:e,onValueChange:f,defaultValue:g,orientation:m="horizontal",dir:n,activationMode:o="automatic",...q}=a,r=(0,i.useDirection)(n),[s,t]=(0,j.useControllableState)({prop:e,onChange:f,defaultProp:g??"",caller:l});return(0,b.jsx)(p,{scope:d,baseId:(0,k.useId)(),value:s,onValueChange:t,orientation:m,dir:r,activationMode:o,children:(0,b.jsx)(h.Primitive.div,{dir:r,"data-orientation":m,...q,ref:c})})});r.displayName=l;var s="TabsList",t=c.forwardRef((a,c)=>{let{__scopeTabs:d,loop:e=!0,...g}=a,i=q(s,d),j=o(d);return(0,b.jsx)(f.Root,{asChild:!0,...j,orientation:i.orientation,dir:i.dir,loop:e,children:(0,b.jsx)(h.Primitive.div,{role:"tablist","aria-orientation":i.orientation,...g,ref:c})})});t.displayName=s;var u="TabsTrigger",v=c.forwardRef((a,c)=>{let{__scopeTabs:e,value:g,disabled:i=!1,...j}=a,k=q(u,e),l=o(e),m=y(k.baseId,g),n=z(k.baseId,g),p=g===k.value;return(0,b.jsx)(f.Item,{asChild:!0,...l,focusable:!i,active:p,children:(0,b.jsx)(h.Primitive.button,{type:"button",role:"tab","aria-selected":p,"aria-controls":n,"data-state":p?"active":"inactive","data-disabled":i?"":void 0,disabled:i,id:m,...j,ref:c,onMouseDown:(0,d.composeEventHandlers)(a.onMouseDown,a=>{i||0!==a.button||!1!==a.ctrlKey?a.preventDefault():k.onValueChange(g)}),onKeyDown:(0,d.composeEventHandlers)(a.onKeyDown,a=>{[" ","Enter"].includes(a.key)&&k.onValueChange(g)}),onFocus:(0,d.composeEventHandlers)(a.onFocus,()=>{let a="manual"!==k.activationMode;p||i||!a||k.onValueChange(g)})})})});v.displayName=u;var w="TabsContent",x=c.forwardRef((a,d)=>{let{__scopeTabs:e,value:f,forceMount:i,children:j,...k}=a,l=q(w,e),m=y(l.baseId,f),n=z(l.baseId,f),o=f===l.value,p=c.useRef(o);return c.useEffect(()=>{let a=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(a)},[]),(0,b.jsx)(g.Presence,{present:i||o,children:({present:c})=>(0,b.jsx)(h.Primitive.div,{"data-state":o?"active":"inactive","data-orientation":l.orientation,role:"tabpanel","aria-labelledby":m,hidden:!c,id:n,tabIndex:0,...k,ref:d,style:{...a.style,animationDuration:p.current?"0s":void 0},children:c&&j})})});function y(a,b){return`${a}-trigger-${b}`}function z(a,b){return`${a}-content-${b}`}x.displayName=w;var A=a.i(422171);let B=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(t,{ref:d,className:(0,A.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",a),...c}));B.displayName=t.displayName;let C=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(v,{ref:d,className:(0,A.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",a),...c}));C.displayName=v.displayName;let D=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(x,{ref:d,className:(0,A.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",a),...c}));D.displayName=x.displayName,a.s(["Tabs",()=>r,"TabsContent",()=>D,"TabsList",()=>B,"TabsTrigger",()=>C],951369)},310495,a=>{"use strict";let b=(0,a.i(367990).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);a.s(["default",()=>b])},625455,a=>{"use strict";let b=(0,a.i(367990).default)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]);a.s(["default",()=>b])},434135,a=>{"use strict";var b=a.i(625455);a.s(["Sparkles",()=>b.default])},582446,a=>{"use strict";let b=(0,a.i(367990).default)("lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);a.s(["default",()=>b])},705969,a=>{"use strict";var b=a.i(582446);a.s(["Lightbulb",()=>b.default])},793021,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(53627),e=a.i(8912),f=a.i(168918),g=a.i(772213),h=a.i(975780),i=a.i(202979),j=a.i(466577),k=a.i(441405),l=a.i(516482),m=a.i(434135),n=a.i(705969),o=a.i(652878),p=a.i(919403),q=a.i(733554),r=a.i(26720),s=a.i(234211),t=a.i(144932),u=a.i(293470),v=a.i(951369),w=a.i(235746);let x=g.gql`
  mutation GenerateCourseFromPrompt($prompt: String!, $categoryId: String) {
    generateCourseFromPrompt(prompt: $prompt, categoryId: $categoryId) {
      id
      title
      slug
      description
      status
      modules {
        id
        title
        lessons {
          id
          title
          quizzes {
            id
            title
          }
        }
      }
    }
  }
`,y=g.gql`
  query GetSamplePrompts {
    sampleCoursePrompts
    coursePromptTemplates
  }
`;function z(){let a=(0,d.useRouter)(),{toast:g}=(0,s.useToast)(),[z,A]=(0,c.useState)(""),[B,C]=(0,c.useState)(""),[D,E]=(0,c.useState)(null),{data:F}=(0,w.useFindMany)("CourseCategory",{select:{id:!0,name:!0},orderBy:{name:"asc"}}),{data:G}=(0,f.useQuery)(y),[H,{loading:I}]=(0,e.useMutation)(x),J=G?.sampleCoursePrompts||[],K=G?.coursePromptTemplates||[],L=async()=>{if(!z.trim())return void g({title:"Lỗi",description:"Vui lòng nhập mô tả khóa học",type:"error"});try{let b=(await H({variables:{prompt:z.trim(),categoryId:B||null}})).data.generateCourseFromPrompt;g({title:"Thành công! 🎉",description:`Đ\xe3 tạo kh\xf3a học "${b.title}" với ${b.modules.length} modules`,type:"success"}),a.push(`/lms/admin/courses/${b.id}/edit`)}catch(a){console.error("Generate error:",a),g({title:"Lỗi",description:a.message||"Không thể tạo khóa học với AI",type:"error"})}},M=(a,b)=>{A(a),E(b),setTimeout(()=>E(null),2e3)};return(0,b.jsx)("div",{className:"min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8",children:(0,b.jsxs)("div",{className:"max-w-7xl mx-auto space-y-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(i.Button,{variant:"outline",size:"icon",onClick:()=>{a.push("/lms/admin/courses")},children:(0,b.jsx)(l.ArrowLeft,{className:"w-4 h-4"})}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(m.Sparkles,{className:"w-8 h-8 text-purple-600"}),(0,b.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent",children:"Tạo Khóa Học Với AI"})]}),(0,b.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:"Mô tả khóa học bạn muốn, AI sẽ tự động tạo nội dung chi tiết"})]})]}),(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[(0,b.jsxs)("div",{className:"lg:col-span-2 space-y-6",children:[(0,b.jsxs)(h.Card,{className:"shadow-lg border-purple-100",children:[(0,b.jsxs)(h.CardHeader,{className:"bg-gradient-to-r from-purple-50 to-blue-50",children:[(0,b.jsxs)(h.CardTitle,{className:"flex items-center gap-2",children:[(0,b.jsx)(r.BookOpen,{className:"w-5 h-5"}),"Mô Tả Khóa Học"]}),(0,b.jsx)(h.CardDescription,{children:"Nhập mô tả chi tiết về khóa học bạn muốn tạo"})]}),(0,b.jsxs)(h.CardContent,{className:"pt-6 space-y-4",children:[(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(k.Label,{htmlFor:"prompt",children:"Mô tả khóa học *"}),(0,b.jsx)(j.Textarea,{id:"prompt",value:z,onChange:a=>A(a.target.value),placeholder:"VD: Tạo khóa học về Kỹ năng giao tiếp hiệu quả dành cho người mới bắt đầu, bao gồm giao tiếp cá nhân, giao tiếp nhóm, thuyết trình...",className:"min-h-[150px] resize-none focus:ring-2 focus:ring-purple-500",disabled:I}),(0,b.jsxs)("p",{className:"text-xs text-gray-500",children:[z.length," ký tự - Càng chi tiết càng tốt"]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(k.Label,{htmlFor:"categoryId",children:"Danh mục (Tùy chọn)"}),(0,b.jsxs)(t.Select,{value:B,onValueChange:C,disabled:I,children:[(0,b.jsx)(t.SelectTrigger,{id:"categoryId",children:(0,b.jsx)(t.SelectValue,{placeholder:"Chọn danh mục"})}),(0,b.jsx)(t.SelectContent,{children:F?.map(a=>(0,b.jsx)(t.SelectItem,{value:a.id,children:a.name},a.id))})]})]}),(0,b.jsx)(i.Button,{onClick:L,disabled:I||!z.trim(),className:"w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-base font-semibold",children:I?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(q.Loader2,{className:"w-5 h-5 mr-2 animate-spin"}),"Đang tạo khóa học..."]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(m.Sparkles,{className:"w-5 h-5 mr-2"}),"Tạo Khóa Học Với AI"]})}),I&&(0,b.jsx)("div",{className:"p-4 bg-blue-50 border border-blue-200 rounded-lg",children:(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)(q.Loader2,{className:"w-5 h-5 text-blue-600 animate-spin mt-0.5"}),(0,b.jsxs)("div",{className:"text-sm text-blue-800",children:[(0,b.jsx)("p",{className:"font-semibold mb-1",children:"AI đang xử lý..."}),(0,b.jsx)("p",{children:"Tạo cấu trúc khóa học, modules, lessons và quiz. Quá trình này có thể mất 30-60 giây."})]})]})})]})]}),(0,b.jsxs)(h.Card,{className:"shadow-lg border-amber-100",children:[(0,b.jsxs)(h.CardHeader,{className:"bg-gradient-to-r from-amber-50 to-yellow-50",children:[(0,b.jsxs)(h.CardTitle,{className:"flex items-center gap-2 text-amber-900",children:[(0,b.jsx)(n.Lightbulb,{className:"w-5 h-5 text-amber-600"}),"Gợi Ý Nhanh"]}),(0,b.jsx)(h.CardDescription,{children:"Click để sử dụng mẫu prompt"})]}),(0,b.jsx)(h.CardContent,{className:"pt-6",children:(0,b.jsx)("div",{className:"grid gap-3",children:J.map((a,c)=>(0,b.jsx)("button",{onClick:()=>M(a,c),disabled:I,className:"text-left p-4 bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-lg transition-all group disabled:opacity-50",children:(0,b.jsxs)("div",{className:"flex items-start justify-between gap-3",children:[(0,b.jsx)("p",{className:"text-sm text-gray-700 flex-1",children:a}),D===c?(0,b.jsx)(p.Check,{className:"w-4 h-4 text-green-600 flex-shrink-0"}):(0,b.jsx)(o.Copy,{className:"w-4 h-4 text-gray-400 group-hover:text-amber-600 flex-shrink-0"})]})},c))})})]})]}),(0,b.jsx)("div",{className:"lg:col-span-1",children:(0,b.jsxs)(h.Card,{className:"shadow-lg sticky top-4 border-indigo-100",children:[(0,b.jsxs)(h.CardHeader,{className:"bg-gradient-to-r from-indigo-50 to-purple-50",children:[(0,b.jsx)(h.CardTitle,{className:"text-indigo-900",children:"Mẫu Chi Tiết"}),(0,b.jsx)(h.CardDescription,{children:"4 khóa học về kỹ năng mềm"})]}),(0,b.jsx)(h.CardContent,{className:"pt-6",children:(0,b.jsxs)(v.Tabs,{defaultValue:"all",className:"w-full",children:[(0,b.jsx)(v.TabsList,{className:"grid w-full grid-cols-1",children:(0,b.jsxs)(v.TabsTrigger,{value:"all",children:["Tất cả (",K.length,")"]})}),(0,b.jsx)(v.TabsContent,{value:"all",className:"space-y-4 mt-4",children:(0,b.jsx)("div",{className:"space-y-3 max-h-[600px] overflow-y-auto pr-2",children:K.map((a,c)=>(0,b.jsxs)("div",{onClick:()=>M(a.prompt,-c-1),className:"border border-gray-200 hover:border-indigo-300 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md bg-white hover:bg-indigo-50",children:[(0,b.jsxs)("div",{className:"flex items-start justify-between gap-2 mb-2",children:[(0,b.jsx)("h4",{className:"font-semibold text-sm text-gray-900",children:a.title}),D===-c-1?(0,b.jsx)(p.Check,{className:"w-4 h-4 text-green-600 flex-shrink-0"}):(0,b.jsx)(o.Copy,{className:"w-4 h-4 text-gray-400 flex-shrink-0"})]}),(0,b.jsx)(u.Badge,{variant:"outline",className:"mb-3 text-xs",children:a.category}),(0,b.jsx)("div",{className:"flex flex-wrap gap-1 mb-3",children:a.tags.map(a=>(0,b.jsx)("span",{className:"px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full",children:a},a))}),(0,b.jsx)("p",{className:"text-xs text-gray-600 line-clamp-3",children:a.prompt})]},c))})})]})})]})})]}),(0,b.jsx)(h.Card,{className:"shadow-lg border-green-100",children:(0,b.jsx)(h.CardContent,{className:"pt-6",children:(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)("div",{className:"w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0",children:(0,b.jsx)(n.Lightbulb,{className:"w-5 h-5 text-green-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"font-semibold text-green-900 mb-2",children:"💡 Mẹo để tạo prompt hiệu quả:"}),(0,b.jsxs)("ul",{className:"text-sm text-green-800 space-y-1",children:[(0,b.jsx)("li",{children:"✓ Nêu rõ đối tượng học viên (người mới, trung cấp, chuyên gia)"}),(0,b.jsx)("li",{children:"✓ Liệt kê các chủ đề chính muốn đề cập"}),(0,b.jsx)("li",{children:"✓ Mô tả mục tiêu sau khi hoàn thành khóa học"}),(0,b.jsx)("li",{children:"✓ Đề cập số lượng modules mong muốn (4-6 modules)"}),(0,b.jsx)("li",{children:"✓ Yêu cầu bài tập thực hành hoặc case study nếu cần"})]})]})]})})})]})})}a.s(["default",()=>z])}];

//# sourceMappingURL=_f2ed741b._.js.map