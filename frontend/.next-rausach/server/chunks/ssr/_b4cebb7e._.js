module.exports=[681768,a=>{"use strict";var b=a.i(872466);a.s(["Filter",()=>b.default])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},394940,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`;a.s(["CATEGORY_BASIC_FRAGMENT",0,c,"CATEGORY_TREE_FRAGMENT",0,e,"CATEGORY_WITH_COUNT_FRAGMENT",0,d,"COMMENT_FRAGMENT",0,j,"POST_FRAGMENT",0,i,"PRODUCT_IMAGE_FRAGMENT",0,f,"PRODUCT_VARIANT_FRAGMENT",0,g,"USER_FRAGMENT",0,h])},321279,a=>{"use strict";var b=a.i(682828);a.s(["Play",()=>b.default])},624461,a=>{"use strict";var b=a.i(168918),c=a.i(8912),d=a.i(772213),e=a.i(394940);class f{static generateCRUDQueries(a,b=[],c={}){let e=a.toLowerCase();a.charAt(0).toLowerCase(),a.slice(1);let f=a.startsWith("ext_"),g=(b.length>0?b:["id","createdAt","updatedAt"]).join("\n    ");Object.keys(c).length>0&&Object.entries(c).forEach(([a,b])=>{g+=`
    ${a} {
      ${b.join("\n      ")}
    }`});let h=f?"JSON":`${a}FilterInput`;return{[`GET_${a.toUpperCase()}S`]:f?d.gql`
          query Get${a}s($filters: ${h}) {
            get${a}s(filters: $filters)
          }
        `:d.gql`
          query Get${a}s($filters: ${h}) {
            get${a}s(filters: $filters) {
              ${g}
            }
          }
        `,[`GET_${a.toUpperCase()}S_PAGINATED`]:f?d.gql`
          query Get${a}sPaginated($filters: ${h}) {
            get${a}sPaginated(filters: $filters)
          }
        `:d.gql`
          query Get${a}sPaginated($filters: ${h}) {
            get${a}sPaginated(filters: $filters) {
              data {
                ${g}
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
        `,[`GET_${a.toUpperCase()}_BY_ID`]:f?d.gql`
          query Get${a}ById($id: ID!, $options: JSON) {
            get${a}ById(id: $id, options: $options)
          }
        `:d.gql`
          query Get${a}ById($id: ID!, $options: JSON) {
            get${a}ById(id: $id, options: $options) {
              ${g}
            }
          }
        `,[`CREATE_${a.toUpperCase()}`]:f?d.gql`
          mutation Create${a}($data: JSON!, $options: JSON) {
            create${a}(data: $data, options: $options)
          }
        `:d.gql`
          mutation Create${a}($data: JSON!, $options: JSON) {
            create${a}(data: $data, options: $options) {
              ${g}
            }
          }
        `,[`CREATE_${a.toUpperCase()}S_BULK`]:f?d.gql`
          mutation Create${a}sBulk($input: JSON!, $options: JSON) {
            create${a}sBulk(input: $input, options: $options)
          }
        `:d.gql`
          mutation Create${a}sBulk($input: JSON!, $options: JSON) {
            create${a}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${g}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPDATE_${a.toUpperCase()}`]:f?d.gql`
          mutation Update${a}($id: ID!, $data: JSON!, $options: JSON) {
            update${a}(id: $id, data: $data, options: $options)
          }
        `:d.gql`
          mutation Update${a}($id: ID!, $data: JSON!, $options: JSON) {
            update${a}(id: $id, data: $data, options: $options) {
              ${g}
            }
          }
        `,[`UPDATE_${a.toUpperCase()}S_BULK`]:f?d.gql`
          mutation Update${a}sBulk($input: JSON!, $options: JSON) {
            update${a}sBulk(input: $input, options: $options)
          }
        `:d.gql`
          mutation Update${a}sBulk($input: JSON!, $options: JSON) {
            update${a}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${g}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`DELETE_${a.toUpperCase()}`]:f?d.gql`
          mutation Delete${a}($id: ID!, $options: JSON) {
            delete${a}(id: $id, options: $options)
          }
        `:d.gql`
          mutation Delete${a}($id: ID!, $options: JSON) {
            delete${a}(id: $id, options: $options) {
              ${g}
            }
          }
        `,[`DELETE_${a.toUpperCase()}S_BULK`]:f?d.gql`
          mutation Delete${a}sBulk($input: JSON!, $options: JSON) {
            delete${a}sBulk(input: $input, options: $options)
          }
        `:d.gql`
          mutation Delete${a}sBulk($input: JSON!, $options: JSON) {
            delete${a}sBulk(input: $input, options: $options) {
              success
              count
              data {
                ${g}
              }
              errors {
                index
                error
                data
              }
            }
          }
        `,[`UPSERT_${a.toUpperCase()}`]:f?d.gql`
          mutation Upsert${a}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${a}(where: $where, create: $create, update: $update, options: $options)
          }
        `:d.gql`
          mutation Upsert${a}($where: JSON!, $create: JSON!, $update: JSON!, $options: JSON) {
            upsert${a}(where: $where, create: $create, update: $update, options: $options) {
              ${g}
            }
          }
        `,[`COUNT_${a.toUpperCase()}S`]:d.gql`
        query Count${a}s($where: JSON) {
          count${a}s(where: $where)
        }
      `,[`${a.toUpperCase()}_EXISTS`]:d.gql`
        query ${a}Exists($where: JSON!) {
          ${e}Exists(where: $where)
        }
      `}}static generateUniversalQueries(){return{DYNAMIC_FIND_MANY:d.gql`
        query DynamicFindMany($modelName: String!, $filter: JSON) {
          dynamicFindMany(modelName: $modelName, filter: $filter)
        }
      `,DYNAMIC_FIND_BY_ID:d.gql`
        query DynamicFindById($modelName: String!, $id: ID!, $options: JSON) {
          dynamicFindById(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE:d.gql`
        mutation DynamicCreate($modelName: String!, $data: JSON!, $options: JSON) {
          dynamicCreate(modelName: $modelName, data: $data, options: $options)
        }
      `,DYNAMIC_UPDATE:d.gql`
        mutation DynamicUpdate($modelName: String!, $id: ID!, $data: JSON!, $options: JSON) {
          dynamicUpdate(modelName: $modelName, id: $id, data: $data, options: $options)
        }
      `,DYNAMIC_DELETE:d.gql`
        mutation DynamicDelete($modelName: String!, $id: ID!, $options: JSON) {
          dynamicDelete(modelName: $modelName, id: $id, options: $options)
        }
      `,DYNAMIC_CREATE_BULK:d.gql`
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
      `,DYNAMIC_UPDATE_BULK:d.gql`
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
      `,DYNAMIC_DELETE_BULK:d.gql`
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
      `}}static generateQueriesWithFragments(a,b){let c=a.toUpperCase();return{[`GET_${c}S_WITH_FRAGMENT`]:d.gql`
        ${b}
        query Get${a}s($filter: JSON) {
          get${a}s(filter: $filter) {
            ...${a}Fragment
          }
        }
      `,[`CREATE_${c}_WITH_FRAGMENT`]:d.gql`
        ${b}
        mutation Create${a}($data: JSON!, $options: JSON) {
          create${a}(data: $data, options: $options) {
            ...${a}Fragment
          }
        }
      `,[`UPDATE_${c}_WITH_FRAGMENT`]:d.gql`
        ${b}
        mutation Update${a}($id: ID!, $data: JSON!, $options: JSON) {
          update${a}(id: $id, data: $data, options: $options) {
            ...${a}Fragment
          }
        }
      `}}}e.USER_FRAGMENT,e.POST_FRAGMENT,d.gql`
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
  `,e.COMMENT_FRAGMENT;let g=f.generateCRUDQueries("User",["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"]),h=f.generateCRUDQueries("Post",["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"]),i=f.generateCRUDQueries("Task",["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"]),j=f.generateCRUDQueries("Comment",["id","content","postId","userId","parentId","createdAt","updatedAt"]),k=f.generateUniversalQueries();Object.entries({User:["id","email","username","firstName","lastName","avatar","role","isActive","createdAt","updatedAt"],Post:["id","title","content","excerpt","slug","status","publishedAt","authorId","createdAt","updatedAt"],Task:["id","title","description","category","priority","status","dueDate","userId","createdAt","updatedAt"],Comment:["id","content","postId","userId","parentId","createdAt","updatedAt"],Tag:["id","name","slug","description","color","createdAt","updatedAt"],Media:["id","filename","fileUrl","fileSize","mimeType","uploadedById","createdAt"],TaskComment:["id","content","taskId","authorId","parentId","createdAt","updatedAt"],TaskShare:["id","taskId","userId","permission","shareToken","expiresAt","isActive","createdAt"],TaskMedia:["id","filename","url","type","size","mimeType","taskId","uploadedBy","createdAt"]}).reduce((a,[b,c])=>(a[b]=f.generateCRUDQueries(b,c),a),{});let{GET_USERS:l,GET_USERS_PAGINATED:m,GET_USER_BY_ID:n,CREATE_USER:o,CREATE_USERS_BULK:p,UPDATE_USER:q,UPDATE_USERS_BULK:r,DELETE_USER:s,DELETE_USERS_BULK:t,UPSERT_USER:u,COUNT_USERS:v,USER_EXISTS:w}=g,{GET_POSTS:x,GET_POSTS_PAGINATED:y,GET_POST_BY_ID:z,CREATE_POST:A,CREATE_POSTS_BULK:B,UPDATE_POST:C,UPDATE_POSTS_BULK:D,DELETE_POST:E,DELETE_POSTS_BULK:F,UPSERT_POST:G,COUNT_POSTS:H,POST_EXISTS:I}=h,{GET_TASKS:J,GET_TASKS_PAGINATED:K,GET_TASK_BY_ID:L,CREATE_TASK:M,CREATE_TASKS_BULK:N,UPDATE_TASK:O,UPDATE_TASKS_BULK:P,DELETE_TASK:Q,DELETE_TASKS_BULK:R,UPSERT_TASK:S,COUNT_TASKS:T,TASK_EXISTS:U}=i,{GET_COMMENTS:V,GET_COMMENTS_PAGINATED:W,GET_COMMENT_BY_ID:X,CREATE_COMMENT:Y,CREATE_COMMENTS_BULK:Z,UPDATE_COMMENT:$,UPDATE_COMMENTS_BULK:_,DELETE_COMMENT:aa,DELETE_COMMENTS_BULK:ab,UPSERT_COMMENT:ac,COUNT_COMMENTS:ad,COMMENT_EXISTS:ae}=j,{DYNAMIC_FIND_MANY:af,DYNAMIC_FIND_BY_ID:ag,DYNAMIC_CREATE:ah,DYNAMIC_UPDATE:ai,DYNAMIC_DELETE:aj,DYNAMIC_CREATE_BULK:ak,DYNAMIC_UPDATE_BULK:al,DYNAMIC_DELETE_BULK:am}=k;var an=a.i(651332);function ao(a,c,d={}){let{fields:e,nestedFields:g,...h}=d,i=(0,an.useMemo)(()=>{let b=f.generateCRUDQueries(c,e);switch(a){case"GET_ALL":return b[`GET_${c.toUpperCase()}S`];case"GET_PAGINATED":return b[`GET_${c.toUpperCase()}S_PAGINATED`];case"GET_BY_ID":return b[`GET_${c.toUpperCase()}_BY_ID`];default:throw Error(`Unsupported operation type: ${a}`)}},[a,c,e,g]);return(0,b.useQuery)(i,h)}function ap(a,b,d={}){let{fields:e,nestedFields:g,...h}=d,i=(0,an.useMemo)(()=>{let c=f.generateCRUDQueries(b,e);switch(a){case"CREATE":return c[`CREATE_${b.toUpperCase()}`];case"CREATE_BULK":return c[`CREATE_${b.toUpperCase()}S_BULK`];case"UPDATE":return c[`UPDATE_${b.toUpperCase()}`];case"UPDATE_BULK":return c[`UPDATE_${b.toUpperCase()}S_BULK`];case"DELETE":return c[`DELETE_${b.toUpperCase()}`];case"DELETE_BULK":return c[`DELETE_${b.toUpperCase()}S_BULK`];default:throw Error(`Unsupported operation type: ${a}`)}},[a,b,e,g]);return(0,c.useMutation)(i,h)}function aq(a){let b=function(a,b={}){return ao("GET_ALL",a,b)}(a),c=function(a,b={}){return ao("GET_PAGINATED",a,b)}(a),[d]=function(a,b={}){return ap("CREATE",a,b)}(a),[e]=function(a,b={}){return ap("CREATE_BULK",a,b)}(a),[f]=function(a,b={}){return ap("UPDATE",a,b)}(a),[g]=function(a,b={}){return ap("UPDATE_BULK",a,b)}(a),[h]=function(a,b={}){return ap("DELETE",a,b)}(a),[i]=function(a,b={}){return ap("DELETE_BULK",a,b)}(a);return{getAll:b,getPaginated:c,getById:(0,an.useCallback)(b=>(function(a,b={}){return ao("GET_BY_ID",a,b)})(a,{variables:{id:b}}),[a]),create:d,createBulk:e,update:f,updateBulk:g,delete:h,deleteBulk:i}}function ar(a){return a&&a.graphQLErrors&&void 0!==a.networkError}function as(a){return a.graphQLErrors.length>0?a.graphQLErrors.map(a=>a.message).join(", "):a.networkError?`Network error: ${a.networkError.message}`:a.message||"Unknown GraphQL error"}a.s(["formatDynamicGraphQLError",()=>as,"isDynamicGraphQLError",()=>ar,"useCRUD",()=>aq,"useDynamicMutation",()=>ap,"useDynamicQuery",()=>ao],624461)}];

//# sourceMappingURL=_b4cebb7e._.js.map