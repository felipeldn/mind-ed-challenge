import React , { Component } from 'react'
// import TableSorter from './TableSorter.js'
import { Table, Image, Input } from 'semantic-ui-react'
// import { Image } from 'semantic-ui-react'

export default class Partners extends Component {

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
            <Table.Row key={college.id}>
                <Table.Cell>{college.name}</Table.Cell>
                <Table.Cell>{college.groupPrefix}</Table.Cell>
                <Table.Cell>
                    {college.logo && (
                        <Image src={college.logo} alt={college.name} size="small"/>
                    )} 
                </Table.Cell>
                <Table.Cell>{college.ofstedRating}</Table.Cell>
            </Table.Row>
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
                fn: (a, b) => a.name < b.name ? -1 : 1
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
            else if (currentSort === 'up') nextSort = 'down';
            else if (currentSort === 'default') nextSort = 'down';

            this.setState({ 
                currentSort: nextSort
            });
        }

        const { currentSort } = this.state
        // console.log(currentSort)
            return ( 
                <div>

                                    <Input
                                        type="text"
                                        placeholder="Search partners"
                                        onChange={this.handleChange}
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Search prefix"
                                        onChange={this.handleChange}
                                    />
                    <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell onClick={onSortChange}>
                                        <i className={`fas fa-${sortTypes[currentSort].class}`}/>Name 
                                    </Table.HeaderCell>
                
                                    <Table.HeaderCell>Prefix</Table.HeaderCell>
                                    
                                    <Table.HeaderCell>Logo/Preroll</Table.HeaderCell>
                                   
                                    <Table.HeaderCell>Ofsted Rating</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {[...filteredColleges].sort(sortTypes[currentSort].fn).map(college => this.renderRow(college))}
                            </Table.Body>
                    </Table>
   
                </div>
            )
            
        }
}