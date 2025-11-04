(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(873273),i=a.forwardRef((e,a)=>(0,t.jsx)(r.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));i.displayName="Label";var o=e.i(541428);function s({className:e,...a}){return(0,t.jsx)(i,{"data-slot":"label",className:(0,o.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>s],165429)},600547,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(541428);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("textarea",{className:(0,r.cn)("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",e),ref:i,...a}));i.displayName="Textarea",e.s(["Textarea",()=>i])},874061,e=>{"use strict";let t=(0,e.i(930702).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["default",()=>t])},138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},994315,e=>{"use strict";let t=(0,e.i(930702).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["default",()=>t])},606443,e=>{"use strict";var t=e.i(994315);e.s(["Plus",()=>t.default])},580523,e=>{"use strict";var t=e.i(403055),a=e.i(119836),r=e.i(569658),i=e.i(316618),o=e.i(559663),s=e.i(346412),n=e.i(430840),l=e.i(621829),d=e.i(581263),u=e.i(767478),c=e.i(873273),p=e.i(767835),f=e.i(896438),g=e.i(739045),m=e.i(599488),v=e.i(44990),y="Dialog",[h,b]=(0,i.createContextScope)(y),[P,C]=h(y),R=e=>{let{__scopeDialog:a,children:r,open:i,defaultOpen:n,onOpenChange:l,modal:d=!0}=e,u=t.useRef(null),c=t.useRef(null),[p,f]=(0,s.useControllableState)({prop:i,defaultProp:n??!1,onChange:l,caller:y});return(0,v.jsx)(P,{scope:a,triggerRef:u,contentRef:c,contentId:(0,o.useId)(),titleId:(0,o.useId)(),descriptionId:(0,o.useId)(),open:p,onOpenChange:f,onOpenToggle:t.useCallback(()=>f(e=>!e),[f]),modal:d,children:r})};R.displayName=y;var T="DialogTrigger",x=t.forwardRef((e,t)=>{let{__scopeDialog:i,...o}=e,s=C(T,i),n=(0,r.useComposedRefs)(t,s.triggerRef);return(0,v.jsx)(c.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":s.open,"aria-controls":s.contentId,"data-state":L(s.open),...o,ref:n,onClick:(0,a.composeEventHandlers)(e.onClick,s.onOpenToggle)})});x.displayName=T;var w="DialogPortal",[D,F]=h(w,{forceMount:void 0}),A=e=>{let{__scopeDialog:a,forceMount:r,children:i,container:o}=e,s=C(w,a);return(0,v.jsx)(D,{scope:a,forceMount:r,children:t.Children.map(i,e=>(0,v.jsx)(u.Presence,{present:r||s.open,children:(0,v.jsx)(d.Portal,{asChild:!0,container:o,children:e})}))})};A.displayName=w;var E="DialogOverlay",I=t.forwardRef((e,t)=>{let a=F(E,e.__scopeDialog),{forceMount:r=a.forceMount,...i}=e,o=C(E,e.__scopeDialog);return o.modal?(0,v.jsx)(u.Presence,{present:r||o.open,children:(0,v.jsx)(_,{...i,ref:t})}):null});I.displayName=E;var N=(0,m.createSlot)("DialogOverlay.RemoveScroll"),_=t.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,i=C(E,a);return(0,v.jsx)(f.RemoveScroll,{as:N,allowPinchZoom:!0,shards:[i.contentRef],children:(0,v.jsx)(c.Primitive.div,{"data-state":L(i.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),$="DialogContent",k=t.forwardRef((e,t)=>{let a=F($,e.__scopeDialog),{forceMount:r=a.forceMount,...i}=e,o=C($,e.__scopeDialog);return(0,v.jsx)(u.Presence,{present:r||o.open,children:o.modal?(0,v.jsx)(j,{...i,ref:t}):(0,v.jsx)(S,{...i,ref:t})})});k.displayName=$;var j=t.forwardRef((e,i)=>{let o=C($,e.__scopeDialog),s=t.useRef(null),n=(0,r.useComposedRefs)(i,o.contentRef,s);return t.useEffect(()=>{let e=s.current;if(e)return(0,g.hideOthers)(e)},[]),(0,v.jsx)(O,{...e,ref:n,trapFocus:o.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,a.composeEventHandlers)(e.onCloseAutoFocus,e=>{e.preventDefault(),o.triggerRef.current?.focus()}),onPointerDownOutside:(0,a.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,a=0===t.button&&!0===t.ctrlKey;(2===t.button||a)&&e.preventDefault()}),onFocusOutside:(0,a.composeEventHandlers)(e.onFocusOutside,e=>e.preventDefault())})}),S=t.forwardRef((e,a)=>{let r=C($,e.__scopeDialog),i=t.useRef(!1),o=t.useRef(!1);return(0,v.jsx)(O,{...e,ref:a,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(i.current||r.triggerRef.current?.focus(),t.preventDefault()),i.current=!1,o.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(i.current=!0,"pointerdown"===t.detail.originalEvent.type&&(o.current=!0));let a=t.target;r.triggerRef.current?.contains(a)&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&o.current&&t.preventDefault()}})}),O=t.forwardRef((e,a)=>{let{__scopeDialog:i,trapFocus:o,onOpenAutoFocus:s,onCloseAutoFocus:d,...u}=e,c=C($,i),f=t.useRef(null),g=(0,r.useComposedRefs)(a,f);return(0,p.useFocusGuards)(),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(l.FocusScope,{asChild:!0,loop:!0,trapped:o,onMountAutoFocus:s,onUnmountAutoFocus:d,children:(0,v.jsx)(n.DismissableLayer,{role:"dialog",id:c.contentId,"aria-describedby":c.descriptionId,"aria-labelledby":c.titleId,"data-state":L(c.open),...u,ref:g,onDismiss:()=>c.onOpenChange(!1)})}),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(Y,{titleId:c.titleId}),(0,v.jsx)(W,{contentRef:f,descriptionId:c.descriptionId})]})]})}),M="DialogTitle",G=t.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,i=C(M,a);return(0,v.jsx)(c.Primitive.h2,{id:i.titleId,...r,ref:t})});G.displayName=M;var U="DialogDescription",q=t.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,i=C(U,a);return(0,v.jsx)(c.Primitive.p,{id:i.descriptionId,...r,ref:t})});q.displayName=U;var B="DialogClose",V=t.forwardRef((e,t)=>{let{__scopeDialog:r,...i}=e,o=C(B,r);return(0,v.jsx)(c.Primitive.button,{type:"button",...i,ref:t,onClick:(0,a.composeEventHandlers)(e.onClick,()=>o.onOpenChange(!1))})});function L(e){return e?"open":"closed"}V.displayName=B;var H="DialogTitleWarning",[K,z]=(0,i.createContext)(H,{contentName:$,titleName:M,docsSlug:"dialog"}),Y=({titleId:e})=>{let a=z(H),r=`\`${a.contentName}\` requires a \`${a.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${a.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${a.docsSlug}`;return t.useEffect(()=>{e&&(document.getElementById(e)||console.error(r))},[r,e]),null},W=({contentRef:e,descriptionId:a})=>{let r=z("DialogDescriptionWarning"),i=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${r.contentName}}.`;return t.useEffect(()=>{let t=e.current?.getAttribute("aria-describedby");a&&t&&(document.getElementById(a)||console.warn(i))},[i,e,a]),null};e.s(["Close",()=>V,"Content",()=>k,"Description",()=>q,"Overlay",()=>I,"Portal",()=>A,"Root",()=>R,"Title",()=>G,"Trigger",()=>x])},137651,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(580523),i=e.i(888540),o=e.i(541428);let s=r.Root,n=r.Trigger,l=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(r.Overlay,{ref:i,className:(0,o.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...a}));l.displayName=r.Overlay.displayName;let d=a.forwardRef(({className:e,children:a,...s},n)=>(0,t.jsxs)(r.Portal,{children:[(0,t.jsx)(l,{}),(0,t.jsxs)(r.Content,{ref:n,className:(0,o.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...s,children:[a,(0,t.jsxs)(r.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,t.jsx)(i.X,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));d.displayName=r.Content.displayName;let u=({className:e,...a})=>(0,t.jsx)("div",{className:(0,o.cn)("flex flex-col space-y-1.5 text-center sm:text-left",e),...a});u.displayName="DialogHeader";let c=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(r.Title,{ref:i,className:(0,o.cn)("text-lg font-semibold leading-none tracking-tight",e),...a}));c.displayName=r.Title.displayName;let p=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)(r.Description,{ref:i,className:(0,o.cn)("text-sm text-muted-foreground",e),...a}));p.displayName=r.Description.displayName;let f=({className:e,...a})=>(0,t.jsx)("div",{className:(0,o.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...a});f.displayName="DialogFooter",e.s(["Dialog",()=>s,"DialogContent",()=>d,"DialogDescription",()=>p,"DialogFooter",()=>f,"DialogHeader",()=>u,"DialogTitle",()=>c,"DialogTrigger",()=>n])},377991,e=>{"use strict";var t=e.i(403055),a=e.i(119836),r=e.i(110964),i=e.i(569658),o=e.i(316618),s=e.i(559663),n=e.i(873273),l=e.i(214018),d=e.i(346412),u=e.i(825198),c=e.i(44990),p="rovingFocusGroup.onEntryFocus",f={bubbles:!1,cancelable:!0},g="RovingFocusGroup",[m,v,y]=(0,r.createCollection)(g),[h,b]=(0,o.createContextScope)(g,[y]),[P,C]=h(g),R=t.forwardRef((e,t)=>(0,c.jsx)(m.Provider,{scope:e.__scopeRovingFocusGroup,children:(0,c.jsx)(m.Slot,{scope:e.__scopeRovingFocusGroup,children:(0,c.jsx)(T,{...e,ref:t})})}));R.displayName=g;var T=t.forwardRef((e,r)=>{let{__scopeRovingFocusGroup:o,orientation:s,loop:m=!1,dir:y,currentTabStopId:h,defaultCurrentTabStopId:b,onCurrentTabStopIdChange:C,onEntryFocus:R,preventScrollOnEntryFocus:T=!1,...x}=e,w=t.useRef(null),D=(0,i.useComposedRefs)(r,w),A=(0,u.useDirection)(y),[E,I]=(0,d.useControllableState)({prop:h,defaultProp:b??null,onChange:C,caller:g}),[N,_]=t.useState(!1),$=(0,l.useCallbackRef)(R),k=v(o),j=t.useRef(!1),[S,O]=t.useState(0);return t.useEffect(()=>{let e=w.current;if(e)return e.addEventListener(p,$),()=>e.removeEventListener(p,$)},[$]),(0,c.jsx)(P,{scope:o,orientation:s,dir:A,loop:m,currentTabStopId:E,onItemFocus:t.useCallback(e=>I(e),[I]),onItemShiftTab:t.useCallback(()=>_(!0),[]),onFocusableItemAdd:t.useCallback(()=>O(e=>e+1),[]),onFocusableItemRemove:t.useCallback(()=>O(e=>e-1),[]),children:(0,c.jsx)(n.Primitive.div,{tabIndex:N||0===S?-1:0,"data-orientation":s,...x,ref:D,style:{outline:"none",...e.style},onMouseDown:(0,a.composeEventHandlers)(e.onMouseDown,()=>{j.current=!0}),onFocus:(0,a.composeEventHandlers)(e.onFocus,e=>{let t=!j.current;if(e.target===e.currentTarget&&t&&!N){let t=new CustomEvent(p,f);if(e.currentTarget.dispatchEvent(t),!t.defaultPrevented){let e=k().filter(e=>e.focusable);F([e.find(e=>e.active),e.find(e=>e.id===E),...e].filter(Boolean).map(e=>e.ref.current),T)}}j.current=!1}),onBlur:(0,a.composeEventHandlers)(e.onBlur,()=>_(!1))})})}),x="RovingFocusGroupItem",w=t.forwardRef((e,r)=>{let{__scopeRovingFocusGroup:i,focusable:o=!0,active:l=!1,tabStopId:d,children:u,...p}=e,f=(0,s.useId)(),g=d||f,y=C(x,i),h=y.currentTabStopId===g,b=v(i),{onFocusableItemAdd:P,onFocusableItemRemove:R,currentTabStopId:T}=y;return t.useEffect(()=>{if(o)return P(),()=>R()},[o,P,R]),(0,c.jsx)(m.ItemSlot,{scope:i,id:g,focusable:o,active:l,children:(0,c.jsx)(n.Primitive.span,{tabIndex:h?0:-1,"data-orientation":y.orientation,...p,ref:r,onMouseDown:(0,a.composeEventHandlers)(e.onMouseDown,e=>{o?y.onItemFocus(g):e.preventDefault()}),onFocus:(0,a.composeEventHandlers)(e.onFocus,()=>y.onItemFocus(g)),onKeyDown:(0,a.composeEventHandlers)(e.onKeyDown,e=>{if("Tab"===e.key&&e.shiftKey)return void y.onItemShiftTab();if(e.target!==e.currentTarget)return;let t=function(e,t,a){var r;let i=(r=e.key,"rtl"!==a?r:"ArrowLeft"===r?"ArrowRight":"ArrowRight"===r?"ArrowLeft":r);if(!("vertical"===t&&["ArrowLeft","ArrowRight"].includes(i))&&!("horizontal"===t&&["ArrowUp","ArrowDown"].includes(i)))return D[i]}(e,y.orientation,y.dir);if(void 0!==t){if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;e.preventDefault();let i=b().filter(e=>e.focusable).map(e=>e.ref.current);if("last"===t)i.reverse();else if("prev"===t||"next"===t){var a,r;"prev"===t&&i.reverse();let o=i.indexOf(e.currentTarget);i=y.loop?(a=i,r=o+1,a.map((e,t)=>a[(r+t)%a.length])):i.slice(o+1)}setTimeout(()=>F(i))}}),children:"function"==typeof u?u({isCurrentTabStop:h,hasTabStop:null!=T}):u})})});w.displayName=x;var D={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function F(e,t=!1){let a=document.activeElement;for(let r of e)if(r===a||(r.focus({preventScroll:t}),document.activeElement!==a))return}e.s(["Item",()=>w,"Root",()=>R,"createRovingFocusGroupScope",()=>b])},996517,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(119836),i=e.i(316618),o=e.i(377991),s=e.i(767478),n=e.i(873273),l=e.i(825198),d=e.i(346412),u=e.i(559663),c="Tabs",[p,f]=(0,i.createContextScope)(c,[o.createRovingFocusGroupScope]),g=(0,o.createRovingFocusGroupScope)(),[m,v]=p(c),y=a.forwardRef((e,a)=>{let{__scopeTabs:r,value:i,onValueChange:o,defaultValue:s,orientation:p="horizontal",dir:f,activationMode:g="automatic",...v}=e,y=(0,l.useDirection)(f),[h,b]=(0,d.useControllableState)({prop:i,onChange:o,defaultProp:s??"",caller:c});return(0,t.jsx)(m,{scope:r,baseId:(0,u.useId)(),value:h,onValueChange:b,orientation:p,dir:y,activationMode:g,children:(0,t.jsx)(n.Primitive.div,{dir:y,"data-orientation":p,...v,ref:a})})});y.displayName=c;var h="TabsList",b=a.forwardRef((e,a)=>{let{__scopeTabs:r,loop:i=!0,...s}=e,l=v(h,r),d=g(r);return(0,t.jsx)(o.Root,{asChild:!0,...d,orientation:l.orientation,dir:l.dir,loop:i,children:(0,t.jsx)(n.Primitive.div,{role:"tablist","aria-orientation":l.orientation,...s,ref:a})})});b.displayName=h;var P="TabsTrigger",C=a.forwardRef((e,a)=>{let{__scopeTabs:i,value:s,disabled:l=!1,...d}=e,u=v(P,i),c=g(i),p=x(u.baseId,s),f=w(u.baseId,s),m=s===u.value;return(0,t.jsx)(o.Item,{asChild:!0,...c,focusable:!l,active:m,children:(0,t.jsx)(n.Primitive.button,{type:"button",role:"tab","aria-selected":m,"aria-controls":f,"data-state":m?"active":"inactive","data-disabled":l?"":void 0,disabled:l,id:p,...d,ref:a,onMouseDown:(0,r.composeEventHandlers)(e.onMouseDown,e=>{l||0!==e.button||!1!==e.ctrlKey?e.preventDefault():u.onValueChange(s)}),onKeyDown:(0,r.composeEventHandlers)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&u.onValueChange(s)}),onFocus:(0,r.composeEventHandlers)(e.onFocus,()=>{let e="manual"!==u.activationMode;m||l||!e||u.onValueChange(s)})})})});C.displayName=P;var R="TabsContent",T=a.forwardRef((e,r)=>{let{__scopeTabs:i,value:o,forceMount:l,children:d,...u}=e,c=v(R,i),p=x(c.baseId,o),f=w(c.baseId,o),g=o===c.value,m=a.useRef(g);return a.useEffect(()=>{let e=requestAnimationFrame(()=>m.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,t.jsx)(s.Presence,{present:l||g,children:({present:a})=>(0,t.jsx)(n.Primitive.div,{"data-state":g?"active":"inactive","data-orientation":c.orientation,role:"tabpanel","aria-labelledby":p,hidden:!a,id:f,tabIndex:0,...u,ref:r,style:{...e.style,animationDuration:m.current?"0s":void 0},children:a&&d})})});function x(e,t){return`${e}-trigger-${t}`}function w(e,t){return`${e}-content-${t}`}T.displayName=R;var D=e.i(541428);let F=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(b,{ref:r,className:(0,D.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",e),...a}));F.displayName=b.displayName;let A=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(C,{ref:r,className:(0,D.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",e),...a}));A.displayName=C.displayName;let E=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(T,{ref:r,className:(0,D.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",e),...a}));E.displayName=T.displayName,e.s(["Tabs",()=>y,"TabsContent",()=>E,"TabsList",()=>F,"TabsTrigger",()=>A],996517)},833350,e=>{"use strict";let t=(0,e.i(930702).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);e.s(["default",()=>t])},791174,e=>{"use strict";var t=e.i(833350);e.s(["RefreshCw",()=>t.default])},706547,241144,e=>{"use strict";let t=(0,e.i(930702).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["default",()=>t],241144),e.s(["Settings",()=>t],706547)},276664,e=>{"use strict";var t=e.i(44990),a=e.i(403055),r=e.i(119836),i=e.i(569658),o=e.i(316618),s=e.i(346412),n=e.i(139540),l=e.i(471203),d=e.i(873273),u="Switch",[c,p]=(0,o.createContextScope)(u),[f,g]=c(u),m=a.forwardRef((e,o)=>{let{__scopeSwitch:n,name:l,checked:c,defaultChecked:p,required:g,disabled:m,value:v="on",onCheckedChange:y,form:P,...C}=e,[R,T]=a.useState(null),x=(0,i.useComposedRefs)(o,e=>T(e)),w=a.useRef(!1),D=!R||P||!!R.closest("form"),[F,A]=(0,s.useControllableState)({prop:c,defaultProp:p??!1,onChange:y,caller:u});return(0,t.jsxs)(f,{scope:n,checked:F,disabled:m,children:[(0,t.jsx)(d.Primitive.button,{type:"button",role:"switch","aria-checked":F,"aria-required":g,"data-state":b(F),"data-disabled":m?"":void 0,disabled:m,value:v,...C,ref:x,onClick:(0,r.composeEventHandlers)(e.onClick,e=>{A(e=>!e),D&&(w.current=e.isPropagationStopped(),w.current||e.stopPropagation())})}),D&&(0,t.jsx)(h,{control:R,bubbles:!w.current,name:l,value:v,checked:F,required:g,disabled:m,form:P,style:{transform:"translateX(-100%)"}})]})});m.displayName=u;var v="SwitchThumb",y=a.forwardRef((e,a)=>{let{__scopeSwitch:r,...i}=e,o=g(v,r);return(0,t.jsx)(d.Primitive.span,{"data-state":b(o.checked),"data-disabled":o.disabled?"":void 0,...i,ref:a})});y.displayName=v;var h=a.forwardRef(({__scopeSwitch:e,control:r,checked:o,bubbles:s=!0,...d},u)=>{let c=a.useRef(null),p=(0,i.useComposedRefs)(c,u),f=(0,n.usePrevious)(o),g=(0,l.useSize)(r);return a.useEffect(()=>{let e=c.current;if(!e)return;let t=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(f!==o&&t){let a=new Event("click",{bubbles:s});t.call(e,o),e.dispatchEvent(a)}},[f,o,s]),(0,t.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:o,...d,tabIndex:-1,ref:p,style:{...d.style,...g,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});function b(e){return e?"checked":"unchecked"}h.displayName="SwitchBubbleInput";var P=e.i(541428);let C=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(m,{className:(0,P.cn)("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",e),...a,ref:r,children:(0,t.jsx)(y,{className:(0,P.cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})}));C.displayName=m.displayName,e.s(["Switch",()=>C],276664)},222086,e=>{"use strict";let t=(0,e.i(930702).default)("database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);e.s(["default",()=>t])},257725,e=>{"use strict";var t=e.i(222086);e.s(["Database",()=>t.default])},574375,e=>{"use strict";var t=e.i(984804);let a=t.gql`
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
`,r=t.gql`
  ${a}
  fragment CategoryWithCountFields on CategoryType {
    ...CategoryBasicFields
    productCount
  }
`,i=t.gql`
  ${r}
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
`,o=t.gql`
  fragment ProductImageFields on ProductImageType {
    id
    url
    alt
    isPrimary
    order
    createdAt
  }
`,s=t.gql`
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
`;t.gql`
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
`;let n=t.gql`
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
`,l=t.gql`
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
`,d=t.gql`
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
`;e.s(["CATEGORY_BASIC_FRAGMENT",0,a,"CATEGORY_TREE_FRAGMENT",0,i,"CATEGORY_WITH_COUNT_FRAGMENT",0,r,"COMMENT_FRAGMENT",0,d,"POST_FRAGMENT",0,l,"PRODUCT_IMAGE_FRAGMENT",0,o,"PRODUCT_VARIANT_FRAGMENT",0,s,"USER_FRAGMENT",0,n])},355422,e=>{"use strict";var t=e.i(984804),a=e.i(574375);let r=a.PRODUCT_IMAGE_FRAGMENT,i=a.PRODUCT_VARIANT_FRAGMENT,o=t.gql`
  fragment ProductBasicFields on ProductType {
    id
    name
    slug
    description
    shortDesc
    sku
    barcode
    price
    originalPrice
    costPrice
    unit
    stock
    minStock
    status
    thumbnail
    origin
    createdAt
    updatedAt
  }
`,s=t.gql`
  ${o}
  ${r}
  ${i}
  ${a.CATEGORY_BASIC_FRAGMENT}
  fragment ProductFullFields on ProductType {
    ...ProductBasicFields
    category {
      ...CategoryBasicFields
    }
    images {
      ...ProductImageFields
    }
    variants {
      ...ProductVariantFields
    }
    isFeatured
    isNewArrival
    isBestSeller
    isOnSale
    weight
    attributes
    metaTitle
    metaDescription
    metaKeywords
  }
`,n=t.gql`
  ${o}
  ${a.CATEGORY_BASIC_FRAGMENT}
  query GetProducts($input: GetProductsInput) {
    products(input: $input) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
      }
      total
      page
      limit
      totalPages
    }
  }
`,l=t.gql`
  ${s}
  query GetProduct($id: ID!) {
    product(id: $id) {
      ...ProductFullFields
    }
  }
`,d=t.gql`
  ${s}
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFullFields
    }
  }
`,u=t.gql`
  ${o}
  query GetProductsByCategory($categoryId: ID!, $input: GetProductsInput) {
    productsByCategory(categoryId: $categoryId, input: $input) {
      items {
        ...ProductBasicFields
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
      }
      total
      page
      limit
      totalPages
    }
  }
`,c=t.gql`
  ${o}
  ${a.CATEGORY_BASIC_FRAGMENT}
  query GetFeaturedProducts($limit: Int) {
    products(input: { 
      filters: { isFeatured: true }
      limit: $limit
      sortBy: "createdAt"
      sortOrder: DESC
    }) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        discountPercentage
      }
      total
    }
  }
`,p=t.gql`
  ${o}
  ${a.CATEGORY_BASIC_FRAGMENT}
  query SearchProducts($search: String!, $limit: Int, $page: Int) {
    products(input: { 
      filters: { search: $search }
      limit: $limit
      page: $page
    }) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        discountPercentage
      }
      total
      page
      limit
      totalPages
    }
  }
`;t.gql`
  ${o}
  ${a.CATEGORY_BASIC_FRAGMENT}
  query GetCheapProducts($input: GetProductsInput) {
    products(input: $input) {
      items {
        ...ProductBasicFields
        category {
          ...CategoryBasicFields
        }
        isFeatured
        isNewArrival
        isBestSeller
        isOnSale
      }
      total
      page
      limit
      totalPages
    }
  }
`;let f=t.gql`
  ${s}
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,g=t.gql`
  ${s}
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,m=t.gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`,v=t.gql`
  ${o}
  mutation UpdateProductStock($id: ID!, $quantity: Float!) {
    updateProductStock(id: $id, quantity: $quantity) {
      ...ProductBasicFields
    }
  }
`,y=t.gql`
  ${r}
  mutation AddProductImage($input: CreateProductImageInput!) {
    addProductImage(input: $input) {
      ...ProductImageFields
    }
  }
`,h=t.gql`
  mutation DeleteProductImage($id: ID!) {
    deleteProductImage(id: $id)
  }
`,b=t.gql`
  ${i}
  mutation AddProductVariant($input: CreateProductVariantInput!) {
    addProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,P=t.gql`
  ${i}
  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
    updateProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,C=t.gql`
  mutation DeleteProductVariant($id: ID!) {
    deleteProductVariant(id: $id)
  }
`;e.s(["ADD_PRODUCT_IMAGE",0,y,"ADD_PRODUCT_VARIANT",0,b,"CREATE_PRODUCT",0,f,"DELETE_PRODUCT",0,m,"DELETE_PRODUCT_IMAGE",0,h,"DELETE_PRODUCT_VARIANT",0,C,"GET_FEATURED_PRODUCTS",0,c,"GET_PRODUCT",0,l,"GET_PRODUCTS",0,n,"GET_PRODUCTS_BY_CATEGORY",0,u,"GET_PRODUCT_BY_SLUG",0,d,"PRODUCT_FULL_FRAGMENT",0,s,"SEARCH_PRODUCTS",0,p,"UPDATE_PRODUCT",0,g,"UPDATE_PRODUCT_STOCK",0,v,"UPDATE_PRODUCT_VARIANT",0,P])},494753,e=>{"use strict";let t=(0,e.i(930702).default)("pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);e.s(["default",()=>t])},31968,e=>{"use strict";var t=e.i(494753);e.s(["Pencil",()=>t.default])},288438,e=>{"use strict";let t=(0,e.i(930702).default)("move-up",[["path",{d:"M8 6L12 2L16 6",key:"1yvkyx"}],["path",{d:"M12 2V22",key:"r89rzk"}]]);e.s(["default",()=>t])},819720,e=>{"use strict";let t=(0,e.i(930702).default)("move-down",[["path",{d:"M8 18L12 22L16 18",key:"cskvfv"}],["path",{d:"M12 2V22",key:"r89rzk"}]]);e.s(["default",()=>t])}]);