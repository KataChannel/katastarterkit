module.exports=[158464,a=>{"use strict";let b=(0,a.i(367990).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);a.s(["default",()=>b])},558767,a=>{"use strict";var b=a.i(158464);a.s(["Trash2",()=>b.default])},196915,a=>{"use strict";let b=(0,a.i(367990).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["default",()=>b])},785903,a=>{"use strict";var b=a.i(196915);a.s(["Eye",()=>b.default])},919403,483022,a=>{"use strict";let b=(0,a.i(367990).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);a.s(["default",()=>b],483022),a.s(["Check",()=>b],919403)},625609,a=>{"use strict";function b(a,[b,c]){return Math.min(c,Math.max(b,a))}a.s(["clamp",()=>b])},441405,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(372123),e=c.forwardRef((a,c)=>(0,b.jsx)(d.Primitive.label,{...a,ref:c,onMouseDown:b=>{b.target.closest("button, input, select, textarea")||(a.onMouseDown?.(b),!b.defaultPrevented&&b.detail>1&&b.preventDefault())}}));e.displayName="Label";var f=a.i(422171);function g({className:a,...c}){return(0,b.jsx)(e,{"data-slot":"label",className:(0,f.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",a),...c})}a.s(["Label",()=>g],441405)},270694,a=>{"use strict";var b=a.i(651332),c=a.i(572521),d=a.i(4116),e=a.i(360507),f=a.i(694475),g=a.i(742053),h=a.i(372123),i=a.i(6769),j=a.i(549074),k=a.i(770186),l=a.i(321248),m="rovingFocusGroup.onEntryFocus",n={bubbles:!1,cancelable:!0},o="RovingFocusGroup",[p,q,r]=(0,d.createCollection)(o),[s,t]=(0,f.createContextScope)(o,[r]),[u,v]=s(o),w=b.forwardRef((a,b)=>(0,l.jsx)(p.Provider,{scope:a.__scopeRovingFocusGroup,children:(0,l.jsx)(p.Slot,{scope:a.__scopeRovingFocusGroup,children:(0,l.jsx)(x,{...a,ref:b})})}));w.displayName=o;var x=b.forwardRef((a,d)=>{let{__scopeRovingFocusGroup:f,orientation:g,loop:p=!1,dir:r,currentTabStopId:s,defaultCurrentTabStopId:t,onCurrentTabStopIdChange:v,onEntryFocus:w,preventScrollOnEntryFocus:x=!1,...y}=a,z=b.useRef(null),A=(0,e.useComposedRefs)(d,z),C=(0,k.useDirection)(r),[D,E]=(0,j.useControllableState)({prop:s,defaultProp:t??null,onChange:v,caller:o}),[F,G]=b.useState(!1),H=(0,i.useCallbackRef)(w),I=q(f),J=b.useRef(!1),[K,L]=b.useState(0);return b.useEffect(()=>{let a=z.current;if(a)return a.addEventListener(m,H),()=>a.removeEventListener(m,H)},[H]),(0,l.jsx)(u,{scope:f,orientation:g,dir:C,loop:p,currentTabStopId:D,onItemFocus:b.useCallback(a=>E(a),[E]),onItemShiftTab:b.useCallback(()=>G(!0),[]),onFocusableItemAdd:b.useCallback(()=>L(a=>a+1),[]),onFocusableItemRemove:b.useCallback(()=>L(a=>a-1),[]),children:(0,l.jsx)(h.Primitive.div,{tabIndex:F||0===K?-1:0,"data-orientation":g,...y,ref:A,style:{outline:"none",...a.style},onMouseDown:(0,c.composeEventHandlers)(a.onMouseDown,()=>{J.current=!0}),onFocus:(0,c.composeEventHandlers)(a.onFocus,a=>{let b=!J.current;if(a.target===a.currentTarget&&b&&!F){let b=new CustomEvent(m,n);if(a.currentTarget.dispatchEvent(b),!b.defaultPrevented){let a=I().filter(a=>a.focusable);B([a.find(a=>a.active),a.find(a=>a.id===D),...a].filter(Boolean).map(a=>a.ref.current),x)}}J.current=!1}),onBlur:(0,c.composeEventHandlers)(a.onBlur,()=>G(!1))})})}),y="RovingFocusGroupItem",z=b.forwardRef((a,d)=>{let{__scopeRovingFocusGroup:e,focusable:f=!0,active:i=!1,tabStopId:j,children:k,...m}=a,n=(0,g.useId)(),o=j||n,r=v(y,e),s=r.currentTabStopId===o,t=q(e),{onFocusableItemAdd:u,onFocusableItemRemove:w,currentTabStopId:x}=r;return b.useEffect(()=>{if(f)return u(),()=>w()},[f,u,w]),(0,l.jsx)(p.ItemSlot,{scope:e,id:o,focusable:f,active:i,children:(0,l.jsx)(h.Primitive.span,{tabIndex:s?0:-1,"data-orientation":r.orientation,...m,ref:d,onMouseDown:(0,c.composeEventHandlers)(a.onMouseDown,a=>{f?r.onItemFocus(o):a.preventDefault()}),onFocus:(0,c.composeEventHandlers)(a.onFocus,()=>r.onItemFocus(o)),onKeyDown:(0,c.composeEventHandlers)(a.onKeyDown,a=>{if("Tab"===a.key&&a.shiftKey)return void r.onItemShiftTab();if(a.target!==a.currentTarget)return;let b=function(a,b,c){var d;let e=(d=a.key,"rtl"!==c?d:"ArrowLeft"===d?"ArrowRight":"ArrowRight"===d?"ArrowLeft":d);if(!("vertical"===b&&["ArrowLeft","ArrowRight"].includes(e))&&!("horizontal"===b&&["ArrowUp","ArrowDown"].includes(e)))return A[e]}(a,r.orientation,r.dir);if(void 0!==b){if(a.metaKey||a.ctrlKey||a.altKey||a.shiftKey)return;a.preventDefault();let e=t().filter(a=>a.focusable).map(a=>a.ref.current);if("last"===b)e.reverse();else if("prev"===b||"next"===b){var c,d;"prev"===b&&e.reverse();let f=e.indexOf(a.currentTarget);e=r.loop?(c=e,d=f+1,c.map((a,b)=>c[(d+b)%c.length])):e.slice(f+1)}setTimeout(()=>B(e))}}),children:"function"==typeof k?k({isCurrentTabStop:s,hasTabStop:null!=x}):k})})});z.displayName=y;var A={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function B(a,b=!1){let c=document.activeElement;for(let d of a)if(d===c||(d.focus({preventScroll:b}),document.activeElement!==c))return}a.s(["Item",()=>z,"Root",()=>w,"createRovingFocusGroupScope",()=>t])},951369,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(572521),e=a.i(694475),f=a.i(270694),g=a.i(660886),h=a.i(372123),i=a.i(770186),j=a.i(549074),k=a.i(742053),l="Tabs",[m,n]=(0,e.createContextScope)(l,[f.createRovingFocusGroupScope]),o=(0,f.createRovingFocusGroupScope)(),[p,q]=m(l),r=c.forwardRef((a,c)=>{let{__scopeTabs:d,value:e,onValueChange:f,defaultValue:g,orientation:m="horizontal",dir:n,activationMode:o="automatic",...q}=a,r=(0,i.useDirection)(n),[s,t]=(0,j.useControllableState)({prop:e,onChange:f,defaultProp:g??"",caller:l});return(0,b.jsx)(p,{scope:d,baseId:(0,k.useId)(),value:s,onValueChange:t,orientation:m,dir:r,activationMode:o,children:(0,b.jsx)(h.Primitive.div,{dir:r,"data-orientation":m,...q,ref:c})})});r.displayName=l;var s="TabsList",t=c.forwardRef((a,c)=>{let{__scopeTabs:d,loop:e=!0,...g}=a,i=q(s,d),j=o(d);return(0,b.jsx)(f.Root,{asChild:!0,...j,orientation:i.orientation,dir:i.dir,loop:e,children:(0,b.jsx)(h.Primitive.div,{role:"tablist","aria-orientation":i.orientation,...g,ref:c})})});t.displayName=s;var u="TabsTrigger",v=c.forwardRef((a,c)=>{let{__scopeTabs:e,value:g,disabled:i=!1,...j}=a,k=q(u,e),l=o(e),m=y(k.baseId,g),n=z(k.baseId,g),p=g===k.value;return(0,b.jsx)(f.Item,{asChild:!0,...l,focusable:!i,active:p,children:(0,b.jsx)(h.Primitive.button,{type:"button",role:"tab","aria-selected":p,"aria-controls":n,"data-state":p?"active":"inactive","data-disabled":i?"":void 0,disabled:i,id:m,...j,ref:c,onMouseDown:(0,d.composeEventHandlers)(a.onMouseDown,a=>{i||0!==a.button||!1!==a.ctrlKey?a.preventDefault():k.onValueChange(g)}),onKeyDown:(0,d.composeEventHandlers)(a.onKeyDown,a=>{[" ","Enter"].includes(a.key)&&k.onValueChange(g)}),onFocus:(0,d.composeEventHandlers)(a.onFocus,()=>{let a="manual"!==k.activationMode;p||i||!a||k.onValueChange(g)})})})});v.displayName=u;var w="TabsContent",x=c.forwardRef((a,d)=>{let{__scopeTabs:e,value:f,forceMount:i,children:j,...k}=a,l=q(w,e),m=y(l.baseId,f),n=z(l.baseId,f),o=f===l.value,p=c.useRef(o);return c.useEffect(()=>{let a=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(a)},[]),(0,b.jsx)(g.Presence,{present:i||o,children:({present:c})=>(0,b.jsx)(h.Primitive.div,{"data-state":o?"active":"inactive","data-orientation":l.orientation,role:"tabpanel","aria-labelledby":m,hidden:!c,id:n,tabIndex:0,...k,ref:d,style:{...a.style,animationDuration:p.current?"0s":void 0},children:c&&j})})});function y(a,b){return`${a}-trigger-${b}`}function z(a,b){return`${a}-content-${b}`}x.displayName=w;var A=a.i(422171);let B=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(t,{ref:d,className:(0,A.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",a),...c}));B.displayName=t.displayName;let C=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(v,{ref:d,className:(0,A.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",a),...c}));C.displayName=v.displayName;let D=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(x,{ref:d,className:(0,A.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",a),...c}));D.displayName=x.displayName,a.s(["Tabs",()=>r,"TabsContent",()=>D,"TabsList",()=>B,"TabsTrigger",()=>C],951369)},872466,a=>{"use strict";let b=(0,a.i(367990).default)("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]);a.s(["default",()=>b])},681768,a=>{"use strict";var b=a.i(872466);a.s(["Filter",()=>b.default])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},394940,a=>{"use strict";var b=a.i(772213);let c=b.gql`
  fragment CategoryBasicFields on CategoryType {
    id
    name
    slug
    description
    image
    displayOrder
    isActive
    createdAt
  }
`,d=b.gql`
  ${c}
  fragment CategoryWithCountFields on CategoryType {
    ...CategoryBasicFields
    productCount
  }
`,e=b.gql`
  ${d}
  fragment CategoryTreeFields on CategoryType {
    ...CategoryWithCountFields
    parent {
      id
      name
      slug
    }
    children {
      ...CategoryWithCountFields
    }
  }
`,f=b.gql`
  fragment ProductImageFields on ProductImageType {
    id
    url
    alt
    isPrimary
    order
    createdAt
  }
`,g=b.gql`
  fragment ProductVariantFields on ProductVariantType {
    id
    name
    sku
    price
    stock
    order
    isActive
    attributes
    createdAt
  }
`;b.gql`
  fragment ProductBasicFields on ProductType {
    id
    name
    slug
    description
    shortDesc
    price
    compareAtPrice
    status
    isActive
    sku
    createdAt
  }
`;let h=b.gql`
  fragment UserFragment on User {
    id
    email
    username
    firstName
    lastName
    phone
    avatar
    roleType
    isActive
    isVerified
    isTwoFactorEnabled
    failedLoginAttempts
    lockedUntil
    lastLoginAt
    createdAt
    updatedAt
  }
`,i=b.gql`
  fragment PostFragment on Post {
    id
    title
    slug
    content
    excerpt
    featured_image
    author {
      id
      username
    }
    category {
      id
      name
    }
    published_at
    created_at
  }
`,j=b.gql`
  fragment CommentFragment on Comment {
    id
    content
    author {
      id
      username
    }
    post {
      id
      title
    }
    created_at
  }
`;a.s(["CATEGORY_BASIC_FRAGMENT",0,c,"CATEGORY_TREE_FRAGMENT",0,e,"CATEGORY_WITH_COUNT_FRAGMENT",0,d,"COMMENT_FRAGMENT",0,j,"POST_FRAGMENT",0,i,"PRODUCT_IMAGE_FRAGMENT",0,f,"PRODUCT_VARIANT_FRAGMENT",0,g,"USER_FRAGMENT",0,h])},866992,a=>{"use strict";let b=(0,a.i(367990).default)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);a.s(["default",()=>b])},79028,a=>{"use strict";var b=a.i(866992);a.s(["Package",()=>b.default])},325521,42327,a=>{"use strict";let b=(0,a.i(367990).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["default",()=>b],42327),a.s(["Settings",()=>b],325521)},650661,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(572521),e=a.i(360507),f=a.i(694475),g=a.i(549074),h=a.i(370477),i=a.i(555836),j=a.i(372123),k="Switch",[l,m]=(0,f.createContextScope)(k),[n,o]=l(k),p=c.forwardRef((a,f)=>{let{__scopeSwitch:h,name:i,checked:l,defaultChecked:m,required:o,disabled:p,value:q="on",onCheckedChange:r,form:u,...v}=a,[w,x]=c.useState(null),y=(0,e.useComposedRefs)(f,a=>x(a)),z=c.useRef(!1),A=!w||u||!!w.closest("form"),[B,C]=(0,g.useControllableState)({prop:l,defaultProp:m??!1,onChange:r,caller:k});return(0,b.jsxs)(n,{scope:h,checked:B,disabled:p,children:[(0,b.jsx)(j.Primitive.button,{type:"button",role:"switch","aria-checked":B,"aria-required":o,"data-state":t(B),"data-disabled":p?"":void 0,disabled:p,value:q,...v,ref:y,onClick:(0,d.composeEventHandlers)(a.onClick,a=>{C(a=>!a),A&&(z.current=a.isPropagationStopped(),z.current||a.stopPropagation())})}),A&&(0,b.jsx)(s,{control:w,bubbles:!z.current,name:i,value:q,checked:B,required:o,disabled:p,form:u,style:{transform:"translateX(-100%)"}})]})});p.displayName=k;var q="SwitchThumb",r=c.forwardRef((a,c)=>{let{__scopeSwitch:d,...e}=a,f=o(q,d);return(0,b.jsx)(j.Primitive.span,{"data-state":t(f.checked),"data-disabled":f.disabled?"":void 0,...e,ref:c})});r.displayName=q;var s=c.forwardRef(({__scopeSwitch:a,control:d,checked:f,bubbles:g=!0,...j},k)=>{let l=c.useRef(null),m=(0,e.useComposedRefs)(l,k),n=(0,h.usePrevious)(f),o=(0,i.useSize)(d);return c.useEffect(()=>{let a=l.current;if(!a)return;let b=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(n!==f&&b){let c=new Event("click",{bubbles:g});b.call(a,f),a.dispatchEvent(c)}},[n,f,g]),(0,b.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:f,...j,tabIndex:-1,ref:m,style:{...j.style,...o,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});function t(a){return a?"checked":"unchecked"}s.displayName="SwitchBubbleInput";var u=a.i(422171);let v=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(p,{className:(0,u.cn)("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",a),...c,ref:d,children:(0,b.jsx)(r,{className:(0,u.cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})}));v.displayName=p.displayName,a.s(["Switch",()=>v],650661)},242526,a=>{"use strict";var b=a.i(651332),c=a.i(572521),d=a.i(360507),e=a.i(694475),f=a.i(742053),g=a.i(549074),h=a.i(681498),i=a.i(247513),j=a.i(542226),k=a.i(660886),l=a.i(372123),m=a.i(707251),n=a.i(877457),o=a.i(466196),p=a.i(223904),q=a.i(321248),r="Dialog",[s,t]=(0,e.createContextScope)(r),[u,v]=s(r),w=a=>{let{__scopeDialog:c,children:d,open:e,defaultOpen:h,onOpenChange:i,modal:j=!0}=a,k=b.useRef(null),l=b.useRef(null),[m,n]=(0,g.useControllableState)({prop:e,defaultProp:h??!1,onChange:i,caller:r});return(0,q.jsx)(u,{scope:c,triggerRef:k,contentRef:l,contentId:(0,f.useId)(),titleId:(0,f.useId)(),descriptionId:(0,f.useId)(),open:m,onOpenChange:n,onOpenToggle:b.useCallback(()=>n(a=>!a),[n]),modal:j,children:d})};w.displayName=r;var x="DialogTrigger",y=b.forwardRef((a,b)=>{let{__scopeDialog:e,...f}=a,g=v(x,e),h=(0,d.useComposedRefs)(b,g.triggerRef);return(0,q.jsx)(l.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":g.open,"aria-controls":g.contentId,"data-state":S(g.open),...f,ref:h,onClick:(0,c.composeEventHandlers)(a.onClick,g.onOpenToggle)})});y.displayName=x;var z="DialogPortal",[A,B]=s(z,{forceMount:void 0}),C=a=>{let{__scopeDialog:c,forceMount:d,children:e,container:f}=a,g=v(z,c);return(0,q.jsx)(A,{scope:c,forceMount:d,children:b.Children.map(e,a=>(0,q.jsx)(k.Presence,{present:d||g.open,children:(0,q.jsx)(j.Portal,{asChild:!0,container:f,children:a})}))})};C.displayName=z;var D="DialogOverlay",E=b.forwardRef((a,b)=>{let c=B(D,a.__scopeDialog),{forceMount:d=c.forceMount,...e}=a,f=v(D,a.__scopeDialog);return f.modal?(0,q.jsx)(k.Presence,{present:d||f.open,children:(0,q.jsx)(G,{...e,ref:b})}):null});E.displayName=D;var F=(0,p.createSlot)("DialogOverlay.RemoveScroll"),G=b.forwardRef((a,b)=>{let{__scopeDialog:c,...d}=a,e=v(D,c);return(0,q.jsx)(n.RemoveScroll,{as:F,allowPinchZoom:!0,shards:[e.contentRef],children:(0,q.jsx)(l.Primitive.div,{"data-state":S(e.open),...d,ref:b,style:{pointerEvents:"auto",...d.style}})})}),H="DialogContent",I=b.forwardRef((a,b)=>{let c=B(H,a.__scopeDialog),{forceMount:d=c.forceMount,...e}=a,f=v(H,a.__scopeDialog);return(0,q.jsx)(k.Presence,{present:d||f.open,children:f.modal?(0,q.jsx)(J,{...e,ref:b}):(0,q.jsx)(K,{...e,ref:b})})});I.displayName=H;var J=b.forwardRef((a,e)=>{let f=v(H,a.__scopeDialog),g=b.useRef(null),h=(0,d.useComposedRefs)(e,f.contentRef,g);return b.useEffect(()=>{let a=g.current;if(a)return(0,o.hideOthers)(a)},[]),(0,q.jsx)(L,{...a,ref:h,trapFocus:f.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,c.composeEventHandlers)(a.onCloseAutoFocus,a=>{a.preventDefault(),f.triggerRef.current?.focus()}),onPointerDownOutside:(0,c.composeEventHandlers)(a.onPointerDownOutside,a=>{let b=a.detail.originalEvent,c=0===b.button&&!0===b.ctrlKey;(2===b.button||c)&&a.preventDefault()}),onFocusOutside:(0,c.composeEventHandlers)(a.onFocusOutside,a=>a.preventDefault())})}),K=b.forwardRef((a,c)=>{let d=v(H,a.__scopeDialog),e=b.useRef(!1),f=b.useRef(!1);return(0,q.jsx)(L,{...a,ref:c,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:b=>{a.onCloseAutoFocus?.(b),b.defaultPrevented||(e.current||d.triggerRef.current?.focus(),b.preventDefault()),e.current=!1,f.current=!1},onInteractOutside:b=>{a.onInteractOutside?.(b),b.defaultPrevented||(e.current=!0,"pointerdown"===b.detail.originalEvent.type&&(f.current=!0));let c=b.target;d.triggerRef.current?.contains(c)&&b.preventDefault(),"focusin"===b.detail.originalEvent.type&&f.current&&b.preventDefault()}})}),L=b.forwardRef((a,c)=>{let{__scopeDialog:e,trapFocus:f,onOpenAutoFocus:g,onCloseAutoFocus:j,...k}=a,l=v(H,e),n=b.useRef(null),o=(0,d.useComposedRefs)(c,n);return(0,m.useFocusGuards)(),(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(i.FocusScope,{asChild:!0,loop:!0,trapped:f,onMountAutoFocus:g,onUnmountAutoFocus:j,children:(0,q.jsx)(h.DismissableLayer,{role:"dialog",id:l.contentId,"aria-describedby":l.descriptionId,"aria-labelledby":l.titleId,"data-state":S(l.open),...k,ref:o,onDismiss:()=>l.onOpenChange(!1)})}),(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(W,{titleId:l.titleId}),(0,q.jsx)(X,{contentRef:n,descriptionId:l.descriptionId})]})]})}),M="DialogTitle",N=b.forwardRef((a,b)=>{let{__scopeDialog:c,...d}=a,e=v(M,c);return(0,q.jsx)(l.Primitive.h2,{id:e.titleId,...d,ref:b})});N.displayName=M;var O="DialogDescription",P=b.forwardRef((a,b)=>{let{__scopeDialog:c,...d}=a,e=v(O,c);return(0,q.jsx)(l.Primitive.p,{id:e.descriptionId,...d,ref:b})});P.displayName=O;var Q="DialogClose",R=b.forwardRef((a,b)=>{let{__scopeDialog:d,...e}=a,f=v(Q,d);return(0,q.jsx)(l.Primitive.button,{type:"button",...e,ref:b,onClick:(0,c.composeEventHandlers)(a.onClick,()=>f.onOpenChange(!1))})});function S(a){return a?"open":"closed"}R.displayName=Q;var T="DialogTitleWarning",[U,V]=(0,e.createContext)(T,{contentName:H,titleName:M,docsSlug:"dialog"}),W=({titleId:a})=>{let c=V(T),d=`\`${c.contentName}\` requires a \`${c.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${c.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${c.docsSlug}`;return b.useEffect(()=>{a&&(document.getElementById(a)||console.error(d))},[d,a]),null},X=({contentRef:a,descriptionId:c})=>{let d=V("DialogDescriptionWarning"),e=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${d.contentName}}.`;return b.useEffect(()=>{let b=a.current?.getAttribute("aria-describedby");c&&b&&(document.getElementById(c)||console.warn(e))},[e,a,c]),null};a.s(["Close",()=>R,"Content",()=>I,"Description",()=>P,"Overlay",()=>E,"Portal",()=>C,"Root",()=>w,"Title",()=>N,"Trigger",()=>y])},755820,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(242526),e=a.i(363615),f=a.i(422171);let g=d.Root,h=d.Trigger,i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Overlay,{ref:e,className:(0,f.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...c}));i.displayName=d.Overlay.displayName;let j=c.forwardRef(({className:a,children:c,...g},h)=>(0,b.jsxs)(d.Portal,{children:[(0,b.jsx)(i,{}),(0,b.jsxs)(d.Content,{ref:h,className:(0,f.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...g,children:[c,(0,b.jsxs)(d.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,b.jsx)(e.X,{className:"h-4 w-4"}),(0,b.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));j.displayName=d.Content.displayName;let k=({className:a,...c})=>(0,b.jsx)("div",{className:(0,f.cn)("flex flex-col space-y-1.5 text-center sm:text-left",a),...c});k.displayName="DialogHeader";let l=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Title,{ref:e,className:(0,f.cn)("text-lg font-semibold leading-none tracking-tight",a),...c}));l.displayName=d.Title.displayName;let m=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)(d.Description,{ref:e,className:(0,f.cn)("text-sm text-muted-foreground",a),...c}));m.displayName=d.Description.displayName;let n=({className:a,...c})=>(0,b.jsx)("div",{className:(0,f.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",a),...c});n.displayName="DialogFooter",a.s(["Dialog",()=>g,"DialogContent",()=>j,"DialogDescription",()=>m,"DialogFooter",()=>n,"DialogHeader",()=>k,"DialogTitle",()=>l,"DialogTrigger",()=>h])},300827,318303,a=>{"use strict";let b=(0,a.i(367990).default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);a.s(["default",()=>b],318303),a.s(["ChevronRight",()=>b],300827)},510071,651081,a=>{"use strict";let b=(0,a.i(367990).default)("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);a.s(["default",()=>b],651081),a.s(["ChevronLeft",()=>b],510071)},624174,a=>{"use strict";let b=(0,a.i(367990).default)("mouse-pointer",[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]]);a.s(["default",()=>b])},323577,a=>{"use strict";var b=a.i(624174);a.s(["MousePointer",()=>b.default])},682828,a=>{"use strict";let b=(0,a.i(367990).default)("play",[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]);a.s(["default",()=>b])},321279,a=>{"use strict";var b=a.i(682828);a.s(["Play",()=>b.default])},624461,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(772213),e=a.i(394940);class f{static generateCRUDQueries(a,b=[],c={}){let e=a.toLowerCase();a.charAt(0).toLowerCase(),a.slice(1);let f=a.startsWith("ext_"),g=(b.length>0?b:["id","createdAt","updatedAt"]).join("\n    ");Object.keys(c).length>0&&Object.entries(c).forEach(([a,b])=>{g+=`
    ${a} {
      ${b.join("\n      ")}
    }`});let h=f?"JSON":`${a}FilterInput`;return{[`GET_${a.toUpperCase()}S`]:f?d.gql`
          query Get${a}s($filters: ${h}) {
            get${a}s(filters: $filters)
          }
        `:d.gql`
          query Get${a}s($filters: ${h}) {
            get${a}s(filters: $filters) {
              ${g}
            }
          }
        `,[`GET_${a.toUpperCase()}S_PAGINATED`]:f?d.gql`
          query Get${a}sPaginated($filters: ${h}) {
            get${a}sPaginated(filters: $filters)
          }
        `:d.gql`
          query Get${a}sPaginated($filters: ${h}) {
            get${a}sPaginated(filters: $filters) {
              data {
                ${g}
              }
              meta {
                total
                page
                limit
                totalPages
                hasNextPage
                hasPrevPage
              }
            }
          }
        `,[`GET_${a.toUpperCase()}_BY_ID`]:f?d.gql`
          query Get${a}ById($id: ID!, $options: JSON) {
            get${a}ById(id: $id, options: $options)
          }
        `:d.gql`
          query Get${a}ById($id: ID!, $options: JSON) {
            get${a}ById(id: $id, options: $options) {
              ${g}
            }
          }
        `,[`CREATE_${a.toUpperCase()}`]:f?d.gql`
          mutation Create${a}($data: JSON!, $options: JSON) {
            create${a}(data: $data, options: $options)
          }
        `:d.gql`
          mutation Create${a}($data: JSON!, $options: JSON) {
            create${a}(data: $data, options: $options) {
              ${g}
            }
          }
        `,[`CREATE_${a.toUpperCase()}S_BULK`]:f?d.gql`
          mutation Create${a}sBulk($input: JSON!, $options: JSON) {
            create${a}sBulk(input: $input, options: $options)
          }
        `:d.gql`
          mutation Create${a}sBulk($input: JSON!, $options: JSON) {
            create${a}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${g}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPDATE_${a.toUpperCase()}`]:f?d.gql`
          mutation Update${a}($id: ID!, $data: JSON!, $options: JSON) {
            update${a}(id: $id, data: $data, options: $options)
          }
        `:d.gql`
          mutation Update${a}($id: ID!, $data: JSON!, $options: JSON) {
            update${a}(id: $id, data: $data, options: $options) {
              ${g}
            }
          }
        `,[`UPDATE_${a.toUpperCase()}S_BULK`]:f?d.gql`
          mutation Update${a}sBulk($input: JSON!, $options: JSON) {
            update${a}sBulk(input: $input, options: $options)
          }
        `:d.gql`
          mutation Update${a}sBulk($input: JSON!, $options: JSON) {
            update${a}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${g}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`DELETE_${a.toUpperCase()}`]:f?d.gql`
          mutation Delete${a}($id: ID!, $options: JSON) {
            delete${a}(id: $id, options: $options)
          }
        `:d.gql`
          mutation Delete${a}($id: ID!, $options: JSON) {
            delete${a}(id: $id, options: $options) {
              ${g}
            }
          }
        `,[`DELETE_${a.toUpperCase()}S_BULK`]:f?d.gql`
          mutation Delete${a}sBulk($input: JSON!, $options: JSON) {
            delete${a}sBulk(input: $input, options: $options)
          }
        `:d.gql`
          mutation Delete${a}sBulk($input: JSON!, $options: JSON) {
            delete${a}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${g}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPSERT_${a.toUpperCase()}`]:f?d.gql`
          mutation Upsert${a}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${a}(where: $where, create: $create, update: $update, options: $options)
          }
        `:d.gql`
          mutation Upsert${a}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${a}(where: $where, create: $create, update: $update, options: $options) {
              ${g}
            }
          }
        `,[`COUNT_${a.toUpperCase()}S`]:d.gql`
        query Count${a}s($where: JSON) {
          count${a}s(where: $where)
        }
      `,[`${a.toUpperCase()}_EXISTS`]:d.gql`
        query ${a}Exists($where: JSON!) {
          ${e}Exists(where: $where)
        }
      `}}static generateUniversalQueries(){return{DYNAMIC_FIND_MANY:d.gql`
        query DynamicFindMany($modelName: String!, $filter: JSON) {
          dynamicFindMany(modelName: $modelName, filter: $filter)
        }
      `,DYNAMIC_FIND_BY_ID:d.gql`
        query DynamicFindById($modelName: String!, $id: ID!, $options: JSON) {
          dynamicFindById(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE:d.gql`
        mutation DynamicCreate($modelName: String!, $data: JSON!, $options: JSON) {
          dynamicCreate(modelName: $modelName, data: $data, options: $options)
        }
      `,DYNAMIC_UPDATE:d.gql`
        mutation DynamicUpdate($modelName: String!, $id: ID!, $data: JSON!, $options: JSON) {
          dynamicUpdate(modelName: $modelName, id: $id, data: $data, options: $options)
        }
      `,DYNAMIC_DELETE:d.gql`
        mutation DynamicDelete($modelName: String!, $id: ID!, $options: JSON) {
          dynamicDelete(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE_BULK:d.gql`
        mutation DynamicCreateBulk($modelName: String!, $input: JSON!, $options: JSON) {
          dynamicCreateBulk(modelName: $modelName, input: $input, options: $options) {
            success
            count
            data
            errors {
              index
              error
              data
            }
          }
        }
      `,DYNAMIC_UPDATE_BULK:d.gql`
        mutation DynamicUpdateBulk($modelName: String!, $input: JSON!, $options: JSON) {
          dynamicUpdateBulk(modelName: $modelName, input: $input, options: $options) {
            success
            count
            data
            errors {
              index
              error
              data
            }
          }
        }
      `,DYNAMIC_DELETE_BULK:d.gql`
        mutation DynamicDeleteBulk($modelName: String!, $input: JSON!, $options: JSON) {
          dynamicDeleteBulk(modelName: $modelName, input: $input, options: $options) {
            success
            count
            data
            errors {
              index
              error
              data
            }
          }
        }
      `}}static generateQueriesWithFragments(a,b){let c=a.toUpperCase();return{[`GET_${c}S_WITH_FRAGMENT`]:d.gql`
        ${b}
        query Get${a}s($filter: JSON) {
          get${a}s(filter: $filter) {
            ...${a}Fragment
          }
        }
      `,[`CREATE_${c}_WITH_FRAGMENT`]:d.gql`
        ${b}
        mutation Create${a}($data: JSON!, $options: JSON) {
          create${a}(data: $data, options: $options) {
            ...${a}Fragment
          }
        }
      `,[`UPDATE_${c}_WITH_FRAGMENT`]:d.gql`
        ${b}
        mutation Update${a}($id: ID!, $data: JSON!, $options: JSON) {
          update${a}(id: $id, data: $data, options: $options) {
            ...${a}Fragment
          }
        }
      `}}}e.USER_FRAGMENT,e.POST_FRAGMENT,d.gql`
    fragment DynamicTaskFragment on Task {
      id
      title
      description
      category
      priority
      status
      dueDate
      userId
      createdAt
      updatedAt
    }
  `,e.COMMENT_FRAGMENT;let g=f.generateCRUDQueries("User",["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"]),h=f.generateCRUDQueries("Post",["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"]),i=f.generateCRUDQueries("Task",["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"]),j=f.generateCRUDQueries("Comment",["id","content","postId","userId","parentId","createdAt","updatedAt"]),k=f.generateUniversalQueries();Object.entries({User:["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"],Post:["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"],Task:["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"],Comment:["id","content","postId","userId","parentId","createdAt","updatedAt"],Tag:["id","name","slug","description","color","createdAt","updatedAt"],Media:["id","filename","fileUrl","fileSize","mimeType","uploadedById","createdAt"],TaskComment:["id","content","taskId","authorId","parentId","createdAt","updatedAt"],TaskShare:["id","taskId","userId","permission","shareToken","expiresAt","isActive","createdAt"],TaskMedia:["id","filename","url","type","size","mimeType","taskId","uploadedBy","createdAt"]}).reduce((a,[b,c])=>(a[b]=f.generateCRUDQueries(b,c),a),{});let{GET_USERS:l,GET_USERS_PAGINATED:m,GET_USER_BY_ID:n,CREATE_USER:o,CREATE_USERS_BULK:p,UPDATE_USER:q,UPDATE_USERS_BULK:r,DELETE_USER:s,DELETE_USERS_BULK:t,UPSERT_USER:u,COUNT_USERS:v,USER_EXISTS:w}=g,{GET_POSTS:x,GET_POSTS_PAGINATED:y,GET_POST_BY_ID:z,CREATE_POST:A,CREATE_POSTS_BULK:B,UPDATE_POST:C,UPDATE_POSTS_BULK:D,DELETE_POST:E,DELETE_POSTS_BULK:F,UPSERT_POST:G,COUNT_POSTS:H,POST_EXISTS:I}=h,{GET_TASKS:J,GET_TASKS_PAGINATED:K,GET_TASK_BY_ID:L,CREATE_TASK:M,CREATE_TASKS_BULK:N,UPDATE_TASK:O,UPDATE_TASKS_BULK:P,DELETE_TASK:Q,DELETE_TASKS_BULK:R,UPSERT_TASK:S,COUNT_TASKS:T,TASK_EXISTS:U}=i,{GET_COMMENTS:V,GET_COMMENTS_PAGINATED:W,GET_COMMENT_BY_ID:X,CREATE_COMMENT:Y,CREATE_COMMENTS_BULK:Z,UPDATE_COMMENT:$,UPDATE_COMMENTS_BULK:_,DELETE_COMMENT:aa,DELETE_COMMENTS_BULK:ab,UPSERT_COMMENT:ac,COUNT_COMMENTS:ad,COMMENT_EXISTS:ae}=j,{DYNAMIC_FIND_MANY:af,DYNAMIC_FIND_BY_ID:ag,DYNAMIC_CREATE:ah,DYNAMIC_UPDATE:ai,DYNAMIC_DELETE:aj,DYNAMIC_CREATE_BULK:ak,DYNAMIC_UPDATE_BULK:al,DYNAMIC_DELETE_BULK:am}=k;var an=a.i(651332);function ao(a,c,d={}){let{fields:e,nestedFields:g,...h}=d,i=(0,an.useMemo)(()=>{let b=f.generateCRUDQueries(c,e);switch(a){case"GET_ALL":return b[`GET_${c.toUpperCase()}S`];case"GET_PAGINATED":return b[`GET_${c.toUpperCase()}S_PAGINATED`];case"GET_BY_ID":return b[`GET_${c.toUpperCase()}_BY_ID`];default:throw Error(`Unsupported operation type: ${a}`)}},[a,c,e,g]);return(0,b.useQuery)(i,h)}function ap(a,b,d={}){let{fields:e,nestedFields:g,...h}=d,i=(0,an.useMemo)(()=>{let c=f.generateCRUDQueries(b,e);switch(a){case"CREATE":return c[`CREATE_${b.toUpperCase()}`];case"CREATE_BULK":return c[`CREATE_${b.toUpperCase()}S_BULK`];case"UPDATE":return c[`UPDATE_${b.toUpperCase()}`];case"UPDATE_BULK":return c[`UPDATE_${b.toUpperCase()}S_BULK`];case"DELETE":return c[`DELETE_${b.toUpperCase()}`];case"DELETE_BULK":return c[`DELETE_${b.toUpperCase()}S_BULK`];default:throw Error(`Unsupported operation type: ${a}`)}},[a,b,e,g]);return(0,c.useMutation)(i,h)}function aq(a){let b=function(a,b={}){return ao("GET_ALL",a,b)}(a),c=function(a,b={}){return ao("GET_PAGINATED",a,b)}(a),[d]=function(a,b={}){return ap("CREATE",a,b)}(a),[e]=function(a,b={}){return ap("CREATE_BULK",a,b)}(a),[f]=function(a,b={}){return ap("UPDATE",a,b)}(a),[g]=function(a,b={}){return ap("UPDATE_BULK",a,b)}(a),[h]=function(a,b={}){return ap("DELETE",a,b)}(a),[i]=function(a,b={}){return ap("DELETE_BULK",a,b)}(a);return{getAll:b,getPaginated:c,getById:(0,an.useCallback)(b=>(function(a,b={}){return ao("GET_BY_ID",a,b)})(a,{variables:{id:b}}),[a]),create:d,createBulk:e,update:f,updateBulk:g,delete:h,deleteBulk:i}}function ar(a){return a&&a.graphQLErrors&&void 0!==a.networkError}function as(a){return a.graphQLErrors.length>0?a.graphQLErrors.map(a=>a.message).join(", "):a.networkError?`Network error: ${a.networkError.message}`:a.message||"Unknown GraphQL error"}a.s(["formatDynamicGraphQLError",()=>as,"isDynamicGraphQLError",()=>ar,"useCRUD",()=>aq,"useDynamicMutation",()=>ap,"useDynamicQuery",()=>ao],624461)},35383,a=>{"use strict";let b=(0,a.i(367990).default)("panels-top-left",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M9 21V9",key:"1oto5p"}]]);a.s(["default",()=>b])},769251,a=>{"use strict";var b=a.i(35383);a.s(["Layout",()=>b.default])}];

//# sourceMappingURL=_5b368e41._.js.map