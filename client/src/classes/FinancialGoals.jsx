/* eslint-disable react/prop-types */
import { Component } from 'react';
import Table from '@mui/joy/Table';
import axios from 'axios';
// import { withAuth0 } from "@auth0/auth0-react";
import AddGoalForm from './forms/createGoal';
import { withAuth0 } from '@auth0/auth0-react';


class FinancialGoals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: [],
            user: null,
        };
    }

    componentDidMount() {
    
        this.handleGetGoals();

    }

    handleGetGoals = async () => {
        const { getAccessTokenSilently } = this.props.auth0
        // const accessToken = getAccessTokenSilently();
         // eslint-disable-next-line react/prop-types
        const { user } = this.props.auth0; // Use the custom hook

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessTokenSilently()}`
            }
        }
        
    try {
        const response = await axios.get(`/api/goals/${user}`, options);
        this.setState({ goals: response.data });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

    handleCreateGoal = async (newGoal) => {
     
        try {
            const response = await axios.post('/api/goals', newGoal, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        this.setState((prevState) => ({
            goals: [...prevState.goals, response.data],
        }));
            
        } catch (error) {
            console.error('Error creating goal', error);
            this.setState({
                error: error.message
            })
        }
}


    render() {
        // eslint-disable-next-line react/prop-types
        const { user, isLoading } = this.props.auth0; // Use the custom hook
        

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

