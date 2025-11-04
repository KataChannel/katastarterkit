(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,994315,e=>{"use strict";let a=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>a])},606443,e=>{"use strict";var a=e.i(994315);e.s(["Plus",()=>a.default])},245421,272901,e=>{"use strict";e.i(308140);var a=e.i(429105),t=e.i(950988),l=e.i(529590),i=e.i(403055),s=e.i(984804);let r=s.gql`
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
`,c=s.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,u=s.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,o=s.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,h=s.gql`
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
`,m=s.gql`
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
`,x=s.gql`
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
`,y=s.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,f=s.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,v=s.gql`
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
`,j=s.gql`
  mutation ClearCache {
    clearCache
  }
`;function b(e,t,l){let i=!!localStorage.getItem("accessToken"),s=l?.skip||l?.requireAuth!==!1&&!i,{data:n,loading:d,error:c,refetch:u}=(0,a.useQuery)(r,{variables:{modelName:e,input:t||{}},skip:s,fetchPolicy:l?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:c,refetch:u}}function C(e,t,l,i){let s=!!localStorage.getItem("accessToken"),r="string"==typeof t?t:t?.id;r||i?.skip;let d=i?.skip||!r||i?.requireAuth!==!1&&!s,{data:c,loading:u,error:o,refetch:h}=(0,a.useQuery)(n,{variables:{modelName:e,input:{id:r||"",select:l?.select,include:l?.include}},skip:d});return{data:c?.findById,loading:u,error:o,refetch:h}}function S(e,t,l){let[s,r]=(0,i.useState)(t?.page||1),[n,d]=(0,i.useState)(t?.limit||10),u=!!localStorage.getItem("accessToken"),o=l?.skip||l?.requireAuth!==!1&&!u,{data:h,loading:p,error:m,refetch:g}=(0,a.useQuery)(c,{variables:{modelName:e,input:{page:s,limit:n,where:t?.where,orderBy:t?.orderBy,select:t?.select,include:t?.include}},skip:o,fetchPolicy:"cache-and-network"}),x=h?.findManyPaginated,y=(0,i.useCallback)(e=>{r(e)},[]),f=(0,i.useCallback)(()=>{x?.meta.hasNextPage&&r(e=>e+1)},[x]),v=(0,i.useCallback)(()=>{x?.meta.hasPrevPage&&r(e=>e-1)},[x]),N=(0,i.useCallback)(e=>{d(e),r(1)},[]);return{data:x?.data,meta:x?.meta,loading:p,error:m,refetch:g,page:s,limit:n,goToPage:y,nextPage:f,prevPage:v,changeLimit:N}}function w(e,t,l){let{data:i,loading:s,error:r,refetch:n}=(0,a.useQuery)(u,{variables:{modelName:e,where:t},skip:l?.skip});return{count:i?.count,loading:s,error:r,refetch:n}}function k(e,a){let[l,{data:s,loading:r,error:n}]=(0,t.useMutation)(p,{refetchQueries:a?.refetchQueries});return[(0,i.useCallback)(async a=>{let t=await l({variables:{modelName:e,input:{data:a.data,select:a.select,include:a.include}}});return t.data?.createOne},[l,e]),{data:s?.createOne,loading:r,error:n}]}function I(e,a){let[l,{data:s,loading:r,error:n}]=(0,t.useMutation)(g,{refetchQueries:a?.refetchQueries});return[(0,i.useCallback)(async a=>{let t="string"==typeof a.where?a.where:a.where?.id;if(!t)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let i=await l({variables:{modelName:e,input:{id:t,data:a.data,select:a.select,include:a.include}}});return i.data?.updateOne},[l,e]),{data:s?.updateOne,loading:r,error:n}]}function $(e,a){let[l,{data:s,loading:r,error:n}]=(0,t.useMutation)(y,{refetchQueries:a?.refetchQueries});return[(0,i.useCallback)(async a=>{let t="string"==typeof a.where?a.where:a.where?.id;if(!t)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let i=await l({variables:{modelName:e,input:{id:t,select:a.select}}});return i.data?.deleteOne},[l,e]),{data:s?.deleteOne,loading:r,error:n}]}function M(e){let a=(0,l.useApolloClient)(),[s,d]=k(e),[c,o]=function(e,a){let[l,{data:s,loading:r,error:n}]=(0,t.useMutation)(m,{refetchQueries:void 0});return[(0,i.useCallback)(async a=>{let t=await l({variables:{model:e,...a}});return t.data?.createMany},[l,e]),{data:s?.createMany,loading:r,error:n}]}(e),[h,p]=I(e),[g,y]=function(e,a){let[l,{data:s,loading:r,error:n}]=(0,t.useMutation)(x,{refetchQueries:void 0});return[(0,i.useCallback)(async a=>{let t=await l({variables:{model:e,...a}});return t.data?.updateMany},[l,e]),{data:s?.updateMany,loading:r,error:n}]}(e),[N,j]=$(e),[b,C]=function(e,a){let[l,{data:s,loading:r,error:n}]=(0,t.useMutation)(f,{refetchQueries:void 0});return[(0,i.useCallback)(async a=>{let t=await l({variables:{model:e,where:a}});return t.data?.deleteMany},[l,e]),{data:s?.deleteMany,loading:r,error:n}]}(e),[S,w]=function(e,a){let[l,{data:s,loading:r,error:n}]=(0,t.useMutation)(v,{refetchQueries:void 0});return[(0,i.useCallback)(async a=>{let t=await l({variables:{model:e,...a}});return t.data?.upsert},[l,e]),{data:s?.upsert,loading:r,error:n}]}(e),M=(0,i.useCallback)(async t=>(await a.query({query:r,variables:{model:e,...t},fetchPolicy:"network-only"})).data.findMany,[a,e]);return{findMany:M,findUnique:(0,i.useCallback)(async(t,l)=>(await a.query({query:n,variables:{model:e,where:t,...l},fetchPolicy:"network-only"})).data.findUnique,[a,e]),count:(0,i.useCallback)(async t=>(await a.query({query:u,variables:{model:e,where:t},fetchPolicy:"network-only"})).data.count,[a,e]),createOne:s,createMany:c,updateOne:h,updateMany:g,deleteOne:N,deleteMany:b,upsert:S,states:{createOne:d,createMany:o,updateOne:p,updateMany:y,deleteOne:j,deleteMany:C,upsert:w},loading:d.loading||o.loading||p.loading||y.loading||j.loading||C.loading||w.loading}}e.s(["AGGREGATE",0,o,"CLEAR_CACHE",0,j,"COUNT",0,u,"CREATE_MANY",0,m,"CREATE_ONE",0,p,"DELETE_MANY",0,f,"DELETE_ONE",0,y,"FIND_FIRST",0,d,"FIND_MANY",0,r,"FIND_MANY_PAGINATED",0,c,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,N,"GROUP_BY",0,h,"UPDATE_MANY",0,x,"UPDATE_ONE",0,g,"UPSERT",0,v],272901),e.s(["useCRUD",()=>M,"useCount",()=>w,"useCreateOne",()=>k,"useDeleteOne",()=>$,"useFindMany",()=>b,"useFindManyPaginated",()=>S,"useFindUnique",()=>C,"useUpdateOne",()=>I],245421)},775680,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(541428);let i=t.forwardRef(({className:e,...t},i)=>(0,a.jsx)("div",{ref:i,className:(0,l.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...t}));i.displayName="Card";let s=t.forwardRef(({className:e,...t},i)=>(0,a.jsx)("div",{ref:i,className:(0,l.cn)("flex flex-col space-y-1.5 p-6",e),...t}));s.displayName="CardHeader";let r=t.forwardRef(({className:e,...t},i)=>(0,a.jsx)("h3",{ref:i,className:(0,l.cn)("text-2xl font-semibold leading-none tracking-tight",e),...t}));r.displayName="CardTitle";let n=t.forwardRef(({className:e,...t},i)=>(0,a.jsx)("p",{ref:i,className:(0,l.cn)("text-sm text-muted-foreground",e),...t}));n.displayName="CardDescription";let d=t.forwardRef(({className:e,...t},i)=>(0,a.jsx)("div",{ref:i,className:(0,l.cn)("p-6 pt-0",e),...t}));d.displayName="CardContent";let c=t.forwardRef(({className:e,...t},i)=>(0,a.jsx)("div",{ref:i,className:(0,l.cn)("flex items-center p-6 pt-0",e),...t}));c.displayName="CardFooter",e.s(["Card",()=>i,"CardContent",()=>d,"CardDescription",()=>n,"CardFooter",()=>c,"CardHeader",()=>s,"CardTitle",()=>r])},696134,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(541428);let i=t.forwardRef(({className:e,type:t,...i},s)=>(0,a.jsx)("input",{type:t,className:(0,l.cn)("flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:s,...i}));i.displayName="Input",e.s(["Input",()=>i])},165429,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(873273),i=t.forwardRef((e,t)=>(0,a.jsx)(l.Primitive.label,{...e,ref:t,onMouseDown:a=>{a.target.closest("button, input, select, textarea")||(e.onMouseDown?.(a),!a.defaultPrevented&&a.detail>1&&a.preventDefault())}}));i.displayName="Label";var s=e.i(541428);function r({className:e,...t}){return(0,a.jsx)(i,{"data-slot":"label",className:(0,s.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...t})}e.s(["Label",()=>r],165429)},600547,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(541428);let i=t.forwardRef(({className:e,...t},i)=>(0,a.jsx)("textarea",{className:(0,l.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...t}));i.displayName="Textarea",e.s(["Textarea",()=>i])},295426,e=>{"use strict";let a=(0,e.i(930702).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>a])},519647,e=>{"use strict";var a=e.i(295426);e.s(["ArrowLeft",()=>a.default])},813046,e=>{"use strict";let a=(0,e.i(930702).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["default",()=>a])},553082,e=>{"use strict";var a=e.i(813046);e.s(["Save",()=>a.default])},67087,e=>{"use strict";var a=e.i(44990),t=e.i(403055),l=e.i(541428);let i=t.forwardRef(({className:e,orientation:t="horizontal",decorative:i=!0,...s},r)=>(0,a.jsx)("div",{ref:r,role:i?"none":"separator","aria-orientation":i?void 0:t,className:(0,l.cn)("shrink-0 bg-gray-200","horizontal"===t?"h-[1px] w-full":"h-full w-[1px]",e),...s}));i.displayName="Separator",e.s(["Separator",()=>i])},271739,e=>{"use strict";let a=(0,e.i(930702).default)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]);e.s(["default",()=>a])},450071,e=>{"use strict";var a=e.i(271739);e.s(["Sparkles",()=>a.default])},998361,e=>{"use strict";var a=e.i(44990),t=e.i(130775),l=e.i(245421),i=e.i(775680),s=e.i(885205),r=e.i(696134),n=e.i(165429),d=e.i(600547),c=e.i(519647),u=e.i(553082),o=e.i(606443),h=e.i(888540),p=e.i(450071),m=e.i(403055),g=e.i(4993),x=e.i(183194),y=e.i(67087);function f(){let e=(0,t.useRouter)(),{toast:f}=(0,g.useToast)(),{data:v}=(0,l.useFindMany)("CourseCategory",{select:{id:!0,name:!0},orderBy:{name:"asc"}}),{data:N}=(0,l.useFindMany)("User",{where:{roleType:"GIANGVIEN"},select:{id:!0,firstName:!0,lastName:!0,username:!0}}),[j,{loading:b}]=(0,l.useCreateOne)("Course"),[C,S]=(0,m.useState)({title:"",slug:"",description:"",thumbnail:"",trailer:"",price:"0",level:"BEGINNER",status:"DRAFT",duration:"0",language:"vi",metaTitle:"",metaDescription:"",categoryId:"",instructorId:""}),[w,k]=(0,m.useState)([]),[I,$]=(0,m.useState)([]),[M,T]=(0,m.useState)([]),[D,q]=(0,m.useState)([]),[E,O]=(0,m.useState)(""),[A,F]=(0,m.useState)(""),[L,P]=(0,m.useState)(""),[R,U]=(0,m.useState)(""),B=(e,a)=>{S(t=>({...t,[e]:a}))},V=e=>e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),z=e=>{"learn"===e&&E.trim()?(k([...w,E.trim()]),O("")):"requirement"===e&&A.trim()?($([...I,A.trim()]),F("")):"audience"===e&&L.trim()?(T([...M,L.trim()]),P("")):"tag"===e&&R.trim()&&(q([...D,R.trim()]),U(""))},Q=(e,a)=>{"learn"===e?k(w.filter((e,t)=>t!==a)):"requirement"===e?$(I.filter((e,t)=>t!==a)):"audience"===e?T(M.filter((e,t)=>t!==a)):"tag"===e&&q(D.filter((e,t)=>t!==a))},_=async a=>{if(a.preventDefault(),!C.instructorId)return void f({title:"Lỗi",description:"Vui lòng chọn giảng viên",type:"error"});try{await j({data:{title:C.title,slug:C.slug,description:C.description||null,thumbnail:C.thumbnail||null,trailer:C.trailer||null,price:parseFloat(C.price)||0,level:C.level,status:C.status,duration:parseInt(C.duration)||0,language:C.language,metaTitle:C.metaTitle||null,metaDescription:C.metaDescription||null,whatYouWillLearn:w,requirements:I,targetAudience:M,tags:D,categoryId:C.categoryId||null,instructorId:C.instructorId}}),f({title:"Thành công",description:"Đã tạo khóa học mới",type:"success"}),e.push("/lms/admin/courses")}catch(e){f({title:"Lỗi",description:e.message||"Không thể tạo khóa học",type:"error"})}},G=()=>{e.push("/lms/admin/courses")};return(0,a.jsxs)("div",{className:"p-4 sm:p-6 lg:p-8 space-y-6",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsx)(s.Button,{variant:"outline",size:"icon",onClick:G,children:(0,a.jsx)(c.ArrowLeft,{className:"w-4 h-4"})}),(0,a.jsxs)("div",{className:"flex-1",children:[(0,a.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:"Tạo khóa học mới"}),(0,a.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:"Nhập thông tin khóa học"})]}),(0,a.jsxs)(s.Button,{variant:"outline",onClick:()=>e.push("/lms/admin/courses/create-with-ai"),className:"gap-2 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-200",children:[(0,a.jsx)(p.Sparkles,{className:"w-4 h-4 text-purple-600"}),(0,a.jsx)("span",{className:"hidden sm:inline",children:"Tạo Với AI"})]})]}),(0,a.jsxs)("form",{onSubmit:_,className:"space-y-6",children:[(0,a.jsxs)(i.Card,{children:[(0,a.jsxs)(i.CardHeader,{children:[(0,a.jsx)(i.CardTitle,{children:"Thông tin cơ bản"}),(0,a.jsx)(i.CardDescription,{children:"Nhập thông tin cơ bản của khóa học"})]}),(0,a.jsxs)(i.CardContent,{className:"space-y-4",children:[(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"title",children:"Tiêu đề *"}),(0,a.jsx)(r.Input,{id:"title",value:C.title,onChange:e=>{var a;B("title",a=e.target.value),C.slug&&C.slug!==V(C.title)||B("slug",V(a))},placeholder:"Nhập tiêu đề khóa học",required:!0})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"slug",children:"Slug *"}),(0,a.jsx)(r.Input,{id:"slug",value:C.slug,onChange:e=>B("slug",e.target.value),placeholder:"khoa-hoc-slug",required:!0})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"description",children:"Mô tả"}),(0,a.jsx)(d.Textarea,{id:"description",value:C.description,onChange:e=>B("description",e.target.value),placeholder:"Mô tả về khóa học...",rows:5})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"thumbnail",children:"URL Thumbnail"}),(0,a.jsx)(r.Input,{id:"thumbnail",value:C.thumbnail,onChange:e=>B("thumbnail",e.target.value),placeholder:"https://example.com/image.jpg"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"trailer",children:"URL Video giới thiệu"}),(0,a.jsx)(r.Input,{id:"trailer",value:C.trailer,onChange:e=>B("trailer",e.target.value),placeholder:"https://youtube.com/..."})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"price",children:"Giá (VND)"}),(0,a.jsx)(r.Input,{id:"price",type:"number",value:C.price,onChange:e=>B("price",e.target.value),min:"0",placeholder:"0"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"duration",children:"Thời lượng (phút)"}),(0,a.jsx)(r.Input,{id:"duration",type:"number",value:C.duration,onChange:e=>B("duration",e.target.value),min:"0",placeholder:"0"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"level",children:"Cấp độ *"}),(0,a.jsxs)(x.Select,{value:C.level,onValueChange:e=>B("level",e),children:[(0,a.jsx)(x.SelectTrigger,{id:"level",children:(0,a.jsx)(x.SelectValue,{})}),(0,a.jsxs)(x.SelectContent,{children:[(0,a.jsx)(x.SelectItem,{value:"BEGINNER",children:"Cơ bản"}),(0,a.jsx)(x.SelectItem,{value:"INTERMEDIATE",children:"Trung cấp"}),(0,a.jsx)(x.SelectItem,{value:"ADVANCED",children:"Nâng cao"}),(0,a.jsx)(x.SelectItem,{value:"EXPERT",children:"Chuyên gia"})]})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"status",children:"Trạng thái *"}),(0,a.jsxs)(x.Select,{value:C.status,onValueChange:e=>B("status",e),children:[(0,a.jsx)(x.SelectTrigger,{id:"status",children:(0,a.jsx)(x.SelectValue,{})}),(0,a.jsxs)(x.SelectContent,{children:[(0,a.jsx)(x.SelectItem,{value:"DRAFT",children:"Nháp"}),(0,a.jsx)(x.SelectItem,{value:"PUBLISHED",children:"Xuất bản"}),(0,a.jsx)(x.SelectItem,{value:"ARCHIVED",children:"Lưu trữ"})]})]})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"language",children:"Ngôn ngữ"}),(0,a.jsxs)(x.Select,{value:C.language,onValueChange:e=>B("language",e),children:[(0,a.jsx)(x.SelectTrigger,{id:"language",children:(0,a.jsx)(x.SelectValue,{})}),(0,a.jsxs)(x.SelectContent,{children:[(0,a.jsx)(x.SelectItem,{value:"vi",children:"Tiếng Việt"}),(0,a.jsx)(x.SelectItem,{value:"en",children:"English"}),(0,a.jsx)(x.SelectItem,{value:"ja",children:"日本語"})]})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"categoryId",children:"Danh mục"}),(0,a.jsxs)(x.Select,{value:C.categoryId||void 0,onValueChange:e=>B("categoryId",e),children:[(0,a.jsx)(x.SelectTrigger,{id:"categoryId",children:(0,a.jsx)(x.SelectValue,{placeholder:"Chọn danh mục"})}),(0,a.jsx)(x.SelectContent,{children:v?.map(e=>(0,a.jsx)(x.SelectItem,{value:e.id,children:e.name},e.id))})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"instructorId",children:"Giảng viên *"}),(0,a.jsxs)(x.Select,{value:C.instructorId,onValueChange:e=>B("instructorId",e),children:[(0,a.jsx)(x.SelectTrigger,{id:"instructorId",children:(0,a.jsx)(x.SelectValue,{placeholder:"Chọn giảng viên"})}),(0,a.jsx)(x.SelectContent,{children:N?.map(e=>(0,a.jsx)(x.SelectItem,{value:e.id,children:e.firstName&&e.lastName?`${e.firstName} ${e.lastName}`:e.username},e.id))})]})]})]})]})]}),(0,a.jsxs)(i.Card,{children:[(0,a.jsxs)(i.CardHeader,{children:[(0,a.jsx)(i.CardTitle,{children:"Nội dung học tập"}),(0,a.jsx)(i.CardDescription,{children:"Mục tiêu và yêu cầu của khóa học"})]}),(0,a.jsxs)(i.CardContent,{className:"space-y-6",children:[(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsx)(n.Label,{children:"Bạn sẽ học được gì"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(r.Input,{value:E,onChange:e=>O(e.target.value),placeholder:"Nhập mục tiêu học tập...",onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),z("learn"))}),(0,a.jsx)(s.Button,{type:"button",onClick:()=>z("learn"),size:"icon",children:(0,a.jsx)(o.Plus,{className:"w-4 h-4"})})]}),w.length>0&&(0,a.jsx)("ul",{className:"space-y-2",children:w.map((e,t)=>(0,a.jsxs)("li",{className:"flex items-center gap-2 p-2 bg-gray-50 rounded",children:[(0,a.jsx)("span",{className:"flex-1",children:e}),(0,a.jsx)(s.Button,{type:"button",variant:"ghost",size:"icon",onClick:()=>Q("learn",t),children:(0,a.jsx)(h.X,{className:"w-4 h-4"})})]},t))})]}),(0,a.jsx)(y.Separator,{}),(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsx)(n.Label,{children:"Yêu cầu"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(r.Input,{value:A,onChange:e=>F(e.target.value),placeholder:"Nhập yêu cầu...",onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),z("requirement"))}),(0,a.jsx)(s.Button,{type:"button",onClick:()=>z("requirement"),size:"icon",children:(0,a.jsx)(o.Plus,{className:"w-4 h-4"})})]}),I.length>0&&(0,a.jsx)("ul",{className:"space-y-2",children:I.map((e,t)=>(0,a.jsxs)("li",{className:"flex items-center gap-2 p-2 bg-gray-50 rounded",children:[(0,a.jsx)("span",{className:"flex-1",children:e}),(0,a.jsx)(s.Button,{type:"button",variant:"ghost",size:"icon",onClick:()=>Q("requirement",t),children:(0,a.jsx)(h.X,{className:"w-4 h-4"})})]},t))})]}),(0,a.jsx)(y.Separator,{}),(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsx)(n.Label,{children:"Đối tượng học viên"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(r.Input,{value:L,onChange:e=>P(e.target.value),placeholder:"Nhập đối tượng học viên...",onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),z("audience"))}),(0,a.jsx)(s.Button,{type:"button",onClick:()=>z("audience"),size:"icon",children:(0,a.jsx)(o.Plus,{className:"w-4 h-4"})})]}),M.length>0&&(0,a.jsx)("ul",{className:"space-y-2",children:M.map((e,t)=>(0,a.jsxs)("li",{className:"flex items-center gap-2 p-2 bg-gray-50 rounded",children:[(0,a.jsx)("span",{className:"flex-1",children:e}),(0,a.jsx)(s.Button,{type:"button",variant:"ghost",size:"icon",onClick:()=>Q("audience",t),children:(0,a.jsx)(h.X,{className:"w-4 h-4"})})]},t))})]})]})]}),(0,a.jsxs)(i.Card,{children:[(0,a.jsxs)(i.CardHeader,{children:[(0,a.jsx)(i.CardTitle,{children:"SEO & Marketing"}),(0,a.jsx)(i.CardDescription,{children:"Tối ưu hóa công cụ tìm kiếm"})]}),(0,a.jsxs)(i.CardContent,{className:"space-y-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"metaTitle",children:"Meta Title"}),(0,a.jsx)(r.Input,{id:"metaTitle",value:C.metaTitle,onChange:e=>B("metaTitle",e.target.value),maxLength:60,placeholder:"Tiêu đề SEO (tối đa 60 ký tự)"}),(0,a.jsxs)("p",{className:"text-xs text-gray-500",children:[C.metaTitle.length,"/60 ký tự"]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(n.Label,{htmlFor:"metaDescription",children:"Meta Description"}),(0,a.jsx)(d.Textarea,{id:"metaDescription",value:C.metaDescription,onChange:e=>B("metaDescription",e.target.value),maxLength:160,rows:3,placeholder:"Mô tả SEO (tối đa 160 ký tự)"}),(0,a.jsxs)("p",{className:"text-xs text-gray-500",children:[C.metaDescription.length,"/160 ký tự"]})]}),(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsx)(n.Label,{children:"Tags"}),(0,a.jsxs)("div",{className:"flex gap-2",children:[(0,a.jsx)(r.Input,{value:R,onChange:e=>U(e.target.value),placeholder:"Nhập tag...",onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),z("tag"))}),(0,a.jsx)(s.Button,{type:"button",onClick:()=>z("tag"),size:"icon",children:(0,a.jsx)(o.Plus,{className:"w-4 h-4"})})]}),D.length>0&&(0,a.jsx)("div",{className:"flex flex-wrap gap-2",children:D.map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm",children:[(0,a.jsx)("span",{children:e}),(0,a.jsx)("button",{type:"button",onClick:()=>Q("tag",t),className:"hover:text-blue-900",children:(0,a.jsx)(h.X,{className:"w-3 h-3"})})]},t))})]})]})]}),(0,a.jsxs)("div",{className:"flex gap-3 justify-end",children:[(0,a.jsx)(s.Button,{type:"button",variant:"outline",onClick:G,children:"Hủy"}),(0,a.jsxs)(s.Button,{type:"submit",disabled:b,className:"gap-2",children:[(0,a.jsx)(u.Save,{className:"w-4 h-4"}),b?"Đang tạo...":"Tạo khóa học"]})]})]})]})}e.s(["default",()=>f])}]);