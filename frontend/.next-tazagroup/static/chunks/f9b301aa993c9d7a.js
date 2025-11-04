(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,199382,e=>{"use strict";var t=e.i(403055);let a=t.forwardRef(function({title:e,titleId:a,...s},r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":a},s),e?t.createElement("title",{id:a},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});e.s(["XMarkIcon",0,a],199382)},665691,e=>{"use strict";e.i(403055);var t=e.i(429105),a=e.i(950988);e.i(477469),e.i(349252),e.i(122363),e.i(919474),e.i(829319),e.i(413772),e.i(109709),e.i(131893),e.i(529590),e.i(308432),e.i(196446);var s=e.i(984804);let r=s.gql`
  fragment TaskFragment on Task {
    id
    title
    description
    category
    priority
    status
    dueDate
    createdAt
    updatedAt
    userId
    author {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`,i=s.gql`
  fragment TaskMediaFragment on TaskMedia {
    id
    filename
    url
    type
    size
    mimeType
    caption
    createdAt
    updatedAt
    taskId
    uploadedBy
    uploader {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`,n=s.gql`
  fragment TaskShareFragment on TaskShare {
    id
    permission
    shareToken
    expiresAt
    isActive
    createdAt
    updatedAt
    taskId
    sharedBy
    sharedByUser {
      id
      username
      firstName
      lastName
      avatar
    }
    sharedWith
    sharedWithUser {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`,l=s.gql`
  fragment TaskCommentFragment on TaskComment {
    id
    content
    createdAt
    updatedAt
    taskId
    userId
    user {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`;s.gql`
  fragment NotificationFragment on Notification {
    id
    type
    title
    message
    isRead
    createdAt
    userId
    user {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`;let d=s.gql`
  ${r}
  query GetTasks($filters: TaskFilterInput) {
    getTasks(filters: $filters) {
      ...TaskFragment
    }
  }
`,c=s.gql`
  ${r}
  ${i}
  ${n}
  ${l}
  query GetTaskById($id: ID!) {
    getTaskById(id: $id) {
      ...TaskFragment
      media {
        ...TaskMediaFragment
      }
      shares {
        ...TaskShareFragment
      }
      comments {
        ...TaskCommentFragment
      }
    }
  }
`,o=s.gql`
  ${r}
  query GetSharedTasks($filters: TaskFilterInput) {
    getSharedTasks(filters: $filters) {
      ...TaskFragment
    }
  }
`,m=s.gql`
  ${r}
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFragment
    }
  }
`,u=s.gql`
  ${r}
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      ...TaskFragment
    }
  }
`,h=s.gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`,x=s.gql`
  ${n}
  mutation ShareTask($input: ShareTaskInput!) {
    shareTask(input: $input) {
      ...TaskShareFragment
    }
  }
`,g=s.gql`
  ${l}
  mutation CreateTaskComment($input: CreateTaskCommentInput!) {
    createTaskComment(input: $input) {
      ...TaskCommentFragment
    }
  }
`;s.gql`
  ${r}
  subscription TaskCreated {
    taskCreated {
      ...TaskFragment
    }
  }
`,s.gql`
  ${r}
  subscription TaskUpdated {
    taskUpdated {
      ...TaskFragment
    }
  }
`,s.gql`
  ${l}
  subscription TaskCommentCreated {
    taskCommentCreated {
      ...TaskCommentFragment
    }
  }
`,e.s(["useDeleteTask",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(h,{refetchQueries:[d,o]});return{deleteTask:e,loading:t,error:s}},"useSharedTasks",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(o,{variables:{filters:e},fetchPolicy:"cache-and-network"});return{sharedTasks:a?.getSharedTasks||[],loading:s,error:r,refetch:i}},"useTaskById",0,e=>(e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(c,{variables:{id:e},skip:!e,fetchPolicy:"cache-and-network"});return{task:a?.getTaskById,loading:s,error:r,refetch:i}})(e),"useTaskMutations",0,()=>{let[e,{loading:t}]=(0,a.useMutation)(m,{refetchQueries:[d,o]}),[s,{loading:r}]=(0,a.useMutation)(u,{refetchQueries:[d,o,c]}),[i,{loading:n}]=(0,a.useMutation)(h,{refetchQueries:[d,o]}),[l,{loading:p}]=(0,a.useMutation)(x,{refetchQueries:[c]}),[k,{loading:y}]=(0,a.useMutation)(g,{refetchQueries:[c]});return{createTask:async t=>{try{let a=await e({variables:{input:t}});return a.data?.createTask}catch(e){throw e}},updateTask:async e=>{try{let t=await s({variables:{input:e}});return t.data?.updateTask}catch(e){throw e}},deleteTask:async e=>{try{return await i({variables:{id:e}}),!0}catch(e){throw e}},shareTask:async e=>{try{let t=await l({variables:{input:e}});return t.data?.shareTask}catch(e){throw e}},createComment:async e=>{try{let t=await k({variables:{input:e}});return t.data?.createTaskComment}catch(e){throw e}},loading:{creating:t,updating:r,deleting:n,sharing:p,commenting:y}}},"useTasks",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(d,{variables:{filters:e},fetchPolicy:"cache-and-network"});return{tasks:a?.getTasks||[],loading:s,error:r,refetch:i}},"useUpdateTask",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(u,{refetchQueries:[d,o,c]});return{updateTask:e,loading:t,error:s}}],665691)},343698,e=>{"use strict";var t,a,s,r,i,n=((t={}).WORK="WORK",t.PERSONAL="PERSONAL",t.STUDY="STUDY",t),l=((a={}).HIGH="HIGH",a.MEDIUM="MEDIUM",a.LOW="LOW",a),d=((s={}).PENDING="PENDING",s.IN_PROGRESS="IN_PROGRESS",s.COMPLETED="COMPLETED",s.CANCELLED="CANCELLED",s),c=((r={}).VIEW="VIEW",r.EDIT="EDIT",r.ADMIN="ADMIN",r),o=((i={}).IMAGE="IMAGE",i.VIDEO="VIDEO",i.DOCUMENT="DOCUMENT",i);c.READ="READ",c.WRITE="WRITE",e.s(["MediaType",()=>o,"TaskCategory",()=>n,"TaskPriority",()=>l,"TaskStatus",()=>d])},240821,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(130775),r=e.i(579448);let i=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}))}),n=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"}))}),l=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"}))}),d=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"}),a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 6h.008v.008H6V6Z"}))}),c=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"}))}),o=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"}))}),m=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"}))}),u=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"}))}),h=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"}))}),x=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"}))}),g=a.forwardRef(function({title:e,titleId:t,...s},r){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":t},s),e?a.createElement("title",{id:t},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m4.5 12.75 6 6 9-13.5"}))});var p=e.i(199382),k=e.i(665691),y=e.i(343698);let f=e=>{let t="string"==typeof e?new Date(e):e;return isNaN(t.getTime())?"Invalid date":new Intl.DateTimeFormat("vi-VN",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(t)};var v=e.i(123959);function N(){let e=(0,s.useRouter)(),N=(0,s.useParams)(),{isAuthenticated:b}=(0,v.useAuth)(),w=N?.id,{task:j,loading:T,error:E}=(0,k.useTaskById)(w),{updateTask:C,loading:I}=(0,k.useUpdateTask)(),{deleteTask:M,loading:D}=(0,k.useDeleteTask)(),[L,S]=(0,a.useState)(!1),[O,A]=(0,a.useState)({title:"",description:"",status:y.TaskStatus.PENDING,priority:y.TaskPriority.MEDIUM,dueDate:"",category:""});(0,a.useEffect)(()=>{b||e.push("/login")},[b,e]),(0,a.useEffect)(()=>{j&&A({title:j.title,description:j.description||"",status:j.status,priority:j.priority,dueDate:j.dueDate?new Date(j.dueDate).toISOString().split("T")[0]:"",category:j.category||""})},[j]);let R=async()=>{if(j)try{await C({variables:{input:{id:j.id,title:O.title,description:O.description||null,status:O.status,priority:O.priority,dueDate:O.dueDate?new Date(O.dueDate).toISOString():null,category:O.category||null}}}),S(!1)}catch(e){console.error("Error updating task:",e)}},$=async()=>{if(j&&confirm("Bạn có chắc chắn muốn xóa task này?"))try{await M({variables:{id:j.id}}),e.push("/todos")}catch(e){console.error("Error deleting task:",e)}},P=async e=>{if(j)try{await C({variables:{input:{id:j.id,status:e}}})}catch(e){console.error("Error updating task status:",e)}};return b?T?(0,t.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"})}):E||!j?(console.error("Error fetching task:",E),console.error("Error fetching task:",j),(0,t.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-gray-900",children:"Task không tìm thấy"}),(0,t.jsx)("p",{className:"mt-2 text-gray-600",children:"Task bạn tìm kiếm không tồn tại hoặc đã bị xóa."}),(0,t.jsx)(r.default,{href:"/todos",className:"mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700",children:"Quay lại danh sách"})]})})):(0,t.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,t.jsx)("div",{className:"bg-white shadow",children:(0,t.jsx)("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,t.jsxs)("div",{className:"flex items-center justify-between py-6",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsxs)(r.default,{href:"/todos",className:"flex items-center space-x-2 text-gray-600 hover:text-gray-900",children:[(0,t.jsx)(i,{className:"w-5 h-5"}),(0,t.jsx)("span",{children:"Quay lại"})]}),(0,t.jsx)("div",{className:"h-6 border-l border-gray-300"}),(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"Chi tiết Task"})]}),(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsxs)("button",{onClick:()=>S(!L),className:"flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50",children:[(0,t.jsx)(h,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:L?"Hủy":"Chỉnh sửa"})]}),(0,t.jsxs)("button",{onClick:$,disabled:D,className:"flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50",children:[(0,t.jsx)(x,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:"Xóa"})]})]})]})})}),(0,t.jsx)("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[(0,t.jsxs)("div",{className:"lg:col-span-2 space-y-6",children:[(0,t.jsx)("div",{className:"bg-white rounded-lg shadow p-6",children:L?(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)("input",{type:"text",value:O.title,onChange:e=>A({...O,title:e.target.value}),className:"w-full text-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500 rounded p-2",placeholder:"Tiêu đề task"}),(0,t.jsx)("textarea",{value:O.description,onChange:e=>A({...O,description:e.target.value}),rows:6,className:"w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent",placeholder:"Mô tả chi tiết..."}),(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsxs)("button",{onClick:R,disabled:I,className:"flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50",children:[(0,t.jsx)(g,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:"Lưu"})]}),(0,t.jsxs)("button",{onClick:()=>S(!1),className:"flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50",children:[(0,t.jsx)(p.XMarkIcon,{className:"w-4 h-4"}),(0,t.jsx)("span",{children:"Hủy"})]})]})]}):(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-900 mb-4",children:j.title}),j.description&&(0,t.jsx)("div",{className:"prose prose-gray max-w-none",children:(0,t.jsx)("p",{className:"text-gray-700 whitespace-pre-wrap",children:j.description})})]})}),(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,t.jsxs)("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center",children:[(0,t.jsx)(m,{className:"w-5 h-5 mr-2"}),"Bình luận (",j.comments?.length||0,")"]}),j.comments&&j.comments.length>0?(0,t.jsx)("div",{className:"space-y-4",children:j.comments.map(e=>(0,t.jsxs)("div",{className:"border-l-4 border-blue-200 pl-4",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-2 mb-2",children:[(0,t.jsx)(c,{className:"w-4 h-4 text-gray-500"}),(0,t.jsx)("span",{className:"font-medium text-gray-900",children:e.user.username}),(0,t.jsx)("span",{className:"text-sm text-gray-500",children:f(e.createdAt)})]}),(0,t.jsx)("p",{className:"text-gray-700",children:e.content})]},e.id))}):(0,t.jsx)("p",{className:"text-gray-500",children:"Chưa có bình luận nào."})]}),j.media&&j.media.length>0&&(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,t.jsxs)("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center",children:[(0,t.jsx)(u,{className:"w-5 h-5 mr-2"}),"Tệp đính kèm (",j.media.length,")"]}),(0,t.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-4",children:j.media.map(e=>(0,t.jsxs)("div",{className:"border rounded-lg p-3",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)(u,{className:"w-4 h-4 text-gray-500"}),(0,t.jsx)("span",{className:"text-sm font-medium text-gray-900 truncate",children:e.filename})]}),(0,t.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:e.size?`${Math.round(e.size/1024)} KB`:""})]},e.id))})]})]}),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,t.jsx)("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Trạng thái"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-sm font-medium text-gray-500",children:"Trạng thái hiện tại:"}),(0,t.jsxs)("span",{className:`px-2 py-1 rounded-full text-xs font-medium ${(e=>{switch(e){case y.TaskStatus.COMPLETED:return"text-green-600 bg-green-100";case y.TaskStatus.IN_PROGRESS:return"text-blue-600 bg-blue-100";case y.TaskStatus.PENDING:default:return"text-gray-600 bg-gray-100"}})(j.status)}`,children:[j.status===y.TaskStatus.PENDING&&"Chờ xử lý",j.status===y.TaskStatus.IN_PROGRESS&&"Đang thực hiện",j.status===y.TaskStatus.COMPLETED&&"Hoàn thành"]})]}),(0,t.jsxs)("div",{className:"border-t pt-3",children:[(0,t.jsx)("p",{className:"text-sm font-medium text-gray-500 mb-2",children:"Thay đổi trạng thái:"}),(0,t.jsx)("div",{className:"space-y-2",children:Object.values(y.TaskStatus).map(e=>(0,t.jsxs)("button",{onClick:()=>P(e),disabled:j.status===e||I,className:`
                          w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                          ${j.status===e?"bg-gray-100 text-gray-400 cursor-not-allowed":"hover:bg-gray-50 text-gray-700"}
                        `,children:[e===y.TaskStatus.PENDING&&"Chờ xử lý",e===y.TaskStatus.IN_PROGRESS&&"Đang thực hiện",e===y.TaskStatus.COMPLETED&&"Hoàn thành"]},e))})]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,t.jsx)("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Thông tin"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)(l,{className:"w-5 h-5 text-gray-400"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-gray-500",children:"Độ ưu tiên"}),(0,t.jsxs)("span",{className:`px-2 py-1 rounded-full text-xs font-medium ${(e=>{switch(e){case y.TaskPriority.HIGH:return"text-red-600 bg-red-100";case y.TaskPriority.MEDIUM:return"text-yellow-600 bg-yellow-100";case y.TaskPriority.LOW:return"text-green-600 bg-green-100";default:return"text-gray-600 bg-gray-100"}})(j.priority)}`,children:[j.priority===y.TaskPriority.HIGH&&"Cao",j.priority===y.TaskPriority.MEDIUM&&"Trung bình",j.priority===y.TaskPriority.LOW&&"Thấp"]})]})]}),j.category&&(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)(d,{className:"w-5 h-5 text-gray-400"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-gray-500",children:"Danh mục"}),(0,t.jsx)("p",{className:"text-sm text-gray-900",children:j.category})]})]}),j.dueDate&&(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)(n,{className:"w-5 h-5 text-gray-400"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-gray-500",children:"Hạn hoàn thành"}),(0,t.jsx)("p",{className:"text-sm text-gray-900",children:f(j.dueDate)})]})]}),(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)(c,{className:"w-5 h-5 text-gray-400"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-gray-500",children:"Người tạo"}),(0,t.jsx)("p",{className:"text-sm text-gray-900",children:j.author.username})]})]}),(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)(n,{className:"w-5 h-5 text-gray-400"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-gray-500",children:"Ngày tạo"}),(0,t.jsx)("p",{className:"text-sm text-gray-900",children:f(j.createdAt)})]})]})]})]}),j.shares&&j.shares.length>0&&(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow p-6",children:[(0,t.jsxs)("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center",children:[(0,t.jsx)(o,{className:"w-5 h-5 mr-2"}),"Chia sẻ (",j.shares.length,")"]}),(0,t.jsx)("div",{className:"space-y-3",children:j.shares.map(e=>(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)(c,{className:"w-4 h-4 text-gray-500"}),(0,t.jsx)("span",{className:"text-sm text-gray-900",children:e.sharedWithUser?.username||"Người dùng ẩn danh"})]}),(0,t.jsx)("span",{className:"text-xs text-gray-500",children:"READ"===e.permission?"Xem":"Chỉnh sửa"})]},e.id))})]})]})]})})]}):null}e.s(["default",()=>N],240821)}]);