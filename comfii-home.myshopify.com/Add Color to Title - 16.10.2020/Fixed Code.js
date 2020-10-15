var _usfImageWidths = [295,394,590,700,800,1000,1200,1500,1800,2000,2400];

const _maxSize = 400;

var titleWithColor = function(p){
    var selectedVariant = p.selectedVariantId ? p.variants.find(v => v.id === p.selectedVariantId) : p.variants[0];
    var option = p.options.find(o => o.name === 'Color' || o.name === 'COLOR');
    var html = p.title
    if(option){
        for (let i = 0; i < option.values.length; i++) {
            var optVal = option.values[i];
            for (let n = 0; n < selectedVariant.options.length; n++){
                if (optVal == selectedVariant.options[n])
                    html+= ` - ${optVal}`
            }
        }
    }
    return html
}

function _imageSize(width) {
    return width > _maxSize ? _maxSize : width;
}

function _get_Collection_Title() {
    try {
        return document.querySelector('.collection--title').textContent;
    } catch (error) {
        return "";
    }
}

var usfTruncatewords = function (desc, size = 10) {
    console.log(desc)
    if (!desc)
        return "";
    if (desc.split(' ').length && desc.split(' ').length <= size)
        return desc;
    return desc.slice(0, desc.indexOf(' ' + desc.split(' ')[size] + ' ')) + `...`;
}

var usf_sectionSettings = usf_sectionSettings = {
    'collections-products-per-row': '4'
}

if (window.usf_collectionSettings)
    usf_sectionSettings = window.usf_collectionSettings;

var getImgWithSize = function (img, size = '') {
    return img.replace('{size}', size)
}

window.lazySizesConfig = window.lazySizesConfig || {};

window.lazySizesConfig.expand = 10; //default 360-500
lazySizesConfig. expFactor = 1.5; //default: 1.7


// define templates for the Blockshop theme
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
<div v-if="view === 'grid'" class="usf-sr-product grid__item product--root  usf-skeleton" >
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
        <div class="list-view-item__vendor "></div>
    </div>


    <!-- Prices -->
    <div class="list-view-item__price-column" v-if="true">
        <div class="usf-price product-price__price"></div>
    </div>
</a>
`;

var skeletonCol = function () {
    var skeleton = ""
    for (let i = 0; i < parseInt(usf_sectionSettings['collections-products-per-row']); i++) {
        skeleton += _usfSearchResultsSkeletonItemTpl
    }
    return skeleton
};

var _usfSearchResultsSummaryTpl = `<span class="usf-sr-summary" style="text-align: right; margin-right: 20px;" v-html="loader === true ? '&nbsp;' : usf.utils.format(term ? loc.productSearchResultWithTermSummary : loc.productSearchResultSummary, result.total, term)"></span>`;
var _usfSearchResultsViewsTpl =
    `<div class="usf-views">
    <div class="usf-view usf-grid" :class="{'usf-active': view === 'grid'}" @click="onGridViewClick"><svg role="presentation" viewBox="0 0 36 36"><path fill="currentColor" d="M8 0L0 0L0 8L8 8L8 0ZM14 0L22 0L22 8L14 8L14 0ZM36 0L28 0L28 8L36 8L36 0ZM0 14L8 14L8 22L0 22L0 14ZM22 14L14 14L14 22L22 22L22 14ZM28 14L36 14L36 22L28 22L28 14ZM8 28L0 28L0 36L8 36L8 28ZM14 28L22 28L22 36L14 36L14 28ZM28 36L28 28L36 28L36 36L28 36Z"/></svg></div>
    <div class="usf-view usf-list" :class="{'usf-active': view === 'list'}" @click="onListViewClick"><svg role="presentation" viewBox="0 0 18 18"><path d="M8 1.030067h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1zm-7-15h2c.55228475 0 1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1H1c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .44771525 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1z" fill="currentColor"></path></svg></div>
</div>`;
var _usfSearchResultsSortByTpl = `<usf-dropdown :value="sortBy" :options="sortByOptions" @input="onSortByChanged"></usf-dropdown>`;


function bindOfGrid(hoverImage){
    if ((hoverImage && window.usf_themeSettings['hover-image-enabled']))
        return {'data-hover-image':'loaded'}
    return {}
}

usf.templates = {
    app: `
<div id="usf_container" class="usf-zone usf-clear" :class="{'usf-filters-horz': usf.settings.filters.horz}">
    <usf-filters></usf-filters>
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
    <div class="usf-sr-config" v-else>
        <span class="usf-sr-summary"><b v-html="_get_Collection_Title()"></b></span>
        ` + _usfSearchResultsSummaryTpl + _usfSearchResultsSortByTpl + _usfSearchResultsViewsTpl + `
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && !result.extra.banner.isBottom" :banner="result.extra.banner"></usf-sr-banner>

    <div :data-items-per-row="usf_sectionSettings['collections-products-per-row']" data-mobile-items-per-row="2" data-js-loaded="true" data-js-class="ProductGrid" :class="(view === \'grid\' ? \'product-grid--root\' : \'list-view-items\') + \' usf-results usf-\' + view">
        <template v-if="loader===true">` + skeletonCol() +
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
    searchResultsGridViewItem: `
<div class="product--root" v-bind="bindOfGrid(hoverImage)" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave">
    <!--badges-->
    <!--<a :href="productUrl" :aria-label="product.title">
        <div class="product--image-wrapper" >
            <div class="product--image">

                <div class="image--root" :data-aspectratio="usfGetAspectRatio(selectedImage)" data-item="image" :style="'width:'+_imageSize(selectedImage.width)+'px;'">
                    <div class="image--container" :style="'padding-top:'+(1/usfGetAspectRatio(selectedImage)*100)+'%;'">
                        <img :id="'image-' + product.id" class="lazyload USF_Image--fadeIn" data-sizes="auto" :data-widths="'[' + _usfImageWidths.join(',') + ']'" :data-aspectratio="usfGetAspectRatio(selectedImage)" alt="" 
                        :data-srcset="_usfGetImageUrls(scaledSelectedImageUrl)" 
                       >
                        <span class="USF_Image__Loader"></span>
                    </div>
                </div>
            </div>
            <div class="product--hover-image" v-if="hoverImage && window.usf_themeSettings['hover-image-enabled']">

                <div class="image--root" :data-aspectratio="usfGetAspectRatio(hoverImage)" data-item="image" :style="'width:'+_imageSize(hoverImage.width)+'px;'">
                    <div class="image--container" >
                        <img :id="'second-image-' + product.id" class=" lazyload USF_Image--fadeIn" data-sizes="auto" :data-widths="'[' + _usfImageWidths.join(',') + ']'" :data-aspectratio="usfGetAspectRatio(hoverImage)" alt="" 
                        :data-srcset="_usfGetImageUrls(scaledHoverImageUrl)" >
                        <span class="USF_Image__Loader"></span>
                    </div>
                </div>
            </div>
            <usf-plugin name="searchResultsProductImageExtra" :data="pluginData"></usf-plugin>
        </div>
    </a>-->

    <a :href="productUrl" :aria-label="product.title">
        <div class="product--sale font--accent" :href="productUrl" v-if="hasDiscount && !isSoldOut && usf.settings.search.showSale">
            <span v-html="loc.sale"></span>
        </div>
        <div class="product--sold-out font--accent" v-if="isSoldOut && usf.settings.search.showSoldOut">
            <span v-html="loc.soldOut"></span>
        </div>
        <div class="product--image-wrapper" >
            <div class="product--image">
                <div class="image--root" :data-aspectratio="usfGetAspectRatio(selectedImage)" data-item="image" :style="'width:'+selectedImage.width+'px;'">
                    <div class="image--container" :style="'padding-top:'+(1/usfGetAspectRatio(selectedImage)*100)+'%;'">
                        <img :id="'image-' + product.id" class="lazyload USF_Image--fadeIn" data-sizes="auto" :data-widths="'[' + _usfImageWidths.join(',') + ']'" :data-aspectratio="usfGetAspectRatio(selectedImage)" alt="" 
                        :data-src="getImgWithSize(scaledSelectedImageUrl,'{width}')"  >
                        <span class="USF_Image__Loader"></span>
                    </div>
                </div>
            </div>
            <div class="product--hover-image" v-if="hoverImage && window.usf_themeSettings['hover-image-enabled']">
                <div class="image--root" :data-aspectratio="usfGetAspectRatio(hoverImage)" data-item="image" :style="'width:'+hoverImage.width+'px;'">
                    <div class="image--container"  :style="'padding-top:'+(1/usfGetAspectRatio(hoverImage)*100)+'%;'">
                        <img :id="'second-image-' + product.id" class=" lazyload USF_Image--fadeIn" data-sizes="auto" :data-widths="'[' + _usfImageWidths.join(',') + ']'" :data-aspectratio="usfGetAspectRatio(hoverImage)" alt="" 
                        :data-src="getImgWithSize(scaledHoverImageUrl,'{width}')">
                        <span class="USF_Image__Loader"></span>
                    </div>
                </div>
            </div>
            <!-- product image extra -->
            <usf-plugin name="searchResultsProductImageExtra" :data="pluginData"></usf-plugin>
        </div>
    </a>


    <div class="product--details">
        <!-- Wishlist -->
        <usf-plugin name="searchResultsProductWishList" :data="pluginData"></usf-plugin>
        <!-- title -->
        <a :href="productUrl">
            <div class="product--title font--block-heading" v-html="titleWithColor(product)"></div>
        </a>
        <!-- Labels -->
        <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
        <!--vendor-->
        <a :href="usf.platform.baseUrl + '/collections/vendors?q=' + encodeURIComponent(product.vendor)" v-if="window.usf_themeSettings['brand-show'] && usf.settings.search.showVendor">
            <div class="product--vendor font--light-accent" v-html="product.vendor"></div>
        </a>
        <!-- Product review -->
        <usf-plugin name="searchResultsProductReview" :data="pluginData"></usf-plugin>
        <!--price-->
        <a :href="productUrl">
            <div class="product--price-wrapper">
                <span class="product--compare-price font--light-accent" v-if="hasDiscount">
                    <span class="money" v-html="displayPrice"></span>
                </span>
                <span class="product--price font--accent">
                    <span class="money" v-html="displayDiscountedPrice"></span>
                </span>
            </div>
        </a>
    </div>
</div>
`,

    // Search result pages
    searchResultsPages: `
<div class="pagination--root font--accent">
    <template v-for="e in elements">
        <div class="pagination--left-arrow" v-if="e.type === 'prev'">
            <a class="text-colored" href="javascript:void(0)" :title="loc.prevPage" @click="onPrev">
		    <svg class="icon--root icon--arrow-left" viewBox="0 0 16 12">
		        <path d="M3.617 5.016h11.669v1.5h-12.1L7.15 10.48l-1.06 1.06L.53 5.982 6.09.421l1.061 1.06-3.534 3.535z" fill-rule="nonzero"></path>
		    </svg>
            </a>    
        </div>

        <li v-else-if="e.type === 'dots'" class="pagination--number">…</li>
        <li v-else-if="e.type === 'page' && e.current" class="pagination--number" data-active="true" style="font-weight:400">{{e.page}}</li>
        <li v-else-if="e.type === 'page' && !e.current" class="pagination--number"><a href="javascript:void(0)" @click="onPage(e.page)" :title="usf.utils.format(loc.gotoPage,e.page)">{{e.page}}</a></li>

        <div class="pagination--right-arrow" v-else-if="e.type === 'next'">
            <a class="text-colored" href="javascript:void(0)" :title="loc.nextPage" @click="onNext">
                <svg class="icon--root icon--arrow-right" viewBox="0 0 16 12">
                  <path d="M12.199 6.946H.53v-1.5h12.1L8.664 1.481l1.06-1.06 5.562 5.56-5.561 5.56-1.06-1.06 3.534-3.535z" fill-rule="nonzero"></path>
                </svg>
            </a>    
        </div>
    </template>
</div>
`,

    searchResultsListViewItem: `
<a class="usf-sr-product list-view-item" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" :href="productUrl" :key="product.id">
    <!-- Image column -->
    <div class="list-view-item__image-column">
        <div class="list-view-item__image-wrapper">
            <img :id="'image-' + product.id" class="list-view-item__image lazyload usf-inherit" :src="getImgWithSize(scaledImageUrl,'500')">
             <a :href="productUrl">
                <div class="product--sale font--accent" :href="productUrl" v-if="hasDiscount && !isSoldOut && usf.settings.search.showSale">
                    <span v-html="loc.sale"></span>
                </div>
                <div class="product--sold-out font--accent" v-if="isSoldOut && usf.settings.search.showSoldOut">
                    <span v-html="loc.soldOut"></span>
                </div>
            </a>
        </div>
    </div>

    <!-- Title and Vendor column -->
    <div class="list-view-item__title-column">
        <div class="list-view-item__title" v-html="product.title"></div>
        <div class="list-view-item__vendor " v-html="product.vendor" v-if="window.usf_themeSettings['brand-show'] && usf.settings.search.showVendor"></div>
    </div>


    <!-- Prices -->
    <div class="list-view-item__price-column">
        <div class="product--price-wrapper">
                <span class="product--compare-price font--light-accent" v-if="hasDiscount">
                    <span class="money" v-html="displayPrice"></span>
                </span>
                <span class="product--price font--accent">
                    <span class="money" v-html="displayDiscountedPrice"></span>
                </span>
            </div>
    </div>
</a>
`,
    // AddToCart Plugin	
    addToCartPlugin: `
<form class="usf-add-to-cart" method="POST" enctype="multipart/form-data" :action="usf.platform.addToCartUrl">
    <input type="hidden" name="id" :value="variant.id">
    <button type="submit" name="add" :class="{'usf-visible': args.isHover}" class="usf-add-to-cart-btn" v-html="loc.addToCart"></button>
</form>
`,
    // Preview Plugin
    previewPlugin: `
<div class="usf-sr-preview" :class="{'usf-visible': args.isHover}" @click="onShowModal">
    <div><svg style="width:initial;height:initial" viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><g transform="translate(0.000000,281.000000) scale(0.100000,-0.100000)"><path d="M4808.6,2770.8c-1219.3-67-2423.2-610.6-3684.6-1659.5C884.8,912.3,100,140.9,100,104.6c0-34.4,794.3-819.2,1004.9-993.4c1138.9-941.7,2195.4-1468.1,3273-1630.8c306.3-45.9,821.1-55.5,1110.2-19.1C6663.3-2391.4,7832.8-1807.6,9023.4-774C9274.1-553.9,9900,73.9,9900,108.4c0,30.6-803.9,823-1004.9,989.6c-1098.7,909.2-2151.4,1445.1-3177.3,1617.4c-189.5,32.5-625.9,70.8-735,65.1C4944.5,2778.5,4866,2774.7,4808.6,2770.8z M5497.7,2296.2c1181-158.9,2425.1-846,3590.8-1983l212.5-206.7l-231.6-225.9c-1158-1135-2434.7-1829.8-3629.1-1977.2c-227.8-26.8-700.5-23-937.9,7.7c-417.3,57.4-851.8,181.8-1282.4,369.4C2452.4-1384.6,1543.2-743.4,865.6-60L702.9,104.6l172.3,174.2c509.1,513,1248,1075.7,1856.6,1410.7c562.7,310.1,1196.3,530.2,1751.4,606.8C4728.2,2330.6,5250.7,2330.6,5497.7,2296.2z"/><path d="M4670.8,1855.9c-671.8-128.2-1213.5-633.6-1397.3-1307.3c-59.3-212.5-59.3-675.7,0-888.1c172.3-625.9,654.6-1110.2,1276.7-1280.5c222-61.3,677.6-61.3,899.6,0c622.1,170.3,1104.4,654.6,1276.7,1280.5c59.3,212.5,59.3,675.7,0,888.1c-172.3,627.8-662.3,1117.8-1276.7,1280.5C5246.9,1880.8,4875.6,1894.2,4670.8,1855.9z M5373.2,1387c233.5-72.7,386.6-166.5,566.6-344.5c268-266.1,388.6-557,388.6-937.9c0-379-120.6-669.9-390.5-937.9c-268-269.9-558.9-390.5-937.9-390.5c-241.2,0-386.6,34.4-612.5,145.5c-130.2,63.2-195.2,111-325.4,243.1c-273.7,275.6-392.4,557-392.4,939.8c0,382.8,118.7,664.2,392.4,937.9c210.5,212.5,436.4,331.1,723.5,382.8C4929.2,1452.1,5222,1432.9,5373.2,1387z"/><path d="M4818.2,508.4c-283.3-132.1-348.4-509.1-122.5-723.5c281.4-266,744.6-68.9,744.6,319.7c0,179.9-109.1,342.6-271.8,409.6C5072.7,554.4,4912,552.4,4818.2,508.4z"/></g></svg></div>
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
 <a :href="productUrl">
                <div class="product--sale font--accent" :href="productUrl" v-if="hasDiscount && !isSoldOut && usf.settings.search.showSale">
                    <span v-html="loc.sale"></span>
                </div>
                <div class="product--sold-out font--accent" v-if="isSoldOut && usf.settings.search.showSoldOut">
                    <span v-html="loc.soldOut"></span>
                </div>
            </a>
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
                     <div class="product--price-wrapper">
                        <span class="product--compare-price font--light-accent" v-if="hasDiscount">
                            <span class="money" v-html="usf.utils.getDisplayPrice(selectedVariant.compareAtPrice || selectedVariant.price)"></span>
                        </span>
                        <span class="product--price font--accent">
                            <span class="money" v-html="usf.utils.getDisplayPrice(selectedVariant.price)"></span>
                        </span>
                    </div>
                </div>

                <!-- Description-->
                <usf-preview-desc :desc="product.description"></usf-preview-desc>

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

function usfGetAspectRatio(image) {
    if (image && image.height)
        return image.width / image.height;

    return 0.75;
}



var usf_matchImageHeights = function () {
    var image_class = '.product--image-wrapper'
    var root = $('.product-grid--root');
    var items = $('.product--root');
    theme.utils.matchImageHeights(root, items, image_class);

}

usf.event.add('init', function () {
    // register or override components
    // ...    
    /*var SearchResultsGridItem2 = {
        template: usf.templates.searchResultsGridViewItem,
    }
    usf.register(SearchResultsGridItem2, usf.components.SearchResultsGridItem, "usf-sr-griditem");*/
    var PreviewDesc = {
        template: `
         <div v-if="desc" class="usf-preview__description">
            <span v-if="!readMoreActivated" v-html="usfTruncatewords(desc,7)"></span>
            <a class="" v-if="!readMoreActivated " @click="activateReadMore($event)" href="#">
                <p><strong>Read more...</strong></p>
            </a>
            <span v-if="readMoreActivated" v-html="desc"></span>

            <a class="" v-if="readMoreActivated" @click="deactiveReadMore($event)" href="#">
                <p><strong>Show less</strong></p>
            </a>
        </div>
        `,
        props: {
            desc: {
                type: String,
                required: true
            },
        },
        data() {
            return {
                longText: ``,
                readMoreActivated: false
            }
        },
        methods: {
            activateReadMore(e) {
                e.preventDefault()
                this.readMoreActivated = true;
            },
            deactiveReadMore(e) {
                e.preventDefault()
                this.readMoreActivated = false;
            }
        },
        created() {
            console.log(this.desc)
        }
    }
    usf.register(PreviewDesc, null, "usf-preview-desc");
});


usf.event.add(['sr_updated', 'sr_viewChanged', 'rerender'], function () {
    usf_matchImageHeights();
})