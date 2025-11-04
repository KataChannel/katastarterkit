(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(873273),n=a.forwardRef((e,a)=>(0,t.jsx)(i.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));n.displayName="Label";var r=e.i(541428);function s({className:e,...a}){return(0,t.jsx)(n,{"data-slot":"label",className:(0,r.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>s],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(541428);let n=a.forwardRef(({className:e,...a},n)=>(0,t.jsx)("textarea",{className:(0,i.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:n,...a}));n.displayName="Textarea",e.s(["Textarea",()=>n])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),i=e.i(529590),n=e.i(403055),r=e.i(984804);let s=r.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,o=r.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,l=r.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,d=r.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,u=r.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,c=r.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,p=r.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,m=r.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,f=r.gql`
  mutation CreateMany(
    $model: String!
    $data: [JSON!]!
    $skipDuplicates: Boolean
  ) {
    createMany(
      model: $model
      data: $data
      skipDuplicates: $skipDuplicates
    )
  }
`,g=r.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,v=r.gql`
  mutation UpdateMany(
    $model: String!
    $where: JSON
    $data: JSON!
  ) {
    updateMany(
      model: $model
      where: $where
      data: $data
    )
  }
`,y=r.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,h=r.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,C=r.gql`
  mutation Upsert(
    $model: String!
    $where: JSON!
    $create: JSON!
    $update: JSON!
    $select: JSON
    $include: JSON
  ) {
    upsert(
      model: $model
      where: $where
      create: $create
      update: $update
      select: $select
      include: $include
    )
  }
`,N=r.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,A=r.gql`
  mutation ClearCache {
    clearCache
  }
`;function b(e,a,i){let n=!!localStorage.getItem("accessToken"),r=i?.skip||i?.requireAuth!==!1&&!n,{data:o,loading:l,error:d,refetch:u}=(0,t.useQuery)(s,{variables:{modelName:e,input:a||{}},skip:r,fetchPolicy:i?.fetchPolicy||"cache-and-network"});return{data:o?.findMany,loading:l,error:d,refetch:u}}function x(e,a,i,n){let r=!!localStorage.getItem("accessToken"),s="string"==typeof a?a:a?.id;s||n?.skip;let l=n?.skip||!s||n?.requireAuth!==!1&&!r,{data:d,loading:u,error:c,refetch:p}=(0,t.useQuery)(o,{variables:{modelName:e,input:{id:s||"",select:i?.select,include:i?.include}},skip:l});return{data:d?.findById,loading:u,error:c,refetch:p}}function $(e,a,i){let[r,s]=(0,n.useState)(a?.page||1),[o,l]=(0,n.useState)(a?.limit||10),u=!!localStorage.getItem("accessToken"),c=i?.skip||i?.requireAuth!==!1&&!u,{data:p,loading:m,error:f,refetch:g}=(0,t.useQuery)(d,{variables:{modelName:e,input:{page:r,limit:o,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:c,fetchPolicy:"cache-and-network"}),v=p?.findManyPaginated,y=(0,n.useCallback)(e=>{s(e)},[]),h=(0,n.useCallback)(()=>{v?.meta.hasNextPage&&s(e=>e+1)},[v]),C=(0,n.useCallback)(()=>{v?.meta.hasPrevPage&&s(e=>e-1)},[v]),N=(0,n.useCallback)(e=>{l(e),s(1)},[]);return{data:v?.data,meta:v?.meta,loading:m,error:f,refetch:g,page:r,limit:o,goToPage:y,nextPage:h,prevPage:C,changeLimit:N}}function w(e,a,i){let{data:n,loading:r,error:s,refetch:o}=(0,t.useQuery)(u,{variables:{modelName:e,where:a},skip:i?.skip});return{count:n?.count,loading:r,error:s,refetch:o}}function I(e,t){let[i,{data:r,loading:s,error:o}]=(0,a.useMutation)(m,{refetchQueries:t?.refetchQueries});return[(0,n.useCallback)(async t=>{let a=await i({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[i,e]),{data:r?.createOne,loading:s,error:o}]}function D(e,t){let[i,{data:r,loading:s,error:o}]=(0,a.useMutation)(g,{refetchQueries:t?.refetchQueries});return[(0,n.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let n=await i({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return n.data?.updateOne},[i,e]),{data:r?.updateOne,loading:s,error:o}]}function R(e,t){let[i,{data:r,loading:s,error:o}]=(0,a.useMutation)(y,{refetchQueries:t?.refetchQueries});return[(0,n.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let n=await i({variables:{modelName:e,input:{id:a,select:t.select}}});return n.data?.deleteOne},[i,e]),{data:r?.deleteOne,loading:s,error:o}]}function P(e){let t=(0,i.useApolloClient)(),[r,l]=I(e),[d,c]=function(e,t){let[i,{data:r,loading:s,error:o}]=(0,a.useMutation)(f,{refetchQueries:void 0});return[(0,n.useCallback)(async t=>{let a=await i({variables:{model:e,...t}});return a.data?.createMany},[i,e]),{data:r?.createMany,loading:s,error:o}]}(e),[p,m]=D(e),[g,y]=function(e,t){let[i,{data:r,loading:s,error:o}]=(0,a.useMutation)(v,{refetchQueries:void 0});return[(0,n.useCallback)(async t=>{let a=await i({variables:{model:e,...t}});return a.data?.updateMany},[i,e]),{data:r?.updateMany,loading:s,error:o}]}(e),[N,A]=R(e),[b,x]=function(e,t){let[i,{data:r,loading:s,error:o}]=(0,a.useMutation)(h,{refetchQueries:void 0});return[(0,n.useCallback)(async t=>{let a=await i({variables:{model:e,where:t}});return a.data?.deleteMany},[i,e]),{data:r?.deleteMany,loading:s,error:o}]}(e),[$,w]=function(e,t){let[i,{data:r,loading:s,error:o}]=(0,a.useMutation)(C,{refetchQueries:void 0});return[(0,n.useCallback)(async t=>{let a=await i({variables:{model:e,...t}});return a.data?.upsert},[i,e]),{data:r?.upsert,loading:s,error:o}]}(e),P=(0,n.useCallback)(async a=>(await t.query({query:s,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:P,findUnique:(0,n.useCallback)(async(a,i)=>(await t.query({query:o,variables:{model:e,where:a,...i},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,n.useCallback)(async a=>(await t.query({query:u,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:r,createMany:d,updateOne:p,updateMany:g,deleteOne:N,deleteMany:b,upsert:$,states:{createOne:l,createMany:c,updateOne:m,updateMany:y,deleteOne:A,deleteMany:x,upsert:w},loading:l.loading||c.loading||m.loading||y.loading||A.loading||x.loading||w.loading}}e.s(["AGGREGATE",0,c,"CLEAR_CACHE",0,A,"COUNT",0,u,"CREATE_MANY",0,f,"CREATE_ONE",0,m,"DELETE_MANY",0,h,"DELETE_ONE",0,y,"FIND_FIRST",0,l,"FIND_MANY",0,s,"FIND_MANY_PAGINATED",0,d,"FIND_UNIQUE",0,o,"GET_AVAILABLE_MODELS",0,N,"GROUP_BY",0,p,"UPDATE_MANY",0,v,"UPDATE_ONE",0,g,"UPSERT",0,C],272901),e.s(["useCRUD",()=>P,"useCount",()=>w,"useCreateOne",()=>I,"useDeleteOne",()=>R,"useFindMany",()=>b,"useFindManyPaginated",()=>$,"useFindUnique",()=>x,"useUpdateOne",()=>D],245421)},996517,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(119836),n=e.i(316618),r=e.i(377991),s=e.i(767478),o=e.i(873273),l=e.i(825198),d=e.i(346412),u=e.i(559663),c="Tabs",[p,m]=(0,n.createContextScope)(c,[r.createRovingFocusGroupScope]),f=(0,r.createRovingFocusGroupScope)(),[g,v]=p(c),y=a.forwardRef((e,a)=>{let{__scopeTabs:i,value:n,onValueChange:r,defaultValue:s,orientation:p="horizontal",dir:m,activationMode:f="automatic",...v}=e,y=(0,l.useDirection)(m),[h,C]=(0,d.useControllableState)({prop:n,onChange:r,defaultProp:s??"",caller:c});return(0,t.jsx)(g,{scope:i,baseId:(0,u.useId)(),value:h,onValueChange:C,orientation:p,dir:y,activationMode:f,children:(0,t.jsx)(o.Primitive.div,{dir:y,"data-orientation":p,...v,ref:a})})});y.displayName=c;var h="TabsList",C=a.forwardRef((e,a)=>{let{__scopeTabs:i,loop:n=!0,...s}=e,l=v(h,i),d=f(i);return(0,t.jsx)(r.Root,{asChild:!0,...d,orientation:l.orientation,dir:l.dir,loop:n,children:(0,t.jsx)(o.Primitive.div,{role:"tablist","aria-orientation":l.orientation,...s,ref:a})})});C.displayName=h;var N="TabsTrigger",A=a.forwardRef((e,a)=>{let{__scopeTabs:n,value:s,disabled:l=!1,...d}=e,u=v(N,n),c=f(n),p=$(u.baseId,s),m=w(u.baseId,s),g=s===u.value;return(0,t.jsx)(r.Item,{asChild:!0,...c,focusable:!l,active:g,children:(0,t.jsx)(o.Primitive.button,{type:"button",role:"tab","aria-selected":g,"aria-controls":m,"data-state":g?"active":"inactive","data-disabled":l?"":void 0,disabled:l,id:p,...d,ref:a,onMouseDown:(0,i.composeEventHandlers)(e.onMouseDown,e=>{l||0!==e.button||!1!==e.ctrlKey?e.preventDefault():u.onValueChange(s)}),onKeyDown:(0,i.composeEventHandlers)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&u.onValueChange(s)}),onFocus:(0,i.composeEventHandlers)(e.onFocus,()=>{let e="manual"!==u.activationMode;g||l||!e||u.onValueChange(s)})})})});A.displayName=N;var b="TabsContent",x=a.forwardRef((e,i)=>{let{__scopeTabs:n,value:r,forceMount:l,children:d,...u}=e,c=v(b,n),p=$(c.baseId,r),m=w(c.baseId,r),f=r===c.value,g=a.useRef(f);return a.useEffect(()=>{let e=requestAnimationFrame(()=>g.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,t.jsx)(s.Presence,{present:l||f,children:({present:a})=>(0,t.jsx)(o.Primitive.div,{"data-state":f?"active":"inactive","data-orientation":c.orientation,role:"tabpanel","aria-labelledby":p,hidden:!a,id:m,tabIndex:0,...u,ref:i,style:{...e.style,animationDuration:g.current?"0s":void 0},children:a&&d})})});function $(e,t){return`${e}-trigger-${t}`}function w(e,t){return`${e}-content-${t}`}x.displayName=b;var I=e.i(541428);let D=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(C,{ref:i,className:(0,I.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",e),...a}));D.displayName=C.displayName;let R=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(A,{ref:i,className:(0,I.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",e),...a}));R.displayName=A.displayName;let P=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(x,{ref:i,className:(0,I.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",e),...a}));P.displayName=x.displayName,e.s(["Tabs",()=>y,"TabsContent",()=>P,"TabsList",()=>D,"TabsTrigger",()=>R],996517)},965120,e=>{"use strict";var t=e.i(381299);e.s(["Edit",()=>t.default])},738543,e=>{"use strict";var t=e.i(507685);e.s(["BarChart3",()=>t.default])},868877,e=>{"use strict";var t=e.i(832481);e.s(["CreditCard",()=>t.default])},985937,e=>{"use strict";var t=e.i(134829);e.s(["Copy",()=>t.default])},236929,e=>{"use strict";var t=e.i(734694);e.s(["MousePointer",()=>t.default])},897711,e=>{"use strict";var t=e.i(980295);e.s(["Download",()=>t.default])},645030,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(316618),n=e.i(873273),r="Progress",[s,o]=(0,i.createContextScope)(r),[l,d]=s(r),u=a.forwardRef((e,a)=>{var i,r;let{__scopeProgress:s,value:o=null,max:d,getValueLabel:u=m,...c}=e;(d||0===d)&&!v(d)&&console.error((i=`${d}`,`Invalid prop \`max\` of value \`${i}\` supplied to \`Progress\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`));let p=v(d)?d:100;null===o||y(o,p)||console.error((r=`${o}`,`Invalid prop \`value\` of value \`${r}\` supplied to \`Progress\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`));let h=y(o,p)?o:null,C=g(h)?u(h,p):void 0;return(0,t.jsx)(l,{scope:s,value:h,max:p,children:(0,t.jsx)(n.Primitive.div,{"aria-valuemax":p,"aria-valuemin":0,"aria-valuenow":g(h)?h:void 0,"aria-valuetext":C,role:"progressbar","data-state":f(h,p),"data-value":h??void 0,"data-max":p,...c,ref:a})})});u.displayName=r;var c="ProgressIndicator",p=a.forwardRef((e,a)=>{let{__scopeProgress:i,...r}=e,s=d(c,i);return(0,t.jsx)(n.Primitive.div,{"data-state":f(s.value,s.max),"data-value":s.value??void 0,"data-max":s.max,...r,ref:a})});function m(e,t){return`${Math.round(e/t*100)}%`}function f(e,t){return null==e?"indeterminate":e===t?"complete":"loading"}function g(e){return"number"==typeof e}function v(e){return g(e)&&!isNaN(e)&&e>0}function y(e,t){return g(e)&&!isNaN(e)&&e<=t&&e>=0}p.displayName=c;var h=e.i(541428);let C=a.forwardRef(({className:e,value:a,indicatorClassName:i,...n},r)=>(0,t.jsx)(u,{ref:r,className:(0,h.cn)("relative h-4 w-full overflow-hidden rounded-full bg-secondary",e),...n,children:(0,t.jsx)(p,{className:(0,h.cn)("h-full w-full flex-1 bg-primary transition-all",i),style:{transform:`translateX(-${100-(a||0)}%)`}})}));C.displayName=u.displayName,e.s(["Progress",()=>C],645030)},495047,e=>{"use strict";var t=e.i(115982);e.s(["Link2",()=>t.default])},578078,e=>{"use strict";var t=e.i(79308);e.s(["ExternalLink",()=>t.default])},415733,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(541428);let n=a.forwardRef(({className:e,...a},n)=>(0,t.jsx)("div",{ref:n,role:"alert",className:(0,i.cn)("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",e),...a}));n.displayName="Alert";let r=a.forwardRef(({className:e,...a},n)=>(0,t.jsx)("div",{ref:n,className:(0,i.cn)("text-sm [&_p]:leading-relaxed",e),...a}));r.displayName="AlertDescription",e.s(["Alert",()=>n,"AlertDescription",()=>r])},129376,e=>{"use strict";var t=e.i(984804);t.gql`
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
`;let i=t.gql`
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
`,n=t.gql`
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
`,s=t.gql`
  mutation ReviewCampaignApplication($input: ReviewCampaignApplicationInput!) {
    reviewCampaignApplication(input: $input)
  }
`;t.gql`
  mutation DeleteAffiliateCampaign($id: String!) {
    deleteAffiliateCampaign(id: $id)
  }
`;let o=t.gql`
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
`,l=t.gql`
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
`,u=t.gql`
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
`;let c=t.gql`
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
`;let m=t.gql`
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
`;e.s(["CREATE_AFFILIATE_CAMPAIGN",0,i,"CREATE_AFFILIATE_LINK",0,u,"CREATE_PAYMENT_REQUEST",0,p,"GET_AFFILIATE_CAMPAIGNS",0,a,"GET_AFFILIATE_EARNINGS_REPORT",0,m,"GET_AFFILIATE_LINKS",0,d,"GET_AFFILIATE_PAYMENT_REQUESTS",0,c,"GET_CAMPAIGN_APPLICATIONS",0,l,"GET_MY_CAMPAIGN_APPLICATIONS",0,o,"JOIN_CAMPAIGN",0,r,"REVIEW_CAMPAIGN_APPLICATION",0,s,"UPDATE_AFFILIATE_CAMPAIGN",0,n])},649248,e=>{"use strict";var t=e.i(336613);e.s(["DollarSign",()=>t.default])},822390,e=>{"use strict";var t=e.i(621924);e.s(["CheckCircle",()=>t.default])},257117,e=>{"use strict";var t=e.i(838049);e.s(["XCircle",()=>t.default])},415588,e=>{"use strict";var t=e.i(638381);e.s(["Clock",()=>t.default])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},580523,e=>{"use strict";var t=e.i(403055),a=e.i(119836),i=e.i(569658),n=e.i(316618),r=e.i(559663),s=e.i(346412),o=e.i(430840),l=e.i(621829),d=e.i(581263),u=e.i(767478),c=e.i(873273),p=e.i(767835),m=e.i(896438),f=e.i(739045),g=e.i(599488),v=e.i(44990),y="Dialog",[h,C]=(0,n.createContextScope)(y),[N,A]=h(y),b=e=>{let{__scopeDialog:a,children:i,open:n,defaultOpen:o,onOpenChange:l,modal:d=!0}=e,u=t.useRef(null),c=t.useRef(null),[p,m]=(0,s.useControllableState)({prop:n,defaultProp:o??!1,onChange:l,caller:y});return(0,v.jsx)(N,{scope:a,triggerRef:u,contentRef:c,contentId:(0,r.useId)(),titleId:(0,r.useId)(),descriptionId:(0,r.useId)(),open:p,onOpenChange:m,onOpenToggle:t.useCallback(()=>m(e=>!e),[m]),modal:d,children:i})};b.displayName=y;var x="DialogTrigger",$=t.forwardRef((e,t)=>{let{__scopeDialog:n,...r}=e,s=A(x,n),o=(0,i.useComposedRefs)(t,s.triggerRef);return(0,v.jsx)(c.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":s.open,"aria-controls":s.contentId,"data-state":B(s.open),...r,ref:o,onClick:(0,a.composeEventHandlers)(e.onClick,s.onOpenToggle)})});$.displayName=x;var w="DialogPortal",[I,D]=h(w,{forceMount:void 0}),R=e=>{let{__scopeDialog:a,forceMount:i,children:n,container:r}=e,s=A(w,a);return(0,v.jsx)(I,{scope:a,forceMount:i,children:t.Children.map(n,e=>(0,v.jsx)(u.Presence,{present:i||s.open,children:(0,v.jsx)(d.Portal,{asChild:!0,container:r,children:e})}))})};R.displayName=w;var P="DialogOverlay",E=t.forwardRef((e,t)=>{let a=D(P,e.__scopeDialog),{forceMount:i=a.forceMount,...n}=e,r=A(P,e.__scopeDialog);return r.modal?(0,v.jsx)(u.Presence,{present:i||r.open,children:(0,v.jsx)(q,{...n,ref:t})}):null});E.displayName=P;var T=(0,g.createSlot)("DialogOverlay.RemoveScroll"),q=t.forwardRef((e,t)=>{let{__scopeDialog:a,...i}=e,n=A(P,a);return(0,v.jsx)(m.RemoveScroll,{as:T,allowPinchZoom:!0,shards:[n.contentRef],children:(0,v.jsx)(c.Primitive.div,{"data-state":B(n.open),...i,ref:t,style:{pointerEvents:"auto",...i.style}})})}),M="DialogContent",j=t.forwardRef((e,t)=>{let a=D(M,e.__scopeDialog),{forceMount:i=a.forceMount,...n}=e,r=A(M,e.__scopeDialog);return(0,v.jsx)(u.Presence,{present:i||r.open,children:r.modal?(0,v.jsx)(S,{...n,ref:t}):(0,v.jsx)(O,{...n,ref:t})})});j.displayName=M;var S=t.forwardRef((e,n)=>{let r=A(M,e.__scopeDialog),s=t.useRef(null),o=(0,i.useComposedRefs)(n,r.contentRef,s);return t.useEffect(()=>{let e=s.current;if(e)return(0,f.hideOthers)(e)},[]),(0,v.jsx)(k,{...e,ref:o,trapFocus:r.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,a.composeEventHandlers)(e.onCloseAutoFocus,e=>{e.preventDefault(),r.triggerRef.current?.focus()}),onPointerDownOutside:(0,a.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,a=0===t.button&&!0===t.ctrlKey;(2===t.button||a)&&e.preventDefault()}),onFocusOutside:(0,a.composeEventHandlers)(e.onFocusOutside,e=>e.preventDefault())})}),O=t.forwardRef((e,a)=>{let i=A(M,e.__scopeDialog),n=t.useRef(!1),r=t.useRef(!1);return(0,v.jsx)(k,{...e,ref:a,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(n.current||i.triggerRef.current?.focus(),t.preventDefault()),n.current=!1,r.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(n.current=!0,"pointerdown"===t.detail.originalEvent.type&&(r.current=!0));let a=t.target;i.triggerRef.current?.contains(a)&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&r.current&&t.preventDefault()}})}),k=t.forwardRef((e,a)=>{let{__scopeDialog:n,trapFocus:r,onOpenAutoFocus:s,onCloseAutoFocus:d,...u}=e,c=A(M,n),m=t.useRef(null),f=(0,i.useComposedRefs)(a,m);return(0,p.useFocusGuards)(),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(l.FocusScope,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:s,onUnmountAutoFocus:d,children:(0,v.jsx)(o.DismissableLayer,{role:"dialog",id:c.contentId,"aria-describedby":c.descriptionId,"aria-labelledby":c.titleId,"data-state":B(c.open),...u,ref:f,onDismiss:()=>c.onOpenChange(!1)})}),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(Y,{titleId:c.titleId}),(0,v.jsx)(K,{contentRef:m,descriptionId:c.descriptionId})]})]})}),F="DialogTitle",_=t.forwardRef((e,t)=>{let{__scopeDialog:a,...i}=e,n=A(F,a);return(0,v.jsx)(c.Primitive.h2,{id:n.titleId,...i,ref:t})});_.displayName=F;var U="DialogDescription",G=t.forwardRef((e,t)=>{let{__scopeDialog:a,...i}=e,n=A(U,a);return(0,v.jsx)(c.Primitive.p,{id:n.descriptionId,...i,ref:t})});G.displayName=U;var L="DialogClose",Q=t.forwardRef((e,t)=>{let{__scopeDialog:i,...n}=e,r=A(L,i);return(0,v.jsx)(c.Primitive.button,{type:"button",...n,ref:t,onClick:(0,a.composeEventHandlers)(e.onClick,()=>r.onOpenChange(!1))})});function B(e){return e?"open":"closed"}Q.displayName=L;var J="DialogTitleWarning",[H,V]=(0,n.createContext)(J,{contentName:M,titleName:F,docsSlug:"dialog"}),Y=({titleId:e})=>{let a=V(J),i=`\`${a.contentName}\` requires a \`${a.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${a.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${a.docsSlug}`;return t.useEffect(()=>{e&&(document.getElementById(e)||console.error(i))},[i,e]),null},K=({contentRef:e,descriptionId:a})=>{let i=V("DialogDescriptionWarning"),n=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${i.contentName}}.`;return t.useEffect(()=>{let t=e.current?.getAttribute("aria-describedby");a&&t&&(document.getElementById(a)||console.warn(n))},[n,e,a]),null};e.s(["Close",()=>Q,"Content",()=>j,"Description",()=>G,"Overlay",()=>E,"Portal",()=>R,"Root",()=>b,"Title",()=>_,"Trigger",()=>$])},137651,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(580523),n=e.i(888540),r=e.i(541428);let s=i.Root,o=i.Trigger,l=a.forwardRef(({className:e,...a},n)=>(0,t.jsx)(i.Overlay,{ref:n,className:(0,r.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...a}));l.displayName=i.Overlay.displayName;let d=a.forwardRef(({className:e,children:a,...s},o)=>(0,t.jsxs)(i.Portal,{children:[(0,t.jsx)(l,{}),(0,t.jsxs)(i.Content,{ref:o,className:(0,r.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...s,children:[a,(0,t.jsxs)(i.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,t.jsx)(n.X,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));d.displayName=i.Content.displayName;let u=({className:e,...a})=>(0,t.jsx)("div",{className:(0,r.cn)("flex flex-col space-y-1.5 text-center sm:text-left",e),...a});u.displayName="DialogHeader";let c=a.forwardRef(({className:e,...a},n)=>(0,t.jsx)(i.Title,{ref:n,className:(0,r.cn)("text-lg font-semibold leading-none tracking-tight",e),...a}));c.displayName=i.Title.displayName;let p=a.forwardRef(({className:e,...a},n)=>(0,t.jsx)(i.Description,{ref:n,className:(0,r.cn)("text-sm text-muted-foreground",e),...a}));p.displayName=i.Description.displayName;let m=({className:e,...a})=>(0,t.jsx)("div",{className:(0,r.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...a});m.displayName="DialogFooter",e.s(["Dialog",()=>s,"DialogContent",()=>d,"DialogDescription",()=>p,"DialogFooter",()=>m,"DialogHeader",()=>u,"DialogTitle",()=>c,"DialogTrigger",()=>o])},173416,e=>{"use strict";var t=e.i(46034);e.s(["Filter",()=>t.default])},289795,e=>{"use strict";var t=e.i(25366);e.s(["PaymentManagement",()=>t.default])},421307,e=>{"use strict";var t=e.i(44990),a=e.i(775680);e.i(457439);var i=e.i(289795);function n(){return(0,t.jsxs)("div",{className:"container mx-auto px-6 py-8",children:[(0,t.jsxs)("div",{className:"mb-8",children:[(0,t.jsx)("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Quản Lý Thanh Toán"}),(0,t.jsx)("p",{className:"text-gray-600 dark:text-gray-400 mt-2",children:"Theo dõi thu nhập, quản lý yêu cầu thanh toán và xem lịch sử thanh toán"})]}),(0,t.jsxs)(a.Card,{children:[(0,t.jsxs)(a.CardHeader,{children:[(0,t.jsx)(a.CardTitle,{children:"Thu Nhập & Thanh Toán"}),(0,t.jsx)(a.CardDescription,{children:"Giám sát thu nhập hoa hồng, yêu cầu thanh toán và quản lý phương thức thanh toán"})]}),(0,t.jsx)(a.CardContent,{children:(0,t.jsx)(i.PaymentManagement,{})})]})]})}e.s(["default",()=>n])}]);