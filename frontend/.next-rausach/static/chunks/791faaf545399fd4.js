(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,774309,e=>{"use strict";var t=e.i(44990);let r=e.i(403055).forwardRef(({className:e,...r},i)=>(0,t.jsx)("div",{ref:i,className:`animate-pulse rounded-md bg-gray-200 ${e||""}`,...r}));r.displayName="Skeleton",e.s(["Skeleton",()=>r])},49316,(e,t,r)=>{"use strict";function i({widthInt:e,heightInt:t,blurWidth:r,blurHeight:i,blurDataURL:a,objectFit:s}){let n=r?40*r:e,l=i?40*i:t,o=n&&l?`viewBox='0 0 ${n} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${o}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${o?"none":"contain"===s?"xMidYMid":"cover"===s?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${a}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return i}})},596974,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={VALID_LOADERS:function(){return s},imageConfigDefault:function(){return n}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},473733,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return o}}),e.r(715200);let i=e.r(49316),a=e.r(596974),s=["-moz-initial","fill","none","scale-down",void 0];function n(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function o({src:e,sizes:t,unoptimized:r=!1,priority:o=!1,preload:d=!1,loading:c,className:u,quality:m,width:g,height:p,fill:f=!1,style:h,overrideSrc:y,onLoad:P,onLoadingComplete:x,placeholder:b="empty",blurDataURL:_,fetchPriority:C,decoding:v="async",layout:j,objectFit:E,objectPosition:T,lazyBoundary:N,lazyRoot:w,...A},S){var R;let O,$,F,{imgConf:I,showAltText:D,blurComplete:M,defaultLoader:B}=S,G=I||a.imageConfigDefault;if("allSizes"in G)O=G;else{let e=[...G.deviceSizes,...G.imageSizes].sort((e,t)=>e-t),t=G.deviceSizes.sort((e,t)=>e-t),r=G.qualities?.sort((e,t)=>e-t);O={...G,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===B)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let q=A.loader||B;delete A.loader,delete A.srcSet;let U="__next_img_default"in q;if(U){if("custom"===O.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=q;q=t=>{let{config:r,...i}=t;return e(i)}}if(j){"fill"===j&&(f=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[j];e&&(h={...h,...e});let r={responsive:"100vw",fill:"100vw"}[j];r&&!t&&(t=r)}let k="",z=l(g),V=l(p);if((R=e)&&"object"==typeof R&&(n(R)||void 0!==R.src)){let t=n(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if($=t.blurWidth,F=t.blurHeight,_=_||t.blurDataURL,k=t.src,!f)if(z||V){if(z&&!V){let e=z/t.width;V=Math.round(t.height*e)}else if(!z&&V){let e=V/t.height;z=Math.round(t.width*e)}}else z=t.width,V=t.height}let L=!o&&!d&&("lazy"===c||void 0===c);(!(e="string"==typeof e?e:k)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,L=!1),O.unoptimized&&(r=!0),U&&!O.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let Y=l(m),W=Object.assign(f?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:E,objectPosition:T}:{},D?{}:{color:"transparent"},h),H=M||"empty"===b?null:"blur"===b?`url("data:image/svg+xml;charset=utf-8,${(0,i.getImageBlurSvg)({widthInt:z,heightInt:V,blurWidth:$,blurHeight:F,blurDataURL:_||"",objectFit:W.objectFit})}")`:`url("${b}")`,X=s.includes(W.objectFit)?"fill"===W.objectFit?"100% 100%":"cover":W.objectFit,K=H?{backgroundSize:X,backgroundPosition:W.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:H}:{},Q=function({config:e,src:t,unoptimized:r,width:i,quality:a,sizes:s,loader:n}){if(r)return{src:t,srcSet:void 0,sizes:void 0};let{widths:l,kind:o}=function({deviceSizes:e,allSizes:t},r,i){if(i){let r=/(^|\s)(1?\d?\d)vw/g,a=[];for(let e;e=r.exec(i);)a.push(parseInt(e[2]));if(a.length){let r=.01*Math.min(...a);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,i,s),d=l.length-1;return{sizes:s||"w"!==o?s:"100vw",srcSet:l.map((r,i)=>`${n({config:e,src:t,quality:a,width:r})} ${"w"===o?r:i+1}${o}`).join(", "),src:n({config:e,src:t,quality:a,width:l[d]})}}({config:O,src:e,unoptimized:r,width:z,quality:Y,sizes:t,loader:q}),J=L?"lazy":c;return{props:{...A,loading:J,fetchPriority:C,width:z,height:V,decoding:v,className:u,style:{...W,...K},sizes:Q.sizes,srcSet:Q.srcSet,src:y||Q.src},meta:{unoptimized:r,preload:d||o,placeholder:b,fill:f}}}},805690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return l}});let i=e.r(403055),a="undefined"==typeof window,s=a?()=>{}:i.useLayoutEffect,n=a?()=>{}:i.useEffect;function l(e){let{headManager:t,reduceComponentsToState:r}=e;function l(){if(t&&t.mountedInstances){let e=i.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return a&&(t?.mountedInstances?.add(e.children),l()),s(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),s(()=>(t&&(t._pendingUpdate=l),()=>{t&&(t._pendingUpdate=l)})),n(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},308112,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={default:function(){return f},defaultHead:function(){return u}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=e.r(940192),n=e.r(475244),l=e.r(44990),o=n._(e.r(403055)),d=s._(e.r(805690)),c=e.r(525989);function u(){return[(0,l.jsx)("meta",{charSet:"utf-8"},"charset"),(0,l.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function m(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===o.default.Fragment?e.concat(o.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(715200);let g=["name","httpEquiv","charSet","itemProp"];function p(e){let t,r,i,a;return e.reduce(m,[]).reverse().concat(u().reverse()).filter((t=new Set,r=new Set,i=new Set,a={},e=>{let s=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?s=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?s=!1:r.add(e.type);break;case"meta":for(let t=0,r=g.length;t<r;t++){let r=g[t];if(e.props.hasOwnProperty(r))if("charSet"===r)i.has(r)?s=!1:i.add(r);else{let t=e.props[r],i=a[r]||new Set;("name"!==r||!n)&&i.has(t)?s=!1:(i.add(t),a[r]=i)}}}return s})).reverse().map((e,t)=>{let r=e.key||t;return o.default.cloneElement(e,{key:r})})}let f=function({children:e}){let t=(0,o.useContext)(c.HeadManagerContext);return(0,l.jsx)(d.default,{reduceComponentsToState:p,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},238369,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return s}});let i=e.r(940192)._(e.r(403055)),a=e.r(596974),s=i.default.createContext(a.imageConfigDefault)},420539,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return i}});let i=e.r(940192)._(e.r(403055)).default.createContext(null)},659556,(e,t,r)=>{"use strict";function i(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,0):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return i}})},103342,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return s}});let i=e.r(659556);function a({config:e,src:t,width:r,quality:a}){if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let s=(0,i.findClosestQuality)(a,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${s}${t.startsWith("/_next/static/media/"),""}`}a.__next_img_default=!0;let s=a},894595,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return b}});let i=e.r(940192),a=e.r(475244),s=e.r(44990),n=a._(e.r(403055)),l=i._(e.r(940392)),o=i._(e.r(308112)),d=e.r(473733),c=e.r(596974),u=e.r(238369);e.r(715200);let m=e.r(420539),g=i._(e.r(103342)),p=e.r(527304),f={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function h(e,t,r,i,a,s,n){let l=e?.src;e&&e["data-loaded-src"]!==l&&(e["data-loaded-src"]=l,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&a(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let i=!1,a=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>i,isPropagationStopped:()=>a,persist:()=>{},preventDefault:()=>{i=!0,t.preventDefault()},stopPropagation:()=>{a=!0,t.stopPropagation()}})}i?.current&&i.current(e)}}))}function y(e){return n.use?{fetchPriority:e}:{fetchpriority:e}}"undefined"==typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let P=(0,n.forwardRef)(({src:e,srcSet:t,sizes:r,height:i,width:a,decoding:l,className:o,style:d,fetchPriority:c,placeholder:u,loading:m,unoptimized:g,fill:f,onLoadRef:P,onLoadingCompleteRef:x,setBlurComplete:b,setShowAltText:_,sizesInput:C,onLoad:v,onError:j,...E},T)=>{let N=(0,n.useCallback)(e=>{e&&(j&&(e.src=e.src),e.complete&&h(e,u,P,x,b,g,C))},[e,u,P,x,b,j,g,C]),w=(0,p.useMergedRef)(T,N);return(0,s.jsx)("img",{...E,...y(c),loading:m,width:a,height:i,decoding:l,"data-nimg":f?"fill":"1",className:o,style:d,sizes:r,srcSet:t,src:e,ref:w,onLoad:e=>{h(e.currentTarget,u,P,x,b,g,C)},onError:e=>{_(!0),"empty"!==u&&b(!0),j&&j(e)}})});function x({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...y(t.fetchPriority)};return e&&l.default.preload?(l.default.preload(t.src,r),null):(0,s.jsx)(o.default,{children:(0,s.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let b=(0,n.forwardRef)((e,t)=>{let r=(0,n.useContext)(m.RouterContext),i=(0,n.useContext)(u.ImageConfigContext),a=(0,n.useMemo)(()=>{let e=f||i||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),a=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:a,localPatterns:"undefined"==typeof window?i?.localPatterns:e.localPatterns}},[i]),{onLoad:l,onLoadingComplete:o}=e,p=(0,n.useRef)(l);(0,n.useEffect)(()=>{p.current=l},[l]);let h=(0,n.useRef)(o);(0,n.useEffect)(()=>{h.current=o},[o]);let[y,b]=(0,n.useState)(!1),[_,C]=(0,n.useState)(!1),{props:v,meta:j}=(0,d.getImgProps)(e,{defaultLoader:g.default,imgConf:a,blurComplete:y,showAltText:_});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(P,{...v,unoptimized:j.unoptimized,placeholder:j.placeholder,fill:j.fill,onLoadRef:p,onLoadingCompleteRef:h,setBlurComplete:b,setShowAltText:C,sizesInput:e.sizes,ref:t}),j.preload?(0,s.jsx)(x,{isAppRouter:!r,imgAttributes:v}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},211684,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={default:function(){return c},getImageProps:function(){return d}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let s=e.r(940192),n=e.r(473733),l=e.r(894595),o=s._(e.r(103342));function d(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:o.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let c=l.Image},586754,(e,t,r)=>{t.exports=e.r(211684)},574375,e=>{"use strict";var t=e.i(984804);let r=t.gql`
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
`,o=t.gql`
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
`;e.s(["CATEGORY_BASIC_FRAGMENT",0,r,"CATEGORY_TREE_FRAGMENT",0,a,"CATEGORY_WITH_COUNT_FRAGMENT",0,i,"COMMENT_FRAGMENT",0,d,"POST_FRAGMENT",0,o,"PRODUCT_IMAGE_FRAGMENT",0,s,"PRODUCT_VARIANT_FRAGMENT",0,n,"USER_FRAGMENT",0,l])},355422,e=>{"use strict";var t=e.i(984804),r=e.i(574375);let i=r.PRODUCT_IMAGE_FRAGMENT,a=r.PRODUCT_VARIANT_FRAGMENT,s=t.gql`
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
`,o=t.gql`
  ${n}
  query GetProduct($id: ID!) {
    product(id: $id) {
      ...ProductFullFields
    }
  }
`,d=t.gql`
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
`,m=t.gql`
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
`;let g=t.gql`
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
`,y=t.gql`
  ${i}
  mutation AddProductImage($input: CreateProductImageInput!) {
    addProductImage(input: $input) {
      ...ProductImageFields
    }
  }
`,P=t.gql`
  mutation DeleteProductImage($id: ID!) {
    deleteProductImage(id: $id)
  }
`,x=t.gql`
  ${a}
  mutation AddProductVariant($input: CreateProductVariantInput!) {
    addProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,b=t.gql`
  ${a}
  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
    updateProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,_=t.gql`
  mutation DeleteProductVariant($id: ID!) {
    deleteProductVariant(id: $id)
  }
`;e.s(["ADD_PRODUCT_IMAGE",0,y,"ADD_PRODUCT_VARIANT",0,x,"CREATE_PRODUCT",0,g,"DELETE_PRODUCT",0,f,"DELETE_PRODUCT_IMAGE",0,P,"DELETE_PRODUCT_VARIANT",0,_,"GET_FEATURED_PRODUCTS",0,u,"GET_PRODUCT",0,o,"GET_PRODUCTS",0,l,"GET_PRODUCTS_BY_CATEGORY",0,c,"GET_PRODUCT_BY_SLUG",0,d,"PRODUCT_FULL_FRAGMENT",0,n,"SEARCH_PRODUCTS",0,m,"UPDATE_PRODUCT",0,p,"UPDATE_PRODUCT_STOCK",0,h,"UPDATE_PRODUCT_VARIANT",0,b])},250557,e=>{"use strict";e.s(["formatPrice",0,e=>null==e?"-":new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(Number(e))])},464737,e=>{"use strict";var t=e.i(44990),r=e.i(403055),i=e.i(429105),a=e.i(355422),s=e.i(775680),n=e.i(885205),l=e.i(702470),o=e.i(774309),d=e.i(250557),c=e.i(586754),u=e.i(579448),m=e.i(202774),g=e.i(404210);function p({block:e,isEditable:d=!0,onUpdate:c,onDelete:u}){let g=e.content||{},{title:p="Sản phẩm",subtitle:y,limit:P=12,categoryId:x,filters:b={},layout:_="grid",columns:C=3,showPrice:v=!0,showCategory:j=!0,showDescription:E=!1,showAddToCart:T=!0,cardVariant:N="default"}=g,[w,A]=(0,r.useState)(1),S={input:{limit:P,page:w,filters:{...b,...x&&{categoryId:x}}}},{data:R,loading:O,error:$}=(0,i.useQuery)(a.GET_PRODUCTS,{variables:S,skip:d}),F=R?.products?.items||[],I=Math.ceil((R?.products?.total||0)/P);if(d)return(0,t.jsx)("div",{className:"p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)(m.ShoppingCart,{className:"w-12 h-12 mx-auto mb-3 text-blue-500"}),(0,t.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"Product List Block"}),(0,t.jsxs)("p",{className:"text-sm text-gray-600 mb-4",children:["Hiển thị ",P," sản phẩm ",x&&"từ danh mục đã chọn",b.isFeatured&&" (Nổi bật)",b.isNew&&" (Mới)"]}),(0,t.jsxs)("div",{className:"flex gap-2 justify-center text-xs text-gray-500",children:[(0,t.jsxs)(l.Badge,{variant:"secondary",children:["Layout: ",_]}),(0,t.jsxs)(l.Badge,{variant:"secondary",children:["Columns: ",C]}),(0,t.jsxs)(l.Badge,{variant:"secondary",children:["Variant: ",N]})]})]})});let D={2:"grid-cols-1 md:grid-cols-2",3:"grid-cols-1 md:grid-cols-2 lg:grid-cols-3",4:"grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}[C];return $&&!d?(0,t.jsx)("div",{className:"p-6 border border-red-200 rounded-lg bg-red-50",children:(0,t.jsxs)("p",{className:"text-red-600 text-center",children:["Lỗi tải sản phẩm: ",$.message]})}):O&&!d?(0,t.jsx)("div",{className:"container mx-auto py-8",children:(0,t.jsx)("div",{className:`grid ${D} gap-6`,children:Array.from({length:P}).map((e,r)=>(0,t.jsxs)(s.Card,{children:[(0,t.jsx)(s.CardHeader,{children:(0,t.jsx)(o.Skeleton,{className:"h-48 w-full"})}),(0,t.jsxs)(s.CardContent,{children:[(0,t.jsx)(o.Skeleton,{className:"h-4 w-3/4 mb-2"}),(0,t.jsx)(o.Skeleton,{className:"h-4 w-1/2"})]})]},r))})}):(0,t.jsxs)("div",{className:"container mx-auto py-8",style:g.style,children:[(p||y)&&(0,t.jsxs)("div",{className:"text-center mb-8",children:[p&&(0,t.jsx)("h2",{className:"text-3xl font-bold mb-2",children:p}),y&&(0,t.jsx)("p",{className:"text-gray-600",children:y})]}),O?(0,t.jsx)("div",{className:`grid ${D} gap-6`,children:Array.from({length:P}).map((e,r)=>(0,t.jsx)(h,{},r))}):0===F.length?(0,t.jsx)("div",{className:"text-center py-12",children:(0,t.jsx)("p",{className:"text-gray-500",children:"Không có sản phẩm nào"})}):(0,t.jsx)("div",{className:`grid ${D} gap-6`,children:F.map(e=>(0,t.jsx)(f,{product:e,showPrice:v,showCategory:j,showDescription:E,showAddToCart:T,variant:N},e.id))}),I>1&&(0,t.jsxs)("div",{className:"flex justify-center gap-2 mt-8",children:[(0,t.jsx)(n.Button,{variant:"outline",onClick:()=>A(e=>Math.max(1,e-1)),disabled:1===w||O,children:"Trước"}),(0,t.jsx)("div",{className:"flex items-center gap-2",children:Array.from({length:Math.min(5,I)},(e,r)=>{let i=r+1;return(0,t.jsx)(n.Button,{variant:w===i?"default":"outline",onClick:()=>A(i),disabled:O,children:i},i)})}),(0,t.jsx)(n.Button,{variant:"outline",onClick:()=>A(e=>Math.min(I,e+1)),disabled:w===I||O,children:"Sau"})]})]})}function f({product:e,showPrice:r,showCategory:i,showDescription:a,showAddToCart:o,variant:p}){let f=e.discountPercentage||0;return(0,t.jsxs)(s.Card,{className:"overflow-hidden hover:shadow-lg transition-shadow",children:[(0,t.jsx)(u.default,{href:`/products/${e.slug}`,children:(0,t.jsxs)("div",{className:"relative aspect-square overflow-hidden bg-gray-100",children:[e.thumbnail?(0,t.jsx)(c.default,{src:e.thumbnail,alt:e.name,fill:!0,className:"object-cover hover:scale-105 transition-transform"}):(0,t.jsx)("div",{className:"w-full h-full flex items-center justify-center text-gray-400",children:"No Image"}),(0,t.jsxs)("div",{className:"absolute top-2 left-2 flex flex-col gap-1",children:[e.isNewArrival&&(0,t.jsx)(l.Badge,{className:"bg-green-500",children:"Mới"}),e.isFeatured&&(0,t.jsx)(l.Badge,{className:"bg-blue-500",children:"Nổi bật"}),f>0&&(0,t.jsxs)(l.Badge,{className:"bg-red-500",children:["-",f,"%"]})]})]})}),(0,t.jsxs)(s.CardHeader,{className:"pb-3",children:[i&&e.category&&(0,t.jsx)(s.CardDescription,{className:"text-xs",children:e.category.name}),(0,t.jsx)(s.CardTitle,{className:"text-base line-clamp-2",children:(0,t.jsx)(u.default,{href:`/products/${e.slug}`,className:"hover:text-primary",children:e.name})}),a&&e.shortDesc&&(0,t.jsx)(s.CardDescription,{className:"text-sm line-clamp-2",children:e.shortDesc})]}),(0,t.jsxs)(s.CardFooter,{className:"flex justify-between items-center pt-0",children:[r&&(0,t.jsxs)("div",{className:"flex flex-col",children:[(0,t.jsx)("span",{className:"text-lg font-bold text-primary",children:(0,d.formatPrice)(e.price)}),e.originalPrice&&e.originalPrice>e.price&&(0,t.jsx)("span",{className:"text-sm text-gray-400 line-through",children:(0,d.formatPrice)(e.originalPrice)})]}),o&&(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(n.Button,{size:"sm",variant:"outline",asChild:!0,children:(0,t.jsx)(u.default,{href:`/products/${e.slug}`,children:(0,t.jsx)(g.Eye,{className:"w-4 h-4"})})}),(0,t.jsxs)(n.Button,{size:"sm",children:[(0,t.jsx)(m.ShoppingCart,{className:"w-4 h-4 mr-1"}),"Mua"]})]})]})]})}function h(){return(0,t.jsxs)(s.Card,{className:"overflow-hidden",children:[(0,t.jsx)(o.Skeleton,{className:"aspect-square"}),(0,t.jsxs)(s.CardHeader,{children:[(0,t.jsx)(o.Skeleton,{className:"h-4 w-20"}),(0,t.jsx)(o.Skeleton,{className:"h-5 w-full"})]}),(0,t.jsxs)(s.CardFooter,{className:"flex justify-between",children:[(0,t.jsx)(o.Skeleton,{className:"h-6 w-24"}),(0,t.jsx)(o.Skeleton,{className:"h-9 w-20"})]})]})}e.s(["ProductListBlock",()=>p])}]);