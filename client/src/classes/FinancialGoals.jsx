import React, { Component } from 'react';
import Table from '@mui/joy/Table';
import { DateTime } from 'luxon';

// function formatDate(date) {
//     const newDate = DateTime.fromISO(date)
//     return newDate; //formatting date?
// }

class FinancialGoals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const response = await fetch(`/api/goals`);
            const newData = await response.json();
            this.setState({ goals: newData });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    render() {
        return (
            <div>
                <h1>Goals</h1>

                create a goal

                <h2>Existing Goals</h2>
                <Table aria-label="basic table">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>goalid</th>
                            <th>name</th>
                            <th>amount</th>
                            <th>target date</th>
                            <th>current amount</th>
                            <th>remaining amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.goals.map((goal, key) => (
                            <tr key={key}>
                                <td>id is: {goal.goal_id}</td>
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

export default FinancialGoals;

      {/* {this.state.goals.map((goal, key) => (
                    <tr key={key}>
                        <td>id is: {goal.goal_id}</td>
                        <td>goal amount is: {goal.goal_amount}</td>
                        name is: {goal.goal_name}
                   </tr>
                ))} */}


// import React, { useEffect, useState } from 'react';


// function FinancialGoals() {
//     const [message, setMessage] = useState('');

//       useEffect(() => {
//           const fetchData = async () => {
//               const response = await fetch(`/api/goals`);
//               const newData = await response.json();
//               setMessage(newData);
//           }
//           fetchData();
//         //   const s = [...message];
//           console.log(message);
//   }, []);

    
//     return (
//     Object.entries(message).map(([key, value], i) => {
//             return (
//                 <div key={key}>
                    
//                     <div>id is: {value.goal_id}</div>
//                     goal amount is: {value.goal_amount}
//                     name is: {value.goal_name}
//                 </div>
//             )
//         })
//     );
// }

// export default FinancialGoals;

// import React, {Component} from 'react';

// class FinancialGoals extends Component {
    

//     componentDidMount() {
//         this.handleGetGoals();
//     }

//     handleGetGoals() {
//         axios.get('/api/goals', {
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         }).then(response => {
//             this.setState({
//                 goals: response.data,
//                 loading: false,
//                 error: null
//             });
//         }).catch(error => {
//             this.setState({
//                 goals: [],
//                 loading: false,
//                 error: 'Error fetching financial goals'
//             })
//         })
//     }





//     render() {
//         const { goals, loading, error } = this.state;
        
//         if (loading) {
//             return <div>Loading...</div>
//         }

//         if (error) {
//             return <div>Error: {error}</div>
//         }
//         return (
//             <div>
//                 <h1>Financial Goals</h1>

//             </div>
//         )
        
//     }
// }

// export default FinancialGoals;