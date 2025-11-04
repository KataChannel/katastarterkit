(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(873273),r=a.forwardRef((e,a)=>(0,t.jsx)(i.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));r.displayName="Label";var s=e.i(541428);function n({className:e,...a}){return(0,t.jsx)(r,{"data-slot":"label",className:(0,s.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>n],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(541428);let r=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)("textarea",{className:(0,i.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:r,...a}));r.displayName="Textarea",e.s(["Textarea",()=>r])},245421,272901,e=>{"use strict";e.i(308140);var t=e.i(429105),a=e.i(950988),i=e.i(529590),r=e.i(403055),s=e.i(984804);let n=s.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,l=s.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,o=s.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,d=s.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,c=s.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,u=s.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,p=s.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,m=s.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,f=s.gql`
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
`,h=s.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,y=s.gql`
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
`,g=s.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,b=s.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,v=s.gql`
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
`,x=s.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,N=s.gql`
  mutation ClearCache {
    clearCache
  }
`;function w(e,a,i){let r=!!localStorage.getItem("accessToken"),s=i?.skip||i?.requireAuth!==!1&&!r,{data:l,loading:o,error:d,refetch:c}=(0,t.useQuery)(n,{variables:{modelName:e,input:a||{}},skip:s,fetchPolicy:i?.fetchPolicy||"cache-and-network"});return{data:l?.findMany,loading:o,error:d,refetch:c}}function C(e,a,i,r){let s=!!localStorage.getItem("accessToken"),n="string"==typeof a?a:a?.id;n||r?.skip;let o=r?.skip||!n||r?.requireAuth!==!1&&!s,{data:d,loading:c,error:u,refetch:p}=(0,t.useQuery)(l,{variables:{modelName:e,input:{id:n||"",select:i?.select,include:i?.include}},skip:o});return{data:d?.findById,loading:c,error:u,refetch:p}}function j(e,a,i){let[s,n]=(0,r.useState)(a?.page||1),[l,o]=(0,r.useState)(a?.limit||10),c=!!localStorage.getItem("accessToken"),u=i?.skip||i?.requireAuth!==!1&&!c,{data:p,loading:m,error:f,refetch:h}=(0,t.useQuery)(d,{variables:{modelName:e,input:{page:s,limit:l,where:a?.where,orderBy:a?.orderBy,select:a?.select,include:a?.include}},skip:u,fetchPolicy:"cache-and-network"}),y=p?.findManyPaginated,g=(0,r.useCallback)(e=>{n(e)},[]),b=(0,r.useCallback)(()=>{y?.meta.hasNextPage&&n(e=>e+1)},[y]),v=(0,r.useCallback)(()=>{y?.meta.hasPrevPage&&n(e=>e-1)},[y]),x=(0,r.useCallback)(e=>{o(e),n(1)},[]);return{data:y?.data,meta:y?.meta,loading:m,error:f,refetch:h,page:s,limit:l,goToPage:g,nextPage:b,prevPage:v,changeLimit:x}}function k(e,a,i){let{data:r,loading:s,error:n,refetch:l}=(0,t.useQuery)(c,{variables:{modelName:e,where:a},skip:i?.skip});return{count:r?.count,loading:s,error:n,refetch:l}}function S(e,t){let[i,{data:s,loading:n,error:l}]=(0,a.useMutation)(m,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a=await i({variables:{modelName:e,input:{data:t.data,select:t.select,include:t.include}}});return a.data?.createOne},[i,e]),{data:s?.createOne,loading:n,error:l}]}function $(e,t){let[i,{data:s,loading:n,error:l}]=(0,a.useMutation)(h,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let r=await i({variables:{modelName:e,input:{id:a,data:t.data,select:t.select,include:t.include}}});return r.data?.updateOne},[i,e]),{data:s?.updateOne,loading:n,error:l}]}function O(e,t){let[i,{data:s,loading:n,error:l}]=(0,a.useMutation)(g,{refetchQueries:t?.refetchQueries});return[(0,r.useCallback)(async t=>{let a="string"==typeof t.where?t.where:t.where?.id;if(!a)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let r=await i({variables:{modelName:e,input:{id:a,select:t.select}}});return r.data?.deleteOne},[i,e]),{data:s?.deleteOne,loading:n,error:l}]}function E(e){let t=(0,i.useApolloClient)(),[s,o]=S(e),[d,u]=function(e,t){let[i,{data:s,loading:n,error:l}]=(0,a.useMutation)(f,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await i({variables:{model:e,...t}});return a.data?.createMany},[i,e]),{data:s?.createMany,loading:n,error:l}]}(e),[p,m]=$(e),[h,g]=function(e,t){let[i,{data:s,loading:n,error:l}]=(0,a.useMutation)(y,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await i({variables:{model:e,...t}});return a.data?.updateMany},[i,e]),{data:s?.updateMany,loading:n,error:l}]}(e),[x,N]=O(e),[w,C]=function(e,t){let[i,{data:s,loading:n,error:l}]=(0,a.useMutation)(b,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await i({variables:{model:e,where:t}});return a.data?.deleteMany},[i,e]),{data:s?.deleteMany,loading:n,error:l}]}(e),[j,k]=function(e,t){let[i,{data:s,loading:n,error:l}]=(0,a.useMutation)(v,{refetchQueries:void 0});return[(0,r.useCallback)(async t=>{let a=await i({variables:{model:e,...t}});return a.data?.upsert},[i,e]),{data:s?.upsert,loading:n,error:l}]}(e),E=(0,r.useCallback)(async a=>(await t.query({query:n,variables:{model:e,...a},fetchPolicy:"network-only"})).data.findMany,[t,e]);return{findMany:E,findUnique:(0,r.useCallback)(async(a,i)=>(await t.query({query:l,variables:{model:e,where:a,...i},fetchPolicy:"network-only"})).data.findUnique,[t,e]),count:(0,r.useCallback)(async a=>(await t.query({query:c,variables:{model:e,where:a},fetchPolicy:"network-only"})).data.count,[t,e]),createOne:s,createMany:d,updateOne:p,updateMany:h,deleteOne:x,deleteMany:w,upsert:j,states:{createOne:o,createMany:u,updateOne:m,updateMany:g,deleteOne:N,deleteMany:C,upsert:k},loading:o.loading||u.loading||m.loading||g.loading||N.loading||C.loading||k.loading}}e.s(["AGGREGATE",0,u,"CLEAR_CACHE",0,N,"COUNT",0,c,"CREATE_MANY",0,f,"CREATE_ONE",0,m,"DELETE_MANY",0,b,"DELETE_ONE",0,g,"FIND_FIRST",0,o,"FIND_MANY",0,n,"FIND_MANY_PAGINATED",0,d,"FIND_UNIQUE",0,l,"GET_AVAILABLE_MODELS",0,x,"GROUP_BY",0,p,"UPDATE_MANY",0,y,"UPDATE_ONE",0,h,"UPSERT",0,v],272901),e.s(["useCRUD",()=>E,"useCount",()=>k,"useCreateOne",()=>S,"useDeleteOne",()=>O,"useFindMany",()=>w,"useFindManyPaginated",()=>j,"useFindUnique",()=>C,"useUpdateOne",()=>$],245421)},996517,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(119836),r=e.i(316618),s=e.i(377991),n=e.i(767478),l=e.i(873273),o=e.i(825198),d=e.i(346412),c=e.i(559663),u="Tabs",[p,m]=(0,r.createContextScope)(u,[s.createRovingFocusGroupScope]),f=(0,s.createRovingFocusGroupScope)(),[h,y]=p(u),g=a.forwardRef((e,a)=>{let{__scopeTabs:i,value:r,onValueChange:s,defaultValue:n,orientation:p="horizontal",dir:m,activationMode:f="automatic",...y}=e,g=(0,o.useDirection)(m),[b,v]=(0,d.useControllableState)({prop:r,onChange:s,defaultProp:n??"",caller:u});return(0,t.jsx)(h,{scope:i,baseId:(0,c.useId)(),value:b,onValueChange:v,orientation:p,dir:g,activationMode:f,children:(0,t.jsx)(l.Primitive.div,{dir:g,"data-orientation":p,...y,ref:a})})});g.displayName=u;var b="TabsList",v=a.forwardRef((e,a)=>{let{__scopeTabs:i,loop:r=!0,...n}=e,o=y(b,i),d=f(i);return(0,t.jsx)(s.Root,{asChild:!0,...d,orientation:o.orientation,dir:o.dir,loop:r,children:(0,t.jsx)(l.Primitive.div,{role:"tablist","aria-orientation":o.orientation,...n,ref:a})})});v.displayName=b;var x="TabsTrigger",N=a.forwardRef((e,a)=>{let{__scopeTabs:r,value:n,disabled:o=!1,...d}=e,c=y(x,r),u=f(r),p=j(c.baseId,n),m=k(c.baseId,n),h=n===c.value;return(0,t.jsx)(s.Item,{asChild:!0,...u,focusable:!o,active:h,children:(0,t.jsx)(l.Primitive.button,{type:"button",role:"tab","aria-selected":h,"aria-controls":m,"data-state":h?"active":"inactive","data-disabled":o?"":void 0,disabled:o,id:p,...d,ref:a,onMouseDown:(0,i.composeEventHandlers)(e.onMouseDown,e=>{o||0!==e.button||!1!==e.ctrlKey?e.preventDefault():c.onValueChange(n)}),onKeyDown:(0,i.composeEventHandlers)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&c.onValueChange(n)}),onFocus:(0,i.composeEventHandlers)(e.onFocus,()=>{let e="manual"!==c.activationMode;h||o||!e||c.onValueChange(n)})})})});N.displayName=x;var w="TabsContent",C=a.forwardRef((e,i)=>{let{__scopeTabs:r,value:s,forceMount:o,children:d,...c}=e,u=y(w,r),p=j(u.baseId,s),m=k(u.baseId,s),f=s===u.value,h=a.useRef(f);return a.useEffect(()=>{let e=requestAnimationFrame(()=>h.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,t.jsx)(n.Presence,{present:o||f,children:({present:a})=>(0,t.jsx)(l.Primitive.div,{"data-state":f?"active":"inactive","data-orientation":u.orientation,role:"tabpanel","aria-labelledby":p,hidden:!a,id:m,tabIndex:0,...c,ref:i,style:{...e.style,animationDuration:h.current?"0s":void 0},children:a&&d})})});function j(e,t){return`${e}-trigger-${t}`}function k(e,t){return`${e}-content-${t}`}C.displayName=w;var S=e.i(541428);let $=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(v,{ref:i,className:(0,S.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",e),...a}));$.displayName=v.displayName;let O=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(N,{ref:i,className:(0,S.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",e),...a}));O.displayName=N.displayName;let E=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(C,{ref:i,className:(0,S.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",e),...a}));E.displayName=C.displayName,e.s(["Tabs",()=>g,"TabsContent",()=>E,"TabsList",()=>$,"TabsTrigger",()=>O],996517)},553082,e=>{"use strict";var t=e.i(813046);e.s(["Save",()=>t.default])},825098,e=>{"use strict";var t=e.i(555234);e.s(["Mail",()=>t.default])},791174,e=>{"use strict";var t=e.i(833350);e.s(["RefreshCw",()=>t.default])},276664,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(119836),r=e.i(569658),s=e.i(316618),n=e.i(346412),l=e.i(139540),o=e.i(471203),d=e.i(873273),c="Switch",[u,p]=(0,s.createContextScope)(c),[m,f]=u(c),h=a.forwardRef((e,s)=>{let{__scopeSwitch:l,name:o,checked:u,defaultChecked:p,required:f,disabled:h,value:y="on",onCheckedChange:g,form:x,...N}=e,[w,C]=a.useState(null),j=(0,r.useComposedRefs)(s,e=>C(e)),k=a.useRef(!1),S=!w||x||!!w.closest("form"),[$,O]=(0,n.useControllableState)({prop:u,defaultProp:p??!1,onChange:g,caller:c});return(0,t.jsxs)(m,{scope:l,checked:$,disabled:h,children:[(0,t.jsx)(d.Primitive.button,{type:"button",role:"switch","aria-checked":$,"aria-required":f,"data-state":v($),"data-disabled":h?"":void 0,disabled:h,value:y,...N,ref:j,onClick:(0,i.composeEventHandlers)(e.onClick,e=>{O(e=>!e),S&&(k.current=e.isPropagationStopped(),k.current||e.stopPropagation())})}),S&&(0,t.jsx)(b,{control:w,bubbles:!k.current,name:o,value:y,checked:$,required:f,disabled:h,form:x,style:{transform:"translateX(-100%)"}})]})});h.displayName=c;var y="SwitchThumb",g=a.forwardRef((e,a)=>{let{__scopeSwitch:i,...r}=e,s=f(y,i);return(0,t.jsx)(d.Primitive.span,{"data-state":v(s.checked),"data-disabled":s.disabled?"":void 0,...r,ref:a})});g.displayName=y;var b=a.forwardRef(({__scopeSwitch:e,control:i,checked:s,bubbles:n=!0,...d},c)=>{let u=a.useRef(null),p=(0,r.useComposedRefs)(u,c),m=(0,l.usePrevious)(s),f=(0,o.useSize)(i);return a.useEffect(()=>{let e=u.current;if(!e)return;let t=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(m!==s&&t){let a=new Event("click",{bubbles:n});t.call(e,s),e.dispatchEvent(a)}},[m,s,n]),(0,t.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:s,...d,tabIndex:-1,ref:p,style:{...d.style,...f,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});function v(e){return e?"checked":"unchecked"}b.displayName="SwitchBubbleInput";var x=e.i(541428);let N=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(h,{className:(0,x.cn)("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",e),...a,ref:i,children:(0,t.jsx)(g,{className:(0,x.cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})}));N.displayName=h.displayName,e.s(["Switch",()=>N],276664)},495280,e=>{"use strict";var t=e.i(46213);e.s(["MessageSquare",()=>t.default])},68645,e=>{"use strict";var t=e.i(20865);e.s(["Shield",()=>t.default])},660179,e=>{"use strict";var t=e.i(519926);e.s(["EyeOff",()=>t.default])},564216,e=>{"use strict";var t=e.i(794730);e.s(["Globe",()=>t.default])},591079,e=>{"use strict";var t=e.i(120018);e.s(["Layout",()=>t.default])},248468,e=>{"use strict";var t=e.i(748871);e.s(["BarChart",()=>t.default])},223269,e=>{"use strict";var t=e.i(44990),a=e.i(403055),i=e.i(245421),r=e.i(775680),s=e.i(996517),n=e.i(696134),l=e.i(600547),o=e.i(165429),d=e.i(885205),c=e.i(276664),u=e.i(183194),p=e.i(702470),m=e.i(706547),f=e.i(553082),h=e.i(791174),y=e.i(404210),g=e.i(660179),b=e.i(564216),v=e.i(495280),x=e.i(248468),N=e.i(591079),w=e.i(825098),C=e.i(36455),j=e.i(68645);let k=[{value:"GENERAL",label:"Chung",icon:b.Globe},{value:"HEADER",label:"Header",icon:N.Layout},{value:"FOOTER",label:"Footer",icon:N.Layout},{value:"CONTACT",label:"Liên hệ",icon:w.Mail},{value:"SOCIAL",label:"Mạng xã hội",icon:v.MessageSquare},{value:"SEO",label:"SEO",icon:x.BarChart},{value:"SUPPORT_CHAT",label:"Support Chat",icon:C.MessageCircle},{value:"AUTH",label:"Xác thực",icon:j.Shield}];function S(){let[e,b]=(0,a.useState)("GENERAL"),[v,x]=(0,a.useState)({}),[N,w]=(0,a.useState)(!1),{data:C=[],loading:j,error:S,refetch:$}=(0,i.useFindMany)("WebsiteSetting",{orderBy:{order:"asc"}}),[O,{loading:E}]=(0,i.useUpdateOne)("WebsiteSetting"),M=C.filter(t=>t.category===e).sort((e,t)=>e.order-t.order).reduce((e,t)=>{let a=t.group||"other";return e[a]||(e[a]=[]),e[a].push(t),e},{}),T=(e,t,a)=>{let i=t;if("BOOLEAN"===a)i=t?"true":"false";else if("NUMBER"===a)i=String(t);else if("JSON"===a)try{i=JSON.stringify(t)}catch(e){i=t}x(t=>({...t,[e]:i})),w(!0)},A=async()=>{try{let e=Object.entries(v).map(([e,t])=>{let a=C.find(t=>t.key===e);return a?O({where:{id:a.id},data:{value:t}}):(console.warn(`Setting not found for key: ${e}`),Promise.resolve())});await Promise.all(e),console.log("✅ Đã lưu settings"),x({}),w(!1),$()}catch(e){console.error("❌ Lỗi:",e.message||"Không thể lưu settings")}};return j?(0,t.jsx)("div",{className:"flex items-center justify-center h-96",children:(0,t.jsx)(h.RefreshCw,{className:"w-8 h-8 animate-spin text-primary"})}):(0,t.jsxs)("div",{className:"container mx-auto p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-3xl font-bold flex items-center gap-2",children:[(0,t.jsx)(m.Settings,{className:"w-8 h-8"}),"Cài đặt Website"]}),(0,t.jsx)("p",{className:"text-muted-foreground mt-1",children:"Quản lý tất cả các cài đặt của website"})]}),N&&(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsxs)(d.Button,{variant:"outline",onClick:()=>{x({}),w(!1)},children:[(0,t.jsx)(h.RefreshCw,{className:"w-4 h-4 mr-2"}),"Hủy"]}),(0,t.jsxs)(d.Button,{onClick:A,disabled:E,children:[(0,t.jsx)(f.Save,{className:"w-4 h-4 mr-2"}),E?"Đang lưu...":"Lưu thay đổi"]})]})]}),(0,t.jsxs)(s.Tabs,{value:e,onValueChange:b,className:"w-full",children:[(0,t.jsx)(s.TabsList,{className:`grid grid-cols-${k.length} w-full`,children:k.map(e=>{let a=e.icon;return(0,t.jsxs)(s.TabsTrigger,{value:e.value,className:"flex items-center gap-2",children:[(0,t.jsx)(a,{className:"w-4 h-4"}),e.label]},e.value)})}),k.map(e=>(0,t.jsxs)(s.TabsContent,{value:e.value,className:"space-y-6 mt-6",children:[Object.entries(M).map(([e,a])=>(0,t.jsxs)(r.Card,{children:[(0,t.jsxs)(r.CardHeader,{children:[(0,t.jsx)(r.CardTitle,{className:"capitalize",children:"other"===e?"Khác":e.replace(/_/g," ")}),(0,t.jsxs)(r.CardDescription,{children:[a.length," cài đặt"]})]}),(0,t.jsx)(r.CardContent,{className:"space-y-6",children:a.map(e=>(0,t.jsxs)("div",{className:"space-y-2 pb-4 border-b last:border-0 last:pb-0",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between",children:[(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)(o.Label,{htmlFor:e.key,className:"text-base font-semibold",children:e.label}),e.description&&(0,t.jsx)("p",{className:"text-sm text-muted-foreground mt-1",children:e.description})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(p.Badge,{variant:"outline",className:"text-xs",children:e.type}),e.isPublic?(0,t.jsx)("span",{title:"Public",children:(0,t.jsx)(y.Eye,{className:"w-4 h-4 text-green-500"})}):(0,t.jsx)("span",{title:"Private",children:(0,t.jsx)(g.EyeOff,{className:"w-4 h-4 text-gray-400"})})]})]}),(0,t.jsx)("div",{className:"mt-2",children:(e=>{let a=((e,t)=>{if(!e)return"BOOLEAN"!==t&&"";switch(t){case"BOOLEAN":return"true"===e;case"NUMBER":return parseFloat(e)||0;case"JSON":try{return JSON.parse(e)}catch{return e}default:return e}})(void 0!==v[e.key]?v[e.key]:e.value,e.type);switch(e.type){case"BOOLEAN":return(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)(c.Switch,{id:e.key,checked:a,onCheckedChange:t=>T(e.key,t,e.type)}),(0,t.jsx)(o.Label,{htmlFor:e.key,className:"cursor-pointer",children:a?"Bật":"Tắt"})]});case"TEXTAREA":return(0,t.jsx)(l.Textarea,{id:e.key,value:a,onChange:t=>T(e.key,t.target.value,e.type),rows:3,className:"w-full"});case"NUMBER":return(0,t.jsx)(n.Input,{id:e.key,type:"number",value:a,onChange:t=>T(e.key,t.target.value,e.type),className:"w-full"});case"COLOR":return(0,t.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,t.jsx)(n.Input,{id:e.key,type:"color",value:a||"#000000",onChange:t=>T(e.key,t.target.value,e.type),className:"w-20 h-10"}),(0,t.jsx)(n.Input,{type:"text",value:a||"",onChange:t=>T(e.key,t.target.value,e.type),className:"flex-1",placeholder:"#000000"})]});case"IMAGE":case"URL":return(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(n.Input,{id:e.key,type:"text",value:a,onChange:t=>T(e.key,t.target.value,e.type),className:"w-full",placeholder:"IMAGE"===e.type?"/path/to/image.jpg":"https://example.com"}),"IMAGE"===e.type&&a&&(0,t.jsx)("img",{src:a,alt:"Preview",className:"max-w-xs max-h-32 object-contain border rounded"})]});case"SELECT":let i=[];try{"string"==typeof e.options?i=JSON.parse(e.options):Array.isArray(e.options)?i=e.options:e.options&&"object"==typeof e.options&&(i=Object.values(e.options))}catch(t){console.error("Error parsing options for",e.key,t),i=[]}return(0,t.jsxs)(u.Select,{value:a,onValueChange:t=>T(e.key,t,e.type),children:[(0,t.jsx)(u.SelectTrigger,{className:"w-full",children:(0,t.jsx)(u.SelectValue,{placeholder:"Chọn..."})}),(0,t.jsx)(u.SelectContent,{children:i.map(e=>(0,t.jsx)(u.SelectItem,{value:e,children:e},e))})]});default:return(0,t.jsx)(n.Input,{id:e.key,type:"text",value:a,onChange:t=>T(e.key,t.target.value,e.type),className:"w-full"})}})(e)}),(0,t.jsxs)("div",{className:"text-xs text-muted-foreground",children:["Key: ",(0,t.jsx)("code",{className:"bg-muted px-1 py-0.5 rounded",children:e.key})]})]},e.id))})]},e)),0===Object.keys(M).length&&(0,t.jsx)(r.Card,{children:(0,t.jsx)(r.CardContent,{className:"py-12 text-center text-muted-foreground",children:"Chưa có cài đặt nào trong danh mục này"})})]},e.value))]})]})}e.s(["default",()=>S])}]);