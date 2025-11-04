module.exports=[285439,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(651332),e=a.i(772213);let f=e.gql`
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
`;e.gql`
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
`;let g=e.gql`
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
`,h=e.gql`
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
`,i=e.gql`
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
`,j=e.gql`
  mutation DeleteEmployeeProfile($id: ID!) {
    deleteEmployeeProfile(id: $id) {
      success
      message
    }
  }
`;e.gql`
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
`;let k=e.gql`
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
`;e.gql`
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
`;let l=e.gql`
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
`,m=e.gql`
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
`,n=e.gql`
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
`,o=e.gql`
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
`,p=e.gql`
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
`,q=e.gql`
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
`,r=e.gql`
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
`,s=e.gql`
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
`,t=e.gql`
  mutation CompleteOffboarding($id: ID!) {
    completeOffboarding(id: $id) {
      id
      status
      clearanceStatus
      completedAt
      completedBy
    }
  }
`,u=e.gql`
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
`,v=e.gql`
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
`,w=e.gql`
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
`,x=e.gql`
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
`,y=e.gql`
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
`,z=e.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;a.s(["useCompleteOffboarding",0,()=>{let[a,{loading:b,error:e}]=(0,c.useMutation)(t,{refetchQueries:[q,u]});return{completeOffboarding:(0,d.useCallback)(async b=>{try{let c=await a({variables:{id:b}});return c.data?.completeOffboarding}catch(a){throw a}},[a]),loading:b,error:e}},"useCompleteOnboardingTask",0,()=>{let[a,{loading:b,error:e}]=(0,c.useMutation)(o);return{completeOnboardingTask:(0,d.useCallback)(async(b,c)=>{try{let d=await a({variables:{checklistId:b,taskId:c}});return d.data?.completeOnboardingTask}catch(a){throw a}},[a]),loading:b,error:e}},"useCreateEmployeeDocument",0,()=>{let[a,{loading:b,error:e}]=(0,c.useMutation)(x,{refetchQueries:[w]});return{createDocument:(0,d.useCallback)(async b=>{try{let c=await a({variables:{input:b}});return c.data?.createEmployeeDocument}catch(a){throw a}},[a]),loading:b,error:e}},"useCreateEmployeeProfile",0,()=>{let[a,{data:b,loading:e,error:f}]=(0,c.useMutation)(h,{refetchQueries:[g,u]});return{createEmployeeProfile:(0,d.useCallback)(async b=>{try{let c=await a({variables:{input:b}});return c.data?.createEmployeeProfile}catch(a){throw a}},[a]),loading:e,error:f,data:b?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[a,{data:b,loading:e,error:f}]=(0,c.useMutation)(r,{refetchQueries:[q,u]});return{createOffboardingProcess:(0,d.useCallback)(async b=>{try{let c=await a({variables:{input:b}});return c.data?.createOffboardingProcess}catch(a){throw a}},[a]),loading:e,error:f,data:b?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[a,{data:b,loading:e,error:f}]=(0,c.useMutation)(m,{refetchQueries:[l,u]});return{createOnboardingChecklist:(0,d.useCallback)(async b=>{try{let c=await a({variables:{input:b}});return c.data?.createOnboardingChecklist}catch(a){throw a}},[a]),loading:e,error:f,data:b?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[a,{loading:b,error:e}]=(0,c.useMutation)(z,{refetchQueries:[w]});return{deleteDocument:(0,d.useCallback)(async b=>{try{let c=await a({variables:{id:b}});return c.data?.deleteEmployeeDocument}catch(a){throw a}},[a]),loading:b,error:e}},"useDeleteEmployeeProfile",0,()=>{let[a,{loading:b,error:e}]=(0,c.useMutation)(j,{refetchQueries:[g,u]});return{deleteEmployeeProfile:(0,d.useCallback)(async b=>{try{let c=await a({variables:{id:b}});return c.data?.deleteEmployeeProfile}catch(a){throw a}},[a]),loading:b,error:e}},"useEmployeeDocuments",0,(a,c)=>{let{data:e,loading:f,error:g,refetch:h,fetchMore:i}=(0,b.useQuery)(w,{variables:{employeeProfileId:a,documentType:c?.documentType,skip:c?.skip||0,take:c?.take||50},skip:!a}),j=(0,d.useCallback)(async()=>{e?.employeeDocuments.hasMore&&await i({variables:{skip:e.employeeDocuments.documents.length}})},[i,e]);return{documents:e?.employeeDocuments.documents||[],total:e?.employeeDocuments.total||0,hasMore:e?.employeeDocuments.hasMore||!1,loading:f,error:g,refetch:h,loadMore:j}},"useEmployeeProfile",0,a=>{let{data:c,loading:d,error:e,refetch:g}=(0,b.useQuery)(f,{variables:{id:a},skip:!a});return{employeeProfile:c?.employeeProfile,loading:d,error:e,refetch:g}},"useEmployeeProfiles",0,a=>{let{data:c,loading:e,error:f,refetch:h,fetchMore:i}=(0,b.useQuery)(g,{variables:a}),j=(0,d.useCallback)(()=>{c?.listEmployeeProfiles.hasMore&&i({variables:{...a,skip:c.listEmployeeProfiles.employees.length}})},[c,i,a]);return{employees:c?.listEmployeeProfiles.employees||[],total:c?.listEmployeeProfiles.total||0,hasMore:c?.listEmployeeProfiles.hasMore||!1,loading:e,error:f,refetch:h,loadMore:j}},"useHRStatistics",0,()=>{let{data:a,loading:c,error:d,refetch:e}=(0,b.useQuery)(u);return{statistics:a?.hrStatistics,loading:c,error:d,refetch:e}},"useOffboardingProcess",0,a=>{let{data:c,loading:d,error:e,refetch:f}=(0,b.useQuery)(p,{variables:{id:a},skip:!a});return{offboardingProcess:c?.offboardingProcess,loading:d,error:e,refetch:f}},"useOffboardingProcesses",0,a=>{let{data:c,loading:e,error:f,refetch:g,fetchMore:h}=(0,b.useQuery)(q,{variables:a}),i=(0,d.useCallback)(()=>{c?.listOffboardingProcesses.hasMore&&h({variables:{...a,skip:c.listOffboardingProcesses.processes.length}})},[c,h,a]);return{processes:c?.listOffboardingProcesses.processes||[],total:c?.listOffboardingProcesses.total||0,hasMore:c?.listOffboardingProcesses.hasMore||!1,loading:e,error:f,refetch:g,loadMore:i}},"useOnboardingChecklist",0,a=>{let{data:c,loading:d,error:e,refetch:f}=(0,b.useQuery)(k,{variables:{id:a},skip:!a});return{onboardingChecklist:c?.onboardingChecklist,loading:d,error:e,refetch:f}},"useOnboardingChecklists",0,a=>{let{data:c,loading:e,error:f,refetch:g,fetchMore:h}=(0,b.useQuery)(l,{variables:a}),i=(0,d.useCallback)(()=>{c?.listOnboardingChecklists.hasMore&&h({variables:{...a,skip:c.listOnboardingChecklists.checklists.length}})},[c,h,a]);return{checklists:c?.listOnboardingChecklists.checklists||[],total:c?.listOnboardingChecklists.total||0,hasMore:c?.listOnboardingChecklists.hasMore||!1,loading:e,error:f,refetch:g,loadMore:i}},"useUpdateEmployeeDocument",0,()=>{let[a,{loading:b,error:e}]=(0,c.useMutation)(y,{refetchQueries:[w,v]});return{updateDocument:(0,d.useCallback)(async(b,c)=>{try{let d=await a({variables:{id:b,input:c}});return d.data?.updateEmployeeDocument}catch(a){throw a}},[a]),loading:b,error:e}},"useUpdateEmployeeProfile",0,()=>{let[a,{data:b,loading:e,error:f}]=(0,c.useMutation)(i);return{updateEmployeeProfile:(0,d.useCallback)(async(b,c)=>{try{let d=await a({variables:{id:b,input:c}});return d.data?.updateEmployeeProfile}catch(a){throw a}},[a]),loading:e,error:f,data:b?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[a,{data:b,loading:e,error:f}]=(0,c.useMutation)(s);return{updateOffboardingProcess:(0,d.useCallback)(async(b,c)=>{try{let d=await a({variables:{id:b,input:c}});return d.data?.updateOffboardingProcess}catch(a){throw a}},[a]),loading:e,error:f,data:b?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[a,{data:b,loading:e,error:f}]=(0,c.useMutation)(n);return{updateOnboardingChecklist:(0,d.useCallback)(async(b,c)=>{try{let d=await a({variables:{id:b,input:c}});return d.data?.updateOnboardingChecklist}catch(a){throw a}},[a]),loading:e,error:f,data:b?.updateOnboardingChecklist}}],285439)}];

//# sourceMappingURL=frontend_src_hooks_useHR_ts_3ce58a85._.js.map