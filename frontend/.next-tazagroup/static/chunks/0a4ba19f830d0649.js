(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,759727,258392,e=>{"use strict";let a=(0,e.i(930702).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);e.s(["default",()=>a],258392),e.s(["TrendingUp",()=>a],759727)},245421,272901,e=>{"use strict";e.i(308140);var a=e.i(429105),t=e.i(950988),s=e.i(529590),r=e.i(403055),l=e.i(984804);let i=l.gql`
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
`,x=l.gql`
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
`,p=l.gql`
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
`,j=l.gql`
  mutation ClearCache {
    clearCache
  }
`;function w(e,t,s){let r=!!localStorage.getItem("accessToken"),l=s?.skip||s?.requireAuth!==!1&&!r,{data:n,loading:d,error:c,refetch:o}=(0,a.useQuery)(i,{variables:{modelName:e,input:t||{}},skip:l,fetchPolicy:s?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:c,refetch:o}}function C(e,t,s,r){let l=!!localStorage.getItem("accessToken"),i="string"==typeof t?t:t?.id;i||r?.skip;let d=r?.skip||!i||r?.requireAuth!==!1&&!l,{data:c,loading:o,error:u,refetch:m}=(0,a.useQuery)(n,{variables:{modelName:e,input:{id:i||"",select:s?.select,include:s?.include}},skip:d});return{data:c?.findById,loading:o,error:u,refetch:m}}function b(e,t,s){let[l,i]=(0,r.useState)(t?.page||1),[n,d]=(0,r.useState)(t?.limit||10),o=!!localStorage.getItem("accessToken"),u=s?.skip||s?.requireAuth!==!1&&!o,{data:m,loading:h,error:x,refetch:p}=(0,a.useQuery)(c,{variables:{modelName:e,input:{page:l,limit:n,where:t?.where,orderBy:t?.orderBy,select:t?.select,include:t?.include}},skip:u,fetchPolicy:"cache-and-network"}),g=m?.findManyPaginated,f=(0,r.useCallback)(e=>{i(e)},[]),y=(0,r.useCallback)(()=>{g?.meta.hasNextPage&&i(e=>e+1)},[g]),N=(0,r.useCallback)(()=>{g?.meta.hasPrevPage&&i(e=>e-1)},[g]),v=(0,r.useCallback)(e=>{d(e),i(1)},[]);return{data:g?.data,meta:g?.meta,loading:h,error:x,refetch:p,page:l,limit:n,goToPage:f,nextPage:y,prevPage:N,changeLimit:v}}function k(e,t,s){let{data:r,loading:l,error:i,refetch:n}=(0,a.useQuery)(o,{variables:{modelName:e,where:t},skip:s?.skip});return{count:r?.count,loading:l,error:i,refetch:n}}function $(e,a){let[s,{data:l,loading:i,error:n}]=(0,t.useMutation)(h,{refetchQueries:a?.refetchQueries});return[(0,r.useCallback)(async a=>{let t=await s({variables:{modelName:e,input:{data:a.data,select:a.select,include:a.include}}});return t.data?.createOne},[s,e]),{data:l?.createOne,loading:i,error:n}]}function M(e,a){let[s,{data:l,loading:i,error:n}]=(0,t.useMutation)(p,{refetchQueries:a?.refetchQueries});return[(0,r.useCallback)(async a=>{let t="string"==typeof a.where?a.where:a.where?.id;if(!t)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let r=await s({variables:{modelName:e,input:{id:t,data:a.data,select:a.select,include:a.include}}});return r.data?.updateOne},[s,e]),{data:l?.updateOne,loading:i,error:n}]}function A(e,a){let[s,{data:l,loading:i,error:n}]=(0,t.useMutation)(f,{refetchQueries:a?.refetchQueries});return[(0,r.useCallback)(async a=>{let t="string"==typeof a.where?a.where:a.where?.id;if(!t)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let r=await s({variables:{modelName:e,input:{id:t,select:a.select}}});return r.data?.deleteOne},[s,e]),{data:l?.deleteOne,loading:i,error:n}]}function q(e){let a=(0,s.useApolloClient)(),[l,d]=$(e),[c,u]=function(e,a){let[s,{data:l,loading:i,error:n}]=(0,t.useMutation)(x,{refetchQueries:void 0});return[(0,r.useCallback)(async a=>{let t=await s({variables:{model:e,...a}});return t.data?.createMany},[s,e]),{data:l?.createMany,loading:i,error:n}]}(e),[m,h]=M(e),[p,f]=function(e,a){let[s,{data:l,loading:i,error:n}]=(0,t.useMutation)(g,{refetchQueries:void 0});return[(0,r.useCallback)(async a=>{let t=await s({variables:{model:e,...a}});return t.data?.updateMany},[s,e]),{data:l?.updateMany,loading:i,error:n}]}(e),[v,j]=A(e),[w,C]=function(e,a){let[s,{data:l,loading:i,error:n}]=(0,t.useMutation)(y,{refetchQueries:void 0});return[(0,r.useCallback)(async a=>{let t=await s({variables:{model:e,where:a}});return t.data?.deleteMany},[s,e]),{data:l?.deleteMany,loading:i,error:n}]}(e),[b,k]=function(e,a){let[s,{data:l,loading:i,error:n}]=(0,t.useMutation)(N,{refetchQueries:void 0});return[(0,r.useCallback)(async a=>{let t=await s({variables:{model:e,...a}});return t.data?.upsert},[s,e]),{data:l?.upsert,loading:i,error:n}]}(e),q=(0,r.useCallback)(async t=>(await a.query({query:i,variables:{model:e,...t},fetchPolicy:"network-only"})).data.findMany,[a,e]);return{findMany:q,findUnique:(0,r.useCallback)(async(t,s)=>(await a.query({query:n,variables:{model:e,where:t,...s},fetchPolicy:"network-only"})).data.findUnique,[a,e]),count:(0,r.useCallback)(async t=>(await a.query({query:o,variables:{model:e,where:t},fetchPolicy:"network-only"})).data.count,[a,e]),createOne:l,createMany:c,updateOne:m,updateMany:p,deleteOne:v,deleteMany:w,upsert:b,states:{createOne:d,createMany:u,updateOne:h,updateMany:f,deleteOne:j,deleteMany:C,upsert:k},loading:d.loading||u.loading||h.loading||f.loading||j.loading||C.loading||k.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,j,"COUNT",0,o,"CREATE_MANY",0,x,"CREATE_ONE",0,h,"DELETE_MANY",0,y,"DELETE_ONE",0,f,"FIND_FIRST",0,d,"FIND_MANY",0,i,"FIND_MANY_PAGINATED",0,c,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,v,"GROUP_BY",0,m,"UPDATE_MANY",0,g,"UPDATE_ONE",0,p,"UPSERT",0,N],272901),e.s(["useCRUD",()=>q,"useCount",()=>k,"useCreateOne",()=>$,"useDeleteOne",()=>A,"useFindMany",()=>w,"useFindManyPaginated",()=>b,"useFindUnique",()=>C,"useUpdateOne",()=>M],245421)},295426,e=>{"use strict";let a=(0,e.i(930702).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>a])},519647,e=>{"use strict";var a=e.i(295426);e.s(["ArrowLeft",()=>a.default])},782145,e=>{"use strict";let a=(0,e.i(930702).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["default",()=>a])},435635,e=>{"use strict";var a=e.i(782145);e.s(["Calendar",()=>a.default])},775680,e=>{"use strict";var a=e.i(44990),t=e.i(403055),s=e.i(541428);let r=t.forwardRef(({className:e,...t},r)=>(0,a.jsx)("div",{ref:r,className:(0,s.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...t}));r.displayName="Card";let l=t.forwardRef(({className:e,...t},r)=>(0,a.jsx)("div",{ref:r,className:(0,s.cn)("flex flex-col space-y-1.5 p-6",e),...t}));l.displayName="CardHeader";let i=t.forwardRef(({className:e,...t},r)=>(0,a.jsx)("h3",{ref:r,className:(0,s.cn)("text-2xl font-semibold leading-none tracking-tight",e),...t}));i.displayName="CardTitle";let n=t.forwardRef(({className:e,...t},r)=>(0,a.jsx)("p",{ref:r,className:(0,s.cn)("text-sm text-muted-foreground",e),...t}));n.displayName="CardDescription";let d=t.forwardRef(({className:e,...t},r)=>(0,a.jsx)("div",{ref:r,className:(0,s.cn)("p-6 pt-0",e),...t}));d.displayName="CardContent";let c=t.forwardRef(({className:e,...t},r)=>(0,a.jsx)("div",{ref:r,className:(0,s.cn)("flex items-center p-6 pt-0",e),...t}));c.displayName="CardFooter",e.s(["Card",()=>r,"CardContent",()=>d,"CardDescription",()=>n,"CardFooter",()=>c,"CardHeader",()=>l,"CardTitle",()=>i])},702470,e=>{"use strict";var a=e.i(44990),t=e.i(207298),s=e.i(541428);let r=(0,t.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function l({className:e,variant:t,...l}){return(0,a.jsx)("span",{className:(0,s.cn)(r({variant:t}),e),...l})}e.s(["Badge",()=>l])},638381,e=>{"use strict";let a=(0,e.i(930702).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>a])},415588,e=>{"use strict";var a=e.i(638381);e.s(["Clock",()=>a.default])},645030,e=>{"use strict";var a=e.i(44990),t=e.i(403055),s=e.i(316618),r=e.i(873273),l="Progress",[i,n]=(0,s.createContextScope)(l),[d,c]=i(l),o=t.forwardRef((e,t)=>{var s,l;let{__scopeProgress:i,value:n=null,max:c,getValueLabel:o=h,...u}=e;(c||0===c)&&!g(c)&&console.error((s=`${c}`,`Invalid prop \`max\` of value \`${s}\` supplied to \`Progress\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`));let m=g(c)?c:100;null===n||f(n,m)||console.error((l=`${n}`,`Invalid prop \`value\` of value \`${l}\` supplied to \`Progress\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`));let y=f(n,m)?n:null,N=p(y)?o(y,m):void 0;return(0,a.jsx)(d,{scope:i,value:y,max:m,children:(0,a.jsx)(r.Primitive.div,{"aria-valuemax":m,"aria-valuemin":0,"aria-valuenow":p(y)?y:void 0,"aria-valuetext":N,role:"progressbar","data-state":x(y,m),"data-value":y??void 0,"data-max":m,...u,ref:t})})});o.displayName=l;var u="ProgressIndicator",m=t.forwardRef((e,t)=>{let{__scopeProgress:s,...l}=e,i=c(u,s);return(0,a.jsx)(r.Primitive.div,{"data-state":x(i.value,i.max),"data-value":i.value??void 0,"data-max":i.max,...l,ref:t})});function h(e,a){return`${Math.round(e/a*100)}%`}function x(e,a){return null==e?"indeterminate":e===a?"complete":"loading"}function p(e){return"number"==typeof e}function g(e){return p(e)&&!isNaN(e)&&e>0}function f(e,a){return p(e)&&!isNaN(e)&&e<=a&&e>=0}m.displayName=u;var y=e.i(541428);let N=t.forwardRef(({className:e,value:t,indicatorClassName:s,...r},l)=>(0,a.jsx)(o,{ref:l,className:(0,y.cn)("relative h-4 w-full overflow-hidden rounded-full bg-secondary",e),...r,children:(0,a.jsx)(m,{className:(0,y.cn)("h-full w-full flex-1 bg-primary transition-all",s),style:{transform:`translateX(-${100-(t||0)}%)`}})}));N.displayName=o.displayName,e.s(["Progress",()=>N],645030)},674181,e=>{"use strict";let a=(0,e.i(930702).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);e.s(["default",()=>a])},553579,e=>{"use strict";var a=e.i(674181);e.s(["Star",()=>a.default])},46213,e=>{"use strict";let a=(0,e.i(930702).default)("message-square",[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]]);e.s(["default",()=>a])},495280,e=>{"use strict";var a=e.i(46213);e.s(["MessageSquare",()=>a.default])},555234,e=>{"use strict";let a=(0,e.i(930702).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);e.s(["default",()=>a])},825098,e=>{"use strict";var a=e.i(555234);e.s(["Mail",()=>a.default])},128832,e=>{"use strict";let a=(0,e.i(930702).default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);e.s(["default",()=>a])},99529,e=>{"use strict";var a=e.i(128832);e.s(["Phone",()=>a.default])},816366,e=>{"use strict";let a=(0,e.i(930702).default)("circle-play",[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>a])},224949,e=>{"use strict";var a=e.i(816366);e.s(["PlayCircle",()=>a.default])},764966,e=>{"use strict";let a=(0,e.i(930702).default)("circle-user-round",[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>a])},406199,e=>{"use strict";var a=e.i(764966);e.s(["UserCircle2",()=>a.default])},298081,e=>{"use strict";let a=(0,e.i(930702).default)("trophy",[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]]);e.s(["default",()=>a])},328819,e=>{"use strict";var a=e.i(298081);e.s(["Trophy",()=>a.default])},997917,e=>{"use strict";var a=e.i(44990),t=e.i(130775),s=e.i(245421),r=e.i(775680),l=e.i(885205),i=e.i(702470),n=e.i(645030),d=e.i(519647),c=e.i(406199),o=e.i(825098),u=e.i(99529),m=e.i(435635),h=e.i(608631),x=e.i(865706),p=e.i(759727),g=e.i(415588),f=e.i(112641),y=e.i(198513),N=e.i(553579),v=e.i(495280),j=e.i(224949),w=e.i(328819),C=e.i(4993);function b(){var e;let b=(0,t.useParams)(),k=(0,t.useRouter)(),{toast:$}=(0,C.useToast)(),M=b.id,{data:A,loading:q,error:T}=(0,s.useFindUnique)("User",{where:{id:M},select:{id:!0,username:!0,email:!0,firstName:!0,lastName:!0,phone:!0,avatar:!0,isActive:!0,isVerified:!0,createdAt:!0,lastLoginAt:!0},include:{enrollments:{include:{course:{include:{category:!0,instructor:!0}}},orderBy:{enrolledAt:"desc"}},certificates:{include:{course:!0},orderBy:{issuedAt:"desc"}},courseReviews:{include:{course:!0},orderBy:{createdAt:"desc"}},_count:{select:{enrollments:!0,certificates:!0,courseReviews:!0}}}}),O=e=>e?new Date(e).toLocaleDateString("vi-VN",{year:"numeric",month:"long",day:"numeric"}):"Chưa có",S=e=>e.firstName&&e.lastName?`${e.firstName} ${e.lastName}`:e.username,D=e=>({BEGINNER:"bg-green-100 text-green-800",INTERMEDIATE:"bg-blue-100 text-blue-800",ADVANCED:"bg-purple-100 text-purple-800"})[e]||"bg-gray-100 text-gray-800";if(q)return(0,a.jsx)("div",{className:"p-4 sm:p-6 lg:p-8",children:(0,a.jsxs)("div",{className:"text-center py-12",children:[(0,a.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),(0,a.jsx)("p",{className:"text-gray-500 mt-4",children:"Đang tải thông tin học viên..."})]})});if(T||!A)return(0,a.jsx)("div",{className:"p-4 sm:p-6 lg:p-8",children:(0,a.jsx)(r.Card,{children:(0,a.jsxs)(r.CardContent,{className:"py-12 text-center",children:[(0,a.jsx)(y.AlertCircle,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),(0,a.jsx)("p",{className:"text-red-600",children:T?.message||"Không tìm thấy học viên"}),(0,a.jsxs)(l.Button,{onClick:()=>k.back(),variant:"outline",className:"mt-4",children:[(0,a.jsx)(d.ArrowLeft,{className:"w-4 h-4 mr-2"}),"Quay lại"]})]})})});let E=A.enrollments?.filter(e=>"ACTIVE"===e.status)||[],P=A.enrollments?.filter(e=>"COMPLETED"===e.status)||[],I=A.enrollments?.length>0?Math.round(A.enrollments.reduce((e,a)=>e+(a.progress||0),0)/A.enrollments.length):0;return(0,a.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 space-y-6",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[(0,a.jsxs)(l.Button,{onClick:()=>k.back(),variant:"outline",size:"sm",children:[(0,a.jsx)(d.ArrowLeft,{className:"w-4 h-4 mr-2"}),"Quay lại"]}),(0,a.jsx)("div",{className:"flex-1",children:(0,a.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:"Chi tiết học viên"})})]}),(0,a.jsx)(r.Card,{children:(0,a.jsx)(r.CardHeader,{children:(0,a.jsxs)("div",{className:"flex flex-col sm:flex-row gap-6",children:[(0,a.jsx)("div",{className:"flex-shrink-0",children:A.avatar?(0,a.jsx)("img",{src:A.avatar,alt:S(A),className:"w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"}):(0,a.jsx)("div",{className:"w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-white shadow-lg",children:(0,a.jsx)(c.UserCircle2,{className:"w-16 h-16 sm:w-20 sm:h-20 text-white"})})}),(0,a.jsxs)("div",{className:"flex-1 space-y-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)(r.CardTitle,{className:"text-2xl mb-2",children:S(A)}),(0,a.jsxs)(r.CardDescription,{className:"text-base",children:["@",A.username]})]}),(0,a.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,a.jsx)(i.Badge,{variant:A.isActive?"default":"secondary",children:A.isActive?"Hoạt động":"Tạm khóa"}),A.isVerified&&(0,a.jsxs)(i.Badge,{variant:"outline",className:"gap-1",children:[(0,a.jsx)(f.CheckCircle2,{className:"w-3 h-3"}),"Đã xác thực"]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm",children:[A.email&&(0,a.jsxs)("div",{className:"flex items-center gap-2 text-gray-600",children:[(0,a.jsx)(o.Mail,{className:"w-4 h-4 text-blue-600"}),(0,a.jsx)("span",{children:A.email})]}),A.phone&&(0,a.jsxs)("div",{className:"flex items-center gap-2 text-gray-600",children:[(0,a.jsx)(u.Phone,{className:"w-4 h-4 text-green-600"}),(0,a.jsx)("span",{children:A.phone})]}),(0,a.jsxs)("div",{className:"flex items-center gap-2 text-gray-600",children:[(0,a.jsx)(m.Calendar,{className:"w-4 h-4 text-purple-600"}),(0,a.jsxs)("span",{children:["Tham gia: ",O(A.createdAt)]})]}),A.lastLoginAt&&(0,a.jsxs)("div",{className:"flex items-center gap-2 text-gray-600",children:[(0,a.jsx)(g.Clock,{className:"w-4 h-4 text-orange-600"}),(0,a.jsxs)("span",{children:["Hoạt động: ",(e=A.lastLoginAt)?new Date(e).toLocaleString("vi-VN"):"Chưa có"]})]})]})]})]})})}),(0,a.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:[(0,a.jsxs)(r.Card,{children:[(0,a.jsx)(r.CardHeader,{className:"pb-3",children:(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsx)(r.CardDescription,{children:"Tổng khóa học"}),(0,a.jsx)(h.BookOpen,{className:"w-5 h-5 text-blue-600"})]})}),(0,a.jsxs)(r.CardContent,{children:[(0,a.jsx)("div",{className:"text-3xl font-bold text-blue-600",children:A._count?.enrollments||0}),(0,a.jsxs)("p",{className:"text-xs text-gray-500 mt-1",children:[E.length," đang học"]})]})]}),(0,a.jsxs)(r.Card,{children:[(0,a.jsx)(r.CardHeader,{className:"pb-3",children:(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsx)(r.CardDescription,{children:"Hoàn thành"}),(0,a.jsx)(f.CheckCircle2,{className:"w-5 h-5 text-green-600"})]})}),(0,a.jsxs)(r.CardContent,{children:[(0,a.jsx)("div",{className:"text-3xl font-bold text-green-600",children:P.length}),(0,a.jsxs)("p",{className:"text-xs text-gray-500 mt-1",children:[A._count?.enrollments>0?Math.round(P.length/A._count.enrollments*100):0,"% tỷ lệ hoàn thành"]})]})]}),(0,a.jsxs)(r.Card,{children:[(0,a.jsx)(r.CardHeader,{className:"pb-3",children:(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsx)(r.CardDescription,{children:"Chứng chỉ"}),(0,a.jsx)(x.Award,{className:"w-5 h-5 text-yellow-600"})]})}),(0,a.jsxs)(r.CardContent,{children:[(0,a.jsx)("div",{className:"text-3xl font-bold text-yellow-600",children:A._count?.certificates||0}),(0,a.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Đã đạt được"})]})]}),(0,a.jsxs)(r.Card,{children:[(0,a.jsx)(r.CardHeader,{className:"pb-3",children:(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsx)(r.CardDescription,{children:"Tiến độ TB"}),(0,a.jsx)(p.TrendingUp,{className:"w-5 h-5 text-purple-600"})]})}),(0,a.jsxs)(r.CardContent,{children:[(0,a.jsxs)("div",{className:"text-3xl font-bold text-purple-600",children:[I,"%"]}),(0,a.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Trung bình các khóa"})]})]})]}),(0,a.jsxs)(r.Card,{children:[(0,a.jsx)(r.CardHeader,{children:(0,a.jsx)("div",{className:"flex items-center justify-between",children:(0,a.jsxs)("div",{children:[(0,a.jsxs)(r.CardTitle,{className:"flex items-center gap-2",children:[(0,a.jsx)(h.BookOpen,{className:"w-5 h-5"}),"Khóa học đã đăng ký (",A.enrollments?.length||0,")"]}),(0,a.jsx)(r.CardDescription,{className:"mt-1",children:"Danh sách các khóa học học viên đang tham gia"})]})})}),(0,a.jsx)(r.CardContent,{children:A.enrollments&&0!==A.enrollments.length?(0,a.jsx)("div",{className:"space-y-4",children:A.enrollments.map(e=>{var t;let s,l=(t=e.status,(s={ACTIVE:{variant:"default",label:"Đang học",icon:j.PlayCircle},COMPLETED:{variant:"outline",label:"Hoàn thành",icon:f.CheckCircle2},DROPPED:{variant:"destructive",label:"Đã bỏ",icon:y.AlertCircle}})[t]||s.ACTIVE),d=l.icon;return(0,a.jsx)(r.Card,{className:"hover:shadow-md transition-shadow",children:(0,a.jsx)(r.CardContent,{className:"p-4",children:(0,a.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4",children:[(0,a.jsx)("div",{className:"flex-shrink-0",children:e.course.thumbnail?(0,a.jsx)("img",{src:e.course.thumbnail,alt:e.course.title,className:"w-full sm:w-32 h-20 sm:h-20 object-cover rounded-lg"}):(0,a.jsx)("div",{className:"w-full sm:w-32 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center",children:(0,a.jsx)(h.BookOpen,{className:"w-8 h-8 text-white"})})}),(0,a.jsxs)("div",{className:"flex-1 space-y-2",children:[(0,a.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"font-semibold text-lg",children:e.course.title}),(0,a.jsxs)("div",{className:"flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600",children:[(0,a.jsx)(i.Badge,{variant:"secondary",className:D(e.course.level),children:e.course.level}),(0,a.jsxs)("span",{className:"flex items-center gap-1",children:[(0,a.jsx)(g.Clock,{className:"w-3 h-3"}),e.course.duration||0," phút"]}),e.course.category&&(0,a.jsxs)("span",{className:"text-gray-500",children:["• ",e.course.category.name]})]})]}),(0,a.jsxs)(i.Badge,{variant:l.variant,className:"gap-1",children:[(0,a.jsx)(d,{className:"w-3 h-3"}),l.label]})]}),(0,a.jsxs)("div",{className:"space-y-1",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between text-sm",children:[(0,a.jsx)("span",{className:"text-gray-600",children:"Tiến độ học tập"}),(0,a.jsxs)("span",{className:"font-semibold",children:[e.progress||0,"%"]})]}),(0,a.jsx)(n.Progress,{value:e.progress||0,className:"h-2"})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600",children:[(0,a.jsxs)("div",{className:"flex items-center gap-1",children:[(0,a.jsx)(m.Calendar,{className:"w-3 h-3"}),(0,a.jsxs)("span",{children:["Đăng ký: ",O(e.enrolledAt)]})]}),e.lastAccessedAt&&(0,a.jsxs)("div",{className:"flex items-center gap-1",children:[(0,a.jsx)(g.Clock,{className:"w-3 h-3"}),(0,a.jsxs)("span",{children:["Truy cập: ",O(e.lastAccessedAt)]})]}),e.completedAt&&(0,a.jsxs)("div",{className:"flex items-center gap-1 text-green-600",children:[(0,a.jsx)(f.CheckCircle2,{className:"w-3 h-3"}),(0,a.jsxs)("span",{children:["Hoàn thành: ",O(e.completedAt)]})]})]}),e.course.instructor&&(0,a.jsxs)("div",{className:"text-xs text-gray-600",children:["Giảng viên: ",e.course.instructor.firstName," ",e.course.instructor.lastName]})]})]})})},e.id)})}):(0,a.jsxs)("div",{className:"text-center py-8 text-gray-500",children:[(0,a.jsx)(h.BookOpen,{className:"w-12 h-12 mx-auto mb-3 text-gray-400"}),(0,a.jsx)("p",{children:"Chưa đăng ký khóa học nào"})]})})]}),(0,a.jsxs)(r.Card,{children:[(0,a.jsx)(r.CardHeader,{children:(0,a.jsxs)(r.CardTitle,{className:"flex items-center gap-2",children:[(0,a.jsx)(w.Trophy,{className:"w-5 h-5"}),"Chứng chỉ đã đạt được (",A.certificates?.length||0,")"]})}),(0,a.jsx)(r.CardContent,{children:A.certificates&&0!==A.certificates.length?(0,a.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:A.certificates.map(e=>(0,a.jsx)(r.Card,{className:"hover:shadow-md transition-shadow",children:(0,a.jsx)(r.CardContent,{className:"p-4",children:(0,a.jsxs)("div",{className:"flex items-start gap-3",children:[(0,a.jsx)("div",{className:"flex-shrink-0",children:(0,a.jsx)("div",{className:"w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center",children:(0,a.jsx)(w.Trophy,{className:"w-6 h-6 text-white"})})}),(0,a.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,a.jsx)("h4",{className:"font-semibold text-sm truncate",children:e.course.title}),(0,a.jsx)(i.Badge,{variant:"secondary",className:`${D(e.course.level)} mt-1 text-xs`,children:e.course.level}),(0,a.jsxs)("p",{className:"text-xs text-gray-500 mt-2",children:["Cấp ngày: ",O(e.issuedAt)]})]})]})})},e.id))}):(0,a.jsxs)("div",{className:"text-center py-8 text-gray-500",children:[(0,a.jsx)(x.Award,{className:"w-12 h-12 mx-auto mb-3 text-gray-400"}),(0,a.jsx)("p",{children:"Chưa có chứng chỉ nào"})]})})]}),(0,a.jsxs)(r.Card,{children:[(0,a.jsx)(r.CardHeader,{children:(0,a.jsxs)(r.CardTitle,{className:"flex items-center gap-2",children:[(0,a.jsx)(v.MessageSquare,{className:"w-5 h-5"}),"Đánh giá của học viên (",A.courseReviews?.length||0,")"]})}),(0,a.jsx)(r.CardContent,{children:A.courseReviews&&0!==A.courseReviews.length?(0,a.jsx)("div",{className:"space-y-4",children:A.courseReviews.map(e=>(0,a.jsx)(r.Card,{children:(0,a.jsxs)(r.CardContent,{className:"p-4",children:[(0,a.jsxs)("div",{className:"flex items-start justify-between mb-2",children:[(0,a.jsxs)("div",{className:"flex-1",children:[(0,a.jsx)("h4",{className:"font-semibold",children:e.course.title}),(0,a.jsxs)("div",{className:"flex items-center gap-1 mt-1",children:[[void 0,void 0,void 0,void 0,void 0].map((t,s)=>(0,a.jsx)(N.Star,{className:`w-4 h-4 ${s<e.rating?"fill-yellow-400 text-yellow-400":"text-gray-300"}`},s)),(0,a.jsxs)("span",{className:"text-sm text-gray-600 ml-2",children:[e.rating,"/5"]})]})]}),(0,a.jsx)("span",{className:"text-xs text-gray-500",children:O(e.createdAt)})]}),e.comment&&(0,a.jsxs)("p",{className:"text-sm text-gray-700 mt-2 italic",children:['"',e.comment,'"']})]})},e.id))}):(0,a.jsxs)("div",{className:"text-center py-8 text-gray-500",children:[(0,a.jsx)(N.Star,{className:"w-12 h-12 mx-auto mb-3 text-gray-400"}),(0,a.jsx)("p",{children:"Chưa có đánh giá nào"})]})})]})]})}e.s(["default",()=>b])}]);