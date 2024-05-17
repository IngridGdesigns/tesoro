/* eslint-disable react/prop-types */
import { Component } from 'react';
// import Table from '@mui/joy/Table';
import { withAuth0 } from '@auth0/auth0-react';
// import AddTransactionForm from './forms/addTransactionForm';



class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            error: null,
            userID: '',
            isModalOpen: false,

        };

        this.handleGetTransactions = this.handleGetTransactions.bind(this);
       
        // this.getUser = this.getUser.bind(this);
    }

    async componentDidMount () {
        await this.getUser();
        await this.handleGetTransactions(); // needs to await 

    }


getUser = async () => {
    const { user, getAccessTokenSilently } = this.props.auth0;
    
    try {
        const user_sub = user.sub;

        const headers = {
            'Authorization': `Bearer ${getAccessTokenSilently()}`,
            'Content-Type': 'application/json; charset=UTF-8'
        };

        const response = await fetch(`/api/users/sub/${user_sub}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userID = await response.json(); // Parse response body as JSON
        console.log(userID, 'getting user information?');

        this.setState({ userID });
        console.log(userID)
    } catch (error) {
        console.error('Error fetching user data:', error);
        
    }
};
    
    
   handleGetTransactions = async () => {
    const { user, getAccessTokenSilently } = this.props.auth0;
       const token = await getAccessTokenSilently();

       if (!user) {
           console.log('no user!');
       }

       const user_sub = user.sub;

       fetch(`/api/transactions/sub/${user_sub}`, {
           method: 'GET',
           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8'}
       })
           .then(response => response.json())
           .then(data => {
               console.log(data);
               
               this.setState({transactions: data})
           })
        .catch(error => console.error(error))
   }



    // end of crud

    render() {
        // eslint-disable-next-line react/prop-types
        const { user, isLoading } = this.props.auth0; 
     


        if (!user) {
            return null;
        }
        

        if (isLoading) {
            return <div>Loading...</div>;
        }

        return (

            <div>
                {/* <img src={user.picture} alt={user.name} /> */}
                <h1>{user.name} Transactions</h1>
                
                <div>
                    <h4>Start Saving or Spending</h4>
                    {/* <AddTransactionForm handleCreateTransaction={this.handleCreateTransaction}/> */}
                </div>
               
                <hr/>
                <h2>View Transactions</h2>
                {/* {this.state.transactions.map((action, id) => {
                    <li key={id}>{}</li>
                }})
                */}
            </div>
        
        );
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth0(Transactions);

