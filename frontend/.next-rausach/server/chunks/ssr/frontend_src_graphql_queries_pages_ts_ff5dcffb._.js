module.exports=[640728,388104,626131,927052,a=>{"use strict";var b=a.i(772213);let c=b.gql`
  fragment PageFields on Page {
    id
    title
    slug
    content
    status
    isHomepage
    isDynamic
    dynamicConfig
    seoTitle
    seoDescription
    seoKeywords
    createdAt
    updatedAt
  }
`,d=b.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
`,e=b.gql`
  ${c}
  query GetPages($pagination: PaginationInput, $filters: PageFiltersInput) {
    getPages(pagination: $pagination, filters: $filters) {
      items {
        ...PageFields
        blocks {
          id
          type
          order
        }
      }
      pagination {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
      }
    }
  }
`,f=b.gql`
  ${c}
  ${d}
  query GetPageById($id: String!) {
    getPageById(id: $id) {
      ...PageFields
      blocks {
        ...PageBlockFields
      }
    }
  }
`,g=b.gql`
  ${c}
  ${d}
  query GetPageBySlug($slug: String!) {
    getPageBySlug(slug: $slug) {
      ...PageFields
      blocks {
        ...PageBlockFields
      }
    }
  }
`,h=b.gql`
  ${c}
  ${d}
  query GetHomepage {
    getHomepage {
      ...PageFields
      isHomepage
      blocks {
        ...PageBlockFields
      }
    }
  }
`,i=b.gql`
  ${c}
  mutation CreatePage($input: CreatePageInput!) {
    createPage(input: $input) {
      ...PageFields
    }
  }
`,j=b.gql`
  ${c}
  mutation UpdatePage($id: String!, $input: UpdatePageInput!) {
    updatePage(id: $id, input: $input) {
      ...PageFields
    }
  }
`,k=b.gql`
  ${c}
  mutation DeletePage($id: String!) {
    deletePage(id: $id) {
      ...PageFields
    }
  }
`,l=b.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
  mutation AddPageBlock($pageId: String!, $input: CreatePageBlockInput!) {
    addPageBlock(pageId: $pageId, input: $input) {
      ...PageBlockFields
    }
  }
`,m=b.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
  mutation UpdatePageBlock($id: String!, $input: UpdatePageBlockInput!) {
    updatePageBlock(id: $id, input: $input) {
      ...PageBlockFields
    }
  }
`,n=b.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
  mutation DeletePageBlock($id: String!) {
    deletePageBlock(id: $id) {
      ...PageBlockFields
    }
  }
`,o=b.gql`
  fragment PageBlockFields on PageBlock {
    id
    type
    content
    style
    config
    order
    parentId
    depth
    isVisible
    children {
      id
      type
      content
      style
      config
      order
      parentId
      depth
      isVisible
      children {
        id
        type
        content
        style
        config
        order
        parentId
        depth
        isVisible
        children {
          id
          type
          content
          style
          config
          order
          parentId
          depth
          isVisible
        }
      }
    }
  }
  mutation UpdatePageBlocksOrder($pageId: String!, $updates: [BulkUpdateBlockOrderInput!]!) {
    updatePageBlocksOrder(pageId: $pageId, updates: $updates) {
      ...PageBlockFields
    }
  }
`;a.s(["ADD_PAGE_BLOCK",0,l,"CREATE_PAGE",0,i,"DELETE_PAGE",0,k,"DELETE_PAGE_BLOCK",0,n,"GET_HOMEPAGE",0,h,"GET_PAGES",0,e,"GET_PAGE_BY_ID",0,f,"GET_PAGE_BY_SLUG",0,g,"UPDATE_PAGE",0,j,"UPDATE_PAGE_BLOCK",0,m,"UPDATE_PAGE_BLOCKS_ORDER",0,o],640728);var p=a.i(321248),q=a.i(651332),r=a.i(803212),s=a.i(8912),t=a.i(168918),u=a.i(189101);let v=a=>{let{data:b,loading:c,error:d,refetch:e}=(0,t.useQuery)(f,{variables:{id:a},skip:!a,errorPolicy:"all"});return{page:b?.getPageById,loading:c,error:d,refetch:e}},w=a=>{let[b]=(0,s.useMutation)(l),[c]=(0,s.useMutation)(m),[d]=(0,s.useMutation)(n),[e]=(0,s.useMutation)(o);return{addBlock:async c=>{try{let{data:d}=await b({variables:{pageId:a,input:c},refetchQueries:[{query:f,variables:{id:a}}]});return u.toast.success("Block added successfully!"),d?.addPageBlock}catch(a){throw u.toast.error(a.message||"Failed to add block"),a}},updateBlock:async(b,d)=>{try{let{data:e}=await c({variables:{id:b,input:d},refetchQueries:[{query:f,variables:{id:a}}]});return void 0!==d.content&&u.toast.success("Block updated successfully!"),e?.updatePageBlock}catch(a){throw u.toast.error(a.message||"Failed to update block"),a}},deleteBlock:async b=>{try{await d({variables:{id:b},refetchQueries:[{query:f,variables:{id:a}}]}),u.toast.success("Block deleted successfully!")}catch(a){throw u.toast.error(a.message||"Failed to delete block"),a}},updateBlocksOrder:async b=>{try{await e({variables:{pageId:a,updates:b},refetchQueries:[{query:f,variables:{id:a}}]})}catch(a){throw u.toast.error(a.message||"Failed to reorder blocks"),a}}}};a.s(["useBlockOperations",0,w,"useNestedBlockOperations",0,a=>{let{addBlock:b,updateBlock:c,deleteBlock:d}=w(a),{page:e,refetch:f}=v(a),g=()=>{var a;let b,c;return e?.blocks?(a=e.blocks,b=[],c=a=>{b.push(a),a.children&&a.children.length>0&&a.children.forEach(a=>c(a))},a.forEach(c),b):[]},h=async(a,c,d={},e={})=>{let h=g(),i=h.find(b=>b.id===a);if(!i)throw Error("Parent block not found");if(!l(i.type))throw u.toast.error("This block type cannot contain child blocks"),Error("Parent block is not a container");let j=i.depth||0;if(j>=4)throw u.toast.error("Maximum nesting depth (5 levels) reached"),Error("Maximum depth of 5 exceeded");if(h.filter(b=>b.parentId===a).length>=20)throw u.toast.error("Maximum 20 blocks per container"),Error("Maximum children limit (20) exceeded");if(h.length>=100)throw u.toast.error("Maximum 100 blocks per page"),Error("Maximum blocks limit (100) exceeded");try{let g=await b({type:c,content:d||{},style:e||{},parentId:a,depth:j+1,isVisible:!0});return await f(),g}catch(a){throw a}},i=async(a,b,d)=>{let e=g(),h=e.find(b=>b.id===a);if(!h)throw Error("Block not found");let i=0;if(b){let c=e.find(a=>a.id===b);if(!c)throw Error("New parent block not found");if(!l(c.type))throw u.toast.error("Target block cannot contain child blocks"),Error("New parent is not a container");if((i=(c.depth||0)+1)+k(a).reduce((a,b)=>Math.max(a,(b.depth||0)-(h.depth||0)),0)>=5)throw u.toast.error("Moving this block would exceed maximum depth (5 levels)"),Error("Move would exceed maximum depth");if(e.filter(c=>c.parentId===b&&c.id!==a).length>=20)throw u.toast.error("Target container has reached maximum 20 blocks"),Error("Target container is full")}let j=d;void 0===j&&(j=e.filter(c=>c.parentId===b&&c.id!==a).length);let m={parentId:b,depth:i,order:j};try{await c(a,m);let b=k(a),d=i-(h.depth||0);if(0!==d&&b.length>0)for(let a of b)await c(a.id,{depth:(a.depth||0)+d});await f()}catch(a){throw a}},j=a=>g().filter(b=>b.parentId===a).sort((a,b)=>a.order-b.order),k=a=>{let b=[],c=g(),d=a=>{for(let e of c.filter(b=>b.parentId===a))b.push(e),d(e.id)};return d(a),b},l=a=>["CONTAINER","SECTION","GRID","FLEX_ROW","FLEX_COLUMN"].includes(a),m=async a=>{let c=g(),d=c.find(b=>b.id===a);if(!d)throw Error("Block not found");let e=c.filter(a=>a.parentId===d.parentId).length,h={type:d.type,content:JSON.parse(JSON.stringify(d.content)),style:JSON.parse(JSON.stringify(d.style||{})),parentId:d.parentId,depth:d.depth||0,order:e,isVisible:d.isVisible,config:d.config?JSON.parse(JSON.stringify(d.config)):void 0};try{let c=await b(h),d=j(a);if(d.length>0&&c?.id)for(let a of d)await n(a,c.id);return await f(),c}catch(a){throw a}},n=async(a,c)=>{let d=g(),e=d.find(a=>a.id===c),f=d.filter(a=>a.parentId===c),h={type:a.type,content:JSON.parse(JSON.stringify(a.content)),style:JSON.parse(JSON.stringify(a.style||{})),parentId:c,depth:(e?.depth||0)+1,order:f.length,isVisible:a.isVisible,config:a.config?JSON.parse(JSON.stringify(a.config)):void 0},i=await b(h),k=j(a.id);if(k.length>0&&i?.id)for(let a of k)await n(a,i.id);return i};return{addBlock:b,updateBlock:c,deleteBlock:d,addChildBlock:h,moveBlockToContainer:i,duplicateBlock:m,getAllBlocks:g,getBlockTree:()=>{var a;let b,c,d;return e?.blocks?(a=e.blocks,b=new Map,c=[],a.forEach(a=>{b.set(a.id,{...a,children:[]})}),a.forEach(a=>{let d=b.get(a.id);if(a.parentId){let c=b.get(a.parentId);c&&c.children.push(d)}else c.push(d)}),d=a=>{a.children&&a.children.length>0&&(a.children.sort((a,b)=>a.order-b.order),a.children.forEach(a=>d(a)))},c.forEach(d),c.sort((a,b)=>a.order-b.order),c):[]},getBlockChildren:j,getBlockParent:a=>{let b=g(),c=b.find(b=>b.id===a);return c?.parentId&&b.find(a=>a.id===c.parentId)||null},getBlockAncestors:a=>{let b=[],c=g().find(b=>b.id===a);for(;c?.parentId;){let a=g().find(a=>a.id===c.parentId);if(a)b.push(a),c=a;else break}return b},getBlockDescendants:k,isContainerBlock:l,page:e,refetch:f}},"usePage",0,v,"usePageOperations",0,()=>{let[a]=(0,s.useMutation)(i),[b]=(0,s.useMutation)(j),[c]=(0,s.useMutation)(k);return{createPage:async b=>{try{console.log("Creating new page:",b);let{data:c}=await a({variables:{input:b},refetchQueries:[e]});return u.toast.success("Page created successfully!"),c?.createPage}catch(a){throw u.toast.error(a.message||"Failed to create page"),a}},updatePage:async(a,c)=>{try{let{data:d}=await b({variables:{id:a,input:c},refetchQueries:[e]});return u.toast.success("Page updated successfully!"),d?.updatePage}catch(a){throw u.toast.error(a.message||"Failed to update page"),a}},deletePage:async a=>{try{await c({variables:{id:a},refetchQueries:[e]}),u.toast.success("Page deleted successfully!")}catch(a){throw u.toast.error(a.message||"Failed to delete page"),a}}}},"usePages",0,(a,b,c)=>{let{data:d,loading:f,error:g,refetch:h}=(0,t.useQuery)(e,{variables:{pagination:a,filters:b},errorPolicy:"all",skip:c?.skip||!1});return{pages:d?.getPages,loading:f,error:g,refetch:h}}],388104);let x=(0,q.createContext)(void 0);function y({children:a,pageId:b}){let c=!b,[d,e]=(0,q.useState)(c),[f,g]=(0,q.useState)(c?{id:"",title:"Untitled Page",slug:"untitled-page",content:{},status:r.PageStatus.DRAFT,blocks:[],seoTitle:"",seoDescription:"",seoKeywords:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}:null),[h,i]=(0,q.useState)([]),[j,k]=(0,q.useState)(null),[l,m]=(0,q.useState)(null),{page:n,loading:o,refetch:s}=v(b||""),t=(0,q.useCallback)(a=>{g(a)},[]),u=(0,q.useCallback)(a=>{i(a)},[]),w=(0,q.useCallback)(a=>{k(a)},[]),y=(0,q.useCallback)(a=>{m(a)},[]);(0,q.useEffect)(()=>{b?(e(!1),s()):e(!0)},[b,s]),(0,q.useEffect)(()=>{n&&!d&&g(n)},[n,d]),(0,q.useEffect)(()=>{n?.blocks&&i(n.blocks)},[n?.blocks]);let z=(0,q.useMemo)(()=>{if(!j)return null;let a=b=>{for(let c of b){if(c.id===j)return c;if(c.children){let b=a(c.children);if(b)return b}}return null};return a(h)},[j,h]);return(0,p.jsx)(x.Provider,{value:{page:n||null,editingPage:f,isNewPageMode:d,loading:o,blocks:h,selectedBlockId:j,selectedBlock:z,draggedBlock:l,setEditingPage:t,setBlocks:u,setSelectedBlockId:w,setDraggedBlock:y,refetch:s},children:a})}function z(){let a=(0,q.useContext)(x);return void 0===a?{page:null,editingPage:null,isNewPageMode:!0,loading:!1,blocks:[],selectedBlockId:null,selectedBlock:null,draggedBlock:null,setEditingPage:()=>{},setBlocks:()=>{},setSelectedBlockId:()=>{},setDraggedBlock:()=>{},refetch:async()=>{}}:a}a.s(["PageStateContext",()=>x,"PageStateProvider",()=>y,"usePageState",()=>z],626131);var A=q,B=a.i(327987);class C extends A.Component{constructor(a){super(a),this.state={hasError:!1,error:null}}static getDerivedStateFromError(a){return{hasError:!0,error:a}}componentDidCatch(a,b){this.props.onError&&this.props.onError(a,b)}handleReset=()=>{this.setState({hasError:!1,error:null})};render(){return this.state.hasError?(0,p.jsx)("div",{className:"p-3 bg-orange-50 border border-orange-200 rounded",children:(0,p.jsxs)("div",{className:"flex gap-2 items-start",children:[(0,p.jsx)(B.AlertCircle,{className:"h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5"}),(0,p.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,p.jsxs)("p",{className:"font-medium text-orange-900 text-sm",children:["Block Render Error",this.props.blockId&&` (${this.props.blockId})`]}),(0,p.jsx)("p",{className:"text-xs text-orange-800 mt-0.5",children:this.state.error?.message||"Failed to render this block"}),!1,(0,p.jsx)("button",{onClick:this.handleReset,className:"mt-2 text-xs px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors",children:"Retry"})]})]})}):this.props.children}}let D=(0,q.lazy)(()=>a.A(598212).then(a=>({default:a.TextBlock}))),E=(0,q.lazy)(()=>a.A(320145).then(a=>({default:a.default}))),F=(0,q.lazy)(()=>a.A(61826).then(a=>({default:a.ImageBlock}))),G=(0,q.lazy)(()=>a.A(548386).then(a=>({default:a.HeroBlock}))),H=(0,q.lazy)(()=>a.A(929417).then(a=>({default:a.ButtonBlock}))),I=(0,q.lazy)(()=>a.A(489180).then(a=>({default:a.DividerBlock}))),J=(0,q.lazy)(()=>a.A(824096).then(a=>({default:a.SpacerBlock}))),K=(0,q.lazy)(()=>a.A(440553).then(a=>({default:a.TeamBlock}))),L=(0,q.lazy)(()=>a.A(934766).then(a=>({default:a.StatsBlock}))),M=(0,q.lazy)(()=>a.A(819322).then(a=>({default:a.ContactInfoBlock}))),N=(0,q.lazy)(()=>a.A(316622).then(a=>({default:a.ContainerBlock}))),O=(0,q.lazy)(()=>a.A(908320).then(a=>({default:a.SectionBlock}))),P=(0,q.lazy)(()=>a.A(903641).then(a=>({default:a.GridBlock}))),Q=(0,q.lazy)(()=>a.A(800368).then(a=>({default:a.FlexBlock}))),R=(0,q.lazy)(()=>a.A(762023).then(a=>({default:a.DynamicBlock}))),S=(0,q.lazy)(()=>a.A(510099).then(a=>({default:a.CarouselBlock}))),T=(0,q.lazy)(()=>a.A(254102).then(a=>({default:a.ProductListBlock}))),U=(0,q.lazy)(()=>a.A(805291).then(a=>({default:a.ProductDetailBlock}))),V=(0,q.lazy)(()=>a.A(726503).then(a=>({default:a.ProductCarouselBlock}))),W=(0,q.lazy)(()=>a.A(390557).then(a=>({default:a.VideoBlock}))),X=(0,q.lazy)(()=>a.A(144366).then(a=>({default:a.SearchBlock}))),Y=(0,q.lazy)(()=>a.A(516141).then(a=>({default:a.BookmarkBlock}))),Z={[r.BlockType.TEXT]:D,[r.BlockType.RICH_TEXT]:E,[r.BlockType.IMAGE]:F,[r.BlockType.VIDEO]:W,[r.BlockType.CAROUSEL]:S,[r.BlockType.HERO]:G,[r.BlockType.BUTTON]:H,[r.BlockType.DIVIDER]:I,[r.BlockType.SPACER]:J,[r.BlockType.TEAM]:K,[r.BlockType.STATS]:L,[r.BlockType.CONTACT_INFO]:M,[r.BlockType.GALLERY]:F,[r.BlockType.CARD]:D,[r.BlockType.TESTIMONIAL]:D,[r.BlockType.FAQ]:D,[r.BlockType.CONTACT_FORM]:D,[r.BlockType.COMPLETED_TASKS]:D,[r.BlockType.SEARCH]:X,[r.BlockType.BOOKMARK]:Y,[r.BlockType.CONTAINER]:N,[r.BlockType.SECTION]:O,[r.BlockType.GRID]:P,[r.BlockType.FLEX_ROW]:Q,[r.BlockType.FLEX_COLUMN]:Q,[r.BlockType.COLUMN]:Q,[r.BlockType.ROW]:Q,[r.BlockType.DYNAMIC]:R,[r.BlockType.PRODUCT_LIST]:T,[r.BlockType.PRODUCT_DETAIL]:U,[r.BlockType.PRODUCT_CAROUSEL]:V},$=({height:a="200px"})=>(0,p.jsx)("div",{className:"animate-pulse bg-gray-200 rounded",style:{height:a}}),_=({blockType:a,blockId:b,props:c,skeletonHeight:d="200px"})=>{let e=a&&Z["string"==typeof a?a.toUpperCase():a]||null;return e?(0,p.jsx)(C,{blockId:b,children:(0,p.jsx)(q.Suspense,{fallback:(0,p.jsx)($,{height:d}),children:(0,p.jsx)(e,{...c})})}):(console.error(`[BlockLoader] Unknown block type: ${a} (type: ${typeof a}, blockId: ${b})`),(0,p.jsxs)("div",{className:"p-4 border border-red-300 bg-red-50 text-red-600 rounded",children:["Unknown block type: ",a]}))},aa=({block:a,isEditing:b=!0,onUpdate:c,onDelete:d,onAddChild:e,onUpdateChild:f,onDeleteChild:g,onSelect:h,depth:i=0})=>{let j,k=(0,q.useContext)(x),l=(k?.selectedBlockId??null)===a.id,m={block:a,isEditable:b,onUpdate:(a,b)=>c(a,b),onDelete:d},n=[r.BlockType.CONTAINER,r.BlockType.SECTION,r.BlockType.GRID,r.BlockType.FLEX_ROW,r.BlockType.FLEX_COLUMN].includes(a.type),o={...m,onAddChild:n?()=>{console.log(`[BlockRenderer ${a.id}] onAddChild wrapper called, isContainerBlock=${n}, onAddChild=${!!e}`),e?.(a.id)}:void 0,children:n?(()=>{if(a.children&&0!==a.children.length)return a.type===r.BlockType.GRID?[...a.children].sort((a,b)=>a.order-b.order).map(a=>(0,p.jsx)("div",{className:"grid-item",children:(0,p.jsx)(aa,{block:a,isEditing:b,onUpdate:(b,c)=>f?.(a.id,b,c),onDelete:()=>g?.(a.id),onAddChild:e,onUpdateChild:f,onDeleteChild:g,onSelect:h,depth:i+1})},a.id)):(0,p.jsxs)("div",{className:"nested-blocks-container border-l-4 border-blue-200 ml-4 pl-4 mt-2 space-y-2",children:[(0,p.jsxs)("div",{className:"text-xs text-blue-600 font-semibold mb-2 flex items-center gap-1",children:["📦 Nested Blocks (",a.children.length,")"]}),[...a.children].sort((a,b)=>a.order-b.order).map(a=>(0,p.jsx)("div",{className:"nested-block-item bg-blue-50/30 rounded-lg p-2 border border-blue-100",children:(0,p.jsx)(aa,{block:a,isEditing:b,onUpdate:(b,c)=>f?.(a.id,b,c),onDelete:()=>g?.(a.id),onAddChild:e,onUpdateChild:f,onDeleteChild:g,onSelect:h,depth:i+1})},a.id))]})})():void 0};n&&console.log(`[BlockRenderer] Rendering container block ${a.id}:`,{isContainerBlock:n,onAddChildDefined:!!o.onAddChild,blockType:a.type}),(0,q.useEffect)(()=>{},[a.id,n,a.children,e,f,g,i,a.type]);let s=(j=[r.BlockType.CONTAINER,r.BlockType.SECTION,r.BlockType.GRID,r.BlockType.FLEX_ROW,r.BlockType.FLEX_COLUMN].includes(a.type)?o:m,(0,p.jsx)(_,{blockType:a.type,blockId:a.id,props:j,skeletonHeight:"200px"}));return b&&h?(0,p.jsx)("div",{onClick:c=>{b&&h&&(c.stopPropagation(),h(a.id))},className:`
          w-full cursor-pointer transition-all 
          ${l?"ring-2 ring-blue-500 ring-opacity-100 shadow-lg":"hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50"}
        `,role:"button",tabIndex:0,onKeyDown:b=>{("Enter"===b.key||" "===b.key)&&(b.preventDefault(),h(a.id))},children:s}):s};a.s(["BlockRenderer",0,aa],927052)}];

//# sourceMappingURL=frontend_src_graphql_queries_pages_ts_ff5dcffb._.js.map