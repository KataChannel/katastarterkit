(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},173416,e=>{"use strict";var t=e.i(46034);e.s(["Filter",()=>t.default])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},741850,e=>{"use strict";var t=e.i(44990),a=e.i(403055);let s=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{className:"relative w-full overflow-auto",children:(0,t.jsx)("table",{ref:s,className:`w-full caption-bottom text-sm ${e||""}`,...a})}));s.displayName="Table";let r=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("thead",{ref:s,className:`[&_tr]:border-b ${e||""}`,...a}));r.displayName="TableHeader";let i=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("tbody",{ref:s,className:`[&_tr:last-child]:border-0 ${e||""}`,...a}));i.displayName="TableBody",a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("tfoot",{ref:s,className:`border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0 ${e||""}`,...a})).displayName="TableFooter";let l=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("tr",{ref:s,className:`border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 ${e||""}`,...a}));l.displayName="TableRow";let o=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("th",{ref:s,className:`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${e||""}`,...a}));o.displayName="TableHead";let n=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("td",{ref:s,className:`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${e||""}`,...a}));n.displayName="TableCell",a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("caption",{ref:s,className:`mt-4 text-sm text-gray-500 ${e||""}`,...a})).displayName="TableCaption",e.s(["Table",()=>s,"TableBody",()=>i,"TableCell",()=>n,"TableHead",()=>o,"TableHeader",()=>r,"TableRow",()=>l])},774309,e=>{"use strict";var t=e.i(44990);let a=e.i(403055).forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...a}));a.displayName="Skeleton",e.s(["Skeleton",()=>a])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),s=e.i(403055),r=e.i(984804);let i=r.gql`
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
`,o=r.gql`
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
`,n=r.gql`
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
`,m=r.gql`
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
`,p=r.gql`
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
`,f=r.gql`
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
`,h=r.gql`
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
`,b=r.gql`
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
`,C=r.gql`
  mutation CompleteOffboarding($id: ID!) {
    completeOffboarding(id: $id) {
      id
      status
      clearanceStatus
      completedAt
      completedBy
    }
  }
`,N=r.gql`
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
`,P=r.gql`
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
`,k=r.gql`
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
`,T=r.gql`
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
`,x=r.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(C,{refetchQueries:[h,N]});return{completeOffboarding:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:r}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(f);return{completeOnboardingTask:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{checklistId:t,taskId:a}});return s.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(k,{refetchQueries:[I]});return{createDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(o,{refetchQueries:[l,N]});return{createEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(g,{refetchQueries:[h,N]});return{createOffboardingProcess:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(m,{refetchQueries:[u,N]});return{createOnboardingChecklist:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(x,{refetchQueries:[I]});return{deleteDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(d,{refetchQueries:[l,N]});return{deleteEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:r}},"useEmployeeDocuments",0,(e,a)=>{let{data:r,loading:i,error:l,refetch:o,fetchMore:n}=(0,t.useQuery)(I,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,s.useCallback)(async()=>{r?.employeeDocuments.hasMore&&await n({variables:{skip:r.employeeDocuments.documents.length}})},[n,r]);return{documents:r?.employeeDocuments.documents||[],total:r?.employeeDocuments.total||0,hasMore:r?.employeeDocuments.hasMore||!1,loading:i,error:l,refetch:o,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:s,error:r,refetch:l}=(0,t.useQuery)(i,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:s,error:r,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:a,loading:r,error:i,refetch:o,fetchMore:n}=(0,t.useQuery)(l,{variables:e}),d=(0,s.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&n({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,n,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:r,error:i,refetch:o,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:s,refetch:r}=(0,t.useQuery)(N);return{statistics:e?.hrStatistics,loading:a,error:s,refetch:r}},"useOffboardingProcess",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(y,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:s,error:r,refetch:i}},"useOffboardingProcesses",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:o}=(0,t.useQuery)(h,{variables:e}),n=(0,s.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&o({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,o,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:r,error:i,refetch:l,loadMore:n}},"useOnboardingChecklist",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:s,error:r,refetch:i}},"useOnboardingChecklists",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:o}=(0,t.useQuery)(u,{variables:e}),n=(0,s.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&o({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,o,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:r,error:i,refetch:l,loadMore:n}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(T,{refetchQueries:[I,P]});return{updateDocument:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(n);return{updateEmployeeProfile:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(b);return{updateOffboardingProcess:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(p);return{updateOnboardingChecklist:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOnboardingChecklist}}],598626)},38915,e=>{"use strict";var t,a,s,r,i=((t={}).CV="CV",t.CONTRACT="CONTRACT",t.ID_CARD="ID_CARD",t.PASSPORT="PASSPORT",t.DEGREE="DEGREE",t.CERTIFICATE="CERTIFICATE",t.PHOTO="PHOTO",t.BANK_INFO="BANK_INFO",t.HEALTH_CERTIFICATE="HEALTH_CERTIFICATE",t.OTHER="OTHER",t),l=((a={}).PENDING="PENDING",a.IN_PROGRESS="IN_PROGRESS",a.COMPLETED="COMPLETED",a.CANCELLED="CANCELLED",a),o=((s={}).INITIATED="INITIATED",s.IN_PROGRESS="IN_PROGRESS",s.PENDING_APPROVAL="PENDING_APPROVAL",s.APPROVED="APPROVED",s.COMPLETED="COMPLETED",s.CANCELLED="CANCELLED",s),n=((r={}).PENDING="PENDING",r.PARTIAL="PARTIAL",r.COMPLETE="COMPLETE",r);e.s(["ClearanceStatus",()=>n,"DocumentType",()=>i,"OffboardingStatus",()=>o,"OnboardingStatus",()=>l])},959675,e=>{"use strict";var t=e.i(763189);e.s(["UserMinus",()=>t.default])},530499,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(598626),r=e.i(775680),i=e.i(885205),l=e.i(696134),o=e.i(702470),n=e.i(183194),d=e.i(741850),c=e.i(774309),u=e.i(959675),m=e.i(850384),p=e.i(173416),f=e.i(404210),y=e.i(435635),h=e.i(112641),g=e.i(415588),b=e.i(198513),C=e.i(257117),N=e.i(169100),P=e.i(579448),I=e.i(38915);function k(){let[e,k]=(0,a.useState)(""),[T,x]=(0,a.useState)("all"),{processes:v,loading:E,total:D,hasMore:O,loadMore:A}=(0,s.useOffboardingProcesses)({status:"all"===T?void 0:T,take:20}),$=v.filter(t=>t.employeeProfile?.fullName.toLowerCase().includes(e.toLowerCase())||t.employeeProfile?.employeeCode.toLowerCase().includes(e.toLowerCase()));return(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-3xl font-bold tracking-tight flex items-center",children:[(0,t.jsx)(u.UserMinus,{className:"mr-3 h-8 w-8"}),"Offboarding - Thôi việc"]}),(0,t.jsxs)("p",{className:"text-muted-foreground",children:["Quản lý ",D," quy trình offboarding nhân viên"]})]}),(0,t.jsx)(P.default,{href:"/admin/hr/offboarding/new",children:(0,t.jsxs)(i.Button,{children:[(0,t.jsx)(u.UserMinus,{className:"mr-2 h-4 w-4"}),"Khởi tạo offboarding"]})})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center text-lg",children:[(0,t.jsx)(p.Filter,{className:"mr-2 h-5 w-5"}),"Bộ lọc"]})}),(0,t.jsx)(r.CardContent,{children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(m.Search,{className:"absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"}),(0,t.jsx)(l.Input,{placeholder:"Tìm kiếm theo tên, mã NV...",value:e,onChange:e=>k(e.target.value),className:"pl-8"})]}),(0,t.jsxs)(n.Select,{value:T,onValueChange:e=>x(e),children:[(0,t.jsx)(n.SelectTrigger,{children:(0,t.jsx)(n.SelectValue,{placeholder:"Trạng thái"})}),(0,t.jsxs)(n.SelectContent,{children:[(0,t.jsx)(n.SelectItem,{value:"all",children:"Tất cả trạng thái"}),(0,t.jsx)(n.SelectItem,{value:"INITIATED",children:"Khởi tạo"}),(0,t.jsx)(n.SelectItem,{value:"IN_PROGRESS",children:"Đang xử lý"}),(0,t.jsx)(n.SelectItem,{value:"PENDING_APPROVAL",children:"Chờ phê duyệt"}),(0,t.jsx)(n.SelectItem,{value:"APPROVED",children:"Đã phê duyệt"}),(0,t.jsx)(n.SelectItem,{value:"COMPLETED",children:"Hoàn thành"}),(0,t.jsx)(n.SelectItem,{value:"CANCELLED",children:"Đã hủy"})]})]})]})})]}),(0,t.jsx)(r.Card,{children:(0,t.jsx)(r.CardContent,{className:"p-0",children:E?(0,t.jsx)("div",{className:"p-6 space-y-2",children:[1,2,3,4,5].map(e=>(0,t.jsx)(c.Skeleton,{className:"h-16 w-full"},e))}):0===$.length?(0,t.jsxs)("div",{className:"text-center py-12 text-muted-foreground",children:[(0,t.jsx)(u.UserMinus,{className:"mx-auto h-12 w-12 mb-2"}),(0,t.jsx)("p",{children:"Không tìm thấy quy trình offboarding nào"})]}):(0,t.jsxs)(d.Table,{children:[(0,t.jsx)(d.TableHeader,{children:(0,t.jsxs)(d.TableRow,{children:[(0,t.jsx)(d.TableHead,{children:"Nhân viên"}),(0,t.jsx)(d.TableHead,{children:"Lý do nghỉ việc"}),(0,t.jsx)(d.TableHead,{children:"Ngày cuối làm việc"}),(0,t.jsx)(d.TableHead,{children:"Trạng thái clearance"}),(0,t.jsx)(d.TableHead,{children:"Trạng thái"}),(0,t.jsx)(d.TableHead,{children:"Người khởi tạo"}),(0,t.jsx)(d.TableHead,{className:"text-right",children:"Thao tác"})]})}),(0,t.jsx)(d.TableBody,{children:$.map(e=>{var a,s;let r,l,n;return(0,t.jsxs)(d.TableRow,{children:[(0,t.jsx)(d.TableCell,{children:(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium",children:e.employeeProfile?.fullName||"N/A"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:e.employeeProfile?.employeeCode||"-"})]})}),(0,t.jsx)(d.TableCell,{children:(0,t.jsxs)("div",{className:"max-w-xs",children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:e.exitReason}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"RESIGNATION"===e.exitType?"Từ chức":"TERMINATION"===e.exitType?"Chấm dứt HĐ":"RETIREMENT"===e.exitType?"Nghỉ hưu":"CONTRACT_END"===e.exitType?"Hết hợp đồng":"MUTUAL_AGREEMENT"===e.exitType?"Thỏa thuận chung":"Khác"})]})}),(0,t.jsx)(d.TableCell,{children:(0,t.jsxs)("div",{className:"flex items-center text-sm",children:[(0,t.jsx)(y.Calendar,{className:"mr-1 h-3 w-3 text-muted-foreground"}),new Date(e.lastWorkingDay).toLocaleDateString("vi-VN")]})}),(0,t.jsx)(d.TableCell,{children:(a=e.clearanceStatus,r=({[I.ClearanceStatus.PENDING]:{variant:"secondary",label:"Chưa hoàn tất"},[I.ClearanceStatus.PARTIAL]:{variant:"default",label:"Một phần"},[I.ClearanceStatus.COMPLETE]:{variant:"default",label:"Hoàn tất"}})[a],(0,t.jsx)(o.Badge,{variant:r.variant,children:r.label}))}),(0,t.jsx)(d.TableCell,{children:(s=e.status,n=(l=({[I.OffboardingStatus.INITIATED]:{variant:"secondary",icon:b.AlertCircle,label:"Khởi tạo"},[I.OffboardingStatus.IN_PROGRESS]:{variant:"default",icon:g.Clock,label:"Đang xử lý"},[I.OffboardingStatus.PENDING_APPROVAL]:{variant:"default",icon:N.AlertTriangle,label:"Chờ phê duyệt",className:"bg-yellow-500"},[I.OffboardingStatus.APPROVED]:{variant:"default",icon:h.CheckCircle2,label:"Đã phê duyệt",className:"bg-blue-500"},[I.OffboardingStatus.COMPLETED]:{variant:"default",icon:h.CheckCircle2,label:"Hoàn thành",className:"bg-green-500"},[I.OffboardingStatus.CANCELLED]:{variant:"destructive",icon:C.XCircle,label:"Đã hủy"}})[s]).icon,(0,t.jsxs)(o.Badge,{variant:l.variant,className:l.className,children:[(0,t.jsx)(n,{className:"mr-1 h-3 w-3"}),l.label]}))}),(0,t.jsx)(d.TableCell,{children:(0,t.jsx)("div",{className:"text-sm",children:e.initiatedBy||"-"})}),(0,t.jsx)(d.TableCell,{className:"text-right",children:(0,t.jsx)(P.default,{href:`/admin/hr/offboarding/${e.id}`,children:(0,t.jsxs)(i.Button,{variant:"ghost",size:"sm",children:[(0,t.jsx)(f.Eye,{className:"mr-1 h-4 w-4"}),"Xem chi tiết"]})})})]},e.id)})})]})})}),O&&(0,t.jsx)("div",{className:"text-center",children:(0,t.jsx)(i.Button,{onClick:A,variant:"outline",disabled:E,children:"Tải thêm"})})]})}e.s(["default",()=>k])}]);