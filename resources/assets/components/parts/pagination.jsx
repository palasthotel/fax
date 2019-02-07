import React from "react";
import { render } from "react-dom";

class Pagination extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const numPages = Math.ceil(this.props.count / this.props.perPage);

    if (numPages < 2) {
      return null;
    }

    return (
      <nav className="uk-margin-medium">
        <ul className="uk-pagination uk-text-small" uk-margin="">
          {this.renderPrevPage()}

          {[...Array(numPages)].map((x, i) => {
            return this.renderItem(i + 1);
          })}

          {this.renderNextPage(numPages)}
        </ul>
      </nav>
    );
  }

  renderPrevPage() {
    const prevPage = this.props.page > 1 ? this.props.page - 1 : false;

    if (prevPage) {
      return (
        <li onClick={this.props.changePage.bind(this, prevPage)}>
          <a href="#">
            <span className="uk-margin-small-right" uk-pagination-previous="" />{" "}
            Previous
          </a>
        </li>
      );
    }

    return (
      <li className="uk-disabled">
        <span>
          <span className="uk-margin-small-right" uk-pagination-previous="" />{" "}
          Previous
        </span>
      </li>
    );
  }

  renderNextPage(numPages) {
    const nextPage = this.props.page < numPages ? this.props.page + 1 : false;

    if (nextPage) {
      return (
        <li onClick={this.props.changePage.bind(this, nextPage)}>
          <a href="#">
            Next <span className="uk-margin-small-left" uk-pagination-next="" />
          </a>
        </li>
      );
    }

    return (
      <li className="uk-disabled">
        <span>
          Next <span className="uk-margin-small-left" uk-pagination-next="" />
        </span>
      </li>
    );
  }

  renderItem(page) {
    if (page === this.props.page) {
      return (
        <li
          className="uk-active"
          key={`page_${page}`}
          onClick={this.props.changePage.bind(this, page)}
        >
          <a href="#">{page}</a>
        </li>
      );
    }

    return (
      <li key={`page_${page}`} onClick={this.props.changePage.bind(this, page)}>
        <a href="#">{page}</a>
      </li>
    );
  }
}

Pagination.defaultProps = {
  perPage: 10,
  count: 30,
  page: 1
};

export default Pagination;
