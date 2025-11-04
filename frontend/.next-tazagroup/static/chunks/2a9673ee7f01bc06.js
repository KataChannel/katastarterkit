(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,775680,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(541428);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...a}));i.displayName="Card";let s=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("flex flex-col space-y-1.5 p-6",e),...a}));s.displayName="CardHeader";let l=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("h3",{ref:i,className:(0,r.cn)("text-2xl font-semibold leading-none tracking-tight",e),...a}));l.displayName="CardTitle";let n=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("p",{ref:i,className:(0,r.cn)("text-sm text-muted-foreground",e),...a}));n.displayName="CardDescription";let d=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("p-6 pt-0",e),...a}));d.displayName="CardContent";let o=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("flex items-center p-6 pt-0",e),...a}));o.displayName="CardFooter",e.s(["Card",()=>i,"CardContent",()=>d,"CardDescription",()=>n,"CardFooter",()=>o,"CardHeader",()=>s,"CardTitle",()=>l])},702470,e=>{"use strict";var t=e.i(44990),a=e.i(207298),r=e.i(541428);let i=(0,a.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function s({className:e,variant:a,...s}){return(0,t.jsx)("span",{className:(0,r.cn)(i({variant:a}),e),...s})}e.s(["Badge",()=>s])},165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(873273),i=a.forwardRef((e,a)=>(0,t.jsx)(r.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));i.displayName="Label";var s=e.i(541428);function l({className:e,...a}){return(0,t.jsx)(i,{"data-slot":"label",className:(0,s.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>l],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(541428);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("textarea",{className:(0,r.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...a}));i.displayName="Textarea",e.s(["Textarea",()=>i])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),r=e.i(529590),i=e.i(403055),s=e.i(984804);let l=s.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,n=s.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,d=s.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,o=s.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,c=s.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,u=s.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=s.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,p=s.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,h=s.gql`
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
`,g=s.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,f=s.gql`
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
`,x=s.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,y=s.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,b=s.gql`
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
`,N=s.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,v=s.gql`
  mutation ClearCache {
    clearCache
  }
`;function j(e,a,r){let i=!!localStorage.getItem("accessToken"),s=r?.skip||r?.requireAuth!==!1&&!i,{data:n,loading:d,error:o,refetch:c}=(0,t.useQuery)(l,{variables:{modelName:e,input:a||{}},skip:s,fetchPolicy:r?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:o,refetch:c}}function w(e,a,r,i){let s=!!localStorage.getItem("accessToken"),l="string"==typeof a?a:a?.id;l||i?.skip;let d=i?.skip||!l||i?.requireAuth!==!1&&!s,{data:o,loading:c,error:u,refetch:m}=(0,t.useQuery)(n,{variables:{modelName:e,input:{id:l||"",select:r?.select,include:r?.include}},skip:d});return{data:o?.findById,loading:c,error:u,refetch:m}}function C(e,a,r){let[s,l]=(0,i.useState)(a?.page||1),[n,d]=(0,i.useState)(a?.limit||10),c=!!localStorage.getItem("accessToken"),u=r?.skip||r?.requireAuth!==!1&&!c,{data:m,loading:p,error:h,refetch:g}=(0,t.useQuery)(o,{variables:{modelName:e,input:{page:s,limit:n,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:u,fetchPolicy:"cache-and-network"}),f=m?.findManyPaginated,x=(0,i.useCallback)(e=>{l(e)},[]),y=(0,i.useCallback)(()=>{f?.meta.hasNextPage&&l(e=>e+1)},[f]),b=(0,i.useCallback)(()=>{f?.meta.hasPrevPage&&l(e=>e-1)},[f]),N=(0,i.useCallback)(e=>{d(e),l(1)},[]);return{data:f?.data,meta:f?.meta,loading:p,error:h,refetch:g,page:s,limit:n,goToPage:x,nextPage:y,prevPage:b,changeLimit:N}}function k(e,a,r){let{data:i,loading:s,error:l,refetch:n}=(0,t.useQuery)(c,{variables:{modelName:e,where:a},skip:r?.skip});return{count:i?.count,loading:s,error:l,refetch:n}}function $(e,t){let[r,{data:s,loading:l,error:n}]=(0,a.useMutation)(p,{refetchQueries:t?.refetchQueries});return[(0,i.useCallback)(async t=>{let a=await r({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[r,e]),{data:s?.createOne,loading:l,error:n}]}function M(e,t){let[r,{data:s,loading:l,error:n}]=(0,a.useMutation)(g,{refetchQueries:t?.refetchQueries});return[(0,i.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let i=await r({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return i.data?.updateOne},[r,e]),{data:s?.updateOne,loading:l,error:n}]}function T(e,t){let[r,{data:s,loading:l,error:n}]=(0,a.useMutation)(x,{refetchQueries:t?.refetchQueries});return[(0,i.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let i=await r({variables:{modelName:e,input:{id:a,select:t.select}}});return i.data?.deleteOne},[r,e]),{data:s?.deleteOne,loading:l,error:n}]}function S(e){let t=(0,r.useApolloClient)(),[s,d]=$(e),[o,u]=function(e,t){let[r,{data:s,loading:l,error:n}]=(0,a.useMutation)(h,{refetchQueries:void 0});return[(0,i.useCallback)(async t=>{let a=await r({variables:{model:e,...t}});return a.data?.createMany},[r,e]),{data:s?.createMany,loading:l,error:n}]}(e),[m,p]=M(e),[g,x]=function(e,t){let[r,{data:s,loading:l,error:n}]=(0,a.useMutation)(f,{refetchQueries:void 0});return[(0,i.useCallback)(async t=>{let a=await r({variables:{model:e,...t}});return a.data?.updateMany},[r,e]),{data:s?.updateMany,loading:l,error:n}]}(e),[N,v]=T(e),[j,w]=function(e,t){let[r,{data:s,loading:l,error:n}]=(0,a.useMutation)(y,{refetchQueries:void 0});return[(0,i.useCallback)(async t=>{let a=await r({variables:{model:e,where:t}});return a.data?.deleteMany},[r,e]),{data:s?.deleteMany,loading:l,error:n}]}(e),[C,k]=function(e,t){let[r,{data:s,loading:l,error:n}]=(0,a.useMutation)(b,{refetchQueries:void 0});return[(0,i.useCallback)(async t=>{let a=await r({variables:{model:e,...t}});return a.data?.upsert},[r,e]),{data:s?.upsert,loading:l,error:n}]}(e),S=(0,i.useCallback)(async a=>(await t.query({query:l,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:S,findUnique:(0,i.useCallback)(async(a,r)=>(await t.query({query:n,variables:{model:e,where:a,...r},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,i.useCallback)(async a=>(await t.query({query:c,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:s,createMany:o,updateOne:m,updateMany:g,deleteOne:N,deleteMany:j,upsert:C,states:{createOne:d,createMany:u,updateOne:p,updateMany:x,deleteOne:v,deleteMany:w,upsert:k},loading:d.loading||u.loading||p.loading||x.loading||v.loading||w.loading||k.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,v,"COUNT",0,c,"CREATE_MANY",0,h,"CREATE_ONE",0,p,"DELETE_MANY",0,y,"DELETE_ONE",0,x,"FIND_FIRST",0,d,"FIND_MANY",0,l,"FIND_MANY_PAGINATED",0,o,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,N,"GROUP_BY",0,m,"UPDATE_MANY",0,f,"UPDATE_ONE",0,g,"UPSERT",0,b],272901),e.s(["useCRUD",()=>S,"useCount",()=>k,"useCreateOne",()=>$,"useDeleteOne",()=>T,"useFindMany",()=>j,"useFindManyPaginated",()=>C,"useFindUnique",()=>w,"useUpdateOne",()=>M],245421)},169989,162207,e=>{"use strict";let t=(0,e.i(930702).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["default",()=>t],162207),e.s(["Loader2",()=>t],169989)},295426,e=>{"use strict";let t=(0,e.i(930702).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>t])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},996517,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(119836),i=e.i(316618),s=e.i(377991),l=e.i(767478),n=e.i(873273),d=e.i(825198),o=e.i(346412),c=e.i(559663),u="Tabs",[m,p]=(0,i.createContextScope)(u,[s.createRovingFocusGroupScope]),h=(0,s.createRovingFocusGroupScope)(),[g,f]=m(u),x=a.forwardRef((e,a)=>{let{__scopeTabs:r,value:i,onValueChange:s,defaultValue:l,orientation:m="horizontal",dir:p,activationMode:h="automatic",...f}=e,x=(0,d.useDirection)(p),[y,b]=(0,o.useControllableState)({prop:i,onChange:s,defaultProp:l??"",caller:u});return(0,t.jsx)(g,{scope:r,baseId:(0,c.useId)(),value:y,onValueChange:b,orientation:m,dir:x,activationMode:h,children:(0,t.jsx)(n.Primitive.div,{dir:x,"data-orientation":m,...f,ref:a})})});x.displayName=u;var y="TabsList",b=a.forwardRef((e,a)=>{let{__scopeTabs:r,loop:i=!0,...l}=e,d=f(y,r),o=h(r);return(0,t.jsx)(s.Root,{asChild:!0,...o,orientation:d.orientation,dir:d.dir,loop:i,children:(0,t.jsx)(n.Primitive.div,{role:"tablist","aria-orientation":d.orientation,...l,ref:a})})});b.displayName=y;var N="TabsTrigger",v=a.forwardRef((e,a)=>{let{__scopeTabs:i,value:l,disabled:d=!1,...o}=e,c=f(N,i),u=h(i),m=C(c.baseId,l),p=k(c.baseId,l),g=l===c.value;return(0,t.jsx)(s.Item,{asChild:!0,...u,focusable:!d,active:g,children:(0,t.jsx)(n.Primitive.button,{type:"button",role:"tab","aria-selected":g,"aria-controls":p,"data-state":g?"active":"inactive","data-disabled":d?"":void 0,disabled:d,id:m,...o,ref:a,onMouseDown:(0,r.composeEventHandlers)(e.onMouseDown,e=>{d||0!==e.button||!1!==e.ctrlKey?e.preventDefault():c.onValueChange(l)}),onKeyDown:(0,r.composeEventHandlers)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&c.onValueChange(l)}),onFocus:(0,r.composeEventHandlers)(e.onFocus,()=>{let e="manual"!==c.activationMode;g||d||!e||c.onValueChange(l)})})})});v.displayName=N;var j="TabsContent",w=a.forwardRef((e,r)=>{let{__scopeTabs:i,value:s,forceMount:d,children:o,...c}=e,u=f(j,i),m=C(u.baseId,s),p=k(u.baseId,s),h=s===u.value,g=a.useRef(h);return a.useEffect(()=>{let e=requestAnimationFrame(()=>g.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,t.jsx)(l.Presence,{present:d||h,children:({present:a})=>(0,t.jsx)(n.Primitive.div,{"data-state":h?"active":"inactive","data-orientation":u.orientation,role:"tabpanel","aria-labelledby":m,hidden:!a,id:p,tabIndex:0,...c,ref:r,style:{...e.style,animationDuration:g.current?"0s":void 0},children:a&&o})})});function C(e,t){return`${e}-trigger-${t}`}function k(e,t){return`${e}-content-${t}`}w.displayName=j;var $=e.i(541428);let M=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(b,{ref:r,className:(0,$.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",e),...a}));M.displayName=b.displayName;let T=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(v,{ref:r,className:(0,$.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",e),...a}));T.displayName=v.displayName;let S=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(w,{ref:r,className:(0,$.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",e),...a}));S.displayName=w.displayName,e.s(["Tabs",()=>x,"TabsContent",()=>S,"TabsList",()=>M,"TabsTrigger",()=>T],996517)},134829,e=>{"use strict";let t=(0,e.i(930702).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["default",()=>t])},985937,e=>{"use strict";var t=e.i(134829);e.s(["Copy",()=>t.default])},271739,e=>{"use strict";let t=(0,e.i(930702).default)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]);e.s(["default",()=>t])},450071,e=>{"use strict";var t=e.i(271739);e.s(["Sparkles",()=>t.default])},156669,e=>{"use strict";let t=(0,e.i(930702).default)("lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);e.s(["default",()=>t])},94446,e=>{"use strict";var t=e.i(156669);e.s(["Lightbulb",()=>t.default])},140908,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(130775),i=e.i(950988),s=e.i(429105),l=e.i(984804),n=e.i(775680),d=e.i(885205),o=e.i(600547),c=e.i(165429),u=e.i(519647),m=e.i(450071),p=e.i(94446),h=e.i(985937),g=e.i(844596),f=e.i(169989),x=e.i(608631),y=e.i(4993),b=e.i(183194),N=e.i(702470),v=e.i(996517),j=e.i(245421);let w=l.gql`
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
`,C=l.gql`
  query GetSamplePrompts {
    sampleCoursePrompts
    coursePromptTemplates
  }
`;function k(){let e=(0,r.useRouter)(),{toast:l}=(0,y.useToast)(),[k,$]=(0,a.useState)(""),[M,T]=(0,a.useState)(""),[S,q]=(0,a.useState)(null),{data:I}=(0,j.useFindMany)("CourseCategory",{select:{id:!0,name:!0},orderBy:{name:"asc"}}),{data:O}=(0,s.useQuery)(C),[P,{loading:A}]=(0,i.useMutation)(w),D=O?.sampleCoursePrompts||[],E=O?.coursePromptTemplates||[],F=async()=>{if(!k.trim())return void l({title:"Lỗi",description:"Vui lòng nhập mô tả khóa học",type:"error"});try{let t=(await P({variables:{prompt:k.trim(),categoryId:M||null}})).data.generateCourseFromPrompt;l({title:"Thành công! 🎉",description:`Đ\xe3 tạo kh\xf3a học "${t.title}" với ${t.modules.length} modules`,type:"success"}),e.push(`/lms/admin/courses/${t.id}/edit`)}catch(e){console.error("Generate error:",e),l({title:"Lỗi",description:e.message||"Không thể tạo khóa học với AI",type:"error"})}},R=(e,t)=>{$(e),q(t),setTimeout(()=>q(null),2e3)};return(0,t.jsx)("div",{className:"min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8",children:(0,t.jsxs)("div",{className:"max-w-7xl mx-auto space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)(d.Button,{variant:"outline",size:"icon",onClick:()=>{e.push("/lms/admin/courses")},children:(0,t.jsx)(u.ArrowLeft,{className:"w-4 h-4"})}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(m.Sparkles,{className:"w-8 h-8 text-purple-600"}),(0,t.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent",children:"Tạo Khóa Học Với AI"})]}),(0,t.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:"Mô tả khóa học bạn muốn, AI sẽ tự động tạo nội dung chi tiết"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[(0,t.jsxs)("div",{className:"lg:col-span-2 space-y-6",children:[(0,t.jsxs)(n.Card,{className:"shadow-lg border-purple-100",children:[(0,t.jsxs)(n.CardHeader,{className:"bg-gradient-to-r from-purple-50 to-blue-50",children:[(0,t.jsxs)(n.CardTitle,{className:"flex items-center gap-2",children:[(0,t.jsx)(x.BookOpen,{className:"w-5 h-5"}),"Mô Tả Khóa Học"]}),(0,t.jsx)(n.CardDescription,{children:"Nhập mô tả chi tiết về khóa học bạn muốn tạo"})]}),(0,t.jsxs)(n.CardContent,{className:"pt-6 space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(c.Label,{htmlFor:"prompt",children:"Mô tả khóa học *"}),(0,t.jsx)(o.Textarea,{id:"prompt",value:k,onChange:e=>$(e.target.value),placeholder:"VD: Tạo khóa học về Kỹ năng giao tiếp hiệu quả dành cho người mới bắt đầu, bao gồm giao tiếp cá nhân, giao tiếp nhóm, thuyết trình...",className:"min-h-[150px] resize-none focus:ring-2 focus:ring-purple-500",disabled:A}),(0,t.jsxs)("p",{className:"text-xs text-gray-500",children:[k.length," ký tự - Càng chi tiết càng tốt"]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(c.Label,{htmlFor:"categoryId",children:"Danh mục (Tùy chọn)"}),(0,t.jsxs)(b.Select,{value:M,onValueChange:T,disabled:A,children:[(0,t.jsx)(b.SelectTrigger,{id:"categoryId",children:(0,t.jsx)(b.SelectValue,{placeholder:"Chọn danh mục"})}),(0,t.jsx)(b.SelectContent,{children:I?.map(e=>(0,t.jsx)(b.SelectItem,{value:e.id,children:e.name},e.id))})]})]}),(0,t.jsx)(d.Button,{onClick:F,disabled:A||!k.trim(),className:"w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-base font-semibold",children:A?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(f.Loader2,{className:"w-5 h-5 mr-2 animate-spin"}),"Đang tạo khóa học..."]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(m.Sparkles,{className:"w-5 h-5 mr-2"}),"Tạo Khóa Học Với AI"]})}),A&&(0,t.jsx)("div",{className:"p-4 bg-blue-50 border border-blue-200 rounded-lg",children:(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)(f.Loader2,{className:"w-5 h-5 text-blue-600 animate-spin mt-0.5"}),(0,t.jsxs)("div",{className:"text-sm text-blue-800",children:[(0,t.jsx)("p",{className:"font-semibold mb-1",children:"AI đang xử lý..."}),(0,t.jsx)("p",{children:"Tạo cấu trúc khóa học, modules, lessons và quiz. Quá trình này có thể mất 30-60 giây."})]})]})})]})]}),(0,t.jsxs)(n.Card,{className:"shadow-lg border-amber-100",children:[(0,t.jsxs)(n.CardHeader,{className:"bg-gradient-to-r from-amber-50 to-yellow-50",children:[(0,t.jsxs)(n.CardTitle,{className:"flex items-center gap-2 text-amber-900",children:[(0,t.jsx)(p.Lightbulb,{className:"w-5 h-5 text-amber-600"}),"Gợi Ý Nhanh"]}),(0,t.jsx)(n.CardDescription,{children:"Click để sử dụng mẫu prompt"})]}),(0,t.jsx)(n.CardContent,{className:"pt-6",children:(0,t.jsx)("div",{className:"grid gap-3",children:D.map((e,a)=>(0,t.jsx)("button",{onClick:()=>R(e,a),disabled:A,className:"text-left p-4 bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-lg transition-all group disabled:opacity-50",children:(0,t.jsxs)("div",{className:"flex items-start justify-between gap-3",children:[(0,t.jsx)("p",{className:"text-sm text-gray-700 flex-1",children:e}),S===a?(0,t.jsx)(g.Check,{className:"w-4 h-4 text-green-600 flex-shrink-0"}):(0,t.jsx)(h.Copy,{className:"w-4 h-4 text-gray-400 group-hover:text-amber-600 flex-shrink-0"})]})},a))})})]})]}),(0,t.jsx)("div",{className:"lg:col-span-1",children:(0,t.jsxs)(n.Card,{className:"shadow-lg sticky top-4 border-indigo-100",children:[(0,t.jsxs)(n.CardHeader,{className:"bg-gradient-to-r from-indigo-50 to-purple-50",children:[(0,t.jsx)(n.CardTitle,{className:"text-indigo-900",children:"Mẫu Chi Tiết"}),(0,t.jsx)(n.CardDescription,{children:"4 khóa học về kỹ năng mềm"})]}),(0,t.jsx)(n.CardContent,{className:"pt-6",children:(0,t.jsxs)(v.Tabs,{defaultValue:"all",className:"w-full",children:[(0,t.jsx)(v.TabsList,{className:"grid w-full grid-cols-1",children:(0,t.jsxs)(v.TabsTrigger,{value:"all",children:["Tất cả (",E.length,")"]})}),(0,t.jsx)(v.TabsContent,{value:"all",className:"space-y-4 mt-4",children:(0,t.jsx)("div",{className:"space-y-3 max-h-[600px] overflow-y-auto pr-2",children:E.map((e,a)=>(0,t.jsxs)("div",{onClick:()=>R(e.prompt,-a-1),className:"border border-gray-200 hover:border-indigo-300 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md bg-white hover:bg-indigo-50",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between gap-2 mb-2",children:[(0,t.jsx)("h4",{className:"font-semibold text-sm text-gray-900",children:e.title}),S===-a-1?(0,t.jsx)(g.Check,{className:"w-4 h-4 text-green-600 flex-shrink-0"}):(0,t.jsx)(h.Copy,{className:"w-4 h-4 text-gray-400 flex-shrink-0"})]}),(0,t.jsx)(N.Badge,{variant:"outline",className:"mb-3 text-xs",children:e.category}),(0,t.jsx)("div",{className:"flex flex-wrap gap-1 mb-3",children:e.tags.map(e=>(0,t.jsx)("span",{className:"px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full",children:e},e))}),(0,t.jsx)("p",{className:"text-xs text-gray-600 line-clamp-3",children:e.prompt})]},a))})})]})})]})})]}),(0,t.jsx)(n.Card,{className:"shadow-lg border-green-100",children:(0,t.jsx)(n.CardContent,{className:"pt-6",children:(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0",children:(0,t.jsx)(p.Lightbulb,{className:"w-5 h-5 text-green-600"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-semibold text-green-900 mb-2",children:"💡 Mẹo để tạo prompt hiệu quả:"}),(0,t.jsxs)("ul",{className:"text-sm text-green-800 space-y-1",children:[(0,t.jsx)("li",{children:"✓ Nêu rõ đối tượng học viên (người mới, trung cấp, chuyên gia)"}),(0,t.jsx)("li",{children:"✓ Liệt kê các chủ đề chính muốn đề cập"}),(0,t.jsx)("li",{children:"✓ Mô tả mục tiêu sau khi hoàn thành khóa học"}),(0,t.jsx)("li",{children:"✓ Đề cập số lượng modules mong muốn (4-6 modules)"}),(0,t.jsx)("li",{children:"✓ Yêu cầu bài tập thực hành hoặc case study nếu cần"})]})]})]})})})]})})}e.s(["default",()=>k])}]);