import React , {Component } from 'react'
import TableSorter from './TableSorter.js'
// import { SortableHeader } from "./sortableTableHeader";
// import { Table } from 'semantic-ui-react'

export default class Table extends Component {

// Display API data - componentDidMount - pull specific elements - DONE
// Create table displaying API data - DONE
// Create Search bar - DONE
// Create search bar for prefix - DONE
// Create ascending/descending order for Prefix & Ofsted Rating - search 'enabling sorting on table header', look at semantic UI mentioned in task ReadMe
// Create dropdown for Ofsted rating
// Style table
// //      - Headers are grey
//         - Ofsted rating column colours
//         - Table margins in general

    constructor(props) {
        super(props);
        
        this.state = {
            error: null,
            isLoaded: false,
            colleges: [],
            searchByName: "",
            searchByPrefix: "",
            currentSort: 'default'
        };
        
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ searchByName: event.target.value, 
                        searchByPrefix: event.target.value })
    }

    componentDidMount() {
        fetch(`https://mindfuleducation-cdn.s3.eu-west-1.amazonaws.com/misc/data.json`)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    colleges: result.getColleges
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
        // const { TableReducer } = this.props;
        // dispatch(TableReducer('a', 'b'))
    }

    renderRow(college) {
        return (
            <tr key={college.id}>
                <td>{college.name}</td>
                <td>{college.groupPrefix}</td>
                <td>
                    {college.logo && (
                        <img className="w-full" src={college.logo} alt={college.name} />
                    )} 
                </td>
                {/* If ofsted rating good (<Table.Row warning> <Table.cell>{college.ofstedRating}</Table.cell> </Table.Row>) */}
                <td>{college.ofstedRating}</td>
            </tr>
        )
    }

    render() {

        const filterColleges = (colleges, query) => {
            if(!query) {
                return colleges;
            }

            return colleges.filter((college) => {
                const collegeName = college.name.toLowerCase();
                const collegePrefix = college.groupPrefix.toLowerCase();
                return collegeName.includes(query) || collegePrefix.includes(query);      
            });
        };

        const filteredColleges = filterColleges(
            this.state.colleges,
            this.state.searchByName, 
            this.state.searchByPrefix
        );

        const sortTypes = {
            up: {
                class: 'sort-up',
                fn: (a, b) => a.name - b.name
            }, 
            down: {
                class: 'sort-down',
                fn: (a, b) => b.name - a.name
            },
            default: {
                class: 'sort',
                fn: (a, b) => a
            }
        };

        const onSortChange = () => {
            const { currentSort } = this.state
            let nextSort;

            if (currentSort === 'down') nextSort = 'up';
            else if (currentSort === 'up') nextSort = 'default';
            else if (currentSort === 'default') nextSort = 'down';

            this.setState({ 
                currentSort: nextSort
            });
        }

        const { currentSort } = this.state

            return ( 
                <div>

                    <table className="table-fixed border-collapse">
                            <thead>
                                <tr>
                                    <input
                                        type="text"
                                        placeholder="Search partners"
                                        onChange={this.handleChange}
                                    />
                                </tr>
                                <tr>
                                    <input
                                        type="text"
                                        placeholder="Search prefix"
                                        onChange={this.handleChange}
                                    />
                                </tr>
                                <tr>
                                    {/* <th className="w-1/12">Name</th> */}
                                    <th>
                                        Name
                                        <button onClick={this.state.onSortChange}>
                                            <i className={`fas fa-${sortTypes[currentSort].class}`}/>
                                        </button>
                                    </th>
                                    
                                    <th className="w-1/12">Prefix</th>
                                    
                                    <th className="w-1/12">Logo</th>
                                   
                                    <th className="w-1/12">Ofsted Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...filteredColleges].sort(sortTypes[currentSort].fn).map(college => this.renderRow(college))}
                            </tbody>
                        </table>
   
                </div>
            )

            
        }
    }
// } const { column, data, direction } = this.state

// return (
//     <Table sortable celled fixed>
//         <Table.Header>
//             <Table.Row>
//                 <Table.HeaderCell 
//                     sorted={column === 'name' ? direction : null}
//                     onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'name' })}
//                 >
//                     Name
//                 </Table.HeaderCell>
//             </Table.Row>
//         </Table.Header>
//     </Table>
// )