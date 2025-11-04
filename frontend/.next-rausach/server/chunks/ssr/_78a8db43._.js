module.exports=[57597,659384,a=>{"use strict";let b=(0,a.i(367990).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);a.s(["default",()=>b],659384),a.s(["TrendingUp",()=>b],57597)},722112,a=>{"use strict";let b=(0,a.i(367990).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);a.s(["default",()=>b])},128348,a=>{"use strict";var b=a.i(722112);a.s(["Calendar",()=>b.default])},629432,575389,a=>{"use strict";let b=(0,a.i(367990).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);a.s(["default",()=>b],575389),a.s(["Search",()=>b],629432)},478184,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,type:c,...e},f)=>(0,b.jsx)("input",{type:c,className:(0,d.cn)("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:f,...e}));e.displayName="Input",a.s(["Input",()=>e])},975780,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...c}));e.displayName="Card";let f=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex flex-col space-y-1.5 p-6",a),...c}));f.displayName="CardHeader";let g=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("h3",{ref:e,className:(0,d.cn)("text-2xl font-semibold leading-none tracking-tight",a),...c}));g.displayName="CardTitle";let h=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("p",{ref:e,className:(0,d.cn)("text-sm text-muted-foreground",a),...c}));h.displayName="CardDescription";let i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("p-6 pt-0",a),...c}));i.displayName="CardContent";let j=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex items-center p-6 pt-0",a),...c}));j.displayName="CardFooter",a.s(["Card",()=>e,"CardContent",()=>i,"CardDescription",()=>h,"CardFooter",()=>j,"CardHeader",()=>f,"CardTitle",()=>g])},293470,a=>{"use strict";var b=a.i(321248),c=a.i(13801),d=a.i(422171);let e=(0,c.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function f({className:a,variant:c,...f}){return(0,b.jsx)("span",{className:(0,d.cn)(e({variant:c}),a),...f})}a.s(["Badge",()=>f])},235746,769056,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(563718),e=a.i(651332),f=a.i(772213);let g=f.gql`
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
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},814588,a=>{"use strict";let b=(0,a.i(367990).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);a.s(["default",()=>b])},140300,a=>{"use strict";var b=a.i(814588);a.s(["Mail",()=>b.default])},557079,a=>{"use strict";let b=(0,a.i(367990).default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);a.s(["default",()=>b])},434741,a=>{"use strict";var b=a.i(557079);a.s(["Phone",()=>b.default])},180423,a=>{"use strict";let b=(0,a.i(367990).default)("circle-user-round",[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},459853,a=>{"use strict";var b=a.i(180423);a.s(["UserCircle2",()=>b.default])},370303,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(53627),e=a.i(235746),f=a.i(975780),g=a.i(202979),h=a.i(478184),i=a.i(293470),j=a.i(629432),k=a.i(358054),l=a.i(26720),m=a.i(147678),n=a.i(327987),o=a.i(459853),p=a.i(140300),q=a.i(434741),r=a.i(128348),s=a.i(57597),t=a.i(234211);function u(){let a=(0,d.useRouter)(),{toast:u}=(0,t.useToast)(),[v,w]=(0,c.useState)(""),[x,y]=(0,c.useState)("all"),{data:z,loading:A,error:B,refetch:C}=(0,e.useFindMany)("User",{where:{roleType:"USER",enrollments:{some:{}}},select:{id:!0,username:!0,email:!0,firstName:!0,lastName:!0,phone:!0,avatar:!0,isActive:!0,isVerified:!0,createdAt:!0,lastLoginAt:!0},include:{_count:{select:{enrollments:!0,certificates:!0,courseReviews:!0}}},orderBy:{createdAt:"desc"}}),D=(z||[]).filter(a=>{let b=a.username.toLowerCase().includes(v.toLowerCase())||(a.email||"").toLowerCase().includes(v.toLowerCase())||(a.firstName||"").toLowerCase().includes(v.toLowerCase())||(a.lastName||"").toLowerCase().includes(v.toLowerCase()),c="all"===x||"active"===x&&a.isActive||"inactive"===x&&!a.isActive||"enrolled"===x&&a._count?.enrollments>0;return b&&c}),E=a=>a?new Date(a).toLocaleDateString("vi-VN"):"Chưa có",F=a=>a.firstName&&a.lastName?`${a.firstName} ${a.lastName}`:a.username;return(0,b.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 space-y-6",children:[(0,b.jsx)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:"Quản lý học viên"}),(0,b.jsxs)("p",{className:"text-sm sm:text-base text-gray-600 mt-1",children:["Tổng cộng ",z?.length||0," học viên đã đăng ký khóa học"]}),(0,b.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"💡 Chỉ hiển thị user có ít nhất 1 enrollment"})]})}),(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4",children:[(0,b.jsxs)("div",{className:"flex-1 relative",children:[(0,b.jsx)(j.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"}),(0,b.jsx)(h.Input,{placeholder:"Tìm kiếm học viên...",value:v,onChange:a=>w(a.target.value),className:"pl-10"})]}),(0,b.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,b.jsx)(g.Button,{variant:"all"===x?"default":"outline",onClick:()=>y("all"),size:"sm",children:"Tất cả"}),(0,b.jsx)(g.Button,{variant:"active"===x?"default":"outline",onClick:()=>y("active"),size:"sm",children:"Hoạt động"}),(0,b.jsx)(g.Button,{variant:"inactive"===x?"default":"outline",onClick:()=>y("inactive"),size:"sm",children:"Không hoạt động"}),(0,b.jsx)(g.Button,{variant:"enrolled"===x?"default":"outline",onClick:()=>y("enrolled"),size:"sm",children:"Có khóa học"})]})]}),A?(0,b.jsxs)("div",{className:"text-center py-12",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),(0,b.jsx)("p",{className:"text-gray-500 mt-4",children:"Đang tải..."})]}):B?(0,b.jsx)(f.Card,{children:(0,b.jsxs)(f.CardContent,{className:"py-12 text-center",children:[(0,b.jsx)(n.AlertCircle,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),(0,b.jsxs)("p",{className:"text-red-600",children:["Lỗi: ",B.message]})]})}):0===D.length?(0,b.jsx)(f.Card,{children:(0,b.jsxs)(f.CardContent,{className:"py-12 text-center",children:[(0,b.jsx)(o.UserCircle2,{className:"w-12 h-12 text-gray-400 mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-gray-500",children:"Không tìm thấy học viên nào"})]})}):(0,b.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",children:D.map(c=>(0,b.jsxs)(f.Card,{className:"hover:shadow-lg transition-shadow",children:[(0,b.jsxs)(f.CardHeader,{className:"pb-3",children:[(0,b.jsx)("div",{className:"flex items-start justify-between mb-3",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[c.avatar?(0,b.jsx)("img",{src:c.avatar,alt:F(c),className:"w-12 h-12 rounded-full object-cover"}):(0,b.jsx)("div",{className:"w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center",children:(0,b.jsx)(o.UserCircle2,{className:"w-8 h-8 text-blue-600"})}),(0,b.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,b.jsx)(f.CardTitle,{className:"text-base truncate",children:F(c)}),(0,b.jsxs)("p",{className:"text-xs text-gray-500 truncate",children:["@",c.username]})]})]})}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)(i.Badge,{variant:c.isActive?"default":"secondary",className:"text-xs",children:c.isActive?"Hoạt động":"Tạm khóa"}),c.isVerified&&(0,b.jsx)(i.Badge,{variant:"outline",className:"text-xs",children:"Đã xác thực"})]})]}),(0,b.jsxs)(f.CardContent,{className:"space-y-3",children:[(0,b.jsxs)("div",{className:"space-y-2 text-xs",children:[c.email&&(0,b.jsxs)("div",{className:"flex items-center gap-2 text-gray-600",children:[(0,b.jsx)(p.Mail,{className:"w-3 h-3 flex-shrink-0"}),(0,b.jsx)("span",{className:"truncate",children:c.email})]}),c.phone&&(0,b.jsxs)("div",{className:"flex items-center gap-2 text-gray-600",children:[(0,b.jsx)(q.Phone,{className:"w-3 h-3 flex-shrink-0"}),(0,b.jsx)("span",{children:c.phone})]})]}),(0,b.jsxs)("div",{className:"grid grid-cols-3 gap-2 pt-3 border-t",children:[(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("div",{className:"flex items-center justify-center gap-1 mb-1",children:(0,b.jsx)(l.BookOpen,{className:"w-3 h-3 text-blue-600"})}),(0,b.jsx)("p",{className:"text-lg font-bold text-gray-900",children:c._count?.enrollments||0}),(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Khóa học"})]}),(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("div",{className:"flex items-center justify-center gap-1 mb-1",children:(0,b.jsx)(m.Award,{className:"w-3 h-3 text-yellow-600"})}),(0,b.jsx)("p",{className:"text-lg font-bold text-gray-900",children:c._count?.certificates||0}),(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Chứng chỉ"})]}),(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("div",{className:"flex items-center justify-center gap-1 mb-1",children:(0,b.jsx)(s.TrendingUp,{className:"w-3 h-3 text-green-600"})}),(0,b.jsx)("p",{className:"text-lg font-bold text-gray-900",children:c._count?.courseReviews||0}),(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Đánh giá"})]})]}),(0,b.jsxs)("div",{className:"pt-3 border-t space-y-1 text-xs text-gray-600",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(r.Calendar,{className:"w-3 h-3"}),(0,b.jsxs)("span",{children:["Tham gia: ",E(c.createdAt)]})]}),c.lastLoginAt&&(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(k.Users,{className:"w-3 h-3"}),(0,b.jsxs)("span",{children:["Hoạt động: ",E(c.lastLoginAt)]})]})]}),(0,b.jsx)("div",{className:"pt-3 border-t",children:(0,b.jsx)(g.Button,{variant:"outline",size:"sm",className:"w-full",onClick:()=>a.push(`/lms/admin/students/${c.id}`),children:"Xem chi tiết"})})]})]},c.id))})]})}a.s(["default",()=>u])}];

//# sourceMappingURL=_78a8db43._.js.map