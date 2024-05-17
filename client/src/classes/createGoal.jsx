

const handleCreateGoal = async (newGoal) => {
        const { getAccessTokenSilently, user } = this.props.auth0;
        const { userID } = await this.state; // Await getUser to get the user's ID

        try {
        
        console.log(userID.user_id, 'what do we have here?');
        const user_id = Number(userID.user_id);

        // const user_id = parseInt(userID.user_id);
        const { goal_name, goal_amount, current_amount, target_date } = newGoal;
        const user_sub = user.sub;
    //  const amount = parseFloat(goal_amount)
        const response = await fetch(`/api/goals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAccessTokenSilently()}`
            }, 
            body: JSON.stringify({ user_id, goal_name, target_date, current_amount: parseFloat(current_amount), goal_amount: parseFloat(goal_amount), user_sub}) 
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

export default handleCreateGoal;