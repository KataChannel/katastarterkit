(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,774309,e=>{"use strict";var t=e.i(44990);let r=e.i(403055).forwardRef(({className:e,...r},i)=>(0,t.jsx)("div",{ref:i,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...r}));r.displayName="Skeleton",e.s(["Skeleton",()=>r])},67087,e=>{"use strict";var t=e.i(44990),r=e.i(403055),i=e.i(541428);let a=r.forwardRef(({className:e,orientation:r="horizontal",decorative:a=!0,...s},n)=>(0,t.jsx)("div",{ref:n,role:a?"none":"separator","aria-orientation":a?void 0:r,className:(0,i.cn)("shrink-0 bg-gray-200","horizontal"===r?"h-[1px] w-full":"h-full w-[1px]",e),...s}));a.displayName="Separator",e.s(["Separator",()=>a])},49316,(e,t,r)=>{"use strict";function i({widthInt:e,heightInt:t,blurWidth:r,blurHeight:i,blurDataURL:a,objectFit:s}){let n=r?40*r:e,l=i?40*i:t,d=n&&l?`viewBox='0 0 ${n} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${d}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${d?"none":"contain"===s?"xMidYMid":"cover"===s?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${a}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return i}})},596974,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={VALID_LOADERS:function(){return s},imageConfigDefault:function(){return n}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},473733,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return d}}),e.r(715200);let i=e.r(49316),a=e.r(596974),s=["-moz-initial","fill","none","scale-down",void 0];function n(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function d({src:e,sizes:t,unoptimized:r=!1,priority:d=!1,preload:o=!1,loading:c,className:u,quality:g,width:m,height:p,fill:f=!1,style:h,overrideSrc:x,onLoad:y,onLoadingComplete:v,placeholder:j="empty",blurDataURL:P,fetchPriority:b,decoding:_="async",layout:N,objectFit:C,objectPosition:T,lazyBoundary:S,lazyRoot:E,...w},R){var A;let O,$,F,{imgConf:I,showAltText:D,blurComplete:B,defaultLoader:G}=R,M=I||a.imageConfigDefault;if("allSizes"in M)O=M;else{let e=[...M.deviceSizes,...M.imageSizes].sort((e,t)=>e-t),t=M.deviceSizes.sort((e,t)=>e-t),r=M.qualities?.sort((e,t)=>e-t);O={...M,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===G)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let q=w.loader||G;delete w.loader,delete w.srcSet;let U="__next_img_default"in q;if(U){if("custom"===O.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=q;q=t=>{let{config:r,...i}=t;return e(i)}}if(N){"fill"===N&&(f=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[N];e&&(h={...h,...e});let r={responsive:"100vw",fill:"100vw"}[N];r&&!t&&(t=r)}let k="",z=l(m),V=l(p);if((A=e)&&"object"==typeof A&&(n(A)||void 0!==A.src)){let t=n(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if($=t.blurWidth,F=t.blurHeight,P=P||t.blurDataURL,k=t.src,!f)if(z||V){if(z&&!V){let e=z/t.width;V=Math.round(t.height*e)}else if(!z&&V){let e=V/t.height;z=Math.round(t.width*e)}}else z=t.width,V=t.height}let L=!d&&!o&&("lazy"===c||void 0===c);(!(e="string"==typeof e?e:k)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,L=!1),O.unoptimized&&(r=!0),U&&!O.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let Y=l(g),W=Object.assign(f?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:C,objectPosition:T}:{},D?{}:{color:"transparent"},h),H=B||"empty"===j?null:"blur"===j?`url("data:image/svg+xml;charset=utf-8,${(0,i.getImageBlurSvg)({widthInt:z,heightInt:V,blurWidth:$,blurHeight:F,blurDataURL:P||"",objectFit:W.objectFit})}")`:`url("${j}")`,X=s.includes(W.objectFit)?"fill"===W.objectFit?"100% 100%":"cover":W.objectFit,K=H?{backgroundSize:X,backgroundPosition:W.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:H}:{},Q=function({config:e,src:t,unoptimized:r,width:i,quality:a,sizes:s,loader:n}){if(r)return{src:t,srcSet:void 0,sizes:void 0};let{widths:l,kind:d}=function({deviceSizes:e,allSizes:t},r,i){if(i){let r=/(^|\s)(1?\d?\d)vw/g,a=[];for(let e;e=r.exec(i);)a.push(parseInt(e[2]));if(a.length){let r=.01*Math.min(...a);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,i,s),o=l.length-1;return{sizes:s||"w"!==d?s:"100vw",srcSet:l.map((r,i)=>`${n({config:e,src:t,quality:a,width:r})} ${"w"===d?r:i+1}${d}`).join(", "),src:n({config:e,src:t,quality:a,width:l[o]})}}({config:O,src:e,unoptimized:r,width:z,quality:Y,sizes:t,loader:q}),J=L?"lazy":c;return{props:{...w,loading:J,fetchPriority:b,width:z,height:V,decoding:_,className:u,style:{...W,...K},sizes:Q.sizes,srcSet:Q.srcSet,src:x||Q.src},meta:{unoptimized:r,preload:o||d,placeholder:j,fill:f}}}},805690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return l}});let i=e.r(403055),a="undefined"==typeof window,s=a?()=>{}:i.useLayoutEffect,n=a?()=>{}:i.useEffect;function l(e){let{headManager:t,reduceComponentsToState:r}=e;function l(){if(t&&t.mountedInstances){let e=i.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return a&&(t?.mountedInstances?.add(e.children),l()),s(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),s(()=>(t&&(t._pendingUpdate=l),()=>{t&&(t._pendingUpdate=l)})),n(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},308112,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={default:function(){return f},defaultHead:function(){return u}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=e.r(940192),n=e.r(475244),l=e.r(44990),d=n._(e.r(403055)),o=s._(e.r(805690)),c=e.r(525989);function u(){return[(0,l.jsx)("meta",{charSet:"utf-8"},"charset"),(0,l.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function g(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===d.default.Fragment?e.concat(d.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(715200);let m=["name","httpEquiv","charSet","itemProp"];function p(e){let t,r,i,a;return e.reduce(g,[]).reverse().concat(u().reverse()).filter((t=new Set,r=new Set,i=new Set,a={},e=>{let s=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?s=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?s=!1:r.add(e.type);break;case"meta":for(let t=0,r=m.length;t<r;t++){let r=m[t];if(e.props.hasOwnProperty(r))if("charSet"===r)i.has(r)?s=!1:i.add(r);else{let t=e.props[r],i=a[r]||new Set;("name"!==r||!n)&&i.has(t)?s=!1:(i.add(t),a[r]=i)}}}return s})).reverse().map((e,t)=>{let r=e.key||t;return d.default.cloneElement(e,{key:r})})}let f=function({children:e}){let t=(0,d.useContext)(c.HeadManagerContext);return(0,l.jsx)(o.default,{reduceComponentsToState:p,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},238369,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return s}});let i=e.r(940192)._(e.r(403055)),a=e.r(596974),s=i.default.createContext(a.imageConfigDefault)},420539,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return i}});let i=e.r(940192)._(e.r(403055)).default.createContext(null)},659556,(e,t,r)=>{"use strict";function i(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,0):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return i}})},103342,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return s}});let i=e.r(659556);function a({config:e,src:t,width:r,quality:a}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let s=(0,i.findClosestQuality)(a,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${s}${t.startsWith("/_next/static/media/"),""}`}a.__next_img_default=!0;let s=a},894595,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return j}});let i=e.r(940192),a=e.r(475244),s=e.r(44990),n=a._(e.r(403055)),l=i._(e.r(940392)),d=i._(e.r(308112)),o=e.r(473733),c=e.r(596974),u=e.r(238369);e.r(715200);let g=e.r(420539),m=i._(e.r(103342)),p=e.r(527304),f={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function h(e,t,r,i,a,s,n){let l=e?.src;e&&e["data-loaded-src"]!==l&&(e["data-loaded-src"]=l,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&a(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let i=!1,a=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>i,isPropagationStopped:()=>a,persist:()=>{},preventDefault:()=>{i=!0,t.preventDefault()},stopPropagation:()=>{a=!0,t.stopPropagation()}})}i?.current&&i.current(e)}}))}function x(e){return n.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let y=(0,n.forwardRef)(({src:e,srcSet:t,sizes:r,height:i,width:a,decoding:l,className:d,style:o,fetchPriority:c,placeholder:u,loading:g,unoptimized:m,fill:f,onLoadRef:y,onLoadingCompleteRef:v,setBlurComplete:j,setShowAltText:P,sizesInput:b,onLoad:_,onError:N,...C},T)=>{let S=(0,n.useCallback)(e=>{e&&(N&&(e.src=e.src),e.complete&&h(e,u,y,v,j,m,b))},[e,u,y,v,j,N,m,b]),E=(0,p.useMergedRef)(T,S);return(0,s.jsx)("img",{...C,...x(c),loading:g,width:a,height:i,decoding:l,"data-nimg":f?"fill":"1",className:d,style:o,sizes:r,srcSet:t,src:e,ref:E,onLoad:e=>{h(e.currentTarget,u,y,v,j,m,b)},onError:e=>{P(!0),"empty"!==u&&j(!0),N&&N(e)}})});function v({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&l.default.preload?(l.default.preload(t.src,r),null):(0,s.jsx)(d.default,{children:(0,s.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let j=(0,n.forwardRef)((e,t)=>{let r=(0,n.useContext)(g.RouterContext),i=(0,n.useContext)(u.ImageConfigContext),a=(0,n.useMemo)(()=>{let e=f||i||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),a=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:a,localPatterns:"undefined"==typeof window?i?.localPatterns:e.localPatterns}},[i]),{onLoad:l,onLoadingComplete:d}=e,p=(0,n.useRef)(l);(0,n.useEffect)(()=>{p.current=l},[l]);let h=(0,n.useRef)(d);(0,n.useEffect)(()=>{h.current=d},[d]);let[x,j]=(0,n.useState)(!1),[P,b]=(0,n.useState)(!1),{props:_,meta:N}=(0,o.getImgProps)(e,{defaultLoader:m.default,imgConf:a,blurComplete:x,showAltText:P});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(y,{..._,unoptimized:N.unoptimized,placeholder:N.placeholder,fill:N.fill,onLoadRef:p,onLoadingCompleteRef:h,setBlurComplete:j,setShowAltText:b,sizesInput:e.sizes,ref:t}),N.preload?(0,s.jsx)(v,{isAppRouter:!r,imgAttributes:_}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},211684,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={default:function(){return c},getImageProps:function(){return o}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=e.r(940192),n=e.r(473733),l=e.r(894595),d=s._(e.r(103342));function o(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:d.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let c=l.Image},586754,(e,t,r)=>{t.exports=e.r(211684)},68645,e=>{"use strict";var t=e.i(20865);e.s(["Shield",()=>t.default])},547982,e=>{"use strict";var t=e.i(449595);e.s(["Truck",()=>t.default])},574375,e=>{"use strict";var t=e.i(984804);let r=t.gql`
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
`,i=t.gql`
  ${r}
  fragment CategoryWithCountFields on CategoryType {
    ...CategoryBasicFields
    productCount
  }
`,a=t.gql`
  ${i}
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
`,s=t.gql`
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
`;let l=t.gql`
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
`,d=t.gql`
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
`,o=t.gql`
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
`;e.s(["CATEGORY_BASIC_FRAGMENT",0,r,"CATEGORY_TREE_FRAGMENT",0,a,"CATEGORY_WITH_COUNT_FRAGMENT",0,i,"COMMENT_FRAGMENT",0,o,"POST_FRAGMENT",0,d,"PRODUCT_IMAGE_FRAGMENT",0,s,"PRODUCT_VARIANT_FRAGMENT",0,n,"USER_FRAGMENT",0,l])},355422,e=>{"use strict";var t=e.i(984804),r=e.i(574375);let i=r.PRODUCT_IMAGE_FRAGMENT,a=r.PRODUCT_VARIANT_FRAGMENT,s=t.gql`
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
`,n=t.gql`
  ${s}
  ${i}
  ${a}
  ${r.CATEGORY_BASIC_FRAGMENT}
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
`,l=t.gql`
  ${s}
  ${r.CATEGORY_BASIC_FRAGMENT}
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
`,d=t.gql`
  ${n}
  query GetProduct($id: ID!) {
    product(id: $id) {
      ...ProductFullFields
    }
  }
`,o=t.gql`
  ${n}
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFullFields
    }
  }
`,c=t.gql`
  ${s}
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
`,u=t.gql`
  ${s}
  ${r.CATEGORY_BASIC_FRAGMENT}
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
`,g=t.gql`
  ${s}
  ${r.CATEGORY_BASIC_FRAGMENT}
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
  ${s}
  ${r.CATEGORY_BASIC_FRAGMENT}
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
`;let m=t.gql`
  ${n}
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,p=t.gql`
  ${n}
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,f=t.gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`,h=t.gql`
  ${s}
  mutation UpdateProductStock($id: ID!, $quantity: Float!) {
    updateProductStock(id: $id, quantity: $quantity) {
      ...ProductBasicFields
    }
  }
`,x=t.gql`
  ${i}
  mutation AddProductImage($input: CreateProductImageInput!) {
    addProductImage(input: $input) {
      ...ProductImageFields
    }
  }
`,y=t.gql`
  mutation DeleteProductImage($id: ID!) {
    deleteProductImage(id: $id)
  }
`,v=t.gql`
  ${a}
  mutation AddProductVariant($input: CreateProductVariantInput!) {
    addProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,j=t.gql`
  ${a}
  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
    updateProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,P=t.gql`
  mutation DeleteProductVariant($id: ID!) {
    deleteProductVariant(id: $id)
  }
`;e.s(["ADD_PRODUCT_IMAGE",0,x,"ADD_PRODUCT_VARIANT",0,v,"CREATE_PRODUCT",0,m,"DELETE_PRODUCT",0,f,"DELETE_PRODUCT_IMAGE",0,y,"DELETE_PRODUCT_VARIANT",0,P,"GET_FEATURED_PRODUCTS",0,u,"GET_PRODUCT",0,d,"GET_PRODUCTS",0,l,"GET_PRODUCTS_BY_CATEGORY",0,c,"GET_PRODUCT_BY_SLUG",0,o,"PRODUCT_FULL_FRAGMENT",0,n,"SEARCH_PRODUCTS",0,g,"UPDATE_PRODUCT",0,p,"UPDATE_PRODUCT_STOCK",0,h,"UPDATE_PRODUCT_VARIANT",0,j])},250557,e=>{"use strict";e.s(["formatPrice",0,e=>null==e?"-":new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(Number(e))])},879296,e=>{"use strict";var t=e.i(44990),r=e.i(429105),i=e.i(984804),a=e.i(355422),s=e.i(775680),n=e.i(885205),l=e.i(702470),d=e.i(774309),o=e.i(996517),c=e.i(67087),u=e.i(250557),g=e.i(586754),m=e.i(130775),p=e.i(202774),f=e.i(553579),h=e.i(547982),x=e.i(68645),y=e.i(791174);let v=i.gql`
  ${a.PRODUCT_FULL_FRAGMENT}
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFullFields
    }
  }
`;function j({block:e,isEditable:i=!0,onUpdate:a,onDelete:d}){let j=e.content||{},{productSlug:b,showGallery:_=!0,showDescription:N=!0,showSpecs:C=!0,showReviews:T=!1,showRelated:S=!1,layout:E="default"}=j,w=(0,m.useParams)(),R=w?.slug,A=i?b:b||R,{data:O,loading:$,error:F}=(0,r.useQuery)(v,{variables:{slug:A},skip:i||!A}),I=O?.productBySlug||null;if(i)return(0,t.jsx)("div",{className:"p-6 border-2 border-dashed border-green-300 rounded-lg bg-green-50",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)(p.ShoppingCart,{className:"w-12 h-12 mx-auto mb-3 text-green-500"}),(0,t.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"Product Detail Block"}),A?(0,t.jsxs)("p",{className:"text-sm text-gray-600 mb-4",children:["Hiển thị chi tiết sản phẩm: ",(0,t.jsx)("strong",{children:A})]}):(0,t.jsxs)("div",{className:"mb-4",children:[(0,t.jsx)("p",{className:"text-sm text-orange-600 mb-2",children:"⚠️ Chưa cấu hình product slug"}),(0,t.jsx)("p",{className:"text-xs text-gray-500",children:"Vui lòng chọn block này và nhập product slug trong panel bên phải"})]}),(0,t.jsxs)("div",{className:"flex gap-2 justify-center text-xs text-gray-500",children:[_&&(0,t.jsx)(l.Badge,{variant:"secondary",children:"Gallery"}),N&&(0,t.jsx)(l.Badge,{variant:"secondary",children:"Description"}),C&&(0,t.jsx)(l.Badge,{variant:"secondary",children:"Specs"}),T&&(0,t.jsx)(l.Badge,{variant:"secondary",children:"Reviews"})]})]})});if(F)return(0,t.jsx)("div",{className:"container mx-auto py-8",children:(0,t.jsx)(s.Card,{className:"border-red-200 bg-red-50",children:(0,t.jsx)(s.CardContent,{className:"pt-6",children:(0,t.jsxs)("p",{className:"text-red-600 text-center",children:["Lỗi tải sản phẩm: ",F.message]})})})});if($)return(0,t.jsx)(P,{});if(!I)return(0,t.jsx)("div",{className:"container mx-auto py-8",children:(0,t.jsx)(s.Card,{children:(0,t.jsx)(s.CardContent,{className:"pt-6",children:(0,t.jsxs)("p",{className:"text-gray-600 text-center",children:["Không tìm thấy sản phẩm ",A&&`"${A}"`]})})})});let D=I.discountPercentage||0,B=I.stock>0;return(0,t.jsxs)("div",{className:"container mx-auto py-8",style:j.style,children:[(0,t.jsxs)("div",{className:"grid md:grid-cols-2 gap-8",children:[_&&(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"relative aspect-square rounded-lg overflow-hidden bg-gray-100",children:[I.thumbnail?(0,t.jsx)(g.default,{src:I.thumbnail,alt:I.name,fill:!0,className:"object-cover",priority:!0}):(0,t.jsx)("div",{className:"w-full h-full flex items-center justify-center text-gray-400",children:"No Image"}),(0,t.jsxs)("div",{className:"absolute top-4 left-4 flex flex-col gap-2",children:[I.isNewArrival&&(0,t.jsx)(l.Badge,{className:"bg-green-500",children:"Hàng mới"}),I.isFeatured&&(0,t.jsx)(l.Badge,{className:"bg-blue-500",children:"Nổi bật"}),D>0&&(0,t.jsxs)(l.Badge,{className:"bg-red-500 text-lg",children:["-",D,"%"]})]})]}),I.images&&I.images.length>0&&(0,t.jsx)("div",{className:"grid grid-cols-4 gap-2",children:I.images.map((e,r)=>(0,t.jsx)("div",{className:"relative aspect-square rounded overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 ring-primary",children:(0,t.jsx)(g.default,{src:e.url,alt:e.alt||"",fill:!0,className:"object-cover"})},r))})]}),(0,t.jsxs)("div",{className:"space-y-6",children:[I.category&&(0,t.jsx)("div",{className:"text-sm text-gray-600",children:I.category.name}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-bold mb-2",children:I.name}),I.shortDesc&&(0,t.jsx)("p",{className:"text-gray-600",children:I.shortDesc})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"flex text-yellow-400",children:[1,2,3,4,5].map(e=>(0,t.jsx)(f.Star,{className:"w-5 h-5 fill-current"},e))}),(0,t.jsx)("span",{className:"text-sm text-gray-600",children:"(0 đánh giá)"})]}),(0,t.jsx)(c.Separator,{}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("div",{className:"flex items-baseline gap-3",children:[(0,t.jsx)("span",{className:"text-4xl font-bold text-primary",children:(0,u.formatPrice)(I.price)}),I.originalPrice&&I.originalPrice>I.price&&(0,t.jsx)("span",{className:"text-xl text-gray-400 line-through",children:(0,u.formatPrice)(I.originalPrice)})]}),D>0&&(0,t.jsxs)("p",{className:"text-sm text-green-600",children:["Bạn tiết kiệm được ",(0,u.formatPrice)(I.originalPrice-I.price)]})]}),(0,t.jsx)("div",{children:B?(0,t.jsxs)(l.Badge,{variant:"outline",className:"text-green-600 border-green-600",children:["Còn hàng (",I.stock," ",I.unit,")"]}):(0,t.jsx)(l.Badge,{variant:"outline",className:"text-red-600 border-red-600",children:"Hết hàng"})}),(0,t.jsx)(c.Separator,{}),I.variants&&I.variants.length>0&&(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)("p",{className:"font-semibold",children:"Chọn loại:"}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:I.variants.map((e,r)=>(0,t.jsxs)(n.Button,{variant:0===r?"default":"outline",size:"sm",children:[e.name," - ",(0,u.formatPrice)(e.price)]},e.id))})]}),(0,t.jsxs)("div",{className:"flex gap-3",children:[(0,t.jsxs)(n.Button,{size:"lg",className:"flex-1",disabled:!B,children:[(0,t.jsx)(p.ShoppingCart,{className:"w-5 h-5 mr-2"}),"Thêm vào giỏ hàng"]}),(0,t.jsx)(n.Button,{size:"lg",variant:"outline",children:"Mua ngay"})]}),(0,t.jsxs)("div",{className:"space-y-3 pt-4",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,t.jsx)(h.Truck,{className:"w-5 h-5 text-gray-400"}),(0,t.jsx)("span",{children:"Giao hàng miễn phí cho đơn từ 200.000đ"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,t.jsx)(x.Shield,{className:"w-5 h-5 text-gray-400"}),(0,t.jsx)("span",{children:"Đảm bảo chất lượng sản phẩm"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,t.jsx)(y.RefreshCw,{className:"w-5 h-5 text-gray-400"}),(0,t.jsx)("span",{children:"Đổi trả trong 7 ngày"})]})]})]})]}),(N||C)&&(0,t.jsx)("div",{className:"mt-12",children:(0,t.jsxs)(o.Tabs,{defaultValue:"description",children:[(0,t.jsxs)(o.TabsList,{children:[N&&(0,t.jsx)(o.TabsTrigger,{value:"description",children:"Mô tả"}),C&&(0,t.jsx)(o.TabsTrigger,{value:"specs",children:"Thông số"}),T&&(0,t.jsx)(o.TabsTrigger,{value:"reviews",children:"Đánh giá"})]}),N&&(0,t.jsxs)(o.TabsContent,{value:"description",className:"prose max-w-none",children:[(0,t.jsx)("div",{dangerouslySetInnerHTML:{__html:I.description||"Chưa có mô tả"}}),I.origin&&(0,t.jsx)("div",{className:"mt-4 p-4 bg-gray-50 rounded",children:(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"Xuất xứ:"})," ",I.origin]})})]}),C&&(0,t.jsx)(o.TabsContent,{value:"specs",className:"space-y-2",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"SKU"}),(0,t.jsx)("p",{className:"font-semibold",children:I.sku})]}),(0,t.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Đơn vị"}),(0,t.jsx)("p",{className:"font-semibold",children:I.unit})]}),I.weight&&(0,t.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Trọng lượng"}),(0,t.jsxs)("p",{className:"font-semibold",children:[I.weight," kg"]})]}),I.origin&&(0,t.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,t.jsx)("p",{className:"text-sm text-gray-600",children:"Xuất xứ"}),(0,t.jsx)("p",{className:"font-semibold",children:I.origin})]})]})}),T&&(0,t.jsx)(o.TabsContent,{value:"reviews",children:(0,t.jsx)("p",{className:"text-gray-600 text-center py-8",children:"Chưa có đánh giá nào cho sản phẩm này"})})]})})]})}function P(){return(0,t.jsx)("div",{className:"container mx-auto py-8",children:(0,t.jsxs)("div",{className:"grid md:grid-cols-2 gap-8",children:[(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(d.Skeleton,{className:"aspect-square rounded-lg"}),(0,t.jsx)("div",{className:"grid grid-cols-4 gap-2",children:[1,2,3,4].map(e=>(0,t.jsx)(d.Skeleton,{className:"aspect-square rounded"},e))})]}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)(d.Skeleton,{className:"h-8 w-32"}),(0,t.jsx)(d.Skeleton,{className:"h-10 w-full"}),(0,t.jsx)(d.Skeleton,{className:"h-6 w-3/4"}),(0,t.jsx)(d.Skeleton,{className:"h-12 w-40"}),(0,t.jsx)(d.Skeleton,{className:"h-10 w-full"}),(0,t.jsx)(d.Skeleton,{className:"h-10 w-full"})]})]})})}e.s(["ProductDetailBlock",()=>j])}]);