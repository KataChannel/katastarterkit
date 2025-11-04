(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},67087,e=>{"use strict";var t=e.i(44990),s=e.i(403055),a=e.i(541428);let r=s.forwardRef(({className:e,orientation:s="horizontal",decorative:r=!0,...i},l)=>(0,t.jsx)("div",{ref:l,role:r?"none":"separator","aria-orientation":r?void 0:s,className:(0,a.cn)("shrink-0 bg-gray-200","horizontal"===s?"h-[1px] w-full":"h-full w-[1px]",e),...i}));r.displayName="Separator",e.s(["Separator",()=>r])},865706,e=>{"use strict";var t=e.i(99140);e.s(["Award",()=>t.default])},738543,e=>{"use strict";var t=e.i(507685);e.s(["BarChart3",()=>t.default])},320309,e=>{"use strict";var t=e.i(366456);e.s(["UserPlus",()=>t.default])},701325,e=>{"use strict";var t=e.i(740093);e.s(["Building2",()=>t.default])},774309,e=>{"use strict";var t=e.i(44990);let s=e.i(403055).forwardRef(({className:e,...s},a)=>(0,t.jsx)("div",{ref:a,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...s}));s.displayName="Skeleton",e.s(["Skeleton",()=>s])},598626,e=>{"use strict";var t=e.i(429105),s=e.i(950988),a=e.i(403055),r=e.i(984804);let i=r.gql`
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
`,j=r.gql`
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
`,v=r.gql`
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
`,P=r.gql`
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
`,k=r.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:r}]=(0,s.useMutation)(b,{refetchQueries:[g,N]});return{completeOffboarding:(0,a.useCallback)(async t=>{try{let s=await e({variables:{id:t}});return s.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:r}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:r}]=(0,s.useMutation)(h);return{completeOnboardingTask:(0,a.useCallback)(async(t,s)=>{try{let a=await e({variables:{checklistId:t,taskId:s}});return a.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,s.useMutation)(v,{refetchQueries:[j]});return{createDocument:(0,a.useCallback)(async t=>{try{let s=await e({variables:{input:t}});return s.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,s.useMutation)(n,{refetchQueries:[l,N]});return{createEmployeeProfile:(0,a.useCallback)(async t=>{try{let s=await e({variables:{input:t}});return s.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,s.useMutation)(y,{refetchQueries:[g,N]});return{createOffboardingProcess:(0,a.useCallback)(async t=>{try{let s=await e({variables:{input:t}});return s.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,s.useMutation)(u,{refetchQueries:[m,N]});return{createOnboardingChecklist:(0,a.useCallback)(async t=>{try{let s=await e({variables:{input:t}});return s.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,s.useMutation)(k,{refetchQueries:[j]});return{deleteDocument:(0,a.useCallback)(async t=>{try{let s=await e({variables:{id:t}});return s.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:r}]=(0,s.useMutation)(d,{refetchQueries:[l,N]});return{deleteEmployeeProfile:(0,a.useCallback)(async t=>{try{let s=await e({variables:{id:t}});return s.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:r}},"useEmployeeDocuments",0,(e,s)=>{let{data:r,loading:i,error:l,refetch:n,fetchMore:o}=(0,t.useQuery)(j,{variables:{employeeProfileId:e,documentType:s?.documentType,skip:s?.skip||0,take:s?.take||50},skip:!e}),d=(0,a.useCallback)(async()=>{r?.employeeDocuments.hasMore&&await o({variables:{skip:r.employeeDocuments.documents.length}})},[o,r]);return{documents:r?.employeeDocuments.documents||[],total:r?.employeeDocuments.total||0,hasMore:r?.employeeDocuments.hasMore||!1,loading:i,error:l,refetch:n,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:s,loading:a,error:r,refetch:l}=(0,t.useQuery)(i,{variables:{id:e},skip:!e});return{employeeProfile:s?.employeeProfile,loading:a,error:r,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:s,loading:r,error:i,refetch:n,fetchMore:o}=(0,t.useQuery)(l,{variables:e}),d=(0,a.useCallback)(()=>{s?.listEmployeeProfiles.hasMore&&o({variables:{...e,skip:s.listEmployeeProfiles.employees.length}})},[s,o,e]);return{employees:s?.listEmployeeProfiles.employees||[],total:s?.listEmployeeProfiles.total||0,hasMore:s?.listEmployeeProfiles.hasMore||!1,loading:r,error:i,refetch:n,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:s,error:a,refetch:r}=(0,t.useQuery)(N);return{statistics:e?.hrStatistics,loading:s,error:a,refetch:r}},"useOffboardingProcess",0,e=>{let{data:s,loading:a,error:r,refetch:i}=(0,t.useQuery)(f,{variables:{id:e},skip:!e});return{offboardingProcess:s?.offboardingProcess,loading:a,error:r,refetch:i}},"useOffboardingProcesses",0,e=>{let{data:s,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(g,{variables:e}),o=(0,a.useCallback)(()=>{s?.listOffboardingProcesses.hasMore&&n({variables:{...e,skip:s.listOffboardingProcesses.processes.length}})},[s,n,e]);return{processes:s?.listOffboardingProcesses.processes||[],total:s?.listOffboardingProcesses.total||0,hasMore:s?.listOffboardingProcesses.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useOnboardingChecklist",0,e=>{let{data:s,loading:a,error:r,refetch:i}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:s?.onboardingChecklist,loading:a,error:r,refetch:i}},"useOnboardingChecklists",0,e=>{let{data:s,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(m,{variables:e}),o=(0,a.useCallback)(()=>{s?.listOnboardingChecklists.hasMore&&n({variables:{...e,skip:s.listOnboardingChecklists.checklists.length}})},[s,n,e]);return{checklists:s?.listOnboardingChecklists.checklists||[],total:s?.listOnboardingChecklists.total||0,hasMore:s?.listOnboardingChecklists.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,s.useMutation)(P,{refetchQueries:[j,C]});return{updateDocument:(0,a.useCallback)(async(t,s)=>{try{let a=await e({variables:{id:t,input:s}});return a.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,s.useMutation)(o);return{updateEmployeeProfile:(0,a.useCallback)(async(t,s)=>{try{let a=await e({variables:{id:t,input:s}});return a.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,s.useMutation)(x);return{updateOffboardingProcess:(0,a.useCallback)(async(t,s)=>{try{let a=await e({variables:{id:t,input:s}});return a.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,s.useMutation)(p);return{updateOnboardingChecklist:(0,a.useCallback)(async(t,s)=>{try{let a=await e({variables:{id:t,input:s}});return a.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOnboardingChecklist}}],598626)},38915,e=>{"use strict";var t,s,a,r,i=((t={}).CV="CV",t.CONTRACT="CONTRACT",t.ID_CARD="ID_CARD",t.PASSPORT="PASSPORT",t.DEGREE="DEGREE",t.CERTIFICATE="CERTIFICATE",t.PHOTO="PHOTO",t.BANK_INFO="BANK_INFO",t.HEALTH_CERTIFICATE="HEALTH_CERTIFICATE",t.OTHER="OTHER",t),l=((s={}).PENDING="PENDING",s.IN_PROGRESS="IN_PROGRESS",s.COMPLETED="COMPLETED",s.CANCELLED="CANCELLED",s),n=((a={}).INITIATED="INITIATED",a.IN_PROGRESS="IN_PROGRESS",a.PENDING_APPROVAL="PENDING_APPROVAL",a.APPROVED="APPROVED",a.COMPLETED="COMPLETED",a.CANCELLED="CANCELLED",a),o=((r={}).PENDING="PENDING",r.PARTIAL="PARTIAL",r.COMPLETE="COMPLETE",r);e.s(["ClearanceStatus",()=>o,"DocumentType",()=>i,"OffboardingStatus",()=>n,"OnboardingStatus",()=>l])},959675,e=>{"use strict";var t=e.i(763189);e.s(["UserMinus",()=>t.default])},496781,391551,e=>{"use strict";var t=e.i(266184);e.s(["ArrowUp",()=>t.default],496781);var s=e.i(997793);e.s(["ArrowDown",()=>s.default],391551)},370458,e=>{"use strict";var t=e.i(44990),s=e.i(403055),a=e.i(598626),r=e.i(775680),i=e.i(702470),l=e.i(774309),n=e.i(67087),o=e.i(738543),d=e.i(759727),c=e.i(771564),m=e.i(320309),u=e.i(959675),p=e.i(435635),h=e.i(701325),f=e.i(865706),g=e.i(496781),y=e.i(391551),x=e.i(38915);function b(){let{statistics:e,loading:b}=(0,a.useHRStatistics)(),{employees:N,loading:C}=(0,a.useEmployeeProfiles)({take:1e3}),{checklists:j,loading:v}=(0,a.useOnboardingChecklists)({take:1e3}),{processes:P,loading:k}=(0,a.useOffboardingProcesses)({take:1e3}),D=(0,s.useMemo)(()=>{let e=new Map;return N.forEach(t=>{let s=t.department||"Không xác định";e.set(s,(e.get(s)||0)+1)}),Array.from(e.entries()).map(([e,t])=>({name:e,count:t})).sort((e,t)=>t.count-e.count)},[N]),E=(0,s.useMemo)(()=>{let e=new Map;return N.forEach(t=>{let s=t.position||"Không xác định";e.set(s,(e.get(s)||0)+1)}),Array.from(e.entries()).map(([e,t])=>({name:e,count:t})).sort((e,t)=>t.count-e.count).slice(0,10)},[N]),I=(0,s.useMemo)(()=>{let e=new Map;return N.forEach(t=>{let s=t.contractType||"Không xác định",a="FULL_TIME"===s?"Toàn thời gian":"PART_TIME"===s?"Bán thời gian":"CONTRACT"===s?"Hợp đồng":"INTERNSHIP"===s?"Thực tập":"PROBATION"===s?"Thử việc":"Khác";e.set(a,(e.get(a)||0)+1)}),Array.from(e.entries()).map(([e,t])=>({name:e,count:t}))},[N]),T=(0,s.useMemo)(()=>{let e=j.length,t=j.filter(e=>e.status===x.OnboardingStatus.COMPLETED).length,s=j.filter(e=>e.status===x.OnboardingStatus.IN_PROGRESS).length;return{total:e,completed:t,inProgress:s,pending:j.filter(e=>e.status===x.OnboardingStatus.PENDING).length,cancelled:j.filter(e=>e.status===x.OnboardingStatus.CANCELLED).length,completionRate:e>0?Math.round(t/e*100):0,avgProgress:e>0?Math.round(j.reduce((e,t)=>e+t.progressPercentage,0)/e):0}},[j]),O=(0,s.useMemo)(()=>{let e=P.length,t=P.filter(e=>e.status===x.OffboardingStatus.COMPLETED).length,s=P.filter(e=>e.status===x.OffboardingStatus.IN_PROGRESS).length,a=P.filter(e=>e.status===x.OffboardingStatus.PENDING_APPROVAL).length,r=new Map;return P.forEach(e=>{let t="RESIGNATION"===e.exitType?"Từ chức":"TERMINATION"===e.exitType?"Chấm dứt HĐ":"RETIREMENT"===e.exitType?"Nghỉ hưu":"CONTRACT_END"===e.exitType?"Hết hợp đồng":"Thỏa thuận chung";r.set(t,(r.get(t)||0)+1)}),{total:e,completed:t,inProgress:s,pendingApproval:a,exitTypes:Array.from(r.entries()).map(([e,t])=>({name:e,count:t}))}},[P]),A=(0,s.useMemo)(()=>{let e=[],t=new Date;for(let s=5;s>=0;s--){let a=new Date(t.getFullYear(),t.getMonth()-s,1),r=a.toLocaleDateString("vi-VN",{month:"short",year:"numeric"}),i=j.filter(e=>{let t=new Date(e.startDate);return t.getMonth()===a.getMonth()&&t.getFullYear()===a.getFullYear()}).length,l=P.filter(e=>{let t=new Date(e.lastWorkingDay);return t.getMonth()===a.getMonth()&&t.getFullYear()===a.getFullYear()}).length;e.push({month:r,onboarding:i,offboarding:l})}return e},[j,P]);return b||C||v||k?(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsx)(l.Skeleton,{className:"h-10 w-64"}),(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[1,2,3,4].map(e=>(0,t.jsx)(l.Skeleton,{className:"h-32"},e))}),(0,t.jsx)(l.Skeleton,{className:"h-96"})]}):(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-3xl font-bold tracking-tight flex items-center",children:[(0,t.jsx)(o.BarChart3,{className:"mr-3 h-8 w-8"}),"Báo cáo & Phân tích"]}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Thống kê và phân tích toàn diện về nhân sự"})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",children:[(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)(r.CardTitle,{className:"text-sm font-medium",children:"Tổng nhân viên"}),(0,t.jsx)(c.Users,{className:"h-4 w-4 text-muted-foreground"})]}),(0,t.jsxs)(r.CardContent,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold",children:e?.totalEmployees||0}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[e?.activeEmployees||0," đang hoạt động"]})]})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)(r.CardTitle,{className:"text-sm font-medium",children:"Onboarding"}),(0,t.jsx)(m.UserPlus,{className:"h-4 w-4 text-muted-foreground"})]}),(0,t.jsxs)(r.CardContent,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold",children:T.total}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[T.completionRate,"% hoàn thành"]})]})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)(r.CardTitle,{className:"text-sm font-medium",children:"Offboarding"}),(0,t.jsx)(u.UserMinus,{className:"h-4 w-4 text-muted-foreground"})]}),(0,t.jsxs)(r.CardContent,{children:[(0,t.jsx)("div",{className:"text-2xl font-bold",children:O.total}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[O.inProgress," đang xử lý"]})]})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)(r.CardTitle,{className:"text-sm font-medium",children:"Tỷ lệ thay đổi"}),(0,t.jsx)(d.TrendingUp,{className:"h-4 w-4 text-muted-foreground"})]}),(0,t.jsxs)(r.CardContent,{children:[(0,t.jsxs)("div",{className:"text-2xl font-bold",children:[e?.totalEmployees?Math.round(O.total/e.totalEmployees*100):0,"%"]}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Turnover rate"})]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(h.Building2,{className:"mr-2 h-5 w-5"}),"Phân bổ theo phòng ban"]}),(0,t.jsx)(r.CardDescription,{children:"Top phòng ban có nhiều nhân viên nhất"})]}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"space-y-4",children:D.slice(0,8).map(s=>{let a=e?.totalEmployees?Math.round(s.count/e.totalEmployees*100):0;return(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"font-medium",children:s.name}),(0,t.jsxs)("span",{className:"text-muted-foreground",children:[s.count," người (",a,"%)"]})]}),(0,t.jsx)("div",{className:"h-2 bg-muted rounded-full overflow-hidden",children:(0,t.jsx)("div",{className:"h-full bg-primary transition-all",style:{width:`${a}%`}})})]},s.name)})})})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(f.Award,{className:"mr-2 h-5 w-5"}),"Loại hợp đồng"]}),(0,t.jsx)(r.CardDescription,{children:"Phân bổ theo loại hợp đồng lao động"})]}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"space-y-4",children:I.map(s=>{let a=e?.totalEmployees?Math.round(s.count/e.totalEmployees*100):0;return(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-primary"}),(0,t.jsx)("span",{className:"text-sm font-medium",children:s.name})]}),(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:s.count}),(0,t.jsxs)(i.Badge,{variant:"secondary",children:[a,"%"]})]})]},s.name)})})})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(m.UserPlus,{className:"mr-2 h-5 w-5"}),"Phân tích Onboarding"]}),(0,t.jsx)(r.CardDescription,{children:"Trạng thái và tiến độ onboarding"})]}),(0,t.jsxs)(r.CardContent,{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"text-center p-4 bg-muted rounded-lg",children:[(0,t.jsxs)("p",{className:"text-3xl font-bold text-primary",children:[T.completionRate,"%"]}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground mt-1",children:"Tỷ lệ hoàn thành"})]}),(0,t.jsxs)("div",{className:"text-center p-4 bg-muted rounded-lg",children:[(0,t.jsxs)("p",{className:"text-3xl font-bold text-blue-600",children:[T.avgProgress,"%"]}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground mt-1",children:"Tiến độ trung bình"})]})]}),(0,t.jsx)(n.Separator,{}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsx)("span",{className:"text-sm",children:"Hoàn thành"}),(0,t.jsx)(i.Badge,{className:"bg-green-500",children:T.completed})]}),(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsx)("span",{className:"text-sm",children:"Đang thực hiện"}),(0,t.jsx)(i.Badge,{className:"bg-blue-500",children:T.inProgress})]}),(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsx)("span",{className:"text-sm",children:"Chờ xử lý"}),(0,t.jsx)(i.Badge,{variant:"secondary",children:T.pending})]}),(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsx)("span",{className:"text-sm",children:"Đã hủy"}),(0,t.jsx)(i.Badge,{variant:"destructive",children:T.cancelled})]})]})]})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(u.UserMinus,{className:"mr-2 h-5 w-5"}),"Phân tích Offboarding"]}),(0,t.jsx)(r.CardDescription,{children:"Lý do và trạng thái nghỉ việc"})]}),(0,t.jsxs)(r.CardContent,{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("h4",{className:"text-sm font-medium",children:"Lý do nghỉ việc"}),O.exitTypes.map(e=>{let s=O.total?Math.round(e.count/O.total*100):0;return(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{children:e.name}),(0,t.jsxs)("span",{className:"text-muted-foreground",children:[e.count," (",s,"%)"]})]}),(0,t.jsx)("div",{className:"h-2 bg-muted rounded-full overflow-hidden",children:(0,t.jsx)("div",{className:"h-full bg-orange-500 transition-all",style:{width:`${s}%`}})})]},e.name)})]}),(0,t.jsx)(n.Separator,{}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("h4",{className:"text-sm font-medium",children:"Trạng thái"}),(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsx)("span",{className:"text-sm",children:"Hoàn thành"}),(0,t.jsx)(i.Badge,{className:"bg-green-500",children:O.completed})]}),(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsx)("span",{className:"text-sm",children:"Đang xử lý"}),(0,t.jsx)(i.Badge,{className:"bg-blue-500",children:O.inProgress})]}),(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsx)("span",{className:"text-sm",children:"Chờ phê duyệt"}),(0,t.jsx)(i.Badge,{className:"bg-yellow-500",children:O.pendingApproval})]})]})]})]})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsxs)(r.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(p.Calendar,{className:"mr-2 h-5 w-5"}),"Xu hướng 6 tháng gần đây"]}),(0,t.jsx)(r.CardDescription,{children:"Số lượng onboarding và offboarding theo tháng"})]}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"space-y-4",children:A.map(e=>(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex justify-between text-sm font-medium",children:[(0,t.jsx)("span",{children:e.month}),(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsxs)("span",{className:"flex items-center text-green-600",children:[(0,t.jsx)(g.ArrowUp,{className:"h-4 w-4 mr-1"}),e.onboarding," vào"]}),(0,t.jsxs)("span",{className:"flex items-center text-red-600",children:[(0,t.jsx)(y.ArrowDown,{className:"h-4 w-4 mr-1"}),e.offboarding," ra"]}),(0,t.jsxs)("span",{className:"text-muted-foreground",children:["Net: ",e.onboarding-e.offboarding>0?"+":"",e.onboarding-e.offboarding]})]})]}),(0,t.jsxs)("div",{className:"flex space-x-1 h-8",children:[(0,t.jsx)("div",{className:"bg-green-500 rounded transition-all",style:{width:`${Math.max(e.onboarding/Math.max(...A.map(e=>Math.max(e.onboarding,e.offboarding)))*100,2)}%`}}),(0,t.jsx)("div",{className:"bg-red-500 rounded transition-all",style:{width:`${Math.max(e.offboarding/Math.max(...A.map(e=>Math.max(e.onboarding,e.offboarding)))*100,2)}%`}})]})]},e.month))})})]}),(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsx)(r.CardTitle,{children:"Top 10 Chức vụ"}),(0,t.jsx)(r.CardDescription,{children:"Các vị trí có nhiều nhân viên nhất"})]}),(0,t.jsx)(r.CardContent,{children:(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:E.map((e,s)=>(0,t.jsxs)("div",{className:"flex items-center justify-between p-3 border rounded-lg",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)("div",{className:"w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center",children:(0,t.jsxs)("span",{className:"text-sm font-bold text-primary",children:["#",s+1]})}),(0,t.jsx)("span",{className:"font-medium",children:e.name})]}),(0,t.jsxs)(i.Badge,{variant:"outline",children:[e.count," người"]})]},e.name))})})]})]})}e.s(["default",()=>b])}]);