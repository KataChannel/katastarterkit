module.exports=[57597,659384,a=>{"use strict";let b=(0,a.i(367990).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);a.s(["default",()=>b],659384),a.s(["TrendingUp",()=>b],57597)},235746,769056,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(563718),e=a.i(651332),f=a.i(772213);let g=f.gql`
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
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},13755,a=>{"use strict";let b=(0,a.i(367990).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);a.s(["default",()=>b])},516482,a=>{"use strict";var b=a.i(13755);a.s(["ArrowLeft",()=>b.default])},722112,a=>{"use strict";let b=(0,a.i(367990).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);a.s(["default",()=>b])},128348,a=>{"use strict";var b=a.i(722112);a.s(["Calendar",()=>b.default])},975780,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...c}));e.displayName="Card";let f=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex flex-col space-y-1.5 p-6",a),...c}));f.displayName="CardHeader";let g=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("h3",{ref:e,className:(0,d.cn)("text-2xl font-semibold leading-none tracking-tight",a),...c}));g.displayName="CardTitle";let h=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("p",{ref:e,className:(0,d.cn)("text-sm text-muted-foreground",a),...c}));h.displayName="CardDescription";let i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("p-6 pt-0",a),...c}));i.displayName="CardContent";let j=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex items-center p-6 pt-0",a),...c}));j.displayName="CardFooter",a.s(["Card",()=>e,"CardContent",()=>i,"CardDescription",()=>h,"CardFooter",()=>j,"CardHeader",()=>f,"CardTitle",()=>g])},293470,a=>{"use strict";var b=a.i(321248),c=a.i(13801),d=a.i(422171);let e=(0,c.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function f({className:a,variant:c,...f}){return(0,b.jsx)("span",{className:(0,d.cn)(e({variant:c}),a),...f})}a.s(["Badge",()=>f])},605751,a=>{"use strict";let b=(0,a.i(367990).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},411185,a=>{"use strict";var b=a.i(605751);a.s(["Clock",()=>b.default])},976762,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(694475),e=a.i(372123),f="Progress",[g,h]=(0,d.createContextScope)(f),[i,j]=g(f),k=c.forwardRef((a,c)=>{var d,f;let{__scopeProgress:g,value:h=null,max:j,getValueLabel:k=n,...l}=a;(j||0===j)&&!q(j)&&console.error((d=`${j}`,`Invalid prop \`max\` of value \`${d}\` supplied to \`Progress\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`));let m=q(j)?j:100;null===h||r(h,m)||console.error((f=`${h}`,`Invalid prop \`value\` of value \`${f}\` supplied to \`Progress\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`));let s=r(h,m)?h:null,t=p(s)?k(s,m):void 0;return(0,b.jsx)(i,{scope:g,value:s,max:m,children:(0,b.jsx)(e.Primitive.div,{"aria-valuemax":m,"aria-valuemin":0,"aria-valuenow":p(s)?s:void 0,"aria-valuetext":t,role:"progressbar","data-state":o(s,m),"data-value":s??void 0,"data-max":m,...l,ref:c})})});k.displayName=f;var l="ProgressIndicator",m=c.forwardRef((a,c)=>{let{__scopeProgress:d,...f}=a,g=j(l,d);return(0,b.jsx)(e.Primitive.div,{"data-state":o(g.value,g.max),"data-value":g.value??void 0,"data-max":g.max,...f,ref:c})});function n(a,b){return`${Math.round(a/b*100)}%`}function o(a,b){return null==a?"indeterminate":a===b?"complete":"loading"}function p(a){return"number"==typeof a}function q(a){return p(a)&&!isNaN(a)&&a>0}function r(a,b){return p(a)&&!isNaN(a)&&a<=b&&a>=0}m.displayName=l;var s=a.i(422171);let t=c.forwardRef(({className:a,value:c,indicatorClassName:d,...e},f)=>(0,b.jsx)(k,{ref:f,className:(0,s.cn)("relative h-4 w-full overflow-hidden rounded-full bg-secondary",a),...e,children:(0,b.jsx)(m,{className:(0,s.cn)("h-full w-full flex-1 bg-primary transition-all",d),style:{transform:`translateX(-${100-(c||0)}%)`}})}));t.displayName=k.displayName,a.s(["Progress",()=>t],976762)},52841,a=>{"use strict";let b=(0,a.i(367990).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);a.s(["default",()=>b])},520215,a=>{"use strict";var b=a.i(52841);a.s(["Star",()=>b.default])},273841,a=>{"use strict";let b=(0,a.i(367990).default)("message-square",[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]]);a.s(["default",()=>b])},638735,a=>{"use strict";var b=a.i(273841);a.s(["MessageSquare",()=>b.default])},814588,a=>{"use strict";let b=(0,a.i(367990).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);a.s(["default",()=>b])},140300,a=>{"use strict";var b=a.i(814588);a.s(["Mail",()=>b.default])},557079,a=>{"use strict";let b=(0,a.i(367990).default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);a.s(["default",()=>b])},434741,a=>{"use strict";var b=a.i(557079);a.s(["Phone",()=>b.default])},773404,a=>{"use strict";let b=(0,a.i(367990).default)("circle-play",[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},187145,a=>{"use strict";var b=a.i(773404);a.s(["PlayCircle",()=>b.default])},180423,a=>{"use strict";let b=(0,a.i(367990).default)("circle-user-round",[["path",{d:"M18 20a6 6 0 0 0-12 0",key:"1qehca"}],["circle",{cx:"12",cy:"10",r:"4",key:"1h16sb"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},459853,a=>{"use strict";var b=a.i(180423);a.s(["UserCircle2",()=>b.default])},507721,a=>{"use strict";let b=(0,a.i(367990).default)("trophy",[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]]);a.s(["default",()=>b])},388339,a=>{"use strict";var b=a.i(507721);a.s(["Trophy",()=>b.default])}];

//# sourceMappingURL=_e81270ca._.js.map