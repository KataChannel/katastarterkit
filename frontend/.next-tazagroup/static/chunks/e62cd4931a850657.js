(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(873273),i=a.forwardRef((e,a)=>(0,t.jsx)(s.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));i.displayName="Label";var r=e.i(541428);function l({className:e,...a}){return(0,t.jsx)(i,{"data-slot":"label",className:(0,r.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>l],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("textarea",{className:(0,s.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...a}));i.displayName="Textarea",e.s(["Textarea",()=>i])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},553082,e=>{"use strict";var t=e.i(813046);e.s(["Save",()=>t.default])},320309,e=>{"use strict";var t=e.i(366456);e.s(["UserPlus",()=>t.default])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),s=e.i(403055),i=e.i(984804);let r=i.gql`
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
`;i.gql`
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
`;let l=i.gql`
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
`,n=i.gql`
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
`,o=i.gql`
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
`,d=i.gql`
  mutation DeleteEmployeeProfile($id: ID!) {
    deleteEmployeeProfile(id: $id) {
      success
      message
    }
  }
`;i.gql`
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
`;let c=i.gql`
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
`;i.gql`
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
`;let u=i.gql`
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
`,m=i.gql`
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
`,p=i.gql`
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
`,h=i.gql`
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
`,y=i.gql`
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
`,f=i.gql`
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
`,g=i.gql`
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
`,b=i.gql`
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
`,x=i.gql`
  mutation CompleteOffboarding($id: ID!) {
    completeOffboarding(id: $id) {
      id
      status
      clearanceStatus
      completedAt
      completedBy
    }
  }
`,v=i.gql`
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
`,j=i.gql`
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
`,C=i.gql`
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
`,I=i.gql`
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
`,k=i.gql`
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
`,N=i.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:i}]=(0,a.useMutation)(x,{refetchQueries:[f,v]});return{completeOffboarding:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:i}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:i}]=(0,a.useMutation)(h);return{completeOnboardingTask:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{checklistId:t,taskId:a}});return s.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:i}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:i}]=(0,a.useMutation)(I,{refetchQueries:[C]});return{createDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:i}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:i,error:r}]=(0,a.useMutation)(n,{refetchQueries:[l,v]});return{createEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:i,error:r,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:i,error:r}]=(0,a.useMutation)(g,{refetchQueries:[f,v]});return{createOffboardingProcess:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:i,error:r,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:i,error:r}]=(0,a.useMutation)(m,{refetchQueries:[u,v]});return{createOnboardingChecklist:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:i,error:r,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:i}]=(0,a.useMutation)(N,{refetchQueries:[C]});return{deleteDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:i}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:i}]=(0,a.useMutation)(d,{refetchQueries:[l,v]});return{deleteEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:i}},"useEmployeeDocuments",0,(e,a)=>{let{data:i,loading:r,error:l,refetch:n,fetchMore:o}=(0,t.useQuery)(C,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,s.useCallback)(async()=>{i?.employeeDocuments.hasMore&&await o({variables:{skip:i.employeeDocuments.documents.length}})},[o,i]);return{documents:i?.employeeDocuments.documents||[],total:i?.employeeDocuments.total||0,hasMore:i?.employeeDocuments.hasMore||!1,loading:r,error:l,refetch:n,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:s,error:i,refetch:l}=(0,t.useQuery)(r,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:s,error:i,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:a,loading:i,error:r,refetch:n,fetchMore:o}=(0,t.useQuery)(l,{variables:e}),d=(0,s.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&o({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,o,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:i,error:r,refetch:n,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:s,refetch:i}=(0,t.useQuery)(v);return{statistics:e?.hrStatistics,loading:a,error:s,refetch:i}},"useOffboardingProcess",0,e=>{let{data:a,loading:s,error:i,refetch:r}=(0,t.useQuery)(y,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:s,error:i,refetch:r}},"useOffboardingProcesses",0,e=>{let{data:a,loading:i,error:r,refetch:l,fetchMore:n}=(0,t.useQuery)(f,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&n({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,n,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:i,error:r,refetch:l,loadMore:o}},"useOnboardingChecklist",0,e=>{let{data:a,loading:s,error:i,refetch:r}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:s,error:i,refetch:r}},"useOnboardingChecklists",0,e=>{let{data:a,loading:i,error:r,refetch:l,fetchMore:n}=(0,t.useQuery)(u,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&n({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,n,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:i,error:r,refetch:l,loadMore:o}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:i}]=(0,a.useMutation)(k,{refetchQueries:[C,j]});return{updateDocument:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:i}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:i,error:r}]=(0,a.useMutation)(o);return{updateEmployeeProfile:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:i,error:r,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:i,error:r}]=(0,a.useMutation)(b);return{updateOffboardingProcess:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:i,error:r,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:i,error:r}]=(0,a.useMutation)(p);return{updateOnboardingChecklist:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:i,error:r,data:t?.updateOnboardingChecklist}}],598626)},142400,e=>{"use strict";var t=e.i(44990),a=e.i(130775),s=e.i(746814),i=e.i(775680),r=e.i(885205),l=e.i(696134),n=e.i(165429),o=e.i(600547),d=e.i(183194),c=e.i(4993),u=e.i(553082),m=e.i(888540);function p({employee:e,onSubmit:p,loading:h,mode:y}){let f=(0,a.useRouter)(),{toast:g}=(0,c.useToast)(),{register:b,handleSubmit:x,control:v,formState:{errors:j}}=(0,s.useForm)({defaultValues:e?{userId:e.userId,employeeCode:e.employeeCode,fullName:e.fullName,displayName:e.displayName||"",citizenId:e.citizenId||"",dateOfBirth:e.dateOfBirth||"",placeOfBirth:e.placeOfBirth||"",gender:e.gender||"MALE",maritalStatus:e.maritalStatus||"SINGLE",nationality:e.nationality||"",personalEmail:e.personalEmail||"",personalPhone:e.personalPhone||"",currentAddress:e.currentAddress||"",city:e.city||"",district:e.district||"",ward:e.ward||"",department:e.department||"",position:e.position||"",level:e.level||"",team:e.team||"",directManager:e.directManager||"",startDate:e.startDate||"",probationEndDate:e.probationEndDate||"",contractType:e.contractType||"FULL_TIME",workLocation:e.workLocation||"",taxCode:e.taxCode||"",bankName:e.bankName||"",bankAccountNumber:e.bankAccountNumber||"",bankAccountName:e.bankAccountName||"",emergencyContactName:e.emergencyContactName||"",emergencyContactRelationship:e.emergencyContactRelationship||"",emergencyContactPhone:e.emergencyContactPhone||"",notes:e.notes||""}:{userId:"",employeeCode:"",fullName:"",displayName:"",gender:"MALE",maritalStatus:"SINGLE",contractType:"FULL_TIME"}}),C=async e=>{try{await p(e),g({title:"Thành công",description:"create"===y?"Đã tạo nhân viên mới":"Đã cập nhật thông tin nhân viên",type:"success"}),f.push("/admin/hr/employees")}catch(e){g({title:"Lỗi",description:e.message||"Không thể lưu thông tin nhân viên",type:"error"})}};return(0,t.jsxs)("form",{onSubmit:x(C),className:"space-y-6",children:[(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsx)(i.CardTitle,{children:"Thông tin cơ bản"})}),(0,t.jsx)(i.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"employeeCode",children:"Mã nhân viên *"}),(0,t.jsx)(l.Input,{id:"employeeCode",...b("employeeCode",{required:"Mã nhân viên là bắt buộc"}),disabled:"edit"===y}),j.employeeCode&&(0,t.jsx)("p",{className:"text-sm text-red-500",children:j.employeeCode.message})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"userId",children:"User ID *"}),(0,t.jsx)(l.Input,{id:"userId",...b("userId",{required:"User ID là bắt buộc"}),disabled:"edit"===y}),j.userId&&(0,t.jsx)("p",{className:"text-sm text-red-500",children:j.userId.message})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"fullName",children:"Họ và tên *"}),(0,t.jsx)(l.Input,{id:"fullName",...b("fullName",{required:"Họ và tên là bắt buộc"})}),j.fullName&&(0,t.jsx)("p",{className:"text-sm text-red-500",children:j.fullName.message})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"displayName",children:"Tên hiển thị"}),(0,t.jsx)(l.Input,{id:"displayName",...b("displayName")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"gender",children:"Giới tính"}),(0,t.jsx)(s.Controller,{name:"gender",control:v,render:({field:e})=>(0,t.jsxs)(d.Select,{value:e.value,onValueChange:e.onChange,children:[(0,t.jsx)(d.SelectTrigger,{children:(0,t.jsx)(d.SelectValue,{})}),(0,t.jsxs)(d.SelectContent,{children:[(0,t.jsx)(d.SelectItem,{value:"MALE",children:"Nam"}),(0,t.jsx)(d.SelectItem,{value:"FEMALE",children:"Nữ"}),(0,t.jsx)(d.SelectItem,{value:"OTHER",children:"Khác"})]})]})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"dateOfBirth",children:"Ngày sinh"}),(0,t.jsx)(l.Input,{id:"dateOfBirth",type:"date",...b("dateOfBirth")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"maritalStatus",children:"Tình trạng hôn nhân"}),(0,t.jsx)(s.Controller,{name:"maritalStatus",control:v,render:({field:e})=>(0,t.jsxs)(d.Select,{value:e.value,onValueChange:e.onChange,children:[(0,t.jsx)(d.SelectTrigger,{children:(0,t.jsx)(d.SelectValue,{})}),(0,t.jsxs)(d.SelectContent,{children:[(0,t.jsx)(d.SelectItem,{value:"SINGLE",children:"Độc thân"}),(0,t.jsx)(d.SelectItem,{value:"MARRIED",children:"Đã kết hôn"}),(0,t.jsx)(d.SelectItem,{value:"DIVORCED",children:"Ly hôn"}),(0,t.jsx)(d.SelectItem,{value:"WIDOWED",children:"Góa"})]})]})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"citizenId",children:"CCCD/CMND"}),(0,t.jsx)(l.Input,{id:"citizenId",...b("citizenId")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"taxCode",children:"Mã số thuế"}),(0,t.jsx)(l.Input,{id:"taxCode",...b("taxCode")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"nationality",children:"Quốc tịch"}),(0,t.jsx)(l.Input,{id:"nationality",...b("nationality"),defaultValue:"Việt Nam"})]})]})})]}),(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsx)(i.CardTitle,{children:"Thông tin liên hệ"})}),(0,t.jsx)(i.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"personalEmail",children:"Email cá nhân"}),(0,t.jsx)(l.Input,{id:"personalEmail",type:"email",...b("personalEmail")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"personalPhone",children:"Số điện thoại"}),(0,t.jsx)(l.Input,{id:"personalPhone",...b("personalPhone")})]}),(0,t.jsxs)("div",{className:"space-y-2 md:col-span-2",children:[(0,t.jsx)(n.Label,{htmlFor:"currentAddress",children:"Địa chỉ hiện tại"}),(0,t.jsx)(l.Input,{id:"currentAddress",...b("currentAddress")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"city",children:"Thành phố"}),(0,t.jsx)(l.Input,{id:"city",...b("city")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"district",children:"Quận/Huyện"}),(0,t.jsx)(l.Input,{id:"district",...b("district")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"ward",children:"Phường/Xã"}),(0,t.jsx)(l.Input,{id:"ward",...b("ward")})]})]})})]}),(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsx)(i.CardTitle,{children:"Thông tin công việc"})}),(0,t.jsx)(i.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"department",children:"Phòng ban"}),(0,t.jsx)(l.Input,{id:"department",...b("department")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"position",children:"Chức vụ"}),(0,t.jsx)(l.Input,{id:"position",...b("position")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"level",children:"Cấp bậc"}),(0,t.jsx)(l.Input,{id:"level",...b("level")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"team",children:"Nhóm/Team"}),(0,t.jsx)(l.Input,{id:"team",...b("team")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"directManager",children:"Quản lý trực tiếp"}),(0,t.jsx)(l.Input,{id:"directManager",...b("directManager")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"startDate",children:"Ngày bắt đầu"}),(0,t.jsx)(l.Input,{id:"startDate",type:"date",...b("startDate")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"probationEndDate",children:"Kết thúc thử việc"}),(0,t.jsx)(l.Input,{id:"probationEndDate",type:"date",...b("probationEndDate")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"contractType",children:"Loại hợp đồng"}),(0,t.jsx)(s.Controller,{name:"contractType",control:v,render:({field:e})=>(0,t.jsxs)(d.Select,{value:e.value,onValueChange:e.onChange,children:[(0,t.jsx)(d.SelectTrigger,{children:(0,t.jsx)(d.SelectValue,{})}),(0,t.jsxs)(d.SelectContent,{children:[(0,t.jsx)(d.SelectItem,{value:"FULL_TIME",children:"Toàn thời gian"}),(0,t.jsx)(d.SelectItem,{value:"PART_TIME",children:"Bán thời gian"}),(0,t.jsx)(d.SelectItem,{value:"CONTRACT",children:"Hợp đồng"}),(0,t.jsx)(d.SelectItem,{value:"INTERNSHIP",children:"Thực tập"}),(0,t.jsx)(d.SelectItem,{value:"PROBATION",children:"Thử việc"})]})]})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"workLocation",children:"Địa điểm làm việc"}),(0,t.jsx)(l.Input,{id:"workLocation",...b("workLocation")})]})]})})]}),(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsx)(i.CardTitle,{children:"Thông tin ngân hàng"})}),(0,t.jsx)(i.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"bankName",children:"Ngân hàng"}),(0,t.jsx)(l.Input,{id:"bankName",...b("bankName")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"bankAccountNumber",children:"Số tài khoản"}),(0,t.jsx)(l.Input,{id:"bankAccountNumber",...b("bankAccountNumber")})]}),(0,t.jsxs)("div",{className:"space-y-2 md:col-span-2",children:[(0,t.jsx)(n.Label,{htmlFor:"bankAccountName",children:"Tên chủ tài khoản"}),(0,t.jsx)(l.Input,{id:"bankAccountName",...b("bankAccountName")})]})]})})]}),(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsx)(i.CardTitle,{children:"Liên hệ khẩn cấp"})}),(0,t.jsx)(i.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"emergencyContactName",children:"Họ tên"}),(0,t.jsx)(l.Input,{id:"emergencyContactName",...b("emergencyContactName")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"emergencyContactRelationship",children:"Mối quan hệ"}),(0,t.jsx)(l.Input,{id:"emergencyContactRelationship",...b("emergencyContactRelationship")})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Label,{htmlFor:"emergencyContactPhone",children:"Số điện thoại"}),(0,t.jsx)(l.Input,{id:"emergencyContactPhone",...b("emergencyContactPhone")})]})]})})]}),(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsx)(i.CardTitle,{children:"Ghi chú"})}),(0,t.jsx)(i.CardContent,{children:(0,t.jsx)(o.Textarea,{id:"notes",rows:4,placeholder:"Thông tin bổ sung...",...b("notes")})})]}),(0,t.jsxs)("div",{className:"flex justify-end space-x-4",children:[(0,t.jsxs)(r.Button,{type:"button",variant:"outline",onClick:()=>f.back(),disabled:h,children:[(0,t.jsx)(m.X,{className:"mr-2 h-4 w-4"}),"Hủy"]}),(0,t.jsxs)(r.Button,{type:"submit",disabled:h,children:[(0,t.jsx)(u.Save,{className:"mr-2 h-4 w-4"}),h?"Đang lưu...":"create"===y?"Tạo mới":"Cập nhật"]})]})]})}e.s(["default",()=>p])},264135,e=>{"use strict";var t=e.i(44990),a=e.i(130775),s=e.i(598626),i=e.i(142400),r=e.i(885205),l=e.i(519647),n=e.i(320309),o=e.i(579448);function d(){(0,a.useRouter)();let{createEmployeeProfile:e,loading:d}=(0,s.useCreateEmployeeProfile)(),c=async t=>{await e(t)};return(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsx)(o.default,{href:"/admin/hr/employees",children:(0,t.jsx)(r.Button,{variant:"ghost",size:"icon",children:(0,t.jsx)(l.ArrowLeft,{className:"h-5 w-5"})})}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-3xl font-bold tracking-tight flex items-center",children:[(0,t.jsx)(n.UserPlus,{className:"mr-3 h-8 w-8"}),"Thêm nhân viên mới"]}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Điền thông tin để tạo hồ sơ nhân viên mới"})]})]}),(0,t.jsx)(i.default,{mode:"create",onSubmit:c,loading:d})]})}e.s(["default",()=>d])}]);