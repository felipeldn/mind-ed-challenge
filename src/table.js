import React , {Component } from 'react'
// import TableSorter from './TableSorter.js'
// import { Table } from 'semantic-ui-react'

export default class Table extends Component {

// Display API data - componentDidMount - pull specific elements - DONE
// Create table displaying API data - DONE
// Create Search bar - DONE
// Create search bar for prefix - DONE
// Create ascending/descending order for Prefix & Ofsted Rating - search 'enabling sorting on table header', look at semantic UI mentioned in task ReadMe - DONE
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
                        <img className="w-full" src={college.logo} alt={college.name} width="50%" height="50%" align="center" />
                    )} 
                </td>
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
                fn: (a, b) => a.name > b.name ? -1 : 1
            }, 
            down: {
                class: 'sort-down',
                fn: (a, b) => a.name < b.name ? 1 : -1
            },
            default: {
                class: 'sort',
                fn: (a, b) => 0
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
        // console.log(currentSort)
            return ( 
                <div>

                    <table className="table-fixed">
                            <thead>
                                    <input
                                        type="text"
                                        placeholder="Search partners"
                                        onChange={this.handleChange}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search prefix"
                                        onChange={this.handleChange}
                                    />
                                <tr>
                                    <th className="w-1/12" onClick={onSortChange}>
                                            <i className={`fas fa-${sortTypes[currentSort].class}`}/>Name 
                                    </th>
                                    
                                    <th className="w-1/12">Prefix</th>
                                    
                                    <th className="w-1/12">Logo/Preroll</th>
                                   
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