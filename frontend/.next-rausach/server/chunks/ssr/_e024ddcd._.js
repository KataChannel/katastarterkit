module.exports=[772451,a=>{"use strict";var b=a.i(321248);let c=a.i(651332).forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`animate-pulse rounded-md bg-gray-200 ${a||""}`,...c}));c.displayName="Skeleton",a.s(["Skeleton",()=>c])},785694,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,orientation:c="horizontal",decorative:e=!0,...f},g)=>(0,b.jsx)("div",{ref:g,role:e?"none":"separator","aria-orientation":e?void 0:c,className:(0,d.cn)("shrink-0 bg-gray-200","horizontal"===c?"h-[1px] w-full":"h-full w-[1px]",a),...f}));e.displayName="Separator",a.s(["Separator",()=>e])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},778775,a=>{"use strict";var b=a.i(29319);a.s(["Shield",()=>b.default])},129853,a=>{"use strict";var b=a.i(746048);a.s(["Truck",()=>b.default])},394940,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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

//# sourceMappingURL=_e024ddcd._.js.map