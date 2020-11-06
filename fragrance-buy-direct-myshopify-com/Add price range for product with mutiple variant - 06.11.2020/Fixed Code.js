var usf_sectionSettings = {};
usf_sectionSettings['products_per_row'] = 3;
usf_sectionSettings['mobile_products_per_row'] = '1'
usf_sectionSettings['collection_height'] = 230
usf_sectionSettings['align_height'] = false
try {
    if (usf_collectionSettings != null)
        usf_sectionSettings = usf_collectionSettings;

} catch (e) {
   
}

var productPrice = function (t) {
    return ` <h6 style="color: red;">${t.priceVaries ? t.displayMinDiscountedPrice : t.displayDiscountedPrice} ${t.hasDiscount || (t.priceVaries && t.minDiscountedPrice != t.minPrice) ? ` <del style="color: grey">${t.displayPrice}</del>` : ''}</h6>`
}

var imageMaxwidth = "";
    

var gridClass = "";
switch (usf_sectionSettings['products_per_row']) {
    case 2:
        gridClass = " one-half "
        break;
    case 3:
        gridClass = " one-third "
        break;
    case 4:
        gridClass = " one-fourth "
        break;
    case 5:
        gridClass = " one-fifth "
        break;
    case 6:
        gridClass = " one-sixth "
        break;
    case 7:
        gridClass = " one-seventh "
        break;
}
switch (usf_sectionSettings['mobile_products_per_row']) {
    case '1':
        gridClass += ' small-down--one-whole '
        break;
    case '2':
        gridClass += ' small-down--one-half '
        break;
}

var collectionHeight = usf_sectionSettings['collection_height'];
var imgStyle = function (img) {
    if (imageMaxwidth === "")
        imageMaxwidth = img.width
    if (usf_sectionSettings.align_height) {
        return `max-height:${collectionHeight}px;width: calc(${img.width} / ${img.height} * ${collectionHeight}px);`
    } else {
        return `max-width:${imageMaxwidth}`
    }
}
var imgSecondStyle = function (id) {

    var secondImage = document.getElementById(id);
    if (secondImage) {
        var stl = "";
        if (usf_sectionSettings.align_height) {
            stl = `max-height:${collectionHeight}px;width: calc(${secondImage.offsetWidth} / ${secondImage.offsetHeight} * ${collectionHeight}px);`
        } else {
            stl = `max-width:${imageMaxwidth}`
        }
        secondImage.parentElement.setAttribute('style', stl);
        secondImage.setAttribute('style', '');
        secondImage.classList.add('usf-second-image');

    }
    
}

// define templates for the Flex theme
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
<div v-if="view === 'grid'" class="usf-sr-product grid__item  usf-skeleton" :class="[gridClass]">
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

var _usfSearchResultsSummaryTpl = `<span class="usf-sr-summary" v-html="loader === true ? '&nbsp;' : usf.utils.format(term ? loc.productSearchResultWithTermSummary : loc.productSearchResultSummary, result.total, term)"></span>`;
var _usfSearchResultsViewsTpl =
    `<div class="usf-views">
    <div class="usf-view usf-grid" :class="{'usf-active': view === 'grid'}" @click="onGridViewClick"><svg role="presentation" viewBox="0 0 36 36"><path fill="currentColor" d="M8 0L0 0L0 8L8 8L8 0ZM14 0L22 0L22 8L14 8L14 0ZM36 0L28 0L28 8L36 8L36 0ZM0 14L8 14L8 22L0 22L0 14ZM22 14L14 14L14 22L22 22L22 14ZM28 14L36 14L36 22L28 22L28 14ZM8 28L0 28L0 36L8 36L8 28ZM14 28L22 28L22 36L14 36L14 28ZM28 36L28 28L36 28L36 36L28 36Z"/></svg></div>
    <div class="usf-view usf-list" :class="{'usf-active': view === 'list'}" @click="onListViewClick"><svg role="presentation" viewBox="0 0 18 18"><path d="M8 1.030067h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm0 7h9c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1H8c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1zm-7-15h2c.55228475 0 1 .44771525 1 1v2c0 .55228475-.44771525 1-1 1H1c-.55228475 0-1-.44771525-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .44771525 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.55228475.44771525-1 1-1zm0 7h2c.55228475 0 1 .4477153 1 1v2c0 .5522847-.44771525 1-1 1H1c-.55228475 0-1-.4477153-1-1v-2c0-.5522847.44771525-1 1-1z" fill="currentColor"></path></svg></div>
</div>`;
var _usfSearchResultsSortByTpl = `<usf-dropdown :value="sortBy" :options="sortByOptions" @input="onSortByChanged"></usf-dropdown>`;

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
        ` + _usfSearchResultsSummaryTpl + _usfSearchResultsSortByTpl + _usfSearchResultsViewsTpl + `
    </div>

    <usf-sr-banner v-if="result && result.extra && result.extra.banner && !result.extra.banner.isBottom" :banner="result.extra.banner"></usf-sr-banner>

    <div :class="(view === \'grid\' ? \'container collection-matrix\' : \'list-view-items\') + \' usf-results usf-\' + view">
        <template v-if="loader===true">` + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + _usfSearchResultsSkeletonItemTpl + 
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
    searchResultsGridViewItem: `
<div :id="'product-' + product.id" :data-available="available" :data-has-discount="hasDiscount" :data-price="displayPrice" :data-discount-price="displayDiscountedPrice" class="medium-down--one-half column quick-shop--closed  js-product_section  thumbnail product__thumbnail product__grid-item  has-padding-bottom" 
:class="[{'quick-shop--true':usf_themeSettings.enable_quickshop,'thumbnail__hover-overlay--true':usf_themeSettings.thumbnail_hover_enabled, 'has-secondary-image-swap': hoverImageUrl && usf_themeSettings.show_secondary_image, 'has-thumbnail-sticker': usf_themeSettings.stickers_enabled},'product-' + product.id, gridClass]">
  <div class="product-wrap">
      <div class="product-image__wrapper">
          <div class="image__container product__imageContainer">
              <a :href="productUrl"  @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave">
                  <!--sticker-->
                  <div class="sticker-holder " :class="['sticker-shape-' + usf_themeSettings.sticker_shape, 'sticker-position-' + usf_themeSettings.sticker_position]" v-if="usf_themeSettings.stickers_enabled">
                      <div class="sticker-holder__content sticker-holder__content--">
                          <div class="sale-sticker thumbnail-sticker sticker-"  v-if="hasDiscount && usf.settings.search.showSale && !isSoldOut">
                             <span class="sticker-text" v-html="loc.sale"></span>
                          </div>
                          <div class="sale-sticker thumbnail-sticker sticker- usf-sold-out"  v-if="isSoldOut && usf.settings.search.showSoldOut">
                             <span class="sticker-text " v-html="loc.soldOut"></span>
                          </div>
                      </div>
                  </div>
                  <!-- selected image-->
                  <div class="image-element__wrap"  :style="imgStyle(image)" >
                      <img :alt="product.title" class="transition--appear lazyautosizes lazyloaded " :class="{'usf-selected-image': hoverImageUrl && usf_themeSettings.show_secondary_image}" :data-src="usf_themeSettings.show_secondary_image ? imageUrl : selectedImageUrl" data-sizes="auto" :data-srcset="lazyloadImage(usf_themeSettings.show_secondary_image ? imageUrl : selectedImageUrl)" height="840" width="630" style="" sizes="415px" :srcset="lazyloadImage(usf_themeSettings.show_secondary_image ? imageUrl : selectedImageUrl)" :src="usf_themeSettings.show_secondary_image ? imageUrl : selectedImageUrl">
                  </div>
                  <noscript>
                      <img class="" :src="usf_themeSettings.show_secondary_image ? imageUrl : selectedImageUrl" :alt="product.title">
                  </noscript>
                  <!--second image-->
                  <div class="image-element__wrap" style="width:auto;height:auto;" v-if="hoverImageUrl && usf_themeSettings.show_secondary_image " >
                      <img :id="'second-image-'+product.id"  :alt="product.title" class="transition--appear lazypreload secondary lazyautosizes lazyloaded " :data-src="hoverImageUrl" data-sizes="auto" :data-srcset="lazyloadSecondImage(hoverImageUrl)" height="506" width="512" style="" sizes="415px" :srcset="lazyloadSecondImage(hoverImageUrl)" :src="hoverImageUrl"  style="width:auto; height:auto !important;opacity:0"  @load="imgSecondStyle('second-image-'+product.id)">
                  </div>
                  <noscript v-if="hoverImageUrl && usf_themeSettings.show_secondary_image">
                      <img class="lazypreload secondary swap--visible" :src="hoverImageUrl" :alt="product.title">
                  </noscript>
                  <!-- Wishlist -->
                  <usf-plugin name="searchResultsProductWishList" :data="pluginData"></usf-plugin>
              </a>
          </div>
          <!--thumbnail-->
          <div class="thumbnail-overlay__container" v-if="usf_themeSettings.thumbnail_hover_enabled || usf_themeSettings.enable_quickshop">
            <a class="hidden-product-link" :href="productUrl" v-html="product.title"></a>
             <!-- Labels -->
            <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
            <div class="quick-shop__info animated fadeInDown" v-if="usf_themeSettings.thumbnail_hover_enabled">
                  <div class="thumbnail-overlay">
                      <div class="info text-align-center">
                        <!-- vendor -->
                        <span class="product-thumbnail__vendor" v-if="usf.settings.search.showVendor && usf_themeSettings.display_vendor" v-html="product.vendor"></span>
                        <p class="product-thumbnail__title" v-html="product.title"></p>
                        <!-- Labels -->
                        <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
                        <!-- price -->
                        <usf-plugin name="searchResultsProductPrice" :data="pluginData"></usf-plugin>
                        <span class="product-thumbnail__price price" :class="{'sale': hasDiscount}">
                          <small v-if="hasDiscount && !isFree(product.variants[0])"><em>from</em></small>
                          <small v-if="isFree(product.variants[0])"><em>free</em></small>
                          <span class="money" v-html="displayPrice"></span>
                          <span class="product-thumbnail__was-price was-price" v-if="hasDiscount"><span class="money" v-html="displayDiscountedPrice"></span></span>
                        </span>
                      </div>
                  </div>
              </div>
              <!-- quick-shop__buttons -->
              <usf-plugin name="searchResultsProductImageExtra" :data="pluginData" v-if="usf_themeSettings.enable_quickshop"></usf-plugin>
              <!-- Product review -->
              <usf-plugin name="searchResultsProductReview" :data="pluginData" v-if="usf_themeSettings.thumbnail_hover_enabled"></usf-plugin>
            </div>
            <!--end thumbai-->
      </div>
      <!-- thumbnail__caption -->
      <div class="thumbnail__caption " :class="['text-align-' + usf_themeSettings.thumbnail_text_alignment]">
          <div class="product-thumbnail">
            <!-- vendor -->
            <span class="product-thumbnail__vendor"  v-if="usf.settings.search.showVendor && usf_themeSettings.display_vendor" v-html="product.vendor"></span>
            <a :href="productUrl" class="product-thumbnail__title" v-html="product.title"></a>
            <!-- Labels -->
            <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
            <!-- price -->
            <usf-plugin name="searchResultsProductPrice" :data="pluginData"></usf-plugin>
            <span class="product-thumbnail__price price" :class="{'sale': hasDiscount}">            
              <small v-if="hasDiscount && !isFree(product.variants[0])"><em>from</em></small>
              <small v-if="isFree(product.variants[0])"><em>free</em></small>
            <!--
              <span class="money" v-html="displayDiscountedPrice"></span>
              <span class="product-thumbnail__was-price was-price" v-if="hasDiscount"><span class="money" v-html="displayPrice"></span></span>
            -->
            <span class="money" v-html="productPrice(this)"></span>
            </span>
          </div>
      </div>
  </div>
  <!-- variant swatchs -->
  <div class="thumbnail-swatch is-justify-center is-flex-wrap" v-if="usf_themeSettings.collection_swatches" v-html="variantSwatch(product,productUrl)"></div>
  <!-- Product review -->
  <div class="product-thumbnail__review-stars is-flex " :class="['is-justify-' + usf_themeSettings.thumbnail_text_alignment]" v-if="!usf_themeSettings.thumbnail_hover_enabled"> 
    <usf-plugin name="searchResultsProductReview" :data="pluginData"></usf-plugin>
  </div>
</div>
`,

    // Search result pages
    searchResultsPages: `
<center>
<div class="paginate"> <nav class="pagination " role="navigation" aria-label="pagination"> <ul class="pagination-list">
    <template v-for="e in elements">
        <li v-if="e.type === 'prev'"><a href="javascript:void(0)" :title="loc.prevPage" @click="onPrev" class="pagination-previous">←</a></li>

        <li v-else-if="e.type === 'dots'"><span class="pagination-link">…</span></li>
        <li v-else-if="e.type === 'page' && e.current"><a class="pagination-link is-current">{{e.page}}</a></li>
        <li v-else-if="e.type === 'page' && !e.current"> <a href="javascript:void(0)" @click="onPage(e.page)" :title="usf.utils.format(loc.gotoPage,e.page)" class="pagination-link">{{e.page}}</a></li>

        <li v-if="e.type === 'next'"><a href="javascript:void(0)" :title="loc.nextPage" @click="onNext" class="pagination-next">→</a></li>
    </template>
</div>
</center>
`,

    searchResultsListViewItem: `
<a class="usf-sr-product list-view-item" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" :href="productUrl" :key="product.id" :class="{'has-thumbnail-sticker': usf_themeSettings.stickers_enabled}">
    <!-- Image column -->
    <div class="list-view-item__image-column">
        <div class="list-view-item__image-wrapper">
            <!--sticker-->
            <div class="sticker-holder " :class="['sticker-shape-' + usf_themeSettings.sticker_shape, 'sticker-position-' + usf_themeSettings.sticker_position]" v-if="usf_themeSettings.stickers_enabled">
                <div class="sticker-holder__content sticker-holder__content--">
                    <div class="sale-sticker thumbnail-sticker sticker-" v-if="hasDiscount && usf.settings.search.showSale && !isSoldOut">
                        <span class="sticker-text" v-html="loc.sale"></span>
                    </div>
                    <div class="sale-sticker thumbnail-sticker sticker- usf-sold-out" v-if="isSoldOut && usf.settings.search.showSoldOut">
                        <span class="sticker-text " v-html="loc.soldOut"></span>
                    </div>
                </div>
            </div>
            <img class="list-view-item__image" :src="imageUrl">
        </div>
    </div>
    <!-- Title and Vendor column -->
    <div class="list-view-item__title-column">
        <!-- vendor -->
        <span class="product-thumbnail__vendor" v-if="usf.settings.search.showVendor && usf_themeSettings.display_vendor" v-html="product.vendor"></span>
        <a :href="productUrl" class="product-thumbnail__title" v-html="product.title"></a>
    </div>
    <!-- Prices -->
    <div class="list-view-item__price-column">
        <span class="product-thumbnail__price price" :class="{'sale': hasDiscount}">
            <small v-if="hasDiscount && !isFree(product.variants[0])"><em>from</em></small>
            <small v-if="isFree(product.variants[0])"><em>free</em></small>
            <span class="money" v-html="displayPrice"></span>
            <span class="product-thumbnail__was-price was-price" v-if="hasDiscount"><span class="money" v-html="displayDiscountedPrice"></span></span>
        </span>
    </div>
</a>
`,
    // AddToCart Plugin	
    addToCartPlugin: `

`,
    // Preview Plugin
    previewPlugin: `
<div class="quick-shop__buttons animated fadeInUp" @click="onShowModal">
  <span class="quick_shop button action_button js-quick-shop-link" :class="[usf_themeSettings.quickshop_button_style]" v-html="loc.quickView"></span>
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

var selectedQuantity = 1;



var dataWidths = [5000, 4500, 4000, 3500, 3000, 2500, 2000, 1800, 1600, 1400, 1200, 1000, 800, 600, 400, 200];

var lazyloadImage = function (selectedImageUrl) {

    var img = selectedImageUrl;
    var imgUrl = "";
    if (dataWidths && dataWidths.length > 0) {
        for (let i = 0; i < dataWidths.length; i++) {
            var imgSize = `${dataWidths[i]}x`;
            imgUrl += imgUrl == "" ? `${img.replace('300x300', imgSize)} ${dataWidths[i]}w ` : `, ${img.replace('300x300', imgSize)} ${dataWidths[i]}w`;
        }
    }
    return imgUrl
}

//product.variants[1].url 
var lazyloadSecondImage = function (imageUrl) {

    var str = imageUrl.split('/')[imageUrl.split('/').length - 1];
    var str_1 = str.split(".")[str.split(".").length - 2];

    imageUrl = imageUrl.replace(str_1, `${str_1}_300x300`);
    return lazyloadImage(imageUrl)
}

var variantLazyloadImage = function (imageUrl) {
    var str = imageUrl.split('/')[imageUrl.split('/').length - 1];
    var str_1 = str.split(".")[str.split(".").length - 2];

    imageUrl = imageUrl.replace(str_1, `${str_1}_300x300`);

    return lazyloadImage(imageUrl)
}

var isFree = function (variant) {
    return variant.price == 0
}

//add to cart ajax

var addToCartAjax = function (variantId, quantity) {
    document.getElementById('addCartAjaxBtn').classList.add('usf-disabled')
    document.getElementById('addCartAjaxBtn').setAttribute('disabled','disabled')
    $.ajax({
        url: usf.platform.baseUrl + "/cart/add.js",
        type: "post",
        dataType: "text",
        data: {
            quantity: quantity,
            id: variantId,
            form_type: 'product',
            utf8: '✓'
        },
        success: function (result) {
            if (result) {
                result = JSON.parse(result);
                cartUpdated(result);
                document.getElementById('addCartAjaxBtn').classList.remove('usf-disabled')
                document.getElementById('addCartAjaxBtn').removeAttribute('disabled')

            }
        }, error: function (result) {
            var rs = JSON.parse(result.responseText);
            //do something
            document.getElementById('addCartAjaxBtn').innerHTML = `<div class="cart-warning"><p class="cart-warning__message animated bounceIn">${rs.description}</p></div>`
        }
    });

}

var cartUpdated = function (result) {

    $.ajax({
        url: "/cart.js",
        type: "get",
        dataType: "text",
        success: function (response) {
            response = JSON.parse(response);
            var products = response.items ? response.items : []
            if (products && products.length > 0) {
                var quantity = 0;
                products.filter(p => { quantity += p.quantity });

                //header cart count
                var headerCartCounts = document.getElementsByClassName('header-cart__count ');
                for (let i = 0; i < headerCartCounts.length; i++) {
                    headerCartCounts[i].innerHTML = quantity;
                }
                if (document.getElementsByClassName('ajax-cart__form')[0])
                    document.getElementsByClassName('ajax-cart__form')[0].querySelector(".cart__count--text").innerHTML = quantity;

                //ajax-cart__list

                var ajaxCartList = document.getElementsByClassName("ajax-cart__list");
                if (ajaxCartList.length > 0) {
                    var html = "";
                    for (let i = 0; i < products.length; i++) {
                        if (i == 2) break;
                        var p = products[i];
                        var isHasDiscount = "";
                        var price = "";
                        var discountPrice = "";
                        var saleClass = ""; 
                        var wasPrice = "";
                        var productItem = document.getElementById(`product-${p.product_id}`);
                        if (productItem) {
                            isHasDiscount = productItem.getAttribute("data-has-discount");
                            price = productItem.getAttribute('data-price');
                            discountPrice = productItem.getAttribute('data-discount-price');
                            if (isHasDiscount) {
                                saleClass = "sale";
                                wasPrice = `<span class="money was-price">
                                              ${price}
                                            </span>`;
                            }
                                
                        }
                        html += `<div class="ajax-cart__product media" data-cart-item="${p.key}" data-line-item="${i + 1}">
                                  <figure class="ajax-cart__product-image media-left">
                                      <a href="${p.url}">
                                          <div class="image-element__wrap" style=" max-width: 1200px;">
                                              <img alt="${p.title}" class="lazyload transition--appear lazyaspectratio" data-src="${p.image}"
                                               data-sizes="auto" data-aspectratio="1200/1200" 
                                               data-srcset="${variantLazyloadImage(p.image)}" height="1200" width="1200" style="height: 77px;">
                                          </div>
                                          <noscript>
                                              &lt;img class="" src="${p.image}" alt="${p.product_title}"&gt;
                                          </noscript>
                                      </a>
                                  </figure>
                                  <div class="ajax-cart__product-content media-content">
                                      <div class="ajax-cart__product-title">
                                          <a href="${p.url}">${p.product_title}</a>
                                      </div>
                                      <div class="ajax-cart__line-items">
                                      </div>
                                      <div class="ajax-cart__line-items-discount">
                                      </div>
                                      <div class="ajax-cart__price price">
                                          <span class="money ${saleClass}">${discountPrice}</span>
                                          ${wasPrice}
                                      </div>
                                  </div>
                                  <div class="ajax-cart__right-content media-right">
                                      <a class="ajax-cart__delete" data-ajax-cart-delete="" data-cart-item-key="${p.key}" href="${usf.platform.baseUrl}/cart/change?line=${i + 1}&amp;quantity=0" title="Remove">
                                          <button class="close" aria-label="close">
                                              <span class="icon " data-icon="x">
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                                      <g id="x">
                                                          <polygon points="95 10.32 89.68 5 50 44.68 10.32 5 5 10.32 44.68 50 5 89.68 10.32 95 50 55.32 89.68 95 95 89.68 55.32 50 95 10.32"></polygon>
                                                      </g>
                                                  </svg>
                                              </span>
                                          </button>
                                      </a>
                                  </div>
                                </div>`;
                    }
                    if (document.querySelectorAll(".header-cart.action-area__link")[0]) {
                        document.querySelectorAll(".header-cart.action-area__link")[0].classList.add('show-mini-cart');
                        document.querySelectorAll(".header-cart.action-area__link")[0].classList.add('has-cart-count');
                    }
                        

                    if (document.querySelectorAll(".ajax-cart__empty-cart-message")[0])
                        document.querySelectorAll(".ajax-cart__empty-cart-message")[0].classList.add('is-hidden');

                    if (document.querySelectorAll(".ajax-cart__form")[0])
                        document.querySelectorAll(".ajax-cart__form")[0].classList.remove('is-hidden');

                    var itemsSubtotalPrice = document.getElementsByClassName('ajax-cart__subtotal');
                    var subtotal = Shopify.formatMoney(response.items_subtotal_price, Shopify.money_format)
                    console.log(subtotal)

                    for (let i = 0; i < itemsSubtotalPrice.length; i++) {
                        itemsSubtotalPrice[i].querySelector('.money').innerHTML = Shopify.formatMoney(response.items_subtotal_price, Shopify.money_format)
                    }

                    for (let i = 0; i < ajaxCartList.length; i++) {
                        ajaxCartList[i].innerHTML = html;
                    }
                }

            }
        }
    });


}


//// swatchs color

var variantSwatch = function (product,productUrl) {
    var html = "";

    var colorHasImg = {};

    var option = product.options.find(o => o.name === 'Color' || o.name === 'Colour');
    if (option)
        for (let i = 0; i < option.values.length; i++) {
            var imageIndex = 0;

            product.variants.filter(v => {
                for (let n = 0; n < v.options.length; n++) {
                    var optVal = option.values[i];
                    if (optVal == v.options[n] && !colorHasImg[optVal]) {
                        imageIndex = v.imageIndex;

                        var img = product.images[imageIndex]; // test again
                        if (img) {
                            colorHasImg[optVal] = 1;
                            var colorHandled = colorHandle(optVal);
                            var imgUrl = img.url;

                            html += `<a href="${productUrl}?variant=${v.id}" class="swatch swatch__style--${usf_themeSettings.collection_swatches_shape}" data-swatch-name="meta-color_${colorHandled}"> 
                                        <span data-image="${imgUrl}" style="background-color: ${colors(colorHandled)};"> 
                                            <img class="swatch__image swatch__image--empty" src="${imgUrl}" alt="${optVal}">
                                        </span>
                                    </a>`
                        } 
                    }
                }
            })
        }

    return html


}


var colorHandle = function(color) {
    return color.toLowerCase().replace(/[\s\/]/g, '_').replace(/---/g, '_').replace(/--/g, '_')
}

var colors = function (c) {
    var cl = "color";
    Object.keys(colorJson).forEach(function (key) {
        if (c.toLowerCase().includes(key)) cl = key;
    });
    return cl
}


var colorJson = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkgrey": "#a9a9a9",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkslategrey": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "goldenrod": "#daa520",
    "gold": "#ffd700",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "grey": "#808080",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavenderblush": "#fff0f5",
    "lavender": "#e6e6fa",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightgrey": "#d3d3d3",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightslategrey": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "slategrey": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
}
usf.event.add('init', function () {
    // register or override components
    // ...    
    /*var SearchResultsGridItem2 = {
        template: usf.templates.searchResultsGridViewItem,
    }
    usf.register(SearchResultsGridItem2, usf.components.SearchResultsGridItem, "usf-sr-griditem");*/
});
