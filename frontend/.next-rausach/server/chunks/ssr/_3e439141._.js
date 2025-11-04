module.exports=[270694,a=>{"use strict";var b=a.i(651332),c=a.i(572521),d=a.i(4116),e=a.i(360507),f=a.i(694475),g=a.i(742053),h=a.i(372123),i=a.i(6769),j=a.i(549074),k=a.i(770186),l=a.i(321248),m="rovingFocusGroup.onEntryFocus",n={bubbles:!1,cancelable:!0},o="RovingFocusGroup",[p,q,r]=(0,d.createCollection)(o),[s,t]=(0,f.createContextScope)(o,[r]),[u,v]=s(o),w=b.forwardRef((a,b)=>(0,l.jsx)(p.Provider,{scope:a.__scopeRovingFocusGroup,children:(0,l.jsx)(p.Slot,{scope:a.__scopeRovingFocusGroup,children:(0,l.jsx)(x,{...a,ref:b})})}));w.displayName=o;var x=b.forwardRef((a,d)=>{let{__scopeRovingFocusGroup:f,orientation:g,loop:p=!1,dir:r,currentTabStopId:s,defaultCurrentTabStopId:t,onCurrentTabStopIdChange:v,onEntryFocus:w,preventScrollOnEntryFocus:x=!1,...y}=a,z=b.useRef(null),A=(0,e.useComposedRefs)(d,z),C=(0,k.useDirection)(r),[D,E]=(0,j.useControllableState)({prop:s,defaultProp:t??null,onChange:v,caller:o}),[F,G]=b.useState(!1),H=(0,i.useCallbackRef)(w),I=q(f),J=b.useRef(!1),[K,L]=b.useState(0);return b.useEffect(()=>{let a=z.current;if(a)return a.addEventListener(m,H),()=>a.removeEventListener(m,H)},[H]),(0,l.jsx)(u,{scope:f,orientation:g,dir:C,loop:p,currentTabStopId:D,onItemFocus:b.useCallback(a=>E(a),[E]),onItemShiftTab:b.useCallback(()=>G(!0),[]),onFocusableItemAdd:b.useCallback(()=>L(a=>a+1),[]),onFocusableItemRemove:b.useCallback(()=>L(a=>a-1),[]),children:(0,l.jsx)(h.Primitive.div,{tabIndex:F||0===K?-1:0,"data-orientation":g,...y,ref:A,style:{outline:"none",...a.style},onMouseDown:(0,c.composeEventHandlers)(a.onMouseDown,()=>{J.current=!0}),onFocus:(0,c.composeEventHandlers)(a.onFocus,a=>{let b=!J.current;if(a.target===a.currentTarget&&b&&!F){let b=new CustomEvent(m,n);if(a.currentTarget.dispatchEvent(b),!b.defaultPrevented){let a=I().filter(a=>a.focusable);B([a.find(a=>a.active),a.find(a=>a.id===D),...a].filter(Boolean).map(a=>a.ref.current),x)}}J.current=!1}),onBlur:(0,c.composeEventHandlers)(a.onBlur,()=>G(!1))})})}),y="RovingFocusGroupItem",z=b.forwardRef((a,d)=>{let{__scopeRovingFocusGroup:e,focusable:f=!0,active:i=!1,tabStopId:j,children:k,...m}=a,n=(0,g.useId)(),o=j||n,r=v(y,e),s=r.currentTabStopId===o,t=q(e),{onFocusableItemAdd:u,onFocusableItemRemove:w,currentTabStopId:x}=r;return b.useEffect(()=>{if(f)return u(),()=>w()},[f,u,w]),(0,l.jsx)(p.ItemSlot,{scope:e,id:o,focusable:f,active:i,children:(0,l.jsx)(h.Primitive.span,{tabIndex:s?0:-1,"data-orientation":r.orientation,...m,ref:d,onMouseDown:(0,c.composeEventHandlers)(a.onMouseDown,a=>{f?r.onItemFocus(o):a.preventDefault()}),onFocus:(0,c.composeEventHandlers)(a.onFocus,()=>r.onItemFocus(o)),onKeyDown:(0,c.composeEventHandlers)(a.onKeyDown,a=>{if("Tab"===a.key&&a.shiftKey)return void r.onItemShiftTab();if(a.target!==a.currentTarget)return;let b=function(a,b,c){var d;let e=(d=a.key,"rtl"!==c?d:"ArrowLeft"===d?"ArrowRight":"ArrowRight"===d?"ArrowLeft":d);if(!("vertical"===b&&["ArrowLeft","ArrowRight"].includes(e))&&!("horizontal"===b&&["ArrowUp","ArrowDown"].includes(e)))return A[e]}(a,r.orientation,r.dir);if(void 0!==b){if(a.metaKey||a.ctrlKey||a.altKey||a.shiftKey)return;a.preventDefault();let e=t().filter(a=>a.focusable).map(a=>a.ref.current);if("last"===b)e.reverse();else if("prev"===b||"next"===b){var c,d;"prev"===b&&e.reverse();let f=e.indexOf(a.currentTarget);e=r.loop?(c=e,d=f+1,c.map((a,b)=>c[(d+b)%c.length])):e.slice(f+1)}setTimeout(()=>B(e))}}),children:"function"==typeof k?k({isCurrentTabStop:s,hasTabStop:null!=x}):k})})});z.displayName=y;var A={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function B(a,b=!1){let c=document.activeElement;for(let d of a)if(d===c||(d.focus({preventScroll:b}),document.activeElement!==c))return}a.s(["Item",()=>z,"Root",()=>w,"createRovingFocusGroupScope",()=>t])},951369,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(572521),e=a.i(694475),f=a.i(270694),g=a.i(660886),h=a.i(372123),i=a.i(770186),j=a.i(549074),k=a.i(742053),l="Tabs",[m,n]=(0,e.createContextScope)(l,[f.createRovingFocusGroupScope]),o=(0,f.createRovingFocusGroupScope)(),[p,q]=m(l),r=c.forwardRef((a,c)=>{let{__scopeTabs:d,value:e,onValueChange:f,defaultValue:g,orientation:m="horizontal",dir:n,activationMode:o="automatic",...q}=a,r=(0,i.useDirection)(n),[s,t]=(0,j.useControllableState)({prop:e,onChange:f,defaultProp:g??"",caller:l});return(0,b.jsx)(p,{scope:d,baseId:(0,k.useId)(),value:s,onValueChange:t,orientation:m,dir:r,activationMode:o,children:(0,b.jsx)(h.Primitive.div,{dir:r,"data-orientation":m,...q,ref:c})})});r.displayName=l;var s="TabsList",t=c.forwardRef((a,c)=>{let{__scopeTabs:d,loop:e=!0,...g}=a,i=q(s,d),j=o(d);return(0,b.jsx)(f.Root,{asChild:!0,...j,orientation:i.orientation,dir:i.dir,loop:e,children:(0,b.jsx)(h.Primitive.div,{role:"tablist","aria-orientation":i.orientation,...g,ref:c})})});t.displayName=s;var u="TabsTrigger",v=c.forwardRef((a,c)=>{let{__scopeTabs:e,value:g,disabled:i=!1,...j}=a,k=q(u,e),l=o(e),m=y(k.baseId,g),n=z(k.baseId,g),p=g===k.value;return(0,b.jsx)(f.Item,{asChild:!0,...l,focusable:!i,active:p,children:(0,b.jsx)(h.Primitive.button,{type:"button",role:"tab","aria-selected":p,"aria-controls":n,"data-state":p?"active":"inactive","data-disabled":i?"":void 0,disabled:i,id:m,...j,ref:c,onMouseDown:(0,d.composeEventHandlers)(a.onMouseDown,a=>{i||0!==a.button||!1!==a.ctrlKey?a.preventDefault():k.onValueChange(g)}),onKeyDown:(0,d.composeEventHandlers)(a.onKeyDown,a=>{[" ","Enter"].includes(a.key)&&k.onValueChange(g)}),onFocus:(0,d.composeEventHandlers)(a.onFocus,()=>{let a="manual"!==k.activationMode;p||i||!a||k.onValueChange(g)})})})});v.displayName=u;var w="TabsContent",x=c.forwardRef((a,d)=>{let{__scopeTabs:e,value:f,forceMount:i,children:j,...k}=a,l=q(w,e),m=y(l.baseId,f),n=z(l.baseId,f),o=f===l.value,p=c.useRef(o);return c.useEffect(()=>{let a=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(a)},[]),(0,b.jsx)(g.Presence,{present:i||o,children:({present:c})=>(0,b.jsx)(h.Primitive.div,{"data-state":o?"active":"inactive","data-orientation":l.orientation,role:"tabpanel","aria-labelledby":m,hidden:!c,id:n,tabIndex:0,...k,ref:d,style:{...a.style,animationDuration:p.current?"0s":void 0},children:c&&j})})});function y(a,b){return`${a}-trigger-${b}`}function z(a,b){return`${a}-content-${b}`}x.displayName=w;var A=a.i(422171);let B=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(t,{ref:d,className:(0,A.cn)("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",a),...c}));B.displayName=t.displayName;let C=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(v,{ref:d,className:(0,A.cn)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm",a),...c}));C.displayName=v.displayName;let D=c.forwardRef(({className:a,...c},d)=>(0,b.jsx)(x,{ref:d,className:(0,A.cn)("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",a),...c}));D.displayName=x.displayName,a.s(["Tabs",()=>r,"TabsContent",()=>D,"TabsList",()=>B,"TabsTrigger",()=>C],951369)},772451,a=>{"use strict";var b=a.i(321248);let c=a.i(651332).forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`animate-pulse rounded-md bg-gray-200 ${a||""}`,...c}));c.displayName="Skeleton",a.s(["Skeleton",()=>c])},785694,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,orientation:c="horizontal",decorative:e=!0,...f},g)=>(0,b.jsx)("div",{ref:g,role:e?"none":"separator","aria-orientation":e?void 0:c,className:(0,d.cn)("shrink-0 bg-gray-200","horizontal"===c?"h-[1px] w-full":"h-full w-[1px]",a),...f}));e.displayName="Separator",a.s(["Separator",()=>e])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},659683,a=>{"use strict";let b=(0,a.i(367990).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);a.s(["default",()=>b])},519732,a=>{"use strict";var b=a.i(659683);a.s(["RefreshCw",()=>b.default])},52841,a=>{"use strict";let b=(0,a.i(367990).default)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);a.s(["default",()=>b])},520215,a=>{"use strict";var b=a.i(52841);a.s(["Star",()=>b.default])},29319,a=>{"use strict";let b=(0,a.i(367990).default)("shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);a.s(["default",()=>b])},778775,a=>{"use strict";var b=a.i(29319);a.s(["Shield",()=>b.default])},746048,a=>{"use strict";let b=(0,a.i(367990).default)("truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]);a.s(["default",()=>b])},129853,a=>{"use strict";var b=a.i(746048);a.s(["Truck",()=>b.default])},394940,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`;a.s(["CATEGORY_BASIC_FRAGMENT",0,c,"CATEGORY_TREE_FRAGMENT",0,e,"CATEGORY_WITH_COUNT_FRAGMENT",0,d,"COMMENT_FRAGMENT",0,j,"POST_FRAGMENT",0,i,"PRODUCT_IMAGE_FRAGMENT",0,f,"PRODUCT_VARIANT_FRAGMENT",0,g,"USER_FRAGMENT",0,h])},848502,a=>{"use strict";var b=a.i(772213),c=a.i(394940);let d=c.PRODUCT_IMAGE_FRAGMENT,e=c.PRODUCT_VARIANT_FRAGMENT,f=b.gql`
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
`,g=b.gql`
  ${f}
  ${d}
  ${e}
  ${c.CATEGORY_BASIC_FRAGMENT}
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
`,h=b.gql`
  ${f}
  ${c.CATEGORY_BASIC_FRAGMENT}
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
`,i=b.gql`
  ${g}
  query GetProduct($id: ID!) {
    product(id: $id) {
      ...ProductFullFields
    }
  }
`,j=b.gql`
  ${g}
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFullFields
    }
  }
`,k=b.gql`
  ${f}
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
`,l=b.gql`
  ${f}
  ${c.CATEGORY_BASIC_FRAGMENT}
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
`,m=b.gql`
  ${f}
  ${c.CATEGORY_BASIC_FRAGMENT}
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
`;b.gql`
  ${f}
  ${c.CATEGORY_BASIC_FRAGMENT}
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
`;let n=b.gql`
  ${g}
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,o=b.gql`
  ${g}
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      ...ProductFullFields
    }
  }
`,p=b.gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`,q=b.gql`
  ${f}
  mutation UpdateProductStock($id: ID!, $quantity: Float!) {
    updateProductStock(id: $id, quantity: $quantity) {
      ...ProductBasicFields
    }
  }
`,r=b.gql`
  ${d}
  mutation AddProductImage($input: CreateProductImageInput!) {
    addProductImage(input: $input) {
      ...ProductImageFields
    }
  }
`,s=b.gql`
  mutation DeleteProductImage($id: ID!) {
    deleteProductImage(id: $id)
  }
`,t=b.gql`
  ${e}
  mutation AddProductVariant($input: CreateProductVariantInput!) {
    addProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,u=b.gql`
  ${e}
  mutation UpdateProductVariant($input: UpdateProductVariantInput!) {
    updateProductVariant(input: $input) {
      ...ProductVariantFields
    }
  }
`,v=b.gql`
  mutation DeleteProductVariant($id: ID!) {
    deleteProductVariant(id: $id)
  }
`;a.s(["ADD_PRODUCT_IMAGE",0,r,"ADD_PRODUCT_VARIANT",0,t,"CREATE_PRODUCT",0,n,"DELETE_PRODUCT",0,p,"DELETE_PRODUCT_IMAGE",0,s,"DELETE_PRODUCT_VARIANT",0,v,"GET_FEATURED_PRODUCTS",0,l,"GET_PRODUCT",0,i,"GET_PRODUCTS",0,h,"GET_PRODUCTS_BY_CATEGORY",0,k,"GET_PRODUCT_BY_SLUG",0,j,"PRODUCT_FULL_FRAGMENT",0,g,"SEARCH_PRODUCTS",0,m,"UPDATE_PRODUCT",0,o,"UPDATE_PRODUCT_STOCK",0,q,"UPDATE_PRODUCT_VARIANT",0,u])},333877,a=>{"use strict";a.s(["formatPrice",0,a=>null==a?"-":new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(Number(a))])},661867,a=>{"use strict";var b=a.i(321248),c=a.i(168918),d=a.i(772213),e=a.i(848502),f=a.i(975780),g=a.i(202979),h=a.i(293470),i=a.i(772451),j=a.i(951369),k=a.i(785694),l=a.i(333877),m=a.i(734639),n=a.i(53627),o=a.i(543220),p=a.i(520215),q=a.i(129853),r=a.i(778775),s=a.i(519732);let t=d.gql`
  ${e.PRODUCT_FULL_FRAGMENT}
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFullFields
    }
  }
`;function u({block:a,isEditable:d=!0,onUpdate:e,onDelete:i}){let u=a.content||{},{productSlug:w,showGallery:x=!0,showDescription:y=!0,showSpecs:z=!0,showReviews:A=!1,showRelated:B=!1,layout:C="default"}=u,D=(0,n.useParams)(),E=D?.slug,F=d?w:w||E,{data:G,loading:H,error:I}=(0,c.useQuery)(t,{variables:{slug:F},skip:d||!F}),J=G?.productBySlug||null;if(d)return(0,b.jsx)("div",{className:"p-6 border-2 border-dashed border-green-300 rounded-lg bg-green-50",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)(o.ShoppingCart,{className:"w-12 h-12 mx-auto mb-3 text-green-500"}),(0,b.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"Product Detail Block"}),F?(0,b.jsxs)("p",{className:"text-sm text-gray-600 mb-4",children:["Hiển thị chi tiết sản phẩm: ",(0,b.jsx)("strong",{children:F})]}):(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsx)("p",{className:"text-sm text-orange-600 mb-2",children:"⚠️ Chưa cấu hình product slug"}),(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Vui lòng chọn block này và nhập product slug trong panel bên phải"})]}),(0,b.jsxs)("div",{className:"flex gap-2 justify-center text-xs text-gray-500",children:[x&&(0,b.jsx)(h.Badge,{variant:"secondary",children:"Gallery"}),y&&(0,b.jsx)(h.Badge,{variant:"secondary",children:"Description"}),z&&(0,b.jsx)(h.Badge,{variant:"secondary",children:"Specs"}),A&&(0,b.jsx)(h.Badge,{variant:"secondary",children:"Reviews"})]})]})});if(I)return(0,b.jsx)("div",{className:"container mx-auto py-8",children:(0,b.jsx)(f.Card,{className:"border-red-200 bg-red-50",children:(0,b.jsx)(f.CardContent,{className:"pt-6",children:(0,b.jsxs)("p",{className:"text-red-600 text-center",children:["Lỗi tải sản phẩm: ",I.message]})})})});if(H)return(0,b.jsx)(v,{});if(!J)return(0,b.jsx)("div",{className:"container mx-auto py-8",children:(0,b.jsx)(f.Card,{children:(0,b.jsx)(f.CardContent,{className:"pt-6",children:(0,b.jsxs)("p",{className:"text-gray-600 text-center",children:["Không tìm thấy sản phẩm ",F&&`"${F}"`]})})})});let K=J.discountPercentage||0,L=J.stock>0;return(0,b.jsxs)("div",{className:"container mx-auto py-8",style:u.style,children:[(0,b.jsxs)("div",{className:"grid md:grid-cols-2 gap-8",children:[x&&(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"relative aspect-square rounded-lg overflow-hidden bg-gray-100",children:[J.thumbnail?(0,b.jsx)(m.default,{src:J.thumbnail,alt:J.name,fill:!0,className:"object-cover",priority:!0}):(0,b.jsx)("div",{className:"w-full h-full flex items-center justify-center text-gray-400",children:"No Image"}),(0,b.jsxs)("div",{className:"absolute top-4 left-4 flex flex-col gap-2",children:[J.isNewArrival&&(0,b.jsx)(h.Badge,{className:"bg-green-500",children:"Hàng mới"}),J.isFeatured&&(0,b.jsx)(h.Badge,{className:"bg-blue-500",children:"Nổi bật"}),K>0&&(0,b.jsxs)(h.Badge,{className:"bg-red-500 text-lg",children:["-",K,"%"]})]})]}),J.images&&J.images.length>0&&(0,b.jsx)("div",{className:"grid grid-cols-4 gap-2",children:J.images.map((a,c)=>(0,b.jsx)("div",{className:"relative aspect-square rounded overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 ring-primary",children:(0,b.jsx)(m.default,{src:a.url,alt:a.alt||"",fill:!0,className:"object-cover"})},c))})]}),(0,b.jsxs)("div",{className:"space-y-6",children:[J.category&&(0,b.jsx)("div",{className:"text-sm text-gray-600",children:J.category.name}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-3xl font-bold mb-2",children:J.name}),J.shortDesc&&(0,b.jsx)("p",{className:"text-gray-600",children:J.shortDesc})]}),(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)("div",{className:"flex text-yellow-400",children:[1,2,3,4,5].map(a=>(0,b.jsx)(p.Star,{className:"w-5 h-5 fill-current"},a))}),(0,b.jsx)("span",{className:"text-sm text-gray-600",children:"(0 đánh giá)"})]}),(0,b.jsx)(k.Separator,{}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)("div",{className:"flex items-baseline gap-3",children:[(0,b.jsx)("span",{className:"text-4xl font-bold text-primary",children:(0,l.formatPrice)(J.price)}),J.originalPrice&&J.originalPrice>J.price&&(0,b.jsx)("span",{className:"text-xl text-gray-400 line-through",children:(0,l.formatPrice)(J.originalPrice)})]}),K>0&&(0,b.jsxs)("p",{className:"text-sm text-green-600",children:["Bạn tiết kiệm được ",(0,l.formatPrice)(J.originalPrice-J.price)]})]}),(0,b.jsx)("div",{children:L?(0,b.jsxs)(h.Badge,{variant:"outline",className:"text-green-600 border-green-600",children:["Còn hàng (",J.stock," ",J.unit,")"]}):(0,b.jsx)(h.Badge,{variant:"outline",className:"text-red-600 border-red-600",children:"Hết hàng"})}),(0,b.jsx)(k.Separator,{}),J.variants&&J.variants.length>0&&(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsx)("p",{className:"font-semibold",children:"Chọn loại:"}),(0,b.jsx)("div",{className:"flex flex-wrap gap-2",children:J.variants.map((a,c)=>(0,b.jsxs)(g.Button,{variant:0===c?"default":"outline",size:"sm",children:[a.name," - ",(0,l.formatPrice)(a.price)]},a.id))})]}),(0,b.jsxs)("div",{className:"flex gap-3",children:[(0,b.jsxs)(g.Button,{size:"lg",className:"flex-1",disabled:!L,children:[(0,b.jsx)(o.ShoppingCart,{className:"w-5 h-5 mr-2"}),"Thêm vào giỏ hàng"]}),(0,b.jsx)(g.Button,{size:"lg",variant:"outline",children:"Mua ngay"})]}),(0,b.jsxs)("div",{className:"space-y-3 pt-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,b.jsx)(q.Truck,{className:"w-5 h-5 text-gray-400"}),(0,b.jsx)("span",{children:"Giao hàng miễn phí cho đơn từ 200.000đ"})]}),(0,b.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,b.jsx)(r.Shield,{className:"w-5 h-5 text-gray-400"}),(0,b.jsx)("span",{children:"Đảm bảo chất lượng sản phẩm"})]}),(0,b.jsxs)("div",{className:"flex items-center gap-3 text-sm",children:[(0,b.jsx)(s.RefreshCw,{className:"w-5 h-5 text-gray-400"}),(0,b.jsx)("span",{children:"Đổi trả trong 7 ngày"})]})]})]})]}),(y||z)&&(0,b.jsx)("div",{className:"mt-12",children:(0,b.jsxs)(j.Tabs,{defaultValue:"description",children:[(0,b.jsxs)(j.TabsList,{children:[y&&(0,b.jsx)(j.TabsTrigger,{value:"description",children:"Mô tả"}),z&&(0,b.jsx)(j.TabsTrigger,{value:"specs",children:"Thông số"}),A&&(0,b.jsx)(j.TabsTrigger,{value:"reviews",children:"Đánh giá"})]}),y&&(0,b.jsxs)(j.TabsContent,{value:"description",className:"prose max-w-none",children:[(0,b.jsx)("div",{dangerouslySetInnerHTML:{__html:J.description||"Chưa có mô tả"}}),J.origin&&(0,b.jsx)("div",{className:"mt-4 p-4 bg-gray-50 rounded",children:(0,b.jsxs)("p",{children:[(0,b.jsx)("strong",{children:"Xuất xứ:"})," ",J.origin]})})]}),z&&(0,b.jsx)(j.TabsContent,{value:"specs",className:"space-y-2",children:(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"SKU"}),(0,b.jsx)("p",{className:"font-semibold",children:J.sku})]}),(0,b.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Đơn vị"}),(0,b.jsx)("p",{className:"font-semibold",children:J.unit})]}),J.weight&&(0,b.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Trọng lượng"}),(0,b.jsxs)("p",{className:"font-semibold",children:[J.weight," kg"]})]}),J.origin&&(0,b.jsxs)("div",{className:"p-4 bg-gray-50 rounded",children:[(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Xuất xứ"}),(0,b.jsx)("p",{className:"font-semibold",children:J.origin})]})]})}),A&&(0,b.jsx)(j.TabsContent,{value:"reviews",children:(0,b.jsx)("p",{className:"text-gray-600 text-center py-8",children:"Chưa có đánh giá nào cho sản phẩm này"})})]})})]})}function v(){return(0,b.jsx)("div",{className:"container mx-auto py-8",children:(0,b.jsxs)("div",{className:"grid md:grid-cols-2 gap-8",children:[(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)(i.Skeleton,{className:"aspect-square rounded-lg"}),(0,b.jsx)("div",{className:"grid grid-cols-4 gap-2",children:[1,2,3,4].map(a=>(0,b.jsx)(i.Skeleton,{className:"aspect-square rounded"},a))})]}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)(i.Skeleton,{className:"h-8 w-32"}),(0,b.jsx)(i.Skeleton,{className:"h-10 w-full"}),(0,b.jsx)(i.Skeleton,{className:"h-6 w-3/4"}),(0,b.jsx)(i.Skeleton,{className:"h-12 w-40"}),(0,b.jsx)(i.Skeleton,{className:"h-10 w-full"}),(0,b.jsx)(i.Skeleton,{className:"h-10 w-full"})]})]})})}a.s(["ProductDetailBlock",()=>u])}];

//# sourceMappingURL=_3e439141._.js.map