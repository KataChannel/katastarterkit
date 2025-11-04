(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(873273),s=a.forwardRef((e,a)=>(0,t.jsx)(i.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));s.displayName="Label";var r=e.i(541428);function l({className:e,...a}){return(0,t.jsx)(s,{"data-slot":"label",className:(0,r.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>l],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(541428);let s=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)("textarea",{className:(0,i.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:s,...a}));s.displayName="Textarea",e.s(["Textarea",()=>s])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},421329,e=>{"use strict";var t=e.i(565977);e.s(["FileText",()=>t.default])},67087,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(541428);let s=a.forwardRef(({className:e,orientation:a="horizontal",decorative:s=!0,...r},l)=>(0,t.jsx)("div",{ref:l,role:s?"none":"separator","aria-orientation":s?void 0:a,className:(0,i.cn)("shrink-0 bg-gray-200","horizontal"===a?"h-[1px] w-full":"h-full w-[1px]",e),...r}));s.displayName="Separator",e.s(["Separator",()=>s])},495043,e=>{"use strict";var t=e.i(217696);e.s(["MoreVertical",()=>t.default])},455461,e=>{"use strict";var t=e.i(979426);e.s(["Upload",()=>t.default])},815954,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(940392);let s=a.createContext({}),r=({children:e,open:a,onOpenChange:i})=>a?(0,t.jsx)(s.Provider,{value:{onOpenChange:i},children:e}):null,l=a.forwardRef(({className:e,children:i,asChild:s,...r},l)=>s&&a.isValidElement(i)?a.cloneElement(i,{ref:l,...r}):(0,t.jsx)("button",{ref:l,className:e,...r,children:i}));l.displayName="AlertDialogTrigger";let o=a.forwardRef(({className:e,...s},r)=>{let[l,o]=a.useState(!1);if(a.useEffect(()=>(o(!0),()=>o(!1)),[]),!l)return null;let n=(0,t.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 pointer-events-auto",onClick:e=>{e.target,e.currentTarget},children:(0,t.jsx)("div",{ref:r,className:`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg pointer-events-auto ${e||""}`,onClick:e=>e.stopPropagation(),...s})});return(0,i.createPortal)(n,document.body)});o.displayName="AlertDialogContent";let n=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:`flex flex-col space-y-2 text-center sm:text-left ${e||""}`,...a}));n.displayName="AlertDialogHeader";let d=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${e||""}`,...a}));d.displayName="AlertDialogFooter";let c=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("h2",{ref:i,className:`text-lg font-semibold ${e||""}`,...a}));c.displayName="AlertDialogTitle";let u=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("p",{ref:i,className:`text-sm text-gray-500 ${e||""}`,...a}));u.displayName="AlertDialogDescription";let m=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("button",{ref:i,className:`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...a}));m.displayName="AlertDialogAction";let p=a.forwardRef(({className:e,onClick:i,...r},l)=>{let{onOpenChange:o}=a.useContext(s);return(0,t.jsx)("button",{ref:l,onClick:e=>{i?.(e),e.defaultPrevented||o?.(!1)},className:`inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${e||""}`,...r})});p.displayName="AlertDialogCancel",e.s(["AlertDialog",()=>r,"AlertDialogAction",()=>m,"AlertDialogCancel",()=>p,"AlertDialogContent",()=>o,"AlertDialogDescription",()=>u,"AlertDialogFooter",()=>d,"AlertDialogHeader",()=>n,"AlertDialogTitle",()=>c,"AlertDialogTrigger",()=>l])},68645,e=>{"use strict";var t=e.i(20865);e.s(["Shield",()=>t.default])},897711,e=>{"use strict";var t=e.i(980295);e.s(["Download",()=>t.default])},822390,e=>{"use strict";var t=e.i(621924);e.s(["CheckCircle",()=>t.default])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},580523,e=>{"use strict";var t=e.i(403055),a=e.i(119836),i=e.i(569658),s=e.i(316618),r=e.i(559663),l=e.i(346412),o=e.i(430840),n=e.i(621829),d=e.i(581263),c=e.i(767478),u=e.i(873273),m=e.i(767835),p=e.i(896438),f=e.i(739045),h=e.i(599488),g=e.i(44990),y="Dialog",[x,D]=(0,s.createContextScope)(y),[C,b]=x(y),v=e=>{let{__scopeDialog:a,children:i,open:s,defaultOpen:o,onOpenChange:n,modal:d=!0}=e,c=t.useRef(null),u=t.useRef(null),[m,p]=(0,l.useControllableState)({prop:s,defaultProp:o??!1,onChange:n,caller:y});return(0,g.jsx)(C,{scope:a,triggerRef:c,contentRef:u,contentId:(0,r.useId)(),titleId:(0,r.useId)(),descriptionId:(0,r.useId)(),open:m,onOpenChange:p,onOpenToggle:t.useCallback(()=>p(e=>!e),[p]),modal:d,children:i})};v.displayName=y;var N="DialogTrigger",j=t.forwardRef((e,t)=>{let{__scopeDialog:s,...r}=e,l=b(N,s),o=(0,i.useComposedRefs)(t,l.triggerRef);return(0,g.jsx)(u.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":l.open,"aria-controls":l.contentId,"data-state":U(l.open),...r,ref:o,onClick:(0,a.composeEventHandlers)(e.onClick,l.onOpenToggle)})});j.displayName=N;var T="DialogPortal",[I,P]=x(T,{forceMount:void 0}),k=e=>{let{__scopeDialog:a,forceMount:i,children:s,container:r}=e,l=b(T,a);return(0,g.jsx)(I,{scope:a,forceMount:i,children:t.Children.map(s,e=>(0,g.jsx)(c.Presence,{present:i||l.open,children:(0,g.jsx)(d.Portal,{asChild:!0,container:r,children:e})}))})};k.displayName=T;var w="DialogOverlay",A=t.forwardRef((e,t)=>{let a=P(w,e.__scopeDialog),{forceMount:i=a.forceMount,...s}=e,r=b(w,e.__scopeDialog);return r.modal?(0,g.jsx)(c.Presence,{present:i||r.open,children:(0,g.jsx)(O,{...s,ref:t})}):null});A.displayName=w;var E=(0,h.createSlot)("DialogOverlay.RemoveScroll"),O=t.forwardRef((e,t)=>{let{__scopeDialog:a,...i}=e,s=b(w,a);return(0,g.jsx)(p.RemoveScroll,{as:E,allowPinchZoom:!0,shards:[s.contentRef],children:(0,g.jsx)(u.Primitive.div,{"data-state":U(s.open),...i,ref:t,style:{pointerEvents:"auto",...i.style}})})}),S="DialogContent",R=t.forwardRef((e,t)=>{let a=P(S,e.__scopeDialog),{forceMount:i=a.forceMount,...s}=e,r=b(S,e.__scopeDialog);return(0,g.jsx)(c.Presence,{present:i||r.open,children:r.modal?(0,g.jsx)($,{...s,ref:t}):(0,g.jsx)(L,{...s,ref:t})})});R.displayName=S;var $=t.forwardRef((e,s)=>{let r=b(S,e.__scopeDialog),l=t.useRef(null),o=(0,i.useComposedRefs)(s,r.contentRef,l);return t.useEffect(()=>{let e=l.current;if(e)return(0,f.hideOthers)(e)},[]),(0,g.jsx)(M,{...e,ref:o,trapFocus:r.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,a.composeEventHandlers)(e.onCloseAutoFocus,e=>{e.preventDefault(),r.triggerRef.current?.focus()}),onPointerDownOutside:(0,a.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,a=0===t.button&&!0===t.ctrlKey;(2===t.button||a)&&e.preventDefault()}),onFocusOutside:(0,a.composeEventHandlers)(e.onFocusOutside,e=>e.preventDefault())})}),L=t.forwardRef((e,a)=>{let i=b(S,e.__scopeDialog),s=t.useRef(!1),r=t.useRef(!1);return(0,g.jsx)(M,{...e,ref:a,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(s.current||i.triggerRef.current?.focus(),t.preventDefault()),s.current=!1,r.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(s.current=!0,"pointerdown"===t.detail.originalEvent.type&&(r.current=!0));let a=t.target;i.triggerRef.current?.contains(a)&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&r.current&&t.preventDefault()}})}),M=t.forwardRef((e,a)=>{let{__scopeDialog:s,trapFocus:r,onOpenAutoFocus:l,onCloseAutoFocus:d,...c}=e,u=b(S,s),p=t.useRef(null),f=(0,i.useComposedRefs)(a,p);return(0,m.useFocusGuards)(),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(n.FocusScope,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:l,onUnmountAutoFocus:d,children:(0,g.jsx)(o.DismissableLayer,{role:"dialog",id:u.contentId,"aria-describedby":u.descriptionId,"aria-labelledby":u.titleId,"data-state":U(u.open),...c,ref:f,onDismiss:()=>u.onOpenChange(!1)})}),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(K,{titleId:u.titleId}),(0,g.jsx)(X,{contentRef:p,descriptionId:u.descriptionId})]})]})}),F="DialogTitle",H=t.forwardRef((e,t)=>{let{__scopeDialog:a,...i}=e,s=b(F,a);return(0,g.jsx)(u.Primitive.h2,{id:s.titleId,...i,ref:t})});H.displayName=F;var B="DialogDescription",q=t.forwardRef((e,t)=>{let{__scopeDialog:a,...i}=e,s=b(B,a);return(0,g.jsx)(u.Primitive.p,{id:s.descriptionId,...i,ref:t})});q.displayName=B;var V="DialogClose",_=t.forwardRef((e,t)=>{let{__scopeDialog:i,...s}=e,r=b(V,i);return(0,g.jsx)(u.Primitive.button,{type:"button",...s,ref:t,onClick:(0,a.composeEventHandlers)(e.onClick,()=>r.onOpenChange(!1))})});function U(e){return e?"open":"closed"}_.displayName=V;var G="DialogTitleWarning",[z,Q]=(0,s.createContext)(G,{contentName:S,titleName:F,docsSlug:"dialog"}),K=({titleId:e})=>{let a=Q(G),i=`\`${a.contentName}\` requires a \`${a.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${a.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${a.docsSlug}`;return t.useEffect(()=>{e&&(document.getElementById(e)||console.error(i))},[i,e]),null},X=({contentRef:e,descriptionId:a})=>{let i=Q("DialogDescriptionWarning"),s=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${i.contentName}}.`;return t.useEffect(()=>{let t=e.current?.getAttribute("aria-describedby");a&&t&&(document.getElementById(a)||console.warn(s))},[s,e,a]),null};e.s(["Close",()=>_,"Content",()=>R,"Description",()=>q,"Overlay",()=>A,"Portal",()=>k,"Root",()=>v,"Title",()=>H,"Trigger",()=>j])},137651,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(580523),s=e.i(888540),r=e.i(541428);let l=i.Root,o=i.Trigger,n=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(i.Overlay,{ref:s,className:(0,r.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...a}));n.displayName=i.Overlay.displayName;let d=a.forwardRef(({className:e,children:a,...l},o)=>(0,t.jsxs)(i.Portal,{children:[(0,t.jsx)(n,{}),(0,t.jsxs)(i.Content,{ref:o,className:(0,r.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...l,children:[a,(0,t.jsxs)(i.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,t.jsx)(s.X,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));d.displayName=i.Content.displayName;let c=({className:e,...a})=>(0,t.jsx)("div",{className:(0,r.cn)("flex flex-col space-y-1.5 text-center sm:text-left",e),...a});c.displayName="DialogHeader";let u=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(i.Title,{ref:s,className:(0,r.cn)("text-lg font-semibold leading-none tracking-tight",e),...a}));u.displayName=i.Title.displayName;let m=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(i.Description,{ref:s,className:(0,r.cn)("text-sm text-muted-foreground",e),...a}));m.displayName=i.Description.displayName;let p=({className:e,...a})=>(0,t.jsx)("div",{className:(0,r.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...a});p.displayName="DialogFooter",e.s(["Dialog",()=>l,"DialogContent",()=>d,"DialogDescription",()=>m,"DialogFooter",()=>p,"DialogHeader",()=>c,"DialogTitle",()=>u,"DialogTrigger",()=>o])},173416,e=>{"use strict";var t=e.i(46034);e.s(["Filter",()=>t.default])},126795,e=>{"use strict";var t=e.i(124790);e.s(["Image",()=>t.default])},774309,e=>{"use strict";var t=e.i(44990);let a=e.i(403055).forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...a}));a.displayName="Skeleton",e.s(["Skeleton",()=>a])},598626,e=>{"use strict";var t=e.i(429105),a=e.i(950988),i=e.i(403055),s=e.i(984804);let r=s.gql`
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
`;s.gql`
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
`;let l=s.gql`
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
`,o=s.gql`
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
`,n=s.gql`
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
`,d=s.gql`
  mutation DeleteEmployeeProfile($id: ID!) {
    deleteEmployeeProfile(id: $id) {
      success
      message
    }
  }
`;s.gql`
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
`;let c=s.gql`
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
`;s.gql`
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
`;let u=s.gql`
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
`,m=s.gql`
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
`,p=s.gql`
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
`,f=s.gql`
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
`,h=s.gql`
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
`,g=s.gql`
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
`,y=s.gql`
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
`,x=s.gql`
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
`,D=s.gql`
  mutation CompleteOffboarding($id: ID!) {
    completeOffboarding(id: $id) {
      id
      status
      clearanceStatus
      completedAt
      completedBy
    }
  }
`,C=s.gql`
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
`,b=s.gql`
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
`,v=s.gql`
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
`,N=s.gql`
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
`,j=s.gql`
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
`,T=s.gql`
  mutation DeleteEmployeeDocument($id: ID!) {
    deleteEmployeeDocument(id: $id)
  }
`;e.s(["useCompleteOffboarding",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(D,{refetchQueries:[g,C]});return{completeOffboarding:(0,i.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.completeOffboarding}catch(e){throw e}},[e]),loading:t,error:s}},"useCompleteOnboardingTask",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(f);return{completeOnboardingTask:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{checklistId:t,taskId:a}});return i.data?.completeOnboardingTask}catch(e){throw e}},[e]),loading:t,error:s}},"useCreateEmployeeDocument",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(N,{refetchQueries:[v]});return{createDocument:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:s}},"useCreateEmployeeProfile",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(o,{refetchQueries:[l,C]});return{createEmployeeProfile:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createEmployeeProfile}catch(e){throw e}},[e]),loading:s,error:r,data:t?.createEmployeeProfile}},"useCreateOffboardingProcess",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(y,{refetchQueries:[g,C]});return{createOffboardingProcess:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOffboardingProcess}catch(e){throw e}},[e]),loading:s,error:r,data:t?.createOffboardingProcess}},"useCreateOnboardingChecklist",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(m,{refetchQueries:[u,C]});return{createOnboardingChecklist:(0,i.useCallback)(async t=>{try{let a=await e({variables:{input:t}});return a.data?.createOnboardingChecklist}catch(e){throw e}},[e]),loading:s,error:r,data:t?.createOnboardingChecklist}},"useDeleteEmployeeDocument",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(T,{refetchQueries:[v]});return{deleteDocument:(0,i.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:s}},"useDeleteEmployeeProfile",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(d,{refetchQueries:[l,C]});return{deleteEmployeeProfile:(0,i.useCallback)(async t=>{try{let a=await e({variables:{id:t}});return a.data?.deleteEmployeeProfile}catch(e){throw e}},[e]),loading:t,error:s}},"useEmployeeDocuments",0,(e,a)=>{let{data:s,loading:r,error:l,refetch:o,fetchMore:n}=(0,t.useQuery)(v,{variables:{employeeProfileId:e,documentType:a?.documentType,skip:a?.skip||0,take:a?.take||50},skip:!e}),d=(0,i.useCallback)(async()=>{s?.employeeDocuments.hasMore&&await n({variables:{skip:s.employeeDocuments.documents.length}})},[n,s]);return{documents:s?.employeeDocuments.documents||[],total:s?.employeeDocuments.total||0,hasMore:s?.employeeDocuments.hasMore||!1,loading:r,error:l,refetch:o,loadMore:d}},"useEmployeeProfile",0,e=>{let{data:a,loading:i,error:s,refetch:l}=(0,t.useQuery)(r,{variables:{id:e},skip:!e});return{employeeProfile:a?.employeeProfile,loading:i,error:s,refetch:l}},"useEmployeeProfiles",0,e=>{let{data:a,loading:s,error:r,refetch:o,fetchMore:n}=(0,t.useQuery)(l,{variables:e}),d=(0,i.useCallback)(()=>{a?.listEmployeeProfiles.hasMore&&n({variables:{...e,skip:a.listEmployeeProfiles.employees.length}})},[a,n,e]);return{employees:a?.listEmployeeProfiles.employees||[],total:a?.listEmployeeProfiles.total||0,hasMore:a?.listEmployeeProfiles.hasMore||!1,loading:s,error:r,refetch:o,loadMore:d}},"useHRStatistics",0,()=>{let{data:e,loading:a,error:i,refetch:s}=(0,t.useQuery)(C);return{statistics:e?.hrStatistics,loading:a,error:i,refetch:s}},"useOffboardingProcess",0,e=>{let{data:a,loading:i,error:s,refetch:r}=(0,t.useQuery)(h,{variables:{id:e},skip:!e});return{offboardingProcess:a?.offboardingProcess,loading:i,error:s,refetch:r}},"useOffboardingProcesses",0,e=>{let{data:a,loading:s,error:r,refetch:l,fetchMore:o}=(0,t.useQuery)(g,{variables:e}),n=(0,i.useCallback)(()=>{a?.listOffboardingProcesses.hasMore&&o({variables:{...e,skip:a.listOffboardingProcesses.processes.length}})},[a,o,e]);return{processes:a?.listOffboardingProcesses.processes||[],total:a?.listOffboardingProcesses.total||0,hasMore:a?.listOffboardingProcesses.hasMore||!1,loading:s,error:r,refetch:l,loadMore:n}},"useOnboardingChecklist",0,e=>{let{data:a,loading:i,error:s,refetch:r}=(0,t.useQuery)(c,{variables:{id:e},skip:!e});return{onboardingChecklist:a?.onboardingChecklist,loading:i,error:s,refetch:r}},"useOnboardingChecklists",0,e=>{let{data:a,loading:s,error:r,refetch:l,fetchMore:o}=(0,t.useQuery)(u,{variables:e}),n=(0,i.useCallback)(()=>{a?.listOnboardingChecklists.hasMore&&o({variables:{...e,skip:a.listOnboardingChecklists.checklists.length}})},[a,o,e]);return{checklists:a?.listOnboardingChecklists.checklists||[],total:a?.listOnboardingChecklists.total||0,hasMore:a?.listOnboardingChecklists.hasMore||!1,loading:s,error:r,refetch:l,loadMore:n}},"useUpdateEmployeeDocument",0,()=>{let[e,{loading:t,error:s}]=(0,a.useMutation)(j,{refetchQueries:[v,b]});return{updateDocument:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateEmployeeDocument}catch(e){throw e}},[e]),loading:t,error:s}},"useUpdateEmployeeProfile",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(n);return{updateEmployeeProfile:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateEmployeeProfile}catch(e){throw e}},[e]),loading:s,error:r,data:t?.updateEmployeeProfile}},"useUpdateOffboardingProcess",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(x);return{updateOffboardingProcess:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateOffboardingProcess}catch(e){throw e}},[e]),loading:s,error:r,data:t?.updateOffboardingProcess}},"useUpdateOnboardingChecklist",0,()=>{let[e,{data:t,loading:s,error:r}]=(0,a.useMutation)(p);return{updateOnboardingChecklist:(0,i.useCallback)(async(t,a)=>{try{let i=await e({variables:{id:t,input:a}});return i.data?.updateOnboardingChecklist}catch(e){throw e}},[e]),loading:s,error:r,data:t?.updateOnboardingChecklist}}],598626)},38915,e=>{"use strict";var t,a,i,s,r=((t={}).CV="CV",t.CONTRACT="CONTRACT",t.ID_CARD="ID_CARD",t.PASSPORT="PASSPORT",t.DEGREE="DEGREE",t.CERTIFICATE="CERTIFICATE",t.PHOTO="PHOTO",t.BANK_INFO="BANK_INFO",t.HEALTH_CERTIFICATE="HEALTH_CERTIFICATE",t.OTHER="OTHER",t),l=((a={}).PENDING="PENDING",a.IN_PROGRESS="IN_PROGRESS",a.COMPLETED="COMPLETED",a.CANCELLED="CANCELLED",a),o=((i={}).INITIATED="INITIATED",i.IN_PROGRESS="IN_PROGRESS",i.PENDING_APPROVAL="PENDING_APPROVAL",i.APPROVED="APPROVED",i.COMPLETED="COMPLETED",i.CANCELLED="CANCELLED",i),n=((s={}).PENDING="PENDING",s.PARTIAL="PARTIAL",s.COMPLETE="COMPLETE",s);e.s(["ClearanceStatus",()=>n,"DocumentType",()=>r,"OffboardingStatus",()=>o,"OnboardingStatus",()=>l])},746969,e=>{"use strict";var t=e.i(392636);e.s(["File",()=>t.default])},995799,e=>{"use strict";var t=e.i(308140),a=e.i(44990),i=e.i(403055),s=e.i(130775),r=e.i(598626),l=e.i(38915),o=e.i(775680),n=e.i(885205),d=e.i(702470),c=e.i(774309),u=e.i(696134),m=e.i(165429),p=e.i(600547),f=e.i(183194),h=e.i(137651),g=e.i(815954),y=e.i(135369),x=e.i(67087),D=e.i(4993),C=e.i(421329),b=e.i(455461),v=e.i(897711),N=e.i(138227),j=e.i(495043),T=e.i(822390),I=e.i(257117),P=e.i(435635),k=e.i(909905),w=e.i(126795),A=e.i(746969),E=e.i(519647),O=e.i(173416),S=e.i(850384),R=e.i(68645);function $(){let e=(0,s.useParams)(),$=(0,s.useRouter)(),{toast:L}=(0,D.useToast)(),M=e.id,{employeeProfile:F,loading:H}=(0,r.useEmployeeProfile)(M),{documents:B,loading:q,refetch:V}=(0,r.useEmployeeDocuments)(M),{createDocument:_}=(0,r.useCreateEmployeeDocument)(),{updateDocument:U}=(0,r.useUpdateEmployeeDocument)(),{deleteDocument:G}=(0,r.useDeleteEmployeeDocument)(),[z,Q]=(0,i.useState)(!1),[K,X]=(0,i.useState)(!1),[W,Z]=(0,i.useState)(!1),[J,Y]=(0,i.useState)(null),[ee,et]=(0,i.useState)("ALL"),[ea,ei]=(0,i.useState)(""),[es,er]=(0,i.useState)({documentType:l.DocumentType.OTHER,title:"",description:"",documentNumber:"",issueDate:"",expiryDate:"",issuingAuthority:""}),[el,eo]=(0,i.useState)(null),[en,ed]=(0,i.useState)(!1),ec=async()=>{if(!el)return void L({title:"Lỗi",description:"Vui lòng chọn tệp tin để tải lên.",type:"error"});ed(!0);try{let e=new FormData;e.append("files",el);let a=t.default.env.NEXT_PUBLIC_API_URL||"http://localhost:14000",i=localStorage.getItem("accessToken"),s=await fetch(`${a}/api/files/upload/bulk`,{method:"POST",headers:{...i&&{Authorization:`Bearer ${i}`}},body:e,credentials:"include"});if(!s.ok)throw Error("Upload failed");let r=await s.json(),l=r.data?.[0];if(!l)throw Error("No file returned from upload");await _({employeeProfileId:M,documentType:es.documentType,title:es.title,description:es.description,fileId:l.id,fileName:l.name,fileUrl:l.url,fileSize:l.size,fileMimeType:l.mimeType,documentNumber:es.documentNumber||void 0,issueDate:es.issueDate||void 0,expiryDate:es.expiryDate||void 0,issuingAuthority:es.issuingAuthority||void 0}),L({title:"Thành công",description:"Tài liệu đã được tải lên.",type:"success"}),Q(!1),eu(),V()}catch(e){L({title:"Lỗi",description:"Không thể tải lên tài liệu.",type:"error"})}finally{ed(!1)}},eu=()=>{er({documentType:l.DocumentType.OTHER,title:"",description:"",documentNumber:"",issueDate:"",expiryDate:"",issuingAuthority:""}),eo(null)},em=async()=>{if(J)try{await U(J,{isVerified:!0}),L({title:"Thành công",description:"Tài liệu đã được xác minh.",type:"success"}),X(!1),Y(null),V()}catch(e){L({title:"Lỗi",description:"Không thể xác minh tài liệu.",type:"error"})}},ep=async()=>{if(J)try{await G(J),L({title:"Thành công",description:"Tài liệu đã được xóa.",type:"success"}),Z(!1),Y(null),V()}catch(e){L({title:"Lỗi",description:"Không thể xóa tài liệu.",type:"error"})}},ef=e=>({[l.DocumentType.CV]:"Hồ sơ xin việc",[l.DocumentType.CONTRACT]:"Hợp đồng",[l.DocumentType.ID_CARD]:"CMND/CCCD",[l.DocumentType.PASSPORT]:"Hộ chiếu",[l.DocumentType.DEGREE]:"Bằng cấp",[l.DocumentType.CERTIFICATE]:"Chứng chỉ",[l.DocumentType.PHOTO]:"Ảnh",[l.DocumentType.BANK_INFO]:"Thông tin ngân hàng",[l.DocumentType.HEALTH_CERTIFICATE]:"Giấy khám sức khỏe",[l.DocumentType.OTHER]:"Khác"})[e],eh=(0,i.useMemo)(()=>{let e=B;return"ALL"!==ee&&(e=e.filter(e=>e.documentType===ee)),ea&&(e=e.filter(e=>e.title.toLowerCase().includes(ea.toLowerCase())||e.description?.toLowerCase().includes(ea.toLowerCase()))),e},[B,ee,ea]),eg=(0,i.useMemo)(()=>{let e=new Map;return B.forEach(t=>{e.set(t.documentType,(e.get(t.documentType)||0)+1)}),e},[B]);return H||q?(0,a.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,a.jsx)(c.Skeleton,{className:"h-10 w-64"}),(0,a.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[1,2,3].map(e=>(0,a.jsx)(c.Skeleton,{className:"h-32"},e))})]}):(0,a.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsxs)("div",{className:"space-y-1",children:[(0,a.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,a.jsx)(n.Button,{variant:"ghost",size:"sm",onClick:()=>$.back(),children:(0,a.jsx)(E.ArrowLeft,{className:"h-4 w-4"})}),(0,a.jsxs)("h1",{className:"text-3xl font-bold tracking-tight flex items-center",children:[(0,a.jsx)(C.FileText,{className:"mr-3 h-8 w-8"}),"Tài liệu nhân viên"]})]}),F&&(0,a.jsxs)("p",{className:"text-muted-foreground ml-12",children:[F.fullName," (",F.employeeCode,")"]})]}),(0,a.jsxs)(n.Button,{onClick:()=>Q(!0),children:[(0,a.jsx)(b.Upload,{className:"mr-2 h-4 w-4"}),"Tải lên tài liệu"]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-6",children:[(0,a.jsxs)(o.Card,{children:[(0,a.jsxs)(o.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,a.jsx)(o.CardTitle,{className:"text-sm font-medium",children:"Tổng tài liệu"}),(0,a.jsx)(C.FileText,{className:"h-4 w-4 text-muted-foreground"})]}),(0,a.jsx)(o.CardContent,{children:(0,a.jsx)("div",{className:"text-2xl font-bold",children:B.length})})]}),(0,a.jsxs)(o.Card,{children:[(0,a.jsxs)(o.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,a.jsx)(o.CardTitle,{className:"text-sm font-medium",children:"Đã xác minh"}),(0,a.jsx)(T.CheckCircle,{className:"h-4 w-4 text-muted-foreground"})]}),(0,a.jsx)(o.CardContent,{children:(0,a.jsx)("div",{className:"text-2xl font-bold text-green-600",children:B.filter(e=>e.isVerified).length})})]}),(0,a.jsxs)(o.Card,{children:[(0,a.jsxs)(o.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,a.jsx)(o.CardTitle,{className:"text-sm font-medium",children:"Chưa xác minh"}),(0,a.jsx)(I.XCircle,{className:"h-4 w-4 text-muted-foreground"})]}),(0,a.jsx)(o.CardContent,{children:(0,a.jsx)("div",{className:"text-2xl font-bold text-orange-600",children:B.filter(e=>!e.isVerified).length})})]}),(0,a.jsxs)(o.Card,{children:[(0,a.jsxs)(o.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,a.jsx)(o.CardTitle,{className:"text-sm font-medium",children:"Loại tài liệu"}),(0,a.jsx)(O.Filter,{className:"h-4 w-4 text-muted-foreground"})]}),(0,a.jsx)(o.CardContent,{children:(0,a.jsx)("div",{className:"text-2xl font-bold",children:eg.size})})]})]}),(0,a.jsx)(o.Card,{children:(0,a.jsx)(o.CardContent,{className:"pt-6",children:(0,a.jsxs)("div",{className:"flex flex-col md:flex-row gap-4",children:[(0,a.jsx)("div",{className:"flex-1",children:(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(S.Search,{className:"absolute left-3 top-3 h-4 w-4 text-muted-foreground"}),(0,a.jsx)(u.Input,{placeholder:"Tìm kiếm tài liệu...",value:ea,onChange:e=>ei(e.target.value),className:"pl-10"})]})}),(0,a.jsxs)(f.Select,{value:ee,onValueChange:e=>et(e),children:[(0,a.jsx)(f.SelectTrigger,{className:"w-full md:w-[250px]",children:(0,a.jsx)(f.SelectValue,{placeholder:"Lọc theo loại"})}),(0,a.jsxs)(f.SelectContent,{children:[(0,a.jsx)(f.SelectItem,{value:"ALL",children:"Tất cả loại"}),Object.values(l.DocumentType).map(e=>(0,a.jsx)(f.SelectItem,{value:e,children:ef(e)},e))]})]})]})})}),0===eh.length?(0,a.jsx)(o.Card,{children:(0,a.jsxs)(o.CardContent,{className:"py-12 text-center",children:[(0,a.jsx)(C.FileText,{className:"mx-auto h-12 w-12 text-muted-foreground mb-4"}),(0,a.jsx)("p",{className:"text-muted-foreground",children:ea||"ALL"!==ee?"Không tìm thấy tài liệu phù hợp.":'Chưa có tài liệu nào. Nhấn "Tải lên tài liệu" để thêm.'})]})}):(0,a.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:eh.map(e=>{var t;let i=(t=e.fileMimeType,t?.startsWith("image/")?w.Image:t?.startsWith("application/pdf")?C.FileText:A.File);return(0,a.jsxs)(o.Card,{className:"hover:shadow-lg transition-shadow",children:[(0,a.jsx)(o.CardHeader,{children:(0,a.jsxs)("div",{className:"flex items-start justify-between",children:[(0,a.jsxs)("div",{className:"flex items-center space-x-3",children:[(0,a.jsx)("div",{className:"p-2 bg-primary/10 rounded-lg",children:(0,a.jsx)(i,{className:"h-6 w-6 text-primary"})}),(0,a.jsxs)("div",{className:"flex-1",children:[(0,a.jsx)(o.CardTitle,{className:"text-base line-clamp-1",children:e.title}),(0,a.jsx)(o.CardDescription,{className:"text-xs",children:ef(e.documentType)})]})]}),(0,a.jsxs)(y.DropdownMenu,{children:[(0,a.jsx)(y.DropdownMenuTrigger,{asChild:!0,children:(0,a.jsx)(n.Button,{variant:"ghost",size:"sm",children:(0,a.jsx)(j.MoreVertical,{className:"h-4 w-4"})})}),(0,a.jsxs)(y.DropdownMenuContent,{align:"end",children:[(0,a.jsx)(y.DropdownMenuLabel,{children:"Thao tác"}),(0,a.jsx)(y.DropdownMenuSeparator,{}),(0,a.jsxs)(y.DropdownMenuItem,{onClick:()=>{var t,a;let i;return t=e.fileUrl,a=e.fileName,void((i=document.createElement("a")).href=t,i.download=a,i.target="_blank",document.body.appendChild(i),i.click(),document.body.removeChild(i))},children:[(0,a.jsx)(v.Download,{className:"mr-2 h-4 w-4"}),"Tải xuống"]}),!e.isVerified&&(0,a.jsxs)(y.DropdownMenuItem,{onClick:()=>{Y(e.id),X(!0)},children:[(0,a.jsx)(R.Shield,{className:"mr-2 h-4 w-4"}),"Xác minh"]}),(0,a.jsx)(y.DropdownMenuSeparator,{}),(0,a.jsxs)(y.DropdownMenuItem,{className:"text-red-600",onClick:()=>{Y(e.id),Z(!0)},children:[(0,a.jsx)(N.Trash2,{className:"mr-2 h-4 w-4"}),"Xóa"]})]})]})]})}),(0,a.jsxs)(o.CardContent,{className:"space-y-3",children:[e.description&&(0,a.jsx)("p",{className:"text-sm text-muted-foreground line-clamp-2",children:e.description}),(0,a.jsxs)("div",{className:"flex items-center justify-between",children:[(0,a.jsx)(d.Badge,{variant:e.isVerified?"default":"secondary",className:e.isVerified?"bg-green-500":"",children:e.isVerified?(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(T.CheckCircle,{className:"mr-1 h-3 w-3"}),"Đã xác minh"]}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(I.XCircle,{className:"mr-1 h-3 w-3"}),"Chưa xác minh"]})}),e.fileSize&&(0,a.jsxs)("span",{className:"text-xs text-muted-foreground",children:[(e.fileSize/1024).toFixed(1)," KB"]})]}),e.documentNumber&&(0,a.jsxs)("div",{className:"text-xs",children:[(0,a.jsx)("span",{className:"text-muted-foreground",children:"Số:"})," ",e.documentNumber]}),(e.issueDate||e.expiryDate)&&(0,a.jsxs)("div",{className:"flex items-center space-x-2 text-xs text-muted-foreground",children:[(0,a.jsx)(P.Calendar,{className:"h-3 w-3"}),(0,a.jsxs)("span",{children:[e.issueDate&&new Date(e.issueDate).toLocaleDateString("vi-VN"),e.issueDate&&e.expiryDate&&" - ",e.expiryDate&&new Date(e.expiryDate).toLocaleDateString("vi-VN")]})]}),e.verifiedBy&&(0,a.jsxs)("div",{className:"flex items-center space-x-2 text-xs text-green-600",children:[(0,a.jsx)(k.User,{className:"h-3 w-3"}),(0,a.jsxs)("span",{children:["Xác minh bởi: ",e.verifiedBy]})]})]})]},e.id)})}),(0,a.jsx)(h.Dialog,{open:z,onOpenChange:Q,children:(0,a.jsxs)(h.DialogContent,{className:"max-w-2xl",children:[(0,a.jsxs)(h.DialogHeader,{children:[(0,a.jsx)(h.DialogTitle,{children:"Tải lên tài liệu mới"}),(0,a.jsx)(h.DialogDescription,{children:"Thêm tài liệu cho nhân viên này"})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsxs)(m.Label,{htmlFor:"documentType",children:["Loại tài liệu ",(0,a.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,a.jsxs)(f.Select,{value:es.documentType,onValueChange:e=>er({...es,documentType:e}),children:[(0,a.jsx)(f.SelectTrigger,{children:(0,a.jsx)(f.SelectValue,{})}),(0,a.jsx)(f.SelectContent,{children:Object.values(l.DocumentType).map(e=>(0,a.jsx)(f.SelectItem,{value:e,children:ef(e)},e))})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsxs)(m.Label,{htmlFor:"title",children:["Tiêu đề ",(0,a.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,a.jsx)(u.Input,{id:"title",value:es.title,onChange:e=>er({...es,title:e.target.value}),placeholder:"Nhập tiêu đề tài liệu"})]})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(m.Label,{htmlFor:"description",children:"Mô tả"}),(0,a.jsx)(p.Textarea,{id:"description",value:es.description,onChange:e=>er({...es,description:e.target.value}),placeholder:"Mô tả chi tiết về tài liệu",rows:3})]}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(m.Label,{htmlFor:"documentNumber",children:"Số tài liệu"}),(0,a.jsx)(u.Input,{id:"documentNumber",value:es.documentNumber,onChange:e=>er({...es,documentNumber:e.target.value}),placeholder:"VD: 123456789"})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(m.Label,{htmlFor:"issuingAuthority",children:"Cơ quan cấp"}),(0,a.jsx)(u.Input,{id:"issuingAuthority",value:es.issuingAuthority,onChange:e=>er({...es,issuingAuthority:e.target.value}),placeholder:"VD: Công an TP.HCM"})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(m.Label,{htmlFor:"issueDate",children:"Ngày cấp"}),(0,a.jsx)(u.Input,{id:"issueDate",type:"date",value:es.issueDate,onChange:e=>er({...es,issueDate:e.target.value})})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsx)(m.Label,{htmlFor:"expiryDate",children:"Ngày hết hạn"}),(0,a.jsx)(u.Input,{id:"expiryDate",type:"date",value:es.expiryDate,onChange:e=>er({...es,expiryDate:e.target.value})})]})]}),(0,a.jsx)(x.Separator,{}),(0,a.jsxs)("div",{className:"space-y-2",children:[(0,a.jsxs)(m.Label,{htmlFor:"file",children:["Tệp tin ",(0,a.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,a.jsx)(u.Input,{id:"file",type:"file",onChange:e=>{e.target.files&&e.target.files[0]&&eo(e.target.files[0])}}),el&&(0,a.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Đã chọn: ",el.name," (",(el.size/1024).toFixed(1)," KB)"]})]})]}),(0,a.jsxs)(h.DialogFooter,{children:[(0,a.jsx)(n.Button,{variant:"outline",onClick:()=>Q(!1),disabled:en,children:"Hủy"}),(0,a.jsx)(n.Button,{onClick:ec,disabled:en||!el||!es.title,children:en?"Đang tải lên...":"Tải lên"})]})]})}),(0,a.jsx)(g.AlertDialog,{open:K,onOpenChange:X,children:(0,a.jsxs)(g.AlertDialogContent,{children:[(0,a.jsxs)(g.AlertDialogHeader,{children:[(0,a.jsx)(g.AlertDialogTitle,{children:"Xác minh tài liệu"}),(0,a.jsx)(g.AlertDialogDescription,{children:"Bạn có chắc chắn muốn xác minh tài liệu này? Hành động này sẽ đánh dấu tài liệu là đã được kiểm tra và xác nhận."})]}),(0,a.jsxs)(g.AlertDialogFooter,{children:[(0,a.jsx)(g.AlertDialogCancel,{children:"Hủy"}),(0,a.jsx)(g.AlertDialogAction,{onClick:em,children:"Xác minh"})]})]})}),(0,a.jsx)(g.AlertDialog,{open:W,onOpenChange:Z,children:(0,a.jsxs)(g.AlertDialogContent,{children:[(0,a.jsxs)(g.AlertDialogHeader,{children:[(0,a.jsx)(g.AlertDialogTitle,{children:"Xóa tài liệu"}),(0,a.jsx)(g.AlertDialogDescription,{children:"Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác."})]}),(0,a.jsxs)(g.AlertDialogFooter,{children:[(0,a.jsx)(g.AlertDialogCancel,{children:"Hủy"}),(0,a.jsx)(g.AlertDialogAction,{onClick:ep,className:"bg-red-600 hover:bg-red-700",children:"Xóa"})]})]})})]})}e.s(["default",()=>$])}]);