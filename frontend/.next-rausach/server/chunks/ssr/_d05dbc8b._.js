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
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},13755,a=>{"use strict";let b=(0,a.i(367990).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);a.s(["default",()=>b])},516482,a=>{"use strict";var b=a.i(13755);a.s(["ArrowLeft",()=>b.default])},941046,a=>{"use strict";let b=(0,a.i(367990).default)("pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);a.s(["default",()=>b])},107723,a=>{"use strict";var b=a.i(941046);a.s(["Edit2",()=>b.default])},697345,a=>{"use strict";let b=(0,a.i(367990).default)("grip-vertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);a.s(["default",()=>b])},340449,a=>{"use strict";var b=a.i(697345);a.s(["GripVertical",()=>b.default])},320584,a=>{"use strict";var b=a.i(321248),c=a.i(53627),d=a.i(439889),e=a.i(516482),f=a.i(651332),g=a.i(235746),h=a.i(723593),i=a.i(107723),j=a.i(558767),k=a.i(340449);function l({courseId:a,onNext:c,onBack:d}){let[e,l]=(0,f.useState)(!1),[m,n]=(0,f.useState)(null),[o,p]=(0,f.useState)({title:"",description:""}),{data:q,loading:r,refetch:s}=(0,g.useFindUnique)("course",a,{include:{modules:{orderBy:{order:"asc"}}}}),[t,{loading:u}]=(0,g.useCreateOne)("module"),[v,{loading:w}]=(0,g.useUpdateOne)("module"),[x]=(0,g.useDeleteOne)("module"),y=q?.modules||[],z=async b=>{b.preventDefault(),m?(await v({where:{id:m.id},data:{title:o.title,description:o.description}}),n(null)):(await t({data:{courseId:a,title:o.title,description:o.description}}),l(!1)),p({title:"",description:""}),s()},A=async a=>{confirm("Are you sure you want to delete this module?")&&(await x({where:{id:a}}),s())},B=y.length>0;return(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Course Modules"}),(0,b.jsx)("p",{className:"text-gray-600",children:"Organize your course content into modules"})]}),(0,b.jsx)("div",{className:"space-y-4",children:y.map((a,c)=>(0,b.jsx)("div",{className:"p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow",children:(0,b.jsxs)("div",{className:"flex items-start justify-between",children:[(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 mb-2",children:[(0,b.jsx)(k.GripVertical,{className:"w-5 h-5 text-gray-400 cursor-move"}),(0,b.jsxs)("h3",{className:"text-lg font-semibold text-gray-900",children:[c+1,". ",a.title]})]}),a.description&&(0,b.jsx)("p",{className:"text-gray-600 ml-8",children:a.description}),(0,b.jsxs)("p",{className:"text-sm text-gray-500 ml-8 mt-2",children:[a.lessons?.length||0," lessons"]})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)("button",{onClick:()=>{n(a),p({title:a.title,description:a.description||""}),l(!0)},className:"p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors",children:(0,b.jsx)(i.Edit2,{className:"w-4 h-4"})}),(0,b.jsx)("button",{onClick:()=>A(a.id),className:"p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors",children:(0,b.jsx)(j.Trash2,{className:"w-4 h-4"})})]})]})},a.id))}),e?(0,b.jsxs)("form",{onSubmit:z,className:"p-6 bg-gray-50 rounded-lg",children:[(0,b.jsx)("h3",{className:"text-lg font-semibold mb-4",children:m?"Edit Module":"Add New Module"}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Module Title *"}),(0,b.jsx)("input",{type:"text",value:o.title,onChange:a=>p({...o,title:a.target.value}),placeholder:"e.g., Getting Started with React",required:!0,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Description (Optional)"}),(0,b.jsx)("textarea",{value:o.description,onChange:a=>p({...o,description:a.target.value}),placeholder:"Brief description of this module...",rows:3,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"})]}),(0,b.jsxs)("div",{className:"flex gap-3",children:[(0,b.jsx)("button",{type:"submit",disabled:u||w,className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50",children:u||w?"Saving...":m?"Update Module":"Add Module"}),(0,b.jsx)("button",{type:"button",onClick:()=>{l(!1),n(null),p({title:"",description:""})},className:"px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",children:"Cancel"})]})]})]}):(0,b.jsxs)("button",{onClick:()=>l(!0),className:"w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2",children:[(0,b.jsx)(h.Plus,{className:"w-5 h-5"}),"Add Module"]}),(0,b.jsxs)("div",{className:"flex justify-between pt-6 border-t",children:[(0,b.jsx)("button",{onClick:d,className:"px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50",children:"Back"}),(0,b.jsx)("button",{onClick:c,disabled:!B,className:"px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",children:"Next: Add Lessons"})]}),!B&&(0,b.jsx)("p",{className:"text-sm text-amber-600 text-center",children:"Please add at least one module to continue"})]})}function m(){let a=(0,c.useParams)(),f=a?.id;return(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,b.jsx)("div",{className:"bg-white border-b sticky top-0 z-10",children:(0,b.jsx)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4",children:(0,b.jsx)("div",{className:"flex items-center justify-between",children:(0,b.jsxs)(d.default,{href:"/lms/instructor/dashboard",className:"flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors",children:[(0,b.jsx)(e.ArrowLeft,{className:"w-5 h-5"}),(0,b.jsx)("span",{className:"font-medium",children:"Quay lại Dashboard"})]})})})}),(0,b.jsx)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,b.jsx)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8",children:(0,b.jsx)(l,{courseId:f,onNext:()=>{},onBack:()=>{}})})})]})}a.s(["default",()=>m],320584)}];

//# sourceMappingURL=_d05dbc8b._.js.map