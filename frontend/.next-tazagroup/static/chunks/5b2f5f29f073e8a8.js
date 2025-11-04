(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(873273),i=a.forwardRef((e,a)=>(0,t.jsx)(s.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));i.displayName="Label";var n=e.i(541428);function r({className:e,...a}){return(0,t.jsx)(i,{"data-slot":"label",className:(0,n.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>r],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("textarea",{className:(0,s.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...a}));i.displayName="Textarea",e.s(["Textarea",()=>i])},774309,e=>{"use strict";var t=e.i(44990);let a=e.i(403055).forwardRef(({className:e,...a},s)=>(0,t.jsx)("div",{ref:s,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...a}));a.displayName="Skeleton",e.s(["Skeleton",()=>a])},415733,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(541428);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,role:"alert",className:(0,s.cn)("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",e),...a}));i.displayName="Alert";let n=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,s.cn)("text-sm [&_p]:leading-relaxed",e),...a}));n.displayName="AlertDescription",e.s(["Alert",()=>i,"AlertDescription",()=>n])},129376,e=>{"use strict";var t=e.i(984804);t.gql`
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
`,n=t.gql`
  mutation JoinCampaign($input: JoinCampaignInput!) {
    joinCampaign(input: $input)
  }
`,r=t.gql`
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
`,c=t.gql`
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
`,d=t.gql`
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
`,u=t.gql`
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
`;let p=t.gql`
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
`;e.s(["CREATE_AFFILIATE_CAMPAIGN",0,s,"CREATE_AFFILIATE_LINK",0,d,"CREATE_PAYMENT_REQUEST",0,u,"GET_AFFILIATE_CAMPAIGNS",0,a,"GET_AFFILIATE_EARNINGS_REPORT",0,p,"GET_AFFILIATE_LINKS",0,c,"GET_AFFILIATE_PAYMENT_REQUESTS",0,m,"GET_CAMPAIGN_APPLICATIONS",0,o,"GET_MY_CAMPAIGN_APPLICATIONS",0,l,"JOIN_CAMPAIGN",0,n,"REVIEW_CAMPAIGN_APPLICATION",0,r,"UPDATE_AFFILIATE_CAMPAIGN",0,i])},649248,e=>{"use strict";var t=e.i(336613);e.s(["DollarSign",()=>t.default])},822390,e=>{"use strict";var t=e.i(621924);e.s(["CheckCircle",()=>t.default])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},580523,e=>{"use strict";var t=e.i(403055),a=e.i(119836),s=e.i(569658),i=e.i(316618),n=e.i(559663),r=e.i(346412),l=e.i(430840),o=e.i(621829),c=e.i(581263),d=e.i(767478),m=e.i(873273),u=e.i(767835),p=e.i(896438),g=e.i(739045),f=e.i(599488),x=e.i(44990),h="Dialog",[v,y]=(0,i.createContextScope)(h),[j,C]=v(h),N=e=>{let{__scopeDialog:a,children:s,open:i,defaultOpen:l,onOpenChange:o,modal:c=!0}=e,d=t.useRef(null),m=t.useRef(null),[u,p]=(0,r.useControllableState)({prop:i,defaultProp:l??!1,onChange:o,caller:h});return(0,x.jsx)(j,{scope:a,triggerRef:d,contentRef:m,contentId:(0,n.useId)(),titleId:(0,n.useId)(),descriptionId:(0,n.useId)(),open:u,onOpenChange:p,onOpenToggle:t.useCallback(()=>p(e=>!e),[p]),modal:c,children:s})};N.displayName=h;var A="DialogTrigger",b=t.forwardRef((e,t)=>{let{__scopeDialog:i,...n}=e,r=C(A,i),l=(0,s.useComposedRefs)(t,r.triggerRef);return(0,x.jsx)(m.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":r.open,"aria-controls":r.contentId,"data-state":B(r.open),...n,ref:l,onClick:(0,a.composeEventHandlers)(e.onClick,r.onOpenToggle)})});b.displayName=A;var I="DialogPortal",[D,E]=v(I,{forceMount:void 0}),w=e=>{let{__scopeDialog:a,forceMount:s,children:i,container:n}=e,r=C(I,a);return(0,x.jsx)(D,{scope:a,forceMount:s,children:t.Children.map(i,e=>(0,x.jsx)(d.Presence,{present:s||r.open,children:(0,x.jsx)(c.Portal,{asChild:!0,container:n,children:e})}))})};w.displayName=I;var R="DialogOverlay",T=t.forwardRef((e,t)=>{let a=E(R,e.__scopeDialog),{forceMount:s=a.forceMount,...i}=e,n=C(R,e.__scopeDialog);return n.modal?(0,x.jsx)(d.Presence,{present:s||n.open,children:(0,x.jsx)(k,{...i,ref:t})}):null});T.displayName=R;var P=(0,f.createSlot)("DialogOverlay.RemoveScroll"),k=t.forwardRef((e,t)=>{let{__scopeDialog:a,...s}=e,i=C(R,a);return(0,x.jsx)(p.RemoveScroll,{as:P,allowPinchZoom:!0,shards:[i.contentRef],children:(0,x.jsx)(m.Primitive.div,{"data-state":B(i.open),...s,ref:t,style:{pointerEvents:"auto",...s.style}})})}),S="DialogContent",$=t.forwardRef((e,t)=>{let a=E(S,e.__scopeDialog),{forceMount:s=a.forceMount,...i}=e,n=C(S,e.__scopeDialog);return(0,x.jsx)(d.Presence,{present:s||n.open,children:n.modal?(0,x.jsx)(F,{...i,ref:t}):(0,x.jsx)(_,{...i,ref:t})})});$.displayName=S;var F=t.forwardRef((e,i)=>{let n=C(S,e.__scopeDialog),r=t.useRef(null),l=(0,s.useComposedRefs)(i,n.contentRef,r);return t.useEffect(()=>{let e=r.current;if(e)return(0,g.hideOthers)(e)},[]),(0,x.jsx)(q,{...e,ref:l,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,a.composeEventHandlers)(e.onCloseAutoFocus,e=>{e.preventDefault(),n.triggerRef.current?.focus()}),onPointerDownOutside:(0,a.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,a=0===t.button&&!0===t.ctrlKey;(2===t.button||a)&&e.preventDefault()}),onFocusOutside:(0,a.composeEventHandlers)(e.onFocusOutside,e=>e.preventDefault())})}),_=t.forwardRef((e,a)=>{let s=C(S,e.__scopeDialog),i=t.useRef(!1),n=t.useRef(!1);return(0,x.jsx)(q,{...e,ref:a,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(i.current||s.triggerRef.current?.focus(),t.preventDefault()),i.current=!1,n.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(i.current=!0,"pointerdown"===t.detail.originalEvent.type&&(n.current=!0));let a=t.target;s.triggerRef.current?.contains(a)&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&n.current&&t.preventDefault()}})}),q=t.forwardRef((e,a)=>{let{__scopeDialog:i,trapFocus:n,onOpenAutoFocus:r,onCloseAutoFocus:c,...d}=e,m=C(S,i),p=t.useRef(null),g=(0,s.useComposedRefs)(a,p);return(0,u.useFocusGuards)(),(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(o.FocusScope,{asChild:!0,loop:!0,trapped:n,onMountAutoFocus:r,onUnmountAutoFocus:c,children:(0,x.jsx)(l.DismissableLayer,{role:"dialog",id:m.contentId,"aria-describedby":m.descriptionId,"aria-labelledby":m.titleId,"data-state":B(m.open),...d,ref:g,onDismiss:()=>m.onOpenChange(!1)})}),(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(z,{titleId:m.titleId}),(0,x.jsx)(X,{contentRef:p,descriptionId:m.descriptionId})]})]})}),L="DialogTitle",U=t.forwardRef((e,t)=>{let{__scopeDialog:a,...s}=e,i=C(L,a);return(0,x.jsx)(m.Primitive.h2,{id:i.titleId,...s,ref:t})});U.displayName=L;var G="DialogDescription",O=t.forwardRef((e,t)=>{let{__scopeDialog:a,...s}=e,i=C(G,a);return(0,x.jsx)(m.Primitive.p,{id:i.descriptionId,...s,ref:t})});O.displayName=G;var M="DialogClose",V=t.forwardRef((e,t)=>{let{__scopeDialog:s,...i}=e,n=C(M,s);return(0,x.jsx)(m.Primitive.button,{type:"button",...i,ref:t,onClick:(0,a.composeEventHandlers)(e.onClick,()=>n.onOpenChange(!1))})});function B(e){return e?"open":"closed"}V.displayName=M;var H="DialogTitleWarning",[J,K]=(0,i.createContext)(H,{contentName:S,titleName:L,docsSlug:"dialog"}),z=({titleId:e})=>{let a=K(H),s=`\`${a.contentName}\` requires a \`${a.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${a.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${a.docsSlug}`;return t.useEffect(()=>{e&&(document.getElementById(e)||console.error(s))},[s,e]),null},X=({contentRef:e,descriptionId:a})=>{let s=K("DialogDescriptionWarning"),i=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${s.contentName}}.`;return t.useEffect(()=>{let t=e.current?.getAttribute("aria-describedby");a&&t&&(document.getElementById(a)||console.warn(i))},[i,e,a]),null};e.s(["Close",()=>V,"Content",()=>$,"Description",()=>O,"Overlay",()=>T,"Portal",()=>w,"Root",()=>N,"Title",()=>U,"Trigger",()=>b])},137651,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(580523),i=e.i(888540),n=e.i(541428);let r=s.Root,l=s.Trigger,o=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(s.Overlay,{ref:i,className:(0,n.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...a}));o.displayName=s.Overlay.displayName;let c=a.forwardRef(({className:e,children:a,...r},l)=>(0,t.jsxs)(s.Portal,{children:[(0,t.jsx)(o,{}),(0,t.jsxs)(s.Content,{ref:l,className:(0,n.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...r,children:[a,(0,t.jsxs)(s.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,t.jsx)(i.X,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));c.displayName=s.Content.displayName;let d=({className:e,...a})=>(0,t.jsx)("div",{className:(0,n.cn)("flex flex-col space-y-1.5 text-center sm:text-left",e),...a});d.displayName="DialogHeader";let m=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(s.Title,{ref:i,className:(0,n.cn)("text-lg font-semibold leading-none tracking-tight",e),...a}));m.displayName=s.Title.displayName;let u=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(s.Description,{ref:i,className:(0,n.cn)("text-sm text-muted-foreground",e),...a}));u.displayName=s.Description.displayName;let p=({className:e,...a})=>(0,t.jsx)("div",{className:(0,n.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...a});p.displayName="DialogFooter",e.s(["Dialog",()=>r,"DialogContent",()=>c,"DialogDescription",()=>u,"DialogFooter",()=>p,"DialogHeader",()=>d,"DialogTitle",()=>m,"DialogTrigger",()=>l])},173416,e=>{"use strict";var t=e.i(46034);e.s(["Filter",()=>t.default])},362815,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(130775),i=e.i(123959);function n({children:e,fallback:n}){let{isAuthenticated:r,loading:l}=(0,i.useAuth)(),o=(0,s.useRouter)(),c=(0,s.usePathname)();return l?n||(0,t.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gray-50",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"})}):((0,a.useEffect)(()=>{if(!r&&!l){let e=c||"/",t=`/login${"/"!==e?`?returnUrl=${encodeURIComponent(e)}`:""}`;o.push(t)}},[r,l,c,o]),r)?(0,t.jsx)(t.Fragment,{children:e}):null}e.s(["ProtectedRoute",()=>n])},182639,e=>{"use strict";var t=e.i(44990),a=e.i(362815),s=e.i(403055),i=e.i(429105),n=e.i(775680),r=e.i(702470),l=e.i(885205),o=e.i(696134),c=e.i(183194),d=e.i(774309),m=e.i(850384),u=e.i(173416),p=e.i(649248),g=e.i(435635),f=e.i(759727),x=e.i(771564),h=e.i(822390),v=e.i(415588),y=e.i(257117),j=e.i(404210),C=e.i(129376),N=e.i(950988),A=e.i(137651),b=e.i(165429),I=e.i(600547),D=e.i(415733),E=e.i(198513),w=e.i(169989);function R({campaign:e,isOpen:a,onClose:i,onSuccess:n}){let[o,c]=(0,s.useState)(""),[d,m]=(0,s.useState)(""),[u,{loading:f}]=(0,N.useMutation)(C.JOIN_CAMPAIGN,{onCompleted:()=>{c(""),m(""),n?.(),i()},onError:e=>{m(e.message||"Failed to join campaign")}}),v=async t=>{if(t.preventDefault(),e)try{await u({variables:{input:{campaignId:e.id,message:o.trim()||void 0}}})}catch(e){}},y=()=>{c(""),m(""),i()};if(!e)return null;let j="PUBLIC"!==e.type;return(0,t.jsx)(A.Dialog,{open:a,onOpenChange:y,children:(0,t.jsxs)(A.DialogContent,{className:"sm:max-w-[600px]",children:[(0,t.jsxs)(A.DialogHeader,{children:[(0,t.jsx)(A.DialogTitle,{className:"text-2xl",children:"Tham gia Chiến dịch"}),(0,t.jsx)(A.DialogDescription,{children:"Xem lại thông tin chiến dịch và gửi đơn đăng ký của bạn"})]}),(0,t.jsxs)("form",{onSubmit:v,className:"space-y-6",children:[(0,t.jsxs)("div",{className:"space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-semibold text-lg mb-2",children:e.name}),(0,t.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:e.description})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"flex items-start space-x-2",children:[(0,t.jsx)(p.DollarSign,{className:"h-5 w-5 text-green-600 mt-0.5"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:"Hoa hồng"}),(0,t.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"PERCENTAGE"===e.commissionType?`${e.commissionRate}% mỗi đơn`:`${e.fixedAmount.toLocaleString()} VND mỗi đơn`})]})]}),(0,t.jsxs)("div",{className:"flex items-start space-x-2",children:[(0,t.jsx)(x.Users,{className:"h-5 w-5 text-blue-600 mt-0.5"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:"Loại"}),(0,t.jsx)(r.Badge,{variant:"PUBLIC"===e.type?"default":"secondary",children:"PUBLIC"===e.type?"Công khai":"Riêng tư"})]})]}),(0,t.jsxs)("div",{className:"flex items-start space-x-2",children:[(0,t.jsx)(g.Calendar,{className:"h-5 w-5 text-purple-600 mt-0.5"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:"Thời gian Cookie"}),(0,t.jsxs)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:[e.cookieDuration," ngày"]})]})]}),(0,t.jsxs)("div",{className:"flex items-start space-x-2",children:[(0,t.jsx)(h.CheckCircle,{className:"h-5 w-5 text-green-600 mt-0.5"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium",children:"Trạng thái"}),(0,t.jsx)(r.Badge,{variant:"ACTIVE"===e.status?"default":"secondary",children:"ACTIVE"===e.status?"Đang hoạt động":"PAUSED"===e.status?"Tạm dừng":"Nháp"})]})]})]})]}),j&&(0,t.jsxs)(D.Alert,{children:[(0,t.jsx)(E.AlertCircle,{className:"h-4 w-4"}),(0,t.jsx)(D.AlertDescription,{children:"Chiến dịch này yêu cầu phê duyệt. Đơn đăng ký của bạn sẽ được nhà cung cấp xem xét. Viết lời nhắn để tăng cơ hội được chấp thuận."})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)(b.Label,{htmlFor:"message",children:["Lời nhắn ",j?"(Bắt buộc)":"(Tùy chọn)"]}),(0,t.jsx)(I.Textarea,{id:"message",placeholder:"Cho nhà cung cấp biết tại sao bạn muốn quảng bá sản phẩm của họ...",value:o,onChange:e=>c(e.target.value),rows:4,required:j,className:"resize-none"}),(0,t.jsx)("p",{className:"text-xs text-gray-500",children:j?"Bao gồm số lượng khán giả, lĩnh vực và lý do bạn phù hợp":"Lời nhắn tùy chọn gửi cho nhà cung cấp"})]}),d&&(0,t.jsxs)(D.Alert,{className:"border-red-500 bg-red-50 dark:bg-red-950",children:[(0,t.jsx)(E.AlertCircle,{className:"h-4 w-4 text-red-600"}),(0,t.jsx)(D.AlertDescription,{className:"text-red-800 dark:text-red-200",children:d})]}),(0,t.jsxs)(A.DialogFooter,{children:[(0,t.jsx)(l.Button,{type:"button",variant:"outline",onClick:y,disabled:f,children:"Hủy"}),(0,t.jsx)(l.Button,{type:"submit",disabled:f||"ACTIVE"!==e.status,children:f?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(w.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}),"Đang gửi..."]}):(0,t.jsx)(t.Fragment,{children:j?"Gửi đơn đăng ký":"Tham gia chiến dịch"})})]})]})]})})}function T({className:e=""}){let[a,N]=(0,s.useState)(""),[A,b]=(0,s.useState)("all"),[I,D]=(0,s.useState)("ACTIVE"),[E,w]=(0,s.useState)(null),[T,P]=(0,s.useState)(!1),{data:k,loading:S,refetch:$}=(0,i.useQuery)(C.GET_AFFILIATE_CAMPAIGNS,{variables:{search:{status:"all"!==I?I:void 0,page:1,size:50}}}),{data:F,refetch:_}=(0,i.useQuery)(C.GET_MY_CAMPAIGN_APPLICATIONS,{fetchPolicy:"cache-and-network"}),q=k?.affiliateCampaigns||[],L=F?.affiliateUser?.campaignJoins||[],U=new Map;L.forEach(e=>{U.set(e.campaign.id,e.status)});let G=q.filter(e=>{let t=e.name.toLowerCase().includes(a.toLowerCase())||e.description.toLowerCase().includes(a.toLowerCase()),s="all"===A||"percentage"===A&&"PERCENTAGE"===e.commissionType||"fixed"===A&&"FIXED"===e.commissionType;return t&&s});return S?(0,t.jsxs)("div",{className:`space-y-4 ${e}`,children:[(0,t.jsx)(d.Skeleton,{className:"h-12 w-full"}),(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:[1,2,3,4,5,6].map(e=>(0,t.jsx)(d.Skeleton,{className:"h-64"},e))})]}):(0,t.jsxs)("div",{className:`space-y-6 ${e}`,children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-3xl font-bold tracking-tight",children:"Chiến Dịch Affiliate"}),(0,t.jsx)("p",{className:"text-muted-foreground mt-2",children:"Khám phá và tham gia các chiến dịch phù hợp với đối tượng của bạn"})]}),(0,t.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4",children:[(0,t.jsxs)("div",{className:"relative flex-1",children:[(0,t.jsx)(m.Search,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"}),(0,t.jsx)(o.Input,{placeholder:"Tìm kiếm chiến dịch...",value:a,onChange:e=>N(e.target.value),className:"pl-10"})]}),(0,t.jsxs)(c.Select,{value:A,onValueChange:b,children:[(0,t.jsxs)(c.SelectTrigger,{className:"w-full sm:w-[180px]",children:[(0,t.jsx)(u.Filter,{className:"h-4 w-4 mr-2"}),(0,t.jsx)(c.SelectValue,{placeholder:"Loại hoa hồng"})]}),(0,t.jsxs)(c.SelectContent,{children:[(0,t.jsx)(c.SelectItem,{value:"all",children:"Tất cả"}),(0,t.jsx)(c.SelectItem,{value:"percentage",children:"Phần trăm"}),(0,t.jsx)(c.SelectItem,{value:"fixed",children:"Số tiền cố định"})]})]}),(0,t.jsxs)(c.Select,{value:I,onValueChange:D,children:[(0,t.jsx)(c.SelectTrigger,{className:"w-full sm:w-[180px]",children:(0,t.jsx)(c.SelectValue,{placeholder:"Trạng thái"})}),(0,t.jsxs)(c.SelectContent,{children:[(0,t.jsx)(c.SelectItem,{value:"all",children:"Tất cả"}),(0,t.jsx)(c.SelectItem,{value:"ACTIVE",children:"Đang hoạt động"}),(0,t.jsx)(c.SelectItem,{value:"PAUSED",children:"Tạm dừng"}),(0,t.jsx)(c.SelectItem,{value:"DRAFT",children:"Nháp"})]})]})]}),(0,t.jsxs)("div",{className:"text-sm text-gray-600 dark:text-gray-400",children:["Tìm thấy ",G.length," chiến dịch"]}),(0,t.jsx)("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:G.map(e=>{let a,s=(a=e.id,U.get(a)||null),i=!s&&"ACTIVE"===e.status;return(0,t.jsxs)(n.Card,{className:"flex flex-col hover:shadow-lg transition-shadow",children:[(0,t.jsxs)(n.CardHeader,{children:[(0,t.jsx)("div",{className:"flex items-start justify-between",children:(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)(n.CardTitle,{className:"text-xl mb-2",children:e.name}),(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-2",children:[(0,t.jsx)(r.Badge,{variant:"ACTIVE"===e.status?"default":"secondary",children:e.status}),(0,t.jsx)(r.Badge,{variant:"outline",children:e.type}),(e=>{if(!e)return null;let{icon:a,label:s,className:i}={PENDING:{icon:v.Clock,label:"Đang chờ",className:"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"},APPROVED:{icon:h.CheckCircle,label:"Đã tham gia",className:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"},REJECTED:{icon:y.XCircle,label:"Từ chối",className:"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}}[e];return(0,t.jsxs)(r.Badge,{className:i,children:[(0,t.jsx)(a,{className:"h-3 w-3 mr-1"}),s]})})(s)]})]})}),(0,t.jsx)(n.CardDescription,{className:"line-clamp-2",children:e.description})]}),(0,t.jsxs)(n.CardContent,{className:"flex-1 space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center text-2xl font-bold text-green-600 dark:text-green-400",children:[(0,t.jsx)(p.DollarSign,{className:"h-6 w-6 mr-1"}),"PERCENTAGE"===e.commissionType?`${e.commissionRate??0}%`:`${(e.fixedAmount??0).toLocaleString()} VND`,(0,t.jsx)("span",{className:"text-sm font-normal text-gray-600 dark:text-gray-400 ml-2",children:"mỗi đơn"})]}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4 text-sm",children:[(0,t.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,t.jsx)(g.Calendar,{className:"h-4 w-4 mr-2"}),(0,t.jsxs)("span",{children:[e.cookieDuration??0,"d cookie"]})]}),(0,t.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,t.jsx)(f.TrendingUp,{className:"h-4 w-4 mr-2"}),(0,t.jsxs)("span",{children:[(e.conversionRate??0).toFixed(2),"% CVR"]})]}),(0,t.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,t.jsx)(x.Users,{className:"h-4 w-4 mr-2"}),(0,t.jsxs)("span",{children:[e.totalConversions??0," đơn hàng"]})]}),(0,t.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,t.jsx)(j.Eye,{className:"h-4 w-4 mr-2"}),(0,t.jsxs)("span",{children:[e.totalClicks??0," lượt click"]})]})]}),(0,t.jsx)("div",{className:"flex gap-2 pt-2",children:i?(0,t.jsx)(l.Button,{onClick:()=>{w(e),P(!0)},className:"flex-1",children:"Tham gia chiến dịch"}):"APPROVED"===s?(0,t.jsxs)(l.Button,{variant:"outline",className:"flex-1",disabled:!0,children:[(0,t.jsx)(h.CheckCircle,{className:"h-4 w-4 mr-2"}),"Đã tham gia"]}):"PENDING"===s?(0,t.jsxs)(l.Button,{variant:"outline",className:"flex-1",disabled:!0,children:[(0,t.jsx)(v.Clock,{className:"h-4 w-4 mr-2"}),"Đang chờ duyệt"]}):"REJECTED"===s?(0,t.jsxs)(l.Button,{variant:"outline",className:"flex-1",disabled:!0,children:[(0,t.jsx)(y.XCircle,{className:"h-4 w-4 mr-2"}),"Đơn bị từ chối"]}):(0,t.jsx)(l.Button,{variant:"outline",className:"flex-1",disabled:!0,children:"Không khả dụng"})})]})]},e.id)})}),0===G.length&&(0,t.jsxs)("div",{className:"text-center py-12",children:[(0,t.jsx)(x.Users,{className:"h-12 w-12 text-gray-400 mx-auto mb-4"}),(0,t.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"Không tìm thấy chiến dịch"}),(0,t.jsx)("p",{className:"text-gray-600 dark:text-gray-400",children:"Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"})]}),(0,t.jsx)(R,{campaign:E,isOpen:T,onClose:()=>P(!1),onSuccess:()=>{_(),$()}})]})}function P(){return(0,t.jsx)(a.ProtectedRoute,{children:(0,t.jsx)("div",{className:"container mx-auto py-8 px-4",children:(0,t.jsx)(T,{})})})}e.s(["default",()=>P],182639)}]);