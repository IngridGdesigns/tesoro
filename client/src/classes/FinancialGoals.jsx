/* eslint-disable react/prop-types */
import { Component } from 'react';
import Table from '@mui/joy/Table';
import AddGoalForm from './forms/createGoal';
import { withAuth0} from '@auth0/auth0-react';



class FinancialGoals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: [],
            error: null,
            userID: ''

        };

        this.handleGetGoals = this.handleGetGoals.bind(this);
        // this.getUser = this.getUser.bind(this);
    }

    async componentDidMount () {
        await this.getUser();
        this.handleGetGoals();

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

         this.setState({ userID: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};
    
    
   handleGetGoals = async () => {
    const { user, getAccessTokenSilently } = this.props.auth0;
       const token = await getAccessTokenSilently();

       if (!user) {
           console.log('no user!');
       }

       fetch(`/api/goals/sub/${user.sub}`, {
           method: 'GET',
           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8'}
       })
           .then(response => response.json())
           .then(data => {
               console.log(data);
               this.setState({goals: data})
           })
        .catch(error => console.error(error))
   }
    

handleCreateGoal = async (newGoal) => {
    const { getAccessTokenSilently, user } = this.props.auth0;
    const { userID } = await this.state; // Await getUser to get the user's ID


    console.log(userID.user_id, 'will i find just user id isolated te type?????')
    const user_id = parseInt(userID.user_id);

    // const user_id = parseInt(userID.user_id);
    const { goal_name, goal_amount, target_date } = newGoal;
    const user_sub = user.sub;
    //  const amount = parseFloat(goal_amount)
    try {
        const response = await fetch(`/api/goals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessTokenSilently()}`
            },
            body: JSON.stringify({ goal_name, target_date, goal_amount: parseInt(goal_amount), user_id, user_sub}) 
        });

        if (!response.ok) {
            throw new Error('Failed to create goal');
        }

        const data = await response.json();

        this.setState((prevState) => ({
            goals: [...prevState.goals, data],
        }));
    } catch (error) {
        console.error('Error creating goal', error);
        this.setState({
            error: error.message
        });
    }
};

    
    handleEditGoal(goal) {
        console.log('awesome edting happening here');
        console.log('goal id', goal.goal_id)
        console.log('goal name', goal.goal_name)
    }


    handleDeleteGoal(goal) {
        const { getAccessTokenSilently } = this.props.auth0;
        // console.log('deleting goal', goal.goal_id);

        fetch(`/api/goals/${goal.goal_id}`, {
            method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessTokenSilently()}`
            },
        }).then(data => {
            console.log('Goal deleted:', data);
        // Find the index of the goal to be deleted
        const index = this.state.goals.findIndex(g => g.goal_id === goal.goal_id);
        if (index !== -1) {
            // Create a copy of the goals array and remove the goal at the found index
            const updatedGoals = [...this.state.goals];
            updatedGoals.splice(index, 1);
            // Update state with the new array of goals
            this.setState({ goals: updatedGoals });
        }
    }) // Manipulate the data retrieved back, if we want to do something with it
        .catch(err => console.error(err)) 
    }

    // end of crud

    render() {
        // eslint-disable-next-line react/prop-types
        const { user, isLoading } = this.props.auth0; // Use the custom hook

        if (!user) {
            return null;
        }
        

        if (isLoading) {
            return <div>Loading...</div>;
        }

        return (

            <div>
                {/* <img src={user.picture} alt={user.name} /> */}
                <h1>{user.name} Goals</h1>
                
                <div>
                    <h4>Create a goal</h4>
                    <AddGoalForm handleCreateGoal={this.handleCreateGoal}/>
                </div>
               
                <hr/>
                <h2>Existing Goals</h2>
                <Table aria-label="basic table">
                    <thead>
                        <tr>
                            {/* <th style={{ width: '10%' }}>goalid</th> */}
                            <th style={{width: '15%'}}>name</th>
                            <th>amount</th>
                            <th>target date</th>
                            <th>current amount</th>
                            <th>remaining amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.goals.map((goal, key) => (
                            <tr key={key}>
                                {/* <td>id is: {goal.goal_id}</td> */}
                                <td>{goal.goal_name}</td>
                                <td>{goal.goal_amount}</td>
                                <td>{goal.target_date}</td>
                                <td>{goal.current_amount }</td>
                                <td>{goal.remaining_amount}</td>
                                <td>
                                    <button onClick={() => this.handleEditGoal(goal)}>Edit</button>
                                
                                    <button onClick={() => this.handleDeleteGoal(goal)}>Delete</button>
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
export default withAuth0(FinancialGoals);

