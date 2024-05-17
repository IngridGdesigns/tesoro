import {Component} from 'react';
import { withAuth0 } from '@auth0/auth0-react';


class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            error: null,
            userID: '',
        }


        console.log('transactions');
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth0(Transactions)