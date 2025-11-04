(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},421329,e=>{"use strict";var t=e.i(565977);e.s(["FileText",()=>t.default])},320309,e=>{"use strict";var t=e.i(366456);e.s(["UserPlus",()=>t.default])},774309,e=>{"use strict";var t=e.i(44990);let a=e.i(403055).forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...a}));a.displayName="Skeleton",e.s(["Skeleton",()=>a])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),s=e.i(403055),r=e.i(984804);let i=r.gql`
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
`,h=r.gql`
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
`,y=r.gql`
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
`,x=r.gql`
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
`,C=r.gql`
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
`,N=r.gql`
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
`,k=r.gql`
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
`,P=r.gql`
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
`,j=r.gql`
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
`,v=r.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(b,{refetchQueries:[y,C]});return{completeOffboarding:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:r}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(f);return{completeOnboardingTask:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{checklistId:t,taskId:a}});return s.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(P,{refetchQueries:[k]});return{createDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(n,{refetchQueries:[l,C]});return{createEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(g,{refetchQueries:[y,C]});return{createOffboardingProcess:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(m,{refetchQueries:[u,C]});return{createOnboardingChecklist:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(v,{refetchQueries:[k]});return{deleteDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(d,{refetchQueries:[l,C]});return{deleteEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:r}},"useEmployeeDocuments",0,(e,a)=>{let{data:r,loading:i,error:l,refetch:n,fetchMore:o}=(0,t.useQuery)(k,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,s.useCallback)(async()=>{r?.employeeDocuments.hasMore&&await o({variables:{skip:r.employeeDocuments.documents.length}})},[o,r]);return{documents:r?.employeeDocuments.documents||[],total:r?.employeeDocuments.total||0,hasMore:r?.employeeDocuments.hasMore||!1,loading:i,error:l,refetch:n,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:s,error:r,refetch:l}=(0,t.useQuery)(i,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:s,error:r,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:a,loading:r,error:i,refetch:n,fetchMore:o}=(0,t.useQuery)(l,{variables:e}),d=(0,s.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&o({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,o,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:r,error:i,refetch:n,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:s,refetch:r}=(0,t.useQuery)(C);return{statistics:e?.hrStatistics,loading:a,error:s,refetch:r}},"useOffboardingProcess",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(h,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:s,error:r,refetch:i}},"useOffboardingProcesses",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(y,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&n({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,n,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useOnboardingChecklist",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:s,error:r,refetch:i}},"useOnboardingChecklists",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(u,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&n({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,n,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(j,{refetchQueries:[k,N]});return{updateDocument:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(o);return{updateEmployeeProfile:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(x);return{updateOffboardingProcess:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(p);return{updateOnboardingChecklist:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOnboardingChecklist}}],598626)},38915,e=>{"use strict";var t,a,s,r,i=((t={}).CV="CV",t.CONTRACT="CONTRACT",t.ID_CARD="ID_CARD",t.PASSPORT="PASSPORT",t.DEGREE="DEGREE",t.CERTIFICATE="CERTIFICATE",t.PHOTO="PHOTO",t.BANK_INFO="BANK_INFO",t.HEALTH_CERTIFICATE="HEALTH_CERTIFICATE",t.OTHER="OTHER",t),l=((a={}).PENDING="PENDING",a.IN_PROGRESS="IN_PROGRESS",a.COMPLETED="COMPLETED",a.CANCELLED="CANCELLED",a),n=((s={}).INITIATED="INITIATED",s.IN_PROGRESS="IN_PROGRESS",s.PENDING_APPROVAL="PENDING_APPROVAL",s.APPROVED="APPROVED",s.COMPLETED="COMPLETED",s.CANCELLED="CANCELLED",s),o=((r={}).PENDING="PENDING",r.PARTIAL="PARTIAL",r.COMPLETE="COMPLETE",r);e.s(["ClearanceStatus",()=>o,"DocumentType",()=>i,"OffboardingStatus",()=>n,"OnboardingStatus",()=>l])},959675,e=>{"use strict";var t=e.i(763189);e.s(["UserMinus",()=>t.default])},263953,e=>{"use strict";var t=e.i(381814);e.s(["UserCheck",()=>t.default])},505485,e=>{"use strict";var t=e.i(44990),a=e.i(598626),s=e.i(775680),r=e.i(885205),i=e.i(702470),l=e.i(774309),n=e.i(771564),o=e.i(320309),d=e.i(959675),c=e.i(263953),u=e.i(415588),m=e.i(112641),p=e.i(198513),f=e.i(421329),h=e.i(579448),y=e.i(38915);function g(){let{statistics:e,loading:g}=(0,a.useHRStatistics)(),{checklists:x,loading:b}=(0,a.useOnboardingChecklists)({status:y.OnboardingStatus.IN_PROGRESS,take:5}),{processes:C,loading:N}=(0,a.useOffboardingProcesses)({status:y.OffboardingStatus.IN_PROGRESS,take:5}),k=g||b||N;return(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold tracking-tight",children:"HR Dashboard"}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Quản lý nhân sự và quy trình onboarding/offboarding"})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(h.default,{href:"/admin/hr/employees",children:(0,t.jsxs)(r.Button,{children:[(0,t.jsx)(n.Users,{className:"mr-2 h-4 w-4"}),"Danh sách nhân viên"]})}),(0,t.jsx)(h.default,{href:"/admin/hr/employee/new",children:(0,t.jsxs)(r.Button,{variant:"outline",children:[(0,t.jsx)(o.UserPlus,{className:"mr-2 h-4 w-4"}),"Thêm nhân viên"]})})]})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-4",children:[(0,t.jsxs)(s.Card,{children:[(0,t.jsxs)(s.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)(s.CardTitle,{className:"text-sm font-medium",children:"Tổng nhân viên"}),(0,t.jsx)(n.Users,{className:"h-4 w-4 text-muted-foreground"})]}),(0,t.jsx)(s.CardContent,{children:k?(0,t.jsx)(l.Skeleton,{className:"h-8 w-20"}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold",children:e?.totalEmployees||0}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[e?.activeEmployees||0," đang làm việc"]})]})})]}),(0,t.jsxs)(s.Card,{children:[(0,t.jsxs)(s.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)(s.CardTitle,{className:"text-sm font-medium",children:"Đang onboarding"}),(0,t.jsx)(o.UserPlus,{className:"h-4 w-4 text-blue-500"})]}),(0,t.jsx)(s.CardContent,{children:k?(0,t.jsx)(l.Skeleton,{className:"h-8 w-20"}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold text-blue-600",children:e?.onboarding.total||0}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[e?.onboarding.inProgress||0," đang xử lý"]})]})})]}),(0,t.jsxs)(s.Card,{children:[(0,t.jsxs)(s.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)(s.CardTitle,{className:"text-sm font-medium",children:"Đang offboarding"}),(0,t.jsx)(d.UserMinus,{className:"h-4 w-4 text-orange-500"})]}),(0,t.jsx)(s.CardContent,{children:k?(0,t.jsx)(l.Skeleton,{className:"h-8 w-20"}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold text-orange-600",children:e?.offboarding.total||0}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[e?.offboarding.inProgress||0," đang xử lý"]})]})})]}),(0,t.jsxs)(s.Card,{children:[(0,t.jsxs)(s.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)(s.CardTitle,{className:"text-sm font-medium",children:"Nhân viên hoạt động"}),(0,t.jsx)(c.UserCheck,{className:"h-4 w-4 text-green-500"})]}),(0,t.jsx)(s.CardContent,{children:k?(0,t.jsx)(l.Skeleton,{className:"h-8 w-20"}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold text-green-600",children:e?.activeEmployees||0}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[e?.inactiveEmployees||0," không hoạt động"]})]})})]})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-3",children:[(0,t.jsx)(h.default,{href:"/admin/hr/onboarding",className:"block",children:(0,t.jsxs)(s.Card,{className:"hover:bg-accent transition-colors cursor-pointer",children:[(0,t.jsxs)(s.CardHeader,{children:[(0,t.jsxs)(s.CardTitle,{className:"flex items-center text-lg",children:[(0,t.jsx)(o.UserPlus,{className:"mr-2 h-5 w-5 text-blue-500"}),"Onboarding"]}),(0,t.jsx)(s.CardDescription,{children:"Quản lý quy trình nhập việc"})]}),(0,t.jsx)(s.CardContent,{children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-2xl font-bold",children:e?.onboarding.pending||0}),(0,t.jsx)(i.Badge,{variant:"secondary",children:"Chờ xử lý"})]})})]})}),(0,t.jsx)(h.default,{href:"/admin/hr/offboarding",className:"block",children:(0,t.jsxs)(s.Card,{className:"hover:bg-accent transition-colors cursor-pointer",children:[(0,t.jsxs)(s.CardHeader,{children:[(0,t.jsxs)(s.CardTitle,{className:"flex items-center text-lg",children:[(0,t.jsx)(d.UserMinus,{className:"mr-2 h-5 w-5 text-orange-500"}),"Offboarding"]}),(0,t.jsx)(s.CardDescription,{children:"Quản lý quy trình nghỉ việc"})]}),(0,t.jsx)(s.CardContent,{children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-2xl font-bold",children:e?.offboarding.pending||0}),(0,t.jsx)(i.Badge,{variant:"secondary",children:"Chờ xử lý"})]})})]})}),(0,t.jsx)(h.default,{href:"/admin/hr/reports",className:"block",children:(0,t.jsxs)(s.Card,{className:"hover:bg-accent transition-colors cursor-pointer",children:[(0,t.jsxs)(s.CardHeader,{children:[(0,t.jsxs)(s.CardTitle,{className:"flex items-center text-lg",children:[(0,t.jsx)(f.FileText,{className:"mr-2 h-5 w-5 text-purple-500"}),"Báo cáo"]}),(0,t.jsx)(s.CardDescription,{children:"Thống kê và phân tích HR"})]}),(0,t.jsx)(s.CardContent,{children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:"Xem báo cáo"}),(0,t.jsx)(i.Badge,{variant:"secondary",children:"Mới"})]})})]})})]}),(0,t.jsxs)(s.Card,{children:[(0,t.jsxs)(s.CardHeader,{children:[(0,t.jsxs)(s.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(u.Clock,{className:"mr-2 h-5 w-5"}),"Onboarding đang xử lý"]}),(0,t.jsx)(s.CardDescription,{children:"5 quy trình onboarding gần nhất"})]}),(0,t.jsxs)(s.CardContent,{children:[b?(0,t.jsx)("div",{className:"space-y-2",children:[1,2,3].map(e=>(0,t.jsx)(l.Skeleton,{className:"h-16 w-full"},e))}):0===x.length?(0,t.jsxs)("div",{className:"text-center py-8 text-muted-foreground",children:[(0,t.jsx)(m.CheckCircle2,{className:"mx-auto h-12 w-12 mb-2 text-green-500"}),(0,t.jsx)("p",{children:"Không có onboarding đang xử lý"})]}):(0,t.jsx)("div",{className:"space-y-3",children:x.map(e=>(0,t.jsx)(h.default,{href:`/admin/hr/onboarding/${e.id}`,className:"block",children:(0,t.jsxs)("div",{className:"flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors",children:[(0,t.jsx)("div",{className:"flex items-center space-x-3",children:(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium",children:e.employeeProfile?.fullName}),(0,t.jsxs)("p",{className:"text-sm text-muted-foreground",children:[e.employeeProfile?.department," - ",e.employeeProfile?.position]})]})}),(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsxs)("p",{className:"text-sm font-medium",children:[e.completedTasks,"/",e.totalTasks," tasks"]}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[e.progressPercentage.toFixed(0),"% hoàn thành"]})]}),(0,t.jsx)(i.Badge,{variant:e.status===y.OnboardingStatus.IN_PROGRESS?"default":"secondary",children:e.status})]})]})},e.id))}),x.length>0&&(0,t.jsx)("div",{className:"mt-4 text-center",children:(0,t.jsx)(h.default,{href:"/admin/hr/onboarding",children:(0,t.jsx)(r.Button,{variant:"outline",children:"Xem tất cả onboarding"})})})]})]}),(0,t.jsxs)(s.Card,{children:[(0,t.jsxs)(s.CardHeader,{children:[(0,t.jsxs)(s.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(p.AlertCircle,{className:"mr-2 h-5 w-5"}),"Offboarding đang xử lý"]}),(0,t.jsx)(s.CardDescription,{children:"5 quy trình offboarding gần nhất"})]}),(0,t.jsxs)(s.CardContent,{children:[N?(0,t.jsx)("div",{className:"space-y-2",children:[1,2,3].map(e=>(0,t.jsx)(l.Skeleton,{className:"h-16 w-full"},e))}):0===C.length?(0,t.jsxs)("div",{className:"text-center py-8 text-muted-foreground",children:[(0,t.jsx)(m.CheckCircle2,{className:"mx-auto h-12 w-12 mb-2 text-green-500"}),(0,t.jsx)("p",{children:"Không có offboarding đang xử lý"})]}):(0,t.jsx)("div",{className:"space-y-3",children:C.map(e=>(0,t.jsx)(h.default,{href:`/admin/hr/offboarding/${e.id}`,className:"block",children:(0,t.jsxs)("div",{className:"flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors",children:[(0,t.jsx)("div",{className:"flex items-center space-x-3",children:(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium",children:e.employeeProfile?.fullName}),(0,t.jsxs)("p",{className:"text-sm text-muted-foreground",children:[e.employeeProfile?.department," - ",e.employeeProfile?.position]})]})}),(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsxs)("p",{className:"text-sm font-medium",children:["Ngày nghỉ: ",new Date(e.lastWorkingDay).toLocaleDateString("vi-VN")]}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:e.exitType})]}),(0,t.jsx)(i.Badge,{variant:e.status===y.OffboardingStatus.IN_PROGRESS?"default":e.status===y.OffboardingStatus.APPROVED?"secondary":"outline",children:e.status})]})]})},e.id))}),C.length>0&&(0,t.jsx)("div",{className:"mt-4 text-center",children:(0,t.jsx)(h.default,{href:"/admin/hr/offboarding",children:(0,t.jsx)(r.Button,{variant:"outline",children:"Xem tất cả offboarding"})})})]})]})]})}e.s(["default",()=>g])}]);