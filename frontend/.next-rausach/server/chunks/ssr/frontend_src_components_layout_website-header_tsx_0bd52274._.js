module.exports=[35094,a=>{"use strict";var b,c,d=a.i(321248),e=a.i(439889),f=a.i(53627),g=a.i(40947),h=a.i(168918),i=a.i(772213);let j=i.gql`
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
`;i.gql`
  query GetPublicMenuById(
    $id: String!
    $includeChildren: Boolean
  ) {
    publicMenuById(
      id: $id
      includeChildren: $includeChildren
    )
  }
`,i.gql`
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
`,i.gql`
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
`,i.gql`
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
`,i.gql`
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
`,i.gql`
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
`,i.gql`
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
`,i.gql`
  mutation DeleteMenu($id: ID!) {
    deleteMenu(id: $id)
  }
`,i.gql`
  mutation ReorderMenus($ids: [ID!]!) {
    reorderMenus(ids: $ids) {
      id
      title
      order
      isActive
      isVisible
    }
  }
`,i.gql`
  mutation ToggleMenuActive($id: ID!) {
    toggleMenuActive(id: $id) {
      id
      isActive
    }
  }
`,i.gql`
  mutation ToggleMenuVisibility($id: ID!) {
    toggleMenuVisibility(id: $id) {
      id
      isVisible
    }
  }
`,(b={}).SIDEBAR="SIDEBAR",b.HEADER="HEADER",b.FOOTER="FOOTER",b.MOBILE="MOBILE",b.CUSTOM="CUSTOM",(c={}).SELF="SELF",c.BLANK="BLANK",c.MODAL="MODAL";var k=a.i(18892),l=a.i(167695),m=a.i(975780),n=a.i(293470),o=a.i(202979),p=a.i(478184),q=a.i(651332),r=a.i(194296),s=a.i(694475),t=a.i(572521),u=a.i(372123),v=a.i(549074),w=a.i(360507),x=a.i(770186),y=a.i(660886),z=a.i(742053),A=a.i(4116),B=a.i(681498),C=a.i(370477),D=a.i(138455),E=a.i(6769),F=a.i(376946),G="NavigationMenu",[H,I,J]=(0,A.createCollection)(G),[K,L,M]=(0,A.createCollection)(G),[N,O]=(0,s.createContextScope)(G,[J,M]),[P,Q]=N(G),[R,S]=N(G),T=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,value:e,onValueChange:f,defaultValue:g,delayDuration:h=200,skipDelayDuration:i=300,orientation:j="horizontal",dir:k,...l}=a,[m,n]=q.useState(null),o=(0,w.useComposedRefs)(b,a=>n(a)),p=(0,x.useDirection)(k),r=q.useRef(0),s=q.useRef(0),t=q.useRef(0),[y,z]=q.useState(!0),[A,B]=(0,v.useControllableState)({prop:e,onChange:a=>{let b=i>0;""!==a?(window.clearTimeout(t.current),b&&z(!1)):(window.clearTimeout(t.current),t.current=window.setTimeout(()=>z(!0),i)),f?.(a)},defaultProp:g??"",caller:G}),C=q.useCallback(()=>{window.clearTimeout(s.current),s.current=window.setTimeout(()=>B(""),150)},[B]),D=q.useCallback(a=>{window.clearTimeout(s.current),B(a)},[B]),E=q.useCallback(a=>{A===a?window.clearTimeout(s.current):r.current=window.setTimeout(()=>{window.clearTimeout(s.current),B(a)},h)},[A,B,h]);return q.useEffect(()=>()=>{window.clearTimeout(r.current),window.clearTimeout(s.current),window.clearTimeout(t.current)},[]),(0,d.jsx)(V,{scope:c,isRootMenu:!0,value:A,dir:p,orientation:j,rootNavigationMenu:m,onTriggerEnter:a=>{window.clearTimeout(r.current),y?E(a):D(a)},onTriggerLeave:()=>{window.clearTimeout(r.current),C()},onContentEnter:()=>window.clearTimeout(s.current),onContentLeave:C,onItemSelect:a=>{B(b=>b===a?"":a)},onItemDismiss:()=>B(""),children:(0,d.jsx)(u.Primitive.nav,{"aria-label":"Main","data-orientation":j,dir:p,...l,ref:o})})});T.displayName=G;var U="NavigationMenuSub";q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,value:e,onValueChange:f,defaultValue:g,orientation:h="horizontal",...i}=a,j=Q(U,c),[k,l]=(0,v.useControllableState)({prop:e,onChange:f,defaultProp:g??"",caller:U});return(0,d.jsx)(V,{scope:c,isRootMenu:!1,value:k,dir:j.dir,orientation:h,rootNavigationMenu:j.rootNavigationMenu,onTriggerEnter:a=>l(a),onItemSelect:a=>l(a),onItemDismiss:()=>l(""),children:(0,d.jsx)(u.Primitive.div,{"data-orientation":h,...i,ref:b})})}).displayName=U;var V=a=>{let{scope:b,isRootMenu:c,rootNavigationMenu:e,dir:f,orientation:g,children:h,value:i,onItemSelect:j,onItemDismiss:k,onTriggerEnter:l,onTriggerLeave:m,onContentEnter:n,onContentLeave:o}=a,[p,r]=q.useState(null),[s,t]=q.useState(new Map),[u,v]=q.useState(null);return(0,d.jsx)(P,{scope:b,isRootMenu:c,rootNavigationMenu:e,value:i,previousValue:(0,C.usePrevious)(i),baseId:(0,z.useId)(),dir:f,orientation:g,viewport:p,onViewportChange:r,indicatorTrack:u,onIndicatorTrackChange:v,onTriggerEnter:(0,E.useCallbackRef)(l),onTriggerLeave:(0,E.useCallbackRef)(m),onContentEnter:(0,E.useCallbackRef)(n),onContentLeave:(0,E.useCallbackRef)(o),onItemSelect:(0,E.useCallbackRef)(j),onItemDismiss:(0,E.useCallbackRef)(k),onViewportContentChange:q.useCallback((a,b)=>{t(c=>(c.set(a,b),new Map(c)))},[]),onViewportContentRemove:q.useCallback(a=>{t(b=>b.has(a)?(b.delete(a),new Map(b)):b)},[]),children:(0,d.jsx)(H.Provider,{scope:b,children:(0,d.jsx)(R,{scope:b,items:s,children:h})})})},W="NavigationMenuList",X=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,...e}=a,f=Q(W,c),g=(0,d.jsx)(u.Primitive.ul,{"data-orientation":f.orientation,...e,ref:b});return(0,d.jsx)(u.Primitive.div,{style:{position:"relative"},ref:f.onIndicatorTrackChange,children:(0,d.jsx)(H.Slot,{scope:c,children:f.isRootMenu?(0,d.jsx)(ap,{asChild:!0,children:g}):g})})});X.displayName=W;var Y="NavigationMenuItem",[Z,$]=N(Y),_=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,value:e,...f}=a,g=(0,z.useId)(),h=q.useRef(null),i=q.useRef(null),j=q.useRef(null),k=q.useRef(()=>{}),l=q.useRef(!1),m=q.useCallback((a="start")=>{if(h.current){k.current();let b=as(h.current);b.length&&at("start"===a?b:b.reverse())}},[]),n=q.useCallback(()=>{if(h.current){var a;let b=as(h.current);b.length&&((a=b).forEach(a=>{a.dataset.tabindex=a.getAttribute("tabindex")||"",a.setAttribute("tabindex","-1")}),k.current=()=>{a.forEach(a=>{let b=a.dataset.tabindex;a.setAttribute("tabindex",b)})})}},[]);return(0,d.jsx)(Z,{scope:c,value:e||g||"LEGACY_REACT_AUTO_VALUE",triggerRef:i,contentRef:h,focusProxyRef:j,wasEscapeCloseRef:l,onEntryKeyDown:m,onFocusProxyEnter:m,onRootContentClose:n,onContentFocusOutside:n,children:(0,d.jsx)(u.Primitive.li,{...f,ref:b})})});_.displayName=Y;var aa="NavigationMenuTrigger",ab=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,disabled:e,...f}=a,g=Q(aa,a.__scopeNavigationMenu),h=$(aa,a.__scopeNavigationMenu),i=q.useRef(null),j=(0,w.useComposedRefs)(i,h.triggerRef,b),k=aw(g.baseId,h.value),l=ax(g.baseId,h.value),m=q.useRef(!1),n=q.useRef(!1),o=h.value===g.value;return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(H.ItemSlot,{scope:c,value:h.value,children:(0,d.jsx)(ar,{asChild:!0,children:(0,d.jsx)(u.Primitive.button,{id:k,disabled:e,"data-disabled":e?"":void 0,"data-state":av(o),"aria-expanded":o,"aria-controls":l,...f,ref:j,onPointerEnter:(0,t.composeEventHandlers)(a.onPointerEnter,()=>{n.current=!1,h.wasEscapeCloseRef.current=!1}),onPointerMove:(0,t.composeEventHandlers)(a.onPointerMove,ay(()=>{e||n.current||h.wasEscapeCloseRef.current||m.current||(g.onTriggerEnter(h.value),m.current=!0)})),onPointerLeave:(0,t.composeEventHandlers)(a.onPointerLeave,ay(()=>{e||(g.onTriggerLeave(),m.current=!1)})),onClick:(0,t.composeEventHandlers)(a.onClick,()=>{g.onItemSelect(h.value),n.current=o}),onKeyDown:(0,t.composeEventHandlers)(a.onKeyDown,a=>{let b={horizontal:"ArrowDown",vertical:"rtl"===g.dir?"ArrowLeft":"ArrowRight"}[g.orientation];o&&a.key===b&&(h.onEntryKeyDown(),a.preventDefault())})})})}),o&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(F.Root,{"aria-hidden":!0,tabIndex:0,ref:h.focusProxyRef,onFocus:a=>{let b=h.contentRef.current,c=a.relatedTarget,d=c===i.current,e=b?.contains(c);(d||!e)&&h.onFocusProxyEnter(d?"start":"end")}}),g.viewport&&(0,d.jsx)("span",{"aria-owns":l})]})]})});ab.displayName=aa;var ac="navigationMenu.linkSelect",ad=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,active:e,onSelect:f,...g}=a;return(0,d.jsx)(ar,{asChild:!0,children:(0,d.jsx)(u.Primitive.a,{"data-active":e?"":void 0,"aria-current":e?"page":void 0,...g,ref:b,onClick:(0,t.composeEventHandlers)(a.onClick,a=>{let b=a.target,c=new CustomEvent(ac,{bubbles:!0,cancelable:!0});if(b.addEventListener(ac,a=>f?.(a),{once:!0}),(0,u.dispatchDiscreteCustomEvent)(b,c),!c.defaultPrevented&&!a.metaKey){let a=new CustomEvent(ak,{bubbles:!0,cancelable:!0});(0,u.dispatchDiscreteCustomEvent)(b,a)}},{checkForDefaultPrevented:!1})})})});ad.displayName="NavigationMenuLink";var ae="NavigationMenuIndicator",af=q.forwardRef((a,b)=>{let{forceMount:c,...e}=a,f=Q(ae,a.__scopeNavigationMenu),g=!!f.value;return f.indicatorTrack?r.default.createPortal((0,d.jsx)(y.Presence,{present:c||g,children:(0,d.jsx)(ag,{...e,ref:b})}),f.indicatorTrack):null});af.displayName=ae;var ag=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,...e}=a,f=Q(ae,c),g=I(c),[h,i]=q.useState(null),[j,k]=q.useState(null),l="horizontal"===f.orientation,m=!!f.value;q.useEffect(()=>{let a=g(),b=a.find(a=>a.value===f.value)?.ref.current;b&&i(b)},[g,f.value]);let n=()=>{h&&k({size:l?h.offsetWidth:h.offsetHeight,offset:l?h.offsetLeft:h.offsetTop})};return au(h,n),au(f.indicatorTrack,n),j?(0,d.jsx)(u.Primitive.div,{"aria-hidden":!0,"data-state":m?"visible":"hidden","data-orientation":f.orientation,...e,ref:b,style:{position:"absolute",...l?{left:0,width:j.size+"px",transform:`translateX(${j.offset}px)`}:{top:0,height:j.size+"px",transform:`translateY(${j.offset}px)`},...e.style}}):null}),ah="NavigationMenuContent",ai=q.forwardRef((a,b)=>{let{forceMount:c,...e}=a,f=Q(ah,a.__scopeNavigationMenu),g=$(ah,a.__scopeNavigationMenu),h=(0,w.useComposedRefs)(g.contentRef,b),i=g.value===f.value,j={value:g.value,triggerRef:g.triggerRef,focusProxyRef:g.focusProxyRef,wasEscapeCloseRef:g.wasEscapeCloseRef,onContentFocusOutside:g.onContentFocusOutside,onRootContentClose:g.onRootContentClose,...e};return f.viewport?(0,d.jsx)(aj,{forceMount:c,...j,ref:h}):(0,d.jsx)(y.Presence,{present:c||i,children:(0,d.jsx)(al,{"data-state":av(i),...j,ref:h,onPointerEnter:(0,t.composeEventHandlers)(a.onPointerEnter,f.onContentEnter),onPointerLeave:(0,t.composeEventHandlers)(a.onPointerLeave,ay(f.onContentLeave)),style:{pointerEvents:!i&&f.isRootMenu?"none":void 0,...j.style}})})});ai.displayName=ah;var aj=q.forwardRef((a,b)=>{let{onViewportContentChange:c,onViewportContentRemove:d}=Q(ah,a.__scopeNavigationMenu);return(0,D.useLayoutEffect)(()=>{c(a.value,{ref:b,...a})},[a,b,c]),(0,D.useLayoutEffect)(()=>()=>d(a.value),[a.value,d]),null}),ak="navigationMenu.rootContentDismiss",al=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,value:e,triggerRef:f,focusProxyRef:g,wasEscapeCloseRef:h,onRootContentClose:i,onContentFocusOutside:j,...k}=a,l=Q(ah,c),m=q.useRef(null),n=(0,w.useComposedRefs)(m,b),o=aw(l.baseId,e),p=ax(l.baseId,e),r=I(c),s=q.useRef(null),{onItemDismiss:u}=l;q.useEffect(()=>{let a=m.current;if(l.isRootMenu&&a){let b=()=>{u(),i(),a.contains(document.activeElement)&&f.current?.focus()};return a.addEventListener(ak,b),()=>a.removeEventListener(ak,b)}},[l.isRootMenu,a.value,f,u,i]);let v=q.useMemo(()=>{let a=r().map(a=>a.value);"rtl"===l.dir&&a.reverse();let b=a.indexOf(l.value),c=a.indexOf(l.previousValue),d=e===l.value,f=c===a.indexOf(e);if(!d&&!f)return s.current;let g=(()=>{if(b!==c){if(d&&-1!==c)return b>c?"from-end":"from-start";if(f&&-1!==b)return b>c?"to-start":"to-end"}return null})();return s.current=g,g},[l.previousValue,l.value,l.dir,r,e]);return(0,d.jsx)(ap,{asChild:!0,children:(0,d.jsx)(B.DismissableLayer,{id:p,"aria-labelledby":o,"data-motion":v,"data-orientation":l.orientation,...k,ref:n,disableOutsidePointerEvents:!1,onDismiss:()=>{let a=new Event(ak,{bubbles:!0,cancelable:!0});m.current?.dispatchEvent(a)},onFocusOutside:(0,t.composeEventHandlers)(a.onFocusOutside,a=>{j();let b=a.target;l.rootNavigationMenu?.contains(b)&&a.preventDefault()}),onPointerDownOutside:(0,t.composeEventHandlers)(a.onPointerDownOutside,a=>{let b=a.target,c=r().some(a=>a.ref.current?.contains(b)),d=l.isRootMenu&&l.viewport?.contains(b);(c||d||!l.isRootMenu)&&a.preventDefault()}),onKeyDown:(0,t.composeEventHandlers)(a.onKeyDown,a=>{let b=a.altKey||a.ctrlKey||a.metaKey;if("Tab"===a.key&&!b){let b=as(a.currentTarget),c=document.activeElement,d=b.findIndex(a=>a===c);at(a.shiftKey?b.slice(0,d).reverse():b.slice(d+1,b.length))?a.preventDefault():g.current?.focus()}}),onEscapeKeyDown:(0,t.composeEventHandlers)(a.onEscapeKeyDown,a=>{h.current=!0})})})}),am="NavigationMenuViewport",an=q.forwardRef((a,b)=>{let{forceMount:c,...e}=a,f=!!Q(am,a.__scopeNavigationMenu).value;return(0,d.jsx)(y.Presence,{present:c||f,children:(0,d.jsx)(ao,{...e,ref:b})})});an.displayName=am;var ao=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,children:e,...f}=a,g=Q(am,c),h=(0,w.useComposedRefs)(b,g.onViewportChange),i=S(ah,a.__scopeNavigationMenu),[j,k]=q.useState(null),[l,m]=q.useState(null),n=j?j?.width+"px":void 0,o=j?j?.height+"px":void 0,p=!!g.value,r=p?g.value:g.previousValue;return au(l,()=>{l&&k({width:l.offsetWidth,height:l.offsetHeight})}),(0,d.jsx)(u.Primitive.div,{"data-state":av(p),"data-orientation":g.orientation,...f,ref:h,style:{pointerEvents:!p&&g.isRootMenu?"none":void 0,"--radix-navigation-menu-viewport-width":n,"--radix-navigation-menu-viewport-height":o,...f.style},onPointerEnter:(0,t.composeEventHandlers)(a.onPointerEnter,g.onContentEnter),onPointerLeave:(0,t.composeEventHandlers)(a.onPointerLeave,ay(g.onContentLeave)),children:Array.from(i.items).map(([a,{ref:b,forceMount:c,...e}])=>{let f=r===a;return(0,d.jsx)(y.Presence,{present:c||f,children:(0,d.jsx)(al,{...e,ref:(0,w.composeRefs)(b,a=>{f&&a&&m(a)})})},a)})})}),ap=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,...e}=a,f=Q("FocusGroup",c);return(0,d.jsx)(K.Provider,{scope:c,children:(0,d.jsx)(K.Slot,{scope:c,children:(0,d.jsx)(u.Primitive.div,{dir:f.dir,...e,ref:b})})})}),aq=["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"],ar=q.forwardRef((a,b)=>{let{__scopeNavigationMenu:c,...e}=a,f=L(c),g=Q("FocusGroupItem",c);return(0,d.jsx)(K.ItemSlot,{scope:c,children:(0,d.jsx)(u.Primitive.button,{...e,ref:b,onKeyDown:(0,t.composeEventHandlers)(a.onKeyDown,a=>{if(["Home","End",...aq].includes(a.key)){let b=f().map(a=>a.ref.current);if(["rtl"===g.dir?"ArrowRight":"ArrowLeft","ArrowUp","End"].includes(a.key)&&b.reverse(),aq.includes(a.key)){let c=b.indexOf(a.currentTarget);b=b.slice(c+1)}setTimeout(()=>at(b)),a.preventDefault()}})})})});function as(a){let b=[],c=document.createTreeWalker(a,NodeFilter.SHOW_ELEMENT,{acceptNode:a=>{let b="INPUT"===a.tagName&&"hidden"===a.type;return a.disabled||a.hidden||b?NodeFilter.FILTER_SKIP:a.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;c.nextNode();)b.push(c.currentNode);return b}function at(a){let b=document.activeElement;return a.some(a=>a===b||(a.focus(),document.activeElement!==b))}function au(a,b){let c=(0,E.useCallbackRef)(b);(0,D.useLayoutEffect)(()=>{let b=0;if(a){let d=new ResizeObserver(()=>{cancelAnimationFrame(b),b=window.requestAnimationFrame(c)});return d.observe(a),()=>{window.cancelAnimationFrame(b),d.unobserve(a)}}},[a,c])}function av(a){return a?"open":"closed"}function aw(a,b){return`${a}-trigger-${b}`}function ax(a,b){return`${a}-content-${b}`}function ay(a){return b=>"mouse"===b.pointerType?a(b):void 0}var az=a.i(13801),aA=a.i(669055),aB=a.i(422171);let aC=q.forwardRef(({className:a,children:b,...c},e)=>(0,d.jsxs)(T,{ref:e,className:(0,aB.cn)("relative z-10 flex max-w-max flex-1 items-center justify-center",a),...c,children:[b,(0,d.jsx)(aH,{})]}));aC.displayName=T.displayName;let aD=q.forwardRef(({className:a,...b},c)=>(0,d.jsx)(X,{ref:c,className:(0,aB.cn)("group flex flex-1 list-none items-center justify-center space-x-1",a),...b}));aD.displayName=X.displayName;let aE=(0,az.cva)("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"),aF=q.forwardRef(({className:a,children:b,...c},e)=>(0,d.jsxs)(ab,{ref:e,className:(0,aB.cn)(aE(),"group",a),...c,children:[b," ",(0,d.jsx)(aA.ChevronDown,{className:"relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180","aria-hidden":"true"})]}));aF.displayName=ab.displayName;let aG=q.forwardRef(({className:a,...b},c)=>(0,d.jsx)(ai,{ref:c,className:(0,aB.cn)("left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",a),...b}));aG.displayName=ai.displayName;let aH=q.forwardRef(({className:a,...b},c)=>(0,d.jsx)("div",{className:(0,aB.cn)("absolute left-0 top-full flex justify-center"),children:(0,d.jsx)(an,{className:(0,aB.cn)("origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",a),ref:c,...b})}));aH.displayName=an.displayName,q.forwardRef(({className:a,...b},c)=>(0,d.jsx)(af,{ref:c,className:(0,aB.cn)("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",a),...b,children:(0,d.jsx)("div",{className:"relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md"})})).displayName=af.displayName;var aI=a.i(60128),aJ=(a.i(542226),a.i(223904)),[aK,aL]=(0,s.createContextScope)("Tooltip",[aI.createPopperScope]),aM=(0,aI.createPopperScope)(),aN="TooltipProvider",aO="tooltip.open",[aP,aQ]=aK(aN),aR=a=>{let{__scopeTooltip:b,delayDuration:c=700,skipDelayDuration:e=300,disableHoverableContent:f=!1,children:g}=a,h=q.useRef(!0),i=q.useRef(!1),j=q.useRef(0);return q.useEffect(()=>{let a=j.current;return()=>window.clearTimeout(a)},[]),(0,d.jsx)(aP,{scope:b,isOpenDelayedRef:h,delayDuration:c,onOpen:q.useCallback(()=>{window.clearTimeout(j.current),h.current=!1},[]),onClose:q.useCallback(()=>{window.clearTimeout(j.current),j.current=window.setTimeout(()=>h.current=!0,e)},[e]),isPointerInTransitRef:i,onPointerInTransitChange:q.useCallback(a=>{i.current=a},[]),disableHoverableContent:f,children:g})};aR.displayName=aN;var aS="Tooltip",[aT,aU]=aK(aS),aV=a=>{let{__scopeTooltip:b,children:c,open:e,defaultOpen:f,onOpenChange:g,disableHoverableContent:h,delayDuration:i}=a,j=aQ(aS,a.__scopeTooltip),k=aM(b),[l,m]=q.useState(null),n=(0,z.useId)(),o=q.useRef(0),p=h??j.disableHoverableContent,r=i??j.delayDuration,s=q.useRef(!1),[t,u]=(0,v.useControllableState)({prop:e,defaultProp:f??!1,onChange:a=>{a?(j.onOpen(),document.dispatchEvent(new CustomEvent(aO))):j.onClose(),g?.(a)},caller:aS}),w=q.useMemo(()=>t?s.current?"delayed-open":"instant-open":"closed",[t]),x=q.useCallback(()=>{window.clearTimeout(o.current),o.current=0,s.current=!1,u(!0)},[u]),y=q.useCallback(()=>{window.clearTimeout(o.current),o.current=0,u(!1)},[u]),A=q.useCallback(()=>{window.clearTimeout(o.current),o.current=window.setTimeout(()=>{s.current=!0,u(!0),o.current=0},r)},[r,u]);return q.useEffect(()=>()=>{o.current&&(window.clearTimeout(o.current),o.current=0)},[]),(0,d.jsx)(aI.Root,{...k,children:(0,d.jsx)(aT,{scope:b,contentId:n,open:t,stateAttribute:w,trigger:l,onTriggerChange:m,onTriggerEnter:q.useCallback(()=>{j.isOpenDelayedRef.current?A():x()},[j.isOpenDelayedRef,A,x]),onTriggerLeave:q.useCallback(()=>{p?y():(window.clearTimeout(o.current),o.current=0)},[y,p]),onOpen:x,onClose:y,disableHoverableContent:p,children:c})})};aV.displayName=aS;var aW="TooltipTrigger",aX=q.forwardRef((a,b)=>{let{__scopeTooltip:c,...e}=a,f=aU(aW,c),g=aQ(aW,c),h=aM(c),i=q.useRef(null),j=(0,w.useComposedRefs)(b,i,f.onTriggerChange),k=q.useRef(!1),l=q.useRef(!1),m=q.useCallback(()=>k.current=!1,[]);return q.useEffect(()=>()=>document.removeEventListener("pointerup",m),[m]),(0,d.jsx)(aI.Anchor,{asChild:!0,...h,children:(0,d.jsx)(u.Primitive.button,{"aria-describedby":f.open?f.contentId:void 0,"data-state":f.stateAttribute,...e,ref:j,onPointerMove:(0,t.composeEventHandlers)(a.onPointerMove,a=>{"touch"!==a.pointerType&&(l.current||g.isPointerInTransitRef.current||(f.onTriggerEnter(),l.current=!0))}),onPointerLeave:(0,t.composeEventHandlers)(a.onPointerLeave,()=>{f.onTriggerLeave(),l.current=!1}),onPointerDown:(0,t.composeEventHandlers)(a.onPointerDown,()=>{f.open&&f.onClose(),k.current=!0,document.addEventListener("pointerup",m,{once:!0})}),onFocus:(0,t.composeEventHandlers)(a.onFocus,()=>{k.current||f.onOpen()}),onBlur:(0,t.composeEventHandlers)(a.onBlur,f.onClose),onClick:(0,t.composeEventHandlers)(a.onClick,f.onClose)})})});aX.displayName=aW;var[aY,aZ]=aK("TooltipPortal",{forceMount:void 0}),a$="TooltipContent",a_=q.forwardRef((a,b)=>{let c=aZ(a$,a.__scopeTooltip),{forceMount:e=c.forceMount,side:f="top",...g}=a,h=aU(a$,a.__scopeTooltip);return(0,d.jsx)(y.Presence,{present:e||h.open,children:h.disableHoverableContent?(0,d.jsx)(a4,{side:f,...g,ref:b}):(0,d.jsx)(a0,{side:f,...g,ref:b})})}),a0=q.forwardRef((a,b)=>{let c=aU(a$,a.__scopeTooltip),e=aQ(a$,a.__scopeTooltip),f=q.useRef(null),g=(0,w.useComposedRefs)(b,f),[h,i]=q.useState(null),{trigger:j,onClose:k}=c,l=f.current,{onPointerInTransitChange:m}=e,n=q.useCallback(()=>{i(null),m(!1)},[m]),o=q.useCallback((a,b)=>{let c,d=a.currentTarget,e={x:a.clientX,y:a.clientY},f=function(a,b){let c=Math.abs(b.top-a.y),d=Math.abs(b.bottom-a.y),e=Math.abs(b.right-a.x),f=Math.abs(b.left-a.x);switch(Math.min(c,d,e,f)){case f:return"left";case e:return"right";case c:return"top";case d:return"bottom";default:throw Error("unreachable")}}(e,d.getBoundingClientRect());i(((c=[...function(a,b,c=5){let d=[];switch(b){case"top":d.push({x:a.x-c,y:a.y+c},{x:a.x+c,y:a.y+c});break;case"bottom":d.push({x:a.x-c,y:a.y-c},{x:a.x+c,y:a.y-c});break;case"left":d.push({x:a.x+c,y:a.y-c},{x:a.x+c,y:a.y+c});break;case"right":d.push({x:a.x-c,y:a.y-c},{x:a.x-c,y:a.y+c})}return d}(e,f),...function(a){let{top:b,right:c,bottom:d,left:e}=a;return[{x:e,y:b},{x:c,y:b},{x:c,y:d},{x:e,y:d}]}(b.getBoundingClientRect())].slice()).sort((a,b)=>a.x<b.x?-1:a.x>b.x?1:a.y<b.y?-1:1*!!(a.y>b.y)),function(a){if(a.length<=1)return a.slice();let b=[];for(let c=0;c<a.length;c++){let d=a[c];for(;b.length>=2;){let a=b[b.length-1],c=b[b.length-2];if((a.x-c.x)*(d.y-c.y)>=(a.y-c.y)*(d.x-c.x))b.pop();else break}b.push(d)}b.pop();let c=[];for(let b=a.length-1;b>=0;b--){let d=a[b];for(;c.length>=2;){let a=c[c.length-1],b=c[c.length-2];if((a.x-b.x)*(d.y-b.y)>=(a.y-b.y)*(d.x-b.x))c.pop();else break}c.push(d)}return(c.pop(),1===b.length&&1===c.length&&b[0].x===c[0].x&&b[0].y===c[0].y)?b:b.concat(c)}(c))),m(!0)},[m]);return q.useEffect(()=>()=>n(),[n]),q.useEffect(()=>{if(j&&l){let a=a=>o(a,l),b=a=>o(a,j);return j.addEventListener("pointerleave",a),l.addEventListener("pointerleave",b),()=>{j.removeEventListener("pointerleave",a),l.removeEventListener("pointerleave",b)}}},[j,l,o,n]),q.useEffect(()=>{if(h){let a=a=>{let b=a.target,c={x:a.clientX,y:a.clientY},d=j?.contains(b)||l?.contains(b),e=!function(a,b){let{x:c,y:d}=a,e=!1;for(let a=0,f=b.length-1;a<b.length;f=a++){let g=b[a],h=b[f],i=g.x,j=g.y,k=h.x,l=h.y;j>d!=l>d&&c<(k-i)*(d-j)/(l-j)+i&&(e=!e)}return e}(c,h);d?n():e&&(n(),k())};return document.addEventListener("pointermove",a),()=>document.removeEventListener("pointermove",a)}},[j,l,h,k,n]),(0,d.jsx)(a4,{...a,ref:g})}),[a1,a2]=aK(aS,{isInside:!1}),a3=(0,aJ.createSlottable)("TooltipContent"),a4=q.forwardRef((a,b)=>{let{__scopeTooltip:c,children:e,"aria-label":f,onEscapeKeyDown:g,onPointerDownOutside:h,...i}=a,j=aU(a$,c),k=aM(c),{onClose:l}=j;return q.useEffect(()=>(document.addEventListener(aO,l),()=>document.removeEventListener(aO,l)),[l]),q.useEffect(()=>{if(j.trigger){let a=a=>{let b=a.target;b?.contains(j.trigger)&&l()};return window.addEventListener("scroll",a,{capture:!0}),()=>window.removeEventListener("scroll",a,{capture:!0})}},[j.trigger,l]),(0,d.jsx)(B.DismissableLayer,{asChild:!0,disableOutsidePointerEvents:!1,onEscapeKeyDown:g,onPointerDownOutside:h,onFocusOutside:a=>a.preventDefault(),onDismiss:l,children:(0,d.jsxs)(aI.Content,{"data-state":j.stateAttribute,...k,...i,ref:b,style:{...i.style,"--radix-tooltip-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-tooltip-content-available-width":"var(--radix-popper-available-width)","--radix-tooltip-content-available-height":"var(--radix-popper-available-height)","--radix-tooltip-trigger-width":"var(--radix-popper-anchor-width)","--radix-tooltip-trigger-height":"var(--radix-popper-anchor-height)"},children:[(0,d.jsx)(a3,{children:e}),(0,d.jsx)(a1,{scope:c,isInside:!0,children:(0,d.jsx)(F.Root,{id:j.contentId,role:"tooltip",children:f||e})})]})})});a_.displayName=a$;var a5="TooltipArrow";q.forwardRef((a,b)=>{let{__scopeTooltip:c,...e}=a,f=aM(c);return a2(a5,c).isInside?null:(0,d.jsx)(aI.Arrow,{...f,...e,ref:b})}).displayName=a5;let a6=q.forwardRef(({className:a,sideOffset:b=4,...c},e)=>(0,d.jsx)(a_,{ref:e,sideOffset:b,className:(0,aB.cn)("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",a),...c}));a6.displayName=a_.displayName;var a7=a.i(434741),a8=a.i(629432),a9=a.i(543220),ba=a.i(425685);let bb=q.default.forwardRef(({className:a,title:b,children:c,href:f,target:g,...h},i)=>(0,d.jsx)("li",{children:(0,d.jsx)(ad,{asChild:!0,children:(0,d.jsxs)(e.default,{ref:i,href:f||"#",className:(0,aB.cn)("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",a),target:"BLANK"===g?"_blank":void 0,rel:"BLANK"===g?"noopener noreferrer":void 0,...h,children:[(0,d.jsx)("div",{className:"text-sm font-medium leading-none",children:b}),(0,d.jsx)("p",{className:"line-clamp-2 text-sm leading-snug text-muted-foreground",children:c})]})})}));function bc(){let{user:a,isAuthenticated:b,logout:c}=(0,g.useAuth)(),i=(0,f.useRouter)(),{data:r=[],loading:s}=(0,k.useHeaderSettings)(),t=(0,q.useMemo)(()=>(0,k.settingsToMap)(r),[r]),{data:u=[],loading:v}=(0,k.useContactSettings)(),w=(0,q.useMemo)(()=>(0,k.settingsToMap)(u),[u]),{data:x,loading:y,error:z}=(0,h.useQuery)(j,{variables:{type:"HEADER",isActive:!0,isVisible:!0,orderBy:{order:"asc"},includeChildren:!0},fetchPolicy:"network-only"}),A=x?.publicMenus||[];(0,q.useEffect)(()=>{z&&console.error("[WebsiteHeader] Failed to load menu:",z.message)},[z]),console.log("headerSettings",t),console.log("contactSettings",w),console.log("headerMenus",A);let B=[{id:1,title:"Khuyến Mãi Đặc Biệt",subtitle:"Giảm giá lên đến 50% cho tất cả sản phẩm",description:"Ưu đãi có thời hạn - Nhanh tay đặt hàng!",image:"/assets/images/tunongtraidenbanan.jpg",cta:"Mua Ngay",badge:"HOT",bgColor:""}],[C,D]=(0,q.useState)(0),[E,F]=(0,q.useState)();return(0,q.useEffect)(()=>{if(!E)return;let a=setInterval(()=>{E.scrollNext()},5e3);return()=>clearInterval(a)},[E]),(0,q.useEffect)(()=>{if(!E)return;let a=()=>{D(E.selectedScrollSnap())};return E.on("select",a),a(),()=>{E.off("select",a)}},[E]),(0,d.jsxs)("header",{className:"bg-white border-b border-gray-200",children:[t["header.banner_enabled"]&&(0,d.jsxs)("div",{className:"relative overflow-hidden",children:[(0,d.jsxs)(l.Carousel,{className:"w-full mx-auto",setApi:F,opts:{align:"start",loop:!0},children:[(0,d.jsx)(l.CarouselContent,{children:B.map((a,b)=>(0,d.jsx)(l.CarouselItem,{children:(0,d.jsx)("div",{className:"relative",children:(0,d.jsx)(m.Card,{className:"border-0 rounded-none",children:(0,d.jsx)(m.CardContent,{className:`relative p-0 ${a.bgColor} overflow-hidden`,children:(0,d.jsx)("div",{className:"relative z-10 h-full flex items-center",children:(0,d.jsx)("div",{className:"mx-auto",children:(0,d.jsx)("div",{className:"hidden lg:block w-full overflow-hidden shadow-2xl flex-shrink-0",style:{height:`${t["header.banner_height"]||208}px`},children:(0,d.jsx)("img",{src:a.image,alt:a.title,className:"w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"})})})})})})})},a.id))}),(0,d.jsx)(l.CarouselPrevious,{className:"left-4 bg-white/20 border-white/30 text-white hover:bg-white/40 transition-all duration-300 backdrop-blur-sm"}),(0,d.jsx)(l.CarouselNext,{className:"right-4 bg-white/20 border-white/30 text-white hover:bg-white/40 transition-all duration-300 backdrop-blur-sm"})]}),(0,d.jsx)("div",{className:"absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2",children:B.map((a,b)=>(0,d.jsx)("button",{className:`w-2 h-2 rounded-full transition-all duration-300 ${b===C?"bg-white w-6":"bg-white/50"}`,onClick:()=>{E&&E.scrollTo(b)}},b))})]}),(0,d.jsx)("div",{className:"w-full mx-auto",children:(0,d.jsxs)("div",{className:"grid grid-cols-6 items-center",style:{backgroundColor:t["header.background_color"]||"#57A345"},children:[(0,d.jsx)("div",{className:"bg-white col-span-2 flex justify-end p-4 rounded-e-full pe-8",children:(0,d.jsx)(e.default,{href:"/",className:"text-2xl font-bold text-blue-600",children:(0,d.jsx)("img",{src:t["header.logo"]||"/assets/images/logo.svg",alt:"Logo",className:"max-h-20",style:{height:`${t["header.logo_width"]||80}px`,maxHeight:`${t["header.logo_width"]||80}px`}})})}),(0,d.jsxs)("div",{className:"col-span-3 flex flex-col space-y-2",children:[(0,d.jsx)(aC,{className:"w-full p-4",children:(0,d.jsxs)(aD,{className:"flex justify-evenly space-x-1 lg:space-x-2 w-full flex-wrap",children:[(0,d.jsx)(_,{children:(0,d.jsx)(ad,{asChild:!0})}),y?(0,d.jsx)("div",{className:"text-white text-sm",children:"Đang tải menu..."}):z?(0,d.jsx)("div",{className:"text-red-200 text-sm",children:"Lỗi tải menu"}):A.filter(a=>(0===a.level||1===a.level)&&a.isActive&&a.isVisible).sort((a,b)=>a.order-b.order).map(a=>(a=>{if(!a.isVisible||!a.isActive)return null;let b=a.route||a.url||"#",c="BLANK"===a.target||a.externalUrl;return a.children&&Array.isArray(a.children)&&a.children.length>0?(0,d.jsxs)(_,{children:[(0,d.jsxs)(aF,{className:"text-white hover:text-blue-200 bg-transparent hover:bg-white/10 data-[state=open]:bg-white/20 text-sm lg:text-base px-2 lg:px-4",children:[a.icon&&(0,d.jsx)("span",{className:"mr-2",children:a.icon}),a.title,a.badge&&(0,d.jsx)(n.Badge,{className:"ml-2 text-xs",children:a.badge})]}),(0,d.jsx)(aG,{children:(0,d.jsx)("div",{className:"grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]",children:a.children.map(a=>{let b=a.route||a.url||"#";return(0,d.jsx)(bb,{href:b,title:a.title,target:"BLANK"===a.target?"_blank":void 0,children:a.description||a.title},a.id)})})})]},a.id):(0,d.jsx)(_,{children:(0,d.jsx)(ad,{asChild:!0,children:(0,d.jsxs)(e.default,{href:b,className:(0,aB.cn)(aE(),"text-white hover:text-blue-200 bg-transparent hover:bg-white/10 text-sm lg:text-base px-2 lg:px-4"),target:c?"_blank":void 0,rel:c?"noopener noreferrer":void 0,children:[a.icon&&(0,d.jsx)("span",{className:"mr-2",children:a.icon}),a.title,a.badge&&(0,d.jsx)(n.Badge,{className:"ml-2 text-xs",children:a.badge})]})})},a.id)})(a))]})}),t["header.show_search"]&&(0,d.jsxs)("div",{className:"flex flex-row items-center max-w-lg mx-8 mb-2 space-x-4",children:[(0,d.jsx)(a7.Phone,{className:"w-8 h-8 text-[#FAA61A]"}),(0,d.jsx)("a",{href:`tel:${w["contact.phone"]||"0865770009"}`,className:"text-[#FAA61A] font-bold text-lg",children:w["contact.phone_display"]||"0865.77.0009"}),(0,d.jsxs)("div",{className:"relative",children:[(0,d.jsx)(p.Input,{type:"text",placeholder:"Tìm kiếm sản phẩm...",className:"w-full pl-4 pr-10 py-2 bg-white/90 backdrop-blur-sm border-white/20 focus:bg-white focus:border-blue-300 transition-all"}),(0,d.jsx)(o.Button,{size:"sm",variant:"ghost",className:"absolute inset-y-0 right-0 h-full px-3 text-gray-400 hover:text-gray-600",children:(0,d.jsx)(a8.Search,{className:"w-4 h-4"})})]})]})]}),(0,d.jsxs)("div",{className:"flex items-center space-x-3 text-white",children:[t["header.show_user_menu"]&&(0,d.jsx)(aR,{children:(0,d.jsxs)(aV,{children:[(0,d.jsx)(aX,{asChild:!0,children:(0,d.jsx)("div",{className:"flex items-center space-x-2",children:b&&a?(0,d.jsx)(o.Button,{size:"sm",variant:"ghost",className:"w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full p-0 text-white font-semibold",onClick:()=>i.push("/admin"),children:a.email?.charAt(0).toUpperCase()||"U"}):(0,d.jsxs)(o.Button,{size:"sm",variant:"ghost",className:"flex items-center space-x-1 px-3 py-2 text-white hover:text-blue-200 hover:bg-white/10 transition-all",onClick:()=>i.push("/auth/login"),children:[(0,d.jsx)(ba.LogIn,{className:"w-4 h-4"}),(0,d.jsx)("span",{className:"text-sm font-medium hidden md:inline",children:"Đăng nhập"})]})})}),(0,d.jsx)(a6,{children:(0,d.jsx)("p",{children:b&&a?a.email:"Đăng nhập để tiếp tục"})})]})}),t["header.show_cart"]&&(0,d.jsxs)(o.Button,{size:"sm",variant:"ghost",className:"relative p-2 text-white hover:text-blue-200 hover:bg-white/10 transition-all",children:[(0,d.jsx)(a9.ShoppingCart,{className:"w-5 h-5"}),(0,d.jsx)(n.Badge,{variant:"destructive",className:"absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs",children:"0"})]})]})]})})]})}bb.displayName="ListItem",a.s(["WebsiteHeader",()=>bc],35094)}];

//# sourceMappingURL=frontend_src_components_layout_website-header_tsx_0bd52274._.js.map