/* eslint-disable react/prop-types */
import { Component } from 'react';
import Table from '@mui/joy/Table';
import axios from 'axios';

import AddGoalForm from './forms/createGoal';
import { withAuth0 } from '@auth0/auth0-react';


class FinancialGoals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: [],
            user: '',
        };
    }

    componentDidMount() {
    
        this.handleGetGoals();

    }

    handleGetGoals = async () => {
        const { user, getAccessTokenSilently } = this.props.auth0
         // eslint-disable-next-line react/prop-types
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessTokenSilently()}`
            }
        }
        
        try {
            const response = await axios.get(`/api/goals/${user}`, options);
            this.setState({ goals: response.data }); 
        }
        catch (error) {
        console.error('Error fetching data:', error);
        }
}

    handleCreateGoal = async (newGoal) => {
    const { getAccessTokenSilently } = this.props.auth0;
   
        //had to destructure, there may be a bug, need more coffee <--- 5/14/24
    const { user_id, user_sub, goal_name, goal_amount, target_date } = newGoal;

    try {
        const response = await fetch('/api/goals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessTokenSilently()}`
            },
            body: JSON.stringify({ user_id, user_sub, goal_name, goal_amount, target_date })
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

