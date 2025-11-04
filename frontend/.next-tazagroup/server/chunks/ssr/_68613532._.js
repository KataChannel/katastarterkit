module.exports=[441405,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(372123),e=c.forwardRef((a,c)=>(0,b.jsx)(d.Primitive.label,{...a,ref:c,onMouseDown:b=>{b.target.closest("button, input, select, textarea")||(a.onMouseDown?.(b),!b.defaultPrevented&&b.detail>1&&b.preventDefault())}}));e.displayName="Label";var f=a.i(422171);function g({className:a,...c}){return(0,b.jsx)(e,{"data-slot":"label",className:(0,f.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",a),...c})}a.s(["Label",()=>g],441405)},466577,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("textarea",{className:(0,d.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:e,...c}));e.displayName="Textarea",a.s(["Textarea",()=>e])},242526,a=>{"use strict";var b=a.i(651332),c=a.i(572521),d=a.i(360507),e=a.i(694475),f=a.i(742053),g=a.i(549074),h=a.i(681498),i=a.i(247513),j=a.i(542226),k=a.i(660886),l=a.i(372123),m=a.i(707251),n=a.i(877457),o=a.i(466196),p=a.i(223904),q=a.i(321248),r="Dialog",[s,t]=(0,e.createContextScope)(r),[u,v]=s(r),w=a=>{let{__scopeDialog:c,children:d,open:e,defaultOpen:h,onOpenChange:i,modal:j=!0}=a,k=b.useRef(null),l=b.useRef(null),[m,n]=(0,g.useControllableState)({prop:e,defaultProp:h??!1,onChange:i,caller:r});return(0,q.jsx)(u,{scope:c,triggerRef:k,contentRef:l,contentId:(0,f.useId)(),titleId:(0,f.useId)(),descriptionId:(0,f.useId)(),open:m,onOpenChange:n,onOpenToggle:b.useCallback(()=>n(a=>!a),[n]),modal:j,children:d})};w.displayName=r;var x="DialogTrigger",y=b.forwardRef((a,b)=>{let{__scopeDialog:e,...f}=a,g=v(x,e),h=(0,d.useComposedRefs)(b,g.triggerRef);return(0,q.jsx)(l.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":g.open,"aria-controls":g.contentId,"data-state":S(g.open),...f,ref:h,onClick:(0,c.composeEventHandlers)(a.onClick,g.onOpenToggle)})});y.displayName=x;var z="DialogPortal",[A,B]=s(z,{forceMount:void 0}),C=a=>{let{__scopeDialog:c,forceMount:d,children:e,container:f}=a,g=v(z,c);return(0,q.jsx)(A,{scope:c,forceMount:d,children:b.Children.map(e,a=>(0,q.jsx)(k.Presence,{present:d||g.open,children:(0,q.jsx)(j.Portal,{asChild:!0,container:f,children:a})}))})};C.displayName=z;var D="DialogOverlay",E=b.forwardRef((a,b)=>{let c=B(D,a.__scopeDialog),{forceMount:d=c.forceMount,...e}=a,f=v(D,a.__scopeDialog);return f.modal?(0,q.jsx)(k.Presence,{present:d||f.open,children:(0,q.jsx)(G,{...e,ref:b})}):null});E.displayName=D;var F=(0,p.createSlot)("DialogOverlay.RemoveScroll"),G=b.forwardRef((a,b)=>{let{__scopeDialog:c,...d}=a,e=v(D,c);return(0,q.jsx)(n.RemoveScroll,{as:F,allowPinchZoom:!0,shards:[e.contentRef],children:(0,q.jsx)(l.Primitive.div,{"data-state":S(e.open),...d,ref:b,style:{pointerEvents:"auto",...d.style}})})}),H="DialogContent",I=b.forwardRef((a,b)=>{let c=B(H,a.__scopeDialog),{forceMount:d=c.forceMount,...e}=a,f=v(H,a.__scopeDialog);return(0,q.jsx)(k.Presence,{present:d||f.open,children:f.modal?(0,q.jsx)(J,{...e,ref:b}):(0,q.jsx)(K,{...e,ref:b})})});I.displayName=H;var J=b.forwardRef((a,e)=>{let f=v(H,a.__scopeDialog),g=b.useRef(null),h=(0,d.useComposedRefs)(e,f.contentRef,g);return b.useEffect(()=>{let a=g.current;if(a)return(0,o.hideOthers)(a)},[]),(0,q.jsx)(L,{...a,ref:h,trapFocus:f.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,c.composeEventHandlers)(a.onCloseAutoFocus,a=>{a.preventDefault(),f.triggerRef.current?.focus()}),onPointerDownOutside:(0,c.composeEventHandlers)(a.onPointerDownOutside,a=>{let b=a.detail.originalEvent,c=0===b.button&&!0===b.ctrlKey;(2===b.button||c)&&a.preventDefault()}),onFocusOutside:(0,c.composeEventHandlers)(a.onFocusOutside,a=>a.preventDefault())})}),K=b.forwardRef((a,c)=>{let d=v(H,a.__scopeDialog),e=b.useRef(!1),f=b.useRef(!1);return(0,q.jsx)(L,{...a,ref:c,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:b=>{a.onCloseAutoFocus?.(b),b.defaultPrevented||(e.current||d.triggerRef.current?.focus(),b.preventDefault()),e.current=!1,f.current=!1},onInteractOutside:b=>{a.onInteractOutside?.(b),b.defaultPrevented||(e.current=!0,"pointerdown"===b.detail.originalEvent.type&&(f.current=!0));let c=b.target;d.triggerRef.current?.contains(c)&&b.preventDefault(),"focusin"===b.detail.originalEvent.type&&f.current&&b.preventDefault()}})}),L=b.forwardRef((a,c)=>{let{__scopeDialog:e,trapFocus:f,onOpenAutoFocus:g,onCloseAutoFocus:j,...k}=a,l=v(H,e),n=b.useRef(null),o=(0,d.useComposedRefs)(c,n);return(0,m.useFocusGuards)(),(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(i.FocusScope,{asChild:!0,loop:!0,trapped:f,onMountAutoFocus:g,onUnmountAutoFocus:j,children:(0,q.jsx)(h.DismissableLayer,{role:"dialog",id:l.contentId,"aria-describedby":l.descriptionId,"aria-labelledby":l.titleId,"data-state":S(l.open),...k,ref:o,onDismiss:()=>l.onOpenChange(!1)})}),(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(W,{titleId:l.titleId}),(0,q.jsx)(X,{contentRef:n,descriptionId:l.descriptionId})]})]})}),M="DialogTitle",N=b.forwardRef((a,b)=>{let{__scopeDialog:c,...d}=a,e=v(M,c);return(0,q.jsx)(l.Primitive.h2,{id:e.titleId,...d,ref:b})});N.displayName=M;var O="DialogDescription",P=b.forwardRef((a,b)=>{let{__scopeDialog:c,...d}=a,e=v(O,c);return(0,q.jsx)(l.Primitive.p,{id:e.descriptionId,...d,ref:b})});P.displayName=O;var Q="DialogClose",R=b.forwardRef((a,b)=>{let{__scopeDialog:d,...e}=a,f=v(Q,d);return(0,q.jsx)(l.Primitive.button,{type:"button",...e,ref:b,onClick:(0,c.composeEventHandlers)(a.onClick,()=>f.onOpenChange(!1))})});function S(a){return a?"open":"closed"}R.displayName=Q;var T="DialogTitleWarning",[U,V]=(0,e.createContext)(T,{contentName:H,titleName:M,docsSlug:"dialog"}),W=({titleId:a})=>{let c=V(T),d=`\`${c.contentName}\` requires a \`${c.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${c.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${c.docsSlug}`;return b.useEffect(()=>{a&&(document.getElementById(a)||console.error(d))},[d,a]),null},X=({contentRef:a,descriptionId:c})=>{let d=V("DialogDescriptionWarning"),e=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${d.contentName}}.`;return b.useEffect(()=>{let b=a.current?.getAttribute("aria-describedby");c&&b&&(document.getElementById(c)||console.warn(e))},[e,a,c]),null};a.s(["Close",()=>R,"Content",()=>I,"Description",()=>P,"Overlay",()=>E,"Portal",()=>C,"Root",()=>w,"Title",()=>N,"Trigger",()=>y])},755820,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(242526),e=a.i(363615),f=a.i(422171);let g=d.Root,h=d.Trigger,i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Overlay,{ref:e,className:(0,f.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...c}));i.displayName=d.Overlay.displayName;let j=c.forwardRef(({className:a,children:c,...g},h)=>(0,b.jsxs)(d.Portal,{children:[(0,b.jsx)(i,{}),(0,b.jsxs)(d.Content,{ref:h,className:(0,f.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...g,children:[c,(0,b.jsxs)(d.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,b.jsx)(e.X,{className:"h-4 w-4"}),(0,b.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));j.displayName=d.Content.displayName;let k=({className:a,...c})=>(0,b.jsx)("div",{className:(0,f.cn)("flex flex-col space-y-1.5 text-center sm:text-left",a),...c});k.displayName="DialogHeader";let l=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Title,{ref:e,className:(0,f.cn)("text-lg font-semibold leading-none tracking-tight",a),...c}));l.displayName=d.Title.displayName;let m=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Description,{ref:e,className:(0,f.cn)("text-sm text-muted-foreground",a),...c}));m.displayName=d.Description.displayName;let n=({className:a,...c})=>(0,b.jsx)("div",{className:(0,f.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",a),...c});n.displayName="DialogFooter",a.s(["Dialog",()=>g,"DialogContent",()=>j,"DialogDescription",()=>m,"DialogFooter",()=>n,"DialogHeader",()=>k,"DialogTitle",()=>l,"DialogTrigger",()=>h])},411185,a=>{"use strict";var b=a.i(605751);a.s(["Clock",()=>b.default])},128348,a=>{"use strict";var b=a.i(722112);a.s(["Calendar",()=>b.default])},772451,a=>{"use strict";var b=a.i(321248);let c=a.i(651332).forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`animate-pulse rounded-md bg-gray-200 ${a||""}`,...c}));c.displayName="Skeleton",a.s(["Skeleton",()=>c])},140300,a=>{"use strict";var b=a.i(814588);a.s(["Mail",()=>b.default])},638735,a=>{"use strict";var b=a.i(273841);a.s(["MessageSquare",()=>b.default])},359379,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,role:"alert",className:(0,d.cn)("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",a),...c}));e.displayName="Alert";let f=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("text-sm [&_p]:leading-relaxed",a),...c}));f.displayName="AlertDescription",a.s(["Alert",()=>e,"AlertDescription",()=>f])},508335,a=>{"use strict";var b=a.i(681061);a.s(["CheckCircle",()=>b.default])},390874,a=>{"use strict";var b=a.i(889095);a.s(["XCircle",()=>b.default])},229371,a=>{"use strict";var b=a.i(772213);b.gql`
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
`,b.gql`
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
`,b.gql`
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
`;let c=b.gql`
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
`;b.gql`
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
`;let d=b.gql`
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
`,e=b.gql`
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
`,f=b.gql`
  mutation JoinCampaign($input: JoinCampaignInput!) {
    joinCampaign(input: $input)
  }
`,g=b.gql`
  mutation ReviewCampaignApplication($input: ReviewCampaignApplicationInput!) {
    reviewCampaignApplication(input: $input)
  }
`;b.gql`
  mutation DeleteAffiliateCampaign($id: String!) {
    deleteAffiliateCampaign(id: $id)
  }
`;let h=b.gql`
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
`,i=b.gql`
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
`,j=b.gql`
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
`,k=b.gql`
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
`;b.gql`
  query GetAffiliateConversions($search: AffConversionSearchInput) {
    affiliateConversions(search: $search)
  }
`;let l=b.gql`
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
`,m=b.gql`
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
`;b.gql`
  mutation ProcessPaymentRequest($id: String!, $status: String!) {
    processPaymentRequest(id: $id, status: $status) {
      id
      status
      processedAt
      transactionId
    }
  }
`;let n=b.gql`
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
`;a.s(["CREATE_AFFILIATE_CAMPAIGN",0,d,"CREATE_AFFILIATE_LINK",0,k,"CREATE_PAYMENT_REQUEST",0,m,"GET_AFFILIATE_CAMPAIGNS",0,c,"GET_AFFILIATE_EARNINGS_REPORT",0,n,"GET_AFFILIATE_LINKS",0,j,"GET_AFFILIATE_PAYMENT_REQUESTS",0,l,"GET_CAMPAIGN_APPLICATIONS",0,i,"GET_MY_CAMPAIGN_APPLICATIONS",0,h,"JOIN_CAMPAIGN",0,f,"REVIEW_CAMPAIGN_APPLICATION",0,g,"UPDATE_AFFILIATE_CAMPAIGN",0,e])},202076,a=>{"use strict";var b=a.i(497390);a.s(["Globe",()=>b.default])},588313,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(53627),e=a.i(40947);function f({children:a,fallback:f}){let{isAuthenticated:g,loading:h}=(0,e.useAuth)(),i=(0,d.useRouter)(),j=(0,d.usePathname)();return h?f||(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-gray-50",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"})}):((0,c.useEffect)(()=>{if(!g&&!h){let a=j||"/",b=`/login${"/"!==a?`?returnUrl=${encodeURIComponent(a)}`:""}`;i.push(b)}},[g,h,j,i]),g)?(0,b.jsx)(b.Fragment,{children:a}):null}a.s(["ProtectedRoute",()=>f])},863368,a=>{"use strict";var b=a.i(321248),c=a.i(53627),d=a.i(588313),e=a.i(651332),f=a.i(168918),g=a.i(8912),h=a.i(975780),i=a.i(293470),j=a.i(202979),k=a.i(441405),l=a.i(466577),m=a.i(251326),n=a.i(772451),o=a.i(755820),p=a.i(359379),q=a.i(508335),r=a.i(390874),s=a.i(411185),t=a.i(779149),u=a.i(202076),v=a.i(140300),w=a.i(128348),x=a.i(638735),y=a.i(733554),z=a.i(327987),A=a.i(229371);function B({campaignId:a,className:c=""}){let[d,B]=(0,e.useState)(null),[C,D]=(0,e.useState)("approved"),[E,F]=(0,e.useState)(""),[G,H]=(0,e.useState)(!1),[I,J]=(0,e.useState)(""),{data:K,loading:L,refetch:M}=(0,f.useQuery)(A.GET_CAMPAIGN_APPLICATIONS,{variables:{campaignId:a},skip:!a}),[N,{loading:O}]=(0,g.useMutation)(A.REVIEW_CAMPAIGN_APPLICATION,{onCompleted:()=>{H(!1),B(null),F(""),J(""),M()},onError:a=>{J(a.message||"Failed to review application")}}),P=K?.getAffiliateCampaign,Q=P?.affiliates||[],R=Q.filter(a=>"PENDING"===a.status),S=Q.filter(a=>"APPROVED"===a.status),T=Q.filter(a=>"REJECTED"===a.status),U=(a,b)=>{B(a),D(b),F(""),J(""),H(!0)},V=async()=>{if(d)try{await N({variables:{input:{applicationId:d.id,action:C,reason:E.trim()||void 0}}})}catch(a){}},W=a=>{let c="PENDING"===a.status,d="APPROVED"===a.status,e="REJECTED"===a.status;return(0,b.jsxs)(h.Card,{className:"hover:shadow-md transition-shadow",children:[(0,b.jsx)(h.CardHeader,{children:(0,b.jsxs)("div",{className:"flex items-start justify-between",children:[(0,b.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,b.jsxs)(m.Avatar,{className:"h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold",children:[a.affiliate.user.firstName[0],a.affiliate.user.lastName[0]]}),(0,b.jsxs)("div",{children:[(0,b.jsxs)(h.CardTitle,{className:"text-lg",children:[a.affiliate.user.firstName," ",a.affiliate.user.lastName]}),a.affiliate.businessName&&(0,b.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:a.affiliate.businessName})]})]}),(0,b.jsxs)(i.Badge,{className:c?"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":d?"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",children:[c?(0,b.jsx)(s.Clock,{className:"h-3 w-3 mr-1"}):d?(0,b.jsx)(q.CheckCircle,{className:"h-3 w-3 mr-1"}):(0,b.jsx)(r.XCircle,{className:"h-3 w-3 mr-1"}),a.status]})]})}),(0,b.jsxs)(h.CardContent,{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,b.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,b.jsx)(v.Mail,{className:"h-4 w-4 mr-2"}),(0,b.jsx)("span",{children:a.affiliate.user.email})]}),a.affiliate.website&&(0,b.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,b.jsx)(u.Globe,{className:"h-4 w-4 mr-2"}),(0,b.jsx)("a",{href:a.affiliate.website,target:"_blank",rel:"noopener noreferrer",className:"hover:underline text-blue-600 dark:text-blue-400",children:a.affiliate.website})]}),(0,b.jsxs)("div",{className:"flex items-center text-gray-600 dark:text-gray-400",children:[(0,b.jsx)(w.Calendar,{className:"h-4 w-4 mr-2"}),(0,b.jsxs)("span",{children:["Applied ",new Date(a.createdAt).toLocaleDateString()]})]})]}),a.message&&(0,b.jsxs)("div",{className:"bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border",children:[(0,b.jsxs)("div",{className:"flex items-start space-x-2 mb-2",children:[(0,b.jsx)(x.MessageSquare,{className:"h-4 w-4 text-gray-500 mt-0.5"}),(0,b.jsx)("span",{className:"text-sm font-medium",children:"Message:"})]}),(0,b.jsx)("p",{className:"text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap",children:a.message})]}),e&&a.reviewReason&&(0,b.jsxs)("div",{className:"bg-red-50 dark:bg-red-950 rounded-lg p-3 border border-red-200 dark:border-red-800",children:[(0,b.jsxs)("div",{className:"flex items-start space-x-2 mb-2",children:[(0,b.jsx)(r.XCircle,{className:"h-4 w-4 text-red-600 mt-0.5"}),(0,b.jsx)("span",{className:"text-sm font-medium text-red-800 dark:text-red-200",children:"Rejection Reason:"})]}),(0,b.jsx)("p",{className:"text-sm text-red-700 dark:text-red-300",children:a.reviewReason})]}),c&&(0,b.jsxs)("div",{className:"flex gap-2 pt-2",children:[(0,b.jsxs)(j.Button,{onClick:()=>U(a,"approved"),className:"flex-1 bg-green-600 hover:bg-green-700",children:[(0,b.jsx)(q.CheckCircle,{className:"h-4 w-4 mr-2"}),"Approve"]}),(0,b.jsxs)(j.Button,{onClick:()=>U(a,"rejected"),variant:"outline",className:"flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950",children:[(0,b.jsx)(r.XCircle,{className:"h-4 w-4 mr-2"}),"Reject"]})]})]})]},a.id)};return L?(0,b.jsx)("div",{className:`space-y-4 ${c}`,children:[1,2,3].map(a=>(0,b.jsx)(n.Skeleton,{className:"h-48"},a))}):(0,b.jsxs)("div",{className:`space-y-6 ${c}`,children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"text-2xl font-bold tracking-tight",children:"Application Review"}),(0,b.jsxs)("p",{className:"text-muted-foreground mt-2",children:[P?.name||"Campaign"," - Review and manage affiliate applications"]})]}),(0,b.jsxs)("div",{className:"grid gap-4 md:grid-cols-3",children:[(0,b.jsxs)(h.Card,{children:[(0,b.jsx)(h.CardHeader,{className:"pb-2",children:(0,b.jsx)(h.CardTitle,{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"Pending"})}),(0,b.jsx)(h.CardContent,{children:(0,b.jsx)("div",{className:"text-3xl font-bold text-yellow-600",children:R.length})})]}),(0,b.jsxs)(h.Card,{children:[(0,b.jsx)(h.CardHeader,{className:"pb-2",children:(0,b.jsx)(h.CardTitle,{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"Approved"})}),(0,b.jsx)(h.CardContent,{children:(0,b.jsx)("div",{className:"text-3xl font-bold text-green-600",children:S.length})})]}),(0,b.jsxs)(h.Card,{children:[(0,b.jsx)(h.CardHeader,{className:"pb-2",children:(0,b.jsx)(h.CardTitle,{className:"text-sm font-medium text-gray-600 dark:text-gray-400",children:"Rejected"})}),(0,b.jsx)(h.CardContent,{children:(0,b.jsx)("div",{className:"text-3xl font-bold text-red-600",children:T.length})})]})]}),R.length>0&&(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("h3",{className:"text-xl font-semibold",children:["Pending Applications (",R.length,")"]}),(0,b.jsx)("div",{className:"grid gap-4 md:grid-cols-2",children:R.map(W)})]}),S.length>0&&(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("h3",{className:"text-xl font-semibold",children:["Approved Affiliates (",S.length,")"]}),(0,b.jsx)("div",{className:"grid gap-4 md:grid-cols-2",children:S.map(W)})]}),T.length>0&&(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("h3",{className:"text-xl font-semibold",children:["Rejected Applications (",T.length,")"]}),(0,b.jsx)("div",{className:"grid gap-4 md:grid-cols-2",children:T.map(W)})]}),0===Q.length&&(0,b.jsxs)("div",{className:"text-center py-12",children:[(0,b.jsx)(t.User,{className:"h-12 w-12 text-gray-400 mx-auto mb-4"}),(0,b.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"No applications yet"}),(0,b.jsx)("p",{className:"text-gray-600 dark:text-gray-400",children:"Affiliates who apply to your campaign will appear here"})]}),(0,b.jsx)(o.Dialog,{open:G,onOpenChange:H,children:(0,b.jsxs)(o.DialogContent,{className:"sm:max-w-[500px]",children:[(0,b.jsxs)(o.DialogHeader,{children:[(0,b.jsx)(o.DialogTitle,{children:"approved"===C?"Approve Application":"Reject Application"}),(0,b.jsx)(o.DialogDescription,{children:d&&`${d.affiliate.user.firstName} ${d.affiliate.user.lastName}`})]}),(0,b.jsxs)("div",{className:"space-y-4",children:[d?.message&&(0,b.jsxs)("div",{className:"bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border",children:[(0,b.jsx)(k.Label,{className:"text-sm font-medium mb-2 block",children:"Their Message:"}),(0,b.jsx)("p",{className:"text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap",children:d.message})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)(k.Label,{htmlFor:"reviewReason",children:["approved"===C?"Approval Message":"Rejection Reason"," ","rejected"===C?"(Recommended)":"(Optional)"]}),(0,b.jsx)(l.Textarea,{id:"reviewReason",placeholder:"approved"===C?"Welcome message (optional)...":"Explain why this application was rejected...",value:E,onChange:a=>F(a.target.value),rows:4,className:"resize-none"})]}),I&&(0,b.jsxs)(p.Alert,{className:"border-red-500 bg-red-50 dark:bg-red-950",children:[(0,b.jsx)(z.AlertCircle,{className:"h-4 w-4 text-red-600"}),(0,b.jsx)(p.AlertDescription,{className:"text-red-800 dark:text-red-200",children:I})]})]}),(0,b.jsxs)(o.DialogFooter,{children:[(0,b.jsx)(j.Button,{type:"button",variant:"outline",onClick:()=>H(!1),disabled:O,children:"Cancel"}),(0,b.jsx)(j.Button,{type:"button",onClick:V,disabled:O,className:"approved"===C?"bg-green-600 hover:bg-green-700":"bg-red-600 hover:bg-red-700",children:O?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(y.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}),"Processing..."]}):"approved"===C?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(q.CheckCircle,{className:"mr-2 h-4 w-4"}),"Approve"]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(r.XCircle,{className:"mr-2 h-4 w-4"}),"Reject"]})})]})]})})]})}function C(){let a=(0,c.useParams)(),e=a?.id;return(0,b.jsx)(d.ProtectedRoute,{children:(0,b.jsx)("div",{className:"container mx-auto py-8 px-4",children:e?(0,b.jsx)(B,{campaignId:e}):(0,b.jsx)("div",{className:"text-center py-12",children:(0,b.jsx)("p",{className:"text-gray-600 dark:text-gray-400",children:"No campaign selected"})})})})}a.s(["default",()=>C],863368)}];

//# sourceMappingURL=_68613532._.js.map