(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},965120,e=>{"use strict";var t=e.i(381299);e.s(["Edit",()=>t.default])},421329,e=>{"use strict";var t=e.i(565977);e.s(["FileText",()=>t.default])},865706,e=>{"use strict";var t=e.i(99140);e.s(["Award",()=>t.default])},815954,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(940392);let r=a.createContext({}),i=({children:e,open:a,onOpenChange:s})=>a?(0,t.jsx)(r.Provider,{value:{onOpenChange:s},children:e}):null,l=a.forwardRef(({className:e,children:s,asChild:r,...i},l)=>r&&a.isValidElement(s)?a.cloneElement(s,{ref:l,...i}):(0,t.jsx)("button",{ref:l,className:e,...i,children:s}));l.displayName="AlertDialogTrigger";let n=a.forwardRef(({className:e,...r},i)=>{let[l,n]=a.useState(!1);if(a.useEffect(()=>(n(!0),()=>n(!1)),[]),!l)return null;let o=(0,t.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 pointer-events-auto",onClick:e=>{e.target,e.currentTarget},children:(0,t.jsx)("div",{ref:i,className:`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg pointer-events-auto ${e||""}`,onClick:e=>e.stopPropagation(),...r})});return(0,s.createPortal)(o,document.body)});n.displayName="AlertDialogContent";let o=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`flex flex-col space-y-2 text-center sm:text-left ${e||""}`,...a}));o.displayName="AlertDialogHeader";let d=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${e||""}`,...a}));d.displayName="AlertDialogFooter";let c=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("h2",{ref:s,className:`text-lg font-semibold ${e||""}`,...a}));c.displayName="AlertDialogTitle";let m=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("p",{ref:s,className:`text-sm text-gray-500 ${e||""}`,...a}));m.displayName="AlertDialogDescription";let u=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("button",{ref:s,className:`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...a}));u.displayName="AlertDialogAction";let p=a.forwardRef(({className:e,onClick:s,...i},l)=>{let{onOpenChange:n}=a.useContext(r);return(0,t.jsx)("button",{ref:l,onClick:e=>{s?.(e),e.defaultPrevented||n?.(!1)},className:`inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...i})});p.displayName="AlertDialogCancel",e.s(["AlertDialog",()=>i,"AlertDialogAction",()=>u,"AlertDialogCancel",()=>p,"AlertDialogContent",()=>n,"AlertDialogDescription",()=>m,"AlertDialogFooter",()=>d,"AlertDialogHeader",()=>o,"AlertDialogTitle",()=>c,"AlertDialogTrigger",()=>l])},774309,e=>{"use strict";var t=e.i(44990);let a=e.i(403055).forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...a}));a.displayName="Skeleton",e.s(["Skeleton",()=>a])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),s=e.i(403055),r=e.i(984804);let i=r.gql`
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
`;let m=r.gql`
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
`,u=r.gql`
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
`,x=r.gql`
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
`,y=r.gql`
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
`,N=r.gql`
  mutation CompleteOffboarding($id: ID!) {
    completeOffboarding(id: $id) {
      id
      status
      clearanceStatus
      completedAt
      completedBy
    }
  }
`,j=r.gql`
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
`,b=r.gql`
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
`,v=r.gql`
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
`,k=r.gql`
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
`,D=r.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(N,{refetchQueries:[x,j]});return{completeOffboarding:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:r}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(f);return{completeOnboardingTask:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{checklistId:t,taskId:a}});return s.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(C,{refetchQueries:[v]});return{createDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(n,{refetchQueries:[l,j]});return{createEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(g,{refetchQueries:[x,j]});return{createOffboardingProcess:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(u,{refetchQueries:[m,j]});return{createOnboardingChecklist:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(D,{refetchQueries:[v]});return{deleteDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(d,{refetchQueries:[l,j]});return{deleteEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:r}},"useEmployeeDocuments",0,(e,a)=>{let{data:r,loading:i,error:l,refetch:n,fetchMore:o}=(0,t.useQuery)(v,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,s.useCallback)(async()=>{r?.employeeDocuments.hasMore&&await o({variables:{skip:r.employeeDocuments.documents.length}})},[o,r]);return{documents:r?.employeeDocuments.documents||[],total:r?.employeeDocuments.total||0,hasMore:r?.employeeDocuments.hasMore||!1,loading:i,error:l,refetch:n,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:s,error:r,refetch:l}=(0,t.useQuery)(i,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:s,error:r,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:a,loading:r,error:i,refetch:n,fetchMore:o}=(0,t.useQuery)(l,{variables:e}),d=(0,s.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&o({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,o,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:r,error:i,refetch:n,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:s,refetch:r}=(0,t.useQuery)(j);return{statistics:e?.hrStatistics,loading:a,error:s,refetch:r}},"useOffboardingProcess",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(h,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:s,error:r,refetch:i}},"useOffboardingProcesses",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(x,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&n({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,n,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useOnboardingChecklist",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:s,error:r,refetch:i}},"useOnboardingChecklists",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(m,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&n({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,n,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(k,{refetchQueries:[v,b]});return{updateDocument:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(o);return{updateEmployeeProfile:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(y);return{updateOffboardingProcess:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(p);return{updateOnboardingChecklist:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOnboardingChecklist}}],598626)},825098,e=>{"use strict";var t=e.i(555234);e.s(["Mail",()=>t.default])},99529,e=>{"use strict";var t=e.i(128832);e.s(["Phone",()=>t.default])},60864,e=>{"use strict";var t=e.i(675263);e.s(["GraduationCap",()=>t.default])},701325,e=>{"use strict";var t=e.i(740093);e.s(["Building2",()=>t.default])},198682,e=>{"use strict";var t=e.i(748058);e.s(["MapPin",()=>t.default])},146259,e=>{"use strict";var t=e.i(44990),a=e.i(130775),s=e.i(598626),r=e.i(775680),i=e.i(885205),l=e.i(702470),n=e.i(774309),o=e.i(815954),d=e.i(4993),c=e.i(909905),m=e.i(825098),u=e.i(99529),p=e.i(198682),f=e.i(435635),h=e.i(437376),h=h,x=e.i(60864),g=e.i(865706),y=e.i(315953),y=y,N=e.i(421329),j=e.i(965120),b=e.i(138227),v=e.i(519647),C=e.i(701325),k=e.i(579448);function D(){let e=(0,a.useParams)(),D=(0,a.useRouter)(),{toast:P}=(0,d.useToast)(),I=e.id,{employeeProfile:A,loading:w,error:$}=(0,s.useEmployeeProfile)(I),{deleteEmployeeProfile:T,loading:E}=(0,s.useDeleteEmployeeProfile)(),O=async()=>{try{let e=await T(I);e?.success&&(P({title:"Thành công",description:e.message,type:"success"}),D.push("/admin/hr/employees"))}catch(e){P({title:"Lỗi",description:e.message||"Không thể xóa nhân viên",type:"error"})}};return w?(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsx)(n.Skeleton,{className:"h-10 w-64"}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,t.jsx)(n.Skeleton,{className:"h-96"}),(0,t.jsx)(n.Skeleton,{className:"h-96 md:col-span-2"})]})]}):$||!A?(0,t.jsx)("div",{className:"container mx-auto p-6",children:(0,t.jsx)(r.Card,{children:(0,t.jsxs)(r.CardContent,{className:"py-12 text-center text-muted-foreground",children:[(0,t.jsx)(c.User,{className:"mx-auto h-12 w-12 mb-2"}),(0,t.jsx)("p",{children:"Không tìm thấy thông tin nhân viên"}),(0,t.jsx)(k.default,{href:"/admin/hr/employees",children:(0,t.jsx)(i.Button,{variant:"outline",className:"mt-4",children:"Quay lại danh sách"})})]})})}):(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsx)(k.default,{href:"/admin/hr/employees",children:(0,t.jsx)(i.Button,{variant:"ghost",size:"icon",children:(0,t.jsx)(v.ArrowLeft,{className:"h-5 w-5"})})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold tracking-tight",children:A.fullName}),(0,t.jsx)("p",{className:"text-muted-foreground",children:A.employeeCode})]})]}),(0,t.jsxs)("div",{className:"flex space-x-2",children:[(0,t.jsx)(k.default,{href:`/admin/hr/employee/${I}/documents`,children:(0,t.jsxs)(i.Button,{variant:"outline",children:[(0,t.jsx)(N.FileText,{className:"mr-2 h-4 w-4"}),"Tài liệu"]})}),(0,t.jsx)(k.default,{href:`/admin/hr/employee/${I}/edit`,children:(0,t.jsxs)(i.Button,{variant:"outline",children:[(0,t.jsx)(j.Edit,{className:"mr-2 h-4 w-4"}),"Chỉnh sửa"]})}),(0,t.jsxs)(o.AlertDialog,{children:[(0,t.jsx)(o.AlertDialogTrigger,{asChild:!0,children:(0,t.jsxs)(i.Button,{variant:"destructive",children:[(0,t.jsx)(b.Trash2,{className:"mr-2 h-4 w-4"}),"Xóa"]})}),(0,t.jsxs)(o.AlertDialogContent,{children:[(0,t.jsxs)(o.AlertDialogHeader,{children:[(0,t.jsx)(o.AlertDialogTitle,{children:"Xác nhận xóa nhân viên"}),(0,t.jsxs)(o.AlertDialogDescription,{children:["Bạn có chắc chắn muốn xóa nhân viên ",A.fullName,"? Hành động này không thể hoàn tác."]})]}),(0,t.jsxs)(o.AlertDialogFooter,{children:[(0,t.jsx)(o.AlertDialogCancel,{children:"Hủy"}),(0,t.jsx)(o.AlertDialogAction,{onClick:O,disabled:E,children:E?"Đang xóa...":"Xóa"})]})]})]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsx)(r.Card,{children:(0,t.jsx)(r.CardContent,{className:"pt-6",children:(0,t.jsxs)("div",{className:"flex flex-col items-center text-center",children:[A.user?.avatar?(0,t.jsx)("img",{src:A.user.avatar,alt:A.fullName,className:"w-32 h-32 rounded-full mb-4"}):(0,t.jsx)("div",{className:"w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4",children:(0,t.jsx)(c.User,{className:"h-16 w-16 text-muted-foreground"})}),(0,t.jsx)("h2",{className:"text-xl font-bold",children:A.fullName}),A.displayName&&(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:A.displayName}),(0,t.jsx)(l.Badge,{variant:A.isActive?"default":"secondary",className:"mt-2",children:A.isActive?"Đang làm việc":"Không hoạt động"})]})})}),(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{className:"text-lg",children:"Thông tin liên hệ"})}),(0,t.jsxs)(r.CardContent,{className:"space-y-3",children:[A.user?.email&&(0,t.jsxs)("div",{className:"flex items-start space-x-2",children:[(0,t.jsx)(m.Mail,{className:"h-4 w-4 mt-1 text-muted-foreground"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:"Email"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:A.user.email})]})]}),A.personalPhone&&(0,t.jsxs)("div",{className:"flex items-start space-x-2",children:[(0,t.jsx)(u.Phone,{className:"h-4 w-4 mt-1 text-muted-foreground"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:"Điện thoại"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:A.personalPhone})]})]}),A.currentAddress&&(0,t.jsxs)("div",{className:"flex items-start space-x-2",children:[(0,t.jsx)(p.MapPin,{className:"h-4 w-4 mt-1 text-muted-foreground"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:"Địa chỉ hiện tại"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:A.currentAddress})]})]})]})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{className:"text-lg",children:"Thông tin cá nhân"})}),(0,t.jsxs)(r.CardContent,{className:"space-y-2 text-sm",children:[A.dateOfBirth&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Ngày sinh:"}),(0,t.jsx)("span",{children:new Date(A.dateOfBirth).toLocaleDateString("vi-VN")})]}),A.gender&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Giới tính:"}),(0,t.jsx)("span",{children:"MALE"===A.gender?"Nam":"FEMALE"===A.gender?"Nữ":"Khác"})]}),A.maritalStatus&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Tình trạng hôn nhân:"}),(0,t.jsx)("span",{children:"SINGLE"===A.maritalStatus?"Độc thân":"MARRIED"===A.maritalStatus?"Đã kết hôn":"Khác"})]}),A.nationality&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Quốc tịch:"}),(0,t.jsx)("span",{children:A.nationality})]}),A.citizenId&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"CCCD/CMND:"}),(0,t.jsx)("span",{children:A.citizenId})]}),A.taxCode&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Mã số thuế:"}),(0,t.jsx)("span",{children:A.taxCode})]})]})]})]}),(0,t.jsxs)("div",{className:"md:col-span-2 space-y-6",children:[(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(h.default,{className:"mr-2 h-5 w-5"}),"Thông tin công việc"]})}),(0,t.jsx)(r.CardContent,{className:"space-y-4",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[A.department&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Phòng ban"}),(0,t.jsxs)("p",{className:"flex items-center mt-1",children:[(0,t.jsx)(C.Building2,{className:"mr-2 h-4 w-4 text-muted-foreground"}),A.department]})]}),A.position&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Chức vụ"}),(0,t.jsx)("p",{className:"mt-1",children:A.position})]}),A.startDate&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Ngày bắt đầu"}),(0,t.jsxs)("p",{className:"flex items-center mt-1",children:[(0,t.jsx)(f.Calendar,{className:"mr-2 h-4 w-4 text-muted-foreground"}),new Date(A.startDate).toLocaleDateString("vi-VN")]})]}),A.probationEndDate&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Kết thúc thử việc"}),(0,t.jsxs)("p",{className:"flex items-center mt-1",children:[(0,t.jsx)(f.Calendar,{className:"mr-2 h-4 w-4 text-muted-foreground"}),new Date(A.probationEndDate).toLocaleDateString("vi-VN")]})]})]})})]}),A.education&&A.education.length>0&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(x.GraduationCap,{className:"mr-2 h-5 w-5"}),"Học vấn"]})}),(0,t.jsx)(r.CardContent,{className:"space-y-4",children:A.education.map((e,a)=>(0,t.jsxs)("div",{className:"border-l-2 border-primary pl-4",children:[(0,t.jsx)("h3",{className:"font-semibold",children:e.degree}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:e.institution}),e.fieldOfStudy&&(0,t.jsx)("p",{className:"text-sm",children:e.fieldOfStudy}),e.graduationYear&&(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:["Tốt nghiệp: ",e.graduationYear]})]},a))})]}),A.certifications&&A.certifications.length>0&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(g.Award,{className:"mr-2 h-5 w-5"}),"Chứng chỉ"]})}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:A.certifications.map((e,a)=>(0,t.jsxs)("div",{className:"border rounded-lg p-3",children:[(0,t.jsx)("h3",{className:"font-semibold text-sm",children:e.name}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:e.issuingOrganization}),e.issueDate&&(0,t.jsxs)("p",{className:"text-xs mt-1",children:["Ngày cấp: ",new Date(e.issueDate).toLocaleDateString("vi-VN")]}),e.expiryDate&&(0,t.jsxs)("p",{className:"text-xs",children:["Hết hạn: ",new Date(e.expiryDate).toLocaleDateString("vi-VN")]})]},a))})})]}),A.languages&&A.languages.length>0&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(y.default,{className:"mr-2 h-5 w-5"}),"Ngoại ngữ"]})}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:A.languages.map((e,a)=>(0,t.jsxs)(l.Badge,{variant:"outline",children:[e.language," - ",e.proficiency]},a))})})]}),A.skills&&A.skills.length>0&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{children:"Kỹ năng"})}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:A.skills.map((e,a)=>(0,t.jsx)(l.Badge,{children:e},a))})})]}),(A.emergencyContactName||A.emergencyContactRelationship||A.emergencyContactPhone)&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{children:"Liên hệ khẩn cấp"})}),(0,t.jsxs)(r.CardContent,{className:"space-y-2",children:[A.emergencyContactName&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:"Tên:"}),(0,t.jsx)("span",{className:"text-sm font-medium",children:A.emergencyContactName})]}),A.emergencyContactRelationship&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:"Quan hệ:"}),(0,t.jsx)("span",{className:"text-sm",children:A.emergencyContactRelationship})]}),A.emergencyContactPhone&&(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:"Điện thoại:"}),(0,t.jsx)("span",{className:"text-sm",children:A.emergencyContactPhone})]})]})]}),(0,t.jsx)(k.default,{href:`/admin/hr/employee/${I}/documents`,children:(0,t.jsx)(r.Card,{className:"hover:bg-muted/50 transition-colors cursor-pointer",children:(0,t.jsx)(r.CardContent,{className:"py-6",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)(N.FileText,{className:"h-6 w-6 text-primary"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-semibold",children:"Tài liệu"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Xem và quản lý tài liệu nhân viên"})]})]}),(0,t.jsx)(i.Button,{variant:"ghost",children:"Xem tài liệu"})]})})})})]})]})]})}e.s(["default",()=>D],146259)}]);