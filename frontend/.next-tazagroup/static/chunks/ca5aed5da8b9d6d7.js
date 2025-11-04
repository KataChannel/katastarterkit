(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(873273),i=a.forwardRef((e,a)=>(0,t.jsx)(s.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));i.displayName="Label";var r=e.i(541428);function n({className:e,...a}){return(0,t.jsx)(i,{"data-slot":"label",className:(0,r.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>n],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("textarea",{className:(0,s.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...a}));i.displayName="Textarea",e.s(["Textarea",()=>i])},580523,e=>{"use strict";var t=e.i(403055),a=e.i(119836),s=e.i(569658),i=e.i(316618),r=e.i(559663),n=e.i(346412),l=e.i(430840),o=e.i(621829),d=e.i(581263),c=e.i(767478),m=e.i(873273),p=e.i(767835),u=e.i(896438),f=e.i(739045),g=e.i(599488),x=e.i(44990),h="Dialog",[v,N]=(0,i.createContextScope)(h),[j,y]=v(h),C=e=>{let{__scopeDialog:a,children:s,open:i,defaultOpen:l,onOpenChange:o,modal:d=!0}=e,c=t.useRef(null),m=t.useRef(null),[p,u]=(0,n.useControllableState)({prop:i,defaultProp:l??!1,onChange:o,caller:h});return(0,x.jsx)(j,{scope:a,triggerRef:c,contentRef:m,contentId:(0,r.useId)(),titleId:(0,r.useId)(),descriptionId:(0,r.useId)(),open:p,onOpenChange:u,onOpenToggle:t.useCallback(()=>u(e=>!e),[u]),modal:d,children:s})};C.displayName=h;var A="DialogTrigger",b=t.forwardRef((e,t)=>{let{__scopeDialog:i,...r}=e,n=y(A,i),l=(0,s.useComposedRefs)(t,n.triggerRef);return(0,x.jsx)(m.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":n.open,"aria-controls":n.contentId,"data-state":B(n.open),...r,ref:l,onClick:(0,a.composeEventHandlers)(e.onClick,n.onOpenToggle)})});b.displayName=A;var w="DialogPortal",[R,I]=v(w,{forceMount:void 0}),D=e=>{let{__scopeDialog:a,forceMount:s,children:i,container:r}=e,n=y(w,a);return(0,x.jsx)(R,{scope:a,forceMount:s,children:t.Children.map(i,e=>(0,x.jsx)(c.Presence,{present:s||n.open,children:(0,x.jsx)(d.Portal,{asChild:!0,container:r,children:e})}))})};D.displayName=w;var P="DialogOverlay",E=t.forwardRef((e,t)=>{let a=I(P,e.__scopeDialog),{forceMount:s=a.forceMount,...i}=e,r=y(P,e.__scopeDialog);return r.modal?(0,x.jsx)(c.Presence,{present:s||r.open,children:(0,x.jsx)(T,{...i,ref:t})}):null});E.displayName=P;var k=(0,g.createSlot)("DialogOverlay.RemoveScroll"),T=t.forwardRef((e,t)=>{let{__scopeDialog:a,...s}=e,i=y(P,a);return(0,x.jsx)(u.RemoveScroll,{as:k,allowPinchZoom:!0,shards:[i.contentRef],children:(0,x.jsx)(m.Primitive.div,{"data-state":B(i.open),...s,ref:t,style:{pointerEvents:"auto",...s.style}})})}),$="DialogContent",_=t.forwardRef((e,t)=>{let a=I($,e.__scopeDialog),{forceMount:s=a.forceMount,...i}=e,r=y($,e.__scopeDialog);return(0,x.jsx)(c.Presence,{present:s||r.open,children:r.modal?(0,x.jsx)(q,{...i,ref:t}):(0,x.jsx)(F,{...i,ref:t})})});_.displayName=$;var q=t.forwardRef((e,i)=>{let r=y($,e.__scopeDialog),n=t.useRef(null),l=(0,s.useComposedRefs)(i,r.contentRef,n);return t.useEffect(()=>{let e=n.current;if(e)return(0,f.hideOthers)(e)},[]),(0,x.jsx)(S,{...e,ref:l,trapFocus:r.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,a.composeEventHandlers)(e.onCloseAutoFocus,e=>{e.preventDefault(),r.triggerRef.current?.focus()}),onPointerDownOutside:(0,a.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,a=0===t.button&&!0===t.ctrlKey;(2===t.button||a)&&e.preventDefault()}),onFocusOutside:(0,a.composeEventHandlers)(e.onFocusOutside,e=>e.preventDefault())})}),F=t.forwardRef((e,a)=>{let s=y($,e.__scopeDialog),i=t.useRef(!1),r=t.useRef(!1);return(0,x.jsx)(S,{...e,ref:a,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(i.current||s.triggerRef.current?.focus(),t.preventDefault()),i.current=!1,r.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(i.current=!0,"pointerdown"===t.detail.originalEvent.type&&(r.current=!0));let a=t.target;s.triggerRef.current?.contains(a)&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&r.current&&t.preventDefault()}})}),S=t.forwardRef((e,a)=>{let{__scopeDialog:i,trapFocus:r,onOpenAutoFocus:n,onCloseAutoFocus:d,...c}=e,m=y($,i),u=t.useRef(null),f=(0,s.useComposedRefs)(a,u);return(0,p.useFocusGuards)(),(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(o.FocusScope,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:n,onUnmountAutoFocus:d,children:(0,x.jsx)(l.DismissableLayer,{role:"dialog",id:m.contentId,"aria-describedby":m.descriptionId,"aria-labelledby":m.titleId,"data-state":B(m.open),...c,ref:f,onDismiss:()=>m.onOpenChange(!1)})}),(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(X,{titleId:m.titleId}),(0,x.jsx)(z,{contentRef:u,descriptionId:m.descriptionId})]})]})}),O="DialogTitle",M=t.forwardRef((e,t)=>{let{__scopeDialog:a,...s}=e,i=y(O,a);return(0,x.jsx)(m.Primitive.h2,{id:i.titleId,...s,ref:t})});M.displayName=O;var G="DialogDescription",U=t.forwardRef((e,t)=>{let{__scopeDialog:a,...s}=e,i=y(G,a);return(0,x.jsx)(m.Primitive.p,{id:i.descriptionId,...s,ref:t})});U.displayName=G;var L="DialogClose",H=t.forwardRef((e,t)=>{let{__scopeDialog:s,...i}=e,r=y(L,s);return(0,x.jsx)(m.Primitive.button,{type:"button",...i,ref:t,onClick:(0,a.composeEventHandlers)(e.onClick,()=>r.onOpenChange(!1))})});function B(e){return e?"open":"closed"}H.displayName=L;var V="DialogTitleWarning",[W,J]=(0,i.createContext)(V,{contentName:$,titleName:O,docsSlug:"dialog"}),X=({titleId:e})=>{let a=J(V),s=`\`${a.contentName}\` requires a \`${a.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${a.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${a.docsSlug}`;return t.useEffect(()=>{e&&(document.getElementById(e)||console.error(s))},[s,e]),null},z=({contentRef:e,descriptionId:a})=>{let s=J("DialogDescriptionWarning"),i=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${s.contentName}}.`;return t.useEffect(()=>{let t=e.current?.getAttribute("aria-describedby");a&&t&&(document.getElementById(a)||console.warn(i))},[i,e,a]),null};e.s(["Close",()=>H,"Content",()=>_,"Description",()=>U,"Overlay",()=>E,"Portal",()=>D,"Root",()=>C,"Title",()=>M,"Trigger",()=>b])},137651,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(580523),i=e.i(888540),r=e.i(541428);let n=s.Root,l=s.Trigger,o=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(s.Overlay,{ref:i,className:(0,r.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...a}));o.displayName=s.Overlay.displayName;let d=a.forwardRef(({className:e,children:a,...n},l)=>(0,t.jsxs)(s.Portal,{children:[(0,t.jsx)(o,{}),(0,t.jsxs)(s.Content,{ref:l,className:(0,r.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...n,children:[a,(0,t.jsxs)(s.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,t.jsx)(i.X,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));d.displayName=s.Content.displayName;let c=({className:e,...a})=>(0,t.jsx)("div",{className:(0,r.cn)("flex flex-col space-y-1.5 text-center sm:text-left",e),...a});c.displayName="DialogHeader";let m=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(s.Title,{ref:i,className:(0,r.cn)("text-lg font-semibold leading-none tracking-tight",e),...a}));m.displayName=s.Title.displayName;let p=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(s.Description,{ref:i,className:(0,r.cn)("text-sm text-muted-foreground",e),...a}));p.displayName=s.Description.displayName;let u=({className:e,...a})=>(0,t.jsx)("div",{className:(0,r.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...a});u.displayName="DialogFooter",e.s(["Dialog",()=>n,"DialogContent",()=>d,"DialogDescription",()=>p,"DialogFooter",()=>u,"DialogHeader",()=>c,"DialogTitle",()=>m,"DialogTrigger",()=>l])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},774309,e=>{"use strict";var t=e.i(44990);let a=e.i(403055).forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...a}));a.displayName="Skeleton",e.s(["Skeleton",()=>a])},825098,e=>{"use strict";var t=e.i(555234);e.s(["Mail",()=>t.default])},495280,e=>{"use strict";var t=e.i(46213);e.s(["MessageSquare",()=>t.default])},415733,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,role:"alert",className:(0,s.cn)("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",e),...a}));i.displayName="Alert";let r=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,s.cn)("text-sm [&_p]:leading-relaxed",e),...a}));r.displayName="AlertDescription",e.s(["Alert",()=>i,"AlertDescription",()=>r])},822390,e=>{"use strict";var t=e.i(621924);e.s(["CheckCircle",()=>t.default])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},129376,e=>{"use strict";var t=e.i(984804);t.gql`
  query GetAffiliateUser {
    affiliateUser {
      id
      userId
      role
      status
      businessName
      website
      taxId
      paymentEmail
      paymentMethod
      bankDetails
      socialProfiles
      complianceDocuments
      totalEarnings
      totalClicks
      totalConversions
      conversionRate
      averageOrderValue
      isVerified
      createdAt
      updatedAt
    }
  }
`,t.gql`
  mutation CreateAffiliateUser($input: CreateAffUserInput!) {
    createAffiliateUser(input: $input) {
      id
      userId
      role
      status
      businessName
      website
      paymentEmail
      paymentMethod
      totalEarnings
      isVerified
      createdAt
    }
  }
`,t.gql`
  mutation UpdateAffiliateUser($input: UpdateAffUserInput!) {
    updateAffiliateUser(input: $input) {
      id
      businessName
      website
      paymentEmail
      paymentMethod
      bankDetails
      socialProfiles
      updatedAt
    }
  }
`;let a=t.gql`
  query GetAffiliateCampaigns($search: CampaignSearchInput) {
    affiliateCampaigns(search: $search) {
      id
      name
      description
      type
      status
      commissionType
      commissionRate
      fixedAmount
      cookieDuration
      minPayoutAmount
      maxPayoutAmount
      totalRevenue
      totalCommission
      totalClicks
      totalConversions
      conversionRate
      averageOrderValue
      categories
      targetCountries
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;t.gql`
  query GetAffiliateCampaign($id: String!) {
    affiliateCampaign(id: $id) {
      id
      name
      description
      type
      status
      commissionType
      commissionRate
      fixedAmount
      cookieDuration
      minPayoutAmount
      maxPayoutAmount
      totalRevenue
      totalCommission
      totalClicks
      totalConversions
      conversionRate
      averageOrderValue
      categories
      targetCountries
      targetAudience
      terms
      materials
      startDate
      endDate
      createdAt
      updatedAt
      creatorId
    }
  }
`;let s=t.gql`
  mutation CreateAffiliateCampaign($input: CreateCampaignInput!) {
    createAffiliateCampaign(input: $input) {
      id
      name
      description
      type
      status
      commissionType
      commissionRate
      fixedAmount
      totalRevenue
      totalCommission
      createdAt
    }
  }
`,i=t.gql`
  mutation UpdateAffiliateCampaign($id: String!, $input: UpdateCampaignInput!) {
    updateAffiliateCampaign(id: $id, input: $input) {
      id
      name
      description
      status
      commissionRate
      fixedAmount
      updatedAt
    }
  }
`,r=t.gql`
  mutation JoinCampaign($input: JoinCampaignInput!) {
    joinCampaign(input: $input)
  }
`,n=t.gql`
  mutation ReviewCampaignApplication($input: ReviewCampaignApplicationInput!) {
    reviewCampaignApplication(input: $input)
  }
`;t.gql`
  mutation DeleteAffiliateCampaign($id: String!) {
    deleteAffiliateCampaign(id: $id)
  }
`;let l=t.gql`
  query GetMyCampaignApplications {
    affiliateUser {
      id
      role
      campaignJoins {
        id
        status
        reason
        approvedAt
        rejectedAt
        appliedAt
        createdAt
        totalClicks
        totalConversions
        totalEarnings
        campaign {
          id
          name
          description
          commissionType
          commissionRate
          fixedAmount
          status
          productName
          productUrl
          productImage
          startDate
          endDate
        }
      }
    }
  }
`,o=t.gql`
  query GetCampaignApplications($campaignId: String!) {
    getAffiliateCampaign(id: $campaignId) {
      id
      name
      affiliates {
        id
        status
        message
        reviewReason
        approvedAt
        reviewedAt
        createdAt
        affiliate {
          id
          businessName
          website
          user {
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`,d=t.gql`
  query GetAffiliateLinks($search: AffLinkSearchInput) {
    affiliateLinks(search: $search) {
      id
      affiliateUserId
      campaignId
      trackingCode
      originalUrl
      shortUrl
      customAlias
      title
      description
      totalClicks
      totalConversions
      revenue
      commission
      conversionRate
      isActive
      createdAt
      updatedAt
      campaign {
        id
        name
        commissionType
        commissionRate
        fixedAmount
      }
    }
  }
`,c=t.gql`
  mutation CreateAffiliateLink($input: CreateAffLinkInput!) {
    createAffiliateLink(input: $input) {
      id
      trackingCode
      originalUrl
      shortUrl
      customAlias
      title
      description
      isActive
      createdAt
      campaign {
        id
        name
      }
    }
  }
`;t.gql`
  query GetAffiliateConversions($search: AffConversionSearchInput) {
    affiliateConversions(search: $search)
  }
`;let m=t.gql`
  query GetAffiliatePaymentRequests($search: AffPaymentRequestSearchInput) {
    affiliatePaymentRequests(search: $search) {
      id
      affiliateId
      amount
      currency
      paymentMethod
      status
      accountDetails
      transactionId
      processedBy
      processedAt
      adminNotes
      requestedAt
    }
  }
`,p=t.gql`
  mutation CreatePaymentRequest($input: CreatePaymentRequestInput!) {
    createPaymentRequest(input: $input) {
      id
      amount
      currency
      paymentMethod
      status
      requestedAt
    }
  }
`;t.gql`
  mutation ProcessPaymentRequest($id: String!, $status: String!) {
    processPaymentRequest(id: $id, status: $status) {
      id
      status
      processedAt
      transactionId
    }
  }
`;let u=t.gql`
  query GetAffiliateEarningsReport($startDate: DateTime, $endDate: DateTime) {
    affiliateEarningsReport(startDate: $startDate, endDate: $endDate) {
      totalConversions
      totalEarnings
      pendingConversions
      pendingEarnings
      approvedConversions
      approvedEarnings
      paidConversions
      paidEarnings
      availableForWithdrawal
    }
  }
`;e.s(["CREATE_AFFILIATE_CAMPAIGN",0,s,"CREATE_AFFILIATE_LINK",0,c,"CREATE_PAYMENT_REQUEST",0,p,"GET_AFFILIATE_CAMPAIGNS",0,a,"GET_AFFILIATE_EARNINGS_REPORT",0,u,"GET_AFFILIATE_LINKS",0,d,"GET_AFFILIATE_PAYMENT_REQUESTS",0,m,"GET_CAMPAIGN_APPLICATIONS",0,o,"GET_MY_CAMPAIGN_APPLICATIONS",0,l,"JOIN_CAMPAIGN",0,r,"REVIEW_CAMPAIGN_APPLICATION",0,n,"UPDATE_AFFILIATE_CAMPAIGN",0,i])},564216,e=>{"use strict";var t=e.i(794730);e.s(["Globe",()=>t.default])},362815,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(130775),i=e.i(123959);function r({children:e,fallback:r}){let{isAuthenticated:n,loading:l}=(0,i.useAuth)(),o=(0,s.useRouter)(),d=(0,s.usePathname)();return l?r||(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gray-50",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"})}):((0,a.useEffect)(()=>{if(!n&&!l){let e=d||"/",t=`/login${"/"!==e?`?returnUrl=${encodeURIComponent(e)}`:""}`;o.push(t)}},[n,l,d,o]),n)?(0,t.jsx)(t.Fragment,{children:e}):null}e.s(["ProtectedRoute",()=>r])},758989,e=>{"use strict";var t=e.i(44990),a=e.i(130775),s=e.i(362815),i=e.i(403055),r=e.i(429105),n=e.i(950988),l=e.i(775680),o=e.i(702470),d=e.i(885205),c=e.i(165429),m=e.i(600547),p=e.i(41714),u=e.i(774309),f=e.i(137651),g=e.i(415733),x=e.i(822390),h=e.i(257117),v=e.i(415588),N=e.i(909905),j=e.i(564216),y=e.i(825098),C=e.i(435635),A=e.i(495280),b=e.i(169989),w=e.i(198513),R=e.i(129376);function I({campaignId:e,className:a=""}){let[s,I]=(0,i.useState)(null),[D,P]=(0,i.useState)("approved"),[E,k]=(0,i.useState)(""),[T,$]=(0,i.useState)(!1),[_,q]=(0,i.useState)(""),{data:F,loading:S,refetch:O}=(0,r.useQuery)(R.GET_CAMPAIGN_APPLICATIONS,{variables:{campaignId:e},skip:!e}),[M,{loading:G}]=(0,n.useMutation)(R.REVIEW_CAMPAIGN_APPLICATION,{onCompleted:()=>{$(!1),I(null),k(""),q(""),O()},onError:e=>{q(e.message||"Failed to review application")}}),U=F?.getAffiliateCampaign,L=U?.affiliates||[],H=L.filter(e=>"PENDING"===e.status),B=L.filter(e=>"APPROVED"===e.status),V=L.filter(e=>"REJECTED"===e.status),W=(e,t)=>{I(e),P(t),k(""),q(""),$(!0)},J=async()=>{if(s)try{await M({variables:{input:{applicationId:s.id,action:D,reason:E.trim()||void 0}}})}catch(e){}},X=e=>{let a="PENDING"===e.status,s="APPROVED"===e.status,i="REJECTED"===e.status;return(0,t.jsxs)(l.Card,{className:"hover:shadow-md transition-shadow",children:[(0,t.jsx)(l.CardHeader,{children:(0,t.jsxs)("div",{className:"flex items-start justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,t.jsxs)(p.Avatar,{className:"h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold",children:[e.affiliate.user.firstName[0],e.affiliate.user.lastName[0]]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)(l.CardTitle,{className:"text-lg",children:[e.affiliate.user.firstName," ",e.affiliate.user.lastName]}),e.affiliate.businessName&&(0,t.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:e.affiliate.businessName})]})]}),(0,t.jsxs)(o.Badge,{className:a?"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":s?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",children:[a?(0,t.jsx)(v.Clock,{className:"h-3 w-3 mr-1"}):s?(0,t.jsx)(x.CheckCircle,{className:"h-3 w-3 mr-1"}):(0,t.jsx)(h.XCircle,{className:"h-3 w-3 mr-1"}),e.status]})]})}),(0,t.jsxs)(l.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,t.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,t.jsx)(y.Mail,{className:"h-4 w-4 mr-2"}),(0,t.jsx)("span",{children:e.affiliate.user.email})]}),e.affiliate.website&&(0,t.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,t.jsx)(j.Globe,{className:"h-4 w-4 mr-2"}),(0,t.jsx)("a",{href:e.affiliate.website,target:"_blank",rel:"noopener noreferrer",className:"hover:underline text-blue-600 dark:text-blue-400",children:e.affiliate.website})]}),(0,t.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,t.jsx)(C.Calendar,{className:"h-4 w-4 mr-2"}),(0,t.jsxs)("span",{children:["Applied ",new Date(e.createdAt).toLocaleDateString()]})]})]}),e.message&&(0,t.jsxs)("div",{className:"bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border",children:[(0,t.jsxs)("div",{className:"flex items-start space-x-2 mb-2",children:[(0,t.jsx)(A.MessageSquare,{className:"h-4 w-4 text-gray-500 mt-0.5"}),(0,t.jsx)("span",{className:"text-sm font-medium",children:"Message:"})]}),(0,t.jsx)("p",{className:"text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap",children:e.message})]}),i&&e.reviewReason&&(0,t.jsxs)("div",{className:"bg-red-50 dark:bg-red-950 rounded-lg p-3 border border-red-200 dark:border-red-800",children:[(0,t.jsxs)("div",{className:"flex items-start space-x-2 mb-2",children:[(0,t.jsx)(h.XCircle,{className:"h-4 w-4 text-red-600 mt-0.5"}),(0,t.jsx)("span",{className:"text-sm font-medium text-red-800 dark:text-red-200",children:"Rejection Reason:"})]}),(0,t.jsx)("p",{className:"text-sm text-red-700 dark:text-red-300",children:e.reviewReason})]}),a&&(0,t.jsxs)("div",{className:"flex gap-2 pt-2",children:[(0,t.jsxs)(d.Button,{onClick:()=>W(e,"approved"),className:"flex-1 bg-green-600 hover:bg-green-700",children:[(0,t.jsx)(x.CheckCircle,{className:"h-4 w-4 mr-2"}),"Approve"]}),(0,t.jsxs)(d.Button,{onClick:()=>W(e,"rejected"),variant:"outline",className:"flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950",children:[(0,t.jsx)(h.XCircle,{className:"h-4 w-4 mr-2"}),"Reject"]})]})]})]},e.id)};return S?(0,t.jsx)("div",{className:`space-y-4 ${a}`,children:[1,2,3].map(e=>(0,t.jsx)(u.Skeleton,{className:"h-48"},e))}):(0,t.jsxs)("div",{className:`space-y-6 ${a}`,children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-2xl font-bold tracking-tight",children:"Application Review"}),(0,t.jsxs)("p",{className:"text-muted-foreground mt-2",children:[U?.name||"Campaign"," - Review and manage affiliate applications"]})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-3",children:[(0,t.jsxs)(l.Card,{children:[(0,t.jsx)(l.CardHeader,{className:"pb-2",children:(0,t.jsx)(l.CardTitle,{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"Pending"})}),(0,t.jsx)(l.CardContent,{children:(0,t.jsx)("div",{className:"text-3xl font-bold text-yellow-600",children:H.length})})]}),(0,t.jsxs)(l.Card,{children:[(0,t.jsx)(l.CardHeader,{className:"pb-2",children:(0,t.jsx)(l.CardTitle,{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"Approved"})}),(0,t.jsx)(l.CardContent,{children:(0,t.jsx)("div",{className:"text-3xl font-bold text-green-600",children:B.length})})]}),(0,t.jsxs)(l.Card,{children:[(0,t.jsx)(l.CardHeader,{className:"pb-2",children:(0,t.jsx)(l.CardTitle,{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"Rejected"})}),(0,t.jsx)(l.CardContent,{children:(0,t.jsx)("div",{className:"text-3xl font-bold text-red-600",children:V.length})})]})]}),H.length>0&&(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("h3",{className:"text-xl font-semibold",children:["Pending Applications (",H.length,")"]}),(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2",children:H.map(X)})]}),B.length>0&&(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("h3",{className:"text-xl font-semibold",children:["Approved Affiliates (",B.length,")"]}),(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2",children:B.map(X)})]}),V.length>0&&(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("h3",{className:"text-xl font-semibold",children:["Rejected Applications (",V.length,")"]}),(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2",children:V.map(X)})]}),0===L.length&&(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)(N.User,{className:"h-12 w-12 text-gray-400 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"No applications yet"}),(0,t.jsx)("p",{className:"text-gray-600 dark:text-gray-400",children:"Affiliates who apply to your campaign will appear here"})]}),(0,t.jsx)(f.Dialog,{open:T,onOpenChange:$,children:(0,t.jsxs)(f.DialogContent,{className:"sm:max-w-[500px]",children:[(0,t.jsxs)(f.DialogHeader,{children:[(0,t.jsx)(f.DialogTitle,{children:"approved"===D?"Approve Application":"Reject Application"}),(0,t.jsx)(f.DialogDescription,{children:s&&`${s.affiliate.user.firstName} ${s.affiliate.user.lastName}`})]}),(0,t.jsxs)("div",{className:"space-y-4",children:[s?.message&&(0,t.jsxs)("div",{className:"bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border",children:[(0,t.jsx)(c.Label,{className:"text-sm font-medium mb-2 block",children:"Their Message:"}),(0,t.jsx)("p",{className:"text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap",children:s.message})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)(c.Label,{htmlFor:"reviewReason",children:["approved"===D?"Approval Message":"Rejection Reason"," ","rejected"===D?"(Recommended)":"(Optional)"]}),(0,t.jsx)(m.Textarea,{id:"reviewReason",placeholder:"approved"===D?"Welcome message (optional)...":"Explain why this application was rejected...",value:E,onChange:e=>k(e.target.value),rows:4,className:"resize-none"})]}),_&&(0,t.jsxs)(g.Alert,{className:"border-red-500 bg-red-50 dark:bg-red-950",children:[(0,t.jsx)(w.AlertCircle,{className:"h-4 w-4 text-red-600"}),(0,t.jsx)(g.AlertDescription,{className:"text-red-800 dark:text-red-200",children:_})]})]}),(0,t.jsxs)(f.DialogFooter,{children:[(0,t.jsx)(d.Button,{type:"button",variant:"outline",onClick:()=>$(!1),disabled:G,children:"Cancel"}),(0,t.jsx)(d.Button,{type:"button",onClick:J,disabled:G,className:"approved"===D?"bg-green-600 hover:bg-green-700":"bg-red-600 hover:bg-red-700",children:G?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(b.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}),"Processing..."]}):"approved"===D?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(x.CheckCircle,{className:"mr-2 h-4 w-4"}),"Approve"]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(h.XCircle,{className:"mr-2 h-4 w-4"}),"Reject"]})})]})]})})]})}function D(){let e=(0,a.useParams)(),i=e?.id;return(0,t.jsx)(s.ProtectedRoute,{children:(0,t.jsx)("div",{className:"container mx-auto py-8 px-4",children:i?(0,t.jsx)(I,{campaignId:i}):(0,t.jsx)("div",{className:"text-center py-12",children:(0,t.jsx)("p",{className:"text-gray-600 dark:text-gray-400",children:"No campaign selected"})})})})}e.s(["default",()=>D],758989)}]);