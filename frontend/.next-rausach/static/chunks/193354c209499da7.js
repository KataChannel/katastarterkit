(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(873273),r=a.forwardRef((e,a)=>(0,t.jsx)(i.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));r.displayName="Label";var s=e.i(541428);function l({className:e,...a}){return(0,t.jsx)(r,{"data-slot":"label",className:(0,s.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>l],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(541428);let r=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("textarea",{className:(0,i.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:r,...a}));r.displayName="Textarea",e.s(["Textarea",()=>r])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},553082,e=>{"use strict";var t=e.i(813046);e.s(["Save",()=>t.default])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),i=e.i(403055),r=e.i(984804);let s=r.gql`
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
`;r.gql`
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
`;let l=r.gql`
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
`,n=r.gql`
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
`,o=r.gql`
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
`,d=r.gql`
  mutation DeleteEmployeeProfile($id: ID!) {
    deleteEmployeeProfile(id: $id) {
      success
      message
    }
  }
`;r.gql`
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
`;let c=r.gql`
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
`;r.gql`
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
`;let u=r.gql`
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
`,p=r.gql`
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
`,m=r.gql`
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
`,h=r.gql`
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
`,y=r.gql`
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
`,f=r.gql`
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
`,g=r.gql`
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
`,v=r.gql`
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
`,b=r.gql`
  mutation CompleteOffboarding($id: ID!) {
    completeOffboarding(id: $id) {
      id
      status
      clearanceStatus
      completedAt
      completedBy
    }
  }
`,x=r.gql`
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
`,k=r.gql`
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
`,I=r.gql`
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
`,C=r.gql`
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
`,D=r.gql`
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
`,P=r.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(b,{refetchQueries:[f,x]});return{completeOffboarding:(0,i.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:r}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(h);return{completeOnboardingTask:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{checklistId:t,taskId:a}});return i.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(C,{refetchQueries:[I]});return{createDocument:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:s}]=(0,a.useMutation)(n,{refetchQueries:[l,x]});return{createEmployeeProfile:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:s,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:s}]=(0,a.useMutation)(g,{refetchQueries:[f,x]});return{createOffboardingProcess:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:s,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:s}]=(0,a.useMutation)(p,{refetchQueries:[u,x]});return{createOnboardingChecklist:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:s,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(P,{refetchQueries:[I]});return{deleteDocument:(0,i.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(d,{refetchQueries:[l,x]});return{deleteEmployeeProfile:(0,i.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:r}},"useEmployeeDocuments",0,(e,a)=>{let{data:r,loading:s,error:l,refetch:n,fetchMore:o}=(0,t.useQuery)(I,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,i.useCallback)(async()=>{r?.employeeDocuments.hasMore&&await o({variables:{skip:r.employeeDocuments.documents.length}})},[o,r]);return{documents:r?.employeeDocuments.documents||[],total:r?.employeeDocuments.total||0,hasMore:r?.employeeDocuments.hasMore||!1,loading:s,error:l,refetch:n,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:i,error:r,refetch:l}=(0,t.useQuery)(s,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:i,error:r,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:a,loading:r,error:s,refetch:n,fetchMore:o}=(0,t.useQuery)(l,{variables:e}),d=(0,i.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&o({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,o,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:r,error:s,refetch:n,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:i,refetch:r}=(0,t.useQuery)(x);return{statistics:e?.hrStatistics,loading:a,error:i,refetch:r}},"useOffboardingProcess",0,e=>{let{data:a,loading:i,error:r,refetch:s}=(0,t.useQuery)(y,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:i,error:r,refetch:s}},"useOffboardingProcesses",0,e=>{let{data:a,loading:r,error:s,refetch:l,fetchMore:n}=(0,t.useQuery)(f,{variables:e}),o=(0,i.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&n({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,n,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:r,error:s,refetch:l,loadMore:o}},"useOnboardingChecklist",0,e=>{let{data:a,loading:i,error:r,refetch:s}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:i,error:r,refetch:s}},"useOnboardingChecklists",0,e=>{let{data:a,loading:r,error:s,refetch:l,fetchMore:n}=(0,t.useQuery)(u,{variables:e}),o=(0,i.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&n({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,n,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:r,error:s,refetch:l,loadMore:o}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(D,{refetchQueries:[I,k]});return{updateDocument:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:s}]=(0,a.useMutation)(o);return{updateEmployeeProfile:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:s,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:s}]=(0,a.useMutation)(v);return{updateOffboardingProcess:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:s,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:s}]=(0,a.useMutation)(m);return{updateOnboardingChecklist:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:s,data:t?.updateOnboardingChecklist}}],598626)},172362,e=>{"use strict";var t=e.i(44990),a=e.i(403055);let i=a.forwardRef(({className:e,indeterminate:i,onCheckedChange:r,...s},l)=>{let n=a.useRef(null);return a.useImperativeHandle(l,()=>n.current),a.useEffect(()=>{n.current&&(n.current.indeterminate=!!i)},[i]),(0,t.jsx)("input",{type:"checkbox",ref:n,className:`h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500 ${e||""}`,onChange:e=>{r?.(e.target.checked),s.onChange?.(e)},...s})});i.displayName="Checkbox",e.s(["Checkbox",()=>i])},959675,e=>{"use strict";var t=e.i(763189);e.s(["UserMinus",()=>t.default])},609945,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(130775),r=e.i(598626),s=e.i(775680),l=e.i(885205),n=e.i(696134),o=e.i(165429),d=e.i(600547),c=e.i(183194),u=e.i(172362),p=e.i(4993),m=e.i(519647),h=e.i(959675),y=e.i(553082),f=e.i(579448);function g(){let e=(0,i.useRouter)(),{toast:g}=(0,p.useToast)(),{employees:v,loading:b}=(0,r.useEmployeeProfiles)({take:100}),{createOffboardingProcess:x,loading:k}=(0,r.useCreateOffboardingProcess)(),[I,C]=(0,a.useState)({employeeProfileId:"",userId:"",lastWorkingDay:"",effectiveDate:"",exitReason:"",exitType:"RESIGNATION",noticePeriodDays:30,noticeGivenDate:new Date().toISOString().split("T")[0],exitInterviewScheduled:!1,exitInterviewDate:"",exitInterviewBy:"",referenceLetterRequested:!1,eligibleForRehire:!0,initiatedBy:"",hrNotes:""}),D=async t=>{if(t.preventDefault(),!I.employeeProfileId||!I.userId)return void g({title:"Lỗi",description:"Vui lòng chọn nhân viên",type:"error"});if(!I.lastWorkingDay)return void g({title:"Lỗi",description:"Vui lòng nhập ngày cuối làm việc",type:"error"});if(!I.exitReason)return void g({title:"Lỗi",description:"Vui lòng nhập lý do nghỉ việc",type:"error"});if(!I.initiatedBy)return void g({title:"Lỗi",description:"Vui lòng nhập người khởi tạo",type:"error"});try{await x({employeeProfileId:I.employeeProfileId,userId:I.userId,lastWorkingDay:I.lastWorkingDay,effectiveDate:I.effectiveDate||void 0,exitReason:I.exitReason,exitType:I.exitType,noticePeriodDays:I.noticePeriodDays||void 0,noticeGivenDate:I.noticeGivenDate||void 0,exitInterviewScheduled:I.exitInterviewScheduled,exitInterviewDate:I.exitInterviewDate||void 0,exitInterviewBy:I.exitInterviewBy||void 0,referenceLetterRequested:I.referenceLetterRequested,eligibleForRehire:I.eligibleForRehire,initiatedBy:I.initiatedBy,hrNotes:I.hrNotes||void 0}),g({title:"Thành công",description:"Đã khởi tạo offboarding process",type:"success"}),e.push("/admin/hr/offboarding")}catch(e){g({title:"Lỗi",description:e.message||"Không thể khởi tạo offboarding",type:"error"})}};return(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsx)(f.default,{href:"/admin/hr/offboarding",children:(0,t.jsx)(l.Button,{variant:"ghost",size:"icon",children:(0,t.jsx)(m.ArrowLeft,{className:"h-5 w-5"})})}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-3xl font-bold tracking-tight flex items-center",children:[(0,t.jsx)(h.UserMinus,{className:"mr-3 h-8 w-8"}),"Khởi tạo Offboarding"]}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Bắt đầu quy trình nghỉ việc cho nhân viên"})]})]}),(0,t.jsxs)("form",{onSubmit:D,className:"space-y-6",children:[(0,t.jsxs)(s.Card,{children:[(0,t.jsxs)(s.CardHeader,{children:[(0,t.jsx)(s.CardTitle,{children:"Thông tin nhân viên"}),(0,t.jsx)(s.CardDescription,{children:"Chọn nhân viên cần offboarding"})]}),(0,t.jsx)(s.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"employee",children:"Nhân viên *"}),(0,t.jsxs)(c.Select,{value:I.employeeProfileId,onValueChange:e=>{let t=v.find(t=>t.id===e);t&&C({...I,employeeProfileId:e,userId:t.userId})},disabled:b,children:[(0,t.jsx)(c.SelectTrigger,{children:(0,t.jsx)(c.SelectValue,{placeholder:"Chọn nhân viên..."})}),(0,t.jsx)(c.SelectContent,{children:v.map(e=>(0,t.jsxs)(c.SelectItem,{value:e.id,children:[e.fullName," - ",e.employeeCode]},e.id))})]})]})})]}),(0,t.jsxs)(s.Card,{children:[(0,t.jsx)(s.CardHeader,{children:(0,t.jsx)(s.CardTitle,{children:"Thông tin nghỉ việc"})}),(0,t.jsxs)(s.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"exitType",children:"Loại nghỉ việc *"}),(0,t.jsxs)(c.Select,{value:I.exitType,onValueChange:e=>C({...I,exitType:e}),children:[(0,t.jsx)(c.SelectTrigger,{children:(0,t.jsx)(c.SelectValue,{})}),(0,t.jsxs)(c.SelectContent,{children:[(0,t.jsx)(c.SelectItem,{value:"RESIGNATION",children:"Từ chức"}),(0,t.jsx)(c.SelectItem,{value:"TERMINATION",children:"Chấm dứt hợp đồng"}),(0,t.jsx)(c.SelectItem,{value:"RETIREMENT",children:"Nghỉ hưu"}),(0,t.jsx)(c.SelectItem,{value:"CONTRACT_END",children:"Hết hợp đồng"}),(0,t.jsx)(c.SelectItem,{value:"MUTUAL_AGREEMENT",children:"Thỏa thuận chung"})]})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"lastWorkingDay",children:"Ngày cuối làm việc *"}),(0,t.jsx)(n.Input,{id:"lastWorkingDay",type:"date",value:I.lastWorkingDay,onChange:e=>C({...I,lastWorkingDay:e.target.value}),required:!0})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"effectiveDate",children:"Ngày có hiệu lực"}),(0,t.jsx)(n.Input,{id:"effectiveDate",type:"date",value:I.effectiveDate,onChange:e=>C({...I,effectiveDate:e.target.value})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"noticeGivenDate",children:"Ngày thông báo"}),(0,t.jsx)(n.Input,{id:"noticeGivenDate",type:"date",value:I.noticeGivenDate,onChange:e=>C({...I,noticeGivenDate:e.target.value})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"noticePeriodDays",children:"Thời gian báo trước (ngày)"}),(0,t.jsx)(n.Input,{id:"noticePeriodDays",type:"number",value:I.noticePeriodDays,onChange:e=>C({...I,noticePeriodDays:parseInt(e.target.value)})})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"exitReason",children:"Lý do nghỉ việc *"}),(0,t.jsx)(d.Textarea,{id:"exitReason",rows:3,placeholder:"Nhập lý do nghỉ việc...",value:I.exitReason,onChange:e=>C({...I,exitReason:e.target.value}),required:!0})]})]})]}),(0,t.jsxs)(s.Card,{children:[(0,t.jsx)(s.CardHeader,{children:(0,t.jsx)(s.CardTitle,{children:"Phỏng vấn nghỉ việc"})}),(0,t.jsxs)(s.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)(u.Checkbox,{id:"exitInterviewScheduled",checked:I.exitInterviewScheduled,onCheckedChange:e=>C({...I,exitInterviewScheduled:e})}),(0,t.jsx)(o.Label,{htmlFor:"exitInterviewScheduled",className:"cursor-pointer",children:"Lên lịch phỏng vấn nghỉ việc"})]}),I.exitInterviewScheduled&&(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mt-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"exitInterviewDate",children:"Ngày phỏng vấn"}),(0,t.jsx)(n.Input,{id:"exitInterviewDate",type:"date",value:I.exitInterviewDate,onChange:e=>C({...I,exitInterviewDate:e.target.value})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"exitInterviewBy",children:"Người phỏng vấn"}),(0,t.jsx)(n.Input,{id:"exitInterviewBy",placeholder:"Tên người phỏng vấn...",value:I.exitInterviewBy,onChange:e=>C({...I,exitInterviewBy:e.target.value})})]})]})]})]}),(0,t.jsxs)(s.Card,{children:[(0,t.jsx)(s.CardHeader,{children:(0,t.jsx)(s.CardTitle,{children:"Tùy chọn bổ sung"})}),(0,t.jsxs)(s.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)(u.Checkbox,{id:"referenceLetterRequested",checked:I.referenceLetterRequested,onCheckedChange:e=>C({...I,referenceLetterRequested:e})}),(0,t.jsx)(o.Label,{htmlFor:"referenceLetterRequested",className:"cursor-pointer",children:"Yêu cầu thư giới thiệu"})]}),(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)(u.Checkbox,{id:"eligibleForRehire",checked:I.eligibleForRehire,onCheckedChange:e=>C({...I,eligibleForRehire:e})}),(0,t.jsx)(o.Label,{htmlFor:"eligibleForRehire",className:"cursor-pointer",children:"Đủ điều kiện tái tuyển dụng"})]})]})]}),(0,t.jsxs)(s.Card,{children:[(0,t.jsx)(s.CardHeader,{children:(0,t.jsx)(s.CardTitle,{children:"Thông tin quy trình"})}),(0,t.jsxs)(s.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"initiatedBy",children:"Người khởi tạo *"}),(0,t.jsx)(n.Input,{id:"initiatedBy",placeholder:"Tên người khởi tạo quy trình...",value:I.initiatedBy,onChange:e=>C({...I,initiatedBy:e.target.value}),required:!0})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(o.Label,{htmlFor:"hrNotes",children:"Ghi chú HR"}),(0,t.jsx)(d.Textarea,{id:"hrNotes",rows:4,placeholder:"Ghi chú cho quá trình offboarding...",value:I.hrNotes,onChange:e=>C({...I,hrNotes:e.target.value})})]})]})]}),(0,t.jsxs)("div",{className:"flex justify-end space-x-4",children:[(0,t.jsx)(l.Button,{type:"button",variant:"outline",onClick:()=>e.back(),disabled:k,children:"Hủy"}),(0,t.jsxs)(l.Button,{type:"submit",disabled:k,children:[(0,t.jsx)(y.Save,{className:"mr-2 h-4 w-4"}),k?"Đang tạo...":"Khởi tạo Offboarding"]})]})]})]})}e.s(["default",()=>g])}]);