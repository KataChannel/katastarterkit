(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,125282,e=>{"use strict";var s=e.i(672974);e.s(["Edit3",()=>s.default])},746969,e=>{"use strict";var s=e.i(392636);e.s(["File",()=>s.default])},350856,10691,524262,351845,508195,e=>{"use strict";var s,t,a=e.i(44990),l=e.i(403055);e.i(308140);var r=e.i(950988),i=e.i(429105),n=e.i(984804);let d=n.gql`
  fragment FileFields on File {
    id
    filename
    originalName
    mimeType
    size
    fileType
    url
    bucket
    path
    folderId
    userId
    visibility
    title
    description
    alt
    tags
    metadata
    width
    height
    thumbnailUrl
    downloadCount
    viewCount
    createdAt
    updatedAt
  }
`,o=n.gql`
  fragment FolderFields on FileFolder {
    id
    name
    description
    parentId
    path
    userId
    color
    icon
    isSystem
    createdAt
    updatedAt
  }
`;n.gql`
  ${d}
  query GetFile($id: ID!) {
    file(id: $id) {
      ...FileFields
      folder {
        id
        name
        path
      }
    }
  }
`;let c=n.gql`
  ${d}
  query GetFiles($input: GetFilesInput) {
    files(input: $input) {
      items {
        ...FileFields
        folder {
          id
          name
          path
        }
      }
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;n.gql`
  ${o}
  query GetFolder($id: ID!) {
    folder(id: $id) {
      ...FolderFields
      parent {
        id
        name
        path
      }
      children {
        id
        name
        path
      }
      files {
        id
        filename
        originalName
        url
        fileType
        size
      }
    }
  }
`,n.gql`
  ${o}
  query GetFolders {
    folders {
      ...FolderFields
      children {
        id
        name
        path
      }
    }
  }
`;let u=n.gql`
  query GetStorageStats {
    fileStorageStats {
      totalFiles
      totalSize
      totalFolders
      filesByType {
        type
        count
        totalSize
      }
      filesByVisibility {
        visibility
        count
      }
    }
  }
`;n.gql`
  ${d}
  mutation UpdateFile($input: UpdateFileInput!) {
    updateFile(input: $input) {
      ...FileFields
    }
  }
`;let h=n.gql`
  mutation DeleteFile($id: ID!) {
    deleteFile(id: $id)
  }
`;n.gql`
  ${d}
  mutation MoveFiles($input: MoveFilesInput!) {
    moveFiles(input: $input) {
      ...FileFields
    }
  }
`;let m=n.gql`
  mutation BulkDeleteFiles($input: BulkDeleteFilesInput!) {
    bulkDeleteFiles(input: $input)
  }
`;function p(e){let{data:s,loading:t,error:a,refetch:l}=(0,i.useQuery)(c,{variables:{input:e},fetchPolicy:"cache-and-network"});return{files:s?.files,loading:t,error:a,refetch:l}}function x(){let{data:e,loading:s,error:t,refetch:a}=(0,i.useQuery)(u,{fetchPolicy:"cache-and-network"});return{stats:e?.fileStorageStats,loading:s,error:t,refetch:a}}function g(){let[e,s]=(0,l.useState)(!1),[t,a]=(0,l.useState)(0);return{uploadFile:async(e,t,l)=>{s(!0),a(0);try{let s=new FormData;s.append("file",e),t&&s.append("folderId",t),l&&s.append("metadata",JSON.stringify(l));let r=await fetch("http://116.118.49.243:12001/api/files/upload",{method:"POST",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},body:s});if(!r.ok)throw Error("Upload failed");let i=await r.json();return a(100),i}catch(e){throw e}finally{s(!1)}},uploadFiles:async(e,t)=>{s(!0),a(0);try{let s=new FormData;e.forEach(e=>s.append("files",e)),t&&s.append("folderId",t);let l=await fetch("http://116.118.49.243:12001/api/files/upload/bulk",{method:"POST",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},body:s});if(!l.ok)throw Error("Upload failed");let r=await l.json();return a(100),r}catch(e){throw e}finally{s(!1)}},uploading:e,progress:t}}function j(){let[e,{loading:s,error:t}]=(0,r.useMutation)(h,{refetchQueries:[{query:c}]});return{deleteFile:async s=>{let t=await e({variables:{id:s}});return t.data?.deleteFile},loading:s,error:t}}function f(){let[e,{loading:s,error:t}]=(0,r.useMutation)(m,{refetchQueries:[{query:c}]});return{bulkDeleteFiles:async s=>{let t=await e({variables:{input:s}});return t.data?.bulkDeleteFiles},loading:s,error:t}}n.gql`
  ${d}
  mutation BulkUpdateFiles($input: BulkUpdateFilesInput!) {
    bulkUpdateFiles(input: $input) {
      ...FileFields
    }
  }
`,n.gql`
  ${o}
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      ...FolderFields
    }
  }
`,n.gql`
  ${o}
  mutation UpdateFolder($input: UpdateFolderInput!) {
    updateFolder(input: $input) {
      ...FolderFields
    }
  }
`,n.gql`
  mutation DeleteFolder($id: ID!) {
    deleteFolder(id: $id)
  }
`,n.gql`
  mutation CreateFileShare($input: CreateFileShareInput!) {
    createFileShare(input: $input) {
      id
      fileId
      token
      sharedBy
      sharedWith
      expiresAt
      canDownload
      canView
      createdAt
    }
  }
`,e.s(["useBulkDeleteFiles",()=>f,"useDeleteFile",()=>j,"useFileUpload",()=>g,"useFiles",()=>p,"useStorageStats",()=>x],10691);var v=((s={}).IMAGE="IMAGE",s.VIDEO="VIDEO",s.AUDIO="AUDIO",s.DOCUMENT="DOCUMENT",s.ARCHIVE="ARCHIVE",s.OTHER="OTHER",s);(t={}).PUBLIC="PUBLIC",t.PRIVATE="PRIVATE",t.SHARED="SHARED",e.s(["FileType",()=>v],524262);var b=e.i(775680),y=e.i(885205),N=e.i(696134),w=e.i(702470),C=e.i(137651),F=e.i(645030),k=e.i(455461),D=e.i(888540),S=e.i(392636),S=S,I=e.i(822390),T=e.i(198513),B=e.i(541428);let M=({open:e,onOpenChange:s,onUpload:t,onUploadSuccess:r,folderId:i})=>{let n=(0,l.useRef)(null),[d,o]=(0,l.useState)([]),[c,u]=(0,l.useState)(!1),[h,m]=(0,l.useState)(!1),p=(0,l.useCallback)(e=>{let s=Array.from(e).map(e=>({file:e,id:`${e.name}-${Date.now()}-${Math.random()}`,status:"pending",progress:0}));o(e=>[...e,...s])},[]),x=(0,l.useCallback)(e=>{e.preventDefault(),u(!1),e.dataTransfer.files&&e.dataTransfer.files.length>0&&p(e.dataTransfer.files)},[p]),g=(0,l.useCallback)(e=>{e.preventDefault(),u(!0)},[]),j=(0,l.useCallback)(e=>{e.preventDefault(),u(!1)},[]),f=async()=>{if(0!==d.length){m(!0);try{let e=d.map(e=>e.file);await t(e),o(e=>e.map(e=>({...e,status:"success",progress:100}))),r&&r(),setTimeout(()=>{s(!1),o([])},1500)}catch(e){o(s=>s.map(s=>({...s,status:"error",error:e.message||"Upload failed"})))}finally{m(!1)}}};return(0,a.jsx)(C.Dialog,{open:e,onOpenChange:s,children:(0,a.jsxs)(C.DialogContent,{className:"max-w-2xl max-h-[80vh] flex flex-col",children:[(0,a.jsx)(C.DialogHeader,{children:(0,a.jsxs)(C.DialogTitle,{className:"flex items-center gap-2",children:[(0,a.jsx)(k.Upload,{className:"h-5 w-5"}),"Upload Files",d.length>0&&(0,a.jsxs)(w.Badge,{variant:"secondary",className:"ml-2",children:[d.length," file",d.length>1?"s":""]})]})}),(0,a.jsxs)("div",{className:"flex-1 overflow-y-auto space-y-4 py-4",children:[(0,a.jsxs)("div",{onDrop:x,onDragOver:g,onDragLeave:j,className:(0,B.cn)("border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",c?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-gray-300 hover:border-gray-400 dark:border-gray-700"),onClick:()=>n.current?.click(),children:[(0,a.jsx)(k.Upload,{className:"h-12 w-12 mx-auto mb-4 text-gray-400"}),(0,a.jsx)("p",{className:"text-lg font-medium mb-2",children:"Drop files here or click to browse"}),(0,a.jsx)("p",{className:"text-sm text-gray-500",children:"Support for multiple files upload"}),(0,a.jsx)("input",{ref:n,type:"file",multiple:!0,className:"hidden",onChange:e=>{e.target.files&&e.target.files.length>0&&p(e.target.files)}})]}),d.length>0&&(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)("h3",{className:"text-sm font-medium",children:"Files to upload:"}),(0,a.jsx)("div",{className:"space-y-2 max-h-[300px] overflow-y-auto",children:d.map(e=>(0,a.jsxs)("div",{className:"flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg",children:[(e=>{switch(e){case"success":return(0,a.jsx)(I.CheckCircle,{className:"h-4 w-4 text-green-500"});case"error":return(0,a.jsx)(T.AlertCircle,{className:"h-4 w-4 text-red-500"});case"uploading":return(0,a.jsx)("div",{className:"h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"});default:return(0,a.jsx)(S.default,{className:"h-4 w-4 text-gray-400"})}})(e.status),(0,a.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,a.jsx)("p",{className:"text-sm font-medium truncate",children:e.file.name}),(0,a.jsx)("p",{className:"text-xs text-gray-500",children:(e=>{if(0===e)return"0 Bytes";let s=Math.floor(Math.log(e)/Math.log(1024));return Math.round(e/Math.pow(1024,s)*100)/100+" "+["Bytes","KB","MB","GB"][s]})(e.file.size)}),"uploading"===e.status&&(0,a.jsx)(F.Progress,{value:e.progress,className:"h-1 mt-2"}),e.error&&(0,a.jsx)("p",{className:"text-xs text-red-500 mt-1",children:e.error})]}),(e=>{switch(e){case"success":return(0,a.jsx)(w.Badge,{variant:"default",className:"bg-green-500",children:"Success"});case"error":return(0,a.jsx)(w.Badge,{variant:"destructive",children:"Error"});case"uploading":return(0,a.jsx)(w.Badge,{variant:"secondary",children:"Uploading..."});default:return(0,a.jsx)(w.Badge,{variant:"outline",children:"Pending"})}})(e.status),"pending"===e.status&&!h&&(0,a.jsx)(y.Button,{variant:"ghost",size:"sm",onClick:()=>{var s;return s=e.id,void o(e=>e.filter(e=>e.id!==s))},className:"h-8 w-8 p-0",children:(0,a.jsx)(D.X,{className:"h-4 w-4"})})]},e.id))})]})]}),(0,a.jsxs)(C.DialogFooter,{className:"gap-2",children:[(0,a.jsx)(y.Button,{variant:"outline",onClick:()=>{s(!1),o([])},disabled:h,children:"Cancel"}),(0,a.jsx)(y.Button,{onClick:f,disabled:0===d.length||h,children:h?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"}),"Uploading..."]}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(k.Upload,{className:"h-4 w-4 mr-2"}),"Upload ",d.length," file",d.length>1?"s":""]})})]})]})})};e.s(["UploadDialog",0,M],351845);var $=e.i(240243),U=e.i(711798),A=e.i(850384),E=e.i(746969),P=e.i(126795),z=e.i(823186),q=e.i(275206);e.s(["Music",()=>q.default],508195);var q=q,O=e.i(421329),R=e.i(742049),V=e.i(138227),G=e.i(897711),L=e.i(404210),H=e.i(495043),K=e.i(791174),Q=e.i(135369),_=e.i(4993);function W({onSelect:e,allowMultiple:s=!1,folderId:t,fileTypes:r,viewMode:i,sortBy:n,searchQuery:d,filter:o,limit:c=20}){let[u,h]=(0,l.useState)("grid"),[m,x]=(0,l.useState)(""),[C,F]=(0,l.useState)(new Set),[D,S]=(0,l.useState)(1),[I,T]=(0,l.useState)(!1),{toast:B}=(0,_.useToast)(),W=i||u,J=void 0!==d?d:m,X=n||{field:"date",order:"desc"},{files:Y,loading:Z,refetch:ee}=p({page:D,limit:c,filters:{...t&&{folderId:t},...J&&{search:J},...o?.type&&{fileType:o.type},...r&&r.length>0&&!o?.type&&{fileType:r[0]}},sortBy:"name"===X.field?"filename":"date"===X.field?"createdAt":"size",sortOrder:X.order}),{uploadFile:es,uploadFiles:et,uploading:ea}=g(),{deleteFile:el}=j(),{bulkDeleteFiles:er}=f(),ei=(0,l.useCallback)(async e=>{try{let s=Array.from(e);1===s.length?await es(s[0],t):await et(s,t),B({type:"success",title:"Success",description:`${s.length} file(s) uploaded successfully`}),ee(),T(!1)}catch(e){B({type:"error",title:"Error",description:e.message||"Failed to upload files",variant:"destructive"})}},[es,et,t,ee,B]),en=(0,l.useCallback)(e=>{e.preventDefault();let s=e.dataTransfer.files;s.length>0&&ei(s)},[ei]),ed=(0,l.useCallback)(e=>{e.preventDefault()},[]),eo=e=>{let t=new Set(C);t.has(e)?t.delete(e):(s||t.clear(),t.add(e)),F(t)},ec=async e=>{if(confirm("Are you sure you want to delete this file?"))try{await el(e),B({type:"success",title:"Success",description:"File deleted successfully"}),ee()}catch(e){B({type:"error",title:"Error",description:e.message||"Failed to delete file",variant:"destructive"})}},eu=async()=>{if(0!==C.size&&confirm(`Delete ${C.size} selected file(s)?`))try{await er({fileIds:Array.from(C)}),B({type:"success",title:"Success",description:`${C.size} file(s) deleted successfully`}),F(new Set),ee()}catch(e){B({type:"error",title:"Error",description:e.message||"Failed to delete files",variant:"destructive"})}},eh=e=>{switch(e){case v.IMAGE:return(0,a.jsx)(P.Image,{className:"w-5 h-5"});case v.VIDEO:return(0,a.jsx)(z.Video,{className:"w-5 h-5"});case v.AUDIO:return(0,a.jsx)(q.default,{className:"w-5 h-5"});case v.DOCUMENT:return(0,a.jsx)(O.FileText,{className:"w-5 h-5"});case v.ARCHIVE:return(0,a.jsx)(R.Archive,{className:"w-5 h-5"});default:return(0,a.jsx)(E.File,{className:"w-5 h-5"})}},em=e=>{if(0===e)return"0 Bytes";let s=Math.floor(Math.log(e)/Math.log(1024));return Math.round(e/Math.pow(1024,s)*100)/100+" "+["Bytes","KB","MB","GB"][s]};return(0,a.jsxs)("div",{className:"w-full h-full flex flex-col",children:[void 0===i&&void 0===d&&(0,a.jsx)(b.Card,{className:"mb-4",children:(0,a.jsx)(b.CardContent,{className:"p-4",children:(0,a.jsxs)("div",{className:"flex items-center justify-between gap-4",children:[(0,a.jsx)("div",{className:"flex-1 max-w-md",children:(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(A.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"}),(0,a.jsx)(N.Input,{placeholder:"Search files...",value:m,onChange:e=>x(e.target.value),className:"pl-10"})]})}),(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsxs)(y.Button,{variant:"default",size:"sm",disabled:ea,onClick:()=>T(!0),children:[(0,a.jsx)(k.Upload,{className:"w-4 h-4 mr-2"}),"Upload"]}),C.size>0&&(0,a.jsxs)(y.Button,{variant:"destructive",size:"sm",onClick:eu,children:[(0,a.jsx)(V.Trash2,{className:"w-4 h-4 mr-2"}),"Delete (",C.size,")"]}),(0,a.jsx)(y.Button,{variant:"outline",size:"sm",onClick:()=>ee(),children:(0,a.jsx)(K.RefreshCw,{className:"w-4 h-4"})}),(0,a.jsxs)("div",{className:"flex border rounded-md",children:[(0,a.jsx)(y.Button,{variant:"grid"===W?"default":"ghost",size:"sm",onClick:()=>h("grid"),className:"rounded-r-none",children:(0,a.jsx)($.Grid3x3,{className:"w-4 h-4"})}),(0,a.jsx)(y.Button,{variant:"list"===W?"default":"ghost",size:"sm",onClick:()=>h("list"),className:"rounded-l-none",children:(0,a.jsx)(U.List,{className:"w-4 h-4"})})]})]})]})})}),(0,a.jsx)(M,{open:I,onOpenChange:T,onUpload:ei,onUploadSuccess:()=>{ee(),T(!1)},folderId:t}),(0,a.jsx)("div",{onDrop:en,onDragOver:ed,className:"flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-900",children:Z?(0,a.jsx)("div",{className:"flex items-center justify-center h-full",children:(0,a.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})}):Y&&Y.items.length>0?(0,a.jsxs)(a.Fragment,{children:["grid"===W&&(0,a.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",children:Y.items.map(e=>(0,a.jsx)(b.Card,{className:`cursor-pointer hover:shadow-lg transition-shadow ${C.has(e.id)?"ring-2 ring-blue-500":""}`,onClick:()=>eo(e.id),children:(0,a.jsxs)(b.CardContent,{className:"p-4",children:[(0,a.jsx)("div",{className:"aspect-square bg-gray-100 dark:bg-gray-800 rounded-md mb-3 flex items-center justify-center overflow-hidden",children:e.fileType===v.IMAGE?(0,a.jsx)("img",{src:e.url,alt:e.originalName,className:"w-full h-full object-cover"}):(0,a.jsx)("div",{className:"text-gray-400",children:eh(e.fileType)})}),(0,a.jsxs)("div",{className:"space-y-1",children:[(0,a.jsx)("p",{className:"text-sm font-medium truncate",title:e.originalName,children:e.originalName}),(0,a.jsx)("p",{className:"text-xs text-gray-500",children:em(e.size)})]}),(0,a.jsxs)("div",{className:"flex items-center justify-between mt-3",children:[(0,a.jsx)(w.Badge,{variant:"secondary",className:"text-xs",children:e.fileType}),(0,a.jsxs)(Q.DropdownMenu,{children:[(0,a.jsx)(Q.DropdownMenuTrigger,{asChild:!0,onClick:e=>e.stopPropagation(),children:(0,a.jsx)(y.Button,{variant:"ghost",size:"sm",className:"h-6 w-6 p-0",children:(0,a.jsx)(H.MoreVertical,{className:"w-4 h-4"})})}),(0,a.jsxs)(Q.DropdownMenuContent,{align:"end",children:[(0,a.jsxs)(Q.DropdownMenuItem,{onClick:s=>{s.stopPropagation(),window.open(e.url,"_blank")},children:[(0,a.jsx)(L.Eye,{className:"w-4 h-4 mr-2"}),"View"]}),(0,a.jsxs)(Q.DropdownMenuItem,{onClick:s=>{s.stopPropagation(),window.open(e.url,"_blank")},children:[(0,a.jsx)(G.Download,{className:"w-4 h-4 mr-2"}),"Download"]}),(0,a.jsx)(Q.DropdownMenuSeparator,{}),(0,a.jsxs)(Q.DropdownMenuItem,{onClick:s=>{s.stopPropagation(),ec(e.id)},className:"text-red-600",children:[(0,a.jsx)(V.Trash2,{className:"w-4 h-4 mr-2"}),"Delete"]})]})]})]})]})},e.id))}),"list"===W&&(0,a.jsx)("div",{className:"space-y-2",children:Y.items.map(e=>(0,a.jsx)(b.Card,{className:`cursor-pointer hover:shadow-md transition-shadow ${C.has(e.id)?"ring-2 ring-blue-500":""}`,onClick:()=>eo(e.id),children:(0,a.jsx)(b.CardContent,{className:"p-4",children:(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4 flex-1",children:[(0,a.jsx)("div",{className:"text-gray-400",children:eh(e.fileType)}),(0,a.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,a.jsx)("p",{className:"font-medium truncate",children:e.originalName}),(0,a.jsxs)("div",{className:"flex items-center gap-4 text-sm text-gray-500",children:[(0,a.jsx)("span",{children:em(e.size)}),(0,a.jsx)("span",{children:new Date(e.createdAt).toLocaleDateString()}),(0,a.jsx)(w.Badge,{variant:"secondary",children:e.fileType})]})]})]}),(0,a.jsxs)(Q.DropdownMenu,{children:[(0,a.jsx)(Q.DropdownMenuTrigger,{asChild:!0,onClick:e=>e.stopPropagation(),children:(0,a.jsx)(y.Button,{variant:"ghost",size:"sm",children:(0,a.jsx)(H.MoreVertical,{className:"w-4 h-4"})})}),(0,a.jsxs)(Q.DropdownMenuContent,{align:"end",children:[(0,a.jsxs)(Q.DropdownMenuItem,{onClick:s=>{s.stopPropagation(),window.open(e.url,"_blank")},children:[(0,a.jsx)(L.Eye,{className:"w-4 h-4 mr-2"}),"View"]}),(0,a.jsxs)(Q.DropdownMenuItem,{onClick:s=>{s.stopPropagation(),window.open(e.url,"_blank")},children:[(0,a.jsx)(G.Download,{className:"w-4 h-4 mr-2"}),"Download"]}),(0,a.jsx)(Q.DropdownMenuSeparator,{}),(0,a.jsxs)(Q.DropdownMenuItem,{onClick:s=>{s.stopPropagation(),ec(e.id)},className:"text-red-600",children:[(0,a.jsx)(V.Trash2,{className:"w-4 h-4 mr-2"}),"Delete"]})]})]})]})})},e.id))}),Y.totalPages>1&&(0,a.jsxs)("div",{className:"flex items-center justify-center gap-2 mt-6",children:[(0,a.jsx)(y.Button,{variant:"outline",size:"sm",disabled:!Y.hasPreviousPage,onClick:()=>S(D-1),children:"Previous"}),(0,a.jsxs)("span",{className:"text-sm text-gray-600",children:["Page ",Y.page," of ",Y.totalPages]}),(0,a.jsx)(y.Button,{variant:"outline",size:"sm",disabled:!Y.hasNextPage,onClick:()=>S(D+1),children:"Next"})]})]}):(0,a.jsxs)("div",{className:"flex flex-col items-center justify-center h-full text-gray-400",children:[(0,a.jsx)(k.Upload,{className:"w-16 h-16 mb-4"}),(0,a.jsx)("p",{className:"text-lg font-medium mb-2",children:"No files yet"}),(0,a.jsx)("p",{className:"text-sm mb-4",children:"Drop files here or click upload button"})]})})]})}e.s(["FileManager",()=>W],350856)},297562,e=>{"use strict";var s=e.i(44990),t=e.i(403055),a=e.i(125282),l=e.i(138227),r=e.i(455461),i=e.i(126795),n=e.i(350856),d=e.i(137651),o=e.i(885205),c=e.i(996517),u=e.i(696134),h=e.i(165429),m=e.i(983551);function p({open:e,onOpenChange:a,onSelect:l,allowMultiple:r=!1,fileTypes:i,allowUrl:p=!0}){let[x,g]=(0,t.useState)(null),[j,f]=(0,t.useState)(""),[v,b]=(0,t.useState)("browse");return(0,s.jsx)(d.Dialog,{open:e,onOpenChange:a,children:(0,s.jsxs)(d.DialogContent,{className:"max-w-5xl h-[80vh] flex flex-col",children:[(0,s.jsx)(d.DialogHeader,{children:(0,s.jsx)(d.DialogTitle,{children:"Select File"})}),(0,s.jsxs)(c.Tabs,{value:v,onValueChange:e=>b(e),className:"flex-1 flex flex-col",children:[(0,s.jsxs)(c.TabsList,{className:"grid w-full grid-cols-2",children:[(0,s.jsx)(c.TabsTrigger,{value:"browse",children:"Browse Files"}),p&&(0,s.jsx)(c.TabsTrigger,{value:"url",children:"Enter URL"})]}),(0,s.jsx)(c.TabsContent,{value:"browse",className:"flex-1 overflow-hidden",children:(0,s.jsx)("div",{className:"h-full",children:(0,s.jsx)(n.FileManager,{onSelect:e=>{g(e)},allowMultiple:r,fileTypes:i})})}),p&&(0,s.jsx)(c.TabsContent,{value:"url",className:"flex-1",children:(0,s.jsxs)("div",{className:"space-y-4 p-4",children:[(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsx)(h.Label,{htmlFor:"url-input",children:"Image URL"}),(0,s.jsx)("div",{className:"flex gap-2",children:(0,s.jsxs)("div",{className:"relative flex-1",children:[(0,s.jsx)(m.Link,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"}),(0,s.jsx)(u.Input,{id:"url-input",placeholder:"https://example.com/image.jpg",value:j,onChange:e=>f(e.target.value),className:"pl-10"})]})}),(0,s.jsx)("p",{className:"text-sm text-gray-500",children:"Enter a direct URL to an image file"})]}),j&&(0,s.jsxs)("div",{className:"border rounded-lg p-4",children:[(0,s.jsx)("p",{className:"text-sm font-medium mb-2",children:"Preview:"}),(0,s.jsx)("div",{className:"bg-gray-100 dark:bg-gray-800 rounded-md aspect-video flex items-center justify-center overflow-hidden",children:(0,s.jsx)("img",{src:j,alt:"Preview",className:"max-w-full max-h-full object-contain",onError:e=>{e.target.style.display="none"}})})]})]})})]}),(0,s.jsxs)(d.DialogFooter,{children:[(0,s.jsx)(o.Button,{variant:"outline",onClick:()=>{a(!1),g(null),f("")},children:"Cancel"}),(0,s.jsx)(o.Button,{onClick:()=>{"browse"===v&&x?(l(x),a(!1),g(null)):"url"===v&&j.trim()&&(l(j.trim()),a(!1),f(""))},disabled:"browse"===v&&!x||"url"===v&&!j.trim(),children:"Select"})]})]})})}var x=e.i(524262);e.s(["ImageBlock",0,({block:e,isEditable:n=!1,onUpdate:d,onDelete:c})=>{let[u,h]=(0,t.useState)(!1),[m,g]=(0,t.useState)(e.content),[j,f]=(0,t.useState)(!1),[v,b]=(0,t.useState)(!1);return u&&n?(0,s.jsx)("div",{className:"relative border-2 border-blue-500 rounded-lg p-4",children:(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{className:"border-2 border-dashed border-gray-300 rounded-lg p-4",children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-2",children:"Chọn Hình Ảnh"}),(0,s.jsxs)(o.Button,{type:"button",variant:"outline",onClick:()=>b(!0),className:"w-full",children:[(0,s.jsx)(i.Image,{className:"w-4 h-4 mr-2"}),"Chọn từ thư viện hoặc nhập URL"]}),m.src&&(0,s.jsx)("div",{className:"mt-2",children:(0,s.jsx)("img",{src:m.src,alt:"Preview",className:"max-w-full h-32 object-contain rounded border"})})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-1",children:"Hoặc nhập trực tiếp URL hình ảnh"}),(0,s.jsx)("input",{type:"url",value:m.src||"",onChange:e=>g(s=>({...s,src:e.target.value})),className:"w-full p-2 border rounded",placeholder:"https://example.com/image.jpg"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-1",children:"Alt Text"}),(0,s.jsx)("input",{type:"text",value:m.alt||"",onChange:e=>g(s=>({...s,alt:e.target.value})),className:"w-full p-2 border rounded",placeholder:"Mô tả hình ảnh..."})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-1",children:"Caption (Tùy chọn)"}),(0,s.jsx)("input",{type:"text",value:m.caption||"",onChange:e=>g(s=>({...s,caption:e.target.value})),className:"w-full p-2 border rounded",placeholder:"Chú thích hình ảnh..."})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-sm font-medium mb-2",children:"Kích Thước Hình Ảnh"}),(0,s.jsxs)("div",{className:"grid grid-cols-3 gap-3",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-xs text-gray-600 mb-1",children:"Chiều rộng (px)"}),(0,s.jsx)("input",{type:"number",value:m.width||"",onChange:e=>g(s=>({...s,width:parseInt(e.target.value)||void 0})),className:"w-full p-2 border rounded text-sm",placeholder:"Auto",min:"1",max:"2000"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-xs text-gray-600 mb-1",children:"Chiều cao (px)"}),(0,s.jsx)("input",{type:"number",value:m.height||"",onChange:e=>g(s=>({...s,height:parseInt(e.target.value)||void 0})),className:"w-full p-2 border rounded text-sm",placeholder:"Auto",min:"1",max:"2000"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-xs text-gray-600 mb-1",children:"Object Fit"}),(0,s.jsxs)("select",{value:m.objectFit||"cover",onChange:e=>g(s=>({...s,objectFit:e.target.value})),className:"w-full p-2 border rounded text-sm",children:[(0,s.jsx)("option",{value:"cover",children:"Cover"}),(0,s.jsx)("option",{value:"contain",children:"Contain"}),(0,s.jsx)("option",{value:"fill",children:"Fill"})]})]})]})]}),(0,s.jsxs)("div",{className:"flex gap-2",children:[(0,s.jsx)("button",{onClick:()=>{d?.(m,e.style),h(!1)},className:"px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600",children:"Save"}),(0,s.jsx)("button",{onClick:()=>{g(e.content),h(!1)},className:"px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600",children:"Cancel"})]})]})}):m.src?(0,s.jsxs)("div",{className:`relative group ${n?"hover:ring-2 hover:ring-blue-300":""}`,children:[(0,s.jsxs)("div",{className:"text-center",children:[(0,s.jsx)("img",{src:m.src,alt:m.alt||"",style:{width:m.width?`${m.width}px`:"auto",height:m.height?`${m.height}px`:"auto",objectFit:m.objectFit||"cover",maxWidth:"100%"},className:"mx-auto rounded-lg"}),m.caption&&(0,s.jsx)("p",{className:"mt-2 text-sm text-gray-600 italic",children:m.caption})]}),n&&(0,s.jsx)("div",{className:"absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",children:(0,s.jsxs)("div",{className:"flex gap-1",children:[(0,s.jsx)("button",{onClick:()=>h(!0),className:"p-1 bg-blue-500 text-white rounded hover:bg-blue-600",title:"Edit",children:(0,s.jsx)(a.Edit3,{size:12})}),(0,s.jsx)("button",{onClick:c,className:"p-1 bg-red-500 text-white rounded hover:bg-red-600",title:"Delete",children:(0,s.jsx)(l.Trash2,{size:12})})]})}),(0,s.jsx)(p,{open:v,onOpenChange:b,onSelect:e=>{"string"==typeof e?g(s=>({...s,src:e})):g(s=>({...s,src:e.url,alt:e.originalName}))},fileTypes:[x.FileType.IMAGE],allowUrl:!0})]}):(0,s.jsxs)("div",{className:`relative group border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${n?"hover:ring-2 hover:ring-blue-300 cursor-pointer":""}`,onClick:()=>n&&h(!0),children:[(0,s.jsx)(r.Upload,{className:"mx-auto mb-2 text-gray-400",size:48}),(0,s.jsx)("p",{className:"text-gray-500",children:"Click to add an image"}),n&&(0,s.jsx)("div",{className:"absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",children:(0,s.jsx)("button",{onClick:e=>{e.stopPropagation(),c?.()},className:"p-1 bg-red-500 text-white rounded hover:bg-red-600",title:"Delete",children:(0,s.jsx)(l.Trash2,{size:12})})})]})}],297562)}]);