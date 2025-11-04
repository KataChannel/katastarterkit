module.exports=[158464,a=>{"use strict";let b=(0,a.i(367990).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);a.s(["default",()=>b])},558767,a=>{"use strict";var b=a.i(158464);a.s(["Trash2",()=>b.default])},939816,a=>{"use strict";let b=(0,a.i(367990).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);a.s(["default",()=>b])},723593,a=>{"use strict";var b=a.i(939816);a.s(["Plus",()=>b.default])},235746,769056,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(563718),e=a.i(651332),f=a.i(772213);let g=f.gql`
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
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},13755,a=>{"use strict";let b=(0,a.i(367990).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);a.s(["default",()=>b])},516482,a=>{"use strict";var b=a.i(13755);a.s(["ArrowLeft",()=>b.default])},597353,a=>{"use strict";let b=(0,a.i(367990).default)("file-text",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);a.s(["default",()=>b])},473515,a=>{"use strict";var b=a.i(597353);a.s(["FileText",()=>b.default])},773404,a=>{"use strict";let b=(0,a.i(367990).default)("circle-play",[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},187145,a=>{"use strict";var b=a.i(773404);a.s(["PlayCircle",()=>b.default])},136468,a=>{"use strict";let b=(0,a.i(367990).default)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);a.s(["default",()=>b])},445192,a=>{"use strict";var b=a.i(136468);a.s(["HelpCircle",()=>b.default])},941046,a=>{"use strict";let b=(0,a.i(367990).default)("pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);a.s(["default",()=>b])},107723,a=>{"use strict";var b=a.i(941046);a.s(["Edit2",()=>b.default])},956238,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(53627),e=a.i(439889),f=a.i(516482),g=a.i(723593),h=a.i(107723),i=a.i(558767),j=a.i(187145),k=a.i(473515),l=a.i(445192),m=a.i(235746);function n(){let a=(0,d.useParams)(),n=a?.id,[o,p]=(0,c.useState)(!1),[q,r]=(0,c.useState)(""),[s,t]=(0,c.useState)(null),[u,v]=(0,c.useState)({title:"",description:"",type:"VIDEO",content:"",videoUrl:"",duration:0,isFree:!1}),{data:w,refetch:x}=(0,m.useFindUnique)("course",n,{include:{modules:{include:{lessons:{orderBy:{order:"asc"}}},orderBy:{order:"asc"}}}}),[y,{loading:z}]=(0,m.useCreateOne)("lesson"),[A,{loading:B}]=(0,m.useUpdateOne)("lesson"),[C]=(0,m.useDeleteOne)("lesson"),D=w?.modules||[],E=()=>{v({title:"",description:"",type:"VIDEO",content:"",videoUrl:"",duration:0,isFree:!1}),r(""),t(null)},F=async a=>{a.preventDefault();let{videoUrl:b,...c}=u,d={...c,content:"VIDEO"===u.type?u.videoUrl:u.content};s?await A({where:{id:s.id},data:d}):await y({data:{moduleId:q,...d}}),p(!1),E(),x()},G=async a=>{confirm("Bạn có chắc muốn xóa bài học này?")&&(await C({where:{id:a}}),x())};return(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,b.jsx)("div",{className:"bg-white border-b sticky top-0 z-10",children:(0,b.jsx)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)(e.default,{href:"/lms/instructor/dashboard",className:"flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors",children:[(0,b.jsx)(f.ArrowLeft,{className:"w-5 h-5"}),(0,b.jsx)("span",{className:"font-medium",children:"Quay lại Dashboard"})]}),(0,b.jsx)(e.default,{href:`/lms/instructor/courses/${n}/manage`,className:"text-blue-600 hover:text-blue-700 font-medium",children:"Quản lý Module"})]})})}),(0,b.jsxs)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,b.jsxs)("div",{className:"mb-6",children:[(0,b.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"Quản Lý Bài Học"}),(0,b.jsx)("p",{className:"text-gray-600",children:"Thêm video, text, hoặc quiz vào các module của khóa học"})]}),0===D.length?(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center",children:[(0,b.jsx)(k.FileText,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),(0,b.jsx)("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Chưa có Module"}),(0,b.jsx)("p",{className:"text-gray-600 mb-6",children:"Bạn cần tạo module trước khi thêm bài học"}),(0,b.jsx)(e.default,{href:`/lms/instructor/courses/${n}/manage`,className:"inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:"Tạo Module"})]}):(0,b.jsx)("div",{className:"space-y-6",children:D.map((a,c)=>(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",children:[(0,b.jsxs)("div",{className:"bg-gray-50 px-6 py-4 border-b border-gray-200",children:[(0,b.jsxs)("h3",{className:"text-lg font-semibold text-gray-900",children:[c+1,". ",a.title]}),a.description&&(0,b.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:a.description})]}),(0,b.jsxs)("div",{className:"p-6",children:[a.lessons&&a.lessons.length>0?(0,b.jsx)("div",{className:"space-y-3 mb-4",children:a.lessons.map((d,e)=>(0,b.jsxs)("div",{className:"flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all",children:[(0,b.jsxs)("div",{className:"flex items-start gap-3 flex-1",children:[(a=>{switch(a){case"VIDEO":return(0,b.jsx)(j.PlayCircle,{className:"w-5 h-5 text-blue-600"});case"TEXT":return(0,b.jsx)(k.FileText,{className:"w-5 h-5 text-green-600"});case"QUIZ":return(0,b.jsx)(l.HelpCircle,{className:"w-5 h-5 text-purple-600"});default:return(0,b.jsx)(k.FileText,{className:"w-5 h-5 text-gray-600"})}})(d.type),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsxs)("h4",{className:"font-medium text-gray-900",children:[c+1,".",e+1," ",d.title]}),d.isFree&&(0,b.jsx)("span",{className:"px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded",children:"Miễn phí"})]}),d.description&&(0,b.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:d.description}),(0,b.jsxs)("div",{className:"flex items-center gap-4 mt-2 text-xs text-gray-500",children:[(0,b.jsx)("span",{className:"flex items-center gap-1",children:(0,b.jsx)("span",{className:"font-medium",children:d.type})}),d.duration>0&&(0,b.jsxs)("span",{children:[d.duration," phút"]})]})]})]}),(0,b.jsxs)("div",{className:"flex gap-2 ml-4",children:[(0,b.jsx)("button",{onClick:()=>{var b;return b=a.id,void(t(d),r(b),v({title:d.title,description:d.description||"",type:d.type,content:"VIDEO"===d.type?"":d.content||"",videoUrl:"VIDEO"===d.type&&d.content||"",duration:d.duration||0,isFree:d.isFree||!1}),p(!0))},className:"p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors",children:(0,b.jsx)(h.Edit2,{className:"w-4 h-4"})}),(0,b.jsx)("button",{onClick:()=>G(d.id),className:"p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors",children:(0,b.jsx)(i.Trash2,{className:"w-4 h-4"})})]})]},d.id))}):(0,b.jsx)("p",{className:"text-gray-500 text-sm mb-4",children:"Chưa có bài học nào"}),(0,b.jsxs)("button",{onClick:()=>{r(a.id),p(!0)},className:"w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2",children:[(0,b.jsx)(g.Plus,{className:"w-5 h-5"}),"Thêm bài học vào module này"]})]})]},a.id))}),o&&(0,b.jsx)("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",children:(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",children:[(0,b.jsx)("div",{className:"p-6 border-b border-gray-200",children:(0,b.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:s?"Sửa Bài Học":"Thêm Bài Học Mới"})}),(0,b.jsxs)("form",{onSubmit:F,className:"p-6 space-y-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Tiêu đề bài học *"}),(0,b.jsx)("input",{type:"text",value:u.title,onChange:a=>v({...u,title:a.target.value}),placeholder:"VD: Giới thiệu về React Hooks",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Mô tả (tùy chọn)"}),(0,b.jsx)("textarea",{value:u.description,onChange:a=>v({...u,description:a.target.value}),placeholder:"Mô tả ngắn về bài học...",rows:2,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Loại bài học *"}),(0,b.jsxs)("select",{value:u.type,onChange:a=>v({...u,type:a.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",children:[(0,b.jsx)("option",{value:"VIDEO",children:"Video"}),(0,b.jsx)("option",{value:"TEXT",children:"Text/Tài liệu"}),(0,b.jsx)("option",{value:"QUIZ",children:"Quiz/Bài kiểm tra"})]})]}),"VIDEO"===u.type&&(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Video URL *"}),(0,b.jsx)("input",{type:"url",value:u.videoUrl,onChange:a=>v({...u,videoUrl:a.target.value}),placeholder:"https://youtube.com/watch?v=...",required:"VIDEO"===u.type,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"}),(0,b.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:"Hỗ trợ YouTube, Vimeo, hoặc link video trực tiếp"})]}),"TEXT"===u.type&&(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Nội dung *"}),(0,b.jsx)("textarea",{value:u.content,onChange:a=>v({...u,content:a.target.value}),placeholder:"Nhập nội dung bài học...",rows:8,required:"TEXT"===u.type,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"})]}),"QUIZ"===u.type&&(0,b.jsx)("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg p-4",children:(0,b.jsxs)("p",{className:"text-sm text-yellow-800",children:[(0,b.jsx)("strong",{children:"Lưu ý:"})," Sau khi tạo bài học loại Quiz, bạn cần vào trang quản lý Quiz để thêm câu hỏi."]})}),(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Thời lượng (phút)"}),(0,b.jsx)("input",{type:"number",value:u.duration,onChange:a=>v({...u,duration:parseInt(a.target.value)||0}),min:"0",className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"})]}),(0,b.jsx)("div",{className:"flex items-center",children:(0,b.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer",children:[(0,b.jsx)("input",{type:"checkbox",checked:u.isFree,onChange:a=>v({...u,isFree:a.target.checked}),className:"w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}),(0,b.jsx)("span",{className:"text-sm font-medium text-gray-700",children:"Bài học miễn phí (preview)"})]})})]}),(0,b.jsxs)("div",{className:"flex gap-3 pt-4 border-t border-gray-200",children:[(0,b.jsx)("button",{type:"submit",disabled:z||B,className:"flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium",children:z||B?"Đang lưu...":s?"Cập nhật":"Thêm bài học"}),(0,b.jsx)("button",{type:"button",onClick:()=>{p(!1),E()},className:"px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium",children:"Hủy"})]})]})]})})]})]})}a.s(["default",()=>n])}];

//# sourceMappingURL=_cc473189._.js.map