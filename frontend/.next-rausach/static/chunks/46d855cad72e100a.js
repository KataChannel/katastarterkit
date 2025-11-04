(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,874061,e=>{"use strict";let t=(0,e.i(930702).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["default",()=>t])},138227,e=>{"use strict";var t=e.i(874061);e.s(["Trash2",()=>t.default])},591353,e=>{"use strict";let t=(0,e.i(930702).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["default",()=>t])},404210,e=>{"use strict";var t=e.i(591353);e.s(["Eye",()=>t.default])},996517,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(119836),r=e.i(316618),i=e.i(377991),n=e.i(767478),o=e.i(873273),l=e.i(825198),d=e.i(346412),c=e.i(559663),u="Tabs",[p,m]=(0,r.createContextScope)(u,[i.createRovingFocusGroupScope]),f=(0,i.createRovingFocusGroupScope)(),[g,h]=p(u),x=a.forwardRef((e,a)=>{let{__scopeTabs:s,value:r,onValueChange:i,defaultValue:n,orientation:p="horizontal",dir:m,activationMode:f="automatic",...h}=e,x=(0,l.useDirection)(m),[y,v]=(0,d.useControllableState)({prop:r,onChange:i,defaultProp:n??"",caller:u});return(0,t.jsx)(g,{scope:s,baseId:(0,c.useId)(),value:y,onValueChange:v,orientation:p,dir:x,activationMode:f,children:(0,t.jsx)(o.Primitive.div,{dir:x,"data-orientation":p,...h,ref:a})})});x.displayName=u;var y="TabsList",v=a.forwardRef((e,a)=>{let{__scopeTabs:s,loop:r=!0,...n}=e,l=h(y,s),d=f(s);return(0,t.jsx)(i.Root,{asChild:!0,...d,orientation:l.orientation,dir:l.dir,loop:r,children:(0,t.jsx)(o.Primitive.div,{role:"tablist","aria-orientation":l.orientation,...n,ref:a})})});v.displayName=y;var b="TabsTrigger",N=a.forwardRef((e,a)=>{let{__scopeTabs:r,value:n,disabled:l=!1,...d}=e,c=h(b,r),u=f(r),p=$(c.baseId,n),m=C(c.baseId,n),g=n===c.value;return(0,t.jsx)(i.Item,{asChild:!0,...u,focusable:!l,active:g,children:(0,t.jsx)(o.Primitive.button,{type:"button",role:"tab","aria-selected":g,"aria-controls":m,"data-state":g?"active":"inactive","data-disabled":l?"":void 0,disabled:l,id:p,...d,ref:a,onMouseDown:(0,s.composeEventHandlers)(e.onMouseDown,e=>{l||0!==e.button||!1!==e.ctrlKey?e.preventDefault():c.onValueChange(n)}),onKeyDown:(0,s.composeEventHandlers)(e.onKeyDown,e=>{[" ","Enter"].includes(e.key)&&c.onValueChange(n)}),onFocus:(0,s.composeEventHandlers)(e.onFocus,()=>{let e="manual"!==c.activationMode;g||l||!e||c.onValueChange(n)})})})});N.displayName=b;var j="TabsContent",w=a.forwardRef((e,s)=>{let{__scopeTabs:r,value:i,forceMount:l,children:d,...c}=e,u=h(j,r),p=$(u.baseId,i),m=C(u.baseId,i),f=i===u.value,g=a.useRef(f);return a.useEffect(()=>{let e=requestAnimationFrame(()=>g.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,t.jsx)(n.Presence,{present:l||f,children:({present:a})=>(0,t.jsx)(o.Primitive.div,{"data-state":f?"active":"inactive","data-orientation":u.orientation,role:"tabpanel","aria-labelledby":p,hidden:!a,id:m,tabIndex:0,...c,ref:s,style:{...e.style,animationDuration:g.current?"0s":void 0},children:a&&d})})});function $(e,t){return`${e}-trigger-${t}`}function C(e,t){return`${e}-content-${t}`}w.displayName=j;var E=e.i(541428);let S=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(v,{ref:s,className:(0,E.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",e),...a}));S.displayName=v.displayName;let T=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(N,{ref:s,className:(0,E.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",e),...a}));T.displayName=N.displayName;let _=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(w,{ref:s,className:(0,E.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",e),...a}));_.displayName=w.displayName,e.s(["Tabs",()=>x,"TabsContent",()=>_,"TabsList",()=>S,"TabsTrigger",()=>T],996517)},165429,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(873273),r=a.forwardRef((e,a)=>(0,t.jsx)(s.Primitive.label,{...e,ref:a,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));r.displayName="Label";var i=e.i(541428);function n({className:e,...a}){return(0,t.jsx)(r,{"data-slot":"label",className:(0,i.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",e),...a})}e.s(["Label",()=>n],165429)},377991,e=>{"use strict";var t=e.i(403055),a=e.i(119836),s=e.i(110964),r=e.i(569658),i=e.i(316618),n=e.i(559663),o=e.i(873273),l=e.i(214018),d=e.i(346412),c=e.i(825198),u=e.i(44990),p="rovingFocusGroup.onEntryFocus",m={bubbles:!1,cancelable:!0},f="RovingFocusGroup",[g,h,x]=(0,s.createCollection)(f),[y,v]=(0,i.createContextScope)(f,[x]),[b,N]=y(f),j=t.forwardRef((e,t)=>(0,u.jsx)(g.Provider,{scope:e.__scopeRovingFocusGroup,children:(0,u.jsx)(g.Slot,{scope:e.__scopeRovingFocusGroup,children:(0,u.jsx)(w,{...e,ref:t})})}));j.displayName=f;var w=t.forwardRef((e,s)=>{let{__scopeRovingFocusGroup:i,orientation:n,loop:g=!1,dir:x,currentTabStopId:y,defaultCurrentTabStopId:v,onCurrentTabStopIdChange:N,onEntryFocus:j,preventScrollOnEntryFocus:w=!1,...$}=e,C=t.useRef(null),E=(0,r.useComposedRefs)(s,C),T=(0,c.useDirection)(x),[_,D]=(0,d.useControllableState)({prop:y,defaultProp:v??null,onChange:N,caller:f}),[A,I]=t.useState(!1),R=(0,l.useCallbackRef)(j),P=h(i),k=t.useRef(!1),[O,F]=t.useState(0);return t.useEffect(()=>{let e=C.current;if(e)return e.addEventListener(p,R),()=>e.removeEventListener(p,R)},[R]),(0,u.jsx)(b,{scope:i,orientation:n,dir:T,loop:g,currentTabStopId:_,onItemFocus:t.useCallback(e=>D(e),[D]),onItemShiftTab:t.useCallback(()=>I(!0),[]),onFocusableItemAdd:t.useCallback(()=>F(e=>e+1),[]),onFocusableItemRemove:t.useCallback(()=>F(e=>e-1),[]),children:(0,u.jsx)(o.Primitive.div,{tabIndex:A||0===O?-1:0,"data-orientation":n,...$,ref:E,style:{outline:"none",...e.style},onMouseDown:(0,a.composeEventHandlers)(e.onMouseDown,()=>{k.current=!0}),onFocus:(0,a.composeEventHandlers)(e.onFocus,e=>{let t=!k.current;if(e.target===e.currentTarget&&t&&!A){let t=new CustomEvent(p,m);if(e.currentTarget.dispatchEvent(t),!t.defaultPrevented){let e=P().filter(e=>e.focusable);S([e.find(e=>e.active),e.find(e=>e.id===_),...e].filter(Boolean).map(e=>e.ref.current),w)}}k.current=!1}),onBlur:(0,a.composeEventHandlers)(e.onBlur,()=>I(!1))})})}),$="RovingFocusGroupItem",C=t.forwardRef((e,s)=>{let{__scopeRovingFocusGroup:r,focusable:i=!0,active:l=!1,tabStopId:d,children:c,...p}=e,m=(0,n.useId)(),f=d||m,x=N($,r),y=x.currentTabStopId===f,v=h(r),{onFocusableItemAdd:b,onFocusableItemRemove:j,currentTabStopId:w}=x;return t.useEffect(()=>{if(i)return b(),()=>j()},[i,b,j]),(0,u.jsx)(g.ItemSlot,{scope:r,id:f,focusable:i,active:l,children:(0,u.jsx)(o.Primitive.span,{tabIndex:y?0:-1,"data-orientation":x.orientation,...p,ref:s,onMouseDown:(0,a.composeEventHandlers)(e.onMouseDown,e=>{i?x.onItemFocus(f):e.preventDefault()}),onFocus:(0,a.composeEventHandlers)(e.onFocus,()=>x.onItemFocus(f)),onKeyDown:(0,a.composeEventHandlers)(e.onKeyDown,e=>{if("Tab"===e.key&&e.shiftKey)return void x.onItemShiftTab();if(e.target!==e.currentTarget)return;let t=function(e,t,a){var s;let r=(s=e.key,"rtl"!==a?s:"ArrowLeft"===s?"ArrowRight":"ArrowRight"===s?"ArrowLeft":s);if(!("vertical"===t&&["ArrowLeft","ArrowRight"].includes(r))&&!("horizontal"===t&&["ArrowUp","ArrowDown"].includes(r)))return E[r]}(e,x.orientation,x.dir);if(void 0!==t){if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;e.preventDefault();let r=v().filter(e=>e.focusable).map(e=>e.ref.current);if("last"===t)r.reverse();else if("prev"===t||"next"===t){var a,s;"prev"===t&&r.reverse();let i=r.indexOf(e.currentTarget);r=x.loop?(a=r,s=i+1,a.map((e,t)=>a[(s+t)%a.length])):r.slice(i+1)}setTimeout(()=>S(r))}}),children:"function"==typeof c?c({isCurrentTabStop:y,hasTabStop:null!=w}):c})})});C.displayName=$;var E={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function S(e,t=!1){let a=document.activeElement;for(let s of e)if(s===a||(s.focus({preventScroll:t}),document.activeElement!==a))return}e.s(["Item",()=>C,"Root",()=>j,"createRovingFocusGroupScope",()=>v])},46034,e=>{"use strict";let t=(0,e.i(930702).default)("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]);e.s(["default",()=>t])},173416,e=>{"use strict";var t=e.i(46034);e.s(["Filter",()=>t.default])},49316,(e,t,a)=>{"use strict";function s({widthInt:e,heightInt:t,blurWidth:a,blurHeight:s,blurDataURL:r,objectFit:i}){let n=a?40*a:e,o=s?40*s:t,l=n&&o?`viewBox='0 0 ${n} ${o}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${l}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${l?"none":"contain"===i?"xMidYMid":"cover"===i?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${r}'/%3E%3C/svg%3E`}Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"getImageBlurSvg",{enumerable:!0,get:function(){return s}})},596974,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s={VALID_LOADERS:function(){return i},imageConfigDefault:function(){return n}};for(var r in s)Object.defineProperty(a,r,{enumerable:!0,get:s[r]});let i=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},473733,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"getImgProps",{enumerable:!0,get:function(){return l}}),e.r(715200);let s=e.r(49316),r=e.r(596974),i=["-moz-initial","fill","none","scale-down",void 0];function n(e){return void 0!==e.default}function o(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function l({src:e,sizes:t,unoptimized:a=!1,priority:l=!1,preload:d=!1,loading:c,className:u,quality:p,width:m,height:f,fill:g=!1,style:h,overrideSrc:x,onLoad:y,onLoadingComplete:v,placeholder:b="empty",blurDataURL:N,fetchPriority:j,decoding:w="async",layout:$,objectFit:C,objectPosition:E,lazyBoundary:S,lazyRoot:T,..._},D){var A;let I,R,P,{imgConf:k,showAltText:O,blurComplete:F,defaultLoader:L}=D,M=k||r.imageConfigDefault;if("allSizes"in M)I=M;else{let e=[...M.deviceSizes,...M.imageSizes].sort((e,t)=>e-t),t=M.deviceSizes.sort((e,t)=>e-t),a=M.qualities?.sort((e,t)=>e-t);I={...M,allSizes:e,deviceSizes:t,qualities:a}}if(void 0===L)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let U=_.loader||L;delete _.loader,delete _.srcSet;let B="__next_img_default"in U;if(B){if("custom"===I.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=U;U=t=>{let{config:a,...s}=t;return e(s)}}if($){"fill"===$&&(g=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[$];e&&(h={...h,...e});let a={responsive:"100vw",fill:"100vw"}[$];a&&!t&&(t=a)}let q="",G=o(m),z=o(f);if((A=e)&&"object"==typeof A&&(n(A)||void 0!==A.src)){let t=n(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(R=t.blurWidth,P=t.blurHeight,N=N||t.blurDataURL,q=t.src,!g)if(G||z){if(G&&!z){let e=G/t.width;z=Math.round(t.height*e)}else if(!G&&z){let e=z/t.height;G=Math.round(t.width*e)}}else G=t.width,z=t.height}let J=!l&&!d&&("lazy"===c||void 0===c);(!(e="string"==typeof e?e:q)||e.startsWith("data:")||e.startsWith("blob:"))&&(a=!0,J=!1),I.unoptimized&&(a=!0),B&&!I.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(a=!0);let V=o(p),Q=Object.assign(g?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:C,objectPosition:E}:{},O?{}:{color:"transparent"},h),H=F||"empty"===b?null:"blur"===b?`url("data:image/svg+xml;charset=utf-8,${(0,s.getImageBlurSvg)({widthInt:G,heightInt:z,blurWidth:R,blurHeight:P,blurDataURL:N||"",objectFit:Q.objectFit})}")`:`url("${b}")`,K=i.includes(Q.objectFit)?"fill"===Q.objectFit?"100% 100%":"cover":Q.objectFit,W=H?{backgroundSize:K,backgroundPosition:Q.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:H}:{},Y=function({config:e,src:t,unoptimized:a,width:s,quality:r,sizes:i,loader:n}){if(a)return{src:t,srcSet:void 0,sizes:void 0};let{widths:o,kind:l}=function({deviceSizes:e,allSizes:t},a,s){if(s){let a=/(^|\s)(1?\d?\d)vw/g,r=[];for(let e;e=a.exec(s);)r.push(parseInt(e[2]));if(r.length){let a=.01*Math.min(...r);return{widths:t.filter(t=>t>=e[0]*a),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof a?{widths:e,kind:"w"}:{widths:[...new Set([a,2*a].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,s,i),d=o.length-1;return{sizes:i||"w"!==l?i:"100vw",srcSet:o.map((a,s)=>`${n({config:e,src:t,quality:r,width:a})} ${"w"===l?a:s+1}${l}`).join(", "),src:n({config:e,src:t,quality:r,width:o[d]})}}({config:I,src:e,unoptimized:a,width:G,quality:V,sizes:t,loader:U}),X=J?"lazy":c;return{props:{..._,loading:X,fetchPriority:j,width:G,height:z,decoding:w,className:u,style:{...Q,...W},sizes:Y.sizes,srcSet:Y.srcSet,src:x||Y.src},meta:{unoptimized:a,preload:d||l,placeholder:b,fill:g}}}},805690,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"default",{enumerable:!0,get:function(){return o}});let s=e.r(403055),r="undefined"==typeof window,i=r?()=>{}:s.useLayoutEffect,n=r?()=>{}:s.useEffect;function o(e){let{headManager:t,reduceComponentsToState:a}=e;function o(){if(t&&t.mountedInstances){let e=s.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(a(e))}}return r&&(t?.mountedInstances?.add(e.children),o()),i(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),i(()=>(t&&(t._pendingUpdate=o),()=>{t&&(t._pendingUpdate=o)})),n(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},308112,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s={default:function(){return g},defaultHead:function(){return u}};for(var r in s)Object.defineProperty(a,r,{enumerable:!0,get:s[r]});let i=e.r(940192),n=e.r(475244),o=e.r(44990),l=n._(e.r(403055)),d=i._(e.r(805690)),c=e.r(525989);function u(){return[(0,o.jsx)("meta",{charSet:"utf-8"},"charset"),(0,o.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function p(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===l.default.Fragment?e.concat(l.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(715200);let m=["name","httpEquiv","charSet","itemProp"];function f(e){let t,a,s,r;return e.reduce(p,[]).reverse().concat(u().reverse()).filter((t=new Set,a=new Set,s=new Set,r={},e=>{let i=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;let a=e.key.slice(e.key.indexOf("$")+1);t.has(a)?i=!1:t.add(a)}switch(e.type){case"title":case"base":a.has(e.type)?i=!1:a.add(e.type);break;case"meta":for(let t=0,a=m.length;t<a;t++){let a=m[t];if(e.props.hasOwnProperty(a))if("charSet"===a)s.has(a)?i=!1:s.add(a);else{let t=e.props[a],s=r[a]||new Set;("name"!==a||!n)&&s.has(t)?i=!1:(s.add(t),r[a]=s)}}}return i})).reverse().map((e,t)=>{let a=e.key||t;return l.default.cloneElement(e,{key:a})})}let g=function({children:e}){let t=(0,l.useContext)(c.HeadManagerContext);return(0,o.jsx)(d.default,{reduceComponentsToState:f,headManager:t,children:e})};("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},238369,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"ImageConfigContext",{enumerable:!0,get:function(){return i}});let s=e.r(940192)._(e.r(403055)),r=e.r(596974),i=s.default.createContext(r.imageConfigDefault)},420539,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"RouterContext",{enumerable:!0,get:function(){return s}});let s=e.r(940192)._(e.r(403055)).default.createContext(null)},659556,(e,t,a)=>{"use strict";function s(e,t){let a=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-a)<Math.abs(e-a)?t:e,0):a}Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"findClosestQuality",{enumerable:!0,get:function(){return s}})},103342,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"default",{enumerable:!0,get:function(){return i}});let s=e.r(659556);function r({config:e,src:t,width:a,quality:r}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let i=(0,s.findClosestQuality)(r,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${a}&q=${i}${t.startsWith("/_next/static/media/"),""}`}r.__next_img_default=!0;let i=r},894595,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"Image",{enumerable:!0,get:function(){return b}});let s=e.r(940192),r=e.r(475244),i=e.r(44990),n=r._(e.r(403055)),o=s._(e.r(940392)),l=s._(e.r(308112)),d=e.r(473733),c=e.r(596974),u=e.r(238369);e.r(715200);let p=e.r(420539),m=s._(e.r(103342)),f=e.r(527304),g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function h(e,t,a,s,r,i,n){let o=e?.src;e&&e["data-loaded-src"]!==o&&(e["data-loaded-src"]=o,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&r(!0),a?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let s=!1,r=!1;a.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>s,isPropagationStopped:()=>r,persist:()=>{},preventDefault:()=>{s=!0,t.preventDefault()},stopPropagation:()=>{r=!0,t.stopPropagation()}})}s?.current&&s.current(e)}}))}function x(e){return n.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let y=(0,n.forwardRef)(({src:e,srcSet:t,sizes:a,height:s,width:r,decoding:o,className:l,style:d,fetchPriority:c,placeholder:u,loading:p,unoptimized:m,fill:g,onLoadRef:y,onLoadingCompleteRef:v,setBlurComplete:b,setShowAltText:N,sizesInput:j,onLoad:w,onError:$,...C},E)=>{let S=(0,n.useCallback)(e=>{e&&($&&(e.src=e.src),e.complete&&h(e,u,y,v,b,m,j))},[e,u,y,v,b,$,m,j]),T=(0,f.useMergedRef)(E,S);return(0,i.jsx)("img",{...C,...x(c),loading:p,width:r,height:s,decoding:o,"data-nimg":g?"fill":"1",className:l,style:d,sizes:a,srcSet:t,src:e,ref:T,onLoad:e=>{h(e.currentTarget,u,y,v,b,m,j)},onError:e=>{N(!0),"empty"!==u&&b(!0),$&&$(e)}})});function v({isAppRouter:e,imgAttributes:t}){let a={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&o.default.preload?(o.default.preload(t.src,a),null):(0,i.jsx)(l.default,{children:(0,i.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...a},"__nimg-"+t.src+t.srcSet+t.sizes)})}let b=(0,n.forwardRef)((e,t)=>{let a=(0,n.useContext)(p.RouterContext),s=(0,n.useContext)(u.ImageConfigContext),r=(0,n.useMemo)(()=>{let e=g||s||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),a=e.deviceSizes.sort((e,t)=>e-t),r=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:a,qualities:r,localPatterns:"undefined"==typeof window?s?.localPatterns:e.localPatterns}},[s]),{onLoad:o,onLoadingComplete:l}=e,f=(0,n.useRef)(o);(0,n.useEffect)(()=>{f.current=o},[o]);let h=(0,n.useRef)(l);(0,n.useEffect)(()=>{h.current=l},[l]);let[x,b]=(0,n.useState)(!1),[N,j]=(0,n.useState)(!1),{props:w,meta:$}=(0,d.getImgProps)(e,{defaultLoader:m.default,imgConf:r,blurComplete:x,showAltText:N});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(y,{...w,unoptimized:$.unoptimized,placeholder:$.placeholder,fill:$.fill,onLoadRef:f,onLoadingCompleteRef:h,setBlurComplete:b,setShowAltText:j,sizesInput:e.sizes,ref:t}),$.preload?(0,i.jsx)(v,{isAppRouter:!a,imgAttributes:w}):null]})});("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},211684,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s={default:function(){return c},getImageProps:function(){return d}};for(var r in s)Object.defineProperty(a,r,{enumerable:!0,get:s[r]});let i=e.r(940192),n=e.r(473733),o=e.r(894595),l=i._(e.r(103342));function d(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:l.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,a]of Object.entries(t))void 0===a&&delete t[e];return{props:t}}let c=o.Image},586754,(e,t,a)=>{t.exports=e.r(211684)},574375,e=>{"use strict";var t=e.i(984804);let a=t.gql`
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
`,s=t.gql`
  ${a}
  fragment CategoryWithCountFields on CategoryType {
    ...CategoryBasicFields
    productCount
  }
`,r=t.gql`
  ${s}
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
`,i=t.gql`
  fragment ProductImageFields on ProductImageType {
    id
    url
    alt
    isPrimary
    order
    createdAt
  }
`,n=t.gql`
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
`;let o=t.gql`
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
`;e.s(["CATEGORY_BASIC_FRAGMENT",0,a,"CATEGORY_TREE_FRAGMENT",0,r,"CATEGORY_WITH_COUNT_FRAGMENT",0,s,"COMMENT_FRAGMENT",0,d,"POST_FRAGMENT",0,l,"PRODUCT_IMAGE_FRAGMENT",0,i,"PRODUCT_VARIANT_FRAGMENT",0,n,"USER_FRAGMENT",0,o])},861699,e=>{"use strict";let t=(0,e.i(930702).default)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);e.s(["default",()=>t])},126455,e=>{"use strict";var t=e.i(861699);e.s(["Package",()=>t.default])},706547,241144,e=>{"use strict";let t=(0,e.i(930702).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["default",()=>t],241144),e.s(["Settings",()=>t],706547)},276664,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(119836),r=e.i(569658),i=e.i(316618),n=e.i(346412),o=e.i(139540),l=e.i(471203),d=e.i(873273),c="Switch",[u,p]=(0,i.createContextScope)(c),[m,f]=u(c),g=a.forwardRef((e,i)=>{let{__scopeSwitch:o,name:l,checked:u,defaultChecked:p,required:f,disabled:g,value:h="on",onCheckedChange:x,form:b,...N}=e,[j,w]=a.useState(null),$=(0,r.useComposedRefs)(i,e=>w(e)),C=a.useRef(!1),E=!j||b||!!j.closest("form"),[S,T]=(0,n.useControllableState)({prop:u,defaultProp:p??!1,onChange:x,caller:c});return(0,t.jsxs)(m,{scope:o,checked:S,disabled:g,children:[(0,t.jsx)(d.Primitive.button,{type:"button",role:"switch","aria-checked":S,"aria-required":f,"data-state":v(S),"data-disabled":g?"":void 0,disabled:g,value:h,...N,ref:$,onClick:(0,s.composeEventHandlers)(e.onClick,e=>{T(e=>!e),E&&(C.current=e.isPropagationStopped(),C.current||e.stopPropagation())})}),E&&(0,t.jsx)(y,{control:j,bubbles:!C.current,name:l,value:h,checked:S,required:f,disabled:g,form:b,style:{transform:"translateX(-100%)"}})]})});g.displayName=c;var h="SwitchThumb",x=a.forwardRef((e,a)=>{let{__scopeSwitch:s,...r}=e,i=f(h,s);return(0,t.jsx)(d.Primitive.span,{"data-state":v(i.checked),"data-disabled":i.disabled?"":void 0,...r,ref:a})});x.displayName=h;var y=a.forwardRef(({__scopeSwitch:e,control:s,checked:i,bubbles:n=!0,...d},c)=>{let u=a.useRef(null),p=(0,r.useComposedRefs)(u,c),m=(0,o.usePrevious)(i),f=(0,l.useSize)(s);return a.useEffect(()=>{let e=u.current;if(!e)return;let t=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(m!==i&&t){let a=new Event("click",{bubbles:n});t.call(e,i),e.dispatchEvent(a)}},[m,i,n]),(0,t.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:i,...d,tabIndex:-1,ref:p,style:{...d.style,...f,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});function v(e){return e?"checked":"unchecked"}y.displayName="SwitchBubbleInput";var b=e.i(541428);let N=a.forwardRef(({className:e,...a},s)=>(0,t.jsx)(g,{className:(0,b.cn)("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",e),...a,ref:s,children:(0,t.jsx)(x,{className:(0,b.cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")})}));N.displayName=g.displayName,e.s(["Switch",()=>N],276664)},580523,e=>{"use strict";var t=e.i(403055),a=e.i(119836),s=e.i(569658),r=e.i(316618),i=e.i(559663),n=e.i(346412),o=e.i(430840),l=e.i(621829),d=e.i(581263),c=e.i(767478),u=e.i(873273),p=e.i(767835),m=e.i(896438),f=e.i(739045),g=e.i(599488),h=e.i(44990),x="Dialog",[y,v]=(0,r.createContextScope)(x),[b,N]=y(x),j=e=>{let{__scopeDialog:a,children:s,open:r,defaultOpen:o,onOpenChange:l,modal:d=!0}=e,c=t.useRef(null),u=t.useRef(null),[p,m]=(0,n.useControllableState)({prop:r,defaultProp:o??!1,onChange:l,caller:x});return(0,h.jsx)(b,{scope:a,triggerRef:c,contentRef:u,contentId:(0,i.useId)(),titleId:(0,i.useId)(),descriptionId:(0,i.useId)(),open:p,onOpenChange:m,onOpenToggle:t.useCallback(()=>m(e=>!e),[m]),modal:d,children:s})};j.displayName=x;var w="DialogTrigger",$=t.forwardRef((e,t)=>{let{__scopeDialog:r,...i}=e,n=N(w,r),o=(0,s.useComposedRefs)(t,n.triggerRef);return(0,h.jsx)(u.Primitive.button,{type:"button","aria-haspopup":"dialog","aria-expanded":n.open,"aria-controls":n.contentId,"data-state":z(n.open),...i,ref:o,onClick:(0,a.composeEventHandlers)(e.onClick,n.onOpenToggle)})});$.displayName=w;var C="DialogPortal",[E,S]=y(C,{forceMount:void 0}),T=e=>{let{__scopeDialog:a,forceMount:s,children:r,container:i}=e,n=N(C,a);return(0,h.jsx)(E,{scope:a,forceMount:s,children:t.Children.map(r,e=>(0,h.jsx)(c.Presence,{present:s||n.open,children:(0,h.jsx)(d.Portal,{asChild:!0,container:i,children:e})}))})};T.displayName=C;var _="DialogOverlay",D=t.forwardRef((e,t)=>{let a=S(_,e.__scopeDialog),{forceMount:s=a.forceMount,...r}=e,i=N(_,e.__scopeDialog);return i.modal?(0,h.jsx)(c.Presence,{present:s||i.open,children:(0,h.jsx)(I,{...r,ref:t})}):null});D.displayName=_;var A=(0,g.createSlot)("DialogOverlay.RemoveScroll"),I=t.forwardRef((e,t)=>{let{__scopeDialog:a,...s}=e,r=N(_,a);return(0,h.jsx)(m.RemoveScroll,{as:A,allowPinchZoom:!0,shards:[r.contentRef],children:(0,h.jsx)(u.Primitive.div,{"data-state":z(r.open),...s,ref:t,style:{pointerEvents:"auto",...s.style}})})}),R="DialogContent",P=t.forwardRef((e,t)=>{let a=S(R,e.__scopeDialog),{forceMount:s=a.forceMount,...r}=e,i=N(R,e.__scopeDialog);return(0,h.jsx)(c.Presence,{present:s||i.open,children:i.modal?(0,h.jsx)(k,{...r,ref:t}):(0,h.jsx)(O,{...r,ref:t})})});P.displayName=R;var k=t.forwardRef((e,r)=>{let i=N(R,e.__scopeDialog),n=t.useRef(null),o=(0,s.useComposedRefs)(r,i.contentRef,n);return t.useEffect(()=>{let e=n.current;if(e)return(0,f.hideOthers)(e)},[]),(0,h.jsx)(F,{...e,ref:o,trapFocus:i.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,a.composeEventHandlers)(e.onCloseAutoFocus,e=>{e.preventDefault(),i.triggerRef.current?.focus()}),onPointerDownOutside:(0,a.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,a=0===t.button&&!0===t.ctrlKey;(2===t.button||a)&&e.preventDefault()}),onFocusOutside:(0,a.composeEventHandlers)(e.onFocusOutside,e=>e.preventDefault())})}),O=t.forwardRef((e,a)=>{let s=N(R,e.__scopeDialog),r=t.useRef(!1),i=t.useRef(!1);return(0,h.jsx)(F,{...e,ref:a,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(r.current||s.triggerRef.current?.focus(),t.preventDefault()),r.current=!1,i.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(r.current=!0,"pointerdown"===t.detail.originalEvent.type&&(i.current=!0));let a=t.target;s.triggerRef.current?.contains(a)&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&i.current&&t.preventDefault()}})}),F=t.forwardRef((e,a)=>{let{__scopeDialog:r,trapFocus:i,onOpenAutoFocus:n,onCloseAutoFocus:d,...c}=e,u=N(R,r),m=t.useRef(null),f=(0,s.useComposedRefs)(a,m);return(0,p.useFocusGuards)(),(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(l.FocusScope,{asChild:!0,loop:!0,trapped:i,onMountAutoFocus:n,onUnmountAutoFocus:d,children:(0,h.jsx)(o.DismissableLayer,{role:"dialog",id:u.contentId,"aria-describedby":u.descriptionId,"aria-labelledby":u.titleId,"data-state":z(u.open),...c,ref:f,onDismiss:()=>u.onOpenChange(!1)})}),(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(H,{titleId:u.titleId}),(0,h.jsx)(K,{contentRef:m,descriptionId:u.descriptionId})]})]})}),L="DialogTitle",M=t.forwardRef((e,t)=>{let{__scopeDialog:a,...s}=e,r=N(L,a);return(0,h.jsx)(u.Primitive.h2,{id:r.titleId,...s,ref:t})});M.displayName=L;var U="DialogDescription",B=t.forwardRef((e,t)=>{let{__scopeDialog:a,...s}=e,r=N(U,a);return(0,h.jsx)(u.Primitive.p,{id:r.descriptionId,...s,ref:t})});B.displayName=U;var q="DialogClose",G=t.forwardRef((e,t)=>{let{__scopeDialog:s,...r}=e,i=N(q,s);return(0,h.jsx)(u.Primitive.button,{type:"button",...r,ref:t,onClick:(0,a.composeEventHandlers)(e.onClick,()=>i.onOpenChange(!1))})});function z(e){return e?"open":"closed"}G.displayName=q;var J="DialogTitleWarning",[V,Q]=(0,r.createContext)(J,{contentName:R,titleName:L,docsSlug:"dialog"}),H=({titleId:e})=>{let a=Q(J),s=`\`${a.contentName}\` requires a \`${a.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${a.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${a.docsSlug}`;return t.useEffect(()=>{e&&(document.getElementById(e)||console.error(s))},[s,e]),null},K=({contentRef:e,descriptionId:a})=>{let s=Q("DialogDescriptionWarning"),r=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${s.contentName}}.`;return t.useEffect(()=>{let t=e.current?.getAttribute("aria-describedby");a&&t&&(document.getElementById(a)||console.warn(r))},[r,e,a]),null};e.s(["Close",()=>G,"Content",()=>P,"Description",()=>B,"Overlay",()=>D,"Portal",()=>T,"Root",()=>j,"Title",()=>M,"Trigger",()=>$])},137651,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(580523),r=e.i(888540),i=e.i(541428);let n=s.Root,o=s.Trigger,l=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(s.Overlay,{ref:r,className:(0,i.cn)("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...a}));l.displayName=s.Overlay.displayName;let d=a.forwardRef(({className:e,children:a,...n},o)=>(0,t.jsxs)(s.Portal,{children:[(0,t.jsx)(l,{}),(0,t.jsxs)(s.Content,{ref:o,className:(0,i.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...n,children:[a,(0,t.jsxs)(s.Close,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500",children:[(0,t.jsx)(r.X,{className:"h-4 w-4"}),(0,t.jsx)("span",{className:"sr-only",children:"Close"})]})]})]}));d.displayName=s.Content.displayName;let c=({className:e,...a})=>(0,t.jsx)("div",{className:(0,i.cn)("flex flex-col space-y-1.5 text-center sm:text-left",e),...a});c.displayName="DialogHeader";let u=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(s.Title,{ref:r,className:(0,i.cn)("text-lg font-semibold leading-none tracking-tight",e),...a}));u.displayName=s.Title.displayName;let p=a.forwardRef(({className:e,...a},r)=>(0,t.jsx)(s.Description,{ref:r,className:(0,i.cn)("text-sm text-muted-foreground",e),...a}));p.displayName=s.Description.displayName;let m=({className:e,...a})=>(0,t.jsx)("div",{className:(0,i.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...a});m.displayName="DialogFooter",e.s(["Dialog",()=>n,"DialogContent",()=>d,"DialogDescription",()=>p,"DialogFooter",()=>m,"DialogHeader",()=>c,"DialogTitle",()=>u,"DialogTrigger",()=>o])},567961,946420,e=>{"use strict";let t=(0,e.i(930702).default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["default",()=>t],946420),e.s(["ChevronRight",()=>t],567961)},630596,921392,e=>{"use strict";let t=(0,e.i(930702).default)("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);e.s(["default",()=>t],921392),e.s(["ChevronLeft",()=>t],630596)},734694,e=>{"use strict";let t=(0,e.i(930702).default)("mouse-pointer",[["path",{d:"M12.586 12.586 19 19",key:"ea5xo7"}],["path",{d:"M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",key:"277e5u"}]]);e.s(["default",()=>t])},236929,e=>{"use strict";var t=e.i(734694);e.s(["MousePointer",()=>t.default])},416181,e=>{"use strict";let t=(0,e.i(930702).default)("play",[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]);e.s(["default",()=>t])},490008,e=>{"use strict";var t=e.i(416181);e.s(["Play",()=>t.default])},125284,e=>{"use strict";var t=e.i(429105),a=e.i(950988),s=e.i(984804),r=e.i(574375);class i{static generateCRUDQueries(e,t=[],a={}){let r=e.toLowerCase();e.charAt(0).toLowerCase(),e.slice(1);let i=e.startsWith("ext_"),n=(t.length>0?t:["id","createdAt","updatedAt"]).join("\n    ");Object.keys(a).length>0&&Object.entries(a).forEach(([e,t])=>{n+=`
    ${e} {
      ${t.join("\n      ")}
    }`});let o=i?"JSON":`${e}FilterInput`;return{[`GET_${e.toUpperCase()}S`]:i?s.gql`
          query Get${e}s($filters: ${o}) {
            get${e}s(filters: $filters)
          }
        `:s.gql`
          query Get${e}s($filters: ${o}) {
            get${e}s(filters: $filters) {
              ${n}
            }
          }
        `,[`GET_${e.toUpperCase()}S_PAGINATED`]:i?s.gql`
          query Get${e}sPaginated($filters: ${o}) {
            get${e}sPaginated(filters: $filters)
          }
        `:s.gql`
          query Get${e}sPaginated($filters: ${o}) {
            get${e}sPaginated(filters: $filters) {
              data {
                ${n}
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
        `,[`GET_${e.toUpperCase()}_BY_ID`]:i?s.gql`
          query Get${e}ById($id: ID!, $options: JSON) {
            get${e}ById(id: $id, options: $options)
          }
        `:s.gql`
          query Get${e}ById($id: ID!, $options: JSON) {
            get${e}ById(id: $id, options: $options) {
              ${n}
            }
          }
        `,[`CREATE_${e.toUpperCase()}`]:i?s.gql`
          mutation Create${e}($data: JSON!, $options: JSON) {
            create${e}(data: $data, options: $options)
          }
        `:s.gql`
          mutation Create${e}($data: JSON!, $options: JSON) {
            create${e}(data: $data, options: $options) {
              ${n}
            }
          }
        `,[`CREATE_${e.toUpperCase()}S_BULK`]:i?s.gql`
          mutation Create${e}sBulk($input: JSON!, $options: JSON) {
            create${e}sBulk(input: $input, options: $options)
          }
        `:s.gql`
          mutation Create${e}sBulk($input: JSON!, $options: JSON) {
            create${e}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${n}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPDATE_${e.toUpperCase()}`]:i?s.gql`
          mutation Update${e}($id: ID!, $data: JSON!, $options: JSON) {
            update${e}(id: $id, data: $data, options: $options)
          }
        `:s.gql`
          mutation Update${e}($id: ID!, $data: JSON!, $options: JSON) {
            update${e}(id: $id, data: $data, options: $options) {
              ${n}
            }
          }
        `,[`UPDATE_${e.toUpperCase()}S_BULK`]:i?s.gql`
          mutation Update${e}sBulk($input: JSON!, $options: JSON) {
            update${e}sBulk(input: $input, options: $options)
          }
        `:s.gql`
          mutation Update${e}sBulk($input: JSON!, $options: JSON) {
            update${e}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${n}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`DELETE_${e.toUpperCase()}`]:i?s.gql`
          mutation Delete${e}($id: ID!, $options: JSON) {
            delete${e}(id: $id, options: $options)
          }
        `:s.gql`
          mutation Delete${e}($id: ID!, $options: JSON) {
            delete${e}(id: $id, options: $options) {
              ${n}
            }
          }
        `,[`DELETE_${e.toUpperCase()}S_BULK`]:i?s.gql`
          mutation Delete${e}sBulk($input: JSON!, $options: JSON) {
            delete${e}sBulk(input: $input, options: $options)
          }
        `:s.gql`
          mutation Delete${e}sBulk($input: JSON!, $options: JSON) {
            delete${e}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${n}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPSERT_${e.toUpperCase()}`]:i?s.gql`
          mutation Upsert${e}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${e}(where: $where, create: $create, update: $update, options: $options)
          }
        `:s.gql`
          mutation Upsert${e}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${e}(where: $where, create: $create, update: $update, options: $options) {
              ${n}
            }
          }
        `,[`COUNT_${e.toUpperCase()}S`]:s.gql`
        query Count${e}s($where: JSON) {
          count${e}s(where: $where)
        }
      `,[`${e.toUpperCase()}_EXISTS`]:s.gql`
        query ${e}Exists($where: JSON!) {
          ${r}Exists(where: $where)
        }
      `}}static generateUniversalQueries(){return{DYNAMIC_FIND_MANY:s.gql`
        query DynamicFindMany($modelName: String!, $filter: JSON) {
          dynamicFindMany(modelName: $modelName, filter: $filter)
        }
      `,DYNAMIC_FIND_BY_ID:s.gql`
        query DynamicFindById($modelName: String!, $id: ID!, $options: JSON) {
          dynamicFindById(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE:s.gql`
        mutation DynamicCreate($modelName: String!, $data: JSON!, $options: JSON) {
          dynamicCreate(modelName: $modelName, data: $data, options: $options)
        }
      `,DYNAMIC_UPDATE:s.gql`
        mutation DynamicUpdate($modelName: String!, $id: ID!, $data: JSON!, $options: JSON) {
          dynamicUpdate(modelName: $modelName, id: $id, data: $data, options: $options)
        }
      `,DYNAMIC_DELETE:s.gql`
        mutation DynamicDelete($modelName: String!, $id: ID!, $options: JSON) {
          dynamicDelete(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE_BULK:s.gql`
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
      `,DYNAMIC_UPDATE_BULK:s.gql`
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
      `,DYNAMIC_DELETE_BULK:s.gql`
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
      `}}static generateQueriesWithFragments(e,t){let a=e.toUpperCase();return{[`GET_${a}S_WITH_FRAGMENT`]:s.gql`
        ${t}
        query Get${e}s($filter: JSON) {
          get${e}s(filter: $filter) {
            ...${e}Fragment
          }
        }
      `,[`CREATE_${a}_WITH_FRAGMENT`]:s.gql`
        ${t}
        mutation Create${e}($data: JSON!, $options: JSON) {
          create${e}(data: $data, options: $options) {
            ...${e}Fragment
          }
        }
      `,[`UPDATE_${a}_WITH_FRAGMENT`]:s.gql`
        ${t}
        mutation Update${e}($id: ID!, $data: JSON!, $options: JSON) {
          update${e}(id: $id, data: $data, options: $options) {
            ...${e}Fragment
          }
        }
      `}}}r.USER_FRAGMENT,r.POST_FRAGMENT,s.gql`
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
  `,r.COMMENT_FRAGMENT;let n=i.generateCRUDQueries("User",["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"]),o=i.generateCRUDQueries("Post",["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"]),l=i.generateCRUDQueries("Task",["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"]),d=i.generateCRUDQueries("Comment",["id","content","postId","userId","parentId","createdAt","updatedAt"]),c=i.generateUniversalQueries();Object.entries({User:["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"],Post:["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"],Task:["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"],Comment:["id","content","postId","userId","parentId","createdAt","updatedAt"],Tag:["id","name","slug","description","color","createdAt","updatedAt"],Media:["id","filename","fileUrl","fileSize","mimeType","uploadedById","createdAt"],TaskComment:["id","content","taskId","authorId","parentId","createdAt","updatedAt"],TaskShare:["id","taskId","userId","permission","shareToken","expiresAt","isActive","createdAt"],TaskMedia:["id","filename","url","type","size","mimeType","taskId","uploadedBy","createdAt"]}).reduce((e,[t,a])=>(e[t]=i.generateCRUDQueries(t,a),e),{});let{GET_USERS:u,GET_USERS_PAGINATED:p,GET_USER_BY_ID:m,CREATE_USER:f,CREATE_USERS_BULK:g,UPDATE_USER:h,UPDATE_USERS_BULK:x,DELETE_USER:y,DELETE_USERS_BULK:v,UPSERT_USER:b,COUNT_USERS:N,USER_EXISTS:j}=n,{GET_POSTS:w,GET_POSTS_PAGINATED:$,GET_POST_BY_ID:C,CREATE_POST:E,CREATE_POSTS_BULK:S,UPDATE_POST:T,UPDATE_POSTS_BULK:_,DELETE_POST:D,DELETE_POSTS_BULK:A,UPSERT_POST:I,COUNT_POSTS:R,POST_EXISTS:P}=o,{GET_TASKS:k,GET_TASKS_PAGINATED:O,GET_TASK_BY_ID:F,CREATE_TASK:L,CREATE_TASKS_BULK:M,UPDATE_TASK:U,UPDATE_TASKS_BULK:B,DELETE_TASK:q,DELETE_TASKS_BULK:G,UPSERT_TASK:z,COUNT_TASKS:J,TASK_EXISTS:V}=l,{GET_COMMENTS:Q,GET_COMMENTS_PAGINATED:H,GET_COMMENT_BY_ID:K,CREATE_COMMENT:W,CREATE_COMMENTS_BULK:Y,UPDATE_COMMENT:X,UPDATE_COMMENTS_BULK:Z,DELETE_COMMENT:ee,DELETE_COMMENTS_BULK:et,UPSERT_COMMENT:ea,COUNT_COMMENTS:es,COMMENT_EXISTS:er}=d,{DYNAMIC_FIND_MANY:ei,DYNAMIC_FIND_BY_ID:en,DYNAMIC_CREATE:eo,DYNAMIC_UPDATE:el,DYNAMIC_DELETE:ed,DYNAMIC_CREATE_BULK:ec,DYNAMIC_UPDATE_BULK:eu,DYNAMIC_DELETE_BULK:ep}=c;var em=e.i(403055);function ef(e,a,s={}){let{fields:r,nestedFields:n,...o}=s,l=(0,em.useMemo)(()=>{let t=i.generateCRUDQueries(a,r);switch(e){case"GET_ALL":return t[`GET_${a.toUpperCase()}S`];case"GET_PAGINATED":return t[`GET_${a.toUpperCase()}S_PAGINATED`];case"GET_BY_ID":return t[`GET_${a.toUpperCase()}_BY_ID`];default:throw Error(`Unsupported operation type: ${e}`)}},[e,a,r,n]);return(0,t.useQuery)(l,o)}function eg(e,t,s={}){let{fields:r,nestedFields:n,...o}=s,l=(0,em.useMemo)(()=>{let a=i.generateCRUDQueries(t,r);switch(e){case"CREATE":return a[`CREATE_${t.toUpperCase()}`];case"CREATE_BULK":return a[`CREATE_${t.toUpperCase()}S_BULK`];case"UPDATE":return a[`UPDATE_${t.toUpperCase()}`];case"UPDATE_BULK":return a[`UPDATE_${t.toUpperCase()}S_BULK`];case"DELETE":return a[`DELETE_${t.toUpperCase()}`];case"DELETE_BULK":return a[`DELETE_${t.toUpperCase()}S_BULK`];default:throw Error(`Unsupported operation type: ${e}`)}},[e,t,r,n]);return(0,a.useMutation)(l,o)}function eh(e){let t=function(e,t={}){return ef("GET_ALL",e,t)}(e),a=function(e,t={}){return ef("GET_PAGINATED",e,t)}(e),[s]=function(e,t={}){return eg("CREATE",e,t)}(e),[r]=function(e,t={}){return eg("CREATE_BULK",e,t)}(e),[i]=function(e,t={}){return eg("UPDATE",e,t)}(e),[n]=function(e,t={}){return eg("UPDATE_BULK",e,t)}(e),[o]=function(e,t={}){return eg("DELETE",e,t)}(e),[l]=function(e,t={}){return eg("DELETE_BULK",e,t)}(e);return{getAll:t,getPaginated:a,getById:(0,em.useCallback)(t=>(function(e,t={}){return ef("GET_BY_ID",e,t)})(e,{variables:{id:t}}),[e]),create:s,createBulk:r,update:i,updateBulk:n,delete:o,deleteBulk:l}}function ex(e){return e&&e.graphQLErrors&&void 0!==e.networkError}function ey(e){return e.graphQLErrors.length>0?e.graphQLErrors.map(e=>e.message).join(", "):e.networkError?`Network error: ${e.networkError.message}`:e.message||"Unknown GraphQL error"}e.s(["formatDynamicGraphQLError",()=>ey,"isDynamicGraphQLError",()=>ex,"useCRUD",()=>eh,"useDynamicMutation",()=>eg,"useDynamicQuery",()=>ef],125284)},120018,e=>{"use strict";let t=(0,e.i(930702).default)("panels-top-left",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M9 21V9",key:"1oto5p"}]]);e.s(["default",()=>t])},591079,e=>{"use strict";var t=e.i(120018);e.s(["Layout",()=>t.default])},164925,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(630596),r=e.i(567961),i=e.i(202774),n=e.i(404210),o=e.i(706547),l=e.i(138227),d=e.i(885205),c=e.i(125284),u=e.i(137651),p=e.i(165429),m=e.i(183194),f=e.i(276664),g=e.i(696134),h=e.i(996517),x=e.i(126455),y=e.i(173416),v=e.i(591079),b=e.i(490008),N=e.i(236929);function j({open:e,onOpenChange:s,settings:r,onSave:i}){let[n,o]=(0,a.useState)(r),l=e=>{o(t=>({...t,...e}))},c=(e,t)=>{o(a=>({...a,responsive:{...a.responsive,[e]:t}}))};return(0,t.jsx)(u.Dialog,{open:e,onOpenChange:s,children:(0,t.jsxs)(u.DialogContent,{className:"max-w-3xl max-h-[85vh] overflow-y-auto",children:[(0,t.jsxs)(u.DialogHeader,{children:[(0,t.jsxs)(u.DialogTitle,{className:"flex items-center gap-2",children:[(0,t.jsx)(x.Package,{className:"w-5 h-5 text-primary"}),"Product Carousel Settings"]}),(0,t.jsx)(u.DialogDescription,{children:"Customize your product carousel behavior, filters, and appearance"})]}),(0,t.jsxs)(h.Tabs,{defaultValue:"content",className:"w-full",children:[(0,t.jsxs)(h.TabsList,{className:"grid w-full grid-cols-5",children:[(0,t.jsxs)(h.TabsTrigger,{value:"content",className:"flex items-center gap-1.5",children:[(0,t.jsx)(x.Package,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Content"})]}),(0,t.jsxs)(h.TabsTrigger,{value:"filter",className:"flex items-center gap-1.5",children:[(0,t.jsx)(y.Filter,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Filter"})]}),(0,t.jsxs)(h.TabsTrigger,{value:"layout",className:"flex items-center gap-1.5",children:[(0,t.jsx)(v.Layout,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Layout"})]}),(0,t.jsxs)(h.TabsTrigger,{value:"behavior",className:"flex items-center gap-1.5",children:[(0,t.jsx)(b.Play,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Behavior"})]}),(0,t.jsxs)(h.TabsTrigger,{value:"controls",className:"flex items-center gap-1.5",children:[(0,t.jsx)(N.MousePointer,{className:"w-4 h-4"}),(0,t.jsx)("span",{className:"hidden sm:inline",children:"Controls"})]})]}),(0,t.jsx)(h.TabsContent,{value:"content",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(p.Label,{htmlFor:"title",className:"text-sm font-medium",children:"Carousel Title"}),(0,t.jsx)(g.Input,{id:"title",type:"text",placeholder:"e.g., Featured Products",value:n.title||"",onChange:e=>l({title:e.target.value}),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Displayed at the top of the carousel"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(p.Label,{htmlFor:"itemsToShow",className:"text-sm font-medium",children:"Number of Products"}),(0,t.jsx)("span",{className:"text-sm font-semibold text-primary",children:n.itemsToShow||8})]}),(0,t.jsx)(g.Input,{id:"itemsToShow",type:"range",min:3,max:20,step:1,value:n.itemsToShow||8,onChange:e=>l({itemsToShow:parseInt(e.target.value)}),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total products to display in carousel (3-20 items)"})]}),(0,t.jsxs)("div",{className:"space-y-4 p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"space-y-0.5",children:[(0,t.jsx)(p.Label,{htmlFor:"showViewAllButton",className:"text-sm font-medium",children:'Show "View All" Button'}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Link to full product listing page"})]}),(0,t.jsx)(f.Switch,{id:"showViewAllButton",checked:n.showViewAllButton,onCheckedChange:e=>l({showViewAllButton:e})})]}),n.showViewAllButton&&(0,t.jsxs)("div",{className:"space-y-2 pt-2 border-t",children:[(0,t.jsx)(p.Label,{htmlFor:"viewAllLink",className:"text-sm font-medium",children:"View All Link URL"}),(0,t.jsx)(g.Input,{id:"viewAllLink",type:"text",placeholder:"/san-pham",value:n.viewAllLink||"",onChange:e=>l({viewAllLink:e.target.value})})]})]})]})}),(0,t.jsx)(h.TabsContent,{value:"filter",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(p.Label,{htmlFor:"filterType",className:"text-sm font-medium",children:"Product Filter Type"}),(0,t.jsxs)(m.Select,{value:n.filterType||"all",onValueChange:e=>l({filterType:e}),children:[(0,t.jsx)(m.SelectTrigger,{id:"filterType",children:(0,t.jsx)(m.SelectValue,{placeholder:"Select filter type"})}),(0,t.jsxs)(m.SelectContent,{children:[(0,t.jsx)(m.SelectItem,{value:"all",children:"All Products"}),(0,t.jsx)(m.SelectItem,{value:"featured",children:"Featured Products"}),(0,t.jsx)(m.SelectItem,{value:"bestseller",children:"Best Sellers"}),(0,t.jsx)(m.SelectItem,{value:"category",children:"By Category"}),(0,t.jsx)(m.SelectItem,{value:"custom",children:"Custom Query"})]})]}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Choose which products to display"})]}),"category"===n.filterType&&(0,t.jsxs)("div",{className:"space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg",children:[(0,t.jsx)(p.Label,{htmlFor:"category",className:"text-sm font-medium text-blue-900",children:"Category Slug"}),(0,t.jsx)(g.Input,{id:"category",type:"text",placeholder:"e.g., dien-thoai-smartphone",value:n.category||"",onChange:e=>l({category:e.target.value})}),(0,t.jsx)("p",{className:"text-xs text-blue-700",children:"Enter the category slug to filter products"})]}),"custom"===n.filterType&&(0,t.jsxs)("div",{className:"space-y-2 p-4 bg-purple-50 border border-purple-200 rounded-lg",children:[(0,t.jsx)(p.Label,{htmlFor:"customQuery",className:"text-sm font-medium text-purple-900",children:"Custom GraphQL Query"}),(0,t.jsx)("textarea",{id:"customQuery",rows:6,placeholder:"Enter GraphQL query...",value:n.customQuery||"",onChange:e=>l({customQuery:e.target.value}),className:"w-full px-3 py-2 text-sm border rounded-md font-mono"}),(0,t.jsx)("p",{className:"text-xs text-purple-700",children:"Advanced: Define custom GraphQL query for products"})]}),(0,t.jsx)("div",{className:"p-4 bg-green-50 border border-green-200 rounded-lg",children:(0,t.jsxs)("p",{className:"text-sm text-green-800",children:[(0,t.jsx)("strong",{children:"✅ Data Source:"})," Products are loaded from table"," ",(0,t.jsx)("code",{className:"px-1.5 py-0.5 bg-green-100 rounded text-xs",children:"ext_sanphamhoadon"})," ","using dynamic GraphQL queries."]})})]})}),(0,t.jsx)(h.TabsContent,{value:"layout",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)("h3",{className:"text-sm font-semibold text-gray-900",children:"Responsive Items Per View"}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(p.Label,{htmlFor:"desktopItems",className:"text-sm font-medium",children:"🖥️ Desktop (> 1024px)"}),(0,t.jsx)("span",{className:"text-sm font-semibold text-primary",children:n.responsive?.desktop||4})]}),(0,t.jsx)(g.Input,{id:"desktopItems",type:"range",min:2,max:6,step:1,value:n.responsive?.desktop||4,onChange:e=>c("desktop",parseInt(e.target.value)),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Items displayed on large screens"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(p.Label,{htmlFor:"tabletItems",className:"text-sm font-medium",children:"📱 Tablet (640px - 1024px)"}),(0,t.jsx)("span",{className:"text-sm font-semibold text-primary",children:n.responsive?.tablet||3})]}),(0,t.jsx)(g.Input,{id:"tabletItems",type:"range",min:2,max:4,step:1,value:n.responsive?.tablet||3,onChange:e=>c("tablet",parseInt(e.target.value)),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Items displayed on medium screens"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(p.Label,{htmlFor:"mobileItems",className:"text-sm font-medium",children:"📱 Mobile (< 640px)"}),(0,t.jsx)("span",{className:"text-sm font-semibold text-primary",children:n.responsive?.mobile||2})]}),(0,t.jsx)(g.Input,{id:"mobileItems",type:"range",min:1,max:3,step:1,value:n.responsive?.mobile||2,onChange:e=>c("mobile",parseInt(e.target.value)),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Items displayed on small screens"})]})]}),(0,t.jsx)("div",{className:"p-4 bg-blue-50 border border-blue-200 rounded-lg",children:(0,t.jsxs)("p",{className:"text-sm text-blue-800",children:[(0,t.jsx)("strong",{children:"💡 Responsive Design:"})," Carousel automatically adjusts based on screen size. Mobile-first approach ensures optimal viewing on all devices."]})})]})}),(0,t.jsx)(h.TabsContent,{value:"behavior",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"space-y-0.5",children:[(0,t.jsx)(p.Label,{htmlFor:"autoplay",className:"text-sm font-medium",children:"Autoplay"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Automatically scroll through products"})]}),(0,t.jsx)(f.Switch,{id:"autoplay",checked:n.autoplay,onCheckedChange:e=>l({autoplay:e})})]}),n.autoplay&&(0,t.jsxs)("div",{className:"space-y-2 p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(p.Label,{htmlFor:"autoplayDelay",className:"text-sm font-medium",children:"Autoplay Speed"}),(0,t.jsxs)("span",{className:"text-sm font-semibold text-primary",children:[(n.autoplayDelay||3e3)/1e3,"s"]})]}),(0,t.jsx)(g.Input,{id:"autoplayDelay",type:"range",min:2e3,max:1e4,step:500,value:n.autoplayDelay||3e3,onChange:e=>l({autoplayDelay:parseInt(e.target.value)}),className:"w-full"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Time between slides (2-10 seconds)"})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"space-y-0.5",children:[(0,t.jsx)(p.Label,{htmlFor:"loop",className:"text-sm font-medium",children:"Loop Carousel"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Return to first item after reaching the end"})]}),(0,t.jsx)(f.Switch,{id:"loop",checked:n.loop,onCheckedChange:e=>l({loop:e})})]})]})}),(0,t.jsx)(h.TabsContent,{value:"controls",className:"space-y-6 mt-6",children:(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between p-4 bg-muted/50 rounded-lg border",children:[(0,t.jsxs)("div",{className:"space-y-0.5",children:[(0,t.jsx)(p.Label,{htmlFor:"showNavigation",className:"text-sm font-medium",children:"Navigation Arrows"}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Show previous/next buttons"})]}),(0,t.jsx)(f.Switch,{id:"showNavigation",checked:n.showNavigation,onCheckedChange:e=>l({showNavigation:e})})]}),(0,t.jsx)("div",{className:"p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg",children:(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("p",{className:"text-sm font-medium text-gray-900",children:"🎨 Control Preview"}),(0,t.jsx)("div",{className:"flex items-center gap-3 justify-center py-6",children:n.showNavigation&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:"w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 border-2 border-gray-200",children:"‹"}),(0,t.jsx)("div",{className:"px-4 py-2 bg-white rounded-lg shadow-sm border text-sm text-gray-600",children:"Product Cards"}),(0,t.jsx)("div",{className:"w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 border-2 border-gray-200",children:"›"})]})}),(0,t.jsx)("p",{className:"text-xs text-gray-600 text-center",children:n.showNavigation?"✓ Navigation arrows enabled":"✗ Navigation arrows hidden"})]})}),(0,t.jsx)("div",{className:"p-4 bg-green-50 border border-green-200 rounded-lg",children:(0,t.jsxs)("p",{className:"text-sm text-green-800",children:[(0,t.jsx)("strong",{children:"👆 Touch Support:"})," Carousel supports touch/swipe gestures on mobile devices automatically."]})})]})})]}),(0,t.jsxs)(u.DialogFooter,{className:"gap-2",children:[(0,t.jsx)(d.Button,{variant:"outline",onClick:()=>s(!1),className:"min-w-[100px]",children:"Cancel"}),(0,t.jsx)(d.Button,{onClick:()=>{i(n),s(!1)},className:"min-w-[100px]",children:"Save Settings"})]})]})})}var w=e.i(586754),$=e.i(579448);let C=({block:e,isEditable:u=!0,onUpdate:p,onDelete:m})=>{let f=e.content,[g,h]=(0,a.useState)(!1),[x,y]=(0,a.useState)(f||{title:"Sản phẩm nổi bật",filterType:"all",itemsToShow:8,showViewAllButton:!0,viewAllLink:"/san-pham",autoplay:!1,autoplayDelay:3e3,loop:!0,showNavigation:!0,responsive:{mobile:2,tablet:3,desktop:4}}),[v,b]=(0,a.useState)(0),N=(0,a.useRef)(null),{data:C,loading:E}=(0,c.useDynamicQuery)("GET_ALL","ext_sanphamhoadon",{fetchPolicy:"cache-first"}),S=C?.getext_sanphamhoadons||[],T=a.default.useMemo(()=>{let e=[...S];switch(x.filterType){case"featured":e=e.filter(e=>!0===e.noibat);break;case"bestseller":e=e.filter(e=>!0===e.banchay);break;case"category":x.category&&(e=e.filter(e=>e.danhmuc===x.category))}return e.slice(0,x.itemsToShow||8)},[S,x.filterType,x.category,x.itemsToShow]),_=()=>{let e=window.innerWidth;return e<640?x.responsive?.mobile||2:e<1024?x.responsive?.tablet||3:x.responsive?.desktop||4},[D,A]=(0,a.useState)(_());(0,a.useEffect)(()=>{let e=()=>{A(_())};return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[x.responsive]),(0,a.useEffect)(()=>{if(!x.autoplay||g)return;let e=setInterval(()=>{R()},x.autoplayDelay||3e3);return()=>clearInterval(e)},[x.autoplay,x.autoplayDelay,v,g]);let I=Math.max(0,T.length-D),R=()=>{b(e=>e>=I?x.loop?0:I:e+1)},P=e=>e.ten||e.tensanpham||"Sản phẩm";return u?(0,t.jsxs)("div",{className:"relative border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50/20 group",children:[(0,t.jsxs)("div",{className:"absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10",children:[(0,t.jsxs)(d.Button,{size:"sm",variant:"outline",onClick:()=>h(!0),className:"bg-white shadow-sm hover:bg-blue-50",children:[(0,t.jsx)(o.Settings,{className:"w-4 h-4 mr-1"}),"Settings"]}),(0,t.jsx)(d.Button,{size:"sm",variant:"destructive",onClick:m,className:"shadow-sm",children:(0,t.jsx)(l.Trash2,{className:"w-4 h-4"})})]}),(0,t.jsx)(j,{open:g,onOpenChange:h,settings:x,onSave:e=>{y(e),p(e)}}),(0,t.jsxs)("div",{className:"pointer-events-none",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,t.jsxs)("h2",{className:"text-xl font-bold text-gray-700",children:[x.title||"Sản phẩm"," (Preview)"]}),x.showNavigation&&(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(d.Button,{variant:"outline",size:"icon",disabled:!0,children:(0,t.jsx)(s.ChevronLeft,{className:"w-4 h-4"})}),(0,t.jsx)(d.Button,{variant:"outline",size:"icon",disabled:!0,children:(0,t.jsx)(r.ChevronRight,{className:"w-4 h-4"})})]})]}),(0,t.jsxs)("div",{className:"bg-white p-4 rounded border",children:[(0,t.jsxs)("p",{className:"text-sm text-gray-600",children:["📦 ",T.length," sản phẩm •","all"===x.filterType&&" Tất cả","featured"===x.filterType&&" Nổi bật","bestseller"===x.filterType&&" Bán chạy","category"===x.filterType&&` Danh mục: ${x.category||"Chưa chọn"}`]}),E&&(0,t.jsx)("p",{className:"text-sm text-gray-500 mt-2",children:"Đang tải..."})]})]})]}):(0,t.jsx)("div",{className:"product-carousel-block py-8 px-4 bg-gray-50",children:(0,t.jsxs)("div",{className:"max-w-7xl mx-auto",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,t.jsx)("h2",{className:"text-2xl md:text-3xl font-bold text-gray-900",children:x.title||"Sản phẩm"}),x.showNavigation&&(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(d.Button,{variant:"outline",size:"icon",onClick:()=>{b(e=>e<=0?x.loop?I:0:e-1)},disabled:0===v&&!x.loop,className:"rounded-full",children:(0,t.jsx)(s.ChevronLeft,{className:"w-5 h-5"})}),(0,t.jsx)(d.Button,{variant:"outline",size:"icon",onClick:R,disabled:v>=I&&!x.loop,className:"rounded-full",children:(0,t.jsx)(r.ChevronRight,{className:"w-5 h-5"})})]})]}),(0,t.jsx)("div",{className:"relative overflow-hidden",children:(0,t.jsx)("div",{ref:N,className:"flex transition-transform duration-300 ease-in-out",style:{transform:`translateX(-${100/D*v}%)`},children:T.map(e=>{var a;return(0,t.jsx)("div",{className:"flex-shrink-0 px-2",style:{width:`${100/D}%`},children:(0,t.jsxs)("div",{className:"bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group",children:[(0,t.jsxs)("div",{className:"relative aspect-square bg-gray-200",children:[e.hinhanh?(0,t.jsx)(w.default,{src:e.hinhanh,alt:P(e),fill:!0,className:"object-cover group-hover:scale-105 transition-transform duration-300"}):(0,t.jsx)("div",{className:"flex items-center justify-center h-full text-gray-400",children:(0,t.jsx)(i.ShoppingCart,{className:"w-12 h-12"})}),(0,t.jsx)("button",{className:"absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg",children:(0,t.jsx)(n.Eye,{className:"w-4 h-4 text-gray-700"})})]}),(0,t.jsxs)("div",{className:"p-4",children:[(0,t.jsx)("h3",{className:"font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]",children:P(e)}),(0,t.jsx)("div",{className:"flex items-center justify-between mb-3",children:(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-lg font-bold text-primary",children:(a=e.gia||e.dongia||0)?new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(a):"0 đ"}),e.donvitinh&&(0,t.jsxs)("p",{className:"text-xs text-gray-500",children:["/",e.donvitinh]})]})}),(0,t.jsxs)(d.Button,{className:"w-full",size:"sm",children:[(0,t.jsx)(i.ShoppingCart,{className:"w-4 h-4 mr-2"}),"Mua ngay"]})]})]})},e.id)})})}),x.showViewAllButton&&x.viewAllLink&&(0,t.jsx)("div",{className:"text-center mt-6",children:(0,t.jsx)($.default,{href:x.viewAllLink,children:(0,t.jsxs)(d.Button,{variant:"outline",size:"lg",children:["Xem tất cả",(0,t.jsx)(r.ChevronRight,{className:"w-4 h-4 ml-2"})]})})}),E&&(0,t.jsx)("div",{className:"text-center py-8 text-gray-500",children:"Đang tải sản phẩm..."}),!E&&0===T.length&&(0,t.jsx)("div",{className:"text-center py-8 text-gray-500",children:"Không có sản phẩm nào"})]})})};e.s(["ProductCarouselBlock",0,C,"default",0,C],164925)}]);