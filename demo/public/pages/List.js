
import React, {Component} from 'react'

import BookList from '../components/BookList'

class List extends Component {
    render() {
        return (
            <section>
                <h1>Book List</h1>
                <BookList />
            </section>
        )
    }
}

export default List