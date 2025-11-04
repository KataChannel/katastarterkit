(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},421329,e=>{"use strict";var t=e.i(565977);e.s(["FileText",()=>t.default])},67087,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let r=a.forwardRef(({className:e,orientation:a="horizontal",decorative:r=!0,...i},l)=>(0,t.jsx)("div",{ref:l,role:r?"none":"separator","aria-orientation":r?void 0:a,className:(0,s.cn)("shrink-0 bg-gray-200","horizontal"===a?"h-[1px] w-full":"h-full w-[1px]",e),...i}));r.displayName="Separator",e.s(["Separator",()=>r])},865706,e=>{"use strict";var t=e.i(99140);e.s(["Award",()=>t.default])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},649248,e=>{"use strict";var t=e.i(336613);e.s(["DollarSign",()=>t.default])},126455,e=>{"use strict";var t=e.i(861699);e.s(["Package",()=>t.default])},172362,e=>{"use strict";var t=e.i(44990),a=e.i(403055);let s=a.forwardRef(({className:e,indeterminate:s,onCheckedChange:r,...i},l)=>{let n=a.useRef(null);return a.useImperativeHandle(l,()=>n.current),a.useEffect(()=>{n.current&&(n.current.indeterminate=!!s)},[s]),(0,t.jsx)("input",{type:"checkbox",ref:n,className:`h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500 ${e||""}`,onChange:e=>{r?.(e.target.checked),i.onChange?.(e)},...i})});s.displayName="Checkbox",e.s(["Checkbox",()=>s])},774309,e=>{"use strict";var t=e.i(44990);let a=e.i(403055).forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...a}));a.displayName="Skeleton",e.s(["Skeleton",()=>a])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),s=e.i(403055),r=e.i(984804);let i=r.gql`
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
`,f=r.gql`
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
`,g=r.gql`
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
`,y=r.gql`
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
`,b=r.gql`
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
`,C=r.gql`
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
`,j=r.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(N,{refetchQueries:[g,b]});return{completeOffboarding:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:r}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(h);return{completeOnboardingTask:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{checklistId:t,taskId:a}});return s.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(P,{refetchQueries:[v]});return{createDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(n,{refetchQueries:[l,b]});return{createEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(y,{refetchQueries:[g,b]});return{createOffboardingProcess:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(m,{refetchQueries:[u,b]});return{createOnboardingChecklist:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(j,{refetchQueries:[v]});return{deleteDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(d,{refetchQueries:[l,b]});return{deleteEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:r}},"useEmployeeDocuments",0,(e,a)=>{let{data:r,loading:i,error:l,refetch:n,fetchMore:o}=(0,t.useQuery)(v,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,s.useCallback)(async()=>{r?.employeeDocuments.hasMore&&await o({variables:{skip:r.employeeDocuments.documents.length}})},[o,r]);return{documents:r?.employeeDocuments.documents||[],total:r?.employeeDocuments.total||0,hasMore:r?.employeeDocuments.hasMore||!1,loading:i,error:l,refetch:n,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:s,error:r,refetch:l}=(0,t.useQuery)(i,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:s,error:r,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:a,loading:r,error:i,refetch:n,fetchMore:o}=(0,t.useQuery)(l,{variables:e}),d=(0,s.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&o({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,o,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:r,error:i,refetch:n,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:s,refetch:r}=(0,t.useQuery)(b);return{statistics:e?.hrStatistics,loading:a,error:s,refetch:r}},"useOffboardingProcess",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(f,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:s,error:r,refetch:i}},"useOffboardingProcesses",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(g,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&n({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,n,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useOnboardingChecklist",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:s,error:r,refetch:i}},"useOnboardingChecklists",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(u,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&n({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,n,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(k,{refetchQueries:[v,C]});return{updateDocument:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(o);return{updateEmployeeProfile:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(x);return{updateOffboardingProcess:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(p);return{updateOnboardingChecklist:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOnboardingChecklist}}],598626)},38915,e=>{"use strict";var t,a,s,r,i=((t={}).CV="CV",t.CONTRACT="CONTRACT",t.ID_CARD="ID_CARD",t.PASSPORT="PASSPORT",t.DEGREE="DEGREE",t.CERTIFICATE="CERTIFICATE",t.PHOTO="PHOTO",t.BANK_INFO="BANK_INFO",t.HEALTH_CERTIFICATE="HEALTH_CERTIFICATE",t.OTHER="OTHER",t),l=((a={}).PENDING="PENDING",a.IN_PROGRESS="IN_PROGRESS",a.COMPLETED="COMPLETED",a.CANCELLED="CANCELLED",a),n=((s={}).INITIATED="INITIATED",s.IN_PROGRESS="IN_PROGRESS",s.PENDING_APPROVAL="PENDING_APPROVAL",s.APPROVED="APPROVED",s.COMPLETED="COMPLETED",s.CANCELLED="CANCELLED",s),o=((r={}).PENDING="PENDING",r.PARTIAL="PARTIAL",r.COMPLETE="COMPLETE",r);e.s(["ClearanceStatus",()=>o,"DocumentType",()=>i,"OffboardingStatus",()=>n,"OnboardingStatus",()=>l])},959675,e=>{"use strict";var t=e.i(763189);e.s(["UserMinus",()=>t.default])},498697,e=>{"use strict";var t=e.i(782279);e.s(["Key",()=>t.default])},656767,e=>{"use strict";var t=e.i(44990),a=e.i(130775),s=e.i(598626),r=e.i(775680),i=e.i(885205),l=e.i(702470),n=e.i(774309),o=e.i(67087),d=e.i(172362),c=e.i(4993),u=e.i(519647),m=e.i(959675),p=e.i(435635),h=e.i(112641),f=e.i(415588),g=e.i(909905),y=e.i(198513),x=e.i(257117),N=e.i(169100),b=e.i(421329),C=e.i(649248),v=e.i(126455),P=e.i(498697),k=e.i(865706),j=e.i(579448),D=e.i(38915);function I(){var e,I;let E,O,T,A=(0,a.useParams)();(0,a.useRouter)();let{toast:S}=(0,c.useToast)(),w=A.id,{offboardingProcess:$,loading:R,refetch:L}=(0,s.useOffboardingProcess)(w),{updateOffboardingProcess:M,loading:B}=(0,s.useUpdateOffboardingProcess)(),{completeOffboarding:q,loading:G}=(0,s.useCompleteOffboarding)(),V=async e=>{try{await M(w,{status:e}),S({title:"Thành công",description:"Đã cập nhật trạng thái offboarding",type:"success"}),L()}catch(e){S({title:"Lỗi",description:e.message||"Không thể cập nhật trạng thái",type:"error"})}},H=async()=>{try{await q(w),S({title:"Thành công",description:"Đã hoàn thành offboarding",type:"success"}),L()}catch(e){S({title:"Lỗi",description:e.message||"Không thể hoàn thành offboarding",type:"error"})}};return R?(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsx)(n.Skeleton,{className:"h-10 w-64"}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,t.jsx)(n.Skeleton,{className:"h-96"}),(0,t.jsx)(n.Skeleton,{className:"h-96 md:col-span-2"})]})]}):$?(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsx)(j.default,{href:"/admin/hr/offboarding",children:(0,t.jsx)(i.Button,{variant:"ghost",size:"icon",children:(0,t.jsx)(u.ArrowLeft,{className:"h-5 w-5"})})}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-3xl font-bold tracking-tight",children:["Offboarding - ",$.employeeProfile?.fullName||"N/A"]}),(0,t.jsx)("p",{className:"text-muted-foreground",children:$.employeeProfile?.employeeCode||"-"})]})]}),(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(e=$.status,O=(E=({[D.OffboardingStatus.INITIATED]:{variant:"secondary",icon:y.AlertCircle,label:"Khởi tạo"},[D.OffboardingStatus.IN_PROGRESS]:{variant:"default",icon:f.Clock,label:"Đang xử lý"},[D.OffboardingStatus.PENDING_APPROVAL]:{variant:"default",icon:N.AlertTriangle,label:"Chờ phê duyệt",className:"bg-yellow-500"},[D.OffboardingStatus.APPROVED]:{variant:"default",icon:h.CheckCircle2,label:"Đã phê duyệt",className:"bg-blue-500"},[D.OffboardingStatus.COMPLETED]:{variant:"default",icon:h.CheckCircle2,label:"Hoàn thành",className:"bg-green-500"},[D.OffboardingStatus.CANCELLED]:{variant:"destructive",icon:x.XCircle,label:"Đã hủy"}})[e]).icon,(0,t.jsxs)(l.Badge,{variant:E.variant,className:E.className,children:[(0,t.jsx)(O,{className:"mr-1 h-3 w-3"}),E.label]})),(I=$.clearanceStatus,T=({[D.ClearanceStatus.PENDING]:{variant:"secondary",label:"Chưa hoàn tất"},[D.ClearanceStatus.PARTIAL]:{variant:"default",label:"Một phần",className:"bg-orange-500"},[D.ClearanceStatus.COMPLETE]:{variant:"default",label:"Hoàn tất",className:"bg-green-500"}})[I],(0,t.jsx)(l.Badge,{variant:T.variant,className:T.className,children:T.label}))]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{children:"Thông tin nghỉ việc"})}),(0,t.jsxs)(r.CardContent,{className:"space-y-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Lý do"}),(0,t.jsx)("p",{className:"text-sm",children:$.exitReason})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Loại"}),(0,t.jsx)("p",{className:"text-sm",children:"RESIGNATION"===$.exitType?"Từ chức":"TERMINATION"===$.exitType?"Chấm dứt HĐ":"RETIREMENT"===$.exitType?"Nghỉ hưu":"CONTRACT_END"===$.exitType?"Hết hợp đồng":"Thỏa thuận chung"})]}),(0,t.jsx)(o.Separator,{}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Ngày cuối làm việc"}),(0,t.jsxs)("p",{className:"text-sm flex items-center",children:[(0,t.jsx)(p.Calendar,{className:"mr-2 h-4 w-4"}),new Date($.lastWorkingDay).toLocaleDateString("vi-VN")]})]}),$.effectiveDate&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Ngày có hiệu lực"}),(0,t.jsxs)("p",{className:"text-sm flex items-center",children:[(0,t.jsx)(p.Calendar,{className:"mr-2 h-4 w-4"}),new Date($.effectiveDate).toLocaleDateString("vi-VN")]})]})]})]}),$.exitInterviewScheduled&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(b.FileText,{className:"mr-2 h-5 w-5"}),"Phỏng vấn nghỉ việc"]})}),(0,t.jsxs)(r.CardContent,{className:"space-y-3",children:[$.exitInterviewDate&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Ngày phỏng vấn"}),(0,t.jsx)("p",{className:"text-sm",children:new Date($.exitInterviewDate).toLocaleDateString("vi-VN")})]}),$.exitInterviewBy&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Người phỏng vấn"}),(0,t.jsx)("p",{className:"text-sm",children:$.exitInterviewBy})]}),$.exitInterviewNotes&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground mb-2",children:"Ghi chú"}),(0,t.jsx)("p",{className:"text-sm p-3 bg-muted rounded-lg",children:$.exitInterviewNotes})]})]})]}),void 0!==$.eligibleForRehire&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(k.Award,{className:"mr-2 h-5 w-5"}),"Tái tuyển dụng"]})}),(0,t.jsxs)(r.CardContent,{children:[(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)(d.Checkbox,{checked:$.eligibleForRehire,disabled:!0}),(0,t.jsx)("span",{className:"text-sm",children:$.eligibleForRehire?"Đủ điều kiện tái tuyển dụng":"Không đủ điều kiện"})]}),$.rehireNotes&&(0,t.jsx)("p",{className:"text-sm text-muted-foreground mt-2",children:$.rehireNotes})]})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{children:"Hành động"})}),(0,t.jsxs)(r.CardContent,{className:"space-y-2",children:[$.status===D.OffboardingStatus.INITIATED&&(0,t.jsx)(i.Button,{className:"w-full",onClick:()=>V(D.OffboardingStatus.IN_PROGRESS),disabled:B,children:"Bắt đầu xử lý"}),$.status===D.OffboardingStatus.IN_PROGRESS&&(0,t.jsx)(i.Button,{className:"w-full",onClick:()=>V(D.OffboardingStatus.PENDING_APPROVAL),disabled:B,children:"Gửi phê duyệt"}),$.status===D.OffboardingStatus.PENDING_APPROVAL&&(0,t.jsx)(i.Button,{className:"w-full",onClick:()=>V(D.OffboardingStatus.APPROVED),disabled:B,children:"Phê duyệt"}),$.status===D.OffboardingStatus.APPROVED&&(0,t.jsx)(i.Button,{className:"w-full",onClick:H,disabled:G||$.clearanceStatus!==D.ClearanceStatus.COMPLETE,children:"Hoàn thành offboarding"}),[D.OffboardingStatus.INITIATED,D.OffboardingStatus.IN_PROGRESS].includes($.status)&&(0,t.jsx)(i.Button,{className:"w-full",variant:"outline",onClick:()=>V(D.OffboardingStatus.CANCELLED),disabled:B,children:"Hủy offboarding"})]})]})]}),(0,t.jsxs)("div",{className:"md:col-span-2 space-y-6",children:[$.assetReturnChecklist&&$.assetReturnChecklist.length>0&&(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(v.Package,{className:"mr-2 h-5 w-5"}),"Danh sách tài sản cần trả"]}),(0,t.jsx)(r.CardDescription,{children:"Theo dõi việc trả lại tài sản công ty"})]}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"space-y-3",children:$.assetReturnChecklist.map((e,a)=>(0,t.jsxs)("div",{className:"flex items-start space-x-3 p-3 rounded-lg border",children:[(0,t.jsx)(d.Checkbox,{checked:e.returned,disabled:!0}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:e.asset}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:e.category}),e.returned&&e.returnedDate&&(0,t.jsxs)("p",{className:"text-xs text-green-600 mt-1",children:["Đã trả: ",new Date(e.returnedDate).toLocaleDateString("vi-VN"),e.returnedTo&&` - Người nhận: ${e.returnedTo}`]})]})]},a))})})]}),$.knowledgeTransferPlan&&$.knowledgeTransferPlan.length>0&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(b.FileText,{className:"mr-2 h-5 w-5"}),"Kế hoạch bàn giao công việc"]})}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"space-y-3",children:$.knowledgeTransferPlan.map((e,a)=>(0,t.jsx)("div",{className:"p-3 rounded-lg border",children:(0,t.jsxs)("div",{className:"flex justify-between items-start",children:[(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:e.task}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:e.area}),(0,t.jsxs)("p",{className:"text-xs mt-1",children:["Bàn giao cho: ",e.assignedTo]})]}),(0,t.jsx)(l.Badge,{variant:"Completed"===e.status||"In Progress"===e.status?"default":"secondary",className:"Completed"===e.status?"bg-green-500":"In Progress"===e.status?"bg-blue-500":"",children:"Completed"===e.status?"Hoàn thành":"In Progress"===e.status?"Đang thực hiện":"Chờ xử lý"})]})},a))})})]}),$.accessRevocationList&&$.accessRevocationList.length>0&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(P.Key,{className:"mr-2 h-5 w-5"}),"Thu hồi quyền truy cập"]})}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"space-y-2",children:$.accessRevocationList.map((e,a)=>(0,t.jsxs)("div",{className:"flex items-center justify-between p-2 rounded border",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)(d.Checkbox,{checked:e.revoked,disabled:!0}),(0,t.jsx)("span",{className:"text-sm",children:e.system})]}),e.revoked&&e.revokedAt&&(0,t.jsx)("span",{className:"text-xs text-muted-foreground",children:new Date(e.revokedAt).toLocaleDateString("vi-VN")})]},a))})})]}),void 0!==$.finalSalaryAmount&&(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(C.DollarSign,{className:"mr-2 h-5 w-5"}),"Quyết toán cuối cùng"]})}),(0,t.jsxs)(r.CardContent,{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4 text-sm",children:[$.finalSalaryAmount&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-muted-foreground",children:"Lương cuối:"}),(0,t.jsxs)("p",{className:"font-medium",children:[$.finalSalaryAmount.toLocaleString("vi-VN")," VNĐ"]})]}),$.unusedLeaveDays&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-muted-foreground",children:"Ngày phép chưa dùng:"}),(0,t.jsxs)("p",{className:"font-medium",children:[$.unusedLeaveDays," ngày"]})]}),$.leavePayoutAmount&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-muted-foreground",children:"Thanh toán phép:"}),(0,t.jsxs)("p",{className:"font-medium",children:[$.leavePayoutAmount.toLocaleString("vi-VN")," VNĐ"]})]}),$.bonusAmount&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-muted-foreground",children:"Thưởng:"}),(0,t.jsxs)("p",{className:"font-medium",children:[$.bonusAmount.toLocaleString("vi-VN")," VNĐ"]})]})]}),(0,t.jsx)(o.Separator,{}),$.totalSettlement&&(0,t.jsxs)("div",{className:"flex justify-between items-center text-lg font-bold",children:[(0,t.jsx)("span",{children:"Tổng cộng:"}),(0,t.jsxs)("span",{className:"text-primary",children:[$.totalSettlement.toLocaleString("vi-VN")," VNĐ"]})]}),$.paymentDate&&(0,t.jsxs)("div",{className:"text-sm text-muted-foreground",children:["Ngày thanh toán: ",new Date($.paymentDate).toLocaleDateString("vi-VN")]})]})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsx)(r.CardHeader,{children:(0,t.jsx)(r.CardTitle,{children:"Ghi chú & Nhận xét"})}),(0,t.jsxs)(r.CardContent,{className:"space-y-4",children:[$.hrNotes&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground mb-2",children:"Ghi chú HR"}),(0,t.jsx)("p",{className:"text-sm p-3 bg-muted rounded-lg",children:$.hrNotes})]}),$.managerComments&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground mb-2",children:"Nhận xét của quản lý"}),(0,t.jsx)("p",{className:"text-sm p-3 bg-muted rounded-lg",children:$.managerComments})]}),$.employeeComments&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground mb-2",children:"Nhận xét của nhân viên"}),(0,t.jsx)("p",{className:"text-sm p-3 bg-muted rounded-lg",children:$.employeeComments})]})]})]}),$.employeeProfile&&(0,t.jsx)(j.default,{href:`/admin/hr/employee/${$.employeeProfileId}`,children:(0,t.jsx)(r.Card,{className:"hover:bg-muted/50 transition-colors cursor-pointer",children:(0,t.jsx)(r.CardContent,{className:"py-4",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)(g.User,{className:"h-6 w-6 text-primary"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-semibold",children:"Xem hồ sơ nhân viên"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:$.employeeProfile.fullName})]})]}),(0,t.jsx)(i.Button,{variant:"ghost",children:"Xem chi tiết"})]})})})})]})]})]}):(0,t.jsx)("div",{className:"container mx-auto p-6",children:(0,t.jsx)(r.Card,{children:(0,t.jsxs)(r.CardContent,{className:"py-12 text-center text-muted-foreground",children:[(0,t.jsx)(m.UserMinus,{className:"mx-auto h-12 w-12 mb-2"}),(0,t.jsx)("p",{children:"Không tìm thấy thông tin offboarding"}),(0,t.jsx)(j.default,{href:"/admin/hr/offboarding",children:(0,t.jsx)(i.Button,{variant:"outline",className:"mt-4",children:"Quay lại danh sách"})})]})})})}e.s(["default",()=>I])}]);