import React from "react";
import PropTypes from "prop-types";

import styles from "./styles";

export class Feature extends React.Component {
  render() {
    const { image, image_2x, alt, tagline, lead, style } = this.props;

    return (
      <div style={{ ...styles.featureContainer, ...style }}>
        <img
          src={image}
          srcSet={`${image_2x} 2x`}
          style={styles.featureIllustration}
          alt={alt}
        />
        <h2 style={styles.tagline}>{tagline}</h2>
        <p style={styles.lead}>{lead}</p>
      </div>
    );
  }
}

Feature.propTypes = {
  image: PropTypes.string.isRequired,
  image_2x: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired,
  lead: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default Feature;