// eslint-disable-next-line no-unused-vars
import React, {useState} from "react"
import { Select, Option} from "@mui/joy"
import { useForm  } from "react-hook-form"


// eslint-disable-next-line react/prop-types
function CreatebudgetForm({ handleCreateBudget }) {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const onSubmit = data => {
        try {
             console.log(data, 'hre is th data')
         handleCreateBudget(data)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            reset()
        }
       
    };
  console.log(errors);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Select {...register("category")}>
        <Option type="number" value={1}>food</Option>
        <Option type="number" value={2}> transportation</Option>
        <Option type="number" value={3}> health</Option>
        <Option type="number" value={4}> income</Option>
        <Option type="number" value={5}> savings</Option>
        <Option type="number" value={6}> debt</Option>
        <Option type="number" value={7}>option</Option>
     </Select>
    <input type="text" placeholder="description" {...register("description", {required: true})} />
    <input type="number" placeholder="amount" {...register("amount", {required: true})} />
      <input type="datetime" placeholder="start_date" {...register("start_date", {required: true})} />

      <input type="submit" />
    </form>
  );
}


export default CreatebudgetForm;


//  <div>
//             <input type="text" placeholder="description" {...register("description", {required: true})} />
//             <input type="number" placeholder="budget amount" {...register("amount", { required: true, maxLength: 1000 })} />
//             <input type="datetime" placeholder="start_date" {...register("start_date", { required: true })} />
//           </div>


// import React from 'react';
// import { useForm } from 'react-hook-form';

// export default function App() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const onSubmit = data => console.log(data);
//   console.log(errors);
  
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input type="number" placeholder="goal_id" {...register("goal_id", {})} />
//       <input type="number" placeholder="user_id" {...register} />
//       <input type="text" placeholder="Goal" {...register("Goal", {required: true})} />
//       <select {...register("Goal Amount", { required: true })}>
//         <option value="category_id">category_id</option>
//       </select>
//       <input type="datetime-local" placeholder="Target date" {...register("Target date", {, pattern: /yyyy-mm-dd/i})} />

//       <input type="submit" />
//     </form>
//   );
// }