import React from "react";
import { render } from "react-dom";
import { Link } from "react-router-dom";

class ArticleImages extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const images = this.props.images;

    if (!Array.isArray(images) || images.length < 1) {
      return (
        <div className="uk-margin-medium uk-margin-medium-bottom" uk-grid="">
          <div className="uk-width-1-4@m">No images.</div>
        </div>
      );
    }

    return (
      <div className="uk-margin-medium uk-margin-medium-bottom" uk-grid="">
        {images.map(image => {
          return (
            <div className="uk-width-1-4@m" key={`article_image_${image.id}`}>
              <img src={image.url} className="uk-box-shadow-small" />
              {typeof image.text !== undefined && image.text != "" && (
                <p className="uk-margin-small">{image.text}</p>
              )}
              <a
                className="uk-button uk-button-link uk-margin-small-top"
                href={image.url}
                download
              >
                <span
                  uk-icon="icon: download"
                  className="uk-margin-small-right"
                />
                Download
              </a>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ArticleImages;
