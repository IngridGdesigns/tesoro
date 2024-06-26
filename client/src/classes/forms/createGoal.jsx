/* eslint-disable react/prop-types */

import { useForm } from 'react-hook-form';


// eslint-disable-next-line react/prop-types
function AddGoalForm({ handleCreateGoal }) {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = data => {
    try {
      console.log(data);
      
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
    <form onSubmit={handleSubmit(onSubmit)} >
          
      {/* <input type="hidden" value={userID.user_sub} {...register("user_sub")} />
       <input type="hidden" value={userID.user_id} {...register("user_id")}/> */}
      <input type="text" placeholder="Goal name" {...register("goal_name", {required: true})} />
      <input type="number" placeholder="Goal Target Amount" {...register("goal_amount", { required: true, maxLength: 1000 })} />
      <input type="number" placeholder="5.00" {...register("current_amount", {required: true})}/>
       <input type="datetime" placeholder="date" {...register("target_date", {required: true})} />

        <input type="submit" />
    </form>
  );
}

export default AddGoalForm;