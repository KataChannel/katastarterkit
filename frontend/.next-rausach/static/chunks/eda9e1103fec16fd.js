(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,994315,e=>{"use strict";let a=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>a])},606443,e=>{"use strict";var a=e.i(994315);e.s(["Plus",()=>a.default])},245421,272901,e=>{"use strict";e.i(308140);var a=e.i(429105),t=e.i(950988),l=e.i(529590),s=e.i(403055),i=e.i(984804);let r=i.gql`
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
`,c=i.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,u=i.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,o=i.gql`
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
`,h=i.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,p=i.gql`
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
`,g=i.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,x=i.gql`
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
`,y=i.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,N=i.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,f=i.gql`
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
`,j=i.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,v=i.gql`
  mutation ClearCache {
    clearCache
  }
`;function b(e,t,l){let s=!!localStorage.getItem("accessToken"),i=l?.skip||l?.requireAuth!==!1&&!s,{data:n,loading:d,error:c,refetch:u}=(0,a.useQuery)(r,{variables:{modelName:e,input:t||{}},skip:i,fetchPolicy:l?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:c,refetch:u}}function C(e,t,l,s){let i=!!localStorage.getItem("accessToken"),r="string"==typeof t?t:t?.id;r||s?.skip;let d=s?.skip||!r||s?.requireAuth!==!1&&!i,{data:c,loading:u,error:o,refetch:m}=(0,a.useQuery)(n,{variables:{modelName:e,input:{id:r||"",select:l?.select,include:l?.include}},skip:d});return{data:c?.findById,loading:u,error:o,refetch:m}}function w(e,t,l){let[i,r]=(0,s.useState)(t?.page||1),[n,d]=(0,s.useState)(t?.limit||10),u=!!localStorage.getItem("accessToken"),o=l?.skip||l?.requireAuth!==!1&&!u,{data:m,loading:h,error:p,refetch:g}=(0,a.useQuery)(c,{variables:{modelName:e,input:{page:i,limit:n,where:t?.where,orderBy:t?.orderBy,select:t?.select,include:t?.include}},skip:o,fetchPolicy:"cache-and-network"}),x=m?.findManyPaginated,y=(0,s.useCallback)(e=>{r(e)},[]),N=(0,s.useCallback)(()=>{x?.meta.hasNextPage&&r(e=>e+1)},[x]),f=(0,s.useCallback)(()=>{x?.meta.hasPrevPage&&r(e=>e-1)},[x]),j=(0,s.useCallback)(e=>{d(e),r(1)},[]);return{data:x?.data,meta:x?.meta,loading:h,error:p,refetch:g,page:i,limit:n,goToPage:y,nextPage:N,prevPage:f,changeLimit:j}}function S(e,t,l){let{data:s,loading:i,error:r,refetch:n}=(0,a.useQuery)(u,{variables:{modelName:e,where:t},skip:l?.skip});return{count:s?.count,loading:i,error:r,refetch:n}}function $(e,a){let[l,{data:i,loading:r,error:n}]=(0,t.useMutation)(h,{refetchQueries:a?.refetchQueries});return[(0,s.useCallback)(async a=>{let t=await l({variables:{modelName:e,input:{data:a.data,select:a.select,include:a.include}}});return t.data?.createOne},[l,e]),{data:i?.createOne,loading:r,error:n}]}function I(e,a){let[l,{data:i,loading:r,error:n}]=(0,t.useMutation)(g,{refetchQueries:a?.refetchQueries});return[(0,s.useCallback)(async a=>{let t="string"==typeof a.where?a.where:a.where?.id;if(!t)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let s=await l({variables:{modelName:e,input:{id:t,data:a.data,select:a.select,include:a.include}}});return s.data?.updateOne},[l,e]),{data:i?.updateOne,loading:r,error:n}]}function k(e,a){let[l,{data:i,loading:r,error:n}]=(0,t.useMutation)(y,{refetchQueries:a?.refetchQueries});return[(0,s.useCallback)(async a=>{let t="string"==typeof a.where?a.where:a.where?.id;if(!t)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let s=await l({variables:{modelName:e,input:{id:t,select:a.select}}});return s.data?.deleteOne},[l,e]),{data:i?.deleteOne,loading:r,error:n}]}function T(e){let a=(0,l.useApolloClient)(),[i,d]=$(e),[c,o]=function(e,a){let[l,{data:i,loading:r,error:n}]=(0,t.useMutation)(p,{refetchQueries:void 0});return[(0,s.useCallback)(async a=>{let t=await l({variables:{model:e,...a}});return t.data?.createMany},[l,e]),{data:i?.createMany,loading:r,error:n}]}(e),[m,h]=I(e),[g,y]=function(e,a){let[l,{data:i,loading:r,error:n}]=(0,t.useMutation)(x,{refetchQueries:void 0});return[(0,s.useCallback)(async a=>{let t=await l({variables:{model:e,...a}});return t.data?.updateMany},[l,e]),{data:i?.updateMany,loading:r,error:n}]}(e),[j,v]=k(e),[b,C]=function(e,a){let[l,{data:i,loading:r,error:n}]=(0,t.useMutation)(N,{refetchQueries:void 0});return[(0,s.useCallback)(async a=>{let t=await l({variables:{model:e,where:a}});return t.data?.deleteMany},[l,e]),{data:i?.deleteMany,loading:r,error:n}]}(e),[w,S]=function(e,a){let[l,{data:i,loading:r,error:n}]=(0,t.useMutation)(f,{refetchQueries:void 0});return[(0,s.useCallback)(async a=>{let t=await l({variables:{model:e,...a}});return t.data?.upsert},[l,e]),{data:i?.upsert,loading:r,error:n}]}(e),T=(0,s.useCallback)(async t=>(await a.query({query:r,variables:{model:e,...t},fetchPolicy:"network-only"})).data.findMany,[a,e]);return{findMany:T,findUnique:(0,s.useCallback)(async(t,l)=>(await a.query({query:n,variables:{model:e,where:t,...l},fetchPolicy:"network-only"})).data.findUnique,[a,e]),count:(0,s.useCallback)(async t=>(await a.query({query:u,variables:{model:e,where:t},fetchPolicy:"network-only"})).data.count,[a,e]),createOne:i,createMany:c,updateOne:m,updateMany:g,deleteOne:j,deleteMany:b,upsert:w,states:{createOne:d,createMany:o,updateOne:h,updateMany:y,deleteOne:v,deleteMany:C,upsert:S},loading:d.loading||o.loading||h.loading||y.loading||v.loading||C.loading||S.loading}}e.s(["AGGREGATE",0,o,"CLEAR_CACHE",0,v,"COUNT",0,u,"CREATE_MANY",0,p,"CREATE_ONE",0,h,"DELETE_MANY",0,N,"DELETE_ONE",0,y,"FIND_FIRST",0,d,"FIND_MANY",0,r,"FIND_MANY_PAGINATED",0,c,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,j,"GROUP_BY",0,m,"UPDATE_MANY",0,x,"UPDATE_ONE",0,g,"UPSERT",0,f],272901),e.s(["useCRUD",()=>T,"useCount",()=>S,"useCreateOne",()=>$,"useDeleteOne",()=>k,"useFindMany",()=>b,"useFindManyPaginated",()=>w,"useFindUnique",()=>C,"useUpdateOne",()=>I],245421)},775680,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(541428);let s=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("div",{ref:s,className:(0,l.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...t}));s.displayName="Card";let i=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("div",{ref:s,className:(0,l.cn)("flex flex-col space-y-1.5 p-6",e),...t}));i.displayName="CardHeader";let r=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("h3",{ref:s,className:(0,l.cn)("text-2xl font-semibold leading-none tracking-tight",e),...t}));r.displayName="CardTitle";let n=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("p",{ref:s,className:(0,l.cn)("text-sm text-muted-foreground",e),...t}));n.displayName="CardDescription";let d=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("div",{ref:s,className:(0,l.cn)("p-6 pt-0",e),...t}));d.displayName="CardContent";let c=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("div",{ref:s,className:(0,l.cn)("flex items-center p-6 pt-0",e),...t}));c.displayName="CardFooter",e.s(["Card",()=>s,"CardContent",()=>d,"CardDescription",()=>n,"CardFooter",()=>c,"CardHeader",()=>i,"CardTitle",()=>r])},696134,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(541428);let s=t.forwardRef(({className:e,type:t,...s},i)=>(0,a.jsx)("input",{type:t,className:(0,l.cn)("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...s}));s.displayName="Input",e.s(["Input",()=>s])},165429,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(873273),s=t.forwardRef((e,t)=>(0,a.jsx)(l.Primitive.label,{...e,ref:t,onMouseDown:a=>{a.target.closest("button, input, select, textarea")||(e.onMouseDown?.(a),!a.defaultPrevented&&a.detail>1&&a.preventDefault())}}));s.displayName="Label";var i=e.i(541428);function r({className:e,...t}){return(0,a.jsx)(s,{"data-slot":"label",className:(0,i.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...t})}e.s(["Label",()=>r],165429)},600547,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(541428);let s=t.forwardRef(({className:e,...t},s)=>(0,a.jsx)("textarea",{className:(0,l.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:s,...t}));s.displayName="Textarea",e.s(["Textarea",()=>s])},295426,e=>{"use strict";let a=(0,e.i(930702).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>a])},519647,e=>{"use strict";var a=e.i(295426);e.s(["ArrowLeft",()=>a.default])},813046,e=>{"use strict";let a=(0,e.i(930702).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["default",()=>a])},553082,e=>{"use strict";var a=e.i(813046);e.s(["Save",()=>a.default])},67087,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(541428);let s=t.forwardRef(({className:e,orientation:t="horizontal",decorative:s=!0,...i},r)=>(0,a.jsx)("div",{ref:r,role:s?"none":"separator","aria-orientation":s?void 0:t,className:(0,l.cn)("shrink-0 bg-gray-200","horizontal"===t?"h-[1px] w-full":"h-full w-[1px]",e),...i}));s.displayName="Separator",e.s(["Separator",()=>s])},790168,e=>{"use strict";var a=e.i(44990),t=e.i(130775),l=e.i(245421),s=e.i(775680),i=e.i(885205),r=e.i(696134),n=e.i(165429),d=e.i(600547),c=e.i(519647),u=e.i(553082),o=e.i(198513),m=e.i(606443),h=e.i(888540),p=e.i(403055),g=e.i(4993),x=e.i(183194),y=e.i(67087);function N(){let e=(0,t.useParams)(),N=(0,t.useRouter)(),{toast:f}=(0,g.useToast)(),j=e?.id||"",{data:v,loading:b,error:C}=(0,l.useFindUnique)("Course",{id:j},{include:{instructor:{select:{id:!0,firstName:!0,lastName:!0,username:!0}},category:{select:{id:!0,name:!0}}}},{skip:!j||""===j}),{data:w}=(0,l.useFindMany)("CourseCategory",{select:{id:!0,name:!0},orderBy:{name:"asc"}}),{data:S}=(0,l.useFindMany)("User",{where:{roleType:"GIANGVIEN"},select:{id:!0,firstName:!0,lastName:!0,username:!0}}),[$,{loading:I}]=(0,l.useUpdateOne)("Course"),[k,T]=(0,p.useState)({title:"",slug:"",description:"",thumbnail:"",trailer:"",price:"0",level:"BEGINNER",status:"DRAFT",duration:"0",language:"vi",metaTitle:"",metaDescription:"",categoryId:"",instructorId:""}),[M,D]=(0,p.useState)([]),[q,E]=(0,p.useState)([]),[A,O]=(0,p.useState)([]),[F,L]=(0,p.useState)([]),[P,R]=(0,p.useState)(""),[U,B]=(0,p.useState)(""),[V,Q]=(0,p.useState)(""),[_,z]=(0,p.useState)("");(0,p.useEffect)(()=>{v&&(T({title:v.title||"",slug:v.slug||"",description:v.description||"",thumbnail:v.thumbnail||"",trailer:v.trailer||"",price:v.price?.toString()||"0",level:v.level||"BEGINNER",status:v.status||"DRAFT",duration:v.duration?.toString()||"0",language:v.language||"vi",metaTitle:v.metaTitle||"",metaDescription:v.metaDescription||"",categoryId:v.category?.id||"",instructorId:v.instructor?.id||""}),D(v.whatYouWillLearn||[]),E(v.requirements||[]),O(v.targetAudience||[]),L(v.tags||[]))},[v]);let G=(e,a)=>{T(t=>({...t,[e]:a}))},H=e=>e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),J=e=>{"learn"===e&&P.trim()?(D([...M,P.trim()]),R("")):"requirement"===e&&U.trim()?(E([...q,U.trim()]),B("")):"audience"===e&&V.trim()?(O([...A,V.trim()]),Q("")):"tag"===e&&_.trim()&&(L([...F,_.trim()]),z(""))},Y=(e,a)=>{"learn"===e?D(M.filter((e,t)=>t!==a)):"requirement"===e?E(q.filter((e,t)=>t!==a)):"audience"===e?O(A.filter((e,t)=>t!==a)):"tag"===e&&L(F.filter((e,t)=>t!==a))},K=async e=>{e.preventDefault();try{await $({where:{id:j},data:{title:k.title,slug:k.slug,description:k.description||null,thumbnail:k.thumbnail||null,trailer:k.trailer||null,price:parseFloat(k.price)||0,level:k.level,status:k.status,duration:parseInt(k.duration)||0,language:k.language,metaTitle:k.metaTitle||null,metaDescription:k.metaDescription||null,whatYouWillLearn:M,requirements:q,targetAudience:A,tags:F,categoryId:k.categoryId||null,instructorId:k.instructorId}}),f({title:"Thành công",description:"Đã cập nhật khóa học",type:"success"}),N.push(`/lms/admin/courses/${j}`)}catch(e){f({title:"Lỗi",description:e.message||"Không thể cập nhật khóa học",type:"error"})}},X=()=>{N.push(`/lms/admin/courses/${j}`)};return b?(0,a.jsx)("div",{className:"p-4 sm:p-6 lg:p-8",children:(0,a.jsxs)("div",{className:"text-center py-12",children:[(0,a.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}),(0,a.jsx)("p",{className:"text-gray-500 mt-4",children:"Đang tải..."})]})}):C||!v?(0,a.jsx)("div",{className:"p-4 sm:p-6 lg:p-8",children:(0,a.jsx)(s.Card,{children:(0,a.jsxs)(s.CardContent,{className:"py-12 text-center",children:[(0,a.jsx)(o.AlertCircle,{className:"w-12 h-12 text-red-500 mx-auto mb-4"}),(0,a.jsx)("p",{className:"text-red-600",children:C?.message||"Không tìm thấy khóa học"}),(0,a.jsx)(i.Button,{onClick:()=>N.push("/lms/admin/courses"),className:"mt-4",children:"Quay lại"})]})})}):(0,a.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 space-y-6",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsx)(i.Button,{variant:"outline",size:"icon",onClick:X,children:(0,a.jsx)(c.ArrowLeft,{className:"w-4 h-4"})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:"Chỉnh sửa khóa học"}),(0,a.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:v.title})]})]}),(0,a.jsxs)("form",{onSubmit:K,className:"space-y-6",children:[(0,a.jsxs)(s.Card,{children:[(0,a.jsxs)(s.CardHeader,{children:[(0,a.jsx)(s.CardTitle,{children:"Thông tin cơ bản"}),(0,a.jsx)(s.CardDescription,{children:"Cập nhật thông tin khóa học"})]}),(0,a.jsxs)(s.CardContent,{className:"space-y-4",children:[(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"title",children:"Tiêu đề *"}),(0,a.jsx)(r.Input,{id:"title",value:k.title,onChange:e=>{var a;G("title",a=e.target.value),k.slug&&k.slug!==H(k.title)||G("slug",H(a))},required:!0})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"slug",children:"Slug *"}),(0,a.jsx)(r.Input,{id:"slug",value:k.slug,onChange:e=>G("slug",e.target.value),required:!0})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"description",children:"Mô tả"}),(0,a.jsx)(d.Textarea,{id:"description",value:k.description,onChange:e=>G("description",e.target.value),rows:5})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"thumbnail",children:"URL Thumbnail"}),(0,a.jsx)(r.Input,{id:"thumbnail",value:k.thumbnail,onChange:e=>G("thumbnail",e.target.value),placeholder:"https://..."})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"trailer",children:"URL Video giới thiệu"}),(0,a.jsx)(r.Input,{id:"trailer",value:k.trailer,onChange:e=>G("trailer",e.target.value),placeholder:"https://..."})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"price",children:"Giá (VND)"}),(0,a.jsx)(r.Input,{id:"price",type:"number",value:k.price,onChange:e=>G("price",e.target.value),min:"0"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"duration",children:"Thời lượng (phút)"}),(0,a.jsx)(r.Input,{id:"duration",type:"number",value:k.duration,onChange:e=>G("duration",e.target.value),min:"0"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"level",children:"Cấp độ"}),(0,a.jsxs)(x.Select,{value:k.level,onValueChange:e=>G("level",e),children:[(0,a.jsx)(x.SelectTrigger,{id:"level",children:(0,a.jsx)(x.SelectValue,{})}),(0,a.jsxs)(x.SelectContent,{children:[(0,a.jsx)(x.SelectItem,{value:"BEGINNER",children:"Cơ bản"}),(0,a.jsx)(x.SelectItem,{value:"INTERMEDIATE",children:"Trung cấp"}),(0,a.jsx)(x.SelectItem,{value:"ADVANCED",children:"Nâng cao"}),(0,a.jsx)(x.SelectItem,{value:"EXPERT",children:"Chuyên gia"})]})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"status",children:"Trạng thái"}),(0,a.jsxs)(x.Select,{value:k.status,onValueChange:e=>G("status",e),children:[(0,a.jsx)(x.SelectTrigger,{id:"status",children:(0,a.jsx)(x.SelectValue,{})}),(0,a.jsxs)(x.SelectContent,{children:[(0,a.jsx)(x.SelectItem,{value:"DRAFT",children:"Nháp"}),(0,a.jsx)(x.SelectItem,{value:"PUBLISHED",children:"Xuất bản"}),(0,a.jsx)(x.SelectItem,{value:"ARCHIVED",children:"Lưu trữ"})]})]})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"language",children:"Ngôn ngữ"}),(0,a.jsxs)(x.Select,{value:k.language,onValueChange:e=>G("language",e),children:[(0,a.jsx)(x.SelectTrigger,{id:"language",children:(0,a.jsx)(x.SelectValue,{})}),(0,a.jsxs)(x.SelectContent,{children:[(0,a.jsx)(x.SelectItem,{value:"vi",children:"Tiếng Việt"}),(0,a.jsx)(x.SelectItem,{value:"en",children:"English"}),(0,a.jsx)(x.SelectItem,{value:"ja",children:"日本語"})]})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"categoryId",children:"Danh mục"}),(0,a.jsxs)(x.Select,{value:k.categoryId||void 0,onValueChange:e=>G("categoryId",e),children:[(0,a.jsx)(x.SelectTrigger,{id:"categoryId",children:(0,a.jsx)(x.SelectValue,{placeholder:"Chọn danh mục"})}),(0,a.jsx)(x.SelectContent,{children:w?.map(e=>(0,a.jsx)(x.SelectItem,{value:e.id,children:e.name},e.id))})]})]})]})]})]}),(0,a.jsxs)(s.Card,{children:[(0,a.jsx)(s.CardHeader,{children:(0,a.jsx)(s.CardTitle,{children:"Nội dung học tập"})}),(0,a.jsxs)(s.CardContent,{className:"space-y-6",children:[(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsx)(n.Label,{children:"Bạn sẽ học được gì"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(r.Input,{value:P,onChange:e=>R(e.target.value),placeholder:"Nhập mục tiêu học tập...",onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),J("learn"))}),(0,a.jsx)(i.Button,{type:"button",onClick:()=>J("learn"),size:"icon",children:(0,a.jsx)(m.Plus,{className:"w-4 h-4"})})]}),M.length>0&&(0,a.jsx)("ul",{className:"space-y-2",children:M.map((e,t)=>(0,a.jsxs)("li",{className:"flex items-center gap-2 p-2 bg-gray-50 rounded",children:[(0,a.jsx)("span",{className:"flex-1",children:e}),(0,a.jsx)(i.Button,{type:"button",variant:"ghost",size:"icon",onClick:()=>Y("learn",t),children:(0,a.jsx)(h.X,{className:"w-4 h-4"})})]},t))})]}),(0,a.jsx)(y.Separator,{}),(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsx)(n.Label,{children:"Yêu cầu"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(r.Input,{value:U,onChange:e=>B(e.target.value),placeholder:"Nhập yêu cầu...",onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),J("requirement"))}),(0,a.jsx)(i.Button,{type:"button",onClick:()=>J("requirement"),size:"icon",children:(0,a.jsx)(m.Plus,{className:"w-4 h-4"})})]}),q.length>0&&(0,a.jsx)("ul",{className:"space-y-2",children:q.map((e,t)=>(0,a.jsxs)("li",{className:"flex items-center gap-2 p-2 bg-gray-50 rounded",children:[(0,a.jsx)("span",{className:"flex-1",children:e}),(0,a.jsx)(i.Button,{type:"button",variant:"ghost",size:"icon",onClick:()=>Y("requirement",t),children:(0,a.jsx)(h.X,{className:"w-4 h-4"})})]},t))})]}),(0,a.jsx)(y.Separator,{}),(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsx)(n.Label,{children:"Đối tượng học viên"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(r.Input,{value:V,onChange:e=>Q(e.target.value),placeholder:"Nhập đối tượng học viên...",onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),J("audience"))}),(0,a.jsx)(i.Button,{type:"button",onClick:()=>J("audience"),size:"icon",children:(0,a.jsx)(m.Plus,{className:"w-4 h-4"})})]}),A.length>0&&(0,a.jsx)("ul",{className:"space-y-2",children:A.map((e,t)=>(0,a.jsxs)("li",{className:"flex items-center gap-2 p-2 bg-gray-50 rounded",children:[(0,a.jsx)("span",{className:"flex-1",children:e}),(0,a.jsx)(i.Button,{type:"button",variant:"ghost",size:"icon",onClick:()=>Y("audience",t),children:(0,a.jsx)(h.X,{className:"w-4 h-4"})})]},t))})]})]})]}),(0,a.jsxs)(s.Card,{children:[(0,a.jsx)(s.CardHeader,{children:(0,a.jsx)(s.CardTitle,{children:"SEO & Marketing"})}),(0,a.jsxs)(s.CardContent,{className:"space-y-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"metaTitle",children:"Meta Title"}),(0,a.jsx)(r.Input,{id:"metaTitle",value:k.metaTitle,onChange:e=>G("metaTitle",e.target.value),maxLength:60}),(0,a.jsxs)("p",{className:"text-xs text-gray-500",children:[k.metaTitle.length,"/60 ký tự"]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"metaDescription",children:"Meta Description"}),(0,a.jsx)(d.Textarea,{id:"metaDescription",value:k.metaDescription,onChange:e=>G("metaDescription",e.target.value),maxLength:160,rows:3}),(0,a.jsxs)("p",{className:"text-xs text-gray-500",children:[k.metaDescription.length,"/160 ký tự"]})]}),(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsx)(n.Label,{children:"Tags"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(r.Input,{value:_,onChange:e=>z(e.target.value),placeholder:"Nhập tag...",onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),J("tag"))}),(0,a.jsx)(i.Button,{type:"button",onClick:()=>J("tag"),size:"icon",children:(0,a.jsx)(m.Plus,{className:"w-4 h-4"})})]}),F.length>0&&(0,a.jsx)("div",{className:"flex flex-wrap gap-2",children:F.map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm",children:[(0,a.jsx)("span",{children:e}),(0,a.jsx)("button",{type:"button",onClick:()=>Y("tag",t),className:"hover:text-blue-900",children:(0,a.jsx)(h.X,{className:"w-3 h-3"})})]},t))})]})]})]}),(0,a.jsxs)("div",{className:"flex gap-3 justify-end",children:[(0,a.jsx)(i.Button,{type:"button",variant:"outline",onClick:X,children:"Hủy"}),(0,a.jsxs)(i.Button,{type:"submit",disabled:I,className:"gap-2",children:[(0,a.jsx)(u.Save,{className:"w-4 h-4"}),I?"Đang lưu...":"Lưu thay đổi"]})]})]})]})}e.s(["default",()=>N])}]);