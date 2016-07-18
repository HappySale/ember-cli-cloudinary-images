import Ember from 'ember';
const { computed, Logger, typeOf } = Ember;

/** @const {String} Default fallback domain */
export const CLOUDINARY_DOMAIN = 'cloudinary.com';
/** @const {String} Cloudinary's default sub domain */
export const CLOUDINARY_SUB_DOMAIN = 'res';

/**
 * Cloudinary service
 * @class
 * @extends {Ember.Service}
 * @public
 */
export default Ember.Service.extend({
  /**
   * @property {Object} config
   * @public
   */

  /**
   * http://kevin.vanzonneveld.net
   * original by: Webtoolkit.info (http://www.webtoolkit.info/)
   * improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * improved by: sowberry
   * tweaked by: Jack
   * bugfixed by: Onno Marsman
   * improved by: Yves Sucaet
   * bugfixed by: Onno Marsman
   * bugfixed by: Ulrich
   * bugfixed by: Rafal Kukawski
   * improved by: kirilloid
   *     example 1: utf8_encode('Kevin van Zonneveld');
   *     returns 1: 'Kevin van Zonneveld'
   *
   * @method _utf8Encode
   * @param  {String} str
   * @return {String}
   * @private
   */
  _utf8Encode(string = '') {
    let utftext = '';
    let start;
    let end;
    let stringl = 0;

    start = end = 0;
    stringl = string.length;

    for (let n = 0; n < stringl; n++) {
      const c1 = string.charCodeAt(n);
      let enc = null;

      if (c1 < 128) {
        end++;
      } else if (c1 > 127 && c1 < 2048) {
        enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
      } else {
        enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
      }
      if (enc !== null) {
        if (end > start) {
          utftext += string.slice(start, end);
        }
        utftext += enc;
        start = end = n + 1;
      }
    }

    if (end > start) {
      utftext += string.slice(start, stringl);
    }

    return utftext;
  },

  /**
   * http://kevin.vanzonneveld.net
   * original by: Webtoolkit.info (http://www.webtoolkit.info/)
   * improved by: T0bsn
   * improved by: http://stackoverflow.com/questions/2647935/javascript-crc32-function-and-php-crc32-not-matching
   * depends on: utf8_encode
   * example 1: crc32('Kevin van Zonneveld');
   * returns 1: 1249991249
   *
   * @method _crc32
   * @param  {String} str
   * @return {String}
   * @private
   */
  _crc32(string = '') {
    string = this._utf8Encode(string);
    const table = '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';
    let crc = 0;
    let x = 0;
    let y = 0;

    crc = crc ^ (-1);
    for (let i = 0, iTop = string.length; i < iTop; i++) {
      y = (crc ^ string.charCodeAt(i)) & 0xFF;
      x = '0x' + table.substr(y * 9, 8);
      crc = (crc >>> 8) ^ x;
    }

    crc = crc ^ (-1);
    /** Convert to unsigned 32-bit int if needed */
    if (crc < 0) {
      crc += 4294967296;
    }

    return crc;
  },

  /** @property {String} cloudName */
  cloudName: computed.readOnly('config.CLOUD_NAME'),
  /** @property {String} domain */
  domain: computed('config.DOMAIN', function() {
    return this.get('config.DOMAIN') || CLOUDINARY_DOMAIN;
  }),
  /** @property {String} subDomain */
  subDomain: computed('config.DOMAIN', 'config.SUB_DOMAIN', function() {
    const domain = this.get('config.DOMAIN');
    const subDomain = this.get('config.SUB_DOMAIN');

    if (domain === CLOUDINARY_DOMAIN) {
      return subDomain || CLOUDINARY_SUB_DOMAIN;
    } else {
      return subDomain || '';
    }
  }),
  /** @property {Boolean} secure */
  secure: computed.readOnly('config.SECURE'),
  /** @property {Boolean} cdnDistribution */
  cdnDistribution: computed.readOnly('config.CDN_DISTRIBUTION'),

  /**
   * Creates URL prefix for publicId
   * @param  {String}  publicIdIncludeFormat   Public id of image include file format
   * @param  {String}  options.cloudName       User on Cloudinary
   * @param  {String}  options.subDomain       Sub-domain for private CDN or domain
   * @param  {String}  options.domain          [='cloudinary.com'] Domain if any
   * @param  {Boolean} options.cdnDistribution [=false] Enable multiple sub domains options
   * @param  {Boolean} options.secure          [=true] Use HTTPs or HTTP
   * @return {String}                          URL
   */
  publicIdURLPrefix(publicIdIncludeFormat = '', options = {}) {
    let { cloudName, subDomain, domain, cdnDistribution, secure } = options;
    if (typeOf(cloudName) === 'undefined') { cloudName = this.get('cloudName'); }
    if (typeOf(subDomain) === 'undefined') { subDomain = this.get('subDomain'); }
    if (typeOf(domain) === 'undefined') { domain = this.get('domain'); }
    if (typeOf(cdnDistribution) === 'undefined') { cdnDistribution = this.get('cdnDistribution'); }
    if (typeOf(secure) === 'undefined') { secure = this.get('secure'); }

    if (!cloudName) {
      Logger.warn('There is no `cloudName`');
      return '';
    }

    domain = domain || CLOUDINARY_DOMAIN;
    /** @constant {String} */
    const protocol = secure ? 'https://' : 'http://';

    if (domain === CLOUDINARY_DOMAIN && subDomain !== CLOUDINARY_SUB_DOMAIN && subDomain) {
      subDomain = `${subDomain}-res`;
    } else {
      subDomain = (domain === CLOUDINARY_DOMAIN && !subDomain) ? CLOUDINARY_SUB_DOMAIN : subDomain;
    }

    /** @constant {String} */
    const pathname = (domain === CLOUDINARY_DOMAIN && subDomain === CLOUDINARY_SUB_DOMAIN) ? `/${cloudName}` : '';


    if (cdnDistribution) {
      const crcPublicIdIncludeFormatCode = (this._crc32(publicIdIncludeFormat) % 5) + 1;

      subDomain = (
        domain === CLOUDINARY_DOMAIN && subDomain === CLOUDINARY_SUB_DOMAIN ?
          `${subDomain}-${crcPublicIdIncludeFormatCode}` :
          `a${crcPublicIdIncludeFormatCode}.${subDomain}`
      );
    }

    return `${protocol}${subDomain}.${domain}${pathname}`;
  },


  /** @property {String[]} concatenatedTransforms */
  concatenatedTransforms: computed('config.CONCATENATED_TRANSFORMS', function() {
    // Protection from Strings
    const concatenatedTransforms = this.get('config.CONCATENATED_TRANSFORMS') || [];
    return Array.isArray(concatenatedTransforms) ? concatenatedTransforms : [concatenatedTransforms];
  }),
  /** @property {String[]} defaultTransforms */
  defaultTransforms: computed.readOnly('config.DEFAULT_TRANSFORMS'),
  /** @property {String} defaultImageFormat */
  defaultImageFormat: computed.readOnly('config.DEFAULT_IMAGE_FORMAT'),

  /**
   * @method computeUrl
   * @param  {String}          [publicId]           Public id of image in Cloudinary
   * @param  {String}          hash.format          File extension)
   * @param  {String}          hash.cloudName
   * @param  {(String|Number)} hash.width
   * @param  {(String|Number)} hash.height
   * @param  {(String|Number)} hash.version
   * @param  {String}          hash.domain
   * @param  {String}          hash.subDomain
   * @param  {Boolean}         hash.cdnDistribution
   * @param  {Boolean}         hash.secure
   * @param  {String}          hash.type
   * @param  {String[]}        hash.transforms
   * @return {String}                               URL for image
   */
  computeUrl(publicId = [], hash = {}) {
    /** @validation */
    if (!publicId) {
      return '';
    }

    let {
      cloudName,
      width,
      height,
      version,
      domain,
      subDomain,
      cdnDistribution,
      secure,
      resourceType,
      type,
      format,
      transforms
    } = hash;
    // Default params
    if (typeOf(resourceType) === 'undefined') { resourceType = 'image'; }
    if (typeOf(type) === 'undefined') { type = 'upload'; }
    if (typeOf(format) === 'undefined') { format = this.get('defaultImageFormat'); }
    if (typeOf(transforms) === 'undefined') { transforms = this.get('defaultTransforms'); }


    /** @type {String[]} Transforms to concatenate */
    const concatenatedTransforms = this.get('concatenatedTransforms');
    /** Convert transforms to array if the given param was string **/
    transforms = Array.isArray(transforms) ? transforms : transforms || [];
    /** Adds concatenated transforms **/
    transforms = concatenatedTransforms.concat(transforms);
    /** Adds width if exists **/
    transforms = width || width === 0 ? [`w_${width}`].concat(transforms) : transforms;
    /** Adds height if exists **/
    transforms = height || height === 0 ? [`h_${height}`].concat(transforms) : transforms;

    /** Encoding */
    publicId = encodeURIComponent(decodeURIComponent(publicId)).replace(/%3A/g, ":").replace(/%2F/g, "/");
    /** Add format if exists */
    publicId = format ? `${publicId}.${format}` : publicId;

    /** @type {String} */
    const urlPrefix = this.publicIdURLPrefix(publicId, {
      cloudName,
      subDomain,
      domain,
      cdnDistribution,
      secure
    });

    /** @type {String} Transforms in String form */
    const sTransforms = transforms.join(',');

    return (
      urlPrefix + '/' +
      `${resourceType}/${type}/` +
      (sTransforms ? sTransforms + '/' : '') +
      (version ? `v${version}/` : '') +
      publicId
    );
  }
});
