module.exports=[394940,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`;a.s(["ADD_PRODUCT_IMAGE",0,r,"ADD_PRODUCT_VARIANT",0,t,"CREATE_PRODUCT",0,n,"DELETE_PRODUCT",0,p,"DELETE_PRODUCT_IMAGE",0,s,"DELETE_PRODUCT_VARIANT",0,v,"GET_FEATURED_PRODUCTS",0,l,"GET_PRODUCT",0,i,"GET_PRODUCTS",0,h,"GET_PRODUCTS_BY_CATEGORY",0,k,"GET_PRODUCT_BY_SLUG",0,j,"PRODUCT_FULL_FRAGMENT",0,g,"SEARCH_PRODUCTS",0,m,"UPDATE_PRODUCT",0,o,"UPDATE_PRODUCT_STOCK",0,q,"UPDATE_PRODUCT_VARIANT",0,u])},281336,a=>{"use strict";var b=a.i(168918),c=a.i(8912);a.i(651332);var d=a.i(772213),e=a.i(394940);let f=d.gql`
  ${e.CATEGORY_WITH_COUNT_FRAGMENT}
  query GetCategories($input: GetCategoriesInput) {
    categories(input: $input) {
      items {
        ...CategoryWithCountFields
        parent {
          id
          name
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`,g=d.gql`
  ${e.CATEGORY_TREE_FRAGMENT}
  query GetCategoryTree {
    categoryTree {
      ...CategoryTreeFields
      children {
        ...CategoryTreeFields
        children {
          ...CategoryWithCountFields
        }
      }
    }
  }
`;d.gql`
  ${e.CATEGORY_TREE_FRAGMENT}
  query GetCategory($id: String!) {
    category(id: $id) {
      ...CategoryTreeFields
    }
  }
`,d.gql`
  ${e.CATEGORY_TREE_FRAGMENT}
  query GetCategoryBySlug($slug: String!) {
    categoryBySlug(slug: $slug) {
      ...CategoryTreeFields
    }
  }
`;let h=d.gql`
  ${e.CATEGORY_WITH_COUNT_FRAGMENT}
  query GetActiveCategories {
    categories(input: { 
      filters: { isActive: true }
      sortBy: "displayOrder"
      sortOrder: "asc"
    }) {
      items {
        ...CategoryWithCountFields
      }
      total
    }
  }
`,i=d.gql`
  ${e.CATEGORY_TREE_FRAGMENT}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryTreeFields
    }
  }
`,j=d.gql`
  ${e.CATEGORY_TREE_FRAGMENT}
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryTreeFields
    }
  }
`,k=d.gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;function l(){let{data:a,loading:c,error:d,refetch:e}=(0,b.useQuery)(g);return{categoryTree:a?.categoryTree||[],loading:c,error:d,refetch:e}}function m(){let{data:a,loading:c,error:d,refetch:e}=(0,b.useQuery)(h);return{categories:a?.categories.items||[],total:a?.categories.total||0,loading:c,error:d,refetch:e}}function n(){let[a,{data:b,loading:d,error:e}]=(0,c.useMutation)(i,{refetchQueries:[{query:f},{query:g}]});return{createCategory:b=>a({variables:{input:b}}),category:b?.createCategory,loading:d,error:e}}function o(){let[a,{data:b,loading:d,error:e}]=(0,c.useMutation)(j,{refetchQueries:[{query:g}]});return{updateCategory:(b,c)=>a({variables:{id:b,input:c}}),category:b?.updateCategory,loading:d,error:e}}function p(){let[a,{data:b,loading:d,error:e}]=(0,c.useMutation)(k,{refetchQueries:[{query:f},{query:g}]});return{deleteCategory:b=>a({variables:{id:b}}),success:b?.deleteCategory,loading:d,error:e}}a.s(["useActiveCategories",()=>m,"useCategoryTree",()=>l,"useCreateCategory",()=>n,"useDeleteCategory",()=>p,"useUpdateCategory",()=>o],281336)},910788,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(848502);function e(a){let{data:c,loading:e,error:f,refetch:g}=(0,b.useQuery)(d.GET_PRODUCTS,{variables:{input:a}});return{products:c?.products.items||[],pagination:{total:c?.products.total||0,page:c?.products.page||1,limit:c?.products.limit||10,totalPages:c?.products.totalPages||0},loading:e,error:f,refetch:g}}function f(a){let{data:c,loading:e,error:f,refetch:g}=(0,b.useQuery)(d.GET_PRODUCT,{variables:{id:a},skip:!a});return{product:c?.product,loading:e,error:f,refetch:g}}function g(){let[a,{data:b,loading:e,error:f}]=(0,c.useMutation)(d.CREATE_PRODUCT,{refetchQueries:[{query:d.GET_PRODUCTS}]});return{createProduct:b=>a({variables:{input:b}}),product:b?.createProduct,loading:e,error:f}}function h(){let[a,{data:b,loading:e,error:f}]=(0,c.useMutation)(d.UPDATE_PRODUCT);return{updateProduct:b=>a({variables:{input:b}}),product:b?.updateProduct,loading:e,error:f}}function i(){let[a,{data:b,loading:e,error:f}]=(0,c.useMutation)(d.DELETE_PRODUCT,{refetchQueries:[{query:d.GET_PRODUCTS}]});return{deleteProduct:b=>a({variables:{id:b}}),success:b?.deleteProduct,loading:e,error:f}}a.i(651332),a.s(["useCreateProduct",()=>g,"useDeleteProduct",()=>i,"useProduct",()=>f,"useProducts",()=>e,"useUpdateProduct",()=>h])}];

//# sourceMappingURL=frontend_src_fff7888f._.js.map