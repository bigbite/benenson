import LinkList from './editable/LinkList';
import GridItem from './editable/GridItem';
import PostItem from './editable/PostItem';

const { __ } = wp.i18n;
const { Component } = wp.element;
const { BlockIcon } = wp.editor;

class DisplayCustom extends Component {
  static defaultObject = {
    tag: '',
    tagLink: '',
    title: '',
    titleLink: '',
    excerpt: '',
    featured_image: '',
    featured_image_id: '',
  };

  createUpdateMediaAttribute = index => ({ featuredImageId, featuredImage }) => {
    if (this.props.custom[index]) {
      return this.props.setAttributes({
        custom: [
          ...this.props.custom.map((item, i) => (index === i ? ({
            ...item,
            featuredImage,
            featuredImageId,
          }) : item)),
        ],
      });
    }

    return this.props.setAttributes({
      custom: [
        ...this.props.custom,
        {
          ...DisplayCustom.defaultObject,
          featuredImage,
          featuredImageId,
        },
      ],
    });
  };

  /**
    * Creates a higher order function that takes the current item index
    * from there the returned function takes a parameter of key,
    * this could be title or any other key from the object
    * the final function takes a parameter of value, this changes
    * the value of the desired key and in the desired item
    * @param index
    * @returns {function(*=): Function}
    */
  createUpdateAttribute = index => key => (value) => {
    // If the index already exists just update the value for that specific key
    // This should always be the case however there was an occasion where
    // the default object wasnt created so this is a safe guard
    if (this.props.custom[index]) {
      return this.props.setAttributes({
        custom: [
          ...this.props.custom.map((item, i) => (index === i ? ({
            ...item,
            [key]: value,
          }) : item)),
        ],
      });
    }

    return this.props.setAttributes({
      custom: [
        ...this.props.custom,
        {
          ...DisplayCustom.defaultObject,
          [key]: value,
        },
      ],
    });
  };

  addItem = () => this.props.setAttributes({
    custom: [
      ...this.props.custom,
      { ...DisplayCustom.defaultObject },
    ],
  });

  createRemoveItem = index => () => this.props.setAttributes({
    custom: [
      ...this.props.custom.filter((item, i) => i !== index),
    ],
  })

  render() {
    let { custom = [] } = this.props;
    const { style, prefix } = this.props;

    if (!custom.length > 0) {
      custom = [
        { ...DisplayCustom.defaultObject },
      ];
    }

    return (<div>
      { style === 'list' && <ul className="linkList">
        { custom.map((item, index) => (
          <LinkList
            key={ `${prefix}-${index}` }
            { ...item }
            createUpdate={ this.createUpdateAttribute(index) }
            createRemove={ this.createRemoveItem(index) }
          />
        )) }
      </ul> }

      { style === 'grid' && <div className={ `grid grid-${custom.length}` }>
        { custom.map((item, index) => (
          <GridItem
            key={ `${prefix}-${index}` }
            { ...item }
            createUpdate={ this.createUpdateAttribute(index) }
            createRemove={ this.createRemoveItem(index) }
            updateMedia={ this.createUpdateMediaAttribute(index) }
          />
        )) }
      </div> }

      { style === 'post' && <ul className="postList">
        { custom.map((item, index) => (
          <PostItem
            key={ `${prefix}-${index}` }
            { ...item }
            createUpdate={ this.createUpdateAttribute(index) }
            createRemove={ this.createRemoveItem(index) }
          />
        )) }
      </ul> }

      { custom.length < 8 && <button onClick={this.addItem} className="add-more-button">
        <BlockIcon icon="plus-alt" />
        <span>{ __('Add another item', 'benenson') }</span>
      </button> }
    </div>);
  }
}

export default DisplayCustom;
