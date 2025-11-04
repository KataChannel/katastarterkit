(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},965120,e=>{"use strict";var t=e.i(381299);e.s(["Edit",()=>t.default])},173416,e=>{"use strict";var t=e.i(46034);e.s(["Filter",()=>t.default])},421329,e=>{"use strict";var t=e.i(565977);e.s(["FileText",()=>t.default])},320309,e=>{"use strict";var t=e.i(366456);e.s(["UserPlus",()=>t.default])},495043,e=>{"use strict";var t=e.i(217696);e.s(["MoreVertical",()=>t.default])},815954,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(940392);let r=a.createContext({}),l=({children:e,open:a,onOpenChange:s})=>a?(0,t.jsx)(r.Provider,{value:{onOpenChange:s},children:e}):null,i=a.forwardRef(({className:e,children:s,asChild:r,...l},i)=>r&&a.isValidElement(s)?a.cloneElement(s,{ref:i,...l}):(0,t.jsx)("button",{ref:i,className:e,...l,children:s}));i.displayName="AlertDialogTrigger";let o=a.forwardRef(({className:e,...r},l)=>{let[i,o]=a.useState(!1);if(a.useEffect(()=>(o(!0),()=>o(!1)),[]),!i)return null;let n=(0,t.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 pointer-events-auto",onClick:e=>{e.target,e.currentTarget},children:(0,t.jsx)("div",{ref:l,className:`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg pointer-events-auto ${e||""}`,onClick:e=>e.stopPropagation(),...r})});return(0,s.createPortal)(n,document.body)});o.displayName="AlertDialogContent";let n=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`flex flex-col space-y-2 text-center sm:text-left ${e||""}`,...a}));n.displayName="AlertDialogHeader";let d=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${e||""}`,...a}));d.displayName="AlertDialogFooter";let c=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("h2",{ref:s,className:`text-lg font-semibold ${e||""}`,...a}));c.displayName="AlertDialogTitle";let u=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("p",{ref:s,className:`text-sm text-gray-500 ${e||""}`,...a}));u.displayName="AlertDialogDescription";let m=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("button",{ref:s,className:`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...a}));m.displayName="AlertDialogAction";let p=a.forwardRef(({className:e,onClick:s,...l},i)=>{let{onOpenChange:o}=a.useContext(r);return(0,t.jsx)("button",{ref:i,onClick:e=>{s?.(e),e.defaultPrevented||o?.(!1)},className:`inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...l})});p.displayName="AlertDialogCancel",e.s(["AlertDialog",()=>l,"AlertDialogAction",()=>m,"AlertDialogCancel",()=>p,"AlertDialogContent",()=>o,"AlertDialogDescription",()=>u,"AlertDialogFooter",()=>d,"AlertDialogHeader",()=>n,"AlertDialogTitle",()=>c,"AlertDialogTrigger",()=>i])},741850,e=>{"use strict";var t=e.i(44990),a=e.i(403055);let s=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{className:"relative w-full overflow-auto",children:(0,t.jsx)("table",{ref:s,className:`w-full caption-bottom text-sm ${e||""}`,...a})}));s.displayName="Table";let r=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("thead",{ref:s,className:`[&_tr]:border-b ${e||""}`,...a}));r.displayName="TableHeader";let l=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("tbody",{ref:s,className:`[&_tr:last-child]:border-0 ${e||""}`,...a}));l.displayName="TableBody",a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("tfoot",{ref:s,className:`border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0 ${e||""}`,...a})).displayName="TableFooter";let i=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("tr",{ref:s,className:`border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 ${e||""}`,...a}));i.displayName="TableRow";let o=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("th",{ref:s,className:`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${e||""}`,...a}));o.displayName="TableHead";let n=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("td",{ref:s,className:`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${e||""}`,...a}));n.displayName="TableCell",a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("caption",{ref:s,className:`mt-4 text-sm text-gray-500 ${e||""}`,...a})).displayName="TableCaption",e.s(["Table",()=>s,"TableBody",()=>l,"TableCell",()=>n,"TableHead",()=>o,"TableHeader",()=>r,"TableRow",()=>i])},774309,e=>{"use strict";var t=e.i(44990);let a=e.i(403055).forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...a}));a.displayName="Skeleton",e.s(["Skeleton",()=>a])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),s=e.i(403055),r=e.i(984804);let l=r.gql`
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
`;let i=r.gql`
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
`,x=r.gql`
  mutation CompleteOffboarding($id: ID!) {
    completeOffboarding(id: $id) {
      id
      status
      clearanceStatus
      completedAt
      completedBy
    }
  }
`,v=r.gql`
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
`,D=r.gql`
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
`,N=r.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(x,{refetchQueries:[y,v]});return{completeOffboarding:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:r}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(f);return{completeOnboardingTask:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{checklistId:t,taskId:a}});return s.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(C,{refetchQueries:[D]});return{createDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:l}]=(0,a.useMutation)(o,{refetchQueries:[i,v]});return{createEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:l,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:l}]=(0,a.useMutation)(g,{refetchQueries:[y,v]});return{createOffboardingProcess:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:l,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:l}]=(0,a.useMutation)(m,{refetchQueries:[u,v]});return{createOnboardingChecklist:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:l,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(N,{refetchQueries:[D]});return{deleteDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(d,{refetchQueries:[i,v]});return{deleteEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:r}},"useEmployeeDocuments",0,(e,a)=>{let{data:r,loading:l,error:i,refetch:o,fetchMore:n}=(0,t.useQuery)(D,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,s.useCallback)(async()=>{r?.employeeDocuments.hasMore&&await n({variables:{skip:r.employeeDocuments.documents.length}})},[n,r]);return{documents:r?.employeeDocuments.documents||[],total:r?.employeeDocuments.total||0,hasMore:r?.employeeDocuments.hasMore||!1,loading:l,error:i,refetch:o,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(l,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:s,error:r,refetch:i}},"useEmployeeProfiles",0,e=>{let{data:a,loading:r,error:l,refetch:o,fetchMore:n}=(0,t.useQuery)(i,{variables:e}),d=(0,s.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&n({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,n,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:r,error:l,refetch:o,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:s,refetch:r}=(0,t.useQuery)(v);return{statistics:e?.hrStatistics,loading:a,error:s,refetch:r}},"useOffboardingProcess",0,e=>{let{data:a,loading:s,error:r,refetch:l}=(0,t.useQuery)(h,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:s,error:r,refetch:l}},"useOffboardingProcesses",0,e=>{let{data:a,loading:r,error:l,refetch:i,fetchMore:o}=(0,t.useQuery)(y,{variables:e}),n=(0,s.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&o({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,o,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:r,error:l,refetch:i,loadMore:n}},"useOnboardingChecklist",0,e=>{let{data:a,loading:s,error:r,refetch:l}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:s,error:r,refetch:l}},"useOnboardingChecklists",0,e=>{let{data:a,loading:r,error:l,refetch:i,fetchMore:o}=(0,t.useQuery)(u,{variables:e}),n=(0,s.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&o({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,o,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:r,error:l,refetch:i,loadMore:n}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(j,{refetchQueries:[D,k]});return{updateDocument:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:l}]=(0,a.useMutation)(n);return{updateEmployeeProfile:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:l,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:l}]=(0,a.useMutation)(b);return{updateOffboardingProcess:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:l,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:l}]=(0,a.useMutation)(p);return{updateOnboardingChecklist:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:l,data:t?.updateOnboardingChecklist}}],598626)},966169,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(598626),r=e.i(775680),l=e.i(885205),i=e.i(696134),o=e.i(702470),n=e.i(183194),d=e.i(741850),c=e.i(815954),u=e.i(774309),m=e.i(4993),p=e.i(771564),f=e.i(320309),h=e.i(850384),y=e.i(173416),g=e.i(495043),b=e.i(965120),x=e.i(138227),v=e.i(404210),k=e.i(421329),D=e.i(579448),C=e.i(135369);function j(){let[e,j]=(0,a.useState)(""),[N,I]=(0,a.useState)("all"),[P,T]=(0,a.useState)("all"),[w,$]=(0,a.useState)("all"),[A,S]=(0,a.useState)(null),{toast:E}=(0,m.useToast)(),{employees:O,loading:M,total:R,hasMore:q,loadMore:B,refetch:H}=(0,s.useEmployeeProfiles)({department:"all"===N?void 0:N||void 0,position:"all"===P?void 0:P||void 0,isActive:"all"===w?void 0:"active"===w,take:20}),{deleteEmployeeProfile:U,loading:L}=(0,s.useDeleteEmployeeProfile)(),V=async()=>{if(A)try{let e=await U(A);e?.success&&(E({title:"Thành công",description:e.message,type:"success"}),H())}catch(e){E({title:"Lỗi",description:e.message||"Không thể xóa nhân viên",type:"error"})}finally{S(null)}},Q=O.filter(t=>t.fullName.toLowerCase().includes(e.toLowerCase())||t.employeeCode.toLowerCase().includes(e.toLowerCase())||t.user?.email?.toLowerCase().includes(e.toLowerCase()));return(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-3xl font-bold tracking-tight flex items-center",children:[(0,t.jsx)(p.Users,{className:"mr-3 h-8 w-8"}),"Danh sách nhân viên"]}),(0,t.jsxs)("p",{className:"text-muted-foreground",children:["Quản lý thông tin ",R," nhân viên trong hệ thống"]})]}),(0,t.jsx)(D.default,{href:"/admin/hr/employee/new",children:(0,t.jsxs)(l.Button,{children:[(0,t.jsx)(f.UserPlus,{className:"mr-2 h-4 w-4"}),"Thêm nhân viên mới"]})})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center text-lg",children:[(0,t.jsx)(y.Filter,{className:"mr-2 h-5 w-5"}),"Bộ lọc"]})}),(0,t.jsx)(r.CardContent,{children:(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:[(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(h.Search,{className:"absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"}),(0,t.jsx)(i.Input,{placeholder:"Tìm kiếm theo tên, mã NV...",value:e,onChange:e=>j(e.target.value),className:"pl-8"})]}),(0,t.jsxs)(n.Select,{value:N,onValueChange:I,children:[(0,t.jsx)(n.SelectTrigger,{children:(0,t.jsx)(n.SelectValue,{placeholder:"Phòng ban"})}),(0,t.jsxs)(n.SelectContent,{children:[(0,t.jsx)(n.SelectItem,{value:"all",children:"Tất cả phòng ban"}),(0,t.jsx)(n.SelectItem,{value:"IT",children:"IT"}),(0,t.jsx)(n.SelectItem,{value:"HR",children:"HR"}),(0,t.jsx)(n.SelectItem,{value:"Sales",children:"Sales"}),(0,t.jsx)(n.SelectItem,{value:"Marketing",children:"Marketing"}),(0,t.jsx)(n.SelectItem,{value:"Finance",children:"Finance"})]})]}),(0,t.jsxs)(n.Select,{value:P,onValueChange:T,children:[(0,t.jsx)(n.SelectTrigger,{children:(0,t.jsx)(n.SelectValue,{placeholder:"Chức vụ"})}),(0,t.jsxs)(n.SelectContent,{children:[(0,t.jsx)(n.SelectItem,{value:"all",children:"Tất cả chức vụ"}),(0,t.jsx)(n.SelectItem,{value:"Developer",children:"Developer"}),(0,t.jsx)(n.SelectItem,{value:"Manager",children:"Manager"}),(0,t.jsx)(n.SelectItem,{value:"Intern",children:"Intern"}),(0,t.jsx)(n.SelectItem,{value:"Senior",children:"Senior"})]})]}),(0,t.jsxs)(n.Select,{value:w,onValueChange:$,children:[(0,t.jsx)(n.SelectTrigger,{children:(0,t.jsx)(n.SelectValue,{placeholder:"Trạng thái"})}),(0,t.jsxs)(n.SelectContent,{children:[(0,t.jsx)(n.SelectItem,{value:"all",children:"Tất cả trạng thái"}),(0,t.jsx)(n.SelectItem,{value:"active",children:"Đang làm việc"}),(0,t.jsx)(n.SelectItem,{value:"inactive",children:"Không hoạt động"})]})]})]})})]}),(0,t.jsx)(r.Card,{children:(0,t.jsx)(r.CardContent,{className:"p-0",children:M?(0,t.jsx)("div",{className:"p-6 space-y-2",children:[1,2,3,4,5].map(e=>(0,t.jsx)(u.Skeleton,{className:"h-16 w-full"},e))}):0===Q.length?(0,t.jsxs)("div",{className:"text-center py-12 text-muted-foreground",children:[(0,t.jsx)(p.Users,{className:"mx-auto h-12 w-12 mb-2"}),(0,t.jsx)("p",{children:"Không tìm thấy nhân viên nào"})]}):(0,t.jsxs)(d.Table,{children:[(0,t.jsx)(d.TableHeader,{children:(0,t.jsxs)(d.TableRow,{children:[(0,t.jsx)(d.TableHead,{children:"Mã NV"}),(0,t.jsx)(d.TableHead,{children:"Họ tên"}),(0,t.jsx)(d.TableHead,{children:"Email"}),(0,t.jsx)(d.TableHead,{children:"Phòng ban"}),(0,t.jsx)(d.TableHead,{children:"Chức vụ"}),(0,t.jsx)(d.TableHead,{children:"Ngày vào"}),(0,t.jsx)(d.TableHead,{children:"Trạng thái"}),(0,t.jsx)(d.TableHead,{className:"text-right",children:"Thao tác"})]})}),(0,t.jsx)(d.TableBody,{children:Q.map(e=>(0,t.jsxs)(d.TableRow,{children:[(0,t.jsx)(d.TableCell,{className:"font-medium",children:e.employeeCode}),(0,t.jsx)(d.TableCell,{children:(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[e.user?.avatar&&(0,t.jsx)("img",{src:e.user.avatar,alt:e.fullName,className:"w-8 h-8 rounded-full"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium",children:e.fullName}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:e.displayName||e.user?.username})]})]})}),(0,t.jsx)(d.TableCell,{className:"text-sm",children:e.user?.email}),(0,t.jsx)(d.TableCell,{children:e.department||"-"}),(0,t.jsx)(d.TableCell,{children:e.position||"-"}),(0,t.jsx)(d.TableCell,{children:e.startDate?new Date(e.startDate).toLocaleDateString("vi-VN"):"-"}),(0,t.jsx)(d.TableCell,{children:(0,t.jsx)(o.Badge,{variant:e.isActive?"default":"secondary",children:e.isActive?"Đang làm việc":"Không hoạt động"})}),(0,t.jsx)(d.TableCell,{className:"text-right",children:(0,t.jsxs)(C.DropdownMenu,{children:[(0,t.jsx)(C.DropdownMenuTrigger,{asChild:!0,children:(0,t.jsx)(l.Button,{variant:"ghost",size:"sm",children:(0,t.jsx)(g.MoreVertical,{className:"h-4 w-4"})})}),(0,t.jsxs)(C.DropdownMenuContent,{align:"end",children:[(0,t.jsx)(C.DropdownMenuLabel,{children:"Thao tác"}),(0,t.jsx)(C.DropdownMenuSeparator,{}),(0,t.jsx)(D.default,{href:`/admin/hr/employee/${e.id}`,children:(0,t.jsxs)(C.DropdownMenuItem,{children:[(0,t.jsx)(v.Eye,{className:"mr-2 h-4 w-4"}),"Xem chi tiết"]})}),(0,t.jsx)(D.default,{href:`/admin/hr/employee/${e.id}/edit`,children:(0,t.jsxs)(C.DropdownMenuItem,{children:[(0,t.jsx)(b.Edit,{className:"mr-2 h-4 w-4"}),"Chỉnh sửa"]})}),(0,t.jsx)(D.default,{href:`/admin/hr/employee/${e.id}/documents`,children:(0,t.jsxs)(C.DropdownMenuItem,{children:[(0,t.jsx)(k.FileText,{className:"mr-2 h-4 w-4"}),"Tài liệu"]})}),(0,t.jsx)(C.DropdownMenuSeparator,{}),(0,t.jsxs)(C.DropdownMenuItem,{className:"text-red-600",onClick:()=>S(e.id),children:[(0,t.jsx)(x.Trash2,{className:"mr-2 h-4 w-4"}),"Xóa"]})]})]})})]},e.id))})]})})}),q&&(0,t.jsx)("div",{className:"text-center",children:(0,t.jsx)(l.Button,{onClick:B,variant:"outline",disabled:M,children:"Tải thêm"})}),(0,t.jsx)(c.AlertDialog,{open:!!A,onOpenChange:()=>S(null),children:(0,t.jsxs)(c.AlertDialogContent,{children:[(0,t.jsxs)(c.AlertDialogHeader,{children:[(0,t.jsx)(c.AlertDialogTitle,{children:"Xác nhận xóa nhân viên"}),(0,t.jsx)(c.AlertDialogDescription,{children:"Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa nhân viên này không?"})]}),(0,t.jsxs)(c.AlertDialogFooter,{children:[(0,t.jsx)(c.AlertDialogCancel,{children:"Hủy"}),(0,t.jsx)(c.AlertDialogAction,{onClick:V,disabled:L,children:L?"Đang xóa...":"Xóa"})]})]})})]})}e.s(["default",()=>j])}]);