import RCPagination from "rc-pagination";
import PropTypes from "prop-types";
import React from "react";

type Props = {
  pageSize: number,
  onPageChange: Function,
  currentPage: number,
  totalElements: number
};

function Pagination(props: Props) {
  const textItemRender = (current, type, element) => {
    if (type === "prev") {
      return (
        <div data-testid="previous-page" className="rc-prev">
          &lsaquo;
        </div>
      );
    }
    if (type === "next") {
      return (
        <div data-testid="next-page" className="rc-next">
          &rsaquo;
        </div>
      );
    }
    if (type === "jump-next") {
      return <div className="jump-next"> ••• </div>;
    }
    if (type === "jump-prev") {
      return <div className="jump-prev"> ••• </div>;
    }
    return element;
  };

  let pageSize = props.pageSize;
  let totalElements = props.totalElements;

  return (
    <div className="pagination-box">
      <div className="pagination-box">
        {pageSize < totalElements && (
          <RCPagination
            itemRender={textItemRender}
            className="pagination"
            defaultPageSize={pageSize}
            showTitle={false}
            onChange={props.onPageChange}
            current={props.currentPage}
            total={props.totalElements}
            showLessItems={true}
          />
        )}
      </div>
    </div>
  );
}

Pagination.propTypes = {
  loading: PropTypes.bool,
  onPageChange: PropTypes.func,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalElements: PropTypes.number
};

export default Pagination;
