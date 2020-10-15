if (!window._usfSettingGlobal)
    window._usfSettingGlobal = {
        show_vendor: false,
        show_secondary_image: false,
        show_discount: true,
        discount_mode: "saving",
        product_image_size: "square",
        show_color_swatch: false,
        show_inventory_quantity: false,
        low_inventory_threshold: 0,
    };
if (!window._usfSectionSettings)
    window._usfSectionSettings = {
        products_per_row: 3,
        show_quick_view: 'list_grid',
        show_quick_buy: 'list_grid',
    }


window._usfSectionSettings['show_quick_view'] =''
window._usfSectionSettings['show_quick_buy'] =''
window._usfSectionSettings['products_per_row'] =3

var usfHasPreview = usf.settings.enabledPlugins.includes('preview-usf');

var usfGridHasQuickView;
var usfListHasQuickView;

var usfGridHasQuickBuy;
var usfListHasQuickBuy;

var lowInventory;

var _usfImageWidths = [200, 300, 400, 500, 600, 700, 800]

var __usf_getExtendClass = function() {
    var _usf_product_image_size = _usfSettingGlobal.product_image_size;
    if (_usf_product_image_size != 'natural')
        return `aspect-ratio--${_usf_product_image_size}`
    return '';
}

// define templates for the Warehouse theme
var _usfFilterBodyTemplate = /*inc_begin_filter-body*/
`<!-- Range filter -->
<div v-if="isRange" class="usf-facet-values usf-facet-range">
    <!-- Range inputs -->
    <div class="usf-slider-inputs usf-clear">
        <input :readonly="!hasRangeInputs" :value="rangeConverter(range[0]).toFixed(rangeDecimals)" @change="e => onRangeInput(e, range[0], 0)">
        <span>-</span>
        <input :readonly="!hasRangeInputs" :value="rangeConverter(range[1]).toFixed(rangeDecimals)" @change="e => onRangeInput(e, range[1], 1)">
    </div>

    <usf-slider :min="facet.min" :max="facet.max" :pips="facet.range[0]" :step="facet.range[1]" :decimals="rangeDecimals" :value="range" :converter="rangeConverter" @input="onRangeSliderInput" @change="onRangeSliderChange"></usf-slider>
</div>
<!-- List + Swatch filter -->
<div v-else ref="values" :class="'usf-facet-values usf-facet-values--' + facet.display + (facet.navigationCollections ? ' usf-navigation' : '') + (facet.valuesTransformation ? (' usf-' + facet.valuesTransformation.toLowerCase()) : '') + (facet.circleSwatch ? ' usf-facet-values--circle' : '')" :style="!usf.isMobile && !usf.settings.filters.horz && facet.maxHeight ? { maxHeight: facet.maxHeight } : null">
    <!-- Filter options -->                
    <usf-filter-option v-for="o in visibleOptions" :facet="facet" :option="o" :key="o.label"></usf-filter-option>
</div>

<!-- More -->
<div v-if="isMoreVisible" class="usf-more" @click="onShowMore" v-html="loc.more"></div>`
/*inc_end_filter-body*/;

var _usfSearchResultsSkeletonItemTpl = `
<div v-if="view === 'grid'" :class="'usf-sr-product product-item product-item--vertical 1/3--tablet 1/' + _usfSectionSettings.products_per_row + '--lap-and-up usf-skeleton'">
    <div class="grid-view-item" v-if="true">
        <div class="usf-img"></div>
        <div class="usf-meta">            
        </div>
    </div>
</div>
<a class="usf-sr-product list-view-item usf-skeleton product-item product-item--list" v-else>
    <!-- Image column -->
    <div class="list-view-item__image-column" v-if="true">
        <div class="list-view-item__image-wrapper" v-if="true">
            <div class="usf-img"></div>
        </div>
    </div>

    <!-- Title and Vendor column -->
    <div class="list-view-item__title-column" v-if="true">
        <div class="list-view-item__title"></div>
        <div class="list-view-item__vendor medium-up--hide"></div>
    </div>

    <!-- Vendor, for mobile -->
    <div class="list-view-item__vendor-column small--hide" v-if="true">
        <div class="list-view-item__vendor"></div>
    </div>

    <!-- Prices -->
    <div class="list-view-item__price-column" v-if="true">
        <div class="usf-price product-price__price"></div>
    </div>
</a>
`;

var _usfSearchResultsSummaryTpl = `<span class="usf-sr-summary" v-html="loader === true ? '&nbsp;' : usf.utils.format(term ? loc.productSearchResultWithTermSummary : loc.productSearchResultSummary, result.total, term)"></span>`;

var _usfSearchResultsViewsTpl = `<div class="collection__toolbar-item collection__toolbar-item--layout" style="margin-left:10px;">
                      <!--<span class="collection__layout-label">View</span>-->
    <button type="button" class="collection__layout-button link touch-area" :class="{'is-selected': view === 'grid'}" @click="onGridViewClick" aria-label="Display products as grid" data-action="change-layout" data-layout-mode="grid"><svg class="icon icon--grid" viewBox="0 0 18 18" role="presentation">
      <path d="M1 .030067h2c.55228475 0 1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1H1c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .44771525 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1zm7-14h2c.5522847 0 1 .44771525 1 1v2c0 .55228475-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.5522847 0 1 .44771525 1 1v2c0 .5522847-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.5522847 0 1 .4477153 1 1v2c0 .5522847-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1zm7-14h2c.5522847 0 1 .44771525 1 1v2c0 .55228475-.4477153 1-1 1h-2c-.5522847 0-1-.44771525-1-1v-2c0-.55228475.4477153-1 1-1zm0 7h2c.5522847 0 1 .44771525 1 1v2c0 .5522847-.4477153 1-1 1h-2c-.5522847 0-1-.4477153-1-1v-2c0-.55228475.4477153-1 1-1zm0 7h2c.5522847 0 1 .4477153 1 1v2c0 .5522847-.4477153 1-1 1h-2c-.5522847 0-1-.4477153-1-1v-2c0-.5522847.4477153-1 1-1z" fill="currentColor" fill-rule="evenodd"></path>
    </svg></button>
     <button type="button" class="collection__layout-button  link touch-area" :class="{'is-selected': view === 'list'}" @click="onListViewClick" aria-label="Display products as list" data-action="change-layout" data-layout-mode="list"><svg class="icon icon--list" viewBox="0 0 18 18" role="presentation">
      <path d="M8 1.030067h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1zm-7-15h2c.55228475 0 1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1H1c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .44771525 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1z" fill="currentColor" fill-rule="evenodd"></path>
    </svg></button>
</div>`;
var _usfSearchResultsSortByTpl = `<usf-dropdownv2 :value="sortBy" :options="sortByOptions" @input="onSortByChanged"></usf-dropdownv2>`;

usf.templates = {
    app: `
<div id="usf_container" class="layout usf-zone usf-clear" :class="{'usf-filters-horz': usf.settings.filters.horz}">
    <div class="layout__section layout__section--secondary hidden-pocket">
        <div class="card">
            <div class="card__section card__section--tight">
                <p class="card__title--small heading" v-html="usf.settings.translation.filters"></p>
                <block-filter-v1></block-filter-v1>
            </div>
        </div>
    </div>
    <div class="layout__section">
        <div class="collection">
            <div v-if="collection && collection.imageUrl" class="collection__image-wrapper collection__image-wrapper--medium" :style="'background-image:url(&quot;' + _usfWSToColImageBg(collection.imageUrl) + '&quot;)'">
                <div class="collection__image image--fade-in lazyloaded" :data-bgset="_usfGetImageUrls(collection.imageUrl)" :style="'background-image: url(&quot;' + collection.imageUrl + '&quot;)'">
                    <picture style="display: none;">
                        <source :data-srcset="_usfGetImageUrls(collection.imageUrl)" sizes="951px" :srcset="_usfGetImageUrls(collection.imageUrl)">
                        <img alt="" class="lazyautosizes lazyloaded" data-sizes="auto" data-parent-fit="cover" sizes="951px">
                    </picture>
                </div>
            </div>
        
            <div class="card">
                <header v-if="collection" class="card__header card__header--tight">
                    <div class="collection__header ">
                        <div class="collection__header-inner">
                            <div class="collection__meta"><div class="collection__meta-inner">
                                <h1 class="collection__title heading h1" v-html="collection.title"></h1>
                            </div>
                        </div>
                    </div>

                    <div v-if="collection && collection.description" class="collection__description " aria-expanded="false">
                        <div class="rte" v-html="collection.description"></div>
                    </div>
                </header>
                <div class="collection__dynamic-part">
                    <usf-sr></usf-sr>   
                </div>
            </div>
        </div>
    </div>
</div>
`,
    
    searchResults: `
<div class="usf-sr-container" :class="{'usf-no-facets': noFacets, 'usf-empty': !loader && !hasResults, 'usf-nosearch': !showSearchBox}">    
    {{usf_empty(noFacets)}}
    <!-- Search form -->
    <form v-if="showSearchBox" action="/search" method="get" role="search" class="usf-sr-inputbox">
        <input name="q" autocomplete="off" ref="searchInput" v-model="termModel">
        <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><circle class="usf-path" cx="10.981" cy="10.982" r="9.786"></circle> <line class="usf-path" x1="23.804" y1="23.804" x2="17.902" y2="17.901"></line></svg>
        </button>
        <span v-if="termModel" class="usf-remove" @click="clearSearch"></span>
    </form>

    <div class="usf-sr-config" v-if="usf.isMobile">
        <div class="usf-sr-config__mobile-filters-wrapper">
            ` + _usfSearchResultsSortByTpl + `
            <div class="usf-filters" :class="{'usf-has-filters': !!facetFilters}" @click="document.body.classList.toggle('usf-mobile-filters')">
                <span class="usf-icon"><svg width="17" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 16"><g fill="currentColor" fill-rule="evenodd"><rect x="2" width="1" height="5" rx=".5"></rect><rect x="8" width="1" height="9" rx=".5"></rect><rect x="14" width="1" height="3" rx=".5"></rect><rect x="2" y="8" width="1" height="8" rx=".5"></rect><rect x="8" y="12" width="1" height="4" rx=".5"></rect><rect x="14" y="6" width="1" height="10" rx=".5"></rect><path d="M2.5 8.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6-5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill-rule="nonzero"></path></g></svg></span>
                <span v-html="loc.filters"></span>
            </div>
        </div>
    </div>

    <div class="usf-sr-config" v-else>
        ` + _usfSearchResultsSummaryTpl + _usfSearchResultsSortByTpl + _usfSearchResultsViewsTpl + `
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && !result.extra.banner.isBottom" :banner="result.extra.banner"></usf-sr-banner>

    <div :class="'product-list product-list--collection'">
            <template v-if="loader===true">` + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl +
    `</template>
            <template v-else>
                <template v-if="loader === true || hasResults">
                    <template v-if="view === 'grid'">
                        <template v-for="p in result.items"><usf-sr-griditem :product="p" :result="result"></usf-sr-griditem></template>
                    </template>
                    <template v-else>
                        <template v-for="p in result.items"><usf-sr-listitem :product="p" :result="result"></usf-sr-listitem></template>
                    </template>
                </template>
                <template v-else>
                    <!-- Empty result -->
                    <div class="usf-sr-empty">
                        <div class="usf-icon"></div>
                        <span v-html="term ? usf.utils.format(loc.productSearchNoResults, term) : loc.productSearchNoResultsEmptyTerm"></span>
                    </div>
                </template>
            </template>
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && result.extra.banner.isBottom" :banner="result.extra.banner"></usf-sr-banner>

    <!-- Paging & load more --> 

    <div class="pagination">
        <div class="usf-sr-paging" v-if="loader !== true">
            <div class="usf-sr-loader" v-if="loader === 'more'">
                <div class="usf-spinner"></div>
            </div>

            <div class="usf-sr-more" v-else-if="hasResults && usf.settings.search.more === 'more'">
                <div class="usf-title" v-html="usf.utils.format(loc.youHaveViewed, itemsLoaded, result.total)"></div>
                <div class="usf-progress">
                    <div :style="{width: (itemsLoaded * 100 / result.total) + '%'}"></div>
                </div>
                <button v-if="itemsLoaded < result.total" class="usf-load-more" @click="onLoadMore" v-html="loc.loadMore"></button>
            </div>
            <usf-sr-pages v-else-if="hasResults && usf.settings.search.more === 'page'" :page="page" :pages-total="pagesTotal" :pages-to-display="4" :side-pages-to-display="1"></usf-sr-pages>
        </div>        
    </div>
</div>
`,
    searchResultsGridViewItem: `
<div :class="'usf-sr-product product-item product-item--vertical 1/3--tablet 1/' + _usfSectionSettings.products_per_row + '--lap-and-up'">
    <div class="product-item__label-list">
        <span class="product-label product-label--on-sale" v-if="hasDiscount && usf.settings.search.showSale && _usfSettingGlobal.show_discount"><span v-html="saleText(loc,selectedVariantForPrice)"></span></span>
        <!--<span class="product-label product-label--custom1" v-if="isSoldOut && usf.settings.search.showSoldOut"><span v-html="loc.soldOut"></span></span>-->
        <template v-for="t in product.tags">
            <span class="product-label product-label--custom1" v-if="t.startsWith('__label:')" v-html="t.substr('__label:'.length)"></span>
            <span class="product-label product-label--custom1" v-if="t.startsWith('__label1:')" v-html="t.substr('__label1:'.length)"></span>
            <span class="product-label product-label--custom2" v-if="t.startsWith('__label2:')" v-html="t.substr('__label2:'.length)"></span>
        </template>
    </div>
    <span class="usf-in-stock" v-if="product.maxAvailable"></span>
    <span class="usf-out-of-stock" v-else="product.maxAvailable"></span>
    <a :href="productUrl" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" class="product-item__image-wrapper" :class="{'product-item__image-wrapper--with-secondary':product.images.length>1}">
        <!-- product image -->
        <div class="usf-img-wrapper aspect-ratio" :class="__usf_getExtendClass()" :style="'padding-bottom: '+(image.height / image.width * 100)+'%'">
            <img class="product-item__primary-image lazyload image--blur-up" :data-widths="'['+_usfImageWidths+']'" data-sizes="auto" :data-srcset="_usfGetImageUrls(scaledSelectedImageUrl)" :srcset="_usfGetImageUrls(scaledSelectedImageUrl)"/>
            <img class="product-item__secondary-image lazyload image--blur-up" :data-widths="'['+_usfImageWidths+']'" data-sizes="auto" :data-srcset="_usfGetImageUrls(scaledHoverImageUrl || scaledSelectedImageUrl)" :srcset="_usfGetImageUrls(scaledHoverImageUrl || scaledSelectedImageUrl)"/>
            <!-- product image extra -->
            <usf-plugin name="searchResultsProductImageExtra" :data="pluginData"></usf-plugin>
        </div>
        <!-- Wishlist -->
        <usf-plugin name="searchResultsProductWishList" :data="pluginData"></usf-plugin>

        <!-- Labels -->
        <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
    </a>
    <div class="product-item__info">
        <div class="product-item__info-inner">
            <!-- vendor -->
            <a class="product-item__vendor link" v-if="usf.settings.search.showVendor && _usfSettingGlobal.show_vendor " :href="usf.platform.baseUrl + '/collections/vendors?q=' + encodeURIComponent(product.vendor)" v-html="product.vendor"></a>
            <!-- product title -->
            <a :href="productUrl" :attrs="usf.plugins.invoke('getProductTitleAttrs', pluginData)" v-html="product.title" class="product-item__title text--strong link"></a>
            <div class="product-item__swatch-list" v-if="_usfSettingGlobal.show_color_swatch">
                 <div class="color-swatch-list" v-html="swatchLists(product,productUrl)"></div>
            </div>
            <!-- price -->
            <usf-plugin name="searchResultsProductPrice" :data="pluginData"></usf-plugin>
            <div class="product-item__price-list price-list">
                <span class="price" :class="{'price--highlight': hasDiscount}" v-html="displayDiscountedPrice"></span><span class="price_unit" v-if="window.usfPriceUnit" v-html="window.usfPriceUnit"></span>
                <span class="price price--compare" v-if="hasDiscount" v-html="displayPrice"></span><span class="price_unit" v-if="hasDiscount && window.usfPriceUnit" v-html="window.usfPriceUnit"></span>                
            </div>
            <!-- Product review -->
            <a class="product-item__reviews-badge link" :href="productUrl" v-if="usf.plugins.has('render_searchResultsProductReview')">
                <usf-plugin name="searchResultsProductReview" :data="pluginData"></usf-plugin>
            </a>
            <!--inventory-->
             <span v-if="_usfSettingGlobal.show_inventory_quantity" class="product-item__inventory inventory" :class="{'inventory--high': available > lowInventory, 'inventory--low': !isSoldOut && available > 0 && available <= lowInventory}" v-html="inventoryText(this)"></span>
        </div>
	    <form method="post" :action="usf.platform.addToCartUrl" :id="'product_form_id_'+product.id+'_collection-template'" accept-charset="UTF-8" class="product-item__action-list button-stack" enctype="multipart/form-data">
            <input type="hidden" name="form_type" value="product">
            <input type="hidden" name="utf8" value="✓">
            <input type="hidden" name="quantity" value="1">
            <input type="hidden" name="id" :value="product.variants[0].id">
            
            <!-- Quick buy button -->
            <template v-if="usfGridHasQuickBuy">
                <template v-if="available">
                    <button v-if="product.variants.length==1" type="submit" class="product-item__action-button button button--small button--primary usf-add-to-cart-ajax" data-action="add-to-cart" v-html="loc.addToCart"></button>
                    <button v-else type="button" class="product-item__action-button button button--small button--primary" data-action="open-modal" data-secondary-action="open-quick-view" aria-controls="modal-quick-view-collection-template" :data-product-url="productUrl" v-html="loc.chooseOptions"  @click="e => usf_ws_onQuickView(e,productUrl)"></button>
                </template>
                <button v-else class="product-item__action-button button button--small button--disabled" disabled v-html="loc.soldOut"></button>
            </template>

            <!-- Quick view button -->
            <button v-if="usfGridHasQuickView" type="button" class="product-item__action-button button button--small button--ternary hidden-phone" data-action="open-modal" data-secondary-action="open-quick-view" aria-controls="modal-quick-view-collection-template" :data-product-url="productUrl" v-html="loc.quickView"  @click="e => usf_ws_onQuickView(e,productUrl)" :data-pr-json="usfDataProduct(product,loc)"></button>
        </form>
    </div>
</div>
`,

    // Search result pages
    searchResultsPages: `
<div class="pagination"><div class="pagination__inner">
    <div class="pagination__nav">        
        <template v-for="e in elements">
            <a v-if="e.type === 'prev'" class="pagination__prev link" rel="prev" href="javascript:void(0)" :title="loc.prevPage" @click="onPrev"><svg class="icon icon--arrow-left" viewBox="0 0 8 12" role="presentation"><path stroke="currentColor" stroke-width="2" d="M6 10L2 6l4-4" fill="none" stroke-linecap="square"></path></svg></a>

            <span v-else-if="e.type === 'dots'" class="pagination__nav-item link">…</span>
            <span v-else-if="e.type === 'page' && e.current" class="pagination__nav-item is-active">{{e.page}}</span>
            <a v-else-if="e.type === 'page' && !e.current" href="javascript:void(0)" @click="onPage(e.page)" :title="usf.utils.format(loc.gotoPage,e.page)" class="pagination__nav-item link">{{e.page}}</a>
            
            <a v-else-if="e.type === 'next'" class="pagination__next link" rel="next"  href="javascript:void(0)" :title="loc.nextPage" @click="onNext"><svg class="icon icon--arrow-right" viewBox="0 0 8 12" role="presentation"><path stroke="currentColor" stroke-width="2" d="M2 2l4 4-4 4" fill="none" stroke-linecap="square"></path></svg></a>
        </template>
    </div>
</div></div>
`,

    searchResultsListViewItem: `
    <div class="product-item product-item--list" @click="onItemClick" :key="product.id">
        <div class="product-item__label-list">
            <span class="product-label product-label--on-sale" v-if="hasDiscount && usf.settings.search.showSale && _usfSettingGlobal.show_discount"><span v-html="saleText(loc,selectedVariantForPrice)"></span></span>
            <span class="product-label product-label--custom1" v-if="isSoldOut && usf.settings.search.showSoldOut"><span v-html="loc.soldOut"></span></span>
            <template v-for="t in product.tags">
                <span class="product-label product-label--custom1" v-if="t.startsWith('__label:')" v-html="t.substr('__label:'.length)"></span>
                <span class="product-label product-label--custom1" v-if="t.startsWith('__label1:')" v-html="t.substr('__label1:'.length)"></span>
                <span class="product-label product-label--custom2" v-if="t.startsWith('__label2:')" v-html="t.substr('__label2:'.length)"></span>
            </template>
        </div>
        <a :href="productUrl" class="product-item__image-wrapper" @mouseover="onItemHover" @mouseleave="onItemLeave">
            <div>
                <!-- product image  selectedImageUrl || hoverImageUrl padding-bottom: 133.33333333% --> 
                <!-- Product img -->
                <img class="product-item__primary-image image--blur-up lazyload" :src="imageUrl">
            </div>
        </a>
        <div class="product-item__info">
            <div class="product-item__info-inner">
                <!-- Vendor -->
                <a class="product-item__vendor link" v-html="product.vendor"></a>
                <!-- Title -->
                <a :href="productUrl" class="product-item__title text--strong link" v-html="product.title"></a>
                <div class="product-item__swatch-list" v-if="_usfSettingGlobal.show_color_swatch">
                     <div class="color-swatch-list" v-html="swatchLists(product,productUrl)"></div>
                </div>
                <div class="product-item__price-list price-list">
                    <span class="price" :class="{'price--highlight': hasDiscount}" v-html="displayDiscountedPrice"></span><span class="price_unit" v-if="window.usfPriceUnit" v-html="window.usfPriceUnit"></span>
                    <span class="price price--compare" v-html="displayPrice" v-if="hasDiscount"></span><span class="price_unit" v-if="hasDiscount && window.usfPriceUnit" v-html="window.usfPriceUnit"></span>
                </div>
                 <!--inventory-->
                 <span v-if="_usfSettingGlobal.show_inventory_quantity" class="product-item__inventory inventory" :class="{'inventory--high': available > lowInventory, 'inventory--low': available && available > 0 && available <= lowInventory}" v-html="inventoryText(this)"></span>
            </div>
            <form method="POST" :action="usf.platform.addToCartUrl" :id="'product_form_id_'+product.id+'_collection-template'" accept-charset="UTF-8" class="product-item__action-list product-item__action-list--list-view-only button-stack" enctype="multipart/form-data">
                <input type="hidden" name="form_type" value="product">
                <input type="hidden" name="utf8" value="✓">
                <input type="hidden" name="quantity" value="1">	
                <input type="hidden" name="id" :value="selectedVariantForPrice.id">
		
                <!-- Quick buy button -->
                <template v-if="usfListHasQuickBuy">
                    <template v-if="available">
                        <button v-if="product.variants.length==1" type="submit" class="product-item__action-button button button--small button--primary usf-add-to-cart-ajax" data-action="add-to-cart" v-html="loc.addToCart"></button>
                        <a v-else class="product-item__action-button product-item__action-button--list-view-only button button--small button--primary" :href="productUrl" v-html="loc.chooseOptions"></a>
                    </template>
                    <button v-else class="product-item__action-button button button--small button--disabled" disabled v-html="loc.soldOut"></button>
                </template>

                <!-- Quick view button -->
                <button v-if="usfListHasQuickView" type="button" class="product-item__action-button button button--small button--ternary hidden-phone" @click="e => usf_ws_onQuickView(e,productUrl)" data-action="open-modal" data-secondary-action="open-quick-view" aria-controls="modal-quick-view-collection-template" :data-product-url="productUrl" v-html="loc.quickView" :data-pr-json="usfDataProduct(product,loc)"></button>
            </form>
        </div>
    </div>
`,
    // AddToCart Plugin
    addToCartPlugin: `
<form v-if="!usfGridHasQuickBuy" class="usf-add-to-cart" method="POST" enctype="multipart/form-data" :action="usf.platform.addToCartUrl" :id="'product_form_id_'+args.product.id+'_collection-template'" accept-charset="UTF-8">
    <input type="hidden" name="form_type" value="product">
    <input type="hidden" name="utf8" value="✓">
    <input type="hidden" name="quantity" value="1">
    <input type="hidden" name="id" :value="variant.id">
		
    <button type="submit" name="add" :class="{'usf-visible': args.isHover}" class="usf-add-to-cart-btn product-item__action-button button button--small button--primary usf-add-to-cart-ajax" data-action="add-to-cart" v-html="loc.addToCart"></button>
</form>
`,
    // Preview Plugin
    previewPlugin: `
<div v-if="!usfGridHasQuickView" class="usf-sr-preview" :class="{'usf-visible': args.isHover}" @click="e => usf_ws_onQuickView(e,args.owner.productUrl)">
    <div><svg style="width:initial;height:initial" viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><g transform="translate(0.000000,281.000000) scale(0.100000,-0.100000)"><path d="M4808.6,2770.8c-1219.3-67-2423.2-610.6-3684.6-1659.5C884.8,912.3,100,140.9,100,104.6c0-34.4,794.3-819.2,1004.9-993.4c1138.9-941.7,2195.4-1468.1,3273-1630.8c306.3-45.9,821.1-55.5,1110.2-19.1C6663.3-2391.4,7832.8-1807.6,9023.4-774C9274.1-553.9,9900,73.9,9900,108.4c0,30.6-803.9,823-1004.9,989.6c-1098.7,909.2-2151.4,1445.1-3177.3,1617.4c-189.5,32.5-625.9,70.8-735,65.1C4944.5,2778.5,4866,2774.7,4808.6,2770.8z M5497.7,2296.2c1181-158.9,2425.1-846,3590.8-1983l212.5-206.7l-231.6-225.9c-1158-1135-2434.7-1829.8-3629.1-1977.2c-227.8-26.8-700.5-23-937.9,7.7c-417.3,57.4-851.8,181.8-1282.4,369.4C2452.4-1384.6,1543.2-743.4,865.6-60L702.9,104.6l172.3,174.2c509.1,513,1248,1075.7,1856.6,1410.7c562.7,310.1,1196.3,530.2,1751.4,606.8C4728.2,2330.6,5250.7,2330.6,5497.7,2296.2z"/><path d="M4670.8,1855.9c-671.8-128.2-1213.5-633.6-1397.3-1307.3c-59.3-212.5-59.3-675.7,0-888.1c172.3-625.9,654.6-1110.2,1276.7-1280.5c222-61.3,677.6-61.3,899.6,0c622.1,170.3,1104.4,654.6,1276.7,1280.5c59.3,212.5,59.3,675.7,0,888.1c-172.3,627.8-662.3,1117.8-1276.7,1280.5C5246.9,1880.8,4875.6,1894.2,4670.8,1855.9z M5373.2,1387c233.5-72.7,386.6-166.5,566.6-344.5c268-266.1,388.6-557,388.6-937.9c0-379-120.6-669.9-390.5-937.9c-268-269.9-558.9-390.5-937.9-390.5c-241.2,0-386.6,34.4-612.5,145.5c-130.2,63.2-195.2,111-325.4,243.1c-273.7,275.6-392.4,557-392.4,939.8c0,382.8,118.7,664.2,392.4,937.9c210.5,212.5,436.4,331.1,723.5,382.8C4929.2,1452.1,5222,1432.9,5373.2,1387z"/><path d="M4818.2,508.4c-283.3-132.1-348.4-509.1-122.5-723.5c281.4-266,744.6-68.9,744.6,319.7c0,179.9-109.1,342.6-271.8,409.6C5072.7,554.4,4912,552.4,4818.2,508.4z"/></g></svg></div>
    <span v-html="loc.quickView" :data-pr-json="usfDataProduct(args.product,loc)"></span>
</div>
`,

    // This modal is different to the default one in general.js
    previewPluginModal: `
<div class="usf-preview__wrapper usf-zone">
    <div class="usf-backdrop"></div>
    <div class="usf-preview">
        <!-- Close button -->
        <!-- <div class="usf-remove" @click="onClose"></div> -->
        <button class="modal__close link" @click="onClose">
            <svg class="icon icon--close" viewBox="0 0 19 19" role="presentation">
            <path d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z" fill="currentColor" fill-rule="evenodd"></path>
          </svg>
        </button>
        <!-- Body content -->
        <div class="usf-clear featured-product">
            <!-- left - images of product -->
            <div class="card">
                <div class="card__section card__section--tight">
                    <div class="product-gallery product-gallery--with-thumbnails">
                        <!-- Big image -->
                        <div class="usf-preview_image product-gallery__carousel-wrapper">
                            <div class="product-gallery__carouse product-gallery__carousel--zoomable" :style="'max-width:' + ((image.height/image.width*340 > 600) ? (600*image.width/image.height) + 'px' : '100%')">
                                <div class="aspect-ratio" :style="'padding-bottom:' + (image.height/image.width*100) + '%'">
                                    <img :src="usf.platform.getImageUrl(imageUrl, 450)" class="product-gallery__image image--blur-up lazyload">
                                </div>
                            </div>
                        </div>

                        <!-- Thumbnails -->
                        <div class="scroller">
                            <div class="scroller__inner">
                                <div class="product-gallery__thumbnail-list">
                                    <a class="product-gallery__thumbnail" v-for="i in images"
                                        :class="{'is-nav-selected': image === i}">
                                        <div class="aspect-ratio" :style="'padding-bottom:' + (i.height/i.width*100) + '%'">
                                            <img :src="usf.platform.getImageUrl(i.url, 'small')" @click="onThumbClick(i)">
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- right - info of the product -->
            <div class="card card--collapsed card--sticky">
                <div class="card__section">
                    <div class="product-meta">
                        <!-- Product title -->
                        <h3 class="product-meta__title heading h2" v-html="product.title">
                        </h3>

                        <div class="product-meta__label-list">
                            <span class="product-label product-label--on-sale" v-if="hasDiscount">Sale</span>
                            <span class="product-label product-label--custom1" v-if="isSoldOut">Sold out</span>
                        </div>
                        <!-- Vendor -->
                        <div class="product-meta__reference" v-html="product.vendor">
                        </div>
                    </div>
                    <hr class="card__separator">

                    <!-- Add to cart form -->
                    <form method="post" enctype="multipart/form-data" :action="usf.platform.addToCartUrl">
                        <!-- variant ID -->
                        <input type="hidden" name="id" :value="selectedVariant.id" />

                        <!-- Options -->
                        <template v-for="o in product.options">
                            <usf-preview-modal-option :option="o"></usf-preview-modal-option>
                        </template>
                        
                        <!--Prices -->
                        <div class="product-form__info-list" :class="{'price--sold-out': isSoldOut}">
                            <div class="product-form__info-item">
                                <span class="product-form__info-title text--strong">Price:</span>
                      
                                <div class="product-form__info-content">
                                  <div class="price-list">
                                      <span class="price" :class="{'price--highlight': hasDiscount}" v-html="usf.utils.getLongDisplayPrice(selectedVariant.compareAtPrice || selectedVariant.price)"></span>
                                      <span class="price price--compare" v-if="hasDiscount" v-html="usf.utils.getLongDisplayPrice(selectedVariant.price)"></span>
                                  </div>
                                </div>
                              </div>
                        </div>                        

                        <!-- add to card button -->
                        <div class="usf-preview__field">
                            <label v-html="loc.quantity"></label>
                            <div class="usf-flex usf-preview__add-to-cart">
                                <input pattern="[0-9]*" min="1" :value="quantity" name="quantity" type="number" />
                                <button :title="!hasAvailableVariant ? loc.selectedVariantNotAvailable : ''" :disabled="!hasAvailableVariant" type="submit" name="add" class="usf-preview--add-to-cart-btn" :class="{ 'usf-disabled': !hasAvailableVariant}" v-html="loc.addToCart"></button>
                            </div>
                        </div>
                    </form>
                    <!-- Description -->
                    <!-- <div class="usf-preview_description" v-html="product.description"></div> -->
                    <!-- See details link -->
                    <!-- <div class="usf-preview_link-wrapper">
                        <a class="usf-preview_link" :href="productUrl" v-html="loc.seeFullDetails"></a>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</div>
`,
    gotoTop: `
<div class="usf-goto-top">
    <div class="usf-icon usf-icon-up"></div>
</div>
`,
    searchResultsBanner: `
<div class="usf-sr-banner">
    <a :href="banner.url || 'javascript:void(0)'" :alt="banner.description">
        <img :src="banner.mediaUrl" style="max-width:100%">
    </a>
</div>
`,

    ////////////////////////
    // Filter templates
    // facet filters breadcrumb
    filtersBreadcrumb: /*inc_begin_filters-breadcrumb*/
`<div v-if="usf.settings.filterNavigation.showFilterArea && root.facetFilters && root.facets && facetFiltersKeys.length" class="usf-refineby">
    <!-- Breadcrumb Header -->
    <div class="usf-title usf-clear">
        <span class="usf-pull-left usf-icon usf-icon-equalizer"></span>
        <span class="usf-label" v-html="loc.filters"></span>

        <!-- Clear all -->
        <span class="usf-clear-all" v-html="loc.clearAll" @click="root.removeAllFacetFilters"></span>
    </div>

    <!-- Breadcrumb Values -->
    <div class="usf-refineby__body">
        <template v-for="facetTitle in facetFiltersKeys" v-if="(facet = root.facets.find(fc => fc.title === facetTitle)) && (f = root.facetFilters[facetTitle])">
            <template v-for="queryValStr in f[1]">
                <div class="usf-refineby__item usf-pointer usf-clear" @click="root.removeFacetFilter(facetTitle, queryValStr)">
                    <span v-html="facetTitle + ': '"></span><b v-html="root.formatBreadcrumbLabel(facet, f[0], queryValStr)"></b><span class="usf-remove"></span>
                </div>
            </template>
        </template>
    </div>
 </div>`
/*inc_end_filters-breadcrumb*/,

    // facet filters    
    filters: /*inc_begin_filters*/
// Vert & Horz modes have different render order
`<div class="usf-facets usf-no-select usf-zone">
<!-- Mobile view -->
<template v-if="usf.isMobile">
    <div class="usf-close" @click="onMobileBack(1)"></div>
    <div class="usf-facets-wrapper">
        <!-- Header. shows 'Filters', facet name, etc. -->
        <div class="usf-header">
            <!-- Single facet mode -->
            <template v-if="isSingleFacetMode">
                <div class="usf-title" @click="onMobileBack(0)" v-html="facets[0].title"></div>
                <div v-if="facetFilters" class="usf-clear" @click="removeAllFacetFilters" v-html="loc.clear"></div>
            </template>

            <!-- When a filter is selected -->
            <template v-else-if="mobileSelectedFacetTitle">
                <div class="usf-title usf-back" @click="onMobileBack(0)" v-html="mobileSelectedFacetTitle"></div>
                <div v-if="facetFilters && facetFilters[mobileSelectedFacetTitle]" class="usf-clear" @click="removeFacetFilter(mobileSelectedFacetTitle)" v-html="loc.clear"></div>
                <div v-else class="usf-all" v-html="loc.all"></div>
            </template>

            <!-- When no filter is selected -->
            <template v-else>
                <div class="usf-title" @click="onMobileBack(0)" v-html="loc.filters"></div>
                <div v-if="facetFilters" class="usf-clear" @click="removeAllFacetFilters" v-html="loc.clearAll"></div>
            </template>
        </div>

        <div class="usf-body">
            <!-- List all filter options, in single facet mode -->
            <usf-filter v-if="isSingleFacetMode" :facet="facets[0]"></usf-filter>

            <!-- List all filter options, when a filter is selected -->
            <usf-filter v-else-if="mobileSelectedFacetTitle" :facet="facets.find(f => f.title === mobileSelectedFacetTitle)"></usf-filter>

            <!-- List all when there are more than one facet -->
            <template v-else :key="f.id" v-for="f in facets">
                <template v-if="((isRange = (f.min !== undefined)) && f.min !== f.max) || f.navigationCollections || f.labels.length">
                    <div class="usf-facet-value" @click="() => mobileSelectedFacetTitle = f.title">
                        <span class="usf-title" v-html="f.title"></span>
                        <div v-if="(selectedFilterOptionValues = facetFilters && facetFilters[f.title] ? facetFilters[f.title][1] : null)" class="usf-dimmed">
                            <span v-for="cf in selectedFilterOptionValues" v-html="formatBreadcrumbLabel(f, f.facetName, cf)"></span>
                        </div>
                    </div>
                </template>
            </template>
        </div>

        <!-- View items -->
        <div class="usf-footer">
            <div @click="onMobileBack(1)" v-html="loc.viewItems"></div>
        </div>
    </div>
</template>

<!-- Desktop view -->
<template v-else>
    <usf-filter-breadcrumb></usf-filter-breadcrumb>    
    <!-- Filters Loader -->
    <div v-if="!facets" class="usf-facets__first-loader">
        <template v-for="i in 3">
            <div class="usf-facet"><div class="usf-title usf-no-select"><span class="usf-label"></span></div>
                <div v-if="!usf.settings.filters.horz" class="usf-container"><div class="usf-facet-values usf-facet-values--List"><div class="usf-relative usf-facet-value usf-facet-value-single"><span class="usf-label"></span><span class="usf-value"></span></div><div class="usf-relative usf-facet-value usf-facet-value-single"><span class="usf-label"></span><span class="usf-value"></span></div></div></div>
            </div>
        </template>
    </div>
    <!-- Facets body -->
    <div v-else class="usf-facets__body">
        <usf-filter :facet="f" :key="f.id" v-for="f in facets"></usf-filter>
    </div>
</template>
</div>`
/*inc_end_filters*/,

    // facet filter item
    filter: /*inc_begin_filter*/
`<div v-if="canShow" class="usf-facet" :class="{'usf-collapsed': collapsed && !usf.isMobile, 'usf-has-filter': isInBreadcrumb}">
    <!-- Mobile filter -->
    <div v-if="usf.isMobile" class="usf-container">
        <!-- Search box -->
        <input v-if="hasSearchBox" class="usf-search-box" :placeholder="loc.filterOptions" :value="term" @input="v => term = v.target.value">

        <!-- Values -->
        ` + _usfFilterBodyTemplate +
    `</div>

    <!-- Desktop filter -->
    <template v-else>
        <!-- Filter title -->
        <div class="usf-clear">
            <div class="usf-title usf-no-select" @click="onExpandCollapse">
                <span class="usf-label" v-html="facet.title"></span>
                <usf-helptip v-if="facet.tooltip" :tooltip="facet.tooltip"></usf-helptip>            
                <!-- 'Clear all' button to clear the current facet filter. -->
                <span v-if="isInBreadcrumb" class="usf-clear-all" :title="loc.clearFilterOptions" @click="onClear" v-html="loc.clear"></span>
            </div>
        </div>

        <!-- Filter body -->
        <div class="usf-container" :style="usf.settings.filters.horz && facet.maxHeight ? { maxHeight: facet.maxHeight } : null">
            <!-- Search box -->
            <input v-if="hasSearchBox" class="usf-search-box" :placeholder="loc.filterOptions" :value="term" @input="v => term = v.target.value">

            ` + _usfFilterBodyTemplate +
            `
        </div>
    </template>
</div>`
/*inc_end_filter*/,

    // facet filter option
    filterOption: /*inc_begin_filter-option*/
`<div v-if="children" :class="(isSelected ? 'usf-selected ' : '') + ' usf-relative usf-facet-value usf-facet-value-single usf-with-children' + (collapsed ? ' usf-collapsed' : '')">
    <!-- option label -->
    <span class="usf-children-toggle" v-if="children" @click="onToggleChildren"></span>
    <span class="usf-label" v-html="label" @click="onToggle"></span>

    <!-- product count -->
    <span v-if="!(!usf.settings.filterNavigation.showProductCount || (swatchImage && !usf.isMobile)) && option.value !== undefined" class="usf-value">{{option.value}}</span>    

    <div class="usf-children-container" v-if="children && !collapsed">
        <span class="usf-child-item usf-facet-value" v-for="c in children" v-html="getChildLabel(c)" @click="onChildClick(c)"></span>
    </div>
</div>
<div v-else :class="(isSelected ? 'usf-selected ' : '') + (swatchImage ? ' usf-facet-value--with-background' : '') + (' usf-relative usf-facet-value usf-facet-value-' + (facet.multiple ? 'multiple' : 'single'))" :title="isSwatch || isBox ? option.label + ' (' + option.value + ')' : undefined" :style="usf.isMobile ? null : swatchStyle" @click="onToggle">
    <!-- checkbox -->
    <div v-if="!isBox && !isSwatch && facet.multiple" :class="'usf-checkbox' + (isSelected ? ' usf-checked' : '')">
        <span class="usf-checkbox-inner"></span>
    </div>

    <!-- swatch image in mobile -->
    <div v-if="swatchImage && usf.isMobile" class="usf-mobile-swatch" :style="swatchStyle"></div>

    <!-- option label -->
    <span class="usf-label" v-html="label"></span>

    <!-- product count -->
    <span v-if="!(!usf.settings.filterNavigation.showProductCount || (swatchImage && !usf.isMobile)) && option.value !== undefined" class="usf-value">{{option.value}}</span>
</div>`
/*inc_end_filter-option*/,



    // Instant search popup
    instantSearch: /*inc_begin_instantsearch*/
`<div :class="'usf-popup usf-zone usf-is usf-is--' + position + (shouldShow ? '' : ' usf-hide') + (isEmpty ? ' usf-empty' : '') + (firstLoader ? ' usf-is--first-loader': '')"  :style="usf.isMobile ? null : {left: this.left + 'px',top: this.top + 'px',width: this.width + 'px'}">
    <!-- Mobile search box -->
    <div v-if="usf.isMobile">
        <form class="usf-is__inputbox" :action="searchUrl" method="get" role="search">
            <input name="q" autocomplete="off" ref="searchInput" :value="term" @input="onSearchBoxInput">
            <div class="usf-close" @click="close"></div>
        </form>
    </div>

    <!-- First loader -->
    <div class="usf-is__first-loader" v-if="firstLoader">
        <div class="usf-clear">
            <div class="usf-img"></div>
            <div class="usf-title"></div>
            <div class="usf-subtitle"></div>
        </div>
        <div class="usf-clear">
            <div class="usf-img"></div>
            <div class="usf-title"></div>
            <div class="usf-subtitle"></div>
        </div>
        <div class="usf-clear">
            <div class="usf-img"></div>
            <div class="usf-title"></div>
            <div class="usf-subtitle"></div>
        </div>
    </div>

    <!-- All JS files loaded -->
    <template v-else>
        <!-- Empty view -->
        <div v-if="term == ''" class="usf-is__no-results" >Cerca negozio...</div>
        <div v-else-if="isEmpty" class="usf-is__no-results" v-html="usf.utils.format(loc.noMatchesFoundFor, term)"></div>
        <template v-else>
            <!-- Body content -->
            <div class="usf-is__content">
                <!-- Products -->
                <div class="usf-is__matches">
                    <div class="usf-title" v-html="loc.productMatches"></div>
                    
                    <div class="usf-is__products" :data-term="term">
                        <!-- Product -->
                        <usf-is-item v-if="term && term !=''" v-for="p in result.items" :product="p" :result="result" :key="p.id"></usf-is-item>
                    </div>
                </div>

                <!-- Suggestions -->
                <div class="usf-is__suggestions">
                    <div class="usf-title" v-html="loc.searchSuggestions"></div>

                    <template v-if="result.suggestions">
                        <span v-for="s in result.suggestions" class="usf-is__suggestion" v-html="usf.utils.highlight(s, result.query)" @click="search(s)"></span>
                    </template>
                </div>
            </div>

            <!-- Footer -->
            <div class="usf-is__viewall">
                <span @click="search(result ? result.query : term)" v-html="usf.utils.format(loc.viewAllResultsFor, result ? result.query : term)"></span>
            </div>
            
            <!-- Loader -->
            <div v-if="loader" class="usf-is__loader">
                <div class="usf-spinner"></div>
            </div>
        </template>
    </template>
</div>`
/*inc_end_instantsearch*/
    ,

    // Instant search item
    instantSearchItem:/*inc_begin_instantsearch-item*/
`<span class="usf-is__product usf-clear" @click="onItemClick">
    <!-- Image -->
    <div class="usf-img-wrapper usf-pull-left">
        <img class="usf-img" :src="selectedImageUrl">
    </div>
    
    <div class="usf-pull-left">
        <!-- Title -->
        <div class="usf-title" v-html="usf.utils.highlight(product.title, result.query)"></div>

        <!-- Vendor -->
        <div class="usf-vendor" v-html="product.vendor" v-if="usf.settings.search.showVendor"></div>

        <!-- Prices -->
        <div class="usf-price-wrapper">
            <span class="usf-price" :class="{ 'usf-has-discount': hasDiscount }" v-html="displayPrice"></span>
            <span v-if="hasDiscount" class="usf-discount product-price__price product-price__sale" v-html="displayDiscountedPrice"></span>
        </div>
    </div>
</span>
`
/*inc_end_instantsearch-item*/,
};

function usfDataProduct(p, loc) {
    var prJson = {};
    prJson.id = p.id;
    prJson.images = p.images;
    prJson.variants = p.variants;
    prJson.selectedVariantId = p.selectedVariantId;
    prJson.soldOut = loc.soldOut;
    prJson.addToCart = loc.addToCart
    return JSON.stringify(prJson);
}

var usfFilesUrl;
usf.event.add('init', function () {
    // have to move the vars in 'init' event since our section settings JSON code in liquid might be parsed after this file.
    usfGridHasQuickView = _usfSectionSettings.show_quick_view.includes('grid');
    usfListHasQuickView = _usfSectionSettings.show_quick_view.includes('list');

    usfGridHasQuickBuy = _usfSectionSettings.show_quick_buy.includes('grid');
    usfListHasQuickBuy = _usfSectionSettings.show_quick_buy.includes('list');

    lowInventory = _usfSettingGlobal.low_inventory_threshold



    var nodes = document.head.children;
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.href && (n.href.indexOf('theme.scss.css') !== -1 || n.href.indexOf('theme.css') !== -1)) {
            usfFilesUrl = n.href;
            var m = usfFilesUrl.indexOf('/assets/');
            while (usfFilesUrl[--m] !== '/');
            while (usfFilesUrl[--m] !== '/');
            var k = usfFilesUrl.indexOf('?v=');
            usfFilesUrl = usfFilesUrl.substring(0, m) + "/files/{0}" + usfFilesUrl.substring(k);
	        break;
        }
    }	
    var UsfDropDownV2 = {
        props: {
            value: String,
            placeholder: String,
            name: String,
            options: Array,
        },

        data() {
            return {
                model: (this.value || ""),
                show: false
            }
        },
        computed: {
            labelFromValue() {
                try {
                    var val = this.model;
                    for (var i = 0; i < this.options.length; i++) {
                        if (this.options[i].value == val) {
                            return (this.options[i].label || "")
                        }
                    }
                    return "";
                } catch (e) {
                    return "";
                }
            }
        },
        methods: {
            toggleDropdown() {
                this.show = !this.show;
            },
            pickSortValue(v) {
                this.model = v;
                this.$emit('input', v);
                this.show = false;
            }
        },
        render(h) {
            var vm = this;

            return h('div', {
                class: 'value-picker-wrapper'
            }, [
                h('button', {
                    class: 'value-picker-button',
                    attrs: {
                        "aria-haspopup": "true",
                        "aria-expanded": (this.show ? "true" : "false"),
                        "aria-controls": "display-by-selector",
                        "data-action": "open-value-picker"
                    },
                    on: {
                        click: this.toggleDropdown
                    }
                }, [
                    h('span', {
                        //class: 'hidden-phone'
                    }, this.labelFromValue),
                    h('svg', {
                        class: "icon icon--arrow-bottom",
                        attrs: {
                            viewBox: "0 0 12 8",
                            role: "presentation"
                        },
                        domProps: {
                            innerHTML: `<path stroke="currentColor" stroke-width="2" d="M10 2L6 6 2 2" fill="none" stroke-linecap="square"></path>`
                        }
                    })
                ]),
                h('div', {
                    attrs: {
                        id: "display-by-selector",
                        "aria-hidden": (this.show ? "false" : "true")
                    },
                    class: 'value-picker',
                }, [
                    h('svg', {
                        class: 'icon icon--nav-triangle-borderless',
                        attrs: {
                            viewBox: "0 0 20 9",
                            role: "presentation"
                        },
                        domProps: {
                            innerHTML: `<path d="M.47108938 9c.2694725-.26871321.57077721-.56867841.90388257-.89986354C3.12384116 6.36134886 5.74788116 3.76338565 9.2467995.30653888c.4145057-.4095171 1.0844277-.40860098 1.4977971.00205122L19.4935156 9H.47108938z" fill="#ffffff"></path>`
                        }
                    }),
                    h('div', {
                        class: 'value-picker__inner'
                    }, [
                        h('div', {
                            class: 'value-picker__choice-list'
                        }, [
                            this.options.map((o) => {
                                return h('div', {
                                    staticClass: 'value-picker__choice-item link',
                                    class: {
                                        "is-selected": (o.value === vm.model)
                                    },
                                    on: {
                                        click() {
                                            vm.pickSortValue(o.value);
                                        }
                                    },
                                    domProps: {
                                        innerHTML: `${o.label} <svg class="icon icon--check-2" viewBox="0 0 13 11" role="presentation"><path d="M1 4.166456L5.317719 9 12 1" stroke="currentColor" stroke-width="2" fill="none" fill-rule="evenodd"></path></svg>`
                                    }
                                })
                            })
                        ])
                    ])
                ])

            ])
        }
    }
    usf.register(UsfDropDownV2, null, 'usf-dropdownv2');

    // hack for pass render issue of sidebar
    var blockFilterV1 = {
        render(h) {
            return h('div', [
                h('usf-filters')
            ])
        }
    }
    usf.register(blockFilterV1, null, 'block-filter-v1');

    // register or override components
    // ...    
    /*var SearchResultsGridItem2 = {
        template: usf.templates.searchResultsGridViewItem,
    }
    usf.register(SearchResultsGridItem2, usf.components.SearchResultsGridItem, "usf-sr-griditem");*/
});

function usf_ws_onQuickView(e, url) {
    var t = e.target;
    var i = new URL("" + window.location.origin + url);
    if (usf.isMobile)
        return window.location.href = i.href,
            !1;

    var acontrol = t.getAttribute("aria-controls") || 'modal-quick-view-collection-template';
    var n = document.getElementById(acontrol);
    if (!n) {
        n = document.createElement('div');
        var orgn = n;
        n.innerHTML = `<div id="modal-quick-view-collection-template" class="modal" aria-hidden="false" data-usf="modal">
    <div class="modal__dialog modal__dialog--stretch" role="dialog">
      <button class="modal__close link" data-action="close-modal" id="wh_modal_close"><svg class="icon icon--close" viewBox="0 0 19 19" role="presentation">
      <path d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z" fill="currentColor" fill-rule="evenodd"></path>
    </svg></button>

      <div class="modal__loader"><svg class="icon icon--search-loader" viewBox="0 0 64 64" role="presentation">
      <path opacity=".4" d="M23.8589104 1.05290547C40.92335108-3.43614731 58.45816642 6.79494359 62.94709453 23.8589104c4.48905278 17.06444068-5.74156424 34.59913135-22.80600493 39.08818413S5.54195825 57.2055303 1.05290547 40.1410896C-3.43602265 23.0771228 6.7944697 5.54195825 23.8589104 1.05290547zM38.6146353 57.1445143c13.8647142-3.64731754 22.17719655-17.89443541 18.529879-31.75914961-3.64743965-13.86517841-17.8944354-22.17719655-31.7591496-18.529879S3.20804604 24.7494569 6.8554857 38.6146353c3.64731753 13.8647142 17.8944354 22.17719655 31.7591496 18.529879z"></path>
      <path d="M1.05290547 40.1410896l5.80258022-1.5264543c3.64731754 13.8647142 17.89443541 22.17719655 31.75914961 18.529879l1.5264543 5.80258023C23.07664892 67.43614731 5.54195825 57.2055303 1.05290547 40.1410896z"></path>
    </svg></div>

      <div class="modal__inner"></div>
    </div>
  </div>`;
        document.body.appendChild(n);
        n = document.getElementById(acontrol);

        document.getElementById('wh_modal_close').addEventListener('click', () => {
            document.body.removeChild(orgn);
            document.documentElement.classList.remove('js', 'is-locked');
        });
    }

    n.classList.add("is-loading"),
        i.searchParams.set("view", "quick-view"),
        fetch(i.href, {
            credentials: "same-origin",
            method: "GET"
        }).then(function (e) {
            e.text().then(function (e) {
                n.querySelector(".modal__inner").innerHTML = e;

                /*var t = new s["default"](n.querySelector('[data-section-type="product"]'))
                    , i = function a() {
                        t.onUnload(),
                            n.removeEventListener("modal:closed", a)
                    };
                n.addEventListener("modal:closed", i)*/
                document.querySelectorAll('.product-gallery__thumbnail').forEach(a => $r_on(a, 'click', function (e) {
                    usf.utils.stopEvent(e);

                    document.querySelectorAll('.product-gallery__thumbnail').forEach(a2 => a2.classList.remove('is-nav-selected'));

                    var attrName = 'data-media-id';
                    var mediaId = e.currentTarget.getAttribute(attrName);
                    if (!mediaId) {
                        attrName = 'data-image-id';
                        mediaId = e.currentTarget.getAttribute(attrName);
                    }

                    e.currentTarget.classList.add('is-nav-selected');

                    document.querySelectorAll('.product-gallery__carousel-item').forEach(a2 => a2.classList.remove('is-selected'));
                    document.querySelector('div.product-gallery__carousel-item[' + attrName + '="' + mediaId + '"]').classList.add('is-selected');
                }))
                document.querySelectorAll('.modal__inner [data-action=add-to-cart]').forEach(target =>
                    target.addEventListener('click', e => usf.__addToCartAjax(target)));
                if (window.x_ProductSection)
                    new x_ProductSection["default"](n.querySelector('[data-section-type="product"]'));
            });
        })
            .finally(function () {
                n.classList.remove("is-loading");
                setTimeout(function () {
                    var p = JSON.parse(t.getAttribute('data-pr-json'));
                    if (!p) {
                        p = t.querySelector('span');
                        if (p) {
                            p = p.getAttribute('data-pr-json');
                            if (p)
                                p = JSON.parse(p);
                        }
                    }
                    if (p && p.variants.length) {
                        var form = document.getElementById(`product_form_${p.id}`);
                        var fvars = form.querySelector('.product-form__variants');
                        if (!fvars)
                            return;
                        var formOptions = fvars.querySelectorAll('.product-form__option');

                        var optsSelected = [];
                        //get options selected
                        for (let i = 0; i < formOptions.length; i++) {
                            let optLine = formOptions[i];
                            let ip = optLine.querySelector('input[checked]');
                            if (ip)
                                optsSelected[i] = ip.value;
                        }

                        //show image of variant selected
                        var vra;
                        p.variants.find(v => JSON.stringify(v.options) == JSON.stringify(optsSelected));
                        if (vra && p.images[vra.imageIndex])
                            usfChangePreviewImg(p.images[vra.imageIndex].url);

                        for (let i = 0; i < formOptions.length; i++) {
                            var optLine = formOptions[i];
                            var inputs = optLine.getElementsByTagName('input');
                            for (let n = 0; n < inputs.length; n++) {
                                var input = inputs[n];
                                var optionPosition = input.getAttribute('data-option-position') - 1;
                                var val = input.value;
                                let type = optLine.getAttribute('data-selector-type');
                                let opts = JSON.parse(JSON.stringify(optsSelected));
                                opts[optionPosition] = val;

                                var parent = input.parentElement;
                                usfCheckOptInvalid(p.variants, opts, parent, type);
                                parent.addEventListener("click", function () {
                                    var ipVal = this.getElementsByTagName('input')[0].value;
                                    var optionPosition = this.getElementsByTagName('input')[0].getAttribute('data-option-position') - 1;
                                    optsSelected[optionPosition] = ipVal;
                                    usfCheckOptsInvalid(formOptions, p.variants, optsSelected);
                                    var optLine = this.parentElement.parentElement;
                                    optLine.querySelector('.product-form__selected-value') ? optLine.querySelector('.product-form__selected-value').innerHTML = ipVal : null;

                                    //find variant with options selected
                                    var variant = p.variants.find(v => JSON.stringify(v.options) == JSON.stringify(optsSelected));
                                    if (variant) {
                                        //change price
                                        var infoItems = form.querySelectorAll('.product-form__info-item');
                                        for (let m = 0; m < infoItems.length; m++) {
                                            infoItems[m].setAttribute('style', '');
                                        }
                                        var price = usf.utils.getDisplayPrice(variant.price);
                                        if (variant.compareAtPrice > variant.price)
                                            form.querySelector('.price-list .price.price--highlight').innerHTML = price;
                                        else
                                            form.querySelector('.price-list .price').innerHTML = price;

                                        //change submit btn
                                        if (usf.utils.isVariantSoldOut(variant)) {
                                            var btnSubmit = form.querySelector('.product-form__add-button');
                                            btnSubmit.classList.add('button--disabled');
                                            btnSubmit.setAttribute('disabled', true);
                                            btnSubmit.innerHTML = p.soldOut;
                                            btnSubmit.classList.remove('button--primary');

                                            var is = form.querySelector('.product-form__inventory')
                                            if (is) {
                                                is.classList.remove('inventory--high')
                                                is.innerHTML = usf.settings.translation.soldOut
                                            }
                                        }
                                        else {
                                            var select = document.getElementById(`product-select-${p.id}`);
                                            select.value = variant.id;
                                            select.dispatchEvent(new Event('change'));
                                            var btnSubmit = form.querySelector('.product-form__add-button');
                                            btnSubmit.removeAttribute('disabled');
                                            btnSubmit.classList.add('button--primary');
                                            btnSubmit.classList.remove('button--disabled');
                                            btnSubmit.innerHTML = p.addToCart;

                                            var is = form.querySelector('.product-form__inventory')
                                            if (is) {
                                                is.classList.add('inventory', 'inventory--high')
                                                is.innerHTML = '☑ Disponibile in pronta consegna'
                                            }
                                        }
                                        //image change
                                        var img = p.images[variant.imageIndex];
                                        if (img)
                                            usfChangePreviewImg(img.url);

                                    } else {
                                        //change price
                                        var infoItems = form.querySelectorAll('.product-form__info-item');
                                        for (let m = 0; m < infoItems.length; m++) {
                                            infoItems[m].setAttribute('style', 'display:none');
                                        }
                                        //change submit btn
                                        var btnSubmit = form.querySelector('.product-form__add-button');
                                        btnSubmit.classList.add('button--disabled');
                                        btnSubmit.setAttribute('disabled', true);
                                        btnSubmit.innerHTML = "Unavailable";
                                        btnSubmit.classList.remove('button--primary');
                                    }
                                })
                            }

                        }


                    }
                }.bind(t), 200);
            });

    return usf.utils.stopEvent(e);
}



function usfChangePreviewImg(imgUrl) {
    let n = imgUrl.lastIndexOf('.');
    var vraImgUrl = imgUrl.slice(0, n).replace('https:', '');
    var thumbnails = document.querySelectorAll('.product-gallery__thumbnail');
    for (let i = 0; i < thumbnails.length; i++) {
        var thumbnail = thumbnails[i];
        var href = thumbnail.getAttribute('href');
        if (!href) {
            href = thumbnail.querySelector('img').getAttribute('src');
        }
        let m = href.lastIndexOf('_');
        let thumbUrl = href.slice(0, m);
        if ((vraImgUrl == thumbUrl) && thumbnail.getElementsByTagName('div').length)
            thumbnail.getElementsByTagName('div')[0].click();
    }
}


function usfCheckOptInvalid(variants, optsSelected, e, type) {
    var variant = variants.find(v => JSON.stringify(v.options) == JSON.stringify(optsSelected));
    variant && usf.utils.isVariantSoldOut(variant) ? e.classList.add(`${type}-swatch--disabled`) : e.classList.remove(`${type}-swatch--disabled`);
}

function usfCheckOptsInvalid(formOptions, variants, optsSelected) {
    for (let i = 0; i < formOptions.length; i++) {
        let optLine = formOptions[i];
        let type = optLine.getAttribute('data-selector-type');
        var swatchs = optLine.querySelectorAll(`.${type}-swatch`);
        for (let n = 0; n < swatchs.length; n++) {
            var swatch = swatchs[n];
            let val = swatch.getElementsByTagName('input')[0].value;
            let optionPosition = swatch.getElementsByTagName('input')[0].getAttribute('data-option-position') - 1;
            let opts = JSON.parse(JSON.stringify(optsSelected));
            opts[optionPosition] = val;
            usfCheckOptInvalid(variants, opts, swatch, type)
        }
    }
}


function _usfWSToColImageBg(url) {
    var p = url.lastIndexOf('.');
    return url.substr(0, p) + '_1x1' + url.substr(p);
}

//hide side bar when search result = 0
var usf_empty = function (isEmpty) {
    isEmpty ? document.body.classList.add('usf-has-sr-empty') : document.body.classList.remove('usf-has-sr-empty')    
}


var inventoryText = function (t) {
    if (t.isSoldOut)
        return 'Esaurito';

    var available = t.available;
    if (lowInventory && available > 0) {
        if (available <= lowInventory){
            if(available == 1)
                return `Solo 1 pezzo rimasto`;
            else
                return `Solo ${available} pezzi rimasti`;
        }
            

        if (available > lowInventory)
            return `${available} pezzi disponibili`
    }

    // t.available == -2147483648 when inventory tracking is disabled.
    return 'Sempre disponibile';    
}


//sale text
var saleText = function (loc, variant) {
    var price = 0;
    if (_usfSettingGlobal.discount_mode === "saving") {
        price = variant.compareAtPrice - variant.price;
        return `${loc.save} ${usf.utils.getDisplayPrice(price)}`
    } else {
        price = variant.price > 0 ? 100 - (variant.price / variant.compareAtPrice) * 100 : 100;
        price = Math.floor(price)
        return `${loc.save} ${price}%`
    }
}

var swatchLists = function (product, productUrl) {
    var html = "";
    var option = product.options.find(o => o.name === 'Color' || o.name === 'Colour');
    if (option) {
        var colorHasImg = {};
        var vIndex = 0;
        for (let i = 0; i < option.values.length; i++) {
            var imageIndex = 0;
            product.variants.filter(v => {
                for (let n = 0; n < v.options.length; n++) {
                    var optVal = option.values[i];
                    if (optVal == v.options[n] && !colorHasImg[optVal]) {
                        imageIndex = v.imageIndex;
                        colorHasImg[optVal] = 1;
                        var img = product.images[imageIndex];
                        var checked = v.id === product.selectedVariantId || (!product.selectedVariantId && !vIndex) ? `checked="checked"` : "";
                        vIndex++;
                        var colorHandled = `${colorHandle(optVal)}`
			            var colorUrl = `${colorHandled}_64x64.png`

                        var imageExtra = img ? ` data-media-id="${v.id}" data-image-url="${swatchImg(img.url)}" data-image-widths="${JSON.stringify(_usfImageWidths)}" data-image-aspect-ratio="1.0"` : ``;
                        html += `<div class="color-swatch" >
                                    <input onclick="usf_colorChanged(this)" class="color-swatch__radio" type="radio" name="collection-template-${product.id}" id="collection-template-${product.id}-${vIndex}" value="${optVal}" ${checked} data-variant-url="${productUrl}?variant=${v.id}" aria-hidden="true"${imageExtra}>
                                    <label class="color-swatch__item" for="collection-template-${product.id}-${vIndex}" style="background-color: ${colorHandled};background-image:url(${usfFilesUrl.replace('{0}', colorUrl)});" title="${optVal}"></label>
                                    <a href="${productUrl}" class="color-swatch__item-link">+6</a>
                                </div>`
                    }
                }
            })
        }
    }


    return html
}

var swatchImg = function (url) {
    let n = url.lastIndexOf(".");
    return url.substring(0, n) + "_{width}x" + url.substring(n)
}



var colorHandle = function (color) {
    return color.toLowerCase().replace(/[\s\/]/g, '-').replace(/---/g, '-').replace(/--/g, '-')
}

var usf_colorChanged = function (target) {
    // We need to change the URL of the various links
    var productItem = target.closest('.product-item'),
        variantUrl = target.getAttribute('data-variant-url');

    productItem.querySelector('.product-item__image-wrapper').setAttribute('href', variantUrl);
    productItem.querySelector('.product-item__title').setAttribute('href', variantUrl);

    // If we have a custom image for the variant, we change it
    var originalImageElement = productItem.querySelector('.product-item__primary-image');

    if (target.hasAttribute('data-image-url') && target.getAttribute('data-media-id') !== originalImageElement.getAttribute('data-media-id')) {
        var newImageElement = document.createElement('img');
        newImageElement.className = 'product-item__primary-image lazyload image--fade-in';
        newImageElement.setAttribute('data-media-id', target.getAttribute('data-media-id'));
        newImageElement.setAttribute('data-src', target.getAttribute('data-image-url'));
        newImageElement.setAttribute('data-widths', target.getAttribute('data-image-widths'));
        newImageElement.setAttribute('data-sizes', 'auto');

        // Replace the original node
        originalImageElement.parentNode.style.paddingBottom = 100.0 / newImageElement.getAttribute('data-image-aspect-ratio') + '%';
        originalImageElement.parentNode.replaceChild(newImageElement, originalImageElement);
    }
}