// define templates for the Blockshop
var usfAssetUrl;


var _usfProductLables = `
<a v-if="hasDiscount && usf.settings.search.showSale" class="circle sale" :href="productUrl">
    <span v-html="loc.sale"></span>
</a>
<a v-else-if="product.tags.find(t=> t == 'new')" class="circle new" :href="productUrl"><span>new</span></a>
`;
var _usfProductBadges = `
<div class="product-item-badges">
    <!--Budder-->
    <div v-if="product.tags.find(t => t == 'budder')" class="badge-tooltip-wrap naoTooltip-wrap">
        <div class="badge" v-html="_usfBudderIcon"></div>
        <div class="naoTooltip nt-bottom-right nt-medium">
            Budder
        </div>
    </div>
    <!--Diamonds-->
    <div v-if="product.tags.find(t => t == 'diamonds')" class="badge-tooltip-wrap naoTooltip-wrap">
        <div class="badge" v-html="_usfDiamondsIcon"></div>
        <div class="naoTooltip nt-bottom-right nt-medium">
            Diamonds
        </div>
    </div>
    <!--Sauce-->
    <div v-if="product.tags.find(t => t == 'Sauce')" class="badge-tooltip-wrap naoTooltip-wrap">
        <div class="badge" v-html="_usfSauceIcon"></div>
        <div class="naoTooltip nt-bottom-right nt-medium">
            Sauce
        </div>
    </div>
    <!--Vape-->
    <div v-if="product.tags.find(t => t == 'vape' || t == 'Vape')" class="badge-tooltip-wrap naoTooltip-wrap">
        <div class="badge" v-html="_usfVapeIcon"></div>
        <div class="naoTooltip nt-bottom-right nt-medium">
            Vape
        </div>
    </div>
    <!--Flower-->
    <div v-if="product.tags.find(t => t == 'Flower' || t == 'flower')" class="badge-tooltip-wrap naoTooltip-wrap">
        <div class="badge" v-html="_usfFlowerIcon"></div>
        <div class="naoTooltip nt-bottom-right nt-medium">
            Flower
        </div>
    </div>
</div>
`;

var _usfProductPrice = `
<p v-if="hasDiscount" class="price">
    <span class="money" v-html="displayDiscountedPrice"></span>
    <em class="marked-down-from">
        <span class="money" v-html="'/ ' + displayPrice"></span>
    </em>
</p>
<p v-else class="price">
    <span class="money" v-html="_usfPriceWithUnit(product,displayDiscountedPrice)"></span>
</p>
`;
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

var _usfSearchResultsSkeletonItemTpl = /*inc_begin_search-skeleton-item*/
    `<div v-if="view === 'grid'" class="usf-sr-product grid__item small--one-half medium-up--one-quarter usf-skeleton">
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
</a>`
/*inc_end_search-skeleton-item*/;

var _usfSearchResultsSummaryTpl = /*inc_begin_search-summary*/
    `<span class="usf-sr-summary" v-html="loader === true ? '&nbsp;' : usf.utils.format(term ? loc.productSearchResultWithTermSummary : loc.productSearchResultSummary, result.total, term)"></span>`
/*inc_end_search-summary*/;

var _usfSearchResultsViewsTpl = /*inc_begin_search-views*/
    `<div class="usf-views">
    <div class="usf-view usf-grid" :class="{'usf-active': view === 'grid'}" @click="onGridViewClick"><svg role="presentation" viewBox="0 0 36 36"><path fill="currentColor" d="M8 0L0 0L0 8L8 8L8 0ZM14 0L22 0L22 8L14 8L14 0ZM36 0L28 0L28 8L36 8L36 0ZM0 14L8 14L8 22L0 22L0 14ZM22 14L14 14L14 22L22 22L22 14ZM28 14L36 14L36 22L28 22L28 14ZM8 28L0 28L0 36L8 36L8 28ZM14 28L22 28L22 36L14 36L14 28ZM28 36L28 28L36 28L36 36L28 36Z"/></svg></div>
    <div class="usf-view usf-list" :class="{'usf-active': view === 'list'}" @click="onListViewClick"><svg role="presentation" viewBox="0 0 18 18"><path d="M8 1.030067h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1zm-7-15h2c.55228475 0 1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1H1c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .44771525 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1z" fill="currentColor"></path></svg></div>
</div>`
/*inc_end_search-views*/;

var _usfSearchResultsSortByTpl = /*inc_begin_search-sortby*/
    `<usf-dropdown :value="sortBy" :options="sortByOptions" @input="onSortByChanged"></usf-dropdown>`
/*inc_end_search-sortby*/;

usf.templates = {
    // application
    app: /*inc_begin_app*/
        `<div id="usf_container" class="usf-zone usf-clear" :class="{'usf-filters-horz': usf.settings.filters.horz}">
    <usf-filters></usf-filters>
    <usf-sr></usf-sr>
</div>`
/*inc_end_app*/,

    // search results
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
    <div v-if="!usf.isMobile" class="description-box" style="padding: 15px"></div>
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
    <div class="usf-sr-config" v-else style="clear: both">
        ` + _usfSearchResultsSummaryTpl + _usfSearchResultsSortByTpl + _usfSearchResultsViewsTpl + `
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && !result.extra.banner.isBottom" :banner="result.extra.banner"></usf-sr-banner>

    <div :class="(view === \'grid\' ? \'clearfix\' : \'list-view-items\') + \' usf-results product-grid usf-clear usf-\' + view">
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
    // Grid view item
    searchResultsGridViewItem: `
<div class="product-item showed columns small-12 medium-6 large-4" :data-tags="_usfGetDataTag(product.tags)" :data-vendor="product.vendor" :data-type="product.productType" :data-price="price">
  <div class="image-wrapper" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave">
      `+ _usfProductLables + `
      <!--badges-->
      `+ _usfProductBadges + `
      <a :href="productUrl" >
          <img :src="selectedImageUrl" :alt="product.title"  >
          <!-- Wishlist -->
          <usf-plugin name="searchResultsProductWishList" :data="pluginData"></usf-plugin>
          <!-- Labels -->
          <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
          <!-- product image extra -->
          <usf-plugin name="searchResultsProductImageExtra" :data="pluginData"></usf-plugin>
      </a>
  </div>
  <div class="caption">
    <!--vendor-->
      <p v-if="_usfGlobalSettings.show_vendor && usf.settings.search.showVendor" class="vendor">
        <a :href="usf.platform.baseUrl + '/collections/vendors?q=' + encodeURIComponent(product.vendor)" v-html="product.vendor" :title="product.vendor" v-html="product.vendor"></a>
      </p>
      <!--title-->
      <p class="title">
          <a :href="productUrl" v-html="product.title"></a>
      </p>

      <p v-if="product.productType" class="type" v-html="product.productType"></p>

      <p v-if="(_weight = usf.utils.getMetafield(product,'global','product-weight'))" class="weight" v-html="_weight"></p>
      <p v-else class="weight">&nbsp;</p>

      <!--price-->
      `+ _usfProductPrice +`
      <!--per-unit-->
      <p v-if="(_per_unit = usf.utils.getMetafield(product,'global','product-price-per-unit'))" class="per-unit" v-html="_per_unit + ' per unit '"></p>
      <p v-else class="per-unit">&nbsp;</p>

      <!-- REVIEWS -->
      <div class="cart cart-product-grid" v-if="(_data = _usfGetFormData(product.variants,selectedVariantForPrice.id))">
          <form action="/cart/add" method="post">
              <div class="opt-wrap">
                  <template v-if="product.variants.length > 1">
                    <usf-product-option v-if="product.options[1]" :option="product.options[1]" :variants="product.variants"></usf-product-option>
                  </template>
                  <div  :class="'option-wrapper qty-option-wrapper columns small-12 large-12 qty-wrapper-' + (product.variants.length > 1 ? 'multiple' : 'single')">
                      <input type="number" id="quantity" name="quantity" min="1" max="1000" class="quantity-selector" :value="_data.qtyStep">
                  </div>
              </div>
              <input type="hidden" name="id" id="product-select" :value="_data ? _data.variantToAdd : product">
              <button type="submit" name="add" id="addToCart" class="button expand" :disabled="isSoldOut">
                  <span id="addToCartText" :data-in-cart="!isSoldOut ? product.id : false" v-html="isSoldOut ?loc.soldOut :loc.addToCart"></span>
              </button>
          </form>
      </div>
  </div>
</div>
`,
    // Search result pages
    searchResultsPages: `
<center>
    <ul class="usf-sr-pages">
        <template v-for="e in elements">
            <li v-if="e.type === 'prev'" class="usf-sr-pages__prev"><a href="javascript:void(0)" :title="loc.prevPage" @click="onPrev" style="font-size:14px">←</a></li>
            <li v-else-if="e.type === 'dots'" class="usf-sr-pages__dots"><span>...</span></li>
            <li v-else-if="e.type === 'page' && e.current" class="usf-sr-pages__page usf-active"><span>{{e.page}}</span></li>
            <li v-else-if="e.type === 'page' && !e.current" class="usf-sr-pages__page"><a href="javascript:void(0)" @click="e.current ? null : onPage(e.page)" :title="usf.utils.format(loc.gotoPage,e.page)">{{e.page}}</a></li>
            <li v-else-if="e.type === 'next'" class="usf-sr-pages__next"><a href="javascript:void(0)" :title="loc.nextPage" @click="onNext" style="font-size:14px">→</a></li>
        </template>
    </ul>
</center>
`,
    // List view item
    searchResultsListViewItem: `
<a class="usf-sr-product list-view-item product-item" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" :href="productUrl" :key="product.id">
    <!-- Image column -->
    <div class="list-view-item__image-column">
        <div class="list-view-item__image-wrapper">
            <img class="list-view-item__image" :src="imageUrl">
            `+ _usfProductLables+`
        </div>
    </div>

    <!-- Title and Vendor column -->
    <div class="list-view-item__title-column">
        <div class="list-view-item__title" v-html="product.title"></div>
        <div class="list-view-item__vendor medium-up--hide" v-html="product.vendor"></div>
    </div>

    <!-- Vendor, for mobile -->
    <div class="list-view-item__vendor-column small--hide">
        <div v-if="usf.settings.search.showVendor" class="list-view-item__vendor" v-html="product.vendor"></div>
    </div>

    <!-- Prices -->
    <div class="list-view-item__price-column caption">
        `+ _usfProductPrice+`
    </div>
</a>
`,
    // AddToCart Plugin	
    addToCartPlugin: /*inc_begin_addtocart-plugin*/
        ``
/*inc_end_addtocart-plugin*/,

    // Preview Plugin
    previewPlugin: /*inc_begin_preview-plugin*/
        `<div class="usf-sr-preview" :class="{'usf-visible': args.isHover}" @click="onShowModal">
    <div><svg style="width:initial;height:initial" viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><g transform="translate(0.000000,281.000000) scale(0.100000,-0.100000)"><path d="M4808.6,2770.8c-1219.3-67-2423.2-610.6-3684.6-1659.5C884.8,912.3,100,140.9,100,104.6c0-34.4,794.3-819.2,1004.9-993.4c1138.9-941.7,2195.4-1468.1,3273-1630.8c306.3-45.9,821.1-55.5,1110.2-19.1C6663.3-2391.4,7832.8-1807.6,9023.4-774C9274.1-553.9,9900,73.9,9900,108.4c0,30.6-803.9,823-1004.9,989.6c-1098.7,909.2-2151.4,1445.1-3177.3,1617.4c-189.5,32.5-625.9,70.8-735,65.1C4944.5,2778.5,4866,2774.7,4808.6,2770.8z M5497.7,2296.2c1181-158.9,2425.1-846,3590.8-1983l212.5-206.7l-231.6-225.9c-1158-1135-2434.7-1829.8-3629.1-1977.2c-227.8-26.8-700.5-23-937.9,7.7c-417.3,57.4-851.8,181.8-1282.4,369.4C2452.4-1384.6,1543.2-743.4,865.6-60L702.9,104.6l172.3,174.2c509.1,513,1248,1075.7,1856.6,1410.7c562.7,310.1,1196.3,530.2,1751.4,606.8C4728.2,2330.6,5250.7,2330.6,5497.7,2296.2z"/><path d="M4670.8,1855.9c-671.8-128.2-1213.5-633.6-1397.3-1307.3c-59.3-212.5-59.3-675.7,0-888.1c172.3-625.9,654.6-1110.2,1276.7-1280.5c222-61.3,677.6-61.3,899.6,0c622.1,170.3,1104.4,654.6,1276.7,1280.5c59.3,212.5,59.3,675.7,0,888.1c-172.3,627.8-662.3,1117.8-1276.7,1280.5C5246.9,1880.8,4875.6,1894.2,4670.8,1855.9z M5373.2,1387c233.5-72.7,386.6-166.5,566.6-344.5c268-266.1,388.6-557,388.6-937.9c0-379-120.6-669.9-390.5-937.9c-268-269.9-558.9-390.5-937.9-390.5c-241.2,0-386.6,34.4-612.5,145.5c-130.2,63.2-195.2,111-325.4,243.1c-273.7,275.6-392.4,557-392.4,939.8c0,382.8,118.7,664.2,392.4,937.9c210.5,212.5,436.4,331.1,723.5,382.8C4929.2,1452.1,5222,1432.9,5373.2,1387z"/><path d="M4818.2,508.4c-283.3-132.1-348.4-509.1-122.5-723.5c281.4-266,744.6-68.9,744.6,319.7c0,179.9-109.1,342.6-271.8,409.6C5072.7,554.4,4912,552.4,4818.2,508.4z"/></g></svg></div>
    <span v-html="loc.quickView"></span>
</div>`
/*inc_end_preview-plugin*/,

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

var _usfPriceWithUnit = function(p,displayDiscountedPrice){
    var product_unit = usf.utils.getMetafield(p,'global','product-weight');

    if(!p.variants[1] || product_unit == '')
        return displayDiscountedPrice;
    var price = p.variants[1].price;
    var unit = _usfSplitByText(product_unit," ");
    var newPrice = parseInt(unit)*price;
    return usf.utils.getDisplayPrice(newPrice)
}
function _usfSplitByText(desc, txt,first = true) {
    return first ? desc.slice(0,desc.indexOf(txt)) + description_words : desc.slice(desc.indexOf(txt) + txt.length,desc.length) + description_words
}
function _usfGetDataTag(tags) {
    return tags.join('|')
}

function _usfGetFormData(variants,variantSelectedId) {
    var obj = {
        qtyStep: 1,
        variantToAdd: variantSelectedId
    };
    for (let i = 0; i < variants.length; i++) {
        var variant = variants[i];
        var vTitle = _variantTitle(variant.options);
        if (vTitle.includes('16pk')) {
            obj = {
                qtyStep: 16,
                variantToAdd: variant.id
            };
            break;
        } else if (vTitle.includes('12pk')) {
            obj = {
                qtyStep: 12,
                variantToAdd: variant.id
            };
            break;
        } else if (vTitle.includes('8pk')) {
            obj = {
                qtyStep: 8,
                variantToAdd: variant.id
            };
            break;
        }
    };
    return obj
}

var _variantTitle = function (options) {
    return options.join(' / ');
}

function _usfCheckInCart(){
    $.getJSON("/cart.js", function (t) {
        if (t.items) {
            t.items.filter(item => {
                $(`button [data-in-cart="${item.product_id}"]`).html(`${item.quantity} in cart`)
            })
        }
    })
}

/*inc_begin_init-example*/
usf.event.add('init', function () {
    // register or override components
    // ...    
    /*var SearchResultsGridItem2 = {
        template: usf.templates.searchResultsGridViewItem,
    }
    usf.register(SearchResultsGridItem2, usf.components.SearchResultsGridItem, "usf-sr-griditem");*/
    var nodes = document.head.children;
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (n.href && n.href.indexOf('style.css') != -1) {
            usfAssetUrl = n.href.split('style.css')[0];
        }
    }

    window._usfBudderIcon = window._usfBudderIcon || `<img src="${usfAssetUrl}Icon-Budder.svg?" alt="" />`;
    window._usfDiamondsIcon = window._usfDiamondsIcon || `<img src="${usfAssetUrl}Icon-Diamonds.svg?" alt="" />`;
    window._usfSauceIcon = window._usfSauceIcon || `<img src="${usfAssetUrl}Icon-Sauce.svg.svg?" alt="" />`;
    window._usfVapeIcon = window._usfVapeIcon || `<img src="${usfAssetUrl}Icon-Vape.svg.svg?" alt="" />`;
    window._usfFlowerIcon = window._usfFlowerIcon || `<img src="${usfAssetUrl}Icon-Flower.svg.svg?" alt="" />`;

    usf.event.add(['sr_updated', 'sr_viewChanged', 'rerender'], function () {
        setTimeout(function () {
            Shopify.AjaxifyCart.init();
            _usfCheckInCart();
            $(".description-box").append($(".collection-title-container")).append($(".description"))
        }, 100);
    });


    var usfProductOption = {
        props: {
            option: Object,
            variants: Array
        },
        data() {
            return {
                optionRendered: {}
            }
        },
        created: function () {

        },
        methods: {

        },

        render(h) {
            if (this.option) return h('div', { class: `option-wrapper columns small-12 large-4` }, [
                h('select', {
                    attrs: {
                        id: 'select-two',
                        onchange: 'letsDoThis()'
                    }
                }, [
                    h('option', {
                        attrs: {
                            value: "",
                            disabled: "disabled",
                            selected: "selected",
                            hidden:"hidden"
                        }
                    }, [this.option.name]),

                        this.variants.map(v => {
                            var vrOption2 = v.options[1];
                            if (vrOption2 && !this.optionRendered[vrOption2]) {
                                this.optionRendered[vrOption2] = 1;
                                return h('option', { attrs: { value: vrOption2 } }, [vrOption2])
                            }
                        })

                ])
            ])
        }
    }
    usf.register(usfProductOption, null, 'usf-product-option');
});
/*inc_end_init-example*/