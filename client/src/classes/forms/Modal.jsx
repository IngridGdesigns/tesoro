
import { useState } from 'react';
import Modal from 'react-modal';
import EditGoalForm from './editGoalForm'
import PropTypes from 'prop-types';

const EditGoalModal = ({ goal, isOpen, handleEditGoal, onRequestClose }) => {
  const [updatedGoal, setUpdatedGoal] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedGoal({ ...updatedGoal, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditGoal(updatedGoal);
    onRequestClose(); // Close the modal after submitting
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
          contentLabel="Edit Goal Modal"
            style={{
              overlay: {
                    backgroundColor: '#31BED1'
                },
            }}
      >

      <h2>Edit Goal</h2>
          <button onClick={onRequestClose}>Close Modal</button>
          <hr/>
          <EditGoalForm goal={goal} onChange={handleChange} onSubmit={handleSubmit} />
    </Modal>
  );
};


EditGoalModal.propTypes = {
  goal: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  handleEditGoal: PropTypes.func.isRequired
};

export default EditGoalModal;
