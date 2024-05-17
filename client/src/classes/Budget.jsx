/* eslint-disable react/prop-types */
import { Component } from 'react';
// import Table from '@mui/joy/Table';
// import CreatebudgetForm from './forms/createbudgetForm';
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
        // this.handleEditBudget = this.handleEditBudget.bind(this)
        // this.handleDeleteBudget = this.handleDeleteBudget.bind(this)
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
    

//     handleCreateBudget= async (newBudget) => {
//         const { getAccessTokenSilently, user } = await this.props.auth0;
//         const { userID } = this.state; // getUser to get the user's ID

//         const user_sub = user.sub;
//         const user_id = userID.user_id;
     
//         const { goal_name, goal_amount, target_date, current_amount } = newGoal;
        
//     //  const amount = parseFloat(goal_amount)
//     try {
//         const response = await fetch(`/api/goals/create`, { // check change may 17 12pm
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${getAccessTokenSilently()}`
//             },
//             body: JSON.stringify({ current_amount, goal_name, target_date, goal_amount: parseInt(goal_amount), user_id, user_sub}) 
//         });

//         if (!response.ok) {
//             throw new Error('Failed to create goal');
//         }

//         const data = await response.json();

//         this.setState((prevState) => ({
//             goals: [...prevState.goals, data],
//         }));
//     } catch (error) {
//         console.error('Error creating goal', error);
//         this.setState({
//             error: error.message
//         });
//     }
// };
    
//     handleEditGoal(updatedGoal) {
//         console.log('awesome edting happening here');
//         console.log('goal id', updatedGoal.goal_id)
//         console.log('goal name', updatedGoal.goal_name)

//     const { getAccessTokenSilently } = this.props.auth0;

//     fetch(`/api/edit/goals/${updatedGoal.goal_id}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${getAccessTokenSilently()}`
//         },
//         body: JSON.stringify(updatedGoal) // Send the updated goal as JSON in the request body
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to update goal');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Goal updated:', data);
//         // Find the index of the updated goal in the goals array
//         const index = this.state.goals.findIndex(g => g.goal_id === updatedGoal.goal_id);
//         if (index !== -1) {
//             // Create a copy of the goals array and replace the old goal with the updated one
//             const updatedGoals = [...this.state.goals];
//             updatedGoals[index] = updatedGoal;
//             // Update state with the new array of goals
//             this.setState({ goals: updatedGoals, isModalOpen: false });
//         }
//     })
//     .catch(error => {
//         console.error('Error updating goal:', error);
//     });
// }


//     handleDeleteGoal(goal) {
//         const { getAccessTokenSilently } = this.props.auth0;
//         // console.log('deleting goal', goal.goal_id);

//         fetch(`/api/goals/delete/${goal.goal_id}`, {
//             method: 'DELETE',
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${getAccessTokenSilently()}`
//             },
//         }).then(data => {
//             console.log('Goal deleted:', data);
//         // Find the index of the goal to be deleted
//         const index = this.state.goals.findIndex(g => g.goal_id === goal.goal_id);
//         if (index !== -1) {
//             // Create a copy of the goals array and remove the goal at the found index
//             const updatedGoals = [...this.state.goals];
//             updatedGoals.splice(index, 1);
//             // Update state with the new array of goals
//             this.setState({ goals: updatedGoals });
//         }
    
//     }) // Manipulate the data retrieved back, if we want to do something with it
//         .catch(err => console.error(err)) 
//     }

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
                <h1>budget stuff</h1>
           </div>
        
        );
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withAuth0(Budget);

