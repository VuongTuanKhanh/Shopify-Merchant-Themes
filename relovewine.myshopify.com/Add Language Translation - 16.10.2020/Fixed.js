// Check translated: usf.filterTranslations

/*usf_filter_translations */
if(window.usf_filter_translations){
    var jsStr = usf_filter_translations.innerHTML;
    try{
        usf.filterTranslations = JSON.parse(jsStr);
    }catch(e){

    }
 }


function _usfGetFacetTitleTran(title){
    if(!usf.filterTranslations)
        return title;

    var key = keyHandle(title);
        if(usf.filterTranslations[key])
            return usf.filterTranslations[key].label;
        else 
            return title;
}
function _usfGetFacetValueLabelTran(facetTitle,valueLabel){
    if(!usf.filterTranslations)
        return valueLabel;
    var originVal = valueLabel;
    var val = originVal.replace(/<[^>]*>?/gm, '');
    var facetKey = keyHandle(facetTitle);
    var valueKey = keyHandle(val);
  
    if(usf.filterTranslations[facetKey] && usf.filterTranslations[facetKey].value && usf.filterTranslations[facetKey].value[valueKey]){
        var newVal = usf.filterTranslations[facetKey].value[valueKey]
        return originVal.replace(val,newVal);
    }else
        return valueLabel;
}

var keyHandle = function (l) {
    return l ? l.toLowerCase().replace(/[\s\/]/g, '_')
    .replace(/---/g, '_')
    .replace(/--/g, '_')
    .replace(/&/g, '_')
    .replace(/\(/g, '_')
    .replace(/\)/g, '_')
    .replace(/\+/g, '_')
    .replace(/amp;/g, '')
    .replace(/,/g, '_')
    .replace(/'/g, '_')
    .replace(/™/g, '_')
    .replace(/\./g, '_')
    .replace(/ö/g, 'o')
    .replace(/ß/g, 'b')
    .replace(/ü/g, 'u') 
    .replace(/ä/g, 'a')
    .replace(/á/g, 'a')
    .replace(/â/g, 'a')
    .replace(/%/g, 'percent')
    .replace(/è/g, 'e')
    .replace(/ê/g, 'e')
    .replace(/é/g, 'e')
    .replace(/\?/g, '_')
    .replace(/€/g, '_')
     : ''
}

// default values when no section settings specified.
var _usfImageWidths = [200, 400, 600, 700, 800, 900, 1000, 1200];

if (!window._usfSettingCollection)
    window._usfSettingCollection = {};

if (!_usfSettingCollection.mobile_items_per_row)
    Object.assign(_usfSettingCollection, {
        mobile_items_per_row: 2,
        tablet_items_per_row: 3,
        desktop_items_per_row: 4,
    })

var usfDefaultThemeSettings = {
    filterPosition: 'drawer',
    product_image_size: 'withFallback',
    show_price_on_hover: true,
    show_collection_info: true,

    mobile_items_per_row: 2,
    tablet_items_per_row: 3,
    desktop_items_per_row: 4,
};

for (var k in _usfSettingCollection) {
    var val = _usfSettingCollection[k];
    if (val === null || val === undefined)
        _usfSettingCollection[k] = usfDefaultThemeSettings[k]
}

function usfGetAspectRatio(image) {
    if (image && image.height)
        return image.width / image.height;

    return 0.75;
}

function ft_parseFacetFilters() {
    // parse the facet filters
    var entries = usf.query.get('_usf_f');

    return entries ? JSON.parse(entries) : null;
}


function _usfGetSettingColorSwatch() {
    if (_usfSettingCollection.current_page !== 'collection') {
        return true; // if search page
    } else {
        return _usfSettingCollection.colorSwatch;
    }
}

function _usfGetPaddingBottom(image){
    if (window._usfSettingCollection.use_natural_size){
        return `padding-bottom: ${100/usfGetAspectRatio(image)}%`
    }
    return ''
}


// define templates for the Prestige theme
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
<div v-if="view === 'grid'" class="Grid__Cell 1/${_usfSettingCollection.mobile_items_per_row}--phone 1/${_usfSettingCollection.tablet_items_per_row}--tablet-and-up 1/${_usfSettingCollection.desktop_items_per_row}--desk usf-skeleton">
    <div class="ProductItem grid-view-item" v-if="true">
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


var updateSRposition = function (e) {
    var sr = document.getElementById('usf-sr-summary-temp');
    var newSR = document.getElementById('usf_searchTotal');
    if (newSR) {
        newSR.innerHTML = '';
        if (sr)
            newSR.insertAdjacentElement('beforeEnd', sr);
    } else {
        if (sr){
            sr.parentNode.removeChild(sr);
        }
    }
}

usf.templates = {
    app: `
<div id="usf_container" class="usf-zone usf-clear" :class="{'usf-filters-horz': usf.settings.filters.horz}">
    <usf-new-filters-barv2></usf-new-filters-barv2>
    <div>
        <usf-filters v-if="usf.settings.filters.horz"></usf-filters>            
    </div>
    <div class="CollectionInner">
        <block-filter-v2 v-if="!usf.settings.filters.horz"></block-filter-v2>
        <div class="CollectionInner__Products">
            <usf-sr></usf-sr>
        </div>
    </div>
</div>
`,

    searchResults: `
<div class="usf-sr-container ProductListWrapper" :class="{'usf-no-facets': noFacets, 'usf-empty': !loader && !hasResults, 'usf-nosearch': !showSearchBox}">
    <!-- Search form -->
    <div class="ProductList ProductList--grid">
        <form v-if="showSearchBox" action="/search" method="get" role="search" class="usf-sr-inputbox">
            <input name="q" autocomplete="off" ref="searchInput" v-model="termModel">
            <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                    <circle class="usf-path" cx="10.981" cy="10.982" r="9.786"></circle>
                    <line class="usf-path" x1="23.804" y1="23.804" x2="17.902" y2="17.901"></line>
                </svg>
            </button>
            <span v-if="termModel" class="usf-remove" @click="clearSearch"></span>
        </form>
    </div>
    
    <usf-sr-banner v-if="result && result.extra && result.extra.banner && !result.extra.banner.isBottom"
        :banner="result.extra.banner"></usf-sr-banner>
    <span class="usf-sr-summary" id="usf-sr-summary-temp" :load="updateSRposition()" v-html="loader === true ? '&nbsp;' : usf.utils.format(term ? loc.productSearchResultWithTermSummary : loc.productSearchResultSummary, result.total, term)"></span>

    <div
        :class="(view === \'grid\' ? \'ProductList ProductList--grid ProductList--removeMargin Grid\' : \'list-view-items\') + \' usf-results prestige-usf-\' + view">
        <template v-if="loader===true">` + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl +
        _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl +
        `</template>
        <template v-else>
            <template v-if="loader === true || hasResults">
                <template v-if="view === 'grid'">
                    <template v-for="p in result.items">
                        <usf-sr-griditem :product="p" :result="result"></usf-sr-griditem>
                    </template>
                </template>
                <template v-else>
                    <template v-for="p in result.items">
                        <usf-sr-listitem :product="p" :result="result"></usf-sr-listitem>
                    </template>
                </template>
            </template>
            <template v-else>
                <!-- Empty result -->
                <div class="EmptyState">
                    <div class="Container">
                        <h1 class="EmptyState__Title Heading u-h5">
                            <span v-html="term ? usf.utils.format(loc.productSearchNoResults, term) : loc.productSearchNoResultsEmptyTerm"></span>
                        </h1>
                    </div>
                </div>
            </template>
        </template>
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && result.extra.banner.isBottom"
        :banner="result.extra.banner"></usf-sr-banner>

    <!-- Paging & load more -->
    <div class="usf-sr-paging" v-if="loader !== true">
        <div class="usf-sr-loader" v-if="loader === 'more'">
            <div class="usf-spinner"></div>
        </div>

        <div class="usf-sr-more" v-else-if="hasResults && usf.settings.search.more === 'more'">
            <div class="usf-title" v-html="usf.utils.format(loc.youHaveViewed, itemsLoaded, result.total)"></div>
            <div class="usf-progress">
                <div :style="{width: (itemsLoaded * 100 / result.total) + '%'}"></div>
            </div>
            <div v-if="itemsLoaded < result.total" class="usf-load-more" @click="onLoadMore" v-html="loc.loadMore">
            </div>
        </div>
        <usf-sr-pages v-else-if="hasResults && usf.settings.search.more === 'page'" :page="page" :pages-total="pagesTotal" :pages-to-display="4" :side-pages-to-display="1"></usf-sr-pages>
    </div>
</div>
`,

    searchResultsGridViewItem: `
<div class="usf-sr-product Grid__Cell 1/${_usfSettingCollection.mobile_items_per_row}--phone 1/${_usfSettingCollection.tablet_items_per_row}--tablet-and-up 1/${_usfSettingCollection.desktop_items_per_row}--desk" :key="product.Id"
    :product-selector="product.id">
    <div class="ProductItem" style="visibility: inherit; opacity: 1; transform: matrix(1, 0, 0, 1, 0, 0);">
        <div class="ProductItem__Wrapper">
	        <a :href="productUrl" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" class="ProductItem__ImageWrapper" :class="{'ProductItem__ImageWrapper--withAlternateImage':scaledHoverImageUrl}">
                <div :class="'AspectRatio AspectRatio--' + (_usfSettingCollection.use_natural_size ? 'withFallback' :_usfSettingCollection.product_image_size)" :style="'max-width: '+(image.width ? image.width : 125)+'px; --aspect-ratio: ' + usfGetAspectRatio(image)+';' + _usfGetPaddingBottom(image)">
                    <img class="ProductItem__Image ProductItem__Image--alternate Image--lazyLoad lazyautosizes Image--fadeIn" :data-widths="'[' + _usfImageWidths + ']'" data-sizes="auto" :data-srcset="_usfGetImageUrls(scaledHoverImageUrl)" v-if="scaledHoverImageUrl">
                    <img class="ProductItem__Image Image--lazyLoad lazyautosizes Image--fadeIn" :data-widths="'[' + _usfImageWidths + ']'" data-sizes="auto" :data-srcset="_usfGetImageUrls(scaledSelectedImageUrl)">

                    <span class="Image__Loader"></span>
                    
                    <!-- product image extra -->
                    <usf-plugin name="searchResultsProductImageExtra" :data="pluginData"></usf-plugin>
                </div>
            </a>
            
            <!-- Wishlist -->
            <usf-plugin name="searchResultsProductWishList" :data="pluginData"></usf-plugin>
            <!-- Labels -->
            <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
            <div class="ProductItem__LabelList">
                <span class="ProductItem__Label ProductItem__Label--onSale Heading Text--subdued" v-if="hasDiscount && !isSoldOut && usf.settings.search.showSale"><span v-html="loc.sale"></span></span>
                <span class="ProductItem__Label ProductItem__Label--soldOut Heading Text--subdued" v-if="isSoldOut && usf.settings.search.showSoldOut"><span v-html="loc.soldOut"></span></span>
            </div>

            <div class="ProductItem__Info ProductItem__Info--center">
                <!-- vendor -->
                <p class="ProductItem__Vendor Heading" v-if="usf.settings.search.showVendor"
                    :href="usf.platform.baseUrl + '/collections/vendors?q=' + encodeURIComponent(product.vendor)" v-html="product.vendor"></p>
                <!-- Title -->
                <h2 class="ProductItem__Title Heading">
                    <a :href="productUrl" :attrs="usf.plugins.invoke('getProductTitleAttrs', pluginData)"
                        v-html="product.title"></a>
                </h2>
                <div class="ProductItem__PriceList Heading" :class="{'price--sold-out': isSoldOut,'ProductItem__PriceList--showOnHover':_usfSettingCollection.show_price_on_hover}"  v-if="!usf.plugins.lastRenderResult">
                    <span
                        class="ProductItem__Price Price Price--highlight Text--subdued"
                        v-html="displayDiscountedPrice" v-if="hasDiscount"></span>

                    <span class="ProductItem__Price Price Text--subdued"
                    v-html="displayPrice" :class="{'Price--compareAt': hasDiscount}"></span>
                </div>

                <!-- Product color swatch -->
                <usf-color-swatch :product="product" :selectedImageUrl="selectedImageUrl" :productUrl="productUrl" v-if="_usfGetSettingColorSwatch()"></usf-color-swatch>

                <!-- Product review -->
                <div class="usf-review-plugin">
                    <usf-plugin name="searchResultsProductReview" :data="pluginData"></usf-plugin>
                </div>
            </div>
        </div>
    </div>
</div>`,

    // Search result pages
    searchResultsPages: `
<center>
<div class="Pagination__Nav">
    <template v-for="e in elements">
        <a v-if="e.type === 'prev'" href="javascript:void(0)" :title="loc.prevPage" @click="onPrev" class="Pagination__NavItem Link Link--primary" rel="prev"><svg class="Icon Icon--select-arrow-left" role="presentation" viewBox="0 0 11 18"><path d="M9.5 1.5L1.5 9l8 7.5" stroke-width="2" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="square"></path></svg></a>
        <span v-else-if="e.type === 'dots'" class="Pagination__NavItem">…</span>
        <span v-else-if="e.type === 'page' && e.current" class="Pagination__NavItem is-active">{{e.page}}</span>
        <a v-else-if="e.type === 'page' && !e.current" class="Pagination__NavItem Link Link--primary" href="javascript:void(0)" @click="onPage(e.page)" :title="usf.utils.format(loc.gotoPage,e.page)">{{e.page}}</a>
        <a v-if="e.type === 'next'" href="javascript:void(0)" :title="loc.nextPage" @click="onNext" class="Pagination__NavItem Link Link--primary" rel="next"><svg class="Icon Icon--select-arrow-right" role="presentation" viewBox="0 0 11 18"><path d="M1.5 1.5l8 7.5-8 7.5" stroke-width="2" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="square"></path></svg></a>
    </template>
</div>
</center>
`,

    searchResultsListViewItem: `
<a class="usf-sr-product list-view-item" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave"
    :href="productUrl" :key="product.id">
    <!-- Image column -->
    <div class="list-view-item__image-column">
        <div class="list-view-item__image-wrapper">
            <img class="list-view-item__image" :src="imageUrl">
        </div>
    </div>

    <!-- Title and Vendor column -->
    <div class="list-view-item__title-column">
        <h2 class="ProductItem__Title Heading" v-html="product.title"></h2>
        <div class="ProductItem__Vendor Heading medium-up--hide" v-html="product.vendor"></div>
    </div>

    <!-- Vendor, for mobile -->
    <div class="list-view-item__vendor-column small--hide">
        <div v-if="usf.settings.search.showVendor" class="list-view-item__vendor" v-html="product.vendor"></div>
    </div>

    <!-- Prices -->
    <div class="list-view-item__price-column">
        <div class="usf-price product-price__price" :class="{'usf-has-discount': hasDiscount}"
            v-html="displayPrice"></div>
        <div class="usf-discount product-price__price product-price__sale" v-if="hasDiscount"
            v-html="displayDiscountedPrice"></div>
    </div>
</a>
`,
    // AddToCart Plugin
    addToCartPlugin: `
<form class="usf-add-to-cart" method="POST" enctype="multipart/form-data" :action="usf.platform.addToCartUrl" @submit="_usfFormSubmit(event)">
    <input type="hidden" name="form_type" value="product">
    <input type="hidden" name="utf8" value="✓">
    <input type="hidden" name="quantity" value="1">
    <input type="hidden" name="id" :value="variant.id">
    <button type="submit" name="add" :class="{'usf-visible': args.isHover}" class="usf-add-to-cart-btn"  v-html="loc.addToCart"></button>
</form>
`,
    // Preview Plugin
    previewPlugin: `
<div class="usf-sr-preview" :class="{'usf-visible': args.isHover}" @click="onShowModal">
    <div><svg style="width:initial;height:initial" viewBox="0 0 1000 1000" version="1.1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">
            <g transform="translate(0.000000,281.000000) scale(0.100000,-0.100000)">
                <path
                    d="M4808.6,2770.8c-1219.3-67-2423.2-610.6-3684.6-1659.5C884.8,912.3,100,140.9,100,104.6c0-34.4,794.3-819.2,1004.9-993.4c1138.9-941.7,2195.4-1468.1,3273-1630.8c306.3-45.9,821.1-55.5,1110.2-19.1C6663.3-2391.4,7832.8-1807.6,9023.4-774C9274.1-553.9,9900,73.9,9900,108.4c0,30.6-803.9,823-1004.9,989.6c-1098.7,909.2-2151.4,1445.1-3177.3,1617.4c-189.5,32.5-625.9,70.8-735,65.1C4944.5,2778.5,4866,2774.7,4808.6,2770.8z M5497.7,2296.2c1181-158.9,2425.1-846,3590.8-1983l212.5-206.7l-231.6-225.9c-1158-1135-2434.7-1829.8-3629.1-1977.2c-227.8-26.8-700.5-23-937.9,7.7c-417.3,57.4-851.8,181.8-1282.4,369.4C2452.4-1384.6,1543.2-743.4,865.6-60L702.9,104.6l172.3,174.2c509.1,513,1248,1075.7,1856.6,1410.7c562.7,310.1,1196.3,530.2,1751.4,606.8C4728.2,2330.6,5250.7,2330.6,5497.7,2296.2z" />
                <path
                    d="M4670.8,1855.9c-671.8-128.2-1213.5-633.6-1397.3-1307.3c-59.3-212.5-59.3-675.7,0-888.1c172.3-625.9,654.6-1110.2,1276.7-1280.5c222-61.3,677.6-61.3,899.6,0c622.1,170.3,1104.4,654.6,1276.7,1280.5c59.3,212.5,59.3,675.7,0,888.1c-172.3,627.8-662.3,1117.8-1276.7,1280.5C5246.9,1880.8,4875.6,1894.2,4670.8,1855.9z M5373.2,1387c233.5-72.7,386.6-166.5,566.6-344.5c268-266.1,388.6-557,388.6-937.9c0-379-120.6-669.9-390.5-937.9c-268-269.9-558.9-390.5-937.9-390.5c-241.2,0-386.6,34.4-612.5,145.5c-130.2,63.2-195.2,111-325.4,243.1c-273.7,275.6-392.4,557-392.4,939.8c0,382.8,118.7,664.2,392.4,937.9c210.5,212.5,436.4,331.1,723.5,382.8C4929.2,1452.1,5222,1432.9,5373.2,1387z" />
                <path
                    d="M4818.2,508.4c-283.3-132.1-348.4-509.1-122.5-723.5c281.4-266,744.6-68.9,744.6,319.7c0,179.9-109.1,342.6-271.8,409.6C5072.7,554.4,4912,552.4,4818.2,508.4z" />
            </g>
        </svg></div>
    <span v-html="loc.quickView"></span>
</div>
`,
    previewPluginModal: `
<div class="usf-preview__wrapper usf-zone">
    <div class="usf-backdrop"></div>
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
                    <span class="usf-price product-price__price" :class="{'usf-has-discount': hasDiscount}" v-html="usf.utils.getLongDisplayPrice(selectedVariant.compareAtPrice || selectedVariant.price)"></span>
                    <span v-if="hasDiscount" class="usf-discount product-price__price product-price__sale" v-html="usf.utils.getLongDisplayPrice(selectedVariant.price)"></span>

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
                    <span v-html="_usfGetFacetTitleTran(facetTitle) + ': '"></span><b v-html="_usfGetFacetValueLabelTran(facetTitle,root.formatBreadcrumbLabel(facet, f[0], queryValStr))"></b><span class="usf-remove"></span>
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
                <div class="usf-title" @click="onMobileBack(0)" v-html="_usfGetFacetTitleTran(facets[0].title)"></div>
                <div v-if="facetFilters" class="usf-clear" @click="removeAllFacetFilters" v-html="loc.clear"></div>
            </template>

            <!-- When a filter is selected -->
            <template v-else-if="mobileSelectedFacetTitle">
                <div class="usf-title usf-back" @click="onMobileBack(0)" v-html="_usfGetFacetTitleTran(mobileSelectedFacetTitle)"></div>
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
                        <span class="usf-title" v-html="_usfGetFacetTitleTran(f.title)"></span>
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
                <span class="usf-label" v-html="_usfGetFacetTitleTran(facet.title)"></span>
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
    <span class="usf-label" v-html="_usfGetFacetValueLabelTran(facet.title,label)" @click="onToggle"></span>

    <!-- product count -->
    <span v-if="!(!usf.settings.filterNavigation.showProductCount || (swatchImage && !usf.isMobile)) && option.value !== undefined" class="usf-value">{{option.value}}</span>    

    <div class="usf-children-container" v-if="children && !collapsed">
        <span class="usf-child-item usf-facet-value" v-for="c in children" v-html="getChildLabel(c)" @click="onChildClick(c)"></span>
    </div>
</div>
<div v-else :class="(isSelected ? 'usf-selected ' : '') + (swatchImage ? ' usf-facet-value--with-background' : '') + (' usf-relative usf-facet-value usf-facet-value-' + (facet.multiple ? 'multiple' : 'single'))" :title="isSwatch || isBox ? _usfGetFacetValueLabelTran(facet.title,option.label) + ' (' + option.value + ')' : undefined" :style="usf.isMobile ? null : swatchStyle" @click="onToggle">
    <!-- checkbox -->
    <div v-if="!isBox && !isSwatch && facet.multiple" :class="'usf-checkbox' + (isSelected ? ' usf-checked' : '')">
        <span class="usf-checkbox-inner"></span>
    </div>

    <!-- swatch image in mobile -->
    <div v-if="swatchImage && usf.isMobile" class="usf-mobile-swatch" :style="swatchStyle"></div>

    <!-- option label -->
    <span class="usf-label" v-html="_usfGetFacetValueLabelTran(facet.title,label)"></span>

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

var usfImages = {}
function usfImageExists(url, callback) {
    var v = usfImages[url];
    if (v !== undefined) {
        callback(v);
        return v;
    }

    var img = new Image();
    img.onload = function () {
        usfImages[url] = true;
        callback(true);
    };

    img.onerror = function () {
        usfImages[url] = false;
        callback(false);
    };

    img.src = url;
}

var usfFilesUrl;

usf.event.add('init', function () {
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

    const addEvent = function (object, type, callback) {
        if (object == null || typeof (object) == 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent("on" + type, callback);
        } else {
            object["on" + type] = callback;
        }
    };

    // added 21/07/2020 , auto close searchbar after press enter
    var Search__Form = document.querySelector('.Search__Form')
    var Search__Close = document.querySelector('.Search__Close')
    if (Search__Form) {
        addEvent(Search__Form, 'keyup', function (e) {
            if (e.keyCode === 13) {
                if (!usf.isMobile && Search__Close)
                    Search__Close.click()
            }

        })
    }	

    function insertAfter(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }

    const USF_Fragment = {
        install(RVue) {
            // install the teleporter
        RVue.directive('fragment', {
          inserted(element) {
            const fragment = document.createDocumentFragment();
              Array.from(element.childNodes).forEach(child => fragment.appendChild(child));
            element.parentNode.insertBefore(fragment, element);
            element.parentNode.removeChild(element);
          }
        })
    
    
        RVue.component('vue-fragment', {
          template: `<div v-fragment><slot /></div>`
        })
      }
    }
    RVue.use(USF_Fragment);

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
                show: false,
                pageOverlayElement : null
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
                    console.log(e);
                    return "";
                }
            }
        },
        watch:{
            show(v){
                var root = document.documentElement;
                if (v){
                    if (usf.isMobile) this.pageOverlayElement.classList.add('is-visible');
                    root.classList.add('no-scroll');
                    this.pageOverlayElement.addEventListener('click', this._closeListener);

                }else{
                    if (usf.isMobile) this.pageOverlayElement.classList.remove('is-visible');
                    root.classList.remove('no-scroll');
                    this.pageOverlayElement.removeEventListener('click', this._closeListener);
                }
            }
        },
        methods: {
            toggleDropdown() {
                this.show = !this.show;
            },
            pickSortValue(e, v) {
                // e.stopPropagation();
                // e.preventDefault();
                this.model = v;
                this.show = false;
                // this.toggleDropdown()
                if (v)
                    usf.query.add({ _usf_sort: v });
                else
                    usf.query.remove('_usf_sort');
            },
            _closeListener(){
                this.show = false;
                this.pageOverlayElement.classList.remove('is-visible');
            }
        },
        mounted(){
            this.pageOverlayElement = document.querySelector('.PageOverlay');
   
            var dropdown = document.getElementById('collection-sort-popoverv2');
            var main_section = document.getElementById('_usf_prestige_main')
            var usf_new_sortbtn = document.getElementById('usf-new-sortbtn');
            if (usf.isMobile && main_section){
                main_section.insertBefore(dropdown,main_section.firstChild);
            }

            usf.event.add('mobile_changed', () => {
                if (main_section) {
                    if (usf.isMobile) main_section.insertBefore(dropdown,main_section.firstChild);
                    else {
                        if (usf_new_sortbtn) insertAfter(dropdown,usf_new_sortbtn)   
                    }
                }
            });
        },
        render(h) {
            var vm = this;
            return h('vue-fragment',[
                h('button', {
                    class: 'CollectionToolbar__Item CollectionToolbar__Item--sort Heading Text--subdued u-h6 usf-new-sortbtn',
                    attrs: {
                        'aria-label': "Show sort by",
                        'aria-haspopup': "true",
                        'aria-expanded': (this.show === true ? "true" : "false"),
                        'aria-controls': "collection-sort-popoverv2",
                        id:'usf-new-sortbtn',
                    },
                    on: {
                        click: this.toggleDropdown
                    }
                }, [
                        h('span', this.labelFromValue),
                        h('svg', {
                            class: 'Icon Icon--select-arrow',
                            attrs: {
                                role: "presentation",
                                viewBox: "0 0 19 12"
                            },
                            domProps: {
                                innerHTML: `<polyline fill="none" stroke="currentColor" points="17 2 9.5 10 2 2" fill-rule="evenodd" stroke-width="2" stroke-linecap="square"></polyline>`
                            }
                        }),
                    ]
                ),
                    h("div", {
                        class: "Popover Popover--alignRight Popover--positionBottom usf-new-sort-popover",
                        attrs: {
                            "id": "collection-sort-popoverv2",
                            "aria-hidden": (this.show === true ? "false" : "true")
                        }
                    }, [
                            h('div', {
                                class: 'Popover__Header'
                            }, [
                                    h('button', {
                                        class: 'Popover__Close Icon-Wrapper--clickable',
                                        attrs: {
                                            'data-action': "close-popover"
                                        },
                                        on:{
                                            click: this.toggleDropdown
                                        },
                                        domProps:{
                                            innerHTML:`<svg class="Icon Icon--close" role="presentation" viewBox="0 0 16 14">
                                            <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                                          </svg>`
                                        }
                                    }),
                                    h('span', {
                                        class: 'Popover__Title Heading u-h4'
                                    },'Sort')
                                ]),
                            h("div", {
                                class: "Popover__Content"
                            }, [
                                    h('div', {
                                        class: 'Popover__ValueList',
                                        attrs: {
                                            "data-scrollable": ""
                                        }
                                    }, [
                                            this.options.map((o) => {
                                                return h('button', {
                                                    staticClass: 'Popover__Value  Heading Link Link--primary u-h6',
                                                    class: {
                                                        "is-selected": (o.value === vm.model)
                                                    },
                                                    on: {
                                                        click(e) {
                                                            vm.pickSortValue(e, o.value);
                                                        }
                                                    },
                                                    domProps: {
                                                        innerHTML: `${o.label}`
                                                    }
                                                })
                                            })
                                        ])
                                ]
                            )
                        ])
            ])
        }
    }
    usf.register(UsfDropDownV2, null, 'usf-dropdownv2');


    /*Filter */
    var newFiltersBar = {
        data() {
            return {
                view: 'grid',
                drawerFilterShow: false,
                loc: usf.settings.translation
            }
        },
        mounted() {
            var vm = this;
            if (_usfSettingCollection.filterPosition == 'drawer')
                document.body.insertBefore(this.$refs['drawerFilter'], document.body.firstChild)

            usf.event.add('mobile_changed', () => {
                if (usf.isMobile) {
                    if (vm.drawerFilterShow) {
                        vm.drawerFilterShow = false;
                        vm.forHiddenFilter();
                    }
                }
            });

            addEvent(document, "click", (event) => {
                // If the clicked element doesn't have the right selector, bail
                if (!event.target.matches('.usf-close')) return;
                // Don't follow the link
                //event.preventDefault();
                vm.drawerFilterShow = false;
                vm.forHiddenFilter();
            });
        },
        render(h) {
            return h('div', {
                class: 'CollectionToolbar CollectionToolbar--top CollectionToolbar--reverse'
            }, [
                    h('div', {
                        class: 'CollectionToolbar__Group'
                    }, [
                            h('usf-dropdownv2', {
                                props: {
                                    value: usf.query.get('_usf_sort') || usf.settings.search.sortFields.split(',')[0],
                                    options: usf.settings.search.sortFields.split(',').map(f => {
                                        return {
                                            label: usf.settings.translation['sortBy_' + f],
                                            value: f
                                        }
                                    })
                                }
                            }),
                            ((this.drawer && !usf.settings.filters.horz) || usf.isMobile) ?
                                this.renderFilterButton(h) : "",
                        ]),
                    this.renderChangeLayoutButton(h),
                    (this.drawer) ?
                        this.renderFilterDrawer(h) : "",

                ])
        },
        computed: {
            drawer() {
                return _usfSettingCollection.filterPosition == 'drawer';
            }
        },
        beforeMount() {
            this.view = usf.query.get('_usf_view', 'grid').toString();
            this.facetFilters = ft_parseFacetFilters();
        },
        methods: {
            forShowFilter() {
                document.body.classList.add('usf-lockscroll-filters')
                document.querySelector('.PageOverlay').classList.add('is-visible')
            },

            forHiddenFilter() {
                document.body.classList.remove('usf-lockscroll-filters')
                document.body.classList.remove('usf-mobile-filters')
                document.querySelector('.PageOverlay').classList.remove('is-visible')
            },

            toggledrawerFilterShow() {
                this.drawerFilterShow = !this.drawerFilterShow;

                if (!usf.isMobile) {
                    if (this.drawerFilterShow) {
                        this.forShowFilter();
                    } else {
                        this.forHiddenFilter();
                    }
                }
            },
            renderFilterDrawer(h) {
                return h('div', {
                    ref: 'drawerFilter',
                    class: 'CollectionFilters Drawer Drawer--secondary Drawer--fromRight',
                    attrs: {
                        'aria-hidden': ((this.drawerFilterShow && !usf.isMobile) ? "false" : "true"),
                        tabindex: "-1",
                        id: 'usf-collection-filter-drawer'
                    }
                }, [
                        h('header', {
                            class: 'Drawer__Header Drawer__Header--bordered Drawer__Header--center Drawer__Container'
                        }, [
                                h('span', {
                                    class: 'Drawer__Title Heading u-h4'
                                }, this.loc.filters),
                                h('button', {
                                    class: 'Drawer__Close Icon-Wrapper--clickable',
                                    attrs: {
                                        'data-action': "close-drawer",
                                        'data-drawer-id': "collection-filter-drawer",
                                        'aria-label': "Close navigation"
                                    },
                                    on: {
                                        click: this.toggledrawerFilterShow
                                    },
                                    domProps: {
                                        innerHTML: `<svg class="Icon Icon--close"
                role="presentation" viewBox="0 0 16 14">
                <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
            </svg>`
                                    }
                                })
                            ]),
                        h('div', {
                            class: 'Drawer__Content'
                        }, [
                                h('div', {
                                    class: 'Drawer__Main',
                                    attrs: {
                                        "data-scrollable": ""
                                    }
                                }, [
                                        h('div', {
                                            attrs: {
                                                id: 'usf-sf-filter-tree'
                                            }
                                        }, [
                                                h('block-filter-v1')
                                            ])
                                    ])
                            ])
                    ])
            },
            renderFilterButton(h) {
                return h('button', {
                    class: "CollectionToolbar__Item CollectionToolbar__Item--filter Heading Text--subdued u-h6",
                    attrs: {
                        "data-action": "open-drawer",
                        "data-drawer-id": "usf-collection-filter-drawer",
                        "aria-label": "Show filters"
                    },
                    on: {
                        click: this.filterTriggerClick
                    }
                }, 'Filter')
            },
            filterTriggerClick() {
                if (usf.isMobile)
                    document.body.classList.toggle('usf-mobile-filters')

                this.toggledrawerFilterShow()
            },
            onGridViewClick() {
                this.view = "grid";
                usf.query.remove('_usf_view');
                usf.event.raise('sr_viewChanged', this, 'grid');
            },

            onListViewClick() {
                this.view = "list";
                usf.query.add({ _usf_view: 'list' });
                usf.event.raise('sr_viewChanged', this, 'list');
            },
            renderChangeLayoutButton(h) {
                return h('div', {
                    class: 'CollectionToolbar__Item CollectionToolbar__Item--layout'
                }, [
                        h('div', {
                            class: 'CollectionToolbar__LayoutSwitch'
                        }, [
                                h('button', {
                                    staticClass: "CollectionToolbar__LayoutType",
                                    class: {
                                        'is-active': (this.view == 'list')
                                    },
                                    on: {
                                        click: this.onListViewClick
                                    },
                                    domProps: {
                                        innerHTML: `<svg class="Icon Icon--wall-1" viewBox="0 0 18 18" role="presentation">
                            <path d="M8 1.030067h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1zm-7-15h2c.55228475 0 1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1H1c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .44771525 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1z" fill="currentColor" fill-rule="evenodd"></path>
                          </svg>`
                                    }
                                }),
                                h('button', {
                                    staticClass: "CollectionToolbar__LayoutType",
                                    class: {
                                        'is-active': (this.view == 'grid')
                                    },
                                    on: {
                                        click: this.onGridViewClick
                                    },
                                    domProps: {
                                        innerHTML: `<svg class="Icon Icon--wall-4" role="presentation" viewBox="0 0 36 36">
                            <path fill="currentColor" d="M28 36v-8h8v8h-8zm0-22h8v8h-8v-8zm0-14h8v8h-8V0zM14 28h8v8h-8v-8zm0-14h8v8h-8v-8zm0-14h8v8h-8V0zM0 28h8v8H0v-8zm0-14h8v8H0v-8zM0 0h8v8H0V0z"></path>
                        </svg>`
                                    }
                                })
                            ])
                    ])
            }
        }
    }

    usf.register(newFiltersBar, null, 'usf-new-filters-barv2');

    // hack for pass render issue of sidebar (for draw mode)
    var blockFilterV1 = {
        props: ['show'],
        methods: {

        },
        computed: {
            showSidebar() {
                return _usfSettingCollection.filterPosition != 'sidebar';
            }
        },
        render(h) {
            return h('div', [
                h('usf-filters', {
                    class: {
                        'usf-non-sidebarFilter': this.showSidebar
                    }
                })
            ]);
        }
    }
    usf.register(blockFilterV1, null, 'block-filter-v1');
    /*End Filter */

    var _usfColorSwatch = {
        props: {
            'product': {
                type: Object,
                required: true
            },
            'selectedImageUrl': {
                type: "String"
            },
            "productUrl": {
                type: "String"
            }
        },
        computed: {
            imageOfColor() {
                try {
                    var product = this.product;
                    var variants = product.variants;
                    for (let i = 0; i < variants.length; i++) {
                        if (variants[i].options.includes(this.currentColor)) {
                            var selectedVariant = variants[i];
                            var imageIndex = selectedVariant.imageIndex;
                            if (product.images[imageIndex]) {
                                this.currentVariantId = selectedVariant.id;
                                this.currentURL = (this.productUrl + `?variant=${selectedVariant.id}`);
                                return product.images[imageIndex].url;
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                return this.selectedImageUrl;
            }
        },
        watch: {
            imageOfColor(n) {
                this.updatePreview()
            }
        },
        data() {
            var colorValues = [], defaultColor = "", currentVariantId = '';
            //Get list color
            try {
                var productOptions = this.product.options;
                for (var i = 0; i < productOptions.length; i++) {
                    var o = productOptions[i];
                    if (['Color', 'Colour'].includes(o.name)) {
                        if (o.values) colorValues = o.values.slice();
                    }
                }

            } catch (e) {
                console.log(e);
            }
            //this.colors = colorValues;

            // Get default color
            try {
                var variant = this.getVariantDefault();
                var opts = variant.options;
                for (var i = 0; i < colorValues.length; i++) {
                    var color = colorValues[i];
                    if (opts.includes(color)) {
                        defaultColor = color;
                        currentVariantId = variant.id;
                        break;
                    }
                }

            } catch (e) {
                console.log(e);
            }

            //this.currentColor = defaultColor;

            return {
                colors: colorValues,
                currentColor: defaultColor,
                currentURL: this.productUrl,
                currentVariantId: currentVariantId,

                currentBgImages: {},
            }
        },
        render(h) {
            return h('div', {
                class: 'ProductItem__ColorSwatchList'
            }, [
                    this.renderOptions(h)
                ])
        },
        methods: {
            renderOptions(h) {
                var vm = this;
                var pid = this.product.id;

                //console.log("this.currentColor : ", this.currentColor)
                return this.colors.map((c, index) => {
                    var pindex = pid + "-" + index;

                    var imageUrl = usfFilesUrl.replace('{0}', c.toLowerCase().replace(/[\s\/]/g, '-').replace(/---/g, '-').replace(/--/g, '-') + '_64x64.png');
                    usfImageExists(imageUrl, (v) => {
                        if (v)
                            this.$set(this.currentBgImages, c, imageUrl);
                    });

                    return h('div', {
                        class: 'ProductItem__ColorSwatchItem',
                        key: (pid + c),
                        attrs: {
                            'data-test': this.currentColor
                        }
                    }, [
                            h('input', {
                                class: 'ColorSwatch__Radio', attrs: {
                                    type: "radio", name: "collection-template-" + pindex, id: "collection-template-" + pindex, value: c, checked: this.currentColor === c ? "checked" : null,
                                    'data-variant-url': "/products/" + this.product.urlName + "?variant=" + this.currentVariantId,
                                    'data-image-url': "//cdn.shopify.com/s/files/1/0262/8711/2272/products/0c8c5796ca9325cd7c82_{width}x.jpg?v=1575962357",
                                    'data-image-widths': "[200,400,600,700,800,900]",
                                    //'data-image-aspect-ratio': ,
                                    'aria-hidden': true
                                }
                            }),
                            h('label', {
                                attrs: {
                                    title: c,
                                    'data-tooltip': c
                                },
                                style: {
                                    backgroundColor: this.currentBgImages[c] ? null : c,
                                    backgroundImage: this.currentBgImages[c] ? 'url(' + imageUrl + ')' : null,
                                },
                                on: {
                                    click() {
                                        vm.pickColor(c)
                                    }
                                },
                                staticClass: 'ColorSwatch ColorSwatch--small'
                            })
                        ])
                })
            },
            getVariantDefault() {
                var product = this.product;
                if (product.selectedVariantId) {
                    for (var i = 0; i < product['variants'].length; i++) {
                        if (product['variants'][i].id == product.selectedVariantId) {
                            return product['variants'][i]
                        }
                    }
                } else {
                    return product['variants'][0]
                }
            },
            pickColor(c) {
                this.currentColor = c;
            },
            updatePreview() {
                var vm = this;
                var product_el = document.querySelector(`[product-selector="${this.product.id}"]`)
                // We need to change the URL of the various links
                var productItem = product_el.querySelector('.ProductItem');

                productItem.querySelector('.ProductItem__ImageWrapper').setAttribute('href', vm.currentURL);
                productItem.querySelector('.ProductItem__Title > a').setAttribute('href', vm.currentURL);

                // If we have a custom image for the variant, we change it
                var originalImageElement = productItem.querySelector('.ProductItem__Image:not(.ProductItem__Image--alternate)');

                //if (target.hasAttribute('data-image-url') && target.getAttribute('data-image-id') !== originalImageElement.getAttribute('data-image-id')) {
                // this.currentVariantId
                var newImageElement = document.createElement('img');
                newImageElement.className = 'ProductItem__Image Image--fadeIn Image--lazyLoad';
                //newImageElement.setAttribute('data-image-id', target.getAttribute('data-image-id'));
                newImageElement.setAttribute('data-src', _usfGetImageUrls(vm.imageOfColor));
                newImageElement.setAttribute('data-widths', '[' + _usfImageWidths + ']');
                newImageElement.setAttribute('data-sizes', 'auto');
                // Replace the original node
                //if (window.theme.productImageSize === 'natural') {
                //    originalImageElement.parentNode.style.paddingBottom = 100.0 / target.getAttribute('data-image-aspect-ratio') + '%';
                //}
                // Update variant of form ajax
                //productItem.querySelector('[name=id]').setAttribute('value', vm.currentVariantId);

                //originalImageElement.parentNode.style.setProperty('--aspect-ratio', target.getAttribute('data-image-aspect-ratio'));
                originalImageElement.parentNode.replaceChild(newImageElement, originalImageElement);
            }
        }
    }
    usf.register(_usfColorSwatch, null, 'usf-color-swatch');


    // hack for pass render issue of sidebar for sidebar mode
    var blockFilterV2 = {
        methods: {

        },
        computed: {
            showSidebar() {
                return _usfSettingCollection.filterPosition != 'sidebar';
            }
        },
        render(h) {
            return h('div', {
                staticClass: 'CollectionInner__Sidebar CollectionInner__Sidebar--withTopToolbar',
                class: {
                    'usf-non-sidebarFilter': this.showSidebar
                }
            }, [
                    h('usf-filters', {
                        class: {
                            'usf-non-sidebarFilter': this.showSidebar
                        }
                    })
                ]);
        }
    }
    usf.register(blockFilterV2, null, 'block-filter-v2');
});
