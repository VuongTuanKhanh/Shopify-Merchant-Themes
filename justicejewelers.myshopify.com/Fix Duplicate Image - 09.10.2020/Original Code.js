// define templates for the Turbo theme
if (!window._usfSettingSection)
    window._usfSettingSection = {};

window._usfSettingGlobal = window._usfSettingGlobal || {
    cart_action: null,
    collection_secondary_image: false,
    collection_swatches: true,
    currency: "CAD",
    description_words: 25,
    display_inventory_left: false,
    image_loading_style: "blur-up",
    limit_quantity: false,
    mobile_products_per_row: 2,
    money_format: "${{amount}}",
    object_fit: true,
    product_form_style: "swatches",
    quick_shop_enabled: true,
    quick_shop_style: "popup",
    show_payment_button: true,
    thumbnail_hover_enabled: true,
    sale_banner_enabled: true
};


var usfDefaultThemeSettings = {
    "display_collection_title": true,
    "collection_breadcrumb": true,
    "collection_tags": true,
    "collection_sort": true,
    "image": null,
    "featured_collection_image": false,
    "image_darken": false,
    "products_per_row": 3
}; // pls dont 

var usfDefaultGlobalSetting = {
    "mobile_products_per_row": 2,
    "quick_shop_style": "popup",
    "image_loading_style": "fade-in",
    "object_fit": true,
    "collection_secondary_image": false,
    "collection_swatches": false,
    "quick_shop_enabled": true,
    "show_payment_button": false,
    "product_form_style": "dropdown",
    "limit_quantity": true,
    "display_inventory_left": false,
    "cart_action": null
};;

for (var k in _usfSettingSection) {
    var val = _usfSettingSection[k];
    if (val === null || val === undefined)
        _usfSettingSection[k] = usfDefaultThemeSettings[k]
}

for (var k in _usfSettingGlobal) {
    var val = _usfSettingGlobal[k];
    if (val === null || val === undefined)
        _usfSettingGlobal[k] = usfDefaultGlobalSetting[k]
}


var usfAssetUrl = ""
var nodes = document.head.children;
for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];
    if (n.href && n.href.indexOf('styles.scss.css') != -1) {
        usfAssetUrl = n.href.split('styles.scss.css')[0];
    }
}

//window._usfSettingGlobal.quick_shop_style = "inline"

var _usf_products_per_row_pc = _usfSettingSection.products_per_row,
    _usf_products_per_row_phone = _usfSettingGlobal.mobile_products_per_row,
    _usf_quick_shop_style = _usfSettingGlobal.quick_shop_style,
    _usf_image_loading_style = _usfSettingGlobal.image_loading_style,
    _usf_object_fit = _usfSettingGlobal.object_fit,
    _usf_collection_height = _usfSettingSection.collection_height,
    _usf_collection_secondary_image = _usfSettingGlobal.collection_secondary_image,
    _usf_collection_swatches = _usfSettingGlobal.collection_swatches,
    _usf_quick_shop_enabled = _usfSettingGlobal.quick_shop_enabled,
    _usf_show_payment_button = _usfSettingGlobal.show_payment_button,
    _usf_product_form_style = _usfSettingGlobal.product_form_style,
    _usf_money_format = _usfSettingGlobal.money_format,
    _usf_currency = _usfSettingGlobal.currency,
    _usf_cart_action = _usfSettingGlobal.cart_action;



function get_usfAddonProductClassPC() {
    if (_usf_products_per_row_pc == 2) return " eight columns ";
    else if (_usf_products_per_row_pc == 3) return " one-third column ";
    else if (_usf_products_per_row_pc == 4) return " four columns ";
    else if (_usf_products_per_row_pc == 5) return " one-fifth column ";
    else if (_usf_products_per_row_pc == 6) return " one-sixth column ";
    else return " one-seventh column "
}

function get_usfAddonSkeletonClassPC() {
    if (_usf_products_per_row_pc == 2) return " usf-grid-el-1-2 ";
    else if (_usf_products_per_row_pc == 3) return " usf-grid-el-1-3";
    else if (_usf_products_per_row_pc == 4) return " usf-grid-el-1-4 ";
    else if (_usf_products_per_row_pc == 5) return " usf-grid-el-1-5 ";
    else if (_usf_products_per_row_pc == 6) return " usf-grid-el-1-6 ";
    else return " one-seventh column "
}

var _usf_getIMGBySizeFromRawURL = function (t, r) {
    if (t.includes('no-image.png')) return t;
    try {
        if ("original" == r)
            return t;
        var e = t.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
        return e[1] + r + "." + e[2]
    } catch (o) {
        return t
    }
}
function usfGetImageBySize(url, size = '_600x') {
    if (url.includes('no-image'))
        return url;
    if (!url.includes('_600x')) {
        var n = url.lastIndexOf(".");
        return url.substring(0, n) + size + url.substring(n);
    } else
        return url.replace('_600x.', size + '.');

}
function get_usfAddonProductClassMobile() {
    if (_usf_products_per_row_phone == "1") return " medium-down--one-half small-down--one-whole ";
    return " medium-down--one-half small-down--one-half ";
}

const _usfImageWidths = [200, 400, 600, 700, 800, 900, 1000, 1200]

function _usfGetProductImageSet(url) {
    var sizeList = _usfImageWidths
    try {
        var txt = "";
        for (var i = 0; i < sizeList.length; i++) {
            txt += url.replace('_300x300', `_${sizeList[i]}x`) + ` ${sizeList[i]}w,`
        }
        return txt;
    } catch (e) {
        console.log(e);
        console.log("error url : ", url);
        return url;
    }
}
// hoverImageUrl || selectedImageUrl
function _usf_getProductIMGStyle(img, imageResized) {
    var background_color = "",
        crop_to_aspect_ratio = "",
        imageWidth = "";
    //Low quality image loads first
    if (_usf_image_loading_style == 'color') {
        if (_usf_object_fit == true) {
            crop_to_aspect_ratio = `max-height: ${_usf_collection_height}px; width: calc(${img.width} /  ${img.height} * ${_usf_collection_height}px);`
        }
        background_color = `background: url('${_usf_getIMGBySizeFromRawURL(imageResized, '_1x')}');`;
    }
    var style = `${background_color} ${crop_to_aspect_ratio} max-width:${img.width}px`;
    // console.log(style);
    return style;
    // {{ background_color }}{{ crop_to_aspect_ratio }} {% unless stretch_width == true or object_fit %}max-width: {{ image.width }}px;{% endunless %}
}


var getImgWithSize = function (img, size = '') {
    return img.replace('{size}', size)
}

var usfNoImageUrl
function _getDataImages(product) {
    var data = '';
    if (product.images.length)
        product.images.filter((img, index) => {
            data += data != '' ? '~' : '';
            data += `${img.url}^${product.title}^${product.id}${index}^600^image`
        });
    else
        data = `${usfNoImageUrl}^${product.title}^${product.id}0^600^image`
    return data
}

function _getDataThumbailImages(product) {
    var data = '';
    product.images.filter((img, index) => {
        data += data != '' ? '~' : '';
        data += `${img.url}^image^${product.id}${index}^600`
    })
    return data
}
function _getDataCollectionHandles(product) {
    var data = '';
    product.collections.filter(col => {
        data += data != '' ? ',' : '';
        data += textHandle(col.title)
    })
    return data
}
var _usfTruncatewords = function (desc, size = 10) {
    if (!desc)
        return "";
    if (desc.split(' ').length && desc.split(' ').length <= size)
        return desc;
    var rs = desc.slice(0, desc.indexOf(' ' + desc.split(' ')[size] + ' ')) + '...';
    return rs.replace(/Description/g, '').replace(/Dimensions/g, '').replace(/Details/g, '').replace(/Specs/g, '').replace(/Shipping/g, '').replace(/Size/g, '')
}
var textHandle = function (str) {
    return str.toLowerCase().replace(/[\s\/]/g, '-').replace(/---/g, '-').replace(/--/g, '-')
}
var dataMonetFormat = document.body.getAttribute('data-money-format');
var dataShopCurrency = document.body.getAttribute('data-shop-currency');

function getVariantTitle(options) {
    return options.join(' / ');
}

var _dataProduct = function (p) {
    var product = JSON.parse(JSON.stringify(p));
    var pow = Math.pow(10, usf.settings.decimals);
    product.variants.filter(v => {
        v.options.filter((o, index) => {
            v[`option${index + 1}`] = o;
        });
        v.available = v.available > 0 ? true : false;
        v.compare_at_price = v.compareAtPrice * pow;
        v.featured_image = {
            id: `${product.id}${v.imageIndex}`
        };
        v.featured_media = {
            id: `${product.id}${v.imageIndex}`
        };
        v.title = getVariantTitle(v.options);
        v.price = v.price * pow;
    });
    var opts = product.options;
    product.options = [];
    for (let i = 0; i < opts.length; i++) {
        var opt = opts[i];
        product.options.push(opt.name);
    }

    return JSON.stringify(product)
}
function _strimHtml(source) {
    return source.replace(/<[^>]*>?/gm, '')
}
var _usfProductForm = `<div class="clearfix product_form init smart-payment-button--false"  :class="[{'product_form_options': product.variants.length > 1 || product.options.length > 1},'product_form--' + _usfSettingGlobal.product_form_style]" 
    :id="'product-form-'+product.id" data-product-form 
    :data-options-size="product.options.length"
    :data-money-format="_strimHtml(dataMonetFormat)" 
    :data-shop-currency="dataShopCurrency"
    :data-select-id="'product-select-' + product.id + 'collection-template'" 
    data-enable-state="false" 
    :data-product="_dataProduct(product)" 
    :data-product-id="product.id"
    >
    <form method="POST" enctype="multipart/form-data" :action="usf.platform.addToCartUrl" :id="'product_form_' + product.id" class="shopify-product-form">
            <input type="hidden" name="form_type" value="product">
            <input type="hidden" name="utf8" value="✓">
            <div v-if="product.options.length > 1" class="select">
                <select :id="'product-select-' + product.id + 'collection-template'" name="id" class="multi_select">
                    <option v-for="v in product.variants" :selected="v.id === (product.selectedVariantId || product.variants[0].id) ? 'selected' : false" :value="v.id" :data-sku="v.sku" v-html="getVariantTitle(v.options)"></option>
                </select>
            </div>
            <div v-else-if="product.options.length === 1" class="select">
                <label  v-html="product.options[0].name"></label>
                <select :id="'product-select-' + product.id + 'collection-template'" name="id">
                    <option v-for="v in product.variants" :selected="(product.selectedVariantId && v.id === product.selectedVariantId) || (!product.selectedVariantId && v.id === product.variants[0].id)" :value="v.id" :data-sku="v.sku" v-html="getVariantTitle(v.options)"></option>
                </select>
            </div>
            <input v-else type="hidden" name="id" :value="product.selectedVariantId || product.variants[0].id">
            <div v-if="_usfSettingGlobal.product_form_style == 'swatches' && (product.variants.length > 1 || product.options[0] != 'Title')" class="swatch_options">
                <template v-for="(o,index) in product.options" >
                    <div class="swatch clearfix" :data-option-index="index" v-html="swatchHtml(o,index,product)"></div>
                </template>
            </div>
            <div class="purchase-details">
                <div v-if="_usfSettingGlobal.display_product_quantity" class="purchase-details__quantity product-quantity-box">
                    <label for="quantity">Qty</label>
                    <span class="ss-icon product-minus js-change-quantity" data-func="minus"><span class="icon-minus"></span></span>
                    <input type="number" min="1" size="2" class="quantity" name="quantity" id="quantity" value="1" :max="product.available"/>
                    <span class="ss-icon product-plus js-change-quantity" data-func="plus"><span class="icon-plus"></span></span>
                </div>
                <div class="purchase-details__buttons purchase-details__spb--false" :class="{'product-is-unavailable': isSoldOut}">
                    <input v-if="_usfSettingGlobal.cart_action === 'reload_page'" type="hidden" name="return_to" value="back" />
                    <input v-else-if="_usfSettingGlobal.cart_action === 'redirect_checkout'" type="hidden" name="return_to" value="/checkout" />
                    <button :type="_usfSettingGlobal.cart_action == 'ajax'  ? 'button' : 'submit'" name="add" class="action_button add_to_cart ajax-submit" :class="{'ajax-submit': _usfSettingGlobal.cart_action == 'ajax','disabled': isSoldOut}" :data-label="loc.addToCart">
                        <span class="text" v-html="isSoldOut ? loc.soldOut : loc.addToCart"></span>
                        <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" class="checkmark">
                        <path fill="none" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11"/>
                        </svg>
                    </button>
                </div>
            </div>
        </form> </div>`;

var usfQuickShopButtonTpl = `
<span class="quick_shop ss-icon js-quick-shop-link" :data-id="product.id" :data-handle="product.urlName" :data-title="product.title" :data-single-variant="product.variants.length == 1 ? 'true' : 'false'"
 :data-url="productUrl"
 :data-details-text="loc.seeFullDetails"
 :data-full-description="product.description" 
 :data-regular-description="_usfTruncatewords(product.description,_usfSettingGlobal.description_words)" 
 :data-feat-img="usfGetImageBySize(scaledSelectedImageUrl,'_large')"
 :data-images="_getDataImages(product)" 
 :data-thumbnail-images="_getDataThumbailImages(product)" 
 :data-collection-handles="_getDataCollectionHandles(product)"
 v-html="loc.quickView" ></span>
<div :class="'quickshop-forms__container js-quickshop-forms__container js-quickshop-forms--' + product.id">
        `+ _usfProductForm + `
</div>`;
var _usfProductInfoTpl = `
<div class="product-details">
            <!-- product title -->
            <span class="title" itemprop="name" :attrs="usf.plugins.invoke('getProductTitleAttrs', pluginData)"
                v-html="product.title"></span>
            <!-- Vendor -->
            <span class="brand" v-if="usf.settings.search.showVendor" v-html="product.vendor"></span>
            <!-- Product review -->
            <div class="shopify-reviews reviewsVisibility--true">
                <usf-plugin name="searchResultsProductReview" :data="pluginData"></usf-plugin>
            </div>
            <!-- price -->
            <usf-plugin name="searchResultsProductPrice" :data="pluginData"></usf-plugin>
            <span v-if="usf.platform.collection && usf.platform.collection.includes('coming-soon')" class="modal_price">Coming soon</span>
            <span v-else class="price" :class="{'sale': hasDiscount}" v-if="!usf.plugins.lastRenderResult">
                <div v-if="isSoldOut && usf.settings.search.showSoldOut" class="sold-out" v-html="loc.soldOut"></div>
                <template v-else >
                    <span class="current_price" :data-min="minPrice">
                        <small v-if="minDiscountedPrice != maxDiscountedPrice"><em>from</em></small>
                        <span v-if="minPrice > 0" class="money" v-html="displayMinDiscountedPrice"></span>
                        <span v-else v-html="_usfSettingGlobal.free_price_text"></span>
                    </span>
                    <span class="was_price">
                        <span v-if="hasDiscount" class="money" v-html="displayPrice"></span>
                    </span>
                </template>
            </span>
        </div>`

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
<div v-if="view === 'grid'" class="usf-sr-product grid__item small--one-half usf-skeleton" :class="get_usfAddonSkeletonClassPC()">
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

    <div :class="(view === \'grid\' ? \'product-list collection-matrix clearfix equal-columns--clear equal-columns--outside-trim\' : \'list-view-items\') + \' usf-results usf-\' + view" class="product-list">
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
<div class="usf-sr-product ` + get_usfAddonProductClassPC() + get_usfAddonProductClassMobile() + ` thumbnail quick-shop-style--` + _usf_quick_shop_style + `" :class="['product-' + product.id]" :key="product.Id" :product-selector="product.id">
<div class="product-wrap">
    <div class="relative product_image" :class="{'swap-true':(usf.settings.search.showAltImage),'swap-false':!usf.settings.search.showAltImage}">
        <a :href="productUrl" @click="onItemClick" @mouseover="onItemHover" @mouseleave="onItemLeave" style="display:block;position: relative;">
            <div class="image__container">
                <div class="image-element__wrap" :style="_usf_getProductIMGStyle(selectedImage,selectedImageUrl)">
                    <img :alt="product.title"
                        :src="getImgWithSize(scaledSelectedImageUrl,'50')"
                        data-sizes="auto"
                        :data-aspectratio="selectedImage.width/selectedImage.height"
                        :data-src="getImgWithSize(scaledSelectedImageUrl,'1600')"
                        :data-srcset="_usfGetImageUrls(scaledSelectedImageUrl)"
                        :height="selectedImage.height"
                        :width="selectedImage.width"
                        :class="'main---img lazyload transition--'+_usf_image_loading_style "
                    >
                </div>
            </div>
            <div class="image__container" v-if="_usf_collection_secondary_image && (usf.settings.search.showAltImage) ">
                <img :alt="product.title"
                    :src="getImgWithSize((scaledHoverImageUrl || scaledSelectedImageUrl),'600')"
                    class="secondary lazyload"
                >
            </div>

                <!-- Wishlist -->
                <usf-plugin name="searchResultsProductWishList" :data="pluginData"></usf-plugin>

                <!-- Labels -->
                <usf-plugin name="searchResultsProductLabel" :data="pluginData"></usf-plugin>
        </a>
        <div v-if="_usfSettingGlobal.thumbnail_hover_enabled || (_usf_quick_shop_enabled && _usf_quick_shop_style == 'popup')" class="thumbnail-overlay">
            <a :href="productUrl" itemprop="url" class="hidden-product-link" v-html="product.title"></a>
            <div class="info">
                <template v-if="window._usfSettingGlobal.thumbnail_hover_enabled">
                    `+ _usfProductInfoTpl + `
                </template>
                <template v-if="_usf_quick_shop_enabled && _usf_quick_shop_style == 'popup'">
                    `+ usfQuickShopButtonTpl + `
                </template>
            </div>
        </div>
        <div class="banner_holder">
            <div v-if="!isSoldOut && hasDiscount && _usfSettingGlobal.sale_banner_enabled" class="sale_banner thumbnail_banner" v-html="loc.sale"></div>
            <div v-if="usf.platform.collection && usf.platform.collection.includes('new')" class="new_banner thumbnail_banner">New</div>
            <div v-if="usf.platform.collection && usf.platform.collection.includes('pre-order')" class="preorder_banner thumbnail_banner">Pre order</div>
        </div>
       
    </div>
    <a v-if="!_usfSettingGlobal.thumbnail_hover_enabled" class="product-info__caption " :href="productUrl">
        `+ _usfProductInfoTpl + `
    </a>
</div>
<template v-if="!(_usf_quick_shop_enabled && _usf_quick_shop_style == 'inline')">
    <usf-color-swatch :product="product" :selectedImageUrl="selectedImageUrl" :productUrl="productUrl" v-if="_usf_collection_swatches"></usf-color-swatch>
</template>

<!--<template v-if="_usf_quick_shop_style == 'popup' && _usf_quick_shop_enabled">
    <usf-color-swatch :product="product" :selectedImageUrl="selectedImageUrl" :productUrl="productUrl" v-if="_usf_collection_swatches"></usf-color-swatch>
</template>-->
<template v-if="(_usf_quick_shop_style == 'inline' && _usf_quick_shop_enabled)">
    <div :class="'inline-quickshop js-product_section product-'+product.id">
        `+ _usfProductForm + `
    </div>
</template>
</div>
`,

    // Search result pages
    searchResultsPages: `
<div class="paginate text-center">
    <template v-for="e in elements">
        <span v-if="e.type === 'prev'" class="prev">
            <a href="javascript:void(0)" :title="loc.prevPage" @click="onPrev"><span class="icon-left-arrow"></span></a>
        </span>
        <span v-else-if="e.type === 'dots'" class="deco">…</span>
        <span v-else-if="e.type === 'page' && e.current" class="page current">{{e.page}}</span>
        <span v-else-if="e.type === 'page' && !e.current" class="page"><a href="javascript:void(0)" @click="onPage(e.page)" :title="usf.utils.format(loc.gotoPage,e.page)">{{e.page}}</a></span>
        <span v-else-if="e.type === 'next'" class="next">
            <a href="javascript:void(0)" :title="loc.nextPage" @click="onNext"><span class="icon-right-arrow"></span></a>
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
    <div class="list-view-item__price-column">
        <div class="usf-price product-price__price" :class="{'usf-has-discount': hasDiscount}" v-html="displayPrice"></div>
        <div class="usf-discount product-price__price product-price__sale" v-if="hasDiscount" v-html="displayDiscountedPrice"></div>
    </div>
</a>
`,
    // AddToCart Plugin	

    addToCartPlugin: `
<form class="usf-add-to-cart" method="POST" enctype="multipart/form-data" :action="usf.platform.addToCartUrl">
    <input type="hidden" name="id" :value="variant.id">
    <button type="submit" name="add" :class="{'usf-visible': args.isHover}" class="usf-ajax-submit usf-add-to-cart-btn">
        <span class="text"  v-html="loc.addToCart"></span> 
            <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" class="checkmark">
                <path fill="none" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11"></path>
            </svg>
    </button>
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
            <div class="usf-preview__content-right smart-payment-button--false"> 
                <!--Product banners inserted with JS - populateProductInfo() -->
                <div class="sale_banner_product" v-if="hasDiscount && selectedVariant.compareAtPrice != selectedVariant.price"><span v-html="loc.sale"></span></div>
                
                <!-- Vendor -->
                <p class="vendor">
                    <span class="vendor" v-html="product.vendor"></span>
                </p>

                <!-- Product title -->
                <h3 class="quick-shop__title"><a :href="productUrl" :title="product.title" v-html="product.title"></a></h3>
                <div class="feature_divider"></div>

                <p class="modal_price">
                    <span class="sold_out" v-if="isSoldOut" v-html="loc.soldOut"></span>
                    <template v-else>
                        <span class="current_price" :class="{'sale': selectedVariant.compareAtPrice > selectedVariant.price}"><span class="money" v-html="selectedVariant.price ? usf.utils.getLongDisplayPrice(selectedVariant.price) :'Free'"></span></span>
                        <span class="was_price" v-if="selectedVariant.compareAtPrice > selectedVariant.price"><span class="money" v-html="usf.utils.getLongDisplayPrice(selectedVariant.compareAtPrice)"></span></span>
                    </template>
                </p>

                <template v-if="window._usfSettingGlobal.quick_shop_product_description_position == 'top'">
                    <template v-if="window._usfSettingGlobal.quick_shop_full_description">
                        <span class="clearfix" v-html="product.description"></span>
                        <span>
                            <a class="secondary_button" :href="productUrl" v-html="loc.seeFullDetails"></a>
                        </span>
                    </template>
                    <template v-else>
                        <p>
                            <span>
                                <a class="secondary_button" :href="productUrl" v-html="loc.seeFullDetails"></a>
                            </span>
                        </p>
                    </template>
                </template>
                
                <!--Prices -->
                <!--<div class="usf-preview__price-wrapper price" :class="{'price--sold-out': isSoldOut}">
                    <span class="usf-price product-price__price" :class="{'usf-has-discount': hasDiscount}" v-html="usf.utils.getLongDisplayPrice(selectedVariant.compareAtPrice || selectedVariant.price)"></span>
                    <span v-if="hasDiscount && selectedVariant.compareAtPrice != selectedVariant.price"  class="usf-discount product-price__price product-price__sale" v-html="usf.utils.getLongDisplayPrice(selectedVariant.price)"></span>

                    <div class="price__badges price__badges--listing">
                        <span class="price__badge price__badge--sale" aria-hidden="true" v-if="hasDiscount && selectedVariant.compareAtPrice != selectedVariant.price && usf.settings.search.showSale">
                            <span v-html="loc.sale"></span>
                        </span>
                        <span class="price__badge price__badge--sold-out" v-if="isSoldOut && usf.settings.search.showSoldOut">
                            <span v-html="loc.soldOut"></span>
                        </span>
                    </div>
                </div>-->

                <!-- Add to cart form -->
                <form method="post" enctype="multipart/form-data" :action="usf.platform.addToCartUrl">
                    <!-- variant ID -->
                    <input type="hidden" name="id" :value="selectedVariant.id" />

                    <!-- Options -->
                    <template v-for="o in product.options">
                        <usf-preview-modal-option :option="o"></usf-preview-modal-option>
                    </template>

                    <!-- add to card button -->
                    <!--<div class="usf-preview__field">
                        <label v-html="loc.quantity"></label>
                        <div class="usf-flex usf-preview__add-to-cart">
                            <input pattern="[0-9]*" min="1" :value="quantity" name="quantity" type="number" />
                            <button :title="!hasAvailableVariant ? loc.selectedVariantNotAvailable : ''" :disabled="!hasAvailableVariant" type="submit" name="add" class="usf-preview--add-to-cart-btn" :class="{ 'usf-disabled': !hasAvailableVariant}" v-html="loc.addToCart"></button>
                        </div>
                    </div>-->

                    <div class="purchase-details">
                        <div class="purchase-details__quantity product-quantity-box">
                            <label for="quantity" v-html="loc.quantity"></label> 
                            <span class="ss-icon product-minus js-change-quantity" data-func="minus"><span class="icon-minus"></span></span>
                            <input type="number" pattern="[0-9]*" min="1" :value="quantity" size="2" class="quantity" name="quantity" id="quantity" > 
                            <span class="ss-icon product-plus js-change-quantity" data-func="plus"><span class="icon-plus"></span></span>
                        </div>
                        <div class="purchase-details__buttons purchase-details__spb--false">
                            <button :title="!hasAvailableVariant ? loc.selectedVariantNotAvailable : ''" :disabled="!hasAvailableVariant" type="submit" name="add" class="action_button add_to_cart usf_ajax-submit" :data-label="loc.addToCart"> <span class="text" v-html="loc.addToCart"></span> 
                                <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" class="checkmark">
                                    <path fill="none" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>

                <!-- See details link -->
                <template v-if="window._usfSettingGlobal.quick_shop_product_description_position == 'bottom'">
                    <template v-if="window._usfSettingGlobal.quick_shop_full_description">
                        <span class="clearfix" v-html="product.description"></span>
                        <span >
                            <a class="secondary_button" :href="productUrl" v-html="loc.seeFullDetails"></a>
                        </span>
                    </template>
                    <template v-else>
                        <p>
                            <span >
                                <a class="secondary_button" :href="productUrl" v-html="loc.seeFullDetails"></a>
                            </span>
                        </p>
                    </template>
                </template>
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
var usfTextSplit = function (source, txt, first = true) {
    return first ? source.slice(0, source.indexOf(txt)) : source.slice(source.indexOf(txt) + txt.length, source.length)
}
var swatchHtml = function (option, option_index, p) {
    var html = `<div class="option_title">${option.name}</div>`;
    var optionShowed = {};
    var is_color = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour';


    for (let i = 0; i < option.values.length; i++) {
        var value = option.values[i];
        var valueHandle = textHandle(value);
        var valueSplited = usfTextSplit(value, ' ', false);
        var valueSplitedHandled = textHandle(valueSplited);
        p.variants.filter(v => {
            if (value == v.options[option_index] && !optionShowed[value]) {
                imageIndex = v.imageIndex;
                optionShowed[value] = 1;
                var img = p.images[v.imageIndex];
                var labelHtml = "";
                var style = '';
                if (is_color)
                    style = `background-image: url(${usfAssetUrl + valueHandle + '_50x.png'}); background-color: ${valueSplitedHandled}`;

                html += `<input id="swatch-${option_index}-${valueHandle}-${p.id}-collection-template" type="radio" name="option-${option_index}" aria-label="${value}" tabindex="0" value="${value}" ${option_index == 0 ? 'checked' : ''}>`;
                html += `<div tabindex="0" value="${value}" data-value="${value}" data-id="${v.id}" class="swatch-element ${is_color ? 'color' : ''} ${valueHandle}-swatch ${usf.utils.isVariantSoldOut(v) ? 'soldout' : 'available'}">
                ${is_color ? `<div class="tooltip">${value}</div>` : ''}
                <label ${img ? `data-image="${usfGetImageBySize(img.url, '_600x')}"` : ''} for="swatch-${option_index}-${valueHandle}-${p.id}-collection-template"
                 style="${style}"
                >
                ${!is_color ? value : ''}
                <img class="crossed-out" src="${usfAssetUrl + 'soldout.png'}" aria-label="sold out" alt="sold out"/>
                </label>
            </div>`
            }
        })
    }
    return html
}


usf.event.add('init', function () {
    //Shopify.theme_settings.sold_out_text = usf.settings.translation.soldOut;
    var metas = document.querySelectorAll('meta[property="og:image"]')
    for (let i = 0; i < metas.length; i++) {
        var mt = metas[i];
        if (mt && mt.getAttribute('content').includes('no-image')) {
            usfNoImageUrl = mt.getAttribute('content');
            break
        }
    }
    if (!usfNoImageUrl)
        usfNoImageUrl = usf.platform.emptyImage.url;

    usf.event.add(['sr_updated', 'sr_viewChanged', 'rerender'], function () {

        setTimeout(function () {
            if (_usf_quick_shop_style === 'inline')
                productPage.init();
        }, 100);
    });

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
        data() {
            var colorValues = [],
                currentVariantId = '';
            //Get list color
            try {
                var productOptions = this.product.options;
                for (var i = 0; i < productOptions.length; i++) {
                    var o = productOptions[i];
                    if (o.name == 'Color' || o.name == 'Colours') {
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

            return {
                colors: colorValues,
                currentURL: this.productUrl,
                currentVariantId: currentVariantId,
                currentBgImages: {},
            }
        },
        render(h) {
            return h('div', {
                class: 'collection_swatches'
            }, [
                    this.renderOptions(h)
                ])
        },
        methods: {
            renderOptions(h) {
                var vm = this;
                var pid = this.product.id;

                return this.colors.map((c, index) => {
                    var pindex = pid + "-" + index;
                    var imageUrl = usfAssetUrl + c.toLowerCase() + '_64x64.png';
                    usfImageExists(imageUrl, (v) => {
                        if (v)
                            this.$set(this.currentBgImages, c, imageUrl);
                    });
                    return h('a', {
                        key: (pid + c),
                        attrs: {
                            href: "/products/" + this.product.urlName + "?variant=" + this.colorToVariant(c),
                            'data-swatch-name': `meta-color_${c}`
                        },
                        class: 'swatch'
                    }, [
                            h('span', {
                                attrs: {
                                    'data-image': this.colorToImage(c)
                                },
                                style: {
                                    backgroundColor: this.currentBgImages[c] ? null : c,
                                    backgroundImage: this.currentBgImages[c] ? 'url(' + imageUrl + ')' : null,
                                }
                            })
                        ])
                })
            },
            colorToVariant(c) {
                // console.log(c)
                //console.log(this.product)

                try {
                    var product = this.product;
                    var variants = product.variants;
                    for (let i = 0; i < variants.length; i++) {
                        if (variants[i].options.includes(c)) {
                            var selectedVariant = variants[i];
                            return selectedVariant.id;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                return this.currentVariantId;
            },
            colorToImage(c) {
                try {
                    var product = this.product;
                    var variants = product.variants;
                    for (let i = 0; i < variants.length; i++) {
                        if (variants[i].options.includes(c)) {
                            var selectedVariant = variants[i];
                            var imageIndex = selectedVariant.imageIndex;
                            if (product.images[imageIndex]) {
                                return product.images[imageIndex].url;
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                return this.selectedImageUrl;
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
        }
    }
    usf.register(_usfColorSwatch, null, 'usf-color-swatch');



});







