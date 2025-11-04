module.exports=[242526,a=>{"use strict";var b=a.i(651332),c=a.i(572521),d=a.i(360507),e=a.i(694475),f=a.i(742053),g=a.i(549074),h=a.i(681498),i=a.i(247513),j=a.i(542226),k=a.i(660886),l=a.i(372123),m=a.i(707251),n=a.i(877457),o=a.i(466196),p=a.i(223904),q=a.i(321248),r="Dialog",[s,t]=(0,e.createContextScope)(r),[u,v]=s(r),w=a=>{let{__scopeDialog:c,children:d,open:e,defaultOpen:h,onOpenChange:i,modal:j=!0}=a,k=b.useRef(null),l=b.useRef(null),[m,n]=(0,g.useControllableState)({prop:e,defaultProp:h??!1,onChange:i,caller:r});return(0,q.jsx)(u,{scope:c,triggerRef:k,contentRef:l,contentId:(0,f.useId)(),titleId:(0,f.useId)(),descriptionId:(0,f.useId)(),open:m,onOpenChange:n,onOpenToggle:b.useCallback(()=>n(a=>!a),[n]),modal:j,children:d})};w.displayName=r;var x="DialogTrigger",y=b.forwardRef((a,b)=>{let{__scopeDialog:e,...f}=a,g=v(x,e),h=(0,d.useComposedRefs)(b,g.triggerRef);return(0,q.jsx)(l.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":g.open,"aria-controls":g.contentId,"data-state":S(g.open),...f,ref:h,onClick:(0,c.composeEventHandlers)(a.onClick,g.onOpenToggle)})});y.displayName=x;var z="DialogPortal",[A,B]=s(z,{forceMount:void 0}),C=a=>{let{__scopeDialog:c,forceMount:d,children:e,container:f}=a,g=v(z,c);return(0,q.jsx)(A,{scope:c,forceMount:d,children:b.Children.map(e,a=>(0,q.jsx)(k.Presence,{present:d||g.open,children:(0,q.jsx)(j.Portal,{asChild:!0,container:f,children:a})}))})};C.displayName=z;var D="DialogOverlay",E=b.forwardRef((a,b)=>{let c=B(D,a.__scopeDialog),{forceMount:d=c.forceMount,...e}=a,f=v(D,a.__scopeDialog);return f.modal?(0,q.jsx)(k.Presence,{present:d||f.open,children:(0,q.jsx)(G,{...e,ref:b})}):null});E.displayName=D;var F=(0,p.createSlot)("DialogOverlay.RemoveScroll"),G=b.forwardRef((a,b)=>{let{__scopeDialog:c,...d}=a,e=v(D,c);return(0,q.jsx)(n.RemoveScroll,{as:F,allowPinchZoom:!0,shards:[e.contentRef],children:(0,q.jsx)(l.Primitive.div,{"data-state":S(e.open),...d,ref:b,style:{pointerEvents:"auto",...d.style}})})}),H="DialogContent",I=b.forwardRef((a,b)=>{let c=B(H,a.__scopeDialog),{forceMount:d=c.forceMount,...e}=a,f=v(H,a.__scopeDialog);return(0,q.jsx)(k.Presence,{present:d||f.open,children:f.modal?(0,q.jsx)(J,{...e,ref:b}):(0,q.jsx)(K,{...e,ref:b})})});I.displayName=H;var J=b.forwardRef((a,e)=>{let f=v(H,a.__scopeDialog),g=b.useRef(null),h=(0,d.useComposedRefs)(e,f.contentRef,g);return b.useEffect(()=>{let a=g.current;if(a)return(0,o.hideOthers)(a)},[]),(0,q.jsx)(L,{...a,ref:h,trapFocus:f.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,c.composeEventHandlers)(a.onCloseAutoFocus,a=>{a.preventDefault(),f.triggerRef.current?.focus()}),onPointerDownOutside:(0,c.composeEventHandlers)(a.onPointerDownOutside,a=>{let b=a.detail.originalEvent,c=0===b.button&&!0===b.ctrlKey;(2===b.button||c)&&a.preventDefault()}),onFocusOutside:(0,c.composeEventHandlers)(a.onFocusOutside,a=>a.preventDefault())})}),K=b.forwardRef((a,c)=>{let d=v(H,a.__scopeDialog),e=b.useRef(!1),f=b.useRef(!1);return(0,q.jsx)(L,{...a,ref:c,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:b=>{a.onCloseAutoFocus?.(b),b.defaultPrevented||(e.current||d.triggerRef.current?.focus(),b.preventDefault()),e.current=!1,f.current=!1},onInteractOutside:b=>{a.onInteractOutside?.(b),b.defaultPrevented||(e.current=!0,"pointerdown"===b.detail.originalEvent.type&&(f.current=!0));let c=b.target;d.triggerRef.current?.contains(c)&&b.preventDefault(),"focusin"===b.detail.originalEvent.type&&f.current&&b.preventDefault()}})}),L=b.forwardRef((a,c)=>{let{__scopeDialog:e,trapFocus:f,onOpenAutoFocus:g,onCloseAutoFocus:j,...k}=a,l=v(H,e),n=b.useRef(null),o=(0,d.useComposedRefs)(c,n);return(0,m.useFocusGuards)(),(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(i.FocusScope,{asChild:!0,loop:!0,trapped:f,onMountAutoFocus:g,onUnmountAutoFocus:j,children:(0,q.jsx)(h.DismissableLayer,{role:"dialog",id:l.contentId,"aria-describedby":l.descriptionId,"aria-labelledby":l.titleId,"data-state":S(l.open),...k,ref:o,onDismiss:()=>l.onOpenChange(!1)})}),(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(W,{titleId:l.titleId}),(0,q.jsx)(X,{contentRef:n,descriptionId:l.descriptionId})]})]})}),M="DialogTitle",N=b.forwardRef((a,b)=>{let{__scopeDialog:c,...d}=a,e=v(M,c);return(0,q.jsx)(l.Primitive.h2,{id:e.titleId,...d,ref:b})});N.displayName=M;var O="DialogDescription",P=b.forwardRef((a,b)=>{let{__scopeDialog:c,...d}=a,e=v(O,c);return(0,q.jsx)(l.Primitive.p,{id:e.descriptionId,...d,ref:b})});P.displayName=O;var Q="DialogClose",R=b.forwardRef((a,b)=>{let{__scopeDialog:d,...e}=a,f=v(Q,d);return(0,q.jsx)(l.Primitive.button,{type:"button",...e,ref:b,onClick:(0,c.composeEventHandlers)(a.onClick,()=>f.onOpenChange(!1))})});function S(a){return a?"open":"closed"}R.displayName=Q;var T="DialogTitleWarning",[U,V]=(0,e.createContext)(T,{contentName:H,titleName:M,docsSlug:"dialog"}),W=({titleId:a})=>{let c=V(T),d=`\`${c.contentName}\` requires a \`${c.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${c.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${c.docsSlug}`;return b.useEffect(()=>{a&&(document.getElementById(a)||console.error(d))},[d,a]),null},X=({contentRef:a,descriptionId:c})=>{let d=V("DialogDescriptionWarning"),e=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${d.contentName}}.`;return b.useEffect(()=>{let b=a.current?.getAttribute("aria-describedby");c&&b&&(document.getElementById(c)||console.warn(e))},[e,a,c]),null};a.s(["Close",()=>R,"Content",()=>I,"Description",()=>P,"Overlay",()=>E,"Portal",()=>C,"Root",()=>w,"Title",()=>N,"Trigger",()=>y])},755820,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(242526),e=a.i(363615),f=a.i(422171);let g=d.Root,h=d.Trigger,i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Overlay,{ref:e,className:(0,f.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...c}));i.displayName=d.Overlay.displayName;let j=c.forwardRef(({className:a,children:c,...g},h)=>(0,b.jsxs)(d.Portal,{children:[(0,b.jsx)(i,{}),(0,b.jsxs)(d.Content,{ref:h,className:(0,f.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...g,children:[c,(0,b.jsxs)(d.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,b.jsx)(e.X,{className:"h-4 w-4"}),(0,b.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));j.displayName=d.Content.displayName;let k=({className:a,...c})=>(0,b.jsx)("div",{className:(0,f.cn)("flex flex-col space-y-1.5 text-center sm:text-left",a),...c});k.displayName="DialogHeader";let l=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Title,{ref:e,className:(0,f.cn)("text-lg font-semibold leading-none tracking-tight",a),...c}));l.displayName=d.Title.displayName;let m=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Description,{ref:e,className:(0,f.cn)("text-sm text-muted-foreground",a),...c}));m.displayName=d.Description.displayName;let n=({className:a,...c})=>(0,b.jsx)("div",{className:(0,f.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",a),...c});n.displayName="DialogFooter",a.s(["Dialog",()=>g,"DialogContent",()=>j,"DialogDescription",()=>m,"DialogFooter",()=>n,"DialogHeader",()=>k,"DialogTitle",()=>l,"DialogTrigger",()=>h])},235746,769056,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(563718),e=a.i(651332),f=a.i(772213);let g=f.gql`
  query FindMany(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,h=f.gql`
  query FindUnique(
    $modelName: String!
    $input: UnifiedFindByIdInput!
  ) {
    findById(
      modelName: $modelName
      input: $input
    )
  }
`,i=f.gql`
  query FindFirst(
    $modelName: String!
    $input: UnifiedFindManyInput
  ) {
    findMany(
      modelName: $modelName
      input: $input
    )
  }
`,j=f.gql`
  query FindManyPaginated(
    $modelName: String!
    $input: UnifiedPaginatedInput
  ) {
    findManyPaginated(
      modelName: $modelName
      input: $input
    )
  }
`,k=f.gql`
  query Count(
    $modelName: String!
    $where: JSON
  ) {
    count(
      modelName: $modelName
      where: $where
    )
  }
`,l=f.gql`
  query Aggregate(
    $model: String!
    $options: JSON!
  ) {
    aggregate(
      model: $model
      options: $options
    )
  }
`,m=f.gql`
  query GroupBy(
    $model: String!
    $options: JSON!
  ) {
    groupBy(
      model: $model
      options: $options
    )
  }
`,n=f.gql`
  mutation CreateOne(
    $modelName: String!
    $input: UnifiedCreateInput!
  ) {
    createOne(
      modelName: $modelName
      input: $input
    )
  }
`,o=f.gql`
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
`,p=f.gql`
  mutation UpdateOne(
    $modelName: String!
    $input: UnifiedUpdateInput!
  ) {
    updateOne(
      modelName: $modelName
      input: $input
    )
  }
`,q=f.gql`
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
`,r=f.gql`
  mutation DeleteOne(
    $modelName: String!
    $input: UnifiedDeleteInput!
  ) {
    deleteOne(
      modelName: $modelName
      input: $input
    )
  }
`,s=f.gql`
  mutation DeleteMany(
    $model: String!
    $where: JSON
  ) {
    deleteMany(
      model: $model
      where: $where
    )
  }
`,t=f.gql`
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
`,u=f.gql`
  query GetAvailableModels {
    getAvailableModels
  }
`,v=f.gql`
  mutation ClearCache {
    clearCache
  }
`;function w(a,c,d){let e=d?.skip||d?.requireAuth!==!1,{data:f,loading:h,error:i,refetch:j}=(0,b.useQuery)(g,{variables:{modelName:a,input:c||{}},skip:e,fetchPolicy:d?.fetchPolicy||"cache-and-network"});return{data:f?.findMany,loading:h,error:i,refetch:j}}function x(a,c,d,e){let f="string"==typeof c?c:c?.id;f||e?.skip;let g=e?.skip||!f||e?.requireAuth!==!1,{data:i,loading:j,error:k,refetch:l}=(0,b.useQuery)(h,{variables:{modelName:a,input:{id:f||"",select:d?.select,include:d?.include}},skip:g});return{data:i?.findById,loading:j,error:k,refetch:l}}function y(a,c,d){let[f,g]=(0,e.useState)(c?.page||1),[h,i]=(0,e.useState)(c?.limit||10),k=d?.skip||d?.requireAuth!==!1,{data:l,loading:m,error:n,refetch:o}=(0,b.useQuery)(j,{variables:{modelName:a,input:{page:f,limit:h,where:c?.where,orderBy:c?.orderBy,select:c?.select,include:c?.include}},skip:k,fetchPolicy:"cache-and-network"}),p=l?.findManyPaginated,q=(0,e.useCallback)(a=>{g(a)},[]),r=(0,e.useCallback)(()=>{p?.meta.hasNextPage&&g(a=>a+1)},[p]),s=(0,e.useCallback)(()=>{p?.meta.hasPrevPage&&g(a=>a-1)},[p]),t=(0,e.useCallback)(a=>{i(a),g(1)},[]);return{data:p?.data,meta:p?.meta,loading:m,error:n,refetch:o,page:f,limit:h,goToPage:q,nextPage:r,prevPage:s,changeLimit:t}}function z(a,c,d){let{data:e,loading:f,error:g,refetch:h}=(0,b.useQuery)(k,{variables:{modelName:a,where:c},skip:d?.skip});return{count:e?.count,loading:f,error:g,refetch:h}}function A(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(n,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c=await d({variables:{modelName:a,input:{data:b.data,select:b.select,include:b.include}}});return c.data?.createOne},[d,a]),{data:f?.createOne,loading:g,error:h}]}function B(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(p,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for update operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,data:b.data,select:b.select,include:b.include}}});return e.data?.updateOne},[d,a]),{data:f?.updateOne,loading:g,error:h}]}function C(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(r,{refetchQueries:b?.refetchQueries});return[(0,e.useCallback)(async b=>{let c="string"==typeof b.where?b.where:b.where?.id;if(!c)throw Error('ID is required for delete operation. Please provide where: { id: "..." } or where: "id-string"');let e=await d({variables:{modelName:a,input:{id:c,select:b.select}}});return e.data?.deleteOne},[d,a]),{data:f?.deleteOne,loading:g,error:h}]}function D(a){let b=(0,d.useApolloClient)(),[f,i]=A(a),[j,l]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(o,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.createMany},[d,a]),{data:f?.createMany,loading:g,error:h}]}(a),[m,n]=B(a),[p,r]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(q,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.updateMany},[d,a]),{data:f?.updateMany,loading:g,error:h}]}(a),[u,v]=C(a),[w,x]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(s,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,where:b}});return c.data?.deleteMany},[d,a]),{data:f?.deleteMany,loading:g,error:h}]}(a),[y,z]=function(a,b){let[d,{data:f,loading:g,error:h}]=(0,c.useMutation)(t,{refetchQueries:void 0});return[(0,e.useCallback)(async b=>{let c=await d({variables:{model:a,...b}});return c.data?.upsert},[d,a]),{data:f?.upsert,loading:g,error:h}]}(a),D=(0,e.useCallback)(async c=>(await b.query({query:g,variables:{model:a,...c},fetchPolicy:"network-only"})).data.findMany,[b,a]);return{findMany:D,findUnique:(0,e.useCallback)(async(c,d)=>(await b.query({query:h,variables:{model:a,where:c,...d},fetchPolicy:"network-only"})).data.findUnique,[b,a]),count:(0,e.useCallback)(async c=>(await b.query({query:k,variables:{model:a,where:c},fetchPolicy:"network-only"})).data.count,[b,a]),createOne:f,createMany:j,updateOne:m,updateMany:p,deleteOne:u,deleteMany:w,upsert:y,states:{createOne:i,createMany:l,updateOne:n,updateMany:r,deleteOne:v,deleteMany:x,upsert:z},loading:i.loading||l.loading||n.loading||r.loading||v.loading||x.loading||z.loading}}a.s(["AGGREGATE",0,l,"CLEAR_CACHE",0,v,"COUNT",0,k,"CREATE_MANY",0,o,"CREATE_ONE",0,n,"DELETE_MANY",0,s,"DELETE_ONE",0,r,"FIND_FIRST",0,i,"FIND_MANY",0,g,"FIND_MANY_PAGINATED",0,j,"FIND_UNIQUE",0,h,"GET_AVAILABLE_MODELS",0,u,"GROUP_BY",0,m,"UPDATE_MANY",0,q,"UPDATE_ONE",0,p,"UPSERT",0,t],769056),a.s(["useCRUD",()=>D,"useCount",()=>z,"useCreateOne",()=>A,"useDeleteOne",()=>C,"useFindMany",()=>w,"useFindManyPaginated",()=>y,"useFindUnique",()=>x,"useUpdateOne",()=>B],235746)},733554,925556,a=>{"use strict";let b=(0,a.i(367990).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);a.s(["default",()=>b],925556),a.s(["Loader2",()=>b],733554)},625609,a=>{"use strict";function b(a,[b,c]){return Math.min(c,Math.max(b,a))}a.s(["clamp",()=>b])},370477,a=>{"use strict";var b=a.i(651332);function c(a){let c=b.useRef({value:a,previous:a});return b.useMemo(()=>(c.current.value!==a&&(c.current.previous=c.current.value,c.current.value=a),c.current.previous),[a])}a.s(["usePrevious",()=>c])},376946,a=>{"use strict";var b=a.i(651332),c=a.i(372123),d=a.i(321248),e=Object.freeze({position:"absolute",border:0,width:1,height:1,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",wordWrap:"normal"}),f=b.forwardRef((a,b)=>(0,d.jsx)(c.Primitive.span,{...a,ref:b,style:{...e,...a.style}}));f.displayName="VisuallyHidden",a.s(["Root",()=>f,"VISUALLY_HIDDEN_STYLES",()=>e,"VisuallyHidden",()=>f])},441405,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(372123),e=c.forwardRef((a,c)=>(0,b.jsx)(d.Primitive.label,{...a,ref:c,onMouseDown:b=>{b.target.closest("button, input, select, textarea")||(a.onMouseDown?.(b),!b.defaultPrevented&&b.detail>1&&b.preventDefault())}}));e.displayName="Label";var f=a.i(422171);function g({className:a,...c}){return(0,b.jsx)(e,{"data-slot":"label",className:(0,f.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",a),...c})}a.s(["Label",()=>g],441405)},951369,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(572521),e=a.i(694475),f=a.i(270694),g=a.i(660886),h=a.i(372123),i=a.i(770186),j=a.i(549074),k=a.i(742053),l="Tabs",[m,n]=(0,e.createContextScope)(l,[f.createRovingFocusGroupScope]),o=(0,f.createRovingFocusGroupScope)(),[p,q]=m(l),r=c.forwardRef((a,c)=>{let{__scopeTabs:d,value:e,onValueChange:f,defaultValue:g,orientation:m="horizontal",dir:n,activationMode:o="automatic",...q}=a,r=(0,i.useDirection)(n),[s,t]=(0,j.useControllableState)({prop:e,onChange:f,defaultProp:g??"",caller:l});return(0,b.jsx)(p,{scope:d,baseId:(0,k.useId)(),value:s,onValueChange:t,orientation:m,dir:r,activationMode:o,children:(0,b.jsx)(h.Primitive.div,{dir:r,"data-orientation":m,...q,ref:c})})});r.displayName=l;var s="TabsList",t=c.forwardRef((a,c)=>{let{__scopeTabs:d,loop:e=!0,...g}=a,i=q(s,d),j=o(d);return(0,b.jsx)(f.Root,{asChild:!0,...j,orientation:i.orientation,dir:i.dir,loop:e,children:(0,b.jsx)(h.Primitive.div,{role:"tablist","aria-orientation":i.orientation,...g,ref:c})})});t.displayName=s;var u="TabsTrigger",v=c.forwardRef((a,c)=>{let{__scopeTabs:e,value:g,disabled:i=!1,...j}=a,k=q(u,e),l=o(e),m=y(k.baseId,g),n=z(k.baseId,g),p=g===k.value;return(0,b.jsx)(f.Item,{asChild:!0,...l,focusable:!i,active:p,children:(0,b.jsx)(h.Primitive.button,{type:"button",role:"tab","aria-selected":p,"aria-controls":n,"data-state":p?"active":"inactive","data-disabled":i?"":void 0,disabled:i,id:m,...j,ref:c,onMouseDown:(0,d.composeEventHandlers)(a.onMouseDown,a=>{i||0!==a.button||!1!==a.ctrlKey?a.preventDefault():k.onValueChange(g)}),onKeyDown:(0,d.composeEventHandlers)(a.onKeyDown,a=>{[" ","Enter"].includes(a.key)&&k.onValueChange(g)}),onFocus:(0,d.composeEventHandlers)(a.onFocus,()=>{let a="manual"!==k.activationMode;p||i||!a||k.onValueChange(g)})})})});v.displayName=u;var w="TabsContent",x=c.forwardRef((a,d)=>{let{__scopeTabs:e,value:f,forceMount:i,children:j,...k}=a,l=q(w,e),m=y(l.baseId,f),n=z(l.baseId,f),o=f===l.value,p=c.useRef(o);return c.useEffect(()=>{let a=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(a)},[]),(0,b.jsx)(g.Presence,{present:i||o,children:({present:c})=>(0,b.jsx)(h.Primitive.div,{"data-state":o?"active":"inactive","data-orientation":l.orientation,role:"tabpanel","aria-labelledby":m,hidden:!c,id:n,tabIndex:0,...k,ref:d,style:{...a.style,animationDuration:p.current?"0s":void 0},children:c&&j})})});function y(a,b){return`${a}-trigger-${b}`}function z(a,b){return`${a}-content-${b}`}x.displayName=w;var A=a.i(422171);let B=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(t,{ref:d,className:(0,A.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",a),...c}));B.displayName=t.displayName;let C=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(v,{ref:d,className:(0,A.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",a),...c}));C.displayName=v.displayName;let D=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(x,{ref:d,className:(0,A.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",a),...c}));D.displayName=x.displayName,a.s(["Tabs",()=>r,"TabsContent",()=>D,"TabsList",()=>B,"TabsTrigger",()=>C],951369)},772451,a=>{"use strict";var b=a.i(321248);let c=a.i(651332).forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`animate-pulse rounded-md bg-gray-200 ${a||""}`,...c}));c.displayName="Skeleton",a.s(["Skeleton",()=>c])},359379,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,role:"alert",className:(0,d.cn)("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",a),...c}));e.displayName="Alert";let f=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("text-sm [&_p]:leading-relaxed",a),...c}));f.displayName="AlertDescription",a.s(["Alert",()=>e,"AlertDescription",()=>f])},722112,a=>{"use strict";let b=(0,a.i(367990).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);a.s(["default",()=>b])},128348,a=>{"use strict";var b=a.i(722112);a.s(["Calendar",()=>b.default])},975780,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...c}));e.displayName="Card";let f=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex flex-col space-y-1.5 p-6",a),...c}));f.displayName="CardHeader";let g=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("h3",{ref:e,className:(0,d.cn)("text-2xl font-semibold leading-none tracking-tight",a),...c}));g.displayName="CardTitle";let h=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("p",{ref:e,className:(0,d.cn)("text-sm text-muted-foreground",a),...c}));h.displayName="CardDescription";let i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("p-6 pt-0",a),...c}));i.displayName="CardContent";let j=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex items-center p-6 pt-0",a),...c}));j.displayName="CardFooter",a.s(["Card",()=>e,"CardContent",()=>i,"CardDescription",()=>h,"CardFooter",()=>j,"CardHeader",()=>f,"CardTitle",()=>g])},293470,a=>{"use strict";var b=a.i(321248),c=a.i(13801),d=a.i(422171);let e=(0,c.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function f({className:a,variant:c,...f}){return(0,b.jsx)("span",{className:(0,d.cn)(e({variant:c}),a),...f})}a.s(["Badge",()=>f])},605751,a=>{"use strict";let b=(0,a.i(367990).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},411185,a=>{"use strict";var b=a.i(605751);a.s(["Clock",()=>b.default])},814588,a=>{"use strict";let b=(0,a.i(367990).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);a.s(["default",()=>b])},140300,a=>{"use strict";var b=a.i(814588);a.s(["Mail",()=>b.default])},395992,67261,a=>{"use strict";let b=(0,a.i(367990).default)("target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);a.s(["default",()=>b],67261),a.s(["Target",()=>b],395992)},419259,a=>{"use strict";let b=(0,a.i(367990).default)("user-plus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);a.s(["default",()=>b])},607226,a=>{"use strict";var b=a.i(419259);a.s(["UserPlus",()=>b.default])},358054,538302,a=>{"use strict";let b=(0,a.i(367990).default)("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);a.s(["default",()=>b],538302),a.s(["Users",()=>b],358054)},57597,659384,a=>{"use strict";let b=(0,a.i(367990).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);a.s(["default",()=>b],659384),a.s(["TrendingUp",()=>b],57597)},789471,a=>{"use strict";let b=(0,a.i(367990).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);a.s(["default",()=>b])},891026,a=>{"use strict";var b=a.i(789471);a.s(["BarChart3",()=>b.default])},730705,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(194296);let e=c.createContext({}),f=({children:a,open:c,onOpenChange:d})=>c?(0,b.jsx)(e.Provider,{value:{onOpenChange:d},children:a}):null,g=c.forwardRef(({className:a,children:d,asChild:e,...f},g)=>e&&c.isValidElement(d)?c.cloneElement(d,{ref:g,...f}):(0,b.jsx)("button",{ref:g,className:a,...f,children:d}));g.displayName="AlertDialogTrigger";let h=c.forwardRef(({className:a,...e},f)=>{let[g,h]=c.useState(!1);if(c.useEffect(()=>(h(!0),()=>h(!1)),[]),!g)return null;let i=(0,b.jsx)("div",{className:"fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 pointer-events-auto",onClick:a=>{a.target,a.currentTarget},children:(0,b.jsx)("div",{ref:f,className:`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg pointer-events-auto ${a||""}`,onClick:a=>a.stopPropagation(),...e})});return(0,d.createPortal)(i,document.body)});h.displayName="AlertDialogContent";let i=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`flex flex-col space-y-2 text-center sm:text-left ${a||""}`,...c}));i.displayName="AlertDialogHeader";let j=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${a||""}`,...c}));j.displayName="AlertDialogFooter";let k=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("h2",{ref:d,className:`text-lg font-semibold ${a||""}`,...c}));k.displayName="AlertDialogTitle";let l=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("p",{ref:d,className:`text-sm text-gray-500 ${a||""}`,...c}));l.displayName="AlertDialogDescription";let m=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)("button",{ref:d,className:`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 transition-colors hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${a||""}`,...c}));m.displayName="AlertDialogAction";let n=c.forwardRef(({className:a,onClick:d,...f},g)=>{let{onOpenChange:h}=c.useContext(e);return(0,b.jsx)("button",{ref:g,onClick:a=>{d?.(a),a.defaultPrevented||h?.(!1)},className:`inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${a||""}`,...f})});n.displayName="AlertDialogCancel",a.s(["AlertDialog",()=>f,"AlertDialogAction",()=>m,"AlertDialogCancel",()=>n,"AlertDialogContent",()=>h,"AlertDialogDescription",()=>l,"AlertDialogFooter",()=>j,"AlertDialogHeader",()=>i,"AlertDialogTitle",()=>k,"AlertDialogTrigger",()=>g])},351197,a=>{"use strict";let b=(0,a.i(367990).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);a.s(["default",()=>b])},623409,a=>{"use strict";var b=a.i(351197);a.s(["Activity",()=>b.default])},460531,a=>{"use strict";let b=(0,a.i(367990).default)("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);a.s(["default",()=>b])},729995,a=>{"use strict";var b=a.i(460531);a.s(["Zap",()=>b.default])},458194,(a,b,c)=>{"use strict";var d=a.r(651332);d.useState,d.useEffect,d.useLayoutEffect,d.useDebugValue,c.useSyncExternalStore=void 0!==d.useSyncExternalStore?d.useSyncExternalStore:function(a,b){return b()}},158198,(a,b,c)=>{"use strict";b.exports=a.r(458194)},531244,(a,b,c)=>{"use strict";var d=a.r(651332),e=a.r(158198),f="function"==typeof Object.is?Object.is:function(a,b){return a===b&&(0!==a||1/a==1/b)||a!=a&&b!=b},g=e.useSyncExternalStore,h=d.useRef,i=d.useEffect,j=d.useMemo,k=d.useDebugValue;c.useSyncExternalStoreWithSelector=function(a,b,c,d,e){var l=h(null);if(null===l.current){var m={hasValue:!1,value:null};l.current=m}else m=l.current;var n=g(a,(l=j(function(){function a(a){if(!i){if(i=!0,g=a,a=d(a),void 0!==e&&m.hasValue){var b=m.value;if(e(b,a))return h=b}return h=a}if(b=h,f(g,a))return b;var c=d(a);return void 0!==e&&e(b,c)?(g=a,b):(g=a,h=c)}var g,h,i=!1,j=void 0===c?null:c;return[function(){return a(b())},null===j?void 0:function(){return a(j())}]},[b,c,d,e]))[0],l[1]);return i(function(){m.hasValue=!0,m.value=n},[n]),k(n),n}},110860,(a,b,c)=>{"use strict";b.exports=a.r(531244)}];

//# sourceMappingURL=_f3ea9a3b._.js.map