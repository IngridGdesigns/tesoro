import { useState } from 'react';
import PropTypes from 'prop-types';

const EditGoalForm = ({ goal, onSave }) => {
  const [updatedGoal, setUpdatedGoal] = useState(goal);


  const handleChange = (e) => {
    const { name, value } = e.target;
      setUpdatedGoal({ ...updatedGoal, [name]: value });
       console.log('Updated Goal:', updatedGoal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      onSave(updatedGoal);
       console.log('Submitted Goal:', updatedGoal);
  };


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Goal Name:
        <input type="text" name="goal_name" value={updatedGoal.goal_name} onChange={handleChange} />
      </label>
      <label>
        Goal Amount:
        <input type="number" name="goal_amount" value={updatedGoal.goal_amount} onChange={handleChange} />
      </label>
      <label>
        Target Date:
        <input type="date" name="target_date" value={updatedGoal.target_date} onChange={handleChange} />
      </label>
      <button type="submit">Save Changes</button>
    </form>
  );
};

EditGoalForm.propTypes = {
  goal: PropTypes.object.isRequired, // Assuming goal is an object
  onSave: PropTypes.func.isRequired,
};

export default EditGoalForm;