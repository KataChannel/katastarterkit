(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,867375,e=>{"use strict";var t,r,n=e.i(44990),i=e.i(579448),o=e.i(130775),a=e.i(123959),l=e.i(429105),s=e.i(984804);let d=s.gql`
  query GetPublicMenus(
    $type: String
    $isActive: Boolean
    $isVisible: Boolean
    $orderBy: JSON
    $skip: Int
    $take: Int
    $includeChildren: Boolean
  ) {
    publicMenus(
      type: $type
      isActive: $isActive
      isVisible: $isVisible
      orderBy: $orderBy
      skip: $skip
      take: $take
      includeChildren: $includeChildren
    )
  }
`;s.gql`
  query GetPublicMenuById(
    $id: String!
    $includeChildren: Boolean
  ) {
    publicMenuById(
      id: $id
      includeChildren: $includeChildren
    )
  }
`,s.gql`
  query GetHeaderMenus {
    headerMenus {
      id
      title
      slug
      description
      order
      level
      url
      route
      externalUrl
      target
      icon
      badge
      badgeColor
      isActive
      isVisible
      children {
        id
        title
        slug
        description
        order
        level
        url
        route
        externalUrl
        target
        icon
        badge
        isActive
        isVisible
        children {
          id
          title
          slug
          description
          order
          url
          route
          externalUrl
          target
          icon
          badge
          isActive
          isVisible
        }
      }
    }
  }
`,s.gql`
  query GetMenusByType($type: MenuType!) {
    menus(filter: { type: $type, isActive: true, isVisible: true }) {
      items {
        id
        title
        slug
        description
        type
        order
        level
        url
        route
        externalUrl
        target
        icon
        badge
        badgeColor
        isActive
        isVisible
        children {
          id
          title
          slug
          description
          order
          level
          url
          route
          externalUrl
          target
          icon
          badge
          isActive
          isVisible
          children {
            id
            title
            slug
            description
            order
            url
            route
            externalUrl
            target
            icon
            badge
            isActive
            isVisible
          }
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`,s.gql`
  query GetMenuTree($type: MenuType) {
    menuTree(type: $type) {
      id
      title
      slug
      description
      order
      level
      url
      route
      externalUrl
      target
      icon
      badge
      badgeColor
      isActive
      isVisible
      children {
        id
        title
        slug
        description
        order
        level
        url
        route
        externalUrl
        target
        icon
        badge
        isActive
        isVisible
        children {
          id
          title
          slug
          description
          order
          url
          route
          externalUrl
          target
          icon
          badge
          isActive
          isVisible
        }
      }
    }
  }
`,s.gql`
  query GetMenuBySlug($slug: String!) {
    menuBySlug(slug: $slug) {
      id
      title
      slug
      description
      type
      order
      level
      url
      route
      externalUrl
      target
      icon
      badge
      badgeColor
      isActive
      isVisible
      children {
        id
        title
        slug
        description
        order
        level
        url
        route
        externalUrl
        target
        icon
        badge
        isActive
        isVisible
        children {
          id
          title
          slug
          description
          order
          url
          route
          externalUrl
          target
          icon
          badge
          isActive
          isVisible
        }
      }
    }
  }
`,s.gql`
  mutation CreateMenu($input: CreateMenuInput!) {
    createMenu(input: $input) {
      id
      title
      slug
      description
      type
      order
      level
      url
      route
      externalUrl
      target
      icon
      badge
      badgeColor
      isActive
      isVisible
      children {
        id
        title
        slug
        url
        route
        externalUrl
        target
        icon
        badge
        isActive
        isVisible
      }
    }
  }
`,s.gql`
  mutation UpdateMenu($id: ID!, $input: UpdateMenuInput!) {
    updateMenu(id: $id, input: $input) {
      id
      title
      slug
      description
      type
      order
      level
      url
      route
      externalUrl
      target
      icon
      badge
      badgeColor
      isActive
      isVisible
      children {
        id
        title
        slug
        url
        route
        externalUrl
        target
        icon
        badge
        isActive
        isVisible
      }
    }
  }
`,s.gql`
  mutation DeleteMenu($id: ID!) {
    deleteMenu(id: $id)
  }
`,s.gql`
  mutation ReorderMenus($ids: [ID!]!) {
    reorderMenus(ids: $ids) {
      id
      title
      order
      isActive
      isVisible
    }
  }
`,s.gql`
  mutation ToggleMenuActive($id: ID!) {
    toggleMenuActive(id: $id) {
      id
      isActive
    }
  }
`,s.gql`
  mutation ToggleMenuVisibility($id: ID!) {
    toggleMenuVisibility(id: $id) {
      id
      isVisible
    }
  }
`,(t={}).SIDEBAR="SIDEBAR",t.HEADER="HEADER",t.FOOTER="FOOTER",t.MOBILE="MOBILE",t.CUSTOM="CUSTOM",(r={}).SELF="SELF",r.BLANK="BLANK",r.MODAL="MODAL";var c=e.i(33925),u=e.i(29767),p=e.i(775680),f=e.i(702470),m=e.i(885205),h=e.i(696134),g=e.i(403055),v=e.i(940392),x=e.i(316618),b=e.i(119836),w=e.i(873273),y=e.i(346412),C=e.i(569658),j=e.i(825198),N=e.i(767478),E=e.i(559663),R=e.i(110964),T=e.i(430840),M=e.i(139540),A=e.i(302193),k=e.i(214018),P=e.i(425101),L="NavigationMenu",[I,S,D]=(0,R.createCollection)(L),[$,_,O]=(0,R.createCollection)(L),[B,H]=(0,x.createContextScope)(L,[D,O]),[V,F]=B(L),[U,K]=B(L),z=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,value:i,onValueChange:o,defaultValue:a,delayDuration:l=200,skipDelayDuration:s=300,orientation:d="horizontal",dir:c,...u}=e,[p,f]=g.useState(null),m=(0,C.useComposedRefs)(t,e=>f(e)),h=(0,j.useDirection)(c),v=g.useRef(0),x=g.useRef(0),b=g.useRef(0),[N,E]=g.useState(!0),[R,T]=(0,y.useControllableState)({prop:i,onChange:e=>{let t=s>0;""!==e?(window.clearTimeout(b.current),t&&E(!1)):(window.clearTimeout(b.current),b.current=window.setTimeout(()=>E(!0),s)),o?.(e)},defaultProp:a??"",caller:L}),M=g.useCallback(()=>{window.clearTimeout(x.current),x.current=window.setTimeout(()=>T(""),150)},[T]),A=g.useCallback(e=>{window.clearTimeout(x.current),T(e)},[T]),k=g.useCallback(e=>{R===e?window.clearTimeout(x.current):v.current=window.setTimeout(()=>{window.clearTimeout(x.current),T(e)},l)},[R,T,l]);return g.useEffect(()=>()=>{window.clearTimeout(v.current),window.clearTimeout(x.current),window.clearTimeout(b.current)},[]),(0,n.jsx)(G,{scope:r,isRootMenu:!0,value:R,dir:h,orientation:d,rootNavigationMenu:p,onTriggerEnter:e=>{window.clearTimeout(v.current),N?k(e):A(e)},onTriggerLeave:()=>{window.clearTimeout(v.current),M()},onContentEnter:()=>window.clearTimeout(x.current),onContentLeave:M,onItemSelect:e=>{T(t=>t===e?"":e)},onItemDismiss:()=>T(""),children:(0,n.jsx)(w.Primitive.nav,{"aria-label":"Main","data-orientation":d,dir:h,...u,ref:m})})});z.displayName=L;var q="NavigationMenuSub";g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,value:i,onValueChange:o,defaultValue:a,orientation:l="horizontal",...s}=e,d=F(q,r),[c,u]=(0,y.useControllableState)({prop:i,onChange:o,defaultProp:a??"",caller:q});return(0,n.jsx)(G,{scope:r,isRootMenu:!1,value:c,dir:d.dir,orientation:l,rootNavigationMenu:d.rootNavigationMenu,onTriggerEnter:e=>u(e),onItemSelect:e=>u(e),onItemDismiss:()=>u(""),children:(0,n.jsx)(w.Primitive.div,{"data-orientation":l,...s,ref:t})})}).displayName=q;var G=e=>{let{scope:t,isRootMenu:r,rootNavigationMenu:i,dir:o,orientation:a,children:l,value:s,onItemSelect:d,onItemDismiss:c,onTriggerEnter:u,onTriggerLeave:p,onContentEnter:f,onContentLeave:m}=e,[h,v]=g.useState(null),[x,b]=g.useState(new Map),[w,y]=g.useState(null);return(0,n.jsx)(V,{scope:t,isRootMenu:r,rootNavigationMenu:i,value:s,previousValue:(0,M.usePrevious)(s),baseId:(0,E.useId)(),dir:o,orientation:a,viewport:h,onViewportChange:v,indicatorTrack:w,onIndicatorTrackChange:y,onTriggerEnter:(0,k.useCallbackRef)(u),onTriggerLeave:(0,k.useCallbackRef)(p),onContentEnter:(0,k.useCallbackRef)(f),onContentLeave:(0,k.useCallbackRef)(m),onItemSelect:(0,k.useCallbackRef)(d),onItemDismiss:(0,k.useCallbackRef)(c),onViewportContentChange:g.useCallback((e,t)=>{b(r=>(r.set(e,t),new Map(r)))},[]),onViewportContentRemove:g.useCallback(e=>{b(t=>t.has(e)?(t.delete(e),new Map(t)):t)},[]),children:(0,n.jsx)(I.Provider,{scope:t,children:(0,n.jsx)(U,{scope:t,items:x,children:l})})})},W="NavigationMenuList",Y=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,...i}=e,o=F(W,r),a=(0,n.jsx)(w.Primitive.ul,{"data-orientation":o.orientation,...i,ref:t});return(0,n.jsx)(w.Primitive.div,{style:{position:"relative"},ref:o.onIndicatorTrackChange,children:(0,n.jsx)(I.Slot,{scope:r,children:o.isRootMenu?(0,n.jsx)(eh,{asChild:!0,children:a}):a})})});Y.displayName=W;var X="NavigationMenuItem",[J,Q]=B(X),Z=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,value:i,...o}=e,a=(0,E.useId)(),l=g.useRef(null),s=g.useRef(null),d=g.useRef(null),c=g.useRef(()=>{}),u=g.useRef(!1),p=g.useCallback((e="start")=>{if(l.current){c.current();let t=ex(l.current);t.length&&eb("start"===e?t:t.reverse())}},[]),f=g.useCallback(()=>{if(l.current){var e;let t=ex(l.current);t.length&&((e=t).forEach(e=>{e.dataset.tabindex=e.getAttribute("tabindex")||"",e.setAttribute("tabindex","-1")}),c.current=()=>{e.forEach(e=>{let t=e.dataset.tabindex;e.setAttribute("tabindex",t)})})}},[]);return(0,n.jsx)(J,{scope:r,value:i||a||"LEGACY_REACT_AUTO_VALUE",triggerRef:s,contentRef:l,focusProxyRef:d,wasEscapeCloseRef:u,onEntryKeyDown:p,onFocusProxyEnter:p,onRootContentClose:f,onContentFocusOutside:f,children:(0,n.jsx)(w.Primitive.li,{...o,ref:t})})});Z.displayName=X;var ee="NavigationMenuTrigger",et=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,disabled:i,...o}=e,a=F(ee,e.__scopeNavigationMenu),l=Q(ee,e.__scopeNavigationMenu),s=g.useRef(null),d=(0,C.useComposedRefs)(s,l.triggerRef,t),c=eC(a.baseId,l.value),u=ej(a.baseId,l.value),p=g.useRef(!1),f=g.useRef(!1),m=l.value===a.value;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(I.ItemSlot,{scope:r,value:l.value,children:(0,n.jsx)(ev,{asChild:!0,children:(0,n.jsx)(w.Primitive.button,{id:c,disabled:i,"data-disabled":i?"":void 0,"data-state":ey(m),"aria-expanded":m,"aria-controls":u,...o,ref:d,onPointerEnter:(0,b.composeEventHandlers)(e.onPointerEnter,()=>{f.current=!1,l.wasEscapeCloseRef.current=!1}),onPointerMove:(0,b.composeEventHandlers)(e.onPointerMove,eN(()=>{i||f.current||l.wasEscapeCloseRef.current||p.current||(a.onTriggerEnter(l.value),p.current=!0)})),onPointerLeave:(0,b.composeEventHandlers)(e.onPointerLeave,eN(()=>{i||(a.onTriggerLeave(),p.current=!1)})),onClick:(0,b.composeEventHandlers)(e.onClick,()=>{a.onItemSelect(l.value),f.current=m}),onKeyDown:(0,b.composeEventHandlers)(e.onKeyDown,e=>{let t={horizontal:"ArrowDown",vertical:"rtl"===a.dir?"ArrowLeft":"ArrowRight"}[a.orientation];m&&e.key===t&&(l.onEntryKeyDown(),e.preventDefault())})})})}),m&&(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(P.Root,{"aria-hidden":!0,tabIndex:0,ref:l.focusProxyRef,onFocus:e=>{let t=l.contentRef.current,r=e.relatedTarget,n=r===s.current,i=t?.contains(r);(n||!i)&&l.onFocusProxyEnter(n?"start":"end")}}),a.viewport&&(0,n.jsx)("span",{"aria-owns":u})]})]})});et.displayName=ee;var er="navigationMenu.linkSelect",en=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,active:i,onSelect:o,...a}=e;return(0,n.jsx)(ev,{asChild:!0,children:(0,n.jsx)(w.Primitive.a,{"data-active":i?"":void 0,"aria-current":i?"page":void 0,...a,ref:t,onClick:(0,b.composeEventHandlers)(e.onClick,e=>{let t=e.target,r=new CustomEvent(er,{bubbles:!0,cancelable:!0});if(t.addEventListener(er,e=>o?.(e),{once:!0}),(0,w.dispatchDiscreteCustomEvent)(t,r),!r.defaultPrevented&&!e.metaKey){let e=new CustomEvent(ec,{bubbles:!0,cancelable:!0});(0,w.dispatchDiscreteCustomEvent)(t,e)}},{checkForDefaultPrevented:!1})})})});en.displayName="NavigationMenuLink";var ei="NavigationMenuIndicator",eo=g.forwardRef((e,t)=>{let{forceMount:r,...i}=e,o=F(ei,e.__scopeNavigationMenu),a=!!o.value;return o.indicatorTrack?v.default.createPortal((0,n.jsx)(N.Presence,{present:r||a,children:(0,n.jsx)(ea,{...i,ref:t})}),o.indicatorTrack):null});eo.displayName=ei;var ea=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,...i}=e,o=F(ei,r),a=S(r),[l,s]=g.useState(null),[d,c]=g.useState(null),u="horizontal"===o.orientation,p=!!o.value;g.useEffect(()=>{let e=a(),t=e.find(e=>e.value===o.value)?.ref.current;t&&s(t)},[a,o.value]);let f=()=>{l&&c({size:u?l.offsetWidth:l.offsetHeight,offset:u?l.offsetLeft:l.offsetTop})};return ew(l,f),ew(o.indicatorTrack,f),d?(0,n.jsx)(w.Primitive.div,{"aria-hidden":!0,"data-state":p?"visible":"hidden","data-orientation":o.orientation,...i,ref:t,style:{position:"absolute",...u?{left:0,width:d.size+"px",transform:`translateX(${d.offset}px)`}:{top:0,height:d.size+"px",transform:`translateY(${d.offset}px)`},...i.style}}):null}),el="NavigationMenuContent",es=g.forwardRef((e,t)=>{let{forceMount:r,...i}=e,o=F(el,e.__scopeNavigationMenu),a=Q(el,e.__scopeNavigationMenu),l=(0,C.useComposedRefs)(a.contentRef,t),s=a.value===o.value,d={value:a.value,triggerRef:a.triggerRef,focusProxyRef:a.focusProxyRef,wasEscapeCloseRef:a.wasEscapeCloseRef,onContentFocusOutside:a.onContentFocusOutside,onRootContentClose:a.onRootContentClose,...i};return o.viewport?(0,n.jsx)(ed,{forceMount:r,...d,ref:l}):(0,n.jsx)(N.Presence,{present:r||s,children:(0,n.jsx)(eu,{"data-state":ey(s),...d,ref:l,onPointerEnter:(0,b.composeEventHandlers)(e.onPointerEnter,o.onContentEnter),onPointerLeave:(0,b.composeEventHandlers)(e.onPointerLeave,eN(o.onContentLeave)),style:{pointerEvents:!s&&o.isRootMenu?"none":void 0,...d.style}})})});es.displayName=el;var ed=g.forwardRef((e,t)=>{let{onViewportContentChange:r,onViewportContentRemove:n}=F(el,e.__scopeNavigationMenu);return(0,A.useLayoutEffect)(()=>{r(e.value,{ref:t,...e})},[e,t,r]),(0,A.useLayoutEffect)(()=>()=>n(e.value),[e.value,n]),null}),ec="navigationMenu.rootContentDismiss",eu=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,value:i,triggerRef:o,focusProxyRef:a,wasEscapeCloseRef:l,onRootContentClose:s,onContentFocusOutside:d,...c}=e,u=F(el,r),p=g.useRef(null),f=(0,C.useComposedRefs)(p,t),m=eC(u.baseId,i),h=ej(u.baseId,i),v=S(r),x=g.useRef(null),{onItemDismiss:w}=u;g.useEffect(()=>{let e=p.current;if(u.isRootMenu&&e){let t=()=>{w(),s(),e.contains(document.activeElement)&&o.current?.focus()};return e.addEventListener(ec,t),()=>e.removeEventListener(ec,t)}},[u.isRootMenu,e.value,o,w,s]);let y=g.useMemo(()=>{let e=v().map(e=>e.value);"rtl"===u.dir&&e.reverse();let t=e.indexOf(u.value),r=e.indexOf(u.previousValue),n=i===u.value,o=r===e.indexOf(i);if(!n&&!o)return x.current;let a=(()=>{if(t!==r){if(n&&-1!==r)return t>r?"from-end":"from-start";if(o&&-1!==t)return t>r?"to-start":"to-end"}return null})();return x.current=a,a},[u.previousValue,u.value,u.dir,v,i]);return(0,n.jsx)(eh,{asChild:!0,children:(0,n.jsx)(T.DismissableLayer,{id:h,"aria-labelledby":m,"data-motion":y,"data-orientation":u.orientation,...c,ref:f,disableOutsidePointerEvents:!1,onDismiss:()=>{let e=new Event(ec,{bubbles:!0,cancelable:!0});p.current?.dispatchEvent(e)},onFocusOutside:(0,b.composeEventHandlers)(e.onFocusOutside,e=>{d();let t=e.target;u.rootNavigationMenu?.contains(t)&&e.preventDefault()}),onPointerDownOutside:(0,b.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.target,r=v().some(e=>e.ref.current?.contains(t)),n=u.isRootMenu&&u.viewport?.contains(t);(r||n||!u.isRootMenu)&&e.preventDefault()}),onKeyDown:(0,b.composeEventHandlers)(e.onKeyDown,e=>{let t=e.altKey||e.ctrlKey||e.metaKey;if("Tab"===e.key&&!t){let t=ex(e.currentTarget),r=document.activeElement,n=t.findIndex(e=>e===r);eb(e.shiftKey?t.slice(0,n).reverse():t.slice(n+1,t.length))?e.preventDefault():a.current?.focus()}}),onEscapeKeyDown:(0,b.composeEventHandlers)(e.onEscapeKeyDown,e=>{l.current=!0})})})}),ep="NavigationMenuViewport",ef=g.forwardRef((e,t)=>{let{forceMount:r,...i}=e,o=!!F(ep,e.__scopeNavigationMenu).value;return(0,n.jsx)(N.Presence,{present:r||o,children:(0,n.jsx)(em,{...i,ref:t})})});ef.displayName=ep;var em=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,children:i,...o}=e,a=F(ep,r),l=(0,C.useComposedRefs)(t,a.onViewportChange),s=K(el,e.__scopeNavigationMenu),[d,c]=g.useState(null),[u,p]=g.useState(null),f=d?d?.width+"px":void 0,m=d?d?.height+"px":void 0,h=!!a.value,v=h?a.value:a.previousValue;return ew(u,()=>{u&&c({width:u.offsetWidth,height:u.offsetHeight})}),(0,n.jsx)(w.Primitive.div,{"data-state":ey(h),"data-orientation":a.orientation,...o,ref:l,style:{pointerEvents:!h&&a.isRootMenu?"none":void 0,"--radix-navigation-menu-viewport-width":f,"--radix-navigation-menu-viewport-height":m,...o.style},onPointerEnter:(0,b.composeEventHandlers)(e.onPointerEnter,a.onContentEnter),onPointerLeave:(0,b.composeEventHandlers)(e.onPointerLeave,eN(a.onContentLeave)),children:Array.from(s.items).map(([e,{ref:t,forceMount:r,...i}])=>{let o=v===e;return(0,n.jsx)(N.Presence,{present:r||o,children:(0,n.jsx)(eu,{...i,ref:(0,C.composeRefs)(t,e=>{o&&e&&p(e)})})},e)})})}),eh=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,...i}=e,o=F("FocusGroup",r);return(0,n.jsx)($.Provider,{scope:r,children:(0,n.jsx)($.Slot,{scope:r,children:(0,n.jsx)(w.Primitive.div,{dir:o.dir,...i,ref:t})})})}),eg=["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"],ev=g.forwardRef((e,t)=>{let{__scopeNavigationMenu:r,...i}=e,o=_(r),a=F("FocusGroupItem",r);return(0,n.jsx)($.ItemSlot,{scope:r,children:(0,n.jsx)(w.Primitive.button,{...i,ref:t,onKeyDown:(0,b.composeEventHandlers)(e.onKeyDown,e=>{if(["Home","End",...eg].includes(e.key)){let t=o().map(e=>e.ref.current);if(["rtl"===a.dir?"ArrowRight":"ArrowLeft","ArrowUp","End"].includes(e.key)&&t.reverse(),eg.includes(e.key)){let r=t.indexOf(e.currentTarget);t=t.slice(r+1)}setTimeout(()=>eb(t)),e.preventDefault()}})})})});function ex(e){let t=[],r=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:e=>{let t="INPUT"===e.tagName&&"hidden"===e.type;return e.disabled||e.hidden||t?NodeFilter.FILTER_SKIP:e.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;r.nextNode();)t.push(r.currentNode);return t}function eb(e){let t=document.activeElement;return e.some(e=>e===t||(e.focus(),document.activeElement!==t))}function ew(e,t){let r=(0,k.useCallbackRef)(t);(0,A.useLayoutEffect)(()=>{let t=0;if(e){let n=new ResizeObserver(()=>{cancelAnimationFrame(t),t=window.requestAnimationFrame(r)});return n.observe(e),()=>{window.cancelAnimationFrame(t),n.unobserve(e)}}},[e,r])}function ey(e){return e?"open":"closed"}function eC(e,t){return`${e}-trigger-${t}`}function ej(e,t){return`${e}-content-${t}`}function eN(e){return t=>"mouse"===t.pointerType?e(t):void 0}var eE=e.i(207298),eR=e.i(784386),eT=e.i(541428);let eM=g.forwardRef(({className:e,children:t,...r},i)=>(0,n.jsxs)(z,{ref:i,className:(0,eT.cn)("relative z-10 flex max-w-max flex-1 items-center justify-center",e),...r,children:[t,(0,n.jsx)(eI,{})]}));eM.displayName=z.displayName;let eA=g.forwardRef(({className:e,...t},r)=>(0,n.jsx)(Y,{ref:r,className:(0,eT.cn)("group flex flex-1 list-none items-center justify-center space-x-1",e),...t}));eA.displayName=Y.displayName;let ek=(0,eE.cva)("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"),eP=g.forwardRef(({className:e,children:t,...r},i)=>(0,n.jsxs)(et,{ref:i,className:(0,eT.cn)(ek(),"group",e),...r,children:[t," ",(0,n.jsx)(eR.ChevronDown,{className:"relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180","aria-hidden":"true"})]}));eP.displayName=et.displayName;let eL=g.forwardRef(({className:e,...t},r)=>(0,n.jsx)(es,{ref:r,className:(0,eT.cn)("left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",e),...t}));eL.displayName=es.displayName;let eI=g.forwardRef(({className:e,...t},r)=>(0,n.jsx)("div",{className:(0,eT.cn)("absolute left-0 top-full flex justify-center"),children:(0,n.jsx)(ef,{className:(0,eT.cn)("origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",e),ref:r,...t})}));eI.displayName=ef.displayName,g.forwardRef(({className:e,...t},r)=>(0,n.jsx)(eo,{ref:r,className:(0,eT.cn)("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",e),...t,children:(0,n.jsx)("div",{className:"relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md"})})).displayName=eo.displayName;var eS=e.i(562358),eD=(e.i(581263),e.i(599488)),[e$,e_]=(0,x.createContextScope)("Tooltip",[eS.createPopperScope]),eO=(0,eS.createPopperScope)(),eB="TooltipProvider",eH="tooltip.open",[eV,eF]=e$(eB),eU=e=>{let{__scopeTooltip:t,delayDuration:r=700,skipDelayDuration:i=300,disableHoverableContent:o=!1,children:a}=e,l=g.useRef(!0),s=g.useRef(!1),d=g.useRef(0);return g.useEffect(()=>{let e=d.current;return()=>window.clearTimeout(e)},[]),(0,n.jsx)(eV,{scope:t,isOpenDelayedRef:l,delayDuration:r,onOpen:g.useCallback(()=>{window.clearTimeout(d.current),l.current=!1},[]),onClose:g.useCallback(()=>{window.clearTimeout(d.current),d.current=window.setTimeout(()=>l.current=!0,i)},[i]),isPointerInTransitRef:s,onPointerInTransitChange:g.useCallback(e=>{s.current=e},[]),disableHoverableContent:o,children:a})};eU.displayName=eB;var eK="Tooltip",[ez,eq]=e$(eK),eG=e=>{let{__scopeTooltip:t,children:r,open:i,defaultOpen:o,onOpenChange:a,disableHoverableContent:l,delayDuration:s}=e,d=eF(eK,e.__scopeTooltip),c=eO(t),[u,p]=g.useState(null),f=(0,E.useId)(),m=g.useRef(0),h=l??d.disableHoverableContent,v=s??d.delayDuration,x=g.useRef(!1),[b,w]=(0,y.useControllableState)({prop:i,defaultProp:o??!1,onChange:e=>{e?(d.onOpen(),document.dispatchEvent(new CustomEvent(eH))):d.onClose(),a?.(e)},caller:eK}),C=g.useMemo(()=>b?x.current?"delayed-open":"instant-open":"closed",[b]),j=g.useCallback(()=>{window.clearTimeout(m.current),m.current=0,x.current=!1,w(!0)},[w]),N=g.useCallback(()=>{window.clearTimeout(m.current),m.current=0,w(!1)},[w]),R=g.useCallback(()=>{window.clearTimeout(m.current),m.current=window.setTimeout(()=>{x.current=!0,w(!0),m.current=0},v)},[v,w]);return g.useEffect(()=>()=>{m.current&&(window.clearTimeout(m.current),m.current=0)},[]),(0,n.jsx)(eS.Root,{...c,children:(0,n.jsx)(ez,{scope:t,contentId:f,open:b,stateAttribute:C,trigger:u,onTriggerChange:p,onTriggerEnter:g.useCallback(()=>{d.isOpenDelayedRef.current?R():j()},[d.isOpenDelayedRef,R,j]),onTriggerLeave:g.useCallback(()=>{h?N():(window.clearTimeout(m.current),m.current=0)},[N,h]),onOpen:j,onClose:N,disableHoverableContent:h,children:r})})};eG.displayName=eK;var eW="TooltipTrigger",eY=g.forwardRef((e,t)=>{let{__scopeTooltip:r,...i}=e,o=eq(eW,r),a=eF(eW,r),l=eO(r),s=g.useRef(null),d=(0,C.useComposedRefs)(t,s,o.onTriggerChange),c=g.useRef(!1),u=g.useRef(!1),p=g.useCallback(()=>c.current=!1,[]);return g.useEffect(()=>()=>document.removeEventListener("pointerup",p),[p]),(0,n.jsx)(eS.Anchor,{asChild:!0,...l,children:(0,n.jsx)(w.Primitive.button,{"aria-describedby":o.open?o.contentId:void 0,"data-state":o.stateAttribute,...i,ref:d,onPointerMove:(0,b.composeEventHandlers)(e.onPointerMove,e=>{"touch"!==e.pointerType&&(u.current||a.isPointerInTransitRef.current||(o.onTriggerEnter(),u.current=!0))}),onPointerLeave:(0,b.composeEventHandlers)(e.onPointerLeave,()=>{o.onTriggerLeave(),u.current=!1}),onPointerDown:(0,b.composeEventHandlers)(e.onPointerDown,()=>{o.open&&o.onClose(),c.current=!0,document.addEventListener("pointerup",p,{once:!0})}),onFocus:(0,b.composeEventHandlers)(e.onFocus,()=>{c.current||o.onOpen()}),onBlur:(0,b.composeEventHandlers)(e.onBlur,o.onClose),onClick:(0,b.composeEventHandlers)(e.onClick,o.onClose)})})});eY.displayName=eW;var[eX,eJ]=e$("TooltipPortal",{forceMount:void 0}),eQ="TooltipContent",eZ=g.forwardRef((e,t)=>{let r=eJ(eQ,e.__scopeTooltip),{forceMount:i=r.forceMount,side:o="top",...a}=e,l=eq(eQ,e.__scopeTooltip);return(0,n.jsx)(N.Presence,{present:i||l.open,children:l.disableHoverableContent?(0,n.jsx)(e4,{side:o,...a,ref:t}):(0,n.jsx)(e0,{side:o,...a,ref:t})})}),e0=g.forwardRef((e,t)=>{let r=eq(eQ,e.__scopeTooltip),i=eF(eQ,e.__scopeTooltip),o=g.useRef(null),a=(0,C.useComposedRefs)(t,o),[l,s]=g.useState(null),{trigger:d,onClose:c}=r,u=o.current,{onPointerInTransitChange:p}=i,f=g.useCallback(()=>{s(null),p(!1)},[p]),m=g.useCallback((e,t)=>{let r,n=e.currentTarget,i={x:e.clientX,y:e.clientY},o=function(e,t){let r=Math.abs(t.top-e.y),n=Math.abs(t.bottom-e.y),i=Math.abs(t.right-e.x),o=Math.abs(t.left-e.x);switch(Math.min(r,n,i,o)){case o:return"left";case i:return"right";case r:return"top";case n:return"bottom";default:throw Error("unreachable")}}(i,n.getBoundingClientRect());s(((r=[...function(e,t,r=5){let n=[];switch(t){case"top":n.push({x:e.x-r,y:e.y+r},{x:e.x+r,y:e.y+r});break;case"bottom":n.push({x:e.x-r,y:e.y-r},{x:e.x+r,y:e.y-r});break;case"left":n.push({x:e.x+r,y:e.y-r},{x:e.x+r,y:e.y+r});break;case"right":n.push({x:e.x-r,y:e.y-r},{x:e.x-r,y:e.y+r})}return n}(i,o),...function(e){let{top:t,right:r,bottom:n,left:i}=e;return[{x:i,y:t},{x:r,y:t},{x:r,y:n},{x:i,y:n}]}(t.getBoundingClientRect())].slice()).sort((e,t)=>e.x<t.x?-1:e.x>t.x?1:e.y<t.y?-1:1*!!(e.y>t.y)),function(e){if(e.length<=1)return e.slice();let t=[];for(let r=0;r<e.length;r++){let n=e[r];for(;t.length>=2;){let e=t[t.length-1],r=t[t.length-2];if((e.x-r.x)*(n.y-r.y)>=(e.y-r.y)*(n.x-r.x))t.pop();else break}t.push(n)}t.pop();let r=[];for(let t=e.length-1;t>=0;t--){let n=e[t];for(;r.length>=2;){let e=r[r.length-1],t=r[r.length-2];if((e.x-t.x)*(n.y-t.y)>=(e.y-t.y)*(n.x-t.x))r.pop();else break}r.push(n)}return(r.pop(),1===t.length&&1===r.length&&t[0].x===r[0].x&&t[0].y===r[0].y)?t:t.concat(r)}(r))),p(!0)},[p]);return g.useEffect(()=>()=>f(),[f]),g.useEffect(()=>{if(d&&u){let e=e=>m(e,u),t=e=>m(e,d);return d.addEventListener("pointerleave",e),u.addEventListener("pointerleave",t),()=>{d.removeEventListener("pointerleave",e),u.removeEventListener("pointerleave",t)}}},[d,u,m,f]),g.useEffect(()=>{if(l){let e=e=>{let t=e.target,r={x:e.clientX,y:e.clientY},n=d?.contains(t)||u?.contains(t),i=!function(e,t){let{x:r,y:n}=e,i=!1;for(let e=0,o=t.length-1;e<t.length;o=e++){let a=t[e],l=t[o],s=a.x,d=a.y,c=l.x,u=l.y;d>n!=u>n&&r<(c-s)*(n-d)/(u-d)+s&&(i=!i)}return i}(r,l);n?f():i&&(f(),c())};return document.addEventListener("pointermove",e),()=>document.removeEventListener("pointermove",e)}},[d,u,l,c,f]),(0,n.jsx)(e4,{...e,ref:a})}),[e1,e2]=e$(eK,{isInside:!1}),e5=(0,eD.createSlottable)("TooltipContent"),e4=g.forwardRef((e,t)=>{let{__scopeTooltip:r,children:i,"aria-label":o,onEscapeKeyDown:a,onPointerDownOutside:l,...s}=e,d=eq(eQ,r),c=eO(r),{onClose:u}=d;return g.useEffect(()=>(document.addEventListener(eH,u),()=>document.removeEventListener(eH,u)),[u]),g.useEffect(()=>{if(d.trigger){let e=e=>{let t=e.target;t?.contains(d.trigger)&&u()};return window.addEventListener("scroll",e,{capture:!0}),()=>window.removeEventListener("scroll",e,{capture:!0})}},[d.trigger,u]),(0,n.jsx)(T.DismissableLayer,{asChild:!0,disableOutsidePointerEvents:!1,onEscapeKeyDown:a,onPointerDownOutside:l,onFocusOutside:e=>e.preventDefault(),onDismiss:u,children:(0,n.jsxs)(eS.Content,{"data-state":d.stateAttribute,...c,...s,ref:t,style:{...s.style,"--radix-tooltip-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-tooltip-content-available-width":"var(--radix-popper-available-width)","--radix-tooltip-content-available-height":"var(--radix-popper-available-height)","--radix-tooltip-trigger-width":"var(--radix-popper-anchor-width)","--radix-tooltip-trigger-height":"var(--radix-popper-anchor-height)"},children:[(0,n.jsx)(e5,{children:i}),(0,n.jsx)(e1,{scope:r,isInside:!0,children:(0,n.jsx)(P.Root,{id:d.contentId,role:"tooltip",children:o||i})})]})})});eZ.displayName=eQ;var e3="TooltipArrow";g.forwardRef((e,t)=>{let{__scopeTooltip:r,...i}=e,o=eO(r);return e2(e3,r).isInside?null:(0,n.jsx)(eS.Arrow,{...o,...i,ref:t})}).displayName=e3;let e8=g.forwardRef(({className:e,sideOffset:t=4,...r},i)=>(0,n.jsx)(eZ,{ref:i,sideOffset:t,className:(0,eT.cn)("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",e),...r}));e8.displayName=eZ.displayName;var e6=e.i(99529),e7=e.i(850384),e9=e.i(202774),te=e.i(670662);let tt=g.default.forwardRef(({className:e,title:t,children:r,href:o,target:a,...l},s)=>(0,n.jsx)("li",{children:(0,n.jsx)(en,{asChild:!0,children:(0,n.jsxs)(i.default,{ref:s,href:o||"#",className:(0,eT.cn)("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",e),target:"BLANK"===a?"_blank":void 0,rel:"BLANK"===a?"noopener noreferrer":void 0,...l,children:[(0,n.jsx)("div",{className:"text-sm font-medium leading-none",children:t}),(0,n.jsx)("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:r})]})})}));function tr(){let{user:e,isAuthenticated:t,logout:r}=(0,a.useAuth)(),s=(0,o.useRouter)(),{data:v=[],loading:x}=(0,c.useHeaderSettings)(),b=(0,g.useMemo)(()=>(0,c.settingsToMap)(v),[v]),{data:w=[],loading:y}=(0,c.useContactSettings)(),C=(0,g.useMemo)(()=>(0,c.settingsToMap)(w),[w]),{data:j,loading:N,error:E}=(0,l.useQuery)(d,{variables:{type:"HEADER",isActive:!0,isVisible:!0,orderBy:{order:"asc"},includeChildren:!0},fetchPolicy:"network-only"}),R=j?.publicMenus||[];(0,g.useEffect)(()=>{E&&console.error("[WebsiteHeader] Failed to load menu:",E.message)},[E]),console.log("headerSettings",b),console.log("contactSettings",C),console.log("headerMenus",R);let T=[{id:1,title:"Khuyến Mãi Đặc Biệt",subtitle:"Giảm giá lên đến 50% cho tất cả sản phẩm",description:"Ưu đãi có thời hạn - Nhanh tay đặt hàng!",image:"/assets/images/tunongtraidenbanan.jpg",cta:"Mua Ngay",badge:"HOT",bgColor:""}],[M,A]=(0,g.useState)(0),[k,P]=(0,g.useState)();return(0,g.useEffect)(()=>{if(!k)return;let e=setInterval(()=>{k.scrollNext()},5e3);return()=>clearInterval(e)},[k]),(0,g.useEffect)(()=>{if(!k)return;let e=()=>{A(k.selectedScrollSnap())};return k.on("select",e),e(),()=>{k.off("select",e)}},[k]),(0,n.jsxs)("header",{className:"bg-white border-b border-gray-200",children:[b["header.banner_enabled"]&&(0,n.jsxs)("div",{className:"relative overflow-hidden",children:[(0,n.jsxs)(u.Carousel,{className:"w-full mx-auto",setApi:P,opts:{align:"start",loop:!0},children:[(0,n.jsx)(u.CarouselContent,{children:T.map((e,t)=>(0,n.jsx)(u.CarouselItem,{children:(0,n.jsx)("div",{className:"relative",children:(0,n.jsx)(p.Card,{className:"border-0 rounded-none",children:(0,n.jsx)(p.CardContent,{className:`relative p-0 ${e.bgColor} overflow-hidden`,children:(0,n.jsx)("div",{className:"relative z-10 h-full flex items-center",children:(0,n.jsx)("div",{className:"mx-auto",children:(0,n.jsx)("div",{className:"hidden lg:block w-full overflow-hidden shadow-2xl flex-shrink-0",style:{height:`${b["header.banner_height"]||208}px`},children:(0,n.jsx)("img",{src:e.image,alt:e.title,className:"w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"})})})})})})})},e.id))}),(0,n.jsx)(u.CarouselPrevious,{className:"left-4 bg-white/20 border-white/30 text-white hover:bg-white/40 transition-all duration-300 backdrop-blur-sm"}),(0,n.jsx)(u.CarouselNext,{className:"right-4 bg-white/20 border-white/30 text-white hover:bg-white/40 transition-all duration-300 backdrop-blur-sm"})]}),(0,n.jsx)("div",{className:"absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2",children:T.map((e,t)=>(0,n.jsx)("button",{className:`w-2 h-2 rounded-full transition-all duration-300 ${t===M?"bg-white w-6":"bg-white/50"}`,onClick:()=>{k&&k.scrollTo(t)}},t))})]}),(0,n.jsx)("div",{className:"w-full mx-auto",children:(0,n.jsxs)("div",{className:"grid grid-cols-6 items-center",style:{backgroundColor:b["header.background_color"]||"#57A345"},children:[(0,n.jsx)("div",{className:"bg-white col-span-2 flex justify-end p-4 rounded-e-full pe-8",children:(0,n.jsx)(i.default,{href:"/",className:"text-2xl font-bold text-blue-600",children:(0,n.jsx)("img",{src:b["header.logo"]||"/assets/images/logo.svg",alt:"Logo",className:"max-h-20",style:{height:`${b["header.logo_width"]||80}px`,maxHeight:`${b["header.logo_width"]||80}px`}})})}),(0,n.jsxs)("div",{className:"col-span-3 flex flex-col space-y-2",children:[(0,n.jsx)(eM,{className:"w-full p-4",children:(0,n.jsxs)(eA,{className:"flex justify-evenly space-x-1 lg:space-x-2 w-full flex-wrap",children:[(0,n.jsx)(Z,{children:(0,n.jsx)(en,{asChild:!0})}),N?(0,n.jsx)("div",{className:"text-white text-sm",children:"Đang tải menu..."}):E?(0,n.jsx)("div",{className:"text-red-200 text-sm",children:"Lỗi tải menu"}):R.filter(e=>(0===e.level||1===e.level)&&e.isActive&&e.isVisible).sort((e,t)=>e.order-t.order).map(e=>(e=>{if(!e.isVisible||!e.isActive)return null;let t=e.route||e.url||"#",r="BLANK"===e.target||e.externalUrl;return e.children&&Array.isArray(e.children)&&e.children.length>0?(0,n.jsxs)(Z,{children:[(0,n.jsxs)(eP,{className:"text-white hover:text-blue-200 bg-transparent hover:bg-white/10 data-[state=open]:bg-white/20 text-sm lg:text-base px-2 lg:px-4",children:[e.icon&&(0,n.jsx)("span",{className:"mr-2",children:e.icon}),e.title,e.badge&&(0,n.jsx)(f.Badge,{className:"ml-2 text-xs",children:e.badge})]}),(0,n.jsx)(eL,{children:(0,n.jsx)("div",{className:"grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]",children:e.children.map(e=>{let t=e.route||e.url||"#";return(0,n.jsx)(tt,{href:t,title:e.title,target:"BLANK"===e.target?"_blank":void 0,children:e.description||e.title},e.id)})})})]},e.id):(0,n.jsx)(Z,{children:(0,n.jsx)(en,{asChild:!0,children:(0,n.jsxs)(i.default,{href:t,className:(0,eT.cn)(ek(),"text-white hover:text-blue-200 bg-transparent hover:bg-white/10 text-sm lg:text-base px-2 lg:px-4"),target:r?"_blank":void 0,rel:r?"noopener noreferrer":void 0,children:[e.icon&&(0,n.jsx)("span",{className:"mr-2",children:e.icon}),e.title,e.badge&&(0,n.jsx)(f.Badge,{className:"ml-2 text-xs",children:e.badge})]})})},e.id)})(e))]})}),b["header.show_search"]&&(0,n.jsxs)("div",{className:"flex flex-row items-center max-w-lg mx-8 mb-2 space-x-4",children:[(0,n.jsx)(e6.Phone,{className:"w-8 h-8 text-[#FAA61A]"}),(0,n.jsx)("a",{href:`tel:${C["contact.phone"]||"0865770009"}`,className:"text-[#FAA61A] font-bold text-lg",children:C["contact.phone_display"]||"0865.77.0009"}),(0,n.jsxs)("div",{className:"relative",children:[(0,n.jsx)(h.Input,{type:"text",placeholder:"Tìm kiếm sản phẩm...",className:"w-full pl-4 pr-10 py-2 bg-white/90 backdrop-blur-sm border-white/20 focus:bg-white focus:border-blue-300 transition-all"}),(0,n.jsx)(m.Button,{size:"sm",variant:"ghost",className:"absolute inset-y-0 right-0 h-full px-3 text-gray-400 hover:text-gray-600",children:(0,n.jsx)(e7.Search,{className:"w-4 h-4"})})]})]})]}),(0,n.jsxs)("div",{className:"flex items-center space-x-3 text-white",children:[b["header.show_user_menu"]&&(0,n.jsx)(eU,{children:(0,n.jsxs)(eG,{children:[(0,n.jsx)(eY,{asChild:!0,children:(0,n.jsx)("div",{className:"flex items-center space-x-2",children:t&&e?(0,n.jsx)(m.Button,{size:"sm",variant:"ghost",className:"w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full p-0 text-white font-semibold",onClick:()=>s.push("/admin"),children:e.email?.charAt(0).toUpperCase()||"U"}):(0,n.jsxs)(m.Button,{size:"sm",variant:"ghost",className:"flex items-center space-x-1 px-3 py-2 text-white hover:text-blue-200 hover:bg-white/10 transition-all",onClick:()=>s.push("/auth/login"),children:[(0,n.jsx)(te.LogIn,{className:"w-4 h-4"}),(0,n.jsx)("span",{className:"text-sm font-medium hidden md:inline",children:"Đăng nhập"})]})})}),(0,n.jsx)(e8,{children:(0,n.jsx)("p",{children:t&&e?e.email:"Đăng nhập để tiếp tục"})})]})}),b["header.show_cart"]&&(0,n.jsxs)(m.Button,{size:"sm",variant:"ghost",className:"relative p-2 text-white hover:text-blue-200 hover:bg-white/10 transition-all",children:[(0,n.jsx)(e9.ShoppingCart,{className:"w-5 h-5"}),(0,n.jsx)(f.Badge,{variant:"destructive",className:"absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs",children:"0"})]})]})]})})]})}tt.displayName="ListItem",e.s(["WebsiteHeader",()=>tr],867375)}]);