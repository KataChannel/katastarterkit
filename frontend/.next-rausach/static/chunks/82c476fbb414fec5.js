(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,759727,258392,e=>{"use strict";let t=(0,e.i(930702).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);e.s(["default",()=>t],258392),e.s(["TrendingUp",()=>t],759727)},850384,62476,e=>{"use strict";let t=(0,e.i(930702).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["default",()=>t],62476),e.s(["Search",()=>t],850384)},696134,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let r=a.forwardRef(({className:e,type:a,...r},l)=>(0,t.jsx)("input",{type:a,className:(0,s.cn)("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:l,...r}));r.displayName="Input",e.s(["Input",()=>r])},775680,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let r=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...a}));r.displayName="Card";let l=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",e),...a}));l.displayName="CardHeader";let i=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("h3",{ref:r,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",e),...a}));i.displayName="CardTitle";let n=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("p",{ref:r,className:(0,s.cn)("text-sm text-muted-foreground",e),...a}));n.displayName="CardDescription";let d=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("p-6 pt-0",e),...a}));d.displayName="CardContent";let c=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("div",{ref:r,className:(0,s.cn)("flex items-center p-6 pt-0",e),...a}));c.displayName="CardFooter",e.s(["Card",()=>r,"CardContent",()=>d,"CardDescription",()=>n,"CardFooter",()=>c,"CardHeader",()=>l,"CardTitle",()=>i])},702470,e=>{"use strict";var t=e.i(44990),a=e.i(207298),s=e.i(541428);let r=(0,a.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function l({className:e,variant:a,...l}){return(0,t.jsx)("span",{className:(0,s.cn)(r({variant:a}),e),...l})}e.s(["Badge",()=>l])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),s=e.i(529590),r=e.i(403055),l=e.i(984804);let i=l.gql`
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
`,c=l.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,o=l.gql`
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
`,p=l.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,h=l.gql`
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
`,x=l.gql`
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
`,f=l.gql`
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
`;function C(e,a,s){let r=!!localStorage.getItem("accessToken"),l=s?.skip||s?.requireAuth!==!1&&!r,{data:n,loading:d,error:c,refetch:o}=(0,t.useQuery)(i,{variables:{modelName:e,input:a||{}},skip:l,fetchPolicy:s?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:c,refetch:o}}function j(e,a,s,r){let l=!!localStorage.getItem("accessToken"),i="string"==typeof a?a:a?.id;i||r?.skip;let d=r?.skip||!i||r?.requireAuth!==!1&&!l,{data:c,loading:o,error:u,refetch:m}=(0,t.useQuery)(n,{variables:{modelName:e,input:{id:i||"",select:s?.select,include:s?.include}},skip:d});return{data:c?.findById,loading:o,error:u,refetch:m}}function w(e,a,s){let[l,i]=(0,r.useState)(a?.page||1),[n,d]=(0,r.useState)(a?.limit||10),o=!!localStorage.getItem("accessToken"),u=s?.skip||s?.requireAuth!==!1&&!o,{data:m,loading:p,error:h,refetch:x}=(0,t.useQuery)(c,{variables:{modelName:e,input:{page:l,limit:n,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:u,fetchPolicy:"cache-and-network"}),g=m?.findManyPaginated,f=(0,r.useCallback)(e=>{i(e)},[]),y=(0,r.useCallback)(()=>{g?.meta.hasNextPage&&i(e=>e+1)},[g]),N=(0,r.useCallback)(()=>{g?.meta.hasPrevPage&&i(e=>e-1)},[g]),v=(0,r.useCallback)(e=>{d(e),i(1)},[]);return{data:g?.data,meta:g?.meta,loading:p,error:h,refetch:x,page:l,limit:n,goToPage:f,nextPage:y,prevPage:N,changeLimit:v}}function $(e,a,s){let{data:r,loading:l,error:i,refetch:n}=(0,t.useQuery)(o,{variables:{modelName:e,where:a},skip:s?.skip});return{count:r?.count,loading:l,error:i,refetch:n}}function k(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(p,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a=await s({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[s,e]),{data:l?.createOne,loading:i,error:n}]}function M(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(x,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let r=await s({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return r.data?.updateOne},[s,e]),{data:l?.updateOne,loading:i,error:n}]}function A(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(f,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let r=await s({variables:{modelName:e,input:{id:a,select:t.select}}});return r.data?.deleteOne},[s,e]),{data:l?.deleteOne,loading:i,error:n}]}function O(e){let t=(0,s.useApolloClient)(),[l,d]=k(e),[c,u]=function(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(h,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.createMany},[s,e]),{data:l?.createMany,loading:i,error:n}]}(e),[m,p]=M(e),[x,f]=function(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(g,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.updateMany},[s,e]),{data:l?.updateMany,loading:i,error:n}]}(e),[v,b]=A(e),[C,j]=function(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(y,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,where:t}});return a.data?.deleteMany},[s,e]),{data:l?.deleteMany,loading:i,error:n}]}(e),[w,$]=function(e,t){let[s,{data:l,loading:i,error:n}]=(0,a.useMutation)(N,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await s({variables:{model:e,...t}});return a.data?.upsert},[s,e]),{data:l?.upsert,loading:i,error:n}]}(e),O=(0,r.useCallback)(async a=>(await t.query({query:i,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:O,findUnique:(0,r.useCallback)(async(a,s)=>(await t.query({query:n,variables:{model:e,where:a,...s},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,r.useCallback)(async a=>(await t.query({query:o,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:l,createMany:c,updateOne:m,updateMany:x,deleteOne:v,deleteMany:C,upsert:w,states:{createOne:d,createMany:u,updateOne:p,updateMany:f,deleteOne:b,deleteMany:j,upsert:$},loading:d.loading||u.loading||p.loading||f.loading||b.loading||j.loading||$.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,b,"COUNT",0,o,"CREATE_MANY",0,h,"CREATE_ONE",0,p,"DELETE_MANY",0,y,"DELETE_ONE",0,f,"FIND_FIRST",0,d,"FIND_MANY",0,i,"FIND_MANY_PAGINATED",0,c,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,v,"GROUP_BY",0,m,"UPDATE_MANY",0,g,"UPDATE_ONE",0,x,"UPSERT",0,N],272901),e.s(["useCRUD",()=>O,"useCount",()=>$,"useCreateOne",()=>k,"useDeleteOne",()=>A,"useFindMany",()=>C,"useFindManyPaginated",()=>w,"useFindUnique",()=>j,"useUpdateOne",()=>M],245421)},638381,e=>{"use strict";let t=(0,e.i(930702).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},782145,e=>{"use strict";let t=(0,e.i(930702).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["default",()=>t])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},621924,e=>{"use strict";let t=(0,e.i(930702).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["default",()=>t])},822390,e=>{"use strict";var t=e.i(621924);e.s(["CheckCircle",()=>t.default])},838049,e=>{"use strict";let t=(0,e.i(930702).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);e.s(["default",()=>t])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},336613,e=>{"use strict";let t=(0,e.i(930702).default)("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);e.s(["default",()=>t])},649248,e=>{"use strict";var t=e.i(336613);e.s(["DollarSign",()=>t.default])},969796,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(245421),r=e.i(775680),l=e.i(885205),i=e.i(696134),n=e.i(702470),d=e.i(850384),c=e.i(771564),o=e.i(608631),u=e.i(198513),m=e.i(759727),p=e.i(435635),h=e.i(649248),x=e.i(822390),g=e.i(257117),f=e.i(415588),y=e.i(4993);function N(){let{toast:e}=(0,y.useToast)(),[N,v]=(0,a.useState)(""),[b,C]=(0,a.useState)("all"),{data:j,loading:w,error:$,refetch:k}=(0,s.useFindMany)("Enrollment",{select:{id:!0,status:!0,progress:!0,paymentAmount:!0,paymentMethod:!0,enrolledAt:!0,completedAt:!0,lastAccessedAt:!0},include:{user:{select:{id:!0,username:!0,firstName:!0,lastName:!0,email:!0}},course:{select:{id:!0,title:!0,slug:!0,price:!0}}},orderBy:{enrolledAt:"desc"}}),M=(j||[]).filter(e=>{let t=(e.user.firstName&&e.user.lastName?`${e.user.firstName} ${e.user.lastName}`:e.user.username).toLowerCase().includes(N.toLowerCase())||(e.user.email||"").toLowerCase().includes(N.toLowerCase())||e.course.title.toLowerCase().includes(N.toLowerCase()),a="all"===b||e.status===b;return t&&a}),A=e=>e?new Date(e).toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"}):"-",O=e=>e?new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(e):"Miễn phí",T={total:j?.length||0,active:j?.filter(e=>"ACTIVE"===e.status).length||0,completed:j?.filter(e=>"COMPLETED"===e.status).length||0,dropped:j?.filter(e=>"DROPPED"===e.status).length||0};return(0,t.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 space-y-6",children:[(0,t.jsx)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:"Quản lý ghi danh"}),(0,t.jsxs)("p",{className:"text-sm sm:text-base text-gray-600 mt-1",children:["Tổng cộng ",T.total," ghi danh"]})]})}),(0,t.jsxs)("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-4",children:[(0,t.jsx)(r.Card,{children:(0,t.jsxs)(r.CardHeader,{className:"pb-3",children:[(0,t.jsx)(r.CardDescription,{children:"Tổng số"}),(0,t.jsx)(r.CardTitle,{className:"text-2xl",children:T.total})]})}),(0,t.jsx)(r.Card,{children:(0,t.jsxs)(r.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(r.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(m.TrendingUp,{className:"w-4 h-4"}),"Đang học"]}),(0,t.jsx)(r.CardTitle,{className:"text-2xl text-blue-600",children:T.active})]})}),(0,t.jsx)(r.Card,{children:(0,t.jsxs)(r.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(r.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(x.CheckCircle,{className:"w-4 h-4"}),"Hoàn thành"]}),(0,t.jsx)(r.CardTitle,{className:"text-2xl text-green-600",children:T.completed})]})}),(0,t.jsx)(r.Card,{children:(0,t.jsxs)(r.CardHeader,{className:"pb-3",children:[(0,t.jsxs)(r.CardDescription,{className:"flex items-center gap-1",children:[(0,t.jsx)(g.XCircle,{className:"w-4 h-4"}),"Đã bỏ"]}),(0,t.jsx)(r.CardTitle,{className:"text-2xl text-gray-600",children:T.dropped})]})})]}),(0,t.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4",children:[(0,t.jsxs)("div",{className:"flex-1 relative",children:[(0,t.jsx)(d.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"}),(0,t.jsx)(i.Input,{placeholder:"Tìm kiếm theo học viên, khóa học...",value:N,onChange:e=>v(e.target.value),className:"pl-10"})]}),(0,t.jsxs)("div",{className:"flex gap-2 overflow-x-auto pb-2 sm:pb-0",children:[(0,t.jsx)(l.Button,{variant:"all"===b?"default":"outline",onClick:()=>C("all"),size:"sm",children:"Tất cả"}),(0,t.jsx)(l.Button,{variant:"ACTIVE"===b?"default":"outline",onClick:()=>C("ACTIVE"),size:"sm",children:"Đang học"}),(0,t.jsx)(l.Button,{variant:"COMPLETED"===b?"default":"outline",onClick:()=>C("COMPLETED"),size:"sm",children:"Hoàn thành"}),(0,t.jsx)(l.Button,{variant:"DROPPED"===b?"default":"outline",onClick:()=>C("DROPPED"),size:"sm",children:"Đã bỏ"})]})]}),w?(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),(0,t.jsx)("p",{className:"text-gray-500 mt-4",children:"Đang tải..."})]}):$?(0,t.jsx)(r.Card,{children:(0,t.jsxs)(r.CardContent,{className:"py-12 text-center",children:[(0,t.jsx)(u.AlertCircle,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),(0,t.jsxs)("p",{className:"text-red-600",children:["Lỗi: ",$.message]})]})}):0===M.length?(0,t.jsx)(r.Card,{children:(0,t.jsxs)(r.CardContent,{className:"py-12 text-center",children:[(0,t.jsx)(o.BookOpen,{className:"w-12 h-12 text-gray-400 mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-gray-500",children:"Không tìm thấy ghi danh nào"})]})}):(0,t.jsx)("div",{className:"grid grid-cols-1 gap-4",children:M.map(e=>{var a,s,i;let d,u;return(0,t.jsxs)(r.Card,{className:"hover:shadow-lg transition-shadow",children:[(0,t.jsx)(r.CardHeader,{className:"pb-3",children:(0,t.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3",children:[(0,t.jsx)("div",{className:"flex-1 min-w-0",children:(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)(c.Users,{className:"w-5 h-5 text-blue-600 mt-1 flex-shrink-0"}),(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsx)(r.CardTitle,{className:"text-base mb-1",children:(a=e.user).firstName&&a.lastName?`${a.firstName} ${a.lastName}`:a.username}),(0,t.jsx)("p",{className:"text-sm text-gray-600 truncate",children:e.user.email||e.user.username})]})]})}),(s=e.status,u=(d=({ACTIVE:{variant:"default",label:"Đang học",icon:m.TrendingUp},COMPLETED:{variant:"default",label:"Hoàn thành",icon:x.CheckCircle},DROPPED:{variant:"secondary",label:"Đã bỏ",icon:g.XCircle}})[s]||{variant:"outline",label:s,icon:f.Clock}).icon,(0,t.jsxs)(n.Badge,{variant:d.variant,className:"gap-1",children:[(0,t.jsx)(u,{className:"w-3 h-3"}),d.label]}))]})}),(0,t.jsxs)(r.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-start gap-3 p-3 bg-gray-50 rounded-lg",children:[(0,t.jsx)(o.BookOpen,{className:"w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"}),(0,t.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,t.jsx)("p",{className:"font-medium text-gray-900 truncate",children:e.course.title}),(0,t.jsxs)("p",{className:"text-sm text-gray-600 mt-1",children:["Giá: ",O(e.course.price)]})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-gray-600",children:"Tiến độ học tập"}),(0,t.jsxs)("span",{className:"font-semibold text-gray-900",children:[Math.round(e.progress),"%"]})]}),(0,t.jsx)("div",{className:"w-full bg-gray-200 rounded-full h-2",children:(0,t.jsx)("div",{className:`h-2 rounded-full transition-all ${(i=e.progress)>=80?"bg-green-500":i>=50?"bg-blue-500":i>=20?"bg-yellow-500":"bg-gray-300"}`,style:{width:`${e.progress}%`}})})]}),e.paymentAmount>0&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-600 p-2 bg-blue-50 rounded",children:[(0,t.jsx)(h.DollarSign,{className:"w-4 h-4 text-blue-600"}),(0,t.jsxs)("span",{children:["Thanh toán: ",O(e.paymentAmount)]}),e.paymentMethod&&(0,t.jsx)(n.Badge,{variant:"outline",className:"ml-auto",children:e.paymentMethod})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t text-xs",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 text-gray-600",children:[(0,t.jsx)(p.Calendar,{className:"w-3 h-3"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-gray-500",children:"Ghi danh"}),(0,t.jsx)("p",{className:"font-medium text-gray-900",children:A(e.enrolledAt)})]})]}),e.lastAccessedAt&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-gray-600",children:[(0,t.jsx)(f.Clock,{className:"w-3 h-3"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-gray-500",children:"Truy cập cuối"}),(0,t.jsx)("p",{className:"font-medium text-gray-900",children:A(e.lastAccessedAt)})]})]}),e.completedAt&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-gray-600",children:[(0,t.jsx)(x.CheckCircle,{className:"w-3 h-3 text-green-600"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-gray-500",children:"Hoàn thành"}),(0,t.jsx)("p",{className:"font-medium text-green-900",children:A(e.completedAt)})]})]})]}),(0,t.jsx)("div",{className:"flex gap-2 pt-3 border-t",children:(0,t.jsx)(l.Button,{variant:"outline",size:"sm",className:"flex-1",children:"Xem chi tiết"})})]})]},e.id)})})]})}e.s(["default",()=>N])}]);