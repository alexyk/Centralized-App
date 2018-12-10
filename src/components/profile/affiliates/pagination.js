import RCPagination from "rc-pagination";
import PropTypes from "prop-types";
import React from "react";

export const DEFAULT_PAGE_SIZE = 10;

function Pagination(props) {
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

  return (
    <div className="pagination-box">
      <div className="pagination-box">
        {DEFAULT_PAGE_SIZE < props.totalElements && (
          <RCPagination
            itemRender={textItemRender}
            className="pagination"
            defaultPageSize={
              props.pageSize ? props.pageSize : DEFAULT_PAGE_SIZE
            }
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
