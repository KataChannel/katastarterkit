module.exports=[772451,a=>{"use strict";var b=a.i(321248);let c=a.i(651332).forwardRef(({className:a,...c},d)=>(0,b.jsx)("div",{ref:d,className:`animate-pulse rounded-md bg-gray-200 ${a||""}`,...c}));c.displayName="Skeleton",a.s(["Skeleton",()=>c])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},394940,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`;a.s(["ADD_PRODUCT_IMAGE",0,r,"ADD_PRODUCT_VARIANT",0,t,"CREATE_PRODUCT",0,n,"DELETE_PRODUCT",0,p,"DELETE_PRODUCT_IMAGE",0,s,"DELETE_PRODUCT_VARIANT",0,v,"GET_FEATURED_PRODUCTS",0,l,"GET_PRODUCT",0,i,"GET_PRODUCTS",0,h,"GET_PRODUCTS_BY_CATEGORY",0,k,"GET_PRODUCT_BY_SLUG",0,j,"PRODUCT_FULL_FRAGMENT",0,g,"SEARCH_PRODUCTS",0,m,"UPDATE_PRODUCT",0,o,"UPDATE_PRODUCT_STOCK",0,q,"UPDATE_PRODUCT_VARIANT",0,u])},333877,a=>{"use strict";a.s(["formatPrice",0,a=>null==a?"-":new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(Number(a))])},668039,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(848502),f=a.i(975780),g=a.i(202979),h=a.i(293470),i=a.i(772451),j=a.i(333877),k=a.i(734639),l=a.i(439889),m=a.i(543220),n=a.i(785903);function o({block:a,isEditable:j=!0,onUpdate:k,onDelete:l}){let n=a.content||{},{title:o="Sản phẩm",subtitle:r,limit:s=12,categoryId:t,filters:u={},layout:v="grid",columns:w=3,showPrice:x=!0,showCategory:y=!0,showDescription:z=!1,showAddToCart:A=!0,cardVariant:B="default"}=n,[C,D]=(0,c.useState)(1),E={input:{limit:s,page:C,filters:{...u,...t&&{categoryId:t}}}},{data:F,loading:G,error:H}=(0,d.useQuery)(e.GET_PRODUCTS,{variables:E,skip:j}),I=F?.products?.items||[],J=Math.ceil((F?.products?.total||0)/s);if(j)return(0,b.jsx)("div",{className:"p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)(m.ShoppingCart,{className:"w-12 h-12 mx-auto mb-3 text-blue-500"}),(0,b.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"Product List Block"}),(0,b.jsxs)("p",{className:"text-sm text-gray-600 mb-4",children:["Hiển thị ",s," sản phẩm ",t&&"từ danh mục đã chọn",u.isFeatured&&" (Nổi bật)",u.isNew&&" (Mới)"]}),(0,b.jsxs)("div",{className:"flex gap-2 justify-center text-xs text-gray-500",children:[(0,b.jsxs)(h.Badge,{variant:"secondary",children:["Layout: ",v]}),(0,b.jsxs)(h.Badge,{variant:"secondary",children:["Columns: ",w]}),(0,b.jsxs)(h.Badge,{variant:"secondary",children:["Variant: ",B]})]})]})});let K={2:"grid-cols-1 md:grid-cols-2",3:"grid-cols-1 md:grid-cols-2 lg:grid-cols-3",4:"grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}[w];return H&&!j?(0,b.jsx)("div",{className:"p-6 border border-red-200 rounded-lg bg-red-50",children:(0,b.jsxs)("p",{className:"text-red-600 text-center",children:["Lỗi tải sản phẩm: ",H.message]})}):G&&!j?(0,b.jsx)("div",{className:"container mx-auto py-8",children:(0,b.jsx)("div",{className:`grid ${K} gap-6`,children:Array.from({length:s}).map((a,c)=>(0,b.jsxs)(f.Card,{children:[(0,b.jsx)(f.CardHeader,{children:(0,b.jsx)(i.Skeleton,{className:"h-48 w-full"})}),(0,b.jsxs)(f.CardContent,{children:[(0,b.jsx)(i.Skeleton,{className:"h-4 w-3/4 mb-2"}),(0,b.jsx)(i.Skeleton,{className:"h-4 w-1/2"})]})]},c))})}):(0,b.jsxs)("div",{className:"container mx-auto py-8",style:n.style,children:[(o||r)&&(0,b.jsxs)("div",{className:"text-center mb-8",children:[o&&(0,b.jsx)("h2",{className:"text-3xl font-bold mb-2",children:o}),r&&(0,b.jsx)("p",{className:"text-gray-600",children:r})]}),G?(0,b.jsx)("div",{className:`grid ${K} gap-6`,children:Array.from({length:s}).map((a,c)=>(0,b.jsx)(q,{},c))}):0===I.length?(0,b.jsx)("div",{className:"text-center py-12",children:(0,b.jsx)("p",{className:"text-gray-500",children:"Không có sản phẩm nào"})}):(0,b.jsx)("div",{className:`grid ${K} gap-6`,children:I.map(a=>(0,b.jsx)(p,{product:a,showPrice:x,showCategory:y,showDescription:z,showAddToCart:A,variant:B},a.id))}),J>1&&(0,b.jsxs)("div",{className:"flex justify-center gap-2 mt-8",children:[(0,b.jsx)(g.Button,{variant:"outline",onClick:()=>D(a=>Math.max(1,a-1)),disabled:1===C||G,children:"Trước"}),(0,b.jsx)("div",{className:"flex items-center gap-2",children:Array.from({length:Math.min(5,J)},(a,c)=>{let d=c+1;return(0,b.jsx)(g.Button,{variant:C===d?"default":"outline",onClick:()=>D(d),disabled:G,children:d},d)})}),(0,b.jsx)(g.Button,{variant:"outline",onClick:()=>D(a=>Math.min(J,a+1)),disabled:C===J||G,children:"Sau"})]})]})}function p({product:a,showPrice:c,showCategory:d,showDescription:e,showAddToCart:i,variant:o}){let p=a.discountPercentage||0;return(0,b.jsxs)(f.Card,{className:"overflow-hidden hover:shadow-lg transition-shadow",children:[(0,b.jsx)(l.default,{href:`/products/${a.slug}`,children:(0,b.jsxs)("div",{className:"relative aspect-square overflow-hidden bg-gray-100",children:[a.thumbnail?(0,b.jsx)(k.default,{src:a.thumbnail,alt:a.name,fill:!0,className:"object-cover hover:scale-105 transition-transform"}):(0,b.jsx)("div",{className:"w-full h-full flex items-center justify-center text-gray-400",children:"No Image"}),(0,b.jsxs)("div",{className:"absolute top-2 left-2 flex flex-col gap-1",children:[a.isNewArrival&&(0,b.jsx)(h.Badge,{className:"bg-green-500",children:"Mới"}),a.isFeatured&&(0,b.jsx)(h.Badge,{className:"bg-blue-500",children:"Nổi bật"}),p>0&&(0,b.jsxs)(h.Badge,{className:"bg-red-500",children:["-",p,"%"]})]})]})}),(0,b.jsxs)(f.CardHeader,{className:"pb-3",children:[d&&a.category&&(0,b.jsx)(f.CardDescription,{className:"text-xs",children:a.category.name}),(0,b.jsx)(f.CardTitle,{className:"text-base line-clamp-2",children:(0,b.jsx)(l.default,{href:`/products/${a.slug}`,className:"hover:text-primary",children:a.name})}),e&&a.shortDesc&&(0,b.jsx)(f.CardDescription,{className:"text-sm line-clamp-2",children:a.shortDesc})]}),(0,b.jsxs)(f.CardFooter,{className:"flex justify-between items-center pt-0",children:[c&&(0,b.jsxs)("div",{className:"flex flex-col",children:[(0,b.jsx)("span",{className:"text-lg font-bold text-primary",children:(0,j.formatPrice)(a.price)}),a.originalPrice&&a.originalPrice>a.price&&(0,b.jsx)("span",{className:"text-sm text-gray-400 line-through",children:(0,j.formatPrice)(a.originalPrice)})]}),i&&(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)(g.Button,{size:"sm",variant:"outline",asChild:!0,children:(0,b.jsx)(l.default,{href:`/products/${a.slug}`,children:(0,b.jsx)(n.Eye,{className:"w-4 h-4"})})}),(0,b.jsxs)(g.Button,{size:"sm",children:[(0,b.jsx)(m.ShoppingCart,{className:"w-4 h-4 mr-1"}),"Mua"]})]})]})]})}function q(){return(0,b.jsxs)(f.Card,{className:"overflow-hidden",children:[(0,b.jsx)(i.Skeleton,{className:"aspect-square"}),(0,b.jsxs)(f.CardHeader,{children:[(0,b.jsx)(i.Skeleton,{className:"h-4 w-20"}),(0,b.jsx)(i.Skeleton,{className:"h-5 w-full"})]}),(0,b.jsxs)(f.CardFooter,{className:"flex justify-between",children:[(0,b.jsx)(i.Skeleton,{className:"h-6 w-24"}),(0,b.jsx)(i.Skeleton,{className:"h-9 w-20"})]})]})}a.s(["ProductListBlock",()=>o])}];

//# sourceMappingURL=_94f2db55._.js.map