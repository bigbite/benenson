import classnames from 'classnames';

const { __ } = wp.i18n;

const trimBr = (str = '') => str.replace(/(?:(?:(?:<|&lt;|\u003c)br[^>]*?>)+)/gi, ' ').trim();
const ucfirst = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);
const isType = (val, type) => Object.prototype.toString.call(val) === `[object ${ucfirst(type)}]`;
const stringify = val => (isType(val, 'array') ? val.join('') : val);
const brToP = (str = '') => stringify(str)
  .replace(/((<|&lt;|\u003c)br[^>]*?>)+$/, '') // trim trailing <br>s
  .split(/(?:(?:(?:<|&lt;|\u003c)br[^>]*?>)+)/) // split on one or more embedded <br>s
  .map(p => `<p>${p}</p>`) // make paragraphs
  .join(''); // make a string

export function buildSlideDeprecated(slide, hasContent, sliderId) {
  const shouldShowContent = () => !slide.hideContent && hasContent;
  const shouldShowButton = () => slide.callToActionText && slide.callToActionLink;
  const shouldShowToggle = () => slide.content || (
    slide.callToActionText && slide.callToActionLink
  );

  const getUrl = (size) => {
    const obj = (slide.sizes[size] || slide.sizes.full || { source_url: '' });
    return encodeURI(obj.source_url);
  };

  const style = sliderId && slide.sizes && Object.keys(slide.sizes).length > 0 ? {} : {
    backgroundImage: `url(${slide.imageUrl || ''})`,
  };

  let cssBlock = '';
  if (sliderId && slide.sizes && Object.keys(slide.sizes).length > 0) {
    const selector = `#slider-${sliderId} #slide-${slide.id}`;

    cssBlock = `
      ${selector}{background-image: url("${getUrl('hero-sm')}")}
      @media screen and (min-width:770px){${selector}{background-image: url("${getUrl('hero-md')}")}}
      @media screen and (min-width:1444px){${selector}{background-image: url("${getUrl('hero-lg')}")}}
    `;
  }

  const slideClasses = classnames('slide', {
    [`is-${slide.alignment}-aligned`]: !!slide.alignment,
    [`has-${slide.background}-background`]: !!slide.background,
  });

  const content = {
    __html: brToP(slide.content),
  };

  return (<div id={ `slide-${slide.id}` } className={ slideClasses } style={ style }>
    <style>{ cssBlock }</style>
    { shouldShowContent() && (<div className="slide-contentWrapper" data-tooltip={ __('Tap here to return to gallery', 'benenson') }>
      <div className="slide-contentContainer">
        { slide.heading && <h1 className="slide-title">{ trimBr(slide.heading) }</h1> }
        { slide.subheading && <h2 className="slide-subtitle">{ trimBr(slide.subheading) }</h2> }
        <div className="slide-content">
          { slide.content && <div dangerouslySetInnerHTML={ content }></div> }
          { shouldShowButton() && (
            <a className="btn" href={ slide.callToActionLink }>{ trimBr(slide.callToActionText) }</a>
          ) }
          { shouldShowToggle() && <button className="slider-toggleContent">{ __('Toggle Content', 'benenson') }</button> }
        </div>
      </div>
    </div>) }
  </div>);
}

export class SlideBuilder {
  build(slide, hasContent, sliderId) {
    this.slide = slide;
    this.hasContent = hasContent;
    this.sliderId = sliderId;

    return this.render();
  }

  shouldShowContent() {
    return !this.slide.hideContent && this.hasContent;
  }

  shouldShowButton() {
    return !!(this.slide.callToActionText && this.slide.callToActionLink);
  }

  shouldShowToggle() {
    return !!brToP(this.slide.content) || this.shouldShowButton();
  }

  hasInnerContent() {
    return this.shouldShowButton() || this.shouldShowToggle();
  }

  getUrl(size) {
    const obj = (this.slide.sizes[size] || this.slide.sizes.full || { source_url: '' });
    return encodeURI(obj.source_url);
  }

  hasImageSizes() {
    const { sizes } = this.slide;

    return this.sliderId && sizes && Object.keys(sizes).length > 0;
  }

  getBackground() {
    const { sizes, imageUrl } = this.slide;

    if (!this.hasImageSizes() || !imageUrl) {
      return {};
    }

    return {
      backgroundImage: `url("${imageUrl}")`,
    };
  }

  getCssBlock() {
    if (!this.hasImageSizes()) {
      return '';
    }

    const selector = `#slider-${this.sliderId} #slide-${this.slide.id}`;

    // concating template strings to avoid unsightly whitespace.
    return `${selector}{background-image: url("${this.getUrl('hero-sm')}")}`
      + `@media screen and (min-width:770px){${selector}{background-image: url("${this.getUrl('hero-md')}")}}`
      + `@media screen and (min-width:1444px){${selector}{background-image: url("${this.getUrl('hero-lg')}")}}`;
  }

  getSlideClasses() {
    const { alignment, background } = this.slide;

    return classnames('slide', {
      [`is-${alignment}-aligned`]: !!alignment,
      [`has-${background}-background`]: !!background,
    });
  }

  getHtmlContent() {
    return {
      __html: brToP(this.slide.content),
    };
  }

  render() {
    const {
      id,
      heading,
      subheading,
      callToActionLink,
      callToActionText,
    } = this.slide;

    const content = this.getHtmlContent();

    return (<div id={ `slide-${id}` } className={ this.getSlideClasses() }>
      <style>{ this.getCssBlock() }</style>
      { this.shouldShowContent() && (<div className="slide-contentWrapper" data-tooltip={ __('Tap here to return to gallery', 'benenson') }>
        <div className="slide-contentContainer">
          { heading && <h1 className="slide-title">{ trimBr(heading) }</h1> }
          { subheading && <h2 className="slide-subtitle">{ trimBr(subheading) }</h2> }
          { this.hasInnerContent() && <div className="slide-content">
            { content.__html && <div dangerouslySetInnerHTML={ content }></div> }
            { this.shouldShowButton() && <a className="btn btn--white" href={ callToActionLink }>{ trimBr(callToActionText) }</a> }
            { this.shouldShowToggle() && <button className="slider-toggleContent">{ __('Toggle Content', 'benenson') }</button> }
          </div> }
        </div>
      </div>) }
    </div>);
  }

  buildDeprecated(slide, hasContent, sliderId) {
    this.slide = slide;
    this.hasContent = hasContent;
    this.sliderId = sliderId;

    return this.renderDeprecated();
  }

  renderDeprecated() {
    const {
      id,
      heading,
      subheading,
      callToActionLink,
      callToActionText,
    } = this.slide;

    const content = this.getHtmlContent();

    return (<div id={ `slide-${id}` } className={ this.getSlideClasses() } style={ this.getBackground() }>
      <style>{ this.getCssBlock() }</style>
      { this.shouldShowContent() && (<div className="slide-contentWrapper" data-tooltip={ __('Tap here to return to gallery', 'benenson') }>
        <div className="slide-contentContainer">
          { heading && <h1 className="slide-title">{ trimBr(heading) }</h1> }
          { subheading && <h2 className="slide-subtitle">{ trimBr(subheading) }</h2> }
          { this.hasInnerContent() && <div className="slide-content">
            { content.__html && <div dangerouslySetInnerHTML={ content }></div> }
            { this.shouldShowButton() && <a className="btn" href={ callToActionLink }>{ trimBr(callToActionText) }</a> }
            { this.shouldShowToggle() && <button className="slider-toggleContent">{ __('Toggle Content', 'benenson') }</button> }
          </div> }
        </div>
      </div>) }
    </div>);
  }
}
