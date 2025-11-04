(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(873273),s=a.forwardRef((e,a)=>(0,t.jsx)(i.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));s.displayName="Label";var r=e.i(541428);function l({className:e,...a}){return(0,t.jsx)(s,{"data-slot":"label",className:(0,r.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>l],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(541428);let s=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("textarea",{className:(0,i.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:s,...a}));s.displayName="Textarea",e.s(["Textarea",()=>s])},138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},553082,e=>{"use strict";var t=e.i(813046);e.s(["Save",()=>t.default])},320309,e=>{"use strict";var t=e.i(366456);e.s(["UserPlus",()=>t.default])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),i=e.i(403055),s=e.i(984804);let r=s.gql`
  query GetEmployeeProfile($id: ID!) {
    employeeProfile(id: $id) {
      id
      userId
      employeeCode
      fullName
      displayName
      citizenId
      citizenIdIssueDate
      citizenIdIssuePlace
      passportNumber
      passportIssueDate
      passportExpiryDate
      dateOfBirth
      placeOfBirth
      gender
      maritalStatus
      nationality
      personalEmail
      personalPhone
      permanentAddress
      currentAddress
      city
      district
      ward
      postalCode
      emergencyContactName
      emergencyContactRelationship
      emergencyContactPhone
      emergencyContactAddress
      education
      certifications
      skills
      languages
      bankName
      bankAccountNumber
      bankAccountName
      bankBranch
      taxCode
      socialInsuranceNumber
      healthInsuranceNumber
      department
      position
      level
      team
      directManager
      startDate
      probationEndDate
      contractType
      workLocation
      salaryGrade
      isActive
      notes
      createdAt
      updatedAt
      createdBy
      updatedBy
      user {
        id
        email
        username
        firstName
        lastName
        avatar
        isActive
      }
    }
  }
`;s.gql`
  query GetEmployeeProfileByUserId($userId: ID!) {
    employeeProfileByUserId(userId: $userId) {
      id
      userId
      employeeCode
      fullName
      displayName
      department
      position
      level
      team
      directManager
      startDate
      probationEndDate
      contractType
      workLocation
      isActive
      user {
        id
        email
        username
        firstName
        lastName
        avatar
        isActive
      }
    }
  }
`;let l=s.gql`
  query ListEmployeeProfiles(
    $department: String
    $position: String
    $isActive: Boolean
    $skip: Int
    $take: Int
  ) {
    listEmployeeProfiles(
      department: $department
      position: $position
      isActive: $isActive
      skip: $skip
      take: $take
    ) {
      employees {
        id
        userId
        employeeCode
        fullName
        displayName
        department
        position
        level
        startDate
        isActive
        user {
          id
          email
          username
          firstName
          lastName
          avatar
        }
      }
      total
      hasMore
    }
  }
`,o=s.gql`
  mutation CreateEmployeeProfile($input: CreateEmployeeProfileInput!) {
    createEmployeeProfile(input: $input) {
      id
      userId
      employeeCode
      fullName
      department
      position
      startDate
      isActive
    }
  }
`,n=s.gql`
  mutation UpdateEmployeeProfile($id: ID!, $input: UpdateEmployeeProfileInput!) {
    updateEmployeeProfile(id: $id, input: $input) {
      id
      userId
      employeeCode
      fullName
      displayName
      department
      position
      level
      team
      isActive
      updatedAt
    }
  }
`,d=s.gql`
  mutation DeleteEmployeeProfile($id: ID!) {
    deleteEmployeeProfile(id: $id) {
      success
      message
    }
  }
`;s.gql`
  query GetEmploymentHistory($employeeProfileId: ID!) {
    employmentHistory(employeeProfileId: $employeeProfileId) {
      id
      employeeProfileId
      userId
      eventType
      eventDate
      effectiveDate
      previousValue
      newValue
      fromPosition
      toPosition
      fromDepartment
      toDepartment
      fromLevel
      toLevel
      contractType
      contractNumber
      contractStartDate
      contractEndDate
      salaryChangePercentage
      newSalaryGrade
      terminationType
      terminationReason
      lastWorkingDay
      noticePeriodDays
      documentIds
      approvalStatus
      approvedBy
      approvedAt
      notes
      internalNotes
      processedBy
      createdAt
      updatedAt
    }
  }
`;let c=s.gql`
  query GetOnboardingChecklist($id: ID!) {
    onboardingChecklist(id: $id) {
      id
      employeeProfileId
      userId
      checklistTemplate
      tasks
      totalTasks
      completedTasks
      progressPercentage
      status
      startDate
      targetDate
      actualCompletionDate
      assignedTo
      buddyId
      remindersSent
      lastReminderAt
      employeeFeedback
      managerFeedback
      hrNotes
      createdAt
      updatedAt
      createdBy
      employeeProfile {
        id
        fullName
        employeeCode
        department
        position
        user {
          id
          email
          username
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;s.gql`
  query GetOnboardingChecklistByEmployee($employeeProfileId: ID!) {
    onboardingChecklistByEmployee(employeeProfileId: $employeeProfileId) {
      id
      employeeProfileId
      userId
      checklistTemplate
      tasks
      totalTasks
      completedTasks
      progressPercentage
      status
      startDate
      targetDate
      actualCompletionDate
      assignedTo
      buddyId
      remindersSent
      lastReminderAt
      employeeFeedback
      managerFeedback
      hrNotes
      createdAt
      updatedAt
      employeeProfile {
        id
        fullName
        employeeCode
        department
        position
      }
    }
  }
`;let u=s.gql`
  query ListOnboardingChecklists($status: OnboardingStatus, $skip: Int, $take: Int) {
    listOnboardingChecklists(status: $status, skip: $skip, take: $take) {
      checklists {
        id
        employeeProfileId
        userId
        totalTasks
        completedTasks
        progressPercentage
        status
        startDate
        targetDate
        actualCompletionDate
        assignedTo
        createdAt
        employeeProfile {
          id
          fullName
          employeeCode
          department
          position
          user {
            id
            username
            firstName
            lastName
            avatar
          }
        }
      }
      total
      hasMore
    }
  }
`,p=s.gql`
  mutation CreateOnboardingChecklist($input: CreateOnboardingChecklistInput!) {
    createOnboardingChecklist(input: $input) {
      id
      employeeProfileId
      userId
      tasks
      totalTasks
      status
      startDate
      targetDate
      createdAt
    }
  }
`,m=s.gql`
  mutation UpdateOnboardingChecklist($id: ID!, $input: UpdateOnboardingChecklistInput!) {
    updateOnboardingChecklist(id: $id, input: $input) {
      id
      tasks
      totalTasks
      completedTasks
      progressPercentage
      status
      actualCompletionDate
      updatedAt
    }
  }
`,y=s.gql`
  mutation CompleteOnboardingTask($checklistId: ID!, $taskId: ID!) {
    completeOnboardingTask(checklistId: $checklistId, taskId: $taskId) {
      id
      tasks
      completedTasks
      progressPercentage
      status
      updatedAt
    }
  }
`,h=s.gql`
  query GetOffboardingProcess($id: ID!) {
    offboardingProcess(id: $id) {
      id
      employeeProfileId
      userId
      lastWorkingDay
      effectiveDate
      exitReason
      exitType
      resignationLetter
      noticePeriodDays
      noticeGivenDate
      noticeRequired
      assetReturnChecklist
      knowledgeTransferPlan
      accessRevocationList
      exitInterviewScheduled
      exitInterviewDate
      exitInterviewBy
      exitInterviewNotes
      exitInterviewForm
      finalSalaryAmount
      unusedLeaveDays
      leavePayoutAmount
      bonusAmount
      deductions
      totalSettlement
      paymentDate
      paymentStatus
      clearanceStatus
      clearanceSteps
      referenceLetterRequested
      referenceLetterProvided
      experienceCertificate
      finalDocuments
      eligibleForRehire
      rehireNotes
      status
      approvalWorkflow
      finalApprovedBy
      finalApprovedAt
      initiatedBy
      processOwner
      completedAt
      completedBy
      hrNotes
      managerComments
      employeeComments
      createdAt
      updatedAt
      employeeProfile {
        id
        fullName
        employeeCode
        department
        position
        user {
          id
          email
          username
          firstName
          lastName
          avatar
        }
      }
    }
  }
`,f=s.gql`
  query ListOffboardingProcesses(
    $status: OffboardingStatus
    $clearanceStatus: ClearanceStatus
    $skip: Int
    $take: Int
  ) {
    listOffboardingProcesses(
      status: $status
      clearanceStatus: $clearanceStatus
      skip: $skip
      take: $take
    ) {
      processes {
        id
        employeeProfileId
        userId
        lastWorkingDay
        effectiveDate
        exitReason
        exitType
        status
        clearanceStatus
        initiatedBy
        processOwner
        createdAt
        employeeProfile {
          id
          fullName
          employeeCode
          department
          position
          user {
            id
            username
            firstName
            lastName
            avatar
          }
        }
      }
      total
      hasMore
    }
  }
`,g=s.gql`
  mutation CreateOffboardingProcess($input: CreateOffboardingProcessInput!) {
    createOffboardingProcess(input: $input) {
      id
      employeeProfileId
      userId
      lastWorkingDay
      exitReason
      exitType
      status
      clearanceStatus
      createdAt
    }
  }
`,b=s.gql`
  mutation UpdateOffboardingProcess($id: ID!, $input: UpdateOffboardingProcessInput!) {
    updateOffboardingProcess(id: $id, input: $input) {
      id
      lastWorkingDay
      exitReason
      exitType
      status
      clearanceStatus
      finalSalaryAmount
      totalSettlement
      paymentStatus
      updatedAt
    }
  }
`,v=s.gql`
  mutation CompleteOffboarding($id: ID!) {
    completeOffboarding(id: $id) {
      id
      status
      clearanceStatus
      completedAt
      completedBy
    }
  }
`,k=s.gql`
  query GetHRStatistics {
    hrStatistics {
      totalEmployees
      activeEmployees
      inactiveEmployees
      onboarding {
        pending
        inProgress
        total
      }
      offboarding {
        pending
        inProgress
        total
      }
    }
  }
`,C=s.gql`
  query GetEmployeeDocument($id: ID!) {
    employeeDocument(id: $id) {
      id
      employeeProfileId
      userId
      documentType
      title
      description
      fileId
      fileName
      fileUrl
      fileSize
      fileMimeType
      documentNumber
      issueDate
      expiryDate
      issuingAuthority
      isVerified
      verifiedBy
      verifiedAt
      notes
      createdAt
      updatedAt
    }
  }
`,x=s.gql`
  query ListEmployeeDocuments($employeeProfileId: ID!, $documentType: DocumentType, $skip: Int, $take: Int) {
    employeeDocuments(employeeProfileId: $employeeProfileId, documentType: $documentType, skip: $skip, take: $take) {
      documents {
        id
        employeeProfileId
        userId
        documentType
        title
        description
        fileId
        fileName
        fileUrl
        fileSize
        fileMimeType
        documentNumber
        issueDate
        expiryDate
        issuingAuthority
        isVerified
        verifiedBy
        verifiedAt
        createdAt
        updatedAt
      }
      total
      hasMore
    }
  }
`,I=s.gql`
  mutation CreateEmployeeDocument($input: CreateEmployeeDocumentInput!) {
    createEmployeeDocument(input: $input) {
      id
      employeeProfileId
      documentType
      title
      description
      fileId
      fileName
      fileUrl
      fileSize
      fileMimeType
      documentNumber
      issueDate
      expiryDate
      issuingAuthority
      isVerified
      createdAt
    }
  }
`,P=s.gql`
  mutation UpdateEmployeeDocument($id: ID!, $input: UpdateEmployeeDocumentInput!) {
    updateEmployeeDocument(id: $id, input: $input) {
      id
      title
      description
      documentNumber
      issueDate
      expiryDate
      issuingAuthority
      isVerified
      verifiedBy
      verifiedAt
      notes
      updatedAt
    }
  }
`,D=s.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(v,{refetchQueries:[f,k]});return{completeOffboarding:(0,i.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:s}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(y);return{completeOnboardingTask:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{checklistId:t,taskId:a}});return i.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:s}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(I,{refetchQueries:[x]});return{createDocument:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:s}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(o,{refetchQueries:[l,k]});return{createEmployeeProfile:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:s,error:r,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(g,{refetchQueries:[f,k]});return{createOffboardingProcess:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:s,error:r,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(p,{refetchQueries:[u,k]});return{createOnboardingChecklist:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:s,error:r,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(D,{refetchQueries:[x]});return{deleteDocument:(0,i.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:s}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(d,{refetchQueries:[l,k]});return{deleteEmployeeProfile:(0,i.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:s}},"useEmployeeDocuments",0,(e,a)=>{let{data:s,loading:r,error:l,refetch:o,fetchMore:n}=(0,t.useQuery)(x,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,i.useCallback)(async()=>{s?.employeeDocuments.hasMore&&await n({variables:{skip:s.employeeDocuments.documents.length}})},[n,s]);return{documents:s?.employeeDocuments.documents||[],total:s?.employeeDocuments.total||0,hasMore:s?.employeeDocuments.hasMore||!1,loading:r,error:l,refetch:o,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:i,error:s,refetch:l}=(0,t.useQuery)(r,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:i,error:s,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:a,loading:s,error:r,refetch:o,fetchMore:n}=(0,t.useQuery)(l,{variables:e}),d=(0,i.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&n({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,n,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:s,error:r,refetch:o,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:i,refetch:s}=(0,t.useQuery)(k);return{statistics:e?.hrStatistics,loading:a,error:i,refetch:s}},"useOffboardingProcess",0,e=>{let{data:a,loading:i,error:s,refetch:r}=(0,t.useQuery)(h,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:i,error:s,refetch:r}},"useOffboardingProcesses",0,e=>{let{data:a,loading:s,error:r,refetch:l,fetchMore:o}=(0,t.useQuery)(f,{variables:e}),n=(0,i.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&o({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,o,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:s,error:r,refetch:l,loadMore:n}},"useOnboardingChecklist",0,e=>{let{data:a,loading:i,error:s,refetch:r}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:i,error:s,refetch:r}},"useOnboardingChecklists",0,e=>{let{data:a,loading:s,error:r,refetch:l,fetchMore:o}=(0,t.useQuery)(u,{variables:e}),n=(0,i.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&o({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,o,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:s,error:r,refetch:l,loadMore:n}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(P,{refetchQueries:[x,C]});return{updateDocument:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:s}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(n);return{updateEmployeeProfile:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:s,error:r,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(b);return{updateOffboardingProcess:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:s,error:r,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(m);return{updateOnboardingChecklist:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:s,error:r,data:t?.updateOnboardingChecklist}}],598626)},928652,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(130775),s=e.i(598626),r=e.i(775680),l=e.i(885205),o=e.i(696134),n=e.i(165429),d=e.i(600547),c=e.i(183194),u=e.i(4993),p=e.i(519647),m=e.i(320309),y=e.i(606443),h=e.i(138227),f=e.i(553082),g=e.i(579448);function b(){let e=(0,i.useRouter)(),{toast:b}=(0,u.useToast)(),{employees:v,loading:k}=(0,s.useEmployeeProfiles)({take:100}),{createOnboardingChecklist:C,loading:x}=(0,s.useCreateOnboardingChecklist)(),[I,P]=(0,a.useState)({employeeProfileId:"",userId:"",startDate:new Date().toISOString().split("T")[0],targetDate:"",assignedTo:"",buddyId:"",hrNotes:""}),[D,N]=(0,a.useState)([{title:"Nhận tài khoản email và các công cụ làm việc",description:"",completed:!1},{title:"Hoàn thành các giấy tờ nhân sự",description:"",completed:!1},{title:"Tham gia buổi định hướng công ty",description:"",completed:!1},{title:"Gặp gỡ và làm quen với đội ngũ",description:"",completed:!1},{title:"Thiết lập môi trường làm việc",description:"",completed:!1}]),$=(e,t,a)=>{let i=[...D];i[e]={...i[e],[t]:a},N(i)},j=async t=>{if(t.preventDefault(),!I.employeeProfileId||!I.userId)return void b({title:"Lỗi",description:"Vui lòng chọn nhân viên",type:"error"});if(0===D.filter(e=>e.title).length)return void b({title:"Lỗi",description:"Vui lòng thêm ít nhất một công việc",type:"error"});try{let t=D.filter(e=>e.title);await C({...I,tasks:t,totalTasks:t.length}),b({title:"Thành công",description:"Đã tạo onboarding checklist mới",type:"success"}),e.push("/admin/hr/onboarding")}catch(e){b({title:"Lỗi",description:e.message||"Không thể tạo onboarding checklist",type:"error"})}};return(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsx)(g.default,{href:"/admin/hr/onboarding",children:(0,t.jsx)(l.Button,{variant:"ghost",size:"icon",children:(0,t.jsx)(p.ArrowLeft,{className:"h-5 w-5"})})}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-3xl font-bold tracking-tight flex items-center",children:[(0,t.jsx)(m.UserPlus,{className:"mr-3 h-8 w-8"}),"Tạo Onboarding Mới"]}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Thiết lập quy trình nhập môn cho nhân viên mới"})]})]}),(0,t.jsxs)("form",{onSubmit:j,className:"space-y-6",children:[(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsx)(r.CardTitle,{children:"Thông tin nhân viên"}),(0,t.jsx)(r.CardDescription,{children:"Chọn nhân viên cần onboarding"})]}),(0,t.jsx)(r.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"employee",children:"Nhân viên *"}),(0,t.jsxs)(c.Select,{value:I.employeeProfileId,onValueChange:e=>{let t=v.find(t=>t.id===e);t&&P({...I,employeeProfileId:e,userId:t.userId})},disabled:k,children:[(0,t.jsx)(c.SelectTrigger,{children:(0,t.jsx)(c.SelectValue,{placeholder:"Chọn nhân viên..."})}),(0,t.jsx)(c.SelectContent,{children:v.map(e=>(0,t.jsxs)(c.SelectItem,{value:e.id,children:[e.fullName," - ",e.employeeCode]},e.id))})]})]})})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{children:"Thời gian"})}),(0,t.jsx)(r.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"startDate",children:"Ngày bắt đầu *"}),(0,t.jsx)(o.Input,{id:"startDate",type:"date",value:I.startDate,onChange:e=>P({...I,startDate:e.target.value}),required:!0})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"targetDate",children:"Ngày mục tiêu hoàn thành"}),(0,t.jsx)(o.Input,{id:"targetDate",type:"date",value:I.targetDate,onChange:e=>P({...I,targetDate:e.target.value})})]})]})})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{children:"Phân công"})}),(0,t.jsx)(r.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"assignedTo",children:"Người phụ trách"}),(0,t.jsx)(o.Input,{id:"assignedTo",placeholder:"Tên người phụ trách...",value:I.assignedTo,onChange:e=>P({...I,assignedTo:e.target.value})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"buddyId",children:"Buddy (người hướng dẫn)"}),(0,t.jsx)(o.Input,{id:"buddyId",placeholder:"Tên buddy...",value:I.buddyId,onChange:e=>P({...I,buddyId:e.target.value})})]})]})})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsxs)(r.CardTitle,{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{children:"Danh sách công việc"}),(0,t.jsxs)(l.Button,{type:"button",variant:"outline",size:"sm",onClick:()=>{N([...D,{title:"",description:"",completed:!1}])},children:[(0,t.jsx)(y.Plus,{className:"mr-2 h-4 w-4"}),"Thêm công việc"]})]}),(0,t.jsx)(r.CardDescription,{children:"Tạo danh sách các công việc cần hoàn thành trong quá trình onboarding"})]}),(0,t.jsx)(r.CardContent,{className:"space-y-4",children:D.map((e,a)=>(0,t.jsxs)("div",{className:"p-4 border rounded-lg space-y-3",children:[(0,t.jsxs)("div",{className:"flex justify-between items-start",children:[(0,t.jsxs)("h4",{className:"font-medium",children:["Công việc #",a+1]}),D.length>1&&(0,t.jsx)(l.Button,{type:"button",variant:"ghost",size:"sm",onClick:()=>{N(D.filter((e,t)=>t!==a))},children:(0,t.jsx)(h.Trash2,{className:"h-4 w-4 text-red-500"})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:`task-title-${a}`,children:"Tiêu đề *"}),(0,t.jsx)(o.Input,{id:`task-title-${a}`,placeholder:"Nhập tiêu đề công việc...",value:e.title,onChange:e=>$(a,"title",e.target.value),required:!0})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:`task-description-${a}`,children:"Mô tả"}),(0,t.jsx)(d.Textarea,{id:`task-description-${a}`,placeholder:"Mô tả chi tiết công việc...",value:e.description,onChange:e=>$(a,"description",e.target.value),rows:2})]})]},a))})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{children:"Ghi chú HR"})}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)(d.Textarea,{id:"hrNotes",rows:4,placeholder:"Ghi chú cho quá trình onboarding...",value:I.hrNotes,onChange:e=>P({...I,hrNotes:e.target.value})})})]}),(0,t.jsxs)("div",{className:"flex justify-end space-x-4",children:[(0,t.jsx)(l.Button,{type:"button",variant:"outline",onClick:()=>e.back(),disabled:x,children:"Hủy"}),(0,t.jsxs)(l.Button,{type:"submit",disabled:x,children:[(0,t.jsx)(f.Save,{className:"mr-2 h-4 w-4"}),x?"Đang tạo...":"Tạo Onboarding"]})]})]})]})}e.s(["default",()=>b])}]);