(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),s=e.i(529590),l=e.i(403055),n=e.i(984804);let i=n.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,r=n.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,d=n.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,c=n.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,o=n.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,u=n.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=n.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,h=n.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,x=n.gql`
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
`,p=n.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,g=n.gql`
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
`,f=n.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,y=n.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,N=n.gql`
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
`,j=n.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,v=n.gql`
  mutation ClearCache {
    clearCache
  }
`;function b(e,a,s){let l=!!localStorage.getItem("accessToken"),n=s?.skip||s?.requireAuth!==!1&&!l,{data:r,loading:d,error:c,refetch:o}=(0,t.useQuery)(i,{variables:{modelName:e,input:a||{}},skip:n,fetchPolicy:s?.fetchPolicy||"cache-and-network"});return{data:r?.findMany,loading:d,error:c,refetch:o}}function C(e,a,s,l){let n=!!localStorage.getItem("accessToken"),i="string"==typeof a?a:a?.id;i||l?.skip;let d=l?.skip||!i||l?.requireAuth!==!1&&!n,{data:c,loading:o,error:u,refetch:m}=(0,t.useQuery)(r,{variables:{modelName:e,input:{id:i||"",select:s?.select,include:s?.include}},skip:d});return{data:c?.findById,loading:o,error:u,refetch:m}}function w(e,a,s){let[n,i]=(0,l.useState)(a?.page||1),[r,d]=(0,l.useState)(a?.limit||10),o=!!localStorage.getItem("accessToken"),u=s?.skip||s?.requireAuth!==!1&&!o,{data:m,loading:h,error:x,refetch:p}=(0,t.useQuery)(c,{variables:{modelName:e,input:{page:n,limit:r,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:u,fetchPolicy:"cache-and-network"}),g=m?.findManyPaginated,f=(0,l.useCallback)(e=>{i(e)},[]),y=(0,l.useCallback)(()=>{g?.meta.hasNextPage&&i(e=>e+1)},[g]),N=(0,l.useCallback)(()=>{g?.meta.hasPrevPage&&i(e=>e-1)},[g]),j=(0,l.useCallback)(e=>{d(e),i(1)},[]);return{data:g?.data,meta:g?.meta,loading:h,error:x,refetch:p,page:n,limit:r,goToPage:f,nextPage:y,prevPage:N,changeLimit:j}}function T(e,a,s){let{data:l,loading:n,error:i,refetch:r}=(0,t.useQuery)(o,{variables:{modelName:e,where:a},skip:s?.skip});return{count:l?.count,loading:n,error:i,refetch:r}}function $(e,t){let[s,{data:n,loading:i,error:r}]=(0,a.useMutation)(h,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a=await s({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[s,e]),{data:n?.createOne,loading:i,error:r}]}function k(e,t){let[s,{data:n,loading:i,error:r}]=(0,a.useMutation)(p,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let l=await s({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return l.data?.updateOne},[s,e]),{data:n?.updateOne,loading:i,error:r}]}function E(e,t){let[s,{data:n,loading:i,error:r}]=(0,a.useMutation)(f,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let l=await s({variables:{modelName:e,input:{id:a,select:t.select}}});return l.data?.deleteOne},[s,e]),{data:n?.deleteOne,loading:i,error:r}]}function M(e){let t=(0,s.useApolloClient)(),[n,d]=$(e),[c,u]=function(e,t){let[s,{data:n,loading:i,error:r}]=(0,a.useMutation)(x,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.createMany},[s,e]),{data:n?.createMany,loading:i,error:r}]}(e),[m,h]=k(e),[p,f]=function(e,t){let[s,{data:n,loading:i,error:r}]=(0,a.useMutation)(g,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.updateMany},[s,e]),{data:n?.updateMany,loading:i,error:r}]}(e),[j,v]=E(e),[b,C]=function(e,t){let[s,{data:n,loading:i,error:r}]=(0,a.useMutation)(y,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await s({variables:{model:e,where:t}});return a.data?.deleteMany},[s,e]),{data:n?.deleteMany,loading:i,error:r}]}(e),[w,T]=function(e,t){let[s,{data:n,loading:i,error:r}]=(0,a.useMutation)(N,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.upsert},[s,e]),{data:n?.upsert,loading:i,error:r}]}(e),M=(0,l.useCallback)(async a=>(await t.query({query:i,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:M,findUnique:(0,l.useCallback)(async(a,s)=>(await t.query({query:r,variables:{model:e,where:a,...s},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,l.useCallback)(async a=>(await t.query({query:o,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:n,createMany:c,updateOne:m,updateMany:p,deleteOne:j,deleteMany:b,upsert:w,states:{createOne:d,createMany:u,updateOne:h,updateMany:f,deleteOne:v,deleteMany:C,upsert:T},loading:d.loading||u.loading||h.loading||f.loading||v.loading||C.loading||T.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,v,"COUNT",0,o,"CREATE_MANY",0,x,"CREATE_ONE",0,h,"DELETE_MANY",0,y,"DELETE_ONE",0,f,"FIND_FIRST",0,d,"FIND_MANY",0,i,"FIND_MANY_PAGINATED",0,c,"FIND_UNIQUE",0,r,"GET_AVAILABLE_MODELS",0,j,"GROUP_BY",0,m,"UPDATE_MANY",0,g,"UPDATE_ONE",0,p,"UPSERT",0,N],272901),e.s(["useCRUD",()=>M,"useCount",()=>T,"useCreateOne",()=>$,"useDeleteOne",()=>E,"useFindMany",()=>b,"useFindManyPaginated",()=>w,"useFindUnique",()=>C,"useUpdateOne",()=>k],245421)},996517,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(119836),l=e.i(316618),n=e.i(377991),i=e.i(767478),r=e.i(873273),d=e.i(825198),c=e.i(346412),o=e.i(559663),u="Tabs",[m,h]=(0,l.createContextScope)(u,[n.createRovingFocusGroupScope]),x=(0,n.createRovingFocusGroupScope)(),[p,g]=m(u),f=a.forwardRef((e,a)=>{let{__scopeTabs:s,value:l,onValueChange:n,defaultValue:i,orientation:m="horizontal",dir:h,activationMode:x="automatic",...g}=e,f=(0,d.useDirection)(h),[y,N]=(0,c.useControllableState)({prop:l,onChange:n,defaultProp:i??"",caller:u});return(0,t.jsx)(p,{scope:s,baseId:(0,o.useId)(),value:y,onValueChange:N,orientation:m,dir:f,activationMode:x,children:(0,t.jsx)(r.Primitive.div,{dir:f,"data-orientation":m,...g,ref:a})})});f.displayName=u;var y="TabsList",N=a.forwardRef((e,a)=>{let{__scopeTabs:s,loop:l=!0,...i}=e,d=g(y,s),c=x(s);return(0,t.jsx)(n.Root,{asChild:!0,...c,orientation:d.orientation,dir:d.dir,loop:l,children:(0,t.jsx)(r.Primitive.div,{role:"tablist","aria-orientation":d.orientation,...i,ref:a})})});N.displayName=y;var j="TabsTrigger",v=a.forwardRef((e,a)=>{let{__scopeTabs:l,value:i,disabled:d=!1,...c}=e,o=g(j,l),u=x(l),m=w(o.baseId,i),h=T(o.baseId,i),p=i===o.value;return(0,t.jsx)(n.Item,{asChild:!0,...u,focusable:!d,active:p,children:(0,t.jsx)(r.Primitive.button,{type:"button",role:"tab","aria-selected":p,"aria-controls":h,"data-state":p?"active":"inactive","data-disabled":d?"":void 0,disabled:d,id:m,...c,ref:a,onMouseDown:(0,s.composeEventHandlers)(e.onMouseDown,e=>{d||0!==e.button||!1!==e.ctrlKey?e.preventDefault():o.onValueChange(i)}),onKeyDown:(0,s.composeEventHandlers)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&o.onValueChange(i)}),onFocus:(0,s.composeEventHandlers)(e.onFocus,()=>{let e="manual"!==o.activationMode;p||d||!e||o.onValueChange(i)})})})});v.displayName=j;var b="TabsContent",C=a.forwardRef((e,s)=>{let{__scopeTabs:l,value:n,forceMount:d,children:c,...o}=e,u=g(b,l),m=w(u.baseId,n),h=T(u.baseId,n),x=n===u.value,p=a.useRef(x);return a.useEffect(()=>{let e=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,t.jsx)(i.Presence,{present:d||x,children:({present:a})=>(0,t.jsx)(r.Primitive.div,{"data-state":x?"active":"inactive","data-orientation":u.orientation,role:"tabpanel","aria-labelledby":m,hidden:!a,id:h,tabIndex:0,...o,ref:s,style:{...e.style,animationDuration:p.current?"0s":void 0},children:a&&c})})});function w(e,t){return`${e}-trigger-${t}`}function T(e,t){return`${e}-content-${t}`}C.displayName=b;var $=e.i(541428);let k=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(N,{ref:s,className:(0,$.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",e),...a}));k.displayName=N.displayName;let E=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(v,{ref:s,className:(0,$.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",e),...a}));E.displayName=v.displayName;let M=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(C,{ref:s,className:(0,$.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",e),...a}));M.displayName=C.displayName,e.s(["Tabs",()=>f,"TabsContent",()=>M,"TabsList",()=>k,"TabsTrigger",()=>E],996517)},621924,e=>{"use strict";let t=(0,e.i(930702).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["default",()=>t])},822390,e=>{"use strict";var t=e.i(621924);e.s(["CheckCircle",()=>t.default])},775680,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let l=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...a}));l.displayName="Card";let n=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",e),...a}));n.displayName="CardHeader";let i=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("h3",{ref:l,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",e),...a}));i.displayName="CardTitle";let r=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("p",{ref:l,className:(0,s.cn)("text-sm text-muted-foreground",e),...a}));r.displayName="CardDescription";let d=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("p-6 pt-0",e),...a}));d.displayName="CardContent";let c=a.forwardRef(({className:e,...a},l)=>(0,t.jsx)("div",{ref:l,className:(0,s.cn)("flex items-center p-6 pt-0",e),...a}));c.displayName="CardFooter",e.s(["Card",()=>l,"CardContent",()=>d,"CardDescription",()=>r,"CardFooter",()=>c,"CardHeader",()=>n,"CardTitle",()=>i])},638381,e=>{"use strict";let t=(0,e.i(930702).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},980295,e=>{"use strict";let t=(0,e.i(930702).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);e.s(["default",()=>t])},897711,e=>{"use strict";var t=e.i(980295);e.s(["Download",()=>t.default])},336613,e=>{"use strict";let t=(0,e.i(930702).default)("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);e.s(["default",()=>t])},649248,e=>{"use strict";var t=e.i(336613);e.s(["DollarSign",()=>t.default])},759727,258392,e=>{"use strict";let t=(0,e.i(930702).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);e.s(["default",()=>t],258392),e.s(["TrendingUp",()=>t],759727)},837149,558519,e=>{"use strict";let t=(0,e.i(930702).default)("target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);e.s(["default",()=>t],558519),e.s(["Target",()=>t],837149)},474047,e=>{"use strict";let t=(0,e.i(930702).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["default",()=>t])},675999,e=>{"use strict";var t=e.i(474047);e.s(["Activity",()=>t.default])},615915,e=>{"use strict";let t=(0,e.i(930702).default)("chart-pie",[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]]);e.s(["default",()=>t])},377685,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(245421),l=e.i(775680),n=e.i(885205),i=e.i(996517),r=e.i(759727),d=e.i(771564),c=e.i(608631),o=e.i(865706),u=e.i(649248),m=e.i(897711),h=e.i(738543),x=e.i(615915),x=x,p=e.i(675999),g=e.i(822390),f=e.i(415588),y=e.i(837149),N=e.i(198513),j=e.i(183194);function v(){let[e,v]=(0,a.useState)("30days"),{data:b,loading:C}=(0,s.useFindMany)("Enrollment",{select:{id:!0,status:!0,progress:!0,paymentAmount:!0,enrolledAt:!0,completedAt:!0},include:{course:{select:{id:!0,title:!0,price:!0}}}}),{data:w}=(0,s.useFindMany)("Course",{select:{id:!0,title:!0,status:!0,price:!0},include:{_count:{select:{enrollments:!0}}}}),{data:T}=(0,s.useFindMany)("Certificate",{select:{id:!0,issueDate:!0,grade:!0},include:{course:{select:{title:!0}}}}),{data:$}=(0,s.useFindMany)("QuizAttempt",{select:{id:!0,score:!0,passed:!0,completedAt:!0}}),k={totalEnrollments:b?.length||0,activeEnrollments:b?.filter(e=>"ACTIVE"===e.status).length||0,completedEnrollments:b?.filter(e=>"COMPLETED"===e.status).length||0,totalRevenue:b?.reduce((e,t)=>e+(t.paymentAmount||0),0)||0,totalCourses:w?.length||0,publishedCourses:w?.filter(e=>"PUBLISHED"===e.status).length||0,certificatesIssued:T?.length||0,avgQuizScore:$?.length?($.reduce((e,t)=>e+(t.score||0),0)/$.length).toFixed(1):0,quizPassRate:$?.length?($.filter(e=>e.passed).length/$.length*100).toFixed(1):0},E=w?[...w].sort((e,t)=>t._count.enrollments-e._count.enrollments).slice(0,5):[],M=b?[...b].sort((e,t)=>new Date(t.enrolledAt).getTime()-new Date(e.enrolledAt).getTime()).slice(0,10):[],S=e=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(e);return(0,t.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 space-y-6",children:[(0,t.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:"Báo cáo & Thống kê"}),(0,t.jsx)("p",{className:"text-sm sm:text-base text-gray-600 mt-1",children:"Tổng quan hoạt động hệ thống LMS"})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(j.Select,{value:e,onValueChange:e=>v(e),children:[(0,t.jsx)(j.SelectTrigger,{className:"w-[150px]",children:(0,t.jsx)(j.SelectValue,{})}),(0,t.jsxs)(j.SelectContent,{children:[(0,t.jsx)(j.SelectItem,{value:"7days",children:"7 ngày qua"}),(0,t.jsx)(j.SelectItem,{value:"30days",children:"30 ngày qua"}),(0,t.jsx)(j.SelectItem,{value:"90days",children:"90 ngày qua"}),(0,t.jsx)(j.SelectItem,{value:"all",children:"Tất cả"})]})]}),(0,t.jsxs)(n.Button,{variant:"outline",className:"gap-2",children:[(0,t.jsx)(m.Download,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Xuất báo cáo"})]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-4",children:[(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(l.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(d.Users,{className:"w-4 h-4"}),"Tổng ghi danh"]}),(0,t.jsx)(l.CardTitle,{className:"text-2xl",children:k.totalEnrollments}),(0,t.jsxs)("p",{className:"text-xs text-green-600 flex items-center gap-1",children:[(0,t.jsx)(r.TrendingUp,{className:"w-3 h-3"}),k.activeEnrollments," đang học"]})]})}),(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(l.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(u.DollarSign,{className:"w-4 h-4"}),"Doanh thu"]}),(0,t.jsx)(l.CardTitle,{className:"text-2xl",children:S(k.totalRevenue)}),(0,t.jsxs)("p",{className:"text-xs text-gray-600",children:["Từ ",k.totalEnrollments," ghi danh"]})]})}),(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(l.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(o.Award,{className:"w-4 h-4"}),"Chứng chỉ"]}),(0,t.jsx)(l.CardTitle,{className:"text-2xl",children:k.certificatesIssued}),(0,t.jsxs)("p",{className:"text-xs text-gray-600",children:[k.completedEnrollments," hoàn thành"]})]})}),(0,t.jsx)(l.Card,{children:(0,t.jsxs)(l.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(l.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(y.Target,{className:"w-4 h-4"}),"Tỷ lệ đạt"]}),(0,t.jsxs)(l.CardTitle,{className:"text-2xl",children:[k.quizPassRate,"%"]}),(0,t.jsxs)("p",{className:"text-xs text-gray-600",children:["Điểm TB: ",k.avgQuizScore]})]})})]}),(0,t.jsxs)(i.Tabs,{defaultValue:"overview",className:"space-y-4",children:[(0,t.jsxs)(i.TabsList,{className:"grid w-full grid-cols-2 sm:grid-cols-4",children:[(0,t.jsx)(i.TabsTrigger,{value:"overview",children:"Tổng quan"}),(0,t.jsx)(i.TabsTrigger,{value:"courses",children:"Khóa học"}),(0,t.jsx)(i.TabsTrigger,{value:"students",children:"Học viên"}),(0,t.jsx)(i.TabsTrigger,{value:"revenue",children:"Doanh thu"})]}),(0,t.jsx)(i.TabsContent,{value:"overview",className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-4",children:[(0,t.jsxs)(l.Card,{children:[(0,t.jsx)(l.CardHeader,{children:(0,t.jsxs)(l.CardTitle,{className:"text-lg flex items-center gap-2",children:[(0,t.jsx)(x.default,{className:"w-5 h-5"}),"Trạng thái ghi danh"]})}),(0,t.jsxs)(l.CardContent,{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-blue-500"}),(0,t.jsx)("span",{className:"text-sm",children:"Đang học"})]}),(0,t.jsx)("span",{className:"font-semibold",children:k.activeEnrollments})]}),(0,t.jsx)("div",{className:"w-full bg-gray-200 rounded-full h-2",children:(0,t.jsx)("div",{className:"bg-blue-500 h-2 rounded-full",style:{width:`${k.activeEnrollments/k.totalEnrollments*100}%`}})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-green-500"}),(0,t.jsx)("span",{className:"text-sm",children:"Hoàn thành"})]}),(0,t.jsx)("span",{className:"font-semibold",children:k.completedEnrollments})]}),(0,t.jsx)("div",{className:"w-full bg-gray-200 rounded-full h-2",children:(0,t.jsx)("div",{className:"bg-green-500 h-2 rounded-full",style:{width:`${k.completedEnrollments/k.totalEnrollments*100}%`}})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-gray-400"}),(0,t.jsx)("span",{className:"text-sm",children:"Đã bỏ"})]}),(0,t.jsx)("span",{className:"font-semibold",children:k.totalEnrollments-k.activeEnrollments-k.completedEnrollments})]}),(0,t.jsx)("div",{className:"w-full bg-gray-200 rounded-full h-2",children:(0,t.jsx)("div",{className:"bg-gray-400 h-2 rounded-full",style:{width:`${(k.totalEnrollments-k.activeEnrollments-k.completedEnrollments)/k.totalEnrollments*100}%`}})})]})]})]}),(0,t.jsxs)(l.Card,{children:[(0,t.jsx)(l.CardHeader,{children:(0,t.jsxs)(l.CardTitle,{className:"text-lg flex items-center gap-2",children:[(0,t.jsx)(c.BookOpen,{className:"w-5 h-5"}),"Thống kê khóa học"]})}),(0,t.jsxs)(l.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between p-3 bg-blue-50 rounded-lg",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Tổng khóa học"}),(0,t.jsx)("p",{className:"text-2xl font-bold text-blue-600",children:k.totalCourses})]}),(0,t.jsx)(c.BookOpen,{className:"w-12 h-12 text-blue-600 opacity-20"})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between p-3 bg-green-50 rounded-lg",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Đã xuất bản"}),(0,t.jsx)("p",{className:"text-2xl font-bold text-green-600",children:k.publishedCourses})]}),(0,t.jsx)(g.CheckCircle,{className:"w-12 h-12 text-green-600 opacity-20"})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between p-3 bg-orange-50 rounded-lg",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Bản nháp"}),(0,t.jsx)("p",{className:"text-2xl font-bold text-orange-600",children:k.totalCourses-k.publishedCourses})]}),(0,t.jsx)(f.Clock,{className:"w-12 h-12 text-orange-600 opacity-20"})]})]})]})]})}),(0,t.jsx)(i.TabsContent,{value:"courses",className:"space-y-4",children:(0,t.jsxs)(l.Card,{children:[(0,t.jsxs)(l.CardHeader,{children:[(0,t.jsxs)(l.CardTitle,{className:"text-lg flex items-center gap-2",children:[(0,t.jsx)(h.BarChart3,{className:"w-5 h-5"}),"Top 5 khóa học phổ biến"]}),(0,t.jsx)(l.CardDescription,{children:"Xếp hạng theo số lượng ghi danh"})]}),(0,t.jsx)(l.CardContent,{children:(0,t.jsx)("div",{className:"space-y-4",children:E.map((e,a)=>(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsx)("div",{className:"flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm",children:a+1}),(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsx)("p",{className:"font-medium text-gray-900 truncate",children:e.title}),(0,t.jsxs)("div",{className:"flex items-center gap-4 mt-1",children:[(0,t.jsxs)("span",{className:"text-sm text-gray-600",children:[e._count.enrollments," học viên"]}),(0,t.jsx)("span",{className:"text-sm text-green-600 font-medium",children:S(e.price)})]})]}),(0,t.jsx)("div",{className:"w-24 h-2 bg-gray-200 rounded-full",children:(0,t.jsx)("div",{className:"h-2 bg-blue-500 rounded-full",style:{width:`${e._count.enrollments/(E[0]?._count?.enrollments||1)*100}%`}})})]},e.id))})})]})}),(0,t.jsx)(i.TabsContent,{value:"students",className:"space-y-4",children:(0,t.jsxs)(l.Card,{children:[(0,t.jsx)(l.CardHeader,{children:(0,t.jsxs)(l.CardTitle,{className:"text-lg flex items-center gap-2",children:[(0,t.jsx)(p.Activity,{className:"w-5 h-5"}),"Hoạt động ghi danh gần đây"]})}),(0,t.jsx)(l.CardContent,{children:(0,t.jsx)("div",{className:"space-y-3",children:M.map(e=>(0,t.jsxs)("div",{className:"flex items-center justify-between p-3 bg-gray-50 rounded-lg",children:[(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsx)("p",{className:"font-medium text-gray-900 truncate",children:e.course.title}),(0,t.jsxs)("p",{className:"text-sm text-gray-600",children:["Ghi danh: ",new Date(e.enrolledAt).toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:["COMPLETED"===e.status?(0,t.jsx)(g.CheckCircle,{className:"w-5 h-5 text-green-600"}):"ACTIVE"===e.status?(0,t.jsx)(f.Clock,{className:"w-5 h-5 text-blue-600"}):(0,t.jsx)(N.AlertCircle,{className:"w-5 h-5 text-gray-600"}),(0,t.jsxs)("span",{className:"text-sm font-medium",children:[Math.round(e.progress),"%"]})]})]},e.id))})})]})}),(0,t.jsx)(i.TabsContent,{value:"revenue",className:"space-y-4",children:(0,t.jsxs)(l.Card,{children:[(0,t.jsx)(l.CardHeader,{children:(0,t.jsxs)(l.CardTitle,{className:"text-lg flex items-center gap-2",children:[(0,t.jsx)(u.DollarSign,{className:"w-5 h-5"}),"Tổng quan doanh thu"]})}),(0,t.jsxs)(l.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"p-4 bg-green-50 rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600 mb-1",children:"Tổng doanh thu"}),(0,t.jsx)("p",{className:"text-2xl font-bold text-green-600",children:S(k.totalRevenue)})]}),(0,t.jsxs)("div",{className:"p-4 bg-blue-50 rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600 mb-1",children:"Doanh thu trung bình/khóa"}),(0,t.jsx)("p",{className:"text-2xl font-bold text-blue-600",children:S(k.totalEnrollments?k.totalRevenue/k.totalEnrollments:0)})]})]}),(0,t.jsxs)("div",{className:"pt-4 border-t",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600 mb-3",children:"Doanh thu theo khóa học"}),(0,t.jsx)("div",{className:"space-y-3",children:E.map(e=>{let a=b?.filter(t=>t.course.id===e.id).reduce((e,t)=>e+(t.paymentAmount||0),0)||0;return(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-gray-900 truncate flex-1",children:e.title}),(0,t.jsx)("span",{className:"font-semibold text-green-600",children:S(a)})]},e.id)})})]})]})]})})]})]})}e.s(["default",()=>v],377685)}]);