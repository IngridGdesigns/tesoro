/* eslint-disable react/prop-types */

import { useForm } from 'react-hook-form';


// eslint-disable-next-line react/prop-types
function AddGoalForm({ user, handleCreateGoal }) {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = data => {
    try {
      console.log(data, 'form submitted');
      
        handleCreateGoal(data);
    
    } catch {
      console.error(errors);
    }
    finally {
      reset()
    }
  }
  console.log(errors);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
          
      <input type="hidden" value={user.sub} {...register("user_sub")}/>
        <input type="text" placeholder="Add your goal" {...register("goal_name", {required: true})} />
        <input type="number" placeholder="Goal Amount" {...register("goal_amount", {required: true, maxLength: 9})} />
        <input type="datetime" placeholder="2024/5/15" {...register('target_date')} />

        <input type="submit" />
    </form>
  );
}

export default AddGoalForm;