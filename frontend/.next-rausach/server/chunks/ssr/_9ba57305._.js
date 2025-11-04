module.exports=[387170,a=>{"use strict";var b=a.i(651332);let c=b.forwardRef(function({title:a,titleId:c,...d},e){return b.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:e,"aria-labelledby":c},d),a?b.createElement("title",{id:c},a):null,b.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});a.s(["XMarkIcon",0,c],387170)},111264,a=>{"use strict";a.i(651332);var b=a.i(168918),c=a.i(8912);a.i(932032),a.i(129406),a.i(609202),a.i(184327),a.i(876158),a.i(930054),a.i(730012),a.i(1898),a.i(563718),a.i(853310),a.i(329321);var d=a.i(772213);let e=d.gql`
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
`,f=d.gql`
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
`,g=d.gql`
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
`,h=d.gql`
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
`;d.gql`
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
`;let i=d.gql`
  ${e}
  query GetTasks($filters: TaskFilterInput) {
    getTasks(filters: $filters) {
      ...TaskFragment
    }
  }
`,j=d.gql`
  ${e}
  ${f}
  ${g}
  ${h}
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
`,k=d.gql`
  ${e}
  query GetSharedTasks($filters: TaskFilterInput) {
    getSharedTasks(filters: $filters) {
      ...TaskFragment
    }
  }
`,l=d.gql`
  ${e}
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFragment
    }
  }
`,m=d.gql`
  ${e}
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      ...TaskFragment
    }
  }
`,n=d.gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`,o=d.gql`
  ${g}
  mutation ShareTask($input: ShareTaskInput!) {
    shareTask(input: $input) {
      ...TaskShareFragment
    }
  }
`,p=d.gql`
  ${h}
  mutation CreateTaskComment($input: CreateTaskCommentInput!) {
    createTaskComment(input: $input) {
      ...TaskCommentFragment
    }
  }
`;d.gql`
  ${e}
  subscription TaskCreated {
    taskCreated {
      ...TaskFragment
    }
  }
`,d.gql`
  ${e}
  subscription TaskUpdated {
    taskUpdated {
      ...TaskFragment
    }
  }
`,d.gql`
  ${h}
  subscription TaskCommentCreated {
    taskCommentCreated {
      ...TaskCommentFragment
    }
  }
`,a.s(["useDeleteTask",0,()=>{let[a,{loading:b,error:d}]=(0,c.useMutation)(n,{refetchQueries:[i,k]});return{deleteTask:a,loading:b,error:d}},"useSharedTasks",0,a=>{let{data:c,loading:d,error:e,refetch:f}=(0,b.useQuery)(k,{variables:{filters:a},fetchPolicy:"cache-and-network"});return{sharedTasks:c?.getSharedTasks||[],loading:d,error:e,refetch:f}},"useTaskById",0,a=>(a=>{let{data:c,loading:d,error:e,refetch:f}=(0,b.useQuery)(j,{variables:{id:a},skip:!a,fetchPolicy:"cache-and-network"});return{task:c?.getTaskById,loading:d,error:e,refetch:f}})(a),"useTaskMutations",0,()=>{let[a,{loading:b}]=(0,c.useMutation)(l,{refetchQueries:[i,k]}),[d,{loading:e}]=(0,c.useMutation)(m,{refetchQueries:[i,k,j]}),[f,{loading:g}]=(0,c.useMutation)(n,{refetchQueries:[i,k]}),[h,{loading:q}]=(0,c.useMutation)(o,{refetchQueries:[j]}),[r,{loading:s}]=(0,c.useMutation)(p,{refetchQueries:[j]});return{createTask:async b=>{try{let c=await a({variables:{input:b}});return c.data?.createTask}catch(a){throw a}},updateTask:async a=>{try{let b=await d({variables:{input:a}});return b.data?.updateTask}catch(a){throw a}},deleteTask:async a=>{try{return await f({variables:{id:a}}),!0}catch(a){throw a}},shareTask:async a=>{try{let b=await h({variables:{input:a}});return b.data?.shareTask}catch(a){throw a}},createComment:async a=>{try{let b=await r({variables:{input:a}});return b.data?.createTaskComment}catch(a){throw a}},loading:{creating:b,updating:e,deleting:g,sharing:q,commenting:s}}},"useTasks",0,a=>{let{data:c,loading:d,error:e,refetch:f}=(0,b.useQuery)(i,{variables:{filters:a},fetchPolicy:"cache-and-network"});return{tasks:c?.getTasks||[],loading:d,error:e,refetch:f}},"useUpdateTask",0,()=>{let[a,{loading:b,error:d}]=(0,c.useMutation)(m,{refetchQueries:[i,k,j]});return{updateTask:a,loading:b,error:d}}],111264)},426849,a=>{"use strict";var b,c,d,e,f,g=((b={}).WORK="WORK",b.PERSONAL="PERSONAL",b.STUDY="STUDY",b),h=((c={}).HIGH="HIGH",c.MEDIUM="MEDIUM",c.LOW="LOW",c),i=((d={}).PENDING="PENDING",d.IN_PROGRESS="IN_PROGRESS",d.COMPLETED="COMPLETED",d.CANCELLED="CANCELLED",d),j=((e={}).VIEW="VIEW",e.EDIT="EDIT",e.ADMIN="ADMIN",e),k=((f={}).IMAGE="IMAGE",f.VIDEO="VIDEO",f.DOCUMENT="DOCUMENT",f);j.READ="READ",j.WRITE="WRITE",a.s(["MediaType",()=>k,"TaskCategory",()=>g,"TaskPriority",()=>h,"TaskStatus",()=>i])}];

//# sourceMappingURL=_9ba57305._.js.map