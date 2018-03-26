import Pagination from 'rc-pagination';
import PropTypes from 'prop-types';
import React from 'react';

export default class LPagination extends React.Component {
    render() {
        const textItemRender = (current, type, element) => {
            if (type === 'prev') {
                return <div className="rc-prev">&lsaquo;</div>;
            }
            if (type === 'next') {
                return <div className="rc-next">&rsaquo;</div>;
            }
            if (type === 'jump-next') {
                return <div className="jump-next"> ••• </div>;
            }
            if (type === 'jump-prev') {
                return <div className="jump-prev"> ••• </div>;
            }
            return element;
        };

        return (
            <div className="pagination-box">
                <div className="pagination-box">
                    {!this.props.loading && <Pagination
                        itemRender={textItemRender}
                        className="pagination"
                        defaultPageSize={20}
                        showTitle={false}
                        onChange={this.props.onPageChange}
                        current={this.props.currentPage}
                        total={this.props.totalElements}
                    />}
                </div>
            </div>
        );
    }
}

LPagination.propTypes = {
    loading: PropTypes.bool,
    onPageChange: PropTypes.func,
    currentPage: PropTypes.number,
    totalElements: PropTypes.number
};