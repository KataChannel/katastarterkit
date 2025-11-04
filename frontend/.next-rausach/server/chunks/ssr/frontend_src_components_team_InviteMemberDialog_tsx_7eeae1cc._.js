module.exports=[269011,535430,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(755820),e=a.i(730705),f=a.i(202979),g=a.i(478184),h=a.i(441405),i=a.i(144932),j=a.i(140300),k=a.i(607226),l=a.i(733554),m=a.i(629432),n=a.i(234211),o=a.i(563718),p=a.i(772213);function q({open:a,onOpenChange:q,onInvite:r,loading:s=!1,projects:t,selectedProjectId:u,onProjectChange:v}){let[w,x]=(0,c.useState)(""),[y,z]=(0,c.useState)("MEMBER"),[A,B]=(0,c.useState)(""),[C,D]=(0,c.useState)(!1),[E,F]=(0,c.useState)(""),[G,H]=(0,c.useState)(null),[I,J]=(0,c.useState)(""),[K,L]=(0,c.useState)(!1),[M,N]=(0,c.useState)(null),[O,P]=(0,c.useState)(!1),[Q,R]=(0,c.useState)(!1),[S,T]=(0,c.useState)(null),{toast:U}=(0,n.useToast)(),V=(0,o.useApolloClient)();c.default.useEffect(()=>{u&&B(u)},[u]),c.default.useEffect(()=>{H(null),J(""),N(null)},[w]);let W=c.default.useMemo(()=>!!w.trim()&&!E&&!!G&&!!y&&(!t||!(t.length>0)||!!A),[w,E,G,y,t,A]),X=async()=>{if(!w.trim())return void U({title:"⚠️ Email trống",description:"Vui lòng nhập email trước khi kiểm tra",type:"error",variant:"destructive"});if(E)return void U({title:"⚠️ Email không hợp lệ",description:"Vui lòng nhập đúng định dạng email",type:"error",variant:"destructive"});L(!0);try{let{data:a}=await V.query({query:p.gql`
          query FindUserByEmail($input: UnifiedFindManyInput, $modelName: String!) {
            findMany(modelName: $modelName, input: $input)
          }
        `,variables:{modelName:"user",input:{where:{email:{equals:w.trim().toLowerCase()}},select:{id:!0,firstName:!0,lastName:!0,email:!0}}},fetchPolicy:"network-only"}),b=a?.findMany;if("string"==typeof b)try{b=JSON.parse(b)}catch(a){console.error("[InviteMemberDialog] JSON parse error:",a),U({title:"❌ Lỗi dữ liệu",description:"Không thể xử lý dữ liệu từ server",type:"error",variant:"destructive"});return}if(!b||!Array.isArray(b)||0===b.length){U({title:"❌ Người dùng không tồn tại",description:`Email "${w}" chưa được đăng k\xfd trong hệ thống. Vui l\xf2ng mời người d\xf9ng đăng k\xfd trước.`,type:"warning",variant:"destructive"}),H(null),J(""),N(null);return}let c=b[0];if(!c?.id||"string"!=typeof c.id||""===c.id.trim()){U({title:"❌ Lỗi dữ liệu người dùng",description:"ID người dùng không hợp lệ",type:"error",variant:"destructive"}),H(null),J(""),N(null);return}let d=[c.firstName,c.lastName].filter(Boolean).join(" ")||"Không có tên",e=c.id.trim();H(e),J(d);let f=A||u;if(f){P(!0);try{let{data:a}=await V.query({query:p.gql`
              query CheckProjectMembership($input: UnifiedFindManyInput, $modelName: String!) {
                findMany(modelName: $modelName, input: $input)
              }
            `,variables:{modelName:"projectMember",input:{where:{AND:[{projectId:{equals:f}},{userId:{equals:e}}]},select:{id:!0,role:!0}}},fetchPolicy:"network-only"}),b=a?.findMany;if("string"==typeof b)try{b=JSON.parse(b)}catch(a){console.error("[InviteMemberDialog] Member parse error:",a)}if(b&&Array.isArray(b)&&b.length>0){let a=b[0].role||"MEMBER";N(a),U({title:"⚠️ Người dùng đã là thành viên",description:`${d} đ\xe3 tham gia dự \xe1n với vai tr\xf2 ${Y(a)}. Bạn c\xf3 thể thay đổi vai tr\xf2.`,type:"warning",variant:"default"})}else N(null),U({title:"✅ Tìm thấy người dùng",description:`${d} (${c.email}) chưa tham gia dự \xe1n n\xe0y.`,type:"success",variant:"default"})}catch(a){console.error("[InviteMemberDialog] Check membership error:",a),N(null),U({title:"✅ Tìm thấy người dùng",description:`${d} (${c.email})`,type:"success",variant:"default"})}finally{P(!1)}}else N(null),U({title:"✅ Tìm thấy người dùng",description:`${d} (${c.email})`,type:"success",variant:"default"})}catch(a){console.error("[InviteMemberDialog] Validate user error:",a),U({title:"❌ Lỗi kiểm tra",description:a instanceof Error?a.message:"Không thể kiểm tra email",type:"error",variant:"destructive"}),H(null),J(""),N(null)}finally{L(!1)}},Y=a=>({OWNER:"Owner",ADMIN:"Admin",MEMBER:"Member"})[a.toUpperCase()]||a,Z=async a=>{if(a.preventDefault(),!w||!y)return void U({title:"Lỗi",description:"Vui lòng nhập email và chọn vai trò",type:"error",variant:"destructive"});if(!G)return void U({title:"⚠️ Chưa kiểm tra người dùng",description:"Vui lòng nhấn nút tìm kiếm để kiểm tra email trước",type:"warning",variant:"destructive"});if(t&&t.length>0&&!A)return void U({title:"Lỗi",description:"Vui lòng chọn dự án",type:"error",variant:"destructive"});if(M){let a=Y(M),b=Y(y);return M.toUpperCase()===y.toUpperCase()?void U({title:"ℹ️ Vai trò giống nhau",description:`${I} đ\xe3 c\xf3 vai tr\xf2 ${a} trong dự \xe1n n\xe0y.`,type:"info",variant:"default"}):(T({userName:I,currentRole:a,newRole:b}),void R(!0))}await $()},$=async()=>{D(!0);try{await r(w,y,A||void 0,G||void 0),x(""),z("MEMBER"),H(null),J(""),N(null),R(!1),T(null)}catch(a){console.error("[InviteMemberDialog] Error:",a)}finally{D(!1)}},_=async()=>{R(!1),await $()};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(d.Dialog,{open:a,onOpenChange:q,children:(0,b.jsxs)(d.DialogContent,{className:"sm:max-w-[425px]",children:[(0,b.jsxs)(d.DialogHeader,{children:[(0,b.jsxs)(d.DialogTitle,{className:"flex items-center gap-2",children:[(0,b.jsx)(k.UserPlus,{className:"h-5 w-5"}),"Mời thành viên"]}),(0,b.jsx)(d.DialogDescription,{children:"Nhập email và chọn vai trò cho thành viên mới"})]}),(0,b.jsxs)("form",{onSubmit:Z,children:[(0,b.jsxs)("div",{className:"grid gap-4 p-4 max-h-[60vh] overflow-y-auto",children:[t&&t.length>0&&(0,b.jsxs)("div",{className:"grid gap-2",children:[(0,b.jsx)(h.Label,{htmlFor:"project",children:"Dự án"}),(0,b.jsxs)(i.Select,{value:A,onValueChange:a=>{B(a),v?.(a)},disabled:C||s,children:[(0,b.jsx)(i.SelectTrigger,{id:"project",children:(0,b.jsx)(i.SelectValue,{placeholder:"Chọn dự án"})}),(0,b.jsx)(i.SelectContent,{children:t.map(a=>(0,b.jsx)(i.SelectItem,{value:a.id,children:a.name},a.id))})]})]}),(0,b.jsxs)("div",{className:"grid gap-2",children:[(0,b.jsxs)(h.Label,{htmlFor:"email",children:["Email ",(0,b.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)("div",{className:"relative flex-1",children:[(0,b.jsx)(j.Mail,{className:"absolute left-3 top-3 h-4 w-4 text-muted-foreground"}),(0,b.jsx)(g.Input,{id:"email",type:"email",placeholder:"member@example.com",value:w,onChange:a=>{let b=a.target.value;(x(b),b.trim())?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.trim())?F(""):F("Email không hợp lệ"):F("")},className:`pl-9 pr-10 ${w&&E?"border-red-500":w&&!E?"border-green-500":""}`,disabled:C||s||K,autoComplete:"off",required:!0}),w&&(0,b.jsx)("div",{className:"absolute right-3 top-3",children:E?(0,b.jsx)("span",{className:"text-red-500 text-lg leading-none",children:"✖"}):(0,b.jsx)("span",{className:"text-green-500 text-lg leading-none",children:"✓"})})]}),(0,b.jsx)(f.Button,{type:"button",variant:"outline",size:"icon",onClick:X,disabled:!w||!!E||K||C||s,title:"Kiểm tra email",className:"shrink-0",children:K?(0,b.jsx)(l.Loader2,{className:"h-4 w-4 animate-spin"}):(0,b.jsx)(m.Search,{className:"h-4 w-4"})})]}),G&&I&&(0,b.jsxs)("div",{className:`flex items-center gap-2 p-2 rounded-md ${M?"bg-amber-50 border border-amber-200":"bg-green-50 border border-green-200"}`,children:[(0,b.jsx)("span",{className:`text-sm ${M?"text-amber-600":"text-green-600"}`,children:M?"⚠️":"✓"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("span",{className:`text-sm font-medium ${M?"text-amber-800":"text-green-800"}`,children:I}),M?(0,b.jsxs)("span",{className:"text-xs text-amber-600 ml-2",children:["- Vai trò hiện tại: ",Y(M)]}):(0,b.jsx)("span",{className:"text-xs text-green-600 ml-2",children:"- Chưa tham gia dự án"})]}),O&&(0,b.jsx)(l.Loader2,{className:"h-3 w-3 animate-spin text-muted-foreground"})]}),E&&(0,b.jsxs)("p",{className:"text-xs text-red-500 flex items-center gap-1",children:[(0,b.jsx)("span",{children:"⚠️"}),(0,b.jsx)("span",{children:E})]}),!E&&!G&&(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"💡 Nhập email và nhấn nút tìm kiếm để kiểm tra"})]}),(0,b.jsxs)("div",{className:"grid gap-2",children:[(0,b.jsx)(h.Label,{htmlFor:"role",children:"Vai trò"}),(0,b.jsxs)(i.Select,{value:y,onValueChange:z,disabled:C||s,children:[(0,b.jsx)(i.SelectTrigger,{id:"role",children:(0,b.jsx)(i.SelectValue,{placeholder:"Chọn vai trò"})}),(0,b.jsxs)(i.SelectContent,{children:[(0,b.jsx)(i.SelectItem,{value:"OWNER",children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("span",{className:"font-medium",children:"Owner"}),(0,b.jsx)("span",{className:"text-xs text-muted-foreground",children:"- Toàn quyền"})]})}),(0,b.jsx)(i.SelectItem,{value:"ADMIN",children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("span",{className:"font-medium",children:"Admin"}),(0,b.jsx)("span",{className:"text-xs text-muted-foreground",children:"- Quản lý dự án"})]})}),(0,b.jsx)(i.SelectItem,{value:"MEMBER",children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("span",{className:"font-medium",children:"Member"}),(0,b.jsx)("span",{className:"text-xs text-muted-foreground",children:"- Thành viên"})]})})]})]})]}),(0,b.jsx)("div",{className:"rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm",children:(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)("span",{className:"text-amber-600 flex-shrink-0",children:"⚠️"}),(0,b.jsxs)("div",{className:"text-amber-800 space-y-1",children:[(0,b.jsx)("p",{className:"font-medium",children:"Lưu ý quan trọng:"}),(0,b.jsxs)("ul",{className:"list-disc list-inside space-y-0.5 text-xs",children:[(0,b.jsxs)("li",{children:["Nhấn nút ",(0,b.jsx)("strong",{children:"tìm kiếm"})," để kiểm tra email"]}),(0,b.jsx)("li",{children:"Hệ thống sẽ kiểm tra người dùng có tồn tại không"}),(0,b.jsx)("li",{children:"Nếu đã là thành viên, bạn có thể thay đổi vai trò"}),(0,b.jsx)("li",{children:"Nếu chưa có tài khoản, mời người dùng đăng ký trước"})]})]})]})})]}),(0,b.jsxs)(d.DialogFooter,{children:[(0,b.jsx)(f.Button,{type:"button",variant:"outline",onClick:()=>{x(""),z("MEMBER"),H(null),J(""),N(null),q(!1)},disabled:C||s,children:"Hủy"}),(0,b.jsxs)(f.Button,{type:"submit",disabled:!W||C||s,children:[(C||s)&&(0,b.jsx)(l.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}),C?"Đang xử lý...":"Thêm thành viên"]})]})]})]})}),(0,b.jsx)(e.AlertDialog,{open:Q,onOpenChange:R,children:(0,b.jsxs)(e.AlertDialogContent,{children:[(0,b.jsx)(e.AlertDialogHeader,{children:(0,b.jsx)(e.AlertDialogTitle,{className:"flex items-center gap-2",children:"🔄 Thay đổi vai trò"})}),(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)("div",{className:"text-sm",children:[(0,b.jsx)("span",{className:"font-medium",children:"Người dùng:"})," ",S?.userName]}),(0,b.jsxs)("div",{className:"text-sm",children:[(0,b.jsx)("span",{className:"font-medium",children:"Vai trò hiện tại:"})," ",(0,b.jsx)("span",{className:"text-amber-600",children:S?.currentRole})]}),(0,b.jsxs)("div",{className:"text-sm",children:[(0,b.jsx)("span",{className:"font-medium",children:"Vai trò mới:"})," ",(0,b.jsx)("span",{className:"text-green-600",children:S?.newRole})]})]}),(0,b.jsx)("div",{className:"text-sm font-medium",children:"Bạn có chắc chắn muốn thay đổi vai trò không?"})]}),(0,b.jsxs)(e.AlertDialogFooter,{children:[(0,b.jsx)(e.AlertDialogCancel,{onClick:()=>{R(!1),T(null)},children:"Hủy"}),(0,b.jsx)(e.AlertDialogAction,{onClick:_,children:"Xác nhận thay đổi"})]})]})})]})}a.s(["InviteMemberDialog",()=>q],269011),a.i(168918);var r=a.i(8912);let s=p.gql`
  fragment ProjectFields on Project {
    id
    name
    description
    avatar
    isArchived
    ownerId
    createdAt
    updatedAt
    owner {
      id
      firstName
      lastName
      avatar
      email
    }
    members {
      id
      userId
      role
      joinedAt
      user {
        id
        firstName
        lastName
        avatar
        email
      }
    }
    _count {
      tasks
      chatMessages
    }
  }
`,t=p.gql`
  fragment ProjectMemberFields on ProjectMember {
    id
    userId
    projectId
    role
    joinedAt
    user {
      id
      firstName
      lastName
      avatar
      email
    }
  }
`;p.gql`
  ${s}
  query GetMyProjects($includeArchived: Boolean = false) {
    myProjects(includeArchived: $includeArchived) {
      ...ProjectFields
    }
  }
`;let u=p.gql`
  ${s}
  query GetProject($id: ID!) {
    project(id: $id) {
      ...ProjectFields
    }
  }
`,v=p.gql`
  ${t}
  query GetProjectMembers($projectId: ID!) {
    projectMembers(projectId: $projectId) {
      ...ProjectMemberFields
    }
  }
`;p.gql`
  ${s}
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      ...ProjectFields
    }
  }
`,p.gql`
  ${s}
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      ...ProjectFields
    }
  }
`,p.gql`
  ${s}
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      ...ProjectFields
    }
  }
`;let w=p.gql`
  ${t}
  mutation AddProjectMember($projectId: ID!, $input: AddMemberInput!) {
    addProjectMember(projectId: $projectId, input: $input) {
      ...ProjectMemberFields
    }
  }
`;p.gql`
  mutation RemoveProjectMember($projectId: ID!, $memberId: ID!) {
    removeProjectMember(projectId: $projectId, memberId: $memberId)
  }
`,p.gql`
  ${t}
  mutation UpdateProjectMemberRole($projectId: ID!, $input: UpdateMemberRoleInput!) {
    updateProjectMemberRole(projectId: $projectId, input: $input) {
      ...ProjectMemberFields
    }
  }
`,a.s(["useAddMember",0,()=>(0,r.useMutation)(w,{refetchQueries:[u,v]})],535430)}];

//# sourceMappingURL=frontend_src_components_team_InviteMemberDialog_tsx_7eeae1cc._.js.map