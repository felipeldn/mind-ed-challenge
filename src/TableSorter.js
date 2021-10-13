import React from 'react'

function TableSorter(props) {
    
        const { colleges } = props;
        const [sortConfig, setSortConfig] = React.useState(null);

        let sortedColleges = [...colleges];

        if (sortConfig !== null) {
            sortedColleges.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        function requestSort(key) {
            let direction = 'ascending';
            if (sortConfig.key === key && sortConfig.direction === 'ascending') {
                direction = 'descending';
            }

            setSortConfig({key, direction});
        }
}

export default TableSorter;
