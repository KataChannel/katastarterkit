module.exports=[772429,331589,268684,507092,649810,a=>{"use strict";var b,c,d=a.i(321248),e=a.i(651332),f=a.i(8912),g=a.i(168918),h=a.i(772213);let i=h.gql`
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
`,j=h.gql`
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
`;h.gql`
  ${i}
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
`;let k=h.gql`
  ${i}
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
`;h.gql`
  ${j}
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
`,h.gql`
  ${j}
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
`;let l=h.gql`
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
`;h.gql`
  ${i}
  mutation UpdateFile($input: UpdateFileInput!) {
    updateFile(input: $input) {
      ...FileFields
    }
  }
`;let m=h.gql`
  mutation DeleteFile($id: ID!) {
    deleteFile(id: $id)
  }
`;h.gql`
  ${i}
  mutation MoveFiles($input: MoveFilesInput!) {
    moveFiles(input: $input) {
      ...FileFields
    }
  }
`;let n=h.gql`
  mutation BulkDeleteFiles($input: BulkDeleteFilesInput!) {
    bulkDeleteFiles(input: $input)
  }
`;function o(a){let{data:b,loading:c,error:d,refetch:e}=(0,g.useQuery)(k,{variables:{input:a},fetchPolicy:"cache-and-network"});return{files:b?.files,loading:c,error:d,refetch:e}}function p(){let{data:a,loading:b,error:c,refetch:d}=(0,g.useQuery)(l,{fetchPolicy:"cache-and-network"});return{stats:a?.fileStorageStats,loading:b,error:c,refetch:d}}function q(){let[a,b]=(0,e.useState)(!1),[c,d]=(0,e.useState)(0);return{uploadFile:async(a,c,e)=>{b(!0),d(0);try{let b=new FormData;b.append("file",a),c&&b.append("folderId",c),e&&b.append("metadata",JSON.stringify(e));let f=await fetch("https://appapi.tazagroup.vn/api/files/upload",{method:"POST",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},body:b});if(!f.ok)throw Error("Upload failed");let g=await f.json();return d(100),g}catch(a){throw a}finally{b(!1)}},uploadFiles:async(a,c)=>{b(!0),d(0);try{let b=new FormData;a.forEach(a=>b.append("files",a)),c&&b.append("folderId",c);let e=await fetch("https://appapi.tazagroup.vn/api/files/upload/bulk",{method:"POST",headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},body:b});if(!e.ok)throw Error("Upload failed");let f=await e.json();return d(100),f}catch(a){throw a}finally{b(!1)}},uploading:a,progress:c}}function r(){let[a,{loading:b,error:c}]=(0,f.useMutation)(m,{refetchQueries:[{query:k}]});return{deleteFile:async b=>{let c=await a({variables:{id:b}});return c.data?.deleteFile},loading:b,error:c}}function s(){let[a,{loading:b,error:c}]=(0,f.useMutation)(n,{refetchQueries:[{query:k}]});return{bulkDeleteFiles:async b=>{let c=await a({variables:{input:b}});return c.data?.bulkDeleteFiles},loading:b,error:c}}h.gql`
  ${i}
  mutation BulkUpdateFiles($input: BulkUpdateFilesInput!) {
    bulkUpdateFiles(input: $input) {
      ...FileFields
    }
  }
`,h.gql`
  ${j}
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      ...FolderFields
    }
  }
`,h.gql`
  ${j}
  mutation UpdateFolder($input: UpdateFolderInput!) {
    updateFolder(input: $input) {
      ...FolderFields
    }
  }
`,h.gql`
  mutation DeleteFolder($id: ID!) {
    deleteFolder(id: $id)
  }
`,h.gql`
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
`,a.s(["useBulkDeleteFiles",()=>s,"useDeleteFile",()=>r,"useFileUpload",()=>q,"useFiles",()=>o,"useStorageStats",()=>p],331589);var t=((b={}).IMAGE="IMAGE",b.VIDEO="VIDEO",b.AUDIO="AUDIO",b.DOCUMENT="DOCUMENT",b.ARCHIVE="ARCHIVE",b.OTHER="OTHER",b);(c={}).PUBLIC="PUBLIC",c.PRIVATE="PRIVATE",c.SHARED="SHARED",a.s(["FileType",()=>t],268684);var u=a.i(975780),v=a.i(202979),w=a.i(478184),x=a.i(293470),y=a.i(755820),z=a.i(976762),A=a.i(147745),B=a.i(363615),C=a.i(751021),C=C,D=a.i(508335),E=a.i(327987),F=a.i(422171);let G=({open:a,onOpenChange:b,onUpload:c,onUploadSuccess:f,folderId:g})=>{let h=(0,e.useRef)(null),[i,j]=(0,e.useState)([]),[k,l]=(0,e.useState)(!1),[m,n]=(0,e.useState)(!1),o=(0,e.useCallback)(a=>{let b=Array.from(a).map(a=>({file:a,id:`${a.name}-${Date.now()}-${Math.random()}`,status:"pending",progress:0}));j(a=>[...a,...b])},[]),p=(0,e.useCallback)(a=>{a.preventDefault(),l(!1),a.dataTransfer.files&&a.dataTransfer.files.length>0&&o(a.dataTransfer.files)},[o]),q=(0,e.useCallback)(a=>{a.preventDefault(),l(!0)},[]),r=(0,e.useCallback)(a=>{a.preventDefault(),l(!1)},[]),s=async()=>{if(0!==i.length){n(!0);try{let a=i.map(a=>a.file);await c(a),j(a=>a.map(a=>({...a,status:"success",progress:100}))),f&&f(),setTimeout(()=>{b(!1),j([])},1500)}catch(a){j(b=>b.map(b=>({...b,status:"error",error:a.message||"Upload failed"})))}finally{n(!1)}}};return(0,d.jsx)(y.Dialog,{open:a,onOpenChange:b,children:(0,d.jsxs)(y.DialogContent,{className:"max-w-2xl max-h-[80vh] flex flex-col",children:[(0,d.jsx)(y.DialogHeader,{children:(0,d.jsxs)(y.DialogTitle,{className:"flex items-center gap-2",children:[(0,d.jsx)(A.Upload,{className:"h-5 w-5"}),"Upload Files",i.length>0&&(0,d.jsxs)(x.Badge,{variant:"secondary",className:"ml-2",children:[i.length," file",i.length>1?"s":""]})]})}),(0,d.jsxs)("div",{className:"flex-1 overflow-y-auto space-y-4 py-4",children:[(0,d.jsxs)("div",{onDrop:p,onDragOver:q,onDragLeave:r,className:(0,F.cn)("border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",k?"border-blue-500 bg-blue-50 dark:bg-blue-950":"border-gray-300 hover:border-gray-400 dark:border-gray-700"),onClick:()=>h.current?.click(),children:[(0,d.jsx)(A.Upload,{className:"h-12 w-12 mx-auto mb-4 text-gray-400"}),(0,d.jsx)("p",{className:"text-lg font-medium mb-2",children:"Drop files here or click to browse"}),(0,d.jsx)("p",{className:"text-sm text-gray-500",children:"Support for multiple files upload"}),(0,d.jsx)("input",{ref:h,type:"file",multiple:!0,className:"hidden",onChange:a=>{a.target.files&&a.target.files.length>0&&o(a.target.files)}})]}),i.length>0&&(0,d.jsxs)("div",{className:"space-y-2",children:[(0,d.jsx)("h3",{className:"text-sm font-medium",children:"Files to upload:"}),(0,d.jsx)("div",{className:"space-y-2 max-h-[300px] overflow-y-auto",children:i.map(a=>(0,d.jsxs)("div",{className:"flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg",children:[(a=>{switch(a){case"success":return(0,d.jsx)(D.CheckCircle,{className:"h-4 w-4 text-green-500"});case"error":return(0,d.jsx)(E.AlertCircle,{className:"h-4 w-4 text-red-500"});case"uploading":return(0,d.jsx)("div",{className:"h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"});default:return(0,d.jsx)(C.default,{className:"h-4 w-4 text-gray-400"})}})(a.status),(0,d.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,d.jsx)("p",{className:"text-sm font-medium truncate",children:a.file.name}),(0,d.jsx)("p",{className:"text-xs text-gray-500",children:(a=>{if(0===a)return"0 Bytes";let b=Math.floor(Math.log(a)/Math.log(1024));return Math.round(a/Math.pow(1024,b)*100)/100+" "+["Bytes","KB","MB","GB"][b]})(a.file.size)}),"uploading"===a.status&&(0,d.jsx)(z.Progress,{value:a.progress,className:"h-1 mt-2"}),a.error&&(0,d.jsx)("p",{className:"text-xs text-red-500 mt-1",children:a.error})]}),(a=>{switch(a){case"success":return(0,d.jsx)(x.Badge,{variant:"default",className:"bg-green-500",children:"Success"});case"error":return(0,d.jsx)(x.Badge,{variant:"destructive",children:"Error"});case"uploading":return(0,d.jsx)(x.Badge,{variant:"secondary",children:"Uploading..."});default:return(0,d.jsx)(x.Badge,{variant:"outline",children:"Pending"})}})(a.status),"pending"===a.status&&!m&&(0,d.jsx)(v.Button,{variant:"ghost",size:"sm",onClick:()=>{var b;return b=a.id,void j(a=>a.filter(a=>a.id!==b))},className:"h-8 w-8 p-0",children:(0,d.jsx)(B.X,{className:"h-4 w-4"})})]},a.id))})]})]}),(0,d.jsxs)(y.DialogFooter,{className:"gap-2",children:[(0,d.jsx)(v.Button,{variant:"outline",onClick:()=>{b(!1),j([])},disabled:m,children:"Cancel"}),(0,d.jsx)(v.Button,{onClick:s,disabled:0===i.length||m,children:m?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("div",{className:"h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"}),"Uploading..."]}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(A.Upload,{className:"h-4 w-4 mr-2"}),"Upload ",i.length," file",i.length>1?"s":""]})})]})]})})};a.s(["UploadDialog",0,G],507092);var H=a.i(961670),I=a.i(609153),J=a.i(629432),K=a.i(878931),L=a.i(571698),M=a.i(458007),N=a.i(897794);a.s(["Music",()=>N.default],649810);var N=N,O=a.i(473515),P=a.i(253322),Q=a.i(558767),R=a.i(515678),S=a.i(785903),T=a.i(723989),U=a.i(519732),V=a.i(751075),W=a.i(234211);function X({onSelect:a,allowMultiple:b=!1,folderId:c,fileTypes:f,viewMode:g,sortBy:h,searchQuery:i,filter:j,limit:k=20}){let[l,m]=(0,e.useState)("grid"),[n,p]=(0,e.useState)(""),[y,z]=(0,e.useState)(new Set),[B,C]=(0,e.useState)(1),[D,E]=(0,e.useState)(!1),{toast:F}=(0,W.useToast)(),X=g||l,Y=void 0!==i?i:n,Z=h||{field:"date",order:"desc"},{files:$,loading:_,refetch:aa}=o({page:B,limit:k,filters:{...c&&{folderId:c},...Y&&{search:Y},...j?.type&&{fileType:j.type},...f&&f.length>0&&!j?.type&&{fileType:f[0]}},sortBy:"name"===Z.field?"filename":"date"===Z.field?"createdAt":"size",sortOrder:Z.order}),{uploadFile:ab,uploadFiles:ac,uploading:ad}=q(),{deleteFile:ae}=r(),{bulkDeleteFiles:af}=s(),ag=(0,e.useCallback)(async a=>{try{let b=Array.from(a);1===b.length?await ab(b[0],c):await ac(b,c),F({type:"success",title:"Success",description:`${b.length} file(s) uploaded successfully`}),aa(),E(!1)}catch(a){F({type:"error",title:"Error",description:a.message||"Failed to upload files",variant:"destructive"})}},[ab,ac,c,aa,F]),ah=(0,e.useCallback)(a=>{a.preventDefault();let b=a.dataTransfer.files;b.length>0&&ag(b)},[ag]),ai=(0,e.useCallback)(a=>{a.preventDefault()},[]),aj=a=>{let c=new Set(y);c.has(a)?c.delete(a):(b||c.clear(),c.add(a)),z(c)},ak=async a=>{if(confirm("Are you sure you want to delete this file?"))try{await ae(a),F({type:"success",title:"Success",description:"File deleted successfully"}),aa()}catch(a){F({type:"error",title:"Error",description:a.message||"Failed to delete file",variant:"destructive"})}},al=async()=>{if(0!==y.size&&confirm(`Delete ${y.size} selected file(s)?`))try{await af({fileIds:Array.from(y)}),F({type:"success",title:"Success",description:`${y.size} file(s) deleted successfully`}),z(new Set),aa()}catch(a){F({type:"error",title:"Error",description:a.message||"Failed to delete files",variant:"destructive"})}},am=a=>{switch(a){case t.IMAGE:return(0,d.jsx)(L.Image,{className:"w-5 h-5"});case t.VIDEO:return(0,d.jsx)(M.Video,{className:"w-5 h-5"});case t.AUDIO:return(0,d.jsx)(N.default,{className:"w-5 h-5"});case t.DOCUMENT:return(0,d.jsx)(O.FileText,{className:"w-5 h-5"});case t.ARCHIVE:return(0,d.jsx)(P.Archive,{className:"w-5 h-5"});default:return(0,d.jsx)(K.File,{className:"w-5 h-5"})}},an=a=>{if(0===a)return"0 Bytes";let b=Math.floor(Math.log(a)/Math.log(1024));return Math.round(a/Math.pow(1024,b)*100)/100+" "+["Bytes","KB","MB","GB"][b]};return(0,d.jsxs)("div",{className:"w-full h-full flex flex-col",children:[void 0===g&&void 0===i&&(0,d.jsx)(u.Card,{className:"mb-4",children:(0,d.jsx)(u.CardContent,{className:"p-4",children:(0,d.jsxs)("div",{className:"flex items-center justify-between gap-4",children:[(0,d.jsx)("div",{className:"flex-1 max-w-md",children:(0,d.jsxs)("div",{className:"relative",children:[(0,d.jsx)(J.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"}),(0,d.jsx)(w.Input,{placeholder:"Search files...",value:n,onChange:a=>p(a.target.value),className:"pl-10"})]})}),(0,d.jsxs)("div",{className:"flex items-center gap-2",children:[(0,d.jsxs)(v.Button,{variant:"default",size:"sm",disabled:ad,onClick:()=>E(!0),children:[(0,d.jsx)(A.Upload,{className:"w-4 h-4 mr-2"}),"Upload"]}),y.size>0&&(0,d.jsxs)(v.Button,{variant:"destructive",size:"sm",onClick:al,children:[(0,d.jsx)(Q.Trash2,{className:"w-4 h-4 mr-2"}),"Delete (",y.size,")"]}),(0,d.jsx)(v.Button,{variant:"outline",size:"sm",onClick:()=>aa(),children:(0,d.jsx)(U.RefreshCw,{className:"w-4 h-4"})}),(0,d.jsxs)("div",{className:"flex border rounded-md",children:[(0,d.jsx)(v.Button,{variant:"grid"===X?"default":"ghost",size:"sm",onClick:()=>m("grid"),className:"rounded-r-none",children:(0,d.jsx)(H.Grid3x3,{className:"w-4 h-4"})}),(0,d.jsx)(v.Button,{variant:"list"===X?"default":"ghost",size:"sm",onClick:()=>m("list"),className:"rounded-l-none",children:(0,d.jsx)(I.List,{className:"w-4 h-4"})})]})]})]})})}),(0,d.jsx)(G,{open:D,onOpenChange:E,onUpload:ag,onUploadSuccess:()=>{aa(),E(!1)},folderId:c}),(0,d.jsx)("div",{onDrop:ah,onDragOver:ai,className:"flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-900",children:_?(0,d.jsx)("div",{className:"flex items-center justify-center h-full",children:(0,d.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})}):$&&$.items.length>0?(0,d.jsxs)(d.Fragment,{children:["grid"===X&&(0,d.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",children:$.items.map(a=>(0,d.jsx)(u.Card,{className:`cursor-pointer hover:shadow-lg transition-shadow ${y.has(a.id)?"ring-2 ring-blue-500":""}`,onClick:()=>aj(a.id),children:(0,d.jsxs)(u.CardContent,{className:"p-4",children:[(0,d.jsx)("div",{className:"aspect-square bg-gray-100 dark:bg-gray-800 rounded-md mb-3 flex items-center justify-center overflow-hidden",children:a.fileType===t.IMAGE?(0,d.jsx)("img",{src:a.url,alt:a.originalName,className:"w-full h-full object-cover"}):(0,d.jsx)("div",{className:"text-gray-400",children:am(a.fileType)})}),(0,d.jsxs)("div",{className:"space-y-1",children:[(0,d.jsx)("p",{className:"text-sm font-medium truncate",title:a.originalName,children:a.originalName}),(0,d.jsx)("p",{className:"text-xs text-gray-500",children:an(a.size)})]}),(0,d.jsxs)("div",{className:"flex items-center justify-between mt-3",children:[(0,d.jsx)(x.Badge,{variant:"secondary",className:"text-xs",children:a.fileType}),(0,d.jsxs)(V.DropdownMenu,{children:[(0,d.jsx)(V.DropdownMenuTrigger,{asChild:!0,onClick:a=>a.stopPropagation(),children:(0,d.jsx)(v.Button,{variant:"ghost",size:"sm",className:"h-6 w-6 p-0",children:(0,d.jsx)(T.MoreVertical,{className:"w-4 h-4"})})}),(0,d.jsxs)(V.DropdownMenuContent,{align:"end",children:[(0,d.jsxs)(V.DropdownMenuItem,{onClick:b=>{b.stopPropagation(),window.open(a.url,"_blank")},children:[(0,d.jsx)(S.Eye,{className:"w-4 h-4 mr-2"}),"View"]}),(0,d.jsxs)(V.DropdownMenuItem,{onClick:b=>{b.stopPropagation(),window.open(a.url,"_blank")},children:[(0,d.jsx)(R.Download,{className:"w-4 h-4 mr-2"}),"Download"]}),(0,d.jsx)(V.DropdownMenuSeparator,{}),(0,d.jsxs)(V.DropdownMenuItem,{onClick:b=>{b.stopPropagation(),ak(a.id)},className:"text-red-600",children:[(0,d.jsx)(Q.Trash2,{className:"w-4 h-4 mr-2"}),"Delete"]})]})]})]})]})},a.id))}),"list"===X&&(0,d.jsx)("div",{className:"space-y-2",children:$.items.map(a=>(0,d.jsx)(u.Card,{className:`cursor-pointer hover:shadow-md transition-shadow ${y.has(a.id)?"ring-2 ring-blue-500":""}`,onClick:()=>aj(a.id),children:(0,d.jsx)(u.CardContent,{className:"p-4",children:(0,d.jsxs)("div",{className:"flex items-center justify-between",children:[(0,d.jsxs)("div",{className:"flex items-center gap-4 flex-1",children:[(0,d.jsx)("div",{className:"text-gray-400",children:am(a.fileType)}),(0,d.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,d.jsx)("p",{className:"font-medium truncate",children:a.originalName}),(0,d.jsxs)("div",{className:"flex items-center gap-4 text-sm text-gray-500",children:[(0,d.jsx)("span",{children:an(a.size)}),(0,d.jsx)("span",{children:new Date(a.createdAt).toLocaleDateString()}),(0,d.jsx)(x.Badge,{variant:"secondary",children:a.fileType})]})]})]}),(0,d.jsxs)(V.DropdownMenu,{children:[(0,d.jsx)(V.DropdownMenuTrigger,{asChild:!0,onClick:a=>a.stopPropagation(),children:(0,d.jsx)(v.Button,{variant:"ghost",size:"sm",children:(0,d.jsx)(T.MoreVertical,{className:"w-4 h-4"})})}),(0,d.jsxs)(V.DropdownMenuContent,{align:"end",children:[(0,d.jsxs)(V.DropdownMenuItem,{onClick:b=>{b.stopPropagation(),window.open(a.url,"_blank")},children:[(0,d.jsx)(S.Eye,{className:"w-4 h-4 mr-2"}),"View"]}),(0,d.jsxs)(V.DropdownMenuItem,{onClick:b=>{b.stopPropagation(),window.open(a.url,"_blank")},children:[(0,d.jsx)(R.Download,{className:"w-4 h-4 mr-2"}),"Download"]}),(0,d.jsx)(V.DropdownMenuSeparator,{}),(0,d.jsxs)(V.DropdownMenuItem,{onClick:b=>{b.stopPropagation(),ak(a.id)},className:"text-red-600",children:[(0,d.jsx)(Q.Trash2,{className:"w-4 h-4 mr-2"}),"Delete"]})]})]})]})})},a.id))}),$.totalPages>1&&(0,d.jsxs)("div",{className:"flex items-center justify-center gap-2 mt-6",children:[(0,d.jsx)(v.Button,{variant:"outline",size:"sm",disabled:!$.hasPreviousPage,onClick:()=>C(B-1),children:"Previous"}),(0,d.jsxs)("span",{className:"text-sm text-gray-600",children:["Page ",$.page," of ",$.totalPages]}),(0,d.jsx)(v.Button,{variant:"outline",size:"sm",disabled:!$.hasNextPage,onClick:()=>C(B+1),children:"Next"})]})]}):(0,d.jsxs)("div",{className:"flex flex-col items-center justify-center h-full text-gray-400",children:[(0,d.jsx)(A.Upload,{className:"w-16 h-16 mb-4"}),(0,d.jsx)("p",{className:"text-lg font-medium mb-2",children:"No files yet"}),(0,d.jsx)("p",{className:"text-sm mb-4",children:"Drop files here or click upload button"})]})})]})}a.s(["FileManager",()=>X],772429)}];

//# sourceMappingURL=frontend_src_components_file-manager_FileManager_tsx_2d2a4c71._.js.map