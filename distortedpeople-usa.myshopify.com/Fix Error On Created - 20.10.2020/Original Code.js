// define templates for the Impulse theme
var _usfFilterBodyTemplate = /*inc_begin_filter-body*/
    `<!-- Range filter -->
<div v-if="isRange" class="usf-facet-values usf-facet-range">
    <!-- Range inputs -->
    <div class="usf-slider-inputs usf-clear">
        <input :readonly="!hasRangeInputs" :value="rangeConverter(range[0]).toFixed(rangeDecimals)" @change="e => onRangeInput(e, range[0], 0)">
        <span>-</span>
        <input :readonly="!hasRangeInputs" :value="rangeConverter(range[1]).toFixed(rangeDecimals)" @change="e => onRangeInput(e, range[1], 1)">
    </div>
	<!-- See API reference of this component at https://docs.sobooster.com/search/storefront-js-api/slider-component -->
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
<div v-if="view === 'grid'" class="usf-sr-product grid__item small--one-half medium-up--one-quarter usf-skeleton">
    <div class="grid-view-item" v-if="true">
        <div class="usf-img"></div>
        <div class="usf-meta">            
        </div>
    </div>
</div>
<a class="usf-sr-product list-view-item usf-skeleton" v-else>
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
var _usfSearchResultsViewsTpl =
    `<div class="usf-views">
    <div class="usf-view usf-grid" :class="{'usf-active': view === 'grid'}" @click="onGridViewClick"><svg role="presentation" viewBox="0 0 36 36"><path fill="currentColor" d="M8 0L0 0L0 8L8 8L8 0ZM14 0L22 0L22 8L14 8L14 0ZM36 0L28 0L28 8L36 8L36 0ZM0 14L8 14L8 22L0 22L0 14ZM22 14L14 14L14 22L22 22L22 14ZM28 14L36 14L36 22L28 22L28 14ZM8 28L0 28L0 36L8 36L8 28ZM14 28L22 28L22 36L14 36L14 28ZM28 36L28 28L36 28L36 36L28 36Z"/></svg></div>
    <div class="usf-view usf-list" :class="{'usf-active': view === 'list'}" @click="onListViewClick"><svg role="presentation" viewBox="0 0 18 18"><path d="M8 1.030067h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1zm-7-15h2c.55228475 0 1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1H1c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .44771525 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1z" fill="currentColor"></path></svg></div>
</div>`;
var _usfSearchResultsSortByTpl = `<usf-dropdown :value="sortBy" :options="sortByOptions" @input="onSortByChanged"></usf-dropdown>`;

var configTemplatePC = `

   <div class="collection-filter__item collection-filter__item--drawer">
      <button type="button" class="js-drawer-open-collection-filters btn btn--tertiary" aria-controls="FilterDrawer" aria-expanded="false">
         <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-filter" viewBox="0 0 64 64">
            <path d="M48 42h10M48 42a5 5 0 1 1-5-5 5 5 0 0 1 5 5zM7 42h31M16 22H6M16 22a5 5 0 1 1 5 5 5 5 0 0 1-5-5zM57 22H26"></path>
         </svg>
         Filter
      </button>
   </div>
   <div class="collection-filter__item collection-filter__item--count small--hide" v-html="loader === true ? '&nbsp;' : usf.utils.format(term ? loc.productSearchResultWithTermSummary : loc.productSearchResultSummary, result.total, term)"></div>
   <div class="collection-filter__item collection-filter__item--sort" style=" display: flex; ">
      <div class="collection-filter__sort-container">
         <label for="SortBy" class="hidden-label">Sort</label>
         <usf-dropdown :value="sortBy" :options="sortByOptions" @input="onSortByChanged"></usf-dropdown>
      </div>

      <div class="usf-views">
            <div class="usf-view usf-grid" :class="{'usf-active': view === 'grid'}" @click="onGridViewClick"><svg role="presentation" viewBox="0 0 36 36"><path fill="currentColor" d="M8 0L0 0L0 8L8 8L8 0ZM14 0L22 0L22 8L14 8L14 0ZM36 0L28 0L28 8L36 8L36 0ZM0 14L8 14L8 22L0 22L0 14ZM22 14L14 14L14 22L22 22L22 14ZM28 14L36 14L36 22L28 22L28 14ZM8 28L0 28L0 36L8 36L8 28ZM14 28L22 28L22 36L14 36L14 28ZM28 36L28 28L36 28L36 36L28 36Z"/></svg></div>
            <div class="usf-view usf-list" :class="{'usf-active': view === 'list'}" @click="onListViewClick"><svg role="presentation" viewBox="0 0 18 18"><path d="M8 1.030067h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1zm-7-15h2c.55228475 0 1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1H1c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .44771525 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1z" fill="currentColor"></path></svg></div>
        </div>
   </div>
`

usf.templates = {
    app: `
<div id="usf_container" class="usf-zone usf-clear" :class="{'usf-filters-horz': usf.settings.filters.horz}">
    <block-filter-v1></block-filter-v1>
    <usf-sr></usf-sr>
</div>
`,
    searchResults: `
<div class="usf-sr-container" :class="{'usf-no-facets': noFacets, 'usf-empty': !loader && !hasResults, 'usf-nosearch': !showSearchBox}">
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
        
        ` + _usfSearchResultsSummaryTpl + _usfSearchResultsViewsTpl + `
    </div>
    <div class="collection-filter" v-else-if="window.USF_CollectionSidebar['filter_style'] == 'drawer' && !usf.settings.filters.horz && !usf.isMobile">
        `+ configTemplatePC + `
    </div>
    <div class="usf-sr-config" v-else-if="window.USF_CollectionSidebar['filter_style'] != 'drawer' && !usf.settings.filters.horz && !usf.isMobile">
        ` + _usfSearchResultsSummaryTpl + _usfSearchResultsSortByTpl + _usfSearchResultsViewsTpl + `
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && !result.extra.banner.isBottom" :banner="result.extra.banner"></usf-sr-banner>

    <div :class="(view === \'grid\' ? \'grid grid--uniform grid--view-items\' : \'list-view-items  usf-results usf-clear usf-list\')">
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
    <div class="usf-sr-paging" v-if="loader !== true">
        <div class="usf-sr-loader" v-if="loader === 'more'">
            <div class="usf-spinner"></div>
        </div>        
        
        <!-- Load more -->
        <div class="usf-sr-more" v-else-if="hasResults && usf.settings.search.more === 'more'">
            <div class="usf-title" v-html="usf.utils.format(loc.youHaveViewed, itemsLoaded, result.total)"></div>
            <div class="usf-progress">
                <div :style="{width: (itemsLoaded * 100 / result.total) + '%'}"></div>
            </div>
            <div v-if="itemsLoaded < result.total" class="usf-load-more" @click="onLoadMore" v-html="loc.loadMore"></div>
        </div>
        <usf-sr-pages v-else-if="hasResults && usf.settings.search.more === 'page'" :page="page" :pages-total="pagesTotal" :pages-to-display="4" :side-pages-to-display="1"></usf-sr-pages>
    </div>
</div>
`,
    searchResultsGridViewItem:
        `<div :key="product.id" class="grid__item grid-product" :class="[window.usf_gridItemWidth, {'grid-product__has-quick-shop': window._usfSettingGlobal.quick_shop_enable && available}]" :data-aos="'row-of-' + window.usf_sectionSettings.per_row" >
    <div class="grid-product__content">
        <!--labels-->
        <div v-if="(tmp_customLabel = usf_customLabel(product.tags)) != ''" class="grid-product__tag grid-product__tag--custom" v-html="tmp_customLabel"></div>
        <div v-if="isSoldOut && tmp_customLabel == ''" class="grid-product__tag grid-product__tag--sold-out" v-html="loc.soldOut"></div>
        <div v-if="!isSoldOut && hasDiscount && tmp_customLabel == '' && window._usfSettingGlobal.product_save_amount" class="grid-product__tag grid-product__tag--sale" v-html="loc.sale"></div>

        <a :href="productUrl" class="grid-product__link " :class="{'grid-product__link--disabled': isSoldOut }" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave">
            <div class="grid-product__image-mask">                
                <usf-plugin v-if="false" usf-plugin name="searchResultsProductImageExtra" :data="pluginData"></usf-plugin>
                <usf-qs-button :product="product" :loc="loc" :isSoldOut="isSoldOut"></usf-qs-button>
                

                <div class="image-wrap" :style="'height:0;padding-bottom:' + (selectedImage.height/selectedImage.width*100) + '%'">
                    <img class="grid-product__image lazyload" :data-widths="'[' + _usfImageWidths + ']'" :data-aspectratio="selectedImage.width/selectedImage.height" data-sizes="auto" :alt="product.title" :data-src="_usfGetImageWithSize(scaledSelectedImageUrl,'{width}')">
                </div>

                <template v-if="!isSoldOut && window._usfSettingGlobal.product_hover_image && scaledHoverImageUrl">
                    <div class="grid-product__secondary-image small--hide lazyload" :data-bgset="_usfGetImageUrls(scaledHoverImageUrl)" data-sizes="auto"></div>
                </template>
                <collection_color_swatches1 v-if="window._usfSettingGlobal.collection_color_swatches" :product="product"></collection_color_swatches1>
            </div>

            <div class="grid-product__meta">
                 <!-- product title -->
                 <div :class="'grid-product__title grid-product__title--'+window._usfSettingGlobal.type_product_style" :attrs="usf.plugins.invoke('getProductTitleAttrs', pluginData)">{{ product.title }}</div>
                 <!-- vendor -->
                 <div v-if="usf.settings.search.showVendor && window._usfSettingGlobal.vendor_enable" class="grid-product__vendor" v-html="product.vendor"></div>
                 <!-- price -->
                 <usf-plugin name="searchResultsProductPrice" :data="pluginData"></usf-plugin>
                 <div class="grid-product__price" :class="{'price--sold-out': isSoldOut}">
                    <template v-if="hasDiscount">
                        <span class="visually-hidden">Regular Price</span>
                        <span class="grid-product__price--original money" v-html="displayPrice"></span>
                        <span class="visually-hidden">Sale Price</span>
                    </template>
                    <template v-if="priceVaries">
                        From <span class="money" v-html="displayMinPrice"></span>
                    </template>
                    <span class="money" v-html="displayDiscountedPrice" v-else></span>

                    <template v-if="hasDiscount && window._usfSettingGlobal.product_save_amount">
                        <span class="grid-product__price--savings">
                            <template v-if="_usfSettingGlobal.product_save_type == 'dollar'">
                                <span v-html="loc.save"></span> <span class="money" v-html="displayDiscount"></span>
                            </template>
                            <template v-else>
                                <template v-if="compareAtPrice && discount">
                                    <span v-html="loc.save"></span> <span>{{getSalePercent(hasDiscount,selectedVariantForPrice)}}%</span>
                                </template>
                            </template>
                        </span>
                    </template>
                 </div>
                 <!-- Product review -->
                 <usf-plugin name="searchResultsProductReview" v-if="_usfSettingGlobal.enable_product_reviews" :data="pluginData"></usf-plugin>
                 <!-- Wishlist -->
                 <usf-plugin name="searchResultsProductWishList" :data="pluginData"></usf-plugin>
            </div>
        </a>
    </div>
    <collection_color_swatches2 :productUrl="productUrl" v-if="window._usfSettingGlobal.collection_color_swatches" :product="product"></collection_color_swatches2>
    <div :class="'usf_qs_placeholder_'+product.id"></div>
</div>
`,

    // Search result pages
    searchResultsPages: `
<div class="pagination text-center">
    <template v-for="e in elements">
        <span v-if="e.type === 'prev'" class="prev">
            <a href="javascript:void(0)" :title="loc.prevPage" @click="onPrev"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-chevron-left" viewBox="0 0 284.49 498.98"><path d="M249.49 0a35 35 0 0 1 24.75 59.75L84.49 249.49l189.75 189.74a35.002 35.002 0 1 1-49.5 49.5L10.25 274.24a35 35 0 0 1 0-49.5L224.74 10.25A34.89 34.89 0 0 1 249.49 0z"></path></svg></a>
        </span>
        <span v-else-if="e.type === 'dots'" class="deco">…</span>
        <span v-else-if="e.type === 'page' && e.current" class="page current">{{e.page}}</span>
        <span v-else-if="e.type === 'page' && !e.current" class="page"><a href="javascript:void(0)" @click="onPage(e.page)" :title="usf.utils.format(loc.gotoPage,e.page)">{{e.page}}</a></span>
        <span v-else-if="e.type === 'next'" class="next">
            <a href="javascript:void(0)" :title="loc.nextPage" @click="onNext"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-chevron-right" viewBox="0 0 284.49 498.98"><path d="M35 498.98a35 35 0 0 1-24.75-59.75l189.74-189.74L10.25 59.75a35.002 35.002 0 0 1 49.5-49.5l214.49 214.49a35 35 0 0 1 0 49.5L59.75 488.73A34.89 34.89 0 0 1 35 498.98z"></path></svg></a>
        </span>
    </template>
</div>
`,

    searchResultsListViewItem: `
<a class="usf-sr-product list-view-item" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" :href="productUrl" :key="product.id">
    <!-- Image column -->
    <div class="list-view-item__image-column">
        <div class="list-view-item__image-wrapper">
            <img class="list-view-item__image" :src="imageUrl">
            <div v-if="(tmp_customLabel = usf_customLabel(product.tags)) != ''" class="grid-product__tag grid-product__tag--custom" v-html="tmp_customLabel"></div>
            <div v-if="isSoldOut && tmp_customLabel == ''" class="grid-product__tag grid-product__tag--sold-out" v-html="loc.soldOut"></div>
            <div v-if="!isSoldOut && hasDiscount && tmp_customLabel == '' && window._usfSettingGlobal.product_save_amount" class="grid-product__tag grid-product__tag--sale" v-html="loc.sale"></div>
        </div>
    </div>

    <!-- Title and Vendor column -->
    <div class="list-view-item__title-column">
        <div class="list-view-item__title" v-html="product.title"></div>
        <div v-if="usf.settings.search.showVendor && window._usfSettingGlobal.vendor_enable" class="list-view-item__vendor " v-html="product.vendor"></div>
    </div>


    <!-- Prices -->
    <div class="list-view-item__price-column">
                 <div class="grid-product__price" :class="{'price--sold-out': isSoldOut}">
                    <template v-if="hasDiscount">
                        <span class="visually-hidden">Regular Price</span>
                        <span class="grid-product__price--original money" v-html="displayPrice"></span>
                        <span class="visually-hidden">Sale Price</span>
                    </template>
                    <template v-if="priceVaries">
                        From <span class="money" v-html="displayMinPrice"></span>
                    </template>
                    <span class="money" v-html="displayDiscountedPrice" v-else></span>

                    <template v-if="hasDiscount && window._usfSettingGlobal.product_save_amount">
                        <span class="grid-product__price--savings">
                            <template v-if="_usfSettingGlobal.product_save_type == 'dollar'">
                                <span v-html="loc.save"></span> <span class="money" v-html="displayDiscount"></span>
                            </template>
                            <template v-else>
                                <template v-if="compareAtPrice && discount">
                                    <span v-html="loc.save"></span> <span>{{getSalePercent(hasDiscount,selectedVariantForPrice)}}%</span>
                                </template>
                            </template>
                        </span>
                    </template>
                 </div>       
    </div>
</a>
`,
    // AddToCart Plugin	
    addToCartPlugin: ``,
    // Preview Plugin
    previewPlugin: `

<div class="quick-product__btn  small--hide"  @click="onShowModal">
                    <span class="quick-product__label" v-html="loc.quickView"></span>
                </div>
`,
    previewPluginModal: /*inc_begin_preview-modal*/
        `<div><div class="usf-backdrop"></div><div class="usf-preview__wrapper usf-zone">
    <div class="usf-preview">
        <!-- Close button -->
        <div class="usf-remove" @click="onClose"></div>

        <!-- Body content -->
        <div class="usf-preview__body">
            <!-- left - images of product -->
            <div class="usf-preview__content-left">
                <!-- Big image -->
                <div class="usf-preview__image-slider">
                    <div type="button" title="Prev" class="usf-preview__image-slider__prev" @click="onPrevImage(0)" v-if="showBigImageNav">
                        <svg aria-hidden="true" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M358 512c4 0 7-1 9-4 5-5 5-13 0-18L146 269 367 47c5-5 5-13 0-18s-13-5-18 0L119 260c-5 5-5 13 0 18l230 230c3 3 6 4 9 4z"></path></svg>
                    </div>

                    <div class="usf-preview__image-slider__track" :style="'max-width:' + ((image.height/image.width*imageMaxWidth > imageMaxHeight) ? (imageMaxHeight*image.width/image.height) + 'px' : '100%') + ';padding-bottom:' + ((image.height/image.width*imageMaxWidth > imageMaxHeight) ? (imageMaxHeight*100/imageMaxWidth) : (image.height/image.width*100)) + '%'">
                        <div v-for="i in images" class="usf-preview__image" :class="{'usf-active': image === i}">
                            <div class="usf-preview__image-img-wrapper">
                                <img :src="usf.platform.getImageUrl(i.url, 1024)">
                            </div>
                        </div>
                    </div>

                    <div type="button" title="Next" class="usf-preview__image-slider__next" @click="onNextImage(0)" v-if="showBigImageNav">
                        <svg aria-hidden="true" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M128 512c-3 0-7-1-9-4-5-5-5-13 0-18l221-221L119 47c-5-5-5-13 0-18s13-5 18 0l230 231c5 5 5 13 0 18L137 508c-2 3-6 4-9 4z"></path></svg>
                    </div>

                    <ul class="usf-preview__image-slider__dots" v-if="showImageIndices && false">
                        <li :class="{'active':i===image}" v-for="(i,index) in images"  @click="onThumbClick(i)"><button type="button">{{index+1}}</button></li>
                    </ul>
                </div>

                <!-- Thumbnails -->
                <div class="usf-preview__thumbs usf-clear" v-if="showThumbs">
                    <div v-if="showThumbNav" class="usf-preview__thumbs-prev" @click="onPrevImage">
                        <svg aria-hidden="true" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M358 512c4 0 7-1 9-4 5-5 5-13 0-18L146 269 367 47c5-5 5-13 0-18s-13-5-18 0L119 260c-5 5-5 13 0 18l230 230c3 3 6 4 9 4z"></path></svg>
                    </div>

                    <div class="usf-preview__thumbs-inner">
                        <div v-for="i in images" class="usf-preview__thumb" :class="{'usf-active': image === i}">
                            <img :src="usf.platform.getImageUrl(i.url, 'small')" @click="onThumbClick(i)">
                        </div>
                    </div>

                    <div v-if="showThumbNav" class="usf-preview__thumbs-next" @click="onNextImage">
                        <svg aria-hidden="true" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M128 512c-3 0-7-1-9-4-5-5-5-13 0-18l221-221L119 47c-5-5-5-13 0-18s13-5 18 0l230 231c5 5 5 13 0 18L137 508c-2 3-6 4-9 4z"></path></svg>                        
                    </div>
                </div>
            </div>

            <!-- right - info of the product -->
            <div class="usf-preview__content-right">
                <!-- Product title -->
                <h1 class="usf-preview__title" v-html="product.title"></h1>

                <!-- Vendor -->
                <div class="usf-preview__vendor" v-html="product.vendor" v-if="usf.settings.search.showVendor"></div>

                <!--Prices -->
                <div class="usf-preview__price-wrapper price" :class="{'price--sold-out': isSoldOut}">
                    <span class="usf-price product-price__price" :class="{'usf-has-discount': hasDiscount}" v-html="usf.utils.getDisplayPrice(selectedVariant.compareAtPrice || selectedVariant.price)"></span>
                    <span v-if="hasDiscount" class="usf-discount product-price__price product-price__sale" v-html="usf.utils.getDisplayPrice(selectedVariant.price)"></span>

                    <div class="price__badges price__badges--listing">
                        <span class="price__badge price__badge--sale" aria-hidden="true" v-if="hasDiscount && usf.settings.search.showSale">
                            <span v-html="loc.sale"></span>
                        </span>
                        <span class="price__badge price__badge--sold-out" v-if="isSoldOut && usf.settings.search.showSoldOut">
                            <span v-html="loc.soldOut"></span>
                        </span>
                    </div>
                </div>

                <!-- Description -->
                <div class="usf-preview__description" v-html="product.description"></div>

                <!-- Add to cart form -->
                <form method="post" enctype="multipart/form-data" :action="usf.platform.addToCartUrl">
                    <!-- variant ID -->
                    <input type="hidden" name="id" :value="selectedVariant.id" />

                    <!-- Options -->
                    <template v-for="o in product.options">
                        <usf-preview-modal-option :option="o"></usf-preview-modal-option>
                    </template>

                    <!-- add to card button -->
                    <div class="usf-preview__field">
                        <label v-html="loc.quantity"></label>
                        <div class="usf-flex usf-preview__add-to-cart">
                            <input pattern="[0-9]*" min="1" :value="quantity" name="quantity" type="number" />
                            <button :title="!hasAvailableVariant ? loc.selectedVariantNotAvailable : ''" :disabled="!hasAvailableVariant" type="submit" name="add" class="usf-preview--add-to-cart-btn" :class="{ 'usf-disabled': !hasAvailableVariant}" v-html="loc.addToCart"></button>
                        </div>
                    </div>
                </form>

                <!-- See details link -->
                <div class="usf-preview__link-wrapper">
                    <a class="usf-preview__link" :href="productUrl" v-html="loc.seeFullDetails"></a>
                </div>
            </div>
        </div>
    </div>
</div></div>`
/*inc_end_preview-modal*/,
    gotoTop: /*inc_begin_goto-top*/
        `<div class="usf-goto-top">
    <div class="usf-icon usf-icon-up"></div>
</div>`
/*inc_end_goto-top*/,
    searchResultsBanner: /*inc_begin_search-banner*/
        `<div class="usf-sr-banner">
    <a :href="banner.url || 'javascript:void(0)'" :alt="banner.description">
        <img :src="banner.mediaUrl" style="max-width:100%">
    </a>
</div>
`
/*inc_end_search-banner*/,

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
                <template v-if="canShowFilter(f)">
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
        <span :class="'usf-child-item usf-facet-value' + (isChildSelected(c) ? ' usf-selected' : '')" v-for="c in children" v-html="getChildLabel(c)" @click="onChildClick(c)"></span>
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
        <div v-if="isEmpty" class="usf-is__no-results" v-html="usf.utils.format(loc.noMatchesFoundFor, term)"></div>
        <template v-else>
            <!-- Body content -->
            <div class="usf-is__content">
                <!-- Products -->
                <div class="usf-is__matches">
                    <div class="usf-title" v-html="loc.productMatches"></div>
                    
                    <div class="usf-is__products">
                        <!-- Product -->
                        <usf-is-item v-for="p in result.items" :product="p" :result="result" :key="p.id + '-' + p.selectedVariantId"></usf-is-item>
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

/* Impulse 3.3 */
if (!window.usf_gridItemWidth)
    window.usf_gridItemWidth = "small--one-half medium-up--one-quarter";

if (!window.usf_sectionSettings)
    window.usf_sectionSettings = {
        per_row: 4
    };

if (!window._usfSettingGlobal)
    window._usfSettingGlobal = {
        quick_shop_enable: true,
        product_grid_image_size: "natural",
        product_hover_image: false,
        collection_color_swatches: false,
        type_product_style: "body",
        vendor_enable: false,
        product_save_amount: true
    }

var _usfImageWidths;

// for raw image
var _usf_getIMGBySizeFromRawURL = function (t, r = '400x') {
    if (!t) return usf.platform.emptyImage.url;
    try {
        if ("original" == r || t.includes('no-image'))
            return t;
        var e = t.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
        return e[1] + "_" + r + "." + e[2]
    } catch (o) {
        return t
    }
}


function getSalePercent(hasDiscount,selectedVariantForPrice){
    if (!hasDiscount)
        return 0;

    var selectedVariant = selectedVariantForPrice;
    return Math.ceil(100 - selectedVariant.price * 100 / selectedVariant.compareAtPrice);
}

var usf_customLabel = function (tags) {
    var tag = tags.find(t => t.includes('_label_'));
    return tag ? tag.replace('_label_', '') : '';
}


var _usfIsDynamicImage = usf.settings.search.imageSizeType === 'dynamic';
function _usfGetImageWithSize (url, size = '{width}') {
    if (_usfIsDynamicImage)
        return url.replace('{size}', size)

    return url.replace('_' + usf.settings.search.imageSize + 'x.', '_' + size + 'x.');
}

function _usfGetImageUrls(imageUrl) {
    return _usfImageWidths.map(w => imageUrl.replace(_usfIsDynamicImage ? '{size}' : usf.settings.search.imageSize, w) + ' ' + w + 'w').join(', ')
}


var usfFilesUrl;
var qs_html = {};
var modalObject = {};
var defaultGlobalSettings = {
    quick_shop_enable: true,
    product_grid_image_size: "square",
    product_hover_image: true,
    collection_color_swatches: true,
    type_product_style: "body",
    vendor_enable: false,
    product_zoom_enable: true,
    inventory_enable: true,
    inventory_transfers_enable: false,
    show_breadcrumbs: false,
    enable_product_reviews: false,
    reviews_layout: "expandable",
    sku_enable: false,
    product_save_amount: true,
    product_save_type: "dollar",
    trust_image: null,
    trust_image_width: null,
    trust_image_aspect_ratio: null,
    trust_img_url: '//cdn.shopify.com/s/assets/no-image-50-3d8cc48bd078edcd544c8d60f929ed2d8800a3fc52e0f602e84b1767e392bfcd_{width}x.gif',
    trust_image_alt: null,
    trust_image_src: '//cdn.shopify.com/s/assets/no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c_540x.gif',
    product_contact_title: "Ask a question",
    product_contact: true,

}
function merge(obj1, obj2) {
    answer = {}
    for (key in obj1) {
        answer[key] = obj1[key];
    }

    for (key in obj2) {
        if (answer[key] === undefined || answer[key] === null || (obj2[key] != undefined && obj2[key] != null))
            answer[key] = obj2[key];
    }
    return answer
}


usf.event.add('init', function () {
    _usfImageWidths = _usfIsDynamicImage ? [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000, 3500, 4000, 4500, 5000] : [usf.settings.search.imageSize];
    window.lazySizesConfig = window.lazySizesConfig || {};
    lazySizesConfig.expFactor = 2;
    var nodes = document.head.children;
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.href && (n.href.indexOf('usf.css') !== -1 || n.href.indexOf('theme.scss.css') !== -1 || n.href.indexOf('theme.css') !== -1)) {
            usfFilesUrl = n.href;
            usfFilesUrl = usfFilesUrl.substring(0, usfFilesUrl.lastIndexOf('/')) + "/";
        }
    }

    window._usfSettingGlobal = window._usfSettingGlobal || {};
    window._usfSettingGlobal = merge(defaultGlobalSettings, (window._usfSettingGlobal || {}))

    var collection_color_swatch1 = {
        props: {
            product: {
                type: Object,
                required: true
            }
        },
        render(h) {
            var arr = [];
            this.product.options.map((option, option_index) => {
                var option_name = option.name.toLowerCase();
                if (option_name.includes('color') || option_name.includes('colour')) {
                    var values = [];
                    this.product.variants.map((variant) => {
                        var value = variant.options[option_index];
                        if (!values.includes(value)) {
                            values.push(value);
                            if (this.product.images[variant.imageIndex]) {
                                arr.push(
                                    h('div', {
                                        staticClass: `grid-product__color-image grid-product__color-image--${variant.id} small--hide`
                                    })
                                )
                            }
                        }
                    })
                }
            })
            return h('div', arr);
        }
    }
    usf.register(collection_color_swatch1, null, 'collection_color_swatches1');

    var collection_color_swatches2 = {
        props: {
            product: {
                type: Object,
                required: true
            },
            productUrl: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                color_count: 0
            }
        },
        methods: {
            variantToUrl(v) {
                if (this.productUrl.includes('?')) {
                    return `${this.productUrl}&variant=${v.id}`
                }
                return `${this.productUrl}?variant=${v.id}`
            },
            variantToImg(v) {
                if (this.product.images[v.imageIndex]) {
                    return _usf_getIMGBySizeFromRawURL(this.product.images[v.imageIndex].url)
                }
                return _usf_getIMGBySizeFromRawURL(this.product.images[0].url)
            }
        },
        render(h) {
            var product = this.product;
            var vm = this;
            return h('div', [
                product.options.map((option, option_index) => {
                    var option_name = option.name.toLowerCase();
                    if (option_name.includes('color') || option_name.includes('colour')) {
                        var values = [];
                        return h('div', {
                            staticClass: `grid-product__colors grid-product__colors--${product.id}`,
                            style: {
                                // display:(vm.color_count <2 ? 'none': 'block')
                            }
                        }, [
                            product.variants.map((variant) => {
                                var value = variant.options[option_index];
                                if (!values.includes(value)) {
                                    values.push(value);
                                    // vm.color_count = vm.color_count + 1;
                                    var color_image = `${usfFilesUrl}${_usfHandlezie(value)}_50x.png`;
                                    var color_swatch_fallback = _usfHandlezie(value.split(' ').pop())
                                    return h('a', {
                                        attrs: {
                                            href: this.variantToUrl(variant),
                                            'data-variant-id': `${variant.imageIndex ? variant.id : ''}`,
                                            'data-variant-image': `${variant.imageIndex ? this.variantToImg(variant) : ''}`
                                        },
                                        style: `background-image: url(${color_image}); background-color: ${color_swatch_fallback};`,
                                        staticClass: `color-swatch color-swatch--small color-swatch--${_usfHandlezie(value)} ${variant.imageIndex ? ' color-swatch--with-image' : ''}`
                                    })
                                }
                            })
                        ])
                    }
                })
            ]);
        }
    }
    usf.register(collection_color_swatches2, null, 'collection_color_swatches2');

    var usf_qs_button = {
        props: {
            product: {
                type: Object,
                required: true
            },
            isSoldOut: {
                required: true
            },
            loc: {
                required: true
            }
        },
        methods: {
            //usf_qs_placeholder
            getQS(e) {
                e.preventDefault()
                var id = this.product.id;
                var el = this.$el;
                var parent = el.closest('.grid__item'); if (!parent) return;
                var pl = parent.querySelector(`.usf_qs_placeholder_${id}`);
                if (!pl) {
                    console.log('Placeholder zone not found');
                    return;
                }
                // Case 1 :  we have html + event (after init first time)
                if (pl.firstChild && modalObject[id]) {
                    modalObject[id].open();
                    return;
                }
                // Case 2 : have old html , but still have event (old event) => remove old event reinit event , replace old html to placeholder zone 
                if (qs_html[id]) {
                    pl.innerHTML = qs_html[id];
                    usf.initQuickShop(id, el)
                    return;
                }

                // Case 3 : for first time click quickshop button
                var comp = this;
                var xhr = new XMLHttpRequest();
                var url = `/products/${this.product.urlName}?view=qshtml`;
                console.log(url)
                xhr.open("GET", url, true);
                xhr.setRequestHeader("Cache-Control", "max-age=3600");
                xhr.onreadystatechange = function () {
                    if (this.readyState === XMLHttpRequest.DONE) {
                        if (this.status === 200) {
                            if (this.responseText && this.responseText.includes('usf_qshtml')) {
                                pl.innerHTML = this.responseText
                                qs_html[id] = this.responseText
                                usf.initQuickShop(id, el)
                            }
                        } else {
                            console.log(this.status, this.statusText);
                        }
                    }
                };
                xhr.send();

                return false;
            }
        },
        template: `
        <div :class="'quick-product__btn js-modal-open-quick-modal-' + product.id + ' small--hide-disable'" :data-product-id="product.id" aria-expanded="false" @click="getQS" >
            <span class="quick-product__label">
                <svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 64 64" class="icon icon-search"><path d="M47.16 28.58A18.58 18.58 0 1 1 28.58 10a18.58 18.58 0 0 1 18.58 18.58zM54 54L41.94 42"></path></svg>
            </span>
        </div>
        <!--<div v-if="window._usfSettingGlobal.quick_shop_enable" @click="getQS" :class="'quick-product__btn js-modal-open-quick-modal-' + product.id + ' small--hide'" :data-product-id="product.id" aria-expanded="false">
            <span class="quick-product__label" v-html="loc.quickView"></span>
        </div>     -->
        `
    }
    usf.register(usf_qs_button, null, 'usf-qs-button');

    var blockFilterV1 = {
        props: ['show'],
        methods: {

        },
        mounted() {
            var isDrawer = window.USF_CollectionSidebar['filter_style'] == 'drawer';
            this.$nextTick(function () {
                if (isDrawer && !usf.settings.filters.horz) {
                    var el = this.$el;
                    var drawerZone = document.getElementById('usf_filter_placeholder')
                    if (drawerZone) {
                        drawerZone.insertBefore(el, drawerZone.firstChild);
                        document.body.classList.add('usf_impulse_33_drawer')
                    }

                }
            })
        },
        render(h) {
            return h('div', [
                h('usf-filters', {
                    ref: 'usfFilter'
                })
            ]);
        }
    }
    usf.register(blockFilterV1, null, 'block-filter-v1');

    /* Impulse 3.0.2 common */

    var x = document.querySelectorAll('.predictive-results')
    if (x)
        x.forEach(el => el.remove());
    usf.event.add('is_show', (sender, e) => {
        setTimeout(function () {
            if (usf.isMobile) {
                theme.a11y.removeTrapFocus({
                    $container: $('.site-header__search-container'),

                    namespace: 'header_search'
                });
            }
        }, 100);
    })

});



$(document).ready(function () {
    $('body').on('productModalOpen', function () {
        window.AOS && window.AOS.refresh();
        window.theme.settings.currenciesEnabled && window.theme.currencySwitcher.ajaxrefresh();
        // Re-hook up collapsible box triggers
        window.theme.collapsibles && window.theme.collapsibles.init();
    });
})

usf.initQuickShop = function (id, el) {
    setTimeout(function () {
        var modalId = 'QuickShopModal-' + id;
        var name = 'quick-modal-' + id;

        modalObject[id] = new window.theme.Modals(modalId, name);
        window.SPR && (window.SPR.initDomEls(), window.SPR.loadBadges())
        // Re-register product templates in quick view modals.
        // Will not double-register.
        window.sections && window.theme && window.sections.register('product-template', window.theme.Product, null);
        modalObject[id].open();
    }, 250);
};

usf.event.add(['sr_updated', 'sr_viewChanged', 'rerender'], function () {
    if (window.jQuery && window.sections) {
        theme.reinitSection('collection-template');
        theme.reinitProductGridItem(jQuery('#usf_container'));
        jQuery('body').trigger('resize');
    }
});

