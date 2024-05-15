/* eslint-disable react/prop-types */
import { Component } from 'react';
import Table from '@mui/joy/Table';
import AddGoalForm from './forms/createGoal';
import { withAuth0} from '@auth0/auth0-react';
// import axios from 'axios';


class FinancialGoals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: [],
            error: null,

        };

        this.handleGetGoals = this.handleGetGoals.bind(this);
    }

    componentDidMount () {
    
        this.handleGetGoals();

    }

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
    const { getAccessTokenSilently } = this.props.auth0;
   
        //had to destructure, there may be a bug, need more coffee <--- 5/14/24
    const { user_sub, goal_name, goal_amount, target_date } = newGoal;

    try {
        const response = await fetch('/api/goals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessTokenSilently()}`
            },
            body: JSON.stringify({ user_sub, goal_name, goal_amount, target_date })
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
    }
    
    // handleEditGoal()

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
                    <AddGoalForm user={user} handleCreateGoal={this.handleCreateGoal}/>
                </div>
               

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

