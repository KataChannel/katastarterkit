(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let r=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("textarea",{className:(0,s.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:r,...a}));r.displayName="Textarea",e.s(["Textarea",()=>r])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},965120,e=>{"use strict";var t=e.i(381299);e.s(["Edit",()=>t.default])},553082,e=>{"use strict";var t=e.i(813046);e.s(["Save",()=>t.default])},67087,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let r=a.forwardRef(({className:e,orientation:a="horizontal",decorative:r=!0,...i},l)=>(0,t.jsx)("div",{ref:l,role:r?"none":"separator","aria-orientation":r?void 0:a,className:(0,s.cn)("shrink-0 bg-gray-200","horizontal"===a?"h-[1px] w-full":"h-full w-[1px]",e),...i}));r.displayName="Separator",e.s(["Separator",()=>r])},645030,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(316618),r=e.i(873273),i="Progress",[l,n]=(0,s.createContextScope)(i),[o,d]=l(i),c=a.forwardRef((e,a)=>{var s,i;let{__scopeProgress:l,value:n=null,max:d,getValueLabel:c=p,...u}=e;(d||0===d)&&!g(d)&&console.error((s=`${d}`,`Invalid prop \`max\` of value \`${s}\` supplied to \`Progress\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`));let m=g(d)?d:100;null===n||y(n,m)||console.error((i=`${n}`,`Invalid prop \`value\` of value \`${i}\` supplied to \`Progress\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`));let x=y(n,m)?n:null,b=f(x)?c(x,m):void 0;return(0,t.jsx)(o,{scope:l,value:x,max:m,children:(0,t.jsx)(r.Primitive.div,{"aria-valuemax":m,"aria-valuemin":0,"aria-valuenow":f(x)?x:void 0,"aria-valuetext":b,role:"progressbar","data-state":h(x,m),"data-value":x??void 0,"data-max":m,...u,ref:a})})});c.displayName=i;var u="ProgressIndicator",m=a.forwardRef((e,a)=>{let{__scopeProgress:s,...i}=e,l=d(u,s);return(0,t.jsx)(r.Primitive.div,{"data-state":h(l.value,l.max),"data-value":l.value??void 0,"data-max":l.max,...i,ref:a})});function p(e,t){return`${Math.round(e/t*100)}%`}function h(e,t){return null==e?"indeterminate":e===t?"complete":"loading"}function f(e){return"number"==typeof e}function g(e){return f(e)&&!isNaN(e)&&e>0}function y(e,t){return f(e)&&!isNaN(e)&&e<=t&&e>=0}m.displayName=u;var x=e.i(541428);let b=a.forwardRef(({className:e,value:a,indicatorClassName:s,...r},i)=>(0,t.jsx)(c,{ref:i,className:(0,x.cn)("relative h-4 w-full overflow-hidden rounded-full bg-secondary",e),...r,children:(0,t.jsx)(m,{className:(0,x.cn)("h-full w-full flex-1 bg-primary transition-all",s),style:{transform:`translateX(-${100-(a||0)}%)`}})}));b.displayName=c.displayName,e.s(["Progress",()=>b],645030)},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},320309,e=>{"use strict";var t=e.i(366456);e.s(["UserPlus",()=>t.default])},172362,e=>{"use strict";var t=e.i(44990),a=e.i(403055);let s=a.forwardRef(({className:e,indeterminate:s,onCheckedChange:r,...i},l)=>{let n=a.useRef(null);return a.useImperativeHandle(l,()=>n.current),a.useEffect(()=>{n.current&&(n.current.indeterminate=!!s)},[s]),(0,t.jsx)("input",{type:"checkbox",ref:n,className:`h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500 ${e||""}`,onChange:e=>{r?.(e.target.checked),i.onChange?.(e)},...i})});s.displayName="Checkbox",e.s(["Checkbox",()=>s])},774309,e=>{"use strict";var t=e.i(44990);let a=e.i(403055).forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...a}));a.displayName="Skeleton",e.s(["Skeleton",()=>a])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),s=e.i(403055),r=e.i(984804);let i=r.gql`
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
`,D=r.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(b,{refetchQueries:[g,N]});return{completeOffboarding:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:r}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(h);return{completeOnboardingTask:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{checklistId:t,taskId:a}});return s.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(k,{refetchQueries:[v]});return{createDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(n,{refetchQueries:[l,N]});return{createEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(y,{refetchQueries:[g,N]});return{createOffboardingProcess:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(m,{refetchQueries:[u,N]});return{createOnboardingChecklist:(0,s.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(D,{refetchQueries:[v]});return{deleteDocument:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(d,{refetchQueries:[l,N]});return{deleteEmployeeProfile:(0,s.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:r}},"useEmployeeDocuments",0,(e,a)=>{let{data:r,loading:i,error:l,refetch:n,fetchMore:o}=(0,t.useQuery)(v,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,s.useCallback)(async()=>{r?.employeeDocuments.hasMore&&await o({variables:{skip:r.employeeDocuments.documents.length}})},[o,r]);return{documents:r?.employeeDocuments.documents||[],total:r?.employeeDocuments.total||0,hasMore:r?.employeeDocuments.hasMore||!1,loading:i,error:l,refetch:n,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:s,error:r,refetch:l}=(0,t.useQuery)(i,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:s,error:r,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:a,loading:r,error:i,refetch:n,fetchMore:o}=(0,t.useQuery)(l,{variables:e}),d=(0,s.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&o({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,o,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:r,error:i,refetch:n,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:s,refetch:r}=(0,t.useQuery)(N);return{statistics:e?.hrStatistics,loading:a,error:s,refetch:r}},"useOffboardingProcess",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(f,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:s,error:r,refetch:i}},"useOffboardingProcesses",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(g,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&n({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,n,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useOnboardingChecklist",0,e=>{let{data:a,loading:s,error:r,refetch:i}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:s,error:r,refetch:i}},"useOnboardingChecklists",0,e=>{let{data:a,loading:r,error:i,refetch:l,fetchMore:n}=(0,t.useQuery)(u,{variables:e}),o=(0,s.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&n({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,n,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:r,error:i,refetch:l,loadMore:o}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:r}]=(0,a.useMutation)(P,{refetchQueries:[v,C]});return{updateDocument:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:r}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(o);return{updateEmployeeProfile:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(x);return{updateOffboardingProcess:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:r,error:i}]=(0,a.useMutation)(p);return{updateOnboardingChecklist:(0,s.useCallback)(async(t,a)=>{try{let s=await e({variables:{id:t,input:a}});return s.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:r,error:i,data:t?.updateOnboardingChecklist}}],598626)},38915,e=>{"use strict";var t,a,s,r,i=((t={}).CV="CV",t.CONTRACT="CONTRACT",t.ID_CARD="ID_CARD",t.PASSPORT="PASSPORT",t.DEGREE="DEGREE",t.CERTIFICATE="CERTIFICATE",t.PHOTO="PHOTO",t.BANK_INFO="BANK_INFO",t.HEALTH_CERTIFICATE="HEALTH_CERTIFICATE",t.OTHER="OTHER",t),l=((a={}).PENDING="PENDING",a.IN_PROGRESS="IN_PROGRESS",a.COMPLETED="COMPLETED",a.CANCELLED="CANCELLED",a),n=((s={}).INITIATED="INITIATED",s.IN_PROGRESS="IN_PROGRESS",s.PENDING_APPROVAL="PENDING_APPROVAL",s.APPROVED="APPROVED",s.COMPLETED="COMPLETED",s.CANCELLED="CANCELLED",s),o=((r={}).PENDING="PENDING",r.PARTIAL="PARTIAL",r.COMPLETE="COMPLETE",r);e.s(["ClearanceStatus",()=>o,"DocumentType",()=>i,"OffboardingStatus",()=>n,"OnboardingStatus",()=>l])},452757,e=>{"use strict";var t=e.i(44990),a=e.i(130775),s=e.i(403055),r=e.i(598626),i=e.i(775680),l=e.i(885205),n=e.i(702470),o=e.i(774309),d=e.i(600547),c=e.i(645030),u=e.i(172362),m=e.i(67087),p=e.i(4993),h=e.i(519647),f=e.i(320309),g=e.i(435635),y=e.i(112641),x=e.i(415588),b=e.i(909905),N=e.i(198513),C=e.i(257117),v=e.i(965120),k=e.i(553082),P=e.i(579448),D=e.i(38915);function j(){var e;let j,I,E=(0,a.useParams)();(0,a.useRouter)();let{toast:O}=(0,p.useToast)(),T=E.id,[A,$]=(0,s.useState)(!1),[w,S]=(0,s.useState)(""),{onboardingChecklist:R,loading:L,refetch:M}=(0,r.useOnboardingChecklist)(T),{updateOnboardingChecklist:q,loading:B}=(0,r.useUpdateOnboardingChecklist)(),{completeOnboardingTask:G,loading:H}=(0,r.useCompleteOnboardingTask)(),U=async(e,t)=>{try{await G(T,e)&&(O({title:"Thành công",description:t?"Đã đánh dấu công việc hoàn thành":"Đã hủy hoàn thành",type:"success"}),M())}catch(e){O({title:"Lỗi",description:e.message||"Không thể cập nhật trạng thái công việc",type:"error"})}},F=async e=>{try{await q(T,{status:e}),O({title:"Thành công",description:"Đã cập nhật trạng thái onboarding",type:"success"}),M()}catch(e){O({title:"Lỗi",description:e.message||"Không thể cập nhật trạng thái",type:"error"})}},Q=async()=>{try{await q(T,{hrNotes:w}),O({title:"Thành công",description:"Đã lưu ghi chú",type:"success"}),$(!1),M()}catch(e){O({title:"Lỗi",description:e.message||"Không thể lưu ghi chú",type:"error"})}};return L?(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsx)(o.Skeleton,{className:"h-10 w-64"}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,t.jsx)(o.Skeleton,{className:"h-96"}),(0,t.jsx)(o.Skeleton,{className:"h-96 md:col-span-2"})]})]}):R?(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsx)(P.default,{href:"/admin/hr/onboarding",children:(0,t.jsx)(l.Button,{variant:"ghost",size:"icon",children:(0,t.jsx)(h.ArrowLeft,{className:"h-5 w-5"})})}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-3xl font-bold tracking-tight",children:["Onboarding - ",R.employeeProfile?.fullName||"N/A"]}),(0,t.jsx)("p",{className:"text-muted-foreground",children:R.employeeProfile?.employeeCode||"-"})]})]}),(0,t.jsx)("div",{children:(e=R.status,I=(j=({[D.OnboardingStatus.PENDING]:{variant:"secondary",icon:N.AlertCircle,label:"Chờ xử lý"},[D.OnboardingStatus.IN_PROGRESS]:{variant:"default",icon:x.Clock,label:"Đang thực hiện"},[D.OnboardingStatus.COMPLETED]:{variant:"default",icon:y.CheckCircle2,label:"Hoàn thành",className:"bg-green-500"},[D.OnboardingStatus.CANCELLED]:{variant:"destructive",icon:C.XCircle,label:"Đã hủy"}})[e]).icon,(0,t.jsxs)(n.Badge,{variant:j.variant,className:j.className,children:[(0,t.jsx)(I,{className:"mr-1 h-3 w-3"}),j.label]}))})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsx)(i.CardTitle,{children:"Tiến độ"})}),(0,t.jsxs)(i.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsxs)("div",{className:"text-4xl font-bold text-primary",children:[R.progressPercentage,"%"]}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Hoàn thành"})]}),(0,t.jsx)(c.Progress,{value:R.progressPercentage,className:"w-full"}),(0,t.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Tổng công việc:"}),(0,t.jsx)("span",{className:"font-medium",children:R.totalTasks})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Đã hoàn thành:"}),(0,t.jsx)("span",{className:"font-medium text-green-600",children:R.completedTasks})]}),(0,t.jsxs)("div",{className:"flex justify-between",children:[(0,t.jsx)("span",{className:"text-muted-foreground",children:"Còn lại:"}),(0,t.jsx)("span",{className:"font-medium text-orange-600",children:R.totalTasks-R.completedTasks})]})]})]})]}),(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsxs)(i.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(g.Calendar,{className:"mr-2 h-5 w-5"}),"Thời gian"]})}),(0,t.jsxs)(i.CardContent,{className:"space-y-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Ngày bắt đầu"}),(0,t.jsx)("p",{className:"text-sm",children:new Date(R.startDate).toLocaleDateString("vi-VN")})]}),R.targetDate&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Ngày mục tiêu"}),(0,t.jsx)("p",{className:"text-sm",children:new Date(R.targetDate).toLocaleDateString("vi-VN")})]}),R.actualCompletionDate&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Ngày hoàn thành"}),(0,t.jsx)("p",{className:"text-sm",children:new Date(R.actualCompletionDate).toLocaleDateString("vi-VN")})]})]})]}),(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsxs)(i.CardTitle,{className:"flex items-center",children:[(0,t.jsx)(b.User,{className:"mr-2 h-5 w-5"}),"Phân công"]})}),(0,t.jsxs)(i.CardContent,{className:"space-y-3",children:[R.assignedTo&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Người phụ trách"}),(0,t.jsx)("p",{className:"text-sm",children:R.assignedTo})]}),R.buddyId&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Buddy"}),(0,t.jsx)("p",{className:"text-sm",children:R.buddyId})]})]})]}),(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsx)(i.CardTitle,{children:"Hành động"})}),(0,t.jsxs)(i.CardContent,{className:"space-y-2",children:[R.status===D.OnboardingStatus.PENDING&&(0,t.jsx)(l.Button,{className:"w-full",onClick:()=>F(D.OnboardingStatus.IN_PROGRESS),disabled:B,children:"Bắt đầu onboarding"}),R.status===D.OnboardingStatus.IN_PROGRESS&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.Button,{className:"w-full",onClick:()=>F(D.OnboardingStatus.COMPLETED),disabled:B||R.progressPercentage<100,children:"Hoàn thành onboarding"}),(0,t.jsx)(l.Button,{className:"w-full",variant:"outline",onClick:()=>F(D.OnboardingStatus.CANCELLED),disabled:B,children:"Hủy onboarding"})]})]})]})]}),(0,t.jsxs)("div",{className:"md:col-span-2 space-y-6",children:[(0,t.jsxs)(i.Card,{children:[(0,t.jsxs)(i.CardHeader,{children:[(0,t.jsx)(i.CardTitle,{children:"Danh sách công việc"}),(0,t.jsx)(i.CardDescription,{children:"Đánh dấu hoàn thành các công việc trong quá trình onboarding"})]}),(0,t.jsx)(i.CardContent,{children:(0,t.jsx)("div",{className:"space-y-3",children:R.tasks&&R.tasks.length>0?R.tasks.map((e,a)=>(0,t.jsxs)("div",{className:"flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors",children:[(0,t.jsx)(u.Checkbox,{id:`task-${a}`,checked:e.completed,onCheckedChange:t=>U(e.id,t),disabled:H||R.status===D.OnboardingStatus.COMPLETED}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("label",{htmlFor:`task-${a}`,className:`text-sm font-medium cursor-pointer ${e.completed?"line-through text-muted-foreground":""}`,children:e.title}),e.description&&(0,t.jsx)("p",{className:"text-xs text-muted-foreground mt-1",children:e.description}),(0,t.jsxs)("div",{className:"flex items-center space-x-4 mt-2 text-xs text-muted-foreground",children:[e.dueDate&&(0,t.jsxs)("span",{className:"flex items-center",children:[(0,t.jsx)(g.Calendar,{className:"mr-1 h-3 w-3"}),new Date(e.dueDate).toLocaleDateString("vi-VN")]}),e.completedAt&&(0,t.jsxs)("span",{className:"flex items-center text-green-600",children:[(0,t.jsx)(y.CheckCircle2,{className:"mr-1 h-3 w-3"}),new Date(e.completedAt).toLocaleDateString("vi-VN")]})]})]})]},e.id||a)):(0,t.jsx)("p",{className:"text-center text-muted-foreground py-8",children:"Chưa có công việc nào được gán"})})})]}),(0,t.jsxs)(i.Card,{children:[(0,t.jsx)(i.CardHeader,{children:(0,t.jsxs)(i.CardTitle,{className:"flex items-center justify-between",children:[(0,t.jsx)("span",{children:"Ghi chú & Phản hồi"}),!A&&(0,t.jsx)(l.Button,{variant:"ghost",size:"sm",onClick:()=>{$(!0),S(R.hrNotes||"")},children:(0,t.jsx)(v.Edit,{className:"h-4 w-4"})})]})}),(0,t.jsxs)(i.CardContent,{className:"space-y-4",children:[R.employeeFeedback&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground mb-2",children:"Phản hồi từ nhân viên"}),(0,t.jsx)("p",{className:"text-sm p-3 bg-muted rounded-lg",children:R.employeeFeedback})]}),R.managerFeedback&&(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground mb-2",children:"Phản hồi từ quản lý"}),(0,t.jsx)("p",{className:"text-sm p-3 bg-muted rounded-lg",children:R.managerFeedback})]}),(0,t.jsx)(m.Separator,{}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground mb-2",children:"Ghi chú HR"}),A?(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(d.Textarea,{value:w,onChange:e=>S(e.target.value),rows:4,placeholder:"Nhập ghi chú..."}),(0,t.jsxs)("div",{className:"flex space-x-2",children:[(0,t.jsxs)(l.Button,{size:"sm",onClick:Q,disabled:B,children:[(0,t.jsx)(k.Save,{className:"mr-2 h-4 w-4"}),"Lưu"]}),(0,t.jsx)(l.Button,{size:"sm",variant:"outline",onClick:()=>$(!1),children:"Hủy"})]})]}):(0,t.jsx)("p",{className:"text-sm p-3 bg-muted rounded-lg",children:R.hrNotes||"Chưa có ghi chú"})]})]})]}),R.employeeProfile&&(0,t.jsx)(P.default,{href:`/admin/hr/employee/${R.employeeProfileId}`,children:(0,t.jsx)(i.Card,{className:"hover:bg-muted/50 transition-colors cursor-pointer",children:(0,t.jsx)(i.CardContent,{className:"py-4",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,t.jsx)(b.User,{className:"h-6 w-6 text-primary"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-semibold",children:"Xem hồ sơ nhân viên"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:R.employeeProfile.fullName})]})]}),(0,t.jsx)(l.Button,{variant:"ghost",children:"Xem chi tiết"})]})})})})]})]})]}):(0,t.jsx)("div",{className:"container mx-auto p-6",children:(0,t.jsx)(i.Card,{children:(0,t.jsxs)(i.CardContent,{className:"py-12 text-center text-muted-foreground",children:[(0,t.jsx)(f.UserPlus,{className:"mx-auto h-12 w-12 mb-2"}),(0,t.jsx)("p",{children:"Không tìm thấy thông tin onboarding"}),(0,t.jsx)(P.default,{href:"/admin/hr/onboarding",children:(0,t.jsx)(l.Button,{variant:"outline",className:"mt-4",children:"Quay lại danh sách"})})]})})})}e.s(["default",()=>j])}]);