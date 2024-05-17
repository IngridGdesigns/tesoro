/* eslint-disable react/prop-types */
import { Component } from 'react';
import Table from '@mui/joy/Table';
import CreatebudgetForm from './forms/createbudgetForm';
import { withAuth0} from '@auth0/auth0-react';


class Budget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            budgets: [],
            error: null,
            userID: '',
            // isModalOpen: false,

        };

        this.handleGetBudget = this.handleGetBudget.bind(this);
        this.handleCreateBudget = this.handleCreateBudget.bind(this)
        this.handleDeleteBudget = this.handleDeleteBudget.bind(this)
        // this.getUser = this.getUser.bind(this);
    }

    async componentDidMount () {
        await this.getUser();
        await this.handleGetBudget(); // needs to await 

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
       
    } catch (error) {
        console.error('Error fetching user data:', error);
        
    }
};
    

   handleGetBudget = async () => {
    const { getAccessTokenSilently, user } = this.props.auth0;
       const token = await getAccessTokenSilently();
       const user_sub = user.sub;

       if (!user) {
           console.log('no user!');
       }
     
       fetch(`/api/budgets/sub/${user_sub}`, {
           method: 'GET',
           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8'}
       })
           .then(response => response.json())
           .then(data => {
            //    console.log(data);
               console.log(data)

           
               this.setState({ budgets: data})
           })
        .catch(error => console.error(error))
   }
    

    handleCreateBudget= async (newBudget) => {
        const { getAccessTokenSilently, user } = await this.props.auth0;
        const { userID } = this.state; // getUser to get the user's ID

        const user_sub = user.sub;
        const user_id = Number(userID.user_id);
     
        const { category_id, description, start_date, amount } = newBudget;
        
    //  const amount = parseFloat(goal_amount)
    try {
        const response = await fetch(`/api/budgets`, { // check change may 17 12pm
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessTokenSilently()}`
            },
            body: JSON.stringify({ amount: parseFloat(amount), user_id, user_sub, category_id: Number(category_id), description, start_date}) 
        });

        if (!response.ok) {
            throw new Error('Failed to create goal');
        }

        const data = await response.json();

        this.setState((prevState) => ({
            budgets: [...prevState.budgets, data],
        }));
    } catch (error) {
        console.error('Error creating budget', error);
        this.setState({
            error: error.message
        });
    }
};
    
    handleDeleteBudget = async (budget) => {
    const { getAccessTokenSilently } = this.props.auth0;
    console.log(budget.budget_id, 'is this being deleted???')

        const budget_id = Number(budget.budget_id);
    
    try {
        const response = await fetch(`/api/budgets/delete/${budget_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessTokenSilently()}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete budget');
        }

        // Find the index to be deleted
        const index = this.state.budgets.findIndex(b => b.budget_id === budget.budget_id);
        if (index !== -1) {
            // Create a copy of the budgets array and remove at the found index
            const updatedBudgets = [...this.state.budgets];
            updatedBudgets.splice(index, 1);
            // Update state with the new array 
            this.setState({ budgets: updatedBudgets });
        }
    } catch (error) {
        console.error('Error deleting budget:', error);
    }
}


    // handleDeleteBudget(budget) { /// from financial goals
    //     const { getAccessTokenSilently } = this.props.auth0;
    //     console.log(budget.budget_id, 'is this being deleted???')
        
    //     const budget_id = Number(budget.budget_id);

    //     fetch(`/api/budgets/delete/${budget_id}`, {
    //         method: 'DELETE',
    //         headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${getAccessTokenSilently()}`
    //         },
    //     }).then(data => {
    //         console.log('Budget deleted:', data);
    //     // Find the index to be deleted
    //     const index = this.state.budgets.findIndex(b => b.budget_id === budget.budget_id);
    //     if (index !== -1) {
    //         // Create a copy of the goals array and remove at the found index
    //         const updatedBudgets = [...this.state.budgets];
    //         updatedBudgets.splice(index, 1);
    //         // Update state with the new array 
    //         this.setState({ budgets: updatedBudgets });
    //     }
    
    // }) // Manipulate the data retrieved back, if we want to do something with it
    //     .catch(err => console.error(err)) 
    // }

//     // end of crud

    render() {
        // eslint-disable-next-line react/prop-types
        const { user, isLoading } = this.props.auth0; // Use the custom hook
      
        // const { isModalOpen } = this.state;

        // let userId = 0;
        // let userSub = '';
        
        // goals.forEach((item, i) => {
        //     console.log(item, `at ${i}, where are we`)
        //     userId = item.user_id
        // })

        if (!user) {
            return null;
        }
        

        if (isLoading) {
            return <div>Loading...</div>;
        }

        return (

          
             <div>
                {/* <img src={user.picture} alt={user.name} /> */}
                <h1>{user.name} Budgets</h1>
                
                <div>
                    <h4>Create a budget</h4>
                    <CreatebudgetForm handleCreateBudget={this.handleCreateBudget}/>
                </div>
               
                <hr/>
                <h2>Budget</h2>
                <Table aria-label="basic table">
                    <thead>
                        <tr>
                            {/* <th style={{ width: '10%' }}>goalid</th> */}
                            <th style={{width: '15%'}}>name</th>
                            <th style={{width: '15%'}}>amount</th>
                            <th>description</th>
                            <th>start_date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.budgets.map((budget, key) => (
                            <tr key={key}>
                                {/* <td>id is: {budget.budget_id}</td> */}
                                <td>{budget.category_name}</td>
                                <td>{budget.amount}</td>
                                 <td>{budget.budget_description}</td>
                                <td>{budget.start_date}</td>
                                <td>
                                
                               
                             
                            
                                <button className="delete-button" onClick={() => this.handleDeleteBudget(budget)}>Delete</button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth0(Budget);

