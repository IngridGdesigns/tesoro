/* eslint-disable react/prop-types */
import { Component } from 'react';
// import Table from '@mui/joy/Table';
import { withAuth0} from '@auth0/auth0-react';



class Budget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            budgets: [],
        //     error: null,
            userID: '',
        //     isModalOpen: false,

        };

        
        // this.getUser = this.getUser.bind(this);
    }

    async componentDidMount () {
        await this.getUser();
       

    }


getUser = async () => {
    const { user, getAccessTokenSilently } = this.props.auth0;
    const usersub = user.sub;

    try {
        const token = await getAccessTokenSilently();
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=UTF-8'
        };

        const response = await fetch(`/api/users/sub/${usersub}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        console.log(userData, 'here lies the results full of stuff, where is the id??');

         this.setState({ userID: userData});
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};
    
    
    handleGetBudget= async () => {
    const { getAccessTokenSilently } = this.props.auth0;
       const token = await getAccessTokenSilently();

        const { userID } = this.state;
        const user_id = parseInt(userID.user_id);

       fetch(`/api/budget/${user_id}`, {
           method: 'GET',
           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8'}
       })
           .then(response => response.json())
           .then(data => {
               console.log(data);
               this.setState({budgets: data})
           })
        .catch(error => console.error(error))
   }
    
    // end of crud

    render() {
        // eslint-disable-next-line react/prop-types
        const { isLoading } = this.props.auth0; // Use the custom hook

        // if (!user) {
        //     return null;
        // }
        
        if (isLoading) {
            return <div>Loading...</div>;
        }

        return (

            <div>
                <h1>Hello</h1>
                <ul>
                    {this.state.budgets.map((budget, key) => (
                        <li key={key}>{}</li>
                    ))}
                    </ul>
            </div>
        
        );
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth0(Budget);

