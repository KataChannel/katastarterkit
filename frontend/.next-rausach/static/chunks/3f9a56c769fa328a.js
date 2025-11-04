(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,874061,e=>{"use strict";let t=(0,e.i(930702).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["default",()=>t])},138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},994315,e=>{"use strict";let t=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>t])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),r=e.i(529590),l=e.i(403055),s=e.i(984804);let i=s.gql`
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
`,c=s.gql`
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
`,h=s.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,p=s.gql`
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
`,x=s.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,y=s.gql`
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
`,g=s.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,b=s.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,f=s.gql`
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
`;function w(e,a,r){let l=!!localStorage.getItem("accessToken"),s=r?.skip||r?.requireAuth!==!1&&!l,{data:n,loading:d,error:o,refetch:u}=(0,t.useQuery)(i,{variables:{modelName:e,input:a||{}},skip:s,fetchPolicy:r?.fetchPolicy||"cache-and-network"});return{data:n?.findMany,loading:d,error:o,refetch:u}}function j(e,a,r,l){let s=!!localStorage.getItem("accessToken"),i="string"==typeof a?a:a?.id;i||l?.skip;let d=l?.skip||!i||l?.requireAuth!==!1&&!s,{data:o,loading:u,error:c,refetch:m}=(0,t.useQuery)(n,{variables:{modelName:e,input:{id:i||"",select:r?.select,include:r?.include}},skip:d});return{data:o?.findById,loading:u,error:c,refetch:m}}function k(e,a,r){let[s,i]=(0,l.useState)(a?.page||1),[n,d]=(0,l.useState)(a?.limit||10),u=!!localStorage.getItem("accessToken"),c=r?.skip||r?.requireAuth!==!1&&!u,{data:m,loading:h,error:p,refetch:x}=(0,t.useQuery)(o,{variables:{modelName:e,input:{page:s,limit:n,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:c,fetchPolicy:"cache-and-network"}),y=m?.findManyPaginated,g=(0,l.useCallback)(e=>{i(e)},[]),b=(0,l.useCallback)(()=>{y?.meta.hasNextPage&&i(e=>e+1)},[y]),f=(0,l.useCallback)(()=>{y?.meta.hasPrevPage&&i(e=>e-1)},[y]),N=(0,l.useCallback)(e=>{d(e),i(1)},[]);return{data:y?.data,meta:y?.meta,loading:h,error:p,refetch:x,page:s,limit:n,goToPage:g,nextPage:b,prevPage:f,changeLimit:N}}function $(e,a,r){let{data:l,loading:s,error:i,refetch:n}=(0,t.useQuery)(u,{variables:{modelName:e,where:a},skip:r?.skip});return{count:l?.count,loading:s,error:i,refetch:n}}function M(e,t){let[r,{data:s,loading:i,error:n}]=(0,a.useMutation)(h,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a=await r({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[r,e]),{data:s?.createOne,loading:i,error:n}]}function C(e,t){let[r,{data:s,loading:i,error:n}]=(0,a.useMutation)(x,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let l=await r({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return l.data?.updateOne},[r,e]),{data:s?.updateOne,loading:i,error:n}]}function O(e,t){let[r,{data:s,loading:i,error:n}]=(0,a.useMutation)(g,{refetchQueries:t?.refetchQueries});return[(0,l.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let l=await r({variables:{modelName:e,input:{id:a,select:t.select}}});return l.data?.deleteOne},[r,e]),{data:s?.deleteOne,loading:i,error:n}]}function q(e){let t=(0,r.useApolloClient)(),[s,d]=M(e),[o,c]=function(e,t){let[r,{data:s,loading:i,error:n}]=(0,a.useMutation)(p,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await r({variables:{model:e,...t}});return a.data?.createMany},[r,e]),{data:s?.createMany,loading:i,error:n}]}(e),[m,h]=C(e),[x,g]=function(e,t){let[r,{data:s,loading:i,error:n}]=(0,a.useMutation)(y,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await r({variables:{model:e,...t}});return a.data?.updateMany},[r,e]),{data:s?.updateMany,loading:i,error:n}]}(e),[N,v]=O(e),[w,j]=function(e,t){let[r,{data:s,loading:i,error:n}]=(0,a.useMutation)(b,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await r({variables:{model:e,where:t}});return a.data?.deleteMany},[r,e]),{data:s?.deleteMany,loading:i,error:n}]}(e),[k,$]=function(e,t){let[r,{data:s,loading:i,error:n}]=(0,a.useMutation)(f,{refetchQueries:void 0});return[(0,l.useCallback)(async t=>{let a=await r({variables:{model:e,...t}});return a.data?.upsert},[r,e]),{data:s?.upsert,loading:i,error:n}]}(e),q=(0,l.useCallback)(async a=>(await t.query({query:i,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:q,findUnique:(0,l.useCallback)(async(a,r)=>(await t.query({query:n,variables:{model:e,where:a,...r},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,l.useCallback)(async a=>(await t.query({query:u,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:s,createMany:o,updateOne:m,updateMany:x,deleteOne:N,deleteMany:w,upsert:k,states:{createOne:d,createMany:c,updateOne:h,updateMany:g,deleteOne:v,deleteMany:j,upsert:$},loading:d.loading||c.loading||h.loading||g.loading||v.loading||j.loading||$.loading}}e.s(["AGGREGATE",0,c,"CLEAR_CACHE",0,v,"COUNT",0,u,"CREATE_MANY",0,p,"CREATE_ONE",0,h,"DELETE_MANY",0,b,"DELETE_ONE",0,g,"FIND_FIRST",0,d,"FIND_MANY",0,i,"FIND_MANY_PAGINATED",0,o,"FIND_UNIQUE",0,n,"GET_AVAILABLE_MODELS",0,N,"GROUP_BY",0,m,"UPDATE_MANY",0,y,"UPDATE_ONE",0,x,"UPSERT",0,f],272901),e.s(["useCRUD",()=>q,"useCount",()=>$,"useCreateOne",()=>M,"useDeleteOne",()=>O,"useFindMany",()=>w,"useFindManyPaginated",()=>k,"useFindUnique",()=>j,"useUpdateOne",()=>C],245421)},295426,e=>{"use strict";let t=(0,e.i(930702).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>t])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},565977,e=>{"use strict";let t=(0,e.i(930702).default)("file-text",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["default",()=>t])},421329,e=>{"use strict";var t=e.i(565977);e.s(["FileText",()=>t.default])},816366,e=>{"use strict";let t=(0,e.i(930702).default)("circle-play",[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);e.s(["default",()=>t])},224949,e=>{"use strict";var t=e.i(816366);e.s(["PlayCircle",()=>t.default])},505722,e=>{"use strict";let t=(0,e.i(930702).default)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["default",()=>t])},317044,e=>{"use strict";var t=e.i(505722);e.s(["HelpCircle",()=>t.default])},960856,e=>{"use strict";let t=(0,e.i(930702).default)("pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);e.s(["default",()=>t])},64886,e=>{"use strict";var t=e.i(960856);e.s(["Edit2",()=>t.default])},138422,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(130775),l=e.i(579448),s=e.i(519647),i=e.i(606443),n=e.i(64886),d=e.i(138227),o=e.i(224949),u=e.i(421329),c=e.i(317044),m=e.i(245421);function h(){let e=(0,r.useParams)(),h=e?.id,[p,x]=(0,a.useState)(!1),[y,g]=(0,a.useState)(""),[b,f]=(0,a.useState)(null),[N,v]=(0,a.useState)({title:"",description:"",type:"VIDEO",content:"",videoUrl:"",duration:0,isFree:!1}),{data:w,refetch:j}=(0,m.useFindUnique)("course",h,{include:{modules:{include:{lessons:{orderBy:{order:"asc"}}},orderBy:{order:"asc"}}}}),[k,{loading:$}]=(0,m.useCreateOne)("lesson"),[M,{loading:C}]=(0,m.useUpdateOne)("lesson"),[O]=(0,m.useDeleteOne)("lesson"),q=w?.modules||[],T=()=>{v({title:"",description:"",type:"VIDEO",content:"",videoUrl:"",duration:0,isFree:!1}),g(""),f(null)},E=async e=>{e.preventDefault();let{videoUrl:t,...a}=N,r={...a,content:"VIDEO"===N.type?N.videoUrl:N.content};b?await M({where:{id:b.id},data:r}):await k({data:{moduleId:y,...r}}),x(!1),T(),j()},S=async e=>{confirm("Bạn có chắc muốn xóa bài học này?")&&(await O({where:{id:e}}),j())};return(0,t.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,t.jsx)("div",{className:"bg-white border-b sticky top-0 z-10",children:(0,t.jsx)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)(l.default,{href:"/lms/instructor/dashboard",className:"flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors",children:[(0,t.jsx)(s.ArrowLeft,{className:"w-5 h-5"}),(0,t.jsx)("span",{className:"font-medium",children:"Quay lại Dashboard"})]}),(0,t.jsx)(l.default,{href:`/lms/instructor/courses/${h}/manage`,className:"text-blue-600 hover:text-blue-700 font-medium",children:"Quản lý Module"})]})})}),(0,t.jsxs)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,t.jsxs)("div",{className:"mb-6",children:[(0,t.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"Quản Lý Bài Học"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Thêm video, text, hoặc quiz vào các module của khóa học"})]}),0===q.length?(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center",children:[(0,t.jsx)(u.FileText,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Chưa có Module"}),(0,t.jsx)("p",{className:"text-gray-600 mb-6",children:"Bạn cần tạo module trước khi thêm bài học"}),(0,t.jsx)(l.default,{href:`/lms/instructor/courses/${h}/manage`,className:"inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:"Tạo Module"})]}):(0,t.jsx)("div",{className:"space-y-6",children:q.map((e,a)=>(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",children:[(0,t.jsxs)("div",{className:"bg-gray-50 px-6 py-4 border-b border-gray-200",children:[(0,t.jsxs)("h3",{className:"text-lg font-semibold text-gray-900",children:[a+1,". ",e.title]}),e.description&&(0,t.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:e.description})]}),(0,t.jsxs)("div",{className:"p-6",children:[e.lessons&&e.lessons.length>0?(0,t.jsx)("div",{className:"space-y-3 mb-4",children:e.lessons.map((r,l)=>(0,t.jsxs)("div",{className:"flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all",children:[(0,t.jsxs)("div",{className:"flex items-start gap-3 flex-1",children:[(e=>{switch(e){case"VIDEO":return(0,t.jsx)(o.PlayCircle,{className:"w-5 h-5 text-blue-600"});case"TEXT":return(0,t.jsx)(u.FileText,{className:"w-5 h-5 text-green-600"});case"QUIZ":return(0,t.jsx)(c.HelpCircle,{className:"w-5 h-5 text-purple-600"});default:return(0,t.jsx)(u.FileText,{className:"w-5 h-5 text-gray-600"})}})(r.type),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsxs)("h4",{className:"font-medium text-gray-900",children:[a+1,".",l+1," ",r.title]}),r.isFree&&(0,t.jsx)("span",{className:"px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded",children:"Miễn phí"})]}),r.description&&(0,t.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:r.description}),(0,t.jsxs)("div",{className:"flex items-center gap-4 mt-2 text-xs text-gray-500",children:[(0,t.jsx)("span",{className:"flex items-center gap-1",children:(0,t.jsx)("span",{className:"font-medium",children:r.type})}),r.duration>0&&(0,t.jsxs)("span",{children:[r.duration," phút"]})]})]})]}),(0,t.jsxs)("div",{className:"flex gap-2 ml-4",children:[(0,t.jsx)("button",{onClick:()=>{var t;return t=e.id,void(f(r),g(t),v({title:r.title,description:r.description||"",type:r.type,content:"VIDEO"===r.type?"":r.content||"",videoUrl:"VIDEO"===r.type&&r.content||"",duration:r.duration||0,isFree:r.isFree||!1}),x(!0))},className:"p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors",children:(0,t.jsx)(n.Edit2,{className:"w-4 h-4"})}),(0,t.jsx)("button",{onClick:()=>S(r.id),className:"p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors",children:(0,t.jsx)(d.Trash2,{className:"w-4 h-4"})})]})]},r.id))}):(0,t.jsx)("p",{className:"text-gray-500 text-sm mb-4",children:"Chưa có bài học nào"}),(0,t.jsxs)("button",{onClick:()=>{g(e.id),x(!0)},className:"w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2",children:[(0,t.jsx)(i.Plus,{className:"w-5 h-5"}),"Thêm bài học vào module này"]})]})]},e.id))}),p&&(0,t.jsx)("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",children:(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",children:[(0,t.jsx)("div",{className:"p-6 border-b border-gray-200",children:(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:b?"Sửa Bài Học":"Thêm Bài Học Mới"})}),(0,t.jsxs)("form",{onSubmit:E,className:"p-6 space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Tiêu đề bài học *"}),(0,t.jsx)("input",{type:"text",value:N.title,onChange:e=>v({...N,title:e.target.value}),placeholder:"VD: Giới thiệu về React Hooks",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Mô tả (tùy chọn)"}),(0,t.jsx)("textarea",{value:N.description,onChange:e=>v({...N,description:e.target.value}),placeholder:"Mô tả ngắn về bài học...",rows:2,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Loại bài học *"}),(0,t.jsxs)("select",{value:N.type,onChange:e=>v({...N,type:e.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",children:[(0,t.jsx)("option",{value:"VIDEO",children:"Video"}),(0,t.jsx)("option",{value:"TEXT",children:"Text/Tài liệu"}),(0,t.jsx)("option",{value:"QUIZ",children:"Quiz/Bài kiểm tra"})]})]}),"VIDEO"===N.type&&(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Video URL *"}),(0,t.jsx)("input",{type:"url",value:N.videoUrl,onChange:e=>v({...N,videoUrl:e.target.value}),placeholder:"https://youtube.com/watch?v=...",required:"VIDEO"===N.type,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Hỗ trợ YouTube, Vimeo, hoặc link video trực tiếp"})]}),"TEXT"===N.type&&(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Nội dung *"}),(0,t.jsx)("textarea",{value:N.content,onChange:e=>v({...N,content:e.target.value}),placeholder:"Nhập nội dung bài học...",rows:8,required:"TEXT"===N.type,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"})]}),"QUIZ"===N.type&&(0,t.jsx)("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg p-4",children:(0,t.jsxs)("p",{className:"text-sm text-yellow-800",children:[(0,t.jsx)("strong",{children:"Lưu ý:"})," Sau khi tạo bài học loại Quiz, bạn cần vào trang quản lý Quiz để thêm câu hỏi."]})}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Thời lượng (phút)"}),(0,t.jsx)("input",{type:"number",value:N.duration,onChange:e=>v({...N,duration:parseInt(e.target.value)||0}),min:"0",className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"})]}),(0,t.jsx)("div",{className:"flex items-center",children:(0,t.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer",children:[(0,t.jsx)("input",{type:"checkbox",checked:N.isFree,onChange:e=>v({...N,isFree:e.target.checked}),className:"w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}),(0,t.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Bài học miễn phí (preview)"})]})})]}),(0,t.jsxs)("div",{className:"flex gap-3 pt-4 border-t border-gray-200",children:[(0,t.jsx)("button",{type:"submit",disabled:$||C,className:"flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium",children:$||C?"Đang lưu...":b?"Cập nhật":"Thêm bài học"}),(0,t.jsx)("button",{type:"button",onClick:()=>{x(!1),T()},className:"px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium",children:"Hủy"})]})]})]})})]})]})}e.s(["default",()=>h])}]);